import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css';

/** For typed WebSocket messages. */
interface ChatMessageData {
  type: 'message';
  text: string;
  messageType: 'user' | 'host' | 'system';
  user: string;
}

/** The main "WebinarView" container with video on left + chat on right. */
const WebinarView: React.FC = () => {
  return (
    <div className={styles.webinarContainer}>
      <VideoSection />
      <WebinarChatBox />
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////
// 1) VIDEO SECTION with clock widget, replay overlay, audio at 3s
////////////////////////////////////////////////////////////////////////////////
const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Personalized audio
  const soundOverlayRef = useRef<HTMLDivElement | null>(null);
  const replayOverlayRef = useRef<HTMLDivElement | null>(null);

  // Clock widget
  const clockWidgetRef = useRef<HTMLDivElement | null>(null);
  const clockTimeRef = useRef<HTMLDivElement | null>(null);
  const clockDateRef = useRef<HTMLDivElement | null>(null);

  const [hasInteracted, setHasInteracted] = useState(false); // if user clicked to unmute
  const [clockTriggered, setClockTriggered] = useState(false); // if we've shown the clock
  const hasPlayedAudioRef = useRef(false); // so we only start personalized audio once

  // intervals/timeouts
  const movementIntervalRef = useRef<number | null>(null);
  const clockIntervalRef = useRef<number | null>(null);

  // 1) On mount => attempt to load + play video + fetch personalized audio
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Start at 0, try autoplay
    vid.currentTime = 0;
    vid.play().catch(err => {
      console.log("Auto-play prevented:", err);
    });

    // Suppose we fetch from your backend for the personalized audio link
    // (If you already have it from context, remove this.)
    fetch('https://example.com/get_audio?user_email=someone@domain.com')
      .then(res => res.json())
      .then(data => {
        if (data && data.audio_link && audioRef.current) {
          audioRef.current.src = data.audio_link;
        }
      })
      .catch(err => console.log("Error fetching personalized audio:", err));
  }, []);

  // 2) Update the clock text
  function updateClock() {
    if (!clockTimeRef.current || !clockDateRef.current) return;
    const now = new Date();
    clockTimeRef.current.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    clockDateRef.current.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  // 3) Subtle movement of clock
  function addNaturalMovement() {
    let baseX = 0;
    let baseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastTime = Date.now();

    const moveInterval = window.setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const accX = (Math.random() - 0.5) * 1.5;
      const accY = (Math.random() - 0.5) * 1.5;
      velocityX = velocityX * 0.95 + accX * deltaTime;
      velocityY = velocityY * 0.95 + accY * deltaTime;
      baseX += velocityX;
      baseY += velocityY;

      const wobbleX = Math.sin(currentTime * 0.002) * 0.3;
      const wobbleY = Math.cos(currentTime * 0.002) * 0.3;

      if (clockWidgetRef.current) {
        clockWidgetRef.current.style.transform =
          `translate(${baseX + wobbleX}px, ${baseY + wobbleY}px)`;
      }
    }, 16);

    return moveInterval;
  }

  // 4) Listen to video time => show clock at 10s, start audio at 3s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleTimeUpdate() {
      // a) At 3s => start personalized audio if not started
      if (vid.currentTime >= 3 && !hasPlayedAudioRef.current) {
        hasPlayedAudioRef.current = true;
        if (audioRef.current) {
          audioRef.current.play().catch(err => console.log("Audio play blocked:", err));
        }
      }

      // b) At 10s => clock widget
      if (vid.currentTime >= 10 && !clockTriggered) {
        setClockTriggered(true);

        // Show + animateIn
        if (clockWidgetRef.current) {
          clockWidgetRef.current.style.display = "block";
          clockWidgetRef.current.classList.add(styles.animateIn);
        }
        // Start clock
        clockIntervalRef.current = window.setInterval(updateClock, 1000);
        updateClock();

        // After 1.3s => add movement
        window.setTimeout(() => {
          const moveInt = addNaturalMovement();
          movementIntervalRef.current = moveInt;

          // Keep clock for 10s
          window.setTimeout(() => {
            if (movementIntervalRef.current) {
              window.clearInterval(movementIntervalRef.current);
            }
            if (clockWidgetRef.current) {
              clockWidgetRef.current.classList.remove(styles.animateIn);
              clockWidgetRef.current.classList.add(styles.animateOut);

              // after 1s => hide + clear clock updates
              window.setTimeout(() => {
                if (clockIntervalRef.current) {
                  window.clearInterval(clockIntervalRef.current);
                }
                if (clockWidgetRef.current) {
                  clockWidgetRef.current.style.display = "none";
                }
              }, 1000);
            }
          }, 10000);
        }, 1300);
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      // Clear intervals if unmount
      if (clockIntervalRef.current) window.clearInterval(clockIntervalRef.current);
      if (movementIntervalRef.current) window.clearInterval(movementIntervalRef.current);
    };
  }, [clockTriggered]);

  // 5) Sound overlay => unmute + try again
  function handleSoundClick() {
    if (!hasInteracted) {
      const vid = videoRef.current;
      if (vid) {
        vid.muted = false;
        vid.play().catch(err => console.log("Play error:", err));
      }
      if (soundOverlayRef.current) {
        soundOverlayRef.current.style.display = "none";
      }
      setHasInteracted(true);
    }
  }

  // 6) Video ended => show replay overlay
  function handleVideoEnded() {
    if (replayOverlayRef.current) {
      replayOverlayRef.current.style.display = "flex";
    }
  }

  // 7) "Replay" => reset video + clock
  function handleReplay() {
    if (replayOverlayRef.current) {
      replayOverlayRef.current.style.display = "none";
    }
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    setClockTriggered(false);
    if (clockWidgetRef.current) {
      clockWidgetRef.current.classList.remove(styles.animateOut);
      clockWidgetRef.current.style.display = "none";
    }
    vid.play().catch(err => console.log("Replay error:", err));
    hasPlayedAudioRef.current = false; // so it can replay the audio at 3s
  }

  // 8) "Invest" from replay overlay => open in new tab
  function handleReplayInvest() {
    window.open("https://yes.prognostic.ai", "_blank");
  }

  return (
    <div className={styles.videoSection}>
      {/* Banner with LIVE label */}
      <div className={styles.banner}>
        <div className={styles.liveIndicator}>
          <div className={styles.liveDot}></div>
          LIVE
        </div>
        PrognosticAI Advanced Training
      </div>

      <div className={styles.videoWrapper}>
        {/* The main webinar video */}
        <video
          muted
          playsInline
          ref={videoRef}
          onEnded={handleVideoEnded}
        >
          <source
            src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
            type="video/mp4"
          />
        </video>

        {/* Personalized audio element */}
        <audio ref={audioRef} style={{ display: 'none' }} />

        {/* Clock widget */}
        <div className={styles.clockWidget} ref={clockWidgetRef}>
          <div className={styles.widgetHeader}>
            <div className={styles.windowControls}>
              <div className={`${styles.windowButton} ${styles.closeButton}`}></div>
              <div className={`${styles.windowButton} ${styles.minimizeButton}`}></div>
              <div className={`${styles.windowButton} ${styles.maximizeButton}`}></div>
            </div>
            <div className={styles.widgetTitle}>Clock Widget</div>
          </div>
          <div className={styles.widgetContent}>
            <div className={styles.clockTime} ref={clockTimeRef}></div>
            <div className={styles.clockDate} ref={clockDateRef}></div>
          </div>
        </div>

        {/* Sound overlay => click to enable sound */}
        <div
          className={styles.soundOverlay}
          ref={soundOverlayRef}
          onClick={handleSoundClick}
        >
          <div className={styles.soundIcon}>🔊</div>
          <div className={styles.soundText}>Click to Enable Sound</div>
        </div>

        {/* Replay overlay if ended */}
        <div className={styles.replayOverlay} ref={replayOverlayRef}>
          <h2 className={styles.replayTitle}>Webinar Ended</h2>
          <button className={styles.replayButton} onClick={handleReplay}>
            Watch Instant Replay
          </button>
          <button className={styles.investButtonOld} onClick={handleReplayInvest}>
            Invest $999 Now
          </button>
        </div>
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////
// 2) CHAT SECTION: WebSocket, AI host, invests, special offer, auto messages
////////////////////////////////////////////////////////////////////////////////
const WebinarChatBox: React.FC = () => {
  // Refs
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const specialOfferRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const investButtonRef = useRef<HTMLButtonElement | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  let isUserScrolling = false;

  // Example name arrays
  const names = [
    "Emma","Liam","Olivia","Noah","Ava","Ethan","Sophia","Mason",
    "Isabella","William","Mia","James","Charlotte","Benjamin","Amelia",
    "Lucas","Harper","Henry","Evelyn","Alexander"
  ];
  const attendeeMessages = [
    "hows everyone doing today??",
    "Hi from Seattle! super excited 2 be here",
    "first time in one of these... hope im not late!",
    "cant wait to learn more bout this AI stuff 🤓",
    "hello everyone....joining from australia",
    "Any1 else here run advanced funnels for clients??",
    "This looks amazing, can't wait to see more advanced strategies!",
    "im big in affiliate marketing, and this is wild!"
  ];
  const investmentMessages = [
    "just invested in PrognosticAI! 🚀",
    "secured their spot in PrognosticAI! ✨",
    "joined the PrognosticAI family! 🎉",
    "made a smart investment! 💡",
    "is starting their AI journey with us! 🌟",
    "got early access to PrognosticAI! 🔥",
    "upgraded to PrognosticAI Pro! 💪",
    "joined our success story! ⭐"
  ];

  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;
    const specialOfferEl = specialOfferRef.current;
    const countdownEl = countdownRef.current;
    const investBtn = investButtonRef.current;

    // If any missing => bail
    if (!chatEl || !inputEl || !typingEl || !toggleEl || !specialOfferEl || !countdownEl || !investBtn) {
      console.error("WebinarChatBox: missing refs");
      return;
    }

    // 1) Scroll helpers
    function isNearBottom(elem: HTMLDivElement) {
      const threshold = 50;
      return (elem.scrollHeight - elem.clientHeight - elem.scrollTop) <= threshold;
    }
    function scrollToBottom(elem: HTMLDivElement) {
      elem.scrollTop = elem.scrollHeight;
    }
    function handleScroll() {
      isUserScrolling = !isNearBottom(chatEl);
    }
    chatEl.addEventListener('scroll', handleScroll);

    // 2) addMessage utility
    function addMessage(
      text: string,
      type: 'user' | 'host' | 'system',
      userName = '',
      isAutoGenerated = true
    ) {
      const msgDiv = document.createElement('div');
      msgDiv.classList.add(styles.message);
      if (type === 'user') msgDiv.classList.add('user');
      if (type === 'host') msgDiv.classList.add('host');
      if (type === 'system') msgDiv.classList.add('system');

      msgDiv.textContent = userName ? `${userName}: ${text}` : text;

      // If real host msg => show "typing..."
      if (type === 'host' && !isAutoGenerated) {
        typingEl.textContent = 'Selina is typing...';
        setTimeout(() => {
          typingEl.textContent = '';
        }, 2000);
      }

      // If from other user => hide if toggle is off
      if (type === 'user' && userName !== 'You') {
        msgDiv.setAttribute('data-participant', 'true');
        msgDiv.setAttribute('data-auto-generated', 'true');
        msgDiv.style.display = toggleEl.checked ? 'block' : 'none';
      }

      chatEl.appendChild(msgDiv);

      if (!isUserScrolling || userName === 'You') {
        scrollToBottom(chatEl);
      }
    }

    // 3) toggle "Show Others"
    function handleToggleChange() {
      const participantMessages = chatEl.querySelectorAll('[data-participant="true"]');
      participantMessages.forEach(msg => {
        (msg as HTMLElement).style.display = toggleEl.checked ? 'block' : 'none';
      });
      if (toggleEl.checked && !isUserScrolling) {
        scrollToBottom(chatEl);
      }
    }
    toggleEl.addEventListener('change', handleToggleChange);

    // 4) Connect WebSocket
    const ws = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to chat server");
      scrollToBottom(chatEl);
    };
    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as ChatMessageData;
        if (data.type === 'message') {
          addMessage(data.text, data.messageType, data.user, true);
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // 5) AI Host response
    async function handleHostResponse(userMsg: string) {
      try {
        // short random delay
        await new Promise(res => setTimeout(res, Math.random() * 2000));
        typingEl.textContent = "Selina is typing...";

        const res = await fetch("https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg, type: "user" })
        });
        if (!res.ok) throw new Error("AI host API call failed");

        const data = await res.json();
        typingEl.textContent = "";
        if (data.response) {
          addMessage(data.response, 'host', "Selina (Host)", false);
        }
      } catch (e) {
        console.error("Host response error:", e);
        typingEl.textContent = "";
        addMessage("Apologies, I'm having trouble connecting. Please try again!", 'host', 'Selina (Host)', false);
      }
    }

    // 6) random invests
    function showInvestmentNotification() {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const line = investmentMessages[Math.floor(Math.random() * investmentMessages.length)];
      const notif = document.createElement('div');
      notif.classList.add(styles.notification);
      notif.innerHTML = `
        <div class="${styles.notificationIcon}">🎉</div>
        <div><strong>${randomName}</strong> ${line}</div>
      `;
      document.body.appendChild(notif);
      setTimeout(() => {
        notif.remove();
      }, 5000);
    }
    const investsInterval = window.setInterval(() => {
      showInvestmentNotification();
    }, Math.random() * 30000 + 30000);

    // 7) special offer at 60s
    const offerTimeout = window.setTimeout(() => {
      specialOfferEl.style.display = "block";
      addMessage("🚨 Special Offer Alert! For the next 10 minutes only, secure your spot in PrognosticAI for just $999. Don't miss out! 🚀", 'system');

      let t = 600;
      const countdownInt = window.setInterval(() => {
        t--;
        const min = Math.floor(t / 60);
        const sec = t % 60;
        countdownEl.textContent = `Special Offer Ends In: ${min}:${sec.toString().padStart(2,"0")}`;
        if (t <= 0) {
          window.clearInterval(countdownInt);
          specialOfferEl.style.display = "none";
          addMessage("⌛ The special offer has ended.", 'system');
        }
      }, 1000);
    }, 60000);

    // 8) invest => open new tab
    investBtn.addEventListener('click', () => {
      window.open("https://yes.prognostic.ai", "_blank");
    });

    // 9) auto-generated attendee messages
    function scheduleAttendeeMessages() {
      const num = Math.floor(Math.random() * 6) + 15;
      let delay = 500;
      for (let i = 0; i < num; i++) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const msg = attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        window.setTimeout(() => {
          addMessage(msg, 'user', randomName, true);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }
    // After 4s => greet + schedule
    const greetTimeout = window.setTimeout(() => {
      addMessage("Welcome to PrognosticAI Live!", 'host', 'Selina (Host)', true);
      scheduleAttendeeMessages();
      scrollToBottom(chatEl);
    }, 4000);

    // 10) real user => triggers AI
    function handleKeypress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(userMsg, 'user', 'You', false);
        handleHostResponse(userMsg);
      }
    }
    inputEl.addEventListener('keypress', handleKeypress);

    // Cleanup
    return () => {
      chatEl.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggleChange);
      inputEl.removeEventListener('keypress', handleKeypress);

      window.clearInterval(investsInterval);
      window.clearTimeout(offerTimeout);
      window.clearTimeout(greetTimeout);

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.chatSection}>
      <div className={styles.chatHeader}>
        <div className={styles.headerTop}>
          <span className={styles.chatTitle}>Live Chat</span>
          <div className={styles.toggleContainer}>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                ref={participantToggleRef}
                defaultChecked={true} /* So "Show Others" is on by default */
              />
              <span className={styles.toggleSlider}></span>
            </label>
            <span className={styles.toggleLabel}>Show Others</span>
          </div>
          <span className={styles.viewerCount}>
            <i>👥</i>
            <span id="viewerCount">41 watching</span>
          </span>
        </div>
      </div>

      <div className={styles.specialOffer} ref={specialOfferRef}>
        <div className={styles.countdown} ref={countdownRef}>
          Special Offer Ends In: 10:00
        </div>
        <button
          className={styles.investButton}
          ref={investButtonRef}
        >
          Invest $999 Now - Limited Time Offer
        </button>
      </div>

      <div className={styles.chatMessages} ref={chatMessagesRef}></div>

      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Type your message here..."
          ref={messageInputRef}
        />
        <div
          className={styles.typingIndicator}
          ref={typingIndicatorRef}
        ></div>
      </div>
    </div>
  );
};

export default WebinarView;

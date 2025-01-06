import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css';

/** WebSocket chat message shape */
interface ChatMessageData {
  type: 'message';
  text: string;
  messageType: 'user' | 'host' | 'system';
  user: string;
}

/** 
 * The "WebinarView" container:
 *  1) VideoSection (left) 
 *  2) WebinarChatBox (right)
 */
const WebinarView: React.FC = () => {
  return (
    <div className={styles.webinarContainer}>
      <VideoSection />
      <WebinarChatBox />
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////
// 1) VIDEO SECTION: big video + clock widget + replay overlay + 3s audio
////////////////////////////////////////////////////////////////////////////////
const VideoSection: React.FC = () => {
  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // personalized audio
  const soundOverlayRef = useRef<HTMLDivElement | null>(null);
  const replayOverlayRef = useRef<HTMLDivElement | null>(null);

  // Clock widget
  const clockWidgetRef = useRef<HTMLDivElement | null>(null);
  const clockTimeRef = useRef<HTMLDivElement | null>(null);
  const clockDateRef = useRef<HTMLDivElement | null>(null);

  // States
  const [hasInteracted, setHasInteracted] = useState(false); 
  const [clockTriggered, setClockTriggered] = useState(false);
  const audioPlayedRef = useRef(false); // so we only start audio once

  // Intervals/timeouts
  const movementIntervalRef = useRef<number | null>(null);
  const clockIntervalRef = useRef<number | null>(null);

  /** On mount => attempt video autoplay + optional fetch for personalized audio */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return; // if null => TS won't complain further

    vid.currentTime = 0;
    vid.play().catch(err => {
      console.log("Video auto-play blocked:", err);
    });

    // e.g. fetch('https://your-backend.com/get_audio?user=someone')
    //   .then(r => r.json())
    //   .then(d => { if (audioRef.current) audioRef.current.src = d.audio_link; })
    //   .catch(e => console.error(e));
  }, []);

  /** Updates the clock widget text */
  function updateClock() {
    const timeEl = clockTimeRef.current;
    const dateEl = clockDateRef.current;
    if (!timeEl || !dateEl) return;

    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    dateEl.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  /** Subtle "natural" movement for clock widget */
  function addNaturalMovement(): number {
    let baseX = 0, baseY = 0;
    let velocityX = 0, velocityY = 0;
    let lastTime = Date.now();

    const moveInt = window.setInterval(() => {
      const currentTime = Date.now();
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const accX = (Math.random() - 0.5) * 1.5;
      const accY = (Math.random() - 0.5) * 1.5;
      velocityX = velocityX * 0.95 + accX * dt;
      velocityY = velocityY * 0.95 + accY * dt;

      baseX += velocityX;
      baseY += velocityY;

      const wobbleX = Math.sin(currentTime * 0.002) * 0.3;
      const wobbleY = Math.cos(currentTime * 0.002) * 0.3;

      const cw = clockWidgetRef.current;
      if (cw) {
        cw.style.transform = `translate(${baseX + wobbleX}px, ${baseY + wobbleY}px)`;
      }
    }, 16);

    return moveInt;
  }

  /** Listen for video time => 3s => audio, 10s => clock */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleTimeUpdate() {
      // 3s => start audio once
      if (vid.currentTime >= 3 && !audioPlayedRef.current) {
        audioPlayedRef.current = true;
        const aud = audioRef.current;
        if (aud) {
          aud.play().catch(err => console.log("Audio play error:", err));
        }
      }

      // 10s => clock widget
      if (vid.currentTime >= 10 && !clockTriggered) {
        setClockTriggered(true);

        const cw = clockWidgetRef.current;
        if (cw) {
          cw.style.display = "block";
          cw.classList.add(styles.animateIn);
        }

        clockIntervalRef.current = window.setInterval(updateClock, 1000);
        updateClock();

        // after animateIn => add movement
        window.setTimeout(() => {
          const moveInt = addNaturalMovement();
          movementIntervalRef.current = moveInt;

          // keep clock for 10s
          window.setTimeout(() => {
            if (movementIntervalRef.current) {
              window.clearInterval(movementIntervalRef.current);
            }
            if (cw) {
              cw.classList.remove(styles.animateIn);
              cw.classList.add(styles.animateOut);
              // after animateOut => hide + clear clock
              window.setTimeout(() => {
                if (clockIntervalRef.current) {
                  window.clearInterval(clockIntervalRef.current);
                }
                if (cw) {
                  cw.style.display = "none";
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
      if (clockIntervalRef.current) window.clearInterval(clockIntervalRef.current);
      if (movementIntervalRef.current) window.clearInterval(movementIntervalRef.current);
    };
  }, [clockTriggered]);

  /** Click sound overlay => unmute + attempt play again */
  function handleSoundClick() {
    if (!hasInteracted) {
      const vid = videoRef.current;
      if (vid) {
        vid.muted = false;
        vid.play().catch(err => console.log("Play error:", err));
      }
      const so = soundOverlayRef.current;
      if (so) {
        so.style.display = "none";
      }
      setHasInteracted(true);
    }
  }

  /** If video ends => show replay overlay */
  function handleVideoEnded() {
    const ro = replayOverlayRef.current;
    if (ro) {
      ro.style.display = "flex";
    }
  }

  /** Replay => reset everything */
  function handleReplay() {
    const ro = replayOverlayRef.current;
    if (ro) ro.style.display = "none";

    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.play().catch(err => console.log("Replay error:", err));
    setClockTriggered(false);
    audioPlayedRef.current = false; // so it can replay at 3s

    const cw = clockWidgetRef.current;
    if (cw) {
      cw.classList.remove(styles.animateOut);
      cw.style.display = "none";
    }
  }

  /** "Invest" from replay => open new tab */
  function handleReplayInvest() {
    window.open("https://yes.prognostic.ai", "_blank");
  }

  return (
    <div className={styles.videoSection}>
      <div className={styles.banner}>
        <div className={styles.liveIndicator}>
          <div className={styles.liveDot}></div>
          LIVE
        </div>
        PrognosticAI Advanced Training
      </div>

      <div className={styles.videoWrapper}>
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

        {/* Personalized audio element, hidden */}
        <audio ref={audioRef} style={{ display: 'none' }} />

        {/* Clock widget */}
        <div className={styles.clockWidget} ref={clockWidgetRef}>
          <div className={styles.widgetHeader}>
            <div className={styles.windowControls}>
              <div className={`${styles.windowButton} ${styles.closeButton}`} />
              <div className={`${styles.windowButton} ${styles.minimizeButton}`} />
              <div className={`${styles.windowButton} ${styles.maximizeButton}`} />
            </div>
            <div className={styles.widgetTitle}>Clock Widget</div>
          </div>
          <div className={styles.widgetContent}>
            <div className={styles.clockTime} ref={clockTimeRef} />
            <div className={styles.clockDate} ref={clockDateRef} />
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

        {/* Replay overlay => shows if ended */}
        <div
          className={styles.replayOverlay}
          ref={replayOverlayRef}
        >
          <h2 className={styles.replayTitle}>Webinar Ended</h2>
          <button
            className={styles.replayButton}
            onClick={handleReplay}
          >
            Watch Instant Replay
          </button>
          <button
            className={styles.investButtonOld}
            onClick={handleReplayInvest}
          >
            Invest $999 Now
          </button>
        </div>
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////
// 2) WEBINAR CHAT BOX: WS, invests, special offer, random messages, AI host
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

  // For "Show Others" scroll logic
  let isUserScrolling = false;

  // Example data arrays
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
    // Grab all refs at once
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;
    const specialOfferEl = specialOfferRef.current;
    const countdownEl = countdownRef.current;
    const investBtn = investButtonRef.current;

    // If any missing => return
    if (!chatEl || !inputEl || !typingEl || !toggleEl || !specialOfferEl || !countdownEl || !investBtn) {
      console.error("WebinarChatBox: missing required refs");
      return;
    }

    ///////////////////////
    // SCROLL HELPERS
    ///////////////////////
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

    ///////////////////////
    // addMessage
    ///////////////////////
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

      if (type === 'host' && !isAutoGenerated) {
        typingEl.textContent = 'Selina is typing...';
        window.setTimeout(() => {
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

    ///////////////////////
    // Toggle "Show Others"
    ///////////////////////
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

    ///////////////////////
    // WebSocket
    ///////////////////////
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
        console.error("WS parse error:", err);
      }
    };
    ws.onerror = (error) => {
      console.error("WS error:", error);
    };

    ///////////////////////
    // AI Host logic
    ///////////////////////
    async function handleHostResponse(userMsg: string) {
      try {
        await new Promise(res => setTimeout(res, Math.random() * 2000));
        typingEl.textContent = "Selina is typing...";

        const r = await fetch("https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg, type: "user" })
        });
        if (!r.ok) throw new Error("AI host call failed");

        const d = await r.json();
        typingEl.textContent = "";
        if (d.response) {
          addMessage(d.response, 'host', "Selina (Host)", false);
        }
      } catch (e) {
        console.error("HostResponse error:", e);
        typingEl.textContent = "";
        addMessage("Apologies, I'm having trouble connecting. Please try again!", 'host', 'Selina (Host)', false);
      }
    }

    ///////////////////////
    // invests notifications
    ///////////////////////
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
      window.setTimeout(() => {
        notif.remove();
      }, 5000);
    }
    const investsInterval = window.setInterval(() => {
      showInvestmentNotification();
    }, Math.random() * 30000 + 30000);

    ///////////////////////
    // special offer at 60s
    ///////////////////////
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

    ///////////////////////
    // invest => open new tab
    ///////////////////////
    investBtn.addEventListener('click', () => {
      window.open("https://yes.prognostic.ai", "_blank");
    });

    ///////////////////////
    // random user messages
    ///////////////////////
    function scheduleAttendeeMessages() {
      const num = Math.floor(Math.random() * 6) + 15;
      let delay = 500;
      for (let i = 0; i < num; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const msg = attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        window.setTimeout(() => {
          addMessage(msg, 'user', name, true);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }
    const greetTimeout = window.setTimeout(() => {
      addMessage("Welcome to PrognosticAI Live!", 'host', 'Selina (Host)', true);
      scheduleAttendeeMessages();
      scrollToBottom(chatEl);
    }, 4000);

    ///////////////////////
    // Real user => triggers AI
    ///////////////////////
    function handleKeypress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(userMsg, 'user', 'You', false);
        handleHostResponse(userMsg);
      }
    }
    inputEl.addEventListener('keypress', handleKeypress);

    ///////////////////////
    // Cleanup
    ///////////////////////
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
                defaultChecked
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
        <div className={styles.typingIndicator} ref={typingIndicatorRef}></div>
      </div>
    </div>
  );
};

export default WebinarView;

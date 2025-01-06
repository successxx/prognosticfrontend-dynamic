import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css';

/**
 * The entire "Webinar" page:
 * 1) A big video snippet with clock widget + replay overlay
 * 2) A side-by-side chat on the right
 * 3) Proper type safety throughout
 */

const WebinarView: React.FC = () => {
  return (
    <div className={styles.webinarContainer} style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 400px)',
      gap: '20px',
      width: '98%',
      maxWidth: '1800px',
      margin: '1rem auto'
    }}>
      <VideoSection />
      <WebinarChatBox />
    </div>
  );
};

const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundOverlayRef = useRef<HTMLDivElement>(null);
  const replayOverlayRef = useRef<HTMLDivElement>(null);
  const clockWidgetRef = useRef<HTMLDivElement>(null);
  const clockTimeRef = useRef<HTMLDivElement>(null);
  const clockDateRef = useRef<HTMLDivElement>(null);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [clockTriggered, setClockTriggered] = useState(false);

  const movementIntervalRef = useRef<number>();
  const clockIntervalRef = useRef<number>();

  // Try to start video on mount
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Set initial time and play
    vid.currentTime = 0;
    vid.play().catch(err => console.log("Auto-play prevented:", err));

    // Load and play audio at 3s
    const audioEl = new Audio();
    audioEl.src = "https://drive.google.com/uc?export=download&id=1T4omuEQuX1I4iWIspW6fXWgm0aTnztky";
    
    const timeCheck = setInterval(() => {
      if (vid.currentTime >= 3) {
        audioEl.play().catch(err => console.log("Audio play error:", err));
        clearInterval(timeCheck);
      }
    }, 100);

    return () => {
      clearInterval(timeCheck);
      audioEl.pause();
    };
  }, []);

  // Update the clock every second
  const updateClock = () => {
    const timeEl = clockTimeRef.current;
    const dateEl = clockDateRef.current;
    if (!timeEl || !dateEl) return;

    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    dateEl.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Subtle "natural" movement for the clock
  const addNaturalMovement = () => {
    let baseX = 0;
    let baseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastTime = Date.now();

    const moveInterval = window.setInterval(() => {
      const clockWidget = clockWidgetRef.current;
      if (!clockWidget) return;

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

      clockWidget.style.transform = `translate(${baseX + wobbleX}px, ${baseY + wobbleY}px)`;
    }, 16);

    return moveInterval;
  };

  // Trigger clock widget at 10s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleTimeUpdate = () => {
      const clockWidget = clockWidgetRef.current;
      if (!clockWidget || clockTriggered) return;

      if (vid.currentTime >= 10) {
        setClockTriggered(true);
        clockWidget.style.display = "block";
        clockWidget.classList.add(styles.animateIn);

        clockIntervalRef.current = window.setInterval(updateClock, 1000);
        updateClock();

        setTimeout(() => {
          const moveInt = addNaturalMovement();
          movementIntervalRef.current = moveInt;

          setTimeout(() => {
            if (movementIntervalRef.current) {
              clearInterval(movementIntervalRef.current);
            }
            
            if (clockWidget) {
              clockWidget.classList.remove(styles.animateIn);
              clockWidget.classList.add(styles.animateOut);

              setTimeout(() => {
                if (clockIntervalRef.current) {
                  clearInterval(clockIntervalRef.current);
                }
                clockWidget.style.display = "none";
              }, 1000);
            }
          }, 10000);
        }, 1300);
      }
    };

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, [clockTriggered]);

  const handleSoundClick = () => {
    if (hasInteracted) return;

    const vid = videoRef.current;
    const soundOverlay = soundOverlayRef.current;
    if (!vid || !soundOverlay) return;

    vid.muted = false;
    vid.play().catch(err => console.log("Play error:", err));
    soundOverlay.style.display = "none";
    setHasInteracted(true);
  };

  const handleVideoEnded = () => {
    const replayOverlay = replayOverlayRef.current;
    if (!replayOverlay) return;
    replayOverlay.style.display = "flex";
  };

  const handleReplay = () => {
    const vid = videoRef.current;
    const replayOverlay = replayOverlayRef.current;
    const clockWidget = clockWidgetRef.current;
    
    if (!vid || !replayOverlay || !clockWidget) return;

    replayOverlay.style.display = "none";
    vid.currentTime = 0;
    setClockTriggered(false);
    
    clockWidget.classList.remove(styles.animateOut);
    clockWidget.style.display = "none";
    
    vid.play().catch(err => console.log("Replay error:", err));
  };

  const handleReplayInvest = () => {
    window.open("https://yes.prognostic.ai", "_blank");
  };

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
          id="webinarVideo"
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

        <div
          className={styles.soundOverlay}
          ref={soundOverlayRef}
          onClick={handleSoundClick}
        >
          <div className={styles.soundIcon}>🔊</div>
          <div className={styles.soundText}>Click to Enable Sound</div>
        </div>

        <div className={styles.replayOverlay} ref={replayOverlayRef}>
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

const WebinarChatBox: React.FC = () => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const typingIndicatorRef = useRef<HTMLDivElement>(null);
  const participantToggleRef = useRef<HTMLInputElement>(null);
  const specialOfferRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const investButtonRef = useRef<HTMLButtonElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  let isUserScrolling = false;

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

    if (!chatEl || !inputEl || !typingEl || !toggleEl || !specialOfferEl || !countdownEl || !investBtn) {
      console.error("WebinarChatBox: Missing required refs");
      return;
    }

    const isNearBottom = (element: HTMLDivElement) => {
      const threshold = 50;
      return (element.scrollHeight - element.clientHeight - element.scrollTop) <= threshold;
    };

    const scrollToBottom = (element: HTMLDivElement) => {
      element.scrollTop = element.scrollHeight;
    };

    const handleScroll = () => {
      isUserScrolling = !isNearBottom(chatEl);
    };

    chatEl.addEventListener('scroll', handleScroll);

    const addMessage = (
      text: string,
      type: 'user' | 'host' | 'system',
      userName = '',
      isAutoGenerated = true
    ) => {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add(styles.message);

      if (type === 'user') {
        messageDiv.classList.add('user');
      } else if (type === 'host') {
        messageDiv.classList.add('host');
      } else if (type === 'system') {
        messageDiv.classList.add('system');
      }

      messageDiv.textContent = userName ? `${userName}: ${text}` : text;

      if (type === 'host' && !isAutoGenerated) {
        typingEl.textContent = 'Selina is typing...';
        setTimeout(() => {
          typingEl.textContent = '';
        }, 2000);
      }

      if (type === 'user' && userName !== 'You') {
        messageDiv.setAttribute('data-participant', 'true');
        messageDiv.setAttribute('data-auto-generated', 'true');
        messageDiv.style.display = toggleEl.checked ? 'block' : 'none';
      }

      chatEl.appendChild(messageDiv);

      if (!isUserScrolling || userName === 'You') {
        scrollToBottom(chatEl);
      }
    };

    const handleToggleChange = () => {
      const participantMessages = chatEl.querySelectorAll('[data-participant="true"]');
      participantMessages.forEach(msg => {
        (msg as HTMLElement).style.display = toggleEl.checked ? 'block' : 'none';
      });
      if (toggleEl.checked && !isUserScrolling) {
        scrollToBottom(chatEl);
      }
    };

    toggleEl.addEventListener('change', handleToggleChange);

    const newSocket = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log("Connected to chat server");
      scrollToBottom(chatEl);
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        addMessage(data.text, data.messageType as 'user' | 'host' | 'system', data.user, true);
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

   const handleHostResponse = async (userMsg: string) => {
      try {
        const randomDelay = Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        typingEl.textContent = "Selina is typing...";

        const response = await fetch("https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg, type: "user" })
        });

        if (!response.ok) throw new Error("API call failed");

        const data = await response.json();
        typingEl.textContent = "";

        if (data.response) {
          addMessage(data.response, "host", "Selina (Host)", false);
        }
      } catch (err) {
        console.error("Error:", err);
        typingEl.textContent = "";
        addMessage(
          "Apologies, I'm having trouble connecting. Please try again!",
          "host",
          "Selina (Host)",
          false
        );
      }
    };

    const showInvestmentNotification = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const line = investmentMessages[Math.floor(Math.random() * investmentMessages.length)];
      const notif = document.createElement('div');
      notif.classList.add(styles.notification);
      notif.innerHTML = `
        <div class="${styles.notificationIcon}">🎉</div>
        <div><strong>${name}</strong> ${line}</div>
      `;
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 5000);
    };

    const investmentInterval = setInterval(() => {
      showInvestmentNotification();
    }, Math.random() * 30000 + 30000);

    setTimeout(() => {
      specialOfferEl.style.display = "block";
      addMessage(
        "🚨 Special Offer Alert! For the next 10 minutes only, secure your spot in PrognosticAI for just $999. Don't miss out! 🚀",
        "system"
      );

      let t = 600;
      const countdownInt = setInterval(() => {
        t--;
        const min = Math.floor(t / 60);
        const sec = t % 60;
        countdownEl.textContent = `Special Offer Ends In: ${min}:${sec.toString().padStart(2, "0")}`;
        if (t <= 0) {
          clearInterval(countdownInt);
          specialOfferEl.style.display = "none";
          addMessage("⌛ The special offer has ended.", "system");
        }
      }, 1000);
    }, 60000);

    investBtn.addEventListener('click', () => {
      window.open("https://yes.prognostic.ai", "_blank");
    });

    const scheduleAttendeeMessages = () => {
      const numMessages = Math.floor(Math.random() * 6) + 15;
      let delay = 500;
      
      for (let i = 0; i < numMessages; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const msg = attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        setTimeout(() => {
          addMessage(msg, "user", name, true);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    };

    setTimeout(() => {
      addMessage("Welcome to PrognosticAI Live!", "host", "Selina (Host)", true);
      scheduleAttendeeMessages();
      scrollToBottom(chatEl);
    }, 4000);

    const handleKeypress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(userMsg, "user", "You", false);
        handleHostResponse(userMsg);
      }
    };

    inputEl.addEventListener('keypress', handleKeypress);

    return () => {
      chatEl.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggleChange);
      inputEl.removeEventListener('keypress', handleKeypress);
      clearInterval(investmentInterval);

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

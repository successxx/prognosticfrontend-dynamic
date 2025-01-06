/**
 * WebinarView.tsx
 *
 * Combines:
 * - The big video snippet with "drag in clock widget," replay overlay, etc.
 * - The side-by-side chat on the right, using your waiting room's AI logic.
 * - 50% bigger layout, fully responsive.
 * - Video autoplays if possible; else user clicks "Click to Enable Sound."
 * - Host "Selina" replies from your https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message
 * - Invest button opens in new tab
 * - And we do non-null assertions to avoid TS errors.
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css';

const WebinarView: React.FC = () => {
  return (
    <div className={styles.webinarContainer}>
      {/* 1) The big video section with clock widget, replay overlay, etc. */}
      <VideoSection />

      {/* 2) The chat column on the right */}
      <WebinarChatBox />
    </div>
  );
};

/** The big video snippet from your old HTML code, but in React style. */
const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const soundOverlayRef = useRef<HTMLDivElement | null>(null);
  const replayOverlayRef = useRef<HTMLDivElement | null>(null);

  // For the clock widget
  const clockWidgetRef = useRef<HTMLDivElement | null>(null);
  const clockTimeRef = useRef<HTMLDivElement | null>(null);
  const clockDateRef = useRef<HTMLDivElement | null>(null);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [clockTriggered, setClockTriggered] = useState(false);
  const movementIntervalRef = useRef<number | null>(null);
  const clockIntervalRef = useRef<number | null>(null);

  // Attempt playback on mount
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Start at 0
    vid.currentTime = 0;
    // Attempt autoplay
    vid.play().catch(err => console.log("Auto-play prevented:", err));
  }, []);

  // Animate + update clock
  function updateClock() {
    if (!clockTimeRef.current || !clockDateRef.current) return;
    const now = new Date();
    // hh:mm:ss
    clockTimeRef.current.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    // weekday, month day, year
    clockDateRef.current.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function addNaturalMovement() {
    let baseX = 0;
    let baseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastTime = Date.now();

    const moveInterval = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // random acceleration
      const accX = (Math.random() - 0.5) * 1.5;
      const accY = (Math.random() - 0.5) * 1.5;

      velocityX = velocityX * 0.95 + accX * deltaTime;
      velocityY = velocityY * 0.95 + accY * deltaTime;

      baseX += velocityX;
      baseY += velocityY;

      // small sinusoidal wobble
      const wobbleX = Math.sin(currentTime * 0.002) * 0.3;
      const wobbleY = Math.cos(currentTime * 0.002) * 0.3;

      if (clockWidgetRef.current) {
        clockWidgetRef.current.style.transform = `translate(${baseX + wobbleX}px, ${
          baseY + wobbleY
        }px)`;
      }
    }, 16);
    return moveInterval;
  }

  // Listen for video time update to trigger the clock at 10s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleTimeUpdate() {
      if (vid.currentTime >= 10 && !clockTriggered) {
        setClockTriggered(true);
        // Show the widget
        if (clockWidgetRef.current) {
          clockWidgetRef.current.style.display = "block";
          clockWidgetRef.current.classList.add(styles.animateIn);
        }
        // Start clock updates
        clockIntervalRef.current = window.setInterval(updateClock, 1000);
        updateClock();

        // After animateIn finishes (~1.3s), add movement
        setTimeout(() => {
          const moveInterval = addNaturalMovement();
          movementIntervalRef.current = moveInterval as unknown as number;

          // Keep the widget for ~10s
          setTimeout(() => {
            if (movementIntervalRef.current) {
              clearInterval(movementIntervalRef.current);
            }
            if (clockWidgetRef.current) {
              clockWidgetRef.current.classList.remove(styles.animateIn);
              clockWidgetRef.current.classList.add(styles.animateOut);

              // after dragOut finishes (~1s), hide
              setTimeout(() => {
                if (clockIntervalRef.current) {
                  clearInterval(clockIntervalRef.current);
                }
                clockWidgetRef.current!.style.display = "none";
              }, 1000);
            }
          }, 10000);
        }, 1300);
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, [clockTriggered]);

  // Sound overlay
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

  // Replay overlay if ended
  function handleVideoEnded() {
    if (replayOverlayRef.current) {
      replayOverlayRef.current.style.display = "flex";
    }
  }

  // "Watch Instant Replay"
  function handleReplay() {
    if (replayOverlayRef.current) {
      replayOverlayRef.current.style.display = "none";
    }
    const vid = videoRef.current;
    if (!vid) return;
    // reset
    vid.currentTime = 0;
    setClockTriggered(false);
    if (clockWidgetRef.current) {
      clockWidgetRef.current.classList.remove(styles.animateOut);
      clockWidgetRef.current.style.display = "none";
    }
    vid.play().catch(err => console.log("Replay error:", err));
  }

  // Just a placeholder for the invest $999 button in the overlay
  function handleReplayInvest() {
    // open in new tab
    window.open("https://yes.prognostic.ai", "_blank");
  }

  return (
    <div className={styles.videoSection}>
      {/* Banner across top */}
      <div className={styles.banner}>
        <div className={styles.liveIndicator}>
          <div className={styles.liveDot}></div>
          LIVE
        </div>
        PrognosticAI Advanced Training
      </div>

      {/* The video area */}
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

        {/* The clock widget */}
        <div className={styles.clockWidget} id="clockWidget" ref={clockWidgetRef}>
          <div className={styles.widgetHeader}>
            <div className={styles.windowControls}>
              <div className={`${styles.windowButton} ${styles.closeButton}`}></div>
              <div className={`${styles.windowButton} ${styles.minimizeButton}`}></div>
              <div className={`${styles.windowButton} ${styles.maximizeButton}`}></div>
            </div>
            <div className={styles.widgetTitle}>Clock Widget</div>
          </div>
          <div className={styles.widgetContent}>
            <div className={styles.clockTime} id="clockTime" ref={clockTimeRef}></div>
            <div className={styles.clockDate} id="clockDate" ref={clockDateRef}></div>
          </div>
        </div>

        {/* Sound overlay */}
        <div className={styles.soundOverlay} id="soundOverlay" ref={soundOverlayRef} onClick={handleSoundClick}>
          <div className={styles.soundIcon}>🔊</div>
          <div className={styles.soundText}>Click to Enable Sound</div>
        </div>

        {/* Replay overlay */}
        <div className={styles.replayOverlay} id="replayOverlay" ref={replayOverlayRef}>
          <h2 className={styles.replayTitle}>Webinar Ended</h2>
          <button className={styles.replayButton} id="replayButton" onClick={handleReplay}>
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

/** 
 * The chat column on the right, with AI logic & big. 
 * We are merging your waiting-room logic so "Selina" actually replies.
 */
const WebinarChatBox: React.FC = () => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const specialOfferRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const investButtonRef = useRef<HTMLButtonElement | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  // For random messages
  const names = [
    "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
    "Isabella", "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia",
    "Lucas", "Harper", "Henry", "Evelyn", "Alexander"
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

  let isUserScrolling = false;

  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;
    const specialOfferEl = specialOfferRef.current;
    const countdownEl = countdownRef.current;
    const investBtn = investButtonRef.current;

    if (!chatEl || !inputEl || !typingEl || !toggleEl || !specialOfferEl || !countdownEl || !investBtn) {
      console.error("WebinarChatBox: Missing required refs.");
      return;
    }

    // Scroll helpers
    function isNearBottom(element: HTMLDivElement) {
      const threshold = 50;
      return (element.scrollHeight - element.clientHeight - element.scrollTop) <= threshold;
    }
    function scrollToBottom(element: HTMLDivElement) {
      element.scrollTop = element.scrollHeight;
    }

    function handleScroll() {
      isUserScrolling = !isNearBottom(chatEl);
    }
    chatEl.addEventListener('scroll', handleScroll);

    // Add message
    function addMessage(
      text: string,
      type: 'user' | 'host' | 'system',
      userName = '',
      isAutoGenerated = true
    ) {
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

      // If it's a real (non-auto) host message, show "typing..."
      if (type === 'host' && !isAutoGenerated) {
        typingEl.textContent = 'Selina is typing...';
        setTimeout(() => {
          typingEl.textContent = '';
        }, 2000);
      }

      // If from other user & toggle is off => hide
      if (type === 'user' && userName !== 'You') {
        messageDiv.setAttribute('data-participant', 'true');
        messageDiv.setAttribute('data-auto-generated', 'true');
        messageDiv.style.display = toggleEl.checked ? 'block' : 'none';
      }

      chatEl.appendChild(messageDiv);

      // auto-scroll if near bottom
      if (!isUserScrolling || userName === 'You') {
        scrollToBottom(chatEl);
      }
    }

    // Toggle participants
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

    // Connect WebSocket
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

    // Host AI response
    async function handleHostResponse(userMsg: string) {
      try {
        // short random delay
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
    }

    // random invests
    function showInvestmentNotification() {
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
    }
    setInterval(() => {
      showInvestmentNotification();
    }, Math.random() * 30000 + 30000);

    // Show special offer at 60s
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
          addMessage("⌛ The special offer has ended.","system");
        }
      }, 1000);
    }, 60000);

    // invest => new tab
    investBtn.addEventListener('click', () => {
      window.open("https://yes.prognostic.ai", "_blank");
    });

    // random user messages
    function scheduleAttendeeMessages() {
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
    }
    setTimeout(() => {
      addMessage("Welcome to PrognosticAI Live!", "host", "Selina (Host)", true);
      scheduleAttendeeMessages();
      scrollToBottom(chatEl);
    }, 4000);

    // user presses enter => send
    function handleKeypress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(userMsg, "user", "You", false);
        handleHostResponse(userMsg);
      }
    }
    inputEl.addEventListener('keypress', handleKeypress);

    return () => {
      chatEl.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggleChange);
      inputEl.removeEventListener('keypress', handleKeypress);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.chatSection}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerTop}>
          <span className={styles.chatTitle}>Live Chat</span>
          <div className={styles.toggleContainer}>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                id="participantToggle"
                ref={participantToggleRef}
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

      {/* Special Offer */}
      <div className={styles.specialOffer} id="specialOffer" ref={specialOfferRef}>
        <div className={styles.countdown} id="countdownTimer" ref={countdownRef}>
          Special Offer Ends In: 10:00
        </div>
        <button className={styles.investButton} id="investButton" ref={investButtonRef}>
          Invest $999 Now - Limited Time Offer
        </button>
      </div>

      {/* Chat messages */}
      <div className={styles.chatMessages} ref={chatMessagesRef}></div>

      {/* Input */}
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

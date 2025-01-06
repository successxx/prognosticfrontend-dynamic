/**
 * WebinarView.tsx
 *
 * - Non-null checks for videoEl/audioEl
 * - "Invest" button opens in a new tab
 * - Selina’s AI logic is included
 * - Layout/design unchanged
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css';

const WebinarView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const messageToneRef = useRef<HTMLAudioElement>(null);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [liveMinutes, setLiveMinutes] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  const [exitMessage, setExitMessage] = useState('');
  const defaultExitMessage = "Wait! Are you sure you want to leave?";
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "If you reload, you might lose your spot. Continue?";
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('user_email');

    if (userEmail) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(
              userEmail
            )}`
          );
          if (!response.ok) {
            console.error('Error retrieving personalized data:', response.statusText);
            return;
          }
          const data = await response.json();

          if (data.audio_link && audioRef.current) {
            audioRef.current.src = data.audio_link;
          }
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
        } catch (err) {
          console.error('Error loading personalized data:', err);
        }
      };
      fetchData();
    } else {
      console.warn('No user_email param found.');
    }

    const timer = setTimeout(() => {
      setConnecting(false);
      startTimeRef.current = Date.now();

      // Attempt auto-play
      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.log('Auto-play prevented; user must click overlay', err);
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // "Live for X minutes"
  useEffect(() => {
    if (!connecting && startTimeRef.current) {
      const intervalId = setInterval(() => {
        const diff = Date.now() - startTimeRef.current!;
        setLiveMinutes(Math.floor(diff / 60000));
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [connecting]);

  // Personalized audio at 3s
  useEffect(() => {
    if (connecting) return;
    const videoEl = videoRef.current;
    const audioEl = audioRef.current;
    if (!videoEl || !audioEl) return;

    const handleTimeUpdate = () => {
      if (videoEl.currentTime >= 3) {
        audioEl.play().catch(err => console.error('Error playing audio:', err));
        videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    return () => videoEl.removeEventListener('timeupdate', handleTimeUpdate);
  }, [connecting]);

  // Exit-intent overlay after connecting
  useEffect(() => {
    if (connecting) return;

    function handleMouseMove(e: MouseEvent) {
      if (hasShownOverlay) return;
      const threshold = window.innerHeight * 0.1;
      if (e.clientY < threshold) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);

        if (messageToneRef.current) {
          messageToneRef.current.play().catch(err =>
            console.warn('iMessage tone autoplay blocked:', err)
          );
        }
      }
    }
    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [connecting, hasShownOverlay]);

  // If connecting => spinner
  if (connecting) {
    return (
      <div className={styles.connectingOverlay}>
        <div className={styles.connectingBox}>
          <div className={styles.connectingSpinner}></div>
          <p className={styles.connectingText}>Connecting you now...</p>
        </div>
      </div>
    );
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      setShowExitOverlay(false);
    }
  }

  return (
    <div className={styles.zoomContainer}>
      {/* iPhone text message tone (hidden) */}
      <audio
        ref={messageToneRef}
        src="https://cdn.freesound.org/previews/613/613258_5674468-lq.mp3"
        style={{ display: 'none' }}
      />

      {/* EXIT-INTENT OVERLAY */}
      {showExitOverlay && (
        <div className={styles.exitOverlay} onClick={handleOverlayClick}>
          <div className={styles.iphoneMessageBubble}>
            <button
              className={styles.exitCloseBtn}
              onClick={() => setShowExitOverlay(false)}
            >
              ×
            </button>
            <div className={styles.iphoneSender}>Selina</div>
            <div className={styles.iphoneMessageText}>
              {exitMessage && exitMessage.trim().length > 0
                ? exitMessage
                : defaultExitMessage}
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className={styles.zoomTopBar}>
        <div className={styles.zoomTitle}>
          <div className={styles.zoomLiveDot}></div>
          PrognosticAI Advanced Training
        </div>
        <div className={styles.zoomLiveMinutes}>
          Live for {liveMinutes} minute{liveMinutes !== 1 ? 's' : ''}
        </div>
      </div>

      {/* 70%/30% layout */}
      <div className={styles.twoColumnLayout}>
        {/* Video column */}
        <div className={styles.videoColumn}>
          <div className={styles.videoWrapper}>
            <video
              ref={videoRef}
              muted={!hasInteracted}
              playsInline
              controls={false}
              style={{ width: '100%', height: '100%' }}
            >
              <source
                src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
                type="video/mp4"
              />
              Your browser does not support HTML5 video.
            </video>

            {/* Personalized audio hidden */}
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* Sound Overlay if user hasn't interacted */}
            {!hasInteracted && (
              <div
                className={styles.soundOverlay}
                onClick={() => {
                  if (!videoRef.current) return;
                  videoRef.current.muted = false;
                  videoRef.current.play().catch(err =>
                    console.log('Play error:', err)
                  );
                  setHasInteracted(true);
                }}
              >
                <div className={styles.soundIcon}>🔊</div>
                <div className={styles.soundText}>
                  Click here to unmute &amp; play
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat column */}
        <div className={styles.chatColumn}>
          <WebinarChatBox />
        </div>
      </div>

      {/* Subtle footer with dynamic year */}
      <p className={styles.zoomFooter}>
        © {new Date().getFullYear()} PrognosticAI
      </p>
    </div>
  );
};

const WebinarChatBox: React.FC = () => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const specialOfferRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const investButtonRef = useRef<HTMLButtonElement | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  let isUserScrolling = false;

  const names = [
    "Emma","Liam","Olivia","Noah","Ava","Ethan","Sophia","Mason",
    "Isabella","William","Mia","James","Charlotte","Benjamin","Amelia",
    "Lucas","Harper","Henry","Evelyn","Alexander"
  ];
  const attendeeMessages = [
    "hows everyone doing today??",
    ... // your lines
    "im big in affiliate marketing, and this is wild!"
  ];
  const investmentMessages = [
    "just invested in PrognosticAI! 🚀",
    ...
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

    if (
      !chatEl ||
      !inputEl ||
      !typingEl ||
      !toggleEl ||
      !specialOfferEl ||
      !countdownEl ||
      !investBtn
    ) {
      console.error("WebinarChatBox: Missing required refs.");
      return;
    }

    function isNearBottom(element: HTMLDivElement) {
      const threshold = 50;
      return (element.scrollHeight - element.clientHeight - element.scrollTop) <= threshold;
    }
    function scrollToBottom(element: HTMLDivElement) {
      element.scrollTop = element.scrollHeight;
    }

    function handleScroll() {
      isUserScrolling = !isNearBottom(chatEl!);
    }
    chatEl!.addEventListener('scroll', handleScroll);

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

      // If it's a real host message
      if (type === 'host' && !isAutoGenerated) {
        typingEl!.textContent = 'Selina is typing...';
        setTimeout(() => {
          typingEl!.textContent = '';
        }, 2000);
      }

      // participant messages from others => toggle
      if (type === 'user' && userName !== 'You') {
        messageDiv.setAttribute('data-participant', 'true');
        messageDiv.setAttribute('data-auto-generated', 'true');
        messageDiv.style.display = toggleEl!.checked ? 'block' : 'none';
      }

      chatEl!.appendChild(messageDiv);

      if (!isUserScrolling || userName === 'You') {
        scrollToBottom(chatEl!);
      }
    }

    function handleToggleChange() {
      const participantMessages = chatEl!.querySelectorAll('[data-participant="true"]');
      participantMessages.forEach(msg => {
        (msg as HTMLElement).style.display = toggleEl!.checked ? 'block' : 'none';
      });
      if (toggleEl!.checked && !isUserScrolling) {
        scrollToBottom(chatEl!);
      }
    }
    toggleEl!.addEventListener('change', handleToggleChange);

    const newSocket = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log("Connected to chat server");
      scrollToBottom(chatEl!);
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

    async function handleHostResponse(userMsg: string) {
      try {
        const randomDelay = Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        typingEl!.textContent = 'Selina is typing...';

        const response = await fetch("https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg, type: "user" })
        });
        if (!response.ok) throw new Error("API call failed");

        const data = await response.json();
        typingEl!.textContent = "";

        if (data.response) {
          addMessage(data.response, "host", "Selina (Host)", false);
        }
      } catch (err) {
        console.error("Error:", err);
        typingEl!.textContent = "";
        addMessage(
          "Apologies, I'm having trouble connecting. Please try again!",
          "host",
          "Selina (Host)",
          false
        );
      }
    }

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

    setTimeout(() => {
      specialOfferEl!.style.display = "block";
      addMessage(
        "🚨 Special Offer Alert! For the next 10 minutes only, secure your spot in PrognosticAI for just $999!",
        "system"
      );
      let t = 600;
      const countdownInt = setInterval(() => {
        t--;
        const min = Math.floor(t / 60);
        const sec = t % 60;
        countdownEl!.textContent = `Special Offer Ends In: ${min}:${sec.toString().padStart(2, "0")}`;
        if (t <= 0) {
          clearInterval(countdownInt);
          specialOfferEl!.style.display = "none";
          addMessage("⌛ The special offer has ended.","system");
        }
      }, 1000);
    }, 60000);

    investBtn!.addEventListener('click', () => {
      // Open in new tab
      window.open("https://yes.prognostic.ai", "_blank");
    });

    function scheduleAttendeeMessages() {
      const numMessages = Math.floor(Math.random() * 6) + 15;
      let delay = 500;
      for (let i = 0; i < numMessages; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const msg = attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        setTimeout(() => {
          addMessage(msg, 'user', name, true);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }

    setTimeout(() => {
      addMessage("Welcome to PrognosticAI Live!", 'host', 'Selina (Host)', true);
      scheduleAttendeeMessages();
      scrollToBottom(chatEl!);
    }, 4000);

    function handleKeypress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl!.value.trim()) {
        const userMsg = inputEl!.value.trim();
        inputEl!.value = "";
        addMessage(userMsg, 'user', 'You', false);
        handleHostResponse(userMsg);
      }
    }
    inputEl!.addEventListener('keypress', handleKeypress);

    return () => {
      chatEl!.removeEventListener('scroll', handleScroll);
      toggleEl!.removeEventListener('change', handleToggleChange);
      inputEl!.removeEventListener('keypress', handleKeypress);
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

      <div className={styles.specialOffer} id="specialOffer" ref={specialOfferRef}>
        <div className={styles.countdown} id="countdownTimer" ref={countdownRef}>
          Special Offer Ends In: 10:00
        </div>
        <button
          className={styles.investButton}
          id="investButton"
          ref={investButtonRef}
        >
          Invest $999 Now - Limited Time Offer
        </button>
      </div>

      <div className={styles.chatMessages} id="chatMessages" ref={chatMessagesRef}></div>

      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Type your message here..."
          id="messageInput"
          ref={messageInputRef}
        />
        <div className={styles.typingIndicator} id="typingIndicator" ref={typingIndicatorRef}></div>
      </div>
    </div>
  );
};

export default WebinarView;

import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css';

/**
 * Full webinar experience, combining:
 *  - Loading (connecting) overlay
 *  - Video (with auto-play, iMessage style exit bubble, personalized audio at 3s)
 *  - Clock widget that slides in/out at 10s
 *  - Chat box on the right
 *  - "Live for X minutes" text
 *  - "PrognosticAI Advanced Training" banner
 *  - Exit-intent popup
 *  - Special offer
 *  - Copyright at bottom
 */

const WebinarView: React.FC = () => {
  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageToneRef = useRef<HTMLAudioElement | null>(null);

  // State
  const [connecting, setConnecting] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false); // track if user clicked "enable sound"
  const [liveMinutes, setLiveMinutes] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  const [exitMessage, setExitMessage] = useState('');
  const defaultExitMessage = "Wait! Are you sure you want to leave?";
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);

  // For clock widget
  const [showClock, setShowClock] = useState(false);
  const [hasClockShown, setHasClockShown] = useState(false);

  // "Loading" spinner
  const [loadingSpinnerVisible, setLoadingSpinnerVisible] = useState(true);

  // On mount, fetch user’s data, set 2s connecting overlay, etc.
  useEffect(() => {
    // Prevent refresh
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue =
        "The webinar is currently full. If you reload, you might lose your spot. Are you sure you want to refresh?";
    }
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Show connecting overlay for 2s
    const connectingTimer = setTimeout(() => {
      setConnecting(false);
      setLoadingSpinnerVisible(false); // hide the spinner
      startTimeRef.current = Date.now();

      // Attempt auto-play
      if (videoRef.current) {
        videoRef.current
          .play()
          .catch(err => console.log('Auto-play prevented; user must interact.', err));
      }
    }, 2000);

    // Possibly fetch userEmail param from URL
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('user_email');

    if (userEmail) {
      // Example fetch: audio_link + exit_message
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
    }

    return () => {
      clearTimeout(connectingTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // "Live for X minutes" - update every 60s
  useEffect(() => {
    if (!connecting && startTimeRef.current) {
      const intervalId = setInterval(() => {
        const diff = Date.now() - startTimeRef.current!;
        setLiveMinutes(Math.floor(diff / 60000));
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [connecting]);

  // Personalized audio at 3s (listening to the video time)
  useEffect(() => {
    const videoEl = videoRef.current;
    const audioEl = audioRef.current;
    if (!videoEl || !audioEl) return;

    const handleTimeUpdate = () => {
      if (videoEl.currentTime >= 3) {
        // attempt to play the user’s audio
        audioEl
          .play()
          .catch(err => console.error('Error starting personalized audio playback:', err));
        videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    return () => videoEl.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // Show clock widget at 10s, hide after another 10s
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const onTimeUpdate = () => {
      if (!hasClockShown && videoEl.currentTime >= 10) {
        setShowClock(true);
        setHasClockShown(true);

        // Hide it after 10s
        setTimeout(() => {
          setShowClock(false);
        }, 10_000);
      }
    };
    videoEl.addEventListener('timeupdate', onTimeUpdate);
    return () => videoEl.removeEventListener('timeupdate', onTimeUpdate);
  }, [hasClockShown]);

  // Mouse-based exit-intent
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (hasShownOverlay) return;
      const threshold = window.innerHeight * 0.1;
      if (e.clientY < threshold) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);

        // iMessage tone (if user interacted)
        if (messageToneRef.current) {
          messageToneRef.current.play().catch(err => {
            console.warn('iMessage tone autoplay blocked:', err);
          });
        }
      }
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasShownOverlay]);

  // Rendering

  // (1) If connecting, show the “Loading” overlay
  if (connecting) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingBox}>
          {loadingSpinnerVisible && (
            <div className={styles.spinner}>
              {/* Simple spinner */}
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
          <p className={styles.loadingText}>Loading, please wait...</p>
        </div>
      </div>
    );
  }

  // (2) Exit overlay handler
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // if user clicked on the overlay background
    if (e.target === e.currentTarget) {
      setShowExitOverlay(false);
    }
  };

  const handleEnableSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
    setHasInteracted(true);
  };

  return (
    <div className={styles.container}>

      {/* iPhone text message tone */}
      <audio
        ref={messageToneRef}
        src="https://cdn.freesound.org/previews/613/613258_5674468-lq.mp3"
        style={{ display: 'none' }}
      />

      {/* Possibly show the exit overlay */}
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
              {exitMessage.trim().length > 0 ? exitMessage : defaultExitMessage}
            </div>
          </div>
        </div>
      )}

      {/* Banner row (live indicator + text + "Live for X minutes" */}
      <div className={styles.bannerRow}>
        <div className={styles.banner}>
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot} />
            LIVE
          </div>
          <span className={styles.bannerTitle}>PrognosticAI Advanced Training</span>
        </div>
        <div className={styles.liveMinutes}>
          Live for {liveMinutes} minute{liveMinutes !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Main 2-column layout: video + chat */}
      <div className={styles.mainRow}>
        {/* Left: Video Container */}
        <div className={styles.videoContainer}>
          <div className={styles.videoWrapper}>
            <video
              ref={videoRef}
              muted={!hasInteracted}
              playsInline
              controls={false}
              style={{ width: '100%', height: 'auto' }}
            >
              <source
                src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
                type="video/mp4"
              />
              Your browser does not support HTML5 video.
            </video>

            {/* The clock widget (slides in at 10s) */}
            {showClock && <ClockWidget />}

            {/* Hidden <audio> for personalized track */}
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* Sound overlay if user hasn’t interacted */}
            {!hasInteracted && (
              <div className={styles.soundOverlay} onClick={handleEnableSound}>
                <div className={styles.soundIcon}>🔊</div>
                <div className={styles.soundText}>Click to Enable Sound</div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat Section */}
        <div className={styles.chatContainer}>
          <WebinarChatBox />
        </div>
      </div>

      {/* Subtle copyright at the bottom */}
      <div className={styles.copyright}>
        © {new Date().getFullYear()} PrognosticAI
      </div>
    </div>
  );
};

/** 
 * ClockWidget – a minimal sub-component 
 * with the Jony Ive style window controls 
 * and a live clock. 
 */
const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const int = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(int);
  }, []);

  const hours = time.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.clockWidget}>
      <div className={styles.widgetHeader}>
        <div className={styles.windowControls}>
          <div className={`${styles.windowButton} ${styles.closeButton}`} />
          <div className={`${styles.windowButton} ${styles.minimizeButton}`} />
          <div className={`${styles.windowButton} ${styles.maximizeButton}`} />
        </div>
        <div className={styles.widgetTitle}>Clock Widget</div>
      </div>
      <div className={styles.widgetContent}>
        <div className={styles.clockTime}>{hours}</div>
        <div className={styles.clockDate}>{dateStr}</div>
      </div>
    </div>
  );
};

/** 
 * WebinarChatBox 
 * 
 * The entire chat logic, including toggles, 
 * special offer, random user messages, etc.
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

  // random names
  const names = [
    "Emma","Liam","Olivia","Noah","Ava","Ethan","Sophia","Mason",
    "Isabella","William","Mia","James","Charlotte","Benjamin","Amelia",
    "Lucas","Harper","Henry","Evelyn","Alexander"
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
  const attendeeMessages = [
    "hows everyone doing today??",
    "Hi from Seattle! super excited 2 be here",
    "first time in one of these... hope im not late!",
    "cant wait to learn more bout this AI stuff 🤓",
    "hello everyone....joining from australia",
    "Any1 else here run advanced funnels for clients??",
    "This looks amazing, can't wait to see more advanced strategies!",
    "who else uses multi-step funnels with email marketing?",
    "omg the potential of this is INSANE for scaling funnels",
    "quick q - will this wrk with shopify or high-level??",
    "joining late...did i miss anything important???",
    "im blown away by the capabilities tbh",
    "this will save me so much time in my funnels",
    "anyone else do big product launches? this is a game changer",
    "thx for putting this together!! 🙌",
    "just got here...hope i didnt miss too much",
    "can someone explain the pricing again??",
    "this is exactly what ive been looking for!!1!",
    "sry if this was covered already but will there b updates?",
    "im big in affiliate marketing, and this is wild!"
  ];
  const preloadedQuestions = [
    {time:180,  text:"How does this integrate with existing business systems?", user:"Michael"},
    {time:300,  text:"Can you explain more about the AI capabilities?", user:"Sarah"},
    {time:450,  text:"Does this work with Zapier?", user:"David"},
    {time:600,  text:"What kind of ROI can we expect?", user:"Rachel"},
    {time:750,  text:"How long does implementation typically take?", user:"James"},
    {time:900,  text:"This is incredible! Can't believe the accuracy levels 🔥", user:"Emma"},
    {time:1200, text:"Do you offer enterprise solutions?", user:"Thomas"},
    {time:1500, text:"Just amazing how far AI has come!", user:"Lisa"},
    {time:1800, text:"What about data security?", user:"Alex"},
    {time:2100, text:"Can small businesses benefit from this?", user:"Jennifer"},
    {time:2400, text:"The predictive analytics are mind-blowing!", user:"Daniel"},
    {time:2700, text:"How often do you release updates?", user:"Sophie"},
    {time:3000, text:"Wow, the demo exceeded my expectations!", user:"Ryan"},
    {time:3300, text:"What makes PrognosticAI different from competitors?", user:"Maria"}
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

    // If we’re missing something crucial, bail out
    if (!chatEl || !inputEl || !typingEl || !toggleEl || !specialOfferEl || !countdownEl || !investBtn) {
      console.warn("Missing one or more crucial chatbox elements.");
      return;
    }

    // Helper: near bottom?
    function isNearBottom(element: HTMLDivElement) {
      const threshold = 50;
      return element.scrollHeight - element.clientHeight - element.scrollTop <= threshold;
    }
    // Helper: scroll to bottom
    function scrollToBottom(element: HTMLDivElement) {
      element.scrollTop = element.scrollHeight;
    }
    // On scroll
    function handleScroll() {
      isUserScrolling = !isNearBottom(chatEl);
    }
    chatEl.addEventListener('scroll', handleScroll);

    // Toggle
    function handleToggleChange() {
      // Show/hide participant messages
      const participantMessages = chatEl.querySelectorAll('[data-participant="true"]');
      participantMessages.forEach(msg => {
        (msg as HTMLElement).style.display = toggleEl.checked ? 'block' : 'none';
      });
      if (toggleEl.checked && !isUserScrolling) {
        scrollToBottom(chatEl);
      }
    }
    toggleEl.addEventListener('change', handleToggleChange);

    // Add message
    function addMessage(
      text: string,
      msgType: 'user' | 'host' | 'system',
      userName = ''
    ) {
      const div = document.createElement('div');
      div.classList.add(styles.message);
      if (msgType === 'user') {
        div.classList.add(styles.userMsg);
      } else if (msgType === 'host') {
        div.classList.add(styles.hostMsg);
      } else if (msgType === 'system') {
        div.classList.add(styles.systemMsg);
      }
      if (userName) {
        div.textContent = `${userName}: ${text}`;
      } else {
        div.textContent = text;
      }
      // data attr if from participant
      if (msgType === 'user' && userName !== 'You') {
        div.setAttribute('data-participant', 'true');
        if (!toggleEl.checked) {
          div.style.display = 'none';
        }
      }
      chatEl.appendChild(div);
      if (!isUserScrolling || userName === 'You') {
        scrollToBottom(chatEl);
      }
    }

    // Connect WebSocket
    const newSocket = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = newSocket;
    newSocket.onopen = () => {
      console.log("Connected to chat server");
    };
    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          addMessage(
            data.text,
            data.messageType as 'user' | 'host' | 'system',
            data.user
          );
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Random attendee messages
    function scheduleAttendeeMessages() {
      const numMessages = Math.floor(Math.random() * 6) + 15; // between 15 and 20
      let delay = 500;
      for (let i = 0; i < numMessages; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const msg = attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        setTimeout(() => {
          addMessage(msg, 'user', name);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }

    setTimeout(() => {
      addMessage(
        "Welcome to the PrognosticAI Advanced Training! 👋 Let us know where you're joining from!",
        'host',
        'Selina (Host)'
      );
      scheduleAttendeeMessages();
    }, 2000);

    // Preloaded Q’s
    preloadedQuestions.forEach(q => {
      setTimeout(() => {
        addMessage(q.text, 'user', q.user);
        // optional: show "Selina is typing..."
        setTimeout(() => {
          typingEl.textContent = "Selina is typing...";
          const randomDelay = Math.random() * 10000 + 10000; // 10-20s
          setTimeout(() => {
            typingEl.textContent = "";
          }, randomDelay);
        }, 1000);
      }, q.time * 1000);
    });

    // Show investment notifications
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
    const investmentInt = setInterval(() => {
      showInvestmentNotification();
    }, Math.random() * 30000 + 30000); // 30-60s

    // Update viewer count
    let currentViewers = 41;
    const viewerInt = setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      currentViewers = Math.max(40, Math.min(50, currentViewers + change));
      const vCount = document.getElementById('viewerCount');
      if (vCount) {
        vCount.textContent = `${currentViewers} watching`;
      }
    }, 5000);

    // Show special offer after 60s
    setTimeout(() => {
      specialOfferEl.style.display = 'block';
      addMessage(
        "🚨 Special Offer Alert! For the next 10 minutes only, secure your spot in PrognosticAI for just $999. Don't miss out! 🚀",
        "system"
      );
      let t = 600;
      const countdownInt = setInterval(() => {
        t--;
        const min = Math.floor(t / 60);
        const sec = t % 60;
        countdownEl.textContent = `Special Offer Ends In: ${min}:${sec
          .toString()
          .padStart(2, '0')}`;
        if (t <= 0) {
          clearInterval(countdownInt);
          specialOfferEl.style.display = 'none';
          addMessage("⌛ The special offer has ended.", "system");
        }
      }, 1000);
    }, 60000);

    // Invest button
    investBtn.addEventListener('click', () => {
      window.location.href = "https://yes.prognostic.ai";
    });

    // If user sends a message
    async function handleUserMessage(msg: string) {
      try {
        // Simulate random delay
        const randomDelay = Math.random() * 4000;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        typingEl.textContent = "Selina is typing...";

        const response = await fetch("https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg, type: "user" })
        });
        if (!response.ok) throw new Error("API call failed");

        const data = await response.json();
        typingEl.textContent = "";
        if (data.response) {
          addMessage(data.response, "host", "Selina (Host)");
        }
      } catch (err) {
        console.error("Error:", err);
        typingEl.textContent = "";
        addMessage(
          "Apologies, I'm having trouble connecting. Please try again!",
          "host",
          "Selina (Host)"
        );
      }
    }

    function handleKeypress(e: KeyboardEvent) {
      if (e.key === 'Enter' && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(userMsg, 'user', 'You');
        handleUserMessage(userMsg);
      }
    }
    inputEl.addEventListener('keypress', handleKeypress);

    // Cleanup
    return () => {
      chatEl.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggleChange);
      inputEl.removeEventListener('keypress', handleKeypress);

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      clearInterval(investmentInt);
      clearInterval(viewerInt);
    };
  }, []);

  return (
    <div className={styles.chatSection}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerTop}>
          <span className={styles.chatTitle}>Live Chat</span>
          <div className={styles.toggleContainer}>
            <label className={styles.toggleSwitch}>
              <input type="checkbox" ref={participantToggleRef} />
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
      <div className={styles.specialOffer} ref={specialOfferRef}>
        <div className={styles.countdown} ref={countdownRef}>
          Special Offer Ends In: 10:00
        </div>
        <button className={styles.investButton} ref={investButtonRef}>
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
        <div
          className={styles.typingIndicator}
          ref={typingIndicatorRef}
        />
      </div>
    </div>
  );
};

export default WebinarView;

import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css';

/* 
  A file-level global so we can track if the user is scrolling up 
  in the chat. (Same as before, but carefully used in helper fns.)
*/
let isUserScrolling = false;

/** ===================
 *  1) HELPER FUNCTIONS
 *  =================== **/

/** 
 * Check if user is near bottom of a scrollable div
 * Accepts HTMLDivElement | null for safety.
 */
function isNearBottom(element: HTMLDivElement | null): boolean {
  if (!element) return false;
  const threshold = 50;
  return (element.scrollHeight - element.clientHeight - element.scrollTop) <= threshold;
}

/**
 * Scroll to bottom of a scrollable div safely.
 */
function scrollToBottom(element: HTMLDivElement | null): void {
  if (!element) return;
  element.scrollTop = element.scrollHeight;
}

/**
 * Safely add a message <div> into the chatEl. 
 * If chatEl or toggleEl is null, we just bail out.
 */
function addMessage(
  chatEl: HTMLDivElement | null,
  toggleEl: HTMLInputElement | null,
  text: string,
  type: 'user' | 'host' | 'system',
  userName = ''
): void {
  if (!chatEl || !toggleEl) return;

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

  // For participant messages, hide if toggle is off
  if (type === 'user' && userName !== 'You') {
    messageDiv.setAttribute('data-participant', 'true');
    messageDiv.setAttribute('data-auto-generated', 'true');
    if (!toggleEl.checked) {
      messageDiv.style.display = 'none';
    }
  }

  chatEl.appendChild(messageDiv);

  // Auto-scroll if near bottom or user = 'You'
  if (!isUserScrolling || userName === 'You') {
    scrollToBottom(chatEl);
  }
}

/** =========================
 * 2) MAIN COMPONENT: WebinarView
 * ========================= **/
const WebinarView: React.FC = () => {
  // Refs for <video> and <audio> elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // iPhone message tone
  const messageToneRef = useRef<HTMLAudioElement>(null);

  // Track if user has unmuted
  const [hasInteracted, setHasInteracted] = useState(false);

  // Show "Connecting..." overlay for 2 seconds
  const [connecting, setConnecting] = useState(true);

  // "Live for X minutes"
  const [liveMinutes, setLiveMinutes] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // AI-generated exit message
  const [exitMessage, setExitMessage] = useState('');
  const defaultExitMessage = "Wait! Are you sure you want to leave?";
  // Whether the exit overlay is currently visible
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  // Whether we have already shown the overlay once
  const [hasShownOverlay, setHasShownOverlay] = useState(false);

  // For the "clock widget" & "replay overlay"
  const [clockVisible, setClockVisible] = useState(false);
  const [clockAnimationTriggered, setClockAnimationTriggered] = useState(false);
  const clockIntervalRef = useRef<number | null>(null);
  const movementIntervalRef = useRef<number | null>(null);

  // 1) Warn user if they try to refresh
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue =
        "The webinar is currently full. If you reload, you might lose your spot. Are you sure you want to refresh?";
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 2) On mount, fetch user’s data + start "Connecting..." spinner
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('user_email');

    if (userEmail) {
      // Fetch audio_link + exit_message
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

          // Personalized audio link
          if (data.audio_link && audioRef.current) {
            audioRef.current.src = data.audio_link;
          }

          // AI-generated exit message
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

    // Show "Connecting..." for 2s
    const timer = setTimeout(() => {
      setConnecting(false);
      startTimeRef.current = Date.now();

      // Attempt auto-play
      videoRef.current?.play().catch(err => {
        console.log('Auto-play prevented; user must click overlay', err);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 3) "Live for X minutes" timer
  useEffect(() => {
    if (!connecting && startTimeRef.current) {
      const intervalId = setInterval(() => {
        const diff = Date.now() - startTimeRef.current!;
        setLiveMinutes(Math.floor(diff / 60000));
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [connecting]);

  // 4) Play personalized audio at 3s
  useEffect(() => {
    if (connecting) return;
    const videoEl = videoRef.current;
    const audioEl = audioRef.current;
    if (!videoEl || !audioEl) return;

    function handleTimeUpdate() {
      if (videoEl.currentTime >= 3) {
        audioEl
          .play()
          .catch(err => console.error('Error starting personalized audio playback:', err));
        videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      }
    }

    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [connecting]);

  // 5) Mouse-based "exit intent" overlay
  useEffect(() => {
    if (connecting) return;

    function handleMouseMove(e: MouseEvent) {
      if (hasShownOverlay) return;
      const threshold = window.innerHeight * 0.1;
      if (e.clientY < threshold) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);
        messageToneRef.current?.play().catch(err =>
          console.warn('iMessage tone autoplay blocked:', err)
        );
      }
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [connecting, hasShownOverlay]);

  // 6) Clock Widget triggers at 10s
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    function handleClockVideoTime() {
      if (videoEl.currentTime >= 10 && !clockAnimationTriggered) {
        setClockAnimationTriggered(true);
        setClockVisible(true); // "dragIn"

        // Start clock updates
        clockIntervalRef.current = window.setInterval(() => {
          // Force re-render by toggling state
          setClockVisible(prev => prev);
        }, 1000);

        // Keep clock for 10s + anim, then "dragOut"
        setTimeout(() => {
          if (movementIntervalRef.current) {
            window.clearInterval(movementIntervalRef.current);
          }
          setClockVisible(false);
          if (clockIntervalRef.current) {
            window.clearInterval(clockIntervalRef.current);
          }
        }, 10000 + 1300);
      }
    }
    videoEl.addEventListener('timeupdate', handleClockVideoTime);
    return () => {
      videoEl?.removeEventListener('timeupdate', handleClockVideoTime);
    };
  }, [clockAnimationTriggered]);

  // 7) Replay Overlay
  const [showReplay, setShowReplay] = useState(false);
  function handleReplay() {
    setShowReplay(false);
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    setClockAnimationTriggered(false);
    setClockVisible(false);
    vid.play().catch(err => console.log('Replay error:', err));
  }
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    function onEnded() {
      setShowReplay(true);
    }
    videoEl.addEventListener('ended', onEnded);
    return () => {
      videoEl.removeEventListener('ended', onEnded);
    };
  }, []);

  // 8) Exit overlay click
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      setShowExitOverlay(false);
    }
  }

  // Clock widget text
  const now = new Date();
  const clockTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const clockDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

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

      {/* REPLAY OVERLAY */}
      {showReplay && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            color: '#fff',
            zIndex: 9999
          }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '10px' }}>
            Webinar Ended
          </h2>
          <button
            style={{
              background: '#fff',
              color: '#0142ac',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              fontSize: '1rem',
              letterSpacing: '-0.02em'
            }}
            onClick={handleReplay}
          >
            Watch Instant Replay
          </button>
          <button
            style={{
              background: '#0142ac',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              fontSize: '1rem',
              letterSpacing: '-0.02em'
            }}
          >
            Invest $999 Now
          </button>
        </div>
      )}

      {/* TOP BAR INSIDE THE ZOOM-LIKE CONTAINER */}
      <div className={styles.zoomTopBar}>
        <div className={styles.zoomTitle}>
          <div className={styles.zoomLiveDot}></div>
          PrognosticAI Advanced Training
        </div>
        <div className={styles.zoomLiveMinutes}>
          Live for {liveMinutes} minute{liveMinutes !== 1 ? 's' : ''}
        </div>
      </div>

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
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* Sound Overlay */}
            {!hasInteracted && (
              <div
                className={styles.soundOverlay}
                onClick={() => {
                  const vid = videoRef.current;
                  if (vid) {
                    vid.muted = false;
                    vid.play().catch(err =>
                      console.log('User clicked to play, but error:', err)
                    );
                  }
                  setHasInteracted(true);
                }}
              >
                <div className={styles.soundIcon}>🔊</div>
                <div className={styles.soundText}>
                  Click to enable sound<br />(and start the webinar)
                </div>
              </div>
            )}

            {/* CLOCK WIDGET */}
            {clockAnimationTriggered && (
              <div
                id="clockWidget"
                style={{
                  position: 'absolute',
                  width: '320px',
                  background: 'rgba(255, 255, 255, 0.98)',
                  borderRadius: '10px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  zIndex: 3,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  top: '40%',
                  left: '45%',
                  pointerEvents: 'none',
                  transition: 'transform 1.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: clockVisible
                    ? 'translate(0, 0)' 
                    : 'translate(200%, 10%)'
                }}
              >
                <div
                  style={{
                    background: '#f5f5f7',
                    height: '28px',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                    position: 'relative',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px', position: 'absolute', left: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }}></div>
                  </div>
                  <div style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#3f3f3f',
                    fontWeight: 500
                  }}>
                    Clock Widget
                  </div>
                </div>
                <div style={{
                  padding: '20px',
                  background: '#ffffff',
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    fontSize: '2.4rem',
                    fontWeight: 500,
                    color: '#1d1d1f',
                    marginBottom: '4px',
                    textAlign: 'center'
                  }}>
                    {clockTime}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#86868b',
                    fontWeight: 400,
                    textAlign: 'center'
                  }}>
                    {clockDate}
                  </div>
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

      <footer className={styles.footer}>
        © {new Date().getFullYear()} PrognosticAI
      </footer>
    </div>
  );
};

/** 
 * 3) The WebinarChatBox component 
 *    (fully typed and restructured)
 */
const WebinarChatBox: React.FC = () => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const typingIndicatorRef = useRef<HTMLDivElement>(null);
  const participantToggleRef = useRef<HTMLInputElement>(null);
  const specialOfferRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const investButtonRef = useRef<HTMLButtonElement>(null);

  const socketRef = useRef<WebSocket | null>(null);

  // Some sample data arrays
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
    {time:180,  text:"How does this integrate with existing business systems?",user:"Michael"},
    {time:300,  text:"Can you explain more about the AI capabilities?",user:"Sarah"},
    {time:450,  text:"Does this work with Zapier?",user:"David"},
    {time:600,  text:"What kind of ROI can we expect?",user:"Rachel"},
    {time:750,  text:"How long does implementation typically take?",user:"James"},
    {time:900,  text:"This is incredible! Can't believe the accuracy levels 🔥",user:"Emma"},
    {time:1200, text:"Do you offer enterprise solutions?",user:"Thomas"},
    {time:1500, text:"Just amazing how far AI has come!",user:"Lisa"},
    {time:1800, text:"What about data security?",user:"Alex"},
    {time:2100, text:"Can small businesses benefit from this?",user:"Jennifer"},
    {time:2400, text:"The predictive analytics are mind-blowing!",user:"Daniel"},
    {time:2700, text:"How often do you release updates?",user:"Sophie"},
    {time:3000, text:"Wow, the demo exceeded my expectations!",user:"Ryan"},
    {time:3300, text:"What makes PrognosticAI different from competitors?",user:"Maria"}
  ];

  useEffect(() => {
    /** Gather all references */
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;
    const specialOfferEl = specialOfferRef.current;
    const countdownEl = countdownRef.current;
    const investBtn = investButtonRef.current;

    /** If any are missing, skip the rest. This kills "possibly null" errors. */
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

    /** On scroll, check if user scrolled away from bottom */
    function handleScroll() {
      isUserScrolling = !isNearBottom(chatEl);
    }

    /** Toggle participant messages on/off */
    function handleToggleChange(e: Event) {
      const target = e.currentTarget as HTMLInputElement;
      const participantMessages = chatEl.querySelectorAll('[data-participant="true"]');
      participantMessages.forEach(msg => {
        (msg as HTMLElement).style.display = target.checked ? 'block' : 'none';
      });
      if (target.checked && !isUserScrolling) {
        scrollToBottom(chatEl);
      }
    }

    /** If user sends a real message => fetch AI response */
    async function handleUserMessage(msg: string) {
      try {
        // Simulate 'Selina is typing...'
        typingEl.textContent = "Selina is typing...";
        const randomDelay = Math.random() * 4000;
        await new Promise(resolve => setTimeout(resolve, randomDelay));

        const response = await fetch("https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg, type: "user" })
        });
        if (!response.ok) throw new Error("API call failed");

        const data = await response.json();
        typingEl.textContent = "";

        if (data.response) {
          addMessage(chatEl, toggleEl, data.response, "host", "Selina (Host)");
        }
      } catch (err) {
        console.error("Error:", err);
        typingEl.textContent = "";
        addMessage(
          chatEl,
          toggleEl,
          "Apologies, I'm having trouble connecting. Please try again!",
          "host",
          "Selina (Host)"
        );
      }
    }

    /** Keypress handler for user input */
    function handleKeypress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        e.preventDefault();
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(chatEl, toggleEl, userMsg, "user", "You");
        handleUserMessage(userMsg);
      }
    }

    // Attach event listeners
    chatEl.addEventListener('scroll', handleScroll);
    toggleEl.addEventListener('change', handleToggleChange);
    inputEl.addEventListener('keypress', handleKeypress);

    /** Connect WebSocket */
    const newSocket = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log("Connected to chat server");
    };
    newSocket.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        addMessage(
          chatEl,
          toggleEl,
          data.text,
          data.messageType as 'user' | 'host' | 'system',
          data.user
        );
      }
    };
    newSocket.onerror = error => {
      console.error("WebSocket error:", error);
    };

    /** Show a welcome message + schedule random attendee messages */
    function scheduleAttendeeMessages() {
      const numMessages = Math.floor(Math.random() * 6) + 15;
      let delay = 500;
      for (let i = 0; i < numMessages; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const msg = attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        setTimeout(() => {
          addMessage(chatEl, toggleEl, msg, 'user', name);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }
    setTimeout(() => {
      addMessage(
        chatEl,
        toggleEl,
        "Welcome to the PrognosticAI Advanced Training! 👋 Let us know where you're joining from!",
        'host',
        'Selina (Host)'
      );
      scheduleAttendeeMessages();
    }, 2000);

    // Preloaded Q&A
    preloadedQuestions.forEach(q => {
      setTimeout(() => {
        addMessage(chatEl, toggleEl, q.text, 'user', q.user);
        // "Selina is typing..." simulation
        setTimeout(() => {
          typingEl.textContent = "Selina is typing...";
          const randomDelay = Math.random() * 10000 + 10000;
          setTimeout(() => {
            typingEl.textContent = "";
          }, randomDelay);
        }, 1000);
      }, q.time * 1000);
    });

    // Random investment notifications
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
    const investInterval = setInterval(() => {
      showInvestmentNotification();
    }, Math.random() * 30000 + 30000);

    // Viewer count
    let currentViewers = 41;
    const viewerInterval = setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      currentViewers = Math.max(40, Math.min(50, currentViewers + change));
      const vCount = document.getElementById('viewerCount');
      if (vCount) {
        vCount.textContent = `${currentViewers} watching`;
      }
    }, 5000);

    // Special offer after 60s
    setTimeout(() => {
      specialOfferEl.style.display = "block";
      addMessage(
        chatEl,
        toggleEl,
        "🚨 Special Offer Alert! For the next 10 minutes only, secure your spot in PrognosticAI for just $999. Don't miss out! 🚀",
        "system"
      );
      let t = 600; // 10 minutes
      const countdownInt = setInterval(() => {
        t--;
        const min = Math.floor(t / 60);
        const sec = t % 60;
        countdownEl.textContent = `Special Offer Ends In: ${min}:${sec.toString().padStart(2, "0")}`;
        if (t <= 0) {
          clearInterval(countdownInt);
          specialOfferEl.style.display = "none";
          addMessage(chatEl, toggleEl, "⌛ The special offer has ended.","system");
        }
      }, 1000);
    }, 60000);

    // Invest button
    investBtn.addEventListener('click', () => {
      window.location.href = "https://yes.prognostic.ai";
    });

    // Cleanup on unmount
    return () => {
      chatEl.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggleChange);
      inputEl.removeEventListener('keypress', handleKeypress);
      clearInterval(investInterval);
      clearInterval(viewerInterval);

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  // Original return with all your existing structure
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
        <button className={styles.investButton} id="investButton" ref={investButtonRef}>
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
        <div
          className={styles.typingIndicator}
          id="typingIndicator"
          ref={typingIndicatorRef}
        ></div>
      </div>
    </div>
  );
};

export default WebinarView;

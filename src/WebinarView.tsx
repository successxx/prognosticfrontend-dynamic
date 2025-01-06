import React, { useState, useRef, useEffect } from 'react';
import styles from './WebinarView.module.css';

// A small global to track chat scrolling:
let isUserScrolling = false;

/**  
 * Utility #1: Scroll to bottom of a div (if not null).
 */
const smartScrollToBottom = (el: HTMLDivElement | null) => {
  if (!el) return;
  el.scrollTop = el.scrollHeight;
};

/**  
 * Utility #2: Check if user is near bottom of the chat container.
 */
const nearBottom = (el: HTMLDivElement | null, threshold = 50) => {
  if (!el) return false;
  return el.scrollHeight - el.clientHeight - el.scrollTop <= threshold;
};

/**  
 * Utility #3: Insert a message block into the chat area.
 */
const insertMessage = (
  container: HTMLDivElement | null,
  toggle: HTMLInputElement | null,
  text: string,
  senderType: 'user' | 'host' | 'system',
  senderName?: string
) => {
  if (!container || !toggle) return;

  const div = document.createElement('div');
  div.classList.add(styles.message);

  if (senderType === 'user') {
    div.classList.add('user');
  } else if (senderType === 'host') {
    div.classList.add('host');
  } else if (senderType === 'system') {
    div.classList.add('system');
  }

  const namePrefix = senderName ? `${senderName}: ` : '';
  div.textContent = namePrefix + text;

  // If it's another participant's message, optionally hide it.
  if (senderType === 'user' && senderName !== 'You') {
    div.setAttribute('data-participant', 'true');
    div.setAttribute('data-auto-generated', 'true');
    if (!toggle.checked) {
      div.style.display = 'none';
    }
  }

  container.appendChild(div);

  // If near the bottom or if it's your own message, auto-scroll down.
  if (!isUserScrolling || senderName === 'You') {
    smartScrollToBottom(container);
  }
};

const WebinarView: React.FC = () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // 1) State: "connecting" overlay
  // ─────────────────────────────────────────────────────────────────────────────
  const [connecting, setConnecting] = useState(true);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) Refs for video, audio, and the start time (for "Live X minutes")
  // ─────────────────────────────────────────────────────────────────────────────
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const personalAudioRef = useRef<HTMLAudioElement | null>(null);
  const userHasUnmuted = useRef(false);

  const [liveMinutes, setLiveMinutes] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) "Exit Intent" overlay logic
  // ─────────────────────────────────────────────────────────────────────────────
  const [exitVisible, setExitVisible] = useState(false);
  const [alreadyShownExit, setAlreadyShownExit] = useState(false);

  // We'll store a custom exit message if it exists. Otherwise we default:
  const [exitMessage, setExitMessage] = useState('');
  const defaultExit = "Wait! Are you sure you want to leave?";

  // Tone for "exit intent" text bubble
  const iPhoneToneRef = useRef<HTMLAudioElement | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) Replay overlay
  // ─────────────────────────────────────────────────────────────────────────────
  const [showReplay, setShowReplay] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) "Clock widget" demo
  // ─────────────────────────────────────────────────────────────────────────────
  const [clockIn, setClockIn] = useState(false);        // If the clock slides in
  const [clockActive, setClockActive] = useState(false); // Keep it active for X

  // ─────────────────────────────────────────────────────────────────────────────
  // On mount: 
  //   - (A) show "connecting" overlay for 2 seconds
  //   - (B) fetch personalized data if user_email is present
  //   - (C) set up the "beforeunload" listener
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Warn if user tries to refresh or close:
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "The webinar is currently full. Reloading might lose your spot. Are you sure?";
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Grab user_email param (if present), call a backend to fetch audio and exit msg
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('user_email');
    if (userEmail) {
      fetch(
        `https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(
          userEmail
        )}`
      )
        .then(async (res) => {
          if (!res.ok) {
            console.error('Failed to fetch user data:', res.statusText);
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data?.audio_link && personalAudioRef.current) {
            personalAudioRef.current.src = data.audio_link;
          }
          if (data?.exit_message) {
            setExitMessage(data.exit_message);
          }
        })
        .catch((err) => console.error('Error loading personalized data:', err));
    }

    // Show connecting overlay for 2s
    const connectTimer = setTimeout(() => {
      setConnecting(false);
      startTimeRef.current = Date.now();

      // Attempt to autoplay the main video
      mainVideoRef.current?.play().catch((err) => {
        console.log('Autoplay blocked. User must manually enable sound:', err);
      });
    }, 2000);

    return () => {
      clearTimeout(connectTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // "Live X minutes" logic: once we’re out of "connecting," start counting
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (connecting) return;
    if (!startTimeRef.current) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current!;
      setLiveMinutes(Math.floor(elapsed / 60000));
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, [connecting]);

  // ─────────────────────────────────────────────────────────────────────────────
  // At time 3s in the video, play personalized audio (if any).
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (connecting) return;
    const vid = mainVideoRef.current;
    const audio = personalAudioRef.current;
    if (!vid || !audio) return;

    const checkForAudio = () => {
      if (vid.currentTime >= 3) {
        audio.play().catch((err) => {
          console.log('Personalized audio blocked:', err);
        });
        vid.removeEventListener('timeupdate', checkForAudio);
      }
    };
    vid.addEventListener('timeupdate', checkForAudio);

    return () => {
      vid.removeEventListener('timeupdate', checkForAudio);
    };
  }, [connecting]);

  // ─────────────────────────────────────────────────────────────────────────────
  // At time ~10s, show the "clock widget" for ~10 seconds
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const vid = mainVideoRef.current;
    if (!vid) return;
    const watchTime = () => {
      if (vid.currentTime >= 10 && !clockActive) {
        setClockActive(true);
        setClockIn(true);

        // Keep the clock "alive" so it updates every second
        const clockTimer = setInterval(() => {
          // Force rerender every second by toggling clockIn
          setClockIn((prev) => prev);
        }, 1000);

        // Let it appear for 10s, then animate out
        setTimeout(() => {
          clearInterval(clockTimer);
          setClockIn(false);
          setTimeout(() => {
            setClockActive(false);
          }, 1300); // wait for the "slide out"
        }, 10000 + 300);
      }
    };
    vid.addEventListener('timeupdate', watchTime);

    return () => {
      vid.removeEventListener('timeupdate', watchTime);
    };
  }, [clockActive]);

  // ─────────────────────────────────────────────────────────────────────────────
  // When the video ends, show "Replay overlay"
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const vid = mainVideoRef.current;
    if (!vid) return;
    const handleEnded = () => {
      setShowReplay(true);
    };
    vid.addEventListener('ended', handleEnded);

    return () => {
      vid.removeEventListener('ended', handleEnded);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Exit-intent detection: track mouse. If user moves near top, show overlay 
  // once (if not already shown).
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (connecting) return;
    const sniffMouse = (evt: MouseEvent) => {
      if (alreadyShownExit) return; 
      const threshold = window.innerHeight * 0.1;
      if (evt.clientY < threshold) {
        setExitVisible(true);
        setAlreadyShownExit(true);
        iPhoneToneRef.current?.play().catch((err) =>
          console.log('iMessage tone blocked by browser:', err)
        );
      }
    };
    window.addEventListener('mousemove', sniffMouse);
    return () => {
      window.removeEventListener('mousemove', sniffMouse);
    };
  }, [connecting, alreadyShownExit]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Handler for user clicking the "sound overlay."
  // ─────────────────────────────────────────────────────────────────────────────
  const handleEnableSound = () => {
    const vid = mainVideoRef.current;
    if (vid && !userHasUnmuted.current) {
      vid.muted = false;
      vid.play().catch((err) => console.log('Video play error:', err));
      userHasUnmuted.current = true;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Handler for user clicking the replay button
  // ─────────────────────────────────────────────────────────────────────────────
  const handleReplay = () => {
    setShowReplay(false);
    const vid = mainVideoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch((err) => console.log('Replay attempt blocked:', err));
      setClockActive(false);
      setClockIn(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // For "clock widget," let's define the displayed time.
  // ─────────────────────────────────────────────────────────────────────────────
  const now = new Date();
  const clockTime = now.toLocaleTimeString('en-US', { hour12: true });
  const clockDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={styles.zoomContainer}>
      {/* iPhone beep for exit-intent */}
      <audio
        ref={iPhoneToneRef}
        src="https://cdn.freesound.org/previews/613/613258_5674468-lq.mp3"
        style={{ display: 'none' }}
      />
      {/* Personalized audio */}
      <audio ref={personalAudioRef} style={{ display: 'none' }} />

      {/* "Connecting" overlay */}
      {connecting && (
        <div className={styles.connectingOverlay}>
          <div className={styles.connectingBox}>
            <div className={styles.connectingSpinner}></div>
            <div className={styles.connectingText}>Connecting...</div>
          </div>
        </div>
      )}

      {/* Exit-intent overlay */}
      {exitVisible && (
        <div
          className={styles.exitOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setExitVisible(false);
          }}
        >
          <div className={styles.iphoneMessageBubble}>
            <button
              className={styles.exitCloseBtn}
              onClick={() => setExitVisible(false)}
            >
              ×
            </button>
            <div className={styles.iphoneSender}>Selina</div>
            <div className={styles.iphoneMessageText}>
              {exitMessage?.trim().length ? exitMessage : defaultExit}
            </div>
          </div>
        </div>
      )}

      {/* Replay overlay */}
      {showReplay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            color: '#fff',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16
          }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '10px' }}>
            Webinar Ended
          </h2>
          <button
            style={{
              background: '#fff',
              color: '#0142ac',
              padding: '14px 24px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              fontSize: '1rem'
            }}
            onClick={handleReplay}
          >
            Watch Instant Replay
          </button>
          <button
            style={{
              background: '#0142ac',
              color: '#fff',
              padding: '14px 24px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              fontSize: '1rem'
            }}
          >
            Invest $999 Now
          </button>
        </div>
      )}

      {/* Top bar with Title + "Live for X minutes" */}
      <div className={styles.zoomTopBar}>
        <div className={styles.zoomTitle}>
          <div className={styles.zoomLiveDot}></div>
          PrognosticAI Advanced Training
        </div>
        <div className={styles.zoomLiveMinutes}>
          Live for {liveMinutes} minute{liveMinutes !== 1 ? 's' : ''}
        </div>
      </div>

      {/* 70/30 layout: video vs chat */}
      <div className={styles.twoColumnLayout}>
        {/* Left: Video */}
        <div className={styles.videoColumn}>
          <div className={styles.videoWrapper}>
            <video
              ref={mainVideoRef}
              muted={true} // starts muted until user clicks
              style={{ width: '100%', height: '100%' }}
              playsInline
              controls={false}
            >
              <source
                src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* If user hasn't unmuted yet, show an overlay to enable sound */}
            {!userHasUnmuted.current && (
              <div className={styles.soundOverlay} onClick={handleEnableSound}>
                <div className={styles.soundIcon}>🔊</div>
                <div className={styles.soundText}>
                  Click to enable sound
                  <br />
                  (and start the webinar)
                </div>
              </div>
            )}

            {/* Clock widget (slides in/out) */}
            {clockActive && (
              <div
                style={{
                  position: 'absolute',
                  top: '35%',
                  left: '45%',
                  width: 320,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.98)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  pointerEvents: 'none',
                  transition: 'transform 1.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: clockIn ? 'translate(0,0)' : 'translate(200%, 10%)'
                }}
              >
                {/* Fake title bar */}
                <div
                  style={{
                    height: 28,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    background: '#f5f5f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    position: 'relative'
                  }}
                >
                  {/* Dots on top-left */}
                  <div style={{ position: 'absolute', left: 10, display: 'flex', gap: 6 }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#ff5f57'
                      }}
                    ></div>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#febc2e'
                      }}
                    ></div>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#28c840'
                      }}
                    ></div>
                  </div>
                  <span style={{ fontSize: 13, color: '#3f3f3f', fontWeight: 500 }}>
                    Clock Widget
                  </span>
                </div>
                {/* Main clock content */}
                <div
                  style={{
                    padding: 20,
                    background: '#fff',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <div style={{ fontSize: '2.4rem', color: '#1d1d1f', fontWeight: 500 }}>
                    {clockTime}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#86868b', fontWeight: 400 }}>
                    {clockDate}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat */}
        <div className={styles.chatColumn}>
          <ChatSection />
        </div>
      </div>

      {/* The global footer */}
      <footer className={styles.footer}>© {new Date().getFullYear()} PrognosticAI</footer>
    </div>
  );
};

/**
 * ChatSection: an isolated component for the entire chat system.
 */
const ChatSection: React.FC = () => {
  // Refs: chat container, input, "typing..." display, etc.
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const showOthersRef = useRef<HTMLInputElement | null>(null);
  const specialOfferRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const investBtnRef = useRef<HTMLButtonElement | null>(null);

  // For scheduling random messages + notifications
  const socketRef = useRef<WebSocket | null>(null);

  // Random name pools:
  const randomNames = [
    'Emma','Liam','Olivia','Noah','Ava','Ethan','Sophia','Mason','Isabella','William',
    'Mia','James','Charlotte','Benjamin','Amelia','Lucas','Harper','Henry','Evelyn','Alexander'
  ];
  const randomInvestTexts = [
    'just invested in PrognosticAI! 🚀',
    'secured their spot in PrognosticAI! ✨',
    'joined the PrognosticAI family! 🎉',
    'made a smart investment! 💡',
    'is starting their AI journey with us! 🌟',
    'got early access to PrognosticAI! 🔥',
    'upgraded to PrognosticAI Pro! 💪',
    'joined our success story! ⭐'
  ];
  const randomMessages = [
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
  // Timed Q&A
  const timedQuestions = [
    { time: 180, text: "How does this integrate with existing business systems?", user: "Michael" },
    { time: 300, text: "Can you explain more about the AI capabilities?", user: "Sarah" },
    { time: 450, text: "Does this work with Zapier?", user: "David" },
    { time: 600, text: "What kind of ROI can we expect?", user: "Rachel" },
    { time: 750, text: "How long does implementation typically take?", user: "James" },
    { time: 900, text: "This is incredible! Can't believe the accuracy levels 🔥", user: "Emma" },
    { time: 1200, text: "Do you offer enterprise solutions?", user: "Thomas" },
    { time: 1500, text: "Just amazing how far AI has come!", user: "Lisa" },
    { time: 1800, text: "What about data security?", user: "Alex" },
    { time: 2100, text: "Can small businesses benefit from this?", user: "Jennifer" },
    { time: 2400, text: "The predictive analytics are mind-blowing!", user: "Daniel" },
    { time: 2700, text: "How often do you release updates?", user: "Sophie" },
    { time: 3000, text: "Wow, the demo exceeded my expectations!", user: "Ryan" },
    { time: 3300, text: "What makes PrognosticAI different from competitors?", user: "Maria" }
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // On mount, set up everything:
  //  - WebSocket
  //  - Random chat messages
  //  - Show "special offer" after 60s with countdown
  //  - etc.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const chatEl = chatBoxRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = showOthersRef.current;
    const offerEl = specialOfferRef.current;
    const cdownEl = countdownRef.current;
    const investEl = investBtnRef.current;

    // If any key elements are missing, bail early.
    if (!chatEl || !inputEl || !typingEl || !toggleEl || !offerEl || !cdownEl || !investEl) {
      console.error('[ChatSection] Missing required refs. Chat might not function properly.');
      return;
    }

    // On scroll, figure out if user has scrolled away from bottom
    const handleScroll = () => {
      isUserScrolling = !nearBottom(chatEl);
    };
    chatEl.addEventListener('scroll', handleScroll);

    // Toggling "Show Others" hides/shows participant messages
    const handleToggle = () => {
      const participantMsgs = chatEl.querySelectorAll('[data-participant="true"]');
      participantMsgs.forEach((m) => {
        (m as HTMLElement).style.display = toggleEl.checked ? 'block' : 'none';
      });
      if (toggleEl.checked && !isUserScrolling) smartScrollToBottom(chatEl);
    };
    toggleEl.addEventListener('change', handleToggle);

    // Keypress: handle user hitting Enter => send user message
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && inputEl.value.trim()) {
        e.preventDefault();
        const userInput = inputEl.value.trim();
        inputEl.value = '';
        insertMessage(chatEl, toggleEl, userInput, 'user', 'You');
        startAiResponse(userInput);
      }
    };
    inputEl.addEventListener('keypress', handleKey);

    // Simulate a welcome message after 2s, plus random attendee messages
    setTimeout(() => {
      insertMessage(
        chatEl,
        toggleEl,
        "Welcome to the PrognosticAI Advanced Training! 👋 Let us know where you're joining from!",
        'host',
        'Selina (Host)'
      );
      scheduleRandomAttendees();
    }, 2000);

    // Setup timed Q&A from the "timedQuestions" array
    timedQuestions.forEach((q) => {
      setTimeout(() => {
        insertMessage(chatEl, toggleEl, q.text, 'user', q.user);
        // fake "Selina is typing..."
        setTimeout(() => {
          typingEl.textContent = 'Selina is typing...';
          const randomDelay = Math.random() * 10000 + 10000;
          setTimeout(() => {
            typingEl.textContent = '';
          }, randomDelay);
        }, 1200);
      }, q.time * 1000);
    });

    // WebSocket for real-time chat
    const ws = new WebSocket('wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com');
    socketRef.current = ws;
    ws.onopen = () => console.log('[ChatSection] Socket connected.');
    ws.onerror = (err) => console.error('[ChatSection] Socket error:', err);
    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === 'message') {
        insertMessage(
          chatEl,
          toggleEl,
          data.text,
          data.messageType as 'user' | 'host' | 'system',
          data.user
        );
      }
    };

    // Show random "just invested!" notifications
    const investInterval = setInterval(() => {
      popInvestment();
    }, Math.random() * 30000 + 30000);

    // Virtual "viewer count"
    let viewers = 41;
    const viewerInterval = setInterval(() => {
      const delta = Math.random() < 0.5 ? -1 : 1;
      viewers = Math.min(50, Math.max(40, viewers + delta));
      const el = document.getElementById('viewerCount');
      if (el) el.textContent = `${viewers} watching`;
    }, 5000);

    // Show "specialOfferEl" after 60s, run a 10-minute countdown
    setTimeout(() => {
      offerEl.style.display = 'block';
      insertMessage(
        chatEl,
        toggleEl,
        "🚨 Special Offer Alert! For the next 10 minutes only, secure your spot in PrognosticAI for just $999. Don't miss out! 🚀",
        'system'
      );
      let timeLeft = 600; // 10 min
      const cdownInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        cdownEl.textContent = `Special Offer Ends In: ${minutes}:${seconds}`;
        if (timeLeft <= 0) {
          clearInterval(cdownInterval);
          offerEl.style.display = 'none';
          insertMessage(chatEl, toggleEl, "⌛ The special offer has ended.", 'system');
        }
      }, 1000);
    }, 60000);

    // Clicking "Invest $999 Now"
    investEl.addEventListener('click', () => {
      window.location.href = 'https://yes.prognostic.ai';
    });

    // Cleanup
    return () => {
      chatEl.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggle);
      inputEl.removeEventListener('keypress', handleKey);

      clearInterval(investInterval);
      clearInterval(viewerInterval);

      if (ws) ws.close();
    };

    // ───────────────────────────────────────────────────────────────────────────
    // Helper #1: schedule ~15-20 random attendee messages
    function scheduleRandomAttendees() {
      const num = Math.floor(Math.random() * 6) + 15;
      let next = 500;
      for (let i = 0; i < num; i++) {
        const name = randomNames[Math.floor(Math.random() * randomNames.length)];
        const msg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        setTimeout(() => {
          insertMessage(chatEl, toggleEl, msg, 'user', name);
        }, next);
        next += Math.random() * 1000 + 500;
      }
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Helper #2: Simulate AI response from the host
    async function startAiResponse(userMsg: string) {
      typingEl.textContent = 'Selina is typing...';
      const waitTime = 1500 + Math.random() * 2500; // 1.5s - 4s
      await new Promise((r) => setTimeout(r, waitTime));

      try {
        const res = await fetch(
          'https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg, type: 'user' })
          }
        );
        if (!res.ok) throw new Error('Chat API call failed');
        const data = await res.json();

        typingEl.textContent = '';
        if (data.response) {
          insertMessage(chatEl, toggleEl, data.response, 'host', 'Selina (Host)');
        }
      } catch (err) {
        typingEl.textContent = '';
        insertMessage(
          chatEl,
          toggleEl,
          "Oops! I'm having trouble responding right now. Please try again.",
          'host',
          'Selina (Host)'
        );
      }
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Helper #3: Random "investment" pop-up
    function popInvestment() {
      const name = randomNames[Math.floor(Math.random() * randomNames.length)];
      const line = randomInvestTexts[Math.floor(Math.random() * randomInvestTexts.length)];
      const n = document.createElement('div');
      n.classList.add(styles.notification);
      n.innerHTML = `
        <div class="${styles.notificationIcon}">🎉</div>
        <div><strong>${name}</strong> ${line}</div>
      `;
      document.body.appendChild(n);
      setTimeout(() => {
        n.remove();
      }, 5000);
    }
  }, []);

  return (
    <div className={styles.chatSection}>
      <div className={styles.chatHeader}>
        <div className={styles.headerTop}>
          <span className={styles.chatTitle}>Live Chat</span>
          <div className={styles.toggleContainer}>
            <label className={styles.toggleSwitch}>
              <input type="checkbox" ref={showOthersRef} />
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
        <button className={styles.investButton} ref={investBtnRef}>
          Invest $999 Now - Limited Time Offer
        </button>
      </div>

      <div className={styles.chatMessages} ref={chatBoxRef} />

      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Type your message here..."
          ref={messageInputRef}
        />
        <div className={styles.typingIndicator} ref={typingIndicatorRef} />
      </div>
    </div>
  );
};

export default WebinarView;

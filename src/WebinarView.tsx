import React, {
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react';
import { createPortal } from 'react-dom';
import styles from './WebinarView.module.css';

interface ChatMessage {
  text: string;
  type: 'user' | 'host' | 'system';
  userName?: string;
}

const WebinarView: React.FC = () => {
  // ------------------ Refs ------------------
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageToneRef = useRef<HTMLAudioElement | null>(null);

  // ------------------ States ------------------
  const [connecting, setConnecting] = useState(true);
  const [liveMinutes, setLiveMinutes] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Exit-intent overlay
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);

  // Replay overlay
  const [showReplayOverlay, setShowReplayOverlay] = useState(false);

  // Clock widget
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  const [currentTimeString, setCurrentTimeString] = useState('');
  const [currentDateObj, setCurrentDateObj] = useState<Date | null>(null);
  const clockIntervalRef = useRef<NodeJS.Timer | null>(null);

  // Personalized exit message
  const [exitMessage, setExitMessage] = useState('');

  // Start time for "Live for X minutes"
  const startTimeRef = useRef<number>(Date.now());

  // ------------------ Safe Audio Helper ------------------
  const safePlayAudio = useCallback(async (el: HTMLAudioElement | null) => {
    if (!el) return;
    try {
      await el.play();
    } catch (err) {
      // Some browsers block autoplay
      console.warn('Audio playback blocked:', err);
    }
  }, []);

  // =======================================================
  // 1) On Mount: fetch data, show "Connecting", etc.
  // =======================================================
  useEffect(() => {
    // If user tries to refresh
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "The webinar is currently full. If you reload, you might lose your spot.";
    }
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Check user_email param
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('user_email');

    // Attempt to fetch personalized audio + exit message
    if (userEmail) {
      (async () => {
        try {
          const resp = await fetch(
            `https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(
              userEmail
            )}`
          );
          if (!resp.ok) throw new Error('Failed to fetch user data');
          const data = await resp.json();
          // If we have an audio link, set it
          if (audioRef.current && data.audio_link) {
            audioRef.current.src = data.audio_link;
          }
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      })();
    }

    // "Connecting" overlay for 2s
    const connectingTimer = setTimeout(() => {
      setConnecting(false);
      startTimeRef.current = Date.now();

      // Force video autoplay
      if (videoRef.current) {
        videoRef.current
          .play()
          .catch((err) => console.warn('Autoplay blocked:', err));
      }
    }, 2000);

    return () => {
      clearTimeout(connectingTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [safePlayAudio]);

  // =======================================================
  // 2) "Live for X minutes" label
  // =======================================================
  useEffect(() => {
    if (!connecting) {
      const intervalId = setInterval(() => {
        const diff = Date.now() - startTimeRef.current;
        setLiveMinutes(Math.floor(diff / 60000));
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [connecting]);

  // =======================================================
  // 3) Personalized audio at 3s of the video
  // =======================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;

    function handleTimeUpdate() {
      // After 3s of the webinar video
      if (vid.currentTime >= 3) {
        safePlayAudio(audioRef.current);
        vid.removeEventListener('timeupdate', handleTimeUpdate);
      }
    }
    vid.addEventListener('timeupdate', handleTimeUpdate);
    return () => vid.removeEventListener('timeupdate', handleTimeUpdate);
  }, [safePlayAudio]);

  // =======================================================
  // 4) Exit-intent overlay
  // =======================================================
  useEffect(() => {
    if (hasShownOverlay) return;

    function handleMouseMove(e: MouseEvent) {
      const threshold = window.innerHeight * 0.1;
      if (e.clientY < threshold) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);
        safePlayAudio(messageToneRef.current);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasShownOverlay, safePlayAudio]);

  // =======================================================
  // 5) Replay overlay on video end
  // =======================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleEnded() {
      setShowReplayOverlay(true);
    }
    vid.addEventListener('ended', handleEnded);
    return () => vid.removeEventListener('ended', handleEnded);
  }, []);

  // =======================================================
  // 6) Clock widget logic (drag in at 10s, drag out after 10s)
  // =======================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function updateClock() {
      const now = new Date();
      setCurrentDateObj(now);
      setCurrentTimeString(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    }

    function startClockUpdates() {
      updateClock();
      clockIntervalRef.current = setInterval(updateClock, 1000);
    }

    function stopClockUpdates() {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
        clockIntervalRef.current = null;
      }
    }

    function handleTimeUpdate() {
      // Show clock widget at 10s
      if (vid.currentTime >= 10 && !showClockWidget && !clockRemoved) {
        setShowClockWidget(true);
        startClockUpdates();
      }
    }

    vid.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      vid.removeEventListener('timeupdate', handleTimeUpdate);
      stopClockUpdates();
    };
  }, [showClockWidget, clockRemoved]);

  // Once the widget "drags in," wait 10s, then drag it out
  useEffect(() => {
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // Once removed, hide fully after 1s
  useEffect(() => {
    if (clockRemoved) {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
        clockIntervalRef.current = null;
      }
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000);
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  // =======================================================
  // RENDER
  // =======================================================
  if (connecting) {
    return (
      <div className={styles.connectingOverlay}>
        <div className={styles.connectingBox}>
          <div className={styles.connectingSpinner}></div>
          <div className={styles.connectingText}>Connecting you now...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} /* #EAEFF3 background */>
      {/* Hidden audios */}
      <audio
        ref={messageToneRef}
        src="https://cdn.freesound.org/previews/613/613258_5674468-lq.mp3"
        style={{ display: 'none' }}
      />
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Exit Overlay */}
      {showExitOverlay &&
        createPortal(
          <ExitOverlay
            message={exitMessage}
            onClose={() => setShowExitOverlay(false)}
          />,
          document.body
        )}

      {/* Replay Overlay */}
      {showReplayOverlay && (
        <ReplayOverlay
          onReplay={() => {
            setShowReplayOverlay(false);
            const vid = videoRef.current;
            if (vid) {
              vid.currentTime = 0;
              vid.play().catch(() => {});
            }
            // Reset widget
            setShowClockWidget(false);
            setClockDragInComplete(false);
            setClockRemoved(false);
          }}
        />
      )}

      {/* Zoom-like Container (No extra white box behind it) */}
      <div className={styles.zoomContainer}>
        <div className={styles.zoomTopBar}>
          {/* Left side: LIVE + Title */}
          <div className={styles.zoomTitle}>
            <div className={styles.zoomLiveDot}></div>
            PrognosticAI Advanced Training
          </div>
          {/* Right side: smaller "Live for X minutes" */}
          <div className={styles.zoomLiveMinutes}>
            Live for {liveMinutes} minute{liveMinutes === 1 ? '' : 's'}
          </div>
        </div>

        {/* 70/30 layout */}
        <div className={styles.twoColumnLayout}>
          {/* Video column */}
          <div className={styles.videoColumn}>
            <div className={styles.videoWrapper}>
              {/* 
                Force aspect ratio 16:9 + autoPlay + controls={false}
                so it looks “live” 
              */}
              <video
                ref={videoRef}
                autoPlay
                muted={!hasInteracted}
                playsInline
                controls={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source
                  src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
                  type="video/mp4"
                />
                Your browser does not support HTML5 video.
              </video>

              {/* Sound overlay if user hasn't clicked yet */}
              {!hasInteracted && (
                <div
                  className={styles.soundOverlay}
                  onClick={() => {
                    setHasInteracted(true);
                    if (videoRef.current) {
                      videoRef.current.muted = false;
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                >
                  <div className={styles.soundIcon}>🔊</div>
                  <div className={styles.soundText}>Click to Enable Sound</div>
                </div>
              )}
            </div>
          </div>

          {/* Chat column */}
          <div className={styles.chatColumn}>
            <WebinarChatBox />
          </div>
        </div>
      </div>

      {/* Clock widget floating */}
      {showClockWidget && (
        <ClockWidget
          currentTime={currentTimeString}
          currentDate={currentDateObj}
          dragInComplete={clockDragInComplete}
          setDragInComplete={setClockDragInComplete}
          clockRemoved={clockRemoved}
        />
      )}

      {/* Subtle Copyright on background */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} PrognosticAI
      </footer>
    </div>
  );
};

// ------------------------------------------------------------------
// Exit Intent Bubble
// ------------------------------------------------------------------
const ExitOverlay: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => {
  const defaultMsg = "Wait! Are you sure you want to leave?";

  return (
    <div className={styles.exitOverlay} onClick={onClose}>
      <div
        className={styles.iphoneMessageBubble}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.exitCloseBtn} onClick={onClose}>
          ×
        </button>
        <div className={styles.iphoneSender}>Selina</div>
        <div className={styles.iphoneMessageText}>
          {message.trim().length > 0 ? message : defaultMsg}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Replay Overlay
// ------------------------------------------------------------------
const ReplayOverlay: React.FC<{
  onReplay: () => void;
}> = ({ onReplay }) => {
  return createPortal(
    <div className={styles.replayOverlay}>
      <h2 className={styles.replayTitle}>Webinar Ended</h2>
      <button className={styles.replayButton} onClick={onReplay}>
        Watch Instant Replay
      </button>
      {/* CTA in new tab */}
      <button
        className={styles.investButton}
        onClick={() => window.open('https://yes.prognostic.ai', '_blank')}
      >
        Invest $999 Now
      </button>
    </div>,
    document.body
  );
};

// ------------------------------------------------------------------
// Clock Widget
// ------------------------------------------------------------------
const ClockWidget: React.FC<{
  currentTime: string;
  currentDate: Date | null;
  dragInComplete: boolean;
  setDragInComplete: React.Dispatch<React.SetStateAction<boolean>>;
  clockRemoved: boolean;
}> = ({
  currentTime,
  currentDate,
  dragInComplete,
  setDragInComplete,
  clockRemoved
}) => {
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === styles.dragInKeyframeName) {
      setDragInComplete(true);
    }
  };

  const formattedDate = currentDate
    ? currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  let widgetClass = styles.clockWidget;
  if (!clockRemoved) {
    widgetClass += dragInComplete
      ? ` ${styles.wobble}`
      : ` ${styles.animateIn}`;
  } else {
    widgetClass += ` ${styles.animateOut}`;
  }

  return (
    <div className={widgetClass} onAnimationEnd={handleAnimationEnd}>
      <div className={styles.widgetHeader}>
        <div className={styles.windowControls}>
          <div className={`${styles.windowButton} ${styles.closeButton}`} />
          <div className={`${styles.windowButton} ${styles.minimizeButton}`} />
          <div className={`${styles.windowButton} ${styles.maximizeButton}`} />
        </div>
        <div className={styles.widgetTitle}>Clock Widget</div>
      </div>
      <div className={styles.widgetContent}>
        <div className={styles.clockTime}>{currentTime}</div>
        <div className={styles.clockDate}>{formattedDate}</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// The Chat Box: merges your original random messages logic
// ------------------------------------------------------------------
const WebinarChatBox: React.FC = () => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const specialOfferRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const investButtonRef = useRef<HTMLButtonElement | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  // For scroll detection
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);

  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;
    const specialOfferEl = specialOfferRef.current;
    const countdownElRef = countdownRef.current;
    const investBtn = investButtonRef.current;

    if (!chatEl || !inputEl || !typingEl || !toggleEl || !specialOfferEl || !countdownElRef || !investBtn) {
      console.warn("Missing chat refs; some chat features may not work.");
      return;
    }

    // Scroll helpers
    function isNearBottom() {
      const threshold = 50;
      return (chatEl.scrollHeight - chatEl.clientHeight - chatEl.scrollTop) <= threshold;
    }
    function scrollToBottom() {
      chatEl.scrollTop = chatEl.scrollHeight;
    }
    function handleScroll() {
      setIsUserScrolling(!isNearBottom());
    }
    chatEl.addEventListener('scroll', handleScroll);

    // Show/hide participant messages
    function handleToggleChange() {
      setShowParticipants(toggleEl.checked);
      const others = chatEl.querySelectorAll('[data-participant="true"]');
      others.forEach((m) => {
        (m as HTMLElement).style.display = toggleEl.checked ? 'block' : 'none';
      });
      if (toggleEl.checked && !isUserScrolling) {
        scrollToBottom();
      }
    }
    toggleEl.addEventListener('change', handleToggleChange);

    // Helper to add message
    function addMessage(
      text: string,
      msgType: 'user' | 'host' | 'system',
      userName?: string
    ) {
      const div = document.createElement('div');
      div.classList.add(styles.message);
      if (msgType === 'user') div.classList.add(styles.user);
      if (msgType === 'host') div.classList.add(styles.host);
      if (msgType === 'system') div.classList.add(styles.system);

      if (userName && userName.trim()) {
        div.textContent = `${userName}: ${text}`;
      } else {
        div.textContent = text;
      }

      // If from other users
      if (msgType === 'user' && userName && userName !== 'You') {
        div.setAttribute('data-participant', 'true');
        if (!toggleEl.checked) {
          div.style.display = 'none';
        }
      }

      chatEl.appendChild(div);

      // auto-scroll
      if (!isUserScrolling || userName === 'You') {
        scrollToBottom();
      }
    }

    // WebSocket
    const ws = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = ws;
    ws.onopen = () => console.log("Connected to chat server");
    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === 'message') {
        addMessage(
          data.text,
          data.messageType as 'user' | 'host' | 'system',
          data.user
        );
      }
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // Original snippet data
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
    const preloadedQuestions = [
      { time:180, text:"How does this integrate with existing business systems?", user:"Michael"},
      { time:300, text:"Can you explain more about the AI capabilities?", user:"Sarah"},
      { time:450, text:"Does this work with Zapier?", user:"David"},
      { time:600, text:"What kind of ROI can we expect?", user:"Rachel"},
      { time:750, text:"How long does implementation typically take?", user:"James"},
      { time:900, text:"This is incredible! Can't believe the accuracy levels 🔥", user:"Emma"},
      { time:1200, text:"Do you offer enterprise solutions?", user:"Thomas"},
      { time:1500, text:"Just amazing how far AI has come!", user:"Lisa"},
      { time:1800, text:"What about data security?", user:"Alex"},
      { time:2100, text:"Can small businesses benefit from this?", user:"Jennifer"},
      { time:2400, text:"The predictive analytics are mind-blowing!", user:"Daniel"},
      { time:2700, text:"How often do you release updates?", user:"Sophie"},
      { time:3000, text:"Wow, the demo exceeded my expectations!", user:"Ryan"},
      { time:3300, text:"What makes PrognosticAI different from competitors?", user:"Maria"}
    ];

    // Greet + random msgs
    setTimeout(() => {
      addMessage(
        "Welcome to the PrognosticAI Advanced Training! 👋 Let us know where you're joining from!",
        'host',
        'Selina (Host)'
      );
      scheduleAttendees();
    }, 2000);

    function scheduleAttendees() {
      const num = Math.floor(Math.random() * 6) + 15; // 15-20
      let delay = 500;
      for (let i = 0; i < num; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const msg = attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        setTimeout(() => {
          addMessage(msg, 'user', name);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }

    // Preloaded Q's
    preloadedQuestions.forEach((q) => {
      setTimeout(() => {
        addMessage(q.text, 'user', q.user);
        // "Selina is typing..."
        setTimeout(() => {
          typingEl.textContent = "Selina is typing...";
          const randomDelay = Math.random() * 10000 + 10000;
          setTimeout(() => {
            typingEl.textContent = "";
          }, randomDelay);
        }, 1000);
      }, q.time * 1000);
    });

    // Investment notifications
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

    // Simulate viewer count
    let currentViewers = 41;
    const viewerInterval = setInterval(() => {
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
        'system'
      );
      let t = 600; // 10 min
      const cdInt = setInterval(() => {
        t--;
        countdownElRef.textContent = `Special Offer Ends In: ${Math.floor(t/60)}:${String(t%60).padStart(2, '0')}`;
        if (t <= 0) {
          clearInterval(cdInt);
          specialOfferEl.style.display = 'none';
          addMessage("⌛ The special offer has ended.", 'system');
        }
      }, 1000);
    }, 60000);

    // Invest button (new tab)
    investBtn.addEventListener('click', () => {
      window.open('https://yes.prognostic.ai', '_blank');
    });

    // AI response logic
    async function handleUserMessage(msg: string) {
      const randomDelay = Math.random() * 4000;
      await new Promise((res) => setTimeout(res, randomDelay));
      typingEl.textContent = "Selina is typing...";

      try {
        const resp = await fetch(
          "https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message",
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, type: 'user' })
          }
        );
        if (!resp.ok) throw new Error("API call failed");
        const data = await resp.json();
        typingEl.textContent = "";

        if (data.response) {
          addMessage(data.response, 'host', 'Selina (Host)');
        } else {
          addMessage("Apologies, I'm having trouble connecting. Please try again!", 'host', 'Selina (Host)');
        }
      } catch (err) {
        console.error("Error:", err);
        typingEl.textContent = "";
        addMessage("Apologies, I'm having trouble connecting. Please try again!", 'host', 'Selina (Host)');
      }
    }

    // If user presses Enter
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'Enter' && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = '';
        addMessage(userMsg, 'user', 'You');
        handleUserMessage(userMsg);
      }
    }
    inputEl.addEventListener('keypress', handleKeyPress);

    // Cleanup
    return () => {
      chatEl.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggleChange);
      inputEl.removeEventListener('keypress', handleKeyPress);
      if (socketRef.current) {
        socketRef.current.close();
      }
      clearInterval(investInterval);
      clearInterval(viewerInterval);
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
                defaultChecked={showParticipants}
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

      <div className={styles.specialOffer} ref={specialOfferRef} style={{ display: 'none' }}>
        <div className={styles.countdown} ref={countdownRef}>
          Special Offer Ends In: 10:00
        </div>
        <button className={styles.investButton} ref={investButtonRef}>
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

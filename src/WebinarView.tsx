import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './WebinarView.module.css';

/** 
 * ChatMessage defines shape of each chat message
 */
interface ChatMessage {
  text: string;
  type: 'user' | 'host' | 'system';
  userName?: string;
}

/**
 * The main WebinarView component 
 */
const WebinarView: React.FC = () => {
  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null); // Personalized audio
  const messageToneRef = useRef<HTMLAudioElement>(null); // iPhone tone

  // State
  const [connecting, setConnecting] = useState(true);
  const [liveMinutes, setLiveMinutes] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);
  const [exitMessage, setExitMessage] = useState('');
  const [showReplayOverlay, setShowReplayOverlay] = useState(false);
  
  // We store the webinar start time for the "Live for X minutes" label
  const startTimeRef = useRef<number>(Date.now());

  // Clock widget states
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  const [currentTimeString, setCurrentTimeString] = useState('');
  const [currentDateString, setCurrentDateString] = useState<Date | null>(null);
  const clockIntervalRef = useRef<NodeJS.Timer | null>(null);

  // ============== SAFE AUDIO HELPER ==============
  const safePlayAudio = useCallback(async (audioElement: HTMLAudioElement | null) => {
    if (!audioElement) return;
    try {
      await audioElement.play();
    } catch (err) {
      // Some browsers block autoplay
      console.warn('Audio playback prevented:', err);
    }
  }, []);

  // ===============================================
  // 1) On Mount: fetch user data + set "Connecting" overlay
  // ===============================================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('user_email');

    // If user tries to refresh
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "The webinar is currently full. If you reload, you might lose your spot.";
    }
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Try fetching personalized data
    if (userEmail) {
      (async () => {
        try {
          const response = await fetch(
            `https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(
              userEmail
            )}`
          );
          if (!response.ok) throw new Error('Error fetching user data');
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
      })();
    }

    // Show "Connecting" for 2s
    const connectingTimer = setTimeout(() => {
      setConnecting(false);
      startTimeRef.current = Date.now(); // mark webinar start
      // Try autoplay the video
      videoRef.current?.play().catch((err) => {
        console.warn('Video autoplay prevented:', err);
      });
    }, 2000);

    return () => {
      clearTimeout(connectingTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [safePlayAudio]);

  // ===============================================
  // 2) "Live for X minutes" label
  // ===============================================
  useEffect(() => {
    if (!connecting) {
      const interval = setInterval(() => {
        const diff = Date.now() - startTimeRef.current;
        setLiveMinutes(Math.floor(diff / 60000));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [connecting]);

  // ===============================================
  // 3) Personalized audio at 3s
  // ===============================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;

    function handleTimeUpdate() {
      if (vid.currentTime >= 3) {
        safePlayAudio(audioRef.current);
        vid.removeEventListener('timeupdate', handleTimeUpdate);
      }
    }
    vid.addEventListener('timeupdate', handleTimeUpdate);
    return () => vid.removeEventListener('timeupdate', handleTimeUpdate);
  }, [safePlayAudio]);

  // ===============================================
  // 4) Exit-intent overlay
  // ===============================================
  useEffect(() => {
    if (hasShownOverlay) return;

    function handleMouseMove(e: MouseEvent) {
      const threshold = window.innerHeight * 0.1;
      if (e.clientY < threshold) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);
        // attempt iPhone tone
        safePlayAudio(messageToneRef.current);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasShownOverlay, safePlayAudio]);

  // ===============================================
  // 5) Replay overlay after video ends
  // ===============================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleEnded() {
      setShowReplayOverlay(true);
    }
    vid.addEventListener('ended', handleEnded);
    return () => vid.removeEventListener('ended', handleEnded);
  }, []);

  // ===============================================
  // 6) Clock widget logic
  //  - appear at 10s, animate in, wobble, animate out
  // ===============================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Updates the clock time every second
    function updateClock() {
      const now = new Date();
      setCurrentDateString(now);
      setCurrentTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }

    function startClockUpdates() {
      updateClock();
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
      clockIntervalRef.current = setInterval(updateClock, 1000);
    }

    function stopClockUpdates() {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
        clockIntervalRef.current = null;
      }
    }

    function handleTimeUpdate() {
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

  // Once the clock has "dragged in," wait 10s, then remove
  useEffect(() => {
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // After we set clockRemoved = true, we fully hide it after 1s
  useEffect(() => {
    if (clockRemoved) {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
        clockIntervalRef.current = null;
      }
      // Hide after the dragOut animation finishes
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000); // matches animateOut duration
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  // ===============================================
  // 7) Rendering
  // ===============================================
  if (connecting) {
    return (
      <div className={styles.connectingOverlay}>
        {/* Spinning loader in PrognosticAI Blue */}
        <div className={styles.loaderSpinner}></div>
        <p className={styles.loadingText}>Loading, please wait...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hidden audio elements */}
      <audio ref={messageToneRef} src="https://cdn.freesound.org/previews/613/613258_5674468-lq.mp3" style={{ display: 'none' }} />
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Exit-intent bubble */}
      {showExitOverlay &&
        createPortal(
          <ExitOverlay
            message={exitMessage}
            onClose={() => setShowExitOverlay(false)}
          />,
          document.body
        )}

      {/* Replay overlay */}
      {showReplayOverlay &&
        <ReplayOverlay
          onReplay={() => {
            setShowReplayOverlay(false);
            const vid = videoRef.current;
            if (vid) {
              vid.currentTime = 0;
              vid.play().catch(() => {});
            }
            // reset clock widget
            setShowClockWidget(false);
            setClockDragInComplete(false);
            setClockRemoved(false);
          }}
        />
      }

      {/* Banner row */}
      <BannerRow liveMinutes={liveMinutes} />

      {/* Main layout: Video + Chat */}
      <div className={styles.mainRow}>
        <div className={styles.videoSection}>
          <video
            ref={videoRef}
            muted={!hasInteracted}
            playsInline
            controls={false}
            className={styles.webinarVideo}
          >
            <source
              src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
              type="video/mp4"
            />
            Your browser does not support HTML5 video.
          </video>

          {/* Sound overlay to unmute */}
          {!hasInteracted && (
            <div
              className={styles.soundOverlay}
              onClick={() => {
                setHasInteracted(true);
                if (videoRef.current) {
                  videoRef.current.muted = false;
                }
              }}
            >
              <div className={styles.soundIcon}>🔊</div>
              <div className={styles.soundText}>Click to Enable Sound</div>
            </div>
          )}

          {/* Clock Widget */}
          {showClockWidget && (
            <ClockWidget
              currentTime={currentTimeString}
              currentDate={currentDateString}
              dragInComplete={clockDragInComplete}
              setDragInComplete={setClockDragInComplete}
              clockRemoved={clockRemoved}
            />
          )}
        </div>

        {/* Chat section */}
        <div className={styles.chatSection}>
          <WebinarChatBox />
        </div>
      </div>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} PrognosticAI
      </footer>
    </div>
  );
};

/** ExitOverlay: iPhone bubble for exit-intent */
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

/** ReplayOverlay: "Webinar Ended" + Replay + Invest */
const ReplayOverlay: React.FC<{
  onReplay: () => void;
}> = ({ onReplay }) => {
  return createPortal(
    <div className={styles.replayOverlay}>
      <h2 className={styles.replayTitle}>Webinar Ended</h2>
      <button className={styles.replayButton} onClick={onReplay}>
        Watch Instant Replay
      </button>
      <button
        className={styles.investButton}
        onClick={() => {
          window.location.href = "https://yes.prognostic.ai";
        }}
      >
        Invest $999 Now
      </button>
    </div>,
    document.body
  );
};

/** BannerRow: "LIVE" + "PrognosticAI Advanced Training" + "Live for X minutes" */
const BannerRow: React.FC<{ liveMinutes: number }> = ({ liveMinutes }) => (
  <div className={styles.bannerRow}>
    <div className={styles.bannerLeft}>
      <div className={styles.liveIndicator}>
        <div className={styles.liveDot} />
        LIVE
      </div>
      <div className={styles.bannerTitle}>PrognosticAI Advanced Training</div>
    </div>
    <div className={styles.liveMinutes}>
      Live for {liveMinutes} minute{liveMinutes === 1 ? '' : 's'}
    </div>
  </div>
);

/** ClockWidget: animate in at 10s, show time, animate out after ~10s */
const ClockWidget: React.FC<{
  currentTime: string;
  currentDate: Date | null;
  dragInComplete: boolean;
  setDragInComplete: React.Dispatch<React.SetStateAction<boolean>>;
  clockRemoved: boolean;
}> = ({ currentTime, currentDate, dragInComplete, setDragInComplete, clockRemoved }) => {
  // On animation end, detect if it's the "dragIn" or "dragOut"
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === styles.dragInKeyframeName) {
      // The “dragIn” animation ended
      setDragInComplete(true);
    }
  };

  // Format date
  const formattedDate = currentDate
    ? currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  // Which class name to use?
  let widgetClass = styles.clockWidget;
  if (!clockRemoved) {
    widgetClass += dragInComplete
      ? ` ${styles.wobble}`
      : ` ${styles.animateIn}`; // just came in
  } else {
    widgetClass += ` ${styles.animateOut}`; // removing
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

/** The main Chat Box */
const WebinarChatBox: React.FC = () => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const specialOfferRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const investButtonRef = useRef<HTMLButtonElement | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showParticipants, setShowParticipants] = useState(true);
  const [viewerCount, setViewerCount] = useState(41);
  const [specialOfferVisible, setSpecialOfferVisible] = useState(false);
  const [offerTimeRemaining, setOfferTimeRemaining] = useState(600);
  const [isTyping, setIsTyping] = useState(false);
  const [userScrolling, setUserScrolling] = useState(false);

  // Scripting data
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

  // =========================
  // 1) On mount
  // =========================
  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const toggleEl = participantToggleRef.current;
    const inputEl = inputRef.current;
    const typingEl = typingIndicatorRef.current;
    const offerEl = specialOfferRef.current;
    const countdownElRef = countdownRef.current;
    const investBtn = investButtonRef.current;

    if (!chatEl || !toggleEl || !inputEl || !typingEl || !offerEl || !countdownElRef || !investBtn) {
      console.warn("Some chat refs are missing. Chat features might be limited.");
      return;
    }

    /** Scroll helper */
    const isNearBottom = () => {
      const threshold = 50;
      return (chatEl.scrollHeight - chatEl.clientHeight - chatEl.scrollTop) <= threshold;
    };
    const scrollToBottom = () => {
      chatEl.scrollTop = chatEl.scrollHeight;
    };
    function handleScroll() {
      setUserScrolling(!isNearBottom());
    }
    chatEl.addEventListener('scroll', handleScroll);

    /** Add a message function */
    function addMessage(msg: ChatMessage) {
      setMessages((prev) => [...prev, msg]);
      // auto scroll if near bottom or if user is "You"
      if (!userScrolling || msg.userName === 'You') {
        setTimeout(() => scrollToBottom(), 50);
      }
    }

    /** Toggle show/hide participant messages */
    function handleToggleChange() {
      setShowParticipants(toggleEl.checked);
    }
    toggleEl.addEventListener('change', handleToggleChange);

    // Connect WebSocket for real-time messages
    const ws = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = ws;
    ws.onopen = () => {
      console.log("Connected to chat server");
    };
    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === 'message') {
        addMessage({
          type: data.messageType,
          text: data.text,
          userName: data.user
        });
      }
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // Random attendee messages
    function scheduleAttendeeMessages() {
      const num = Math.floor(Math.random() * 6) + 15; // e.g. 15-20
      let delay = 500;
      for (let i = 0; i < num; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const text = attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        setTimeout(() => {
          addMessage({
            type: 'user',
            text: text,
            userName: name
          });
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }

    // Show host greeting after 2s
    setTimeout(() => {
      addMessage({
        type: 'host',
        text: "Welcome to the PrognosticAI Advanced Training! 👋 Let us know where you're joining from!",
        userName: "Selina (Host)"
      });
      scheduleAttendeeMessages();
    }, 2000);

    // Preloaded Q's
    preloadedQuestions.forEach(q => {
      setTimeout(() => {
        addMessage({
          type: 'user',
          text: q.text,
          userName: q.user
        });
        // Show "Selina is typing..." briefly
        typingEl.textContent = "Selina is typing...";
        const randomDelay = Math.random() * 10000 + 10000;
        setTimeout(() => {
          typingEl.textContent = "";
        }, randomDelay);
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

    // Viewer count fluctuations
    let count = 41;
    const viewerInterval = setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      count = Math.max(40, Math.min(50, count + change));
      setViewerCount(count);
    }, 5000);

    // Show special offer after 60s
    const offerTimer = setTimeout(() => {
      setSpecialOfferVisible(true);
      addMessage({
        type: 'system',
        text: "🚨 Special Offer Alert! For the next 10 minutes only, secure your spot in PrognosticAI for just $999. Don't miss out! 🚀"
      });
      let t = 600; // 10 min
      const cdInt = setInterval(() => {
        t--;
        setOfferTimeRemaining(t);
        if (t <= 0) {
          clearInterval(cdInt);
          setSpecialOfferVisible(false);
          addMessage({
            type: 'system',
            text: "⌛ The special offer has ended."
          });
        }
      }, 1000);
    }, 60000);

    // Invest button
    investBtn.addEventListener('click', () => {
      window.location.href = 'https://yes.prognostic.ai';
    });

    // On user pressing enter
    async function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'Enter' && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = '';
        addMessage({ type: 'user', text: userMsg, userName: 'You' });

        // Now simulate an AI response
        setIsTyping(true);
        try {
          const resp = await fetch(
            "https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message",
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: userMsg, type: 'user' })
            }
          );
          if (!resp.ok) throw new Error('API call failed');
          const data = await resp.json();
          setIsTyping(false);

          if (data.response) {
            addMessage({ type: 'host', text: data.response, userName: 'Selina (Host)' });
          }
        } catch (err) {
          console.error('Error simulating AI response:', err);
          setIsTyping(false);
          addMessage({ type: 'host', text: "Sorry, I'm having trouble connecting right now.", userName: 'Selina (Host)' });
        }
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
        socketRef.current = null;
      }
      clearInterval(investInterval);
      clearInterval(viewerInterval);
      clearTimeout(offerTimer);
    };
  }, [names, attendeeMessages, investmentMessages, preloadedQuestions, styles.notificationIcon, userScrolling]);

  // Render
  const displayedMessages = messages.filter((m) =>
    showParticipants ? true : (m.userName === 'You' || m.type !== 'user')
  );

  return (
    <div className={styles.chatContainer}>
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
            <span>{viewerCount} watching</span>
          </span>
        </div>
      </div>

      {specialOfferVisible && (
        <div className={styles.specialOffer} ref={specialOfferRef}>
          <div className={styles.countdown} ref={countdownRef}>
            Special Offer Ends In: {Math.floor(offerTimeRemaining / 60)}:
            {(offerTimeRemaining % 60).toString().padStart(2, '0')}
          </div>
          <button
            className={styles.investButton}
            ref={investButtonRef}
          >
            Invest $999 Now - Limited Time Offer
          </button>
        </div>
      )}

      <div className={styles.chatMessages} ref={chatMessagesRef}>
        {displayedMessages.map((m, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              m.type === 'user'
                ? styles.user
                : m.type === 'host'
                ? styles.host
                : styles.system
            }`}
          >
            {m.userName ? `${m.userName}: ${m.text}` : m.text}
          </div>
        ))}
      </div>

      <div className={styles.chatInput}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message here..."
        />
        {isTyping && (
          <div
            className={styles.typingIndicator}
            ref={typingIndicatorRef}
          >
            Selina is typing...
          </div>
        )}
      </div>
    </div>
  );
};

export default WebinarView;

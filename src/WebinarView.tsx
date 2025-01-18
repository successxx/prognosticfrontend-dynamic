import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./WebinarView.module.css"; 

const WebinarView: React.FC = () => {
  // ------------------ Refs ------------------
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioRefTwo = useRef<HTMLAudioElement | null>(null);
  const messageToneRef = useRef<HTMLAudioElement | null>(null);

  // >>> For Fullscreen
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);

  // ------------------ States ------------------
  const [connecting, setConnecting] = useState(true);
  const [liveMinutes, setLiveMinutes] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Overlays
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);
  const [exitMessage, setExitMessage] = useState("");

  const [showReplayOverlay, setShowReplayOverlay] = useState(false);

  // Clock
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  const [currentTimeString, setCurrentTimeString] = useState("");
  const [currentDateObj, setCurrentDateObj] = useState<Date | null>(null);
  const clockIntervalRef = useRef<NodeJS.Timer | null>(null);

  // "Live for X minutes"
  const startTimeRef = useRef<number>(Date.now());

  // ------------------------------------------
  // HEADLINE STATES
  // ------------------------------------------
  const [headline, setHeadline] = useState("");
  const [showHeadline, setShowHeadline] = useState(false);
  const [hasShownHeadline, setHasShownHeadline] = useState(false);

  // >>> For Poll
  const [pollOpen, setPollOpen] = useState(false);
  const [pollShowResults, setPollShowResults] = useState(false);
  const [pollStarted, setPollStarted] = useState(false);
  const [pollStartTime, setPollStartTime] = useState<number | null>(null);

  // Safe audio playback
  const safePlayAudio = useCallback(async (element: HTMLAudioElement | null) => {
    if (!element) return;
    try {
      await element.play();
    } catch (err) {
      console.warn("Audio playback prevented:", err);
    }
  }, []);

  // =====================================================
  // 1) On Mount: fetch audio + exit message, show "Connecting"
  // =====================================================
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue =
        "The webinar is currently full. If you reload, you might lose your spot.";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);

    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("user_email");

    if (userEmail) {
      (async () => {
        try {
          const resp = await fetch(
            `https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(
              userEmail
            )}`
          );
          if (!resp.ok) throw new Error("Error fetching user data");
          const data = await resp.json();

          if (audioRef.current && data.audio_link) {
            audioRef.current.src = data.audio_link;
          }
          if (audioRefTwo.current && data.audio_link_two) {
            audioRefTwo.current.src = data.audio_link_two;
          }
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }

          // HEADLINE
          if (data.headline) {
            setHeadline(data.headline);
            // We do NOT setShowHeadline(true) immediately; it toggles on video time
          }
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      })();
    }

    // Show "Connecting" for 2s
    const connectTimer = setTimeout(() => {
      setConnecting(false);
      startTimeRef.current = Date.now();

      // Try autoplay
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.warn("Video autoplay blocked:", err);
        });
      }
    }, 2000);

    return () => {
      clearTimeout(connectTimer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [safePlayAudio]);

  // =====================================================
  // 2) "Live for X minutes" label
  // =====================================================
  useEffect(() => {
    if (!connecting) {
      const timer = setInterval(() => {
        const diff = Date.now() - startTimeRef.current;
        setLiveMinutes(Math.floor(diff / 60000));
      }, 60000);
      return () => clearInterval(timer);
    }
  }, [connecting]);

  // =====================================================
  // 3) Audio playback at 3s and 5s of the video
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current || !audioRefTwo.current) return;

    function handleTimeUpdate() {
      if (vid && vid.currentTime >= 3) {
        safePlayAudio(audioRef.current);
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }
    function handleSecondAudio() {
      const secondAudioTime = 5;
      if (vid && vid.currentTime >= secondAudioTime) {
        safePlayAudio(audioRefTwo.current);
        vid.removeEventListener("timeupdate", handleSecondAudio);
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    vid.addEventListener("timeupdate", handleSecondAudio);
    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      vid.removeEventListener("timeupdate", handleSecondAudio);
    };
  }, [safePlayAudio, connecting]);

  // =====================================================
  // 3.5) Headline + Poll timings
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleHeadlineTiming() {
      const time = vid.currentTime;
      // console.log("Video time:", time);

      if (time >= 5 && time < 20) {
        setShowHeadline(true);
        if (!hasShownHeadline) {
          setHasShownHeadline(true);
        }
      } else {
        setShowHeadline(false);
      }
    }

    function handlePollTiming() {
      // If not started, show poll at 20s
      if (!pollStarted && vid.currentTime >= 20) {
        setPollStarted(true);
        setPollOpen(true);
        setPollStartTime(Date.now());
      }
      // Show results automatically at 50s if poll is open and not yet shown
      if (pollOpen && !pollShowResults && vid.currentTime >= 50) {
        setPollShowResults(true);
      }
      // Disappear after 60s from poll start
      if (pollOpen && pollStartTime && Date.now() - pollStartTime >= 60000) {
        setPollOpen(false);
        setPollShowResults(false);
      }
    }

    function handleAllTimings() {
      handleHeadlineTiming();
      handlePollTiming();
    }

    vid.addEventListener("timeupdate", handleAllTimings);
    vid.addEventListener("seeking", handleAllTimings);

    return () => {
      vid.removeEventListener("timeupdate", handleAllTimings);
      vid.removeEventListener("seeking", handleAllTimings);
    };
  }, [
    connecting,
    hasInteracted,
    hasShownHeadline,
    pollOpen,
    pollShowResults,
    pollStarted,
    pollStartTime,
    safePlayAudio,
  ]);

  // =====================================================
  // 4) Exit-intent
  // =====================================================
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
    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasShownOverlay, safePlayAudio]);

  // =====================================================
  // 5) Replay overlay on video end
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleEnded() {
      setShowReplayOverlay(true);
    }
    vid.addEventListener("ended", handleEnded);
    return () => vid.removeEventListener("ended", handleEnded);
  }, []);

  // =====================================================
  // 6) Clock widget
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function updateClock() {
      const now = new Date();
      setCurrentDateObj(now);
      setCurrentTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
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
      if (vid && vid.currentTime >= 10 && !showClockWidget && !clockRemoved) {
        setShowClockWidget(true);
        startClockUpdates();
      }
      if (showClockWidget && !clockRemoved) {
        startClockUpdates();
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      stopClockUpdates();
    };
  }, [showClockWidget, clockRemoved, connecting]);

  useEffect(() => {
    // Once the dragIn completes, wait 10s, then dragOut
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  useEffect(() => {
    // Once removed is true, hide fully after 1s
    if (clockRemoved) {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current as unknown as number);
      }
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000);
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  // >>> Fullscreen
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoWrapperRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // >>> For Poll
  const handlePollVote = () => {
    setPollShowResults(true);
  };

  // =====================================================
  // RENDER
  // =====================================================
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
    <div className="d-flex flex-column w-100 ">
      {/* Hidden audios */}
      <audio
        ref={messageToneRef}
        src="https://cdn.freesound.org/previews/613/613258_5674468-lq.mp3"
        style={{ display: "none" }}
      />
      <audio ref={audioRef} style={{ display: "none" }} />
      <audio ref={audioRefTwo} muted={!hasInteracted} style={{ display: "none" }} />

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
            // Reset clock states
            setShowClockWidget(false);
            setClockDragInComplete(false);
            setClockRemoved(false);
          }}
        />
      )}

      <div className={styles.zoomContainer}>
        <div className={styles.zoomTopBar}>
          <div className={styles.zoomTitle}>
            <div className={styles.zoomLiveDot}></div>
            PrognosticAI Advanced Training
          </div>
          <div className={styles.zoomLiveMinutes}>
            Live for {liveMinutes} minute{liveMinutes === 1 ? "" : "s"}
          </div>
        </div>

        <div className={styles.twoColumnLayout}>
          {/* Video side */}
          <div className={styles.videoColumn}>
            <div className={styles.videoWrapper} ref={videoWrapperRef}>
              <video
                ref={videoRef}
                autoPlay
                muted={!hasInteracted}
                playsInline
                controls={false}
                className={styles.videoPlayer}
              >
                <source
                  src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
                  type="video/mp4"
                />
                Your browser does not support HTML5 video.
              </video>

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

              {/* HEADLINE TEXT */}
              {showHeadline && (
                <div className={styles.headlineText}>{headline}</div>
              )}

              {!hasInteracted && (
                <div
                  className={styles.soundOverlay}
                  onClick={() => {
                    setHasInteracted(true);
                    if (videoRef.current) {
                      videoRef.current.muted = false;
                      videoRef.current.play().catch(() => {});
                    }
                    if (audioRefTwo.current) {
                      audioRefTwo.current.muted = false;
                    }
                  }}
                >
                  <div className={styles.soundIcon}>🔊</div>
                  <div className={styles.soundText}>Click to Enable Sound</div>
                </div>
              )}

              {/* Fullscreen button */}
              <button className={styles.fullscreenButton} onClick={handleFullscreen}>
                Full Screen
              </button>
            </div>
          </div>

          {/* Chat side */}
          <div className={styles.chatColumn}>
            <WebinarChatBox
              pollOpen={pollOpen}
              pollShowResults={pollShowResults}
              onPollVote={handlePollVote}
            />
          </div>
        </div>
      </div>

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
          {message && message.trim().length > 0 ? message : defaultMsg}
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
      <button
        className={styles.investButton}
        onClick={() => window.open("https://yes.prognostic.ai", "_blank")}
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
  clockRemoved,
}) => {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [movementIntervalId, setMovementIntervalId] = useState<NodeJS.Timer | null>(
    null
  );

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName.includes("dragIn")) {
      setDragInComplete(true);
    }
    // No special logic after dragOut
  };

  useEffect(() => {
    if (clockRemoved && movementIntervalId) {
      clearInterval(movementIntervalId as NodeJS.Timeout);
      setMovementIntervalId(null);
    }
  }, [clockRemoved, movementIntervalId]);

  const dateString = currentDate
    ? currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  let widgetClass = styles.clockWidget;
  if (!clockRemoved) {
    widgetClass += dragInComplete ? ` ${styles.wobble}` : ` ${styles.animateIn}`;
  } else {
    widgetClass += ` ${styles.animateOut}`;
  }

  return (
    <div className={widgetClass} onAnimationEnd={handleAnimationEnd} ref={widgetRef}>
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
        <div className={styles.clockDate}>{dateString}</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// WebinarChatBox
// ------------------------------------------------------------------
interface ChatBoxProps {
  pollOpen: boolean;
  pollShowResults: boolean;
  onPollVote: () => void;
}

const WebinarChatBox: React.FC<ChatBoxProps> = ({
  pollOpen,
  pollShowResults,
  onPollVote,
}) => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const specialOfferRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const investButtonRef = useRef<HTMLButtonElement | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;
    const specialOfferEl = specialOfferRef.current;
    const countdownElRef = countdownRef.current;
    const investBtn = investButtonRef.current;

    if (
      !chatEl ||
      !inputEl ||
      !typingEl ||
      !toggleEl ||
      !specialOfferEl ||
      !countdownElRef ||
      !investBtn
    ) {
      console.warn("Some chat refs missing; chat may not fully work.");
      return;
    }

    // Scroll helpers
    function isNearBottom() {
      const threshold = 50;
      return (
        chatEl.scrollHeight - chatEl.clientHeight - chatEl.scrollTop <= threshold
      );
    }
    function scrollToBottom() {
      chatEl.scrollTop = chatEl.scrollHeight;
    }
    function handleScroll() {
      setIsUserScrolling(!isNearBottom());
    }
    chatEl.addEventListener("scroll", handleScroll);

    // Toggle
    function handleToggle() {
      const participantMsgs = chatEl.querySelectorAll('[data-participant="true"]');
      participantMsgs.forEach((m) => {
        (m as HTMLElement).style.display = toggleEl.checked ? "block" : "none";
      });
      if (toggleEl.checked && !isUserScrolling) {
        scrollToBottom();
      }
    }
    toggleEl.checked = false;
    toggleEl.addEventListener("change", handleToggle);

    // Add message
    function addMessage(
      text: string,
      msgType: "user" | "host" | "system",
      userName?: string,
      autoScroll = true
    ) {
      const div = document.createElement("div");
      div.classList.add(styles.message);
      if (msgType === "user") div.classList.add(styles.user);
      if (msgType === "host") div.classList.add(styles.host);
      if (msgType === "system") div.classList.add(styles.system);

      if (userName && userName.trim()) {
        div.textContent = `${userName}: ${text}`;
      } else {
        div.textContent = text;
      }

      // participant
      if (msgType === "user" && userName && userName !== "You") {
        div.setAttribute("data-participant", "true");
        if (!toggleEl.checked) {
          div.style.display = "none";
        }
      }

      chatEl.appendChild(div);
      if (autoScroll || userName === "You") {
        if (!isUserScrolling) {
          scrollToBottom();
        }
      }
    }

    // WebSocket
    const ws = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = ws;
    ws.onopen = () => console.log("Connected to chat server");
    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === "message") {
        addMessage(
          data.text,
          data.messageType as "user" | "host" | "system",
          data.user,
          true
        );
      }
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // Random data
    const names = [
      "Emma",
      "Liam",
      "Olivia",
      "Noah",
      "Ava",
      "Ethan",
      "Sophia",
      "Mason",
      "Isabella",
      "William",
      "Mia",
      "James",
      "Charlotte",
      "Benjamin",
      "Amelia",
      "Lucas",
      "Harper",
      "Henry",
      "Evelyn",
      "Alexander",
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
      "im big in affiliate marketing, and this is wild!",
    ];
    const investmentMessages = [
      "just invested in PrognosticAI! 🚀",
      "secured their spot in PrognosticAI! ✨",
      "joined the PrognosticAI family! 🎉",
      "made a smart investment! 💡",
      "is starting their AI journey with us! 🌟",
      "got early access to PrognosticAI! 🔥",
      "upgraded to PrognosticAI Pro! 💪",
      "joined our success story! ⭐",
    ];
    const preloadedQuestions = [
      {
        time: 180,
        text: "How does this integrate with existing business systems?",
        user: "Michael",
      },
      {
        time: 300,
        text: "Can you explain more about the AI capabilities?",
        user: "Sarah",
      },
      { time: 450, text: "Does this work with Zapier?", user: "David" },
      { time: 600, text: "What kind of ROI can we expect?", user: "Rachel" },
      {
        time: 750,
        text: "How long does implementation typically take?",
        user: "James",
      },
      {
        time: 900,
        text: "This is incredible! Can't believe the accuracy levels 🔥",
        user: "Emma",
      },
      {
        time: 1200,
        text: "Do you offer enterprise solutions?",
        user: "Thomas",
      },
      { time: 1500, text: "Just amazing how far AI has come!", user: "Lisa" },
      { time: 1800, text: "What about data security?", user: "Alex" },
      {
        time: 2100,
        text: "Can small businesses benefit from this?",
        user: "Jennifer",
      },
      {
        time: 2400,
        text: "The predictive analytics are mind-blowing!",
        user: "Daniel",
      },
      { time: 2700, text: "How often do you release updates?", user: "Sophie" },
      {
        time: 3000,
        text: "Wow, the demo exceeded my expectations!",
        user: "Ryan",
      },
      {
        time: 3300,
        text: "What makes PrognosticAI different from competitors?",
        user: "Maria",
      },
    ];

    // Greet
    setTimeout(() => {
      addMessage(
        "Welcome to the PrognosticAI Advanced Training! 👋 Let us know where you're joining from!",
        "host",
        "Selina (Host)"
      );
      scheduleAttendeeMessages();
    }, 2000);

    function scheduleAttendeeMessages() {
      const num = Math.floor(Math.random() * 6) + 15;
      let delay = 500;
      for (let i = 0; i < num; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const msg =
          attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        setTimeout(() => {
          addMessage(msg, "user", name, true);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }

    // Preloaded Q's
    preloadedQuestions.forEach((q) => {
      setTimeout(() => {
        addMessage(q.text, "user", q.user);
        setTimeout(() => {
          typingEl.textContent = "Selina is typing...";
          const randomDelay = Math.random() * 10000 + 10000;
          setTimeout(() => {
            typingEl.textContent = "";
          }, randomDelay);
        }, 1000);
      }, q.time * 1000);
    });

    // Invest notifications
    function showInvestNotif() {
      const name = names[Math.floor(Math.random() * names.length)];
      const line =
        investmentMessages[Math.floor(Math.random() * investmentMessages.length)];
      const notif = document.createElement("div");
      notif.classList.add(styles.notification);
      notif.innerHTML = `
        <div class="${styles.notificationIcon}">🎉</div>
        <div><strong>${name}</strong> ${line}</div>
      `;
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 5000);
    }
    const investInterval = setInterval(() => {
      showInvestNotif();
    }, Math.random() * 30000 + 30000);

    // Viewer count
    let currentViewers = 41;
    const viewerInterval = setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      currentViewers = Math.max(40, Math.min(50, currentViewers + change));
      const vCount = document.getElementById("viewerCount");
      if (vCount) {
        vCount.textContent = `${currentViewers} watching`;
      }
    }, 5000);

    // Special offer after 60s
    const specialOfferTimeout = setTimeout(() => {
      specialOfferEl.style.display = "block";
      addMessage(
        "🚨 Special Offer Alert! For the next 10 minutes only, secure your spot in PrognosticAI for just $999. Don't miss out! 🚀",
        "system"
      );
      let t = 600;
      const cdInt = setInterval(() => {
        t--;
        countdownElRef.textContent = `Special Offer Ends In: ${Math.floor(
          t / 60
        )}:${String(t % 60).padStart(2, "0")}`;
        if (t <= 0) {
          clearInterval(cdInt);
          specialOfferEl.style.display = "none";
          addMessage("⌛ The special offer has ended.", "system");
        }
      }, 1000);
    }, 60000);

    // Invest button
    investBtn.addEventListener("click", () => {
      window.open("https://yes.prognostic.ai", "_blank");
    });

    // AI response
    async function handleUserMessage(msg: string, isAutoQuestion = false) {
      if (isAutoQuestion) return;
      try {
        const randomDelay = Math.random() * 4000;
        await new Promise((res) => setTimeout(res, randomDelay));
        typingEl.textContent = "Selina is typing...";

        const resp = await fetch(
          "https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg, type: "user" }),
          }
        );
        if (!resp.ok) throw new Error("API call failed");
        const data = await resp.json();
        typingEl.textContent = "";
        if (data.response) {
          addMessage(data.response, "host", "Selina (Host)", true);
        }
      } catch (err) {
        console.error("Error:", err);
        typingEl.textContent = "";
        addMessage(
          "Apologies, I'm having trouble connecting. Please try again!",
          "host",
          "Selina (Host)",
          true
        );
      }
    }

    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(userMsg, "user", "You", false);
        handleUserMessage(userMsg);
      }
    }
    inputEl.addEventListener("keypress", handleKeyPress);

    // Cleanup
    return () => {
      chatEl.removeEventListener("scroll", handleScroll);
      toggleEl.removeEventListener("change", handleToggle);
      inputEl.removeEventListener("keypress", handleKeyPress);
      if (socketRef.current) {
        socketRef.current.close();
      }
      clearTimeout(specialOfferTimeout);
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
              <input type="checkbox" ref={participantToggleRef} defaultChecked={false} />
              <span className={styles.toggleSlider}></span>
            </label>
            <span className={styles.toggleLabel}>Show Others</span>
          </div>

          <span className={styles.viewerCount} style={{ marginLeft: "10px" }}>
            <i>👥</i>
            <span id="viewerCount">41 watching</span>
          </span>
        </div>
      </div>

      {pollOpen && <ChatPoll showResults={pollShowResults} onVote={onPollVote} />}

      <div className={styles.specialOffer} ref={specialOfferRef} style={{ display: "none" }}>
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
        <div className={styles.typingIndicator} ref={typingIndicatorRef}></div>
      </div>
    </div>
  );
};

const ChatPoll: React.FC<{
  showResults: boolean;
  onVote: () => void;
}> = ({ showResults, onVote }) => {
  if (!showResults) {
    return (
      <div className={styles.chatPollContainer}>
        <div className={styles.chatPollQuestion}>which works better?</div>
        <div className={styles.chatPollButtons}>
          <button onClick={onVote}>Generic</button>
          <button onClick={onVote}>Personalized</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.chatPollContainer}>
        <div className={styles.chatPollResults}>
          <div className={styles.pollBarRow}>
            <span>Generic</span>
            <div className={styles.pollBar}>
              <div className={styles.pollBarFillGeneric}></div>
            </div>
            <span>5%</span>
          </div>
          <div className={styles.pollBarRow}>
            <span>Personalized</span>
            <div className={styles.pollBar}>
              <div className={styles.pollBarFillPersonalized}></div>
            </div>
            <span>95%</span>
          </div>
          <div className={styles.pollResultText}>
            95% of participants said personalized marketing will perform better
          </div>
        </div>
      </div>
    );
  }
};

export default WebinarView;

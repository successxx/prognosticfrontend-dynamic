import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./WebinarView.module.css"; 
// ***** REMOVED the second import "./WebinarView.module.css"; *****

// interface ChatMessage {
//   text: string;
//   type: "user" | "host" | "system";
//   userName?: string;
// }

const WebinarView: React.FC = () => {
  // ------------------ Refs ------------------
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioRefTwo = useRef<HTMLAudioElement | null>(null);
  const messageToneRef = useRef<HTMLAudioElement | null>(null);

  // NEW REF for the video wrapper (needed for requestFullscreen).
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

  // Headline text
  const [headline, setHeadline] = useState("");
  const [showHeadline, setShowHeadline] = useState(false);
  const [hasShownHeadline, setHasShownHeadline] = useState(false);

  // POLL logic: triggers at 20s
  const [pollStarted, setPollStarted] = useState(false);
  const [pollOpen, setPollOpen] = useState(false);
  const [pollShowResults, setPollShowResults] = useState(false);
  const [pollStartTime, setPollStartTime] = useState<number | null>(null);

  // =======================
  // NEW: Full screen state
  // =======================
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFullScreenBtn, setShowFullScreenBtn] = useState(false);
  const hideFullscreenTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smoothly show/hide the Full Screen button when mouse moves
  const handleMouseMoveOnVideo = useCallback(() => {
    setShowFullScreenBtn(true);
    if (hideFullscreenTimerRef.current) {
      clearTimeout(hideFullscreenTimerRef.current);
    }
    // Hide again after 2 seconds of no mouse movement
    hideFullscreenTimerRef.current = setTimeout(() => {
      setShowFullScreenBtn(false);
    }, 2000);
  }, []);

  // Toggle full screen
  const toggleFullScreen = useCallback(() => {
    if (isFullScreen) {
      document.exitFullscreen().catch((err) => {
        console.warn("Error exiting fullscreen:", err);
      });
    } else {
      if (videoWrapperRef.current?.requestFullscreen) {
        videoWrapperRef.current.requestFullscreen().catch((err) => {
          console.warn("Error requesting fullscreen:", err);
        });
      }
    }
  }, [isFullScreen]);

  // Listen to fullscreenchange event to update state
  useEffect(() => {
    function onFullScreenChange() {
      if (document.fullscreenElement === videoWrapperRef.current) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    }
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, []);

  // Safe audio playback
  const safePlayAudio = useCallback(
    async (element: HTMLAudioElement | null) => {
      if (!element) return;
      try {
        await element.play();
      } catch (err) {
        console.warn("Audio playback prevented:", err);
      }
    },
    []
  );

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
            `https://prognostic-ai-backend-acab284a2f57.herokuapp.com/insert_user_two?user_email=${encodeURIComponent(
              userEmail
            )}`
          );
          if (!resp.ok) throw new Error("Error fetching user data");
          const data = await resp.json();

          // audio_link -> audioRef
          if (audioRef.current && data.audio_link) {
            audioRef.current.src = data.audio_link;
          }
          if (audioRefTwo.current && data.audio_link_two) {
            audioRefTwo.current.src = data.audio_link_two;
          }
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
          if (data.headline) {
            setHeadline(data.headline);
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
  }, [safePlayAudio, connecting]);

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
  // 3) Audio playback at 3s, 5s
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current || !audioRefTwo.current) return;

    function handleTimeUpdate() {
      if (vid.currentTime >= 3) {
        safePlayAudio(audioRef.current);
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }
    function handleSecondAudio() {
      const secondAudioTime = 5;
      if (vid.currentTime >= secondAudioTime) {
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
  // 4) Headline & Poll Timings
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleHeadline() {
      const t = vid.currentTime;
      // show headline 5-20s
      if (t >= 5 && t < 20) {
        setShowHeadline(true);
        if (!hasShownHeadline) {
          setHasShownHeadline(true);
        }
      } else {
        setShowHeadline(false);
      }
    }

    function handlePoll() {
      const t = vid.currentTime;
      // poll at 20s
      if (!pollStarted && t >= 20) {
        setPollStarted(true);
        setPollOpen(true);
        setPollStartTime(Date.now());
      }
      // show results at 50s
      if (pollOpen && !pollShowResults && t >= 50) {
        setPollShowResults(true);
      }
      // hide poll after 60s from open
      if (
        pollOpen &&
        pollStartTime !== null &&
        Date.now() - pollStartTime >= 60000
      ) {
        setPollOpen(false);
        setPollShowResults(false);
      }
    }

    function handleAll() {
      handleHeadline();
      handlePoll();
    }

    vid.addEventListener("timeupdate", handleAll);
    vid.addEventListener("seeking", handleAll);
    return () => {
      vid.removeEventListener("timeupdate", handleAll);
      vid.removeEventListener("seeking", handleAll);
    };
  }, [
    connecting,
    hasInteracted,
    hasShownHeadline,
    pollOpen,
    pollShowResults,
    pollStarted,
    pollStartTime,
  ]);

  // =====================================================
  // 5) Exit-intent
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
  // 6) Replay overlay at video end
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
  // 7) Clock widget (drag in at 10s, out ~20s)
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
    function startClock() {
      updateClock();
      clockIntervalRef.current = setInterval(updateClock, 1000);
    }
    function stopClock() {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
        clockIntervalRef.current = null;
      }
    }
    function handleTimeUpdate() {
      if (vid.currentTime >= 10 && !showClockWidget && !clockRemoved) {
        setShowClockWidget(true);
        startClock();
      }
      if (showClockWidget && !clockRemoved) {
        startClock();
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      stopClock();
    };
  }, [showClockWidget, clockRemoved, connecting]);

  useEffect(() => {
    // after dragIn done, wait 10s, dragOut
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  useEffect(() => {
    // once removed => hide fully after 1s
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

  // user clicked poll => show results
  const handlePollVote = () => {
    setPollShowResults(true);
  };

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
            // reset clock states
            setShowClockWidget(false);
            setClockDragInComplete(false);
            setClockRemoved(false);
          }}
        />
      )}

      {/* Double-sized Zoom container */}
      <div className={styles.zoomContainer}>
        <div className={styles.zoomTopBar}>
          {/* Left side: LIVE + Title */}
          <div className={styles.zoomTitle}>
            <div className={styles.zoomLiveDot}></div>
            Clients.ai Advanced Training
          </div>
          {/* Right side: "Live for X minutes" */}
          <div className={styles.zoomLiveMinutes}>
            Live for {liveMinutes} minute{liveMinutes === 1 ? "" : "s"}
          </div>
        </div>

        <div className={styles.twoColumnLayout}>
          {/* Video side */}
          <div className={styles.videoColumn}>
            <div
              className={styles.videoWrapper}
              ref={videoWrapperRef}
              // Only add the onMouseMove to show/hide the full screen button
              onMouseMove={handleMouseMoveOnVideo}
            >
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

              {/* NEW: Full Screen Button */}
              <button
                className={`${styles.fullScreenButton} ${
                  showFullScreenBtn ? styles.showFullScreenButton : ""
                }`}
                onClick={toggleFullScreen}
              >
                {isFullScreen ? "Exit Full Screen" : "Full Screen"}
              </button>
              {/* End Full Screen Button */}

              {/* Clock widget */}
              {showClockWidget && (
                <ClockWidget
                  currentTime={currentTimeString}
                  currentDate={currentDateObj}
                  dragInComplete={clockDragInComplete}
                  setDragInComplete={setClockDragInComplete}
                  clockRemoved={clockRemoved}
                />
              )}

              {/* Headline text */}
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

      {/* Footer */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Clients.ai
      </footer>

      {/* 
        ===========================================
        NEW: OFFER/TIMER + SOCIAL PROOF LOGIC BELOW
        ===========================================
      */}
      <OfferTimerAndProof videoRef={videoRef} />
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
  const [movementIntervalId, setMovementIntervalId] =
    useState<NodeJS.Timer | null>(null);

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName.includes("dragIn")) {
      setDragInComplete(true);
    }
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
    widgetClass += dragInComplete
      ? ` ${styles.wobble}`
      : ` ${styles.animateIn}`;
  } else {
    widgetClass += ` ${styles.animateOut}`;
  }

  return (
    <div
      className={widgetClass}
      onAnimationEnd={handleAnimationEnd}
      ref={widgetRef}
    >
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
// The Chat Box: EXACT waiting-room style + poll pinned at top
// ------------------------------------------------------------------
interface WebinarChatBoxProps {
  pollOpen: boolean;
  pollShowResults: boolean;
  onPollVote: () => void;
}

const WebinarChatBox: React.FC<WebinarChatBoxProps> = ({
  pollOpen,
  pollShowResults,
  onPollVote,
}) => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // -----------------------------------------------------
  // HELPER: add a message to the chat
  // -----------------------------------------------------
  function addMessage(
    text: string,
    type: "user" | "host" | "system",
    userName?: string
  ) {
    const chatEl = chatMessagesRef.current;
    const toggleEl = participantToggleRef.current;
    if (!chatEl || !toggleEl) return;

    const div = document.createElement("div");
    div.classList.add(styles.message);

    if (type === "user") {
      div.classList.add(styles.user);
    } else if (type === "host") {
      div.classList.add(styles.host);
    } else if (type === "system") {
      div.classList.add(styles.system);
    }

    if (userName && userName.trim()) {
      div.textContent = `${userName}: ${text}`;
    } else {
      div.textContent = text;
    }

    // If from "other participants"
    if (type === "user" && userName && userName !== "You") {
      div.setAttribute("data-participant", "true");
      // hide if toggle is off
      if (!toggleEl.checked) {
        (div as HTMLElement).style.display = "none";
      }
    }

    chatEl.appendChild(div);

    if (!isUserScrolling || userName === "You") {
      chatEl.scrollTop = chatEl.scrollHeight;
    }
  }

  // -----------------------------------------------------
  // AI "host" reply
  // -----------------------------------------------------
  async function handleAiReply(userMsg: string) {
    const typingEl = typingIndicatorRef.current;
    if (typingEl) {
      const delay = 1500 + Math.random() * 3500; // delay between 1s and 3s
      setTimeout(() => {
        typingEl.textContent = "Selina is typing...";
      }, delay);
    }

    try {
      // short random delay
      const randomDelay = 2000 + Math.random() * 3000;
      await new Promise((res) => setTimeout(res, randomDelay));

      const resp = await fetch(
        "https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg, type: "user" }),
        }
      );
      if (!resp.ok) throw new Error("AI call failed");

      const data = await resp.json();
      typingEl.textContent = "";

      if (data.response) {
        addMessage(data.response, "host", "Selina");
      }
    } catch (err) {
      console.error("AI error:", err);
      typingEl.textContent = "";
      addMessage(
        "Apologies, I'm having trouble connecting. Please try again!",
        "host",
        "Selina"
      );
    }
  }

  // -----------------------------------------------------
  // USE EFFECT: set up chat
  // -----------------------------------------------------
  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const toggleEl = participantToggleRef.current;
    const typingEl = typingIndicatorRef.current;

    if (!chatEl || !inputEl || !toggleEl || !typingEl) {
      console.warn("WebinarChatBox: missing refs.");
      return;
    }

    // track user scrolling
    function handleScroll() {
      const threshold = 50;
      const nearBottom =
        chatEl.scrollHeight - chatEl.clientHeight - chatEl.scrollTop <= threshold;
      setIsUserScrolling(!nearBottom);
    }
    chatEl.addEventListener("scroll", handleScroll);

    // connect socket
    const ws = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Webinar chat socket open");
      // scroll to bottom
      chatEl.scrollTop = chatEl.scrollHeight;
    };

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === "message") {
        // show message from other participants or system
        addMessage(
          data.text,
          data.messageType as "user" | "host" | "system",
          data.user
        );
      }
    };

    ws.onerror = (err) => {
      console.error("Webinar chat socket error:", err);
    };

    // handle "Show Others" toggle
    function handleToggle() {
      const participantMsgs = chatEl.querySelectorAll('[data-participant="true"]');
      participantMsgs.forEach((m) => {
        (m as HTMLElement).style.display = toggleEl.checked ? "block" : "none";
      });
      if (toggleEl.checked && !isUserScrolling) {
        chatEl.scrollTop = chatEl.scrollHeight;
      }
    }
    toggleEl.checked = false;
    toggleEl.addEventListener("change", handleToggle);

    // On user pressing Enter => user message + AI
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";

        // add local user message
        addMessage(userMsg, "user", "You");
        // call AI
        handleAiReply(userMsg);
      }
    }
    inputEl.addEventListener("keypress", handleKeyPress);

    // greet after 2s
    setTimeout(() => {
      addMessage(
        "Welcome to the Clients.ai Advanced Training! Feel free to chat while we get started!",
        "host",
        "Selina"
      );
    }, 2000);

    // schedule some random participants messages
    scheduleAttendeeMessages();
    // optionally: schedule preloaded Q's (like waiting page) etc.

    function cleanup() {
      chatEl.removeEventListener("scroll", handleScroll);
      toggleEl.removeEventListener("change", handleToggle);
      inputEl.removeEventListener("keypress", handleKeyPress);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }
    return cleanup;
  }, []);

  // -----------------------------------------------------
  // "Other participants" logic (random messages)
  // (like in waiting page so Show Others works)
  // -----------------------------------------------------
  function scheduleAttendeeMessages() {
    // same arrays from waiting page
    const names = [
      "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
      "Isabella", "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia",
      "Lucas", "Harper", "Henry", "Evelyn", "Alexander"
    ];
    const randomMsgs = [
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
      "im big in affiliate marketing, and this is wild!",
      "anyone else do big product launches? this is a game changer",
      "thx for putting this together!! 🙌",
      "just got here...hope i didnt miss too much",
      "can someone explain the pricing again??",
      "this is exactly what ive been looking for!!1!",
      "sry if this was covered already but will there b updates?",
      "this will save me so much time in my funnels",
      "who else is excited to learn about funnel analytics??",
      "my marketing team is watching too!"
    ];

    let total = Math.floor(Math.random() * 6) + 15; // random 15-20
    let delay = 4000; // start after 4s

    for (let i = 0; i < total; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const msg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];

      setTimeout(() => {
        addMessage(msg, "user", name);
      }, delay);

      delay += Math.random() * 1000 + 1500;
    }
  }

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

      {/* If poll is open, pinned at top */}
      {pollOpen && (
        <ChatPoll showResults={pollShowResults} onVote={onPollVote} />
      )}

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

// ------------------------------------------------------------------
// Poll pinned at top
// ------------------------------------------------------------------
const ChatPoll: React.FC<{
  showResults: boolean;
  onVote: () => void;
}> = ({ showResults, onVote }) => {
  if (!showResults) {
    // question
    return (
      <div className={styles.chatPollContainer}>
        <div className={styles.chatPollQuestion}>Which works better?</div>
        <div className={styles.chatPollButtons}>
          <button onClick={onVote}>Generic</button>
          <button onClick={onVote}>Personalized</button>
        </div>
      </div>
    );
  } else {
    // results
    return (
      <div className={styles.chatPollContainer}>
        <div className={styles.chatPollResults}>
          <div className={styles.pollBarRow}>
            <span>Generic</span>
            <div className={styles.pollBar}>
              <div className={styles.pollBarFillGeneric}></div>
            </div>
            <span>2.8%</span>
          </div>
          <div className={styles.pollBarRow}>
            <span>Personalized</span>
            <div className={styles.pollBar}>
              <div className={styles.pollBarFillPersonalized}></div>
            </div>
            <span>97.2%</span>
          </div>
          <div className={styles.pollResultText}>
            97.2% of participants said personalized marketing will perform better
          </div>
        </div>
      </div>
    );
  }
};

export default WebinarView;

//
// ==================================================================
// NEW COMPONENT: Offer Timer + Social Proof (added at the very bottom)
// ==================================================================
//
type OfferTimerAndProofProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

const OfferTimerAndProof: React.FC<OfferTimerAndProofProps> = ({ videoRef }) => {
  // This overlay appears at 45 minutes (2700s) into the video
  // Timer runs 40 minutes, from 19 spots -> down to 2
  // Social proof notifications start at 46 minutes (2760s)

  const [showOffer, setShowOffer] = useState(false);
  const [offerEndTime, setOfferEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes in seconds
  const [spotsRemaining, setSpotsRemaining] = useState(19);
  const spotsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [investedCount, setInvestedCount] = useState(0); // how many have "bought"

  // Minimal random user names for notifications (reuse from Chat):
  const userNames = [
    "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
    "Isabella", "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia",
    "Lucas", "Harper", "Henry", "Evelyn", "Alexander"
  ];

  // 1) Watch video time => show offer at 45:00
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleTimeUpdate() {
      const t = vid.currentTime;
      // Once we cross 2700s (45 min), show the offer if not shown
      if (!showOffer && t >= 2700) {
        setShowOffer(true);
        setOfferEndTime(Date.now() + 40 * 60 * 1000); // 40 min from now
      }
      // At 46:00 => show notifications
      if (!showNotifications && t >= 2760) {
        setShowNotifications(true);
      }
    }
    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, [showOffer, showNotifications, videoRef]);

  // 2) Count down the 40 min once offer is shown
  useEffect(() => {
    if (!showOffer || !offerEndTime) return;

    const timerId = setInterval(() => {
      const diff = offerEndTime - Date.now();
      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(timerId);
        setSpotsRemaining((prev) => (prev < 2 ? prev : 2)); // end at 2
      } else {
        setTimeLeft(Math.ceil(diff / 1000));
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [showOffer, offerEndTime]);

  // 3) Randomly decrement spots from 19 down to 2 over 40 minutes
  // each decrement "means" an investor
  useEffect(() => {
    if (!showOffer) return;
    if (spotsRemaining <= 2) return;

    // Decrement once at a random interval (30 - 120s)
    const interval = Math.floor(Math.random() * 90 + 30) * 1000;
    spotsIntervalRef.current = setTimeout(() => {
      setSpotsRemaining((prev) => {
        if (prev <= 2) return prev;
        return prev - 1;
      });
    }, interval);

    return () => {
      if (spotsIntervalRef.current) clearTimeout(spotsIntervalRef.current);
    };
  }, [showOffer, spotsRemaining]);

  // 4) Track how many have invested => occasionally show host congrats message
  useEffect(() => {
    const totalInvested = 19 - spotsRemaining;
    if (totalInvested > investedCount) {
      setInvestedCount(totalInvested);
    }
  }, [spotsRemaining, investedCount]);

  // 5) When investedCount changes by ~3, post a subtle chat message from Selina
  useEffect(() => {
    if (!showNotifications) return;
    if (investedCount < 1) return;

    // if investedCount is multiple of ~3 => show a "Selina" chat
    if (investedCount % 3 === 0) {
      postSelinaCongrats(investedCount);
    }
  }, [investedCount, showNotifications]);

  // 6) Also post bottom-right notifications for new invests
  // triggered each time spotsRemaining changes
  useEffect(() => {
    if (!showNotifications) return;
    if (spotsRemaining >= 19) return; // no invests yet

    // show a quick toast
    const name = userNames[Math.floor(Math.random() * userNames.length)];
    const randToastId = `toast_${Date.now()}_${Math.random()}`;
    createInvestmentToast(name, randToastId);
  }, [spotsRemaining, showNotifications]);

  // --- HELPER: create bottom-right toast
  function createInvestmentToast(buyerName: string, toastId: string) {
    const container = document.createElement("div");
    container.className = styles.notification;
    container.id = toastId;

    const icon = document.createElement("div");
    icon.className = styles.notificationIcon;
    icon.textContent = "!";

    const content = document.createElement("div");
    content.innerHTML = `<strong>${buyerName}</strong> just joined!`;

    container.appendChild(icon);
    container.appendChild(content);
    document.body.appendChild(container);

    setTimeout(() => {
      if (document.getElementById(toastId)) {
        document.body.removeChild(container);
      }
    }, 4500); // vanish after ~4.5s
  }

  // --- HELPER: post a "Selina" chat message with subtle grammar and matter-of-fact tone
  function postSelinaCongrats(numInvested: number) {
    // minimal grammar variations
    const phrases = [
      `Just a quick shout out to the ${numInvested} new folks that took the leap. So happy to see you here.`,
      `Wanted to say congrats to the ${numInvested} new people who hopped in. Real excited for you all!`,
      `We’ve got about ${numInvested} new people in so far, so that’s amazing. Wishing you a huge transformation ahead!`,
      `Huge welcome to the ${numInvested} new invests that just came in. Grateful you’re taking steps!`
    ];
    const m = phrases[Math.floor(Math.random() * phrases.length)];

    // We'll do a quick approach using the same chat method the poll uses:
    // We'll dispatch a custom event with "Selina" message
    window.dispatchEvent(
      new CustomEvent("webinar-selina-chat", {
        detail: { text: m }
      })
    );
  }

  // Listen for custom event => inject it as a "host" message
  useEffect(() => {
    function handleSelinaChat(e: any) {
      const detail = e.detail;
      if (!detail?.text) return;
      // We'll find the chat box and create a "host" message
      const chatArea = document.querySelector(`.${styles.chatMessages}`);
      if (!chatArea) return;

      const msgDiv = document.createElement("div");
      msgDiv.classList.add(styles.message, styles.host);
      msgDiv.textContent = `Selina: ${detail.text}`;
      chatArea.appendChild(msgDiv);

      // scroll to bottom
      (chatArea as HTMLDivElement).scrollTop = chatArea.scrollHeight;
    }
    window.addEventListener("webinar-selina-chat", handleSelinaChat as any);
    return () => {
      window.removeEventListener("webinar-selina-chat", handleSelinaChat as any);
    };
  }, []);

  // Render the Offer Timer if showOffer is true
  if (!showOffer) return null;

  // Format timeLeft
  const mm = Math.floor(timeLeft / 60);
  const ss = timeLeft % 60;
  const timeString = `${mm.toString().padStart(2, "0")}:${ss
    .toString()
    .padStart(2, "0")}`;

  return createPortal(
    <div className={styles.offerOverlay}>
      <div className={styles.offerContainer}>
        <div className={styles.offerTitle}>Special Enrollment!</div>
        <div className={styles.offerTimerRow}>
          <div className={styles.offerTimerBox}>
            <span>Time Left:</span>
            <strong>{timeString}</strong>
          </div>
          <div className={styles.offerSpotsBox}>
            <span>Spots Remaining:</span>
            <strong>{spotsRemaining}</strong>
          </div>
        </div>
        <button
          className={styles.investNowBtn}
          onClick={() => {
            window.open("https://yes.prognostic.ai", "_blank");
          }}
        >
          Invest Now
        </button>
      </div>
    </div>,
    document.body
  );
};

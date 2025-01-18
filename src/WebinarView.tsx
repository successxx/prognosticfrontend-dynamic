import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./WebinarView.module.css"; 
// ***** REMOVED the second import "./WebinarView.module.css"; *****

// For the chat logic
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
  // ADDED FOR HEADLINE: new state to store text + toggle its visibility
  // ------------------------------------------
  const [headline, setHeadline] = useState("");
  const [showHeadline, setShowHeadline] = useState(false);
  const [hasShownHeadline, setHasShownHeadline] = useState(false);

  // ------------------------------------------
  // POLL logic: triggers at 20s
  // ------------------------------------------
  const [pollStarted, setPollStarted] = useState(false);
  const [pollOpen, setPollOpen] = useState(false);
  const [pollShowResults, setPollShowResults] = useState(false);
  const [pollStartTime, setPollStartTime] = useState<number | null>(null);

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
            `https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(
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
          // exit message
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }

          // HEADLINE
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
  // HEADLINE & POLL timing
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleHeadlineTiming() {
      const time = vid.currentTime;
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
      const time = vid.currentTime;
      // poll at 20s
      if (!pollStarted && time >= 20) {
        setPollStarted(true);
        setPollOpen(true);
        setPollStartTime(Date.now());
      }
      // show results at 50s
      if (pollOpen && !pollShowResults && time >= 50) {
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
  // 5) Replay overlay when video ends
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
  // 6) Clock widget (drag in at 10s, out ~20s)
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
      if (vid.currentTime >= 10 && !showClockWidget && !clockRemoved) {
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
    // once dragIn completes, wait 10s, then dragOut
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  useEffect(() => {
    // once removed, hide fully after 1s
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

  // Poll: user voted => show results
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

      {/* Double-sized Zoom container so video + chat match heights */}
      <div className={styles.zoomContainer}>
        <div className={styles.zoomTopBar}>
          {/* Left side: LIVE + Title */}
          <div className={styles.zoomTitle}>
            <div className={styles.zoomLiveDot}></div>
            PrognosticAI Advanced Training
          </div>
          {/* Right side: smaller "Live for X minutes" */}
          <div className={styles.zoomLiveMinutes}>
            Live for {liveMinutes} minute{liveMinutes === 1 ? "" : "s"}
          </div>
        </div>

        {/* 70/30 layout, container is large */}
        <div className={styles.twoColumnLayout}>
          {/* Video side */}
          <div className={styles.videoColumn}>
            <div className={styles.videoWrapper}>
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

              {/* Headline text (absolutely positioned) */}
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

          {/* Chat side - same height as video */}
          <div className={styles.chatColumn}>
            <WebinarChatBox
              pollOpen={pollOpen}
              pollShowResults={pollShowResults}
              onPollVote={handlePollVote}
            />
          </div>
        </div>
      </div>

      {/* Subtle copyright at bottom */}
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
// Clock Widget with same "human random wobble"
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
// Webinar Chat Box: replaced with waiting-room style logic so AI works
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

  // Add a message to chat
  function addMessage(
    text: string,
    msgType: "user" | "host" | "system",
    userName?: string,
    autoScroll = true
  ) {
    const chatEl = chatMessagesRef.current;
    const toggleEl = participantToggleRef.current;
    if (!chatEl || !toggleEl) return;

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

    // If from other participants
    if (msgType === "user" && userName && userName !== "You") {
      div.setAttribute("data-participant", "true");
      if (!toggleEl.checked) {
        div.style.display = "none";
      }
    }

    chatEl.appendChild(div);

    if (autoScroll || userName === "You") {
      if (!isUserScrolling) {
        chatEl.scrollTop = chatEl.scrollHeight;
      }
    }
  }

  async function handleAiReply(userMsg: string) {
    const typingEl = typingIndicatorRef.current;
    if (typingEl) typingEl.textContent = "Selina is typing...";

    try {
      // short random delay to simulate "typing"
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
      if (typingEl) typingEl.textContent = "";

      if (data.response) {
        addMessage(data.response, "host", "Selina");
      }
    } catch (err) {
      console.error("AI error:", err);
      if (typingEl) typingEl.textContent = "";
      addMessage(
        "Apologies, I'm having trouble connecting. Please try again!",
        "host",
        "Selina"
      );
    }
  }

  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const toggleEl = participantToggleRef.current;
    const typingEl = typingIndicatorRef.current;

    if (!chatEl || !inputEl || !toggleEl || !typingEl) {
      console.warn("Some chat refs missing in WebinarChatBox.");
      return;
    }

    // handle scroll
    function handleScroll() {
      const threshold = 50;
      setIsUserScrolling(
        chatEl.scrollHeight - chatEl.clientHeight - chatEl.scrollTop > threshold
      );
    }
    chatEl.addEventListener("scroll", handleScroll);

    // connect socket
    const ws = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Webinar chat: Connected to WS");
    };

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === "message") {
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

    // toggle show/hide participants
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

    // user typed Enter => user message + AI reply
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";

        addMessage(userMsg, "user", "You", false);
        handleAiReply(userMsg);
      }
    }
    inputEl.addEventListener("keypress", handleKeyPress);

    // cleanup
    return () => {
      chatEl.removeEventListener("scroll", handleScroll);
      toggleEl.removeEventListener("change", handleToggle);
      inputEl.removeEventListener("keypress", handleKeyPress);

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

      {/* Poll pinned if open */}
      {pollOpen && (
        <ChatPoll showResults={pollShowResults} onVote={onPollVote} />
      )}

      <div className={styles.chatMessages} ref={chatMessagesRef} />

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

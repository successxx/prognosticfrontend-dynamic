import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./WebinarView.module.css";
import "./WebinarView.module.css";

// For the chat logic
// interface ChatMessage {
//   text: string;
//   type: "user" | "host" | "system";
//   userName?: string;
// }

// -------------- UTILITY: Wait --------------
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const WebinarView: React.FC = () => {
  // ------------------ Refs ------------------
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioRefTwo = useRef<HTMLAudioElement | null>(null);
  const messageToneRef = useRef<HTMLAudioElement | null>(null);

  // Full screen container ref
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

  // Spots / invests
  const [spotsRemaining, setSpotsRemaining] = useState<number>(19); // starts at 19
  const [offerActive, setOfferActive] = useState(false);

  // Array to store invests so we can group them for Selina’s chat
  const investsQueueRef = useRef<{ name: string; time: number }[]>([]);

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
      const secondAudioTime = 5; // second audio at 5s
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
        clearInterval(clockIntervalRef.current as unknown as number);
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

  // =====================================================
  // 7) “Special Offer” & invests logic
  //    - Offer shows at 45min; runs 40min
  //    - Invest popups start at 46min
  //    - Spots from 19 -> 2, each invest reduces 1
  //    - Selina lumps invests & congratulates in chat
  // =====================================================
  useEffect(() => {
    // 45 min => 2700s => 2700000ms
    const specialOfferTimeout = setTimeout(() => {
      setOfferActive(true);
    }, 2700000); // 45 minutes

    // The invests popups start after 46 minutes
    // We create an interval only AFTER 46 min, then random invests
    const investsStartTimeout = setTimeout(() => {
      startInvestPopups();
    }, 2760000); // 46 minutes

    return () => {
      clearTimeout(specialOfferTimeout);
      clearTimeout(investsStartTimeout);
    };
  }, []);

  // This function starts an interval that triggers invests
  // spaced out so 17 invests happen over 40 minutes => from 19 -> 2
  function startInvestPopups() {
    const investsNeeded = 17; // from 19 -> 2 spots
    const totalDurationMs = 40 * 60 * 1000; // 40 min
    // We'll schedule invests randomly across these 40 minutes.
    // Each invests -> spotsRemaining - 1, show popup
    // We'll spread invests over the 40 minutes somewhat randomly,
    // but so all happen by the end.

    const investsTimes: number[] = [];
    for (let i = 0; i < investsNeeded; i++) {
      // pick a random time in [0..2400) seconds
      // but not all near the start. We'll do a uniform distribution
      // or slightly random.
      const r = Math.random(); // [0..1)
      investsTimes.push(r * totalDurationMs);
    }
    investsTimes.sort((a, b) => a - b);

    investsTimes.forEach((timeMs, index) => {
      setTimeout(() => {
        triggerSingleInvest();
      }, timeMs);
    });

    // Also start a separate loop that every ~6–10 min checks investsQueue for grouping
    setInterval(() => {
      processInvestsQueue();
    }, Math.floor(Math.random() * 4 + 6) * 60 * 1000); // every 6-10 min
  }

  // Trigger a single invest event => show popup, reduce spots, add to investsQueue
  function triggerSingleInvest() {
    if (spotsRemaining <= 2) return; // if we're already at 2, don't go further
    // pick random from chat participants
    const name = pickRandomChatUser();
    if (!name) return;

    // Show popup
    showInvestNotif(name);
    // reduce spots
    setSpotsRemaining((prev) => Math.max(2, prev - 1));

    // add to investsQueue
    investsQueueRef.current.push({ name, time: Date.now() });
  }

  // Periodically checks investsQueue for groups and posts a single Selina chat
  async function processInvestsQueue() {
    // If we have 2 or more invests that haven’t been congratulated
    if (investsQueueRef.current.length >= 2) {
      // Let's gather 2–3 invests
      const investsToCongrat = investsQueueRef.current.splice(
        0,
        Math.floor(Math.random() * 2) + 2
      );
      // create a single chat message
      let names = investsToCongrat.map((i) => i.name);
      // quick shuffle if you want
      names = names.sort(() => 0.5 - Math.random());

      // Slightly "imperfect" grammar + short text
      const variant = Math.floor(Math.random() * 3);
      let message = "";
      switch (variant) {
        case 0:
          message = `Congrats to ${names.join(
            " and "
          )} for diving in with PrognosticAI! so psyched for your future!`;
          break;
        case 1:
          message = `Just want to say I'm proud of ${names.join(
            " & "
          )} for making that leap. big step forward guys, can't wait to see the transformation.`;
          break;
        default:
          message = `quick shoutout to ${names.join(
            " + "
          )}! appreciate you trusting PrognosticAI... can't wait to see what you do.`;
          break;
      }
      // Insert system or host message
      const chatEl = document.querySelector(`.${styles.chatMessages}`);
      if (chatEl) {
        const div = document.createElement("div");
        div.classList.add(styles.message, styles.host);
        div.textContent = message;
        chatEl.appendChild(div);

        // If user isn't actively scrolling, scroll to bottom
        if (!isUserScrollingNearBottom(chatEl)) {
          chatEl.scrollTop = chatEl.scrollHeight;
        }
      }
    }
  }

  function isUserScrollingNearBottom(chatEl: Element) {
    const threshold = 60;
    return (
      chatEl.scrollHeight - (chatEl as HTMLElement).clientHeight -
        (chatEl as HTMLElement).scrollTop >
      threshold
    );
  }

  // Minimal approach to pick from the chat's known “names”:
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
    "Michael",
    "Sarah",
    "David",
    "Rachel",
    "Thomas",
    "Lisa",
    "Alex",
    "Jennifer",
    "Daniel",
    "Sophie",
    "Ryan",
    "Maria",
  ];
  function pickRandomChatUser() {
    return names[Math.floor(Math.random() * names.length)];
  }

  // Show “invest” popup
  function showInvestNotif(userName: string) {
    const container = document.createElement("div");
    container.className = styles.investNotification;

    const titleDiv = document.createElement("div");
    titleDiv.className = styles.investNotificationTitle;
    titleDiv.textContent = "New Investment!";

    const textDiv = document.createElement("div");
    textDiv.textContent = `${userName} just invested in PrognosticAI!`;

    container.appendChild(titleDiv);
    container.appendChild(textDiv);
    document.body.appendChild(container);

    // remove after ~6s (fadeOut starts at 5.6s)
    setTimeout(() => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 6000);
  }

  // =====================================================
  // FULL SCREEN Toggle
  // =====================================================
  const handleToggleFullScreen = () => {
    if (!videoWrapperRef.current) return;
    if (!document.fullscreenElement) {
      videoWrapperRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit full-screen mode:", err);
      });
    }
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

        {/* 70/30 layout */}
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

              {/* Fullscreen button (top-right corner or similar) */}
              <button
                onClick={handleToggleFullScreen}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(255,255,255,0.85)",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Full Screen
              </button>

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
            <WebinarChatBox />
          </div>
        </div>

        {/* If offerActive, show the red offer bar in Chat + start the countdown */}
        {/* The chat snippet handles .specialOffer etc. */}
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

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName.includes("dragIn")) {
      setDragInComplete(true);
    }
  };

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
// The Chat Box
//  - The special offer & countdown start showing at 45 min (via parent state).
//  - We adapt here to handle a 40-min countdown, from 10:00 -> 0:00
//  - At the same time, we can display "Remaining spots: X" that goes from 19->2
// ------------------------------------------------------------------
const WebinarChatBox: React.FC = () => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const specialOfferEl = useRef<HTMLDivElement | null>(null);
  const countdownElRef = useRef<HTMLDivElement | null>(null);
  const investBtn = useRef<HTMLButtonElement | null>(null);
  const [offerVisible, setOfferVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 min => 2400s

  // So that we only start the 40-min countdown once
  const countdownStartedRef = useRef(false);

  useEffect(() => {
    // Scroll / toggle refs
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;
    const spOfferEl = specialOfferEl.current;
    const cdEl = countdownElRef.current;
    const inBtn = investBtn.current;

    if (!chatEl || !inputEl || !typingEl || !toggleEl || !spOfferEl || !cdEl) {
      console.warn("Some chat refs missing; chat may not fully work.");
      return;
    }

    // Chat scrolling
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
      // no-op
    }
    chatEl.addEventListener("scroll", handleScroll);

    // Toggle show/hide participants
    function handleToggle() {
      const participantMsgs = chatEl.querySelectorAll('[data-participant="true"]');
      participantMsgs.forEach((m) => {
        (m as HTMLElement).style.display = toggleEl.checked ? "block" : "none";
      });
      if (toggleEl.checked && isNearBottom()) {
        scrollToBottom();
      }
    }
    toggleEl.checked = false;
    toggleEl.addEventListener("change", handleToggle);

    // Send user message on Enter
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(userMsg, "user", "You");
        handleUserMessage(userMsg);
      }
    }
    inputEl.addEventListener("keypress", handleKeyPress);

    // "Invest" button
    inBtn?.addEventListener("click", () => {
      window.open("https://yes.prognostic.ai", "_blank");
    });

    // Start checking for the parent’s 45-min mark
    const checkOfferInterval = setInterval(() => {
      const diffMin = (Date.now() - (window as any).webinarStartTime) / 60000;
      // We do a simpler approach: rely on the parent’s side effect.
      // In reality, we can do a direct approach:
      // Because we already set the parent so that at 45 min it sets 'offerActive=true'
      // But let's keep it simple here -> We'll watch the DOM, see if .specialOffer is used.

      // Instead, we'll just see if the parent set "offerActive" by checking the style or some event.
      // To keep it minimal, let's watch if it's been placed in the DOM.
      // We'll do a simpler approach:
      if (!offerVisible && spOfferEl.style.display === "block") {
        setOfferVisible(true);
        // start our 40-min countdown
        if (!countdownStartedRef.current) {
          countdownStartedRef.current = true;
          startCountdown();
        }
      }
    }, 1000);

    function startCountdown() {
      spOfferEl.style.display = "block"; // show the offer
      const cd = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(cd);
            spOfferEl.style.display = "none";
          }
          return Math.max(0, prev - 1);
        });
      }, 1000);
    }

    return () => {
      chatEl.removeEventListener("scroll", handleScroll);
      toggleEl.removeEventListener("change", handleToggle);
      inputEl.removeEventListener("keypress", handleKeyPress);
      clearInterval(checkOfferInterval);
    };
    // eslint-disable-next-line
  }, []);

  // Update the countdown display
  useEffect(() => {
    if (countdownElRef.current) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      countdownElRef.current.textContent = `Special Offer Ends In: ${minutes}:${String(
        seconds
      ).padStart(2, "0")}`;
    }
  }, [timeLeft]);

  // The user’s chat messages => calls the AI
  async function handleUserMessage(msg: string) {
    // Simulate “Selina is typing...”
    if (!typingIndicatorRef.current) return;
    typingIndicatorRef.current.textContent = "Selina is typing...";

    // Minimal artificial delay
    await wait(Math.random() * 4000 + 2000);
    typingIndicatorRef.current.textContent = "";
    // Just a dummy response
    addMessage(
      "Thanks for the question! We'll cover that in the Q&A later on.",
      "host",
      "Selina (Host)"
    );
  }

  // Add a chat message
  function addMessage(
    text: string,
    msgType: "user" | "host" | "system",
    userName?: string
  ) {
    if (!chatMessagesRef.current) return;
    const chatEl = chatMessagesRef.current;

    const div = document.createElement("div");
    div.classList.add(styles.message);
    if (msgType === "user") {
      div.classList.add(styles.user);
      if (userName && userName !== "You") {
        div.setAttribute("data-participant", "true");
      }
    }
    if (msgType === "host") div.classList.add(styles.host);
    if (msgType === "system") div.classList.add(styles.system);

    if (userName) {
      div.textContent = `${userName}: ${text}`;
    } else {
      div.textContent = text;
    }

    chatEl.appendChild(div);

    // Scroll
    chatEl.scrollTop = chatEl.scrollHeight;
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

      <div
        className={styles.specialOffer}
        ref={specialOfferEl}
        style={{ display: "none" }}
      >
        <div className={styles.countdown} ref={countdownElRef}>
          Special Offer Ends In: 40:00
        </div>
        {/* Spots remaining - elegantly displayed under the countdown */}
        <div className={styles.spotsRemaining} id="spotsRemaining">
          Remaining Spots: 19
        </div>
        <button className={styles.investButton} ref={investBtn}>
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

export default WebinarView;

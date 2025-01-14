import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./WebinarView.module.css";
import "./WebinarView.module.css";

// Utility for a small wait
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const WebinarView: React.FC = () => {
  // ------------------ Refs ------------------
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioRefTwo = useRef<HTMLAudioElement | null>(null);
  const messageToneRef = useRef<HTMLAudioElement | null>(null);

  // We'll reference the video container to request fullscreen
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
  const [spotsRemaining, setSpotsRemaining] = useState<number>(19);
  const [offerActive, setOfferActive] = useState(false);
  const investsQueueRef = useRef<{ name: string; time: number }[]>([]);

  // ------------------ NEW: Poll at 20s ------------------
  const [pollVisible, setPollVisible] = useState(false);
  const [pollAnswered, setPollAnswered] = useState<boolean>(false);
  const [pollResultsShown, setPollResultsShown] = useState<boolean>(false);

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
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  useEffect(() => {
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
  //    - Offer shows at 45min; invests start at 46min
  //    - 17 invests => spots 19->2
  //    - Selina lumps invests in chat
  // =====================================================
  useEffect(() => {
    const specialOfferTimeout = setTimeout(() => {
      setOfferActive(true);
    }, 2700000); // 45 min

    const investsStartTimeout = setTimeout(() => {
      startInvestPopups();
    }, 2760000); // 46 min

    return () => {
      clearTimeout(specialOfferTimeout);
      clearTimeout(investsStartTimeout);
    };
  }, []);

  function startInvestPopups() {
    const investsNeeded = 17;
    const totalDurationMs = 40 * 60 * 1000; // 40 min
    const investsTimes: number[] = [];
    for (let i = 0; i < investsNeeded; i++) {
      const r = Math.random();
      investsTimes.push(r * totalDurationMs);
    }
    investsTimes.sort((a, b) => a - b);

    investsTimes.forEach((timeMs) => {
      setTimeout(() => {
        triggerSingleInvest();
      }, timeMs);
    });

    // Check investsQueue for grouping every 6-10 min
    setInterval(() => {
      processInvestsQueue();
    }, Math.floor(Math.random() * 4 + 6) * 60 * 1000);
  }

  function triggerSingleInvest() {
    if (spotsRemaining <= 2) return;
    const name = pickRandomChatUser();
    if (!name) return;
    showInvestNotif(name);
    setSpotsRemaining((prev) => Math.max(2, prev - 1));
    investsQueueRef.current.push({ name, time: Date.now() });
  }

  function processInvestsQueue() {
    if (investsQueueRef.current.length >= 2) {
      const investsToCongrat = investsQueueRef.current.splice(
        0,
        Math.floor(Math.random() * 2) + 2
      );
      let names = investsToCongrat.map((i) => i.name);
      names = names.sort(() => 0.5 - Math.random());

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
      const chatEl = document.querySelector(`.${styles.chatMessages}`);
      if (chatEl) {
        const div = document.createElement("div");
        div.classList.add(styles.message, styles.host);
        div.textContent = message;
        chatEl.appendChild(div);

        // scroll if not near bottom
        if (!isUserScrollingNearBottom(chatEl as HTMLElement)) {
          (chatEl as HTMLElement).scrollTop = (chatEl as HTMLElement).scrollHeight;
        }
      }
    }
  }

  function isUserScrollingNearBottom(chatEl: HTMLElement) {
    const threshold = 60;
    return (
      chatEl.scrollHeight - chatEl.clientHeight - chatEl.scrollTop > threshold
    );
  }

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

    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 6000);
  }

  // =====================================================
  // 8) Poll logic: appear at 20s -> if no click by 50s => show results -> hide at 80s
  // =====================================================
  useEffect(() => {
    // Show poll at 20s
    const pollAppearTimer = setTimeout(() => {
      setPollVisible(true);
    }, 20000);

    // If not answered by 50s total, show results
    const pollForceResultsTimer = setTimeout(() => {
      if (!pollAnswered) {
        setPollResultsShown(true);
      }
    }, 50000);

    // Hide poll at 80s total
    const pollHideTimer = setTimeout(() => {
      setPollVisible(false);
    }, 80000);

    return () => {
      clearTimeout(pollAppearTimer);
      clearTimeout(pollForceResultsTimer);
      clearTimeout(pollHideTimer);
    };
  }, [pollAnswered]);

  const handlePollAnswer = (choice: string) => {
    setPollAnswered(true);
    // short smooth delay to mimic "voting" effect
    setTimeout(() => {
      setPollResultsShown(true);
    }, 800); // slight delay for transition effect
  };

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

              {/* Full screen button (smooth fade-in on hover) */}
              <button
                onClick={handleToggleFullScreen}
                className={styles.fullscreenButton}
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

          <div className={styles.chatColumn}>
            {/* Pass poll states/logic to Chat */}
            <WebinarChatBox
              offerActive={offerActive}
              pollVisible={pollVisible}
              pollResultsShown={pollResultsShown}
              onPollAnswer={handlePollAnswer}
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
}> = ({ currentTime, currentDate, dragInComplete, setDragInComplete, clockRemoved }) => {
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
// Chat Box with Offer & Poll
// ------------------------------------------------------------------
interface ChatBoxProps {
  offerActive: boolean;
  pollVisible: boolean;
  pollResultsShown: boolean;
  onPollAnswer: (choice: string) => void;
}
const WebinarChatBox: React.FC<ChatBoxProps> = ({
  offerActive,
  pollVisible,
  pollResultsShown,
  onPollAnswer,
}) => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const specialOfferEl = useRef<HTMLDivElement | null>(null);
  const countdownElRef = useRef<HTMLDivElement | null>(null);
  const investBtn = useRef<HTMLButtonElement | null>(null);

  // 40-min countdown
  const [offerVisible, setOfferVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const countdownStartedRef = useRef(false);

  useEffect(() => {
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

    function handleScroll() {
      // no-op
    }
    chatEl.addEventListener("scroll", handleScroll);

    // Toggle participants
    function handleToggle() {
      const participantMsgs = chatEl.querySelectorAll('[data-participant="true"]');
      participantMsgs.forEach((m) => {
        (m as HTMLElement).style.display = toggleEl.checked ? "block" : "none";
      });
    }
    toggleEl.checked = false;
    toggleEl.addEventListener("change", handleToggle);

    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(userMsg, "user", "You");
        handleUserMessage(userMsg);
      }
    }
    inputEl.addEventListener("keypress", handleKeyPress);

    inBtn?.addEventListener("click", () => {
      window.open("https://yes.prognostic.ai", "_blank");
    });

    // Check for special offer activation
    const checkOfferInterval = setInterval(() => {
      if (offerActive && !offerVisible) {
        // show the offer + start countdown if not started
        spOfferEl.style.display = "block";
        setOfferVisible(true);

        if (!countdownStartedRef.current) {
          countdownStartedRef.current = true;
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
      }
    }, 1000);

    return () => {
      chatEl.removeEventListener("scroll", handleScroll);
      toggleEl.removeEventListener("change", handleToggle);
      inputEl.removeEventListener("keypress", handleKeyPress);
      clearInterval(checkOfferInterval);
    };
  }, [offerActive, offerVisible]);

  useEffect(() => {
    if (countdownElRef.current) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      countdownElRef.current.textContent = `Special Offer Ends In: ${minutes}:${String(
        seconds
      ).padStart(2, "0")}`;
    }
  }, [timeLeft]);

  // Minimal “Selina is typing” simulation
  async function handleUserMessage(msg: string) {
    if (!typingIndicatorRef.current) return;
    typingIndicatorRef.current.textContent = "Selina is typing...";
    await wait(Math.random() * 4000 + 2000);
    typingIndicatorRef.current.textContent = "";
    addMessage(
      "Thanks for the question! We'll cover that in the Q&A later on.",
      "host",
      "Selina (Host)"
    );
  }

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
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  // Poll UI pinned at top
  // Appear/disappear with transitions
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

      {/* Poll Container */}
      <div
        className={
          pollVisible ? `${styles.pollContainer} ${styles.pollContainerActive}` : styles.pollContainer
        }
        style={{ maxHeight: pollVisible ? "500px" : "0px", opacity: pollVisible ? 1 : 0 }}
      >
        {!pollResultsShown ? (
          <>
            <div className={styles.pollQuestion}>Which works better?</div>
            <div className={styles.pollOptions}>
              <button
                className={styles.pollOptionButton}
                onClick={() => onPollAnswer("Generic")}
              >
                Generic
              </button>
              <button
                className={styles.pollOptionButton}
                onClick={() => onPollAnswer("Personalized")}
              >
                Personalized
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.pollQuestion}>Which works better?</div>
            {/* Show final results (always 5% vs 95%) */}
            <div className={styles.pollResults}>
              <div>Generic: 5%</div>
              <div>Personalized: 95%</div>
              <div className={styles.pollResultsBar}>
                <div className={styles.pollResultsBarSegment1}></div>
                <div className={styles.pollResultsBarSegment2}></div>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        className={styles.specialOffer}
        ref={specialOfferEl}
        style={{ display: "none" }}
      >
        <div className={styles.countdown} ref={countdownElRef}>
          Special Offer Ends In: 40:00
        </div>
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

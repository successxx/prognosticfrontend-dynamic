import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./WebinarView.module.css";
import "./WebinarView.module.css";

// Utility for small waits
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

  // ============= Special Offer & invests states =============
  const [offerActive, setOfferActive] = useState(false); // triggers at 45 min
  const [spotsRemaining, setSpotsRemaining] = useState<number>(19);
  const investsQueueRef = useRef<{ name: string; time: number }[]>([]);

  // Countdown for offer (40 min)
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [offerVisible, setOfferVisible] = useState(false);
  const countdownStartedRef = useRef(false);

  // ============= Poll states =============
  const [pollVisible, setPollVisible] = useState(false);
  const [pollAnswered, setPollAnswered] = useState(false);
  const [pollResultsShown, setPollResultsShown] = useState(false);

  // =====================================================
  // Safe audio playback
  // =====================================================
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

      // Attempt autoplay
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

    function handleFirstAudio() {
      // At 3s
      if (vid.currentTime >= 3) {
        safePlayAudio(audioRef.current);
        vid.removeEventListener("timeupdate", handleFirstAudio);
      }
    }
    function handleSecondAudio() {
      // At 5s
      if (vid.currentTime >= 5) {
        safePlayAudio(audioRefTwo.current);
        vid.removeEventListener("timeupdate", handleSecondAudio);
      }
    }

    vid.addEventListener("timeupdate", handleFirstAudio);
    vid.addEventListener("timeupdate", handleSecondAudio);

    return () => {
      vid.removeEventListener("timeupdate", handleFirstAudio);
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
  // 7) Special Offer at 45 min; invests at 46 min
  // =====================================================
  useEffect(() => {
    // Start the offer at 45 min => 2700000 ms
    const specialOfferTimeout = setTimeout(() => {
      setOfferActive(true);
    }, 2700000);

    // Start invests at 46 min => 2760000 ms
    const investsStartTimeout = setTimeout(() => {
      startInvestPopups();
    }, 2760000);

    return () => {
      clearTimeout(specialOfferTimeout);
      clearTimeout(investsStartTimeout);
    };
    // eslint-disable-next-line
  }, []);

  function startInvestPopups() {
    const investsNeeded = 17; // from 19 -> 2
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

    // periodically check investsQueue for grouping
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
    // lumps invests in chat in groups of 2-3
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

        // auto-scroll if near bottom
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

  // Show invests (Jony Ive style, no emojis)
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
  // 8) Poll logic: pinned at top, 20s => show, 50s => forced results, 80s => hide
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleTimeUpdate() {
      // show poll at 20s
      if (vid.currentTime >= 20 && !pollVisible && !pollResultsShown) {
        setPollVisible(true);
      }
      // forced results at 50s
      if (vid.currentTime >= 50 && pollVisible && !pollAnswered) {
        setPollResultsShown(true);
      }
      // hide poll at 80s
      if (vid.currentTime >= 80 && pollVisible) {
        setPollVisible(false);
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [pollVisible, pollAnswered, pollResultsShown]);

  const handlePollAnswer = (choice: string) => {
    setPollAnswered(true);
    setTimeout(() => {
      setPollResultsShown(true);
    }, 700); // quick delay for transition
  };

  // =====================================================
  // 9) Offer countdown: once offerActive => show, 40-min timer
  // =====================================================
  useEffect(() => {
    if (!offerActive || offerVisible) return;
    setOfferVisible(true);

    if (!countdownStartedRef.current) {
      countdownStartedRef.current = true;
      const cd = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(cd);
            setOfferVisible(false);

            // Post "offer ended" in chat
            const chatEl = document.querySelector(`.${styles.chatMessages}`);
            if (chatEl) {
              const div = document.createElement("div");
              div.classList.add(styles.message, styles.system);
              div.textContent = "⌛ The special offer has ended.";
              chatEl.appendChild(div);
            }
          }
          return Math.max(0, prev - 1);
        });
      }, 1000);
    }
  }, [offerActive, offerVisible]);

  useEffect(() => {
    // Update countdown text
    const countdownEl = document.getElementById("offerCountdownTimer");
    if (countdownEl) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      countdownEl.textContent = `Special Offer Ends In: ${minutes}:${String(
        seconds
      ).padStart(2, "0")}`;
    }
  }, [timeLeft]);

  // =====================================================
  // FULL SCREEN Toggle (Jony Ive style, bottom-right)
  // =====================================================
  const handleToggleFullScreen = () => {
    if (!videoWrapperRef.current) return;
    if (!document.fullscreenElement) {
      videoWrapperRef.current.requestFullscreen().catch((err) => {
        console.error("Error enabling fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen mode:", err);
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
      <audio ref={audioRef} style={{ display: "none" }} muted={!hasInteracted} />
      <audio ref={audioRefTwo} style={{ display: "none" }} muted={!hasInteracted} />

      {/* Exit-intent overlay */}
      {showExitOverlay &&
        createPortal(
          <ExitOverlay
            message={exitMessage}
            onClose={() => setShowExitOverlay(false)}
          />,
          document.body
        )}

      {/* Replay overlay */}
      {showReplayOverlay && (
        <ReplayOverlay
          onReplay={() => {
            setShowReplayOverlay(false);
            const vid = videoRef.current;
            if (vid) {
              vid.currentTime = 0;
              vid.play().catch(() => {});
            }
            // reset clock
            setShowClockWidget(false);
            setClockDragInComplete(false);
            setClockRemoved(false);
            // reset poll
            setPollVisible(false);
            setPollAnswered(false);
            setPollResultsShown(false);
            // reset offer
            setOfferActive(false);
            setOfferVisible(false);
            setSpotsRemaining(19);
            setTimeLeft(40 * 60);
            countdownStartedRef.current = false;
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
          {/* VIDEO SIDE */}
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

          {/* CHAT SIDE */}
          <div className={styles.chatColumn}>
            <WebinarChatBox
              pollVisible={pollVisible}
              pollAnswered={pollAnswered}
              pollResultsShown={pollResultsShown}
              onPollAnswer={handlePollAnswer}
              offerActive={offerActive}
              offerVisible={offerVisible}
              spotsRemaining={spotsRemaining}
              timeLeft={timeLeft}
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
// Clock Widget EXACT as old snippet
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
// Chat Box w/ poll, invests, random attendees, preloaded Qs, etc.
// ------------------------------------------------------------------
interface ChatBoxProps {
  pollVisible: boolean;
  pollAnswered: boolean;
  pollResultsShown: boolean;
  onPollAnswer: (choice: string) => void;
  offerActive: boolean;
  offerVisible: boolean;
  spotsRemaining: number;
  timeLeft: number;
}

const WebinarChatBox: React.FC<ChatBoxProps> = ({
  pollVisible,
  pollAnswered,
  pollResultsShown,
  onPollAnswer,
  offerActive,
  offerVisible,
  spotsRemaining,
  timeLeft,
}) => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // =========== Original Chat Snippet: random messages, invests, Qs
  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;

    if (!chatEl || !inputEl || !typingEl || !toggleEl) {
      console.warn("Some chat refs missing; chat may not fully work.");
      return;
    }

    // Scroll detection
    function isNearBottom() {
      const threshold = 50;
      return (
        chatEl.scrollHeight - chatEl.clientHeight - chatEl.scrollTop <= threshold
      );
    }
    function handleScroll() {
      setIsUserScrolling(!isNearBottom());
    }
    chatEl.addEventListener("scroll", handleScroll);

    function handleToggle() {
      const participantMsgs = chatEl.querySelectorAll('[data-participant="true"]');
      participantMsgs.forEach((m) => {
        (m as HTMLElement).style.display = toggleEl.checked ? "block" : "none";
      });
    }
    toggleEl.checked = false;
    toggleEl.addEventListener("change", handleToggle);

    // Connect WebSocket
    const ws = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = ws;
    ws.onopen = () => console.log("Connected to chat server");
    ws.onerror = (err) => console.error("WebSocket error:", err);
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

    // Original random messages
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

    // Cleanup
    return () => {
      chatEl.removeEventListener("scroll", handleScroll);
      toggleEl.removeEventListener("change", handleToggle);
      clearInterval(viewerInterval);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
    // eslint-disable-next-line
  }, []);

  // Reusable function to add message to chat
  function addMessage(
    text: string,
    msgType: "user" | "host" | "system",
    userName?: string,
    autoScroll = true
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
    } else if (msgType === "host") {
      div.classList.add(styles.host);
    } else if (msgType === "system") {
      div.classList.add(styles.system);
    }

    if (userName && userName.trim()) {
      div.textContent = `${userName}: ${text}`;
    } else {
      div.textContent = text;
    }

    chatEl.appendChild(div);

    // auto-scroll if user typed
    if (autoScroll || userName === "You") {
      chatEl.scrollTop = chatEl.scrollHeight;
    }
  }

  // Minimal “AI logic” for user messages
  async function handleUserMessage(msg: string) {
    if (!typingIndicatorRef.current) return;
    typingIndicatorRef.current.textContent = "Selina is typing...";
    try {
      await wait(Math.random() * 4000 + 1000);
      typingIndicatorRef.current.textContent = "";
      addMessage(
        "Thanks for the question! We'll cover that in the Q&A later on.",
        "host",
        "Selina (Host)"
      );
    } catch (err) {
      console.error(err);
      typingIndicatorRef.current.textContent = "";
    }
  }

  // On user pressing enter
  function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      const userMsg = e.currentTarget.value.trim();
      e.currentTarget.value = "";
      addMessage(userMsg, "user", "You");
      handleUserMessage(userMsg);
    }
  }

  // Format leftover time for the offer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;

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

      {/* Poll pinned at top */}
      {pollVisible && (
        <div className={styles.pollContainer}>
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
              {/* 95% vs 5% animation */}
              <div className={styles.pollResults}>
                <div className={styles.pollResultsBar}>
                  <div className={styles.pollResultsBarSegment1} style={{ width: "5%" }} />
                  <div className={styles.pollResultsBarSegment2} style={{ width: "95%" }} />
                </div>
                <div className={styles.pollResultsText}>
                  95% of participants said personalized marketing will perform better.
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Offer if active */}
      {offerActive && offerVisible && (
        <div className={styles.specialOffer} style={{ display: "block" }}>
          <div
            className={styles.countdown}
            id="offerCountdownTimer"
            style={{ marginBottom: "8px" }}
          >
            Special Offer Ends In: {formattedTime}
          </div>
          <div className={styles.spotsRemaining}>
            Remaining Spots: {spotsRemaining}
          </div>
          <button
            className={styles.investButton}
            onClick={() => window.open("https://yes.prognostic.ai", "_blank")}
          >
            Invest $999 Now - Limited Time Offer
          </button>
        </div>
      )}

      <div className={styles.chatMessages} ref={chatMessagesRef}></div>

      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Type your message here..."
          ref={messageInputRef}
          onKeyPress={onKeyPress}
        />
        <div className={styles.typingIndicator} ref={typingIndicatorRef}></div>
      </div>
    </div>
  );
};

export default WebinarView;

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./WebinarView.module.css";
import "./WebinarView.module.css";

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

  // ------------------ Poll States ------------------
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
          // Audio links
          if (audioRef.current && data.audio_link) {
            audioRef.current.src = data.audio_link;
          }
          if (audioRefTwo.current && data.audio_link_two) {
            audioRefTwo.current.src = data.audio_link_two;
          }
          // Exit message
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
      // Attempt to autoplay the video
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
      // First audio at 3s
      if (vid.currentTime >= 3) {
        safePlayAudio(audioRef.current);
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }

    function handleSecondAudio() {
      // Second audio at 5s
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
  // 7) Poll Logic: triggered by video time
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleTimeUpdate() {
      // Show poll at 20s of the video
      if (vid.currentTime >= 20 && !pollVisible && !pollAnswered) {
        setPollVisible(true);
      }
      // If not answered by 50s => show results
      if (vid.currentTime >= 50 && pollVisible && !pollResultsShown) {
        setPollResultsShown(true);
      }
      // Hide poll at 80s total
      if (vid.currentTime >= 80 && pollVisible) {
        setPollVisible(false);
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [pollVisible, pollAnswered, pollResultsShown]);

  const handlePollAnswer = () => {
    setPollAnswered(true);
    // short delay to “animate” showing results
    setTimeout(() => setPollResultsShown(true), 600);
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
      <audio ref={audioRef} muted={!hasInteracted} style={{ display: "none" }} />
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

            // Reset poll states
            setPollVisible(false);
            setPollAnswered(false);
            setPollResultsShown(false);
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
          {/* Video Column */}
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

              {/* Clock Widget */}
              {showClockWidget && (
                <ClockWidget
                  currentTime={currentTimeString}
                  currentDate={currentDateObj}
                  dragInComplete={clockDragInComplete}
                  setDragInComplete={setClockDragInComplete}
                  clockRemoved={clockRemoved}
                />
              )}

              {/* Sound Overlay */}
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

          {/* Chat Column (pass poll states/handlers) */}
          <div className={styles.chatColumn}>
            <WebinarChatBox
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
// Chat Box with Poll pinned at top
// ------------------------------------------------------------------
interface ChatBoxProps {
  pollVisible: boolean;
  pollResultsShown: boolean;
  onPollAnswer: () => void;
}
const WebinarChatBox: React.FC<ChatBoxProps> = ({
  pollVisible,
  pollResultsShown,
  onPollAnswer,
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
    const countdownEl = countdownRef.current;
    const investBtn = investButtonRef.current;

    if (!chatEl || !inputEl || !typingEl || !toggleEl || !specialOfferEl || !countdownEl || !investBtn) {
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

    // Toggle participants
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

    // Helper to add messages to chat
    function addMessage(
      text: string,
      msgType: "user" | "host" | "system",
      userName?: string,
      autoScroll = true
    ) {
      const div = document.createElement("div");
      div.classList.add(styles.message);
      if (msgType === "user") {
        div.classList.add(styles.user);
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
      // If from other participants
      if (msgType === "user" && userName && userName !== "You") {
        div.setAttribute("data-participant", "true");
        // hide if toggle is off
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

    // Connect WebSocket
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

    // Some random attendee logic from your snippet
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
      // ... etc ...
    ];
    const investmentMessages = [
      "just invested in PrognosticAI! 🚀",
      "secured their spot in PrognosticAI! ✨",
      "joined the PrognosticAI family! 🎉",
    ];
    // Preloaded Q's
    const preloadedQuestions = [
      { time: 180, text: "How does this integrate with existing systems?", user: "Michael" },
      { time: 300, text: "Can you explain more about the AI capabilities?", user: "Sarah" },
      // ... etc ...
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

    // Show invests
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
        countdownEl.textContent = `Special Offer Ends In: ${Math.floor(
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
    async function handleUserMessage(msg: string) {
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

    // On user pressing Enter
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

      {/* Poll Container pinned at top */}
      {pollVisible && (
        <div className={styles.pollContainer}>
          {!pollResultsShown ? (
            <>
              <div className={styles.pollQuestion}>Which works better?</div>
              <div className={styles.pollOptions}>
                <button
                  className={styles.pollOptionButton}
                  onClick={onPollAnswer}
                >
                  Generic
                </button>
                <button
                  className={styles.pollOptionButton}
                  onClick={onPollAnswer}
                >
                  Personalized
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.pollQuestion}>Which works better?</div>
              <div className={styles.pollResults}>
                {/* “Animate” bars to highlight the big difference */}
                <div className={styles.pollResultsBar}>
                  <div
                    className={styles.pollResultsBarSegment1}
                    style={{ width: "5%" }}
                  ></div>
                  <div
                    className={styles.pollResultsBarSegment2}
                    style={{ width: "95%" }}
                  ></div>
                </div>
                <div className={styles.pollResultsText}>
                  95% of participants said personalized marketing will perform better.
                </div>
              </div>
            </>
          )}
        </div>
      )}

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

export default WebinarView;

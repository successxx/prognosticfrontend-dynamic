import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./WebinarView.module.css"; 
// ***** REMOVED the second import "./WebinarView.module.css"; *****

// import { clearInterval } from "timers";

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
  // ------------------------------------------

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

          // ------------------------------------------
          // ADDED FOR HEADLINE: store the personalized headline
          // NOTE: Remove the immediate `setShowHeadline(true)`
          // ------------------------------------------
          if (data.headline) {
            setHeadline(data.headline);
            // Removed the line: setShowHeadline(true);
          }
          // ------------------------------------------
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
        vid?.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }

    function handleSecondAudio() {
      const secondAudioTime = 5; // Change this value to adjust when second audio plays (in seconds)
      if (vid && vid.currentTime >= secondAudioTime) {
        safePlayAudio(audioRefTwo.current);
        vid?.removeEventListener("timeupdate", handleSecondAudio);
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
  // ADDED FOR HEADLINE: show at 5s, hide at 20s
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleHeadlineTiming() {
      // Appear at 5s:
      if (!showHeadline && vid.currentTime >= 5 && vid.currentTime < 20) {
        setShowHeadline(true);
      }
      // Disappear at 20s:
      else if (showHeadline && vid.currentTime >= 20) {
        setShowHeadline(false);
      }
    }

    vid.addEventListener("timeupdate", handleHeadlineTiming);
    return () => {
      vid.removeEventListener("timeupdate", handleHeadlineTiming);
    };
  }, [showHeadline]);
  // =====================================================

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
        clearInterval(+clockIntervalRef.current);
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
      <audio
        ref={audioRef}
        // muted={!hasInteracted} // enable this if you only want audio after user click
        style={{ display: "none" }}
      />
      <audio
        ref={audioRefTwo}
        muted={!hasInteracted}
        style={{ display: "none" }}
      />

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

        {/* 70/30 layout, but container is quite large */}
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

              {/*
                ------------------------------------------
                ADDED FOR HEADLINE: absolutely positioned text
                ------------------------------------------
              */}
              {showHeadline && (
                <div className={styles.headlineText}>{headline}</div>
              )}
              {/* ---------------------------------------- */}

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
            <WebinarChatBox />
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
      {/* CTA in new tab */}
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
// Clock Widget with same "human random wobble" from old snippet
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
    } else if (e.animationName.includes("dragOut")) {
      // No specific logic needed after the final fade out
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
// The Chat Box: identical to your old snippet so AI works again
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
      if (!chatEl) return false;
      return (
        chatEl.scrollHeight - chatEl.clientHeight - chatEl.scrollTop <=
        threshold
      );
    }
    function scrollToBottom() {
      if (!chatEl) return;
      chatEl.scrollTop = chatEl.scrollHeight;
    }
    function handleScroll() {
      setIsUserScrolling(!isNearBottom());
    }
    chatEl.addEventListener("scroll", handleScroll);

    // Toggle show/hide
    function handleToggle() {
      const participantMsgs = chatEl?.querySelectorAll(
        '[data-participant="true"]'
      );
      participantMsgs?.forEach((m) => {
        (m as HTMLElement).style.display = toggleEl?.checked ? "block" : "none";
      });
      if (toggleEl?.checked && !isUserScrolling) {
        scrollToBottom();
      }
    }
    toggleEl.checked = false; // default OFF
    toggleEl.addEventListener("change", handleToggle);

    // Add a message
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

      // If from other participants
      if (msgType === "user" && userName && userName !== "You") {
        div.setAttribute("data-participant", "true");
        // hide if toggle is off
        if (!toggleEl?.checked) {
          div.style.display = "none";
        }
      }

      chatEl?.appendChild(div);

      if (autoScroll || userName === "You") {
        if (!isUserScrolling) {
          scrollToBottom();
        }
      }
    }

    // Connect socket
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

    // Original snippet arrays
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
        investmentMessages[
          Math.floor(Math.random() * investmentMessages.length)
        ];
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

    // Invest button in new tab
    investBtn.addEventListener("click", () => {
      window.open("https://yes.prognostic.ai", "_blank");
    });

    // AI response logic
    async function handleUserMessage(msg: string, isAutoQuestion = false) {
      if (isAutoQuestion) return; // As in your snippet
      try {
        const randomDelay = Math.random() * 4000;
        await new Promise((res) => setTimeout(res, randomDelay));
        if (typingEl) typingEl.textContent = "Selina is typing...";

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
        if (typingEl) typingEl.textContent = "";
        if (data.response) {
          addMessage(data.response, "host", "Selina (Host)", true);
        }
      } catch (err) {
        console.error("Error:", err);
        if (typingEl) typingEl.textContent = "";
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
      if (e.key === "Enter" && inputEl?.value.trim()) {
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
              {/* default off */}
              <input
                type="checkbox"
                ref={participantToggleRef}
                defaultChecked={false}
              />
              <span className={styles.toggleSlider}></span>
            </label>
            <span className={styles.toggleLabel}>Show Others</span>
          </div>

          {/* spacing between label & watchers -> gap in CSS or margin-left */}
          <span className={styles.viewerCount} style={{ marginLeft: "10px" }}>
            <i>👥</i>
            <span id="viewerCount">41 watching</span>
          </span>
        </div>
      </div>

      <div
        className={styles.specialOffer}
        ref={specialOfferRef}
        style={{ display: "none" }}
      >
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

/* 
   WebinarView.module.css
   Carefully updated to:
   - Double container size (width & height)
   - Chat + video share the same height
   - AI chat from snippet
   - "Show Others" default off
   - More spacing between "Show Others" & watchers
   - Clock widget with original "human wobble"
*/

/**************************************/
/* 1) Outer container, subtle background*/
/**************************************/
.container {
  display: flex;
  flex-direction: column;
  font-family: "Montserrat", sans-serif;
  box-sizing: border-box;
  padding: 20px;
  width: 80%;
  /* min-height: 100vh; */
  background: #eaeff3;
  gap: 20px;
  position: relative;
}

.connectingOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(1, 66, 172, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.connectingBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
.connectingSpinner {
  width: 60px;
  height: 60px;
  border: 6px solid #cce0ff;
  border-top-color: #0142ac;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.connectingText {
  font-size: 1.2rem;
  color: #fff;
  font-weight: 600;
}

/**************************************/
/* 2) Zoom Container (Double Size)    */
/**************************************/
.zoomContainer {
  background: #fff;
  border: 2px solid #dcdcdc;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  /* Double the typical width, so it's large */
  /* max-width: 1800px; */
  width: 100%;
  /* Also let height grow for a bigger layout */
  margin: 0 auto;
}

/* Top bar for Title & Live for X min */
.zoomTopBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.zoomTitle {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.zoomLiveDot {
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 50%;
  animation: pulseZoom 1.5s infinite;
  margin-right: 4px;
}
@keyframes pulseZoom {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
.zoomLiveMinutes {
  font-size: 0.55rem;
  color: #666;
  font-weight: 500;
  background: #f0f0f0;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-block;
}

/**************************************/
/* 3) The 70/30 layout, same height   */
/**************************************/

.videoPlayer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.twoColumnLayout {
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
  /* Force a bigger container so video & chat share height. */
  /* height: 800px; double from smaller ~400px. Adjust as needed. */
  height: 94%;
}
.videoColumn {
  flex: 0 0 70%;
  max-width: 70%;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}
.chatColumn {
  flex: 0 0 30%;
  max-width: 30%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* For the video, strictly keep 16:9 within the forced container height */
.videoWrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  background: #000;
  border-radius: 6px;
  flex: 1;
}

/**************************************/
/* 4) Sound overlay to unmute         */
/**************************************/
.soundOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  z-index: 4;
}
.soundIcon {
  font-size: 2rem;
  margin-bottom: 12px;
  opacity: 0.9;
}
.soundText {
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.9;
}

/**************************************/
/* 5) Exit-intent iPhone bubble       */
/**************************************/
.exitOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.25s ease;
  cursor: pointer;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.iphoneMessageBubble {
  position: relative;
  max-width: 80%;
  width: 320px;
  background: #0a84ff;
  color: #fff;
  border-radius: 18px;
  padding: 14px 20px;
  animation: bubblePop 0.35s ease-out;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: auto;
}
@keyframes bubblePop {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  55% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.exitCloseBtn {
  position: absolute;
  top: 6px;
  right: 12px;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  color: #fff;
  opacity: 0.9;
}
.iphoneSender {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}
.iphoneMessageText {
  font-size: 1rem;
  line-height: 1.4;
  white-space: pre-line;
}
.iphoneMessageBubble::before {
  content: "";
  position: absolute;
  left: -10px;
  bottom: 20px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: #0a84ff;
}

/* 
  UPDATED HEADLINE TEXT:
  - moved to right: 75px
  - reduced font-size to ~2/3 (24px instead of 35px)
*/
.headlineText {
  position: absolute;
  top: 50%;
  right: 75px;
  transform: translateY(-50%);
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 24px;
  color: #2E2E2E;
  text-align: center;
  max-width: 30%;
  z-index: 9999;
}

/**************************************/
/* 6) Replay Overlay                  */
/**************************************/
.replayOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  z-index: 9999;
}
.replayTitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
}
.replayButton,
.investButton {
  background: #fff;
  color: #0142ac;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin: 8px 0;
  border: none;
  font-size: 0.9rem;
}
.investButton {
  background: #0142ac;
  color: #fff;
}
.investButton:hover {
  background: #013289;
}
.replayButton:hover {
  background: #eee;
}

/**************************************/
/* 7) Clock Widget with "human wobble"*/
/**************************************/
.clockWidget {
  position: absolute;
  top: 40%;
  left: 45%;
  width: 320px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 3;
  /* display: none; */
  transform: translate(-120%, -120%);
}

/* Named keyframes so we can detect them in TS */
@keyframes dragIn {
  0% {
    transform: translate(-120%, -120%);
  }
  25% {
    transform: translate(-78%, -65%);
  }
  45% {
    transform: translate(-48%, -35%);
  }
  65% {
    transform: translate(-25%, -15%);
  }
  80% {
    transform: translate(-10%, -5%);
  }
  92% {
    transform: translate(-3%, -1%);
  }
  100% {
    transform: translate(0, 0);
  }
}
@keyframes dragOut {
  0% {
    transform: translate(0, 0);
  }
  45% {
    transform: translate(90%, -5%);
  }
  70% {
    transform: translate(140%, -3%);
  }
  100% {
    transform: translate(200%, 10%);
  }
}
@keyframes wobble {
  0%,
  100% {
    transform: translate(0, 0);
  }
  /* 50% {
    transform: translate(3px, -3px);
  } */
}

.animateIn {
  animation: dragIn 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-name: dragIn;
}
.animateOut {
  animation: dragOut 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-name: dragOut;
}
.wobble {
  animation: wobble 2s infinite ease-in-out;
}

/* For TS detection of name */
.dragInKeyframeName:empty {
}
.dragOutKeyframeName:empty {
}

.widgetHeader {
  background: #f5f5f7;
  height: 28px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.windowControls {
  display: flex;
  gap: 6px;
  position: absolute;
  left: 10px;
}
.windowButton {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.closeButton {
  background: #ff5f57;
}
.minimizeButton {
  background: #febc2e;
}
.maximizeButton {
  background: #28c840;
}
.widgetTitle {
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: #3f3f3f;
  font-weight: 500;
}
.widgetContent {
  padding: 20px;
  background: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.clockTime {
  font-size: 2.4rem;
  font-weight: 500;
  color: #1d1d1f;
  margin-bottom: 4px;
  text-align: center;
}
.clockDate {
  font-size: 0.9rem;
  color: #86868b;
  font-weight: 400;
  text-align: center;
}

/**************************************/
/* 8) Chat Section: EXACT snippet     */
/**************************************/
.chatSection {
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;
  /* ensure it fills parent height */
}

.chatHeader {
  padding: 12px 15px;
  background: #0142ac;
  color: #fff;
  flex: 0 0 auto;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.headerTop {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px; /* ensure spacing between "Show Others" & watchers */
}
.chatTitle {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.toggleContainer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.toggleSwitch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}
.toggleSlider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.4s;
  border-radius: 20px;
  cursor: pointer;
}
.toggleSlider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: #fff;
  border-radius: 50%;
  transition: 0.4s;
}
.toggleSwitch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggleSwitch input:checked + .toggleSlider {
  background-color: #4caf50;
}
.toggleSwitch input:checked + .toggleSlider:before {
  transform: translateX(20px);
}
.toggleLabel {
  color: #fff;
  font-size: 0.45rem;
}
.viewerCount {
  font-size: 0.55rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.specialOffer {
  background: #ff4444;
  color: #fff;
  padding: 12px 15px;
  text-align: center;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: -0.02em;
  display: none;
  flex: 0 0 auto;
}
.investButton {
  background: #0142ac;
  color: #fff;
  border: none;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  letter-spacing: -0.02em;
  width: 100%;
  margin-top: 10px;
  border-radius: 6px;
}
.investButton:hover {
  background: #013289;
}

.chatMessages {
  flex: 1 1 auto;
  height: 200px;
  overflow-y: auto;
  padding: 15px;
  background: #f8f9fa;
}
.message {
  margin-bottom: 10px;
  line-height: 1.4;
  animation: fadeIn 0.3s ease;
  font-size: 0.85rem;
  padding: 8px 12px;
  border-radius: 6px;
  max-width: 90%;
  text-align: left;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.user {
  background: #f0f2f5;
  margin-left: auto;
  color: #2c3135;
}
.host {
  background: #e7f0ff;
  color: #0142ac;
  font-weight: 500;
}
.system {
  background: #fff3cd;
  color: #856404;
  text-align: center;
  max-width: 100%;
  margin: 15px 0;
  font-size: 0.85rem;
}
.chatInput {
  padding: 15px;
  background: #fff;
  border-top: 1px solid #eee;
  flex: 0 0 auto;
}
.chatInput input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dfe3e8;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  color: #2c3135;
}
.chatInput input:focus {
  outline: none;
  border-color: #0142ac;
  box-shadow: 0 0 0 2px rgba(1, 66, 172, 0.1);
}
.typingIndicator {
  color: #6c757d;
  font-size: 0.85rem;
  margin-top: 8px;
  font-style: italic;
  height: 20px;
  padding-left: 2px;
}

/**************************************/
/* 9) Notification for invests        */
/**************************************/
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
  z-index: 100;
  font-size: 0.9rem;
  max-width: 300px;
}
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
.notificationIcon {
  background: #0142ac;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}

/**************************************/
/* 10) Footer                         */
/**************************************/
.footer {
  text-align: center;
  font-size: 0.75rem;
  color: #999;
  margin-top: 25px;
  font-family: "Montserrat", sans-serif;
}

/**************************************/
/* 11) Custom Scrollbar for chat      */
/**************************************/
.chatMessages::-webkit-scrollbar {
  width: 8px;
}
.chatMessages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.chatMessages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
.chatMessages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/**************************************/
/* 12) Responsive Adjustments         */
/**************************************/
@media (max-width: 1200px) {
  .zoomContainer {
    max-width: 90vw;
  }
  .twoColumnLayout {
    height: auto; /* let them stack if too narrow */
    flex-direction: column;
  }
  .videoColumn,
  .chatColumn {
    flex: none;
    width: 100%;
    max-width: 100%;
    height: auto;
  }
  .videoWrapper {
    width: 100%;
    flex: none;
    aspect-ratio: 16/9;
  }
}

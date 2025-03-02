// ==========================
// WEBINARVIEW.TSX (REACT/JSX)
// ==========================
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  MutableRefObject,
} from "react";
import ReactDOM from "react-dom";
import { IWebinarInjection } from "./WebinarView"; // same interface you already have
import styles from "./WebinarView.module.css"; // your module CSS
import { VideoOverlay } from "./VideoOverlay";

// The main “demo video” component
const WebinarView: React.FC = () => {
  // -------------------------------------------
  // 1) States & Refs from your “demo” code
  // -------------------------------------------
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // Has user interacted to enable sound?
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Audio injection at 0.5s
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exit-intent
  const [showExitOverlay, setShowExitOverlay] = useState<boolean>(false);
  const [hasShownOverlay, setHasShownOverlay] = useState<boolean>(false);
  const [exitMessage, setExitMessage] = useState<string>("");

  // Track last valid playback time to prevent scrubbing
  const lastTimeRef = useRef<number>(0);

  // -------------------------------------------
  // 2) NEW states for “headline” from webinar
  // -------------------------------------------
  const [headline, setHeadline] = useState<string>("");
  const [showHeadline, setShowHeadline] = useState<boolean>(false);

  // -------------------------------------------
  // 3) NEW states for “drag-in clock” from webinar
  // -------------------------------------------
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  const [currentTimeString, setCurrentTimeString] = useState("");
  const [currentDateObj, setCurrentDateObj] = useState<Date | null>(null);
  const clockIntervalRef = useRef<NodeJS.Timer | null>(null);

  // -------------------------------------------
  // 4) Fetch data (audio link, exit msg, headline)
  // -------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("user_email");

    if (userEmail) {
      (async () => {
        try {
          const resp = await fetch(
            "https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_user_two",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ user_email: userEmail }),
            }
          );
          if (!resp.ok) throw new Error("Error fetching user data");
          const data = await resp.json();
          setWebinarInjectionData(data);

          // store exit message
          if (data.exit_message) setExitMessage(data.exit_message);

          // If we have an audio link, set it in audioRef
          if (audioRef.current && data.audio_link) {
            audioRef.current.src = data.audio_link;
          }

          // HEADLINE from server
          if (data.headline) {
            setHeadline(data.headline);
          }
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      })();
    }
  }, []);

  // -------------------------------------------
  // 5) Voice injection at 0.5s
  // -------------------------------------------
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;

    function handleTimeUpdate() {
      lastTimeRef.current = vid.currentTime; // track last valid time
      // If we've passed 0.5s, play injection once
      if (vid.currentTime >= 0.5) {
        audioRef.current
          .play()
          .catch((err) => console.warn("Voice injection blocked:", err));
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // -------------------------------------------
  // 6) Prevent skipping by reverting attempt to scrub
  // -------------------------------------------
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleSeeking() {
      // If user tries to scrub, jump them back
      if (Math.abs(vid.currentTime - lastTimeRef.current) > 0.1) {
        vid.currentTime = lastTimeRef.current;
      }
    }
    vid.addEventListener("seeking", handleSeeking);
    return () => vid.removeEventListener("seeking", handleSeeking);
  }, []);

  // -------------------------------------------
  // 7) Exit-intent detection
  // -------------------------------------------
  useEffect(() => {
    if (hasShownOverlay) return;

    function handleMouseMove(e: MouseEvent) {
      const threshold = window.innerHeight * 0.1;
      if (e.clientY < threshold) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);
      }
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasShownOverlay]);

  // -------------------------------------------
  // 8) HEADLINE timing: show from 1s to 15s
  //    (Change to 45.04–55.04 in production)
  // -------------------------------------------
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function checkHeadline() {
      const t = vid.currentTime;
      // Show from 1s to 15s
      if (t >= 1 && t < 15) {
        setShowHeadline(true);
      } else {
        setShowHeadline(false);
      }
    }

    vid.addEventListener("timeupdate", checkHeadline);
    vid.addEventListener("seeking", checkHeadline);
    return () => {
      vid.removeEventListener("timeupdate", checkHeadline);
      vid.removeEventListener("seeking", checkHeadline);
    };
  }, []);

  // -------------------------------------------
  // 9) CLOCK WIDGET logic
  //    Appear at 4s => animate in => remain ~4s => animate out
  // -------------------------------------------
  // Step A: once currentTime >=4 => show clock => start ticking
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
      const t = vid.currentTime;
      // Once we cross 4s => show clock (if not already)
      if (t >= 4 && !showClockWidget) {
        setShowClockWidget(true);
        startClock();
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      stopClock();
    };
  }, [showClockWidget]);

  // Step B: after “drag in” completes => wait 4s => animate out
  useEffect(() => {
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true); // triggers animateOut
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // Step C: once removed => hide clock fully after 1s
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

  // -------------------------------------------
  // RENDER
  // -------------------------------------------
  return (
    <div className={styles.container} style={{ textAlign: "center" }}>
      {/* Hidden audio for voice injection */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Exit-intent overlay */}
      {showExitOverlay &&
        ReactDOM.createPortal(
          <ExitOverlay
            message={exitMessage}
            onClose={() => setShowExitOverlay(false)}
          />,
          document.body
        )}

      {/* The video container */}
      <div ref={videoWrapperRef} className={styles.videoWrapper}>
        {/* Overlays from your existing code */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />

        {/* The actual video (muted until user interacts) */}
        <video
          ref={videoRef}
          controls
          playsInline
          muted={!hasInteracted}
          className={styles.videoPlayer}
        >
          <source
            src="https://progwebinar.blob.core.windows.net/video/clientsaidemovid.mp4"
            type="video/mp4"
          />
          Your browser does not support HTML5 video.
        </video>

        {/* Single overlay => unmute + play with one click */}
        {!hasInteracted && (
          <div
            className={styles.soundOverlay}
            onClick={() => {
              setHasInteracted(true);
              if (videoRef.current) {
                videoRef.current.muted = false;
                // Start playing
                videoRef.current.play().catch((err) => {
                  console.warn("Play blocked by browser:", err);
                });
              }
            }}
          >
            <div className={styles.soundIcon}>🔊</div>
            <div className={styles.soundText}>Click to watch your AI agents</div>
          </div>
        )}

        {/* HEADLINE from ~1s to ~15s */}
        {showHeadline && headline.trim().length > 0 && (
          <div
            className="headlineText"
            style={{
              fontFamily: "'SF Pro Display', sans-serif",
              color: "#252525",
              lineHeight: "1.2",
              letterSpacing: "0.01em",
            }}
          >
            {headline}
          </div>
        )}

        {/* CLOCK WIDGET from ~4s => ~8s */}
        {showClockWidget && (
          <ClockWidget
            currentTime={currentTimeString}
            currentDate={currentDateObj}
            dragInComplete={clockDragInComplete}
            setDragInComplete={setClockDragInComplete}
            clockRemoved={clockRemoved}
          />
        )}
      </div>

      {/* CTA Button (unchanged) */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => window.open("https://webinar.clients.ai", "_blank")}
          style={{
            backgroundColor: "#252525",
            color: "#fff",
            border: "none",
            padding: "16px 32px",
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Join The Next AI Agent Training
        </button>
      </div>
    </div>
  );
};

/**
 * Subcomponent: iPhone-style exit-intent bubble
 */
const ExitOverlay: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => {
  const defaultMsg = "Wait! Are you sure you want to leave?";

  return (
    <div
      className={styles.exitOverlay}
      onClick={onClose}
      style={{ cursor: "pointer" }}
    >
      <div
        className={styles.iphoneMessageBubble}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.exitCloseBtn} onClick={onClose}>
          ×
        </button>
        <div className={styles.iphoneSender}>Selina</div>
        <div className={styles.iphoneMessageText}>
          {message && message.trim() ? message : defaultMsg}
        </div>
      </div>
    </div>
  );
};

/**
 * Subcomponent: Clock widget from webinar code
 */
interface ClockWidgetProps {
  currentTime: string;
  currentDate: Date | null;
  dragInComplete: boolean;
  setDragInComplete: React.Dispatch<React.SetStateAction<boolean>>;
  clockRemoved: boolean;
}

const ClockWidget: React.FC<ClockWidgetProps> = ({
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

  // Determine final classes exactly as the webinar
  let widgetClass = "clockWidget"; // global class
  if (!clockRemoved) {
    widgetClass += dragInComplete ? " wobble" : " animateIn";
  } else {
    widgetClass += " animateOut";
  }

  return (
    <div className={widgetClass} ref={widgetRef} onAnimationEnd={handleAnimationEnd}>
      <div className="widgetHeader">
        <div className="windowControls">
          <div className="windowButton closeButton" />
          <div className="windowButton minimizeButton" />
          <div className="windowButton maximizeButton" />
        </div>
        <div className="widgetTitle">Clock Widget</div>
      </div>
      <div className="widgetContent">
        <div className="clockTime">{currentTime}</div>
        <div className="clockDate">{dateString}</div>
      </div>
    </div>
  );
};

export default WebinarView;

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./WebinarView.module.css";
import { VideoOverlay } from "./VideoOverlay";
import { VideoClock } from "./VideoClock";

// For reference—same interface as your existing code
export interface IWebinarInjection {
  Business_description: string;
  Industry: string;
  Offer_topic: string;
  Products_services: string;
  audio_link: string;
  audio_link_two: string;
  company_name: string;
  email_1: string;
  email_2: string;
  user_name: string;
  lead_email: string;
  exit_message: string;
  headline: string;
  offer_description: string;
  offer_goal: string;
  offer_name: string;
  offer_price: string;
  offer_url: string;
  pain_points: string;
  primary_benefits: string;
  primary_goal: string;
  salesletter: string;
  target_audience: string;
  target_url: string;
  website_url: string;
  testimonials: string;
}

/**
 * Demo WebinarView:
 * - We keep your original code: no skip, exit intent, 0.5s audio injection, etc.
 * - ADDED clock drag-in from 4s → 8s (EXACT same logic as webinar, times adjusted).
 * - ADDED headline from 45.04s → 55.04s, styled with SF Pro Display and #252525.
 */
const WebinarView: React.FC = () => {
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // Has the user clicked to enable sound?
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Audio for the 0.5s injection
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exit-intent bubble
  const [showExitOverlay, setShowExitOverlay] = useState<boolean>(false);
  const [hasShownOverlay, setHasShownOverlay] = useState<boolean>(false);
  const [exitMessage, setExitMessage] = useState<string>("");

  // Track last valid playback time (to prevent scrubbing)
  const lastTimeRef = useRef<number>(0);

  // ================================
  // 1) HEADLINE injection (45.04–55.04)
  // ================================
  const [headline, setHeadline] = useState("");
  const [showHeadline, setShowHeadline] = useState(false);

  // ================================
  // 2) CLOCK DRAG-IN (4s → 8s)
  // ================================
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  const [currentTimeString, setCurrentTimeString] = useState("");
  const [currentDateObj, setCurrentDateObj] = useState<Date | null>(null);
  const clockIntervalRef = useRef<NodeJS.Timer | null>(null);

  // ==========================================
  // Fetch data (audio, exit_message, headline)
  // ==========================================
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

          // Store exit message
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
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

  // ==========================================
  // Voice injection at 0.5s
  // + "lastTimeRef" approach to block scrubbing
  // ==========================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;

    function handleTimeUpdate() {
      // Save current time so we can revert if user tries to scrub
      lastTimeRef.current = vid.currentTime;

      // If we've passed 0.5s, play the injection
      if (vid.currentTime >= 0.5) {
        audioRef.current
          .play()
          .catch((err) => console.warn("Voice injection blocked:", err));
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }

      // HEADLINE: show from 45.04 to 55.04
      if (vid.currentTime >= 45.04 && vid.currentTime < 55.04) {
        setShowHeadline(true);
      } else {
        setShowHeadline(false);
      }

      // CLOCK: start at 4s, if not removed
      if (!showClockWidget && !clockRemoved && vid.currentTime >= 4) {
        setShowClockWidget(true);
        startClock();
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
    // eslint-disable-next-line
  }, [showClockWidget, clockRemoved]);

  // Prevent user from seeking ahead
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleSeeking() {
      // If user tries to skip beyond lastTimeRef, revert
      if (Math.abs(vid.currentTime - lastTimeRef.current) > 0.1) {
        vid.currentTime = lastTimeRef.current;
      }
    }
    vid.addEventListener("seeking", handleSeeking);
    return () => vid.removeEventListener("seeking", handleSeeking);
  }, []);

  // ==========================================
  // 3) Clock logic matches Webinar style
  //    - After dragIn completes, wait ~4s => dragOut
  // ==========================================
  // Once dragIn completes => remove after 4s (so total from 4s→8s in video)
  useEffect(() => {
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 4000); // shorter than the webinar's 10s, so it ends at ~8s
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // Once clockRemoved => stop the interval & fully hide after the animateOut
  useEffect(() => {
    if (clockRemoved) {
      stopClock();
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000); // after animateOut finishes
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  // Start/stop the internal clock for the widget
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

  // ==========================================
  // 4) Exit intent detection
  // ==========================================
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
        {/* Overlay from your existing code */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />
        {/* Existing top-right clock (unchanged) */}
        <VideoClock videoContainerRef={videoWrapperRef} />

        {/* Actual video element—no autoplay, user can press play */}
        <video
          ref={videoRef}
          controls
          playsInline
          muted={!hasInteracted}
          className={styles.videoPlayer}
        >
          <source
            src="https://progwebinar.blob.core.windows.net/video/clientsdemo2.mp4"
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
                // Start playing immediately
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

        {/* HEADLINE at 45.04s → 55.04s */}
        {showHeadline && (
          <div
            className={styles.headlineText}
            style={{
              fontFamily: '"SF Pro Display", sans-serif',
              color: "#252525",
              lineHeight: "1.1",
              letterSpacing: "0.02em",
            }}
          >
            {headline}
          </div>
        )}

        {/* DRAG-IN CLOCK, EXACT from webinar, times adjusted */}
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
      <div style={{ marginTop: "20px" }}>
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
 * Exit-intent bubble
 */
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
          {message && message.trim() ? message : defaultMsg}
        </div>
      </div>
    </div>
  );
};

/**
 * ClockWidget sub-component
 * (Matches the webinar's code/animations exactly, 
 *  but we remove it ~4s after dragIn, so it disappears around 8s.)
 */
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

  // Combine CSS classes:
  let widgetClass = styles.clockWidget;
  if (!clockRemoved) {
    // If we haven't fully removed, either animateIn or wobble
    widgetClass += dragInComplete
      ? ` ${styles.wobble}`
      : ` ${styles.animateIn}`;
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

export default WebinarView;

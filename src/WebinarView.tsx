import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./WebinarView.module.css";
import { VideoOverlay } from "./VideoOverlay";
import { VideoClock } from "./VideoClock";

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
 * Demo "Webinar" video code that duplicates the main webinar logic
 * but with minimal changes. Key features:
 *  - Manual play (no autoplay).
 *  - Prevent skipping (scrub locked).
 *  - "Click to enable sound" overlay.
 *  - Exit-intent bubble.
 *  - Voice injection at 0.5s if an audio link is provided.
 *  - HEADLINE  (appears ~5–20s).
 *  - CLOCK DRAG-IN (at 10s) + wobble + drag out after ~10s.
 */
const WebinarView: React.FC = () => {
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // Has the user interacted to enable sound?
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Audio reference for the injection at ~0.5s
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exit-intent
  const [showExitOverlay, setShowExitOverlay] = useState<boolean>(false);
  const [hasShownOverlay, setHasShownOverlay] = useState<boolean>(false);
  const [exitMessage, setExitMessage] = useState<string>("");

  // Track last valid playback time to prevent scrubbing:
  const lastTimeRef = useRef<number>(0);

  // ============ ADDED FOR HEADLINE & CLOCK =================
  // 1) Headline states
  const [showHeadline, setShowHeadline] = useState(false);
  const [hasShownHeadline, setHasShownHeadline] = useState(false);

  // 2) Clock states
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);

  // =========================================================

  // Fetch data (including `audio_link` and `exit_message`)
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
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      })();
    }
  }, []);

  // Voice injection at 0.5s
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
          .catch((err) =>
            console.warn("Voice injection blocked by browser:", err)
          );
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Prevent skipping by reverting any attempt to move the scrubber
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
    return () => {
      vid.removeEventListener("seeking", handleSeeking);
    };
  }, []);

  // Exit-intent detection
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

  // ============ ADDED FOR HEADLINE & CLOCK =================
  /**
   * We attach a single timeupdate event to the <video> that decides:
   *  - Headline visible from 5–20s
   *  - Clock drags in at 10s, wobbles ~10s, then drags out
   */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleVideoTiming() {
      const t = vid.currentTime;

      // HEADLINE from 5s to 20s
      if (t >= 5 && t < 20) {
        if (!hasShownHeadline) {
          setHasShownHeadline(true);
          setShowHeadline(true);
        }
      } else {
        if (showHeadline) {
          setShowHeadline(false);
        }
      }

      // CLOCK in at 10s
      if (!showClockWidget && !clockRemoved && t >= 10) {
        setShowClockWidget(true);
      }
    }

    vid.addEventListener("timeupdate", handleVideoTiming);
    return () => {
      vid.removeEventListener("timeupdate", handleVideoTiming);
    };
  }, [
    showClockWidget,
    clockRemoved,
    hasShownHeadline,
    showHeadline,
  ]);

  // Once clock has "dragIn" done, wait 10s → dragOut
  useEffect(() => {
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // Once we mark clockRemoved, hide fully after 1s
  useEffect(() => {
    if (clockRemoved) {
      // Just wait for the animateOut to finish
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000);
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);
  // =========================================================

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

        {/* The Clock Overlay (child component) */}
        <VideoClock videoContainerRef={videoWrapperRef} />

        {/* ADDED: HEADLINE if showHeadline is true */}
        {showHeadline && (
          <div className={styles.headlineText}>
            {/* If your data has a specific `headline`, use it; else fallback. */}
            {webinarInjectionData?.headline || "Your AI Headline Here"}
          </div>
        )}

        {/* The <video> itself */}
        <video
          ref={videoRef}
          // Autoplay is removed; user must press play
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

        {/* ADDED: The Clock Widget directly in this file (or we can do a separate component).
            But from your snippet, we reference the same classes. */}
        {showClockWidget && (
          <div
            className={`
              ${styles.clockWidget}
              ${clockRemoved ? styles.animateOut : styles.animateIn}
              ${clockDragInComplete && !clockRemoved ? styles.wobble : ""}
            `}
            onAnimationEnd={(e) => {
              if (e.animationName.includes("dragIn") && !clockDragInComplete) {
                setClockDragInComplete(true);
              }
            }}
          >
            <div className={styles.widgetHeader}>
              <div className={styles.windowControls}>
                <div className={`${styles.windowButton} ${styles.closeButton}`} />
                <div
                  className={`${styles.windowButton} ${styles.minimizeButton}`}
                />
                <div className={`${styles.windowButton} ${styles.maximizeButton}`} />
              </div>
              <div className={styles.widgetTitle}>Clock Widget</div>
            </div>
            <div className={styles.widgetContent}>
              <span className={styles.clockTime}>
                {/* Could show an actual clock time. For now just text. */}
                {(new Date()).toLocaleTimeString()}
              </span>
              <span className={styles.clockDate}>
                {(new Date()).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Single-click overlay => unmute + play */}
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
      </div>

      {/* CTA Button or anything else below */}
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

export default WebinarView;

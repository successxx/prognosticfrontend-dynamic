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
 * This component is the demo version of the webinar.
 * It retains all functionality from the webinar version:
 *  - Manual play with a “Click to Enable Sound” overlay.
 *  - Prevent scrubbing.
 *  - Voice injection at 0.5s.
 *  - Exit-intent bubble.
 *  - HEADLINE feature (displayed from ~5s–20s).
 *  - CLOCK widget that drags in at ~10s, wobbles, then drags out.
 *
 * Adjustments for one-column layout:
 *  - No chat column is used.
 *  - The video container (.videoWrapper) is allowed to size itself using the 16:9 trick.
 */
const WebinarView: React.FC = () => {
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // Has the user interacted to enable sound?
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Audio for the injection at ~0.5s
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exit-intent
  const [showExitOverlay, setShowExitOverlay] = useState<boolean>(false);
  const [hasShownOverlay, setHasShownOverlay] = useState<boolean>(false);
  const [exitMessage, setExitMessage] = useState<string>("");

  // Prevent scrubbing: track last valid time.
  const lastTimeRef = useRef<number>(0);

  // --- ADDED FOR HEADLINE & CLOCK ---
  const [showHeadline, setShowHeadline] = useState(false);
  const [hasShownHeadline, setHasShownHeadline] = useState(false);

  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  // ------------------------------------

  // Fetch data (audio_link, exit_message, headline, etc.)
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
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_email: userEmail }),
            }
          );
          if (!resp.ok) throw new Error("Error fetching user data");
          const data = await resp.json();
          setWebinarInjectionData(data);

          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
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
      lastTimeRef.current = vid.currentTime;
      if (vid.currentTime >= 0.5) {
        audioRef.current
          .play()
          .catch((err) =>
            console.warn("Voice injection blocked:", err)
          );
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }
    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Prevent scrubbing by resetting to last valid time
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    function handleSeeking() {
      if (Math.abs(vid.currentTime - lastTimeRef.current) > 0.1) {
        vid.currentTime = lastTimeRef.current;
      }
    }
    vid.addEventListener("seeking", handleSeeking);
    return () => vid.removeEventListener("seeking", handleSeeking);
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

  // HEADLINE & CLOCK logic
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleVideoTiming() {
      const t = vid.currentTime;
      // HEADLINE: show from 5s to 20s
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
      // CLOCK: show at 10s if not already shown/removed
      if (!showClockWidget && !clockRemoved && t >= 10) {
        setShowClockWidget(true);
      }
    }
    vid.addEventListener("timeupdate", handleVideoTiming);
    return () => vid.removeEventListener("timeupdate", handleVideoTiming);
  }, [showClockWidget, clockRemoved, hasShownHeadline, showHeadline]);

  // After clock drag-in completes, wait 10s to trigger drag-out
  useEffect(() => {
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // Once clockRemoved, hide the widget after 1s
  useEffect(() => {
    if (clockRemoved) {
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000);
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  return (
    <div className={styles.container} style={{ textAlign: "center" }}>
      {/* Hidden injection audio */}
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

      {/* Video Container */}
      <div ref={videoWrapperRef} className={styles.videoWrapper}>
        {/* Overlays from original code */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />

        {/* Optional separate VideoClock component (if needed) */}
        <VideoClock videoContainerRef={videoWrapperRef} />

        {/* HEADLINE overlay */}
        {showHeadline && (
          <div className={styles.headlineText}>
            {webinarInjectionData?.headline || "Your AI Headline Here"}
          </div>
        )}

        {/* The video element */}
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

        {/* CLOCK WIDGET (embedded directly) */}
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
                <div className={`${styles.windowButton} ${styles.minimizeButton}`} />
                <div className={`${styles.windowButton} ${styles.maximizeButton}`} />
              </div>
              <div className={styles.widgetTitle}>Clock Widget</div>
            </div>
            <div className={styles.widgetContent}>
              <span className={styles.clockTime}>
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

        {/* "Click to Enable Sound" Overlay */}
        {!hasInteracted && (
          <div
            className={styles.soundOverlay}
            onClick={() => {
              setHasInteracted(true);
              if (videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.play().catch(err => {
                  console.warn("Play blocked:", err);
                });
              }
            }}
          >
            <div className={styles.soundIcon}>🔊</div>
            <div className={styles.soundText}>Click to watch your AI agents</div>
          </div>
        )}
      </div>

      {/* CTA Button */}
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

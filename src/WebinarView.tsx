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
 * Single-column with strict 16x9 video.
 * Minimal changes from your existing webinar code,
 * preserving:
 * - Exit-intent bubble
 * - Voice injection
 * - Headline (5-20s)
 * - Clock widget (dragIn at 10s, out ~10s later)
 * - Prevent skipping
 * - Click to unmute
 */
const WebinarView: React.FC = () => {
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  // Video references
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sound interaction
  const [hasInteracted, setHasInteracted] = useState(false);

  // Exit-intent
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);
  const [exitMessage, setExitMessage] = useState("");

  // Prevent skipping
  const lastTimeRef = useRef(0);

  // Headline
  const [showHeadline, setShowHeadline] = useState(false);
  const [hasShownHeadline, setHasShownHeadline] = useState(false);

  // Clock widget
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);

  // Load injection data
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

          if (data.exit_message) setExitMessage(data.exit_message);
          if (data.audio_link && audioRef.current) {
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

    function handleTime() {
      lastTimeRef.current = vid.currentTime;
      if (vid.currentTime >= 0.5) {
        audioRef.current.play().catch((err) =>
          console.warn("Voice injection blocked:", err)
        );
        vid.removeEventListener("timeupdate", handleTime);
      }
    }
    vid.addEventListener("timeupdate", handleTime);
    return () => vid.removeEventListener("timeupdate", handleTime);
  }, []);

  // Prevent skipping
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

  // Exit-intent
  useEffect(() => {
    if (hasShownOverlay) return;

    function handleMouseMove(e: MouseEvent) {
      if (e.clientY < window.innerHeight * 0.1) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);
      }
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasShownOverlay]);

  // HEADLINE & CLOCK
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
        if (showHeadline) setShowHeadline(false);
      }

      // CLOCK at 10s
      if (!showClockWidget && !clockRemoved && t >= 10) {
        setShowClockWidget(true);
      }
    }
    vid.addEventListener("timeupdate", handleVideoTiming);
    return () => vid.removeEventListener("timeupdate", handleVideoTiming);
  }, [showHeadline, hasShownHeadline, showClockWidget, clockRemoved]);

  // Clock drag out after ~10s of wobble
  useEffect(() => {
    if (clockDragInComplete) {
      const timer = setTimeout(() => setClockRemoved(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // Hide clock fully after animateOut
  useEffect(() => {
    if (clockRemoved) {
      const hideTimer = setTimeout(() => setShowClockWidget(false), 1000);
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  return (
    <div className={styles.container} style={{ textAlign: "center" }}>
      {/* Hidden audio for voice injection */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Exit-intent bubble */}
      {showExitOverlay &&
        ReactDOM.createPortal(
          <ExitOverlay
            message={exitMessage}
            onClose={() => setShowExitOverlay(false)}
          />,
          document.body
        )}

      {/* Single column - 16x9 wrapper */}
      <div className={styles.videoWrapper}>
        {/* Overlays */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={null} /* or your ref if needed */
          webinarInjectionData={webinarInjectionData}
        />
        <VideoClock videoContainerRef={null} />

        {/* HEADLINE */}
        {showHeadline && (
          <div className={styles.headlineText}>
            {webinarInjectionData?.headline || "Your AI Headline Here"}
          </div>
        )}

        {/* The video */}
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

        {/* Clock widget */}
        {showClockWidget && (
          <div
            className={`
              ${styles.clockWidget}
              ${clockRemoved ? styles.animateOut : styles.animateIn}
              ${clockDragInComplete && !clockRemoved ? styles.wobble : ""}
            `}
            onAnimationEnd={(e) => {
              if (
                e.animationName.includes("dragIn") &&
                !clockDragInComplete
              ) {
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
                <div
                  className={`${styles.windowButton} ${styles.maximizeButton}`}
                />
              </div>
              <div className={styles.widgetTitle}>Clock Widget</div>
            </div>
            <div className={styles.widgetContent}>
              <span className={styles.clockTime}>
                {new Date().toLocaleTimeString()}
              </span>
              <span className={styles.clockDate}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Sound overlay */}
        {!hasInteracted && (
          <div
            className={styles.soundOverlay}
            onClick={() => {
              setHasInteracted(true);
              if (videoRef.current) {
                videoRef.current.muted = false;
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

      {/* CTA button */}
      <div style={{ marginTop: 20 }}>
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

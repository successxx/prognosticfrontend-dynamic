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
 * WebinarView.tsx – Single–Column Demo
 *
 * This file is a near–duplicate of the webinar version but adjusted so that:
 *  • The video container always stays at a strict 16×9 ratio.
 *  • The layout is a single column (no chat column).
 *  • The clock widget appears as though it were a Mac clock dragged into view and then removed,
 *    but it remains within the video’s bounds.
 *  • All other functionalities (exit–intent, voice injection, click–to–unmute, headline) remain intact.
 */
const WebinarView: React.FC = () => {
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // Has the user interacted to enable sound?
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Audio reference for voice injection at ~0.5s
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exit–intent bubble state
  const [showExitOverlay, setShowExitOverlay] = useState<boolean>(false);
  const [hasShownOverlay, setHasShownOverlay] = useState<boolean>(false);
  const [exitMessage, setExitMessage] = useState<string>("");

  // Track last valid playback time to prevent scrubbing
  const lastTimeRef = useRef<number>(0);

  // ============ ADDED FOR HEADLINE & CLOCK =============
  // Headline: show between 5s and 20s
  const [showHeadline, setShowHeadline] = useState(false);
  const [hasShownHeadline, setHasShownHeadline] = useState(false);

  // Clock widget: dragged in at 10s, wobbles for ~10s, then dragged out
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  // ======================================================

  // Fetch injection data (exit message, headline, audio link, etc.)
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
            console.warn("Voice injection blocked by browser:", err)
          );
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }
    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Prevent skipping by reverting any seek attempts
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

  // Exit–intent detection
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

  // HEADLINE & CLOCK logic (via a single timeupdate listener)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    function handleVideoTiming() {
      const t = vid.currentTime;
      // HEADLINE: show from 5 to 20 seconds
      if (t >= 69.17 && t < 90.07) {
        if (!hasShownHeadline) {
          setHasShownHeadline(true);
          setShowHeadline(true);
        }
      } else {
        if (showHeadline) setShowHeadline(false);
      }
      // CLOCK: show at 10 seconds if not already shown
      if (!showClockWidget && !clockRemoved && t >= 1) {
        setShowClockWidget(true);
      }
    }
    vid.addEventListener("timeupdate", handleVideoTiming);
    return () => vid.removeEventListener("timeupdate", handleVideoTiming);
  }, [showClockWidget, clockRemoved, hasShownHeadline, showHeadline]);

  // After the clock dragIn completes, wait 10s then initiate dragOut
  useEffect(() => {
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // Once clock is marked as removed, hide it completely after animateOut completes (~1s)
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
      {/* Hidden audio for voice injection */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Exit–intent overlay */}
      {showExitOverlay &&
        ReactDOM.createPortal(
          <ExitOverlay
            message={exitMessage}
            onClose={() => setShowExitOverlay(false)}
          />,
          document.body
        )}

      {/* Video container – note: single column layout */}
      <div ref={videoWrapperRef} className={styles.videoWrapper}>
        {/* Overlays from original code */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />
        {/* VideoClock component (if you use it separately) */}
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
  controlsList="nodownload"
  disablePictureInPicture
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


        {/* CLOCK widget – this one animates into view over the video,
            then animates out. It remains within the video container so it appears as if you dragged it in */}
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

        {/* Sound overlay – appears if the user hasn’t clicked yet */}
        {!hasInteracted && (
          <div
            className={styles.soundOverlay}
            onClick={() => {
              setHasInteracted(true);
              if (videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.play().catch((err) =>
                  console.warn("Play blocked by browser:", err)
                );
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
          onClick={() => window.open("https://invest.clients.ai", "_blank")}
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
          Start Your Free 18-Day Trial Now
        </button>
      </div>
    </div>
  );
};

/**
 * Exit–intent bubble component.
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

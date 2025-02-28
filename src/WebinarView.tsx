/*****************************************************/
/******************* WebinarView.tsx *****************/
/*****************************************************/
import React, { useEffect, useRef, useState, useCallback } from "react";
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
 * Demo video player with:
 *  1) Voice injection at 0.5s
 *  2) Exit-intent bubble
 *  3) Prevent skipping by reverting scrub attempts
 *  4) Manual play (autoplay off) + click overlay to unmute
 *  5) ADDED clock widget from webinar code at 4s → out at 8s
 *  6) ADDED headline injection from webinar code at 45.04s → 55.04s
 */
const WebinarView: React.FC = () => {
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // Audio for the 0.5s injection
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Has the user interacted to enable sound?
  const [hasInteracted, setHasInteracted] = useState(false);

  // Exit-intent
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);
  const [exitMessage, setExitMessage] = useState("");

  // Track last valid playback time to prevent scrubbing
  const lastTimeRef = useRef<number>(0);

  // ----------------------
  // NEW: Clock states
  // ----------------------
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);

  // ----------------------
  // NEW: Headline states
  // ----------------------
  const [headline, setHeadline] = useState("");
  const [showHeadline, setShowHeadline] = useState(false);

  // =========== Fetch Data from server =============
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
          // Headline injection
          if (data.headline) {
            setHeadline(data.headline);
          }
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      })();
    }
  }, []);

  // =========== Voice Injection at 0.5s ============
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

  // =========== Prevent skipping by reverting scrub attempts ============
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleSeeking() {
      // If user tries to scrub, jump them back
      const diff = Math.abs(vid.currentTime - lastTimeRef.current);
      if (diff > 0.1) {
        vid.currentTime = lastTimeRef.current;
      }
    }

    vid.addEventListener("seeking", handleSeeking);
    return () => vid.removeEventListener("seeking", handleSeeking);
  }, []);

  // =========== Exit-Intent Detection ============
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

  // =========== Clock Drag In/Out at 4s → 8s ============
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function clockTimeCheck() {
      if (vid.currentTime >= 4 && !showClockWidget && !clockRemoved) {
        setShowClockWidget(true);
      }
    }

    vid.addEventListener("timeupdate", clockTimeCheck);
    return () => vid.removeEventListener("timeupdate", clockTimeCheck);
  }, [showClockWidget, clockRemoved]);

  // After dragIn completes, we wait until total of 4s on screen to animate out
  useEffect(() => {
    if (clockDragInComplete) {
      // We want the clock to vanish around 8s total, meaning it shows up at 4s
      // so it stays 4s on screen. If we just replicate the webinar logic exactly:
      const remaining = 4000; // 4 seconds
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // Once removed => fully hide after animation
  useEffect(() => {
    if (clockRemoved) {
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000); // let the dragOut animation finish
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  // =========== Headline at 45.04 → 55.04s ============
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!headline || !headline.trim()) return; // no headline => skip

    function handleHeadlineVisibility() {
      const t = vid.currentTime;
      // Show between 45.04s and 55.04s
      if (t >= 45.04 && t < 55.04) {
        setShowHeadline(true);
      } else {
        setShowHeadline(false);
      }
    }

    vid.addEventListener("timeupdate", handleHeadlineVisibility);
    return () => vid.removeEventListener("timeupdate", handleHeadlineVisibility);
  }, [headline]);

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

        {/* The clock widget */}
        {showClockWidget && (
          <VideoClock
            dragInComplete={clockDragInComplete}
            setDragInComplete={setClockDragInComplete}
            clockRemoved={clockRemoved}
          />
        )}

        {/* Headline text */}
        {showHeadline && (
          <div className={styles.headlineText} style={headlineStyle}>
            {headline}
          </div>
        )}

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
      </div>

      {/* CTA Button */}
      <div>
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
            marginTop: "20px",
          }}
        >
          Join The Next AI Agent Training
        </button>
      </div>
    </div>
  );
};

/** Minimal inline style for the headline, ensuring we meet your color/spacing specs */
const headlineStyle: React.CSSProperties = {
  fontFamily: '"SF Pro Display", sans-serif',
  color: "#252525",
  letterSpacing: "0.02em",
  lineHeight: 1.2,
  fontSize: "1.5rem",
  fontWeight: 400,
  textAlign: "center",
  maxWidth: "50%",
  margin: "0 auto",
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

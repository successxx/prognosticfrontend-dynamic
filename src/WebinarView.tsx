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

  // =========== NEW: “Live Demo Countdown” State ==========
  // The user wants a countdown that starts at 47 and, once it hits 0,
  // it changes to a "Your demo is currently live..." message with a red blinking dot.
  const [demoCountdown, setDemoCountdown] = useState<number>(47);

  // Fetch injection data (exit message, headline, audio link, etc.) once on mount
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

  // === POLLING LOGIC ADDED ===
  // Periodically re-fetch data in case the second half of overlays is updated in the DB
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("user_email");
    if (!userEmail) return;

    // Poll every 10 seconds (adjust as needed)
    const pollInterval = setInterval(async () => {
      try {
        // We can fetch again:
        const resp = await fetch(
          "https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_user_two",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_email: userEmail }),
          }
        );
        if (!resp.ok) throw new Error("Error fetching user data (polling)");
        const newData = await resp.json();

        // Compare old vs. new; if changed, update:
        if (
          !webinarInjectionData ||
          JSON.stringify(newData) !== JSON.stringify(webinarInjectionData)
        ) {
          setWebinarInjectionData(newData);

          // Optionally refresh exit message if it changed
          if (newData.exit_message) {
            setExitMessage(newData.exit_message);
          }

          // Optionally refresh audio if "audio_link" was updated
          if (audioRef.current && newData.audio_link) {
            audioRef.current.src = newData.audio_link;
          }
        }
      } catch (err) {
        console.error("Error during polling fetch:", err);
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [webinarInjectionData]);

  // Voice injection at 0.5s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;
    function handleTimeUpdate() {
      lastTimeRef.current = vid.currentTime;
      if (vid.currentTime >= 45.09) {
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
      // CLOCK: show at ~47 seconds if not already shown
      if (!showClockWidget && !clockRemoved && t >= 47) {
        setShowClockWidget(true);
      }
    }
    vid.addEventListener("timeupdate", handleVideoTiming);
    return () => vid.removeEventListener("timeupdate", handleVideoTiming);
  }, [showClockWidget, clockRemoved, hasShownHeadline, showHeadline]);

  // After the clock dragIn completes, wait 4s then initiate dragOut
  useEffect(() => {
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // Once clock is marked as removed, hide it completely after animateOut (~1s)
  useEffect(() => {
    if (clockRemoved) {
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000);
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  // ====== DEMO COUNTDOWN EFFECT ======
  // We want "Your live demo begins in XXs" to show from time=0 up to time=47,
  // then "Your demo is currently live..." (with blinking dot) after 47s.
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function updateDemoCountdown() {
      const current = vid.currentTime;
      // If currentTime < 47, display (47 - currentTime).
      // If >= 47, set countdown to 0 (so we can show "currently live").
      if (current < 47) {
        const diff = 47 - current;
        setDemoCountdown(Math.floor(diff >= 0 ? diff : 0));
      } else {
        setDemoCountdown(0);
      }
    }

    vid.addEventListener("timeupdate", updateDemoCountdown);
    return () => vid.removeEventListener("timeupdate", updateDemoCountdown);
  }, []);

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

      {/* 
        =============== THE NEW LIVE DEMO COUNTER ===============
        Displayed top-left above the video container. 
        - While demoCountdown > 0 => "Your live demo begins in Xs"
        - Once it hits 0 => "Your demo is currently live" w/ blinking red dot
      */}
      <div className={styles.liveDemoStatus}>
        {demoCountdown > 0 ? (
          <>Your live demo begins in {demoCountdown}s</>
        ) : (
          <>
            Your demo is currently live
            <span className={styles.liveDot}></span>
          </>
        )}
      </div>

      {/* Video container – note: single column layout */}
      <div ref={videoWrapperRef} className={styles.videoWrapper}>
        {/* Overlays from original code */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />
        {/* VideoClock component (if you use it) */}
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
            src="https://progwebinar.blob.core.windows.net/video/cdemo69.mp4"
            type="video/mp4"
          />
          Your browser does not support HTML5 video.
        </video>

        {/* CLOCK widget – animates into view over the video, then out */}
        {showClockWidget && (
          <div
            className={
              `${styles.clockWidget} ` +
              (clockRemoved ? styles.animateOut : styles.animateIn) +
              (clockDragInComplete && !clockRemoved ? ` ${styles.wobble}` : "")
            }
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
            <div className={styles.soundText}>Click to Deploy Your AI Agents</div>
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

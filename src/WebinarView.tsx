import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import styles from "./WebinarView.module.css";
import { VideoOverlay } from "./VideoOverlay";
import { IWebinarInjection } from "./WebinarView";
import { VideoClock } from "./VideoClock";

/**
 * Here is our local interface – repeated for reference.
 * If this is already declared in your code, you can remove this duplication,
 * but we'll keep it in case you need it.
 */
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

const WebinarView: React.FC = () => {
  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exit-intent
  const [showExitOverlay, setShowExitOverlay] = useState<boolean>(false);
  const [hasShownOverlay, setHasShownOverlay] = useState<boolean>(false);
  const [exitMessage, setExitMessage] = useState<string>("");

  // "Has user clicked to unmute?"
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // We store injection data from the server
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  // Track last valid playback time for skip prevention
  const lastTimeRef = useRef<number>(0);

  // Clock states
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);

  // Headline states
  const [showHeadline, setShowHeadline] = useState(false);
  const [hasShownHeadline, setHasShownHeadline] = useState(false);

  // Load user data
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

          // If we have an audio link, set it in audioRef
          if (audioRef.current && data.audio_link) {
            audioRef.current.src = data.audio_link;
          }
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      })();
    }
  }, []);

  // 1) Voice injection at 0.5s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;

    function handleTimeUpdate() {
      lastTimeRef.current = vid.currentTime; // track for skip prevention

      // If we've passed 0.5s, play the injection
      if (vid.currentTime >= 0.5) {
        audioRef.current
          .play()
          .catch((err) => console.warn("Voice injection blocked:", err));
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }
    vid.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // 2) Prevent skipping
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleSeeking() {
      // if user tries to scrub
      if (Math.abs(vid.currentTime - lastTimeRef.current) > 0.1) {
        vid.currentTime = lastTimeRef.current;
      }
    }
    vid.addEventListener("seeking", handleSeeking);
    return () => vid.removeEventListener("seeking", handleSeeking);
  }, []);

  // 3) Exit-intent detection
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

  // 4) Clock widget – show at 4s, remove at 8s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleClockCheck() {
      const t = vid.currentTime;
      // Appear at 4s
      if (!showClockWidget && !clockRemoved && t >= 4) {
        setShowClockWidget(true);
      }
      // Force removal at 8s
      if (t >= 8 && !clockRemoved) {
        setClockRemoved(true);
      }
      lastTimeRef.current = t;
    }
    vid.addEventListener("timeupdate", handleClockCheck);
    return () => {
      vid.removeEventListener("timeupdate", handleClockCheck);
    };
  }, [showClockWidget, clockRemoved]);

  // Once the clock is removed, we wait the dragOut animation (1s) and hide the entire widget
  useEffect(() => {
    if (clockRemoved) {
      // Hide after 1s
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000);
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  // 5) Headline – show 45.04s to 55.04s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleHeadline() {
      const t = vid.currentTime;

      // Appear at 45.04, vanish at 55.04
      if (t >= 45.04 && t < 55.04) {
        setShowHeadline(true);
        if (!hasShownHeadline) {
          setHasShownHeadline(true);
        }
      } else {
        setShowHeadline(false);
      }
    }

    vid.addEventListener("timeupdate", handleHeadline);
    return () => vid.removeEventListener("timeupdate", handleHeadline);
  }, [hasShownHeadline]);

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
        {/* Overlays for text injection (like email_1, salesletter, etc.) */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />
        {/* The separate "menu bar" clock if you have it: */}
        <VideoClock videoContainerRef={videoWrapperRef} />

        {/* The actual video */}
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

        {/* The "drag in" clock widget  */}
        {showClockWidget && (
          <div
            // we rely on global classes, not local style binding
            className={
              "clockWidget" +
              " " +
              (clockRemoved
                ? "animateOut"
                : clockDragInComplete
                ? "wobble"
                : "animateIn")
            }
            onAnimationEnd={(e) => {
              if (e.animationName.includes("dragIn")) {
                setClockDragInComplete(true);
              }
            }}
          >
            <div className="widgetHeader">
              <div className="windowControls">
                <div className="windowButton closeButton" />
                <div className="windowButton minimizeButton" />
                <div className="windowButton maximizeButton" />
              </div>
              <div className="widgetTitle">Clock Widget</div>
            </div>
            <ClockWidgetContent />
          </div>
        )}

        {/* The headline text */}
        {showHeadline && webinarInjectionData?.headline && (
          <div
            className={styles.headlineText}
            style={{
              fontFamily: "'SF Pro Display', sans-serif",
              letterSpacing: "0.02em",
              lineHeight: "1.1", // slightly less line-spacing than the webinar
              color: "#252525",
            }}
          >
            {webinarInjectionData.headline}
          </div>
        )}
      </div>

      {/* CTA Button below the video */}
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

      {/* Footer / copyright area */}
      <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
        © {new Date().getFullYear()} Clients.ai
      </p>
    </div>
  );
};

/**
 * Minimal clock widget content - placed inside the "drag in/out" container
 */
function ClockWidgetContent() {
  const [timeString, setTimeString] = useState("");
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // e.g. "02:34:05 PM"
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      // e.g. "Wednesday, August 9, 2025"
      setDateString(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };
    updateClock(); // immediate
    const intId = setInterval(updateClock, 1000);
    return () => clearInterval(intId);
  }, []);

  return (
    <div className="widgetContent">
      <div className="clockTime">{timeString}</div>
      <div className="clockDate">{dateString}</div>
    </div>
  );
}

/**
 * The exit-intent bubble
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

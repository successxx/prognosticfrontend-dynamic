import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./WebinarView.module.css";
import { VideoOverlay } from "./VideoOverlay";
import { VideoClock } from "./VideoClock";

/**
 * Keep or define your data interface
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
  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exit-intent
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);
  const [exitMessage, setExitMessage] = useState("");

  // Interactions
  const [hasInteracted, setHasInteracted] = useState(false);

  // Injection data
  const [webinarInjectionData, setWebinarInjectionData] = useState<IWebinarInjection>();

  // lastTimeRef for skip prevention - but we will allow scrubbing, so we’ll remove that logic
  const lastTimeRef = useRef<number>(0);

  // Clock
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);

  // Headline
  const [showHeadline, setShowHeadline] = useState(false);
  const [hasShownHeadline, setHasShownHeadline] = useState(false);

  // 1) Load user data
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

          // If audio link, set to audioRef
          if (audioRef.current && data.audio_link) {
            audioRef.current.src = data.audio_link;
          }
          // If exit message
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      })();
    }
  }, []);

  // 2) Voice injection at 0.5s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;

    function handleTimeUpdate() {
      // once crossing 0.5 => play injection
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

  // 3) Freed scrubbing => remove skip logic
  // (No code for skip prevention now)

  // 4) Exit-intent detection
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

  // 5) Clock widget => 4s to 8s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function checkClock() {
      const t = vid.currentTime;
      if (!showClockWidget && !clockRemoved && t >= 4) {
        setShowClockWidget(true);
      }
      if (!clockRemoved && t >= 8) {
        setClockRemoved(true);
      }
    }
    vid.addEventListener("timeupdate", checkClock);
    return () => vid.removeEventListener("timeupdate", checkClock);
  }, [showClockWidget, clockRemoved]);

  // Once clockRemoved => hide after animation
  useEffect(() => {
    if (clockRemoved) {
      const timer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000); // matches 1s of animateOut
      return () => clearTimeout(timer);
    }
  }, [clockRemoved]);

  // 6) Headline at 45.04–55.04
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleHeadline() {
      const t = vid.currentTime;
      if (t >= 45.04 && t < 55.04) {
        setShowHeadline(true);
        if (!hasShownHeadline) setHasShownHeadline(true);
      } else {
        setShowHeadline(false);
      }
    }
    vid.addEventListener("timeupdate", handleHeadline);
    return () => vid.removeEventListener("timeupdate", handleHeadline);
  }, [hasShownHeadline]);

  return (
    <div className={styles.container} style={{ textAlign: "center" }}>
      {/* Hidden audio injection */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Exit bubble */}
      {showExitOverlay &&
        ReactDOM.createPortal(
          <ExitOverlay
            message={exitMessage}
            onClose={() => setShowExitOverlay(false)}
          />,
          document.body
        )}

      {/* Video container */}
      <div ref={videoWrapperRef} className={styles.videoWrapper}>
        {/* Overlays from the server */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />

        {/* Mac-like clock at top if you want */}
        <VideoClock videoContainerRef={videoWrapperRef} />

        {/* The actual video => object-fit: contain via CSS */}
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

        {/* Unmute overlay */}
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
            <div className={styles.soundText}>
              Click to watch your AI agents
            </div>
          </div>
        )}

        {/* Clock: from left to right */}
        {showClockWidget && (
          <div
            className={
              "clockWidget " +
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

        {/* Headline text */}
        {showHeadline && webinarInjectionData?.headline && (
          <div
            className={styles.headlineText}
            style={{
              fontFamily: "'SF Pro Display', sans-serif",
              letterSpacing: "0.02em",
              lineHeight: "1.1",
              color: "#252525",
            }}
          >
            {webinarInjectionData.headline}
          </div>
        )}
      </div>

      {/* CTA button below */}
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

      {/* Footer */}
      <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
        © {new Date().getFullYear()} Clients.ai
      </p>
    </div>
  );
};

/**
 * Clock widget content, same as your original
 */
function ClockWidgetContent() {
  const [timeString, setTimeString] = useState("");
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDateString(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };
    updateClock();
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

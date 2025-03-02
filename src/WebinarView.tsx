import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./WebinarView.module.css";
import { VideoOverlay } from "./VideoOverlay";

/**
 * NOTE:
 * We keep the same shape for the server data, including `headline` which we use below.
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

/**
 * This is the main component for our demo video.
 * We’re merging in the clock-drag code from the webinar, EXACT times changed:
 * - Clock drags in at 4s, out at 8s
 * We also add a headline at 45.04s -> 55.04s, from `webinarInjectionData.headline`.
 */
const WebinarView: React.FC = () => {
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  // Video, audio, exit-intent
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showExitOverlay, setShowExitOverlay] = useState<boolean>(false);
  const [hasShownOverlay, setHasShownOverlay] = useState<boolean>(false);
  const [exitMessage, setExitMessage] = useState<string>("");

  // Prevent skipping
  const lastTimeRef = useRef<number>(0);

  // ======================
  // 1) Clock Drag-In states
  // ======================
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);

  // We'll also track real-time clock strings so it "ticks"
  const [currentTimeString, setCurrentTimeString] = useState("");
  const [currentDateObj, setCurrentDateObj] = useState<Date | null>(null);
  const clockIntervalRef = useRef<NodeJS.Timer | null>(null);

  // ======================
  // 2) Headline states
  // ======================
  const [headline, setHeadline] = useState("");
  const [showHeadline, setShowHeadline] = useState(false);
  const [hasShownHeadline, setHasShownHeadline] = useState(false);

  // -----------------------------
  // Fetch data (including `audio_link` + `exit_message` + `headline`)
  // -----------------------------
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
          // If there's a headline in the DB, store it
          if (data.headline) {
            setHeadline(data.headline);
          }
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      })();
    }
  }, []);

  // ------------------------------------------
  // Voice injection at 0.5s
  // ------------------------------------------
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

  // ------------------------------------------
  // Prevent skipping by reverting any attempt
  // ------------------------------------------
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

  // ------------------------------------------
  // Exit-intent detection
  // ------------------------------------------
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

  // ---------------------------------------------------------------------
  // A) The same CLOCK DRAG-IN logic from the webinar, but times changed:
  //    Appear ~4s, remove ~8s
  // ---------------------------------------------------------------------
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

      // 1) At 4s => show clock (drag in) if not already
      if (t >= 4 && !showClockWidget && !clockRemoved) {
        setShowClockWidget(true);
        startClock();
      }

      // 2) If we've reached 8s => that triggers the "animate out"
      if (t >= 8 && showClockWidget && !clockRemoved) {
        setClockRemoved(true);
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      stopClock();
    };
  }, [showClockWidget, clockRemoved]);

  // Once dragIn is complete => we wait until "clockRemoved" is triggered to do the animateOut
  // We'll mirror the webinar approach:
  useEffect(() => {
    if (clockDragInComplete && !clockRemoved) {
      // We just let it stay until video hits 8s, which triggers setClockRemoved(true).
      // So no setTimeout needed here. Exactly the same approach, just times changed.
    }
  }, [clockDragInComplete, clockRemoved]);

  // Once we set "clockRemoved" => fade it out via CSS animation, then hide fully
  useEffect(() => {
    if (clockRemoved) {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
        clockIntervalRef.current = null;
      }
      // After ~1s of "dragOut" animation, remove from DOM
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000);
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  // ---------------------------------------------------------------------
  // B) Headline logic: show from 45.04s -> 55.04s
  // ---------------------------------------------------------------------
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleHeadline() {
      const t = vid.currentTime;
      // Show from 45.04 to < 55.04
      if (t >= 1.04 && t < 15.04) {
        setShowHeadline(true);
        if (!hasShownHeadline) {
          setHasShownHeadline(true);
        }
      } else {
        setShowHeadline(false);
      }
    }

    vid.addEventListener("timeupdate", handleHeadline);
    return () => {
      vid.removeEventListener("timeupdate", handleHeadline);
    };
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
        {/* Overlays from your existing code */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />

        {/* The actual <video> – user must press play */}
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

        {/* DRAG-IN CLOCK (from webinar) */}
        {showClockWidget && (
          <ClockWidget
            currentTime={currentTimeString}
            currentDate={currentDateObj}
            dragInComplete={clockDragInComplete}
            setDragInComplete={setClockDragInComplete}
            clockRemoved={clockRemoved}
          />
        )}

        {/* HEADLINE from server data, times 45.04 -> 55.04 */}
        {showHeadline && headline && (
          <div className="headlineText">{headline}</div>
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

export default WebinarView;

/**
 * The same “Exit-intent bubble” from the original demo, unchanged
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
 * The clock widget exactly as in the webinar code,
 * except we are using global class names so the keyframes match.
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

  // Handle “dragIn” vs “dragOut” animations
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

  let widgetClass = "clockWidget";
  if (!clockRemoved) {
    widgetClass += dragInComplete ? " wobble" : " animateIn";
  } else {
    widgetClass += " animateOut";
  }

  return (
    <div className={widgetClass} onAnimationEnd={handleAnimationEnd} ref={widgetRef}>
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

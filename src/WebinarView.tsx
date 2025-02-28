/* WEBINARVIEW.TSX (SCRIPT) */
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
 * Demo video page, with:
 *  - Clock drag-in at 4s, drag-out at 8s
 *  - Headline injection at 45.04s to 55.04s
 *  - Existing top-right clock from VideoClock.tsx unaffected
 *  - All other features remain unaltered
 */
const WebinarView: React.FC = () => {
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // We still have the original audioRef for 0.5s injection:
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // Exit-intent
  const [showExitOverlay, setShowExitOverlay] = useState<boolean>(false);
  const [hasShownOverlay, setHasShownOverlay] = useState<boolean>(false);
  const [exitMessage, setExitMessage] = useState<string>("");

  // Clock widget states (drag-in clock)
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  const [currentTimeString, setCurrentTimeString] = useState("");
  const [currentDateObj, setCurrentDateObj] = useState<Date | null>(null);
  const clockIntervalRef = useRef<NodeJS.Timer | null>(null);

  // Headline states
  const [showHeadline, setShowHeadline] = useState(false);

  // Keep track of user's last valid playback time to prevent scrubbing:
  const lastTimeRef = useRef<number>(0);

  // Fetch data (including audio_link + exit_message)
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

  // Voice injection at 0.5s (existing feature)
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

  // =======================
  // 1) HEADLINE Show/Hide
  // =======================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function checkHeadline() {
      const t = vid.currentTime;
      // Show from 45.04s to 55.04s
      if (t >= 45.04 && t < 55.04) {
        setShowHeadline(true);
      } else {
        setShowHeadline(false);
      }
    }

    vid.addEventListener("timeupdate", checkHeadline);
    vid.addEventListener("seeking", checkHeadline);

    return () => {
      vid.removeEventListener("timeupdate", checkHeadline);
      vid.removeEventListener("seeking", checkHeadline);
    };
  }, []);

  // =======================
  // 2) DRAG-IN CLOCK
  // =======================
  // Start/stop the actual digital clock updates
  const startClockInterval = useCallback(() => {
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
    updateClock(); // do an immediate update

    if (!clockIntervalRef.current) {
      clockIntervalRef.current = setInterval(updateClock, 1000);
    }
  }, []);

  const stopClockInterval = useCallback(() => {
    if (clockIntervalRef.current) {
      clearInterval(clockIntervalRef.current);
      clockIntervalRef.current = null;
    }
  }, []);

  // Listen for video time => show clock at 4s
  // We do "drag in" once user crosses 4s, then remove at ~8s.
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleCheckClock() {
      const t = vid.currentTime;

      // If we've hit 4s, show the widget if not shown yet
      if (t >= 4 && !showClockWidget && !clockRemoved) {
        setShowClockWidget(true);
        startClockInterval();
      }
      // If user is already in that time range, keep updating
      if (showClockWidget && !clockRemoved) {
        startClockInterval();
      }
    }

    vid.addEventListener("timeupdate", handleCheckClock);
    return () => {
      vid.removeEventListener("timeupdate", handleCheckClock);
    };
  }, [showClockWidget, clockRemoved, startClockInterval]);

  // Once the dragIn completes, keep the clock visible for 4 seconds (8 - 4 = 4)
  useEffect(() => {
    if (clockDragInComplete) {
      const timer = setTimeout(() => {
        setClockRemoved(true); // triggers dragOut
      }, 4000); // show for 4s after dragIn done
      return () => clearTimeout(timer);
    }
  }, [clockDragInComplete]);

  // Once we remove it => hide fully after 1s (the dragOut animation time)
  useEffect(() => {
    if (clockRemoved) {
      stopClockInterval();
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000); // let the dragOut animation complete
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved, stopClockInterval]);

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
        <VideoClock videoContainerRef={videoWrapperRef} />

        <video
          ref={videoRef}
          // Autoplay is off
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

        {/*  HEADLINE  */}
        {showHeadline && webinarInjectionData?.headline && (
          <div
            className="headlineText" // Note: using global class
            style={{
              fontFamily: `"SF Pro Display", sans-serif`,
              color: "#252525",
              lineHeight: 1.2, // slightly tighter
              letterSpacing: "0.02em",
            }}
          >
            {webinarInjectionData.headline}
          </div>
        )}

        {/*  CLOCK WIDGET (drag-in)  */}
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

      {/* CTA Button, same as original code */}
      <div style={{ marginTop: "1rem" }}>
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
 * ClockWidget subcomponent – EXACT same approach as webinar, but times changed:
 * - Appear at 4s, remove at 8s
 * - Animate in via "animateIn", then wobble, then "animateOut"
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

  let widgetClass = "clockWidget"; // global class
  if (!clockRemoved) {
    // if not removed => animate in or wobble
    widgetClass += dragInComplete ? " wobble" : " animateIn";
  } else {
    // once removing => animate out
    widgetClass += " animateOut";
  }

  return (
    <div className={widgetClass} onAnimationEnd={handleAnimationEnd}>
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

export default WebinarView;

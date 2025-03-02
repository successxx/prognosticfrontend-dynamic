import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { VideoOverlay } from "./VideoOverlay";
// Import your existing small Mac-style clock:
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
 * This is the full demo video component with:
 *  - Clock drag-in from 4s to 8s
 *  - Headline injection from 1s to 15s
 *  - Everything else (audio injection, exit-intent, no-scrub) unchanged
 */
const WebinarView: React.FC = () => {
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // Has the user interacted to enable sound?
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  // Audio for the 0.5s injection
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exit-intent overlay
  const [showExitOverlay, setShowExitOverlay] = useState<boolean>(false);
  const [hasShownOverlay, setHasShownOverlay] = useState<boolean>(false);
  const [exitMessage, setExitMessage] = useState<string>("");

  // Track last valid playback time to prevent scrubbing:
  const lastTimeRef = useRef<number>(0);

  // ---------------------
  // HEADLINE
  // ---------------------
  const [showHeadline, setShowHeadline] = useState(false);

  // ---------------------
  // CLOCK WIDGET
  // ---------------------
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  const [currentTimeString, setCurrentTimeString] = useState("");
  const [currentDateObj, setCurrentDateObj] = useState<Date | null>(null);
  const clockIntervalRef = useRef<NodeJS.Timer | null>(null);

  // =====================================================
  // 1) Fetch data (including audio_link + exit_message)
  // =====================================================
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

          // exit message
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }

          // audio link
          if (audioRef.current && data.audio_link) {
            audioRef.current.src = data.audio_link;
          }
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      })();
    }
  }, []);

  // =====================================================
  // 2) Voice injection at 0.5s
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;

    function handleTimeUpdate() {
      // Always store last valid playback time (for no-scrub logic)
      lastTimeRef.current = vid.currentTime;

      // Once past 0.5s, play injection
      if (vid.currentTime >= 0.5) {
        audioRef.current.play().catch((err) => {
          console.warn("Voice injection blocked by browser:", err);
        });
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // =====================================================
  // 3) Prevent scrubbing by reverting any seeking
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleSeeking() {
      if (Math.abs(vid.currentTime - lastTimeRef.current) > 0.1) {
        vid.currentTime = lastTimeRef.current;
      }
    }
    vid.addEventListener("seeking", handleSeeking);
    return () => {
      vid.removeEventListener("seeking", handleSeeking);
    };
  }, []);

  // =====================================================
  // 4) Exit-intent detection
  // =====================================================
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

  // =====================================================
  // 5) HEADLINE & CLOCK timing checks (1–15s for headline, 4–8s for clock)
  // =====================================================
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleTiming() {
      const t = vid.currentTime;

      // Headline: show from 1–15s
      if (t >= 1 && t < 15) {
        setShowHeadline(true);
      } else {
        setShowHeadline(false);
      }

      // Clock: appear at 4s, vanish at 8s
      if (t >= 4 && !showClockWidget && !clockRemoved) {
        setShowClockWidget(true);
      }
      if (t >= 8 && !clockRemoved) {
        setClockRemoved(true);
      }
    }

    vid.addEventListener("timeupdate", handleTiming);
    return () => {
      vid.removeEventListener("timeupdate", handleTiming);
    };
  }, [showClockWidget, clockRemoved]);

  // =====================================================
  // 6) Update clock time once it’s visible
  // =====================================================
  useEffect(() => {
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

    if (showClockWidget && !clockRemoved) {
      if (!clockIntervalRef.current) {
        // start interval
        updateClock();
        clockIntervalRef.current = setInterval(updateClock, 1000);
      }
    } else {
      // ensure cleanup
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current as NodeJS.Timeout);
        clockIntervalRef.current = null;
      }
    }

    return () => {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current as NodeJS.Timeout);
        clockIntervalRef.current = null;
      }
    };
  }, [showClockWidget, clockRemoved]);

  // Once we “remove” the clock, actually hide it after 1s
  useEffect(() => {
    if (clockRemoved) {
      const hideTimer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000);
      return () => clearTimeout(hideTimer);
    }
  }, [clockRemoved]);

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="container">
      {/* Hidden audio for voice injection */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Exit-intent Overlay */}
      {showExitOverlay &&
        ReactDOM.createPortal(
          <ExitOverlay
            message={exitMessage}
            onClose={() => setShowExitOverlay(false)}
          />,
          document.body
        )}

      {/* Video container */}
      <div ref={videoWrapperRef} className="videoWrapper">
        {/* Overlays for embedded text, etc. */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />

        {/* The small top-right Mac-style clock (unchanged) */}
        <VideoClock videoContainerRef={videoWrapperRef} />

        {/* The actual video element */}
        <video
          ref={videoRef}
          controls
          playsInline
          muted={!hasInteracted}
          className="videoPlayer"
        >
          <source
            src="https://progwebinar.blob.core.windows.net/video/clientsaidemovid.mp4"
            type="video/mp4"
          />
          Your browser does not support HTML5 video.
        </video>

        {/* Single-click overlay => unmute + play */}
        {!hasInteracted && (
          <div
            className="soundOverlay"
            onClick={() => {
              setHasInteracted(true);
              if (videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.play().catch((err) => {
                  console.warn("Play blocked:", err);
                });
              }
            }}
          >
            <div className="soundIcon">🔊</div>
            <div className="soundText">Click to watch your AI agents</div>
          </div>
        )}

        {/* HEADLINE injection from 1s to 15s */}
        {showHeadline && webinarInjectionData?.headline?.trim() && (
          <div
            className="headlineText"
            style={{
              fontFamily: "SF Pro Display, sans-serif",
              color: "#252525",
              lineHeight: "1.1",
              letterSpacing: "0.02em",
            }}
          >
            {webinarInjectionData.headline}
          </div>
        )}

        {/* Drag-in clock widget EXACTLY as webinar */}
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
            <div className="widgetContent">
              <div className="clockTime">{currentTimeString}</div>
              <div className="clockDate">
                {currentDateObj
                  ? currentDateObj.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA button, unchanged */}
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
    <div className="exitOverlay" onClick={onClose}>
      <div
        className="iphoneMessageBubble"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="exitCloseBtn" onClick={onClose}>
          ×
        </button>
        <div className="iphoneSender">Selina</div>
        <div className="iphoneMessageText">
          {message && message.trim() ? message : defaultMsg}
        </div>
      </div>
    </div>
  );
};

export default WebinarView;

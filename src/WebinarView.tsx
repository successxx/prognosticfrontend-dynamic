import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./WebinarView.module.css";
import VideoOverlay from "./VideoOverlay";
import ClockWidget from "./ClockWidget";
import ExitOverlay from "./ExitOverlay";

const WebinarView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // For exit-intent
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);
  const [exitMessage, setExitMessage] = useState("Wait! Are you sure you want to leave?");

  // User clicked to unmute
  const [hasInteracted, setHasInteracted] = useState(false);

  // Clock
  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);

  // Headline
  const [showHeadline, setShowHeadline] = useState(false);
  const [headlineText, setHeadlineText] = useState("Your AI-Enhanced Funnel Headline");

  useEffect(() => {
    // Example: fetch user data for audio link, exit message, headline, etc.
    // We'll just mock them with setTimeout
    setTimeout(() => {
      // Suppose we get data from some API
      // audio_link -> audioRef
      if (audioRef.current) {
        audioRef.current.src = "https://example.com/your-audio-file.mp3";
      }
      setExitMessage("Hold on! Are you sure about leaving? 🤔");
      setHeadlineText("Mind-Blowing AI in Action");
    }, 500);
  }, []);

  // Play voice injection at 0.5s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;

    const handleTime = () => {
      if (vid.currentTime >= 0.5) {
        audioRef.current.play().catch((err) => {
          console.warn("Voice injection blocked:", err);
        });
        vid.removeEventListener("timeupdate", handleTime);
      }
    };
    vid.addEventListener("timeupdate", handleTime);
    return () => vid.removeEventListener("timeupdate", handleTime);
  }, []);

  // Exit-intent
  useEffect(() => {
    if (hasShownOverlay) return;
    const handleMouseMove = (e: MouseEvent) => {
      const threshold = window.innerHeight * 0.1;
      if (e.clientY < threshold) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasShownOverlay]);

  // Clock => show @4s, hide @8s (simple example)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const clockCheck = () => {
      const t = vid.currentTime;
      if (!showClockWidget && t >= 4) {
        setShowClockWidget(true);
      }
      if (!clockRemoved && t >= 8) {
        setClockRemoved(true);
      }
    };
    vid.addEventListener("timeupdate", clockCheck);
    return () => vid.removeEventListener("timeupdate", clockCheck);
  }, [showClockWidget, clockRemoved]);

  // Once removed => hide fully after 1s
  useEffect(() => {
    if (clockRemoved) {
      const timer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [clockRemoved]);

  // Headline @ 10–15s (example)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleHeadline = () => {
      const t = vid.currentTime;
      if (t >= 10 && t < 15) {
        setShowHeadline(true);
      } else {
        setShowHeadline(false);
      }
    };
    vid.addEventListener("timeupdate", handleHeadline);
    return () => vid.removeEventListener("timeupdate", handleHeadline);
  }, []);

  return (
    <div className={styles.container}>
      {/* Hidden audio */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Exit-intent overlay */}
      {showExitOverlay &&
        createPortal(
          <ExitOverlay message={exitMessage} onClose={() => setShowExitOverlay(false)} />,
          document.body
        )}

      {/* Video container */}
      <div ref={videoWrapperRef} className={styles.videoWrapper}>
        <VideoOverlay videoRef={videoRef} videoContainerRef={videoWrapperRef} />

        {showClockWidget && (
          <ClockWidget
            clockRemoved={clockRemoved}
            clockDragInComplete={clockDragInComplete}
            setClockDragInComplete={setClockDragInComplete}
          />
        )}

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
            <div className={styles.soundText}>Click to Unmute</div>
          </div>
        )}

        {showHeadline && (
          <div className={styles.headlineText}>
            {headlineText}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebinarView;

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./WebinarView.module.css";
import VideoClock from "./VideoClock"; // Fixed: now a default export
import VideoOverlay from "./VideoOverlay";
import Fireworks from "./Fireworks";

function WebinarView() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);
  const [exitMessage, setExitMessage] = useState("");

  const [hasInteracted, setHasInteracted] = useState(false);
  const [webinarInjectionData, setWebinarInjectionData] = useState<any>(null);

  const [showClockWidget, setShowClockWidget] = useState(false);
  const [clockDragInComplete, setClockDragInComplete] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);

  // Load user data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("user_email");
    if (userEmail) {
      fetch("https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_user_two", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: userEmail }),
      })
        .then((resp) => {
          if (!resp.ok) throw new Error("Error fetching user data");
          return resp.json();
        })
        .then((data) => {
          setWebinarInjectionData(data);
          if (audioRef.current && data.audio_link) {
            audioRef.current.src = data.audio_link;
          }
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
        })
        .catch((err) => console.error("Error loading user data:", err));
    }
  }, []);

  // Voice injection at 0.5s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;
    function handleTime() {
      if (vid.currentTime >= 0.5) {
        audioRef.current.play().catch((err) => console.warn("Voice injection blocked:", err));
        vid.removeEventListener("timeupdate", handleTime);
      }
    }
    vid.addEventListener("timeupdate", handleTime);
    return () => vid.removeEventListener("timeupdate", handleTime);
  }, []);

  // Exit-intent overlay
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

  // Clock widget: show at 4s, hide at 8s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    function clockCheck() {
      const t = vid.currentTime;
      if (!showClockWidget && t >= 4) setShowClockWidget(true);
      if (!clockRemoved && t >= 8) setClockRemoved(true);
    }
    vid.addEventListener("timeupdate", clockCheck);
    return () => vid.removeEventListener("timeupdate", clockCheck);
  }, [showClockWidget, clockRemoved]);

  useEffect(() => {
    if (clockRemoved) {
      const timer = setTimeout(() => setShowClockWidget(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [clockRemoved]);

  // Headline: show between 45.04 and 55.04 seconds
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    function headlineCheck() {
      const t = vid.currentTime;
      setShowHeadline(t >= 45.04 && t < 55.04);
    }
    vid.addEventListener("timeupdate", headlineCheck);
    return () => vid.removeEventListener("timeupdate", headlineCheck);
  }, []);

  return (
    <div className={styles.container} style={{ textAlign: "center" }}>
      <audio ref={audioRef} style={{ display: "none" }} />
      {showExitOverlay &&
        ReactDOM.createPortal(
          <ExitOverlay message={exitMessage} onClose={() => setShowExitOverlay(false)} />,
          document.body
        )}
      <div ref={videoWrapperRef} className={styles.videoWrapper}>
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />
        <VideoClock videoContainerRef={videoWrapperRef} />
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
                videoRef.current.play().catch((err) => console.warn("Play blocked:", err));
              }
            }}
          >
            <div className={styles.soundIcon}>🔊</div>
            <div className={styles.soundText}>Click to watch your AI agents</div>
          </div>
        )}
        {showClockWidget && (
          <div
            className={
              styles.clockWidget +
              " " +
              (clockRemoved ? styles.animateOut : clockDragInComplete ? styles.wobble : styles.animateIn)
            }
            onAnimationEnd={(e) => {
              if (e.animationName.includes("dragIn")) setClockDragInComplete(true);
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
            <ClockWidgetContent />
          </div>
        )}
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
      <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
        © {new Date().getFullYear()} Clients.ai
      </p>
    </div>
  );
}

export default WebinarView;

/* WebinarView.tsx
   The main video page code
   referencing your “video drag in/out” logic 
   with a fluid approach from left to right
*/
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./WebinarView.module.css";
import VideoClock from "./VideoClock";
import VideoOverlay from "./VideoOverlay"; 
import Fireworks from "./Fireworks"; // if you want
// If you have an interface for injection:

export interface IWebinarInjection {
  // same fields ...
}

const WebinarView: React.FC = () => {
  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // States
  const [connecting, setConnecting] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [exitMessage, setExitMessage] = useState("");
  const [clockVisible, setClockVisible] = useState(false);
  const [clockRemoved, setClockRemoved] = useState(false);
  const [clockDragDone, setClockDragDone] = useState(false);

  const [showHeadline, setShowHeadline] = useState(false);
  const [webinarInjectionData, setWebinarInjectionData] = useState<IWebinarInjection>();

  // On mount, do your logic
  useEffect(() => {
    // Fake a 2s “connecting”
    const timer = setTimeout(() => {
      setConnecting(false);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Freed scrubbing => no skip prevention
  // just let them move the video time

  // Clock => show at 4s, hide at 8s
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function checkClock() {
      const t = vid.currentTime;
      if (!clockVisible && t >= 4 && t < 8) {
        setClockVisible(true);
      }
      if (!clockRemoved && t >= 8) {
        setClockRemoved(true);
      }
    }
    vid.addEventListener("timeupdate", checkClock);
    return () => vid.removeEventListener("timeupdate", checkClock);
  }, [clockVisible, clockRemoved]);

  // Once removed => hide fully after 1s
  useEffect(() => {
    if (clockRemoved) {
      const timer = setTimeout(() => {
        setClockVisible(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [clockRemoved]);

  // Headline from 45.04–55.04 (example)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    function handleHeadline() {
      const t = vid.currentTime;
      if (t >= 45.04 && t < 55.04) {
        setShowHeadline(true);
      } else {
        setShowHeadline(false);
      }
    }
    vid.addEventListener("timeupdate", handleHeadline);
    return () => vid.removeEventListener("timeupdate", handleHeadline);
  }, []);

  if (connecting) {
    return (
      <div className={styles.connectingOverlay}>
        <div className={styles.connectingBox}>
          <div className={styles.connectingSpinner}></div>
          <div className={styles.connectingText}>Connecting you now...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hidden audio for injection if needed */}
      <audio ref={audioRef} style={{ display:"none" }} />

      {/* The video wrapper */}
      <div className={styles.zoomContainer}>
        <div className={styles.zoomTopBar}>
          <div className={styles.zoomTitle}>Clients.ai Advanced Training</div>
          <div className={styles.zoomLiveMinutes}>Live for XX mins</div>
        </div>

        <div className={styles.videoWrapper}>
          <VideoOverlay
            videoRef={videoRef}
            videoContainerRef={null} /* or pass the ref if you want dynamic sizing */
            webinarInjectionData={webinarInjectionData}
          />
          <VideoClock videoContainerRef={null} />

          <video
            ref={videoRef}
            className={styles.videoPlayer}
            controls
            muted={!hasInteracted}
            onPlay={() => console.log("video playing")}
          >
            <source src="https://progwebinar.blob.core.windows.net/video/clientsaidemovid.mp4" />
          </video>

          {!hasInteracted && (
            <div
              className={styles.soundOverlay}
              onClick={() => {
                setHasInteracted(true);
                if (videoRef.current) {
                  videoRef.current.muted = false;
                  videoRef.current.play().catch(() => {});
                }
              }}
            >
              <div className={styles.soundIcon}>🔊</div>
              <div className={styles.soundText}>Click to enable sound</div>
            </div>
          )}

          {/* The clock */}
          {clockVisible && (
            <div
              className={
                styles.clockWidget +
                " " +
                (clockRemoved
                  ? styles.animateOut
                  : clockDragDone
                  ? styles.wobble
                  : styles.animateIn)
              }
              onAnimationEnd={(e) => {
                if (e.animationName.includes("dragIn")) {
                  setClockDragDone(true);
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
                <div className={styles.clockTime}>12:34:56 PM</div>
                <div className={styles.clockDate}>Monday, June 1, 2025</div>
              </div>
            </div>
          )}

          {/* Headline text */}
          {showHeadline && (
            <div className={styles.headlineText}>
              {"Hello from the headline injection."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebinarView;

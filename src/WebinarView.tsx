/**
 * WebinarView.tsx
 *
 * - 2-second "Connecting" overlay
 * - Large video (70% of width) + future chat placeholder (30%)
 * - Personalized audio at 3s
 * - "Live for X minutes" label top-right
 * - Mouse-based "exit intent" overlay with AI-generated message from backend
 *   (shows once if user moves cursor above top 10% of screen).
 */
import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css';

const WebinarView: React.FC = () => {
  // Refs for <video> and <audio> elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Track if user has unmuted
  const [hasInteracted, setHasInteracted] = useState(false);

  // Show "Connecting..." overlay for 2 seconds
  const [connecting, setConnecting] = useState(true);

  // "Live for X minutes"
  const [liveMinutes, setLiveMinutes] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // AI-generated exit message (from your backend / make.com)
  const [exitMessage, setExitMessage] = useState('');
  const defaultExitMessage = "Wait! Are you sure you want to leave?";
  // Whether the exit overlay is currently visible
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  // Whether we have already shown the overlay (so we don't show it again)
  const [hasShownOverlay, setHasShownOverlay] = useState(false);

  // 1) On mount, fetch user’s data + start 2s timer
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('user_email');

    if (userEmail) {
      // Fetch audio_link + exit_message from your backend
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(
              userEmail
            )}`
          );
          if (!response.ok) {
            console.error('Error retrieving personalized data:', response.statusText);
            return;
          }
          const data = await response.json();

          // Personalized audio
          if (data.audio_link && audioRef.current) {
            audioRef.current.src = data.audio_link;
          }

          // AI-generated exit message
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
        } catch (err) {
          console.error('Error loading personalized data:', err);
        }
      };
      fetchData();
    } else {
      console.warn('No user_email param found.');
    }

    // Show "Connecting..." for 2s
    const timer = setTimeout(() => {
      setConnecting(false);
      startTimeRef.current = Date.now();

      // Attempt auto-play
      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.log('Auto-play prevented; user must interact', err);
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 2) "Live for X minutes" timer
  useEffect(() => {
    if (!connecting && startTimeRef.current) {
      const intervalId = setInterval(() => {
        const diff = Date.now() - startTimeRef.current!;
        setLiveMinutes(Math.floor(diff / 60000));
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [connecting]);

  // 3) Play personalized audio at 3s
  useEffect(() => {
    const videoEl = videoRef.current;
    const audioEl = audioRef.current;
    if (!videoEl || !audioEl) return;

    const handleTimeUpdate = () => {
      if (videoEl.currentTime >= 3) {
        audioEl.play().catch(err =>
          console.error('Error starting personalized audio playback:', err)
        );
        videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // 4) Mouse-based "exit intent" overlay (top 10% of screen)
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      // If we've already shown it once, do nothing
      if (hasShownOverlay) return;

      // If user's Y coord is above top 10%, show overlay
      const threshold = window.innerHeight * 0.1;
      if (e.clientY < threshold) {
        // show overlay
        setShowExitOverlay(true);
        setHasShownOverlay(true);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hasShownOverlay]);

  // 5) If connecting, just show "Connecting you now..."
  if (connecting) {
    return (
      <div className={styles.connectingOverlay}>
        <div className={styles.connectingBox}>
          <p className={styles.connectingText}>Connecting you now...</p>
        </div>
      </div>
    );
  }

  // 6) Render the actual webinar
  return (
    <div className={styles.container}>
      {/* Show the exit overlay if needed */}
      {showExitOverlay && (
        <div className={styles.exitOverlay}>
          <div className={styles.exitOverlayBox}>
            <button
              className={styles.exitCloseBtn}
              onClick={() => setShowExitOverlay(false)}
            >
              ×
            </button>
            <p>
              {exitMessage && exitMessage.trim().length > 0
                ? exitMessage
                : defaultExitMessage}
            </p>
          </div>
        </div>
      )}

      {/* Banner row (LIVE + label, and "Live for X minutes" on the right) */}
      <div className={styles.bannerRow}>
        <div className={styles.banner}>
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot} />
            LIVE
          </div>
          PrognosticAI Advanced Training
        </div>
        <div className={styles.liveMinutes}>
          Live for {liveMinutes} minute{liveMinutes !== 1 ? 's' : ''}
        </div>
      </div>

      {/* 70%/30% layout */}
      <div className={styles.twoColumnLayout}>
        {/* Video column */}
        <div className={styles.videoColumn}>
          <div className={styles.videoWrapper}>
            <video
              ref={videoRef}
              muted={!hasInteracted}
              playsInline
              controls={false}
              style={{ width: '100%', height: 'auto' }}
            >
              <source
                src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
                type="video/mp4"
              />
              Your browser does not support HTML5 video.
            </video>

            {/* Hidden <audio> for personalized track */}
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* Sound Overlay if not yet interacted */}
            {!hasInteracted && (
              <div
                className={styles.soundOverlay}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = false;
                  }
                  setHasInteracted(true);
                }}
              >
                <div className={styles.soundIcon}>🔊</div>
                <div className={styles.soundText}>Click to Enable Sound</div>
              </div>
            )}
          </div>
        </div>

        {/* Chat column placeholder */}
        <div className={styles.chatColumn}>
          <div className={styles.chatPlaceholder}>
            <p style={{ textAlign: 'center', color: '#555' }}>
              [Chat Box Coming Soon!]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarView;

/**
 * WebinarView.tsx
 *
 * A React component that:
 *  - Shows "Connecting you now..." overlay for 2 seconds
 *  - Plays the main webinar video (fake live)
 *  - Fetches personalized audio from your backend and plays it at 3s
 *  - Displays "Live for X minutes" top-right
 *  - Shows a custom exit warning overlay using text from your backend
 *  - Uses a 70%/30% layout for video vs chat
 */
import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css';

const WebinarView: React.FC = () => {
  // References to <video> and <audio>
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // State controlling whether user has clicked to unmute
  const [hasInteracted, setHasInteracted] = useState(false);

  // Two-second "connecting" overlay
  const [connecting, setConnecting] = useState(true);

  // "Live for X minutes"
  const [liveMinutes, setLiveMinutes] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // AI-generated exit message from backend
  const [exitMessage, setExitMessage] = useState<string>('');
  // Whether to show custom exit warning overlay
  const [showExitWarning, setShowExitWarning] = useState(false);

  // 1) On mount, fetch user’s audio + exit message and start "connecting" timer
  useEffect(() => {
    // Grab user_email from ?user_email=
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('user_email');

    if (!userEmail) {
      console.warn('No user_email param found.');
      // We won't block anything, just no personalized audio or exit message
    } else {
      // Fetch audio & exit message from backend
      const fetchAudioAndExitMsg = async () => {
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

          // Fill the audio <source>
          if (data.audio_link && audioRef.current) {
            audioRef.current.src = data.audio_link;
            console.log('Personalized audio link loaded:', data.audio_link);
          }

          // Fill the AI-generated exit message if provided
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
        } catch (err) {
          console.error('Error loading personalized data:', err);
        }
      };
      fetchAudioAndExitMsg();
    }

    // Start the 2s "Connecting" timer
    const timer = setTimeout(() => {
      setConnecting(false);

      // Once "connecting" is done, we begin real "live" time
      startTimeRef.current = Date.now();

      // Attempt to play the video automatically
      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.log('Auto-play prevented; user must interact.', err);
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 2) Synchronize the "Live for X minutes" label
  useEffect(() => {
    // Only start counting once connecting is false and we have a start time
    if (!connecting && startTimeRef.current) {
      const interval = setInterval(() => {
        const diff = Date.now() - startTimeRef.current!;
        setLiveMinutes(Math.floor(diff / 60000));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [connecting]);

  // 3) Play the personalized audio at 3s into the video
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

  // 4) Show a custom exit warning overlay if user tries to close tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // For the system dialog (un-stylable):
      if (exitMessage) {
        e.preventDefault();
        e.returnValue = exitMessage; // some browsers show a generic text
      }
      // Show our custom overlay in the background
      setShowExitWarning(true);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [exitMessage]);

  // 5) Render
  // If still "connecting," show the connecting overlay
  if (connecting) {
    return (
      <div className={styles.connectingOverlay}>
        <div className={styles.connectingBox}>
          <p className={styles.connectingText}>Connecting you now...</p>
        </div>
      </div>
    );
  }

  // Otherwise, show the real webinar
  return (
    <div className={styles.container}>
      {/* If user tries to leave, we show our custom overlay (non-blocking). */}
      {showExitWarning && exitMessage && (
        <div className={styles.exitWarningOverlay}>
          <div className={styles.exitWarningBox}>
            <p>{exitMessage}</p>
          </div>
        </div>
      )}

      {/* Banner row with the "LIVE" area (left) and "live for X minutes" (right) */}
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

      {/* The main 2-column layout: 70% video, 30% chat (placeholder) */}
      <div className={styles.twoColumnLayout}>
        {/* Left side => video */}
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

            {/* The hidden audio element for personalized playback */}
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* If user hasn't interacted yet => sound overlay */}
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

        {/* Right side => chat placeholder (30%) */}
        <div className={styles.chatColumn}>
          {/* 
            We'll eventually place your chat here in a separate step.
            For now, just a placeholder div to hold the space.
          */}
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

/**
 * WebinarView.tsx
 * 
 * This file implements the "fake live" webinar video player with
 * personalized audio injection at a specified timestamp.
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css';

const WebinarView: React.FC = () => {
  // References to the <video> and <audio> elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // State controlling if user has clicked to enable sound
  const [hasInteracted, setHasInteracted] = useState(false);

  // -- Load Personalized Audio on Mount --
  useEffect(() => {
    // 1) Grab user_email from URL
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('user_email');

    // 2) If user email is missing, do nothing
    if (!userEmail) {
      console.warn('No user_email parameter found.');
      return;
    }

    // 3) Fetch personalized audio link from your backend
    //    For example: GET https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=...
    const fetchAudioLink = async () => {
      try {
        const response = await fetch(
          `https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(
            userEmail
          )}`
        );
        if (!response.ok) {
          console.error('Failed to retrieve personalized audio:', response.statusText);
          return;
        }
        const data = await response.json();

        // data.audio_link should look like: "https://drive.google.com/uc?export=download&id=FILE_ID"
        if (data.audio_link && audioRef.current) {
          audioRef.current.src = data.audio_link;
          console.log('Personalized audio link loaded:', data.audio_link);
        } else {
          console.warn('No audio_link found, or audioRef is null');
        }
      } catch (error) {
        console.error('Error loading personalized audio:', error);
      }
    };

    fetchAudioLink();

    // 4) Start playing the video automatically if possible
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Auto-play prevented by browser. User interaction required.', err);
      });
    }
  }, []);

  // -- Synchronize Audio Playback at a certain video time --
  useEffect(() => {
    const videoEl = videoRef.current;
    const audioEl = audioRef.current;

    // We'll check the video time in an 'timeupdate' event
    const handleTimeUpdate = () => {
      if (!videoEl || !audioEl) return;
      // e.g., play audio once video time >= 3 seconds
      // Adjust to 2055 if you want 34:15, etc.
      if (videoEl.currentTime >= 3) {
        // Attempt to play only once
        audioEl.play().catch(err => {
          console.error('Failed to start personalized audio playback:', err);
        });
        // Remove the event listener so we don't replay again and again
        videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    // Add event listener
    if (videoEl) {
      videoEl.addEventListener('timeupdate', handleTimeUpdate);
    }

    // Cleanup
    return () => {
      if (videoEl) {
        videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  // -- Render the "fake live" webinar page --
  return (
    <div className={styles.container}>
      <div className={styles.videoSection}>
        <div className={styles.banner}>
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot} />
            LIVE
          </div>
          PrognosticAI Advanced Training
        </div>

        {/* The main video element */}
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            muted={!hasInteracted}
            playsInline
            controls={false} // typically you hide controls for "fake live"
            style={{ width: '100%', height: 'auto' }}
          >
            {/* Webinar video source. Adjust if needed. */}
            <source
              src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
              type="video/mp4"
            />
            {/* fallback text */}
            Your browser does not support HTML5 video.
          </video>

          {/* The hidden audio element for personalized playback */}
          <audio ref={audioRef} style={{ display: 'none' }} />

          {/* If user has not yet clicked to enable sound, show overlay */}
          {!hasInteracted && (
            <div
              className={styles.soundOverlay}
              onClick={() => {
                // user clicks => unmute
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
    </div>
  );
};

export default WebinarView;

import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css'; // Reuse existing styles

const WebinarView: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // Get user email from URL
        const urlParams = new URLSearchParams(window.location.search);
        const userEmail = urlParams.get('user_email');

        // Load personalized audio
        const loadAudio = async () => {
            if (!userEmail) return;
            
            try {
                const response = await fetch(`https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(userEmail)}`);
                const data = await response.json();
                
                if (data.audio_link && audioRef.current) {
                    audioRef.current.src = data.audio_link;
                }
            } catch (error) {
                console.error('Error loading audio:', error);
            }
        };

        loadAudio();

        // Start video
        if (videoRef.current) {
            videoRef.current.play().catch(err => console.log("Auto-play prevented:", err));
        }
    }, []);

    // Video time update handler
    useEffect(() => {
        const video = videoRef.current;
        const audio = audioRef.current;
        
        const handleTimeUpdate = () => {
            if (video && audio && video.currentTime >= 3) { // 3 seconds trigger
                audio.play();
                video.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };

        if (video) {
            video.addEventListener('timeupdate', handleTimeUpdate);
        }

        return () => {
            if (video) {
                video.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, []);

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
                <div className={styles.videoWrapper}>
                    <video 
                        ref={videoRef}
                        muted={!hasInteracted}
                        playsInline
                    >
                        <source src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4" type="video/mp4" />
                    </video>
                    <audio 
                        ref={audioRef} 
                        style={{ display: 'none' }}
                    />
                    
                    {!hasInteracted && (
                        <div 
                            className={styles.soundOverlay}
                            onClick={() => {
                                if (videoRef.current) videoRef.current.muted = false;
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

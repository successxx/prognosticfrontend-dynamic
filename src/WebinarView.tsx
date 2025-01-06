/**
 * WebinarView.tsx
 * Fully TypeScript compliant version with null safety
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './WebinarView.module.css';

// Type definitions for better type safety
interface ChatMessage {
  text: string;
  type: 'user' | 'host' | 'system';
  userName?: string;
}

interface PreloadedQuestion {
  time: number;
  text: string;
  user: string;
}

const WebinarView: React.FC = () => {
  // Video and audio refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const messageToneRef = useRef<HTMLAudioElement>(null);

  // State management
  const [hasInteracted, setHasInteracted] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [liveMinutes, setLiveMinutes] = useState(0);
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);
  const [exitMessage, setExitMessage] = useState('');
  const startTimeRef = useRef<number>(Date.now());

  // Safe audio play function
  const safePlayAudio = useCallback(async (audioElement: HTMLAudioElement | null) => {
    if (!audioElement) return;
    try {
      await audioElement.play();
    } catch (err) {
      console.warn('Audio playback prevented:', err);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('user_email');

    // Warning on refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "The webinar is currently full. If you reload, you might lose your spot.";
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Fetch user data if email exists
    if (userEmail) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(userEmail)}`
          );
          if (!response.ok) throw new Error('Failed to fetch user data');
          
          const data = await response.json();
          if (data.audio_link && audioRef.current) {
            audioRef.current.src = data.audio_link;
          }
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
        } catch (err) {
          console.error('Error loading user data:', err);
        }
      };
      fetchData().catch(console.error);
    }

    // Initial "Connecting" overlay
    const timer = setTimeout(() => {
      setConnecting(false);
      startTimeRef.current = Date.now();
      
      if (videoRef.current) {
        videoRef.current.play().catch(err => 
          console.warn('Autoplay prevented:', err)
        );
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // "Live for X minutes" timer
  useEffect(() => {
    if (!connecting) {
      const intervalId = setInterval(() => {
        const diff = Date.now() - startTimeRef.current;
        setLiveMinutes(Math.floor(diff / 60000));
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [connecting]);

  // Personal audio trigger at 3s
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 3) {
        safePlayAudio(audio);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [safePlayAudio]);

  // Exit intent detection
  useEffect(() => {
    if (hasShownOverlay) return;

    const handleMouseMove = (e: MouseEvent) => {
      const threshold = window.innerHeight * 0.1;
      if (e.clientY < threshold) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);
        safePlayAudio(messageToneRef.current);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasShownOverlay, safePlayAudio]);

  // Main render
  if (connecting) {
    return (
      <div className={styles.connectingOverlay}>
        <div className={styles.connectingBox}>
          <p className={styles.connectingText}>Connecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hidden audio elements */}
      <audio 
        ref={messageToneRef}
        src="https://cdn.freesound.org/previews/613/613258_5674468-lq.mp3"
        style={{ display: 'none' }}
      />
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Exit overlay portal */}
      {showExitOverlay && createPortal(
        <ExitOverlay 
          message={exitMessage} 
          onClose={() => setShowExitOverlay(false)}
        />,
        document.body
      )}

      {/* Banner section */}
      <BannerSection liveMinutes={liveMinutes} />

      {/* Main content */}
      <div className={styles.twoColumnLayout}>
        <VideoSection 
          videoRef={videoRef}
          hasInteracted={hasInteracted}
          onInteract={() => setHasInteracted(true)}
        />
        <ChatSection />
      </div>

      {/* Copyright footer */}
      <footer className={styles.copyright}>
        © {new Date().getFullYear()} PrognosticAI
      </footer>
    </div>
  );
};

// Child components broken out for clarity and maintainability
const ExitOverlay: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => {
  const defaultMessage = "Wait! Are you sure you want to leave?";
  
  return (
    <div className={styles.exitOverlay} onClick={onClose}>
      <div className={styles.iphoneMessageBubble} onClick={e => e.stopPropagation()}>
        <button className={styles.exitCloseBtn} onClick={onClose}>×</button>
        <div className={styles.iphoneSender}>Selina</div>
        <div className={styles.iphoneMessageText}>
          {message || defaultMessage}
        </div>
      </div>
    </div>
  );
};

const BannerSection: React.FC<{liveMinutes: number}> = ({ liveMinutes }) => (
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
);

const VideoSection: React.FC<{
  videoRef: React.RefObject<HTMLVideoElement>;
  hasInteracted: boolean;
  onInteract: () => void;
}> = ({ videoRef, hasInteracted, onInteract }) => (
  <div className={styles.videoColumn}>
    <div className={styles.videoWrapper}>
      <video
        ref={videoRef}
        muted={!hasInteracted}
        playsInline
        controls={false}
        className={styles.videoPlayer}
      >
        <source
          src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
          type="video/mp4"
        />
      </video>

      {!hasInteracted && (
        <div className={styles.soundOverlay} onClick={onInteract}>
          <div className={styles.soundIcon}>🔊</div>
          <div className={styles.soundText}>Click to Enable Sound</div>
        </div>
      )}
    </div>
  </div>
);

const ChatSection: React.FC = () => {
  // Chat state management with TypeScript safety
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showParticipants, setShowParticipants] = useState(true);
  const [viewerCount, setViewerCount] = useState(41);
  const [specialOfferVisible, setSpecialOfferVisible] = useState(false);
  const [offerTimeRemaining, setOfferTimeRemaining] = useState(600);
  const [isTyping, setIsTyping] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat
  useEffect(() => {
    // Safe scroll helper
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };

    // Add welcome message
    setMessages(prev => [...prev, {
      type: 'host',
      text: 'Welcome to the PrognosticAI Advanced Training! 👋',
      userName: 'Selina (Host)'
    }]);

    // Show special offer after 60s
    const offerTimer = setTimeout(() => {
      setSpecialOfferVisible(true);
      setMessages(prev => [...prev, {
        type: 'system',
        text: 'For the next 10 minutes only, secure your spot in PrognosticAI for just $999. Don\'t miss out.'
      }]);

      // Countdown timer
      const countdownInterval = setInterval(() => {
        setOfferTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setSpecialOfferVisible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }, 60000);

    // Cleanup
    return () => clearTimeout(offerTimer);
  }, []);

  // Handle message submission
  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      text: text,
      userName: 'You'
    }]);

    // Simulate typing
    setIsTyping(true);
    try {
      const response = await fetch('https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) throw new Error('API call failed');
      
      const data = await response.json();
      setIsTyping(false);

      if (data.response) {
        setMessages(prev => [...prev, {
          type: 'host',
          text: data.response,
          userName: 'Selina (Host)'
        }]);
      }
    } catch (err) {
      console.error('Error:', err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'system',
        text: 'Error connecting to chat. Please try again.'
      }]);
    }
  };

  return (
    <div className={styles.chatColumn}>
      <div className={styles.chatSection}>
        <div className={styles.chatHeader}>
          <div className={styles.headerTop}>
            <span className={styles.chatTitle}>Live Chat</span>
            <div className={styles.toggleContainer}>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={showParticipants}
                  onChange={e => setShowParticipants(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
              <span className={styles.toggleLabel}>Show Others</span>
            </div>
            <span className={styles.viewerCount}>
              <i>👥</i>
              <span>{viewerCount} watching</span>
            </span>
          </div>
        </div>

        {specialOfferVisible && (
          <div className={styles.specialOffer}>
            <div className={styles.countdown}>
              Special Offer Ends In: {Math.floor(offerTimeRemaining / 60)}:
              {(offerTimeRemaining % 60).toString().padStart(2, '0')}
            </div>
            <button 
              className={styles.investButton}
              onClick={() => window.location.href = 'https://yes.prognostic.ai'}
            >
              Invest $999 Now - Limited Time Offer
            </button>
          </div>
        )}

        <div className={styles.chatMessages} ref={chatContainerRef}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.message} ${styles[msg.type]}`}
              style={{
                display: (!showParticipants && msg.type === 'user' && msg.userName !== 'You')
                  ? 'none'
                  : 'block'
              }}
            >
              {msg.userName ? `${msg.userName}: ${msg.text}` : msg.text}
            </div>
          ))}
        </div>

        <div className={styles.chatInput}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message here..."
            onKeyPress={e => {
              if (e.key === 'Enter' && inputRef.current) {
                handleSubmit(inputRef.current.value);
                inputRef.current.value = '';
              }
            }}
          />
          {isTyping && (
            <div className={styles.typingIndicator}>
              Selina is typing...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebinarView;

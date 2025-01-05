/**
 * WebinarView.tsx
 *
 * - 2-second "Connecting" overlay
 * - Large video (70% of width) + the webinar chatbox (30%)
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

  // iPhone message tone
  const messageToneRef = useRef<HTMLAudioElement>(null);

  // Track if user has unmuted
  const [hasInteracted, setHasInteracted] = useState(false);

  // Show "Connecting..." overlay for 2 seconds
  const [connecting, setConnecting] = useState(true);

  // "Live for X minutes"
  const [liveMinutes, setLiveMinutes] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // AI-generated exit message (from your backend / Make.com)
  const [exitMessage, setExitMessage] = useState('');
  const defaultExitMessage = "Wait! Are you sure you want to leave?";
  // Whether the exit overlay is currently visible
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  // Whether we have already shown the overlay once
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
        setShowExitOverlay(true);
        setHasShownOverlay(true);

        // Play the iMessage tone (only if user has already interacted with the page for audio)
        if (messageToneRef.current) {
          messageToneRef.current.play().catch(err =>
            console.warn('iMessage tone autoplay blocked:', err)
          );
        }
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

  return (
    <div className={styles.container}>
      {/* iPhone text message tone (hidden) */}
      <audio
        ref={messageToneRef}
        src="https://cdn.freesound.org/previews/613/613258_5674468-lq.mp3"
        style={{ display: 'none' }}
      />

      {/* Show the exit overlay if needed */}
      {showExitOverlay && (
        <div className={styles.exitOverlay}>
          <div className={styles.iphoneMessageBubble}>
            <div className={styles.iphoneSender}>Selina</div>
            <div className={styles.iphoneMessageText}>
              {exitMessage && exitMessage.trim().length > 0
                ? exitMessage
                : defaultExitMessage}
            </div>
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

        {/* Chat column */}
        <div className={styles.chatColumn}>

          {/* REACT PORT OF YOUR WEBINAR CHATBOX CODE */}
          <WebinarChatBox />

        </div>
      </div>
    </div>
  );
};

/**
 * Below is the entire chatbox code from your HTML snippet,
 * converted to a React component, with the same logic so
 * it all "just works" on the webinar page.
 */
const WebinarChatBox: React.FC = () => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const specialOfferRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const investButtonRef = useRef<HTMLButtonElement | null>(null);

  // Just like your snippet
  const names = [
    "Emma","Liam","Olivia","Noah","Ava","Ethan","Sophia","Mason",
    "Isabella","William","Mia","James","Charlotte","Benjamin","Amelia",
    "Lucas","Harper","Henry","Evelyn","Alexander"
  ];

  const investmentMessages = [
    "just invested in PrognosticAI! 🚀",
    "secured their spot in PrognosticAI! ✨",
    "joined the PrognosticAI family! 🎉",
    "made a smart investment! 💡",
    "is starting their AI journey with us! 🌟",
    "got early access to PrognosticAI! 🔥",
    "upgraded to PrognosticAI Pro! 💪",
    "joined our success story! ⭐"
  ];

  const attendeeMessages = [
    "hows everyone doing today??",
    "Hi from Seattle! super excited 2 be here",
    "first time in one of these... hope im not late!",
    "cant wait to learn more bout this AI stuff 🤓",
    "hello everyone....joining from australia",
    "Any1 else here run advanced funnels for clients??",
    "This looks amazing, can't wait to see more advanced strategies!",
    "who else uses multi-step funnels with email marketing?",
    "omg the potential of this is INSANE for scaling funnels",
    "quick q - will this wrk with shopify or high-level??",
    "joining late...did i miss anything important???",
    "im blown away by the capabilities tbh",
    "this will save me so much time in my funnels",
    "anyone else do big product launches? this is a game changer",
    "thx for putting this together!! 🙌",
    "just got here...hope i didnt miss too much",
    "can someone explain the pricing again??",
    "this is exactly what ive been looking for!!1!",
    "sry if this was covered already but will there b updates?",
    "im big in affiliate marketing, and this is wild!"
  ];

  const preloadedQuestions = [
    {time:180,text:"How does this integrate with existing business systems?",user:"Michael"},
    {time:300,text:"Can you explain more about the AI capabilities?",user:"Sarah"},
    {time:450,text:"Does this work with Zapier?",user:"David"},
    {time:600,text:"What kind of ROI can we expect?",user:"Rachel"},
    {time:750,text:"How long does implementation typically take?",user:"James"},
    {time:900,text:"This is incredible! Can't believe the accuracy levels 🔥",user:"Emma"},
    {time:1200,text:"Do you offer enterprise solutions?",user:"Thomas"},
    {time:1500,text:"Just amazing how far AI has come!",user:"Lisa"},
    {time:1800,text:"What about data security?",user:"Alex"},
    {time:2100,text:"Can small businesses benefit from this?",user:"Jennifer"},
    {time:2400,text:"The predictive analytics are mind-blowing!",user:"Daniel"},
    {time:2700,text:"How often do you release updates?",user:"Sophie"},
    {time:3000,text:"Wow, the demo exceeded my expectations!",user:"Ryan"},
    {time:3300,text:"What makes PrognosticAI different from competitors?",user:"Maria"}
  ];

  // State to track if user is scrolling
  let isUserScrolling = false;

  // WebSocket ref
  const socketRef = useRef<WebSocket | null>(null);

  // On mount, attach all the logic
  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;
    const specialOfferEl = specialOfferRef.current;
    const countdownEl = countdownRef.current;
    const investBtn = investButtonRef.current;

    if (!chatEl || !inputEl || !typingEl || !toggleEl || !specialOfferEl || !countdownEl || !investBtn) {
      console.error("WebinarChatBox: Missing some chat refs.");
      return;
    }

    // Scroll helper
    function isNearBottom(element: HTMLDivElement): boolean {
      const threshold = 50;
      return (element.scrollHeight - element.clientHeight - element.scrollTop) <= threshold;
    }
    function scrollToBottom(element: HTMLDivElement) {
      element.scrollTop = element.scrollHeight;
    }

    // On scroll, detect if user is near bottom
    function handleScroll() {
      if (!chatEl) return;
      isUserScrolling = !isNearBottom(chatEl);
    }
    chatEl.addEventListener('scroll', handleScroll);

    // Add a message to the chat
    function addMessage(
      text: string,
      type: 'user' | 'host' | 'system',
      userName = '',
      isAutoGenerated = true
    ) {
      if (!chatEl) return;
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}`;
      messageDiv.textContent = userName ? `${userName}: ${text}` : text;

      // Tag user messages from others so they can be hidden if toggle is off
      if (type === 'user' && userName !== 'You') {
        messageDiv.setAttribute('data-participant', 'true');
        messageDiv.setAttribute('data-auto-generated', 'true');
        messageDiv.style.display = toggleEl.checked ? 'block' : 'none';
      }

      chatEl.appendChild(messageDiv);

      // auto-scroll if we are near bottom
      if (!isUserScrolling || userName === 'You') {
        scrollToBottom(chatEl);
      }
    }

    // Toggle show/hide participants
    function handleToggleChange(e: Event) {
      const target = e.currentTarget as HTMLInputElement;
      const participantMessages = chatEl.querySelectorAll('[data-participant="true"]');
      participantMessages.forEach(msg => {
        (msg as HTMLElement).style.display = target.checked ? 'block' : 'none';
      });
      if (target.checked && !isUserScrolling) {
        scrollToBottom(chatEl);
      }
    }
    toggleEl.addEventListener('change', handleToggleChange);

    // Connect WebSocket
    const newSocket = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log("Connected to chat server");
    };
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        addMessage(data.text, data.messageType as 'user' | 'host' | 'system', data.user, true);
      }
    };
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Schedule random attendee messages
    function scheduleAttendeeMessages() {
      const numMessages = Math.floor(Math.random() * 6) + 15;
      let delay = 500;
      for (let i = 0; i < numMessages; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const msg = attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        setTimeout(() => {
          addMessage(msg, 'user', name, true);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }

    // Show initial host message & schedule random lines
    setTimeout(() => {
      addMessage(
        "Welcome to the PrognosticAI Advanced Training! 👋 Let us know where you're joining from!",
        'host',
        'Selina (Host)',
        true
      );
      scheduleAttendeeMessages();
    }, 2000);

    // Preloaded questions
    preloadedQuestions.forEach(q => {
      setTimeout(() => {
        addMessage(q.text, 'user', q.user, true);

        // Simulate a short typing delay, then respond
        setTimeout(() => {
          typingEl.textContent = "Selina is typing...";
          const randomDelay = Math.random() * 10000 + 10000; 
          setTimeout(async () => {
            typingEl.textContent = "";
            // Optionally call handleHostResponse if you want
            // but let's just show something or do nothing
            // For now, if you have an AI response function, call it
          }, randomDelay);
        }, 1000);
      }, q.time * 1000);
    });

    // Investment notification every 30-60s
    function showInvestmentNotification() {
      const name = names[Math.floor(Math.random() * names.length)];
      const line = investmentMessages[Math.floor(Math.random() * investmentMessages.length)];
      // We'll do a "floating div" like your snippet
      const notif = document.createElement('div');
      notif.className = "notification";
      notif.innerHTML = `<div class="notification-icon">🎉</div><div><strong>${name}</strong> ${line}</div>`;
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 5000);
    }
    setInterval(() => {
      showInvestmentNotification();
    }, Math.random() * 30000 + 30000);

    // Update viewer count every 5s
    let currentViewers = 41;
    setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      currentViewers = Math.max(40, Math.min(50, currentViewers + change));
      const vCount = document.getElementById('viewerCount');
      if (vCount) {
        vCount.textContent = `${currentViewers} watching`;
      }
    }, 5000);

    // "Special Offer" after 60s
    setTimeout(() => {
      specialOfferEl.style.display = "block";
      addMessage(
        "🚨 Special Offer Alert! For the next 10 minutes only, secure your spot in PrognosticAI for just $999. Don't miss out! 🚀",
        "system",
        "",
        true
      );
      let t = 600; // 10 minutes
      const countdownInt = setInterval(() => {
        t--;
        const min = Math.floor(t / 60);
        const sec = t % 60;
        countdownEl.textContent = `Special Offer Ends In: ${min}:${sec.toString().padStart(2, "0")}`;
        if (t <= 0) {
          clearInterval(countdownInt);
          specialOfferEl.style.display = "none";
          addMessage("⌛ The special offer has ended.","system");
        }
      }, 1000);
    }, 60000);

    // Invest button goes to your site
    investBtn.addEventListener('click', () => {
      window.location.href = "https://yes.prognostic.ai";
    });

    // Real user typing => triggers "AI" response
    async function handleUserMessage(msg: string) {
      // This is your existing handleHostResponse logic from the snippet
      try {
        const randomDelay = Math.random() * 4000; 
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        typingEl.textContent = "Selina is typing...";

        const response = await fetch("https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg, type: "user" })
        });

        if (!response.ok) throw new Error("API call failed");
        const data = await response.json();
        typingEl.textContent = "";

        if (data.response) {
          addMessage(data.response, "host", "Selina (Host)", false);
        }
      } catch (err) {
        console.error("Error:", err);
        typingEl.textContent = "";
        addMessage(
          "Apologies, I'm having trouble connecting. Please try again!",
          "host",
          "Selina (Host)",
          false
        );
      }
    }

    function handleKeypress(e: KeyboardEvent) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(userMsg, "user", "You", false);
        handleUserMessage(userMsg);
      }
    }
    inputEl.addEventListener("keypress", handleKeypress);

    // Cleanup on unmount
    return () => {
      chatEl.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggleChange);
      inputEl.removeEventListener('keypress', handleKeypress);

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className="chat-section" style={{ height: '750px' /* like your snippet */ }}>
      {/* Chat Header */}
      <div className="chat-header">
        <div className="header-top">
          <span className="chat-title">Live Chat</span>
          <div className="toggle-container">
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="participantToggle"
                ref={participantToggleRef}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Show Others</span>
          </div>
          <span className="viewer-count">
            <i>👥</i>
            <span id="viewerCount">41 watching</span>
          </span>
        </div>
      </div>

      {/* Special Offer */}
      <div className="special-offer" id="specialOffer" ref={specialOfferRef} style={{ display: 'none' }}>
        <div className="countdown" id="countdownTimer" ref={countdownRef}>
          Special Offer Ends In: 10:00
        </div>
        <button className="invest-button" id="investButton" ref={investButtonRef}>
          Invest $999 Now - Limited Time Offer
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chatMessages" ref={chatMessagesRef}></div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message here..."
          id="messageInput"
          ref={messageInputRef}
        />
        <div className="typing-indicator" id="typingIndicator" ref={typingIndicatorRef}></div>
      </div>
    </div>
  );
};

export default WebinarView;

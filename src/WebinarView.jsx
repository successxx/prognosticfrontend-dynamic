/**
 * WebinarView.jsx
 *
 * A plain-JS React version of your “two HTML embeds” scenario.
 * No TypeScript => no TS compile errors.
 * 
 * Features:
 * - "Connecting..." overlay
 * - A big <video> with a clock widget at 10s
 * - A replay overlay when video ends
 * - Sound overlay
 * - Exit-intent overlay (iPhone bubble)
 * - Chat column with WebSocket
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './WebinarView.module.css'; // same file as above

// A global convenience so we can track “are we near bottom?” in Chat, etc.
let isUserScrolling = false;

export default function WebinarView() {
  // 1) REFS
  const videoRef = useRef(null);    // <video>
  const audioRef = useRef(null);    // <audio> for personalized track
  const messageToneRef = useRef(null); // iPhone text tone

  // 2) STATES
  const [connecting, setConnecting] = useState(true);    // show spinner for 2s
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [hasShownOverlay, setHasShownOverlay] = useState(false);
  const [exitMessage, setExitMessage] = useState('');
  const defaultExitMessage = "Wait! Are you sure you want to leave?";
  const [liveMinutes, setLiveMinutes] = useState(0);
  const startTimeRef = useRef(null);

  // Clock widget states
  const [clockVisible, setClockVisible] = useState(false);
  const [clockTime, setClockTime] = useState('');
  const [clockAnimationTriggered, setClockAnimationTriggered] = useState(false);

  // Replay overlay state
  const [showReplay, setShowReplay] = useState(false);

  // 3) UseEffects
  // 3.1) “beforeunload” warning
  useEffect(() => {
    function handleBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = "The webinar is currently full. If you reload, you might lose your spot.";
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 3.2) onMount => fetch user’s data + show connecting spinner
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('user_email');

    if (userEmail) {
      // fetch audio + exit msg
      fetch(`https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_audio?user_email=${encodeURIComponent(userEmail)}`)
        .then(res => {
          if (!res.ok) throw new Error('Error retrieving personalized data');
          return res.json();
        })
        .then(data => {
          if (data.audio_link && audioRef.current) {
            audioRef.current.src = data.audio_link;
          }
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
        })
        .catch(err => console.error('Error loading personalized data:', err));
    }

    // show “Connecting...” for 2s
    const t = setTimeout(() => {
      setConnecting(false);
      startTimeRef.current = Date.now();

      // attempt autoplay
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.log("Auto-play prevented:", err));
      }
    }, 2000);

    return () => clearTimeout(t);
  }, []);

  // 3.3) “Live for X minutes” timer
  useEffect(() => {
    if (!connecting && startTimeRef.current) {
      const intId = setInterval(() => {
        const diff = Date.now() - startTimeRef.current;
        setLiveMinutes(Math.floor(diff / 60000));
      }, 60000);
      return () => clearInterval(intId);
    }
  }, [connecting]);

  // 3.4) Personalized audio at 3s
  useEffect(() => {
    if (connecting) return;
    const vid = videoRef.current;
    const aud = audioRef.current;
    if (!vid || !aud) return;

    function handleTime() {
      if (vid.currentTime >= 3) {
        aud.play().catch(err => console.error("Error starting personalized audio:", err));
        vid.removeEventListener('timeupdate', handleTime);
      }
    }
    vid.addEventListener('timeupdate', handleTime);
    return () => vid.removeEventListener('timeupdate', handleTime);
  }, [connecting]);

  // 3.5) Mouse-based exit-intent
  useEffect(() => {
    if (connecting) return;

    function handleMouseMove(e) {
      if (hasShownOverlay) return;
      if (e.clientY < window.innerHeight * 0.1) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);

        if (messageToneRef.current) {
          messageToneRef.current.play().catch(err => console.log("iMessage tone blocked:", err));
        }
      }
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [connecting, hasShownOverlay]);

  // 3.6) Minimal clock logic: show at 10s, animate or do “fancy” if you like
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function handleClockTime() {
      if (vid.currentTime >= 10 && !clockAnimationTriggered) {
        setClockAnimationTriggered(true);
        setClockVisible(true);
      }
    }
    vid.addEventListener('timeupdate', handleClockTime);
    return () => vid.removeEventListener('timeupdate', handleClockTime);
  }, [clockAnimationTriggered]);

  // once clock is visible => update every second
  useEffect(() => {
    if (!clockVisible) return;
    function doClockUpdate() {
      const now = new Date();
      setClockTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }));
    }
    doClockUpdate();
    const clockInt = setInterval(doClockUpdate, 1000);
    return () => clearInterval(clockInt);
  }, [clockVisible]);

  // 3.7) Replay overlay
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    function handleEnded() {
      setShowReplay(true);
    }
    vid.addEventListener('ended', handleEnded);
    return () => vid.removeEventListener('ended', handleEnded);
  }, []);

  // 4) Conditionals
  if (connecting) {
    // show the “Connecting…” spinner overlay
    return (
      <div className={styles.connectingOverlay}>
        <div className={styles.connectingBox}>
          <div className={styles.connectingSpinner} />
          <p className={styles.connectingText}>Connecting you now...</p>
        </div>
      </div>
    );
  }

  // 5) Helpers
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      setShowExitOverlay(false);
    }
  }
  function handleReplay() {
    setShowReplay(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => console.log("Replay error:", err));
    }
    setClockAnimationTriggered(false);
    setClockVisible(false);
  }

  // 6) Return the main structure
  return (
    <div className={styles.zoomContainer}>
      {/* iPhone tone (hidden) */}
      <audio
        ref={messageToneRef}
        src="https://cdn.freesound.org/previews/613/613258_5674468-lq.mp3"
        style={{ display: 'none' }}
      />

      {/* EXIT INTENT OVERLAY */}
      {showExitOverlay && (
        <div className={styles.exitOverlay} onClick={handleOverlayClick}>
          <div className={styles.iphoneMessageBubble}>
            <button
              className={styles.exitCloseBtn}
              onClick={() => setShowExitOverlay(false)}
            >
              ×
            </button>
            <div className={styles.iphoneSender}>Selina</div>
            <div className={styles.iphoneMessageText}>
              {exitMessage && exitMessage.trim().length > 0
                ? exitMessage
                : defaultExitMessage}
            </div>
          </div>
        </div>
      )}

      {/* REPLAY OVERLAY */}
      {showReplay && (
        <div className={`${styles.replayOverlay} show`}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Webinar Ended</h2>
          <button
            style={{
              background: '#fff',
              color: '#0142ac',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              fontSize: '0.9rem'
            }}
            onClick={handleReplay}
          >
            Watch Instant Replay
          </button>
          <button
            style={{
              background: '#0142ac',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              fontSize: '0.9rem'
            }}
          >
            Invest $999 Now
          </button>
        </div>
      )}

      {/* TOP BAR */}
      <div className={styles.zoomTopBar}>
        <div className={styles.zoomTitle}>
          <div className={styles.zoomLiveDot}></div>
          PrognosticAI Advanced Training
        </div>
        <div className={styles.zoomLiveMinutes}>
          Live for {liveMinutes} minute{liveMinutes !== 1 ? 's' : ''}
        </div>
      </div>

      {/* 70/30 LAYOUT */}
      <div className={styles.twoColumnLayout}>
        <div className={styles.videoColumn}>
          <div className={styles.videoWrapper}>
            <video
              ref={videoRef}
              muted={!hasInteracted}
              playsInline
              controls={false}
              style={{ width: '100%', height: '100%' }}
            >
              <source
                src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
                type="video/mp4"
              />
            </video>
            {/* Hidden <audio> for personalized track */}
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* SOUND OVERLAY if user hasn't interacted */}
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

            {/* Clock widget if clockVisible */}
            {clockVisible && (
              <div
                className={styles.clockWidget + ' show'}
                style={{ top: '50px', left: '50px' }}
              >
                <div style={{ fontSize: '2.4rem', fontWeight: '600' }}>
                  {clockTime}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#86868b' }}>
                  {/* e.g. Date or instructions if you want */}
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat column */}
        <div className={styles.chatColumn}>
          <WebinarChatBox />
        </div>
      </div>
    </div>
  );
}

/** 
 * 7) The Chatbox as a separate component
 *    Also plain JS => no TS errors
 */
function WebinarChatBox() {
  const chatMessagesRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingIndicatorRef = useRef(null);
  const participantToggleRef = useRef(null);
  const specialOfferRef = useRef(null);
  const countdownRef = useRef(null);
  const investButtonRef = useRef(null);

  const socketRef = useRef(null);

  // Example sets
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
    {time:180,  text:"How does this integrate with existing business systems?",user:"Michael"},
    {time:300,  text:"Can you explain more about the AI capabilities?",user:"Sarah"},
    {time:450,  text:"Does this work with Zapier?",user:"David"},
    // ... etc.
  ];

  // Let’s track “are we near bottom” in a global var
  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;
    const specialOfferEl = specialOfferRef.current;
    const countdownEl = countdownRef.current;
    const investBtn = investButtonRef.current;

    if (!chatEl || !inputEl || !typingEl || !toggleEl || !specialOfferEl || !countdownEl || !investBtn) {
      console.error("Missing chat refs");
      return;
    }

    function isNearBottom(el) {
      const threshold = 50;
      return (el.scrollHeight - el.clientHeight - el.scrollTop) <= threshold;
    }
    function scrollToBottom(el) {
      el.scrollTop = el.scrollHeight;
    }
    function handleScroll() {
      isUserScrolling = !isNearBottom(chatEl);
    }
    chatEl.addEventListener('scroll', handleScroll);

    function addMessage(text, type, userName='') {
      const div = document.createElement('div');
      div.classList.add('message', type);

      if (userName) {
        div.textContent = `${userName}: ${text}`;
      } else {
        div.textContent = text;
      }

      // If user message from others => hide if toggle is off
      if (type === 'user' && userName !== 'You') {
        div.dataset.participant = 'true';
        div.dataset.autoGenerated = 'true';
        if (!toggleEl.checked) {
          div.style.display = 'none';
        }
      }
      chatEl.appendChild(div);

      // auto scroll if near bottom or it's “You”
      if (!isUserScrolling || userName === 'You') {
        scrollToBottom(chatEl);
      }
    }

    function handleToggleChange(e) {
      const participantMessages = chatEl.querySelectorAll('[data-participant="true"]');
      participantMessages.forEach(msg => {
        msg.style.display = e.target.checked ? 'block' : 'none';
      });
      if (e.target.checked && !isUserScrolling) {
        scrollToBottom(chatEl);
      }
    }
    toggleEl.addEventListener('change', handleToggleChange);

    // Connect WebSocket
    const newSocket = new WebSocket("wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com");
    socketRef.current = newSocket;

    newSocket.onopen = () => console.log("Connected to chat server");
    newSocket.onmessage = evt => {
      const data = JSON.parse(evt.data);
      if (data.type === 'message') {
        addMessage(data.text, data.messageType, data.user);
      }
    };
    newSocket.onerror = err => console.error("WebSocket error:", err);

    // Some random attendee messages
    function scheduleAttendeeMessages() {
      const num = Math.floor(Math.random() * 6) + 15;
      let delay = 500;
      for (let i = 0; i < num; i++) {
        const nm = names[Math.floor(Math.random() * names.length)];
        const msg = attendeeMessages[Math.floor(Math.random() * attendeeMessages.length)];
        setTimeout(() => {
          addMessage(msg, 'user', nm);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }
    setTimeout(() => {
      addMessage("Welcome to the PrognosticAI Advanced Training! 👋 Let us know where you're joining from!", "host", "Selina (Host)");
      scheduleAttendeeMessages();
    }, 2000);

    // Preloaded Q
    preloadedQuestions.forEach(q => {
      setTimeout(() => {
        addMessage(q.text, 'user', q.user);
        // show “Selina is typing...”
        setTimeout(() => {
          typingEl.textContent = "Selina is typing...";
          const randomDelay = Math.random() * 10000 + 10000;
          setTimeout(() => {
            typingEl.textContent = "";
          }, randomDelay);
        }, 1000);
      }, q.time * 1000);
    });

    // Investment notifications
    function showInvestmentNotification() {
      const nm = names[Math.floor(Math.random() * names.length)];
      const line = investmentMessages[Math.floor(Math.random() * investmentMessages.length)];
      const notif = document.createElement('div');
      notif.classList.add('notification');
      notif.innerHTML = `
        <div class="notificationIcon">🎉</div>
        <div><strong>${nm}</strong> ${line}</div>
      `;
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 5000);
    }
    const investInterval = setInterval(() => {
      showInvestmentNotification();
    }, Math.random() * 30000 + 30000);

    // Viewer count
    let currentViewers = 41;
    const viewerInterval = setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      currentViewers = Math.max(40, Math.min(50, currentViewers + change));
      const vCount = document.getElementById('viewerCount');
      if (vCount) {
        vCount.textContent = `${currentViewers} watching`;
      }
    }, 5000);

    // Show special offer after 60s
    setTimeout(() => {
      specialOfferEl.style.display = "block";
      addMessage("🚨 Special Offer Alert! For the next 10 minutes only, secure your spot in PrognosticAI for just $999. Don't miss out! 🚀","system");
      let t = 600;
      const countdownInt = setInterval(() => {
        t--;
        const min = Math.floor(t / 60);
        const sec = t % 60;
        countdownEl.textContent = `Special Offer Ends In: ${min}:${sec.toString().padStart(2, "0")}`;
        if (t <= 0) {
          clearInterval(countdownInt);
          specialOfferEl.style.display = "none";
          addMessage("⌛ The special offer has ended.", "system");
        }
      }, 1000);
    }, 60000);

    // invest button
    investBtn.addEventListener('click', () => {
      window.location.href = "https://yes.prognostic.ai";
    });

    // user sends a real message => simulate AI
    async function handleUserMessage(msg) {
      try {
        const randomDelay = Math.random() * 4000;
        await new Promise(res => setTimeout(res, randomDelay));
        typingEl.textContent = "Selina is typing...";

        const res = await fetch("https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg, type: "user" })
        });
        if (!res.ok) throw new Error("API call failed");

        const data = await res.json();
        typingEl.textContent = "";

        if (data.response) {
          addMessage(data.response, "host", "Selina (Host)");
        }
      } catch (err) {
        console.error("Error:", err);
        typingEl.textContent = "";
        addMessage("Apologies, I'm having trouble connecting. Please try again!", "host", "Selina (Host)");
      }
    }

    function handleKeypress(e) {
      if (e.key === "Enter" && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = "";
        addMessage(userMsg, "user", "You");
        handleUserMessage(userMsg);
      }
    }
    inputEl.addEventListener('keypress', handleKeypress);

    return () => {
      chatEl.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggleChange);
      inputEl.removeEventListener('keypress', handleKeypress);
      clearInterval(investInterval);
      clearInterval(viewerInterval);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.chatSection}>
      {/* Chat header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerTop}>
          <span className={styles.chatTitle}>Live Chat</span>
          <div className={styles.toggleContainer}>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                id="participantToggle"
                ref={participantToggleRef}
              />
              <span className={styles.toggleSlider} />
            </label>
            <span className={styles.toggleLabel}>Show Others</span>
          </div>
          <span className={styles.viewerCount}>
            <i>👥</i>
            <span id="viewerCount">41 watching</span>
          </span>
        </div>
      </div>

      {/* Special offer */}
      <div className={styles.specialOffer} id="specialOffer" ref={specialOfferRef}>
        <div className={styles.countdown} id="countdownTimer" ref={countdownRef}>
          Special Offer Ends In: 10:00
        </div>
        <button className={styles.investButton} id="investButton" ref={investButtonRef}>
          Invest $999 Now - Limited Time Offer
        </button>
      </div>

      {/* Messages */}
      <div className={styles.chatMessages} id="chatMessages" ref={chatMessagesRef} />

      {/* Input + typing indicator */}
      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Type your message here..."
          id="messageInput"
          ref={messageInputRef}
        />
        <div
          className={styles.typingIndicator}
          id="typingIndicator"
          ref={typingIndicatorRef}
        />
      </div>
    </div>
  );
}

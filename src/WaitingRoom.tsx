import React, { useEffect, useRef, useState } from 'react';
import styles from './WaitingRoom.module.css';

const WaitingRoom: React.FC = () => {
  // ====== COUNTDOWN STATES & LOGIC ======
  const [countdownText, setCountdownText] = useState<string>('calculating...');
  const [showLiveSoon, setShowLiveSoon] = useState<boolean>(true);
  const [todayDate, setTodayDate] = useState<string>('');

  /** Returns a Date object for the next quarter-hour (15/30/45/60) */
  function getNextQuarterHour(): Date {
    const now = new Date();
    return new Date(Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
  }

  /** Formats time left (ms) into "X minutes and Y seconds" or "Z seconds" */
  function formatTimeLeft(ms: number) {
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  }

  useEffect(() => {
    // Set today's date (month day)
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
    };
    const dateStr = now.toLocaleDateString('en-US', options);
    setTodayDate(dateStr);

    // Countdown logic
    const updateCountdown = () => {
      const current = new Date();
      const nextTime = getNextQuarterHour();
      const timeLeft = nextTime.getTime() - current.getTime();

      if (timeLeft <= 0) {
        setCountdownText('starting now...');
        setShowLiveSoon(false);
      } else {
        setCountdownText(formatTimeLeft(timeLeft));
      }
    };
    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, []);

  // ====== MOBILE-ONLY IMESSAGE BUBBLE ======
  const [showMobilePopup, setShowMobilePopup] = useState<boolean>(false);
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setShowMobilePopup(true);
    }
  }, []);
  const handleClosePopup = () => setShowMobilePopup(false);
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowMobilePopup(false);
    }
  };

  // ====== CHATBOX LOGIC (original working code) ======
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  function isNearBottom(element: HTMLDivElement): boolean {
    const threshold = 50;
    return (element.scrollHeight - element.clientHeight - element.scrollTop) <= threshold;
  }

  function scrollToBottom(element: HTMLDivElement) {
    element.scrollTop = element.scrollHeight;
  }

  useEffect(() => {
    const chatEl = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;

    if (!chatEl || !inputEl || !typingEl || !toggleEl) {
      console.error("WaitingRoom: Missing chat or input/toggle elements.");
      return;
    }

    let isUserScrolling = false;

    function handleScroll() {
      if (!chatEl) return;
      isUserScrolling = !isNearBottom(chatEl);
    }
    chatEl.addEventListener('scroll', handleScroll);

    // Some random user messages & names
    const names = [
      "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
      "Isabella", "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia",
      "Lucas", "Harper", "Henry", "Evelyn", "Alexander"
    ];

    let attendeeMessages = [
      "Cant wait for this to start!",
      "First time here... excited!!",
      "Anyone else waiting?",
      "question: Has anyone integrated this with Zapier for complex funnels?",
      "Setting up multi-step retargeting is my priority right now",
      "Im interested in the analytics side of things",
      "Hello from the waiting room!",
      "What about affiliate tracking with UTMs and multi-touch attribution?",
      "So ready for advanced marketing hacks",
      "Hope we get real actionable tips today"
      "So ready for advanced marketing hacks",
      "Just wanted to see if we can import data from our CRM?",
      "We focus heavily on remarketing campaigns, so I'm curious about that",
      "Looking forward to the Q&A on conversion funnels",
      "We use advanced tracking pixels, does your platform handle that?",
      "Hope we get some real actionable tips here",
      "Is the audio working for everyone?",
      "Anyone else from the marketing dept?",
      "We want to build a segmentation funnel, any best practices?",
      "Cant wait to compare notes after the webinar!",
      "Hello from the social media team!"
    ];

    const preloadedQuestions = [
      { time: 30, text: "hey everyone! excited for this", user: "Emma" },
      { time: 45, text: "same here! first time in one of these", user: "Michael" },
      { time: 60, text: "do we need to have our cameras on?", user: "Sarah" },
      { time: 90, text: "dont think so, pretty sure its just a webinar", user: "James" },
      { time: 120, text: "what time does this start exactly?", user: "David" },
      { time: 150, text: "should be in about 15 mins i think", user: "Rachel" },
      { time: 180, text: "perfect timing to grab a coffee then!", user: "Thomas" },
      { time: 210, text: "anyone else having audio issues? cant hear anything", user: "Lisa" },
      { time: 240, text: "i think it hasnt started yet thats why", user: "Alex" },
      { time: 270, text: "oh that makes sense lol", user: "Lisa" },
      { time: 300, text: "anyone here used their product before?", user: "Jennifer" },
      { time: 330, text: "not yet but heard good things", user: "Daniel" },
      { time: 360, text: "same, my colleague recommended it", user: "Sophie" },
      { time: 390, text: "will there be a replay available?", user: "Ryan" },
      { time: 420, text: "usually is for these types of webinars", user: "Maria" },
      { time: 450, text: "anyone taking notes? im ready with my notebook", user: "William" },
      { time: 480, text: "got my notepad open too!", user: "Emma" },
      { time: 510, text: "hope theres a q&a section at the end", user: "Noah" },
      { time: 540, text: "same, got lots of questions prepared", user: "Olivia" },
      { time: 570, text: "anyone else from marketing dept here?", user: "Liam" },
      { time: 600, text: "yep! social media manager here", user: "Ava" },
      { time: 630, text: "content marketing team checking in", user: "Ethan" },
      { time: 660, text: "excited to see the analytics features", user: "Sophia" },
      { time: 690, text: "hope they show the dashboard demo", user: "Mason" },
      { time: 720, text: "getting some coffee, brb!", user: "Isabella" },
      { time: 750, text: "good idea, might do the same", user: "Benjamin" },
      { time: 780, text: "anyone know how long the webinar is?", user: "Charlotte" },
      { time: 810, text: "think its an hour with q&a after", user: "Henry" },
      { time: 840, text: "perfect length imo", user: "Amelia" },
      { time: 870, text: "cant wait to see whats new", user: "Lucas" },
      { time: 900, text: "almost time to start!", user: "Harper" }
    ];

    function addMessage(
      text: string,
      type: 'user' | 'host' | 'system',
      user = '',
      isAutoGenerated = true
    ) {
      if (!chatEl || !toggleEl || !typingEl) return;

      const msgDiv = document.createElement('div');
      msgDiv.className = `${styles.message} ${type}`;

      // old css classes
      if (type === 'user') {
        msgDiv.classList.add('user');
      } else if (type === 'host') {
        msgDiv.classList.add('host');
      } else if (type === 'system') {
        msgDiv.classList.add('system');
      }

      msgDiv.textContent = user ? `${user}: ${text}` : text;

      // If real host message => show "Selina is typing..."
      if (type === 'host' && !isAutoGenerated) {
        typingEl.textContent = 'Selina is typing...';
        setTimeout(() => {
          typingEl.textContent = '';
        }, 2000);
      }

      // If user message from others => hide if toggle is off
      if (type === 'user' && user !== 'You') {
        msgDiv.setAttribute('data-participant', 'true');
        msgDiv.setAttribute('data-auto-generated', 'true');
        msgDiv.style.display = toggleEl.checked ? 'block' : 'none';
      }

      chatEl.appendChild(msgDiv);

      // autoscroll if near bottom
      if (!isUserScrolling || user === 'You') {
        scrollToBottom(chatEl);
      }
    }

    function handleToggleChange(e: Event) {
      if (!chatEl) return;
      const participantMessages = chatEl.querySelectorAll('[data-participant="true"]');
      const target = e.currentTarget as HTMLInputElement;
      participantMessages.forEach(msg => {
        (msg as HTMLElement).style.display = target.checked ? 'block' : 'none';
      });
      if (target.checked && !isUserScrolling) {
        scrollToBottom(chatEl);
      }
    }
    toggleEl.addEventListener('change', handleToggleChange);

    // Connect WebSocket
    const newSocket = new WebSocket('wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com');
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log('Connected to chat server');
      scrollToBottom(chatEl);
    };
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        // Add incoming message from others
        addMessage(data.text, data.messageType as 'user' | 'host' | 'system', data.user, true);
      }
    };
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // schedule some random lines
    function scheduleLocationMessages() {
      const numMessages = Math.min(attendeeMessages.length, Math.floor(Math.random() * 5) + 5);
      const available = [...attendeeMessages];
      let delay = 500;
      for (let i = 0; i < numMessages; i++) {
        const index = Math.floor(Math.random() * available.length);
        const message = available[index];
        available.splice(index, 1);
        const name = names[Math.floor(Math.random() * names.length)];

        setTimeout(() => {
          addMessage(message, 'user', name, true);
        }, delay);
        delay += Math.random() * 1000 + 500;
      }
    }

    // Preloaded messages
    preloadedQuestions.forEach(q => {
      setTimeout(() => {
        addMessage(q.text, 'user', q.user, true);
      }, q.time * 1000);
    });

    // AI/Host response for user messages
    async function handleHostResponse(userMsg: string, isAutomated = false) {
      if (isAutomated) return;
      if (!typingEl) return;

      try {
        const randomDelay = Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        typingEl.textContent = 'Selina is typing...';

        const resp = await fetch('https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMsg,
            type: 'user'
          })
        });
        if (!resp.ok) throw new Error('API call failed');
        const data = await resp.json();
        typingEl.textContent = '';

        if (data.response) {
          addMessage(data.response, 'host', 'Kyle', false);
        }
      } catch (err) {
        console.error('Error:', err);
        typingEl.textContent = '';
        addMessage("Apologies, having trouble connecting. Please try again!", 'host', 'Selina', false);
      }
    }

    // Random viewer count
    let currentViewers = 41;
    const viewerInterval = setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      currentViewers = Math.max(40, Math.min(50, currentViewers + change));
      const vcEl = document.getElementById('viewerCount');
      if (vcEl) {
        vcEl.textContent = `${currentViewers} waiting`;
      }
    }, 5000);

    // Initial message => schedule random lines
    setTimeout(() => {
      addMessage("we'll get started here in just one minute", 'host', 'Selina', true);
      scheduleLocationMessages();
      scrollToBottom(chatEl);
    }, 4000);

    // user pressing Enter => triggers AI
    function handleKeypress(e: KeyboardEvent) {
      if (!inputEl) return;
      if (e.key === 'Enter' && inputEl.value.trim()) {
        const userMsg = inputEl.value.trim();
        inputEl.value = '';
        addMessage(userMsg, 'user', 'You', false);
        handleHostResponse(userMsg, false);
      }
    }
    inputEl.addEventListener('keypress', handleKeypress);

    // cleanup
    return () => {
      chatEl.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggleChange);
      inputEl.removeEventListener('keypress', handleKeypress);
      clearInterval(viewerInterval);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* MOBILE-ONLY iMessage Bubble => "Selina" aligned left */}
      {showMobilePopup && (
        <div className={styles.exitOverlay} onClick={handleOverlayClick}>
          <div className={styles.iphoneMessageBubble}>
            <button className={styles.exitCloseBtn} onClick={handleClosePopup}>
              &times;
            </button>
            <div className={styles.iphoneSender} style={{ textAlign: 'left' }}>Selina</div>
            <div className={styles.iphoneMessageText} style={{ textAlign: 'left' }}>
              We recommend joining from a computer for the best experience.
              Please check your email for the link and open it on desktop!
            </div>
          </div>
        </div>
      )}

      {/* Zoom-like box */}
      <div className={styles.zoomContainer}>
        {/* TOP BAR */}
        <div className={styles.zoomTopBar}>
          {/* Left side: LIVE SOON (blinking) + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {showLiveSoon && (
              <span className={styles.liveSoonSubtle}>LIVE SOON</span>
            )}
            <span className={styles.zoomTitle}>PrognosticAI Advanced Training</span>
          </div>

          {/* Right side: "Live Webinar: {todayDate}" */}
          <div className={styles.awh2024Header}>
            Live Webinar: {todayDate}
          </div>
        </div>

        {/* Horizontal divider under header */}
        <hr className={styles.topDivider} />

        {/* TWO COLUMNS */}
        <div className={styles.twoColumnLayout}>
          {/* LEFT => Big spinner, minimal countdown, etc.  */}
          <div className={styles.leftColumn}>
            <div className={styles.countdownBox}>
              <div className={styles.countdownLabel}>Time Remaining</div>
              <div className={styles.countdownNumber}>{countdownText}</div>
            </div>

            {/* Spinner & text (no scroll) */}
            <div className={styles.spinnerArea}>
              <div className={styles.spinnerAndText}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>
                  We are preparing the webinar... grab a notepad & pen while you wait!
                </p>
              </div>
            </div>

            {/* Next steps or bullet info */}
            <hr className={styles.lightDivider} />

            <p className={styles.bulletsTitle}><strong>You will learn...</strong></p>
            <ul className={styles.bulletsList}>
              <li>How PrognosticAI personalizes your marketing funnels</li>
              <li>Tips for advanced retargeting strategies</li>
              <li>Free resources to scale your funnel</li>
            </ul>

            {/* Presenter Cards => left-aligned */}
            <div className={styles.presentersArea}>
              <div className={styles.presenterRow}>
                <img
                  src="https://i.ibb.co/rGNvSw9/78-Klwbhtn4ags-B0k-Lplo1701987382.png"
                  alt="Kyle Campbell"
                  className={styles.presenterImage}
                />
                <div className={styles.presenterInfo}>
                  <div className={styles.presenterName}>Kyle Campbell</div>
                  <div className={styles.presenterTitle}>Webinar Host</div>
                  <div className={styles.presenterDesc}>
                    Stop losing sales— in {countdownText}, Kyle will begin revealing the secret new AI that took him from rock bottom to $1M+ in 44 weeks.
                  </div>
                </div>
              </div>

              <div className={styles.presenterRow}>
                <img
                  src="https://i.ibb.co/NWZQXfV/1-Zi961cr56d-Nrw-Onim8j1701987437.png"
                  alt="Selina Harris"
                  className={styles.presenterImage}
                />
                <div className={styles.presenterInfo}>
                  <div className={styles.presenterName}>Selina Harris</div>
                  <div className={styles.presenterTitle}>Webinar Host</div>
                  <div className={styles.presenterDesc}>
                    Assisting Kyle today will be his team leader, Selina, PhD graduate student from Harvard.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT => Chat */}
          <div className={styles.rightColumn}>
            <div className={styles.chatSection}>
              <div className={styles.chatHeader}>
                <div className={styles.headerTop}>
                  <span className={styles.chatTitle}>Live Chat</span>
                  <div className={styles.toggleContainer}>
                    <label className={styles.toggleSwitch}>
                      <input
                        ref={participantToggleRef}
                        type="checkbox"
                        id="participantToggle"
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                    <span className={styles.toggleLabel}>Show Others</span>
                  </div>
                  <span className={styles.viewerCount}>
                    <i>👥</i>
                    <span id="viewerCount">41 waiting</span>
                  </span>
                </div>
              </div>
              <div className={styles.chatMessages} ref={chatMessagesRef} id="chatMessages"></div>
              <div className={styles.chatInput}>
                <input
                  type="text"
                  placeholder="Type your message here..."
                  ref={messageInputRef}
                  id="messageInput"
                />
                <div className={styles.typingIndicator} ref={typingIndicatorRef} id="typingIndicator"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional small row at bottom => "You will be automatically redirected... bigger mail icon" */}
        <div className={styles.redirectNoteRow}>
          <div className={styles.noticeIcon}>
            <span style={{ fontSize: '20px' }}>✉</span>
          </div>
          <p className={styles.redirectNoteText}>
            You will be automatically redirected. If youre on a mobile device, please check your email from a computer to ensure access.
          </p>
        </div>
      </div>

      {/* FOOTER outside the box */}
      <div className={styles.footerBranding}>© 2025 PrognosticAI</div>
    </>
  );
};

export default WaitingRoom;

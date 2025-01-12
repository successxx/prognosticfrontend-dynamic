import React, { useEffect, useRef, useState } from 'react';
import styles from './WaitingRoom.module.css';

/**
 * This WaitingRoom merges:
 *   - The original waiting-room functionality (countdown, spinner, chat w/ AI, etc.)
 *   - The "zoom-like" white-box design from the sign-up page
 *   - The “Set a Reminder” link for Google Calendar (with next quarter-hour as the start time)
 *   - Additional instructions: hosts section, next steps, auto-redirect text, etc.
 */
const WaitingRoom: React.FC = () => {
  // ========== COUNTDOWN STATES/LOGIC ==========
  const [countdownText, setCountdownText] = useState<string>('calculating...');
  const [showBadge, setShowBadge] = useState<boolean>(true);

  // For the Google Calendar reminder link
  const [reminderLink, setReminderLink] = useState<string>('');

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

  // Generate a Google Calendar link with the next quarter hour as start time
  function generateCalendarLink() {
    const start = getNextQuarterHour();
    // We'll assume a 1-hour event for demonstration
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    // Format as YYYYMMDDTHHMMSS in UTC. For real usage, local time or etc. might be needed
    const toCalString = (date: Date) => {
      const yyyy = date.getUTCFullYear();
      const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(date.getUTCDate()).padStart(2, '0');
      const hh = String(date.getUTCHours()).padStart(2, '0');
      const min = String(date.getUTCMinutes()).padStart(2, '0');
      const ss = '00';
      return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`;
    };
    const startStr = toCalString(start);
    const endStr = toCalString(end);

    // "Your Webinar Link Is https://training.prognositc.ai"
    // For brevity, we'll do a simple Google Calendar link
    const base = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Your PrognosticAI Webinar',
      details: 'Your Webinar Link Is https://training.prognositc.ai',
      dates: `${startStr}/${endStr}`
    });
    return `${base}?${params.toString()}`;
  }

  useEffect(() => {
    // On mount, create the reminder link
    setReminderLink(generateCalendarLink());

    // Replicating old script logic for countdown
    const updateCountdown = () => {
      const now = new Date();
      const nextTime = getNextQuarterHour();
      const timeLeft = nextTime.getTime() - now.getTime();
      if (timeLeft <= 0) {
        setCountdownText('starting now...');
        setShowBadge(false);
      } else {
        setCountdownText(formatTimeLeft(timeLeft));
      }
    };

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);
    return () => clearInterval(timerId);
  }, []);

  // ========== CHATBOX LOGIC ==========
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  /** Helper to auto-scroll if near bottom. */
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
      console.error("WaitingRoom: Missing chat or input or toggle elements.");
      return;
    }

    let isUserScrolling = false;

    function handleScroll() {
      if (!chatEl) return;
      isUserScrolling = !isNearBottom(chatEl);
    }
    chatEl.addEventListener('scroll', handleScroll);

    /********** PRE-SET MESSAGES **********/
    const names = [
      "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
      "Isabella", "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia",
      "Lucas", "Harper", "Henry", "Evelyn", "Alexander"
    ];

    // Combined from old + new instructions, random funnels/marketing lines, no apostrophes
    let combinedMessages = [
      "hey guys any funnel examples someone can share i wana see real results",
      "lol i keep hearing about retargeting but do i need an email list first",
      "does anyone use text messaging for follow ups i read it works well",
      "hi i just want 1 sale on my new course any quick tips plz",
      "omg i forgot to bring coffee brb",
      "my ads are not converting well maybe my audience is off",
      "im brand new is this funnel advanced or can newbies do it too",
      "someone asked about b2b earlier i think the key is a good linkedin presence imo",
      "did i read the event is an hour plus qna afterwards yeah",
      "i tried a webinar once but only 3 ppl showed up haha it was tough",
      "has anyone integrated with google analytics to track detailed funnel steps",
      "im testing a new upsell but not sure if i should do 50 discount or 20 discount",
      "my buddy uses retargeting with fb messenger bots says it performs big",
      "any tips for super low ad budget like 50 total haha",
      "interested in ai tools for marketing does that require code knowledge",
      "someone tried chatgpt for writing copy i keep hearing about it",
      "i guess ill focus on capturing leads then email them with value content",
      "just typed in an attempt to see if the chat is working hi all",
      "lol i am so curious about advanced funnel strategies but i still havent done the basics",
      "anybody seeing success with tiktok ads or is it wasted budget",
      "someone earlier asked about text message funnels i wonder if that is easy to set up",
      "hey noah i saw your question about text marketing twilio is an option i guess",
      "im focusing more on leads than sales right now is that normal haha",
      "my friend used a big discount code to get first 10 sales might do the same",
      "someone want to share how they handle email unsubscribes i keep losing folks haha",
      "i saw somewhere that b2b has longer funnel but better ltv is that right",
      "my retargeting cpc is high but i still get decent conversions",
      "dang i typed a question but it didnt show maybe i needed to refresh",
      "did yall see the new ai features in analytics 4 kinda neat right",
      "cant wait for this to start",
      "first time here excited",
      "anyone else waiting",
      "advanced question has anyone integrated with zapier for funnels",
      "we want multi step retargeting right now",
      "looking forward to q and a on conversion funnels",
      "anybody from the marketing dept here hi guys"
    ];

    // We schedule a certain number randomly
    function scheduleLocationMessages() {
      const numMessages = Math.min(combinedMessages.length, Math.floor(Math.random() * 6) + 18);
      const available = [...combinedMessages];
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

    // Some preloaded messages on timed intervals
    const preloadedQuestions = [
      { time: 30, text: "hey everyone excited for this", user: "Emma" },
      { time: 45, text: "same here first time in one of these", user: "Michael" },
      { time: 60, text: "do we need to have cameras on", user: "Sarah" },
      { time: 90, text: "dont think so pretty sure its just a webinar", user: "James" },
      { time: 120, text: "what time does this start exactly", user: "David" },
      { time: 150, text: "should be in about 15 mins i think", user: "Rachel" },
      { time: 180, text: "perfect time to grab a coffee brb", user: "Thomas" },
      { time: 210, text: "anyone else having audio issues i cant hear anything", user: "Lisa" },
      { time: 240, text: "i think it hasnt started yet so no sound", user: "Alex" },
      { time: 300, text: "anyone here used their product before", user: "Jennifer" },
      { time: 330, text: "not yet but heard good things", user: "Daniel" },
      { time: 390, text: "will there be a replay available", user: "Ryan" },
      { time: 420, text: "usually is for these types of events", user: "Maria" },
      { time: 480, text: "hope we get a q and a later", user: "Noah" },
      { time: 510, text: "i have some advanced funnel questions", user: "Olivia" },
      { time: 540, text: "anyone from the marketing dept", user: "Liam" },
      { time: 600, text: "yep social media manager here", user: "Ava" },
      { time: 660, text: "excited to see the analytics features", user: "Sophia" },
      { time: 720, text: "getting some coffee, brb", user: "Isabella" },
      { time: 840, text: "almost time to start", user: "Harper" }
    ];
    // We'll schedule them
    preloadedQuestions.forEach(q => {
      setTimeout(() => {
        addMessage(q.text, 'user', q.user, true);
      }, q.time * 1000);
    });

    // The function that physically adds a message
    function addMessage(
      text: string,
      type: 'user' | 'host' | 'system',
      user = '',
      isAutoGenerated = true
    ) {
      if (!chatEl) return;
      if (!toggleEl) return;
      if (!typingEl) return;

      const messageDiv = document.createElement('div');
      messageDiv.className = `${styles.message} ${type}`;

      // also add raw classes for user/host/system if needed
      if (type === 'user') {
        messageDiv.classList.add('user');
      } else if (type === 'host') {
        messageDiv.classList.add('host');
      } else if (type === 'system') {
        messageDiv.classList.add('system');
      }

      messageDiv.textContent = user ? `${user}: ${text}` : text;

      // show "Selina is typing" for real host messages
      if (type === 'host' && !isAutoGenerated) {
        typingEl.textContent = 'Selina is typing...';
        setTimeout(() => {
          if (typingEl) typingEl.textContent = '';
        }, 2000);
      }

      // Tag user messages from others for toggling
      if (type === 'user' && user !== 'You') {
        messageDiv.setAttribute('data-participant', 'true');
        messageDiv.setAttribute('data-auto-generated', 'true');
        messageDiv.style.display = toggleEl.checked ? 'block' : 'none';
      }

      chatEl.appendChild(messageDiv);

      if (!isUserScrolling || user === 'You') {
        scrollToBottom(chatEl);
      }
    }

    // Toggle show/hide
    function handleToggleChange() {
      if (!chatEl) return;
      const participantMessages = chatEl.querySelectorAll('[data-participant="true"]');
      participantMessages.forEach(msg => {
        (msg as HTMLElement).style.display = toggleEl.checked ? 'block' : 'none';
      });
      if (toggleEl.checked && !isUserScrolling) {
        scrollToBottom(chatEl);
      }
    }
    toggleEl.addEventListener('change', handleToggleChange);

    // Connect WebSocket for real-time
    const newSocket = new WebSocket('wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com');
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log('Connected to chat server');
      if (chatEl) {
        scrollToBottom(chatEl);
      }
    };
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        addMessage(data.text, data.messageType as 'user' | 'host' | 'system', data.user, true);
      }
    };
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // AI/Host response logic for real user messages
    async function handleHostResponse(userMessage: string, isAutomated = false) {
      if (isAutomated) return;
      if (!typingEl) return;
      try {
        const randomDelay = Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, randomDelay));

        typingEl.textContent = 'Selina is typing...';

        const response = await fetch('https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            type: 'user'
          })
        });

        if (!response.ok) {
          throw new Error('API call failed');
        }

        const data = await response.json();
        typingEl.textContent = '';

        if (data.response) {
          addMessage(data.response, 'host', 'Kyle', false);
        }
      } catch (error) {
        console.error('Error:', error);
        typingEl.textContent = '';
        addMessage("Apologies, im having trouble connecting please try again!", 'host', 'Selina', false);
      }
    }

    // random viewer count for fun
    let currentViewers = 41;
    const viewerInterval = setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      currentViewers = Math.max(40, Math.min(50, currentViewers + change));
      const viewerCountEl = document.getElementById('viewerCount');
      if (viewerCountEl) {
        viewerCountEl.textContent = `${currentViewers} waiting`;
      }
    }, 5000);

    // Kick off some random user lines
    setTimeout(() => {
      addMessage("well get started in about a minute", 'host', 'Selina', true);
      scheduleLocationMessages();
      scrollToBottom(chatEl);
    }, 4000);

    // On user pressing Enter
    function handleKeypress(e: KeyboardEvent) {
      if (!inputEl) return;
      if (e.key === 'Enter' && inputEl.value.trim()) {
        const userMessage = inputEl.value.trim();
        inputEl.value = '';

        addMessage(userMessage, 'user', 'You', false);
        handleHostResponse(userMessage, false);
      }
    }
    inputEl.addEventListener('keypress', handleKeypress);

    // Cleanup
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

  // ========== RENDER ==========
  return (
    <div className={styles.pageBackground}>
      {/* The zoom-like container */}
      <div className={styles.zoomContainer}>
        {/* Top Bar */}
        <div className={styles.zoomTopBar}>
          {/* Left side: dot + title */}
          <div className={styles.zoomLeftHeader}>
            <div className={styles.zoomLiveDot}></div>
            <div className={styles.zoomTitle}>PrognosticAI Advanced Training</div>
          </div>
          {/* Right side: "Live webinar [date]" or "Your webinar begins in..." 
              We will do: "Your webinar begins in X" here for now */}
          <div className={styles.zoomRightHeader}>
            Live webinar today 
          </div>
        </div>

        {/* MAIN 2-COLUMN LAYOUT */}
        <div className={styles.twoColumnWrapper}>

          {/* LEFT: spinner, countdown, bullets */}
          <div className={styles.leftColumn}>

            {/* Countdown / big text */}
            <div>
              <div className={styles.countdownText}>
                Your webinar begins in{' '}
                <span className={styles.countdownTime}>{countdownText}</span>
              </div>
              <div className={styles.motivationalTagline}>
                Get ready to transform your marketing strategy!
              </div>
            </div>

            {/* Spinner + "We are preparing..." */}
            <div className={styles.webinarLoading}>
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>
                  We are preparing the webinar... grab a notepad and pen while you wait!
                </p>
              </div>
            </div>

            <hr className={styles.lightDivider} />

            {/* "You will learn..." */}
            <p className={styles.bulletsTitle}><strong>You will learn...</strong></p>
            <ul className={styles.bulletsList}>
              <li>
                <div className={styles.benefit-icon}></div>
                <span>How PrognosticAI personalizes your marketing funnels</span>
              </li>
              <li>
                <div className={styles.benefit-icon}></div>
                <span>Tips for advanced retargeting strategies</span>
              </li>
              <li>
                <div className={styles.benefit-icon}></div>
                <span>Free resources to scale your funnel</span>
              </li>
            </ul>

            {/* "Set a reminder" button */}
            {reminderLink && (
              <a
                href={reminderLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.reminderLink}
              >
                Set a Reminder (Add to Google Calendar)
              </a>
            )}
          </div>

          {/* RIGHT: chat */}
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
              <div
                className={styles.chatMessages}
                id="chatMessages"
                ref={chatMessagesRef}
              ></div>
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
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* SINGLE COLUMN UNDERNEATH */}
        <div className={styles.nextStepsWrapper}>
          {/* Here's what you should do now box */}
          <div className={styles.nextStepsBox}>
            <strong>Heres what you should do now:</strong>
            <br/>
            1. Be sure to take notes and ask questions in the chat  
            <br/>
            2. Keep an open mind for how these strategies can scale your funnel  
            <br/>
            3. Engage with fellow entrepreneurs here in the chat  
          </div>

          {/* Two Host columns */}
          <div className={styles.hostsContainer}>
            {/* Host 1: Kyle Campbell */}
            <div className={styles.hostCol}>
              <img
                src="https://via.placeholder.com/60?text=Kyle"
                alt="Kyle"
                className={styles.hostImg}
              />
              <div className={styles.hostInfo}>
                <div className={styles.hostName}>Kyle Campbell</div>
                <div className={styles.hostTitle}>Co-Founder & Marketing Expert</div>
                <div className={styles.hostBio}>
                  Kyle helps scale businesses with AI-driven funnels. He brings experience from top tech brands and loves seeing new entrepreneurs win big.
                </div>
              </div>
            </div>

            {/* Host 2: Selina Harris */}
            <div className={styles.hostCol}>
              <img
                src="https://via.placeholder.com/60?text=Selina"
                alt="Selina"
                className={styles.hostImg}
              />
              <div className={styles.hostInfo}>
                <div className={styles.hostName}>Selina Harris</div>
                <div className={styles.hostTitle}>Head of AI Development</div>
                <div className={styles.hostBio}>
                  Selina leads PrognosticAI's advanced R&D. She merges data science with marketing psychology to help you supercharge your conversions.
                </div>
              </div>
            </div>
          </div>

          {/* Auto-redirect message */}
          <div className={styles.redirectRow}>
            <div className={styles.mailIcon}>✉️</div>
            <div className={styles.redirectMsg}>
              You will be automatically redirected. If you are on a mobile device, please check your email from a computer to ensure access.
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER - outside the box */}
      <div className={styles.footerContainer}>© 2025 PrognosticAI</div>
    </div>
  );
};

export default WaitingRoom;

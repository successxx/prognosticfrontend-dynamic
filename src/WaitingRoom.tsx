import React, { useEffect, useRef, useState } from 'react';
import styles from './WaitingRoom.module.css';

/**
 * WaitingRoom
 * -----------
 * - White "zoom-like" container with a top bar + dividing line
 * - 2 columns (left: countdown/spinner/bullets, right: chat)
 * - Under that, single column box: "HERE'S WHAT YOU SHOULD DO NOW"
 * - Then 2 columns for Kyle & Selina
 * - AI chat logic restored from old code
 * - Random short chat messages with no apostrophes, some typos, varying levels
 * - No "LIVE SOON" at bottom
 * - Footer outside the main container
 */

const WaitingRoom: React.FC = () => {
  // ========== COUNTDOWN LOGIC ==========
  const [countdownText, setCountdownText] = useState<string>('calculating...');
  const [showBadge, setShowBadge] = useState<boolean>(true);

  function getNextQuarterHour(): Date {
    const now = new Date();
    return new Date(Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
  }

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

  // ========== CHAT LOGIC ==========
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

  // Example short + varied chat lines, no apostrophes, random typos, etc.
  const customChatMessages = [
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
  ];

  // We also combine them with some of the old messages from your previous code:
  const combinedMessages = [
    ...customChatMessages,
    "cant wait for this to start",
    "first time here excited",
    "anyone else waiting",
    "advanced question has anyone integrated with zapier for funnels",
    "we want multi step retargeting right now",
    "looking forward to q and a on conversion funnels",
    "anybody from the marketing dept here hi guys",
  ];

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

    // ========== WEBSOCKET (AI Chat) ==========
    const newSocket = new WebSocket('wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com');
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log('Connected to chat server');
      scrollToBottom(chatEl);
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

    // Show/hide participant messages
    function handleToggleChange(e: Event) {
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

    // Generic function for adding messages
    function addMessage(
      text: string,
      type: 'user' | 'host' | 'system',
      user = '',
      isAutoGenerated = true
    ) {
      if (!chatEl) return;
      if (!toggleEl) return;
      const msgDiv = document.createElement('div');
      msgDiv.className = `${styles.message} ${type}`;
      if (type === 'user') {
        msgDiv.classList.add('user');
      } else if (type === 'host') {
        msgDiv.classList.add('host');
      } else if (type === 'system') {
        msgDiv.classList.add('system');
      }

      const userLabel = user ? `${user}: ` : '';
      msgDiv.textContent = userLabel + text;

      // Show typing for host
      if (type === 'host' && !isAutoGenerated && typingEl) {
        typingEl.textContent = 'Selina is typing...';
        setTimeout(() => {
          typingEl.textContent = '';
        }, 2000);
      }

      // If it's a user from "others," hide if toggle is off
      if (type === 'user' && user !== 'You') {
        msgDiv.setAttribute('data-participant', 'true');
        msgDiv.style.display = toggleEl.checked ? 'block' : 'none';
      }

      chatEl.appendChild(msgDiv);
      if (!isUserScrolling || user === 'You') {
        scrollToBottom(chatEl);
      }
    }

    // AI/host response for user-sent messages
    async function handleHostResponse(userMessage: string, isAutomated = false) {
      if (isAutomated) return;
      if (!typingEl) return;
      try {
        const randomDelay = Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        typingEl.textContent = 'Selina is typing...';

        const response = await fetch('https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage, type: 'user' })
        });

        if (!response.ok) throw new Error('API call failed');
        const data = await response.json();
        typingEl.textContent = '';

        if (data.response) {
          addMessage(data.response, 'host', 'Kyle', false);
        }
      } catch (err) {
        console.error('Error:', err);
        typingEl.textContent = '';
        addMessage("sorry im having trouble connecting to server", 'host', 'Selina', false);
      }
    }

    // Press Enter => user message
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

    // Auto-schedule random messages over ~10-15 min
    let totalDelay = 5000; // start after 5s
    combinedMessages.forEach((msg) => {
      const randomInterval = 3000 + Math.random() * 7000; // 3-10s
      totalDelay += randomInterval;
      if (totalDelay < 900000) { // up to 15 min
        setTimeout(() => {
          const randomName = pickRandomName();
          addMessage(msg, 'user', randomName, true);
        }, totalDelay);
      }
    });

    function pickRandomName() {
      const nameList = [
        "Emma","Liam","Olivia","Noah","Ava","Ethan","Sophia","Mason",
        "Isabella","William","Mia","James","Charlotte","Benjamin","Amelia",
        "Lucas","Harper","Henry","Evelyn","Alexander","Daniel","Erin","Flora",
        "Gina","Harry","Ian","Jake","Kim","Logan","Mila","Nate","Oscar","Pia",
        "Quinn","Rita","Sam","Tina","Uma","Vince","Wade","Xena","Yuri","Zack"
      ];
      return nameList[Math.floor(Math.random() * nameList.length)];
    }

    // Cleanup
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

  // Mobile-only bubble
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const popupOverlay = document.getElementById('popupOverlay');
    if (popupOverlay && isMobile) {
      popupOverlay.style.display = 'flex';
    }
  }, []);

  return (
    <>
      {/* Mobile iMessage bubble overlay */}
      <div className={styles.exitOverlay} id="popupOverlay">
        <div className={styles.iphoneMessageBubble}>
          <button className={styles.exitCloseBtn} id="closeBtn">&times;</button>
          <div className={styles.iphoneSender}>System</div>
          <div className={styles.iphoneMessageText}>
            We recommend using a desktop for best results
            Check your email for the link and open it on computer
          </div>
        </div>
      </div>

      <div className={styles.pageWrapper}>
        {/* The main "zoom-like" container */}
        <div className={styles.zoomContainer}>
          {/* Top bar */}
          <div className={styles.zoomTopBar}>
            <div className={styles.zoomTitle}>PrognosticAI Advanced Training</div>
            <div className={styles.awh2024Header} id="awh2024-header">
              Live webinar today
            </div>
          </div>

          {/* 2 columns: left = countdown/spinner, right = chat */}
          <div className={styles.topTwoColumns}>
            <div className={styles.leftColumn}>
              <div className={styles.awhp2024HeaderWrapper}>
                Your webinar begins in{" "}
                <span className={styles.awhp2024TimerText}>{countdownText}</span>
                <div className={styles.motivationalTagline}>
                  Get ready to transform your marketing strategy
                </div>
              </div>

              <div className={styles.webinarLoading}>
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p className={styles.loadingText}>
                    We are preparing the webinar... grab a notepad and pen while you wait
                  </p>
                </div>
              </div>

              <hr className={styles.lightDivider} />

              <p className={styles.bulletsTitle}>
                <strong>You will learn...</strong>
              </p>
              <ul className={styles.bulletsList}>
                <li>How PrognosticAI personalizes your marketing funnels</li>
                <li>Tips for advanced retargeting strategies</li>
                <li>Free resources to scale your funnel</li>
              </ul>
            </div>

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
                <div className={styles.chatMessages} id="chatMessages" ref={chatMessagesRef}></div>
                <div className={styles.chatInput}>
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    id="messageInput"
                    ref={messageInputRef}
                  />
                  <div className={styles.typingIndicator} id="typingIndicator" ref={typingIndicatorRef}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Single column: "HERE'S WHAT YOU SHOULD DO NOW" */}
          <div className={styles.nextStepsWrapper}>
            <div className={styles.nextStepsBox}>
              <h3 className={styles.nextStepsHeading}>HERES WHAT YOU SHOULD DO NOW</h3>
              <ol className={styles.nextStepsList}>
                <li>
                  <strong>Block out 1.5 hours</strong>. Add it to your calendar, note the time, or click the reminder link.
                </li>
                <li>
                  <strong>Show up early</strong>. No recordings, so arrive at least 5 minutes before start. We fill up fast.
                </li>
                <li>
                  <strong>Use a desktop</strong>. Viewing on phone can be glitchy and is not recommended.
                </li>
                <li>
                  <strong>Get the 3 AI tools</strong>. We will give away 3 secret AI tools to all attendees who show up live.
                </li>
              </ol>

              {/* Date/time row */}
              <div className={styles.dateTimeRow}>
                <div className={styles.webinarDate}>
                  Wednesday, April 2
                </div>
                <div className={styles.webinarTimeZone}>
                  10:00 PM (Mountain Time US & Canada) GMT -7
                </div>
                {/* Example Google Calendar link */}
                <a
                  className={styles.reminderLink}
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=PrognosticAI+Webinar&dates=20250112T230000Z/20250112T000000Z&details=Dont+forget+to+join"
                  target="_blank"
                  rel="noreferrer"
                >
                  Set Reminder
                </a>
              </div>

              {/* The smaller redirect note with bigger mail icon */}
              <div className={styles.redirectNoteRow}>
                <div className={styles.mailIconContainer}>
                  ✉
                </div>
                <p className={styles.redirectNoteText}>
                  You will be automatically redirected. If youre on a mobile device, please check your email
                  from a computer to ensure access.
                </p>
              </div>

              {/* Hosts side by side */}
              <div className={styles.hostsRow}>
                <div className={styles.hostCard}>
                  <img
                    src="https://i.ibb.co/rGNvSw9/78-Klwbhtn4ags-B0k-Lplo1701987382.png"
                    alt="Kyle Campbell"
                    className={styles.hostImage}
                  />
                  <div className={styles.hostInfo}>
                    <div className={styles.hostName}>Kyle Campbell</div>
                    <div className={styles.hostTitle}>Webinar Host</div>
                  </div>
                </div>
                <div className={styles.hostCard}>
                  <img
                    src="https://i.ibb.co/NWZQXfV/1-Zi961cr56d-Nrw-Onim8j1701987437.png"
                    alt="Selina Harris"
                    className={styles.hostImage}
                  />
                  <div className={styles.hostInfo}>
                    <div className={styles.hostName}>Selina Harris</div>
                    <div className={styles.hostTitle}>Webinar Host</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer outside the container */}
        <div className={styles.customFooter}>
          © 2025 PrognosticAI
        </div>
      </div>

      {/* Inline script for the mobile bubble close */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              const popupOverlay = document.getElementById('popupOverlay');
              const closeBtn = document.getElementById('closeBtn');
              if(!popupOverlay || !closeBtn) return;
              closeBtn.addEventListener('click', () => {
                popupOverlay.style.display = 'none';
              });
              popupOverlay.addEventListener('click', (e) => {
                if(e.target === popupOverlay) {
                  popupOverlay.style.display = 'none';
                }
              });
            })();
          `
        }}
      />
    </>
  );
};

export default WaitingRoom;

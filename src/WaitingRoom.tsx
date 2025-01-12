import React, { useEffect, useRef, useState } from 'react';
import styles from './WaitingRoom.module.css';

/**
 * WaitingRoom
 * -----------
 * - Single “zoom-like” white box centered on page
 * - Top bar: "LIVE SOON" (blinking), Title, and "Live webinar [date]"
 * - Two columns:
 *   (Left 60%: The countdown, spinner, “You will learn” bullets)
 *   (Right 40%: Chat box)
 * - Single full-width section below columns: “HERE IS WHAT YOU SHOULD DO NOW” + Next steps
 * - Under that: two columns for the hosts Kyle & Selina
 * - No "live soon" text at bottom. Chat has fixed max-height.
 * - Shorter/frequent “fake live chat” messages, randomizing capital letters & removing apostrophes
 */

const WaitingRoom: React.FC = () => {
  // ====== COUNTDOWN STATE & LOGIC ======
  const [countdownText, setCountdownText] = useState<string>('calculating...');
  const [showBadge, setShowBadge] = useState<boolean>(true);

  // Display dynamic date/time
  const [webinarDate, setWebinarDate] = useState<string>('');
  const [webinarTime, setWebinarTime] = useState<string>('');

  function getNextQuarterHour(): Date {
    const now = new Date();
    // Rounds up to the next 15-minute block
    return new Date(Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
  }

  function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextTime = getNextQuarterHour();
      const timeLeft = nextTime.getTime() - now.getTime();

      // Also update date/time for display
      setWebinarDate(formatDate(now));
      setWebinarTime(formatTime(nextTime));

      if (timeLeft <= 0) {
        setCountdownText('starting now...');
        setShowBadge(false);
      } else {
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        if (minutes > 0) {
          setCountdownText(`${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`);
        } else {
          setCountdownText(`${seconds} second${seconds !== 1 ? 's' : ''}`);
        }
      }
    };

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);
    return () => clearInterval(timerId);
  }, []);

  // ====== CHATBOX LOGIC ======
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

  // Shorter, more casual chat messages (marketing/funnels/entrepreneurship)
  // No apostrophes, random capital letters, some typos, occasionally referencing each other
  // Example variations, showing random grammar/spelling, some short Q&A style:
  const scheduledMessages = [
    "anyone used fB retargeting for ebooks??",
    "im new to funnels but excited to learn!",
    "just scaled my store to 50 orders day. so pumped",
    "Lol my cpc is up. any tip on optimizing??",
    "heyy does building an email list still matter these days or do we just do ads",
    "TryING to figure out google analytics still.. help pls??",
    "Kai: hey brandon, i found a new funnel builder better than clickF, super cheap",
    "Saw a big boost when i used influencer promos on tikTok. any1 else?",
    "my new funnel is converting at 4 PERCENT so stoked",
    "eva: oh nice c4 percent is big. mind sharing niche?",
    "ya im in coaching niche. retargeting boosted my roi x3!",
    "someone recommended implementing a countdown timer. do you guys do that??",
    "Brandon: i do, it works well for me",
    "Kara: best way to handle unsubscribes without hurting domain??",
    "just discovered PrognosticAI, it personalizes funnels.. so cool",
    "Umar: trying to get local leads for HVAC. is direct mail still a thing??",
    "eva: i do direct mail for real estate still works sometimes",
    "any new hack for building LLA audiences on FB??",
    "thinking about testing pinned posts on lInkedIn for b2b leads",
    "my funnel cart abandons are high. do i add more trust badges??",
    "Kai: yes that helps, plus re-engage them by email or SMS",
    "karas question re unsubscribes: i use a self-hosted solution",
    "LOL i spelled unsubscribes wrong earlier. oh well. this chat is moving fast",
    "Kai: using ai for copywriting soared my CTR up",
    "Sasha: i started a funnel for digital planners.. got 10 sales so far!",
    "morning guys. i see 40 ppl here. hi all!",
    "so is anyone using PrognosticAI or just me??"
  ];

  // ----- MOUNT / UNMOUNT -----
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

    // ====== WEBSOCKET (AI Chat) ======
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

    // Toggle "Show Others" => Hide/Show participant messages
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

    // Reusable function to add new messages to chat
    function addMessage(
      text: string,
      type: 'user' | 'host' | 'system',
      user = '',
      isAutoGenerated = true
    ) {
      if (!chatEl || !toggleEl || !typingEl) return;

      const messageDiv = document.createElement('div');
      messageDiv.className = `${styles.message} ${type}`;

      const userLabel = user ? `${user}: ` : '';
      messageDiv.textContent = userLabel + text;

      if (type === 'host' && !isAutoGenerated) {
        typingEl.textContent = 'Selina is typing...';
        setTimeout(() => {
          typingEl.textContent = '';
        }, 2000);
      }

      // Tag participant messages (so toggling "Show Others" can hide them)
      if (type === 'user' && user !== 'You') {
        messageDiv.setAttribute('data-participant', 'true');
        messageDiv.setAttribute('data-auto-generated', 'true');
        // Hide them if Show Others is unchecked
        messageDiv.style.display = toggleEl.checked ? 'block' : 'none';
      }

      chatEl.appendChild(messageDiv);

      // auto-scroll if near bottom or if the user wrote the message
      if (!isUserScrolling || user === 'You') {
        scrollToBottom(chatEl);
      }
    }

    // Insert “YOU ARE REGISTERED!” system bubble right away:
    const registeredBubble = document.createElement('div');
    registeredBubble.className = styles.registeredNotice;
    registeredBubble.textContent = "YOU ARE REGISTERED";
    chatEl.appendChild(registeredBubble);

    // Host response to real user messages
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
      } catch (error) {
        console.error('Error:', error);
        typingEl.textContent = '';
        addMessage("Sorry having trouble connecting. try again!", 'host', 'Selina', false);
      }
    }

    // Listen for user pressing Enter => new user message
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

    // ====== RANDOM AUTO MESSAGES ======
    let totalDelay = 3000; // start after 3s
    scheduledMessages.forEach((msg) => {
      const randomInterval = 5000 + Math.random() * 10000; // 5-15 sec
      totalDelay += randomInterval;
      // If totalDelay < 900000 ms (15 min), schedule it
      if (totalDelay < 900000) {
        setTimeout(() => {
          addMessage(msg, 'user', randomName(), true);
        }, totalDelay);
      }
    });

    function randomName() {
      const possibleNames = [
        "Alice", "Brandon", "Carol", "Derek", "Eva", "Felix", "Georgia", "Harold",
        "Ivy", "Jamal", "Kara", "Leo", "Mona", "Nate", "Olga", "Priya", "Quinn",
        "Ronan", "Sasha", "Tina", "Umar", "Vivian", "Wes", "Xander", "Yvonne", "Zack",
        "Kai", "Zara"
      ];
      return possibleNames[Math.floor(Math.random() * possibleNames.length)];
    }

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

  // ====== MOBILE-ONLY POPUP LOGIC ======
  useEffect(() => {
    // Quick check for mobile device
    const isMobile = window.innerWidth <= 768;
    const popupOverlay = document.getElementById('popupOverlay');

    if (popupOverlay && isMobile) {
      // Show the overlay
      popupOverlay.style.display = 'flex';
    }
  }, []);

  // ====== RENDER ======
  return (
    <>
      {/* The iMessage-like overlay for mobile users */}
      <div className={styles.exitOverlay} id="popupOverlay">
        <div className={styles.iphoneMessageBubble}>
          <button className={styles.exitCloseBtn} id="closeBtn">&times;</button>
          <div className={styles.iphoneSender}>System</div>
          <div className={styles.iphoneMessageText}>
            We recommend joining from a computer for the best experience.
            Please check your email for the link and open it on a desktop.
          </div>
        </div>
      </div>

      <div className={styles.bodyBackground}>
        {/* The main Zoom-like White Box */}
        <div className={styles.zoomContainer}>

          {/* Top bar */}
          <div className={styles.zoomTopBar}>
            <span className={styles.zoomLiveSoonText}>LIVE SOON</span>
            <div className={styles.zoomTitle}>PrognosticAI Advanced Training</div>
            <div className={styles.awh2024Header}>
              Live webinar {webinarDate}
            </div>
          </div>

          {/* Two Columns */}
          <div className={styles.twoColumnLayout}>
            
            {/* LEFT COLUMN (60%) */}
            <div className={styles.previewColumn}>
              <div className={styles.countdownWrapper}>
                <p className={styles.countdownLine}>
                  Your webinar begins in <strong className={styles.timerHighlight}>{countdownText}</strong>
                </p>
                <div className={styles.motivationalTagline}>
                  Get ready to transform your marketing strategy!
                </div>
              </div>

              <div className={styles.webinarLoading}>
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p className={styles.loadingText}>
                    We are preparing the webinar...
                    grab a notepad and pen while you wait!
                  </p>
                </div>
              </div>

              <p className={styles.bulletsTitle}>
                <strong>You will learn...</strong>
              </p>
              <ul className={styles.bulletsList}>
                <li>How PrognosticAI personalizes your marketing funnels</li>
                <li>Tips for advanced retargeting strategies</li>
                <li>Free resources to scale your funnel</li>
              </ul>
            </div>

            {/* RIGHT COLUMN (40%) - Chat box */}
            <div className={styles.signupColumn}>
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
                      <span>41 waiting</span>
                    </span>
                  </div>
                </div>

                {/* Actual chat messages area */}
                <div
                  className={styles.chatMessages}
                  id="chatMessages"
                  ref={chatMessagesRef}
                ></div>

                {/* Input box & typing indicator */}
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
            </div>
          </div>

          {/* Single-column area BELOW the two columns */}
          <div className={styles.nextStepsBox}>
            <h3 className={styles.nextStepsHeading}>HERE IS WHAT YOU SHOULD DO NOW</h3>

            {/* Example of checkmark bullets using .benefit-icon, as requested */}
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}></div>
              <div className={styles.benefitText}>
                Block out 1.5 hours. Add it to your calendar or set a reminder. 
              </div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}></div>
              <div className={styles.benefitText}>
                Show up early and attend live. No recordings. Arrive at least 5 min early.
              </div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}></div>
              <div className={styles.benefitText}>
                Use a desktop computer (Mac or Windows). Mobile can be glitchy.
              </div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}></div>
              <div className={styles.benefitText}>
                Get the 3 secret AI tools we are giving away. Show up live to grab them!
              </div>
            </div>

            <div className={styles.webinarDateTime}>
              {webinarDate}, {webinarTime}
              <div className={styles.timezoneNote}>
                Mountain Time (US &amp; Canada) GMT -7
              </div>
            </div>

            {/* "Set reminder" button */}
            <a
              className={styles.reminderLink}
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=PrognosticAI+Webinar&dates=20250112T230000Z/20250112T000000Z&details=Join+PrognosticAI+webinar`}
              target="_blank"
              rel="noreferrer"
            >
              Set reminder
            </a>

            <div className={styles.linkNoticeRow}>
              <div className={styles.noticeIcon}>
                <span>✉</span>
              </div>
              <p style={{ margin: 0 }}>
                You will be automatically redirected at start time. If you are on mobile, 
                please also check your email from a desktop.
              </p>
            </div>
          </div>

          {/* Under that: two columns for Kyle & Selina */}
          <div className={styles.hostsRow}>
            <div className={styles.hostCard}>
              <img
                src="https://i.ibb.co/rGNvSw9/78-Klwbhtn4ags-B0k-Lplo1701987382.png"
                alt="Kyle Campbell"
                className={styles.hostImage}
              />
              <div>
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
              <div>
                <div className={styles.hostName}>Selina Harris</div>
                <div className={styles.hostTitle}>Webinar Host</div>
              </div>
            </div>
          </div>

          {showBadge && (
            <span className={styles.liveSoonBadge}>
              {/* We are removing the bottom "LIVE SOON" per instructions, 
                  so we only render this if you need a badge somewhere else. */}
            </span>
          )}

          <div className={styles.customFooter}>
            © 2025 PrognosticAI
          </div>
        </div>
      </div>

      {/* Minimal inline script to close mobile pop-up */}
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

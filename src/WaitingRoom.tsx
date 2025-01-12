import React, { useEffect, useRef, useState } from 'react';
import styles from './WaitingRoom.module.css';

/**
 * WaitingRoom
 * -----------
 * - Transparent "zoomContainer"
 * - "LIVE SOON" text on top bar
 * - Wider chat (60/40)
 * - Random chat messages from your big block of entrepreneur/marketing quotes (5-15s intervals)
 * - "YOU'RE REGISTERED!" pastel bubble in chat
 * - "HERE’S WHAT YOU SHOULD DO NOW" refined text
 * - Functional “Set reminder” link
 * - Reworded “You will be automatically redirected...” with an icon
 * - Mobile-only iMessage bubble if user is on phone
 * - AI chat logic restored from your old code
 */

const WaitingRoom: React.FC = () => {
  // ====== COUNTDOWN STATES/LOGIC ======
  const [countdownText, setCountdownText] = useState<string>('calculating...');
  const [showBadge, setShowBadge] = useState<boolean>(true);

  // For displaying the dynamic date/time (like the sign-up page)
  const [webinarDate, setWebinarDate] = useState<string>('');
  const [webinarTime, setWebinarTime] = useState<string>('');

  function getNextQuarterHour(): Date {
    const now = new Date();
    // This math sets time to next 15-min block
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

      // Also update the date/time for display
      setWebinarDate(formatDate(now));     // e.g. "Wednesday, September 13"
      setWebinarTime(formatTime(nextTime)); // e.g. "11:00 PM"

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

  // A large array of user-sourced entrepreneur/marketing messages (simplified example).
  // We ignore any that seem to be from employees, per your instruction.
  const scheduledMessages = [
    `"I want to get my first sale selling my new ebook and I'm thinking of trying cold outreach. Any advice?"`,
    `"How can I find new LLCs registering in North Carolina? I started one and got offers but can't find how to get that list."`,
    `"I'm trying to learn digital marketing. LinkedIn Premium has so many courses—any recommendation which ones are best?"`,
    `"First time entrepreneur here: everyone says B2B is better than B2C. I get it, but how do I actually reach businesses?"`,
    `"Hey all, does anyone know of a tool that tracks B2B referrals & payouts? I run a product photography agency. Thanks!"`,
    `"I'm scaling my property management business & need a tool that handles rent payments + tenant comms seamlessly. Any tips?"`,
    `"Hello entrepreneurs, I've started a Travel Agency & see these AI Agents that do tasks... Are they real? Or too good to be true?"`,
    `"How do you guys do client reporting & show ROI for your agency clients? It's taking me a lot of time monthly."`,
    `"Which tool is best for finding new B2B clients? So many, but I'd love real suggestions!"`,
    `"Anybody know how to set up FB Meta Business Suite ad campaign with proper tracking? I'm stuck."`,
    `"Any software that provides automated marketing recommendations for campaigns? A CRM with built-in AI?"`,
    `"I'm seeking new marketing clients. We were relying on referrals, but just lost a few. Need to expand channels—best approach?"`,
    `"As a store owner, I'm using Judge.me for reviews, but only 17 reviews after 5 months & 300 sales. People won't review. Advice?"`,
    `"Running Meta ads, decent CTR but low impressions. Any tips to get consistent results?"`,
    `"We're focusing on identifying B2B website visitors & personalizing outreach. Tools or strategies you've found effective?"`,
    `"We want to offer referral discounts for customers. Our CRM won't do it. Might have to export. Anyone done this smoothly?"`,
    `"I have a Facebook page with 120+ new likes from an ad, but almost no organic engagement. How can I get more real interaction?"`,
    `"Inconsistent e-comm results with fashion brand ads. Some low CPA, then big spikes. Possibly needing new creatives? Or a mentor?"`,
    `"I'd like to post about marketing on LinkedIn, but my company doesn't want me sharing 'secrets.' Is there a middle ground?"`,
    `"Thinking of testing Spotify/Pandora ads for a local festival. Super low budget. Anyone done audio ads with small budgets?"`,
    `"Friend's a travel agent, wasting budget on Google Ads. I'm rewriting them, plus social/email. Email segmentation tips for travel?"`,
    `"Curious how your marketing/digital teams are structured in your organizations? Ours is half marketing, half dev."`,
    `"We have two businesses. Need a platform that merges booking & inventory for both. Something that can track personal & biz?"`,
    `"Trying to start an HVAC biz in Florida. Advice from those who've done local service business from scratch?"`,
    `"I run a small local pet-waste removal co. Another brand with a similar name forced FB to remove my page for IP issues. Advice?"`,
    `"Thinking about small food biz concept. Traditional restaurants are expensive. Any alternative low-cost approaches?"`,
    `"I have a 'web app' but no marketing budget or experience. Where do I even start? Hard to do everything alone."`,
    `"I launched an online course about preventing birth injuries. It's done, but I'm clueless on marketing it. Books? Real experiences?"`,
    `"Just launched new e-comm store, 1600 sessions, no sales. Others seeing similar? Are single-product stores better?"`,
    `"Went from 100+ visits in 2 hours to zero sales— feeling lost. I'd appreciate ideas for quick conversions."`,
    `"I am from Portugal, can I do drop-shipping to the US? Or is shipping time an issue? Possibly handle from local suppliers?"`,
    `"I have a brand with traffic but 0 sales. It's a supplement brand. I'd appreciate a second set of eyes."`,
    `"I tried 1 month of Shopify, not enough time to figure it out. The drop-shipping part is straightforward, but store building is not."`,
    `"Chargebacks soared in Dec. So stressful. My store normally does well. Anyone else see more disputes in holiday months?"`,
    `"Ok, I'm starting a brand for plus-size apparel. Running ads, but conversions are minimal. My angles might be wrong. Suggestions?"`,
    `"I have like 9000 sessions, 0 sales. It's terrifying. Possibly a pricing mismatch or audience mismatch? Not sure."`,
    `"Any suggestions for low-cost marketing classes or certification to brush up my skills? I'm feeling behind the curve."`,
    `"At times I want to add a custom chatbot. I'm on Kajabi, not sure if there's a plugin or do I embed a 3rd party?"`,
    `"I'm 13 and want to learn digital marketing. SEO is interesting. Any tips for how to start so I'm ready for the future?"`,
    `"I'm 50 and not sure if I should do email & content marketing? Feels so big but I've got to do something online!"`,
    `"Wanted to confirm if it's feasible to do SEO for Shopify or WooCommerce clients from Nigeria. Market open enough?"`,
    `"I plan to open multiple Etsy shops for digital items. Should I separate them by niche, or keep them under one umbrella?"`,
    `"We launched a funnel. 300 participants, only 30 showed up, no sales. Possibly charging a small fee to filter out freebies?"`,
    // ... more messages if you want to fill 15 min, but this is enough for a “realistic” chat pattern ...
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

    // Toggle “Show Others”
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
      if (type === 'user') {
        messageDiv.classList.add('user');
      } else if (type === 'host') {
        messageDiv.classList.add('host');
      } else if (type === 'system') {
        messageDiv.classList.add('system');
      }

      const userLabel = user ? `${user}: ` : '';
      messageDiv.textContent = userLabel + text;

      // If it's a host message typed in real-time:
      if (type === 'host' && !isAutoGenerated) {
        typingEl.textContent = 'Selina is typing...';
        setTimeout(() => {
          typingEl.textContent = '';
        }, 2000);
      }

      // Tag participant messages so they can be toggled
      if (type === 'user' && user !== 'You') {
        messageDiv.setAttribute('data-participant', 'true');
        messageDiv.setAttribute('data-auto-generated', 'true');
        messageDiv.style.display = toggleEl.checked ? 'block' : 'none';
      }

      chatEl.appendChild(messageDiv);

      // auto-scroll if near bottom or if I am the user
      if (!isUserScrolling || user === 'You') {
        scrollToBottom(chatEl);
      }
    }

    // Insert our “YOU’RE REGISTERED!” system bubble (in pastel) right away:
    const registeredBubble = document.createElement('div');
    registeredBubble.className = styles.registeredNotice;
    registeredBubble.textContent = "YOU'RE REGISTERED!";
    chatEl.appendChild(registeredBubble);

    // AI/Host response for real user messages
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
        addMessage("Apologies, I'm having trouble connecting. Please try again!", 'host', 'Selina', false);
      }
    }

    // Listen for user press Enter => new user message
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

    // ====== RANDOM AUTO MESSAGES (the big array) ======
    // We'll schedule them across the next 15 min with random intervals 5–15s
    // Or until we exhaust the array.
    let totalDelay = 3000; // start after 3s
    scheduledMessages.forEach((msg, index) => {
      const randomInterval = 5000 + Math.random() * 10000; // 5-15 sec
      totalDelay += randomInterval;
      // If totalDelay < 900000 ms (15 min), schedule it:
      if (totalDelay < 900000) {
        setTimeout(() => {
          // pick a random name for user
          addMessage(msg, 'user', randomName(), true);
        }, totalDelay);
      }
    });

    function randomName() {
      const possibleNames = [
        "Alice", "Brandon", "Carol", "Derek", "Eva", "Felix", "Georgia", "Harold",
        "Ivy", "Jamal", "Kara", "Leo", "Mona", "Nate", "Olga", "Priya", "Quinn",
        "Ronan", "Sasha", "Tina", "Umar", "Vivian", "Wes", "Xander", "Yvonne", "Zack"
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
      {/* The overlay for iMessage bubble if on mobile */}
      <div className={styles.exitOverlay} id="popupOverlay">
        <div className={styles.iphoneMessageBubble}>
          <button className={styles.exitCloseBtn} id="closeBtn">&times;</button>
          <div className={styles.iphoneSender}>System</div>
          <div className={styles.iphoneMessageText}>
            We recommend joining from a computer for the best experience!
            Please check your email for the link and open it on desktop.
          </div>
        </div>
      </div>

      <div className={styles.bodyBackground}>
        <div className={styles.zoomContainer}>
          <div className={styles.zoomTopBar}>
            <span className={styles.zoomLiveSoonText}>LIVE SOON</span>
            <div className={styles.zoomTitle}>
              PrognosticAI Advanced Training
            </div>
            <div className={styles.awh2024Header} id="awh2024-header">
              Live webinar today
            </div>
          </div>

          <div className={styles.twoColumnLayout}>
            {/* LEFT side */}
            <div className={styles.previewColumn}>
              <div className={styles.awhp2024HeaderWrapper}>
                Your webinar begins in{" "}
                <span className={styles.awhp2024TimerText}>
                  {countdownText}
                </span>
                <div className={styles.motivationalTagline}>
                  “Get ready to transform your marketing strategy!”
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

              <hr className={styles.lightDivider} />

              <p className={styles.bulletsTitle}>
                <strong>You will learn...</strong>
              </p>
              <ul className={styles.bulletsList}>
                <li>How PrognosticAI personalizes your marketing funnels</li>
                <li>Tips for advanced retargeting strategies</li>
                <li>Free resources to scale your funnel</li>
              </ul>

              {/* Next Steps box */}
              <div className={styles.nextStepsBox}>
                <h3 className={styles.nextStepsHeading}>HERE’S WHAT YOU SHOULD DO NOW:</h3>
                <ol className={styles.nextStepsList}>
                  <li>
                    <strong>Block out 1.5 hours</strong>  
                    <br />
                    Add it to your calendar, jot down the time, or click the blue ‘Set reminder’ link below.
                  </li>
                  <li>
                    <strong>Show up early</strong>  
                    <br />
                    There are no recordings, so attend live & arrive at least 5 minutes early. Seats fill up fast!
                  </li>
                  <li>
                    <strong>Use a desktop computer (Mac or Windows)</strong>  
                    <br />
                    Watching on a phone can be glitchy, and the software runs best on desktop.
                  </li>
                  <li>
                    <strong>Get the 3 tools on the webinar</strong>  
                    <br />
                    We’ll give away 3 secret AI tools to everyone who shows up. If you want them, don’t miss it!
                  </li>
                </ol>

                <div className={styles.webinarDate}>
                  {webinarDate}, {webinarTime}
                </div>
                <div className={styles.webinarTimeZone}>
                  Mountain Time (US &amp; Canada) GMT -7
                </div>

                {/* Example Google Calendar link—adjust details as you wish */}
                <a
                  className={styles.reminderLink}
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=PrognosticAI+Webinar&dates=20250112T230000Z/20250112T000000Z&details=Don%27t+forget+to+join+PrognosticAI+webinar!`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Set reminder
                </a>

                {/* Reworded text about “you will be automatically redirected” */}
                <div className={styles.linkNoticeRow}>
                  <div className={styles.noticeIcon}>
                    {/* We can put an email/computer icon or text. */}
                    <span>✉</span>
                  </div>
                  <p style={{ margin: 0 }}>
                    You will be automatically redirected. If you’re on a mobile device,
                    please check your email from a computer to ensure access.
                  </p>
                </div>

                {/* Presenters row */}
                <div className={styles.hostsBox}>
                  {/* Kyle */}
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
                  {/* Selina */}
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
              </div>
            </div>

            {/* RIGHT side: Chat */}
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
                  <div
                    className={styles.typingIndicator}
                    id="typingIndicator"
                    ref={typingIndicatorRef}
                  />
                </div>
              </div>
            </div>
          </div>

          {showBadge && (
            <span className={styles.liveSoonBadge} style={{ display: 'block', textAlign: 'center', marginTop: '16px' }}>
              LIVE SOON
            </span>
          )}

          <div className={styles.customFooter}>
            © 2025 PrognosticAI
          </div>
        </div>
      </div>

      {/* Minimal inline script for the mobile pop-up close logic */}
      <script
        // We can dangerouslySetInnerHTML since we need inline script in TSX
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

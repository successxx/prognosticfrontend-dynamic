import React, { useEffect, useRef, useState } from 'react';
import styles from './WaitingRoom.module.css';

/**
 * WaitingRoom
 * -----------
 * Now with:
 *  - Transparent "zoomContainer"
 *  - Additional "HERE’S WHAT YOU SHOULD DO NOW" box
 *  - Circle images for Kyle & Selina
 *  - Date/time logic from sign-up page (every 15 min)
 */

const WaitingRoom: React.FC = () => {
  // ====== COUNTDOWN STATES/LOGIC ======
  const [countdownText, setCountdownText] = useState<string>('calculating...');
  const [showBadge, setShowBadge] = useState<boolean>(true);

  // For displaying the dynamic date/time (just like sign-up page).
  const [webinarDate, setWebinarDate] = useState<string>('');
  const [webinarTime, setWebinarTime] = useState<string>('');

  function getNextQuarterHour(): Date {
    const now = new Date();
    return new Date(Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
  }

  function formatDate(date: Date) {
    // e.g. "Wednesday, September 13"
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  function formatTime(date: Date) {
    // e.g. "11:00 PM"
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Countdown effect
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextTime = getNextQuarterHour();
      const timeLeft = nextTime.getTime() - now.getTime();

      // also update the date/time for display
      setWebinarDate(formatDate(now)); // "Today is..."
      setWebinarTime(formatTime(nextTime)); // "Next quarter hour"

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

    const names = [
      "Emma","Liam","Olivia","Noah","Ava","Ethan","Sophia","Mason",
      "Isabella","William","Mia","James","Charlotte","Benjamin","Amelia",
      "Lucas","Harper","Henry","Evelyn","Alexander"
    ];
    let attendeeMessages = [
      "Cant wait for this to start!",
      "First time here... excited!!",
      "Anyone else waiting?",
      "Advanced question: Has anyone integrated this with Zapier for complex funnels?",
      "Setting up multi-step retargeting is my priority right now",
      "I'm interested in the analytics side of things",
      "Hello everyone from the waiting room!",
      "What about affiliate tracking with UTMs and multi-touch attribution?",
      "Hoping to see a funnel breakdown today",
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
      messageDiv.textContent = user ? `${user}: ${text}` : text;

      // If real host message, show "typing..."
      if (type === 'host' && !isAutoGenerated) {
        typingEl.textContent = 'Selina is typing...';
        setTimeout(() => {
          typingEl.textContent = '';
        }, 2000);
      }

      // Tag user messages from others so they can be toggled off
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
        addMessage(data.text, data.messageType as 'user' | 'host' | 'system', data.user, true);
      }
    };
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Random chunk of user messages
    function scheduleLocationMessages() {
      const numMessages = Math.min(attendeeMessages.length, Math.floor(Math.random() * 6) + 15);
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

    // Pre-loaded timed messages
    preloadedQuestions.forEach(question => {
      setTimeout(() => {
        addMessage(question.text, 'user', question.user, true);
      }, question.time * 1000);
    });

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
          body: JSON.stringify({
            message: userMessage,
            type: 'user'
          })
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

    // Randomly adjust viewer count
    let currentViewers = 41;
    const viewerInterval = setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      currentViewers = Math.max(40, Math.min(50, currentViewers + change));
      const viewerCountEl = document.getElementById('viewerCount');
      if (viewerCountEl) {
        viewerCountEl.textContent = `${currentViewers} waiting`;
      }
    }, 5000);

    // Initial host message, then schedule random lines
    setTimeout(() => {
      addMessage("we'll get started here in just one minute", 'host', 'Selina', true);
      scheduleLocationMessages();
      scrollToBottom(chatEl);
    }, 4000);

    // Real user typing => triggers AI
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

  // ====== RENDER ======
  return (
    <div className={styles.bodyBackground}>
      {/* Outer container using the sign-up page’s “zoomContainer” (transparent now) */}
      <div className={styles.zoomContainer}>

        {/* Top bar with the live dot + “Live webinar today” label */}
        <div className={styles.zoomTopBar}>
          <div className={styles.zoomTitle}>
            <div className={styles.zoomLiveDot}></div>
            <span>PrognosticAI Advanced Training</span>
          </div>
          <div className={styles.awh2024Header} id="awh2024-header">
            Live webinar today
          </div>
        </div>

        {/* Two-column layout */}
        <div className={styles.twoColumnLayout}>

          {/* LEFT side: countdown, spinner, bullets, plus next steps box. */}
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

            {/* "You will learn..." bullets */}
            <p className={styles.bulletsTitle}>
              <strong>You will learn...</strong>
            </p>
            <ul className={styles.bulletsList}>
              <li>How PrognosticAI personalizes your marketing funnels</li>
              <li>Tips for advanced retargeting strategies</li>
              <li>Free resources to scale your funnel</li>
            </ul>

            {/* The new "HERE’S WHAT YOU SHOULD DO NOW" box */}
            <div className={styles.nextStepsBox}>
              <h3 className={styles.nextStepsHeading}>HERE'S WHAT YOU SHOULD DO NOW:</h3>
              <ol className={styles.nextStepsList}>
                <li>
                  <strong>BLOCK OUT 1.5 HOURS</strong>:  
                  Add it to your calendar, jot down the time, or click the blue
                  'Set reminder' link to the right of the video to get a reminder.
                </li>
                <li>
                  <strong>SHOW UP EARLY</strong>:  
                  There will be no recordings, so make sure that you attend live
                  and show up at least 5 minutes early. The webinar room will fill up fast.
                </li>
                <li>
                  <strong>USE A DESKTOP COMPUTER (MAC OR WINDOWS)</strong>:  
                  Watching webinars on a phone sucks, and the software isn’t great on mobile.
                </li>
                <li>
                  <strong>GET THE 3 TOOLS ON THE WEBINAR</strong>:  
                  The 3 secret AI tools will be given away to all attendees who show up.
                  If you want them, be there!
                </li>
              </ol>

              {/* Dynamically set date/time from the countdown logic */}
              <div className={styles.webinarDate}>
                {webinarDate}, {webinarTime}
              </div>
              <div className={styles.webinarTimeZone}>
                Mountain Time (US &amp; Canada) GMT -7
              </div>

              <a href="#!" className={styles.reminderLink}>Set reminder</a>
              <p>Your webinar link</p>
              <p>Link disabled in edit mode</p>

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

          {/* RIGHT side: the Chat */}
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
              <div
                className={styles.chatMessages}
                id="chatMessages"
                ref={chatMessagesRef}
              />
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

        {/* The blinking "LIVE SOON" badge if countdown not at zero */}
        {showBadge && (
          <span className={styles.liveSoonBadge}>
            LIVE SOON
          </span>
        )}

        {/* Footer branding */}
        <div className={styles.customFooter}>
          © 2024 PrognosticAI
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;

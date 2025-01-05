import React, { useEffect, useRef, useState } from 'react';
import styles from './WaitingRoom.module.css';

/**
 * A direct React-based port of your original "Waiting Room" HTML code,
 * preserving the countdown, spinner, "You will learn...", and chat logic.
 */
const WaitingRoom: React.FC = () => {
  // ========== COUNTDOWN STATES/LOGIC ==========
  const [countdownText, setCountdownText] = useState<string>('calculating...');

  /** Returns a Date object for the next quarter-hour (15/30/45/60) */
  function getNextQuarterHour(): Date {
    const now = new Date();
    const nextQ = new Date(Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
    return nextQ;
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
    // Replicating the old script
    const updateCountdown = () => {
      const now = new Date();
      const nextTime = getNextQuarterHour();
      const timeLeft = nextTime.getTime() - now.getTime();
      if (timeLeft <= 0) {
        // old code used redirectToWebinar() here, but you said we are not redirecting.
        // So we'll just say "starting now..."
        setCountdownText('starting now...');
      } else {
        setCountdownText(formatTimeLeft(timeLeft));
      }
    };

    // Initial call
    updateCountdown();
    // Update every second
    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, []);

  // ========== CHATBOX LOGIC ==========
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const participantToggleRef = useRef<HTMLInputElement | null>(null);

  // For the WebSocket
  const [socket, setSocket] = useState<WebSocket | null>(null);
  // We'll store the chat messages in the DOM ourselves (like the old code) or we can store in React state.
  // To preserve EXACT logic, let's do the DOM approach but in a React-friendly way:

  /** Helper to auto-scroll if near bottom, like the old code. */
  function isNearBottom(element: HTMLDivElement): boolean {
    const threshold = 50;
    return (element.scrollHeight - element.clientHeight - element.scrollTop) <= threshold;
  }

  function scrollToBottom(element: HTMLDivElement) {
    element.scrollTop = element.scrollHeight;
  }

  // Instead of a big <script> block, replicate the same logic in useEffect:
  useEffect(() => {
    const el = chatMessagesRef.current;
    const inputEl = messageInputRef.current;
    const typingEl = typingIndicatorRef.current;
    const toggleEl = participantToggleRef.current;

    if (!el || !inputEl || !typingEl || !toggleEl) {
      console.error("WaitingRoom: Missing refs for chat box or input or toggle switch.");
      return;
    }

    let isUserScrolling = false;

    // Scroll listener
    function handleScroll() {
      isUserScrolling = !isNearBottom(el);
    }
    el.addEventListener('scroll', handleScroll);

    // Exactly the same line arrays
    const names = [
      "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
      "Isabella", "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia",
      "Lucas", "Harper", "Henry", "Evelyn", "Alexander"
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

    // Generic function to add a message to the chat
    function addMessage(text: string, type: 'user' | 'host' | 'system', user = '', isAutoGenerated = true) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `${styles.message} ${type === 'user'
          ? styles.user
          : type === 'host'
          ? styles.host
          : styles.system
        }`;
      // We'll just manually set the className for "system", "host", "user" so the styling is correct
      // The original approach used .message.user, .message.host, .message.system
      if (type === 'user') {
        messageDiv.classList.add('user');
      } else if (type === 'host') {
        messageDiv.classList.add('host');
      } else if (type === 'system') {
        messageDiv.classList.add('system');
      }

      // Construct the text
      messageDiv.textContent = user ? `${user}: ${text}` : text;

      // If it's a real (non-auto) host message, briefly show "typing..."
      if (type === 'host' && !isAutoGenerated) {
        typingEl.textContent = 'Selina is typing...';
        setTimeout(() => {
          typingEl.textContent = '';
        }, 2000);
      }

      // Tag user messages from others so they can be hidden if toggle is off
      if (type === 'user' && user !== 'You') {
        messageDiv.setAttribute('data-participant', 'true');
        messageDiv.setAttribute('data-auto-generated', 'true');
        // The toggle only affects display, not the ability to type
        messageDiv.style.display = toggleEl.checked ? 'block' : 'none';
      }

      el.appendChild(messageDiv);

      // auto-scroll if we are near bottom
      if (!isUserScrolling || user === 'You') {
        scrollToBottom(el);
      }
    }

    // Toggle "Show Others" on/off
    function handleToggleChange(e: Event) {
      const target = e.currentTarget as HTMLInputElement;
      const participantMessages = el.querySelectorAll('[data-participant="true"]');
      participantMessages.forEach(msg => {
        (msg as HTMLElement).style.display = target.checked ? 'block' : 'none';
      });
      if (target.checked && !isUserScrolling) {
        scrollToBottom(el);
      }
    }
    toggleEl.addEventListener('change', handleToggleChange);

    // Connect WebSocket
    const newSocket = new WebSocket('wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('Connected to chat server');
      scrollToBottom(el);
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

    // Schedule a certain number of random attendee messages (unique, no duplicates)
    function scheduleLocationMessages() {
      // We'll send between 15 and 20 random messages
      const numMessages = Math.min(attendeeMessages.length, Math.floor(Math.random() * 6) + 15);
      const available = [...attendeeMessages];
      let delay = 500;

      for (let i = 0; i < numMessages; i++) {
        const index = Math.floor(Math.random() * available.length);
        const message = available[index];
        available.splice(index, 1); // remove the used line

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

    // AI/Host response logic — only runs for real user messages
    async function handleHostResponse(userMessage: string, isAutomated: boolean = false) {
      if (isAutomated) return;
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
        addMessage("Apologies, I'm having trouble connecting. Please try again!", 'host', 'Selina', false);
      }
    }

    // Randomly adjust viewer count
    let currentViewers = 41;
    setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      currentViewers = Math.max(40, Math.min(50, currentViewers + change));
      const viewerCountEl = document.getElementById('viewerCount');
      if (viewerCountEl) {
        viewerCountEl.textContent = `${currentViewers} waiting`;
      }
    }, 5000);

    // Initial host message, schedule random lines, start viewer count
    setTimeout(() => {
      addMessage("we'll get started here in just one minute", 'host', 'Selina', true);
      scheduleLocationMessages();
      scrollToBottom(el);
    }, 4000);

    // Real user typing => triggers AI
    function handleKeypress(e: KeyboardEvent) {
      if (e.key === 'Enter' && inputEl.value.trim()) {
        const userMessage = inputEl.value.trim();
        inputEl.value = '';

        // Real user’s own message
        addMessage(userMessage, 'user', 'You', false);
        // Ask the AI for a host response
        handleHostResponse(userMessage, false);
      }
    }
    inputEl.addEventListener('keypress', handleKeypress);

    // Cleanup
    return () => {
      el.removeEventListener('scroll', handleScroll);
      toggleEl.removeEventListener('change', handleToggleChange);
      inputEl.removeEventListener('keypress', handleKeypress);
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  // ========== RENDER ==========

  return (
    <div>
      {/* TOP COUNTDOWN */}
      <div className={styles.awhp2024HeaderWrapper} id="awhp2024-header-wrapper">
        Your webinar begins in{' '}
        <span className={styles.awhp2024TimerText} id="awhp2024-countdown-text">
          {countdownText}
        </span>
      </div>

      {/* TWO COLUMN WRAPPER */}
      <div className={styles.waitingroomWrapper}>
        {/* LEFT COLUMN */}
        <div className={styles.waitingroomLeft}>
          {/* SPINNER */}
          <div className={styles.webinarLoading}>
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p className={styles.loadingText}>
                We are preparing the webinar... grab a notepad and pen while you wait!
              </p>
              <a
                href="https://prognostic.ai"
                className={styles.loadingLogo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Powered by PrognosticAI
              </a>
            </div>
          </div>

          {/* LIGHT DIVIDER */}
          <hr className={styles.lightDivider} />

          {/* "You will learn..." */}
          <p className={styles.bulletsTitle}>
            <strong>You will learn...</strong>
          </p>
          <ul className={styles.bulletsList}>
            <li>How PrognosticAI personalizes your marketing funnels</li>
            <li>Tips for advanced retargeting strategies</li>
            <li>Free resources to scale your funnel</li>
          </ul>
        </div>

        {/* RIGHT COLUMN: THE CHAT */}
        <div className={styles.waitingroomRight}>
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

      {/* FOOTER BRANDING */}
      <div className={styles.customFooter}>© 2024 PrognosticAI</div>
    </div>
  );
};

export default WaitingRoom;

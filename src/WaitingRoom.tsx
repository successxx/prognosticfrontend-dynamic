import React, { useEffect, useRef, useState } from 'react';
import styles from './WaitingRoom.module.css';

const WaitingRoom: React.FC = () => {
  // ====== COUNTDOWN STATE/LOGIC ======
  const [countdownText, setCountdownText] = useState<string>('calculating...');
  const [showBadge, setShowBadge] = useState<boolean>(true);

  /** Next quarter-hour logic */
  function getNextQuarterHour(): Date {
    const now = new Date();
    return new Date(Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
  }

  /** Format time left into "X minutes and Y seconds" or "Z seconds" */
  function formatTimeLeft(ms: number): string {
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

  // ====== CHATBOX LOGIC (same as before) ======
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

    // Random names & messages
    const names = [
      "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
      "Isabella", "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia",
      "Lucas", "Harper", "Henry", "Evelyn", "Alexander"
    ];

    let attendeeMessages = [
  "can't wait for this to start!",
  "First time here... so excited!!",
  "anyone else waiting?",
  "Question: has anyone integrated this w/ Zapier for complex funnels?",
  "setting up multi-step retargeting is my top priority rn",
  "im interested in the analytics side of things",
  "Hello waiting roomers :)",
  "How is everyone using ai in your marketing rn??",
  "ANy affiliate marketers here?",
  "so ready for advanced marketing hacks!",
  "hope we get some real actionable tips today",
  "agency owner here...",
  "excited but nervous for this webinar...",
  "funnel hackers ftw!!",
  "anyone else doing e-commere??",
  "looking forward to the Q&A on conversion funnels",
  "we use advanced tracking pixels; does your platform handle that?",
  "really hoping for some good insights here",
  "is the audio working for everyone?",
  "anyone else from the marketing dept?",
  "we want to build a segmentation funnel, any best practices?",
  "can't wait to compare notes after the webinar!",
  "hi from the social media team!"
];

const preloadedQuestions = [
  { time: 10, text: "hey everyone, excited to join!", user: "Emma" },
  { time: 25, text: "Yo, first time here...", user: "Michael" },
  { time: 40, text: "What business are y'all in?", user: "Zoe" },
  { time: 50, text: "SMMA owner over here", user: "Liam" },
  { time: 65, text: "Consultant working with startups.", user: "Olivia" },
  { time: 80, text: "Any other agency owners out there?", user: "Zoe" },
  { time: 95, text: "I'm just a freelancer, doing graphic design.", user: "Noah" },
  { time: 110, text: "do we need to have our cameras on?", user: "Sarah" },
  { time: 130, text: "dont think so... pretty sure it's just a webinar lol", user: "James" },
  { time: 150, text: "What time does this start exactly?", user: "David" },
  { time: 170, text: "should be in about a couple mins i think", user: "Rachel" },
  { time: 190, text: "perfect timing to grab a coffee then!", user: "Thomas" },
  { time: 215, text: "anyone else having audio issues? can't hear a thing", user: "Lisa" },
  { time: 240, text: "i think it hasn't started yet; that's why", user: "Alex" },
  { time: 265, text: "oh, that makes sense lol", user: "Lisa" },
  { time: 290, text: "has anyone here used their product before?", user: "Jennifer" },
  { time: 315, text: "not yet, but heard good things.", user: "Daniel" },
  { time: 340, text: "Same here - my colleague recommended it!", user: "Sophie" },
  { time: 365, text: "Will there be a replay available?", user: "Ryan" },
  { time: 390, text: "usually is for these types of webinars...", user: "Maria" },
  { time: 415, text: "Anyone taking notes? I'm ready with my notebook.", user: "William" },
  { time: 440, text: "got my notepad open too!", user: "Emma" },
  { time: 465, text: "hope there's a Q&A section at the end?", user: "Noah" },
  { time: 490, text: "same, got lots of questions prepared", user: "Olivia" },
  { time: 515, text: "what are you all working on lately?", user: "Liam" },
  { time: 540, text: "yep! Social media manager here.", user: "Ava" },
  { time: 565, text: "content marketing team checking in.", user: "Ethan" },
  { time: 590, text: "excited to see the analytics features!", user: "Sophia" },
  { time: 615, text: "hope they show the dashboard demo...", user: "Mason" },
  { time: 640, text: "getting some coffee, brb!", user: "Isabella" },
  { time: 665, text: "good idea, might do the same.", user: "Benjamin" },
  { time: 690, text: "anyone know how long the webinar is???", user: "Charlotte" },
  { time: 715, text: "think it's an hour with Q&A after", user: "Henry" },
  { time: 740, text: "perfect length imo", user: "Amelia" },
  { time: 765, text: "can't wait to see what's new!!!", user: "Lucas" },
  { time: 790, text: "almost time to start, so hyped!", user: "Harper" }
];

    // Add new message to chat
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

      // Also match old CSS classes
      if (type === 'user') {
        messageDiv.classList.add('user');
      } else if (type === 'host') {
        messageDiv.classList.add('host');
      } else if (type === 'system') {
        messageDiv.classList.add('system');
      }

      messageDiv.textContent = user ? `${user}: ${text}` : text;

      // If it's a real host message (not auto):
     if (type === 'host' && !isAutoGenerated) {
  typingEl.textContent = 'Selina is typing...';
  // Calculate a random delay between 5 and 10 seconds (5000 to 10000 ms)
  const randomTypingTime = 5000 + Math.random() * 5000;
  setTimeout(() => {
    typingEl.textContent = '';
  }, randomTypingTime);
}


      // If from other participant => hide if toggle is off
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

    // Toggle show/hide participants
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

    // Pre-scheduled random messages
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

    // Preloaded Q
    preloadedQuestions.forEach(question => {
      setTimeout(() => {
        addMessage(question.text, 'user', question.user, true);
      }, question.time * 1000);
    });

    // AI/Host response
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

    // Random viewer count
    let currentViewers = 41;
    const viewerInterval = setInterval(() => {
      const change = Math.random() < 0.5 ? -1 : 1;
      currentViewers = Math.max(40, Math.min(50, currentViewers + change));
      const viewerCountEl = document.getElementById('viewerCount');
      if (viewerCountEl) {
        viewerCountEl.textContent = `${currentViewers} waiting`;
      }
    }, 5000);

    // Kick things off
    setTimeout(() => {
      addMessage("we're about to go live - Kyle will be joining us in a sec.", 'host', 'Selina', true);
      scheduleLocationMessages();
      scrollToBottom(chatEl);
    }, 4000);

    // Listen for user pressing Enter => triggers AI
    function handleKeypress(e: KeyboardEvent) {
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

  // ====== MOBILE POPUP LOGIC (ADDED) ======
  const [showMobilePopup, setShowMobilePopup] = useState(false);

  useEffect(() => {
    // If userAgent or screen suggests mobile, show the bubble
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );
    if (isMobile) {
      setShowMobilePopup(true);
    }
  }, []);

  const closePopup = () => {
    setShowMobilePopup(false);
  };

  // ====== RENDER ======
  // For a simplistic "today's date" – you can refine as needed:
  const todayDateString = new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <>
      <div className={styles.zoomContainer}>
        {/* TOP BAR */}
        <div className={styles.zoomTopBar}>
          <div className={styles.zoomTitle}>
            {/* Instead of red dot, we now have .zoomLiveDot => "LIVE SOON" text */}
            <div className={styles.zoomLiveDot}></div>
            <span>PrognosticAI Advanced Training</span>
          </div>
          {/* CHANGED top-right text to "Live Webinar: (date)" */}
          <div className={styles.awh2024Header}>
            Live Webinar: {todayDateString}
          </div>
        </div>

        {/* TWO COLUMNS */}
        <div className={styles.twoColumnLayout}>
          {/* LEFT (Preview) Column (70%) */}
          <div className={styles.previewColumn}>
            {/* SPINNER / LOADING */}
            <div className={styles.webinarLoading}>
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                {/* ADDED a more obvious countdown here too */}
                <p className={styles.loadingText}>
                  {`We are preparing the webinar... grab a notepad and pen while you wait!`}
                </p>
                <p style={{ color: '#2c3135', fontSize: '0.9rem', fontWeight: 400 }}>
                  Starts in: <strong>{countdownText}</strong>
                </p>
              </div>
            </div>

            {/* Replacing "You will learn" with check bullets */}
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

            <h3 className={styles.presentersHeading}>Your presenters...</h3>
            {/* Presenter Cards */}
            <div className={styles.hostCard}>
              <img
                src="https://i.ibb.co/rGNvSw9/78-Klwbhtn4ags-B0k-Lplo1701987382.png"
                alt="Kyle Campbell"
                className={styles.hostImage}
              />
              <div>
                <div className={styles.hostName}>Kyle Campbell</div>
                <div className={styles.hostTitle}>Webinar Host</div>
                {/* ADDED new text for Kyle, not bold or colored differently */}
                <div className={styles.hostSubtitle}>
                  In {countdownText}, Kyle will reveal the secret new AI
                  that took him from rock bottom to $1M+ in 44 weeks.
                </div>
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
                {/* ADDED new text for Selina */}
                <div className={styles.hostSubtitle}>
                  Assisting Kyle today will be his team leader, Selina, PhD graduate student at Harvard
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT (Chat) Column (30%) */}
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
      </div>

      {/* Footer branding outside box */}
      <div className={styles.footerBranding}>© 2025 PrognosticAI</div>

      {/* ADDED iMessage-style popup (only on mobile) */}
      {showMobilePopup && (
        <div
          className={styles.exitOverlay}
          id="popupOverlay"
          style={{ display: 'flex' }} /* show overlay on mobile */
          onClick={(e) => {
            // close if clicked outside bubble
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          <div className={styles.iphoneMessageBubble} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.exitCloseBtn}
              id="closeBtn"
              onClick={closePopup}
            >
              &times;
            </button>
            {/* CHANGED "System" => "Selina" & left aligned */}
            <div className={styles.iphoneSender}>Selina</div>
            <div className={styles.iphoneMessageText}>
              Hey there! For the best experience, please join from a desktop
              computer if possible. Check your email on your computer for the
              webinar link, or continue here at your own risk.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WaitingRoom;

/* --------------------------------------------------
   File: src/WaitingRoom.tsx
   -------------------------------------------------- */
import React, { useEffect, useRef, useState } from 'react';
import './WaitingRoom.css'; // optional if you want to move the below <style> into a .css file
import './index.css';

/**
 * WAITING ROOM COMPONENT
 * 
 * Renders:
 *   - Montserrat heavy title
 *   - Countdown text
 *   - Big spinner
 *   - "You will learn..." bullets
 *   - The chatbox on the right
 * 
 * The code also respects the 15-minute increments logic
 * (which you already do in App.tsx or wherever).
 */
const WaitingRoom: React.FC<{ countdown: number; }> = ({ countdown }) => {
  /**
   * This is your existing Chat code, turned into React:
   * We'll embed it in a <div> with dangerouslySetInnerHTML
   * OR we can in-line it. Here, I’ll inline it so you can see everything plainly.
   */
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Keep track of WebSocket
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // For typed chat messages
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [viewerCount, setViewerCount] = useState(41);

  // We'll store some random messages in local state
  const [messages, setMessages] = useState<Array<{
    text: string;
    type: string;   // 'user', 'host', 'system'
    user?: string;  // user name
    auto?: boolean; // auto-generated
  }>>([]);

  // The toggle "Show Others"
  const [showParticipantMsgs, setShowParticipantMsgs] = useState(false);

  /** 
   * This function loads your timed preloaded messages, 
   * plus random chat lines from your big array.
   */
  useEffect(() => {
    // open the WebSocket
    const ws = new WebSocket('wss://my-webinar-chat-af28ab3bc4ef.herokuapp.com');
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to chat server');
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        addMessage(data.text, data.messageType, data.user, true);
      }
    };

    // Preloaded messages on a timer (like your snippet)
    const preloaded = [
      { time: 30, text: "hey everyone! excited for this", user: "Emma" },
      { time: 45, text: "same here! first time in one of these", user: "Michael" },
      { time: 60, text: "do we need to have our cameras on?", user: "Sarah" },
      // ... etc. (use your full array from your snippet)
    ];
    preloaded.forEach(m => {
      setTimeout(() => {
        addMessage(m.text, 'user', m.user, true);
      }, m.time * 1000);
    });

    // Start the viewerCount random updates
    const intervalId = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.random() < 0.5 ? -1 : 1;
        const updated = Math.max(40, Math.min(50, prev + change));
        return updated;
      });
    }, 5000);

    return () => {
      clearInterval(intervalId);
      ws.close();
    };
    // eslint-disable-next-line
  }, []);

  // Add message to local state
  function addMessage(text: string, type: string, user?: string, auto = false) {
    setMessages(prev => {
      return [...prev, { text, type, user, auto }];
    });
  }

  const handleSendMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && messageInputRef.current && messageInputRef.current.value.trim()) {
      const userMessage = messageInputRef.current.value.trim();
      messageInputRef.current.value = '';

      // Add user’s own message
      addMessage(userMessage, 'user', 'You', false);

      // If you need AI/Host response:
      await handleHostResponse(userMessage);
    }
  };

  // The AI/Host response function from your snippet:
  async function handleHostResponse(userMessage: string) {
    try {
      // Simulate slight random delay
      await new Promise(r => setTimeout(r, Math.random() * 2000));

      // Real AI host call
      const response = await fetch('https://my-webinar-chat-af28ab3bc4ef.herokuapp.com/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, type: 'user' })
      });
      if (!response.ok) throw new Error('API call failed');

      const data = await response.json();
      if (data.response) {
        addMessage(data.response, 'host', 'Kyle', false);
      }
    } catch (error) {
      console.error('Error from AI:', error);
      addMessage('Sorry, having trouble connecting. Please try again!', 'host', 'Selina', false);
    }
  }

  // Scrolling logic
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isUserScrolling) {
      // auto-scroll to bottom
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    }
  }, [messages, isUserScrolling]);

  const handleChatScroll = () => {
    if (!chatMessagesRef.current) return;
    const threshold = 50;
    const nearBottom = (chatMessagesRef.current.scrollHeight -
      chatMessagesRef.current.clientHeight -
      chatMessagesRef.current.scrollTop) <= threshold;
    setIsUserScrolling(!nearBottom);
  };

  // Toggling others' messages
  const toggleParticipantMessages = () => {
    setShowParticipantMsgs(prev => !prev);
  };

  // ======== RENDER ========
  return (
    <div className="waiting-room-page" style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
      {/* LEFT Column: Title, Countdown, Spinner, Bullets */}
      <div style={{flex: '1 1 400px', minWidth: '300px'}}>
        <h1 style={{
          fontFamily: 'Montserrat, sans-serif',
          textAlign: 'center',
          fontSize: '48px',
          fontWeight: 800,
          margin: '20px auto',
          padding: '10px',
          color: '#2E2E2E',
          lineHeight: '1.2',
        }}>
          Your webinar begins in&nbsp;
          <span style={{ color: '#0142ac', fontWeight: 900 }}>
            {countdown > 0 ? formatTime(countdown) : 'starting soon...'}
          </span>
        </h1>

        {/* The spinner + "We are preparing" message */}
        <div style={{
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          background: 'none', // transparent
          marginBottom: '2rem',
        }}>
          <div style={{
            border: '8px solid rgba(228, 232, 241, 0.5)',
            borderTop: '8px solid #0142ac',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            color: '#0142ac',
            fontSize: '24px',
            fontWeight: 700,
            marginTop: '20px',
            textAlign: 'center',
            maxWidth: '350px',
          }}>
            We are preparing the webinar... grab a notepad and pen while you wait!
          </p>

          <hr style={{ width: '60%', margin: '20px auto', borderColor: '#ccc' }} />

          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '18px',
            color: '#2E2E2E',
            marginTop: '20px',
            textAlign: 'center',
            fontWeight: 500
          }}>
            <strong>You will learn...</strong>
          </p>
          <ul style={{
            fontFamily: 'Montserrat, sans-serif',
            listStyleType: 'disc',
            color: '#2E2E2E',
            paddingLeft: '1.5rem',
            marginTop: '10px'
          }}>
            <li>How PrognosticAI personalizes your marketing funnels</li>
            <li>Tips for advanced retargeting strategies</li>
            <li>Free resources to scale your funnel</li>
          </ul>

          <a href="https://prognostic.ai"
             style={{
               marginTop: '20px',
               display: 'inline-block',
               padding: '8px 16px',
               backgroundColor: '#0142ac',
               color: 'white',
               borderRadius: '5px',
               textDecoration: 'none',
               fontWeight: 700,
               fontSize: '14px'
             }}
             target="_blank" 
             rel="noopener noreferrer"
          >
            Powered by PrognosticAI
          </a>
        </div>
      </div>

      {/* RIGHT Column: Chat */}
      <div style={{flex: '1 1 400px', minWidth: '300px'}}>
        {/* Chat container */}
        <div className="chat-section" style={{
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          height: '750px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
          <div className="chat-header" style={{
            padding: '12px 15px',
            background: '#0142AC',
            color: 'white',
            flex: '0 0 auto',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}>
            <div className="header-top" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span className="chat-title" style={{fontSize: '0.85rem', fontWeight: 600}}>Live Chat</span>
              <div className="toggle-container" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <label className="toggle-switch" style={{position: 'relative', display: 'inline-block', width: '40px', height: '20px'}}>
                  <input 
                    type="checkbox"
                    style={{opacity: 0, width: 0, height: 0}}
                    checked={showParticipantMsgs}
                    onChange={toggleParticipantMessages}
                    id="participantToggle"
                  />
                  <span className="toggle-slider" style={{
                    position: 'absolute', cursor: 'pointer', top:0, left:0, right:0, bottom:0,
                    backgroundColor: showParticipantMsgs ? '#4CAF50' : 'rgba(255,255,255,0.2)',
                    transition: '.4s', borderRadius: '20px'
                  }} />
                  <span style={{
                    position:'absolute', content:'""', height:'16px', width:'16px', left:'2px', bottom:'2px',
                    backgroundColor:'white', transition:'.4s', borderRadius:'50%',
                    transform: showParticipantMsgs ? 'translateX(20px)' : 'translateX(0)'
                  }} />
                </label>
                <span className="toggle-label" style={{color:'white', fontSize:'0.45rem'}}>
                  Show Others
                </span>
              </div>
              <span className="viewer-count" style={{
                fontSize:'0.55rem', background:'rgba(255,255,255,0.1)', padding:'4px 10px', borderRadius:'20px',
                display:'flex', alignItems:'center', gap:'5px'
              }}>
                <i>👥</i>
                <span id="viewerCount">{viewerCount} waiting</span>
              </span>
            </div>
          </div>

          <div 
            className="chat-messages" 
            id="chatMessages"
            style={{
              flex:'1 1 auto', overflowY:'auto', padding:'15px', background:'#f8f9fa', minHeight:0
            }}
            ref={chatMessagesRef}
            onScroll={handleChatScroll}
          >
            {messages.map((msg, idx) => {
              // If it's from others and "Show Others" is off, hide it
              const isParticipantMsg = (msg.type === 'user' && msg.user !== 'You');
              if (isParticipantMsg && !showParticipantMsgs) return null;

              // color-coded classes
              let className = 'message ' + msg.type;
              return (
                <div key={idx} className={className} style={{
                  marginBottom:'10px', lineHeight:'1.4', fontSize:'0.85rem',
                  padding:'8px 12px', borderRadius:'6px', maxWidth:'90%',
                  animation:'fadeIn 0.3s ease', textAlign:'left',
                  marginLeft: (msg.type==='user' && msg.user==='You') ? 'auto' : undefined,
                  background: msg.type==='user'
                    ? (msg.user==='You' ? '#f0f2f5' : '#fff')
                    : (msg.type==='host' ? '#e7f0ff' : '#fff3cd'),
                  color: msg.type==='host' ? '#0142AC'
                    : (msg.type==='system' ? '#856404'
                      : (msg.user==='You' ? '#2c3135' : '#2c3135')),
                  fontWeight: msg.type==='host' ? 500 : 400,
                  textAlign: msg.type==='system' ? 'center' : 'left',
                }}>
                  {msg.user 
                    ? `${msg.user}: ${msg.text}`
                    : msg.text}
                </div>
              );
            })}
          </div>

          <div className="chat-input" style={{
            padding:'15px', background:'#fff', borderTop:'1px solid #eee', flex:'0 0 auto'
          }}>
            <input 
              ref={messageInputRef}
              type="text"
              placeholder="Type your message here..."
              style={{
                width:'100%', padding:'12px', border:'1px solid #dfe3e8', borderRadius:'6px',
                fontSize:'0.9rem', transition:'all 0.3s ease', color:'#2c3135',
                outline:'none'
              }}
              onKeyPress={handleSendMessage}
            />
            {/* You had typingIndicator before; optionally add that <div> if you want */}
          </div>
        </div>
      </div>
    </div>
  );
};

/** 
 * Helper to format the countdown (in seconds)
 * into mm:ss or X minutes and X seconds 
 */
function formatTime(secondsTotal: number): string {
  const m = Math.floor(secondsTotal / 60);
  const s = secondsTotal % 60;
  if (m > 0) {
    return `${m} minute${m !== 1 ? 's' : ''} and ${s} second${s !== 1 ? 's' : ''}`;
  } else {
    return `${s} second${s !== 1 ? 's' : ''}`;
  }
}

export default WaitingRoom;

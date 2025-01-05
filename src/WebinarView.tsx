/* WebinarView.module.css */

/* =============================== */
/* 1) "Connecting you now..." overlay */
/* =============================== */
.connectingOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0142ac; 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.connectingBox {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 40px 60px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.connectingText {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  color: #0142ac;
  font-weight: 700;
}

/* =============================== */
/* 2) Container around everything */
/* =============================== */
.container {
  width: 100%;
  max-width: 1400px; 
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

/* =============================== */
/* 3) Banner row (LIVE label, etc.) */
/* =============================== */
.bannerRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.banner {
  padding: 12px 15px;
  background: #0142ac;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}
.liveMinutes {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: white;
  background: #0142ac;
  padding: 6px 12px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

/* "LIVE" dot animation */
.liveIndicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}
.liveDot {
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%   { opacity: 1; }
  50%  { opacity: 0.5; }
  100% { opacity: 1; }
}

/* =============================== */
/* 4) Two-column layout: video left, chat right */
/* =============================== */
.twoColumnLayout {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.videoColumn {
  flex: 0 0 70%;
  max-width: 70%;
  display: flex;
  flex-direction: column;
}
.chatColumn {
  flex: 0 0 30%;
  max-width: 30%;
  display: flex;
  flex-direction: column;
}

/* The video wrapper: fill area, keep background black */
.videoWrapper {
  position: relative;
  background: #000;
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
}

/* =============================== */
/* 5) Sound overlay if user hasn't interacted */
/* =============================== */
.soundOverlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  z-index: 4;
}
.soundIcon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  opacity: 0.9;
}
.soundText {
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.9;
}

/* =============================== */
/* 6) The "exit intent" overlay */
/* 
   We add a fadeIn animation to make it appear smoothly
   Also, user can close by clicking anywhere outside bubble.
*/
/* =============================== */
.exitOverlay {
  position: fixed;
  top: 0; 
  left: 0; 
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.25s ease;
  cursor: pointer; /* so user knows they can click outside */
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* iPhone-like bubble for the exit message */
.iphoneMessageBubble {
  position: relative;
  max-width: 80%;
  background: #0a84ff; /* iMessage blue in iOS14+ */
  color: #fff;
  border-radius: 18px;
  padding: 14px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  animation: bubblePop 0.35s ease-out;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  cursor: auto; /* bubble itself not closing on click */
}
.iphoneSender {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}
.iphoneMessageText {
  font-size: 1rem;
  line-height: 1.4;
  white-space: pre-line;
}
.iphoneMessageBubble::before {
  content: "";
  position: absolute;
  left: -10px;
  bottom: 20px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: #0a84ff;
}
@keyframes bubblePop {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  55% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* The "X" close button in top-right */
.exitCloseBtn {
  position: absolute;
  top: 6px;
  right: 12px;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  color: #fff;
  opacity: 0.9;
}

/* =============================== */
/* 7) Responsive adjustments */
/* =============================== */
@media (max-width: 900px) {
  .container {
    max-width: 100%;
    padding: 10px;
  }
  .twoColumnLayout {
    flex-direction: column;
  }
  .videoColumn,
  .chatColumn {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* =============================== */
/* 8) Chatbox CSS (unchanged) */
/* =============================== */
.chatSection {
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 750px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.chatHeader {
  padding: 12px 15px;
  background: #0142AC;
  color: #fff;
  flex: 0 0 auto;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.headerTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chatTitle {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.toggleContainer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px;
}
.toggleSwitch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}
.toggleSwitch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggleSlider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(255,255,255,0.2);
  transition: .4s;
  border-radius: 20px;
}
.toggleSlider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: #fff;
  transition: .4s;
  border-radius: 50%;
}
.toggleSwitch input:checked + .toggleSlider {
  background-color: #4CAF50;
}
.toggleSwitch input:checked + .toggleSlider:before {
  transform: translateX(20px);
}
.toggleLabel {
  color: #fff;
  font-size: 0.45rem;
}
.viewerCount {
  font-size: 0.55rem;
  background: rgba(255,255,255,0.1);
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Special Offer section */
.specialOffer {
  background: #ff4444;
  color: #fff;
  padding: 12px 15px;
  text-align: center;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: -0.02em;
  display: none;
  flex: 0 0 auto;
}
.investButton {
  background: #0142AC;
  color: #fff;
  border: none;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  letter-spacing: -0.02em;
  width: 100%;
  margin-top: 10px;
  border-radius: 6px;
}
.investButton:hover {
  background: #013289;
}

/* Chat messages */
.chatMessages {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 15px;
  background: #f8f9fa;
  min-height: 0;
}

/* Actual messages with different roles */
.message {
  margin-bottom: 10px;
  line-height: 1.4;
  animation: fadeIn 0.3s ease;
  font-size: 0.85rem;
  padding: 8px 12px;
  border-radius: 6px;
  max-width: 90%;
  text-align: left;
}
.message.user {
  background: #f0f2f5;
  margin-left: auto;
  color: #2c3135;
}
.message.host {
  background: #e7f0ff;
  color: #0142AC;
  font-weight: 500;
}
.message.system {
  background: #fff3cd;
  color: #856404;
  text-align: center;
  max-width: 100%;
  margin: 15px 0;
  font-size: 0.85rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Input area */
.chatInput {
  padding: 15px;
  background: #fff;
  border-top: 1px solid #eee;
  flex: 0 0 auto;
}
.chatInput input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dfe3e8;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  color: #2c3135;
}
.chatInput input:focus {
  outline: none;
  border-color: #0142AC;
  box-shadow: 0 0 0 2px rgba(1,66,172,0.1);
}
.typingIndicator {
  color: #6c757d;
  font-size: 0.85rem;
  margin-top: 8px;
  font-style: italic;
  height: 20px;
  padding-left: 2px;
}

/* Notification popup (somebody invested) */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
  z-index: 100;
  font-size: 0.9rem;
  max-width: 300px;
}
@keyframes slideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
@keyframes fadeOut {
  to { opacity: 0; }
}
.notificationIcon {
  background: #0142AC;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}

/* Custom scrollbar on chat messages */
.chatMessages::-webkit-scrollbar {
  width: 8px;
}
.chatMessages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.chatMessages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
.chatMessages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

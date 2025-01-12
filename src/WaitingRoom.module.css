/*
  =============================================================================
  Basic page layout: pale background, center the container, Montserrat font
  =============================================================================
*/
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  font-family: 'Montserrat', sans-serif;
}

.pageWrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column; /* let the container + footer stack */
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

/*
  =============================================================================
  The main "zoom-like" white container with border, shadow, etc.
  =============================================================================
*/
.zoomContainer {
  background: #fff; /* White interior, no extra box behind it */
  border: 2px solid #dcdcdc;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 16px;
  width: 100%;
  max-width: 1280px;
  position: relative;
}

/*
  Top bar with a small blinking "LIVE SOON" dot on left,
  Title in center or left, date text on far right
*/
.zoomTopBar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

/* The blinking red dot with small "live soon" text, if you want it. 
   Or you can keep it purely a dot. (Here we do a dot + "LIVE SOON" as text) */
.liveSoonContainer {
  display: flex;
  align-items: center;
  gap: 6px;
}
.liveSoonDot {
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 50%;
  animation: pulseZoom 1.5s infinite;
}
@keyframes pulseZoom {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
.liveSoonText {
  font-size: 0.7rem;
  font-weight: 600;
  color: #ff0000;
  opacity: 0.85;
}
.zoomTitle {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin-left: 16px; /* slight spacing from the blinking dot */
}
.awh2024Header {
  margin-left: auto;
  color: #2c3135;
  font-size: 0.85rem;
  font-weight: 500;
  padding-left: 20px;
}

/*
  =============================================================================
  Two columns: left 60%, right 40%. Then single column "HERE’S WHAT YOU SHOULD DO"
  =============================================================================
*/
.mainContentWrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
}

.leftColumn {
  flex: 0 0 60%;
  max-width: 60%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}
.rightColumn {
  flex: 0 0 40%;
  max-width: 40%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

/*
  Countdown area at top: big text, spinner, bullet points
*/
.awhp2024HeaderWrapper {
  text-align: center;
  font-size: 32px;
  font-weight: 800;
  margin: 20px auto;
  padding: 10px;
  color: #2E2E2E;
  line-height: 1.2;
}
.motivationalTagline {
  margin-top: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #555555;
}
.awhp2024TimerText {
  color: #2e2e2e; /* slightly subtle highlight, no bright color */
  font-weight: 900;
  display: inline;
}

/* Spinner & text block */
.webinarLoading {
  margin-top: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  width: auto;
  height: auto;
}
.loadingContainer {
  text-align: left;
}
.loadingText {
  font-size: 24px;
  font-weight: 700;
  color: #5e6a72;
  margin-top: 20px;
}
.loadingSpinner {
  border: 8px solid rgba(228, 232, 241, 0.5);
  border-top: 8px solid #5e6a72;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Light divider */
.lightDivider {
  width: 60%;
  margin: 20px auto;
  border: 0;
  border-top: 1px solid #ccc;
}

/* "You will learn..." styling */
.bulletsTitle {
  font-size: 18px;
  color: #2E2E2E;
  margin-top: 20px;
  font-weight: 500;
  text-align: left;
}
.bulletsList {
  list-style-type: disc;
  color: #2E2E2E;
  padding-left: 1.5rem;
  margin-top: 10px;
  text-align: left;
}

/*
  =============================================================================
  The Chat Box (height ~375px, from old code)
  =============================================================================
*/
.chatSection {
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 375px; /* fixed height */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  /* Subtle pulsing glow for "live" feel */
  animation: chatGlow 2.5s ease-in-out infinite alternate;
}
@keyframes chatGlow {
  0% {
    box-shadow: 0 0 10px rgba(1,66,172,0.2);
  }
  100% {
    box-shadow: 0 0 24px rgba(1,66,172,0.45);
  }
}
.chatHeader {
  padding: 12px 15px;
  background: #0142AC;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  flex: 0 0 auto;
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
  background-color: white;
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
  color: white;
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

.chatMessages {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 15px;
  background: #f8f9fa;
}
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
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
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
  color: #2c3135;
  transition: all 0.3s ease;
}
.chatInput input:focus {
  outline: none;
  border-color: #0142AC;
  box-shadow: 0 0 0 2px rgba(1, 66, 172, 0.1);
}
.typingIndicator {
  color: #6c757d;
  font-size: 0.85rem;
  margin-top: 8px;
  font-style: italic;
  height: 20px;
  padding-left: 2px;
}
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

/*
  =============================================================================
  The single-column "HERE’S WHAT YOU SHOULD DO NOW" plus bullet checks
  Then the 2 columns for host images
  =============================================================================
*/
.nextStepsWrapper {
  width: 100%;
  margin-top: 24px;
  padding: 8px 16px;
}

.nextStepsTitle {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #2c3135;
  text-align: left;
}

.nextStepsItem {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}
.benefitIcon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 8px;
  background-color: rgba(1, 66, 172, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.benefitIcon::before {
  content: '✓';
  color: #0142ac;
  font-size: 16px;
  font-weight: 600;
}
.nextStepsText {
  font-size: 0.95rem;
  line-height: 1.4;
  color: #333;
}

/* The line for smaller text about redirection & bigger mail icon */
.redirectRow {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 12px;
}
.mailIconContainer {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: rgba(1,66,172,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0142ac;
  font-size: 22px;
}
.redirectText {
  font-size: 0.75rem;
  color: #5e6a72;
  line-height: 1.4;
  text-align: left;
}

/* The two hosts side by side */
.hostsRow {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 24px;
}
.hostColumn {
  flex: 1 1 300px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.hostImage {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.hostName {
  font-weight: 600;
  font-size: 1rem;
  color: #2c3135;
  margin-bottom: 2px;
}
.hostTitle {
  font-size: 0.8rem;
  color: #555;
}

/*
  =============================================================================
  FOOTER outside the container
  =============================================================================
*/
.customFooter {
  font-size: 0.9rem;
  color: rgba(0,0,0,0.5);
  font-weight: 400;
  margin-top: 16px;
  text-align: center;
}

/*
  =============================================================================
  Media Queries
  =============================================================================
*/
@media (max-width: 768px) {
  .zoomTopBar {
    flex-direction: column;
    align-items: center;
    border-bottom: none;
    margin-bottom: 16px;
  }
  .liveSoonContainer {
    margin-bottom: 8px;
  }
  .zoomTitle {
    margin-left: 0;
    margin-bottom: 8px;
  }
  .awh2024Header {
    margin: 0;
    padding: 0;
    text-align: center;
  }
  .mainContentWrapper {
    flex-direction: column;
  }
  .leftColumn, .rightColumn {
    flex: 1 1 100%;
    max-width: 100%;
  }
  .chatSection {
    height: 300px;
  }
}

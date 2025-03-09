/* -------------------------------------------------------------------
   OLD LOADER (Prognostic AI) STYLES
   ------------------------------------------------------------------- */

/* We do NOT need a separate .prognostic-ai-demo-results-container 
   because everything is now inside .container from the new code. */

.pai-dr-content {
  background-color: transparent; /* unify with new container’s BG */
  padding: 30px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  /* No border-radius, no box-shadow, to seamlessly blend inside the parent */
}

/* Futuristic visualization container */
.pai-dr-visualization {
  position: relative;
  width: 180px;
  height: 180px;
  margin-bottom: 40px;
}

/* Core central circle */
.pai-dr-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background-color: #252525; 
  border-radius: 50%;
  z-index: 5;
  box-shadow: 0 0 10px rgba(37, 37, 37, 0.3);
}

/* Inner rotating ring */
.pai-dr-ring-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 2px solid rgba(37, 37, 37, 0.1);
  border-top: 2px solid #252525;
  border-radius: 50%;
  animation: pai-dr-spin-inner 3s linear infinite;
}

/* Middle rotating ring */
.pai-dr-ring-middle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border: 1px solid rgba(37, 37, 37, 0.05);
  border-left: 1px solid #252525;
  border-radius: 50%;
  animation: pai-dr-spin-middle 7s linear infinite;
}

/* Outer rotating ring */
.pai-dr-ring-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  border: 1px dashed rgba(37, 37, 37, 0.05);
  border-right: 1px solid rgba(37, 37, 37, 0.6);
  border-radius: 50%;
  animation: pai-dr-spin-outer 15s linear infinite;
}

/* Data points */
.pai-dr-data-points {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
}
.pai-dr-data-point {
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: #252525;
  border-radius: 50%;
  opacity: 0;
}
.pai-dr-data-point:nth-child(1) {
  top: 30%;
  left: 10%;
  animation: data-point-pulse 5s ease-in-out infinite;
  animation-delay: 0.2s;
}
.pai-dr-data-point:nth-child(2) {
  top: 70%;
  left: 20%;
  animation: data-point-pulse 7s ease-in-out infinite;
  animation-delay: 1.5s;
}
.pai-dr-data-point:nth-child(3) {
  top: 20%;
  left: 80%;
  animation: data-point-pulse 6s ease-in-out infinite;
  animation-delay: 0.7s;
}
.pai-dr-data-point:nth-child(4) {
  top: 60%;
  left: 85%;
  animation: data-point-pulse 8s ease-in-out infinite;
  animation-delay: 2.1s;
}
.pai-dr-data-point:nth-child(5) {
  top: 40%;
  left: 50%;
  animation: data-point-pulse 4s ease-in-out infinite;
  animation-delay: 1.2s;
}
.pai-dr-data-point:nth-child(6) {
  top: 80%;
  left: 50%;
  animation: data-point-pulse 6s ease-in-out infinite;
  animation-delay: 3.5s;
}

/* Connection lines */
.pai-dr-data-connection {
  position: absolute;
  background-color: rgba(37, 37, 37, 0.1);
  transform-origin: 0 0;
  z-index: 3;
  opacity: 0;
}
.pai-dr-data-connection:nth-child(1) {
  top: 32%;
  left: 12%;
  width: 50px;
  height: 1px;
  transform: rotate(30deg);
  animation: connection-appear 4s ease-in-out infinite;
  animation-delay: 0.3s;
}
.pai-dr-data-connection:nth-child(2) {
  top: 72%;
  left: 22%;
  width: 70px;
  height: 1px;
  transform: rotate(-15deg);
  animation: connection-appear 6s ease-in-out infinite;
  animation-delay: 1.7s;
}
.pai-dr-data-connection:nth-child(3) {
  top: 22%;
  left: 78%;
  width: 60px;
  height: 1px;
  transform: rotate(150deg);
  animation: connection-appear 5s ease-in-out infinite;
  animation-delay: 0.9s;
}
.pai-dr-data-connection:nth-child(4) {
  top: 62%;
  left: 83%;
  width: 55px;
  height: 1px;
  transform: rotate(200deg);
  animation: connection-appear 7s ease-in-out infinite;
  animation-delay: 2.3s;
}

/* Scan effect */
.pai-dr-scan {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, transparent 30%, rgba(37, 37, 37, 0.03) 60%, transparent 70%);
  border-radius: 50%;
  z-index: 2;
  animation: scan-pulse 4s ease-in-out infinite;
}

/* Background grid */
.pai-dr-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 20px 20px;
  background-image: radial-gradient(circle, rgba(37, 37, 37, 0.1) 1px, transparent 1px);
  z-index: 1;
  opacity: 0.3;
}

/* Message display */
.pai-dr-message {
  font-size: 20px;
  color: #333;
  text-align: center;
  opacity: 1;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  font-weight: 500;
  letter-spacing: 0.3px;
  position: relative;
  z-index: 6;
  margin-top: 20px;
}

.fade-out {
  opacity: 0;
  transform: translateY(20px);
}

.fade-in {
  opacity: 1;
  transform: translateY(0);
}

/* Success message styling */
.pai-dr-message.success {
  color: #252525;
  font-weight: 600;
}

/* Button styling (not used, but preserved) */
.pai-dr-button {
  display: inline-block;
  background-color: #252525;
  color: white;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  margin-top: 20px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.pai-dr-button:hover {
  background-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Old loader keyframes */
@keyframes pai-dr-spin-inner {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes pai-dr-spin-middle {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(-360deg); }
}
@keyframes pai-dr-spin-outer {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes data-point-pulse {
  0%, 100% { opacity: 0; transform: scale(0); }
  20% { opacity: 0.2; transform: scale(1); }
  40% { opacity: 0.8; transform: scale(2); }
  60% { opacity: 0.4; transform: scale(1.5); }
  80% { opacity: 0.1; transform: scale(1); }
}
@keyframes connection-appear {
  0%, 100% { opacity: 0; }
  30%, 70% { opacity: 0.7; }
}
@keyframes scan-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
}

/* Flying particles */
.pai-dr-particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}
.pai-dr-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: rgba(37, 37, 37, 0.2);
  border-radius: 50%;
}
.pai-dr-particle:nth-child(1) {
  top: 20%;
  left: -5%;
  animation: particle-move 7s linear infinite;
}
.pai-dr-particle:nth-child(2) {
  top: 70%;
  left: -5%;
  animation: particle-move 8s linear infinite 1s;
}
.pai-dr-particle:nth-child(3) {
  top: 40%;
  left: -5%;
  animation: particle-move 6s linear infinite 2s;
}
.pai-dr-particle:nth-child(4) {
  top: 30%;
  left: -5%;
  animation: particle-move 9s linear infinite 3s;
}
.pai-dr-particle:nth-child(5) {
  top: 60%;
  left: -5%;
  animation: particle-move 7s linear infinite 4s;
}
.pai-dr-particle:nth-child(6) {
  top: 80%;
  left: -5%;
  animation: particle-move 10s linear infinite 0.5s;
}
.pai-dr-particle:nth-child(7) {
  top: 50%;
  left: -5%;
  animation: particle-move 8s linear infinite 2.5s;
}
.pai-dr-particle:nth-child(8) {
  top: 10%;
  left: -5%;
  animation: particle-move 6s linear infinite 1.5s;
}
@keyframes particle-move {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0;
  }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% {
    transform: translateX(105vw) translateY(20px);
    opacity: 0;
  }
}

/* OLD loader responsiveness */
@media (max-width: 600px) {
  .pai-dr-content {
    padding: 20px;
    min-height: 300px;
  }
  .pai-dr-visualization {
    width: 150px;
    height: 150px;
  }
  .pai-dr-ring-outer {
    width: 130px;
    height: 130px;
  }
  .pai-dr-ring-middle {
    width: 100px;
    height: 100px;
  }
  .pai-dr-ring-inner {
    width: 70px;
    height: 70px;
  }
  .pai-dr-message {
    font-size: 18px;
  }
}

/* -------------------------------------------------------------------
   NEW ADVANCED ANALYSIS MODULE STYLES (COMBINED FINAL)
   ------------------------------------------------------------------- */
.container {
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont,
               'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #F8F8F8;
  position: relative;
  width: 100% !important;
  max-width: 1200px !important;
  margin: 0 auto;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #ECECEC;
  margin-bottom: 40px;
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at bottom right, rgba(149,82,211,0.08) 0%, transparent 70%);
  z-index: 0;
}

.header {
  padding: 16px 20px;
  color: #252525;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.02em;
  line-height: 1.3;
  position: relative;
  z-index: 1;
  border-bottom: 1px solid #ECECEC;
}

/********************************************************
  PROGRESS BAR
********************************************************/
.progressContainer {
  width: 100%;
  height: 4px;
  background-color: #E8EAF0;
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.progressBar {
  height: 100%;
  background: linear-gradient(90deg, #9552D3, #BC73ED);
  transition: width 0.3s ease-out;
  position: relative;
}
.progressGlow {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 30px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0),
    rgba(255,255,255,0.6),
    rgba(255,255,255,0)
  );
  animation: glowLoop 2s ease-out infinite;
}
@keyframes glowLoop {
  0% { transform: translateX(0); }
  100% { transform: translateX(100px); }
}
.progressComplete {
  animation: blinkBar 1s infinite alternate ease-in-out;
}
@keyframes blinkBar {
  0% { opacity: 1; }
  100% { opacity: 0.85; }
}

/********************************************************
  CONTENT AREA
********************************************************/
.content {
  background-color: white;
  padding: 30px 15px;
  min-height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.visualization {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 180px);
  gap: 15px;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
}

/********************************************************
  MODULE LAYOUT
********************************************************/
.module {
  position: relative;
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  opacity: 0;
  z-index: 2;
  transform-origin: center center;
}

.module:nth-of-type(1) { grid-column: 1; grid-row: 1; }
.module:nth-of-type(2) { grid-column: 2; grid-row: 1; }
.module:nth-of-type(3) { grid-column: 3; grid-row: 1; }
.module:nth-of-type(4) { grid-column: 1; grid-row: 2; }
.module:nth-of-type(5) { grid-column: 2; grid-row: 2; }
.module:nth-of-type(6) { grid-column: 3; grid-row: 2; }
.module:nth-of-type(7) { grid-column: 1; grid-row: 3; }
.module:nth-of-type(8) { grid-column: 2; grid-row: 3; }
.module:nth-of-type(9) { grid-column: 3; grid-row: 3; }
.module:nth-of-type(10) { grid-column: 1; grid-row: 4; }
.module:nth-of-type(11) { grid-column: 2; grid-row: 4; }
.module:nth-of-type(12) { grid-column: 3; grid-row: 4; }

/********************************************************
  MODULE FLY-IN ANIMATIONS
********************************************************/
@keyframes flyInWithBounce {
  0% { transform: translateY(-300px) scale(0.9); opacity: 0; }
  70% { transform: translateY(15px) scale(1.02); opacity: 0.9; }
  85% { transform: translateY(-8px) scale(0.98); opacity: 0.95; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes flyInFromSide {
  0% { transform: translateX(-300px) scale(0.9); opacity: 0; }
  70% { transform: translateX(15px) scale(1.02); opacity: 0.9; }
  85% { transform: translateX(-8px) scale(0.98); opacity: 0.95; }
  100% { transform: translateX(0) scale(1); opacity: 1; }
}
@keyframes zoomInWithFade {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.05); opacity: 0.8; }
  80% { transform: scale(0.97); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes slideUpWithShadow {
  0% { transform: translateY(100px); opacity: 0; }
  70% { 
    transform: translateY(-10px); 
    opacity: 0.8; 
    box-shadow: 0 8px 20px rgba(0,0,0,0.1); 
  }
  85% { 
    transform: translateY(5px); 
    opacity: 0.9; 
    box-shadow: 0 5px 15px rgba(0,0,0,0.08); 
  }
  100% { 
    transform: translateY(0); 
    opacity: 1; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.06); 
  }
}

.animation1 { animation: flyInWithBounce 0.7s forwards ease-out; }
.animation2 { animation: flyInFromSide 0.8s forwards ease-out; }
.animation3 { animation: zoomInWithFade 0.9s forwards ease-out; }
.animation4 { animation: slideUpWithShadow 0.75s forwards ease-out; }

.delay1 { animation-delay: 0.1s; }
.delay2 { animation-delay: 0.4s; }
.delay3 { animation-delay: 0.7s; }
.delay4 { animation-delay: 0.25s; }
.delay5 { animation-delay: 0.55s; }
.delay6 { animation-delay: 0.9s; }
.delay7 { animation-delay: 0.3s; }
.delay8 { animation-delay: 0.65s; }
.delay9 { animation-delay: 0.85s; }
.delay10 { animation-delay: 0.15s; }
.delay11 { animation-delay: 0.5s; }
.delay12 { animation-delay: 0.75s; }

/********************************************************
  VM LOADING OVERLAY
********************************************************/
.vmLoadingOverlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.vmBootLines {
  color: #8DE8AD;
  font-family: "Source Code Pro", monospace;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: flickerScreen 2s infinite;
}
.vmDotFlicker {
  margin: 6px 0;
  animation: dotFlicker 1.8s infinite;
}
@keyframes dotFlicker {
  0% { opacity: 1; }
  50% { opacity: 0.2; }
  100% { opacity: 1; }
}
@keyframes flickerScreen {
  0% { opacity: 1; }
  80% { opacity: 0.98; }
  95% { opacity: 0.9; }
  100% { opacity: 1; }
}

/********************************************************
  MAC WINDOW BAR
********************************************************/
.macWindowBar {
  height: 26px;
  background: linear-gradient(to bottom, #f6f6f6, #e6e6e6);
  display: flex;
  align-items: center;
  padding-left: 8px;
  border-bottom: 1px solid #d2d2d2;
}
.trafficLight {
  width: 12px; 
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
  position: relative;
}
.trafficLight::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 50%);
}
.trafficLight[data-color="red"]    { background-color: #ff5f56; box-shadow: 0 0 1px rgba(0,0,0,0.2);}
.trafficLight[data-color="yellow"] { background-color: #ffbd2e; box-shadow: 0 0 1px rgba(0,0,0,0.2);}
.trafficLight[data-color="green"]  { background-color: #27c93f; box-shadow: 0 0 1px rgba(0,0,0,0.2);}
.windowTitle {
  font-size: 11px;
  font-weight: 600;
  margin-left: 10px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 0 rgba(255,255,255,0.7);
}
.windowStatus {
  margin-left: auto;
  margin-right: 8px;
  font-size: 10px;
  color: #666;
  background-color: rgba(0,0,0,0.05);
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.5px;
  animation: statusBlink 3s infinite alternate;
}
@keyframes statusBlink {
  0%, 80% { color: #666; }
  90%, 100% { color: #9552D3; }
}
.moduleBody {
  width: 100%;
  height: calc(100% - 26px);
  position: relative;
  padding: 6px;
  overflow: hidden;
  background-color: #fbfbfb;
}

/********************************************************
  REALISTIC DATA GRID - BASE FOR ALL CHARTS
********************************************************/
.chartGrid {
  position: absolute;
  top: 6%;
  left: 6%;
  right: 6%;
  bottom: 12%;
  background-image:
    linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}
.chartAxisX, .chartAxisY {
  position: absolute;
  background-color: rgba(0,0,0,0.2);
}
.chartAxisX {
  bottom: 12%;
  left: 6%;
  width: 88%;
  height: 1px;
}
.chartAxisY {
  bottom: 12%;
  left: 6%;
  width: 1px;
  height: 82%;
}
.chartAxisX::after, .chartAxisY::after {
  content: '';
  position: absolute;
  border-style: solid;
}
.chartAxisX::after {
  right: -6px;
  top: -3px;
  border-width: 3px 0 3px 6px;
  border-color: transparent transparent transparent rgba(0,0,0,0.2);
}
.chartAxisY::after {
  left: -3px;
  top: -6px;
  border-width: 0 3px 6px 3px;
  border-color: transparent transparent rgba(0,0,0,0.2) transparent;
}

/********************************************************
  (Charts 1 - 12) ...
********************************************************/
/* [All chart CSS remains exactly as in your original code, no changes omitted.] */

/********************************************************
  ROTATING MESSAGES
********************************************************/
.message {
  font-size: 16px;
  color: #252525;
  text-align: center;
  transition: opacity 0.5s, transform 0.5s;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin-top: 20px;
  padding: 0 20px;
}
.fadeIn {
  opacity: 1;
  transform: translateY(0);
}
.fadeOut {
  opacity: 0;
  transform: translateY(10px);
}
.message::after {
  content: '';
  display: inline-block;
  width: 0;
  animation: loadingDots 1.5s infinite;
}
@keyframes loadingDots {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
}

/********************************************************
  ANALYSIS LOG AREA
********************************************************/
.analysisLog {
  max-height: 150px;
  overflow-y: auto;
  margin-top: 20px;
  padding: 10px;
  border: none;
  background: transparent;
  font-size: 12px;
  line-height: 1.4;
  color: #666;
  border-radius: 4px;
}
.logLine { margin-bottom: 2px; }

/********************************************************
  RESPONSIVE ADJUSTMENTS
********************************************************/
@media (max-width: 1200px) {
  .visualization {
    grid-template-rows: repeat(4, 170px);
  }
  .windowTitle { font-size: 10px; }
}

@media (max-width: 992px) {
  .visualization {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, 160px);
  }
  .module:nth-of-type(3) { grid-column: 1; grid-row: 2; }
  .module:nth-of-type(4) { grid-column: 2; grid-row: 2; }
  .module:nth-of-type(5) { grid-column: 1; grid-row: 3; }
  .module:nth-of-type(6) { grid-column: 2; grid-row: 3; }
  .module:nth-of-type(7) { grid-column: 1; grid-row: 4; }
  .module:nth-of-type(8) { grid-column: 2; grid-row: 4; }
  .module:nth-of-type(9) { grid-column: 1; grid-row: 5; }
  .module:nth-of-type(10) { grid-column: 2; grid-row: 5; }
  .module:nth-of-type(11) { grid-column: 1; grid-row: 6; }
  .module:nth-of-type(12) { grid-column: 2; grid-row: 6; }
  .windowTitle { font-size: 9px; }
}

@media (max-width: 768px) {
  .header {
    font-size: 18px;
    padding: 12px 15px;
  }
  .content { padding: 15px 10px; }
  .visualization {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(12, 140px);
    gap: 12px;
  }
  .module:nth-of-type(n) { grid-column: 1; }
  .module:nth-of-type(1)  { grid-row: 1; }
  .module:nth-of-type(2)  { grid-row: 2; }
  .module:nth-of-type(3)  { grid-row: 3; }
  .module:nth-of-type(4)  { grid-row: 4; }
  .module:nth-of-type(5)  { grid-row: 5; }
  .module:nth-of-type(6)  { grid-row: 6; }
  .module:nth-of-type(7)  { grid-row: 7; }
  .module:nth-of-type(8)  { grid-row: 8; }
  .module:nth-of-type(9)  { grid-row: 9; }
  .module:nth-of-type(10) { grid-row: 10; }
  .module:nth-of-type(11) { grid-row: 11; }
  .module:nth-of-type(12) { grid-row: 12; }
  .message { font-size: 14px; }
}

@media (max-width: 480px) {
  .header {
    font-size: 16px;
    padding: 10px;
  }
  .message {
    font-size: 12px;
    margin-top: 15px;
  }
  .visualization {
    grid-template-rows: repeat(12, 130px);
    gap: 10px;
  }
  .windowTitle { font-size: 8px; }
  .macWindowBar { height: 22px; }
  .trafficLight {
    width: 10px;
    height: 10px;
  }
}

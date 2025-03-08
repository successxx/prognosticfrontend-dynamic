/********************************************************
  BASE CONTAINER & HEADER
********************************************************/
.container {
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #F8F9FB;
  max-width: 1200px;
  margin: 20px auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.header {
  background-color: #1E1E1E;
  color: white;
  padding: 20px;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
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
}

.progressBar {
  height: 100%;
  background: linear-gradient(90deg, #1E1E1E, #4A4A4A);
  transition: width 0.3s ease-out;
  position: relative;
}

.progressGlow {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 20px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0),
    rgba(255,255,255,0.6),
    rgba(255,255,255,0)
  );
  animation: glowLoop 2s ease-out infinite;
}
@keyframes glowLoop {
  0%   { transform: translateX(0); }
  100% { transform: translateX(100px); }
}

/********************************************************
  CONTENT AREA
********************************************************/
.content {
  background-color: white;
  padding: 30px 15px;
  height: 1200px; /* Increased from 850px */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.visualization {
  position: relative;
  width: 100%;
  height: 1100px; /* ensure more vertical space */
  margin-bottom: 20px;
}

/********************************************************
  MODULE LAYOUT (3 x 4)
********************************************************/
.module {
  position: absolute;
  width: 32%;
  height: 25%; /* from 23% to 25% so there's more vertical space */
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  opacity: 0; /* hidden until animation completes */
}

/* 3 columns × 4 rows, spaced out ~2% between columns */
.module:nth-of-type(1)  { top: 0%;   left: 0%;  }
.module:nth-of-type(2)  { top: 0%;   left: 34%; }
.module:nth-of-type(3)  { top: 0%;   left: 68%; }

.module:nth-of-type(4)  { top: 25%;  left: 0%;  }
.module:nth-of-type(5)  { top: 25%;  left: 34%; }
.module:nth-of-type(6)  { top: 25%;  left: 68%; }

.module:nth-of-type(7)  { top: 50%;  left: 0%;  }
.module:nth-of-type(8)  { top: 50%;  left: 34%; }
.module:nth-of-type(9)  { top: 50%;  left: 68%; }

.module:nth-of-type(10) { top: 75%;  left: 0%;  }
.module:nth-of-type(11) { top: 75%;  left: 34%; }
.module:nth-of-type(12) { top: 75%;  left: 68%; }

/********************************************************
  RANDOMIZED FLY-IN ANIMATIONS
********************************************************/
.flyIn1 {
  animation: randomFly1 0.6s forwards;
}
@keyframes randomFly1 {
  0%   { opacity: 0; transform: translateX(-80px) rotate(-5deg) scale(0.95); }
  100% { opacity: 1; transform: translateX(0) rotate(0deg) scale(1); }
}

.flyIn2 {
  animation: randomFly2 0.6s forwards;
}
@keyframes randomFly2 {
  0%   { opacity: 0; transform: translateX(80px) rotate(3deg) scale(0.9); }
  100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); }
}

.flyIn3 {
  animation: randomFly3 0.6s forwards;
}
@keyframes randomFly3 {
  0%   { opacity: 0; transform: translateY(30px) rotate(-4deg) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
}

.flyIn4 {
  animation: randomFly4 0.6s forwards;
}
@keyframes randomFly4 {
  0%   { opacity: 0; transform: translateX(-100px) rotate(6deg) scale(0.85); }
  100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); }
}

.flyIn5 {
  animation: randomFly5 0.6s forwards;
}
@keyframes randomFly5 {
  0%   { opacity: 0; transform: translate(80px,20px) rotate(-6deg) scale(0.9); }
  100% { opacity: 1; transform: translate(0,0) rotate(0) scale(1); }
}

.flyIn6 {
  animation: randomFly6 0.6s forwards;
}
@keyframes randomFly6 {
  0%   { opacity: 0; transform: translate(-60px,-10px) rotate(8deg) scale(0.95); }
  100% { opacity: 1; transform: translate(0,0) rotate(0) scale(1); }
}

.flyIn7 {
  animation: randomFly7 0.6s forwards;
}
@keyframes randomFly7 {
  0%   { opacity: 0; transform: translateY(50px) rotate(-5deg) scale(0.88); }
  100% { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
}

.flyIn8 {
  animation: randomFly8 0.6s forwards;
}
@keyframes randomFly8 {
  0%   { opacity: 0; transform: translateX(60px) rotate(4deg) scale(0.9); }
  100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); }
}

.flyIn9 {
  animation: randomFly9 0.6s forwards;
}
@keyframes randomFly9 {
  0%   { opacity: 0; transform: translateX(-70px) rotate(-4deg) scale(0.9); }
  100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); }
}

.flyIn10 {
  animation: randomFly10 0.6s forwards;
}
@keyframes randomFly10 {
  0%   { opacity: 0; transform: translate(70px) rotate(5deg) scale(0.85); }
  100% { opacity: 1; transform: translate(0) rotate(0) scale(1); }
}

.flyIn11 {
  animation: randomFly11 0.6s forwards;
}
@keyframes randomFly11 {
  0%   { opacity: 0; transform: translate(-60px,20px) rotate(7deg) scale(0.92); }
  100% { opacity: 1; transform: translate(0,0) rotate(0) scale(1); }
}

.flyIn12 {
  animation: randomFly12 0.6s forwards;
}
@keyframes randomFly12 {
  0%   { opacity: 0; transform: translate(60px,-20px) rotate(-3deg) scale(0.9); }
  100% { opacity: 1; transform: translate(0,0) rotate(0) scale(1); }
}

/********************************************************
  DELAYS (ONE AT A TIME, ~5–6s total)
********************************************************/
.delay0  { animation-delay: 0s; }
.delay1  { animation-delay: 0.5s; }
.delay2  { animation-delay: 1.0s; }
.delay3  { animation-delay: 1.5s; }
.delay4  { animation-delay: 2.0s; }
.delay5  { animation-delay: 2.5s; }
.delay6  { animation-delay: 3.0s; }
.delay7  { animation-delay: 3.5s; }
.delay8  { animation-delay: 4.0s; }
.delay9  { animation-delay: 4.5s; }
.delay10 { animation-delay: 5.0s; }
.delay11 { animation-delay: 5.5s; }

/********************************************************
  MAC WINDOW BAR
********************************************************/
.macWindowBar {
  height: 24px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  padding-left: 8px;
}
.trafficLight {
  width: 12px; 
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
}
.trafficLight[data-color="red"]    { background-color: #ff5f56; }
.trafficLight[data-color="yellow"] { background-color: #ffbd2e; }
.trafficLight[data-color="green"]  { background-color: #27c93f; }

.windowTitle {
  font-size: 11px;
  font-weight: 600;
  margin-left: 10px;
  color: #333;
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
}

.moduleBody {
  width: 100%;
  height: calc(100% - 24px);
  position: relative;
  padding: 6px;
  overflow: hidden;
}

/********************************************************
  1) FUNNEL CHART (Real-Time Overview)
     - Subtle scale and color wave to mimic data flow
********************************************************/
.funnelChart {
  position: relative;
  width: 60%; 
  height: 80%;
  margin: 0 auto;
}
.funnelSegment {
  position: absolute;
  left: 10%; 
  right: 10%;
  height: 15%;
  background-color: #999;
  opacity: 0.85;
  transform-origin: top;
  animation: funnelAnim 5s infinite ease-in-out;
}
@keyframes funnelAnim {
  0%   { transform: scaleX(1); background-color: #999; }
  25%  { transform: scaleX(0.85); background-color: #BDC8D8; }
  50%  { transform: scaleX(0.9); background-color: #3F8EF7; }
  75%  { transform: scaleX(0.8); background-color: #A8B9D4; }
  100% { transform: scaleX(1); background-color: #999; }
}
.funnelSegment[data-level="1"] { top: 0%;  }
.funnelSegment[data-level="2"] { top: 20%; animation-delay: 0.5s; }
.funnelSegment[data-level="3"] { top: 40%; animation-delay: 1s; }
.funnelSegment[data-level="4"] { top: 60%; animation-delay: 1.5s; }

/********************************************************
  2) RADAR CHART (Opportunity Radar)
     - Rotate background + subtle pulsing to mimic scanning
********************************************************/
.radarContainer {
  position: relative;
  width: 90%; 
  height: 90%;
  margin: 0 auto;
}
.radarBackground {
  position: absolute;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(63,142,247,0.1), transparent);
  animation: radarSpin 8s linear infinite;
}
@keyframes radarSpin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.radarArea {
  position: absolute;
  top: 10%; 
  left: 10%;
  width: 80%; 
  height: 80%;
  background-color: rgba(63,142,247,0.1);
  border-radius: 50%;
  animation: radarPulse 3s infinite alternate;
}
@keyframes radarPulse {
  0%   { transform: scale(0.8); }
  100% { transform: scale(1); }
}
.radarDot {
  position: absolute;
  width: 6px; 
  height: 6px;
  border-radius: 50%;
  background-color: #444;
  animation: radarDotBlink 4s infinite;
}
@keyframes radarDotBlink {
  0%, 10% { opacity: 0; }
  50%     { opacity: 1; }
  100%    { opacity: 0.5; }
}
.radarDot[data-dot="1"] { top: 15%; left: 48%; animation-delay: 0.3s; }
.radarDot[data-dot="2"] { top: 60%; left: 75%; animation-delay: 0.8s; }
.radarDot[data-dot="3"] { top: 70%; left: 25%; animation-delay: 1.3s; }
.radarDot[data-dot="4"] { top: 35%; left: 10%; animation-delay: 1.8s; }

/********************************************************
  3) STACKED AREA CHART (Predictive Layers)
     - Gentle vertical shifting/waving
********************************************************/
.stackedArea {
  position: relative;
  width: 100%; 
  height: 100%;
}
.areaLayer {
  position: absolute;
  left: 0; 
  width: 100%;
  height: 33%;
  background-color: #BDC8D8;
  animation: stackedAreaAnim 6s infinite;
}
@keyframes stackedAreaAnim {
  0%   { transform: translateY(0);   }
  20%  { transform: translateY(-8px); background-color: #3F8EF7; }
  40%  { transform: translateY(4px);  background-color: #BDC8D8; }
  60%  { transform: translateY(-6px); background-color: #7FAEFA; }
  80%  { transform: translateY(3px);  background-color: #A7C4F5; }
  100% { transform: translateY(0);   background-color: #BDC8D8; }
}
.areaLayer[data-layer="1"] { top: 0%;  animation-delay: 0.2s; }
.areaLayer[data-layer="2"] { top: 33%; animation-delay: 0.6s; }
.areaLayer[data-layer="3"] { top: 66%; animation-delay: 1s; }

/********************************************************
  4) CHORD DIAGRAM (Comparative Chord)
     - Subtle ring rotation + chord links pulsing
********************************************************/
.chordContainer {
  position: relative;
  width: 70px; 
  height: 70px;
  margin: 5% auto;
}
.chordRing {
  position: absolute;
  width: 70px; 
  height: 70px;
  border: 5px solid #444;
  border-radius: 50%;
  animation: chordSpin 7s linear infinite;
}
@keyframes chordSpin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.chordLink {
  position: absolute;
  width: 2px; 
  height: 70px;
  top: 0; 
  left: 34px;
  background-color: #3F8EF7;
  transform-origin: bottom;
  animation: chordLinkBlink 3s infinite alternate;
}
@keyframes chordLinkBlink {
  0%   { opacity: 0.4; }
  100% { opacity: 1; }
}
.chordLink[data-chord="1"] { transform: rotate(60deg); }
.chordLink[data-chord="2"] { transform: rotate(160deg); }
.chordLink[data-chord="3"] { transform: rotate(280deg); }

/********************************************************
  5) MOVING SCATTER (Multi-Variable Scatter)
     - Gentle drifting to mimic data point movement
********************************************************/
.scatterWrap {
  position: relative;
  width: 100%; 
  height: 100%;
}
.scatterPoint {
  position: absolute;
  width: 8px; 
  height: 8px;
  border-radius: 50%;
  background-color: #666;
  animation: scatterMove 4s infinite;
}
@keyframes scatterMove {
  0%   { transform: translate(0,0); }
  25%  { transform: translate(10px,-5px); background-color: #3F8EF7; }
  50%  { transform: translate(-8px,8px);  background-color: #666;    }
  75%  { transform: translate(8px,5px);   background-color: #7FAEFA; }
  100% { transform: translate(0,0);       background-color: #666;    }
}
.scatterPoint[data-pt="1"] { top: 20%; left: 30%; animation-delay: 0.2s; }
.scatterPoint[data-pt="2"] { top: 60%; left: 70%; animation-delay: 0.6s; }
.scatterPoint[data-pt="3"] { top: 40%; left: 50%; animation-delay: 1s;   }
.scatterPoint[data-pt="4"] { top: 70%; left: 15%; animation-delay: 1.4s; }

/********************************************************
  6) HEATMAP (Correlation Heatmap)
     - Soften color transitions, keep random illusions
********************************************************/
.heatmapGrid {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  grid-gap: 5px;
  width: 90%; 
  height: 90%;
  margin: 0 auto;
}
.heatCell {
  width: 100%; 
  height: 100%;
  background-color: #E8EAF0;
  animation: heatCycle 3s infinite;
}
@keyframes heatCycle {
  0%   { background-color: #E8EAF0; }
  30%  { background-color: #BDC8D8; }
  60%  { background-color: #3F8EF7; }
  100% { background-color: #E8EAF0; }
}

/********************************************************
  7) DONUT CHART (Resource Donut)
     - Gently rotating slices
********************************************************/
.donutChart {
  position: relative;
  width: 60px; 
  height: 60px;
  margin: 10% auto;
  animation: donutSpin 6s linear infinite;
}
@keyframes donutSpin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.donutSlice {
  position: absolute;
  width: 60px; 
  height: 60px;
  border-radius: 50%;
  clip: rect(0,60px,60px,30px);
}
.donutSlice[data-slice="1"] {
  background-color: #444;
  animation: donutSlice1 4s infinite alternate;
}
@keyframes donutSlice1 {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(120deg); }
}
.donutSlice[data-slice="2"] {
  background-color: #3F8EF7;
  animation: donutSlice2 4s infinite alternate;
}
@keyframes donutSlice2 {
  0%   { transform: rotate(120deg); }
  100% { transform: rotate(240deg); }
}
.donutSlice[data-slice="3"] {
  background-color: #7FAEFA;
  animation: donutSlice3 4s infinite alternate;
}
@keyframes donutSlice3 {
  0%   { transform: rotate(240deg); }
  100% { transform: rotate(360deg); }
}

/********************************************************
  8) GAUGE CHART (Stability Gauge)
     - Arc rotation + needle swing
********************************************************/
.gaugeWrap {
  position: relative;
  width: 80px; 
  height: 40px;
  margin: 5% auto;
  overflow: hidden;
}
.gaugeArc {
  position: absolute;
  width: 80px; 
  height: 80px;
  border: 6px solid #666;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: gaugeArcSpin 6s linear infinite;
}
@keyframes gaugeArcSpin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.gaugeNeedle {
  position: absolute;
  width: 2px; 
  height: 40px;
  left: 39px; 
  bottom: 0;
  background-color: #3F8EF7;
  transform-origin: bottom;
  animation: gaugeNeedleSwing 3s infinite alternate;
}
@keyframes gaugeNeedleSwing {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(180deg); }
}

/********************************************************
  9) STACKED BAR (Performance Stacks)
     - Subtle height variations
********************************************************/
.stackedBarContainer {
  position: relative;
  width: 90%; 
  height: 80%;
  margin: 10px auto;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}
.stackedBar {
  width: 15px;
  background-color: #555;
  animation: stackBarAnim 5s infinite ease-in-out;
  border-radius: 3px 3px 0 0;
}
@keyframes stackBarAnim {
  0%   { height: 10%; }
  25%  { height: 50%; background-color: #3F8EF7; }
  50%  { height: 30%; background-color: #555;     }
  75%  { height: 70%; background-color: #7FAEFA;  }
  100% { height: 45%; background-color: #666;     }
}
.stackedBar[data-bar="1"] { animation-delay: 0.3s; }
.stackedBar[data-bar="2"] { animation-delay: 0.6s; }
.stackedBar[data-bar="3"] { animation-delay: 0.9s; }

/********************************************************
  10) BUBBLE PACK (Market Clusters)
     - Scale pulses for clustering
********************************************************/
.bubblePack {
  position: relative;
  width: 100%; 
  height: 100%;
}
.bubbleNode {
  position: absolute;
  border-radius: 50%;
  background-color: #666;
  animation: bubblePackAnim 4s infinite alternate;
}
@keyframes bubblePackAnim {
  0%   { transform: scale(0.8); }
  50%  { transform: scale(1.3); background-color: #3F8EF7; }
  100% { transform: scale(1);   background-color: #666;    }
}
.bubbleNode[data-node="1"] {
  width: 40px; 
  height: 40px;
  top: 25%; 
  left: 30%;
  animation-delay: 0.2s;
}
.bubbleNode[data-node="2"] {
  width: 60px; 
  height: 60px;
  top: 50%; 
  left: 60%;
  animation-delay: 0.6s;
}
.bubbleNode[data-node="3"] {
  width: 35px; 
  height: 35px;
  top: 35%; 
  left: 15%;
  animation-delay: 1s;
}

/********************************************************
  11) MULTI-LINE GRAPH (Forecast Lines)
     - Subtle horizontal scale changes, slight vertical shifts
********************************************************/
.multiLine {
  position: relative;
  width: 100%; 
  height: 100%;
}
.lineStrip {
  position: absolute;
  width: 90%; 
  height: 2px;
  background-color: #666;
  left: 5%;
  animation: lineStripAnim 5s infinite;
  transform-origin: left center;
}
@keyframes lineStripAnim {
  0%   { transform: translateY(0) scaleX(0.2);  }
  20%  { transform: translateY(-5px) scaleX(0.7); background-color: #3F8EF7; }
  40%  { transform: translateY(5px)  scaleX(0.4); background-color: #666;    }
  60%  { transform: translateY(-3px) scaleX(0.9); background-color: #7FAEFA; }
  80%  { transform: translateY(2px)  scaleX(0.6); background-color: #555;    }
  100% { transform: translateY(0)    scaleX(0.8); }
}
.lineStrip[data-strip="a"] { top: 30%; animation-delay: 0.2s; }
.lineStrip[data-strip="b"] { top: 50%; animation-delay: 0.7s; }
.lineStrip[data-strip="c"] { top: 70%; animation-delay: 1.2s; }

/********************************************************
  12) NETWORK CHART (Pattern Network)
     - Node pulsing + connecting lines
********************************************************/
.networkScene {
  position: relative;
  width: 100%; 
  height: 100%;
}
.netNode {
  position: absolute;
  width: 10px; 
  height: 10px;
  background-color: #333;
  border-radius: 50%;
  animation: netNodeBlink 4s infinite alternate;
}
@keyframes netNodeBlink {
  0%   { transform: scale(0.8); background-color: #333; }
  100% { transform: scale(1.3); background-color: #3F8EF7; }
}
.netNode[data-loc="1"] { top: 25%; left: 40%; }
.netNode[data-loc="2"] { top: 60%; left: 60%; animation-delay: 0.5s; }
.netNode[data-loc="3"] { top: 40%; left: 20%; animation-delay: 1s; }

.netLink {
  position: absolute;
  height: 1px;
  background: #7FAEFA;
  animation: netLinkFlash 2s infinite alternate;
}
@keyframes netLinkFlash {
  0%   { opacity: 0.4; }
  100% { opacity: 1; }
}
.netLink[data-link="12"] {
  top: 42%; 
  left: 40%;
  width: 25%;
  transform: rotate(20deg);
}
.netLink[data-link="23"] {
  top: 50%; 
  left: 30%;
  width: 35%;
  transform: rotate(60deg);
}
.netLink[data-link="13"] {
  top: 34%; 
  left: 25%;
  width: 20%;
  transform: rotate(-10deg);
}

/********************************************************
  ROTATING MESSAGES
********************************************************/
.message {
  font-size: 18px;
  color: #333;
  text-align: center;
  transition: opacity 0.5s, transform 0.5s;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin-top: 10px;
  background: -webkit-linear-gradient(45deg, #1E1E1E, #555);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.fadeIn {
  opacity: 1;
  transform: translateY(0);
}
.fadeOut {
  opacity: 0;
  transform: translateY(10px);
}

/********************************************************
  RESPONSIVE
********************************************************/
@media (max-width: 1024px) {
  .content {
    height: auto;
  }
  .visualization {
    height: auto;
  }
}
@media (max-width: 768px) {
  .header {
    font-size: 18px;
  }
  .content {
    height: auto;
    padding: 15px 10px;
  }
  .module {
    position: static;
    width: 100%;
    height: auto;
    margin-bottom: 15px;
    opacity: 1;
    animation: none;
  }
  .message {
    font-size: 16px;
  }
}
@media (max-width: 480px) {
  .header {
    font-size: 16px;
    padding: 15px 10px;
  }
  .message {
    font-size: 14px;
  }
}

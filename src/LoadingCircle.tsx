import { useEffect, useState, useRef } from "react";
import styles from "./LoadingCircle.module.css";

// ---------------------------------------------------------
// OLD LOADER (Spinner) Implementation
// ---------------------------------------------------------
function OldLoader() {
  const loadingMessages = [
    "Systems booting up for your custom report...",
    "Finding immediate opportunities...",
    "Tailoring value...",
    "Testing potential setbacks...",
    "Refining for immediate impact...",
    "Running A/B tests based on synthesized results...",
    "Crafting your blueprint for maximum success...",
    "Refining...",
    "Success! Processing...",
    "Success! Finalizing...",
    "Success! Integrating...",
    "Success! Validating...",
    "Success! Completing..."
  ];

  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true); // True for fade-in, false for fade-out

  // Check if the message includes "Success!" to apply special styling
  const isSuccess = loadingMessages[messageIndex].includes("Success!");

  useEffect(() => {
    const updateMessage = () => {
      setFade(false); // Start fade-out
      setTimeout(() => {
        // After fade-out completes, update the message and fade-in
        setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        setFade(true); // Trigger fade-in
      }, 500);
    };

    // Change the message every 5 seconds
    const intervalId = setInterval(updateMessage, 5000);

    return () => clearInterval(intervalId);
  }, [loadingMessages.length]);

  return (
    <div className={styles["pai-dr-content"]} style={{ paddingBottom: "40px" }}>
      {/* Futuristic visualization replaces simple spinner */}
      <div className={styles["pai-dr-visualization"]}>
        {/* Core center circle */}
        <div className={styles["pai-dr-core"]}></div>

        {/* Rotating rings */}
        <div className={styles["pai-dr-ring-inner"]}></div>
        <div className={styles["pai-dr-ring-middle"]}></div>
        <div className={styles["pai-dr-ring-outer"]}></div>

        {/* Data points */}
        <div className={styles["pai-dr-data-points"]}>
          <div className={styles["pai-dr-data-point"]}></div>
          <div className={styles["pai-dr-data-point"]}></div>
          <div className={styles["pai-dr-data-point"]}></div>
          <div className={styles["pai-dr-data-point"]}></div>
          <div className={styles["pai-dr-data-point"]}></div>
          <div className={styles["pai-dr-data-point"]}></div>
        </div>

        {/* Connection lines */}
        <div className={styles["pai-dr-data-connection"]}></div>
        <div className={styles["pai-dr-data-connection"]}></div>
        <div className={styles["pai-dr-data-connection"]}></div>
        <div className={styles["pai-dr-data-connection"]}></div>

        {/* Scan effect */}
        <div className={styles["pai-dr-scan"]}></div>

        {/* Background grid */}
        <div className={styles["pai-dr-grid"]}></div>
      </div>

      {/* Flying particles */}
      <div className={styles["pai-dr-particles-container"]}>
        <div className={styles["pai-dr-particle"]}></div>
        <div className={styles["pai-dr-particle"]}></div>
        <div className={styles["pai-dr-particle"]}></div>
        <div className={styles["pai-dr-particle"]}></div>
        <div className={styles["pai-dr-particle"]}></div>
        <div className={styles["pai-dr-particle"]}></div>
        <div className={styles["pai-dr-particle"]}></div>
        <div className={styles["pai-dr-particle"]}></div>
      </div>

      {/* Message with fade transition */}
      <div
        className={`
          ${styles["pai-dr-message"]} 
          ${fade ? styles["fade-in"] : styles["fade-out"]} 
          ${isSuccess ? styles["success"] : ""}
        `}
      >
        {loadingMessages[messageIndex]}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// NEW ADVANCED ANALYSIS Implementation
// ---------------------------------------------------------
function NewAnalysis() {
  // Helper to clamp numeric value
  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  const TOTAL_MODULES = 12;

  // Rotating messages
  const loadingMessages = [
    "Thinking...",
    "Looking at your site...",
    "Finding immediate opportunities...",
    "Tailoring value...",
    "Identifying your target audience...",
    "Split-testing potential setbacks...",
    "Analyzing test results...",
    "Refining for immediate impact...",
    "Running new A/B tests based on synthesized results...",
    "Crafting your blueprint for maximum success...",
    "Refining...",
    "Success! Processing...",
    "Success! Finalizing...",
    "Success! Integrating...",
    "Success! Validating...",
    "Success! Completing..."
  ];

  // Base log lines
  const baseAnalysisLogLines = [
    "[Data] Real-time aggregator is standing by...",
    "[Data] Cross-checking system readiness...",
    "[System] GPU acceleration verified",
    "[System] CPU usage stable at 72%",
    "[Data] Checking correlation thresholds...",
    "[System] Memory usage stable at 1.2 GB / 8 GB",
    "[Data] Forecast model iteration #3 in progress...",
    "[System] All sub-processes stable",
    "[Data] Gathering final summary metrics...",
    "[Analysis] Processing pattern recognition algorithms...",
    "[Analysis] Executing multivariate regression analysis...",
    "[System] CPU utilization spike detected: 87%",
    "[Data] Outlier identification in progress...",
    "[Analysis] K-means clustering optimizing...",
    "[System] Memory allocation increased for module 3",
    "[Data] Real-time data stream synchronizing...",
    "[Analysis] Bayesian probability calculation complete",
    "[System] Neural network weights adjusting...",
    "[Data] Anomaly detection algorithms running...",
    "[Analysis] Predictive model confidence: 89.7%",
    "[System] Parallel processing threads: 16",
    "[Data] Time series decomposition complete",
    "[Analysis] Risk evaluation factors calculated",
    "[System] Cache optimization in progress",
    "[Data] Market correlation factors analyzed",
    "[System] Background tasks prioritized",
    "[Analysis] Volatility regression complete",
    "[Data] Seasonal adjustment factors applied",
    "[System] I/O operations normalized",
    "[Analysis] Confidence intervals calculated"
  ];

  // React states
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);

  const [logMessages, setLogMessages] = useState<string[]>([]);

  const totalDuration = 10;
  const topLoaderDuration = 8;
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Each module loading state
  const [moduleLoaded, setModuleLoaded] = useState<boolean[]>(
    Array(TOTAL_MODULES).fill(false)
  );

  // Instead of discrete random changes every 200ms, we do smooth interpolation
  const [liveRandom, setLiveRandom] = useState({
    funnel: 0,
    bar: 0,
    gauge: 0,
    radar: 0,
    chord: 0,  // (We'll repurpose this if needed, or ignore for dial)
    scatter: 0,
    bubble: 0,
    area: 0,
    line: 0,
    network: 0,
    heatmap: 0,
    donut: 0
  });

  // Master progress bar + timing
  useEffect(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }

    const masterTimer = window.setInterval(() => {
      setTimeElapsed((current) => {
        if (current >= totalDuration) {
          return 0; // loop if surpasses 10s
        }
        return current + 1;
      });
    }, 1000);

    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent(() => {
        if (timeElapsed < topLoaderDuration) {
          const newVal = Math.min((timeElapsed / topLoaderDuration) * 100, 100);
          return newVal;
        } else {
          return 100;
        }
      });
    }, 300);

    return () => {
      window.clearInterval(masterTimer);
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [timeElapsed, topLoaderDuration, totalDuration]);

  // Rotating messages (4s interval)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((prevIdx) => (prevIdx + 1) % loadingMessages.length);
        setFade(true);
      }, 300);
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [loadingMessages.length]);

  // VM startup logic
  useEffect(() => {
    moduleLoaded.forEach((loaded, i) => {
      if (!loaded) {
        const startDelay = Math.random() * 4000; // up to 4s
        setTimeout(() => {
          setLogMessages((prev) => [
            ...prev,
            `[VM] Initializing advanced subsystem for environment ${i + 1}...`,
            `[VM] Loading dynamic libraries...`,
            `[VM] Starting Virtual Machine environment ${i + 1}...`
          ]);
          const finishDelay = 1000 + Math.random() * 1500; // 1.0s - 2.5s
          setTimeout(() => {
            setLogMessages((prev) => [
              ...prev,
              `[VM] Environment ${i + 1} is operational.`
            ]);
            setModuleLoaded((prevStates) => {
              const updated = [...prevStates];
              updated[i] = true;
              return updated;
            });
          }, finishDelay);
        }, startDelay);
      }
    });
  }, [moduleLoaded]);

  // Additional periodic logs
  useEffect(() => {
    let currentIndex = 0;
    const analysisTimer = setInterval(() => {
      if (currentIndex < baseAnalysisLogLines.length) {
        setLogMessages((prev) => [...prev, baseAnalysisLogLines[currentIndex]]);
        currentIndex++;
      } else {
        // Restart with random logs
        const randomIndex = Math.floor(Math.random() * baseAnalysisLogLines.length);
        setLogMessages((prev) => [...prev, baseAnalysisLogLines[randomIndex]]);
      }
    }, 800);

    return () => {
      clearInterval(analysisTimer);
    };
  }, [baseAnalysisLogLines]);

  // Smooth interpolation approach
  useEffect(() => {
    // Target values toward which we interpolate
    let targetValues = {
      funnel: 0, bar: 0, gauge: 0, radar: 0, chord: 0,
      scatter: 0, bubble: 0, area: 0, line: 0,
      network: 0, heatmap: 0, donut: 0
    };

    // Current values that change smoothly
    let currentValues = { ...targetValues };

    // Generate new target values periodically
    const targetUpdateTimer = setInterval(() => {
      targetValues = {
        funnel: Math.random() * 10 - 5,
        bar: Math.random() * 7.5 - 3.75,
        gauge: Math.random() * 5 - 2.5,
        radar: Math.random() * 4 - 2,
        chord: Math.random() * 3 - 1.5,
        scatter: Math.random() * 3 - 1.5,
        bubble: Math.random() * 2.5 - 1.25,
        area: Math.random() * 2.5 - 1.25,
        line: Math.random() * 4 - 2,
        network: Math.random() * 2 - 1,
        heatmap: Math.random() * 2 - 1,
        donut: Math.random() * 2 - 1
      };
    }, 2000);

    // Smooth interpolation ~60fps
    const animationTimer = setInterval(() => {
// Fixed section (around line 1249)
const interpolationFactor = 0.05; // 5% each tick
const newValues = {} as typeof liveRandom;

Object.keys(currentValues).forEach((key) => {
  const k = key as keyof typeof liveRandom;
  const diff = targetValues[k] - currentValues[k];
  newValues[k] = currentValues[k] + (diff * interpolationFactor);
});

currentValues = newValues;
setLiveRandom(newValues);
    });  // Missing closing bracket for the animationTimer function

    return () => {
      clearInterval(targetUpdateTimer);
      clearInterval(animationTimer);
    };
  }, []);  // Missing closing bracket for the useEffect

  // Step 2: Micro-movements
  const now = Date.now() / 1000;
  const microMovements = {
    pulse: Math.sin(now * 0.8) * 0.5,
    driftX: Math.sin(now * 0.5) * 1.2,
    driftY: Math.cos(now * 0.7) * 0.8,
    rotateDrift: Math.sin(now * 0.3) * 0.7,
    scalePulse: 1 + Math.sin(now * 0.6) * 0.01
  };

  function getGaugeAngle(baseAngle: number, adjustDeg: number) {
    const angle = baseAngle + adjustDeg;
    return clamp(angle, 0, 90);
  }

  const animationClasses = [
    styles.animation1,
    styles.animation2,
    styles.animation3,
    styles.animation4
  ];
  const delayClasses = [
    styles.delay1,
    styles.delay2,
    styles.delay3,
    styles.delay4,
    styles.delay5,
    styles.delay6,
    styles.delay7,
    styles.delay8,
    styles.delay9,
    styles.delay10,
    styles.delay11,
    styles.delay12
  ];

  function getAnimationClass(i: number) {
    return animationClasses[i % animationClasses.length];
  }

  function renderModule(content: JSX.Element, moduleIndex: number) {
    const loaded = moduleLoaded[moduleIndex];
    return (
      <div
        className={`
          ${styles.module} 
          ${getAnimationClass(moduleIndex)} 
          ${delayClasses[moduleIndex]}
        `}
      >
        {!loaded && (
          <div className={styles.vmLoadingOverlay}>
            <div className={styles.vmBootLines}>
              <div>bootcfg.sys loaded</div>
              <div>vkernel.sys loaded</div>
              <div>hypervisor check: OK</div>
              <div className={styles.vmDotFlicker}>. . .</div>
              <div>Starting environment {moduleIndex + 1} ...</div>
            </div>
          </div>
        )}
        {loaded && content}
      </div>
    );
  }

  return (
    <>
      {/* Purple progress bar */}
      <div className={styles.progressContainer}>
        <div
          className={`
            ${styles.progressBar} 
            ${progressPercent >= 100 ? styles.progressComplete : ""}
          `}
          style={{ width: `${progressPercent}%` }}
        >
          <div className={styles.progressGlow}></div>
        </div>
      </div>

      {/* Spinner + text under the purple loader */}
      <OldLoader />

      <div className={styles.content}>
        <div className={styles.visualization}>
          {/* 1) Funnel Analysis */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Observational Data – Funnel</div>
                <div className={styles.windowStatus}>Live</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  transform: `translate(${microMovements.driftX}px, ${microMovements.driftY}px) scale(${microMovements.scalePulse})`
                }}
              >
                <div className={styles.funnelContainer}>
                  <div className={styles.funnelMetric} style={{ top: "10%" }}>
                    <span className={styles.label}>Data Points</span>
                    <span className={styles.value}>15,120</span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(100 + liveRandom.funnel, 0, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "35%" }}>
                    <span className={styles.label}>Key Observations</span>
                    <span className={styles.value}>9,304</span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(85 + liveRandom.funnel, 0, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "60%" }}>
                    <span className={styles.label}>Potential Patterns</span>
                    <span className={styles.value}>4,189</span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(65 + liveRandom.funnel, 0, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "85%" }}>
                    <span className={styles.label}>Core Insights</span>
                    <span className={styles.value}>2,532</span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(40 + liveRandom.funnel, 0, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </>,
            0
          )}

          {/* 2) Radar Module */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Multi-Faceted Radar – Insight Engine
                </div>
                <div className={styles.windowStatus}>Processing</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  transform: `translate(${microMovements.driftX * 0.5}px, ${microMovements.driftY * 0.5}px)`
                }}
              >
                <div className={styles.radarContainer}>
                  <div
                    className={styles.radarChart}
                    style={{ animation: "continuousRotate 30s linear infinite" }}
                  >
                    <div className={styles.radarAxis}></div>
                    <div className={styles.radarAxis}></div>
                    <div className={styles.radarAxis}></div>
                    <div className={styles.radarAxis}></div>
                    <div className={styles.radarAxis}></div>
                    <div className={styles.radarAxis}></div>
                    <div className={styles.radarCircle}></div>
                    <div className={styles.radarCircle}></div>
                    <div className={styles.radarCircle}></div>
                    <div className={styles.radarCircle}></div>
                    <div className={styles.radarValue}></div>
                    <div className={styles.radarValue}></div>
                    <div className={styles.radarValue}></div>
                    <div className={styles.radarValue}></div>
                    <div className={styles.radarValue}></div>
                    <div className={styles.radarValue}></div>
                    <div className={styles.radarArea}></div>
                  </div>
                </div>
              </div>
            </>,
            1
          )}

          {/* 3) -- REPLACED "Comparative Markers – Matrix" WITH OPPORTUNITY DIAL */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Opportunity Dial</div>
                <div className={styles.windowStatus}>Computing</div>
              </div>
              <div className={styles.moduleBody}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {/* Professional opportunity dial */}
                  <div style={{
                    position: 'relative',
                    width: '70%',
                    height: '70%',
                    borderRadius: '50%',
                    background: 'conic-gradient(#28a745 0%, #ffc107 60%, #9552D3 80%, #BC73ED 100%)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15), inset 0 2px 5px rgba(255,255,255,0.5)'
                  }}>
                    {/* White center of dial */}
                    <div style={{
                      position: 'absolute',
                      top: '20%',
                      left: '20%',
                      width: '60%',
                      height: '60%',
                      borderRadius: '50%',
                      background: 'white',
                      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)'
                    }}></div>

                    {/* Dial tick marks */}
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: i % 5 === 0 ? '4px' : '2px',
                        height: i % 5 === 0 ? '12px' : '8px',
                        background: '#333',
                        transformOrigin: 'center calc(100% + 20px)',
                        transform: `translate(-50%, -50%) rotate(${i * 12}deg)`,
                        borderRadius: '1px',
                        opacity: i % 5 === 0 ? 1 : 0.6
                      }}></div>
                    ))}

<div style={{
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '4px',
  height: '40%',
  background: '#333',
  transformOrigin: 'center bottom',
  transform: `translate(-50%, -100%) rotate(${110 + Math.sin(Date.now() / 1000) * 5}deg)`,
  borderRadius: '2px',
  boxShadow: '0 0 5px rgba(0,0,0,0.2)',
  zIndex: 5,
  transition: 'none',
  animation: 'needleOscillate 3s infinite ease-in-out'
}}></div>

                    {/* Center knob */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '20px',
                      height: '20px',
                      background: 'radial-gradient(circle at 30% 30%, #666, #333)',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>

                  {/* Label */}
                  <div style={{
                    marginTop: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#9552D3',
                    textAlign: 'center'
                  }}>
                    Opportunity Index: 87%
                    <div style={{
                      fontSize: '9px',
                      color: '#555',
                      fontWeight: 'normal',
                      marginTop: '3px'
                    }}>
                      Above Average Performance
                    </div>
                  </div>
                </div>
              </div>
            </>,
            2
          )}

          {/* 4) -- REPLACED "Multi-Variable Analysis – Factor Explorer" WITH SCATTER PLOT */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Multi-Variable Analysis – Factor Explorer
                </div>
                <div className={styles.windowStatus}>Active</div>
              </div>
              <div className={styles.moduleBody}>
                {/* Add chart grid and axes */}
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>

                <div className={styles.scatterContainer}>
                  {/* Quadrant labels */}
                  <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '15%',
                    fontSize: '8px',
                    color: 'rgba(0,0,0,0.5)',
                    fontWeight: 'bold'
                  }}>Low Risk</div>
                  <div style={{
                    position: 'absolute',
                    top: '15%',
                    right: '15%',
                    fontSize: '8px',
                    color: 'rgba(0,0,0,0.5)',
                    fontWeight: 'bold',
                    textAlign: 'right'
                  }}>High Value</div>
                  <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '15%',
                    fontSize: '8px',
                    color: 'rgba(0,0,0,0.5)',
                    fontWeight: 'bold'
                  }}>Low Priority</div>
                  <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '15%',
                    fontSize: '8px',
                    color: 'rgba(0,0,0,0.5)',
                    fontWeight: 'bold',
                    textAlign: 'right'
                  }}>High Risk</div>

                  {/* Create scatter points in distinctive clusters */}
                  {Array.from({ length: 18 }).map((_, i) => {
                    const nowLocal = Date.now() / 1000;
                    // Clusters
                    const clusters = [
                      { x: 20, y: 30, size: "high", name: "A" },
                      { x: 65, y: 25, size: "medium", name: "B" },
                      { x: 80, y: 70, size: "high", name: "C" },
                      { x: 30, y: 65, size: "low", name: "D" },
                      { x: 50, y: 40, size: "medium", name: "E" },
                      { x: 75, y: 45, size: "low", name: "F" }
                    ];

                    const clusterIndex = Math.floor(i / 3);
                    const cluster = clusters[clusterIndex % clusters.length];

                    // Jitter
                    const jitterX = Math.sin(nowLocal / (1 + i * 0.2)) * 3;
                    const jitterY = Math.cos(nowLocal / (1.2 + i * 0.3)) * 3;

                    return (
                      <div key={i}>
                        <div
                          className={styles.scatterPoint}
                          data-value={cluster.size}
                          style={{
                            left: `${cluster.x + jitterX + (i % 3 - 1) * 5}%`,
                            top: `${cluster.y + jitterY + (i % 3 - 1) * 4}%`,
                            boxShadow: `0 0 ${3 + Math.sin(nowLocal / (1 + i * 0.1)) * 2}px rgba(149,82,211,0.7)`,
                            transition: 'none'
                          }}
                        ></div>

                      {/* Label for first point in each cluster */}
{i % 3 === 0 && (
  <div style={{
    position: 'absolute',
    left: `${cluster.x + jitterX}%`,
    top: `${cluster.y + jitterY - 8}%`,
    fontSize: '8px',
    fontWeight: 'bold',
    color: '#9552D3',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '2px',
    padding: '1px 3px',
    zIndex: 5,
    transform: 'translate(-50%, 0)',
    whiteSpace: 'nowrap'
  }}>
    {cluster.name}
  </div>
)}
                      </div>
                    );
                  })}

                  {/* Quadrant dividers */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0',
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    width: '1px',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}></div>

                  {/* Trend lines */}
                  <div style={{
                    position: 'absolute',
                    width: '70%',
                    height: '2px',
                    bottom: '25%',
                    left: '15%',
                    background: 'linear-gradient(90deg, rgba(149,82,211,0.2), rgba(149,82,211,0.8))',
                    transform: `rotate(${30 + Math.sin(Date.now() / 3000) * 3}deg)`,
                    transformOrigin: 'left center',
                    transition: 'none'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    width: '50%',
                    height: '1px',
                    top: '35%',
                    left: '25%',
                    background: 'rgba(188,115,237,0.5)',
                    transform: `rotate(${-15 + Math.sin(Date.now() / 4000) * 2}deg)`,
                    transformOrigin: 'left center',
                    transition: 'none',
                    opacity: 0.6
                  }}></div>
                </div>
              </div>
            </>,
            3
          )}

          {/* 5) Heatmap */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Association Mapping – Connection Grid
                </div>
                <div className={styles.windowStatus}>Calculating</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  transform: `translateX(${microMovements.driftX}px) scale(${microMovements.scalePulse})`
                }}
              >
                <div className={styles.heatmapContainer}>
                  <div className={styles.heatmapGrid}>
                    {/* 25 cells */}
                    <div className={`${styles.heatCell} ${styles.low}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium}`}></div>
                    <div className={`${styles.heatCell} ${styles.low}`}></div>
                    <div className={`${styles.heatCell} ${styles.high}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium}`}></div>
                    <div className={`${styles.heatCell} ${styles["very-high"]}`}></div>
                    <div className={`${styles.heatCell} ${styles.high}`}></div>
                    <div className={`${styles.heatCell} ${styles.low}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium}`}></div>
                    <div className={`${styles.heatCell} ${styles.low}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium}`}></div>
                    <div className={`${styles.heatCell} ${styles["very-high"]}`}></div>
                    <div className={`${styles.heatCell} ${styles.high}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium}`}></div>
                    <div className={`${styles.heatCell} ${styles.high}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium}`}></div>
                    <div className={`${styles.heatCell} ${styles.low}`}></div>
                    <div className={`${styles.heatCell} ${styles["very-high"]}`}></div>
                    <div className={`${styles.heatCell} ${styles.high}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium}`}></div>
                    <div className={`${styles.heatCell} ${styles["very-high"]}`}></div>
                    <div className={`${styles.heatCell} ${styles.high}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium}`}></div>
                    <div className={`${styles.heatCell} ${styles.low}`}></div>
                  </div>
                  <div className={styles.xLabels}>
                    <span>Channel 1</span>
                    <span>Channel 2</span>
                    <span>Channel 3</span>
                    <span>Channel 4</span>
                    <span>Channel 5</span>
                  </div>
                  <div className={styles.yLabels} style={{ left: "13%" }}>
                    <span>A</span>
                    <span>B</span>
                    <span>C</span>
                    <span>D</span>
                    <span>E</span>
                  </div>
                </div>
              </div>
            </>,
            4
          )}

          {/* 6) Donut */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Resource Index – Efficiency Pulse</div>
                <div className={styles.windowStatus}>Processing</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  animation: "subtlePulse 4s infinite ease-in-out",
                  transform: `translateY(${microMovements.driftY}px)`
                }}
              >
                <div className={styles.donutContainer}>
                  <div className={styles.donutRing}></div>
                  <div className={`${styles.donutSegment} ${styles.segment1}`}></div>
                  <div className={`${styles.donutSegment} ${styles.segment2}`}></div>
                  <div className={`${styles.donutSegment} ${styles.segment3}`}></div>
                  <div className={styles.donutHole}></div>
                  <div className={styles.donutLabel}>
                    <div className={styles.value}>72%</div>
                    <div className={styles.text}>Utilization</div>
                  </div>
                  <div className={styles.legendItem} style={{ bottom: "25%" }}>
                    <span></span>Group A
                  </div>
                  <div className={styles.legendItem} style={{ bottom: "15%" }}>
                    <span></span>Group B
                  </div>
                  <div className={styles.legendItem} style={{ bottom: "5%" }}>
                    <span></span>Group C
                  </div>
                </div>
              </div>
            </>,
            5
          )}

          {/* 7) Gauge */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Robustness Overview – Risk Evaluator</div>
                <div className={styles.windowStatus}>Measuring</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.gaugeContainer} style={{
                  animation: "subtlePulse 4s infinite ease-in-out"
                }}>
                  <div className={styles.gaugeBackground}></div>
                  <div
                    className={styles.gaugeMeter}
                    style={{ transform: "scale(1) rotate(-90deg)" }}
                  ></div>
                  <div className={styles.gaugeCover}></div>
                  <div className={styles.gaugeTicks}>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                    <div className={styles.gaugeTick}></div>
                  </div>
                  <div
                    className={styles.gaugeNeedle}
                    style={{
                      transform: `rotate(${getGaugeAngle(53, liveRandom.gauge)}deg)`,
                      transition: 'transform 0.2s ease-out'
                    }}
                  ></div>
                  <div className={styles.gaugeValue}>81% Stable</div>
                </div>
              </div>
            </>,
            6
          )}

          {/* 8) Bar Chart */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Performance Tiers – Efficiency Review</div>
                <div className={styles.windowStatus}>Calculating</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  transform: `rotate(${microMovements.rotateDrift}deg) translate(${microMovements.driftX * 0.2}px, ${microMovements.driftY * 0.2}px)`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.barChartContainer}>
                  <div className={styles.barGroup}>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${clamp(55 + liveRandom.bar, 0, 100)}%`,
                          transition: 'height 0.2s ease-out'
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat A</div>
                      <div className={styles.barValue}>58%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${clamp(80 + liveRandom.bar, 0, 100)}%`,
                          transition: 'height 0.2s ease-out'
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat B</div>
                      <div className={styles.barValue}>82%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${clamp(68 + liveRandom.bar, 0, 100)}%`,
                          transition: 'height 0.2s ease-out'
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat C</div>
                      <div className={styles.barValue}>71%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${clamp(90 + liveRandom.bar, 0, 100)}%`,
                          transition: 'height 0.2s ease-out'
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat D</div>
                      <div className={styles.barValue}>93%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${clamp(77 + liveRandom.bar, 0, 100)}%`,
                          transition: 'height 0.2s ease-out'
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat E</div>
                      <div className={styles.barValue}>79%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${clamp(42 + liveRandom.bar, 0, 100)}%`,
                          transition: 'height 0.2s ease-out'
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat F</div>
                      <div className={styles.barValue}>46%</div>
                    </div>
                  </div>
                </div>
              </div>
            </>,
            7
          )}

          {/* 9) Bubble */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Clustering – Multi-Group Navigator
                </div>
                <div className={styles.windowStatus}>Mapping</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  transform: `translate(${microMovements.driftX * 0.5}px, ${microMovements.driftY}px)`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.bubbleContainer}>
                  <div className={styles.bubble}
                    style={{ animation: "bubbleGrow 1.5s forwards cubic-bezier(0.17,0.67,0.83,0.67), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.bubble}
                    style={{ animation: "bubbleGrow 1.5s 0.4s forwards cubic-bezier(0.17,0.67,0.83,0.67), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.bubble}
                    style={{ animation: "bubbleGrow 1.5s 0.8s forwards cubic-bezier(0.17,0.67,0.83,0.67), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.bubbleLabel}>Group 1</div>
                  <div className={styles.bubbleLabel}>Group 2</div>
                  <div className={styles.bubbleLabel}>Group 3</div>
                  <div className={styles.bubbleValue}>14.2</div>
                  <div className={styles.bubbleValue}>9.1</div>
                  <div className={styles.bubbleValue}>4.3</div>
                </div>
              </div>
            </>,
            8
          )}

          {/* 10) Line */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Forecasting – Trend Projections</div>
                <div className={styles.windowStatus}>Predicting</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  transform: `translate(${microMovements.driftX}px, ${microMovements.driftY * 0.5}px)`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.lineChartContainer}>
                  <div className={styles.lineChart}>
                    <div className={styles.lineBase}></div>
                    <div className={styles.linePath}></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s 0.2s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s 0.4s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s 0.6s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s 0.8s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s 1.0s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s 1.2s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s 1.4s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s 1.6s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s 1.8s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.linePoint}
                      style={{ animation: "linePointAppear 0.5s 2.0s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.lineFill}></div>
                  </div>
                </div>
              </div>
            </>,
            9
          )}

          {/* 11) Network */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Topology Analysis – Network Synthesis</div>
                <div className={styles.windowStatus}>Running</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  transform: `scale(${microMovements.scalePulse})`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.networkContainer}>
                  <div className={styles.networkNode}></div>
                  <div className={styles.networkNode}></div>
                  <div className={styles.networkNode}></div>
                  <div className={styles.networkNode}></div>
                  <div className={styles.networkNode}></div>
                  <div className={styles.networkLink}></div>
                  <div className={styles.networkLink}></div>
                  <div className={styles.networkLink}></div>
                  <div className={styles.networkLink}></div>
                  <div className={styles.networkLink}></div>
                  <div className={styles.networkLink}></div>
                  <div className={styles.networkLink}></div>
                  <div className={styles.networkLink}></div>
                  <div className={styles.nodeLabel}>Primary</div>
                  <div className={styles.nodeLabel}>Secondary</div>
                  <div className={styles.nodeLabel}>Tertiary</div>
                  <div className={styles.nodeLabel}>Quaternary</div>
                  <div className={styles.nodeLabel}>Central</div>
                </div>
              </div>
            </>,
            10
          )}

{/* 12) System Status Dashboard */}
{renderModule(
  <>
    <div className={styles.macWindowBar}>
      <span className={styles.trafficLight} data-color="red" />
      <span className={styles.trafficLight} data-color="yellow" />
      <span className={styles.trafficLight} data-color="green" />
      <div className={styles.windowTitle}>System Status Dashboard</div>
      <div className={styles.windowStatus}>Active</div>
    </div>
    <div className={styles.moduleBody}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: '10px'
      }}>
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 'bold',
            color: '#333'
          }}>CPU Usage:</span>
          <div style={{
            width: '65%',
            height: '8px',
            background: '#f0f0f0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${67 + Math.sin(Date.now()/2000) * 5}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #9552D3, #BC73ED)',
              borderRadius: '4px',
              transition: 'width 0.5s ease-out'
            }}></div>
          </div>
          <span style={{
            fontSize: '9px',
            color: '#666'
          }}>{Math.floor(67 + Math.sin(Date.now()/2000) * 5)}%</span>
        </div>
        
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 'bold',
            color: '#333'
          }}>Memory:</span>
          <div style={{
            width: '65%',
            height: '8px',
            background: '#f0f0f0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${42 + Math.sin(Date.now()/3000) * 3}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #9552D3, #BC73ED)',
              borderRadius: '4px',
              transition: 'width 0.5s ease-out'
            }}></div>
          </div>
          <span style={{
            fontSize: '9px',
            color: '#666'
          }}>{Math.floor(42 + Math.sin(Date.now()/3000) * 3)}%</span>
        </div>
        
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 'bold',
            color: '#333'
          }}>Network:</span>
          <div style={{
            width: '65%',
            height: '8px',
            background: '#f0f0f0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${78 + Math.sin(Date.now()/2500) * 8}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #9552D3, #BC73ED)',
              borderRadius: '4px',
              transition: 'width 0.5s ease-out'
            }}></div>
          </div>
          <span style={{
            fontSize: '9px',
            color: '#666'
          }}>{Math.floor(78 + Math.sin(Date.now()/2500) * 8)}%</span>
        </div>
        
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 'bold',
            color: '#333'
          }}>Disk I/O:</span>
          <div style={{
            width: '65%',
            height: '8px',
            background: '#f0f0f0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${34 + Math.sin(Date.now()/4000) * 7}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #9552D3, #BC73ED)',
              borderRadius: '4px',
              transition: 'width 0.5s ease-out'
            }}></div>
          </div>
          <span style={{
            fontSize: '9px',
            color: '#666'
          }}>{Math.floor(34 + Math.sin(Date.now()/4000) * 7)}%</span>
        </div>
        
        <div style={{
          fontSize: '8px',
          color: '#666',
          alignSelf: 'center',
          marginTop: '5px'
        }}>
          {new Date().toLocaleTimeString()} scan - opportunity level: RARE.
        </div>
      </div>
    </div>
  </>,
  11
)}

        {/* Single-line rotating message */}
        <div
          className={`${styles.message} ${fade ? styles.fadeIn : styles.fadeOut}`}
        >
          {loadingMessages[messageIndex]}
        </div>

        {/* Live log area */}
        <div className={styles.analysisLog}>
          {logMessages.map((line, idx) => (
            <div key={idx} className={styles.logLine}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------
// FINAL COMBINED COMPONENT
// ---------------------------------------------------------
export default function CombinedLoader() {
  // Additional Dashboard-wide enhancements:
  const now = Date.now() / 3000;
  const backgroundOpacity = 0.8 + Math.sin(now) * 0.2;

  return (
    <div className={styles.container}>
      {/* Add radial background animation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `radial-gradient(
          circle at ${50 + Math.sin(Date.now()/5000) * 10}% 
                     ${50 + Math.cos(Date.now()/4000) * 10}%,
          rgba(149,82,211,0.08), 
          transparent 70%
        )`,
        backgroundSize: '200% 200%',
        animation: 'gradientFlow 15s infinite ease-in-out',
        opacity: backgroundOpacity,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
      </div>

      {/* Data flow particles between modules */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 999,
        pointerEvents: 'none'
      }}>
        {Array.from({ length: 20 }).map((_, i) => {
          const t = Date.now() / 1000;
          // Module positions in a 3x3 grid
          const modules = [
            { x: 16.7, y: 16.7 }, { x: 50, y: 16.7 }, { x: 83.3, y: 16.7 },
            { x: 16.7, y: 50 },   { x: 50, y: 50 },   { x: 83.3, y: 50 },
            { x: 16.7, y: 83.3 }, { x: 50, y: 83.3 }, { x: 83.3, y: 83.3 }
          ];
          const startIndex = i % modules.length;
          const endIndex = (startIndex + 1 + Math.floor(i / 3)) % modules.length;
          const start = modules[startIndex];
          const end = modules[endIndex];

          const duration = 3 + (i % 5);
          const progress = (t % duration) / duration;
          const x = start.x + (end.x - start.x) * progress;
          const y = start.y + (end.y - start.y) * progress;
          const opacity = Math.sin(progress * Math.PI);

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: `${2 + Math.sin(t * 2) * 1}px`,
                height: `${2 + Math.sin(t * 2) * 1}px`,
                backgroundColor: 'rgba(149,82,211,0.8)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 ${4 + Math.sin(t * 3) * 2}px rgba(149,82,211,0.6)`,
                opacity: opacity,
                transition: 'none'
              }}
            ></div>
          );
        })}
      </div>

      <NewAnalysis />
    </div>
  );
}

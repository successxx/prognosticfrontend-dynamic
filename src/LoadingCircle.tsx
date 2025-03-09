// Note: We remove the default "React" import because TS6133 complains it's unused.
// We still import the specific hooks from "react" so that TypeScript doesn't fail:

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
      }, 500); // Match the duration of the fade-out
    };

    // Change the message every 5 seconds
    const intervalId = setInterval(updateMessage, 5000);

    // Clean up on unmount
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

        {/* Data points that appear and disappear */}
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
    chord: 0,
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
        // Restart with random logs when we've used all the predetermined ones
        const randomIndex = Math.floor(Math.random() * baseAnalysisLogLines.length);
        setLogMessages((prev) => [...prev, baseAnalysisLogLines[randomIndex]]);
      }
    }, 800); // Faster log updates

    return () => {
      clearInterval(analysisTimer);
    };
  }, [baseAnalysisLogLines]);

  // STEP 1: Smooth Interpolation Approach
  useEffect(() => {
    // Target values toward which we interpolate
    let targetValues = {
      funnel: 0, bar: 0, gauge: 0, radar: 0, chord: 0, scatter: 0,
      bubble: 0, area: 0, line: 0, network: 0, heatmap: 0, donut: 0
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
    }, 2000); // New targets every 2 seconds

    // Smooth interpolation at ~60fps
    const animationTimer = setInterval(() => {
      const interpolationFactor = 0.05; // Move ~5% closer each tick
      const newValues: Record<string, number> = {};

      Object.keys(currentValues).forEach((key) => {
        const diff = (targetValues as any)[key] - (currentValues as any)[key];
        (newValues as any)[key] = (currentValues as any)[key] + (diff * interpolationFactor);
      });

      currentValues = newValues;
      setLiveRandom(newValues as any);
    }, 16); // ~60fps

    return () => {
      clearInterval(targetUpdateTimer);
      clearInterval(animationTimer);
    };
  }, []);

  // STEP 2: Natural micro-movements (time-based), right before return
  const now = Date.now() / 1000; // Current time in seconds
  const microMovements = {
    // Circular breathing effect for gauge/donut if desired
    pulse: Math.sin(now * 0.8) * 0.5,

    // X-axis drift
    driftX: Math.sin(now * 0.5) * 1.2,

    // Y-axis drift
    driftY: Math.cos(now * 0.7) * 0.8,

    // Rotation drift
    rotateDrift: Math.sin(now * 0.3) * 0.7,

    // Scale breathing
    scalePulse: 1 + Math.sin(now * 0.6) * 0.01
  };

  // Calculate gauge angle
  function getGaugeAngle(baseAngle: number, adjustDeg: number) {
    const angle = baseAngle + adjustDeg;
    return clamp(angle, 0, 90);
  }

  // Rendering helper
  const animationClasses = [
    styles.animation1,
    styles.animation2,
    styles.animation3,
    styles.animation4
  ];
  function getAnimationClass(i: number) {
    return animationClasses[i % animationClasses.length];
  }
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
      {/* Purple progress bar at top */}
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

      {/* Spinner + text just under the purple loader */}
      <OldLoader />

      {/* Then the modules + rotating message (from NewAnalysis) + logs */}
      <div className={styles.content}>
        <div className={styles.visualization}>
          {/* 1) Funnel Analysis Module */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Observational Data – Funnel
                </div>
                <div className={styles.windowStatus}>Live</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  // Subtle micro-movement:
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
                {/* Add continuous rotation to the radar chart container */}
                <div className={styles.radarContainer}>
                  <div
                    className={styles.radarChart}
                    style={{
                      animation: "continuousRotate 30s linear infinite"
                    }}
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

          {/* 3) Predictive Area Chart */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Future Mapping – Predictive View
                </div>
                <div className={styles.windowStatus}>Analyzing</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  transform: `translate(${microMovements.driftX}px, ${microMovements.driftY * 0.3}px)`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.areaChartContainer}>
                  <div className={styles.areaPath}>
                    <div className={styles.area}></div>
                    <div className={styles.areaLine}></div>
                    {/* Data points with wave animation */}
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s 0.1s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s 0.2s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s 0.3s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s 0.4s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s 0.5s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s 0.6s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s 0.7s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s 0.8s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s 0.9s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                    <div className={styles.dataPoint}
                      style={{ animation: "pointAppear 0.4s 1.0s forwards ease-out, liquidWave 8s ease-in-out infinite" }}
                    ></div>
                  </div>
                </div>
              </div>
            </>,
            2
          )}

          {/* 4) Comparative Matrix (Chord Diagram) */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Comparative Markers – Matrix
                </div>
                <div className={styles.windowStatus}>Computing</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  transform: `translateY(${microMovements.driftY}px) scale(${microMovements.scalePulse})`
                }}
              >
                <div className={styles.chordContainer}>
                  <div className={styles.chordCircle}></div>
                  <div className={styles.chordArc}></div>
                  <div className={styles.chordArc}></div>
                  <div className={styles.chordArc}></div>
                  <div className={styles.chord}></div>
                  <div className={styles.chord2}></div>
                </div>
              </div>
            </>,
            3
          )}

          {/* 5) Multi-Variable Scatter Plot */}
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
              <div className={styles.moduleBody}
                style={{
                  transform: `translate(${microMovements.driftX * 0.3}px, ${microMovements.driftY * 0.2}px)`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.scatterContainer}>
                  {/* Add wave animation to scatter points */}
                  <div className={styles.scatterPoint} data-value="high"
                    style={{ animation: "scatterAppear 0.8s forwards cubic-bezier(0.34,1.56,0.64,1), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.scatterPoint} data-value="medium"
                    style={{ animation: "scatterAppear 0.8s 0.2s forwards cubic-bezier(0.34,1.56,0.64,1), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.scatterPoint} data-value="high"
                    style={{ animation: "scatterAppear 0.8s 0.4s forwards cubic-bezier(0.34,1.56,0.64,1), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.scatterPoint} data-value="low"
                    style={{ animation: "scatterAppear 0.8s 0.6s forwards cubic-bezier(0.34,1.56,0.64,1), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.scatterPoint} data-value="medium"
                    style={{ animation: "scatterAppear 0.8s 0.8s forwards cubic-bezier(0.34,1.56,0.64,1), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.scatterPoint} data-value="low"
                    style={{ animation: "scatterAppear 0.8s 1.0s forwards cubic-bezier(0.34,1.56,0.64,1), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.scatterPoint} data-value="medium"
                    style={{ animation: "scatterAppear 0.8s 1.2s forwards cubic-bezier(0.34,1.56,0.64,1), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.scatterPoint} data-value="high"
                    style={{ animation: "scatterAppear 0.8s 1.4s forwards cubic-bezier(0.34,1.56,0.64,1), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.scatterPoint} data-value="medium"
                    style={{ animation: "scatterAppear 0.8s 1.6s forwards cubic-bezier(0.34,1.56,0.64,1), liquidWave 8s ease-in-out infinite" }}
                  ></div>
                  <div className={styles.trendLine}></div>
                </div>
              </div>
            </>,
            4
          )}

          {/* 6) Heatmap Grid */}
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
            5
          )}

          {/* 7) Donut Chart Resource Allocation */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Resource Index – Efficiency Pulse
                </div>
                <div className={styles.windowStatus}>Processing</div>
              </div>
              <div className={styles.moduleBody}
                style={{
                  // Gentle pulse
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
            6
          )}

          {/* 8) Risk Evaluation Gauge */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Robustness Overview – Risk Evaluator
                </div>
                <div className={styles.windowStatus}>Measuring</div>
              </div>
              <div className={styles.moduleBody}>
                {/* Ensure continuous subtle pulse */}
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
            7
          )}

          {/* 9) Bar Chart Performance Metrics */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Performance Tiers – Efficiency Review
                </div>
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
            8
          )}

          {/* 10) Clustering Bubble Visualization */}
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
                  {/* Bubbles with wavey motion */}
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
            9
          )}

          {/* 11) Trend Forecasting Line Chart */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Forecasting – Trend Projections
                </div>
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
                    {/* line points with wave */}
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
            10
          )}

          {/* 12) Network Topology Analysis */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>
                  Topology Analysis – Network Synthesis
                </div>
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
            11
          )}
        </div>

        {/* STEP 5: Data flow animation overlay (added right after visualization) */}
        <div className={styles.dataFlowOverlay}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={styles.dataFlowParticle}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                animationDuration: `${5 + Math.random() * 15}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

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
  return (
    <div className={styles.container}>
      {/* 
        The NewAnalysis component now:
        1) Renders the purple loader bar at top
        2) Immediately shows OldLoader (spinner + text) under that
        3) Then renders the 12 modules, single-line rotating message, and log
      */}
      <NewAnalysis />
    </div>
  );
}

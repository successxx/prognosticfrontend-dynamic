// Note: We remove the default "React" import because TS6133 complains it's unused.
// We still import the specific hooks from "react" so that TypeScript doesn't fail:
import { useEffect, useState, useRef } from "react";
import styles from "./LoadingCircle.module.css";

// ---------------------------------------------------------
// OLD LOADER (Spinner) Implementation
// ---------------------------------------------------------
function OldLoader() {
  
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
    // Instead of a separate container, we embed these visuals
    // in the same container as the advanced modules.
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
    "Initializing cross-domain analysis...",
    "Collecting multi-layer inputs...",
    "Identifying key data clusters...",
    "Evaluating potential anomalies...",
    "Aggregating deep indicators...",
    "Refining multi-dimensional signals...",
    "Applying heuristic predictions...",
    "Synthesizing correlation patterns...",
    "Pinpointing emergent insights...",
    "Compiling final intelligence...",
    "Analysis complete—preparing output..."
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
    "[Data] Gathering final summary metrics..."
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
  
  // Ongoing "live" updates
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
        clearInterval(analysisTimer);
      }
    }, 2000);
    
    return () => {
      clearInterval(analysisTimer);
    };
  }, [baseAnalysisLogLines]);
  
  // Continuous "live" data changes
  useEffect(() => {
    const liveUpdateTimer = setInterval(() => {
      setLiveRandom({
        funnel: Math.random() * 10 - 5,
        bar: Math.random() * 10 - 5,
        gauge: Math.random() * 3 - 1.5,
        radar: Math.random() * 2 - 1,
        chord: Math.random() * 2 - 1,
        scatter: Math.random() * 2 - 1,
        bubble: Math.random() * 2 - 1,
        area: Math.random() * 2 - 1,
        line: Math.random() * 2 - 1,
        network: Math.random() * 2 - 1,
        heatmap: Math.random() * 2 - 1,
        donut: Math.random() * 2 - 1
      });
    }, 1500);
    
    return () => {
      clearInterval(liveUpdateTimer);
    };
  }, []);
  
  // Animation classes
  const animationClasses = [
    styles.animation1,
    styles.animation2,
    styles.animation3,
    styles.animation4
  ];
  function getAnimationClass(i: number) {
    return animationClasses[i % animationClasses.length];
  }
  
  // 12 staggered delay classes
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
  
  // Calculate gauge angle
  function getGaugeAngle(baseAngle: number, adjustDeg: number) {
    const angle = baseAngle + adjustDeg;
    return Math.max(0, Math.min(angle, 90));
  }
  
  return (
    <>
      {/* Container header */}
      <div className={styles.header}>Your Quantum Analysis Is In Process...</div>
      
      {/* Progress Bar */}
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
      
      <div className={styles.content}>
        <div className={styles.visualization}>
          {/* 1) FUNNEL */}
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
              <div className={styles.moduleBody}>
                <div className={styles.funnelContainer}>
                  <div className={styles.funnelMetric} style={{ top: "10%" }}>
                    <span className={styles.label}>Data Points</span>
                    <span className={styles.value}>15,120</span>
                    <div
                      className={styles.bar}
                      style={{ width: `${clamp(100 + liveRandom.funnel, 0, 100)}%` }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "35%" }}>
                    <span className={styles.label}>Key Observations</span>
                    <span className={styles.value}>9,304</span>
                    <div
                      className={styles.bar}
                      style={{ width: `${clamp(85 + liveRandom.funnel, 0, 100)}%` }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "60%" }}>
                    <span className={styles.label}>Potential Patterns</span>
                    <span className={styles.value}>4,189</span>
                    <div
                      className={styles.bar}
                      style={{ width: `${clamp(65 + liveRandom.funnel, 0, 100)}%` }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "85%" }}>
                    <span className={styles.label}>Core Insights</span>
                    <span className={styles.value}>2,532</span>
                    <div
                      className={styles.bar}
                      style={{ width: `${clamp(40 + liveRandom.funnel, 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </>,
            0
          )}

          {/* 2) RADAR */}
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `scale(${1 + liveRandom.radar * 0.01})`
                }}
              >
                <div className={styles.radarContainer}>
                  <div className={styles.radarChart}>
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

          {/* 3) AREA CHART */}
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `scale(${1 + liveRandom.area * 0.01})`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.areaChartContainer}>
                  <div className={styles.areaPath}>
                    <div className={styles.area}></div>
                    <div className={styles.areaLine}></div>
                    <div className={styles.dataPoint}></div>
                    <div className={styles.dataPoint}></div>
                    <div className={styles.dataPoint}></div>
                    <div className={styles.dataPoint}></div>
                    <div className={styles.dataPoint}></div>
                    <div className={styles.dataPoint}></div>
                    <div className={styles.dataPoint}></div>
                    <div className={styles.dataPoint}></div>
                    <div className={styles.dataPoint}></div>
                    <div className={styles.dataPoint}></div>
                    <div className={styles.dataPoint}></div>
                  </div>
                </div>
              </div>
            </>,
            2
          )}

          {/* 4) CHORD */}
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `translateY(${liveRandom.chord * 0.5}px)`
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

          {/* 5) SCATTER */}
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `rotate(${liveRandom.scatter * 0.5}deg)`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.scatterContainer}>
                  <div className={styles.scatterPoint} data-value="high"></div>
                  <div className={styles.scatterPoint} data-value="medium"></div>
                  <div className={styles.scatterPoint} data-value="high"></div>
                  <div className={styles.scatterPoint} data-value="low"></div>
                  <div className={styles.scatterPoint} data-value="medium"></div>
                  <div className={styles.scatterPoint} data-value="low"></div>
                  <div className={styles.scatterPoint} data-value="medium"></div>
                  <div className={styles.scatterPoint} data-value="high"></div>
                  <div className={styles.scatterPoint} data-value="medium"></div>
                  <div className={styles.trendLine}></div>
                </div>
              </div>
            </>,
            4
          )}

          {/* 6) HEATMAP */}
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `scale(${1 + liveRandom.heatmap * 0.01})`
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

          {/* 7) DONUT */}
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `rotate(${liveRandom.donut * 0.5}deg)`
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

          {/* 8) GAUGE */}
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
                <div className={styles.gaugeContainer}>
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
                      transform: `rotate(${getGaugeAngle(53, liveRandom.gauge)}deg)`
                    }}
                  ></div>
                  <div className={styles.gaugeValue}>81% Stable</div>
                </div>
              </div>
            </>,
            7
          )}

          {/* 9) BAR CHART */}
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
              <div className={styles.moduleBody}>
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.barChartContainer}>
                  <div className={styles.barGroup}>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${Math.max(0, Math.min(100, 55 + liveRandom.bar))}%`
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat A</div>
                      <div className={styles.barValue}>58%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${Math.max(0, Math.min(100, 80 + liveRandom.bar))}%`
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat B</div>
                      <div className={styles.barValue}>82%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${Math.max(0, Math.min(100, 68 + liveRandom.bar))}%`
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat C</div>
                      <div className={styles.barValue}>71%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${Math.max(0, Math.min(100, 90 + liveRandom.bar))}%`
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat D</div>
                      <div className={styles.barValue}>93%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${Math.max(0, Math.min(100, 77 + liveRandom.bar))}%`
                        }}
                      ></div>
                      <div className={styles.barLabel}>Cat E</div>
                      <div className={styles.barValue}>79%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${Math.max(0, Math.min(100, 42 + liveRandom.bar))}%`
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

          {/* 10) BUBBLE */}
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `scale(${1 + liveRandom.bubble * 0.01})`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.bubbleContainer}>
                  <div className={styles.bubble}></div>
                  <div className={styles.bubble}></div>
                  <div className={styles.bubble}></div>
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

          {/* 11) LINE */}
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `translateX(${liveRandom.line * 0.5}px)`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.lineChartContainer}>
                  <div className={styles.lineChart}>
                    <div className={styles.lineBase}></div>
                    <div className={styles.linePath}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.linePoint}></div>
                    <div className={styles.lineFill}></div>
                  </div>
                </div>
              </div>
            </>,
            10
          )}

          {/* 12) NETWORK */}
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `rotate(${liveRandom.network * 0.5}deg)`
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
        
        {/* Single-line rotating message */}
        <div className={`${styles.message} ${fade ? styles.fadeIn : styles.fadeOut}`}>
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
        Render the old spinner at the very top (no black header),
        then new analysis below it. 
      */}
      <OldLoader />
      
      {/* Subtle optional spacing */}
      <div style={{ marginTop: "20px" }} />
      
      <NewAnalysis />
    </div>
  );
}

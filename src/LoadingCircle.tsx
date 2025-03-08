import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./LoadingCircle.module.css";

// Helper to clamp a numeric value
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// We'll run a single requestAnimationFrame loop. Over ~20 seconds, everything 
// smoothly goes from 0% or minimal states to near 100% or final states, 
// with random micro-disturbances to appear "live."

const TOTAL_MODULES = 12;
const FULL_DURATION = 20; // seconds to go from 0 to 100

// Additional random factor for micro-jitter
function randomNoise() {
  return (Math.random() - 0.5) * 5; // -2.5..+2.5
}

const LoadingCircle: React.FC = () => {
  // ============== LOGIC STATES ==============
  const [progressPercent, setProgressPercent] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0); // for top loader
  const totalDuration = 10;
  const topLoaderDuration = 8;
  const progressIntervalRef = useRef<number | null>(null);

  // Rotating messages
  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Log
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement | null>(null);

  // VM loaded states
  const [moduleLoaded, setModuleLoaded] = useState<boolean[]>(
    Array(TOTAL_MODULES).fill(false)
  );

  // Hover for tooltips
  const [hoveredModuleIndex, setHoveredModuleIndex] = useState<number | null>(null);

  // Master-time for continuous fluid animations
  const [masterTime, setMasterTime] = useState(0); // 0..20 seconds, then loops or just keeps going

  // We'll store large sets of log lines to appear extremely sophisticated:
  const extensiveLogLines = [
    "[System] Initializing advanced synergy core...",
    "[Data] Pre-fetching metadata from cross-nodes...",
    "[AI] Generating heuristic guidelines...",
    "[Engine] Allocating ephemeral compute resources...",
    "[VM] Checking virtualization layers for environment bridging...",
    "[Data] Pipeline spooling with multi-thread I/O operations...",
    "[System] GPU micro-ops verified, concurrent tasks queued...",
    "[AI] Deriving correlation matrices from partial data streams...",
    "[Data] Real-time aggregator adjusting dimensional weighting...",
    "[Engine] Priority queue scheduling ongoing tasks...",
    "[AI] Identifying emergent correlation clusters for deeper insight...",
    "[Data] Rapid indexing of high-fidelity micro signals...",
    "[System] Tertiary processes online, capacity at 86%...",
    "[VM] Re-checking environment hyper-calls for performance gain...",
    "[Engine] Sub-translator modules optimizing intermediate results...",
    "[Data] No anomalies found, continuing expansions...",
    "[AI] Weighted synergy factor indicates upward trend...",
    "[System] Rolling out next wave of inference tasks...",
    "[Data] Real-time aggregator stable, memory usage nominal...",
    "[Engine] Pipeline latency stable at ~7.3ms...",
    "[AI] Extracting high-level feature sets from new data shards...",
    "[System] Memory cache flush scheduled...",
    "[VM] Additional environment spin-ups pending resource availability...",
    "[AI] Forecast sub-engine cross-checking partial next-step predictions...",
    "[Data] Weighted aggregator re-balancing final pass...",
    "[System] All sub-processes remain stable, proceeding...",
    "[AI] Consolidating partial results for final synergy scoring...",
    "[Data] Additional correlation thresholds unlocked, continuing...",
    "[Engine] CPU usage at 71%, GPU at 66% load...",
    "[System] Advanced logging indicates stable real-time flow...",
    "[AI] High-level emergent pattern recognized, continuing deeper analysis..."
  ];

  // "Module" tooltips, focusing on curiosity/benefit
  const moduleTooltips = [
    "Observational Data: Constantly refining key insights for you.",
    "Radar Engine: Pinpoints subtle patterns across multiple contexts.",
    "Predictive Mapping: Forecasts next-level outcomes in real time.",
    "Comparative Matrix: Benchmarks data points to reveal hidden gains.",
    "Factor Explorer: Evaluates multi-variable synergy for better decisions.",
    "Association Mapping: Shows how every channel interconnects for success.",
    "Efficiency Pulse: Measures resource usage to maximize ROI.",
    "Risk Evaluator: Gauges robustness, helping you stay secure.",
    "Performance Tiers: Dynamically ranks metrics to boost strategy.",
    "Clustering: Groups data points for immediate clarity & action.",
    "Trend Projections: Continuously scanning for next big opportunity.",
    "Network Synthesis: Visualizes connections for comprehensive oversight."
  ];

  // ============== LIFECYCLE ==============
  // 1) VM BOOT LOGIC
  useEffect(() => {
    moduleLoaded.forEach((loaded, i) => {
      if (!loaded) {
        const startDelay = Math.random() * 3000; // up to 3s
        setTimeout(() => {
          // Boot logs
          setLogMessages((prev) => [
            ...prev,
            `[VM] Environment ${i + 1} initiating advanced subsystem...`,
            `[VM] Loading essential libraries...`,
            `[VM] Starting Virtual Machine environment ${i + 1}...`
          ]);
          const finishDelay = 1000 + Math.random() * 1000;
          setTimeout(() => {
            setLogMessages((prev) => [
              ...prev,
              `[VM] Environment ${i + 1} is fully operational.`
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

  // 2) Large Log Sequence
  useEffect(() => {
    // We'll keep appending lines from extensiveLogLines, plus auto-scroll
    let idx = 0;
    const logTimer = setInterval(() => {
      setLogMessages((prev) => [...prev, extensiveLogLines[idx]]);
      idx++;
      // auto-scroll
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
      if (idx >= extensiveLogLines.length) {
        clearInterval(logTimer);
      }
    }, 1500);
    return () => clearInterval(logTimer);
  }, []);

  // 3) Master Time for continuous fluid animations
  // We'll increment ~60fps with rAF, looping from 0..FULL_DURATION
  const rAFRef = useRef<number | null>(null);
  const previousTimestamp = useRef<number | null>(null);

  const animateFrame = useCallback((timestamp: number) => {
    if (!previousTimestamp.current) {
      previousTimestamp.current = timestamp;
    }
    const delta = (timestamp - previousTimestamp.current) / 1000; // in seconds
    previousTimestamp.current = timestamp;

    // increment masterTime
    setMasterTime((prev) => {
      const newVal = prev + delta;
      if (newVal > FULL_DURATION) {
        // loop back to 0 to keep everything in motion
        return newVal - FULL_DURATION;
      }
      return newVal;
    });

    // schedule next
    rAFRef.current = requestAnimationFrame(animateFrame);
  }, []);

  useEffect(() => {
    rAFRef.current = requestAnimationFrame(animateFrame);
    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [animateFrame]);

  // 4) Top progress bar timer (we can keep it at 10s repeating)
  useEffect(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    const masterTimer = window.setInterval(() => {
      setTimeElapsed((current) => {
        if (current >= totalDuration) {
          return 0;
        }
        return current + 1;
      });
    }, 1000);

    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent(() => {
        if (timeElapsed < topLoaderDuration) {
          return Math.min((timeElapsed / topLoaderDuration) * 100, 100);
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
  }, [timeElapsed, totalDuration, topLoaderDuration]);

  // 5) Rotating big messages
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((prevIdx) => (prevIdx + 1) % loadingMessages.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(intervalId);
  }, [loadingMessages.length]);

  // ============== HELPER: GET SMOOTH FRACTION 0..1 = masterTime / FULL_DURATION
  function getFraction() {
    return clamp(masterTime / FULL_DURATION, 0, 1);
  }

  // ============== RENDER MODULES ==============
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
    styles.delay1, styles.delay2, styles.delay3, styles.delay4,
    styles.delay5, styles.delay6, styles.delay7, styles.delay8,
    styles.delay9, styles.delay10, styles.delay11, styles.delay12
  ];

  const handleMouseEnter = (i: number) => {
    setHoveredModuleIndex(i);
  };
  const handleMouseLeave = () => {
    setHoveredModuleIndex(null);
  };

  function renderModule(content: JSX.Element, moduleIndex: number) {
    return (
      <div
        className={`${styles.module} ${getAnimationClass(moduleIndex)} ${delayClasses[moduleIndex]}`}
        onMouseEnter={() => handleMouseEnter(moduleIndex)}
        onMouseLeave={handleMouseLeave}
      >
        {!moduleLoaded[moduleIndex] && (
          <div className={styles.vmLoadingOverlay}>
            <div className={styles.vmBootLines}>
              <div>bootcfg.sys loaded</div>
              <div>vkernel.sys loaded</div>
              <div>hypervisor check: OK</div>
              <div className={styles.vmDotFlicker}>. . .</div>
              <div>Starting environment {moduleIndex + 1}...</div>
            </div>
          </div>
        )}
        {moduleLoaded[moduleIndex] && content}

        {hoveredModuleIndex === moduleIndex && (
          <div className={styles.hoverTooltip}>
            {moduleTooltips[moduleIndex]}
          </div>
        )}
      </div>
    );
  }

  // ============== CHART-SPECIFIC CALCULATIONS ==============
  // 1) Observational Data – Funnel
  // We want bars to build from 0..(some final) with random minor offsets
  const funnelData = [
    { label: "Data Points", base: 100, offset: 0 },
    { label: "Key Observations", base: 85, offset: 0 },
    { label: "Potential Patterns", base: 65, offset: 0 },
    { label: "Core Insights", base: 40, offset: 0 }
  ];

  // 2) Radar, we just scale the container
  // 3) Future Mapping – area chart from 0..some fraction
  // ... etc. We replicate similar logic for all charts

  // For the robust gauge, we want to place it so it's not cut off. 
  // We'll move it to row 2, column 1 for safety (change the nth-of-type in CSS or reorder below).

  return (
    <div className={styles.container}>
      <div className={styles.header}>Comprehensive Insight Dashboard</div>

      {/* Top progress bar */}
      <div className={styles.progressContainer}>
        <div
          className={`${styles.progressBar} ${progressPercent >= 100 ? styles.progressComplete : ""}`}
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
                  {funnelData.map((item, i) => {
                    // fraction from 0..1
                    const frac = getFraction();
                    // fill 0..(base + small noise)
                    const barWidth = clamp(item.base * frac + randomNoise(), 0, 100);
                    // numeric from 0..(some max)
                    const displayedNumber = Math.floor(item.base * 200 * frac + 500 + randomNoise() * 100);
                    const topPos = [ "10%", "35%", "60%", "85%" ][i];
                    return (
                      <div key={i} className={styles.funnelMetric} style={{ top: topPos }}>
                        <span className={styles.label}>{item.label}</span>
                        <span className={styles.value}>{displayedNumber}</span>
                        <div className={styles.bar} style={{ width: `${barWidth}%` }}></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>,
            0
          )}

          {/* 2) MULTI-FACETED RADAR */}
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
                  // scale from 0.5..1.2 to show continuous "pulsing"
                  transform: `scale(${0.5 + getFraction() * 0.7 + randomNoise() * 0.005})`
                }}
              >
                <div className={styles.radarContainer}>
                  <div className={styles.radarChart}>
                    {/* Radar Axes, Circles, Values, etc. unchanged */}
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

          {/* 3) FUTURE MAPPING - PREDICTIVE VIEW */}
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
                  transform: `scale(${0.8 + getFraction() * 0.2 + randomNoise() * 0.003})`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.areaChartContainer}>
                  <div className={styles.areaPath}>
                    <div className={styles.area}></div>
                    <div className={styles.areaLine}></div>
                    {/* Data points remain */}
                    {[...Array(9)].map((_, idx) => (
                      <div key={idx} className={styles.dataPoint}></div>
                    ))}
                  </div>
                </div>
              </div>
            </>,
            2
          )}

          {/* 4) COMPARATIVE MARKERS - MATRIX */}
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
                style={{ transform: `translateY(${randomNoise() * 0.5}px)` }}
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

          {/* 5) MULTI-VARIABLE ANALYSIS – FACTOR EXPLORER (not blank now) */}
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
                  // rotate a bit as well
                  transform: `rotate(${randomNoise() * 0.5}deg)`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                {/* Some random scatter points with dynamic positions */}
                <div style={{ position: "absolute", top: "15%", left: "10%", width: "80%", height: "70%" }}>
                  {[...Array(8)].map((_, idx) => {
                    const frac = getFraction();
                    const x = Math.random() * 90 * frac; // 0..(90*frac)
                    const y = Math.random() * 60 * frac;
                    return (
                      <div
                        key={idx}
                        style={{
                          position: "absolute",
                          left: `${x}%`,
                          top: `${y}%`,
                          width: "10px",
                          height: "10px",
                          backgroundColor: "rgba(149,82,211,0.7)",
                          borderRadius: "50%",
                          transform: "translate(-50%, -50%)"
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </>,
            4
          )}

          {/* 6) ASSOCIATION MAPPING - with changed text to avoid overlap */}
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
                style={{ transform: `scale(${1 + randomNoise() * 0.01})` }}
              >
                <div className={styles.heatmapContainer}>
                  <div className={styles.heatmapGrid}>
                    {/* 25 cells as before */}
                    {[...Array(25)].map((_, idx) => {
                      const classes = [ styles.low, styles.medium, styles.high, styles["very-high"] ];
                      const pick = classes[Math.floor(Math.random() * classes.length)];
                      return <div key={idx} className={`${styles.heatCell} ${pick}`}></div>;
                    })}
                  </div>
                  <div className={styles.xLabels}>
                    <span>Ch1</span>
                    <span>Ch2</span>
                    <span>Ch3</span>
                    <span>Ch4</span>
                    <span>Ch5</span>
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

          {/* 7) RESOURCE INDEX – EFFICIENCY PULSE */}
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
                  transform: `rotate(${randomNoise() * 0.5}deg)`
                }}
              >
                <div className={styles.donutContainer}>
                  <div className={styles.donutRing}></div>
                  <div className={`${styles.donutSegment} ${styles.segment1}`}></div>
                  <div className={`${styles.donutSegment} ${styles.segment2}`}></div>
                  <div className={`${styles.donutSegment} ${styles.segment3}`}></div>
                  <div className={styles.donutHole}></div>
                  <div className={styles.donutLabel}>
                    {/* Example utilization from fraction * 100 */}
                    <div className={styles.value}>{Math.round(getFraction() * 100)}%</div>
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

          {/* 8) ROBUSTNESS OVERVIEW – moved up so it's not cut off 
              Let's place it in row 2 instead of row 3. We'll just reorder in code */}
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
                    {[...Array(13)].map((_, idx) => (
                      <div key={idx} className={styles.gaugeTick}></div>
                    ))}
                  </div>
                  <div
                    className={styles.gaugeNeedle}
                    style={{
                      transform: `rotate(${clamp(30 + getFraction() * 60 + randomNoise() * 2, 0, 90)}deg)`
                    }}
                  ></div>
                  <div className={styles.gaugeValue}>
                    {Math.round(50 + getFraction() * 50)}% Stable
                  </div>
                </div>
              </div>
            </>,
            7
          )}

          {/* 9) PERFORMANCE TIERS – EFFICIENCY REVIEW */}
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
                    {[...Array(6)].map((_, idx) => {
                      const fraction = getFraction() * 100;
                      const height = clamp(fraction + randomNoise() * 2, 0, 100);
                      return (
                        <div key={idx} className={styles.barWrapper}>
                          <div
                            className={styles.bar}
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className={styles.barLabel}>Cat {String.fromCharCode(65 + idx)}</div>
                          <div className={styles.barValue}>
                            {Math.round(height)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>,
            8
          )}

          {/* 10) CLUSTERING - remove black text top left 
              We'll just show some bubbles plus the group labels */}
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
                  transform: `scale(${0.8 + getFraction() * 0.2})`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.bubbleContainer}>
                  {/* 3 Bubbles. We'll just scale them by fraction */}
                  <div
                    className={styles.bubble}
                    style={{
                      left: "20%",
                      top: "40%",
                      width: `${20 + getFraction() * 10}%`,
                      height: `${20 + getFraction() * 10}%`
                    }}
                  ></div>
                  <div
                    className={styles.bubble}
                    style={{
                      left: "60%",
                      top: "50%",
                      width: `${25 + getFraction() * 8}%`,
                      height: `${25 + getFraction() * 8}%`
                    }}
                  ></div>
                  <div
                    className={styles.bubble}
                    style={{
                      left: "45%",
                      top: "25%",
                      width: `${15 + getFraction() * 5}%`,
                      height: `${15 + getFraction() * 5}%`
                    }}
                  ></div>

                  <div className={styles.bubbleLabel} style={{ left: "20%", top: "40%" }}>
                    Group 1
                  </div>
                  <div className={styles.bubbleLabel} style={{ left: "60%", top: "50%" }}>
                    Group 2
                  </div>
                  <div className={styles.bubbleLabel} style={{ left: "45%", top: "25%" }}>
                    Group 3
                  </div>

                  <div className={styles.bubbleValue} style={{ left: "20%", top: "calc(40% + 10px)" }}>
                    {Math.round(10 + getFraction() * 10)}.2
                  </div>
                  <div className={styles.bubbleValue} style={{ left: "60%", top: "calc(50% + 15px)" }}>
                    {Math.round(7 + getFraction() * 8)}.1
                  </div>
                  <div className={styles.bubbleValue} style={{ left: "45%", top: "calc(25% + 8px)" }}>
                    {Math.round(3 + getFraction() * 5)}.3
                  </div>
                </div>
              </div>
            </>,
            9
          )}

          {/* 11) FORECASTING – TREND PROJECTIONS */}
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
                  transform: `translateX(${randomNoise() * 0.8}px)`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.chartAxisX}></div>
                <div className={styles.chartAxisY}></div>
                <div className={styles.lineChartContainer}>
                  <div className={styles.lineChart}>
                    <div className={styles.lineBase}></div>
                    <div className={styles.linePath}></div>
                    {[...Array(10)].map((_, idx) => (
                      <div key={idx} className={styles.linePoint}></div>
                    ))}
                    <div className={styles.lineFill}></div>
                  </div>
                </div>
              </div>
            </>,
            10
          )}

          {/* 12) TOPOLOGY ANALYSIS – NETWORK SYNTHESIS (not blank) */}
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
                  transform: `rotate(${randomNoise() * 1}deg)`
                }}
              >
                <div className={styles.chartGrid}></div>
                <div className={styles.networkContainer}>
                  {/* 5 nodes in random positions, linked by lines? 
                      For simplicity, keep existing but shift them slightly */}
                  {[...Array(5)].map((_, idx) => {
                    const left = [25, 70, 20, 65, 45][idx];
                    const top = [30, 25, 65, 70, 45][idx];
                    return (
                      <div
                        key={idx}
                        className={styles.networkNode}
                        style={{
                          left: `${left + randomNoise() * 0.2}%`,
                          top: `${top + randomNoise() * 0.2}%`
                        }}
                      ></div>
                    );
                  })}
                  {/* We'll keep the links & label positions as is */}
                  {[...Array(8)].map((_, idx) => (
                    <div key={idx} className={styles.networkLink}></div>
                  ))}
                  <div className={styles.nodeLabel} style={{ left: "25%", top: "10%" }}>
                    Primary
                  </div>
                  <div className={styles.nodeLabel} style={{ left: "70%", top: "10%" }}>
                    Secondary
                  </div>
                  <div className={styles.nodeLabel} style={{ left: "20%", top: "80%" }}>
                    Tertiary
                  </div>
                  <div className={styles.nodeLabel} style={{ left: "65%", top: "85%" }}>
                    Quaternary
                  </div>
                  <div className={styles.nodeLabel} style={{ left: "45%", top: "50%" }}>
                    Central
                  </div>
                </div>
              </div>
            </>,
            11
          )}
        </div>

        {/* Rotating status message */}
        <div className={`${styles.message} ${fade ? styles.fadeIn : styles.fadeOut}`}>
          {loadingMessages[messageIndex]}
        </div>

        {/* Live log area - auto-scrolled */}
        <div className={styles.analysisLog} ref={logRef}>
          {logMessages.map((line, idx) => (
            <div key={idx} className={styles.logLine}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingCircle;

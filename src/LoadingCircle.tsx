import React, { useEffect, useState, useRef } from "react";
import styles from "./LoadingCircle.module.css";

// Helper to clamp a numeric value between min & max
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const TOTAL_MODULES = 12;

const LoadingCircle: React.FC = () => {
  // -------------------------------------------
  //               LOADING MESSAGES
  // -------------------------------------------
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

  // Additional lines to show in the “live log” as the analysis runs
  // We'll also add dynamic lines for random VM boot
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

  // -------------------------------------------
  //                 REACT STATES
  // -------------------------------------------
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);

  // For analysis log
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // 10s timer by default, but can still run up to 30s if needed
  const totalDuration = 10;
  const topLoaderDuration = 8;

  // Keep track of time for the master progress
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Random module "VM loading" states
  // false = not started, true = module is fully "loaded"
  const [moduleLoaded, setModuleLoaded] = useState<boolean[]>(
    Array(TOTAL_MODULES).fill(false)
  );

  // Subtle "micro adjustments" for funnel, bar chart, gauge
  const [funnelAdjust, setFunnelAdjust] = useState<number>(0);
  const [barAdjust, setBarAdjust] = useState<number>(0);
  const [gaugeAdjust, setGaugeAdjust] = useState<number>(0);

  // -------------------------------------------
  //          PROGRESS BAR + MAIN TIMING
  // -------------------------------------------
  useEffect(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }

    // Master timer updates every second, up to totalDuration, then loops if needed
    const masterTimer = window.setInterval(() => {
      setTimeElapsed((current) => {
        if (current >= totalDuration) {
          return 0; // loop if it surpasses 10s
        }
        return current + 1;
      });
    }, 1000);

    // Fill progress bar from 0% to 100% in topLoaderDuration seconds
    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent((_) => {
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

  // -------------------------------------------
  //         ROTATING MESSAGES (4s intervals)
  // -------------------------------------------
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

  // -------------------------------------------
  //  LOGIC FOR RANDOM VM STARTUP (12 modules)
  // -------------------------------------------
  useEffect(() => {
    // We only want to schedule VM startups once
    // For each module, pick a random delay within the first ~4 seconds
    // Then log "[VM] Starting Virtual Machine environment X..."
    // Then after a short random time, mark it loaded & log "VM X ready"
    moduleLoaded.forEach((loaded, i) => {
      if (!loaded) {
        const startDelay = Math.random() * 4000; // up to 4s
        setTimeout(() => {
          // Log that the VM environment is starting
          setLogMessages((prev) => [
            ...prev,
            `[VM] Starting Virtual Machine environment ${i + 1}...`
          ]);
          // Another short random time to finish boot
          const finishDelay = 800 + Math.random() * 1500; // 0.8s - 2.3s
          setTimeout(() => {
            setLogMessages((prev) => [
              ...prev,
              `[VM] Environment ${i + 1} is operational.`
            ]);
            // Mark module as loaded
            setModuleLoaded((prevStates) => {
              const updated = [...prevStates];
              updated[i] = true;
              return updated;
            });
          }, finishDelay);
        }, startDelay);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------
  //  ADDITIONAL PERIODIC LOGS
  // -------------------------------------------
  useEffect(() => {
    // We'll cycle through baseAnalysisLogLines every 2s after the VMs start
    // But only if we haven't appended all lines yet
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------
  //     MICRO-ADJUSTMENTS FOR REALISM
  // -------------------------------------------
  useEffect(() => {
    const microAdjustTimer = setInterval(() => {
      setFunnelAdjust(Math.random() * 10 - 5);
      setBarAdjust(Math.random() * 10 - 5);
      setGaugeAdjust(Math.random() * 3 - 1.5);
    }, 2000);

    return () => {
      clearInterval(microAdjustTimer);
    };
  }, []);

  // Helper for gauge angle
  function getGaugeAngle(baseAngle: number, adjustDeg: number) {
    return clamp(baseAngle + adjustDeg, 0, 90);
  }

  // -------------------------------------------
  //        MODULE ANIMATION CLASSES
  // -------------------------------------------
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
    styles.delay1, styles.delay2, styles.delay3, styles.delay4,
    styles.delay5, styles.delay6, styles.delay7, styles.delay8,
    styles.delay9, styles.delay10, styles.delay11, styles.delay12
  ];

  // Simple function to render each module with its "loading overlay" if not loaded
  function renderModule(content: JSX.Element, moduleIndex: number) {
    const loaded = moduleLoaded[moduleIndex];
    return (
      <div
        className={`${styles.module} ${getAnimationClass(moduleIndex)} ${delayClasses[moduleIndex]}`}
      >
        {!loaded && (
          <div className={styles.vmLoadingOverlay}>
            <div className={styles.vmLoadingText}>
              Loading Virtual Machine {moduleIndex + 1}...
            </div>
          </div>
        )}
        {loaded && content}
      </div>
    );
  }

  // -------------------------------------------
  //                 RENDER
  // -------------------------------------------
  return (
    <div className={styles.container}>
      <div className={styles.header}>Comprehensive Insight Dashboard</div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div
          className={`${styles.progressBar} ${
            progressPercent >= 100 ? styles.progressComplete : ""
          }`}
          style={{ width: `${progressPercent}%` }}
        >
          <div className={styles.progressGlow}></div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.visualization}>

          {/* 1) FUNNEL (renamed generic) */}
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
                    <span className={styles.value}>14,982</span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(100 + funnelAdjust, 0, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "35%" }}>
                    <span className={styles.label}>Key Observations</span>
                    <span className={styles.value}>8,439</span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(85 + funnelAdjust, 0, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "60%" }}>
                    <span className={styles.label}>Potential Patterns</span>
                    <span className={styles.value}>3,214</span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(64 + funnelAdjust, 0, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "85%" }}>
                    <span className={styles.label}>Core Insights</span>
                    <span className={styles.value}>1,897</span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(37 + funnelAdjust, 0, 100)}%`
                      }}
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
              <div className={styles.moduleBody}>
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
              <div className={styles.moduleBody}>
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
              <div className={styles.moduleBody}>
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
              <div className={styles.moduleBody}>
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
              <div className={styles.moduleBody}>
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
                  <div className={styles.yLabels} style={{ left: "10%" }}>
                    <span>Dimension A</span>
                    <span>Dimension B</span>
                    <span>Dimension C</span>
                    <span>Dimension D</span>
                    <span>Dimension E</span>
                  </div>
                </div>
              </div>
            </>,
            5
          )}

          {/* 7) DONUT (Resource Index) */}
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
              <div className={styles.moduleBody}>
                <div className={styles.donutContainer}>
                  <div className={styles.donutRing}></div>
                  <div className={`${styles.donutSegment} ${styles.segment1}`}></div>
                  <div className={`${styles.donutSegment} ${styles.segment2}`}></div>
                  <div className={`${styles.donutSegment} ${styles.segment3}`}></div>
                  <div className={styles.donutHole}></div>
                  <div className={styles.donutLabel}>
                    <div className={styles.value}>68%</div>
                    <div className={styles.text}>Utilization</div>
                  </div>
                  <div className={styles.legendItem}>
                    <span></span>Group A
                  </div>
                  <div className={styles.legendItem}>
                    <span></span>Group B
                  </div>
                  <div className={styles.legendItem}>
                    <span></span>Group C
                  </div>
                </div>
              </div>
            </>,
            6
          )}

          {/* 8) GAUGE (Robustness Overview) */}
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
                      transform: `rotate(${getGaugeAngle(53, gaugeAdjust)}deg)`
                    }}
                  ></div>
                  <div className={styles.gaugeValue}>73% Stable</div>
                </div>
              </div>
            </>,
            7
          )}

          {/* 9) BAR CHART (generic performance) */}
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
                        style={{ height: `${50 + barAdjust}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat A</div>
                      <div className={styles.barValue}>54%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{ height: `${80 + barAdjust}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat B</div>
                      <div className={styles.barValue}>76%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{ height: `${65 + barAdjust}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat C</div>
                      <div className={styles.barValue}>62%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{ height: `${90 + barAdjust}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat D</div>
                      <div className={styles.barValue}>89%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{ height: `${75 + barAdjust}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat E</div>
                      <div className={styles.barValue}>71%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{ height: `${40 + barAdjust}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat F</div>
                      <div className={styles.barValue}>48%</div>
                    </div>
                  </div>
                </div>
              </div>
            </>,
            8
          )}

          {/* 10) BUBBLE CHART (Market Explorer => rename color to #252525) */}
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
              <div className={styles.moduleBody}>
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
                  <div className={styles.bubbleValue}>8.7</div>
                  <div className={styles.bubbleValue}>3.5</div>
                </div>
              </div>
            </>,
            9
          )}

          {/* 11) LINE CHART (Forecasting) */}
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
              <div className={styles.moduleBody}>
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

          {/* 12) NETWORK (Topology Analysis) */}
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
              <div className={styles.moduleBody}>
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
    </div>
  );
};

export default LoadingCircle;

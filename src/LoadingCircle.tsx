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

  // A small random function for micro-changes (less jitter)
  function smallRandom() {
    return (Math.random() - 0.5) * 2; // -1..+1
  }

  // -------------------------------------------
  //                 REACT STATES
  // -------------------------------------------
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);

  // For analysis log
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Keep track of time for the master progress
  const totalDuration = 10;          // ~10s total
  const topLoaderDuration = 8;       // progress bar fills in 8s
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Each module loading state
  const [moduleLoaded, setModuleLoaded] = useState<boolean[]>(
    Array(TOTAL_MODULES).fill(false)
  );

  // Each module's hover
  const [hoveredModuleIndex, setHoveredModuleIndex] = useState<number | null>(null);

  // Ongoing “live” updates: store random seeds for each chart
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

  // Simple descriptive tooltip text per module
  const moduleTooltips = [
    "Funnel module: Observational Data",
    "Radar module: Multi-Faceted Radar Engine",
    "Area chart: Future Mapping – Predictive View",
    "Chord diagram: Comparative Markers – Matrix",
    "Scatter: Multi-Variable Analytics – Factor Explorer",
    "Heatmap: Association Mapping – Connection Grid",
    "Donut: Resource Index – Efficiency Pulse",
    "Gauge: Robustness Overview – Risk Evaluator",
    "Bar chart: Performance Tiers – Efficiency Review",
    "Bubbles: Clustering – Multi-Group Navigator",
    "Line chart: Forecasting – Trend Projections",
    "Network: Topology Analysis – Network Synthesis"
  ];

  // -------------------------------------------
  //          PROGRESS BAR + MAIN TIMING
  // -------------------------------------------
  useEffect(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }

    // Master timer updates every second, but no longer resets at 10s
    const masterTimer = window.setInterval(() => {
      setTimeElapsed((current) => {
        // If we already reached totalDuration, do not reset back to 0
        if (current >= totalDuration) {
          return current; // just stay
        }
        return current + 1;
      });
    }, 1000);

    // Fill progress bar from 0% to 100% in topLoaderDuration seconds
    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent((prev) => {
        // Once we hit 100% we do not revert
        if (timeElapsed < topLoaderDuration) {
          return Math.min((timeElapsed / topLoaderDuration) * 100, 100);
        } else {
          return 100; // done
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
    moduleLoaded.forEach((loaded, i) => {
      if (!loaded) {
        const startDelay = Math.random() * 4000; // up to 4s
        setTimeout(() => {
          // Log advanced boot text
          setLogMessages((prev) => [
            ...prev,
            `[VM] Initializing advanced subsystem for environment ${i + 1}...`,
            `[VM] Loading dynamic libraries...`,
            `[VM] Starting Virtual Machine environment ${i + 1}...`
          ]);
          // Another short random time to finish boot
          const finishDelay = 1000 + Math.random() * 1500;
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
  }, [moduleLoaded]);

  // -------------------------------------------
  //  ADDITIONAL PERIODIC LOGS
  // -------------------------------------------
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

  // -------------------------------------------
  //  CONTINUOUS “LIVE” DATA CHANGES (toned down)
  // -------------------------------------------
  useEffect(() => {
    const liveUpdateTimer = setInterval(() => {
      setLiveRandom({
        funnel: smallRandom() * 2,    // was 10, now 2 => less movement
        bar: smallRandom() * 3,       // was 10, now 3
        gauge: smallRandom() * 1.2,   // was up to 3
        radar: smallRandom() * 0.8,   // smaller amplitude
        chord: smallRandom() * 0.8,
        scatter: smallRandom() * 0.8,
        bubble: smallRandom() * 0.8,
        area: smallRandom() * 0.8,
        line: smallRandom() * 0.8,
        network: smallRandom() * 0.8,
        heatmap: smallRandom() * 0.8,
        donut: smallRandom() * 0.8
      });
    }, 2000); // update every 2s for subtle changes

    return () => {
      clearInterval(liveUpdateTimer);
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

  // For hover tooltips:
  function handleMouseEnter(moduleIndex: number) {
    setHoveredModuleIndex(moduleIndex);
  }
  function handleMouseLeave() {
    setHoveredModuleIndex(null);
  }

  // Render each module with advanced overlay if not loaded
  function renderModule(content: JSX.Element, moduleIndex: number) {
    const loaded = moduleLoaded[moduleIndex];
    return (
      <div
        className={`${styles.module} ${getAnimationClass(moduleIndex)} ${delayClasses[moduleIndex]}`}
        onMouseEnter={() => handleMouseEnter(moduleIndex)}
        onMouseLeave={handleMouseLeave}
      >
        {/* VM loading overlay if not loaded */}
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
        {/* Actual chart content if loaded */}
        {loaded && content}

        {/* Hover tooltip if this module is hovered */}
        {hoveredModuleIndex === moduleIndex && (
          <div className={styles.hoverTooltip}>
            {moduleTooltips[moduleIndex]}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>Your Quantum Analysis In Process...</div>

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
          {/* 1) FUNNEL */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Observational Data – Funnel</div>
                <div className={styles.windowStatus}>Live</div>
              </div>
              <div className={styles.moduleBody}>
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

          {/* 2) RADAR */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Multi-Faceted Radar – Insight Engine</div>
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
                <div className={styles.windowTitle}>Future Mapping – Predictive View</div>
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
                    {/* Multiple data points */}
                    {[...Array(11)].map((_, idx) => (
                      <div key={idx} className={styles.dataPoint}></div>
                    ))}
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
                <div className={styles.windowTitle}>Comparative Markers – Matrix</div>
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
                <div className={styles.windowTitle}>Multi-Variable Analysis – Factor Explorer</div>
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

          {/* 6) HEATMAP (Association Mapping) */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Association Mapping – Connection Grid</div>
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

          {/* 7) DONUT (Resource Index) */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Resource Index – Efficiency Pulse</div>
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

          {/* 8) GAUGE (Robustness) */}
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
                <div className={styles.windowTitle}>Performance Tiers – Efficiency Review</div>
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
                        style={{ height: `${clamp(55 + liveRandom.bar, 0, 100)}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat A</div>
                      <div className={styles.barValue}>58%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{ height: `${clamp(80 + liveRandom.bar, 0, 100)}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat B</div>
                      <div className={styles.barValue}>82%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{ height: `${clamp(68 + liveRandom.bar, 0, 100)}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat C</div>
                      <div className={styles.barValue}>71%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{ height: `${clamp(90 + liveRandom.bar, 0, 100)}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat D</div>
                      <div className={styles.barValue}>93%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{ height: `${clamp(77 + liveRandom.bar, 0, 100)}%` }}
                      ></div>
                      <div className={styles.barLabel}>Cat E</div>
                      <div className={styles.barValue}>79%</div>
                    </div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{ height: `${clamp(42 + liveRandom.bar, 0, 100)}%` }}
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

          {/* 10) BUBBLE (Clustering) */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Clustering – Multi-Group Navigator</div>
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

          {/* 11) LINE (Forecasting) */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Forecasting – Trend Projections</div>
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

          {/* 12) NETWORK (Topology Analysis) */}
          {renderModule(
            <>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red" />
                <span className={styles.trafficLight} data-color="yellow" />
                <span className={styles.trafficLight} data-color="green" />
                <div className={styles.windowTitle}>Topology Analysis – Network Synthesis</div>
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
    </div>
  );
};

export default LoadingCircle;

import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./LoadingCircle.module.css";

// Clamps a numeric value between min & max
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// For each of the 12 modules
const TOTAL_MODULES = 12;

// Interpolation speed factor – higher = faster transitions, lower = slower
const SMOOTH_FACTOR = 0.08; // tweak as needed for desired smoothness

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

  // Additional lines for the live log
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
  //               REACT STATES
  // -------------------------------------------
  // Overall progress
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const totalDuration = 10; // ~10s
  const topLoaderDuration = 8;
  const progressIntervalRef = useRef<number | null>(null);

  // Rotating messages
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);

  // Log messages
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Whether each module is loaded
  const [moduleLoaded, setModuleLoaded] = useState<boolean[]>(
    Array(TOTAL_MODULES).fill(false)
  );

  // Hovered module index for tooltips
  const [hoveredModuleIndex, setHoveredModuleIndex] = useState<number | null>(null);

  // Tooltip text for each module
  const moduleTooltips = [
    "Module 1: Observational Data calculations in progress...",
    "Module 2: Radar analysis scanning multiple dimensions...",
    "Module 3: Predictive area chart updating real-time forecasts...",
    "Module 4: Matrix comparisons balancing new data...",
    "Module 5: Factor analysis cross-checking multi-variables...",
    "Module 6: Heatmap synergy detection across channels...",
    "Module 7: Resource index scanning usage efficiency...",
    "Module 8: Risk gauge analyzing real-time stability metrics...",
    "Module 9: Bar chart performance tiers adjusting dynamically...",
    "Module 10: Bubble clustering updating group patterns...",
    "Module 11: Line forecasting refining near-term trends...",
    "Module 12: Topology network analyzing node connectivity..."
  ];

  // -------------------------------------------
  //    SMOOTH LIVE UPDATES (current vs. target)
  // -------------------------------------------

  // We store *two* sets of data: current (display) and target (random).
  // We'll continuously interpolate current -> target each frame.
  
  // (1) For micro transforms
  const [transformCurrent, setTransformCurrent] = useState({
    funnel: 0, bar: 0, gauge: 0, radar: 0,
    chord: 0, scatter: 0, bubble: 0, area: 0,
    line: 0, network: 0, heatmap: 0, donut: 0
  });
  const [transformTarget, setTransformTarget] = useState({
    funnel: 0, bar: 0, gauge: 0, radar: 0,
    chord: 0, scatter: 0, bubble: 0, area: 0,
    line: 0, network: 0, heatmap: 0, donut: 0
  });

  // (2) Funnel numeric
  const [funnelCurrent, setFunnelCurrent] = useState([15000, 9300, 4200, 2500]);
  const [funnelTarget, setFunnelTarget] = useState([15000, 9300, 4200, 2500]);

  // (3) Bar numeric (6 categories)
  const [barCurrent, setBarCurrent] = useState([58, 82, 71, 93, 79, 46]);
  const [barTarget, setBarTarget] = useState([58, 82, 71, 93, 79, 46]);

  // (4) Donut numeric
  const [donutCurrent, setDonutCurrent] = useState(72);
  const [donutTarget, setDonutTarget] = useState(72);

  // (5) Gauge numeric
  const [gaugeCurrent, setGaugeCurrent] = useState(81);
  const [gaugeTarget, setGaugeTarget] = useState(81);

  // -------------------------------------------
  //         RANDOM VM STARTUP LOGIC
  // -------------------------------------------
  useEffect(() => {
    // Each module randomly starts
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
          // Another short random time to finish boot
          const finishDelay = 1000 + Math.random() * 1500;
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

  // -------------------------------------------
  //       BASE PERIODIC LOGS
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
    return () => clearInterval(analysisTimer);
  }, [baseAnalysisLogLines]);

  // -------------------------------------------
  //          PROGRESS BAR + MAIN TIMING
  // -------------------------------------------
  useEffect(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    const masterTimer = window.setInterval(() => {
      setTimeElapsed((curr) => {
        if (curr >= totalDuration) return 0;
        return curr + 1;
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
  }, [timeElapsed, topLoaderDuration, totalDuration]);

  // -------------------------------------------
  //    ROTATING MESSAGES (4s intervals)
  // -------------------------------------------
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

  // -------------------------------------------
  //   SMOOTH TARGET UPDATES (RANDOM GOALS)
  // -------------------------------------------
  // We'll pick new random target values every 1.5-2 seconds,
  // but the actual display is interpolated via requestAnimationFrame.
  useEffect(() => {
    const randomTargetTimer = setInterval(() => {
      // Update transformTarget with new randoms
      setTransformTarget({
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

      // funnel
      setFunnelTarget((prev) => {
        return [
          clamp(prev[0] + (Math.random() * 500 - 250), 10000, 20000),
          clamp(prev[1] + (Math.random() * 400 - 200), 6000, 15000),
          clamp(prev[2] + (Math.random() * 300 - 150), 1000, 8000),
          clamp(prev[3] + (Math.random() * 200 - 100), 500, 5000)
        ];
      });

      // bar
      setBarTarget((prev) => {
        return prev.map((v) => clamp(v + (Math.random() * 6 - 3), 0, 100));
      }) as any;

      // donut
      setDonutTarget((prev) => clamp(prev + (Math.random() * 4 - 2), 50, 95));

      // gauge
      setGaugeTarget((prev) => clamp(prev + (Math.random() * 3 - 1.5), 50, 99));

    }, 1800 + Math.random() * 400); // ~1.8-2.2s
    return () => clearInterval(randomTargetTimer);
  }, []);

  // -------------------------------------------
  //   SMOOTH INTERPOLATION WITH requestAnimationFrame
  // -------------------------------------------
  const rAFRef = useRef<number | null>(null);

  const animateFrame = useCallback(() => {
    // 1) transform
    setTransformCurrent((curr) => {
      const next = { ...curr };
      Object.keys(curr).forEach((key) => {
        const k = key as keyof typeof curr;
        // e.g. next.funnel = ...
        next[k] = curr[k] + (transformTarget[k] - curr[k]) * SMOOTH_FACTOR;
      });
      return next;
    });

    // 2) funnel
    setFunnelCurrent((curr) => {
      return curr.map((val, i) => {
        const diff = funnelTarget[i] - val;
        return val + diff * SMOOTH_FACTOR;
      }) as number[];
    });

    // 3) bar
    setBarCurrent((curr) => {
      return curr.map((val, i) => {
        const diff = barTarget[i] - val;
        return val + diff * SMOOTH_FACTOR;
      });
    });

    // 4) donut
    setDonutCurrent((val) => {
      const diff = donutTarget - val;
      return val + diff * SMOOTH_FACTOR;
    });

    // 5) gauge
    setGaugeCurrent((val) => {
      const diff = gaugeTarget - val;
      return val + diff * SMOOTH_FACTOR;
    });

    // schedule next frame
    rAFRef.current = requestAnimationFrame(animateFrame);
  }, [barTarget, donutTarget, funnelTarget, gaugeTarget, transformTarget]);

  useEffect(() => {
    rAFRef.current = requestAnimationFrame(animateFrame);
    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [animateFrame]);

  // Gauge angle helper
  function getGaugeAngle(baseAngle: number, adjustDeg: number) {
    return clamp(baseAngle + adjustDeg, 0, 90);
  }

  // -------------------------------------------
  //   MODULES + HOVER TOOLTIP
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

  const delayClasses = [
    styles.delay1, styles.delay2, styles.delay3, styles.delay4,
    styles.delay5, styles.delay6, styles.delay7, styles.delay8,
    styles.delay9, styles.delay10, styles.delay11, styles.delay12
  ];

  function handleMouseEnter(idx: number) {
    setHoveredModuleIndex(idx);
  }
  function handleMouseLeave() {
    setHoveredModuleIndex(null);
  }

  function renderModule(content: JSX.Element, moduleIndex: number) {
    const loaded = moduleLoaded[moduleIndex];
    return (
      <div
        className={`${styles.module} ${getAnimationClass(moduleIndex)} ${delayClasses[moduleIndex]}`}
        onMouseEnter={() => handleMouseEnter(moduleIndex)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Boot overlay if not loaded */}
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

        {/* Actual content if loaded */}
        {loaded && content}

        {/* Hover tooltip */}
        {hoveredModuleIndex === moduleIndex && (
          <div className={styles.hoverTooltip}>
            {moduleTooltips[moduleIndex]}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------
  //                RENDER
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
                    <span className={styles.value}>
                      {Math.round(funnelCurrent[0])}
                    </span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(100 + transformCurrent.funnel, 0, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "35%" }}>
                    <span className={styles.label}>Key Observations</span>
                    <span className={styles.value}>
                      {Math.round(funnelCurrent[1])}
                    </span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(85 + transformCurrent.funnel, 0, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "60%" }}>
                    <span className={styles.label}>Potential Patterns</span>
                    <span className={styles.value}>
                      {Math.round(funnelCurrent[2])}
                    </span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(65 + transformCurrent.funnel, 0, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className={styles.funnelMetric} style={{ top: "85%" }}>
                    <span className={styles.label}>Core Insights</span>
                    <span className={styles.value}>
                      {Math.round(funnelCurrent[3])}
                    </span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${clamp(40 + transformCurrent.funnel, 0, 100)}%`
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `scale(${1 + transformCurrent.radar * 0.01})`
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
                  transform: `scale(${1 + transformCurrent.area * 0.01})`
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
                  transform: `translateY(${transformCurrent.chord * 0.5}px)`
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
                  transform: `rotate(${transformCurrent.scatter * 0.5}deg)`
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
                  transform: `scale(${1 + transformCurrent.heatmap * 0.01})`
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
                <div className={styles.windowTitle}>
                  Resource Index – Efficiency Pulse
                </div>
                <div className={styles.windowStatus}>Processing</div>
              </div>
              <div
                className={styles.moduleBody}
                style={{
                  transform: `rotate(${transformCurrent.donut * 0.5}deg)`
                }}
              >
                <div className={styles.donutContainer}>
                  <div className={styles.donutRing}></div>
                  <div className={`${styles.donutSegment} ${styles.segment1}`}></div>
                  <div className={`${styles.donutSegment} ${styles.segment2}`}></div>
                  <div className={`${styles.donutSegment} ${styles.segment3}`}></div>
                  <div className={styles.donutHole}></div>
                  <div className={styles.donutLabel}>
                    <div className={styles.value}>{Math.round(donutCurrent)}%</div>
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
                      transform: `rotate(${getGaugeAngle(53, transformCurrent.gauge)}deg)`
                    }}
                  ></div>
                  <div className={styles.gaugeValue}>
                    {Math.round(gaugeCurrent)}% Stable
                  </div>
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
                    {barCurrent.map((val, idx) => (
                      <div key={idx} className={styles.barWrapper}>
                        <div
                          className={styles.bar}
                          style={{
                            height: `${clamp(val + transformCurrent.bar, 0, 100)}%`
                          }}
                        ></div>
                        <div className={styles.barLabel}>
                          Cat {String.fromCharCode(65 + idx)}
                        </div>
                        <div className={styles.barValue}>
                          {Math.round(val)}%
                        </div>
                      </div>
                    ))}
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
                <div className={styles.windowTitle}>
                  Clustering – Multi-Group Navigator
                </div>
                <div className={styles.windowStatus}>Mapping</div>
              </div>
              <div
                className={styles.moduleBody}
                style={{
                  transform: `scale(${1 + transformCurrent.bubble * 0.01})`
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
                <div className={styles.windowTitle}>
                  Forecasting – Trend Projections
                </div>
                <div className={styles.windowStatus}>Predicting</div>
              </div>
              <div
                className={styles.moduleBody}
                style={{
                  transform: `translateX(${transformCurrent.line * 0.5}px)`
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
              <div
                className={styles.moduleBody}
                style={{
                  transform: `rotate(${transformCurrent.network * 0.5}deg)`
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

        {/* Rotating message */}
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

import React, { useEffect, useState, useRef } from "react";
import styles from "./LoadingCircle.module.css";

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

  // Additional log lines for "live VM log" effect
  const analysisLogLines = [
    "[VM] Starting Virtual Machine environment 1...",
    "[VM] Checking resource pool allocation...",
    "[VM] Boot complete: environment 1",
    "[VM] Starting Virtual Machine environment 2...",
    "[VM] Launching advanced heuristics...",
    "[Data] Fetching cluster 1 from distributed nodes...",
    "[Data] Real-time signal aggregator started...",
    "[VM] Starting Virtual Machine environment 3...",
    "[Data] Pipeline stable: no anomalies found",
    "[Data] Recalibrating correlation thresholds...",
    "[System] GPU acceleration verified",
    "[System] CPU usage stable at 72%",
    "[Data] Cross-correlation check in progress...",
    "[System] Memory usage: 1.2 GB / 8 GB",
    "[Data] Forecast model iteration #3 in progress...",
    "[System] All sub-processes stable",
    "[VM] Starting Virtual Machine environment 4...",
    "[Data] Gathering final summary metrics...",
    "[System] Exporting insights..."
  ];

  // -------------------------------------------
  //                 REACT STATES
  // -------------------------------------------
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);

  // Analysis log
  const [logIndex, setLogIndex] = useState<number>(0);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // 30s cycle + 8s top loader
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const totalDuration = 30;
  const topLoaderDuration = 8;

  // Micro-adjustments
  const [funnelAdjust, setFunnelAdjust] = useState<number>(0);
  const [barAdjust, setBarAdjust] = useState<number>(0);
  const [gaugeAdjust, setGaugeAdjust] = useState<number>(0);

  // -------------------------------------------
  //   PROGRESS BAR + MAIN TIMING (30s cycle)
  // -------------------------------------------
  useEffect(() => {
    // Clear any previous intervals
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }

    // Master timer: increments timeElapsed by 1s
    const masterTimer = window.setInterval(() => {
      setTimeElapsed((_prev) => {
        if (_prev >= totalDuration) {
          // Reset after 30s
          return 0;
        }
        return _prev + 1;
      });
    }, 1000);

    // Fill the progress bar to 100% by ~8s
    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent((_prev) => {
        if (timeElapsed < topLoaderDuration) {
          // Gradual fill from 0% → 100% over 8s
          const newVal = Math.min((timeElapsed / topLoaderDuration) * 100, 100);
          return newVal;
        }
        // Once 8s passes, keep at 100%
        return 100;
      });
    }, 300);

    return () => {
      window.clearInterval(masterTimer);
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [timeElapsed]);

  // -------------------------------------------
  //        ROTATING MESSAGES (every 4s)
  // -------------------------------------------
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((_prev) => (_prev + 1) % loadingMessages.length);
        setFade(true);
      }, 300);
    }, 4000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadingMessages.length]);

  // -------------------------------------------
  //        ANALYSIS LOG (live “VM” lines)
  // -------------------------------------------
  useEffect(() => {
    // Add a log line ~every 1.5s
    const logTimer = window.setInterval(() => {
      setLogIndex((_prev) => {
        const next = _prev + 1;
        if (next >= analysisLogLines.length) {
          return 0;
        }
        return next;
      });

      setLogMessages((_prev) => {
        const newMsg = analysisLogLines[logIndex % analysisLogLines.length];
        return [..._prev, newMsg];
      });
    }, 1500);

    // Reset the log each 30s cycle
    if (timeElapsed === 0) {
      setLogIndex(0);
      setLogMessages([]);
    }

    return () => {
      window.clearInterval(logTimer);
    };
  }, [logIndex, timeElapsed, analysisLogLines]);

  // -------------------------------------------
  //     MICRO-ADJUSTMENTS (funnel/bar/gauge)
  // -------------------------------------------
  useEffect(() => {
    const microAdjustTimer = window.setInterval(() => {
      setFunnelAdjust(Math.random() * 10 - 5); // random -5..+5
      setBarAdjust(Math.random() * 10 - 5);
      setGaugeAdjust(Math.random() * 3 - 1.5); // small angle shift
    }, 2000);

    return () => {
      window.clearInterval(microAdjustTimer);
    };
  }, []);

  // Helper to clamp funnel widths
  function getWidthPercent(basePercent: number, adjust: number) {
    const val = basePercent + adjust;
    return Math.max(0, Math.min(100, val));
  }

  // Helper to clamp gauge angles
  function getGaugeAngle(baseAngle: number, adjustDeg: number) {
    const val = baseAngle + adjustDeg;
    return Math.max(0, Math.min(90, val));
  }

  // -------------------------------------------
  //   GET ANIMATION CLASS PER MODULE (4 types)
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

  // Natural stagger delay for each of 12 modules
  const delayClasses = [
    styles.delay1, styles.delay2, styles.delay3, styles.delay4,
    styles.delay5, styles.delay6, styles.delay7, styles.delay8,
    styles.delay9, styles.delay10, styles.delay11, styles.delay12
  ];

  // -------------------------------------------
  //                 RENDER
  // -------------------------------------------
  return (
    <div className={styles.container}>
      <div className={styles.header}>Comprehensive Insight Dashboard</div>

      {/* Top Progress Bar */}
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
          {/* 1) KPI NAVIGATOR */}
          <div className={`${styles.module} ${getAnimationClass(0)} ${delayClasses[0]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Key Performance Indices – Data Navigator
              </div>
              <div className={styles.windowStatus}>Live</div>
            </div>
            <div className={styles.moduleBody}>
              {/* Funnel-like chart */}
              <div className={styles.funnelContainer}>
                <div className={styles.funnelMetric} style={{ top: "10%" }}>
                  <span className={styles.label}>Traffic Volume</span>
                  <span className={styles.value}>14,982</span>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${getWidthPercent(100, funnelAdjust)}%`
                    }}
                  ></div>
                </div>
                <div className={styles.funnelMetric} style={{ top: "35%" }}>
                  <span className={styles.label}>Qualified Leads</span>
                  <span className={styles.value}>8,439</span>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${getWidthPercent(85, funnelAdjust)}%`
                    }}
                  ></div>
                </div>
                <div className={styles.funnelMetric} style={{ top: "60%" }}>
                  <span className={styles.label}>Sales Opportunities</span>
                  <span className={styles.value}>3,214</span>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${getWidthPercent(64, funnelAdjust)}%`
                    }}
                  ></div>
                </div>
                <div className={styles.funnelMetric} style={{ top: "85%" }}>
                  <span className={styles.label}>Closed Deals</span>
                  <span className={styles.value}>1,897</span>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${getWidthPercent(37, funnelAdjust)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2) OPPORTUNITY MATRIX */}
          <div className={`${styles.module} ${getAnimationClass(1)} ${delayClasses[1]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Opportunity Potential – Insight Engine
              </div>
              <div className={styles.windowStatus}>Processing</div>
            </div>
            <div className={styles.moduleBody}>
              {/* Radar Chart */}
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
          </div>

          {/* 3) PROJECTIVE PATTERNS */}
          <div className={`${styles.module} ${getAnimationClass(2)} ${delayClasses[2]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Trend Casting – Future Mapper
              </div>
              <div className={styles.windowStatus}>Analyzing</div>
            </div>
            <div className={styles.moduleBody}>
              {/* Area Chart */}
              <div className={styles.chartGrid}></div>
              <div className={styles.chartAxisX}></div>
              <div className={styles.chartAxisY}></div>
              <div className={styles.areaChartContainer}>
                <div className={styles.areaPath}>
                  <div className={styles.area}></div>
                  <div className={styles.areaLine}></div>
                  {/* data points... */}
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
          </div>

          {/* 4) COMPARATIVE MARKERS */}
          <div className={`${styles.module} ${getAnimationClass(3)} ${delayClasses[3]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Comparative Markers – Performance Matrix
              </div>
              <div className={styles.windowStatus}>Computing</div>
            </div>
            <div className={styles.moduleBody}>
              {/* Chord Diagram */}
              <div className={styles.chordContainer}>
                <div className={styles.chordCircle}></div>
                <div className={styles.chordArc}></div>
                <div className={styles.chordArc}></div>
                <div className={styles.chordArc}></div>
                <div className={styles.chord}></div>
                <div className={styles.chord2}></div>
              </div>
            </div>
          </div>

          {/* 5) FACTOR ANALYSIS */}
          <div className={`${styles.module} ${getAnimationClass(0)} ${delayClasses[4]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Multi-Variable Analytics – Factor Explorer
              </div>
              <div className={styles.windowStatus}>Active</div>
            </div>
            <div className={styles.moduleBody}>
              {/* Scatter Plot */}
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
          </div>

          {/* 6) ASSOCIATION MATRIX */}
          <div className={`${styles.module} ${getAnimationClass(1)} ${delayClasses[5]}`}>
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
              {/* Heatmap */}
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
                  <span>Email</span>
                  <span>Social</span>
                  <span>Ads</span>
                  <span>Search</span>
                  <span>Direct</span>
                </div>
                <div className={styles.yLabels} style={{ left: "7%" }}>
                  <span>Reach</span>
                  <span>Interest</span>
                  <span>Intent</span>
                  <span>Purchase</span>
                  <span>Loyalty</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7) RESOURCE INDEX */}
          <div className={`${styles.module} ${getAnimationClass(2)} ${delayClasses[6]}`}>
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
              {/* Donut Chart */}
              <div className={styles.donutContainer}>
                <div className={styles.donutRing}></div>
                <div className={`${styles.donutSegment} ${styles.segment1}`}></div>
                <div className={`${styles.donutSegment} ${styles.segment2}`}></div>
                <div className={`${styles.donutSegment} ${styles.segment3}`}></div>
                <div className={styles.donutHole}></div>
                <div className={styles.donutLabel}>
                  <div className={styles.value}>68%</div>
                  <div className={styles.text}>Efficiency</div>
                </div>
                <div className={styles.legendItem}>
                  <span></span>Paid Media
                </div>
                <div className={styles.legendItem}>
                  <span></span>Content Marketing
                </div>
                <div className={styles.legendItem}>
                  <span></span>Direct Engagement
                </div>
              </div>
            </div>
          </div>

          {/* 8) ROBUSTNESS OVERVIEW */}
          <div className={`${styles.module} ${getAnimationClass(3)} ${delayClasses[7]}`}>
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
              {/* Gauge Chart */}
              <div className={styles.gaugeContainer}>
                <div className={styles.gaugeBackground}></div>
                <div
                  className={styles.gaugeMeter}
                  style={{
                    transform: `scale(1) rotate(-90deg)`
                  }}
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
          </div>

          {/* 9) PERFORMANCE TIERS */}
          <div className={`${styles.module} ${getAnimationClass(0)} ${delayClasses[8]}`}>
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
              {/* Bar Chart */}
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
                    <div className={styles.barLabel}>Q1</div>
                    <div className={styles.barValue}>54%</div>
                  </div>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ height: `${80 + barAdjust}%` }}
                    ></div>
                    <div className={styles.barLabel}>Q2</div>
                    <div className={styles.barValue}>76%</div>
                  </div>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ height: `${65 + barAdjust}%` }}
                    ></div>
                    <div className={styles.barLabel}>Q3</div>
                    <div className={styles.barValue}>62%</div>
                  </div>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ height: `${90 + barAdjust}%` }}
                    ></div>
                    <div className={styles.barLabel}>Q4</div>
                    <div className={styles.barValue}>89%</div>
                  </div>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ height: `${75 + barAdjust}%` }}
                    ></div>
                    <div className={styles.barLabel}>Q5</div>
                    <div className={styles.barValue}>71%</div>
                  </div>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ height: `${40 + barAdjust}%` }}
                    ></div>
                    <div className={styles.barLabel}>Q6</div>
                    <div className={styles.barValue}>48%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 10) MARKET EXPLORER */}
          <div className={`${styles.module} ${getAnimationClass(1)} ${delayClasses[9]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Market Explorer – Cluster Navigator
              </div>
              <div className={styles.windowStatus}>Mapping</div>
            </div>
            <div className={styles.moduleBody}>
              {/* Bubble Chart */}
              <div className={styles.chartGrid}></div>
              <div className={styles.chartAxisX}></div>
              <div className={styles.chartAxisY}></div>
              <div className={styles.bubbleContainer}>
                <div className={styles.bubble}></div>
                <div className={styles.bubble}></div>
                <div className={styles.bubble}></div>
                <div className={styles.bubbleLabel}>Enterprise</div>
                <div className={styles.bubbleLabel}>Mid-Market</div>
                <div className={styles.bubbleLabel}>SMB</div>
                <div className={styles.bubbleValue}>$14.2M</div>
                <div className={styles.bubbleValue}>$8.7M</div>
                <div className={styles.bubbleValue}>$3.5M</div>
              </div>
            </div>
          </div>

          {/* 11) FORECASTING */}
          <div className={`${styles.module} ${getAnimationClass(2)} ${delayClasses[10]}`}>
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
              {/* Line Chart */}
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
          </div>

          {/* 12) TOPOLOGY ANALYSIS */}
          <div className={`${styles.module} ${getAnimationClass(3)} ${delayClasses[11]}`}>
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
              {/* Network Diagram */}
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
          </div>
        </div>

        {/* Rotating single-line status message */}
        <div className={`${styles.message} ${fade ? styles.fadeIn : styles.fadeOut}`}>
          {loadingMessages[messageIndex]}
        </div>

        {/* Analysis Log Area */}
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

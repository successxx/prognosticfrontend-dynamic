import React, { useEffect, useState, useRef } from "react";
import styles from "./LoadingCircle.module.css";

const LoadingCircle: React.FC = () => {
  // Professional analysis messages
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

  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);

  // Handle progress bar + rotating messages
  useEffect(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    // Gradually increase the progress bar, aiming at current messageIndex
    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent((prev) => {
        const target = (messageIndex / (loadingMessages.length - 1)) * 100;
        return prev < target ? Math.min(prev + 0.5, target) : prev;
      });
    }, 100);

    // Rotate messages every 4s
    const updateMessage = () => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        setFade(true);
      }, 500);
    };
    const intervalId = setInterval(updateMessage, 4000);

    return () => {
      clearInterval(intervalId);
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [messageIndex, loadingMessages.length]);

  // 4 animation classes for more natural appearance
  const animationClasses = [
    styles.animation1,
    styles.animation2,
    styles.animation3,
    styles.animation4
  ];

  // Get animation class based on module index
  function getAnimationClass(i: number) {
    return animationClasses[i % animationClasses.length];
  }

  // 12 different delay classes for more natural staggering
  const delayClasses = [
    styles.delay1, styles.delay2, styles.delay3, styles.delay4,
    styles.delay5, styles.delay6, styles.delay7, styles.delay8,
    styles.delay9, styles.delay10, styles.delay11, styles.delay12
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>Comprehensive Insight Dashboard</div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progressPercent}%` }}
        >
          <div className={styles.progressGlow}></div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.visualization}>

          {/* 1) CONVERSION FUNNEL ANALYSIS */}
          <div className={`${styles.module} ${getAnimationClass(0)} ${delayClasses[0]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Core Metrics – Data Navigator
              </div>
              <div className={styles.windowStatus}>Live</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.chartAxisX}></div>
              <div className={styles.chartAxisY}></div>

              <div className={styles.funnelContainer}>
                <div className={styles.funnelMetric}>
                  <span className={styles.label}>Traffic Volume</span>
                  <span className={styles.value}>14,982</span>
                  <div className={styles.bar} style={{width: '100%'}}></div>
                </div>
                <div className={styles.funnelMetric}>
                  <span className={styles.label}>Qualified Leads</span>
                  <span className={styles.value}>8,439</span>
                  <div className={styles.bar} style={{width: '85%'}}></div>
                </div>
                <div className={styles.funnelMetric}>
                  <span className={styles.label}>Sales Opportunities</span>
                  <span className={styles.value}>3,214</span>
                  <div className={styles.bar} style={{width: '64%'}}></div>
                </div>
                <div className={styles.funnelMetric}>
                  <span className={styles.label}>Closed Deals</span>
                  <span className={styles.value}>1,897</span>
                  <div className={styles.bar} style={{width: '37%'}}></div>
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
                Opportunity Matrix – Insight Engine
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
          </div>

          {/* 3) PREDICTIVE TRENDS */}
          <div className={`${styles.module} ${getAnimationClass(2)} ${delayClasses[2]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Predictive Trends – Future Mapper
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
          </div>

          {/* 4) COMPARATIVE BENCHMARKS */}
          <div className={`${styles.module} ${getAnimationClass(3)} ${delayClasses[3]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Comparative Benchmarks – Performance Spectrum
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
          </div>

          {/* 5) MULTI-FACTOR ANALYSIS */}
          <div className={`${styles.module} ${getAnimationClass(0)} ${delayClasses[4]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Multi-Factor Analysis – Variable Insights
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
          </div>

          {/* 6) CORRELATION MAPPING */}
          <div className={`${styles.module} ${getAnimationClass(1)} ${delayClasses[5]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Correlation Mapping – Connection Grid
              </div>
              <div className={styles.windowStatus}>Calculating</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.heatmapContainer}>
                <div className={styles.heatmapGrid}>
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
                <div className={styles.yLabels}>
                  <span>Reach</span>
                  <span>Interest</span>
                  <span>Intent</span>
                  <span>Purchase</span>
                  <span>Loyalty</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7) RESOURCE EFFICIENCY */}
          <div className={`${styles.module} ${getAnimationClass(2)} ${delayClasses[6]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Resource Efficiency – Optimization Pulse
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

          {/* 8) STABILITY OVERVIEW */}
          <div className={`${styles.module} ${getAnimationClass(3)} ${delayClasses[7]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Stability Overview – Risk Evaluator
              </div>
              <div className={styles.windowStatus}>Measuring</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.gaugeContainer}>
                <div className={styles.gaugeBackground}></div>
                <div className={styles.gaugeMeter}></div>
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
                <div className={styles.gaugeNeedle}></div>
                <div className={styles.gaugeValue}>73% Stable</div>
              </div>
            </div>
          </div>

          {/* 9) PERFORMANCE LAYERS */}
          <div className={`${styles.module} ${getAnimationClass(0)} ${delayClasses[8]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Performance Layers – Efficiency Review
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
                    <div className={styles.bar}></div>
                    <div className={styles.barLabel}>Q1</div>
                    <div className={styles.barValue}>54%</div>
                  </div>
                  <div className={styles.barWrapper}>
                    <div className={styles.bar}></div>
                    <div className={styles.barLabel}>Q2</div>
                    <div className={styles.barValue}>76%</div>
                  </div>
                  <div className={styles.barWrapper}>
                    <div className={styles.bar}></div>
                    <div className={styles.barLabel}>Q3</div>
                    <div className={styles.barValue}>62%</div>
                  </div>
                  <div className={styles.barWrapper}>
                    <div className={styles.bar}></div>
                    <div className={styles.barLabel}>Q4</div>
                    <div className={styles.barValue}>89%</div>
                  </div>
                  <div className={styles.barWrapper}>
                    <div className={styles.bar}></div>
                    <div className={styles.barLabel}>Q5</div>
                    <div className={styles.barValue}>71%</div>
                  </div>
                  <div className={styles.barWrapper}>
                    <div className={styles.bar}></div>
                    <div className={styles.barLabel}>Q6</div>
                    <div className={styles.barValue}>48%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 10) MARKET INTELLIGENCE */}
          <div className={`${styles.module} ${getAnimationClass(1)} ${delayClasses[9]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Market Intelligence – Cluster Navigator
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
                <div className={styles.bubbleLabel}>Enterprise</div>
                <div className={styles.bubbleLabel}>Mid-Market</div>
                <div className={styles.bubbleLabel}>SMB</div>
                <div className={styles.bubbleValue}>$14.2M</div>
                <div className={styles.bubbleValue}>$8.7M</div>
                <div className={styles.bubbleValue}>$3.5M</div>
              </div>
            </div>
          </div>

          {/* 11) FORECAST MODELING */}
          <div className={`${styles.module} ${getAnimationClass(2)} ${delayClasses[10]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Forecast Modeling – Trend Projections
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
          </div>

          {/* 12) PATTERN DISCOVERY */}
          <div className={`${styles.module} ${getAnimationClass(3)} ${delayClasses[11]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Pattern Discovery – Network Synthesis
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
          </div>
        </div>

        {/* Rotating messages */}
        <div className={`${styles.message} ${fade ? styles.fadeIn : styles.fadeOut}`}>
          {loadingMessages[messageIndex]}
        </div>
      </div>
    </div>
  );
};

export default LoadingCircle;

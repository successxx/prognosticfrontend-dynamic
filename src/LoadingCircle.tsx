import React, { useEffect, useState, useRef } from "react";
import styles from "./LoadingIndicator.module.css";

const LoadingIndicator: React.FC = () => {
  const loadingMessages = [
    "Extracting pattern recognition variables...",
    "Processing multi-dimensional data vectors...",
    "Calibrating predictive algorithms...",
    "Identifying high-value opportunities...",
    "Analyzing conversion optimization factors...",
    "Detecting market positioning anomalies...",
    "Synthesizing competitive intelligence insights...",
    "Calculating optimal engagement strategies...",
    "Mapping customer journey inflection points...",
    "Refining strategic opportunity metrics...",
    "Final synthesis complete—preparing insights..."
  ];

  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [visibleModules, setVisibleModules] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);
  const moduleIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Progress bar increments toward the ratio of messageIndex
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent((prev) => {
        const target = (messageIndex / (loadingMessages.length - 1)) * 100;
        return prev < target ? Math.min(prev + 0.5, target) : prev;
      });
    }, 100);

    // Message rotation
    const updateMessage = () => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        setFade(true);
      }, 500);
    };
    const intervalId = setInterval(updateMessage, 4000);

    // Module appearance (revealing one at a time)
    if (moduleIntervalRef.current) {
      window.clearInterval(moduleIntervalRef.current);
    }
    if (visibleModules < 12) {
      moduleIntervalRef.current = window.setInterval(() => {
        setVisibleModules(prev => {
          const next = prev + 1;
          return next <= 12 ? next : prev;
        });
      }, 500); // One module every 500ms
    }

    return () => {
      clearInterval(intervalId);
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
      if (moduleIntervalRef.current) {
        window.clearInterval(moduleIntervalRef.current);
      }
    };
  }, [messageIndex, loadingMessages.length, visibleModules]);

  // Create randomized slight delays for naturalistic animation
  const getRandomDelay = (index: number) => {
    const baseDelay = index * 0.4; // Base delay is sequential
    const jitter = Math.random() * 0.2; // Random jitter between 0-0.2s
    return baseDelay + jitter;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Advanced Intelligence Analysis</div>

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
          {/* 1) FUNNEL WITH REAL DATA */}
          {visibleModules >= 1 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(0)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Conversion Optimization Analysis</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.funnelChart}>
                  <div className={styles.funnelSegment} data-level="1">
                    <span className={styles.funnelLabel}>Visitors</span>
                    <span className={styles.funnelValue}>2,413</span>
                  </div>
                  <div className={styles.funnelSegment} data-level="2">
                    <span className={styles.funnelLabel}>Leads</span>
                    <span className={styles.funnelValue}>1,285</span>
                  </div>
                  <div className={styles.funnelSegment} data-level="3">
                    <span className={styles.funnelLabel}>Qualified</span>
                    <span className={styles.funnelValue}>743</span>
                  </div>
                  <div className={styles.funnelSegment} data-level="4">
                    <span className={styles.funnelLabel}>Converted</span>
                    <span className={styles.funnelValue}>416</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2) OPPORTUNITY RADAR WITH ACTUAL POINTS */}
          {visibleModules >= 2 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(1)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Market Opportunity Radar</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.radarContainer}>
                  <div className={styles.radarAxes}></div>
                  <div className={styles.radarCircles}></div>
                  <div className={styles.radarArea}></div>
                  <div className={styles.radarLegend}>
                    <div className={styles.legendItem} data-type="growth">Growth</div>
                    <div className={styles.legendItem} data-type="risk">Risk</div>
                    <div className={styles.legendItem} data-type="value">Value</div>
                    <div className={styles.legendItem} data-type="competition">Competition</div>
                  </div>
                  <div className={styles.radarDot} data-dot="1"></div>
                  <div className={styles.radarDot} data-dot="2"></div>
                  <div className={styles.radarDot} data-dot="3"></div>
                  <div className={styles.radarDot} data-dot="4"></div>
                </div>
              </div>
            </div>
          )}

          {/* 3) TREND ANALYSIS CHART */}
          {visibleModules >= 3 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(2)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Predictive Trend Analysis</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.trendAnalysisChart}>
                  <div className={styles.chartGrid}></div>
                  <div className={styles.chartAxis}></div>
                  <div className={styles.chartBarContainer}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={styles.chartBar} data-bar={i}></div>
                    ))}
                  </div>
                  <div className={styles.trendLine}></div>
                  <div className={styles.projectionLine}></div>
                </div>
              </div>
            </div>
          )}

          {/* 4) RELATIONSHIP CHORD DIAGRAM */}
          {visibleModules >= 4 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(3)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Strategic Relationship Mapping</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.chordContainer}>
                  <div className={styles.chordRing}></div>
                  <div className={styles.chordNodes}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={styles.chordNode} data-node={i}></div>
                    ))}
                  </div>
                  <div className={styles.chordLink} data-chord="1"></div>
                  <div className={styles.chordLink} data-chord="2"></div>
                  <div className={styles.chordLink} data-chord="3"></div>
                  <div className={styles.chordLink} data-chord="4"></div>
                </div>
              </div>
            </div>
          )}

          {/* 5) MULTI-DIMENSIONAL SCATTER PLOT */}
          {visibleModules >= 5 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(4)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Engagement Factor Analysis</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.scatterWrap}>
                  <div className={styles.scatterAxis}></div>
                  <div className={styles.scatterPoint} data-pt="1"></div>
                  <div className={styles.scatterPoint} data-pt="2"></div>
                  <div className={styles.scatterPoint} data-pt="3"></div>
                  <div className={styles.scatterPoint} data-pt="4"></div>
                  <div className={styles.scatterPoint} data-pt="5"></div>
                  <div className={styles.scatterPoint} data-pt="6"></div>
                  <div className={styles.scatterPoint} data-pt="7"></div>
                  <div className={styles.scatterCluster} data-cluster="1"></div>
                  <div className={styles.scatterCluster} data-cluster="2"></div>
                </div>
              </div>
            </div>
          )}

          {/* 6) REAL HEATMAP WITH COLOR GRADIENTS */}
          {visibleModules >= 6 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(5)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Performance Correlation Matrix</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.heatmapGrid}>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={styles.heatCell} data-index={i}></div>
                  ))}
                  <div className={styles.heatmapLegend}>
                    <div className={styles.heatmapGradient}></div>
                    <div className={styles.heatmapLabels}>
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7) ANIMATED DONUT CHART WITH REAL DATA */}
          {visibleModules >= 7 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(6)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Resource Allocation Optimizer</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.donutContainer}>
                  <div className={styles.donutChart}>
                    <div className={styles.donutSlice} data-slice="1" data-percent="42"></div>
                    <div className={styles.donutSlice} data-slice="2" data-percent="35"></div>
                    <div className={styles.donutSlice} data-slice="3" data-percent="23"></div>
                  </div>
                  <div className={styles.donutLabels}>
                    <div className={styles.donutLegend} data-type="primary">
                      <span className={styles.legendColor}></span>
                      <span className={styles.legendText}>Channel A: 42%</span>
                    </div>
                    <div className={styles.donutLegend} data-type="secondary">
                      <span className={styles.legendColor}></span>
                      <span className={styles.legendText}>Channel B: 35%</span>
                    </div>
                    <div className={styles.donutLegend} data-type="tertiary">
                      <span className={styles.legendColor}></span>
                      <span className={styles.legendText}>Channel C: 23%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8) ANIMATED GAUGE WITH DYNAMIC VALUES */}
          {visibleModules >= 8 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(7)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Optimization Potential Gauge</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.gaugeWrap}>
                  <div className={styles.gaugeBackground}>
                    <div className={styles.gaugeTicks}>
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className={styles.gaugeTick}></div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.gaugeArc}></div>
                  <div className={styles.gaugeNeedle}></div>
                  <div className={styles.gaugeValue}>76<span className={styles.gaugeUnit}>%</span></div>
                  <div className={styles.gaugeLabels}>
                    <span className={styles.gaugeMin}>0</span>
                    <span className={styles.gaugeMax}>100</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9) STACKED BAR WITH REALISTIC DATA */}
          {visibleModules >= 9 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(8)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Performance Attribution Matrix</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.stackedBarContainer}>
                  <div className={styles.barAxis}></div>
                  <div className={styles.barGroup}>
                    <div className={styles.barLabel}>Q1</div>
                    <div className={styles.stackedBar} data-bar="1">
                      <div className={styles.barSegment} data-segment="1"></div>
                      <div className={styles.barSegment} data-segment="2"></div>
                      <div className={styles.barSegment} data-segment="3"></div>
                    </div>
                  </div>
                  <div className={styles.barGroup}>
                    <div className={styles.barLabel}>Q2</div>
                    <div className={styles.stackedBar} data-bar="2">
                      <div className={styles.barSegment} data-segment="1"></div>
                      <div className={styles.barSegment} data-segment="2"></div>
                      <div className={styles.barSegment} data-segment="3"></div>
                    </div>
                  </div>
                  <div className={styles.barGroup}>
                    <div className={styles.barLabel}>Q3</div>
                    <div className={styles.stackedBar} data-bar="3">
                      <div className={styles.barSegment} data-segment="1"></div>
                      <div className={styles.barSegment} data-segment="2"></div>
                      <div className={styles.barSegment} data-segment="3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10) BUBBLE CLUSTERS WITH PROPER VISUALIZATION */}
          {visibleModules >= 10 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(9)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Audience Segment Analyzer</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.bubblePack}>
                  <div className={styles.bubbleAxes}></div>
                  <div className={styles.bubbleNode} data-node="1">
                    <span className={styles.bubbleLabel}>A</span>
                  </div>
                  <div className={styles.bubbleNode} data-node="2">
                    <span className={styles.bubbleLabel}>B</span>
                  </div>
                  <div className={styles.bubbleNode} data-node="3">
                    <span className={styles.bubbleLabel}>C</span>
                  </div>
                  <div className={styles.bubbleNode} data-node="4">
                    <span className={styles.bubbleLabel}>D</span>
                  </div>
                  <div className={styles.bubbleLegend}>
                    <div className={styles.legendSize}>Size = Value</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 11) MULTI-LINE TREND GRAPH WITH REAL VALUES */}
          {visibleModules >= 11 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(10)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Forecast Projection Model</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.multiLineChart}>
                  <div className={styles.chartGrid}></div>
                  <div className={styles.lineChartAxis}></div>
                  <div className={styles.lineStrip} data-strip="a"></div>
                  <div className={styles.lineStrip} data-strip="b"></div>
                  <div className={styles.lineStrip} data-strip="c"></div>
                  <div className={styles.projectionArea}></div>
                  <div className={styles.linePoints}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={styles.dataPoint} data-point={i}></div>
                    ))}
                  </div>
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem} data-series="a">Actual</div>
                    <div className={styles.legendItem} data-series="b">Target</div>
                    <div className={styles.legendItem} data-series="c">Forecast</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 12) NETWORK VISUALIZATION WITH INTERACTIVE NODES */}
          {visibleModules >= 12 && (
            <div className={`${styles.module} ${styles.flyIn}`} style={{animationDelay: `${getRandomDelay(11)}s`}}>
              <div className={styles.macWindowBar}>
                <span className={styles.trafficLight} data-color="red"></span>
                <span className={styles.trafficLight} data-color="yellow"></span>
                <span className={styles.trafficLight} data-color="green"></span>
                <div className={styles.windowTitle}>Insight Relationship Network</div>
              </div>
              <div className={styles.moduleBody}>
                <div className={styles.networkScene}>
                  <div className={styles.netNode} data-loc="1">
                    <span className={styles.nodeLabel}>1</span>
                  </div>
                  <div className={styles.netNode} data-loc="2">
                    <span className={styles.nodeLabel}>2</span>
                  </div>
                  <div className={styles.netNode} data-loc="3">
                    <span className={styles.nodeLabel}>3</span>
                  </div>
                  <div className={styles.netNode} data-loc="4">
                    <span className={styles.nodeLabel}>4</span>
                  </div>
                  <div className={styles.netNode} data-loc="5">
                    <span className={styles.nodeLabel}>5</span>
                  </div>
                  <div className={styles.netLink} data-link="12"></div>
                  <div className={styles.netLink} data-link="23"></div>
                  <div className={styles.netLink} data-link="13"></div>
                  <div className={styles.netLink} data-link="24"></div>
                  <div className={styles.netLink} data-link="35"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rotating messages */}
        <div className={`${styles.message} ${fade ? styles.fadeIn : styles.fadeOut}`}>
          {loadingMessages[messageIndex]}
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;

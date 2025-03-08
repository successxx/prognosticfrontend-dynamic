import React, { useEffect, useState, useRef } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
  const loadingMessages = [
    "Initializing advanced analytics...",
    "Correlating data across multiple streams...",
    "Detecting hidden patterns and signals...",
    "Formulating predictive algorithms...",
    "Refining multi-layer projections...",
    "Measuring outliers and anomalies...",
    "Surface-level insights verified...",
    "Examining deeper structural outcomes...",
    "Projecting scenario-based results...",
    "Compiling strategic intelligence...",
    "Analysis complete—finalizing output..."
  ];

  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Animate progress bar
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent(prev => {
        const targetPercent = (messageIndex / (loadingMessages.length - 1)) * 100;
        if (prev < targetPercent) {
          return Math.min(prev + 0.5, targetPercent);
        }
        return prev;
      });
    }, 100);

    // Cycle messages
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>Deep-Dive Data Analysis</div>

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

          {/* -- 12 modules, each with Mac window bar, flying in left/right in a less predictable pattern -- */}

          {/* 1) Real-time Overview */}
          <div className={`${styles.module} ${styles.flyInLeft} ${styles.delay0}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Real-Time Overview</div>
            </div>
            <div className={styles.moduleBody}>
              {/* Multi-series bar chart that randomly shifts heights */}
              <div className={styles.multiSeriesBars}>
                <div className={styles.series}>
                  <div className={styles.seriesBar} data-seq="1"></div>
                  <div className={styles.seriesBar} data-seq="2"></div>
                  <div className={styles.seriesBar} data-seq="3"></div>
                </div>
                <div className={styles.series}>
                  <div className={styles.seriesBar} data-seq="4"></div>
                  <div className={styles.seriesBar} data-seq="5"></div>
                  <div className={styles.seriesBar} data-seq="6"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2) Opportunity Visualization */}
          <div className={`${styles.module} ${styles.flyInRight} ${styles.delay1}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Opportunity Visualization</div>
            </div>
            <div className={styles.moduleBody}>
              {/* Dynamic line chart with random dips/climbs */}
              <div className={styles.dynamicLineChart}>
                <div className={styles.lineSegment} data-loc="1"></div>
                <div className={styles.lineSegment} data-loc="2"></div>
                <div className={styles.lineSegment} data-loc="3"></div>
              </div>
            </div>
          </div>

          {/* 3) Predictive Modeling */}
          <div className={`${styles.module} ${styles.flyInLeft} ${styles.delay2}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Predictive Modeling</div>
            </div>
            <div className={styles.moduleBody}>
              {/* A gauge chart with random arcs */}
              <div className={styles.arcGauge}>
                <div className={styles.arcBase}></div>
                <div className={styles.arcIndicator}></div>
              </div>
            </div>
          </div>

          {/* 4) Correlation Heatmap */}
          <div className={`${styles.module} ${styles.flyInRight} ${styles.delay3}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Correlation Heatmap</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.heatmapGrid}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={styles.heatBox} data-cell={i}></div>
                ))}
              </div>
            </div>
          </div>

          {/* 5) Resource Potential */}
          <div className={`${styles.module} ${styles.flyInLeft} ${styles.delay4}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Resource Potential</div>
            </div>
            <div className={styles.moduleBody}>
              {/* A line chart with multiple lines representing resource usage */}
              <div className={styles.multiLineChart}>
                <div className={styles.chartLine} data-line="A"></div>
                <div className={styles.chartLine} data-line="B"></div>
                <div className={styles.chartLine} data-line="C"></div>
              </div>
            </div>
          </div>

          {/* 6) Multi-Variable Patterns */}
          <div className={`${styles.module} ${styles.flyInRight} ${styles.delay5}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Multi-Variable Patterns</div>
            </div>
            <div className={styles.moduleBody}>
              {/* A 2D bubble chart with random expansions */}
              <div className={styles.bubble2D}>
                <div className={styles.bubbleSpot} data-spot="1"></div>
                <div className={styles.bubbleSpot} data-spot="2"></div>
                <div className={styles.bubbleSpot} data-spot="3"></div>
                <div className={styles.bubbleSpot} data-spot="4"></div>
              </div>
            </div>
          </div>

          {/* 7) Stability Metrics */}
          <div className={`${styles.module} ${styles.flyInLeft} ${styles.delay6}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Stability Metrics</div>
            </div>
            <div className={styles.moduleBody}>
              {/* A multi-step bar chart that lumps together forming a "histogram" */}
              <div className={styles.histogramChart}>
                <div className={styles.histBar} data-index="0"></div>
                <div className={styles.histBar} data-index="1"></div>
                <div className={styles.histBar} data-index="2"></div>
                <div className={styles.histBar} data-index="3"></div>
                <div className={styles.histBar} data-index="4"></div>
              </div>
            </div>
          </div>

          {/* 8) Comparative Analysis */}
          <div className={`${styles.module} ${styles.flyInRight} ${styles.delay7}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Comparative Analysis</div>
            </div>
            <div className={styles.moduleBody}>
              {/* A chord-like ring with arcs bridging multiple points */}
              <div className={styles.chordDiagram}>
                <div className={styles.chordOuter}></div>
                <div className={styles.chordArc} data-arc="1"></div>
                <div className={styles.chordArc} data-arc="2"></div>
                <div className={styles.chordArc} data-arc="3"></div>
              </div>
            </div>
          </div>

          {/* 9) Forecast Trajectory */}
          <div className={`${styles.module} ${styles.flyInLeft} ${styles.delay8}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Forecast Trajectory</div>
            </div>
            <div className={styles.moduleBody}>
              {/* Donut chart with random rotating slices */}
              <div className={styles.rotatingDonut}>
                <div className={styles.donutSlice} data-slice="1"></div>
                <div className={styles.donutSlice} data-slice="2"></div>
                <div className={styles.donutSlice} data-slice="3"></div>
              </div>
            </div>
          </div>

          {/* 10) Performance Index */}
          <div className={`${styles.module} ${styles.flyInRight} ${styles.delay9}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Performance Index</div>
            </div>
            <div className={styles.moduleBody}>
              {/* A 2-line wave chart to show performance up/down */}
              <div className={styles.dualWaveChart}>
                <div className={styles.waveLine} data-wave="a"></div>
                <div className={styles.waveLine} data-wave="b"></div>
              </div>
            </div>
          </div>

          {/* 11) Market Behavior */}
          <div className={`${styles.module} ${styles.flyInLeft} ${styles.delay10}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Market Behavior</div>
            </div>
            <div className={styles.moduleBody}>
              {/* A specialized bubble cluster chart */}
              <div className={styles.bubbleCluster}>
                <div className={styles.clusterNode} data-node="1"></div>
                <div className={styles.clusterNode} data-node="2"></div>
                <div className={styles.clusterNode} data-node="3"></div>
                <div className={styles.clusterNode} data-node="4"></div>
              </div>
            </div>
          </div>

          {/* 12) Pattern Recognition */}
          <div className={`${styles.module} ${styles.flyInRight} ${styles.delay11}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Pattern Recognition</div>
            </div>
            <div className={styles.moduleBody}>
              {/* A dynamic network linking multiple points */}
              <div className={styles.networkLayout}>
                <div className={styles.networkPoint} data-pt="1"></div>
                <div className={styles.networkPoint} data-pt="2"></div>
                <div className={styles.networkPoint} data-pt="3"></div>
                <div className={styles.networkLink} data-link="12"></div>
                <div className={styles.networkLink} data-link="23"></div>
                <div className={styles.networkLink} data-link="13"></div>
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

export default LoadingIndicator;

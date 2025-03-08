import React, { useEffect, useState, useRef } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
  // Generic messages
  const loadingMessages = [
    "Initializing multi-factor analysis...",
    "Integrating relevant data points...",
    "Correlating cross-domain variables...",
    "Identifying key trends and patterns...",
    "Refining advanced heuristics...",
    "Detecting hidden opportunity signals...",
    "Prioritizing emerging insights...",
    "Projecting outcomes under constraints...",
    "Synthesizing multi-layer strategy...",
    "Finalizing deeper-level forecasts...",
    "Deep analysis complete—compiling results..."
  ];

  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Animate progress bar toward current index
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

    // Rotate messages every 4s
    const updateMessage = () => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
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
      {/* Header (no blinking dots) */}
      <div className={styles.header}>
        Deep-Dive Data Analysis
      </div>

      {/* Progress Bar */}
      <div className={styles["progress-container"]}>
        <div
          className={styles["progress-bar"]}
          style={{ width: `${progressPercent}%` }}
        >
          <div className={styles["progress-glow"]}></div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.visualization}>
          {/* 12 Modules, each with a Mac window bar & a distinct “analysis” chart */}

          {/* 1 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay0}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Data Diagnostics</div>
            </div>
            <div className={styles.moduleBody}>
              {/* A multi-stage bar chart */}
              <div className={styles.multiBarChart}>
                <div className={styles.barSegment} data-seq="1"></div>
                <div className={styles.barSegment} data-seq="2"></div>
                <div className={styles.barSegment} data-seq="3"></div>
                <div className={styles.barSegment} data-seq="4"></div>
              </div>
            </div>
          </div>

          {/* 2 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay1}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Opportunity Insights</div>
            </div>
            <div className={styles.moduleBody}>
              {/* Slightly more complex line chart with random dips/climbs */}
              <div className={styles.opportunityLineChart}>
                <div className={styles.linePath}></div>
                <div className={styles.lineDot} data-loc="0"></div>
                <div className={styles.lineDot} data-loc="1"></div>
                <div className={styles.lineDot} data-loc="2"></div>
                <div className={styles.lineDot} data-loc="3"></div>
                <div className={styles.lineDot} data-loc="4"></div>
              </div>
            </div>
          </div>

          {/* 3 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay2}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Predictive Forecast</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGauge}>
                <div className={styles.gaugeArc}></div>
                <div className={styles.gaugeNeedle}></div>
              </div>
            </div>
          </div>

          {/* 4 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay3}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Correlation Mapping</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.radarChart}>
                <div className={styles.radarScan}></div>
                <div className={styles.radarDot} data-pos="1"></div>
                <div className={styles.radarDot} data-pos="2"></div>
                <div className={styles.radarDot} data-pos="3"></div>
                <div className={styles.radarDot} data-pos="4"></div>
              </div>
            </div>
          </div>

          {/* 5 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay4}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Trend Overview</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.trendChord}>
                <div className={styles.chordRing}></div>
                <div className={styles.chordLink} data-angle="1"></div>
                <div className={styles.chordLink} data-angle="2"></div>
                <div className={styles.chordLink} data-angle="3"></div>
              </div>
            </div>
          </div>

          {/* 6 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay5}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Behavior Model</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.scatterCloud}>
                <div className={styles.scatterPoint} data-seed="0"></div>
                <div className={styles.scatterPoint} data-seed="1"></div>
                <div className={styles.scatterPoint} data-seed="2"></div>
                <div className={styles.scatterPoint} data-seed="3"></div>
                <div className={styles.scatterPoint} data-seed="4"></div>
              </div>
            </div>
          </div>

          {/* 7 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay6}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Resource Trends</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.complexBars}>
                <div className={styles.complexBar} data-stagger="1"></div>
                <div className={styles.complexBar} data-stagger="2"></div>
                <div className={styles.complexBar} data-stagger="3"></div>
              </div>
            </div>
          </div>

          {/* 8 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay7}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Anomaly Detection</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.heatmapMatrix}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className={styles.heatCell} data-index={i}></div>
                ))}
              </div>
            </div>
          </div>

          {/* 9 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay8}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Multi-Variable Scan</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.bubbleFlow}>
                <span className={styles.bubble} data-size="sm"></span>
                <span className={styles.bubble} data-size="md"></span>
                <span className={styles.bubble} data-size="lg"></span>
              </div>
            </div>
          </div>

          {/* 10 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay9}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Performance Index</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.donutGauge}>
                <div className={styles.donutSlice} data-slice="1"></div>
                <div className={styles.donutSlice} data-slice="2"></div>
                <div className={styles.donutSlice} data-slice="3"></div>
              </div>
            </div>
          </div>

          {/* 11 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay10}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Stability Projection</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.sineLine}>
                <div className={styles.sineWave}></div>
              </div>
            </div>
          </div>

          {/* 12 */}
          <div className={`${styles.module} ${styles.flyIn} ${styles.delay11}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Pattern Recognition</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.networkAnalysis}>
                <div className={styles.netNode} data-node="1"></div>
                <div className={styles.netNode} data-node="2"></div>
                <div className={styles.netNode} data-node="3"></div>
                <div className={styles.netLink} data-link="12"></div>
                <div className={styles.netLink} data-link="23"></div>
                <div className={styles.netLink} data-link="13"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Rotating status message */}
        <div className={`${styles.message} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
          {loadingMessages[messageIndex]}
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;

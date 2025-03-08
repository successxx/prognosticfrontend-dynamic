import React, { useEffect, useState, useRef } from "react";
import styles from "./LoadingCircle.module.css";

const LoadingIndicator: React.FC = () => {
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

          {/* 1) FUNNEL CHART */}
          <div className={`${styles.module} ${styles.flyIn1} ${styles.delay0}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Real-Time Funnel</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.funnelChart}>
                <div className={styles.funnelSegment} data-level="1"></div>
                <div className={styles.funnelSegment} data-level="2"></div>
                <div className={styles.funnelSegment} data-level="3"></div>
                <div className={styles.funnelSegment} data-level="4"></div>
              </div>
            </div>
          </div>

          {/* 2) RADAR CHART */}
          <div className={`${styles.module} ${styles.flyIn2} ${styles.delay1}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Opportunity Radar</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.radarContainer}>
                <div className={styles.radarBackground}></div>
                <div className={styles.radarArea}></div>
                <div className={styles.radarDot} data-dot="1"></div>
                <div className={styles.radarDot} data-dot="2"></div>
                <div className={styles.radarDot} data-dot="3"></div>
                <div className={styles.radarDot} data-dot="4"></div>
              </div>
            </div>
          </div>

          {/* 3) STACKED AREA CHART */}
          <div className={`${styles.module} ${styles.flyIn3} ${styles.delay2}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Predictive Areas</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.stackedArea}>
                <div className={styles.areaLayer} data-layer="1"></div>
                <div className={styles.areaLayer} data-layer="2"></div>
                <div className={styles.areaLayer} data-layer="3"></div>
              </div>
            </div>
          </div>

          {/* 4) CHORD DIAGRAM */}
          <div className={`${styles.module} ${styles.flyIn4} ${styles.delay3}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Comparative Chord</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chordContainer}>
                <div className={styles.chordRing}></div>
                <div className={styles.chordLink} data-chord="1"></div>
                <div className={styles.chordLink} data-chord="2"></div>
                <div className={styles.chordLink} data-chord="3"></div>
              </div>
            </div>
          </div>

          {/* 5) SCATTER W/ MOVING POINTS */}
          <div className={`${styles.module} ${styles.flyIn5} ${styles.delay4}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Multi-Variable Scatter</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.scatterWrap}>
                <div className={styles.scatterPoint} data-pt="1"></div>
                <div className={styles.scatterPoint} data-pt="2"></div>
                <div className={styles.scatterPoint} data-pt="3"></div>
                <div className={styles.scatterPoint} data-pt="4"></div>
              </div>
            </div>
          </div>

          {/* 6) HEATMAP */}
          <div className={`${styles.module} ${styles.flyIn6} ${styles.delay5}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Correlation Heatmap</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.heatmapGrid}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={styles.heatCell} data-index={i}></div>
                ))}
              </div>
            </div>
          </div>

          {/* 7) DONUT CHART */}
          <div className={`${styles.module} ${styles.flyIn7} ${styles.delay6}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Resource Donut</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.donutChart}>
                <div className={styles.donutSlice} data-slice="1"></div>
                <div className={styles.donutSlice} data-slice="2"></div>
                <div className={styles.donutSlice} data-slice="3"></div>
              </div>
            </div>
          </div>

          {/* 8) GAUGE CHART */}
          <div className={`${styles.module} ${styles.flyIn8} ${styles.delay7}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Stability Gauge</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.gaugeWrap}>
                <div className={styles.gaugeArc}></div>
                <div className={styles.gaugeNeedle}></div>
              </div>
            </div>
          </div>

          {/* 9) STACKED BAR */}
          <div className={`${styles.module} ${styles.flyIn9} ${styles.delay8}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Performance Stacks</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.stackedBarContainer}>
                <div className={styles.stackedBar} data-bar="1"></div>
                <div className={styles.stackedBar} data-bar="2"></div>
                <div className={styles.stackedBar} data-bar="3"></div>
              </div>
            </div>
          </div>

          {/* 10) BUBBLE PACK */}
          <div className={`${styles.module} ${styles.flyIn10} ${styles.delay9}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Market Clusters</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.bubblePack}>
                <div className={styles.bubbleNode} data-node="1"></div>
                <div className={styles.bubbleNode} data-node="2"></div>
                <div className={styles.bubbleNode} data-node="3"></div>
              </div>
            </div>
          </div>

          {/* 11) MULTI-LINE GRAPH */}
          <div className={`${styles.module} ${styles.flyIn11} ${styles.delay10}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Forecast Lines</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.multiLine}>
                <div className={styles.lineStrip} data-strip="a"></div>
                <div className={styles.lineStrip} data-strip="b"></div>
                <div className={styles.lineStrip} data-strip="c"></div>
              </div>
            </div>
          </div>

          {/* 12) NETWORK CHART */}
          <div className={`${styles.module} ${styles.flyIn12} ${styles.delay11}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red"></span>
              <span className={styles.trafficLight} data-color="yellow"></span>
              <span className={styles.trafficLight} data-color="green"></span>
              <div className={styles.windowTitle}>Pattern Network</div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.networkScene}>
                <div className={styles.netNode} data-loc="1"></div>
                <div className={styles.netNode} data-loc="2"></div>
                <div className={styles.netNode} data-loc="3"></div>
                <div className={styles.netLink} data-link="12"></div>
                <div className={styles.netLink} data-link="23"></div>
                <div className={styles.netLink} data-link="13"></div>
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

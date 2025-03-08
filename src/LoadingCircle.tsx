import React, { useEffect, useState, useRef } from "react";
import styles from "./LoadingCircle.module.css";

const LoadingCircle: React.FC = () => {
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

  // Speed up progress bar increments
  useEffect(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    // increment by 1.5 every 70ms
    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent((prev) => {
        const target = (messageIndex / (loadingMessages.length - 1)) * 100;
        const step = 1.5;
        return prev < target ? Math.min(prev + step, target) : prev;
      });
    }, 70);

    // rotate messages every 4s
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

  // 4 random fly-in classes
  const snapClasses = [
    styles.snapIn1,
    styles.snapIn2,
    styles.snapIn3,
    styles.snapIn4
  ];
  function getRandomSnapClass(i: number) {
    return snapClasses[i % snapClasses.length];
  }

  // 12 random delays
  const delayClasses = [
    styles.delay0, styles.delay1, styles.delay2, styles.delay3,
    styles.delay4, styles.delay5, styles.delay6, styles.delay7,
    styles.delay8, styles.delay9, styles.delay10, styles.delay11
  ];

  return (
    <div className={styles.loaderContainer}>
      {/* Subtle heading */}
      <div className={styles.loaderHeader}>Deep-Dive Data Analysis</div>

      {/* Progress Bar */}
      <div className={styles.loaderProgressContainer}>
        <div
          className={styles.loaderProgressBar}
          style={{ width: `${progressPercent}%` }}
        >
          <div className={styles.loaderProgressGlow}></div>
        </div>
      </div>

      <div className={styles.loaderContent}>
        <div className={styles.loaderVisualization}>

          {/* 1) REAL-TIME FUNNEL */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(0)} ${delayClasses[0]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Real-Time Funnel
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.chartAxisX}></div>
              <div className={styles.chartAxisY}></div>

              <div className={styles.funnelContainer}>
                <div className={styles.funnelBar} data-step="1" />
                <div className={styles.funnelBar} data-step="2" />
                <div className={styles.funnelBar} data-step="3" />
                <div className={styles.funnelBar} data-step="4" />
              </div>
            </div>
          </div>

          {/* 2) OPPORTUNITY RADAR */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(1)} ${delayClasses[1]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Opportunity Radar
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.radarContainer}>
                <div className={styles.chartGrid} />
                <div className={styles.radarGrid} />
                <div className={styles.radarShape} />
              </div>
            </div>
          </div>

          {/* 3) PREDICTIVE AREAS */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(2)} ${delayClasses[2]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Predictive Areas
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid} />
              <div className={styles.chartAxisX} />
              <div className={styles.chartAxisY} />

              <div className={styles.predictiveArea}>
                <div className={styles.predictiveLayer} data-layer="1" />
                <div className={styles.predictiveLayer} data-layer="2" />
                <div className={styles.predictiveLayer} data-layer="3" />
              </div>
            </div>
          </div>

          {/* 4) COMPARATIVE CHORD */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(3)} ${delayClasses[3]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Comparative Chord
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid} />
              <div className={styles.chordContainer}>
                <div className={styles.chordRing} />
                <div className={styles.chordArc} data-arc="1" />
                <div className={styles.chordArc} data-arc="2" />
                <div className={styles.chordArc} data-arc="3" />
              </div>
            </div>
          </div>

          {/* 5) MULTI-VARIABLE SCATTER */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(4)} ${delayClasses[4]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Multi-Variable Scatter
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid} />
              <div className={styles.chartAxisX} />
              <div className={styles.chartAxisY} />
              <div className={styles.scatterContainer}>
                <div className={styles.scatterPoint} data-id="1" />
                <div className={styles.scatterPoint} data-id="2" />
                <div className={styles.scatterPoint} data-id="3" />
                <div className={styles.scatterPoint} data-id="4" />
                <div className={styles.scatterPoint} data-id="5" />
                <div className={styles.scatterPoint} data-id="6" />
              </div>
            </div>
          </div>

          {/* 6) CORRELATION HEATMAP */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(5)} ${delayClasses[5]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Correlation Heatmap
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.heatmapContainer}>
                <div className={styles.chartGrid} />
                <div className={styles.heatmapGrid}>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={styles.heatCell} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 7) RESOURCE DONUT */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(6)} ${delayClasses[6]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Resource Donut
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid} />
              <div className={styles.donutContainer}>
                <div className={styles.donutSlice} data-slice="1" />
                <div className={styles.donutSlice} data-slice="2" />
                <div className={styles.donutSlice} data-slice="3" />
              </div>
            </div>
          </div>

          {/* 8) STABILITY GAUGE */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(7)} ${delayClasses[7]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Stability Gauge
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.gaugeContainer}>
                <div className={styles.gaugeArc} />
                <div className={styles.gaugeNeedle} />
              </div>
            </div>
          </div>

          {/* 9) PERFORMANCE STACKS */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(8)} ${delayClasses[8]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Performance Stacks
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid} />
              <div className={styles.chartAxisX} />
              <div className={styles.chartAxisY} />
              <div className={styles.performanceStacks}>
                <div className={styles.perfBar} data-bar="1" />
                <div className={styles.perfBar} data-bar="2" />
                <div className={styles.perfBar} data-bar="3" />
                <div className={styles.perfBar} data-bar="4" />
                <div className={styles.perfBar} data-bar="5" />
                <div className={styles.perfBar} data-bar="6" />
              </div>
            </div>
          </div>

          {/* 10) MARKET CLUSTERS */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(9)} ${delayClasses[9]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Market Clusters
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid} />
              <div className={styles.chartAxisX} />
              <div className={styles.chartAxisY} />

              <div className={styles.clusterContainer}>
                <div className={styles.clusterBubble} data-bub="1" />
                <div className={styles.clusterBubble} data-bub="2" />
                <div className={styles.clusterBubble} data-bub="3" />
              </div>
            </div>
          </div>

          {/* 11) FORECAST LINES */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(10)} ${delayClasses[10]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Forecast Lines
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid} />
              <div className={styles.chartAxisX} />
              <div className={styles.chartAxisY} />
              <div className={styles.forecastContainer}>
                <div className={styles.forecastLine} data-line="a" />
                <div className={styles.forecastLine} data-line="b" />
                <div className={styles.forecastLine} data-line="c" />
              </div>
            </div>
          </div>

          {/* 12) PATTERN NETWORK */}
          <div className={`${styles.loaderModule} ${getRandomSnapClass(11)} ${delayClasses[11]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                System Diagnostics – Pattern Network
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid} />
              <div className={styles.networkContainer}>
                <div className={styles.netNode} data-n="1" />
                <div className={styles.netNode} data-n="2" />
                <div className={styles.netNode} data-n="3" />
                <div className={styles.netLink} data-link="12" />
                <div className={styles.netLink} data-link="23" />
                <div className={styles.netLink} data-link="13" />
              </div>
            </div>
          </div>
        </div>

        {/* Rotating messages */}
        <div className={`${styles.loaderMessage} ${fade ? styles.fadeIn : styles.fadeOut}`}>
          {loadingMessages[messageIndex]}
        </div>
      </div>
    </div>
  );
};

export default LoadingCircle;

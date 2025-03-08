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
    styles.lcSnapIn1,
    styles.lcSnapIn2,
    styles.lcSnapIn3,
    styles.lcSnapIn4
  ];
  function getRandomSnapClass(i: number) {
    return snapClasses[i % snapClasses.length];
  }

  // 12 random delays
  const delayClasses = [
    styles.lcDelay0, styles.lcDelay1, styles.lcDelay2, styles.lcDelay3,
    styles.lcDelay4, styles.lcDelay5, styles.lcDelay6, styles.lcDelay7,
    styles.lcDelay8, styles.lcDelay9, styles.lcDelay10, styles.lcDelay11
  ];

  return (
    <div className={styles.lcContainer}>
      {/* Renamed header */}
      <div className={styles.lcHeader}>Deep-Dive Data Analysis</div>

      {/* Progress Bar */}
      <div className={styles.lcProgressContainer}>
        <div
          className={styles.lcProgressBar}
          style={{ width: `${progressPercent}%` }}
        >
          <div className={styles.lcProgressGlow}></div>
        </div>
      </div>

      <div className={styles.lcContent}>
        <div className={styles.lcVisualization}>

          {/* 1) REAL-TIME FUNNEL */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(0)} ${delayClasses[0]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Real-Time Funnel
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcChartGrid}></div>
              <div className={styles.lcChartAxisX}></div>
              <div className={styles.lcChartAxisY}></div>

              <div className={styles.lcFunnelContainer}>
                <div className={styles.lcFunnelBar} data-step="1" />
                <div className={styles.lcFunnelBar} data-step="2" />
                <div className={styles.lcFunnelBar} data-step="3" />
                <div className={styles.lcFunnelBar} data-step="4" />
              </div>
            </div>
          </div>

          {/* 2) OPPORTUNITY RADAR */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(1)} ${delayClasses[1]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Opportunity Radar
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcRadarContainer}>
                <div className={styles.lcChartGrid} />
                <div className={styles.lcRadarGrid} />
                <div className={styles.lcRadarShape} />
              </div>
            </div>
          </div>

          {/* 3) PREDICTIVE AREAS */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(2)} ${delayClasses[2]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Predictive Areas
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcChartGrid} />
              <div className={styles.lcChartAxisX} />
              <div className={styles.lcChartAxisY} />

              <div className={styles.lcPredictiveArea}>
                <div className={styles.lcPredictiveLayer} data-layer="1" />
                <div className={styles.lcPredictiveLayer} data-layer="2" />
                <div className={styles.lcPredictiveLayer} data-layer="3" />
              </div>
            </div>
          </div>

          {/* 4) COMPARATIVE CHORD */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(3)} ${delayClasses[3]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Comparative Chord
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcChartGrid} />
              <div className={styles.lcChordContainer}>
                <div className={styles.lcChordRing} />
                <div className={styles.lcChordArc} data-arc="1" />
                <div className={styles.lcChordArc} data-arc="2" />
                <div className={styles.lcChordArc} data-arc="3" />
              </div>
            </div>
          </div>

          {/* 5) MULTI-VARIABLE SCATTER */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(4)} ${delayClasses[4]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Multi-Variable Scatter
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcChartGrid} />
              <div className={styles.lcChartAxisX} />
              <div className={styles.lcChartAxisY} />

              <div className={styles.lcScatterContainer}>
                <div className={styles.lcScatterPoint} data-id="1" />
                <div className={styles.lcScatterPoint} data-id="2" />
                <div className={styles.lcScatterPoint} data-id="3" />
                <div className={styles.lcScatterPoint} data-id="4" />
                <div className={styles.lcScatterPoint} data-id="5" />
                <div className={styles.lcScatterPoint} data-id="6" />
              </div>
            </div>
          </div>

          {/* 6) CORRELATION HEATMAP */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(5)} ${delayClasses[5]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Correlation Heatmap
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcHeatmapContainer}>
                <div className={styles.lcChartGrid} />
                <div className={styles.lcHeatmapGrid}>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={styles.lcHeatCell} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 7) RESOURCE DONUT */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(6)} ${delayClasses[6]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Resource Donut
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcChartGrid} />
              <div className={styles.lcDonutContainer}>
                <div className={styles.lcDonutSlice} data-slice="1" />
                <div className={styles.lcDonutSlice} data-slice="2" />
                <div className={styles.lcDonutSlice} data-slice="3" />
              </div>
            </div>
          </div>

          {/* 8) STABILITY GAUGE */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(7)} ${delayClasses[7]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Stability Gauge
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcGaugeContainer}>
                <div className={styles.lcGaugeArc} />
                <div className={styles.lcGaugeNeedle} />
              </div>
            </div>
          </div>

          {/* 9) PERFORMANCE STACKS */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(8)} ${delayClasses[8]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Performance Stacks
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcChartGrid} />
              <div className={styles.lcChartAxisX} />
              <div className={styles.lcChartAxisY} />

              <div className={styles.lcPerformanceStacks}>
                <div className={styles.lcPerfBar} data-bar="1" />
                <div className={styles.lcPerfBar} data-bar="2" />
                <div className={styles.lcPerfBar} data-bar="3" />
                <div className={styles.lcPerfBar} data-bar="4" />
                <div className={styles.lcPerfBar} data-bar="5" />
                <div className={styles.lcPerfBar} data-bar="6" />
              </div>
            </div>
          </div>

          {/* 10) MARKET CLUSTERS */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(9)} ${delayClasses[9]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Market Clusters
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcChartGrid} />
              <div className={styles.lcChartAxisX} />
              <div className={styles.lcChartAxisY} />

              <div className={styles.lcClusterContainer}>
                <div className={styles.lcClusterBubble} data-bub="1" />
                <div className={styles.lcClusterBubble} data-bub="2" />
                <div className={styles.lcClusterBubble} data-bub="3" />
              </div>
            </div>
          </div>

          {/* 11) FORECAST LINES */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(10)} ${delayClasses[10]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Forecast Lines
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcChartGrid} />
              <div className={styles.lcChartAxisX} />
              <div className={styles.lcChartAxisY} />

              <div className={styles.lcForecastContainer}>
                <div className={styles.lcForecastLine} data-line="a" />
                <div className={styles.lcForecastLine} data-line="b" />
                <div className={styles.lcForecastLine} data-line="c" />
              </div>
            </div>
          </div>

          {/* 12) PATTERN NETWORK */}
          <div className={`${styles.lcModule} ${getRandomSnapClass(11)} ${delayClasses[11]}`}>
            <div className={styles.lcMacWindowBar}>
              <span className={styles.lcTrafficLight} data-color="red" />
              <span className={styles.lcTrafficLight} data-color="yellow" />
              <span className={styles.lcTrafficLight} data-color="green" />
              <div className={styles.lcWindowTitle}>
                System Diagnostics – Pattern Network
              </div>
            </div>
            <div className={styles.lcModuleBody}>
              <div className={styles.lcChartGrid} />
              <div className={styles.lcNetworkContainer}>
                <div className={styles.lcNetNode} data-n="1" />
                <div className={styles.lcNetNode} data-n="2" />
                <div className={styles.lcNetNode} data-n="3" />
                <div className={styles.lcNetLink} data-link="12" />
                <div className={styles.lcNetLink} data-link="23" />
                <div className={styles.lcNetLink} data-link="13" />
              </div>
            </div>
          </div>
        </div>

        {/* Rotating messages */}
        <div className={`${styles.lcMessage} ${fade ? styles.lcFadeIn : styles.lcFadeOut}`}>
          {loadingMessages[messageIndex]}
        </div>
      </div>
    </div>
  );
};

export default LoadingCircle;

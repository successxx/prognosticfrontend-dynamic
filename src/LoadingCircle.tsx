import React, { useEffect, useState, useRef } from "react";
import styles from "./LoadingCircle.module.css";

const LoadingCircle: React.FC = () => {
  // Rotating messages for realism
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

  // 4 random fly-in classes
  const snapClasses = [
    styles.snapIn1,
    styles.snapIn2,
    styles.snapIn3,
    styles.snapIn4
  ];

  function getRandomSnapClass(i: number) {
    // pseudo-random pick from 4
    return snapClasses[i % snapClasses.length];
  }

  // 12 random delay classes for the modules
  const delayClasses = [
    styles.delay0, styles.delay1, styles.delay2, styles.delay3,
    styles.delay4, styles.delay5, styles.delay6, styles.delay7,
    styles.delay8, styles.delay9, styles.delay10, styles.delay11
  ];

  // We'll use an array of 12 so each module can have a stable "random" assignment

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

          {/* 1) CORE METRICS */}
          <div className={`${styles.module} ${getRandomSnapClass(0)} ${delayClasses[0]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Core Metrics – Data Navigator
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.chartAxisX}></div>
              <div className={styles.chartAxisY}></div>

              <div className={styles.funnelContainer}>
                <div className={styles.funnelBar} data-step="1"></div>
                <div className={styles.funnelBar} data-step="2"></div>
                <div className={styles.funnelBar} data-step="3"></div>
                <div className={styles.funnelBar} data-step="4"></div>
              </div>
            </div>
          </div>

          {/* 2) OPPORTUNITY MATRIX */}
          <div className={`${styles.module} ${getRandomSnapClass(1)} ${delayClasses[1]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Opportunity Matrix – Insight Engine
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.radarContainer}>
                <div className={styles.chartGrid}></div>
                <div className={styles.radarGrid}></div>
                <div className={styles.radarShape}></div>
              </div>
            </div>
          </div>

          {/* 3) PREDICTIVE TRENDS */}
          <div className={`${styles.module} ${getRandomSnapClass(2)} ${delayClasses[2]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Predictive Trends – Future Mapper
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.chartAxisX}></div>
              <div className={styles.chartAxisY}></div>

              <div className={styles.predictiveArea}>
                <div className={styles.predictiveLayer} data-layer="1"></div>
                <div className={styles.predictiveLayer} data-layer="2"></div>
                <div className={styles.predictiveLayer} data-layer="3"></div>
              </div>
            </div>
          </div>

          {/* 4) COMPARATIVE BENCHMARKS */}
          <div className={`${styles.module} ${getRandomSnapClass(3)} ${delayClasses[3]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Comparative Benchmarks – Performance Spectrum
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.chordContainer}>
                <div className={styles.chordRing}></div>
                <div className={styles.chordArc} data-arc="1"></div>
                <div className={styles.chordArc} data-arc="2"></div>
                <div className={styles.chordArc} data-arc="3"></div>
              </div>
            </div>
          </div>

          {/* 5) MULTI-FACTOR ANALYSIS */}
          <div className={`${styles.module} ${getRandomSnapClass(4)} ${delayClasses[4]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Multi-Factor Analysis – Variable Insights
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.chartAxisX}></div>
              <div className={styles.chartAxisY}></div>

              <div className={styles.scatterContainer}>
                <div className={styles.scatterPoint} data-id="1"></div>
                <div className={styles.scatterPoint} data-id="2"></div>
                <div className={styles.scatterPoint} data-id="3"></div>
                <div className={styles.scatterPoint} data-id="4"></div>
                <div className={styles.scatterPoint} data-id="5"></div>
                <div className={styles.scatterPoint} data-id="6"></div>
              </div>
            </div>
          </div>

          {/* 6) CORRELATION MAPPING */}
          <div className={`${styles.module} ${getRandomSnapClass(5)} ${delayClasses[5]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Correlation Mapping – Connection Grid
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.heatmapContainer}>
                <div className={styles.chartGrid}></div>
                <div className={styles.heatmapGrid}>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={styles.heatCell} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 7) RESOURCE EFFICIENCY */}
          <div className={`${styles.module} ${getRandomSnapClass(6)} ${delayClasses[6]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Resource Efficiency – Optimization Pulse
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.donutContainer}>
                <div className={styles.donutSlice} data-slice="1"></div>
                <div className={styles.donutSlice} data-slice="2"></div>
                <div className={styles.donutSlice} data-slice="3"></div>
              </div>
            </div>
          </div>

          {/* 8) STABILITY OVERVIEW */}
          <div className={`${styles.module} ${getRandomSnapClass(7)} ${delayClasses[7]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Stability Overview – Risk Evaluator
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.gaugeContainer}>
                <div className={styles.gaugeArc}></div>
                <div className={styles.gaugeNeedle}></div>
              </div>
            </div>
          </div>

          {/* 9) PERFORMANCE LAYERS */}
          <div className={`${styles.module} ${getRandomSnapClass(8)} ${delayClasses[8]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Performance Layers – Efficiency Review
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.chartAxisX}></div>
              <div className={styles.chartAxisY}></div>

              <div className={styles.performanceStacks}>
                <div className={styles.perfBar} data-bar="1"></div>
                <div className={styles.perfBar} data-bar="2"></div>
                <div className={styles.perfBar} data-bar="3"></div>
                <div className={styles.perfBar} data-bar="4"></div>
                <div className={styles.perfBar} data-bar="5"></div>
                <div className={styles.perfBar} data-bar="6"></div>
              </div>
            </div>
          </div>

          {/* 10) MARKET INTELLIGENCE */}
          <div className={`${styles.module} ${getRandomSnapClass(9)} ${delayClasses[9]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Market Intelligence – Cluster Navigator
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.chartAxisX}></div>
              <div className={styles.chartAxisY}></div>

              <div className={styles.clusterContainer}>
                <div className={styles.clusterBubble} data-bub="1"></div>
                <div className={styles.clusterBubble} data-bub="2"></div>
                <div className={styles.clusterBubble} data-bub="3"></div>
              </div>
            </div>
          </div>

          {/* 11) FORECAST MODELING */}
          <div className={`${styles.module} ${getRandomSnapClass(10)} ${delayClasses[10]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Forecast Modeling – Trend Projections
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.chartAxisX}></div>
              <div className={styles.chartAxisY}></div>

              <div className={styles.forecastContainer}>
                <div className={styles.forecastLine} data-line="a"></div>
                <div className={styles.forecastLine} data-line="b"></div>
                <div className={styles.forecastLine} data-line="c"></div>
              </div>
            </div>
          </div>

          {/* 12) PATTERN DISCOVERY */}
          <div className={`${styles.module} ${getRandomSnapClass(11)} ${delayClasses[11]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                Pattern Discovery – Network Synthesis
              </div>
            </div>
            <div className={styles.moduleBody}>
              <div className={styles.chartGrid}></div>
              <div className={styles.networkContainer}>
                <div className={styles.netNode} data-n="1"></div>
                <div className={styles.netNode} data-n="2"></div>
                <div className={styles.netNode} data-n="3"></div>
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

export default LoadingCircle;

import React, { useEffect, useState, useRef } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
  // Updated, generic loading messages
  const loadingMessages = [
    "Gathering global parameters...",
    "Processing data streams...",
    "Analyzing correlation factors...",
    "Running advanced heuristics...",
    "Evaluating multi-layered patterns...",
    "Extracting potential anomalies...",
    "Synthesizing predictive signals...",
    "Assessing volatility thresholds...",
    "Refining system parameters...",
    "Compiling final intelligence...",
    "Finalizing deep-dive insights..."
  ];

  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Animate the progress bar toward current message index
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
        setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
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
    <div className={styles['container']}>
      {/* Header - no blinking dots */}
      <div className={styles['header']}>
        Deep-Dive System Analysis
      </div>

      {/* Progress Bar */}
      <div className={styles['progress-container']}>
        <div
          className={styles['progress-bar']}
          style={{ width: `${progressPercent}%` }}
        >
          <div className={styles['progress-glow']}></div>
        </div>
      </div>

      <div className={styles['content']}>
        <div className={styles['visualization']}>
          {/* 12 Modules, each with distinct chart & Mac window bar */}

          {/* 1) System Diagnostics */}
          <div className={`${styles['module']} ${styles['fly-in-left']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>System Diagnostics</div>
            <div className={styles['chart-bars']}>
              <div className={styles['bar']} data-val="65"></div>
              <div className={styles['bar']} data-val="40"></div>
              <div className={styles['bar']} data-val="80"></div>
              <div className={styles['bar']} data-val="50"></div>
            </div>
          </div>

          {/* 2) Opportunity Analysis */}
          <div className={`${styles['module']} ${styles['fly-in-center']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Opportunity Analysis</div>
            <div className={styles['chart-line-opportunity']}>
              <div className={styles['opportunity-line']}></div>
              <div className={styles['opportunity-indicator']}></div>
            </div>
          </div>

          {/* 3) Predictive Forecast */}
          <div className={`${styles['module']} ${styles['fly-in-right']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Predictive Forecast</div>
            <div className={styles['chart-gauge']}>
              <div className={styles['gauge-base']}></div>
              <div className={styles['gauge-needle']}></div>
            </div>
          </div>

          {/* 4) Resource Allocation */}
          <div className={`${styles['module']} ${styles['fly-in-left']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Resource Allocation</div>
            <div className={styles['chart-stacked-bar']}>
              <div className={styles['stack']} data-stack="30"></div>
              <div className={styles['stack']} data-stack="60"></div>
              <div className={styles['stack']} data-stack="85"></div>
            </div>
          </div>

          {/* 5) Factor Correlation */}
          <div className={`${styles['module']} ${styles['fly-in-center']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Factor Correlation</div>
            <div className={styles['chart-radar']}>
              <div className={styles['radar-area']}></div>
              <div className={styles['radar-point']} data-delay="0.3"></div>
              <div className={styles['radar-point']} data-delay="0.6"></div>
              <div className={styles['radar-point']} data-delay="0.9"></div>
              <div className={styles['radar-point']} data-delay="1.2"></div>
              <div className={styles['radar-point']} data-delay="1.5"></div>
            </div>
          </div>

          {/* 6) Behavior Mapping */}
          <div className={`${styles['module']} ${styles['fly-in-right']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Behavior Mapping</div>
            <div className={styles['chart-scatter']}>
              <div className={styles['scatter-dot']} data-x="10" data-y="70"></div>
              <div className={styles['scatter-dot']} data-x="40" data-y="30"></div>
              <div className={styles['scatter-dot']} data-x="60" data-y="50"></div>
              <div className={styles['scatter-dot']} data-x="80" data-y="20"></div>
            </div>
          </div>

          {/* 7) Trend Highlights */}
          <div className={`${styles['module']} ${styles['fly-in-left']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Trend Highlights</div>
            <div className={styles['chart-chord']}>
              <div className={styles['chord-ring']}></div>
              <div className={styles['chord-link']} data-rot="45"></div>
              <div className={styles['chord-link']} data-rot="135"></div>
              <div className={styles['chord-link']} data-rot="225"></div>
            </div>
          </div>

          {/* 8) Anomaly Detection */}
          <div className={`${styles['module']} ${styles['fly-in-center']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Anomaly Detection</div>
            <div className={styles['chart-heatmap']}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={styles['heatmap-cell']} data-index={i}></div>
              ))}
            </div>
          </div>

          {/* 9) Multi-Variable Insights */}
          <div className={`${styles['module']} ${styles['fly-in-right']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Multi-Variable Insights</div>
            <div className={styles['chart-bubble']}>
              <span className={styles['bubble']} data-size="small"></span>
              <span className={styles['bubble']} data-size="medium"></span>
              <span className={styles['bubble']} data-size="large"></span>
            </div>
          </div>

          {/* 10) Performance Gauge */}
          <div className={`${styles['module']} ${styles['fly-in-left']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Performance Gauge</div>
            <div className={styles['chart-donut']}>
              <div className={styles['donut-segment']} data-segment="1"></div>
              <div className={styles['donut-segment']} data-segment="2"></div>
              <div className={styles['donut-segment']} data-segment="3"></div>
            </div>
          </div>

          {/* 11) Stability Projections */}
          <div className={`${styles['module']} ${styles['fly-in-center']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Stability Projections</div>
            <div className={styles['chart-line-stability']}>
              <div className={styles['stability-line']}></div>
              <div className={styles['stability-pulse']}></div>
            </div>
          </div>

          {/* 12) Pattern Recognition */}
          <div className={`${styles['module']} ${styles['fly-in-right']}`}>
            <div className={styles['mac-window-bar']}>
              <span className={styles['traffic-light']} data-color="red"></span>
              <span className={styles['traffic-light']} data-color="yellow"></span>
              <span className={styles['traffic-light']} data-color="green"></span>
            </div>
            <div className={styles['module-header']}>Pattern Recognition</div>
            <div className={styles['chart-network']}>
              <div className={styles['network-node']} data-loc="1"></div>
              <div className={styles['network-node']} data-loc="2"></div>
              <div className={styles['network-node']} data-loc="3"></div>
              <div className={styles['network-link']} data-link="12"></div>
              <div className={styles['network-link']} data-link="23"></div>
              <div className={styles['network-link']} data-link="13"></div>
            </div>
          </div>
        </div>

        {/* Rotating messages */}
        <div className={`${styles['message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
          {loadingMessages[messageIndex]}
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;

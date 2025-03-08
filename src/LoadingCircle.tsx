/* ===========================
   LoadingIndicator.tsx
   =========================== */
import React, { useEffect, useState, useRef } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
  const loadingMessages = [
    "Preparing comprehensive insights...",
    "Analyzing lead flow and capture...",
    "Evaluating traffic sources...",
    "Running engagement simulations...",
    "Mapping funnel performance...",
    "Scanning competitor positioning...",
    "Interpreting user demographics...",
    "Aggregating sentiment data...",
    "Projecting revenue potential...",
    "Refining growth strategies...",
    "Pinpointing optimization points...",
    "Finalizing advanced recommendations..."
  ];

  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Animate progress bar toward the approximate progress
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

    // Message rotation
    const updateMessage = () => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % loadingMessages.length;
          return newIndex;
        });
        setFade(true);
      }, 500);
    };

    // Change message every 4 seconds
    const intervalId = setInterval(updateMessage, 4000);

    return () => {
      clearInterval(intervalId);
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [loadingMessages.length, messageIndex]);

  return (
    <div className={styles['prognostic-ai-demo-results-container']}>
      {/* Header */}
      <div className={styles['pai-dr-header']}>
        <span className={styles['pai-dr-logo-pulse']}></span>
        Deep-Dive Business Analysis
        <span className={styles['pai-dr-logo-pulse']}></span>
      </div>

      {/* Progress Bar */}
      <div className={styles['pai-dr-progress-container']}>
        <div
          className={styles['pai-dr-progress-bar']}
          style={{ width: `${progressPercent}%` }}
        >
          <div className={styles['pai-dr-progress-glow']}></div>
        </div>
      </div>

      <div className={styles['pai-dr-content']}>
        <div className={styles['pai-dr-visualization']}>
          {/* 3 columns, 4 rows = 12 modules total */}
          {/* Column 1, Row 1 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-left']}`}
            data-module="lead-generation"
          >
            <div className={styles['pai-dr-chart-header']}>Lead Generation Overview</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A bar chart style */}
            <div className={styles['chart-bar']}>
              <div className={styles['chart-bar-item']} data-barval="60"></div>
              <div className={styles['chart-bar-item']} data-barval="40"></div>
              <div className={styles['chart-bar-item']} data-barval="80"></div>
              <div className={styles['chart-bar-item']} data-barval="30"></div>
              <div className={styles['chart-bar-item']} data-barval="90"></div>
            </div>
          </div>

          {/* Column 2, Row 1 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-center']}`}
            data-module="traffic-sources"
          >
            <div className={styles['pai-dr-chart-header']}>Traffic Sources</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A bubble chart style */}
            <div className={styles['chart-bubble']}>
              <span className={styles['bubble']} data-size="small"></span>
              <span className={styles['bubble']} data-size="medium"></span>
              <span className={styles['bubble']} data-size="large"></span>
              <span className={styles['bubble']} data-size="xlarge"></span>
            </div>
          </div>

          {/* Column 3, Row 1 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-right']}`}
            data-module="engagement-timeline"
          >
            <div className={styles['pai-dr-chart-header']}>Engagement Timeline</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A line chart style */}
            <div className={styles['chart-line']}>
              <div className={styles['chart-line-path']}></div>
              <div className={styles['chart-line-point']} data-point="1"></div>
              <div className={styles['chart-line-point']} data-point="2"></div>
              <div className={styles['chart-line-point']} data-point="3"></div>
              <div className={styles['chart-line-point']} data-point="4"></div>
            </div>
          </div>

          {/* Column 1, Row 2 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-left']}`}
            data-module="conversion-funnel"
          >
            <div className={styles['pai-dr-chart-header']}>Conversion Funnel</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A funnel chart style */}
            <div className={styles['chart-funnel']}>
              <div className={styles['funnel-level']} data-level="1"></div>
              <div className={styles['funnel-level']} data-level="2"></div>
              <div className={styles['funnel-level']} data-level="3"></div>
              <div className={styles['funnel-level']} data-level="4"></div>
            </div>
          </div>

          {/* Column 2, Row 2 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-center']}`}
            data-module="value-ladder"
          >
            <div className={styles['pai-dr-chart-header']}>Value Ladder Analysis</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A radar chart style */}
            <div className={styles['chart-radar']}>
              <div className={styles['radar-area']}></div>
              <div className={styles['radar-dot']} data-dot="1"></div>
              <div className={styles['radar-dot']} data-dot="2"></div>
              <div className={styles['radar-dot']} data-dot="3"></div>
              <div className={styles['radar-dot']} data-dot="4"></div>
              <div className={styles['radar-dot']} data-dot="5"></div>
            </div>
          </div>

          {/* Column 3, Row 2 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-right']}`}
            data-module="audience-demographics"
          >
            <div className={styles['pai-dr-chart-header']}>Audience Demographics</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A donut chart style */}
            <div className={styles['chart-donut']}>
              <div className={styles['donut-slice']} data-slice="1"></div>
              <div className={styles['donut-slice']} data-slice="2"></div>
              <div className={styles['donut-slice']} data-slice="3"></div>
            </div>
          </div>

          {/* Column 1, Row 3 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-left']}`}
            data-module="revenue-channels"
          >
            <div className={styles['pai-dr-chart-header']}>Revenue Channels</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A stacked bar chart style */}
            <div className={styles['chart-stacked-bar']}>
              <div className={styles['stacked-bar']} data-stack="1"></div>
              <div className={styles['stacked-bar']} data-stack="2"></div>
              <div className={styles['stacked-bar']} data-stack="3"></div>
            </div>
          </div>

          {/* Column 2, Row 3 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-center']}`}
            data-module="competitive-position"
          >
            <div className={styles['pai-dr-chart-header']}>Competitive Positioning</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A chord diagram style */}
            <div className={styles['chart-chord']}>
              <div className={styles['chord-ring']}></div>
              <div className={styles['chord-line']} data-chord="1"></div>
              <div className={styles['chord-line']} data-chord="2"></div>
              <div className={styles['chord-line']} data-chord="3"></div>
            </div>
          </div>

          {/* Column 3, Row 3 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-right']}`}
            data-module="customer-sentiment"
          >
            <div className={styles['pai-dr-chart-header']}>Customer Sentiment</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A gauge chart style */}
            <div className={styles['chart-gauge']}>
              <div className={styles['gauge-arc']}></div>
              <div className={styles['gauge-needle']}></div>
            </div>
          </div>

          {/* Column 1, Row 4 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-left']}`}
            data-module="retention-factors"
          >
            <div className={styles['pai-dr-chart-header']}>Retention Factors</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A heatmap style */}
            <div className={styles['chart-heatmap']}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={styles['heatmap-cell']} data-cell={i + 1}></div>
              ))}
            </div>
          </div>

          {/* Column 2, Row 4 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-center']}`}
            data-module="growth-opportunities"
          >
            <div className={styles['pai-dr-chart-header']}>Growth Opportunities</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A scatter plot style */}
            <div className={styles['chart-scatter']}>
              <div className={styles['scatter-point']} data-pt="1"></div>
              <div className={styles['scatter-point']} data-pt="2"></div>
              <div className={styles['scatter-point']} data-pt="3"></div>
              <div className={styles['scatter-point']} data-pt="4"></div>
              <div className={styles['scatter-point']} data-pt="5"></div>
            </div>
          </div>

          {/* Column 3, Row 4 */}
          <div
            className={`${styles['pai-dr-data-module']} ${styles['fly-in-right']}`}
            data-module="actionable-insights"
          >
            <div className={styles['pai-dr-chart-header']}>Actionable Insights</div>
            <div className={styles['pai-dr-activity-indicator']}></div>
            {/* A sankey style */}
            <div className={styles['chart-sankey']}>
              <div className={styles['sankey-node']} data-node="source"></div>
              <div className={styles['sankey-node']} data-node="mid"></div>
              <div className={styles['sankey-node']} data-node="target"></div>
              <div className={styles['sankey-flow']}></div>
            </div>
          </div>

          {/* Background grid and pulses */}
          <div className={styles['pai-dr-grid']}></div>
          <div className={styles['pai-dr-data-pulses']}>
            <div className={styles['pai-dr-pulse']} data-pulse="1"></div>
            <div className={styles['pai-dr-pulse']} data-pulse="2"></div>
            <div className={styles['pai-dr-pulse']} data-pulse="3"></div>
          </div>
        </div>

        <div className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
          {loadingMessages[messageIndex]}
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;

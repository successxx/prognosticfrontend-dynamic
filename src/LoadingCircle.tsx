import React, { useEffect, useState, useRef } from "react";
import styles from "./LoadingCircle.module.css";

const LoadingCircle: React.FC = () => {
  // More detailed analysis log messages for realistic appearance
  const analysisLogMessages = [
    "Initializing system architecture...",
    "Starting virtual machine instances...",
    "Mounting data processing nodes...",
    "Connecting to analytical framework...",
    "Calibrating measurement parameters...",
    "Loading baseline comparisons...",
    "Initializing cross-domain analysis...",
    "Collecting multi-layer inputs...",
    "Identifying key data clusters...",
    "Evaluating potential anomalies...",
    "Preprocessing raw data streams...",
    "Building predictive models...",
    "Aggregating deep indicators...",
    "Normalizing reference datasets...",
    "Processing statistical correlations...",
    "Running variance analysis...",
    "Refining multi-dimensional signals...",
    "Mapping relational structures...",
    "Processing confidence intervals...",
    "Applying heuristic predictions...",
    "Calculating attribution models...",
    "Synthesizing correlation patterns...",
    "Validating projection accuracy...",
    "Optimizing decision thresholds...",
    "Pinpointing emergent insights...",
    "Finalizing data visualization...",
    "Compiling final intelligence...",
    "Analysis complete—preparing output..."
  ];

  // VM initialization messages
  const vmInitMessages = [
    "Initializing virtual machine...",
    "Starting analytical engine...",
    "Booting data processor...",
    "Loading analysis framework...",
    "Starting computational node...",
    "Initializing metrics engine...",
  ];

  // State management
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);
  const [moduleStates, setModuleStates] = useState<Array<{loading: boolean, initializing: boolean}>>([
    {loading: false, initializing: false},
    {loading: false, initializing: false},
    {loading: false, initializing: false},
    {loading: false, initializing: false},
    {loading: false, initializing: false},
    {loading: false, initializing: false},
    {loading: false, initializing: false},
    {loading: false, initializing: false},
    {loading: false, initializing: false},
    {loading: false, initializing: false},
    {loading: false, initializing: false},
    {loading: false, initializing: false}
  ]);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);

  // Handle module initialization
  useEffect(() => {
    // Randomly initialize modules
    const initializationOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].sort(() => Math.random() - 0.5);
    
    initializationOrder.forEach((moduleIndex, i) => {
      // Start loading modules at staggered times
      setTimeout(() => {
        setModuleStates(prev => {
          const newStates = [...prev];
          newStates[moduleIndex] = {loading: true, initializing: true};
          return newStates;
        });
        
        // After a random delay, switch from initializing to analysis
        setTimeout(() => {
          setModuleStates(prev => {
            const newStates = [...prev];
            newStates[moduleIndex] = {loading: true, initializing: false};
            return newStates;
          });
        }, 2000 + Math.random() * 3000);
      }, 500 + i * (Math.random() * 1000 + 300));
    });
  }, []);

  // Handle progress bar + rotating messages
  useEffect(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    
    // Gradually increase the progress bar over 8 seconds
    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          // Once at 100%, set analysis complete
          if (!analysisComplete) {
            setAnalysisComplete(true);
          }
          return 100;
        }
        // Make progress faster (complete in ~8 seconds)
        return Math.min(prev + 0.5, 100);
      });
    }, 40); // Faster updates for smoother animation

    // Rotate messages at a pace appropriate for 30-second analysis
    const updateMessage = () => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % analysisLogMessages.length);
        setFade(true);
      }, 500);
    };
    const intervalId = setInterval(updateMessage, 1100); // Faster message rotation

    return () => {
      clearInterval(intervalId);
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [messageIndex, analysisLogMessages.length, analysisComplete]);

  // Animation classes for more organic appearance
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

  // More fine-grained delay classes for natural staggering
  const delayClasses = [
    styles.delay1, styles.delay2, styles.delay3, styles.delay4,
    styles.delay5, styles.delay6, styles.delay7, styles.delay8,
    styles.delay9, styles.delay10, styles.delay11, styles.delay12
  ];

  // Random VM initialization message for a module
  const getVmMessage = (moduleIndex: number) => {
    return vmInitMessages[moduleIndex % vmInitMessages.length];
  };

  // Generic titles that work for any business context
  const moduleTitles = [
    "Data Acquisition – Primary Metrics",
    "Pattern Recognition – Insight Engine",
    "Trend Analysis – Projection System",
    "Comparative Analysis – Relationship Matrix",
    "Factor Analysis – Variable Mapping",
    "Correlation Engine – Signal Detection",
    "Resource Allocation – Optimization Model",
    "Stability Assessment – Risk Framework",
    "Performance Metrics – Efficiency Analyzer",
    "Segment Analysis – Distribution Map",
    "Forecasting Engine – Trend Modeler",
    "Network Analysis – Structure Mapper"
  ];

  // Status indicators that appear during module analysis
  const statusIndicators = [
    "Active", "Processing", "Analyzing", "Computing", 
    "Calculating", "Measuring", "Mapping", "Running",
    "Evaluating", "Modeling", "Optimizing", "Detecting"
  ];

  // Get a random status for a module
  const getModuleStatus = (moduleIndex: number) => {
    return statusIndicators[moduleIndex % statusIndicators.length];
  };

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
                {moduleStates[0].initializing ? getVmMessage(0) : moduleTitles[0]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[0].loading ? styles.active : ''}`}>
                {moduleStates[0].initializing ? 'Booting' : getModuleStatus(0)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[0].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
                <>
                  <div className={styles.chartGrid}></div>
                  <div className={styles.chartAxisX}></div>
                  <div className={styles.chartAxisY}></div>

                  <div className={styles.funnelContainer}>
                    <div className={styles.funnelMetric}>
                      <span className={styles.label}>Incoming Volume</span>
                      <span className={styles.value}>
                        <span className={styles.fluctuate}>14,982</span>
                      </span>
                      <div className={styles.bar} style={{width: '100%'}}></div>
                    </div>
                    <div className={styles.funnelMetric}>
                      <span className={styles.label}>Qualified Opportunities</span>
                      <span className={styles.value}>
                        <span className={styles.fluctuate}>8,439</span>
                      </span>
                      <div className={styles.bar} style={{width: '85%'}}></div>
                    </div>
                    <div className={styles.funnelMetric}>
                      <span className={styles.label}>Active Engagements</span>
                      <span className={styles.value}>
                        <span className={styles.fluctuate}>3,214</span>
                      </span>
                      <div className={styles.bar} style={{width: '64%'}}></div>
                    </div>
                    <div className={styles.funnelMetric}>
                      <span className={styles.label}>Conversion Events</span>
                      <span className={styles.value}>
                        <span className={styles.fluctuate}>1,897</span>
                      </span>
                      <div className={styles.bar} style={{width: '37%'}}></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 2) OPPORTUNITY MATRIX */}
          <div className={`${styles.module} ${getAnimationClass(1)} ${delayClasses[1]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[1].initializing ? getVmMessage(1) : moduleTitles[1]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[1].loading ? styles.active : ''}`}>
                {moduleStates[1].initializing ? 'Booting' : getModuleStatus(1)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[1].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
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
                    <div className={`${styles.radarValue} ${styles.pulse}`}></div>
                    <div className={`${styles.radarValue} ${styles.pulse}`}></div>
                    <div className={`${styles.radarValue} ${styles.pulse}`}></div>
                    <div className={`${styles.radarValue} ${styles.pulse}`}></div>
                    <div className={`${styles.radarValue} ${styles.pulse}`}></div>
                    <div className={`${styles.radarValue} ${styles.pulse}`}></div>
                    <div className={styles.radarArea}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3) PREDICTIVE TRENDS */}
          <div className={`${styles.module} ${getAnimationClass(2)} ${delayClasses[2]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[2].initializing ? getVmMessage(2) : moduleTitles[2]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[2].loading ? styles.active : ''}`}>
                {moduleStates[2].initializing ? 'Booting' : getModuleStatus(2)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[2].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
                <>
                  <div className={styles.chartGrid}></div>
                  <div className={styles.chartAxisX}></div>
                  <div className={styles.chartAxisY}></div>

                  <div className={styles.areaChartContainer}>
                    <div className={styles.areaPath}>
                      <div className={styles.area}></div>
                      <div className={styles.areaLine}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                      <div className={`${styles.dataPoint} ${styles.fluctuate}`}></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 4) COMPARATIVE BENCHMARKS */}
          <div className={`${styles.module} ${getAnimationClass(3)} ${delayClasses[3]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[3].initializing ? getVmMessage(3) : moduleTitles[3]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[3].loading ? styles.active : ''}`}>
                {moduleStates[3].initializing ? 'Booting' : getModuleStatus(3)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[3].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
                <div className={styles.chordContainer}>
                  <div className={styles.chordCircle}></div>
                  <div className={styles.chordArc}></div>
                  <div className={styles.chordArc}></div>
                  <div className={styles.chordArc}></div>
                  <div className={styles.chord}></div>
                  <div className={styles.chord2}></div>
                  <div className={`${styles.chordPoint} ${styles.fluctuate}`}></div>
                  <div className={`${styles.chordPoint} ${styles.fluctuate}`}></div>
                  <div className={`${styles.chordPoint} ${styles.fluctuate}`}></div>
                  <div className={`${styles.chordPoint} ${styles.fluctuate}`}></div>
                </div>
              )}
            </div>
          </div>

          {/* 5) MULTI-FACTOR ANALYSIS */}
          <div className={`${styles.module} ${getAnimationClass(0)} ${delayClasses[4]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[4].initializing ? getVmMessage(4) : moduleTitles[4]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[4].loading ? styles.active : ''}`}>
                {moduleStates[4].initializing ? 'Booting' : getModuleStatus(4)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[4].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
                <>
                  <div className={styles.chartGrid}></div>
                  <div className={styles.chartAxisX}></div>
                  <div className={styles.chartAxisY}></div>

                  <div className={styles.scatterContainer}>
                    <div className={`${styles.scatterPoint} ${styles.fluctuate}`} data-value="high"></div>
                    <div className={`${styles.scatterPoint} ${styles.fluctuate}`} data-value="medium"></div>
                    <div className={`${styles.scatterPoint} ${styles.fluctuate}`} data-value="high"></div>
                    <div className={`${styles.scatterPoint} ${styles.fluctuate}`} data-value="low"></div>
                    <div className={`${styles.scatterPoint} ${styles.fluctuate}`} data-value="medium"></div>
                    <div className={`${styles.scatterPoint} ${styles.fluctuate}`} data-value="low"></div>
                    <div className={`${styles.scatterPoint} ${styles.fluctuate}`} data-value="medium"></div>
                    <div className={`${styles.scatterPoint} ${styles.fluctuate}`} data-value="high"></div>
                    <div className={`${styles.scatterPoint} ${styles.fluctuate}`} data-value="medium"></div>
                    <div className={styles.trendLine}></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 6) CORRELATION MAPPING */}
          <div className={`${styles.module} ${getAnimationClass(1)} ${delayClasses[5]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[5].initializing ? getVmMessage(5) : moduleTitles[5]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[5].loading ? styles.active : ''}`}>
                {moduleStates[5].initializing ? 'Booting' : getModuleStatus(5)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[5].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
                <div className={styles.heatmapContainer}>
                  <div className={styles.heatmapGrid}>
                    <div className={`${styles.heatCell} ${styles.low} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.low} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.high} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles["very-high"]} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.high} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.low} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.low} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles["very-high"]} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.high} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.high} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.low} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles["very-high"]} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.high} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles["very-high"]} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.high} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.medium} ${styles.pulse}`}></div>
                    <div className={`${styles.heatCell} ${styles.low} ${styles.pulse}`}></div>
                  </div>
                  <div className={styles.xLabels}>
                    <span>Primary</span>
                    <span>Secondary</span>
                    <span>Tertiary</span>
                    <span>Quaternary</span>
                    <span>Extended</span>
                  </div>
                  <div className={styles.yLabels}>
                    <span>Phase 1</span>
                    <span>Phase 2</span>
                    <span>Phase 3</span>
                    <span>Phase 4</span>
                    <span>Phase 5</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 7) RESOURCE EFFICIENCY */}
          <div className={`${styles.module} ${getAnimationClass(2)} ${delayClasses[6]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[6].initializing ? getVmMessage(6) : moduleTitles[6]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[6].loading ? styles.active : ''}`}>
                {moduleStates[6].initializing ? 'Booting' : getModuleStatus(6)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[6].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
                <div className={styles.donutContainer}>
                  <div className={styles.donutRing}></div>
                  <div className={`${styles.donutSegment} ${styles.segment1}`}></div>
                  <div className={`${styles.donutSegment} ${styles.segment2}`}></div>
                  <div className={`${styles.donutSegment} ${styles.segment3}`}></div>
                  <div className={styles.donutHole}></div>
                  <div className={styles.donutLabel}>
                    <div className={`${styles.value} ${styles.fluctuate}`}>68%</div>
                    <div className={styles.text}>Efficiency</div>
                  </div>
                  <div className={styles.legendItem}>
                    <span></span>Primary Drivers
                  </div>
                  <div className={styles.legendItem}>
                    <span></span>Secondary Factors
                  </div>
                  <div className={styles.legendItem}>
                    <span></span>Tertiary Elements
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 8) STABILITY OVERVIEW */}
          <div className={`${styles.module} ${getAnimationClass(3)} ${delayClasses[7]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[7].initializing ? getVmMessage(7) : moduleTitles[7]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[7].loading ? styles.active : ''}`}>
                {moduleStates[7].initializing ? 'Booting' : getModuleStatus(7)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[7].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
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
                  <div className={`${styles.gaugeNeedle} ${styles.microMove}`}></div>
                  <div className={styles.gaugeValue}>
                    <span className={styles.fluctuate}>73%</span> Stability
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 9) PERFORMANCE LAYERS */}
          <div className={`${styles.module} ${getAnimationClass(0)} ${delayClasses[8]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[8].initializing ? getVmMessage(8) : moduleTitles[8]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[8].loading ? styles.active : ''}`}>
                {moduleStates[8].initializing ? 'Booting' : getModuleStatus(8)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[8].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
                <>
                  <div className={styles.chartGrid}></div>
                  <div className={styles.chartAxisX}></div>
                  <div className={styles.chartAxisY}></div>

                  <div className={styles.barChartContainer}>
                    <div className={styles.barGroup}>
                      <div className={styles.barWrapper}>
                        <div className={`${styles.bar} ${styles.microMove}`}></div>
                        <div className={styles.barLabel}>Category 1</div>
                        <div className={styles.barValue}>
                          <span className={styles.fluctuate}>54%</span>
                        </div>
                      </div>
                      <div className={styles.barWrapper}>
                        <div className={`${styles.bar} ${styles.microMove}`}></div>
                        <div className={styles.barLabel}>Category 2</div>
                        <div className={styles.barValue}>
                          <span className={styles.fluctuate}>76%</span>
                        </div>
                      </div>
                      <div className={styles.barWrapper}>
                        <div className={`${styles.bar} ${styles.microMove}`}></div>
                        <div className={styles.barLabel}>Category 3</div>
                        <div className={styles.barValue}>
                          <span className={styles.fluctuate}>62%</span>
                        </div>
                      </div>
                      <div className={styles.barWrapper}>
                        <div className={`${styles.bar} ${styles.microMove}`}></div>
                        <div className={styles.barLabel}>Category 4</div>
                        <div className={styles.barValue}>
                          <span className={styles.fluctuate}>89%</span>
                        </div>
                      </div>
                      <div className={styles.barWrapper}>
                        <div className={`${styles.bar} ${styles.microMove}`}></div>
                        <div className={styles.barLabel}>Category 5</div>
                        <div className={styles.barValue}>
                          <span className={styles.fluctuate}>71%</span>
                        </div>
                      </div>
                      <div className={styles.barWrapper}>
                        <div className={`${styles.bar} ${styles.microMove}`}></div>
                        <div className={styles.barLabel}>Category 6</div>
                        <div className={styles.barValue}>
                          <span className={styles.fluctuate}>48%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 10) MARKET INTELLIGENCE */}
          <div className={`${styles.module} ${getAnimationClass(1)} ${delayClasses[9]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[9].initializing ? getVmMessage(9) : moduleTitles[9]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[9].loading ? styles.active : ''}`}>
                {moduleStates[9].initializing ? 'Booting' : getModuleStatus(9)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[9].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
                <>
                  <div className={styles.chartGrid}></div>
                  <div className={styles.chartAxisX}></div>
                  <div className={styles.chartAxisY}></div>

                  <div className={styles.bubbleContainer}>
                    <div className={`${styles.bubble} ${styles.microMove}`}></div>
                    <div className={`${styles.bubble} ${styles.microMove}`}></div>
                    <div className={`${styles.bubble} ${styles.microMove}`}></div>
                    <div className={styles.bubbleLabel}>Segment A</div>
                    <div className={styles.bubbleLabel}>Segment B</div>
                    <div className={styles.bubbleLabel}>Segment C</div>
                    <div className={styles.bubbleValue}>
                      <span className={styles.fluctuate}>42.6%</span>
                    </div>
                    <div className={styles.bubbleValue}>
                      <span className={styles.fluctuate}>31.8%</span>
                    </div>
                    <div className={styles.bubbleValue}>
                      <span className={styles.fluctuate}>25.6%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 11) FORECAST MODELING */}
          <div className={`${styles.module} ${getAnimationClass(2)} ${delayClasses[10]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[10].initializing ? getVmMessage(10) : moduleTitles[10]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[10].loading ? styles.active : ''}`}>
                {moduleStates[10].initializing ? 'Booting' : getModuleStatus(10)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[10].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
                <>
                  <div className={styles.chartGrid}></div>
                  <div className={styles.chartAxisX}></div>
                  <div className={styles.chartAxisY}></div>

                  <div className={styles.lineChartContainer}>
                    <div className={styles.lineChart}>
                      <div className={styles.lineBase}></div>
                      <div className={styles.linePath}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={`${styles.linePoint} ${styles.microMove}`}></div>
                      <div className={styles.lineFill}></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 12) PATTERN DISCOVERY */}
          <div className={`${styles.module} ${getAnimationClass(3)} ${delayClasses[11]}`}>
            <div className={styles.macWindowBar}>
              <span className={styles.trafficLight} data-color="red" />
              <span className={styles.trafficLight} data-color="yellow" />
              <span className={styles.trafficLight} data-color="green" />
              <div className={styles.windowTitle}>
                {moduleStates[11].initializing ? getVmMessage(11) : moduleTitles[11]}
              </div>
              <div className={`${styles.windowStatus} ${moduleStates[11].loading ? styles.active : ''}`}>
                {moduleStates[11].initializing ? 'Booting' : getModuleStatus(11)}
              </div>
            </div>
            <div className={styles.moduleBody}>
              {moduleStates[11].initializing ? (
                <div className={styles.moduleLoading}>
                  <div className={styles.loadingDots}></div>
                </div>
              ) : (
                <>
                  <div className={styles.chartGrid}></div>
                  <div className={styles.networkContainer}>
                    <div className={`${styles.networkNode} ${styles.microMove}`}></div>
                    <div className={`${styles.networkNode} ${styles.microMove}`}></div>
                    <div className={`${styles.networkNode} ${styles.microMove}`}></div>
                    <div className={`${styles.networkNode} ${styles.microMove}`}></div>
                    <div className={`${styles.networkNode} ${styles.microMove}`}></div>
                    <div className={styles.networkLink}></div>
                    <div className={styles.networkLink}></div>
                    <div className={styles.networkLink}></div>
                    <div className={styles.networkLink}></div>
                    <div className={styles.networkLink}></div>
                    <div className={styles.networkLink}></div>
                    <div className={styles.networkLink}></div>
                    <div className={styles.networkLink}></div>
                    <div className={styles.nodeLabel}>Node A</div>
                    <div className={styles.nodeLabel}>Node B</div>
                    <div className={styles.nodeLabel}>Node C</div>
                    <div className={styles.nodeLabel}>Node D</div>
                    <div className={styles.nodeLabel}>Node E</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rotating messages - Analysis log */}
        <div className={`${styles.message} ${fade ? styles.fadeIn : styles.fadeOut}`}>
          {analysisLogMessages[messageIndex]}
        </div>
      </div>
    </div>
  );
};

export default LoadingCircle;

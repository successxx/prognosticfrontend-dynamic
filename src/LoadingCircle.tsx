import React, { useEffect, useState, useRef } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    const loadingMessages = [
        "Analyzing your market positioning...",
        "Identifying growth opportunities...",
        "Calculating potential ROI...",
        "Mapping competitive landscape...",
        "Evaluating conversion pathways...",
        "Extracting key insights...",
        "Optimizing strategic approach...",
        "Processing industry benchmarks...",
        "Generating actionable intelligence...",
        "Prioritizing implementation steps...",
        "Finalizing personalized report...",
        "Analysis complete - Processing results..."
    ];
    
    const [messageIndex, setMessageIndex] = useState<number>(0);
    const [fade, setFade] = useState<boolean>(true); // True for fade-in, false for fade-out
    const [progressPercent, setProgressPercent] = useState<number>(0);
    const progressIntervalRef = useRef<number | null>(null);
    const [visibleModules, setVisibleModules] = useState<number>(0);
    
    useEffect(() => {
        // Sequence the appearance of modules
        const moduleTimer = setInterval(() => {
            setVisibleModules(prev => {
                if (prev < 12) {
                    return prev + 1;
                } else {
                    clearInterval(moduleTimer);
                    return prev;
                }
            });
        }, 400); // Stagger the appearance
        
        // Progress bar animation
        if (progressIntervalRef.current) {
            window.clearInterval(progressIntervalRef.current);
        }
        
        progressIntervalRef.current = window.setInterval(() => {
            setProgressPercent(prev => {
                // Calculate target percentage based on current message index
                const targetPercent = (messageIndex / (loadingMessages.length - 1)) * 100;
                // Move toward target percentage gradually
                if (prev < targetPercent) {
                    return Math.min(prev + 0.5, targetPercent);
                }
                return prev;
            });
        }, 100);
        
        const updateMessage = () => {
            setFade(false); // Start fade-out
            setTimeout(() => {
                // After fade-out completes, update the message and fade-in
                setMessageIndex((prevIndex) => {
                    const newIndex = (prevIndex + 1) % loadingMessages.length;
                    return newIndex;
                });
                setFade(true); // Trigger fade-in
            }, 500); // Match the duration of the fade-out
        };
        
        // Set an interval to change the message every 4 seconds
        const intervalId = setInterval(updateMessage, 4000);
        
        // Clean up on unmount
        return () => {
            clearInterval(intervalId);
            clearInterval(moduleTimer);
            if (progressIntervalRef.current) {
                window.clearInterval(progressIntervalRef.current);
            }
        };
    }, [loadingMessages.length, messageIndex]);
    
    return (
        <div className={styles['prognostic-ai-demo-results-container']}>
            <div className={styles['pai-dr-header']}>
                <span className={styles['pai-dr-logo-pulse']}></span>
                Advanced Intelligence Analysis
                <span className={styles['pai-dr-logo-pulse']}></span>
            </div>
            
            {/* Progress bar */}
            <div className={styles['pai-dr-progress-container']}>
                <div 
                    className={styles['pai-dr-progress-bar']} 
                    style={{width: `${progressPercent}%`}}
                >
                    <div className={styles['pai-dr-progress-glow']}></div>
                </div>
            </div>
            
            <div className={styles['pai-dr-content']}>
                <div className={styles['pai-dr-visualization']}>
                    {/* Row 1 */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 1 ? styles['module-visible'] : ''}`} data-module="market-positioning" data-row="1" data-col="1" data-entry="left">
                        <div className={styles['pai-dr-chart-header']}>Market Positioning</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-scatter-plot']}>
                            <div className={styles['pai-dr-scatter-point']} data-point="1"></div>
                            <div className={styles['pai-dr-scatter-point']} data-point="2"></div>
                            <div className={styles['pai-dr-scatter-point']} data-point="3"></div>
                            <div className={styles['pai-dr-scatter-point']} data-point="4"></div>
                            <div className={styles['pai-dr-scatter-point']} data-point="5"></div>
                            <div className={styles['pai-dr-scatter-point']} data-point="6"></div>
                            <div className={styles['pai-dr-scatter-point']} data-point="7"></div>
                            <div className={styles['pai-dr-scatter-cluster']} data-cluster="1"></div>
                            <div className={styles['pai-dr-scatter-cluster']} data-cluster="2"></div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>Top 13%</span>
                        </div>
                    </div>
                    
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 2 ? styles['module-visible'] : ''}`} data-module="revenue-forecast" data-row="1" data-col="2" data-entry="top">
                        <div className={styles['pai-dr-chart-header']}>Growth Opportunity</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} data-value="40%"></div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>+24%</span>
                        </div>
                    </div>
                    
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 3 ? styles['module-visible'] : ''}`} data-module="engagement-patterns" data-row="1" data-col="3" data-entry="right">
                        <div className={styles['pai-dr-chart-header']}>Engagement Analysis</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-pulse-graph']}>
                            <div className={styles['pai-dr-pulse-line']}></div>
                            <div className={styles['pai-dr-pulse-marker']} data-marker="1"></div>
                            <div className={styles['pai-dr-pulse-marker']} data-marker="2"></div>
                            <div className={styles['pai-dr-pulse-marker']} data-marker="3"></div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>High Engagement</span>
                        </div>
                    </div>
                    
                    {/* Row 2 */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 4 ? styles['module-visible'] : ''}`} data-module="conversion-funnel" data-row="2" data-col="1" data-entry="left">
                        <div className={styles['pai-dr-chart-header']}>Conversion Funnel</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-funnel-chart']}>
                            <div className={styles['pai-dr-funnel-segment']} data-segment="1"></div>
                            <div className={styles['pai-dr-funnel-segment']} data-segment="2"></div>
                            <div className={styles['pai-dr-funnel-segment']} data-segment="3"></div>
                            <div className={styles['pai-dr-funnel-segment']} data-segment="4"></div>
                            <div className={styles['pai-dr-funnel-flow']}></div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>3.2% Conversion</span>
                        </div>
                    </div>
                    
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 5 ? styles['module-visible'] : ''}`} data-module="industry-benchmarks" data-row="2" data-col="2" data-entry="top">
                        <div className={styles['pai-dr-chart-header']}>Industry Benchmarks</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} data-point="1"></div>
                            <div className={styles['pai-dr-radar-point']} data-point="2"></div>
                            <div className={styles['pai-dr-radar-point']} data-point="3"></div>
                            <div className={styles['pai-dr-radar-point']} data-point="4"></div>
                            <div className={styles['pai-dr-radar-point']} data-point="5"></div>
                            <div className={styles['pai-dr-radar-line']} data-line="1"></div>
                            <div className={styles['pai-dr-radar-line']} data-line="2"></div>
                            <div className={styles['pai-dr-radar-line']} data-line="3"></div>
                            <div className={styles['pai-dr-radar-line']} data-line="4"></div>
                            <div className={styles['pai-dr-radar-line']} data-line="5"></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>Top Quartile</span>
                        </div>
                    </div>
                    
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 6 ? styles['module-visible'] : ''}`} data-module="implementation-timeline" data-row="2" data-col="3" data-entry="right">
                        <div className={styles['pai-dr-chart-header']}>Implementation Plan</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-timeline']}>
                            <div className={styles['pai-dr-timeline-track']}></div>
                            <div className={styles['pai-dr-timeline-marker']} data-marker="1"></div>
                            <div className={styles['pai-dr-timeline-marker']} data-marker="2"></div>
                            <div className={styles['pai-dr-timeline-marker']} data-marker="3"></div>
                            <div className={styles['pai-dr-timeline-marker']} data-marker="4"></div>
                            <div className={styles['pai-dr-timeline-progress']}></div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>90-Day Plan</span>
                        </div>
                    </div>
                    
                    {/* Row 3 */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 7 ? styles['module-visible'] : ''}`} data-module="audience-segments" data-row="3" data-col="1" data-entry="left">
                        <div className={styles['pai-dr-chart-header']}>Audience Segments</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-pie-chart-container']}>
                            <div className={styles['pai-dr-pie-chart']}>
                                <div className={styles['pai-dr-pie-segment']} data-segment="1"></div>
                                <div className={styles['pai-dr-pie-segment']} data-segment="2"></div>
                                <div className={styles['pai-dr-pie-segment']} data-segment="3"></div>
                            </div>
                            <div className={styles['pai-dr-pie-data-points']}>
                                <div className={styles['pai-dr-pie-label']} data-label="a">A: 42%</div>
                                <div className={styles['pai-dr-pie-label']} data-label="b">B: 28%</div>
                                <div className={styles['pai-dr-pie-label']} data-label="c">C: 30%</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 8 ? styles['module-visible'] : ''}`} data-module="competitor-analysis" data-row="3" data-col="2" data-entry="bottom">
                        <div className={styles['pai-dr-chart-header']}>Competitive Edge</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-comparison-chart']}>
                            <div className={styles['pai-dr-comparison-bar']} data-bar="you"></div>
                            <div className={styles['pai-dr-comparison-bar']} data-bar="competitor"></div>
                            <div className={styles['pai-dr-comparison-label']} data-label="you">You</div>
                            <div className={styles['pai-dr-comparison-label']} data-label="competitor">Comp.</div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>+32% Advantage</span>
                        </div>
                    </div>
                    
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 9 ? styles['module-visible'] : ''}`} data-module="sentiment-analysis" data-row="3" data-col="3" data-entry="right">
                        <div className={styles['pai-dr-chart-header']}>Market Perception</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-sentiment-meter']}>
                            <div className={styles['pai-dr-sentiment-scale']}></div>
                            <div className={styles['pai-dr-sentiment-indicator']}></div>
                            <div className={styles['pai-dr-sentiment-marker']} data-sentiment="negative"></div>
                            <div className={styles['pai-dr-sentiment-marker']} data-sentiment="neutral"></div>
                            <div className={styles['pai-dr-sentiment-marker']} data-sentiment="positive"></div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>Highly Favorable</span>
                        </div>
                    </div>
                    
                    {/* Row 4 */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 10 ? styles['module-visible'] : ''}`} data-module="opportunity-matrix" data-row="4" data-col="1" data-entry="left">
                        <div className={styles['pai-dr-chart-header']}>Opportunity Matrix</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-scoring-matrix']}>
                            <div className={styles['pai-dr-matrix-cell']} data-cell="1"></div>
                            <div className={styles['pai-dr-matrix-cell']} data-cell="2"></div>
                            <div className={styles['pai-dr-matrix-cell']} data-cell="3"></div>
                            <div className={styles['pai-dr-matrix-cell']} data-cell="4"></div>
                            <div className={styles['pai-dr-matrix-cell']} data-cell="5"></div>
                            <div className={styles['pai-dr-matrix-cell']} data-cell="6"></div>
                            <div className={styles['pai-dr-matrix-cell']} data-cell="7"></div>
                            <div className={styles['pai-dr-matrix-cell']} data-cell="8"></div>
                            <div className={styles['pai-dr-matrix-cell']} data-cell="9"></div>
                            <div className={styles['pai-dr-matrix-scan-line']}></div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>7 Key Opportunities</span>
                        </div>
                    </div>
                    
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 11 ? styles['module-visible'] : ''}`} data-module="content-effectiveness" data-row="4" data-col="2" data-entry="bottom">
                        <div className={styles['pai-dr-chart-header']}>Content Effectiveness</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-heatmap']}>
                            <div className={styles['pai-dr-heatmap-grid']}>
                                {Array.from({length: 16}).map((_, i) => (
                                    <div key={i} className={styles['pai-dr-heatmap-cell']} data-cell={i+1}></div>
                                ))}
                            </div>
                            <div className={styles['pai-dr-heatmap-highlight']}></div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>High Impact Areas</span>
                        </div>
                    </div>
                    
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 12 ? styles['module-visible'] : ''}`} data-module="roi-projection" data-row="4" data-col="3" data-entry="right">
                        <div className={styles['pai-dr-chart-header']}>ROI Projection</div>
                        <div className={styles['pai-dr-activity-indicator']}></div>
                        <div className={styles['pai-dr-forecast-graph']}>
                            <div className={styles['pai-dr-forecast-baseline']}></div>
                            <div className={styles['pai-dr-forecast-trend']}></div>
                            <div className={styles['pai-dr-forecast-point']} data-point="1"></div>
                            <div className={styles['pai-dr-forecast-point']} data-point="2"></div>
                            <div className={styles['pai-dr-forecast-point']} data-point="3"></div>
                            <div className={styles['pai-dr-forecast-projection']}></div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>+248% Projected</span>
                        </div>
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

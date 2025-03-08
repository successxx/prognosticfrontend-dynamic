import React, { useEffect, useState, useRef } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    const loadingMessages = [
        "Initializing comprehensive analysis...",
        "Evaluating key performance metrics...",
        "Identifying strategic opportunities...",
        "Calculating optimization potential...",
        "Processing decision intelligence factors...",
        "Generating data-driven insights...",
        "Assessing competitive positioning...",
        "Conducting predictive scenario analysis...",
        "Quantifying future growth trajectory...",
        "Compiling personalized action plan...",
        "Analysis complete - Finalizing report..."
    ];
    
    const [messageIndex, setMessageIndex] = useState<number>(0);
    const [fade, setFade] = useState<boolean>(true);
    const [progressPercent, setProgressPercent] = useState<number>(0);
    const progressIntervalRef = useRef<number | null>(null);
    const [visibleModules, setVisibleModules] = useState<number>(0);
    
    useEffect(() => {
        // Sequence the appearance of modules over 5 seconds
        const moduleTimer = setInterval(() => {
            setVisibleModules(prev => {
                if (prev < 12) {
                    return prev + 1;
                } else {
                    clearInterval(moduleTimer);
                    return prev;
                }
            });
        }, 400); // 5 seconds / 12 modules ≈ 400ms per module
        
        // Progress bar animation
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
        
        const intervalId = setInterval(updateMessage, 4000);
        
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
                Advanced Intelligence Analysis
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
                    {/* Strategic Positioning Analysis */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 1 ? styles['module-visible'] : ''}`} data-module="strategic-positioning" data-row="1" data-col="1" data-entry="left">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Strategic Positioning</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-scatter-plot']}>
                                <div className={styles['pai-dr-scatter-axis-x']}></div>
                                <div className={styles['pai-dr-scatter-axis-y']}></div>
                                <div className={styles['pai-dr-scatter-point']} data-point="1"></div>
                                <div className={styles['pai-dr-scatter-point']} data-point="2"></div>
                                <div className={styles['pai-dr-scatter-point']} data-point="3"></div>
                                <div className={styles['pai-dr-scatter-point']} data-point="4"></div>
                                <div className={styles['pai-dr-scatter-point']} data-point="5"></div>
                                <div className={styles['pai-dr-scatter-point']} data-point="you"}>You</div>
                                <div className={styles['pai-dr-scatter-quadrant']} data-quadrant="target"></div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>85% Match</span>
                        </div>
                    </div>
                    
                    {/* Opportunity Analysis */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 2 ? styles['module-visible'] : ''}`} data-module="opportunity-analysis" data-row="1" data-col="2" data-entry="top">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Opportunity Analysis</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-gauge-chart']}>
                                <div className={styles['pai-dr-gauge-scale']}></div>
                                <div className={styles['pai-dr-gauge-needle']}></div>
                                <div className={styles['pai-dr-gauge-labels']}>
                                    <span>Low</span>
                                    <span>Medium</span>
                                    <span>High</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>High Potential</span>
                        </div>
                    </div>
                    
                    {/* Performance Metrics */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 3 ? styles['module-visible'] : ''}`} data-module="performance-metrics" data-row="1" data-col="3" data-entry="right">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Performance Metrics</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-multiline-chart']}>
                                <div className={styles['pai-dr-chart-axis-x']}></div>
                                <div className={styles['pai-dr-chart-axis-y']}></div>
                                <div className={styles['pai-dr-chart-line']} data-line="1"></div>
                                <div className={styles['pai-dr-chart-line']} data-line="2"></div>
                                <div className={styles['pai-dr-chart-line']} data-line="3"></div>
                                <div className={styles['pai-dr-chart-dot']} data-dot="1"></div>
                                <div className={styles['pai-dr-chart-dot']} data-dot="2"></div>
                                <div className={styles['pai-dr-chart-dot']} data-dot="3"></div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>+32% Above Average</span>
                        </div>
                    </div>
                    
                    {/* Process Flow Analysis */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 4 ? styles['module-visible'] : ''}`} data-module="process-flow" data-row="2" data-col="1" data-entry="left">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Process Flow Analysis</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-sankey-diagram']}>
                                <div className={styles['pai-dr-sankey-node']} data-node="1">
                                    <div className={styles['pai-dr-sankey-label']}>Start</div>
                                </div>
                                <div className={styles['pai-dr-sankey-flow']} data-flow="1-2"></div>
                                <div className={styles['pai-dr-sankey-flow']} data-flow="1-3"></div>
                                <div className={styles['pai-dr-sankey-node']} data-node="2">
                                    <div className={styles['pai-dr-sankey-label']}>A</div>
                                </div>
                                <div className={styles['pai-dr-sankey-node']} data-node="3">
                                    <div className={styles['pai-dr-sankey-label']}>B</div>
                                </div>
                                <div className={styles['pai-dr-sankey-flow']} data-flow="2-4"></div>
                                <div className={styles['pai-dr-sankey-flow']} data-flow="3-4"></div>
                                <div className={styles['pai-dr-sankey-node']} data-node="4">
                                    <div className={styles['pai-dr-sankey-label']}>End</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>3 Optimization Points</span>
                        </div>
                    </div>
                    
                    {/* Competitive Analysis */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 5 ? styles['module-visible'] : ''}`} data-module="competitive-analysis" data-row="2" data-col="2" data-entry="top">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Competitive Analysis</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-radar-chart']}>
                                <div className={styles['pai-dr-radar-ring']} data-ring="1"></div>
                                <div className={styles['pai-dr-radar-ring']} data-ring="2"></div>
                                <div className={styles['pai-dr-radar-ring']} data-ring="3"></div>
                                <div className={styles['pai-dr-radar-axis']} data-axis="1"></div>
                                <div className={styles['pai-dr-radar-axis']} data-axis="2"></div>
                                <div className={styles['pai-dr-radar-axis']} data-axis="3"></div>
                                <div className={styles['pai-dr-radar-axis']} data-axis="4"></div>
                                <div className={styles['pai-dr-radar-axis']} data-axis="5"></div>
                                <div className={styles['pai-dr-radar-shape']} data-shape="you"></div>
                                <div className={styles['pai-dr-radar-shape']} data-shape="competition"></div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>Top Quartile</span>
                        </div>
                    </div>
                    
                    {/* Strategic Timeline */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 6 ? styles['module-visible'] : ''}`} data-module="strategic-timeline" data-row="2" data-col="3" data-entry="right">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Strategic Timeline</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-gantt-chart']}>
                                <div className={styles['pai-dr-gantt-header']}>
                                    <div className={styles['pai-dr-gantt-timespan']} data-time="q1">Q1</div>
                                    <div className={styles['pai-dr-gantt-timespan']} data-time="q2">Q2</div>
                                    <div className={styles['pai-dr-gantt-timespan']} data-time="q3">Q3</div>
                                    <div className={styles['pai-dr-gantt-timespan']} data-time="q4">Q4</div>
                                </div>
                                <div className={styles['pai-dr-gantt-bar']} data-task="1"></div>
                                <div className={styles['pai-dr-gantt-bar']} data-task="2"></div>
                                <div className={styles['pai-dr-gantt-bar']} data-task="3"></div>
                                <div className={styles['pai-dr-gantt-progress']}></div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>12-Month Plan</span>
                        </div>
                    </div>
                    
                    {/* Resource Allocation */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 7 ? styles['module-visible'] : ''}`} data-module="resource-allocation" data-row="3" data-col="1" data-entry="left">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Resource Allocation</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-treemap']}>
                                <div className={styles['pai-dr-treemap-item']} data-size="large"></div>
                                <div className={styles['pai-dr-treemap-item']} data-size="medium-1"></div>
                                <div className={styles['pai-dr-treemap-item']} data-size="medium-2"></div>
                                <div className={styles['pai-dr-treemap-item']} data-size="small-1"></div>
                                <div className={styles['pai-dr-treemap-item']} data-size="small-2"></div>
                                <div className={styles['pai-dr-treemap-item']} data-size="small-3"></div>
                                <div className={styles['pai-dr-treemap-labels']}>
                                    <span>A:42%</span>
                                    <span>B:28%</span>
                                    <span>C:15%</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>Optimal Distribution</span>
                        </div>
                    </div>
                    
                    {/* Risk Assessment */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 8 ? styles['module-visible'] : ''}`} data-module="risk-assessment" data-row="3" data-col="2" data-entry="bottom">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Risk Assessment</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-heatmap']}>
                                <div className={styles['pai-dr-heatmap-axis-x']}>
                                    <span>Low</span>
                                    <span>Impact</span>
                                    <span>High</span>
                                </div>
                                <div className={styles['pai-dr-heatmap-axis-y']}>
                                    <span>High</span>
                                    <span>Probability</span>
                                    <span>Low</span>
                                </div>
                                <div className={styles['pai-dr-heatmap-grid']}>
                                    {Array.from({length: 9}).map((_, i) => (
                                        <div key={i} className={styles['pai-dr-heatmap-cell']} data-cell={i+1}></div>
                                    ))}
                                </div>
                                <div className={styles['pai-dr-heatmap-highlight']}></div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>7 Risk Factors</span>
                        </div>
                    </div>
                    
                    {/* Sentiment Analysis */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 9 ? styles['module-visible'] : ''}`} data-module="sentiment-analysis" data-row="3" data-col="3" data-entry="right">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Sentiment Analysis</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-sentiment-chart']}>
                                <div className={styles['pai-dr-chart-bar']} data-sentiment="positive"></div>
                                <div className={styles['pai-dr-chart-bar']} data-sentiment="neutral"></div>
                                <div className={styles['pai-dr-chart-bar']} data-sentiment="negative"></div>
                                <div className={styles['pai-dr-sentiment-labels']}>
                                    <span>Pos</span>
                                    <span>Neu</span>
                                    <span>Neg</span>
                                </div>
                                <div className={styles['pai-dr-sentiment-values']}>
                                    <span>68%</span>
                                    <span>24%</span>
                                    <span>8%</span>
                                </div>
                                <div className={styles['pai-dr-sentiment-trend']}></div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>Highly Favorable</span>
                        </div>
                    </div>
                    
                    {/* Efficiency Matrix */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 10 ? styles['module-visible'] : ''}`} data-module="efficiency-matrix" data-row="4" data-col="1" data-entry="left">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Efficiency Matrix</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-quadrant-chart']}>
                                <div className={styles['pai-dr-quadrant-grid']}>
                                    <div className={styles['pai-dr-quadrant']} data-quadrant="1"></div>
                                    <div className={styles['pai-dr-quadrant']} data-quadrant="2"></div>
                                    <div className={styles['pai-dr-quadrant']} data-quadrant="3"></div>
                                    <div className={styles['pai-dr-quadrant']} data-quadrant="4"></div>
                                </div>
                                <div className={styles['pai-dr-quadrant-axis-x']}></div>
                                <div className={styles['pai-dr-quadrant-axis-y']}></div>
                                <div className={styles['pai-dr-quadrant-point']} data-point="a"></div>
                                <div className={styles['pai-dr-quadrant-point']} data-point="b"></div>
                                <div className={styles['pai-dr-quadrant-point']} data-point="c"></div>
                                <div className={styles['pai-dr-quadrant-scan']}></div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>4 High Value Opportunities</span>
                        </div>
                    </div>
                    
                    {/* Growth Forecast */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 11 ? styles['module-visible'] : ''}`} data-module="growth-forecast" data-row="4" data-col="2" data-entry="bottom">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>Growth Forecast</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-area-chart']}>
                                <div className={styles['pai-dr-chart-axis-x']}></div>
                                <div className={styles['pai-dr-chart-axis-y']}></div>
                                <div className={styles['pai-dr-area-baseline']}></div>
                                <div className={styles['pai-dr-area-fill']}></div>
                                <div className={styles['pai-dr-area-trend']}></div>
                                <div className={styles['pai-dr-area-point']} data-point="current"></div>
                                <div className={styles['pai-dr-area-projection']}></div>
                                <div className={styles['pai-dr-area-range-high']}></div>
                                <div className={styles['pai-dr-area-range-low']}></div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>+156% Projected</span>
                        </div>
                    </div>
                    
                    {/* ROI Analysis */}
                    <div className={`${styles['pai-dr-data-module']} ${visibleModules >= 12 ? styles['module-visible'] : ''}`} data-module="roi-analysis" data-row="4" data-col="3" data-entry="right">
                        <div className={styles['pai-dr-window-controls']}>
                            <span className={styles['pai-dr-window-btn']} data-btn="close"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="minimize"></span>
                            <span className={styles['pai-dr-window-btn']} data-btn="maximize"></span>
                            <span className={styles['pai-dr-window-title']}>ROI Analysis</span>
                        </div>
                        <div className={styles['pai-dr-chart-container']}>
                            <div className={styles['pai-dr-stacked-chart']}>
                                <div className={styles['pai-dr-stacked-bar']}>
                                    <div className={styles['pai-dr-stacked-segment']} data-segment="cost"></div>
                                    <div className={styles['pai-dr-stacked-segment']} data-segment="gain"></div>
                                </div>
                                <div className={styles['pai-dr-stacked-bar']}>
                                    <div className={styles['pai-dr-stacked-segment']} data-segment="cost"></div>
                                    <div className={styles['pai-dr-stacked-segment']} data-segment="gain"></div>
                                </div>
                                <div className={styles['pai-dr-stacked-bar']}>
                                    <div className={styles['pai-dr-stacked-segment']} data-segment="cost"></div>
                                    <div className={styles['pai-dr-stacked-segment']} data-segment="gain"></div>
                                </div>
                                <div className={styles['pai-dr-roi-indicator']}>
                                    <span>ROI</span>
                                    <span className={styles['pai-dr-roi-value']}>3.7x</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles['pai-dr-data-points']}>
                            <span>3.7x Projected Return</span>
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

import React, { useEffect, useState, useRef } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    const loadingMessages = [
        "Initializing quantum analysis...",
        "Scanning your digital presence...",
        "Identifying market opportunities...",
        "Calculating conversion potential...",
        "Mapping competitive landscape...",
        "Running predictive algorithms...",
        "Processing engagement patterns...",
        "Optimizing revenue streams...",
        "Simulating market scenarios...",
        "Generating growth strategies...",
        "Refining tactical approach...",
        "Analysis complete - Processing results...",
        "Analysis complete - Finalizing insights...",
        "Analysis complete - Integrating solutions...",
        "Analysis complete - Validating recommendations...",
        "Analysis complete - Preparing final report..."
    ];
    
    const [messageIndex, setMessageIndex] = useState<number>(0);
    const [fade, setFade] = useState<boolean>(true); // True for fade-in, false for fade-out
    const [progressPercent, setProgressPercent] = useState<number>(0);
    const progressIntervalRef = useRef<number | null>(null);
    
    useEffect(() => {
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
        
        // Set an interval to change the message every 4 seconds (faster than before)
        const intervalId = setInterval(updateMessage, 4000);
        
        // Clean up on unmount
        return () => {
            clearInterval(intervalId);
            if (progressIntervalRef.current) {
                window.clearInterval(progressIntervalRef.current);
            }
        };
    }, [loadingMessages.length, messageIndex]);
    
    return (
        <div className={styles['prognostic-ai-demo-results-container']}>
            <div className={styles['pai-dr-header']}>
                <span className={styles['pai-dr-logo-pulse']}></span>
                Clients.ai Quantum Analysis
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
                    {/* Left Column */}
                    <div className={styles['pai-dr-column']} data-column="left">
                        {/* Revenue Module */}
                        <div className={styles['pai-dr-data-module']} data-module="revenue">
                            <div className={styles['pai-dr-chart-header']}>Revenue Optimization</div>
                            <div className={styles['pai-dr-activity-indicator']}></div>
                            <div className={styles['pai-dr-bar-chart']}>
                                <div className={styles['pai-dr-bar']} data-value="75%"></div>
                                <div className={styles['pai-dr-bar']} data-value="45%"></div>
                                <div className={styles['pai-dr-bar']} data-value="60%"></div>
                                <div className={styles['pai-dr-bar']} data-value="85%"></div>
                                <div className={styles['pai-dr-bar']} data-value="40%"></div>
                            </div>
                        
                        {/* Sentiment Module */}
                        <div className={styles['pai-dr-data-module']} data-module="sentiment">
                            <div className={styles['pai-dr-chart-header']}>Sentiment Analysis</div>
                            <div className={styles['pai-dr-activity-indicator']}></div>
                            <div className={styles['pai-dr-pie-chart-container']}>
                                <div className={styles['pai-dr-pie-chart']}>
                                    <div className={styles['pai-dr-pie-segment']} data-segment="1"></div>
                                    <div className={styles['pai-dr-pie-segment']} data-segment="2"></div>
                                    <div className={styles['pai-dr-pie-segment']} data-segment="3"></div>
                                </div>
                                <div className={styles['pai-dr-pie-data-points']}>
                                    <div className={styles['pai-dr-pie-label']} data-label="a">Pos: 68%</div>
                                    <div className={styles['pai-dr-pie-label']} data-label="b">Neu: 22%</div>
                                    <div className={styles['pai-dr-pie-label']} data-label="c">Neg: 10%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Numerical data connections and background effects */}
                    <div className={styles['pai-dr-data-connections']}>
                        <div className={styles['pai-dr-connection']} data-connection="1"></div>
                        <div className={styles['pai-dr-connection']} data-connection="2"></div>
                        <div className={styles['pai-dr-connection']} data-connection="3"></div>
                        <div className={styles['pai-dr-connection']} data-connection="4"></div>
                        <div className={styles['pai-dr-connection']} data-connection="5"></div>
                        <div className={styles['pai-dr-connection']} data-connection="6"></div>
                    </div>
                    
                    {/* Data points floating across the visualization */}
                    <div className={styles['pai-dr-floating-data']}>
                        <span data-value="customers">12.3k</span>
                        <span data-value="growth">+18%</span>
                        <span data-value="revenue">$1.7M</span>
                        <span data-value="cac">$42</span>
                        <span data-value="retention">78%</span>
                        <span data-value="ltv">$840</span>
                    </div>
                    
                    {/* Background grid for premium effect */}
                    <div className={styles['pai-dr-grid']}></div>
                    
                    {/* Visual pulses to indicate data processing */}
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

export default LoadingIndicator;            <div className={styles['pai-dr-data-points']}>
                                <span>$1.2M</span>
                                <span>$890K</span>
                                <span>$2.4M</span>
                            </div>
                        </div>
                        
                        {/* Opportunity Module */}
                        <div className={styles['pai-dr-data-module']} data-module="opportunity">
                            <div className={styles['pai-dr-chart-header']}>Opportunity Mapping</div>
                            <div className={styles['pai-dr-activity-indicator']}></div>
                            <div className={styles['pai-dr-brain-waves']}>
                                <div className={styles['pai-dr-wave']}></div>
                                <div className={styles['pai-dr-wave']}></div>
                                <div className={styles['pai-dr-wave']}></div>
                                <div className={styles['pai-dr-wave']}></div>
                            </div>
                            <div className={styles['pai-dr-data-points']}>
                                <span>43%</span>
                                <span>72%</span>
                                <span>65%</span>
                            </div>
                        </div>
                        
                        {/* Conversion Module */}
                        <div className={styles['pai-dr-data-module']} data-module="conversion">
                            <div className={styles['pai-dr-chart-header']}>Conversion Optimization</div>
                            <div className={styles['pai-dr-activity-indicator']}></div>
                            <div className={styles['pai-dr-bar-chart']}>
                                <div className={styles['pai-dr-bar']} data-value="55%"></div>
                                <div className={styles['pai-dr-bar']} data-value="70%"></div>
                                <div className={styles['pai-dr-bar']} data-value="45%"></div>
                                <div className={styles['pai-dr-bar']} data-value="65%"></div>
                                <div className={styles['pai-dr-bar']} data-value="80%"></div>
                            </div>
                            <div className={styles['pai-dr-data-points']}>
                                <span>3.2%</span>
                                <span>5.1%</span>
                                <span>7.4%</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Center Column */}
                    <div className={styles['pai-dr-column']} data-column="center">
                        {/* Market Fit Module */}
                        <div className={styles['pai-dr-data-module']} data-module="market-fit">
                            <div className={styles['pai-dr-chart-header']}>Market Fit Analysis</div>
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
                                <span>87%</span>
                                <span>62%</span>
                                <span>91%</span>
                            </div>
                        </div>
                        
                        {/* Growth Module */}
                        <div className={styles['pai-dr-data-module']} data-module="growth">
                            <div className={styles['pai-dr-chart-header']}>Growth Segments</div>
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
                        
                        {/* Strategy Module */}
                        <div className={styles['pai-dr-data-module']} data-module="strategy">
                            <div className={styles['pai-dr-chart-header']}>Strategic Roadmap</div>
                            <div className={styles['pai-dr-activity-indicator']}></div>
                            <div className={styles['pai-dr-tree']}>
                                <div className={styles['pai-dr-tree-node']} data-node="root"></div>
                                <div className={styles['pai-dr-tree-branch']} data-branch="1"></div>
                                <div className={styles['pai-dr-tree-branch']} data-branch="2"></div>
                                <div className={styles['pai-dr-tree-node']} data-node="a"></div>
                                <div className={styles['pai-dr-tree-node']} data-node="b"></div>
                                <div className={styles['pai-dr-tree-branch']} data-branch="3"></div>
                                <div className={styles['pai-dr-tree-branch']} data-branch="4"></div>
                                <div className={styles['pai-dr-tree-node']} data-node="c"></div>
                                <div className={styles['pai-dr-tree-node']} data-node="d"></div>
                            </div>
                            <div className={styles['pai-dr-data-points']}>
                                <span>Q1-Q2</span>
                                <span>Q3-Q4</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className={styles['pai-dr-column']} data-column="right">
                        {/* Engagement Module */}
                        <div className={styles['pai-dr-data-module']} data-module="engagement">
                            <div className={styles['pai-dr-chart-header']}>Engagement Metrics</div>
                            <div className={styles['pai-dr-activity-indicator']}></div>
                            <div className={styles['pai-dr-line-chart']}>
                                <div className={styles['pai-dr-line']} data-line="main"></div>
                                <div className={styles['pai-dr-line-point']} data-point="start"></div>
                                <div className={styles['pai-dr-line-point']} data-point="mid1"></div>
                                <div className={styles['pai-dr-line-point']} data-point="mid2"></div>
                                <div className={styles['pai-dr-line-point']} data-point="end"></div>
                            </div>
                            <div className={styles['pai-dr-data-points']}>
                                <span>+24%</span>
                                <span>12.3m</span>
                                <span>8.7m</span>
                            </div>
                        </div>
                        
                        {/* Competitive Module */}
                        <div className={styles['pai-dr-data-module']} data-module="competition">
                            <div className={styles['pai-dr-chart-header']}>Competitive Analysis</div>
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
                                <span>You</span>
                                <span>Comp.</span>
                            </div>
                

export default LoadingIndicator;

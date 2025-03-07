import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    const loadingMessages = [
        "Thinking...",
        "Looking at your site...",
        "Finding immediate opportunities...",
        "Tailoring value...",
        "Identifying target markets...",
        "Running competitive analysis...",
        "Analyzing data patterns...",
        "Optimizing for immediate impact...",
        "Running market simulations...",
        "Crafting your success blueprint...",
        "Refining strategies...",
        "Mapping customer journeys...",
        "Identifying growth levers...",
        "Calculating ROI potential...",
        "Launching AI agents...",
        "Success! Processing...",
        "Success! Finalizing...",
        "Success! Integrating...",
        "Success! Validating...",
        "Success! Completing..."
    ];
    
    const [messageIndex, setMessageIndex] = useState<number>(0);
    const [fade, setFade] = useState<boolean>(true); // True for fade-in, false for fade-out
    
    useEffect(() => {
        const updateMessage = () => {
            setFade(false); // Start fade-out
            setTimeout(() => {
                // After fade-out completes, update the message and fade-in
                setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
                setFade(true); // Trigger fade-in
            }, 500); // Match the duration of the fade-out
        };
        
        // Set an interval to change the message every 8 seconds
        const intervalId = setInterval(updateMessage, 8000);
        
        // Clean up on unmount
        return () => clearInterval(intervalId);
    }, [loadingMessages.length]);
    
    return (
        <div className={styles['prognostic-ai-demo-results-container']}>
            <div className={styles['pai-dr-header']}>
                Clients.ai Quantum Analysis In Process
            </div>
            <div className={styles['pai-dr-content']}>
                <div className={styles['pai-dr-visualization']}>
                    {/* Bar chart visualization */}
                    <div className={styles['pai-dr-data-module']} style={{animation: 'data-module-from-left 1s forwards', animationDelay: '0.1s'}}>
                        <div className={styles['pai-dr-chart-header']}>Revenue Optimization</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{animation: 'randomized-bar-grow 3s infinite'}}></div>
                            <div className={styles['pai-dr-bar']} style={{animation: 'randomized-bar-grow 3s infinite', animationDelay: '0.3s'}}></div>
                            <div className={styles['pai-dr-bar']} style={{animation: 'randomized-bar-grow 3s infinite', animationDelay: '0.6s'}}></div>
                            <div className={styles['pai-dr-bar']} style={{animation: 'randomized-bar-grow 3s infinite', animationDelay: '0.9s'}}></div>
                            <div className={styles['pai-dr-bar']} style={{animation: 'randomized-bar-grow 3s infinite', animationDelay: '1.2s'}}></div>
                        </div>
                    </div>
                    
                    {/* Line chart visualization */}
                    <div className={styles['pai-dr-data-module']} style={{animation: 'data-module-from-top 1s forwards', animationDelay: '0.3s'}}>
                        <div className={styles['pai-dr-chart-header']}>Engagement Metrics</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '60%', left: '10%', animation: 'line-pulse 3.5s infinite'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '10%', animation: 'point-pulse 2s infinite'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '90%', animation: 'point-pulse 2s infinite', animationDelay: '1s'}}></div>
                        </div>
                    </div>
                    
                    {/* Radar chart visualization */}
                    <div className={styles['pai-dr-data-module']} style={{animation: 'data-module-from-right 1s forwards', animationDelay: '0.5s'}}>
                        <div className={styles['pai-dr-chart-header']}>Market Fit Analysis</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '10%', left: '50%', animation: 'radar-point-blink 2s infinite'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '85%', animation: 'radar-point-blink 2s infinite', animationDelay: '0.4s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '75%', animation: 'radar-point-blink 2s infinite', animationDelay: '0.8s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '25%', animation: 'radar-point-blink 2s infinite', animationDelay: '1.2s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '15%', animation: 'radar-point-blink 2s infinite', animationDelay: '1.6s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '10%', left: '50%', width: '35%', transform: 'rotate(45deg)', animation: 'radar-line-pulse 3s infinite'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '85%', width: '35%', transform: 'rotate(110deg)', animation: 'radar-line-pulse 3s infinite', animationDelay: '0.5s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '75%', width: '50%', transform: 'rotate(200deg)', animation: 'radar-line-pulse 3s infinite', animationDelay: '1s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '25%', width: '35%', transform: 'rotate(250deg)', animation: 'radar-line-pulse 3s infinite', animationDelay: '1.5s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '15%', width: '35%', transform: 'rotate(320deg)', animation: 'radar-line-pulse 3s infinite', animationDelay: '2s'}}></div>
                            <div className={styles['pai-dr-radar-shape']} style={{animation: 'radar-shape-morph 4s infinite'}}></div>
                        </div>
                    </div>
                    
                    {/* Brain wave visualization */}
                    <div className={styles['pai-dr-data-module']} style={{animation: 'data-module-from-left 1s forwards', animationDelay: '0.7s'}}>
                        <div className={styles['pai-dr-chart-header']}>Opportunity Mapping</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%', animation: 'wave-animate 2s infinite'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%', animation: 'wave-animate 2s infinite', animationDelay: '0.5s'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%', animation: 'wave-animate 2s infinite', animationDelay: '1s'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%', animation: 'wave-animate 2s infinite', animationDelay: '1.5s'}}></div>
                        </div>
                    </div>
                    
                    {/* Pie chart visualization */}
                    <div className={styles['pai-dr-data-module']} style={{animation: 'data-module-from-right 1s forwards', animationDelay: '0.9s'}}>
                        <div className={styles['pai-dr-chart-header']}>Growth Segments</div>
                        <div className={styles['pai-dr-pie-chart']} style={{width: '60px', height: '60px', margin: '10px auto'}}>
                            <div className={styles['pai-dr-pie-segment']} style={{animation: 'segment-pulse-1 3.2s infinite'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{animation: 'segment-pulse-2 2.8s infinite'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{animation: 'segment-pulse-3 3.5s infinite'}}></div>
                        </div>
                    </div>
                    
                    {/* Stat box visualization */}
                    <div className={styles['pai-dr-data-module']} style={{animation: 'data-module-from-top 1s forwards', animationDelay: '1.1s'}}>
                        <div className={styles['pai-dr-chart-header']}>Market Score</div>
                        <div className={styles['pai-dr-stat-box']}>
                            <span className={styles['pai-dr-stat-value']} data-v1="92" data-v2="86" data-v3="94" data-v4="89" style={{animation: 'stat-value-change 4s infinite'}}>92</span>
                            <span className={styles['pai-dr-stat-label']}>Performance Index</span>
                        </div>
                    </div>
                    
                    {/* Line chart - ROI visualization */}
                    <div className={styles['pai-dr-data-module']} style={{animation: 'data-module-from-bottom 1s forwards', animationDelay: '1.3s'}}>
                        <div className={styles['pai-dr-chart-header']}>ROI Projection</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '70%', left: '10%', animation: 'line-pulse 3.5s infinite', animationDelay: '0.5s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '70%', left: '10%', animation: 'point-pulse 2s infinite'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '40%', left: '90%', animation: 'point-pulse 2s infinite', animationDelay: '1s'}}></div>
                        </div>
                    </div>
                    
                    {/* Bar chart - channel performance */}
                    <div className={styles['pai-dr-data-module']} style={{animation: 'data-module-from-left 1s forwards', animationDelay: '1.5s'}}>
                        <div className={styles['pai-dr-chart-header']}>Channel Performance</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{animation: 'randomized-bar-grow 3s infinite', animationDelay: '0.2s'}}></div>
                            <div className={styles['pai-dr-bar']} style={{animation: 'randomized-bar-grow 3s infinite', animationDelay: '0.5s'}}></div>
                            <div className={styles['pai-dr-bar']} style={{animation: 'randomized-bar-grow 3s infinite', animationDelay: '0.8s'}}></div>
                            <div className={styles['pai-dr-bar']} style={{animation: 'randomized-bar-grow 3s infinite', animationDelay: '1.1s'}}></div>
                        </div>
                    </div>
                    
                    {/* Audience segments visualization */}
                    <div className={styles['pai-dr-data-module']} style={{animation: 'data-module-from-right 1s forwards', animationDelay: '1.7s'}}>
                        <div className={styles['pai-dr-chart-header']}>Audience Segments</div>
                        <div className={styles['pai-dr-pie-chart']} style={{width: '60px', height: '60px', margin: '10px auto'}}>
                            <div className={styles['pai-dr-pie-segment']} style={{animation: 'segment-pulse-1 3.2s infinite', animationDelay: '0.3s'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{animation: 'segment-pulse-2 2.8s infinite', animationDelay: '0.6s'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{animation: 'segment-pulse-3 3.5s infinite', animationDelay: '0.9s'}}></div>
                        </div>
                    </div>
                    
                    {/* Decision tree visualization */}
                    <div className={styles['pai-dr-data-module']} style={{animation: 'data-module-from-bottom 1s forwards', animationDelay: '1.9s'}}>
                        <div className={styles['pai-dr-chart-header']}>Strategic Roadmap</div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '10%', left: '50%', animation: 'tree-node-pulse 3s infinite'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '45%', width: '20%', transform: 'rotate(45deg)', animation: 'tree-branch-grow 3s infinite'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '55%', width: '20%', transform: 'rotate(135deg)', animation: 'tree-branch-grow 3s infinite', animationDelay: '0.5s'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '30%', animation: 'tree-node-pulse 3s infinite', animationDelay: '0.7s'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '70%', animation: 'tree-node-pulse 3s infinite', animationDelay: '1.0s'}}></div>
                            <div className={styles['pai-dr-tree-sub-node']} style={{top: '25%', left: '40%', animation: 'tree-sub-node-appear 2.5s infinite', animationDelay: '1.2s'}}></div>
                            <div className={styles['pai-dr-tree-sub-branch']} style={{top: '27%', left: '40%', width: '15%', transform: 'rotate(-30deg)', animation: 'tree-sub-branch-appear 2.5s infinite', animationDelay: '1.4s'}}></div>
                            <div className={styles['pai-dr-tree-sub-node']} style={{top: '20%', left: '65%', animation: 'tree-sub-node-appear 2.5s infinite', animationDelay: '1.6s'}}></div>
                            <div className={styles['pai-dr-tree-sub-branch']} style={{top: '22%', left: '65%', width: '12%', transform: 'rotate(45deg)', animation: 'tree-sub-branch-appear 2.5s infinite', animationDelay: '1.8s'}}></div>
                        </div>
                    </div>
                    
                    {/* Background grid */}
                    <div className={styles['pai-dr-grid']} style={{animation: 'grid-pulse 5s infinite'}}></div>
                </div>
                
                <div className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
                    {loadingMessages[messageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

export default LoadingIndicator;

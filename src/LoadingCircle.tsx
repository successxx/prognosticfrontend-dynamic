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
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Revenue Optimization</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '75%'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '60%'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                        </div>
                    </div>
                    
                    {/* Line chart visualization */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Engagement Metrics</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '60%', left: '10%', width: '80%', transform: 'rotate(-10deg)'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '90%'}}></div>
                        </div>
                    </div>
                    
                    {/* Radar chart visualization */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Market Fit Analysis</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '85%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '75%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '25%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '15%'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '10%', left: '50%', width: '35%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '85%', width: '35%', transform: 'rotate(110deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '75%', width: '50%', transform: 'rotate(200deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '25%', width: '35%', transform: 'rotate(250deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '15%', width: '35%', transform: 'rotate(320deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* Brain wave visualization */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Opportunity Mapping</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/* Pie chart visualization */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Growth Segments</div>
                        <div className={styles['pai-dr-pie-chart']} style={{width: '60px', height: '60px', margin: '10px auto'}}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(30deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)'}}></div>
                        </div>
                    </div>
                    
                    {/* Stat box visualization */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Market Score</div>
                        <div className={styles['pai-dr-stat-box']}>
                            <span className={styles['pai-dr-stat-value']} data-v1="92" data-v2="86" data-v3="94" data-v4="89">92</span>
                            <span className={styles['pai-dr-stat-label']}>Performance Index</span>
                        </div>
                    </div>
                    
                    {/* Line chart - ROI visualization */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>ROI Projection</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '70%', left: '10%', width: '80%', transform: 'rotate(-20deg)'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '70%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '40%', left: '90%'}}></div>
                        </div>
                    </div>
                    
                    {/* Bar chart - channel performance */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Channel Performance</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '65%'}} data-value="65%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '35%'}} data-value="35%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '80%'}} data-value="80%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '55%'}} data-value="55%"></div>
                        </div>
                    </div>
                    
                    {/* Audience segments visualization */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Audience Segments</div>
                        <div className={styles['pai-dr-pie-chart']} style={{width: '60px', height: '60px', margin: '10px auto'}}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(45deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(135deg) skew(60deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(240deg) skew(30deg)'}}></div>
                        </div>
                    </div>
                    
                    {/* Decision tree visualization */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Strategic Roadmap</div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '45%', width: '20%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '55%', width: '20%', transform: 'rotate(135deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '30%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '70%'}}></div>
                        </div>
                    </div>
                    
                    {/* Background grid */}
                    <div className={styles['pai-dr-grid']}></div>
                </div>
                
                <div className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
                    {loadingMessages[messageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

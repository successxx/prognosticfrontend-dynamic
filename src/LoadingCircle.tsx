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
                    {/* LEFT COLUMN */}
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
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Engagement Metrics</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '60%', left: '10%', width: '80%', transform: 'rotate(-10deg)'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '90%'}}></div>
                        </div>
                    </div>
                    
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
                            <div className={styles['pai-dr-radar-shape']} style={{top: '50%', left: '50%'}}></div>
                        </div>
                    </div>
                    
                    {/* MIDDLE-LEFT */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Opportunity Mapping</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Growth Segments</div>
                        <div className={styles['pai-dr-pie-chart']} style={{width: '60px', height: '60px', margin: '10px auto'}}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(30deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37, 37, 37, 0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37, 37, 37, 0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* CENTER COLUMN */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Strategic Roadmap</div>
                        <div className={styles['pai-dr-tree']}>
                            {/* Add more nodes/branches for more complexity */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '45%', width: '20%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '55%', width: '20%', transform: 'rotate(135deg)'}}></div>
                            
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '30%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '70%'}}></div>
                            
                            {/* Extra branches */}
                            <div className={styles['pai-dr-tree-branch']} style={{top: '20%', left: '30%', width: '15%', transform: 'rotate(-20deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '28%', left: '45%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '28%', left: '45%', width: '10%', transform: 'rotate(70deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '35%', left: '55%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Technical SEO Analysis</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '65%'}} data-value="65%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '35%'}} data-value="35%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '90%'}} data-value="90%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                        </div>
                    </div>
                    
                    {/* MIDDLE-RIGHT */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Conversion Funnel</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '30%', left: '5%', width: '90%', transform: 'rotate(0deg)'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '30%', left: '5%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '40%', left: '95%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>User Sentiment</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '20%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '50%', left: '85%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '70%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '30%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '50%', left: '15%'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '20%', left: '50%', width: '35%', transform: 'rotate(60deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '50%', left: '85%', width: '45%', transform: 'rotate(120deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '85%', left: '70%', width: '40%', transform: 'rotate(205deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '85%', left: '30%', width: '40%', transform: 'rotate(260deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '50%', left: '15%', width: '35%', transform: 'rotate(310deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']} style={{top: '50%', left: '50%'}}></div>
                        </div>
                    </div>
                    
                    {/* RIGHT COLUMN */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Sales Forecasting</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '15%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '35%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '55%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '75%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Advertising ROI</div>
                        <div className={styles['pai-dr-pie-chart']} style={{width: '60px', height: '60px', margin: '10px auto'}}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(40deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37, 37, 37, 0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37, 37, 37, 0.3)'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Competitive Benchmark</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '55%'}} data-value="55%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '30%'}} data-value="30%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '75%'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '60%'}} data-value="60%"></div>
                        </div>
                    </div>
                    
                    {/* BACKGROUND GRID */}
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

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
        
        // Set an interval to change the message every 5 seconds (faster than before)
        const intervalId = setInterval(updateMessage, 5000);
        
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
                    {/* Data modules - expanded to 13 modules for more comprehensive visualization */}
                    {/* Revenue Module */}
                    <div className={styles['pai-dr-data-module']} data-module="revenue">
                        <div className={styles['pai-dr-chart-header']}>Revenue Optimization</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '75%'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '60%'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                        </div>
                    </div>
                    
                    {/* Engagement Module */}
                    <div className={styles['pai-dr-data-module']} data-module="engagement">
                        <div className={styles['pai-dr-chart-header']}>Engagement Metrics</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '60%', left: '10%', width: '80%', transform: 'rotate(-10deg)'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '90%'}}></div>
                        </div>
                    </div>
                    
                    {/* Market Fit Module */}
                    <div className={styles['pai-dr-data-module']} data-module="market-fit">
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
                    
                    {/* Opportunity Module */}
                    <div className={styles['pai-dr-data-module']} data-module="opportunity">
                        <div className={styles['pai-dr-chart-header']}>Opportunity Mapping</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/* Growth Module */}
                    <div className={styles['pai-dr-data-module']} data-module="growth">
                        <div className={styles['pai-dr-chart-header']}>Growth Segments</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(30deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37, 37, 37, 0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37, 37, 37, 0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* Strategy Module */}
                    <div className={styles['pai-dr-data-module']} data-module="strategy">
                        <div className={styles['pai-dr-chart-header']}>Strategic Roadmap</div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '45%', width: '20%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '55%', width: '20%', transform: 'rotate(135deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '30%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '70%'}}></div>
                        </div>
                    </div>
                    
                    {/* Conversion Module - New */}
                    <div className={styles['pai-dr-data-module']} data-module="conversion">
                        <div className={styles['pai-dr-chart-header']}>Conversion Optimization</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '55%'}} data-value="55%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '70%'}} data-value="70%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '65%'}} data-value="65%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '80%'}} data-value="80%"></div>
                        </div>
                    </div>
                    
                    {/* Customer Module - New */}
                    <div className={styles['pai-dr-data-module']} data-module="customer">
                        <div className={styles['pai-dr-chart-header']}>Customer Acquisition</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '40%', left: '10%', width: '80%', transform: 'rotate(-5deg)'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '40%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '35%', left: '90%'}}></div>
                        </div>
                    </div>
                    
                    {/* Competitive Module - New */}
                    <div className={styles['pai-dr-data-module']} data-module="competition">
                        <div className={styles['pai-dr-chart-header']}>Competitive Analysis</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '20%', left: '40%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '25%', left: '75%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '70%', left: '85%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '75%', left: '35%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '45%', left: '25%'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '20%', left: '40%', width: '35%', transform: 'rotate(35deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '25%', left: '75%', width: '35%', transform: 'rotate(100deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '70%', left: '85%', width: '50%', transform: 'rotate(210deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '75%', left: '35%', width: '35%', transform: 'rotate(260deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '45%', left: '25%', width: '35%', transform: 'rotate(330deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']} style={{top: '50%', left: '50%'}}></div>
                        </div>
                    </div>
                    
                    {/* Retention Module - New */}
                    <div className={styles['pai-dr-data-module']} data-module="retention">
                        <div className={styles['pai-dr-chart-header']}>Customer Retention</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '90%'}} data-value="90%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '75%'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '60%'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '35%'}} data-value="35%"></div>
                        </div>
                    </div>
                    
                    {/* Sentiment Module - New */}
                    <div className={styles['pai-dr-data-module']} data-module="sentiment">
                        <div className={styles['pai-dr-chart-header']}>Sentiment Analysis</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(20deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(100deg) skew(40deg)', background: 'rgba(37, 37, 37, 0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(200deg) skew(70deg)', background: 'rgba(37, 37, 37, 0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* Innovation Module - New */}
                    <div className={styles['pai-dr-data-module']} data-module="innovation">
                        <div className={styles['pai-dr-chart-header']}>Innovation Score</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '25%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '45%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '65%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '85%'}}></div>
                        </div>
                    </div>
                    
                    {/* Background grid for futuristic effect */}
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

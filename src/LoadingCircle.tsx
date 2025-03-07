import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    const loadingMessages = [
        "Thinking...",
        "Looking at your site...",
        "Finding immediate opportunities...",
        "Tailoring value...",
        "Identifying your target audience...",
        "Split-testing potential setbacks...",
        "Analyzing test results...",
        "Refining for immediate impact...",
        "Running new A/B tests based on synthesized results...",
        "Crafting your blueprint for maximum success...",
        "Refining...",
        "Success! Processing...",
        "Success! Finalizing...",
        "Success! Integrating...",
        "Success! Validating...",
        "Success! Completing..."
    ];
    
    const [messageIndex, setMessageIndex] = useState<number>(0);
    const [fade, setFade] = useState<boolean>(true); // True for fade-in, false for fade-out
    
    // Check if the message includes "Success!" to apply special styling
    const isSuccess = loadingMessages[messageIndex].includes("Success!");
    
    useEffect(() => {
        const updateMessage = () => {
            setFade(false); // Start fade-out
            setTimeout(() => {
                // After fade-out completes, update the message and fade-in
                setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
                setFade(true); // Trigger fade-in
            }, 500); // Match the duration of the fade-out
        };
        
        // Set an interval to change the message every 5 seconds
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
                {/* Futuristic data visualization with charts and graphs */}
                <div className={styles['pai-dr-visualization']}>
                    {/* Central core analyzer */}
                    <div className={styles['pai-dr-core']}></div>
                    
                    {/* Bar chart module - top left */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Conversion Rate</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '75%', animationDelay: '0.8s'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%', animationDelay: '1.2s'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '60%', animationDelay: '1.6s'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%', animationDelay: '2.0s'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%', animationDelay: '2.4s'}} data-value="40%"></div>
                        </div>
                    </div>
                    
                    {/* Line chart module - bottom left */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Engagement Trends</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '70%', left: '10%', width: '80%', transform: 'rotate(-15deg)', animationDelay: '2.8s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '70%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '90%'}}></div>
                        </div>
                    </div>
                    
                    {/* Stat box module - middle left */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-stat-box']}>
                            <span className={styles['pai-dr-stat-value']} data-value="87" data-min="42">87</span>
                            <span className={styles['pai-dr-stat-label']}>Performance Score</span>
                        </div>
                    </div>
                    
                    {/* Pie chart module - bottom left */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Market Segments</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(40deg)', animationDelay: '7.0s'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(140deg) skew(60deg)', background: 'rgba(37, 37, 37, 0.6)', animationDelay: '7.5s'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(260deg) skew(70deg)', background: 'rgba(37, 37, 37, 0.3)', animationDelay: '8.0s'}}></div>
                        </div>
                    </div>
                    
                    {/* Bar chart 2 module - top right */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Cost Analysis</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '65%', animationDelay: '2.0s'}} data-value="65%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '35%', animationDelay: '2.4s'}} data-value="35%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '80%', animationDelay: '2.8s'}} data-value="80%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '55%', animationDelay: '3.2s'}} data-value="55%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '70%', animationDelay: '3.6s'}} data-value="70%"></div>
                        </div>
                    </div>
                    
                    {/* Line chart 2 module - middle right */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Traffic Sources</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '30%', left: '10%', width: '80%', transform: 'rotate(25deg)', animationDelay: '4.0s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '30%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '90%'}}></div>
                        </div>
                    </div>
                    
                    {/* Stat box 2 module - middle right */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-stat-box']}>
                            <span className={styles['pai-dr-stat-value']} data-value="93" data-min="51">93</span>
                            <span className={styles['pai-dr-stat-label']}>Optimization Score</span>
                        </div>
                    </div>
                    
                    {/* Pie chart 2 module - bottom right */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Revenue Distribution</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(30deg)', animationDelay: '8.5s'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37, 37, 37, 0.6)', animationDelay: '9.0s'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37, 37, 37, 0.3)', animationDelay: '9.5s'}}></div>
                        </div>
                    </div>
                    
                    {/* Connection lines between modules and core */}
                    <div className={styles['pai-dr-connection']}></div>
                    <div className={styles['pai-dr-connection']}></div>
                    <div className={styles['pai-dr-connection']}></div>
                    <div className={styles['pai-dr-connection']}></div>
                    <div className={styles['pai-dr-connection']}></div>
                    <div className={styles['pai-dr-connection']}></div>
                    <div className={styles['pai-dr-connection']}></div>
                    <div className={styles['pai-dr-connection']}></div>
                    
                    {/* Background grid */}
                    <div className={styles['pai-dr-grid']}></div>
                </div>
                
                {/* Message with fade transition */}
                <div 
                    className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']} ${isSuccess ? styles['success'] : ''}`}
                >
                    {loadingMessages[messageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

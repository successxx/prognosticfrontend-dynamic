import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    // Messages that fade in/out every 8 seconds
    const loadingMessages = [
        "Thinking...",
        "Analyzing your parameters...",
        "Gathering advanced insights...",
        "Projecting key growth areas...",
        "Running synergy calculations...",
        "Building strategic blueprint...",
        "Pinpointing opportunities...",
        "Evaluating potential ROI...",
        "Conducting deep site audit...",
        "Refining advanced tactics...",
        "Simulating user funnels...",
        "Deriving final metrics...",
        "Success! Processing data...",
        "Success! Finalizing details...",
        "Success! Integrating findings...",
        "Success! Validating approach..."
    ];
    
    const [messageIndex, setMessageIndex] = useState<number>(0);
    const [fade, setFade] = useState<boolean>(true);
    
    useEffect(() => {
        const updateMessage = () => {
            setFade(false);
            setTimeout(() => {
                setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
                setFade(true);
            }, 500);
        };
        
        const intervalId = setInterval(updateMessage, 8000);
        return () => clearInterval(intervalId);
    }, [loadingMessages.length]);
    
    return (
        <div className={styles['prognostic-ai-demo-results-container']}>
            
            <div className={styles['pai-dr-header']}>
                Clients.ai Quantum Analysis In Process
            </div>
            
            <div className={styles['pai-dr-content']}>
                <div className={styles['pai-dr-visualization']}>
                    
                    {/*
                      6 "primary" modules in 2 columns × 3 rows
                      Then 6 "stacking" modules with partial offsets & bigger delays
                      Each has a 200s infinite animation inside to appear like constant calculations.
                      They fly in slower (~1.2s), remain on screen, do not vanish.
                    */}
                    
                    {/* 1) Bar Chart (Col1, Row1) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            1) Revenue Potential
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '65%'}} data-value="65%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '80%'}} data-value="80%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '30%'}} data-value="30%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '90%'}} data-value="90%"></div>
                        </div>
                    </div>
                    
                    {/* 2) Radar (Col2, Row1) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>2) Market Fit</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '85%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '75%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '25%'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '10%', left: '50%', width: '40%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '85%', width: '40%', transform: 'rotate(110deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* 3) Thinking Tree (Col1, Row2) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>3) Strategic Roadmap</div>
                        <div className={styles['pai-dr-tree']}>
                            {/* Some branches */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '12%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '17%', left: '47%', width: '25%', transform: 'rotate(40deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '35%', left: '30%'}}></div>
                        </div>
                    </div>
                    
                    {/* 4) Pie Chart (Col2, Row2) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>4) Growth Segments</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 5) Brain Waves (Col1, Row3) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>5) Opportunity Mapping</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '15%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '35%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '55%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '75%'}}></div>
                        </div>
                    </div>
                    
                    {/* 6) Line Chart (Col2, Row3) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>6) Conversion Funnel</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '50%', left: '5%', width: '80%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '5%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '85%'}}></div>
                        </div>
                    </div>
                    
                    {/*
                      6 "stacking" modules (#7..#12) for partial offsets, each from left/right with bigger delays.
                      All with 200s internal animations so they appear to “compute” continuously.
                    */}
                    
                    {/* 7) Extra Calc: Seasonal (Bar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>7) Extra Calc: Seasonal Patterns</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '60%'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '75%'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                        </div>
                    </div>
                    
                    {/* 8) Extra Calc: Competitive Radar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>8) Extra Calc: Competitive Radar</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '45%', left: '85%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '75%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '25%'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* 9) Extra Calc: ROI (Pie) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>9) Extra Calc: ROI Breakdown</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 10) Extra Calc: SubTree */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>10) Extra Calc: Sub-Branch Tree</div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '12%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '18%', left: '46%', width: '30%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '35%', left: '30%'}}></div>
                        </div>
                    </div>
                    
                    {/* 11) Extra Calc: Brain Waves #2 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>11) Extra Calc: Brain Waves 2</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/* 12) Extra Calc: Futuristic Lines */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>12) Extra Calc: Futuristic Lines</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '50%', left: '5%', width: '80%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '5%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '85%'}}></div>
                        </div>
                    </div>
                    
                    {/* Background grid for subtle effect */}
                    <div className={styles['pai-dr-grid']}></div>
                </div>
                
                {/* Fade in/out messages */}
                <div className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
                    {loadingMessages[messageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

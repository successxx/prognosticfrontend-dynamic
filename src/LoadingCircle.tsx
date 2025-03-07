import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    // Fade-in/fade-out messages every 8s
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
                      We have 6 "primary" modules in a 2 columns × 3 rows arrangement,
                      then additional "stacking" modules that appear afterward in an orderly offset,
                      each with slower timing (~1.2s) so it's not overwhelming.
                      
                      Column1 (Left) => modules from left
                      Column2 (Right) => modules from right
                      Rows => ~10%, ~40%, ~70% top positions
                      Container => golden ratio ~1500px wide × ~928px tall
                      All modules have 200s internal animations so they appear to be "calculating."
                    */}

                    {/* ================ 6 PRIMARY MODULES (2 COLUMNS × 3 ROWS) ================ */}
                    
                    {/* 1) Bar Chart – Column1, Row1 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>1) Revenue Potential</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '70%'}} data-value="70%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '80%'}} data-value="80%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '95%'}} data-value="95%"></div>
                        </div>
                    </div>
                    
                    {/* 2) Radar Chart – Column2, Row1 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>2) Market Fit Analysis</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '5%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '90%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '75%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '25%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '10%'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '5%', left: '50%', width: '40%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '35%', left: '90%', width: '40%', transform: 'rotate(110deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '80%', left: '75%', width: '55%', transform: 'rotate(200deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '80%', left: '25%', width: '40%', transform: 'rotate(250deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '35%', left: '10%', width: '40%', transform: 'rotate(320deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* 3) Thinking Tree – Column1, Row2 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>3) Strategic Roadmap</div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '46%', width: '30%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '54%', width: '30%', transform: 'rotate(135deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '35%', left: '30%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '35%', left: '70%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '20%', left: '28%', width: '25%', transform: 'rotate(-15deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '28%', left: '45%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '28%', left: '45%', width: '15%', transform: 'rotate(75deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '33%', left: '60%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '33%', left: '60%', width: '20%', transform: 'rotate(100deg)'}}></div>
                        </div>
                    </div>
                    
                    {/* 4) Line Chart – Column2, Row2 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>4) Conversion Funnel</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '55%', left: '5%', width: '80%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '5%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '85%'}}></div>
                        </div>
                    </div>
                    
                    {/* 5) Brain Waves – Column1, Row3 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>5) Opportunity Mapping</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '15%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '35%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '55%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '75%'}}></div>
                        </div>
                    </div>
                    
                    {/* 6) Pie Chart – Column2, Row3 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>6) Growth Segments</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div className={styles['pai-dr-pie-segment']}
                                 style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']}
                                 style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/*
                      We have 6 main modules above. Next we add multiple "stacking" modules.
                      Let's do 12 more for a total of 18. Each partially offset, each with bigger delay, 
                      flying in from left or right depending on the column.
                    */}
                    
                    {/* 7) Extra calc: ROI Analysis (Bar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>7) Extra Calc: ROI Analysis</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '65%'}} data-value="65%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '90%'}} data-value="90%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                        </div>
                    </div>
                    
                    {/* 8) Extra calc: Competitor Benchmark (Radar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>8) Extra Calc: Competitor Benchmark</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '40%', left: '90%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '75%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '25%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '40%', left: '10%'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '10%', left: '50%', width: '40%', transform: 'rotate(60deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '40%', left: '90%', width: '40%', transform: 'rotate(120deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '85%', left: '75%', width: '55%', transform: 'rotate(200deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '85%', left: '25%', width: '40%', transform: 'rotate(250deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '40%', left: '10%', width: '40%', transform: 'rotate(320deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* 9) Extra calc: Seasonal Patterns (Line) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>9) Extra Calc: Seasonal Patterns</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '50%', left: '5%', width: '80%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '5%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '85%'}}></div>
                        </div>
                    </div>
                    
                    {/* 10) Extra calc: Future Forecast (Brain Waves) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>10) Extra Calc: Future Forecast</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/* 11) Extra calc: Demographic Pie */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>11) Extra Calc: Demographic Spread</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div className={styles['pai-dr-pie-segment']}
                                 style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']}
                                 style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 12) Extra calc: Advanced Tree */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>12) Extra Calc: Advanced Tree</div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '14%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '19%', left: '47%', width: '25%', transform: 'rotate(38deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '19%', left: '53%', width: '25%', transform: 'rotate(142deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '28%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '72%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '24%', left: '25%', width: '30%', transform: 'rotate(-10deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '31%', left: '42%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '31%', left: '42%', width: '17%', transform: 'rotate(78deg)'}}></div>
                        </div>
                    </div>
                    
                    {/* 13) Extra calc: Niche Radar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>13) Extra Calc: Niche Radar</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '15%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '45%', left: '90%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '75%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '25%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '45%', left: '10%'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '15%', left: '50%', width: '40%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '45%', left: '90%', width: '40%', transform: 'rotate(110deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '85%', left: '75%', width: '55%', transform: 'rotate(200deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '85%', left: '25%', width: '40%', transform: 'rotate(250deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '45%', left: '10%', width: '40%', transform: 'rotate(320deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* 14) Extra calc: Future Brain Waves */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>14) Extra Calc: Future Brain Waves</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/* 15) Extra calc: Multi-Pie */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>15) Extra Calc: Multi-Pie Analysis</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div className={styles['pai-dr-pie-segment']}
                                 style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']}
                                 style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 16) Extra calc: Forecast Tree */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>16) Extra Calc: Forecast Tree</div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '14%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '20%', left: '46%', width: '30%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '20%', left: '54%', width: '30%', transform: 'rotate(135deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '30%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '70%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '26%', left: '28%', width: '25%', transform: 'rotate(-15deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '33%', left: '45%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '33%', left: '45%', width: '15%', transform: 'rotate(75deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '35%', left: '60%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '35%', left: '60%', width: '20%', transform: 'rotate(100deg)'}}></div>
                        </div>
                    </div>
                    
                    {/* 17) Extra calc: Final Radar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>17) Extra Calc: Final Radar</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '15%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '45%', left: '90%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '75%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '25%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '45%', left: '10%'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '15%', left: '50%', width: '40%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '45%', left: '90%', width: '40%', transform: 'rotate(110deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '80%', left: '75%', width: '55%', transform: 'rotate(200deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '85%', left: '25%', width: '40%', transform: 'rotate(250deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '45%', left: '10%', width: '40%', transform: 'rotate(320deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* 18) Extra calc: Predictive Bar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>18) Extra Calc: Predictive Index</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '62%'}} data-value="62%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '48%'}} data-value="48%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '92%'}} data-value="92%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '73%'}} data-value="73%"></div>
                        </div>
                    </div>
                    
                    {/* Futuristic grid background */}
                    <div className={styles['pai-dr-grid']}></div>
                </div>
                
                {/* Fade-in/fade-out message area */}
                <div className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
                    {loadingMessages[messageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    // Messages that cycle every 8s with fade in/out
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
                      TOTAL: 24 Modules.
                      
                      1) The first 8 are arranged in 2 columns × 4 rows.
                         They appear first, neatly centered.
                      2) The remaining 16 appear afterward with partial offsets,
                         layering on top in an orderly, tasteful offset.
                      3) Each module has internal 200s animations for continuous "calculations."
                    */}
                    
                    {/* ---------- 8 PRIMARY MODULES (2C x 4R) ---------- */}
                    
                    {/* 1: (Column1, Row1) => Bar Chart */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            1) Revenue Opportunity
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '70%'}} data-value="70%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '80%'}} data-value="80%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '95%'}} data-value="95%"></div>
                        </div>
                    </div>
                    
                    {/* 2: (Column2, Row1) => Line Chart */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            2) Engagement Metrics
                        </div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '50%', left: '10%', width: '70%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/* 3: (Column1, Row2) => Pie Chart */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            3) Growth Segments
                        </div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div className={styles['pai-dr-pie-segment']}
                                 style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']}
                                 style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 4: (Column2, Row2) => Radar Chart */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            4) Market Fit Analysis
                        </div>
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
                    
                    {/* 5: (Column1, Row3) => Big Thinking Tree */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            5) Strategic Roadmap
                        </div>
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
                    
                    {/* 6: (Column2, Row3) => Brain Waves */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            6) Opportunity Mapping
                        </div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '15%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '35%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '55%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '75%'}}></div>
                        </div>
                    </div>
                    
                    {/* 7: (Column1, Row4) => Another line or bar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>7) Conversion Funnel</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '55%', left: '5%', width: '80%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '5%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '85%'}}></div>
                        </div>
                    </div>
                    
                    {/* 8: (Column2, Row4) => Another Radar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            8) User Sentiment
                        </div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '40%', left: '90%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '80%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '20%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '40%', left: '5%'}}></div>
                            
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '10%', left: '50%', width: '40%', transform: 'rotate(60deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '40%', left: '90%', width: '40%', transform: 'rotate(110deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '80%', left: '80%', width: '55%', transform: 'rotate(200deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '85%', left: '20%', width: '40%', transform: 'rotate(250deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']}
                                 style={{top: '40%', left: '5%', width: '40%', transform: 'rotate(320deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/*
                      Now the REMAINING 16 modules (#9..#24 in code).
                      We'll example two or three specifically; 
                      you can replicate for all up to 24, each with a distinct label and partial offset.
                    */}
                    
                    {/* 9 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            9) Extra Calc: ROI Deep-Dive
                        </div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div className={styles['pai-dr-pie-segment']}
                                 style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']}
                                 style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 10 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            10) Extra Calc: Profit Margins
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '60%'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '75%'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                        </div>
                    </div>
                    
                    {/*
                      Repeat similarly for 11..24 with partial offset positions,
                      each with unique chart types or variations (bars, lines, pies, radar, tree, waves).
                      Maintaining the 200s infinite animations.
                    */}
                    
                    {/* ... modules 11..24 go here ... */}
                    
                    {/* Grid for the background */}
                    <div className={styles['pai-dr-grid']}></div>
                </div>
                
                {/* Fade messages */}
                <div className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
                    {loadingMessages[messageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

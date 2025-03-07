import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    // Fade-in/fade-out text messages every 8s
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
                      24 Modules total:
                      - First 12 in a 4×3 grid
                      - Next 12 "overlapping" (partial offsets) to show stacking
                      - Each labeled and each with bigger internal animations
                    */}
                    
                    {/* 1 of 24 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            1) Revenue Opportunity
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '72%'}} data-value="72%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '95%'}} data-value="95%"></div>
                        </div>
                    </div>
                    
                    {/* 2 of 24 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            2) Engagement Metrics
                        </div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '55%', left: '10%', width: '70%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/* 3 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            3) Growth Segments
                        </div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div
                                className={styles['pai-dr-pie-segment']}
                                style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}
                            ></div>
                            <div
                                className={styles['pai-dr-pie-segment']}
                                style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}
                            ></div>
                        </div>
                    </div>
                    
                    {/* 4 */}
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
                            <div className={styles['pai-dr-radar-line']} style={{top: '5%', left: '50%', width: '40%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '90%', width: '40%', transform: 'rotate(110deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '75%', width: '55%', transform: 'rotate(200deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '25%', width: '40%', transform: 'rotate(250deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '10%', width: '40%', transform: 'rotate(320deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* 5: Spider-like thinking tree */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            5) Strategic Roadmap
                        </div>
                        <div className={styles['pai-dr-tree']}>
                            {/* Many branches/nodes for massive complexity */}
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
                            
                            {/* Additional expansions */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '50%', left: '20%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '40%', left: '20%', width: '25%', transform: 'rotate(20deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '45%', left: '35%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '45%', left: '35%', width: '22%', transform: 'rotate(85deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '55%', left: '50%'}}></div>
                        </div>
                    </div>
                    
                    {/* 6: Brain Waves */}
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
                    
                    {/* 7: Competitive Benchmark (Bar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            7) Competitive Benchmark
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '70%'}} data-value="70%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '30%'}} data-value="30%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '65%'}} data-value="65%"></div>
                        </div>
                    </div>
                    
                    {/* 8: Conversion Funnel (Line) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            8) Conversion Funnel
                        </div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '45%', left: '10%', width: '75%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '45%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '85%'}}></div>
                        </div>
                    </div>
                    
                    {/* 9: Advertising ROI (Pie) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            9) Advertising ROI
                        </div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div
                                className={styles['pai-dr-pie-segment']}
                                style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}
                            ></div>
                            <div
                                className={styles['pai-dr-pie-segment']}
                                style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}
                            ></div>
                        </div>
                    </div>
                    
                    {/* 10: User Sentiment (Radar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            10) User Sentiment
                        </div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '40%', left: '90%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '80%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '20%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '40%', left: '5%'}}></div>
                            
                            <div className={styles['pai-dr-radar-line']} style={{top: '10%', left: '50%', width: '40%', transform: 'rotate(60deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '40%', left: '90%', width: '40%', transform: 'rotate(110deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '80%', width: '55%', transform: 'rotate(200deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '85%', left: '20%', width: '40%', transform: 'rotate(250deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '40%', left: '5%', width: '40%', transform: 'rotate(320deg)'}}></div>
                            
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* 11: Technical SEO (Thinking Tree) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            11) Technical SEO
                        </div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '15%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '20%', left: '48%', width: '20%', transform: 'rotate(40deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '20%', left: '52%', width: '20%', transform: 'rotate(140deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '30%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '70%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '26%', left: '35%', width: '30%', transform: 'rotate(-15deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '33%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '33%', left: '50%', width: '10%', transform: 'rotate(60deg)'}}></div>
                            {/* expansions */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '43%', left: '45%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '43%', left: '45%', width: '15%', transform: 'rotate(100deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '50%', left: '55%'}}></div>
                        </div>
                    </div>
                    
                    {/* 12: Sales Forecasting (Brain Waves) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            12) Sales Forecasting
                        </div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/*
                      Now the next 12 overlapping modules (#13..#24)
                      each with bigger delays, partial offset for stacking
                      Each "infinite" internal animation as well
                    */}
                    
                    {/* 13 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            13) Extra Calc: Profit Margins
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '60%'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '75%'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                        </div>
                    </div>
                    
                    {/* 14 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            14) Extra Calc: Demographics
                        </div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 15 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            15) Extra Calc: Behavioral Patterns
                        </div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '15%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '45%', left: '90%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '75%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '85%', left: '25%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '45%', left: '10%'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '15%', left: '50%', width: '40%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '45%', left: '90%', width: '40%', transform: 'rotate(110deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '85%', left: '75%', width: '55%', transform: 'rotate(200deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '85%', left: '25%', width: '40%', transform: 'rotate(250deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '45%', left: '10%', width: '40%', transform: 'rotate(320deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* 16 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            16) Extra Calc: Hyper Thought Tree
                        </div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '45%', width: '35%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '55%', width: '35%', transform: 'rotate(135deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '25%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '75%'}}></div>
                            
                            <div className={styles['pai-dr-tree-branch']} style={{top: '25%', left: '22%', width: '35%', transform: 'rotate(-15deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '30%', left: '40%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '30%', left: '40%', width: '15%', transform: 'rotate(75deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '34%', left: '55%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '34%', left: '55%', width: '20%', transform: 'rotate(110deg)'}}></div>
                            {/* deeper expansions */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '50%', left: '45%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '40%', left: '45%', width: '25%', transform: 'rotate(65deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '46%', left: '60%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '46%', left: '60%', width: '20%', transform: 'rotate(95deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '55%', left: '68%'}}></div>
                        </div>
                    </div>
                    
                    {/* 17 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            17) Extra Calc: Visionary Waves
                        </div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '15%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '35%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '55%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '75%'}}></div>
                        </div>
                    </div>
                    
                    {/* 18 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            18) Extra Calc: Seasonal Patterns
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '42%'}} data-value="42%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '78%'}} data-value="78%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '55%'}} data-value="55%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '90%'}} data-value="90%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '67%'}} data-value="67%"></div>
                        </div>
                    </div>
                    
                    {/* 19 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            19) Extra Calc: Traffic Velocity
                        </div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '50%', left: '5%', width: '80%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '5%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '85%'}}></div>
                        </div>
                    </div>
                    
                    {/* 20 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            20) Extra Calc: Referral Sources
                        </div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 21 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            21) Extra Calc: Niche Positioning
                        </div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '5%', left: '50%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '30%', left: '90%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '75%', left: '75%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '78%', left: '25%'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '30%', left: '10%'}}></div>
                            
                            <div className={styles['pai-dr-radar-line']} style={{top: '5%', left: '50%', width: '40%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '30%', left: '90%', width: '40%', transform: 'rotate(100deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '75%', left: '75%', width: '55%', transform: 'rotate(200deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '78%', left: '25%', width: '40%', transform: 'rotate(250deg)'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '30%', left: '10%', width: '40%', transform: 'rotate(320deg)'}}></div>
                            <div className={styles['pai-dr-radar-shape']}></div>
                        </div>
                    </div>
                    
                    {/* 22 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            22) Extra Calc: Spider Strategy
                        </div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '14%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '19%', left: '47%', width: '25%', transform: 'rotate(38deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '19%', left: '53%', width: '25%', transform: 'rotate(142deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '28%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '72%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '24%', left: '25%', width: '30%', transform: 'rotate(-10deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '31%', left: '42%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '31%', left: '42%', width: '17%', transform: 'rotate(78deg)'}}></div>
                            {/* expansions */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '46%', left: '58%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '46%', left: '58%', width: '22%', transform: 'rotate(102deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '60%', left: '65%'}}></div>
                        </div>
                    </div>
                    
                    {/* 23 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            23) Extra Calc: Neurolink Waves
                        </div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '15%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '35%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '55%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '75%'}}></div>
                        </div>
                    </div>
                    
                    {/* 24 */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            24) Extra Calc: Predictive Index
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '62%'}} data-value="62%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '48%'}} data-value="48%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '92%'}} data-value="92%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '73%'}} data-value="73%"></div>
                        </div>
                    </div>
                    
                    {/* Futuristic grid behind everything */}
                    <div className={styles['pai-dr-grid']}></div>
                </div>
                
                {/* Fade-in/fade-out message */}
                <div className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
                    {loadingMessages[messageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

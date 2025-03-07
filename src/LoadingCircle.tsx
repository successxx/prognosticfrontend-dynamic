import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
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
    const [fade, setFade] = useState<boolean>(true); // for fade-in/out of text
    
    useEffect(() => {
        const updateMessage = () => {
            setFade(false); // trigger fade-out
            setTimeout(() => {
                // after fade-out completes
                setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
                setFade(true); // fade-in next
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
                      We'll have 24 modules total:
                      12 "primary" in 3 columns × 4 rows,
                      plus 12 extra overlapping modules after a bigger delay.
                    */}
                    
                    {/* 1: Revenue Opportunity (Bar Chart) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            1. Revenue Opportunity
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '72%'}} data-value="72%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '95%'}} data-value="95%"></div>
                        </div>
                    </div>
                    
                    {/* 2: Engagement Metrics (Line Chart) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            2. Engagement Metrics
                        </div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '55%', left: '10%', width: '70%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/* 3: Growth Segments (Pie Chart) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            3. Growth Segments
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
                    
                    {/* 4: Market Fit (Radar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            4. Market Fit Analysis
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
                    
                    {/* 5: Strategic Roadmap (Big Thinking Tree) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            5. Strategic Roadmap
                        </div>
                        <div className={styles['pai-dr-tree']}>
                            {/* Many nodes & branches, spider-web style */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '46%', width: '30%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '54%', width: '30%', transform: 'rotate(135deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '35%', left: '30%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '35%', left: '70%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '20%', left: '28%', width: '25%', transform: 'rotate(-15deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '28%', left: '45%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '28%', left: '45%', width: '15%', transform: 'rotate(75deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '33%', left: '60%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '33%', left: '60%', width: '18%', transform: 'rotate(100deg)'}}></div>
                            {/* Additional branches, creating a real web */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '50%', left: '20%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '40%', left: '20%', width: '25%', transform: 'rotate(20deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '45%', left: '35%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '45%', left: '35%', width: '22%', transform: 'rotate(85deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '55%', left: '50%'}}></div>
                        </div>
                    </div>
                    
                    {/* 6: Opportunity Mapping (Brain Waves) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            6. Opportunity Mapping
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
                            7. Competitive Benchmark
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
                            8. Conversion Funnel
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
                            9. Advertising ROI
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
                            10. User Sentiment
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
                    
                    {/* 11: Technical SEO (Thinking Tree #2) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            11. Technical SEO
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
                            {/* More expansions */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '43%', left: '45%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '43%', left: '45%', width: '15%', transform: 'rotate(100deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '50%', left: '55%'}}></div>
                        </div>
                    </div>
                    
                    {/* 12: Sales Forecasting (Brain Waves #2) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            12. Sales Forecasting
                        </div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/* 
                      EXTRA 12 Overlapping Modules (#13 to #24)
                      Appear with bigger delays (like 3s+)
                      and partial offsets so they layer over
                      existing modules. Each labeled differently.
                    */}
                    
                    {/* 13: Extra Calculation (Bar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            13. Extra Calc: Profit Margins
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '60%'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '75%'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                        </div>
                    </div>
                    
                    {/* 14: Extra Calc (Pie) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            14. Extra Calc: Demographics
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
                    
                    {/* 15: Extra Calc (Radar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            15. Extra Calc: Behavioral Patterns
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
                    
                    {/* 16: Extra Calc (Thinking Tree) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            16. Extra Calc: Hyper Thought Tree
                        </div>
                        <div className={styles['pai-dr-tree']}>
                            {/* Even more branching */}
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
                            {/* Deeper expansions */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '50%', left: '45%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '40%', left: '45%', width: '25%', transform: 'rotate(65deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '46%', left: '60%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '46%', left: '60%', width: '20%', transform: 'rotate(95deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '55%', left: '68%'}}></div>
                        </div>
                    </div>
                    
                    {/* 17: Extra Calc (Brain Waves) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            17. Extra Calc: Visionary Waves
                        </div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '15%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '35%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '55%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '75%'}}></div>
                        </div>
                    </div>
                    
                    {/* 18: Extra Calc (Bar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            18. Extra Calc: Seasonal Patterns
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '42%'}} data-value="42%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '78%'}} data-value="78%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '55%'}} data-value="55%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '90%'}} data-value="90%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '67%'}} data-value="67%"></div>
                        </div>
                    </div>
                    
                    {/* 19: Extra Calc (Line) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            19. Extra Calc: Traffic Velocity
                        </div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '50%', left: '5%', width: '80%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '5%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '85%'}}></div>
                        </div>
                    </div>
                    
                    {/* 20: Extra Calc (Pie) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            20. Extra Calc: Referral Sources
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
                    
                    {/* 21: Extra Calc (Radar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            21. Extra Calc: Niche Positioning
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
                    
                    {/* 22: Extra Calc (Thinking Tree #3) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            22. Extra Calc: Spider Strategy
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
                            {/* More expansions */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '46%', left: '58%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '46%', left: '58%', width: '22%', transform: 'rotate(102deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '60%', left: '65%'}}></div>
                        </div>
                    </div>
                    
                    {/* 23: Extra Calc (Brain Waves #3) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            23. Extra Calc: Neurolink Waves
                        </div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '15%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '35%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '55%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '75%'}}></div>
                        </div>
                    </div>
                    
                    {/* 24: Extra Calc (Bar) */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>
                            24. Extra Calc: Predictive Index
                        </div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '62%'}} data-value="62%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '48%'}} data-value="48%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '92%'}} data-value="92%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '73%'}} data-value="73%"></div>
                        </div>
                    </div>
                    
                    {/* FUTURISTIC GRID */}
                    <div className={styles['pai-dr-grid']}></div>
                </div>
                
                {/* LOADING MESSAGE */}
                <div
                    className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}
                >
                    {loadingMessages[messageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

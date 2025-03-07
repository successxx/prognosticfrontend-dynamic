import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    // The messages that fade in/out every 8s
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
    const [fade, setFade] = useState<boolean>(true);
    
    useEffect(() => {
        const updateMessage = () => {
            setFade(false); // Start fade-out
            setTimeout(() => {
                // After fade-out completes, update the message and fade-in
                setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
                setFade(true);
            }, 500); // match fade-out duration
        };
        
        const intervalId = setInterval(updateMessage, 8000);
        return () => clearInterval(intervalId);
    }, [loadingMessages.length]);
    
    return (
        <div className={styles['prognostic-ai-demo-results-container']}>
            {/* HEADER */}
            <div className={styles['pai-dr-header']}>
                Clients.ai Quantum Analysis In Process
            </div>
            
            <div className={styles['pai-dr-content']}>
                <div className={styles['pai-dr-visualization']}>
                    
                    {/*
                      We have 12 main modules arranged in 3 columns x 4 rows,
                      plus 3 extra modules that appear after the first 12
                      to give an overlapping "more calculations" effect.
                    */}
                    
                    {/* 1 - Bar Chart */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Revenue Optimization</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '70%'}} data-value="70%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '55%'}} data-value="55%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '80%'}} data-value="80%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '35%'}} data-value="35%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '90%'}} data-value="90%"></div>
                        </div>
                    </div>
                    
                    {/* 2 - Line Chart */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Engagement Metrics</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '55%', left: '10%', width: '70%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '55%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/* 3 - Pie Chart */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Growth Segments</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(30deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 4 - Radar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Market Fit Analysis</div>
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
                            <div className={styles['pai-dr-radar-shape']} style={{top: '50%', left: '50%'}}></div>
                        </div>
                    </div>
                    
                    {/* 5 - Thinking Tree */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Strategic Roadmap</div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '12%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '18%', left: '47%', width: '25%', transform: 'rotate(40deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '18%', left: '53%', width: '25%', transform: 'rotate(140deg)'}}></div>
                            
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '35%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '65%'}}></div>
                            
                            <div className={styles['pai-dr-tree-branch']} style={{top: '25%', left: '30%', width: '35%', transform: 'rotate(-15deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '33%', left: '45%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '33%', left: '45%', width: '15%', transform: 'rotate(70deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '37%', left: '58%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '37%', left: '58%', width: '18%', transform: 'rotate(110deg)'}}></div>
                        </div>
                    </div>
                    
                    {/* 6 - Brain Waves */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Opportunity Mapping</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '15%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '35%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '55%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '75%'}}></div>
                        </div>
                    </div>
                    
                    {/* 7 - Another Bar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Competitive Benchmark</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '70%'}} data-value="70%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '30%'}} data-value="30%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '65%'}} data-value="65%"></div>
                        </div>
                    </div>
                    
                    {/* 8 - Another Line */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Conversion Funnel</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '45%', left: '10%', width: '75%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '45%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '85%'}}></div>
                        </div>
                    </div>
                    
                    {/* 9 - Another Pie */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Advertising ROI</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(30deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 10 - Another Radar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>User Sentiment</div>
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
                            
                            <div className={styles['pai-dr-radar-shape']} style={{top: '50%', left: '50%'}}></div>
                        </div>
                    </div>
                    
                    {/* 11 - Another Tree */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Technical SEO</div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '15%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '20%', left: '48%', width: '20%', transform: 'rotate(40deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '20%', left: '52%', width: '20%', transform: 'rotate(140deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '30%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '38%', left: '70%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '26%', left: '35%', width: '30%', transform: 'rotate(-15deg)'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '33%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '33%', left: '50%', width: '10%', transform: 'rotate(60deg)'}}></div>
                        </div>
                    </div>
                    
                    {/* 12 - Another Wave */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Sales Forecasting</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%'}}></div>
                        </div>
                    </div>
                    
                    {/*
                      Overlapping Modules (13,14,15)
                      Appear after a longer delay, partially offset
                      so you can see them layering on top of the existing modules,
                      reinforcing the sense of "extra calculations."
                    */}
                    
                    {/* 13 - Overlap Bar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Extra Calculation 1</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '60%'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '75%'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%'}} data-value="40%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '50%'}} data-value="50%"></div>
                        </div>
                    </div>
                    
                    {/* 14 - Overlap Pie */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Extra Calculation 2</div>
                        <div className={styles['pai-dr-pie-chart']}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(30deg)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37,37,37,0.6)'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37,37,37,0.3)'}}></div>
                        </div>
                    </div>
                    
                    {/* 15 - Overlap Radar */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Extra Calculation 3</div>
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
                            <div className={styles['pai-dr-radar-shape']} style={{top: '50%', left: '50%'}}></div>
                        </div>
                    </div>
                    
                    {/* Background Grid */}
                    <div className={styles['pai-dr-grid']}></div>
                </div>
                
                {/* LOADING MESSAGE */}
                <div className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
                    {loadingMessages[messageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

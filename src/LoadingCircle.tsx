import React, { useEffect, useState, useCallback, useRef } from 'react';
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
        "Training neural networks...",
        "Scanning market opportunities...",
        "Optimizing conversion paths...",
        "Analyzing engagement metrics...",
        "Predicting customer behavior...",
        "Segmenting target audiences...",
        "Success! Processing...",
        "Success! Finalizing...",
        "Success! Integrating...",
        "Success! Validating...",
        "Success! Completing..."
    ];
    
    const [messageIndex, setMessageIndex] = useState<number>(0);
    const [fade, setFade] = useState<boolean>(true); // True for fade-in, false for fade-out
    const usedIndices = useRef<Set<number>>(new Set([0])); // Start with index 0 as used
    
    // Get a random unused message index
    const getRandomUnusedIndex = useCallback(() => {
        const successMessages = [21, 22, 23, 24, 25]; // Indices of success messages
        let availableIndices: number[] = [];
        
        // If all regular messages used, reset the tracker (but keep success messages separate)
        if (usedIndices.current.size >= loadingMessages.length - successMessages.length) {
            usedIndices.current = new Set(successMessages.filter(idx => usedIndices.current.has(idx)));
        }
        
        // Create an array of unused indices (excluding success messages unless we're at the end)
        for (let i = 0; i < loadingMessages.length; i++) {
            if (!usedIndices.current.has(i) && (!successMessages.includes(i) || usedIndices.current.size > 15)) {
                availableIndices.push(i);
            }
        }
        
        // Get a random index from the available ones
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        usedIndices.current.add(randomIndex);
        
        return randomIndex;
    }, [loadingMessages.length]);
    
    useEffect(() => {
        const updateMessage = () => {
            setFade(false); // Start fade-out
            setTimeout(() => {
                // After fade-out completes, update the message and fade-in
                setMessageIndex((prevIndex) => {
                    // If we're showing a success message, show the next one in sequence
                    if (prevIndex >= 21 && prevIndex < 25) {
                        return prevIndex + 1;
                    }
                    // Otherwise get a random unused message
                    return getRandomUnusedIndex();
                });
                setFade(true); // Trigger fade-in
            }, 500); // Match the duration of the fade-out
        };
        
        // Set an interval to change the message every 8 seconds (longer display)
        const intervalId = setInterval(updateMessage, 8000);
        
        // Clean up on unmount
        return () => clearInterval(intervalId);
    }, [getRandomUnusedIndex]);
    
    return (
        <div className={styles['prognostic-ai-demo-results-container']}>
            <div className={styles['pai-dr-header']}>
                Clients.ai Quantum Analysis In Process
            </div>
            <div className={styles['pai-dr-content']}>
                <div className={styles['pai-dr-visualization']}>
                    {/* Left column */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Revenue Optimization</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '75%', animationDelay: '0.2s'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%', animationDelay: '0.3s'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '60%', animationDelay: '0.4s'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%', animationDelay: '0.5s'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%', animationDelay: '0.6s'}} data-value="40%"></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Engagement Metrics</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '60%', left: '10%', width: '80%', transform: 'rotate(-10deg)', animationDelay: '0.8s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '90%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Market Fit Analysis</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '10%', left: '50%', animationDelay: '1.4s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '85%', animationDelay: '1.5s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '75%', animationDelay: '1.6s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '25%', animationDelay: '1.7s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '15%', animationDelay: '1.8s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '10%', left: '50%', width: '35%', transform: 'rotate(45deg)', animationDelay: '1.9s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '85%', width: '35%', transform: 'rotate(110deg)', animationDelay: '2.0s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '75%', width: '50%', transform: 'rotate(200deg)', animationDelay: '2.1s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '25%', width: '35%', transform: 'rotate(250deg)', animationDelay: '2.2s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '15%', width: '35%', transform: 'rotate(320deg)', animationDelay: '2.3s'}}></div>
                            <div className={styles['pai-dr-radar-shape']} style={{animationDelay: '2.4s'}}></div>
                        </div>
                    </div>
                    
                    {/* Middle-left column */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Opportunity Mapping</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%', animationDelay: '2.1s'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%', animationDelay: '2.3s'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%', animationDelay: '2.5s'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%', animationDelay: '2.7s'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Growth Segments</div>
                        <div className={styles['pai-dr-pie-chart']} style={{width: '60px', height: '60px', margin: '10px auto'}}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(30deg)', animationDelay: '0.6s'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37, 37, 37, 0.6)', animationDelay: '0.8s'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37, 37, 37, 0.3)', animationDelay: '1.0s'}}></div>
                        </div>
                    </div>
                    
                    {/* Center column */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Market Opportunity Score</div>
                        <div className={styles['pai-dr-stat-box']}>
                            <span className={styles['pai-dr-stat-value']} data-value="92" data-min="42">92</span>
                            <span className={styles['pai-dr-stat-label']}>Market Potential</span>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>AI Agent Deployment</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '20%', left: '10%', width: '80%', transform: 'rotate(15deg)', animationDelay: '1.0s'}}></div>
                            <div className={styles['pai-dr-line']} style={{top: '40%', left: '10%', width: '60%', transform: 'rotate(-10deg)', animationDelay: '1.2s'}}></div>
                            <div className={styles['pai-dr-line']} style={{top: '60%', left: '30%', width: '50%', transform: 'rotate(20deg)', animationDelay: '1.4s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '20%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '40%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '30%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Strategic Roadmap</div>
                        <div className={styles['pai-dr-tree']}>
                            {/* Main nodes and branches */}
                            <div className={styles['pai-dr-tree-node']} style={{top: '10%', left: '50%'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '45%', width: '20%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '55%', width: '20%', transform: 'rotate(135deg)'}}></div>
                            
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '30%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '70%'}}></div>
                            
                            <div className={styles['pai-dr-tree-branch']} style={{top: '45%', left: '28%', width: '15%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '45%', left: '32%', width: '15%', transform: 'rotate(135deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '45%', left: '68%', width: '15%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '45%', left: '72%', width: '15%', transform: 'rotate(135deg)'}}></div>
                            
                            <div className={styles['pai-dr-tree-node']} style={{top: '70%', left: '20%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '70%', left: '40%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '70%', left: '60%'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '70%', left: '80%'}}></div>
                            
                            {/* Additional sub-branches and nodes for more complexity */}
                            <div className={styles['pai-dr-tree-sub-branch']} style={{top: '20%', left: '50%', width: '15%', transform: 'rotate(0deg)'}}></div>
                            <div className={styles['pai-dr-tree-sub-node']} style={{top: '20%', left: '65%'}}></div>
                            
                            <div className={styles['pai-dr-tree-sub-branch']} style={{top: '25%', left: '65%', width: '10%', transform: 'rotate(45deg)'}}></div>
                            <div className={styles['pai-dr-tree-sub-node']} style={{top: '32%', left: '72%'}}></div>
                            
                            <div className={styles['pai-dr-tree-sub-branch']} style={{top: '25%', left: '65%', width: '12%', transform: 'rotate(-45deg)'}}></div>
                            <div className={styles['pai-dr-tree-sub-node']} style={{top: '18%', left: '72%'}}></div>
                            
                            <div className={styles['pai-dr-tree-sub-branch']} style={{top: '50%', left: '20%', width: '10%', transform: 'rotate(-30deg)'}}></div>
                            <div className={styles['pai-dr-tree-sub-node']} style={{top: '45%', left: '15%'}}></div>
                            
                            <div className={styles['pai-dr-tree-sub-branch']} style={{top: '55%', left: '40%', width: '8%', transform: 'rotate(15deg)'}}></div>
                            <div className={styles['pai-dr-tree-sub-node']} style={{top: '56%', left: '48%'}}></div>
                            
                            <div className={styles['pai-dr-tree-sub-branch']} style={{top: '50%', left: '80%', width: '12%', transform: 'rotate(20deg)'}}></div>
                            <div className={styles['pai-dr-tree-sub-node']} style={{top: '55%', left: '90%'}}></div>
                        </div>
                    </div>
                    
                    {/* Middle-right column */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Market Sentiment</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '30%', left: '10%', width: '80%', transform: 'rotate(25deg) translateY(10px)', animationDelay: '1.1s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '30%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '90%'}}></div>
                            <div className={styles['pai-dr-line']} style={{top: '70%', left: '10%', width: '40%', transform: 'rotate(-15deg)', animationDelay: '1.3s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '70%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '65%', left: '50%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Competitive Analysis</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '65%', animationDelay: '1.7s'}} data-value="65%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '35%', animationDelay: '1.8s'}} data-value="35%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '80%', animationDelay: '1.9s'}} data-value="80%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '55%', animationDelay: '2.0s'}} data-value="55%"></div>
                        </div>
                    </div>
                    
                    {/* Right column */}
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Channel Optimization</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '85%', animationDelay: '0.4s'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '55%', animationDelay: '0.5s'}} data-value="55%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '70%', animationDelay: '0.6s'}} data-value="70%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%', animationDelay: '0.7s'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '60%', animationDelay: '0.8s'}} data-value="60%"></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>ROI Projection</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '70%', left: '10%', width: '80%', transform: 'rotate(-20deg)', animationDelay: '1.0s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '70%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '40%', left: '90%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Market Share Potential</div>
                        <div className={styles['pai-dr-stat-box']}>
                            <span className={styles['pai-dr-stat-value']} data-value="68" data-min="32">68</span>
                            <span className={styles['pai-dr-stat-label']}>Growth Score</span>
                        </div>
                    </div>
                    
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
                <div className={styles['pai-dr-visualization']}>
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Conversion Metrics</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '75%', animationDelay: '0.2s'}} data-value="75%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '45%', animationDelay: '0.3s'}} data-value="45%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '60%', animationDelay: '0.4s'}} data-value="60%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '85%', animationDelay: '0.5s'}} data-value="85%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '40%', animationDelay: '0.6s'}} data-value="40%"></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Engagement Patterns</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '60%', left: '10%', width: '80%', transform: 'rotate(-10deg)', animationDelay: '0.8s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '90%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Personality Profile</div>
                        <div className={styles['pai-dr-radar-chart']}>
                            <div className={styles['pai-dr-radar-point']} style={{top: '10%', left: '50%', animationDelay: '1.4s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '85%', animationDelay: '1.5s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '75%', animationDelay: '1.6s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '80%', left: '25%', animationDelay: '1.7s'}}></div>
                            <div className={styles['pai-dr-radar-point']} style={{top: '35%', left: '15%', animationDelay: '1.8s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '10%', left: '50%', width: '35%', transform: 'rotate(45deg)', animationDelay: '1.9s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '85%', width: '35%', transform: 'rotate(110deg)', animationDelay: '2.0s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '75%', width: '50%', transform: 'rotate(200deg)', animationDelay: '2.1s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '80%', left: '25%', width: '35%', transform: 'rotate(250deg)', animationDelay: '2.2s'}}></div>
                            <div className={styles['pai-dr-radar-line']} style={{top: '35%', left: '15%', width: '35%', transform: 'rotate(320deg)', animationDelay: '2.3s'}}></div>
                            <div className={styles['pai-dr-radar-shape']} style={{animationDelay: '2.4s'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Psychographic Analysis</div>
                        <div className={styles['pai-dr-brain-waves']}>
                            <div className={styles['pai-dr-wave']} style={{top: '20%', animationDelay: '2.1s'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '40%', animationDelay: '2.3s'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '60%', animationDelay: '2.5s'}}></div>
                            <div className={styles['pai-dr-wave']} style={{top: '80%', animationDelay: '2.7s'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Audience Segmentation</div>
                        <div className={styles['pai-dr-pie-chart']} style={{width: '60px', height: '60px', margin: '10px auto'}}>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(0deg) skew(30deg)', animationDelay: '0.6s'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(120deg) skew(50deg)', background: 'rgba(37, 37, 37, 0.6)', animationDelay: '0.8s'}}></div>
                            <div className={styles['pai-dr-pie-segment']} style={{transform: 'rotate(220deg) skew(80deg)', background: 'rgba(37, 37, 37, 0.3)', animationDelay: '1.0s'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Sentiment Analysis</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '30%', left: '10%', width: '80%', transform: 'rotate(25deg) translateY(10px)', animationDelay: '1.1s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '30%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '50%', left: '90%'}}></div>
                            <div className={styles['pai-dr-line']} style={{top: '70%', left: '10%', width: '40%', transform: 'rotate(-15deg)', animationDelay: '1.3s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '70%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '65%', left: '50%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Demographics</div>
                        <div className={styles['pai-dr-bar-chart']}>
                            <div className={styles['pai-dr-bar']} style={{height: '65%', animationDelay: '1.7s'}} data-value="65%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '35%', animationDelay: '1.8s'}} data-value="35%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '80%', animationDelay: '1.9s'}} data-value="80%"></div>
                            <div className={styles['pai-dr-bar']} style={{height: '55%', animationDelay: '2.0s'}} data-value="55%"></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Engagement Score</div>
                        <div className={styles['pai-dr-stat-box']}>
                            <span className={styles['pai-dr-stat-value']} data-value="92" data-min="42">92</span>
                            <span className={styles['pai-dr-stat-label']}>Performance Index</span>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Behavioral Analysis</div>
                        <div className={styles['pai-dr-line-chart']}>
                            <div className={styles['pai-dr-line']} style={{top: '20%', left: '10%', width: '80%', transform: 'rotate(15deg)', animationDelay: '1.0s'}}></div>
                            <div className={styles['pai-dr-line']} style={{top: '40%', left: '10%', width: '60%', transform: 'rotate(-10deg)', animationDelay: '1.2s'}}></div>
                            <div className={styles['pai-dr-line']} style={{top: '60%', left: '30%', width: '50%', transform: 'rotate(20deg)', animationDelay: '1.4s'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '20%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '40%', left: '10%'}}></div>
                            <div className={styles['pai-dr-line-point']} style={{top: '60%', left: '30%'}}></div>
                        </div>
                    </div>
                    
                    <div className={styles['pai-dr-data-module']}>
                        <div className={styles['pai-dr-chart-header']}>Decision Analysis</div>
                        <div className={styles['pai-dr-tree']}>
                            <div className={styles['pai-dr-tree-node']} style={{top: '10%', left: '50%', animationDelay: '1.6s'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '45%', width: '20%', transform: 'rotate(45deg)', animationDelay: '1.7s'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '15%', left: '55%', width: '20%', transform: 'rotate(135deg)', animationDelay: '1.8s'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '30%', animationDelay: '1.9s'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '40%', left: '70%', animationDelay: '2.0s'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '45%', left: '28%', width: '15%', transform: 'rotate(45deg)', animationDelay: '2.1s'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '45%', left: '32%', width: '15%', transform: 'rotate(135deg)', animationDelay: '2.2s'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '45%', left: '68%', width: '15%', transform: 'rotate(45deg)', animationDelay: '2.3s'}}></div>
                            <div className={styles['pai-dr-tree-branch']} style={{top: '45%', left: '72%', width: '15%', transform: 'rotate(135deg)', animationDelay: '2.4s'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '70%', left: '20%', animationDelay: '2.5s'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '70%', left: '40%', animationDelay: '2.6s'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '70%', left: '60%', animationDelay: '2.7s'}}></div>
                            <div className={styles['pai-dr-tree-node']} style={{top: '70%', left: '80%', animationDelay: '2.8s'}}></div>
                        </div>
                    </div>
                    
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

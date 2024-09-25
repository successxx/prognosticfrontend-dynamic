import React, {useEffect, useState} from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    const loadingMessages = [
        "Analyzing the essence of your website...",
        "Finding your digital presence...",
        "Thinking...",
        "Identifying your ideal target audience...",
        "Noting your opportunities and setbacks...",
        "Running A/B tests to discover your best path...",
        "Refining results for immediate impact...",
        "Running new A/B tests based on synthesized results...",
        "Crafting your blueprint for maximum success...",
        "Refining...",
        "Success! Stand by...",
        "Success! Stand by...",
        "Success! Stand by...",
        "Success! Stand by...",
        "Success! Stand by..."
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
    const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

    useEffect(() => {
        const updateMessage = () => {
            setFadeState('out');
            setTimeout(() => {
                setCurrentMessageIndex((prevIndex) => 
                    (prevIndex + 1) % loadingMessages.length
                );
                setFadeState('in');
            }, 500); // Half of the transition time
        };

        // Set initial message
        updateMessage();

        // Change the message every 5 seconds
        const intervalId = setInterval(updateMessage, 5000);

        // Cleanup on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={styles['prognostic-ai-demo-results-container']}>
            <div className={styles['pai-dr-header']}>
                Quantum Analysis In Process
            </div>
            <div className={styles['pai-dr-content']}>
                <div className={styles['pai-dr-spinner']}></div>
                <div 
                    className={`${styles['pai-dr-message']} ${styles[`fade-${fadeState}`]}`}
                    style={{
                        transition: 'opacity 1s ease-in-out'
                    }}
                >
                    {loadingMessages[currentMessageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

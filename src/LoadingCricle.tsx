import React, {useEffect, useState} from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    const loadingMessages = [
        "Analyzing your website...",
        "Finding your digital presence...",
        "Thinking...",
        "Identifying your ideal target audience...",
        "Identifying opportunities...",
        "Running A/B tests...",
        "Refining results for immediate impact...",
        "Running new A/B tests based on synthesized results...",
        "Crafting your step-by-step blueprint...",
        "Refining...",
        "Success! Stand by...",
        "Success! Stand by...",
        "Success! Stand by...",
        "Success! Stand by...",
        "Success! Stand by..."
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);

    useEffect(() => {
        const updateMessage = () => {
            setCurrentMessageIndex((prevIndex) => 
                (prevIndex + 1) % loadingMessages.length
            );
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
                <div className={styles['pai-dr-message']}>
                    {loadingMessages[currentMessageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

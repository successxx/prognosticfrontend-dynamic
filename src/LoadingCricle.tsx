// LoadingIndicator.tsx
import React, {useEffect, useState} from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    const loadingMessages = [
        "Psychoanalyzing your inner workings...",
        "Uncovering hidden patterns in your responses...",
        "Identifying archetypal anomalies...",
        "Delving into the deep dark depths of your hidden psyche...",
        "Forging a window into your mind and future...",
        "Mapping your synaptic space... illustrating your mind's landscape..."
    ];

    const [randomMessage, setRandomMessage] = useState<string>('');

    useEffect(() => {
        const updateMessage = () => {
            const randomIndex = Math.floor(Math.random() * loadingMessages.length);
            const message = loadingMessages[randomIndex];
            setRandomMessage(message);
        };

        updateMessage(); // Set initial message

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
                    {randomMessage}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

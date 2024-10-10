import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    const loadingMessages = [
    "Uncovering hidden aspects of your personality...",
    "Processing your unique thought patterns...",
    "Identifying your core motivations...",
    "Mapping your emotional landscape...",
    "Exploring your cognitive strengths...",
    "Decoding your interpersonal dynamics...",
    "Synthesizing your behavioral tendencies...",
    "Crafting your personalized psychological profile...",
    "Refining insights...",
    "Eureka! Breakthrough achieved...",
    "Fascinating patterns detected...",
    "Unique traits identified...",
    "Personality matrix completed...",
    "Final analysis in progress...",
    "Finalizing...",
    "Analysis completed...",
    "Writing...",
    "Success! One moment...",
    "Success! One moment...",
    "Success! One moment...",
    "Success! One moment...",
    "Success! Redirecting you now...",
    ];

    const [messageIndex, setMessageIndex] = useState<number>(0);
    const [fade, setFade] = useState<boolean>(true); // True for fade-in, false for fade-out

    useEffect(() => {
        const updateMessage = () => {
            setFade(false); // Start fade-out

            setTimeout(() => {
                // After fade-out completes, update the message and fade-in
                setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
                setFade(true); // Trigger fade-in
            }, 200); // Match the duration of the fade-out
        };

        // Set an interval to change the message every 5 seconds
        const intervalId = setInterval(updateMessage, 5000);

        // Clean up on unmount
        return () => clearInterval(intervalId);
    }, [loadingMessages.length]);

    return (
        <div className={styles['prognostic-ai-demo-results-container']}>
            <div className={styles['pai-dr-header']}>
                Psychological Assessment In Process
            </div>
            <div className={styles['pai-dr-content']}>
                <div className={styles['pai-dr-spinner']}></div>
                <div className={`${styles['pai-dr-message']} ${fade ? styles['fade-in'] : styles['fade-out']}`}>
                    {loadingMessages[messageIndex]}
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

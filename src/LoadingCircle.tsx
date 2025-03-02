import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
  const loadingMessages = [
    "Thinking...",
    "Looking at your site...",
    "Launching Your Agents...",
    "Deploying...",
    "Success!",
    "Split-testing...",
    "Analyzing test results...",
    "Refining for immediate impact...",
    "Running new A/B tests based on synthesized results...",
    "Crafting your blueprint for maximum success...",
    "Refining...",
    "Success! Stand by...",
    "Success! Stand by...",
    "Success! Stand by...",
    "Success! Stand by...",
    "Success! Stand by..."
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
      }, 500); // Match the duration of the fade-out
    };

    // Change the message every 5 seconds
    const intervalId = setInterval(updateMessage, 5000);

    return () => clearInterval(intervalId);
  }, [loadingMessages.length]);

  return (
    <div className={styles['prognostic-ai-demo-results-container']}>
      <div className={styles['pai-dr-header']}>
        Quantum Analysis In Process
      </div>

      <div className={styles['pai-dr-content']}>
        <div className={styles['pai-dr-spinner']}></div>
        <div
          className={`
            ${styles['pai-dr-message']} 
            ${fade ? styles['fade-in'] : styles['fade-out']}
          `}
        >
          {loadingMessages[messageIndex]}
        </div>
      </div>

      <div className={styles['pai-dr-footer']}>
        <img src="./assets/header.png" alt="Centered Logo" />
        <p>© {new Date().getFullYear()} Clients.ai</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;

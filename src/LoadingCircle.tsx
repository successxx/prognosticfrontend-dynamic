/* LoadingCircle.tsx
   The spinner with fade in/out messages
*/
import React, { useEffect, useState } from "react";
import styles from "./LoadingCircle.module.css";

const LoadingCircle: React.FC = () => {
  const loadingMessages = [
    "Thinking...",
    "Looking at your site...",
    "Launching Your Agents...",
    "Deploying...",
    "Success!",
    "Split-testing...",
    "Analyzing test results...",
    "Refining for immediate impact...",
    "Running new A/B tests based on data...",
    "Crafting blueprint for maximum success...",
    "Refining...",
    "Success! Stand by...",
    "Success! Stand by...",
  ];

  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true); // True => fade in

  useEffect(() => {
    const updateMessage = () => {
      setFade(false); // Start fade-out
      setTimeout(() => {
        // After fade-out completes, update message
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        setFade(true); // fade in
      }, 500);
    };

    // Change msg every 5s
    const intervalId = setInterval(updateMessage, 5000);
    return () => clearInterval(intervalId);
  }, [loadingMessages.length]);

  return (
    <div className={styles["prognostic-ai-demo-results-container"]}>
      <div className={styles["pai-dr-header"]}>
        Quantum Analysis In Process
      </div>
      <div className={styles["pai-dr-content"]}>
        <div className={styles["pai-dr-spinner"]}></div>
        <div className={`${styles["pai-dr-message"]} ${fade ? styles["fade-in"] : styles["fade-out"]}`}>
          {loadingMessages[messageIndex]}
        </div>
      </div>
    </div>
  );
};

export default LoadingCircle;

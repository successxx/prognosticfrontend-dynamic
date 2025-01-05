import React from 'react';
import styles from './LoadingCircle.module.css';

const LoadingCircle: React.FC = () => {
  return (
    <div className={styles['prognostic-ai-demo-results-container']}>
      <div className={styles['pai-dr-header']}>
        Preparing the next available session ...
      </div>
      <div className={styles['pai-dr-content']}>
        <div className={styles['pai-dr-spinner']}></div>
        <p className={styles['pai-dr-message']}>
          Hang tight – we’re reserving your seat...
        </p>
      </div>
    </div>
  );
};

export default LoadingCircle;

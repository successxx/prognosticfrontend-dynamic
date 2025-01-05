import React, { useEffect, useState } from 'react';
import styles from './LoadingCircle.module.css';

const LoadingIndicator: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [nextSessionTime, setNextSessionTime] = useState<Date>(new Date());

    useEffect(() => {
        // Calculate next 15-minute increment
        const calculateNextSession = () => {
            const now = new Date();
            const minutes = now.getMinutes();
            const nextQuarter = Math.ceil(minutes / 15) * 15;
            const next = new Date(now);
            next.setMinutes(nextQuarter, 0, 0);
            return next;
        };

        // Set initial time
        setNextSessionTime(calculateNextSession());

        // Update countdown
        const timer = setInterval(() => {
            const now = new Date();
            const diff = nextSessionTime.getTime() - now.getTime();

            if (diff <= 0) {
                // Get email from current URL
                const currentEmail = new URLSearchParams(window.location.search).get('user_email');
                // Redirect to webinar with email parameter
                window.location.href = `/webinar.html?user_email=${encodeURIComponent(currentEmail || '')}`;
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }, 1000);

        return () => clearInterval(timer);
    }, [nextSessionTime]);

    return (
        <div className={styles['prognostic-ai-demo-results-container']}>
            <div className={styles['pai-dr-header']}>
                Your Webinar Starts Soon
            </div>
            <div className={styles['pai-dr-content']}>
                <div className={styles['pai-dr-spinner']}></div>
                <div className={styles['pai-dr-message']}>
                    Next session begins in:
                    <div className={styles['countdown']}>{timeLeft}</div>
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;

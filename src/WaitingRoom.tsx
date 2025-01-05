import React, { useEffect, useState } from 'react';
import styles from './WaitingRoom.module.css';

const WaitingRoom: React.FC = () => {
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

        // Update next session time
        setNextSessionTime(calculateNextSession());

        // Update countdown every second
        const timer = setInterval(() => {
            const now = new Date();
            const diff = nextSessionTime.getTime() - now.getTime();

            if (diff <= 0) {
                // Time to redirect to webinar
                window.location.href = `/webinar.html${window.location.search}`;
                return;
            }

            // Format remaining time
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
                    <div>Next session starts in:</div>
                    <div className={styles['countdown']}>{timeLeft}</div>
                    <div className={styles['session-time']}>
                        Session starts at {nextSessionTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingRoom;

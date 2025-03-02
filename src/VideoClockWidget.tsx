import React, { useEffect, useState, useRef } from "react";
import styles from "./WebinarView.module.css";

interface ClockWidgetProps {
  clockRemoved: boolean;
  clockDragInComplete: boolean;
  setClockDragInComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClockWidget: React.FC<ClockWidgetProps> = ({
  clockRemoved,
  clockDragInComplete,
  setClockDragInComplete,
}) => {
  const [timeString, setTimeString] = useState("");
  const [dateString, setDateString] = useState("");
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDateString(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === "dragIn") {
      setClockDragInComplete(true);
    }
  };

  let classNames = styles.clockWidget;
  if (!clockRemoved) {
    classNames += " " + styles.animateIn;
    if (clockDragInComplete) {
      classNames += " " + styles.wobble;
    }
  } else {
    classNames += " " + styles.animateOut;
  }

  return (
    <div
      ref={widgetRef}
      className={classNames}
      onAnimationEnd={handleAnimationEnd}
      style={{ left: "2%" }} 
    >
      <div className={styles.widgetHeader}>
        <div className={styles.windowControls}>
          <div className={`${styles.windowButton} ${styles.closeButton}`} />
          <div className={`${styles.windowButton} ${styles.minimizeButton}`} />
          <div className={`${styles.windowButton} ${styles.maximizeButton}`} />
        </div>
        <div className={styles.widgetTitle}>Clock Widget</div>
      </div>
      <div className={styles.widgetContent}>
        <div className={styles.clockTime}>{timeString}</div>
        <div className={styles.clockDate}>{dateString}</div>
      </div>
    </div>
  );
};

export default ClockWidget;

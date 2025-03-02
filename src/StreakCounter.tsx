import React, { useEffect, useState } from "react";

interface StreakCounterProps {
  streak: number;
}

function StreakCounter({ streak }: StreakCounterProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [streak]);

  return (
    <div
      className={`streak-counter ${visible ? "visible" : ""}`}
      id="streak-counter"
    >
      Streak: {streak} 🔥
    </div>
  );
}

export default StreakCounter;

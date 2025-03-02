import React, { useEffect, useState } from "react";

interface StreakCounterProps {
  streak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
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
      style={{
        fontSize: "20px",
        fontWeight: 600,
        color: "#252525",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "12px 20px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(1, 66, 172, 0.2)",
        opacity: visible ? 1 : 0,
        transition: "all 0.5s ease-in-out",
        zIndex: 2,
        position: "absolute",
        bottom: visible ? "-50px" : "-60px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      Streak: {streak} 🔥
    </div>
  );
};

export default StreakCounter;

/*******************************************************
4) STREAKCOUNTER
*******************************************************/
import React from 'react';

function StreakCounter({ streak }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [streak]);

  return (
    <div className={`streak-counter ${visible ? "visible" : ""}`} id="streak-counter">
      Streak: {streak} 🔥
    </div>
  );
}

export default StreakCounter;

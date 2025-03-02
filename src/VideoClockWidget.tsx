import React, { useEffect, useState } from "react";

/**
 * The fluid clock widget content:
 * We do not define its container's position/animation here,
 * just the internal time/date rendering.
 */
const VideoClockWidget: React.FC = () => {
  const [timeString, setTimeString] = useState("");
  const [dateString, setDateString] = useState("");

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
    const timerId = setInterval(updateClock, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="widgetContent">
      <div className="clockTime">{timeString}</div>
      <div className="clockDate">{dateString}</div>
    </div>
  );
};

export default VideoClockWidget;

import type React from "react";
import { useState, useEffect } from "react";
import "./index.css";

interface VideoClock {
  videoContainerRef: React.RefObject<HTMLDivElement>;
}

export const VideoClock: React.FC<VideoClock> = ({ videoContainerRef }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dateNum = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${day} ${month} ${dateNum} ${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const updateClockSize = () => {
      if (videoContainerRef.current) {
        const { width } = videoContainerRef.current.getBoundingClientRect();
        document.documentElement.style.setProperty(
          "--clock-base-size",
          `${width / 100}px`
        );
      }
    };

    updateClockSize();
    window.addEventListener("resize", updateClockSize);

    return () => {
      window.removeEventListener("resize", updateClockSize);
    };
  }, [videoContainerRef]);

  return <div className="clock">{formatDate(date)}</div>;
};

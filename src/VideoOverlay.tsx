// ==========================
// VIDEOOVERLAY.TSX
// ==========================
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IWebinarInjection } from "./WebinarView";

/**
 * Convert "4:22.79" => 4*60 + 22.79 => 262.79 seconds
 * If the format is just "12.34", parseFloat will handle it.
 */
function parseTimestamp(ts: string): number {
  // If no colon present, parse as float
  if (!ts.includes(":")) {
    return parseFloat(ts) || 0;
  }
  // "MM:SS.xx" or "M:SS.xx"
  const parts = ts.split(":");
  if (parts.length === 2) {
    const m = parseFloat(parts[0]) || 0;
    const s = parseFloat(parts[1]) || 0;
    return m * 60 + s;
  }
  // fallback
  return parseFloat(ts) || 0;
}

interface OverlayItem {
  key: keyof IWebinarInjection;
  content: string;
  startTime: string; // initially a string
  endTime: string;   // initially a string
  position: {
    x: number; // 0..1
    y: number; // 0..1
  };
  style?: React.CSSProperties;
}

interface VideoOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoContainerRef: React.RefObject<HTMLDivElement>;
  webinarInjectionData?: IWebinarInjection;
}

// Your overlay data from user:
const overlayItems: OverlayItem[] = [
  {
    key: "lead_email",
    content: "",
    startTime: "4:22.79",
    endTime: "4:26.38",
    position: { x: 0.573, y: 0.338 },
    style: { color: "#252525", fontSize: "0.7em" },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: "4:27.64",
    endTime: "4:40.66",
    position: { x: 0.573, y: 0.44 },
    style: { color: "#252525", fontSize: "0.7em" },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: "4:51.65",
    endTime: "5:08.77",
    position: { x: 0.043, y: 0.264 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_url",
    content: "123-456-7890",
    startTime: "4:54.11",
    endTime: "5:08.77",
    position: { x: 0.043, y: 0.303 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
    },
  },
  {
    key: "lead_email",
    content: "",
    startTime: "4:59.00",
    endTime: "5:08.77",
    position: { x: 0.043, y: 0.34 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "website_url",
    content: "www.example.com",
    startTime: "5:19.78",
    endTime: "5:22.54",
    position: { x: 0.372, y: 0.608 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "company_name",
    content: "",
    startTime: "5:26.88",
    endTime: "5:35.95",
    position: { x: 0.372, y: 0.52 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Industry",
    content: "",
    startTime: "5:26.88",
    endTime: "5:35.95",
    position: { x: 0.508, y: 0.52 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Products_services",
    content: "Improve efficiency, Tech companies, Time management",
    startTime: "5:26.88",
    endTime: "5:35.95",
    position: { x: 0.372, y: 0.585 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Business_description",
    content: "AI Assistant, $99/month, 24/7 support, Boost productivity",
    startTime: "5:26.88",
    endTime: "5:35.95",
    position: { x: 0.372, y: 0.667 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "primary_goal",
    content: "Primary Goal",
    startTime: "5:35.96",
    endTime: "5:42.32",
    position: { x: 0.372, y: 0.525 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "target_audience",
    content: "Target Audience",
    startTime: "5:35.96",
    endTime: "5:42.32",
    position: { x: 0.372, y: 0.58 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "41em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "pain_points",
    content: "Customer Pain Points",
    startTime: "5:35.96",
    endTime: "5:42.32",
    position: { x: 0.372, y: 0.664 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "41em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "offer_name",
    content: "Offer Name",
    startTime: "5:42.45",
    endTime: "5:45.63",
    position: { x: 0.37, y: 0.477 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_price",
    content: "3000",
    startTime: "5:42.45",
    endTime: "5:45.63",
    position: { x: 0.514, y: 0.477 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_description",
    content: "john.doe@example.com",
    startTime: "5:42.45",
    endTime: "5:45.63",
    position: { x: 0.37, y: 0.54 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "primary_benefits",
    content: "Benefits of AI Assistant",
    startTime: "5:42.45",
    endTime: "5:45.63",
    position: { x: 0.507, y: 0.54 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "offer_goal",
    content: "Offer goal",
    startTime: "5:42.45",
    endTime: "5:45.63",
    position: { x: 0.37, y: 0.634 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "Offer_topic",
    content: "Offer topic",
    startTime: "5:42.45",
    endTime: "5:45.63",
    position: { x: 0.507, y: 0.634 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "4.3em",
      overflow: "hidden",
    },
  },
  {
    key: "testimonials",
    content: "Testimonials",
    startTime: "5:45.64",
    endTime: "5:48.90",
    position: { x: 0.38, y: 0.552 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "41em",
      maxHeight: "7em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "email_1",
    content: "",
    startTime: "7:10.30",
    endTime: "7:37.61",
    position: { x: 0.13, y: 0.3 },
    style: {
      color: "#252525",
      fontSize: "0.9em",
      maxWidth: "81em",
      maxHeight: "30em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "email_2",
    content: "",
    startTime: "7:37.61",
    endTime: "7:46.28",
    position: { x: 0.13, y: 0.3 },
    style: {
      color: "#252525",
      fontSize: "0.9em",
      maxWidth: "81em",
      maxHeight: "20em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "salesletter",
    content: "",
    startTime: "7:46.30",
    endTime: "8:00.60",
    position: { x: 0.24, y: 0.25 },
    style: {
      color: "#252525",
      fontSize: "0.9em",
      maxWidth: "62em",
      maxHeight: "28em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "company_name",
    content: "",
    startTime: "8:01.62",
    endTime: "8:12.67",
    position: { x: 0.33, y: 0.32 },
    style: { color: "#252525", fontSize: "0.6em", fontWeight: "500" },
  },
  {
    key: "Products_services",
    content: "",
    startTime: "8:01.62",
    endTime: "8:12.67",
    position: { x: 0.303, y: 0.37 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_price",
    content: "",
    startTime: "8:01.62",
    endTime: "8:12.67",
    position: { x: 0.303, y: 0.386 },
    style: { color: "#252525", fontSize: "0.6em", fontWeight: "600" },
  },
];

export const VideoOverlay: React.FC<VideoOverlayProps> = ({
  videoRef,
  videoContainerRef,
  webinarInjectionData,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>();

  // Convert overlay items to numeric times + inject content
  const updatedOverlayItems = useMemo(() => {
    if (!webinarInjectionData) return [];
    return overlayItems.map((item) => ({
      ...item,
      // parse each time string to numeric
      startNum: parseTimestamp(item.startTime),
      endNum: parseTimestamp(item.endTime),
      // actual text from user data
      content: (webinarInjectionData[item.key] || item.content || "").trim(),
    }));
  }, [webinarInjectionData]);

  // Track video time via requestAnimationFrame
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      rafId.current = requestAnimationFrame(updateTime);
    };
    rafId.current = requestAnimationFrame(updateTime);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [videoRef]);

  // Update overlay CSS vars for sizing
  useEffect(() => {
    const updateOverlaySize = () => {
      if (overlayRef.current && videoContainerRef.current) {
        const { width, height } =
          videoContainerRef.current.getBoundingClientRect();
        overlayRef.current.style.setProperty("--overlay-width", `${width}px`);
        overlayRef.current.style.setProperty("--overlay-height", `${height}px`);
      }
    };
    updateOverlaySize();
    window.addEventListener("resize", updateOverlaySize);
    return () => window.removeEventListener("resize", updateOverlaySize);
  }, [videoContainerRef]);

  const embeddableInjection = (key: keyof IWebinarInjection) =>
    key === "email_1" || key === "email_2" || key === "salesletter";

  // Render
  return (
    <div ref={overlayRef} className="video-overlay">
      {updatedOverlayItems.map((item, index) => {
        // is this overlay item visible at currentTime?
        const visible = currentTime >= item.startNum && currentTime <= item.endNum;
        const style = {
          ...item.style,
          left: `${item.position.x * 100}%`,
          top: `${item.position.y * 100}%`,
        };

        if (embeddableInjection(item.key)) {
          // dangerouslySetInnerHTML for HTML
          return (
            <div
              key={index}
              className={`overlay-item ${visible ? "visible" : ""}`}
              style={style}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          );
        } else {
          // Plain text injection
          return (
            <div
              key={index}
              className={`overlay-item ${visible ? "visible" : ""}`}
              style={style}
            >
              {item.content}
            </div>
          );
        }
      })}
    </div>
  );
};

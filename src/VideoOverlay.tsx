import type React from "react";
import "./index.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { IWebinarInjection } from "./WebinarView";

interface OverlayItem {
  key: keyof IWebinarInjection;
  content: string;
  startTime: number;
  endTime: number;
  position: {
    x: number; // 0 to 1, representing percentage across width
    y: number; // 0 to 1, representing percentage down height
  };
  style?: React.CSSProperties;
}

interface VideoOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoContainerRef: React.RefObject<HTMLDivElement>;
  webinarInjectionData?: IWebinarInjection;
}

// All your overlay items, unchanged
const overlayItems: OverlayItem[] = [
  {
    key: "lead_email",
    content: "",
    startTime: 12.69,
    endTime: 16.28,
    position: { x: 0.573, y: 0.338 },
    style: { color: "#252525", fontSize: "0.7em" },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: 17.54,
    endTime: 30.56,
    position: { x: 0.573, y: 0.44 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: 41.55,
    endTime: 58.67,
    position: { x: 0.043, y: 0.264 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_url",
    content: "123-456-7890",
    startTime: 44.01,
    endTime: 58.67,
    position: { x: 0.043, y: 0.303 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
    },
  },
  {
    key: "lead_email",
    content: "",
    startTime: 48.9,
    endTime: 58.67,
    position: { x: 0.043, y: 0.34 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "website_url",
    content: "www.example.com",
    startTime: 69.68,
    endTime: 72.44,
    position: { x: 0.372, y: 0.608 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "company_name",
    content: "",
    startTime: 76.78,
    endTime: 85.85,
    position: { x: 0.372, y: 0.52 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Industry",
    content: "",
    startTime: 76.78,
    endTime: 85.85,
    position: { x: 0.508, y: 0.52 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Products_services",
    content: "Improve efficiency, Tech companies, Time management",
    startTime: 76.78,
    endTime: 85.85,
    position: { x: 0.372, y: 0.585 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Business_description",
    content: "AI Assistant, $99/month, 24/7 support, Boost productivity",
    startTime: 76.78,
    endTime: 85.85,
    position: { x: 0.372, y: 0.667 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "primary_goal",
    content: "Primary Goal",
    startTime: 85.86,
    endTime: 92.22,
    position: { x: 0.372, y: 0.525 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "target_audience",
    content: "Target Audience",
    startTime: 85.86,
    endTime: 92.22,
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
    startTime: 85.86,
    endTime: 92.22,
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
    startTime: 92.35,
    endTime: 95.53,
    position: { x: 0.37, y: 0.477 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_price",
    content: "3000",
    startTime: 92.35,
    endTime: 95.53,
    position: { x: 0.514, y: 0.477 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_description",
    content: "john.doe@example.com",
    startTime: 92.35,
    endTime: 95.53,
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
    startTime: 92.35,
    endTime: 95.53,
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
    startTime: 92.35,
    endTime: 95.53,
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
    startTime: 92.35,
    endTime: 95.53,
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
    startTime: 95.54,
    endTime: 98.8,
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
    startTime: 180.2,
    endTime: 207.51,
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
    startTime: 207.51,
    endTime: 216.18,
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
    startTime: 216.2,
    endTime: 230.5,
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
    startTime: 231.52,
    endTime: 242.57,
    position: { x: 0.33, y: 0.32 },
    style: { color: "#252525", fontSize: "0.6em", fontWeight: "500" },
  },
  {
    key: "Products_services",
    content: "",
    startTime: 231.52,
    endTime: 242.57,
    position: { x: 0.303, y: 0.37 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_price",
    content: "",
    startTime: 231.52,
    endTime: 242.57,
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

  const updatedOverlayItems = useMemo(() => {
    if (!webinarInjectionData) {
      return [];
    }
    return overlayItems.map((item) => {
      return {
        ...item,
        content: webinarInjectionData[item.key]?.trim(),
      };
    });
  }, [webinarInjectionData]);

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

  useEffect(() => {
    const updateOverlaySize = () => {
      if (videoContainerRef.current && overlayRef.current) {
        const { width, height } =
          videoContainerRef.current.getBoundingClientRect();
        overlayRef.current.style.setProperty("--overlay-width", `${width}px`);
        overlayRef.current.style.setProperty("--overlay-height", `${height}px`);
      }
    };

    updateOverlaySize();
    window.addEventListener("resize", updateOverlaySize);

    return () => {
      window.removeEventListener("resize", updateOverlaySize);
    };
  }, [videoContainerRef]);

  const embeddableInjection = (key: keyof IWebinarInjection) => {
    // Keys that might contain HTML content
    return key === "email_1" || key === "email_2" || key === "salesletter";
  };

  return (
    <div ref={overlayRef} className="video-overlay">
      {updatedOverlayItems.map((item, index) => {
        if (!videoRef.current) return null;

        const visible =
          currentTime >= item.startTime && currentTime <= item.endTime;

        if (embeddableInjection(item.key)) {
          // if content can contain HTML => dangerouslySetInnerHTML
          return (
            <div
              key={index}
              className={`overlay-item ${visible ? "visible" : ""}`}
              style={{
                ...item.style,
                left: `${item.position.x * 100}%`,
                top: `${item.position.y * 100}%`,
              }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          );
        } else {
          // plain text content
          return (
            <div
              key={index}
              className={`overlay-item ${visible ? "visible" : ""}`}
              style={{
                ...item.style,
                left: `${item.position.x * 100}%`,
                top: `${item.position.y * 100}%`,
              }}
            >
              {item.content}
            </div>
          );
        }
      })}
    </div>
  );
};

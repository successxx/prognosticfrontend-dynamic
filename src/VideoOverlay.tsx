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

const overlayItems: OverlayItem[] = [
  // Add this to the overlayItems array
{
  key: "headline", // Use 'headline' to match the data field in your JSON
  content: "", // The content will be populated from webinarInjectionData
  startTime: 0, // When it should start showing (in seconds)
  endTime: 11.05, // When it should stop showing (in seconds)
  position: { x: 0.099, y: 0.45 }, // These are the estimated coordinates
  style: {
    color: "#252525",
    fontSize: "1.5em", // This would be 1.5% of the video width
    fontFamily: '"SF Pro Display", sans-serif',
    fontWeight: "500",
    lineHeight: "1.4",
    textAlign: "center",
    maxWidth: "30em", // 30em = 30 × font size
    zIndex: "3"
  },
},
  {
  key: "headline", // Use 'headline' to match the data field in your JSON
  content: "", // The content will be populated from webinarInjectionData
  startTime: 69.08, // When it should start showing (in seconds)
  endTime: 90.07, // When it should stop showing (in seconds)
  position: { x: 0.642, y: 0.57 }, // These are the estimated coordinates
  style: {
    color: "#252525",
    fontSize: "2em", // This would be 1.5% of the video width
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: "550",
    lineHeight: "1.5",
    textAlign: "center",
    maxWidth: "15em", // 30em = 30 × font size
    zIndex: "3"
  },
},
  {
    key: "lead_email",
    content: "",
    startTime: 263.19,
    endTime: 266.78,
    position: { x: 0.573, y: 0.338 },
    style: { color: "#252525", fontSize: "0.7em" },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: 268.04,
    endTime: 281.06,
    position: { x: 0.571, y: 0.47 },
    style: { color: "#252525", fontSize: "0.7em" },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: 291.65,
    endTime: 308.77,
    position: { x: 0.043, y: 0.264 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_url",
    content: "123-456-7890",
    startTime: 294.11,
    endTime: 308.77,
    position: { x: 0.043, y: 0.303 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
    },
  },
  {
    key: "lead_email",
    content: "",
    startTime: 299.40,
    endTime: 308.07,
    position: { x: 0.039, y: 0.34 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "website_url",
    content: "www.example.com",
    startTime: 320.28,
    endTime: 322.94,
    position: { x: 0.372, y: 0.648 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "company_name",
    content: "",
    startTime: 326.48,
    endTime: 335.55,
    position: { x: 0.372, y: 0.52 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Industry",
    content: "",
    startTime: 326.48,
    endTime: 335.55,
    position: { x: 0.508, y: 0.52 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Products_services",
    content: "Improve efficiency, Tech companies, Time management",
    startTime: 326.48,
    endTime: 335.55,
    position: { x: 0.372, y: 0.585 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Business_description",
    content: "AI Assistant, $99/month, 24/7 support, Boost productivity",
    startTime: 326.48,
    endTime: 335.55,
    position: { x: 0.372, y: 0.667 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "primary_goal",
    content: "Primary Goal",
    startTime: 335.56,
    endTime: 342.92,
    position: { x: 0.372, y: 0.525 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "target_audience",
    content: "Target Audience",
    startTime: 335.56,
    endTime: 342.92,
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
    startTime: 335.56,
    endTime: 342.92,
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
    startTime: 342.45,
    endTime: 345.13,
    position: { x: 0.37, y: 0.477 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_price",
    content: "3000",
    startTime: 342.45,
    endTime: 345.13,
    position: { x: 0.514, y: 0.477 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_description",
    content: "john.doe@example.com",
    startTime: 342.45,
    endTime: 345.13,
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
    startTime: 342.45,
    endTime: 345.13,
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
    startTime: 342.45,
    endTime: 345.13,
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
    startTime: 342.45,
    endTime: 345.13,
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
    startTime: 345.64,
    endTime: 348.90,
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
    startTime: 430.30,
    endTime: 457.61,
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
    startTime: 457.61,
    endTime: 466.28,
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
    startTime: 466.30,
    endTime: 480.60,
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
    startTime: 481.62,
    endTime: 492.67,
    position: { x: 0.33, y: 0.32 },
    style: { color: "#252525", fontSize: "0.6em", fontWeight: "500" },
  },
  {
    key: "Products_services",
    content: "",
    startTime: 481.62,
    endTime: 492.67,
    position: { x: 0.303, y: 0.37 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_price",
    content: "",
    startTime: 481.62,
    endTime: 492.67,
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
  }, []);

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
    // Includes the keys those contains the html content
    return key === "email_1" || key === "email_2" || key === "salesletter";
  };

  return (
    <div ref={overlayRef} className="video-overlay">
      {updatedOverlayItems.map((item, index) => {
        if (!videoRef.current) return null;
        return (
          <>
            {embeddableInjection(item.key) ? (
              <div
                key={index}
                className={`overlay-item ${
                  currentTime >= item.startTime && currentTime <= item.endTime
                    ? "visible"
                    : ""
                }`}
                style={{
                  ...item.style,
                  left: `${item.position.x * 100}%`,
                  top: `${item.position.y * 100}%`,
                }}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            ) : (
              <div
                key={index}
                className={`overlay-item ${
                  currentTime >= item.startTime && currentTime <= item.endTime
                    ? "visible"
                    : ""
                }`}
                style={{
                  ...item.style,
                  left: `${item.position.x * 100}%`,
                  top: `${item.position.y * 100}%`,
                }}
              >
                {item.content}
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};

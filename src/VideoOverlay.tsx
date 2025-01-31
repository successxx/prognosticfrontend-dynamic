import type React from "react";
import "./index.css";
import { useEffect, useMemo, useRef } from "react";
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

// const apiResponse = {
//   Business_description: "Business Description",
//   Industry: "",
//   Offer_topic: "Offer Topic",
//   Products_services: "",
//   company_name: "Company Name",
//   email_1: "example@email.com",
//   email_2: "example@email.com",
//   exit_message: "test1",
//   headline: "",
//   offer_description: "Offer Description",
//   offer_goal: "Offer Goal",
//   offer_name: "Offer Name",
//   offer_price: "5000",
//   pain_points: "Pain Points",
//   primary_benefits: "Primary Benefits",
//   primary_goal: "Primary Goal",
//   salesletter: "",
//   target_audience: "Target Audience",
//   target_url: "",
//   testimonials: "Testimonials",
// };

// missing: user_name, user_phone, website_url, last email screen content

const overlayItems: OverlayItem[] = [
  {
    key: "lead_email",
    content: "",
    startTime: 13,
    endTime: 16.08,
    position: { x: 0.573, y: 0.334 },
    style: { color: "#0142ac", fontSize: "1em" },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: 17.8,
    endTime: 26.7,
    position: { x: 0.573, y: 0.44 },
    style: { color: "#0142ac", fontSize: "0.6em" },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: 41.15,
    endTime: 58.57,
    position: { x: 0.043, y: 0.265 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_url",
    content: "123-456-7890",
    startTime: 43.6,
    endTime: 58.57,
    position: { x: 0.043, y: 0.303 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
    },
  },
  {
    key: "lead_email",
    content: "",
    startTime: 48.5,
    endTime: 58.57,
    position: { x: 0.043, y: 0.34 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "website_url",
    content: "www.example.com",
    startTime: 69.28,
    endTime: 71.94,
    position: { x: 0.372, y: 0.61 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "company_name",
    content: "",
    startTime: 76.38,
    endTime: 85.35,
    position: { x: 0.372, y: 0.52 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Industry",
    content: "",
    startTime: 76.38,
    endTime: 85.35,
    position: { x: 0.508, y: 0.52 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Products_services",
    content: "Improve efficiency, Tech companies, Time management",
    startTime: 76.38,
    endTime: 85.35,
    position: { x: 0.372, y: 0.585 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Business_description",
    content: "AI Assistant, $99/month, 24/7 support, Boost productivity",
    startTime: 76.38,
    endTime: 85.35,
    position: { x: 0.372, y: 0.667 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "primary_goal",
    content: "Primary Goal",
    startTime: 85.36,
    endTime: 91.84,
    position: { x: 0.372, y: 0.525 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "target_audience",
    content: "Target Audience",
    startTime: 85.36,
    endTime: 91.84,
    position: { x: 0.372, y: 0.58 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "41em",
      maxHeight: "4.3em",
      overflow: "hidden",
    },
  },
  {
    key: "pain_points",
    content: "Customer Pain Points",
    startTime: 85.36,
    endTime: 91.84,
    position: { x: 0.372, y: 0.664 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "41em",
      maxHeight: "4.3em",
      overflow: "hidden",
    },
  },
  {
    key: "offer_name",
    content: "Offer Name",
    startTime: 91.85,
    endTime: 95.03,
    position: { x: 0.372, y: 0.477 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_price",
    content: "3000",
    startTime: 91.85,
    endTime: 95.03,
    position: { x: 0.514, y: 0.477 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_description",
    content: "john.doe@example.com",
    startTime: 91.85,
    endTime: 95.03,
    position: { x: 0.372, y: 0.54 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "4.3em",
      overflow: "hidden",
    },
  },
  {
    key: "primary_benefits",
    content: "Benefits of AI Assistant",
    startTime: 91.85,
    endTime: 95.03,
    position: { x: 0.51, y: 0.54 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "4.3em",
      overflow: "hidden",
    },
  },
  {
    key: "offer_goal",
    content: "Offer goal",
    startTime: 91.85,
    endTime: 95.03,
    position: { x: 0.372, y: 0.635 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "4.3em",
      overflow: "hidden",
    },
  },
  {
    key: "Offer_topic",
    content: "Offer topic",
    startTime: 91.85,
    endTime: 95.03,
    position: { x: 0.51, y: 0.635 },
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
    startTime: 95.04,
    endTime: 98.3,
    position: { x: 0.38, y: 0.552 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "41em",
      maxHeight: "7em",
      overflow: "hidden",
    },
  },

  {
    key: "email_1",
    content: "",
    startTime: 179.7,
    endTime: 207.01,
    position: { x: 0.13, y: 0.3 },
    style: {
      color: "#252525",
      fontSize: "0.9em",
      maxWidth: "91em",
      maxHeight: "30em",
      overflow: "hidden",
    },
  },
  {
    key: "email_2",
    content: "",
    startTime: 207.01,
    endTime: 215.68,
    position: { x: 0.13, y: 0.3 },
    style: {
      color: "#252525",
      fontSize: "0.9em",
      maxWidth: "91em",
      maxHeight: "20em",
      overflow: "hidden",
    },
  },
  {
    key: "salesletter",
    content: "",
    startTime: 215.7,
    endTime: 230,
    position: { x: 0.24, y: 0.25 },
    style: {
      color: "#252525",
      fontSize: "0.9em",
      maxWidth: "62em",
      maxHeight: "28em",
      overflow: "hidden",
    },
  },
  {
    key: "company_name",
    content: "",
    startTime: 231.02,
    endTime: 242.07,
    position: { x: 0.33, y: 0.32 },
    style: { color: "#252525", fontSize: "0.6em", fontWeight: "500" },
  },
  {
    key: "Products_services",
    content: "",
    startTime: 231.02,
    endTime: 242.07,
    position: { x: 0.303, y: 0.37 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_price",
    content: "",
    startTime: 231.02,
    endTime: 242.07,
    position: { x: 0.303, y: 0.386 },
    style: { color: "#252525", fontSize: "0.6em", fontWeight: "600" },
  },
];

export const VideoOverlay: React.FC<VideoOverlayProps> = ({
  videoRef,
  videoContainerRef,
  webinarInjectionData,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

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
                  videoRef.current.currentTime >= item.startTime &&
                  videoRef.current.currentTime <= item.endTime
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
                  videoRef.current.currentTime >= item.startTime &&
                  videoRef.current.currentTime <= item.endTime
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

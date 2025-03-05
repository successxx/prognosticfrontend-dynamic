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
    startTime: 0.11, // When it should start showing (in seconds)
    endTime: 1.01, // When it should stop showing (in seconds)
    position: { x: 0.5, y: 0.5 }, // These are the estimated coordinates
    style: {
      color: "#131313",
      fontSize: "2em", // This would be 1.5% of the video width
      transform: "translate(-50%, -50%)",
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: "550",
      lineHeight: "1.5",
      textAlign: "center",
      maxWidth: "30em", // 30em = 30 × font size
      zIndex: "3",
    },
  },
  {
    key: "headline", // Use 'headline' to match the data field in your JSON
    content: "", // The content will be populated from webinarInjectionData
    startTime: 1.12, // When it should start showing (in seconds)
    endTime: 2.02, // When it should stop showing (in seconds)
    position: { x: 0.5, y: 0.5 }, // These are the estimated coordinates
    style: {
      color: "#131313",
      fontSize: "3em", // This would be 1.5% of the video width
      transform: "translate(-50%, -50%)",
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: "550",
      lineHeight: "1.5",
      textAlign: "center",
      maxWidth: "30em", // 30em = 30 × font size
      zIndex: "3",
    },
  },
  {
    key: "lead_email",
    content: "",
    startTime: 2.14,
    endTime: 3.01,
    position: { x: 0.573, y: 0.338 },
    style: {
      color: "#131313",
      fontSize: "0.7em",
      maxWidth: "20em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: 3.13,
    endTime: 4.01,
    position: { x: 0.042, y: 0.266 },
    style: {
      color: "#131313",
      fontSize: "0.6em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "offer_url",
    content: "123-456-7890",
    startTime: 3.13,
    endTime: 4.01,
    position: { x: 0.042, y: 0.305 },
    style: {
      color: "#131313",
      fontSize: "0.6em",
      maxWidth: "18em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "lead_email",
    content: "",
    startTime: 3.13,
    endTime: 4.01,
    position: { x: 0.042, y: 0.342 },
    style: {
      color: "#131313",
      fontSize: "0.6em",
      maxWidth: "18em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "website_url",
    content: "www.example.com",
    startTime: 5.12,
    endTime: 6.1,
    position: { x: 0.375, y: 0.607 },
    style: {
      color: "#131313",
      fontSize: "0.6em",
      maxWidth: "43em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "company_name",
    content: "",
    startTime: 10.12,
    endTime: 18.52,
    position: { x: 0.372, y: 0.52 },
    style: {
      color: "#131313",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "Industry",
    content: "",
    startTime: 10.12,
    endTime: 18.52,
    position: { x: 0.508, y: 0.52 },
    style: {
      color: "#131313",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "Products_services",
    content: "Improve efficiency, Tech companies, Time management",
    startTime: 10.12,
    endTime: 18.52,
    position: { x: 0.372, y: 0.585 },
    style: {
      color: "#131313",
      fontSize: "0.6em",
      maxWidth: "41em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "Business_description",
    content: "AI Agents, $99/month, 24/7 support, Boost productivity",
    startTime: 10.12,
    endTime: 18.52,
    position: { x: 0.372, y: 0.667 },
    style: {
      color: "#131313",
      fontSize: "0.6em",
      maxWidth: "41em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "primary_goal",
    content: "Primary Goal",
    startTime: 18.57,
    endTime: 22.48,
    position: { x: 0.372, y: 0.525 },
    style: {
      color: "#000000",
      fontSize: "0.6em",
      maxWidth: "43em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "target_audience",
    content: "Target Audience",
    startTime: 18.57,
    endTime: 22.48,
    position: { x: 0.372, y: 0.58 },
    style: {
      color: "#000000",
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
    startTime: 18.57,
    endTime: 22.48,
    position: { x: 0.372, y: 0.664 },
    style: {
      color: "#000000",
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
    startTime: 22.5,
    endTime: 24.5,
    position: { x: 0.37, y: 0.477 },
    style: {
      color: "#000000",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "offer_price",
    content: "3000",
    startTime: 22.5,
    endTime: 24.5,
    position: { x: 0.514, y: 0.477 },
    style: {
      color: "#000000",
      fontSize: "0.6em",
      maxWidth: "18em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "offer_description",
    content: "john.doe@example.com",
    startTime: 22.5,
    endTime: 24.5,
    position: { x: 0.37, y: 0.54 },
    style: {
      color: "#000000",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "primary_benefits",
    content: "Benefits of AI Agents",
    startTime: 22.5,
    endTime: 24.5,
    position: { x: 0.507, y: 0.54 },
    style: {
      color: "#000000",
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
    startTime: 22.5,
    endTime: 24.5,
    position: { x: 0.37, y: 0.634 },
    style: {
      color: "#000000",
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
    startTime: 22.5,
    endTime: 24.5,
    position: { x: 0.507, y: 0.634 },
    style: {
      color: "#000000",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "testimonials",
    content: "Testimonials",
    startTime: 24.57,
    endTime: 26.32,
    position: { x: 0.38, y: 0.552 },
    style: {
      color: "#000000",
      fontSize: "0.6em",
      maxWidth: "41em",
      maxHeight: "7em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "user_name",
    content: "",
    startTime: 26.32,
    endTime: 34.43,
    position: { x: 0.544, y: 0.182 },
    style: {
      color: "#2A2A2A",
      fontSize: "2.4em",
      textAlign: "left",
      transform: "translate(-50%, -50%)",
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: "525",
    },
  },
  {
    key: "salesletter",
    content: "",
    startTime: 26.32,
    endTime: 34.43,
    position: { x: 0.25, y: 0.25 },
    style: {
      color: "#000000",
      fontSize: "0.9em",
      maxWidth: "62em",
      maxHeight: "28em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
{
    key: "user_name",
    content: "",
    startTime: 34.5,
    endTime: 42.85,
    position: { x: 0.125, y: 0.081 },
    style: {
      color: "#000000",
      fontSize: "0.6em",
      fontWeight: "600",
      maxWidth: "30em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "email_1",
    content: "",
    startTime: 34.5,
    endTime: 38.59,
    position: { x: 0.13, y: 0.3 },
    style: {
      color: "#000000",
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
    startTime: 38.59,
    endTime: 42.85,
    position: { x: 0.13, y: 0.3 },
    style: {
      color: "#000000",
      fontSize: "0.9em",
      maxWidth: "81em",
      maxHeight: "20em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "headline", // Use 'headline' to match the data field in your JSON
    content: "", // The content will be populated from webinarInjectionData
    startTime: 46, // When it should start showing (in seconds)
    endTime: 54.1, // When it should stop showing (in seconds)
    position: { x: 0.099, y: 0.45 }, // These are the estimated coordinates
    style: {
      color: "#000000",
      fontSize: "1.5em", // This would be 1.5% of the video width
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: "500",
      lineHeight: "1.4",
      textAlign: "center",
      maxWidth: "30em", // 30em = 30 × font size
      zIndex: "3",
    },
  },
  {
    key: "headline", // Use 'headline' to match the data field in your JSON
    content: "", // The content will be populated from webinarInjectionData
    startTime: 112.6, // When it should start showing (in seconds)
    endTime: 133.26, // When it should stop showing (in seconds)
    position: { x: 0.625, y: 0.47 }, // These are the estimated coordinates
    style: {
      color: "#252525",
      fontSize: "2em", // This would be 1.5% of the video width
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: "550",
      lineHeight: "1.5",
      textAlign: "center",
      maxWidth: "15em", // 30em = 30 × font size
      zIndex: "3",
    },
  },
  {
    key: "lead_email",
    content: "",
    startTime: 306.17,
    endTime: 309.72,
    position: { x: 0.572, y: 0.338 },
    style: {
      color: "#252525",
      fontSize: "0.7em",
      maxWidth: "20em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: 310.87,
    endTime: 324,
    position: { x: 0.574, y: 0.437 },
    style: {
      color: "#252525",
      fontSize: "0.7em",
      maxWidth: "20em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: 335.18,
    endTime: 352.52,
    position: { x: 0.0415, y: 0.265 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "18em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "offer_url",
    content: "123-456-7890",
    startTime: 338.2,
    endTime: 352.52,
    position: { x: 0.042, y: 0.305 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "18em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "lead_email",
    content: "",
    startTime: 342.19,
    endTime: 352.52,
    position: { x: 0.042, y: 0.341 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "18em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "website_url",
    content: "www.example.com",
    startTime: 363.32,
    endTime: 365.62,
    position: { x: 0.372, y: 0.607 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "43em",
      maxHeight: "4.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "company_name",
    content: "",
    startTime: 370.6,
    endTime: 379.2,
    position: { x: 0.372, y: 0.52 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "Industry",
    content: "",
    startTime: 370.6,
    endTime: 379.2,
    position: { x: 0.508, y: 0.52 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "Products_services",
    content: "Improve efficiency, Tech companies, Time management",
    startTime: 370.6,
    endTime: 379.2,
    position: { x: 0.372, y: 0.585 },
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
    key: "Business_description",
    content: "AI Agents, $99/month, 24/7 support, Boost productivity",
    startTime: 370.6,
    endTime: 379.2,
    position: { x: 0.372, y: 0.667 },
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
    key: "primary_goal",
    content: "Primary Goal",
    startTime: 379.21,
    endTime: 385.7,
    position: { x: 0.372, y: 0.525 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "43em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "target_audience",
    content: "Target Audience",
    startTime: 379.3,
    endTime: 385.7,
    position: { x: 0.372, y: 0.579 },
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
    startTime: 379.3,
    endTime: 385.7,
    position: { x: 0.372, y: 0.662 },
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
    startTime: 385.75,
    endTime: 388,
    position: { x: 0.37, y: 0.477 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "20em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "offer_price",
    content: "3000",
    startTime: 385.75,
    endTime: 388,
    position: { x: 0.514, y: 0.477 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "18em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "offer_description",
    content: "john.doe@example.com",
    startTime: 385.75,
    endTime: 388,
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
    content: "Benefits of AI Agents",
    startTime: 385.75,
    endTime: 388,
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
    startTime: 385.75,
    endTime: 388,
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
    startTime: 385.75,
    endTime: 388,
    position: { x: 0.507, y: 0.634 },
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
    key: "testimonials",
    content: "Testimonials",
    startTime: 388,
    endTime: 391.7,
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
    key: "user_name",
    content: "",
    startTime: 470.1,
    endTime: 509.57,
    position: { x: 0.125, y: 0.081 },
    style: {
      color: "#000000",
      fontSize: "0.6em",
      fontWeight: "600",
      maxWidth: "30em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "email_1",
    content: "",
    startTime: 473.69,
    endTime: 502.7,
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
    startTime: 502.7,
    endTime: 509.67,
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
    startTime: 509.77,
    endTime: 523.59,
    position: { x: 0.243, y: 0.25 },
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
    startTime: 524.95,
    endTime: 538.46,
    position: { x: 0.33, y: 0.325 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      fontWeight: "500",
      maxWidth: "18em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
  },
  {
    key: "Products_services",
    content: "",
    startTime: 524.95,
    endTime: 538.46,
    position: { x: 0.303, y: 0.37 },
    style: {
      color: "#252525",
      fontSize: "0.6em",
      maxWidth: "18em",
      maxHeight: "1.3em",
      overflow: "hidden",
      textAlign: "left",
    },
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
    return (
      key === "email_1" ||
      key === "email_2" ||
      key === "salesletter" ||
      key === "headline"
    );
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

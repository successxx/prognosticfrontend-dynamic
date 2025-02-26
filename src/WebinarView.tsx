import React, { useEffect, useRef, useState } from "react";
import styles from "./WebinarView.module.css";
import { VideoOverlay } from "./VideoOverlay";
import { VideoClock } from "./VideoClock";

import demoVideo from "../public/demo with ai injection.mp4";

export interface IWebinarInjection {
  Business_description: string;
  Industry: string;
  Offer_topic: string;
  Products_services: string;
  audio_link: string;
  audio_link_two: string;
  company_name: string;
  email_1: string;
  email_2: string;
  user_name: string;
  lead_email: string;
  exit_message: string;
  headline: string;
  offer_description: string;
  offer_goal: string;
  offer_name: string;
  offer_price: string;
  offer_url: string;
  pain_points: string;
  primary_benefits: string;
  primary_goal: string;
  salesletter: string;
  target_audience: string;
  target_url: string;
  website_url: string;
  testimonials: string;
}

/**
 * Minimal WebinarView:
 * - Only a video
 * - One button: "Start Your Free 18-Day Trial" -> https://try.clients.ai
 * - All other overlays / chat / exit-intent have been removed
 */
const WebinarView: React.FC = () => {
  // Webinar Injection data state
  const [webinarInjectionData, setWebinarInjectionData] =
    useState<IWebinarInjection>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // If you eventually re-add audio or injection logic, you can put them here.

  // =====================================================
  // 1) On Mount: fetch overly data
  // =====================================================
 // =====================================================
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const userEmail = params.get("user_email");

  if (userEmail) {
    (async () => {
      try {
        const resp = await fetch(
          `https://prognostic-ai-backend.herokuapp.com/get_user_two`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_email: userEmail }),
          }
        );
        if (!resp.ok) throw new Error("Error fetching user data");
        const data = await resp.json();
        setWebinarInjectionData(data);
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    })();
  }
}, []);

console.log("webinar", videoRef.current?.currentTime);


  return (
    <div className={styles.container} style={{ textAlign: "center" }}>
      {/* 1) The video */}
      <div ref={videoWrapperRef} className={styles.videoWrapper}>
        {/* Overlay items */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />

        {/* Mac like clock */}
        <VideoClock videoContainerRef={videoWrapperRef} />
        <video
          ref={videoRef}
          autoPlay
          controls
          playsInline
          className={styles.videoPlayer}
        >
          <source src={demoVideo} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      </div>

      {/* 2) The call-to-action button */}
      <div>
        <button
          onClick={() => window.open("https://try.clients.ai", "_blank")}
          style={{
            backgroundColor: "#252525",
            color: "#fff",
            border: "none",
            padding: "16px 32px",
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Start Your Free 18-Day Trial
        </button>
      </div>
    </div>
  );
};

export default WebinarView;

import React from "react";
import styles from "./WebinarView.module.css"; 

/** 
 * Minimal WebinarView:
 * - Only a video
 * - One button: "Start Your Free 18-Day Trial" -> https://try.clients.ai
 * - All other overlays / chat / exit-intent have been removed
 */
const WebinarView: React.FC = () => {
  // If you eventually re-add audio or injection logic, you can put them here.

  return (
    <div className={styles.container} style={{ textAlign: "center" }}>
      {/* 1) The video */}
      <div style={{ marginBottom: "24px" }}>
        <video
          autoPlay
          controls
          playsInline
          style={{ width: "100%", maxWidth: "800px", borderRadius: "6px" }}
        >
          <source
            src="https://paivid.s3.us-east-2.amazonaws.com/homepage222.mp4"
            type="video/mp4"
          />
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

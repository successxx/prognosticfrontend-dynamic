/*******************************************************
6) VIDEOOVERLAY
*******************************************************/
function VideoOverlay({ videoRef, videoContainerRef, webinarInjectionData }) {
  const [currentTime, setCurrentTime] = React.useState(0);
  const overlayRef = React.useRef(null);
  const rafId = React.useRef(null);

// Your overlay data from user:
const overlayItems: OverlayItem[] = [
  {
    key: "lead_email",
    content: "",
    startTime: 262.79,
    endTime: 266.38,
    position: { x: 0.573, y: 0.338 },
    style: { color: "#252525", fontSize: "0.7em" },
  },
  {
    key: "user_name",
    content: "John Doe",
    startTime: 267.64,
    endTime: 280.66,
    position: { x: 0.573, y: 0.44 },
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
    startTime: 299.00,
    endTime: 308.77,
    position: { x: 0.043, y: 0.34 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "website_url",
    content: "www.example.com",
    startTime: 319.78,
    endTime: 322.54,
    position: { x: 0.372, y: 0.608 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "company_name",
    content: "",
    startTime: 326.88,
    endTime: 335.95,
    position: { x: 0.372, y: 0.52 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Industry",
    content: "",
    startTime: 326.88,
    endTime: 335.95,
    position: { x: 0.508, y: 0.52 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Products_services",
    content: "Improve efficiency, Tech companies, Time management",
    startTime: 326.88,
    endTime: 335.95,
    position: { x: 0.372, y: 0.585 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "Business_description",
    content: "AI Assistant, $99/month, 24/7 support, Boost productivity",
    startTime: 326.88,
    endTime: 335.95,
    position: { x: 0.372, y: 0.667 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "primary_goal",
    content: "Primary Goal",
    startTime: 335.96,
    endTime: 342.32,
    position: { x: 0.372, y: 0.525 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "target_audience",
    content: "Target Audience",
    startTime: 335.96,
    endTime: 342.32,
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
    startTime: 335.96,
    endTime: 342.32,
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
    endTime: 345.63,
    position: { x: 0.37, y: 0.477 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_price",
    content: "3000",
    startTime: 342.45,
    endTime: 345.63,
    position: { x: 0.514, y: 0.477 },
    style: { color: "#252525", fontSize: "0.6em" },
  },
  {
    key: "offer_description",
    content: "john.doe@example.com",
    startTime: 342.45,
    endTime: 345.63,
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
    endTime: 345.63,
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
    endTime: 345.63,
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
    endTime: 345.63,
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

const updatedOverlayItems = React.useMemo(() => {
    if (!webinarInjectionData) return [];
    return overlayItems.map((item) => ({
      ...item,
      content: webinarInjectionData[item.key]?.trim() ?? "",
    }));
  }, [webinarInjectionData]);

  React.useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    function updateTime() {
      setCurrentTime(videoEl.currentTime);
      rafId.current = requestAnimationFrame(updateTime);
    }
    rafId.current = requestAnimationFrame(updateTime);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [videoRef]);

  React.useEffect(() => {
    function updateOverlaySize() {
      if (videoContainerRef.current && overlayRef.current) {
        const { width, height } = videoContainerRef.current.getBoundingClientRect();
        overlayRef.current.style.setProperty("--overlay-width", ${width}px);
        overlayRef.current.style.setProperty("--overlay-height", ${height}px);
      }
    }
    updateOverlaySize();
    window.addEventListener("resize", updateOverlaySize);
    return () => window.removeEventListener("resize", updateOverlaySize);
  }, [videoContainerRef]);

  function embeddableInjection(key) {
    // if key is "email_1","email_2","salesletter", etc.
    return key === "email_1" || key === "email_2" || key === "salesletter";
  }

  return (
    <div ref={overlayRef} className="video-overlay">
      {updatedOverlayItems.map((item, index) => {
        const isVisible = currentTime >= item.startTime && currentTime <= item.endTime;
        if (!videoRef.current) return null;

        if (embeddableInjection(item.key)) {
          return (
            <div
              key={index}
              className={overlay-item ${isVisible ? "visible" : ""}}
              style={{
                ...item.style,
                left: ${item.position.x * 100}%,
                top: ${item.position.y * 100}%,
              }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          );
        } else {
          return (
            <div
              key={index}
              className={overlay-item ${isVisible ? "visible" : ""}}
              style={{
                ...item.style,
                left: ${item.position.x * 100}%,
                top: ${item.position.y * 100}%,
              }}
            >
              {item.content}
            </div>
          );
        }
      })}
    </div>
  );
}

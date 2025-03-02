function WebinarView() {
  const videoRef = React.useRef(null);
  const videoWrapperRef = React.useRef(null);
  const audioRef = React.useRef(null);

  // exit-intent
  const [showExitOverlay, setShowExitOverlay] = React.useState(false);
  const [hasShownOverlay, setHasShownOverlay] = React.useState(false);
  const [exitMessage, setExitMessage] = React.useState("");

  // user clicked to unmute
  const [hasInteracted, setHasInteracted] = React.useState(false);

  // injection data from server
  const [webinarInjectionData, setWebinarInjectionData] = React.useState(null);

  // clock
  const [showClockWidget, setShowClockWidget] = React.useState(false);
  const [clockDragInComplete, setClockDragInComplete] = React.useState(false);
  const [clockRemoved, setClockRemoved] = React.useState(false);

  // headline
  const [showHeadline, setShowHeadline] = React.useState(false);

  // 1) Load user data
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("user_email");

    if (userEmail) {
      fetch("https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_user_two", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: userEmail }),
      })
        .then((resp) => {
          if (!resp.ok) throw new Error("Error fetching user data");
          return resp.json();
        })
        .then((data) => {
          setWebinarInjectionData(data);
          if (audioRef.current && data.audio_link) {
            audioRef.current.src = data.audio_link;
          }
          if (data.exit_message) {
            setExitMessage(data.exit_message);
          }
        })
        .catch((err) => console.error("Error loading user data:", err));
    }
  }, []);

  // 2) Voice injection at 0.5s
  React.useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !audioRef.current) return;
    function handleTime() {
      if (vid.currentTime >= 0.5) {
        audioRef.current.play().catch((err) => console.warn("Voice injection blocked:", err));
        vid.removeEventListener("timeupdate", handleTime);
      }
    }
    vid.addEventListener("timeupdate", handleTime);
    return () => vid.removeEventListener("timeupdate", handleTime);
  }, []);

  // 3) Freed scrubbing => no skip prevention

  // 4) Exit-intent
  React.useEffect(() => {
    if (hasShownOverlay) return;
    function handleMouseMove(e) {
      const threshold = window.innerHeight * 0.1;
      if (e.clientY < threshold) {
        setShowExitOverlay(true);
        setHasShownOverlay(true);
      }
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasShownOverlay]);

  // 5) Clock => show @4s, hide @8s
  React.useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function clockCheck() {
      const t = vid.currentTime;
      if (!showClockWidget && t >= 4) {
        setShowClockWidget(true);
      }
      if (!clockRemoved && t >= 8) {
        setClockRemoved(true);
      }
    }
    vid.addEventListener("timeupdate", clockCheck);
    return () => vid.removeEventListener("timeupdate", clockCheck);
  }, [showClockWidget, clockRemoved]);

  // once removed => hide fully after 1s
  React.useEffect(() => {
    if (clockRemoved) {
      const timer = setTimeout(() => {
        setShowClockWidget(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [clockRemoved]);

  // 6) Headline @45.04–55.04
  React.useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    function headlineCheck() {
      const t = vid.currentTime;
      if (t >= 45.04 && t < 55.04) {
        setShowHeadline(true);
      } else {
        setShowHeadline(false);
      }
    }
    vid.addEventListener("timeupdate", headlineCheck);
    return () => vid.removeEventListener("timeupdate", headlineCheck);
  }, []);

  return (
    <div className="container" style={{ textAlign: "center" }}>
      {/* Hidden audio */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Exit-intent */}
      {showExitOverlay &&
        ReactDOM.createPortal(
          <ExitOverlay message={exitMessage} onClose={() => setShowExitOverlay(false)} />,
          document.body
        )}

      {/* The video container */}
      <div ref={videoWrapperRef} className="videoWrapper">
        {/* Overlays */}
        <VideoOverlay
          videoRef={videoRef}
          videoContainerRef={videoWrapperRef}
          webinarInjectionData={webinarInjectionData}
        />

        {/* The top menu bar clock, if you have it: */}
        <VideoClock videoContainerRef={videoWrapperRef} />

        <video
          ref={videoRef}
          controls
          playsInline
          muted={!hasInteracted}
          className="videoPlayer"
        >
          <source
            src="https://progwebinar.blob.core.windows.net/video/clientsaidemovid.mp4"
            type="video/mp4"
          />
          Your browser does not support HTML5 video.
        </video>

        {/* Sound overlay => unmute */}
        {!hasInteracted && (
          <div
            className="soundOverlay"
            onClick={() => {
              setHasInteracted(true);
              if (videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.play().catch((err) => {
                  console.warn("Play blocked by browser:", err);
                });
              }
            }}
          >
            <div className="soundIcon">🔊</div>
            <div className="soundText">Click to watch your AI agents</div>
          </div>
        )}

        {/* The clock widget (4s–8s) */}
        {showClockWidget && (
          <div
            className={
              "clockWidget " +
              (clockRemoved ? "animateOut" : clockDragInComplete ? "wobble" : "animateIn")
            }
            onAnimationEnd={(e) => {
              if (e.animationName.includes("dragIn")) {
                setClockDragInComplete(true);
              }
            }}
          >
            <div className="widgetHeader">
              <div className="windowControls">
                <div className="windowButton closeButton" />
                <div className="windowButton minimizeButton" />
                <div className="windowButton maximizeButton" />
              </div>
              <div className="widgetTitle">Clock Widget</div>
            </div>
            <ClockWidgetContent />
          </div>
        )}

        {/* Headline */}
        {showHeadline && webinarInjectionData?.headline && (
          <div
            className="headlineText"
            style={{
              fontFamily: "'SF Pro Display', sans-serif",
              letterSpacing: "0.02em",
              lineHeight: "1.1",
              color: "#252525",
            }}
          >
            {webinarInjectionData.headline}
          </div>
        )}
      </div>

      {/* CTA button below */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => window.open("https://webinar.clients.ai", "_blank")}
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
          Join The Next AI Agent Training
        </button>
      </div>

      {/* Footer or text */}
      <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
        © {new Date().getFullYear()} Clients.ai
      </p>
    </div>
  );
}

/*******************************************************
8) CLOCKWIDGETCONTENT
*******************************************************/
function ClockWidgetContent() {
  const [timeString, setTimeString] = React.useState("");
  const [dateString, setDateString] = React.useState("");

  React.useEffect(() => {
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
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="widgetContent">
      <div className="clockTime">{timeString}</div>
      <div className="clockDate">{dateString}</div>
    </div>
  );
}

/*******************************************************
9) EXITOVERLAY (for exit-intent bubble)
*******************************************************/
function ExitOverlay({ message, onClose }) {
  const defaultMsg = "Wait! Are you sure you want to leave?";
  return ReactDOM.createPortal(
    <div className="exitOverlay" onClick={onClose}>
      <div className="iphoneMessageBubble" onClick={(e) => e.stopPropagation()}>
        <button className="exitCloseBtn" onClick={onClose}>
          ×
        </button>
        <div className="iphoneSender">Selina</div>
        <div className="iphoneMessageText">
          {message && message.trim() ? message : defaultMsg}
        </div>
      </div>
    </div>,
    document.body
  );
}

/*******************************************************
10) VIDEO CLOCK AT TOP? (If you want the Mac-like bar)
*******************************************************/
function VideoClock({ videoContainerRef }) {
  // If you had a top bar clock, replicate logic. For now, no-op:
  return null;
}

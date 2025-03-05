import React, { useState, useEffect } from "react";
import Header from "./Header";
import WebinarView from "./WebinarView";
import StreakCounter from "./StreakCounter";
import Fireworks from "./Fireworks";
import "./index.css";
import LoadingCircle from "./LoadingCircle";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";


const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);

  // Example streak (if you still want the streak logic)
  const [streak] = useState<number>(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("user_email");

    // If no user_email in the query string, show an error and skip polling
    if (!userEmail) {
      setError("Please provide your email to access the webinar.");
      setLoading(false);
      return;
    }

    // We stay in "loading" state until the backend confirms data exists
    setLoading(true);

    // Poll /get_user_two every 3 seconds to see if data is ready
    const intervalId = setInterval(async () => {
      try {
        const resp = await fetch(
          "https://prognostic-ai-backend-acab284a2f57.herokuapp.com/get_user_two",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_email: userEmail }),
          }
        );

        // If response is 200 and JSON says success: true, we assume data is ready
        if (resp.ok) {
          const data = await resp.json();
          if (data.success === true) {
            // Data found, so we can stop loading
            setLoading(false);
            setIsContentVisible(true);
            clearInterval(intervalId);
          } else {
            // success: false or 404 means "not found" - keep polling
            console.log("Data not ready yet, continuing to poll...");
          }
        } else {
          // Could be 404, 400, etc. We just keep polling unless you prefer to stop
          console.log("Still not ready or 4xx error. Continuing to poll...");
        }
      } catch (err) {
        console.error("Polling error:", err);
        // You could optionally stop polling on error:
        // clearInterval(intervalId);
        // setError("Backend error while polling for data.");
        // setLoading(false);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="wrapper py-4">
      <Header />
      {loading ? (
        <>
          <LoadingCircle />
        </>
      ) : (
        <>
          {error ? (
            <p className="content-box text-center">{error}</p>
          ) : (
            <div className="d-flex flex-column w-100 justify-content-center">
              <div
                className={`d-flex w-100 justify-content-center fade-in ${
                  isContentVisible ? "visible" : ""
                }`}
              >
                {/* Show the actual webinar/video once we're done loading */}
                <WebinarView />
                <Fireworks />
              </div>
              <div className="streak-container row justify-content-center mt-5">
                <div className="col-12 col-sm-6 text-center">
                  <StreakCounter streak={streak} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <Footer isFooterVisible={true} />
    </div>
  );
};

export default App;

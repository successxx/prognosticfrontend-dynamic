import React, { useState, useEffect } from "react";
import Header from "./Header";
import WebinarView from "./WebinarView";
import StreakCounter from "./StreakCounter";
import Fireworks from "./Fireworks";
import "./index.css";
import LoadingCircle from "./LoadingCircle";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);

  // Example streak
  const [streak] = useState<number>(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("user_email");

    // If no user_email in the query string, show an error
    if (!userEmail) {
      setError("Please provide your email to access the webinar.");
      setLoading(false);
      return;
    }

    // Remain in "loading" until the backend confirms data
    setLoading(true);

    // Poll /get_user_two every 3 seconds
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

        if (resp.ok) {
          const data = await resp.json();
          if (data.success === true) {
            // Data found, stop loading
            setLoading(false);
            setIsContentVisible(true);
            clearInterval(intervalId);
          } else {
            console.log("Data not ready yet, continuing to poll...");
          }
        } else {
          // Possibly a 404 or 4xx
          console.log("Still not ready or 4xx error. Continuing to poll...");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="wrapper py-4">
      {/* We want the logo smaller & centered => 
          adjust the "Header" component’s styling accordingly (the user can do so in Header.tsx).
          Also removed the <hr> that was between the header and video. */}
      <Header />

      {/* Remove <hr id="divider02" className="hr-custom" /> so there's no divider */}
      {/* <hr id="divider02" className="hr-custom" /> -- REMOVED */}

      {loading ? (
        <>
          <LoadingCircle />
          <p id="text07" className="style1">
            © {new Date().getFullYear()} Clients.ai
          </p>
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
                {/* Show the actual webinar/video once done loading */}
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
    </div>
  );
};

export default App;

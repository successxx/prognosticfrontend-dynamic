import React, { useState, useEffect } from "react";
import Header from "./Header";
import WebinarView from "./WebinarView";
import StreakCounter from "./StreakCounter"; // If you still want a simple streak
import Fireworks from "./Fireworks";         // If you want fireworks, keep it
import "./index.css";
import LoadingCircle from "./LoadingCircle";
import "bootstrap/dist/css/bootstrap.min.css";

/** Minimal App with no waiting room. */
const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);

  // Example streak
  const [streak] = useState<number>(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("user_email");

    // 1) Validate user email param
    if (!userEmail) {
      setError("Please provide your email to access the webinar.");
      setLoading(false);
      return;
    }

    // 2) Just show webinar immediately
    setLoading(false);
    setIsContentVisible(true);
  }, []);

  return (
    <div className="wrapper py-4">
      <Header />
      <hr id="divider02" className="hr-custom" />

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
                <WebinarView />
                {/* If you want fireworks, keep this: */}
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

import React, { useState, useEffect } from "react";
import Header from "./Header";
import WebinarView from "./WebinarView";
import StreakCounter from "./StreakCounter";
import Fireworks from "./Fireworks";
import "./index.css";
import LoadingCircle from "./LoadingCircle";
import "bootstrap/dist/css/bootstrap.min.css";

/** (Optional) If you still want to wait until the next quarter hour to show, keep this. 
    Otherwise, you can remove the entire function and usage. */
function getMsUntilNextQuarterHour(): number {
  const now = new Date();
  const nextQ = new Date(
    Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000)
  );
  return nextQ.getTime() - now.getTime();
}

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);
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

    // 2) (Optional) If you want to wait until next quarter hour:
    const msLeft = getMsUntilNextQuarterHour();

    // If it’s already the quarter hour or beyond, show webinar immediately
    if (msLeft <= 0) {
      setLoading(false);
      setIsContentVisible(true);
      return;
    }

    // Otherwise, show webinar after the timer completes
    setLoading(false);

    const timerId = setTimeout(() => {
      setIsContentVisible(true);
    }, msLeft);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className="wrapper py-4">
      <Header />
      <hr id="divider02" className="hr-custom" />

      {loading ? (
        <>
          <LoadingCircle />
          <p id="text07" className="style1">
            © 2025 Clients.ai
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

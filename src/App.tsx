/* App.tsx
   This orchestrates the “loading page” + final video page (WebinarView).
*/

import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WebinarView from "./WebinarView";
import StreakCounter from "./StreakCounter";
import Fireworks from "./Fireworks";
import LoadingCircle from "./LoadingCircle";

import "./index.css"; // Global styles
// If your bundler uses separate .module.css, you can import them as well

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);

  // Example streak
  const [streak] = useState<number>(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("user_email");

    // If no user_email, show error
    if (!userEmail) {
      setError("Please provide your email to access the webinar.");
      setLoading(false);
      return;
    }

    // We remain in "loading" until the backend confirms data
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
            setLoading(false);
            setIsContentVisible(true);
            clearInterval(intervalId);
          } else {
            console.log("Data not ready yet, continuing to poll...");
          }
        } else {
          // Possibly 404 or 4xx
          console.log("Still not ready or 4xx. continuing to poll...");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* We'll show a smaller + centered logo up top via <Header /> */}
      <Header />

      {loading ? (
        <LoadingCircle />
      ) : (
        <>
          {error ? (
            <p className="content-box text-center">{error}</p>
          ) : (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className={`fade-in ${isContentVisible ? "visible" : ""}`}>
                <WebinarView />
                <Fireworks />
              </div>
              <div className="streak-container row justify-content-center mt-5" style={{ position: "relative" }}>
                <div className="col-12 col-sm-6 text-center" style={{ position: "relative" }}>
                  <StreakCounter streak={streak} />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Possibly place your Footer at the bottom */}
      <Footer isFooterVisible={!loading && !error} />
    </div>
  );
};

export default App;

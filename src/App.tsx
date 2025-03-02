import React, { useEffect, useState } from "react";
import LoadingIndicator from "./LoadingCircle";
import WebinarView from "./WebinarView";
import Header from "./Header";
import Footer from "./Footer";
import Fireworks from "./Fireworks";
import StreakCounter from "./StreakCounter";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [streak] = useState(1);

  // Simulate a loading period (10 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setIsContentVisible(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="wrapper py-4">
      <Header />
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <p style={{ textAlign: "center" }}>{error}</p>
      ) : (
        <>
          {isContentVisible && (
            <div className="d-flex w-100 justify-content-center fade-in visible">
              <WebinarView />
              <Fireworks />
            </div>
          )}
          <div className="streak-container row justify-content-center mt-5">
            <div className="col-12 col-sm-6 text-center">
              <StreakCounter streak={streak} />
            </div>
          </div>
        </>
      )}
      <Footer isFooterVisible={!loading} />
    </div>
  );
}

export default App;

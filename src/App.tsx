import React, { useEffect, useState } from "react";
import LoadingIndicator from "./LoadingCircle";
import WebinarView from "./WebinarView";
import StreakCounter from "./StreakCounter";
import Fireworks from "./Fireworks";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Demo App:
 * 1) Show LoadingIndicator first.
 * 2) After X seconds (or after some data condition), hide LoadingIndicator and show WebinarView.
 * 3) Show optional StreakCounter and Fireworks as demonstration.
 */
const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [streak] = useState(1);

  useEffect(() => {
    // Mock a short async process
    const timer = setTimeout(() => {
      setLoading(false);
      setIsContentVisible(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div style={{ textAlign: "center" }}>{error}</div>;
  }

  return (
    <div className="wrapper">
      <Header />
      {isContentVisible && (
        <div style={{ position: "relative" }}>
          <WebinarView />
          <Fireworks />
          <StreakCounter streak={streak} />
        </div>
      )}
      <Footer isFooterVisible={true} />
    </div>
  );
};

export default App;

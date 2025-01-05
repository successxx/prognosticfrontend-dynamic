import React, { useState, useEffect } from 'react';
import Header from './Header';
import WebinarView from './WebinarView';
import StreakCounter from './StreakCounter';
import Fireworks from './Fireworks';
import './index.css';
import LoadingCircle from './LoadingCircle';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your new React-based waiting room component
import WaitingRoom from './WaitingRoom';

/** Returns how many milliseconds remain until the next quarter hour (15/30/45/60) */
function getMsUntilNextQuarterHour(): number {
  const now = new Date();
  const nextQ = new Date(
    Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000)
  );
  return nextQ.getTime() - now.getTime();
}

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);
  const [showWaitingRoom, setShowWaitingRoom] = useState<boolean>(true); // NEW
  const [streak] = useState<number>(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('user_email');

    // 1) Validate user email param
    if (!userEmail) {
      setError('Please provide your email to access the webinar.');
      setLoading(false);
      return;
    }

    // 2) Compute how many ms remain until next quarter hour
    const msLeft = getMsUntilNextQuarterHour();

    // 3) If it’s already past or exactly the quarter hour, we skip WaitingRoom
    if (msLeft <= 0) {
      // Show immediate webinar
      setShowWaitingRoom(false);
      setLoading(false);
      setIsContentVisible(true);

      return;
    }

    // 4) If next quarter hour not yet reached => show waiting room
    //    Once time passes, hide waiting room and show webinar
    setShowWaitingRoom(true);
    setLoading(false); // We’re done “loading”—the user sees waiting room

    const timerId = setTimeout(() => {
      // Quarter hour arrived => hide waiting room, show webinar
      setShowWaitingRoom(false);
      setIsContentVisible(true);
    }, msLeft);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div id="wrapper" className="container-fluid d-flex flex-column" style={{ minHeight: '100vh' }}>
      <div id="main" className="row justify-content-center flex-grow-1">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="inner">
            <div id="container6" className="style1 container default flex-grow-1">
              <div className="wrapper">
                <div className="inner">
                  <Header />
                  <hr id="divider02" className="hr-custom" />

                  {/* 1) If we’re still “loading,” show spinner + maybe brand text */}
                  {loading ? (
                    <>
                      <LoadingCircle />
                      <p id="text07" className="style1">
                        © 2024 PrognosticAI
                      </p>
                    </>
                  ) : (
                    <>
                      {/* 2) If we have an error, show it */}
                      {error ? (
                        <p className="content-box text-center">{error}</p>
                      ) : (
                        <>
                          {/* 3) If showWaitingRoom is TRUE, show your waiting room */}
                          {showWaitingRoom ? (
                            <WaitingRoom />
                          ) : (
                            // 4) Otherwise, show the actual webinar code
                            <div className={`fade-in ${isContentVisible ? 'visible' : ''}`}>
                              <div className="container">
                                <div className="row">
                                  <div className="col-12">
                                    <WebinarView />
                                  </div>
                                </div>
                                <div className="row justify-content-center mt-4">
                                  <div className="col-12 col-sm-6 text-center">
                                    <StreakCounter streak={streak} />
                                  </div>
                                </div>
                              </div>
                              <Fireworks />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import Header from './Header';
import WebinarView from './WebinarView';
import StreakCounter from './StreakCounter';
import Fireworks from './Fireworks';
import './index.css';
import LoadingCircle from './LoadingCricle.tsx';
import Footer from './Footer.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [isContentVisible, setIsContentVisible] = useState<boolean>(false);
    const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false);
    const [streak] = useState<number>(1); // Keep streak but set static value

    // Simplified useEffect - just show webinar after countdown
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const user_email = params.get('user_email');
        
        if (!user_email) {
            setError("Please provide your email to access the webinar.");
            setLoading(false);
            return;
        }

        // Show content after a short delay
        setTimeout(() => {
            setLoading(false);
            setIsContentVisible(true);
            
            // Show footer after content
            setTimeout(() => {
                setIsFooterVisible(true);
            }, 7000);
        }, 1000);
    }, []);

    return (
        <div id="wrapper" className="container-fluid d-flex flex-column" style={{minHeight: '100vh'}}>
            <div id="main" className="row justify-content-center flex-grow-1">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="inner">
                        <div id="container6" className="style1 container default flex-grow-1">
                            <div className="wrapper">
                                <div className="inner">
                                    <Header/>
                                    <hr id="divider02" className="hr-custom"/>
                                    {loading ? (
                                        <>
                                            <LoadingCircle/>
                                            <p id="text07" className="style1">© 2024 PrognosticAI</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className={`fade-in ${isContentVisible ? 'visible' : ''}`}>
                                                <div className="container">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            {error ? (
                                                                <p className="content-box text-center">{error}</p>
                                                            ) : (
                                                                <WebinarView />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="row justify-content-center mt-4">
                                                        <div className="col-12 col-sm-6 text-center">
                                                            <StreakCounter streak={streak}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Fireworks/>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Footer isFooterVisible={isFooterVisible}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;

import React, {useEffect, useRef, useState} from 'react';
import Header from './Header';
import TypedContent from './TypedContent';
import StreakCounter from './StreakCounter';
import PrognosticButton from './PrognosticButton';
import Fireworks from './Fireworks';
import './index.css';
import LoadingCircle from './LoadingCricle.tsx';
import Footer from './Footer.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [streak, setStreak] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const pollingIntervalId = useRef<number | null>(null); // For polling interval
    const fetching = useRef<boolean>(false); // To prevent multiple concurrent requests
    const timeoutId = useRef<number | null>(null); // For the 60 seconds timeout
    const delayTimeoutId = useRef<number | null>(null); // For the 10 seconds delay

    useEffect(() => {
        startPolling()
        // Cleanup function to stop polling and clear timers when component unmounts
        return () => {
            stopPolling();
            if (delayTimeoutId.current) {
                clearTimeout(delayTimeoutId.current);
            }
        };
    }, []);

    // Function to start the polling
    const startPolling = () => {
        setLoading(true); // Start loading animation

        // 60-second timeout after which we stop polling and show an error message
        timeoutId.current = window.setTimeout(() => {
            stopPolling();
            setError("We couldn't process your request. Please contact us via email if you're interested in our solution.");
            setLoading(false);
        }, 60000); // Timeout after 60 seconds

        // Start polling every 5 seconds
        pollingIntervalId.current = window.setInterval(() => {
            fetchContent();
        }, 5000); // Poll every 5 seconds
    };

    // Function to stop polling
    const stopPolling = () => {
        if (pollingIntervalId.current !== null) {
            clearInterval(pollingIntervalId.current);
        }
        if (timeoutId.current !== null) {
            clearTimeout(timeoutId.current);
        }
    };

    // Fetch content from the API
    const fetchContent = async (): Promise<string | null> => {
        if (fetching.current) return null; // Skip if already fetching

        fetching.current = true; // Prevent concurrent fetches

        try {
            const API_BASE =
                window.location.hostname === 'localhost'
                    ? 'http://127.0.0.1:5000'
                    : 'https://prognostic-ai-backend-acab284a2f57.herokuapp.com';

            const params = new URLSearchParams(window.location.search);
            const userId = params.get('userID');
            if (!userId) {
                // Immediately show error if userId is not present
                setError("It seems like you're trying to retrieve your previous results. Please restart the process to generate new results. If you need assistance, feel free to contact our support team.");
                setLoading(false);
                return null;
            }

            const response = await fetch(`${API_BASE}/get_user/${userId}`);
            if (!response.ok) {
                if (response.status === 403) {
                    console.error("CORS issue detected");
                    throw new Error(`CORS error! status: ${response.status}`);
                } else if (response.status === 404) {
                    // Continue polling when status is 404
                    return null;
                } else if (response.status >= 500) {
                    throw new Error(`Server error! status: ${response.status}`);
                }
            }

            const data = await response.json();

            if (data?.text) {
                setContent(data.text);
                setStreak(prevStreak => prevStreak + 1);
                stopPolling(); // Stop polling once content is fetched
                setLoading(false); // Stop loading animation
                return data.text;
            } else {
                console.warn('No text content found in the response');
                return null;
            }
        } catch (error) {
            console.error('Error fetching content:', error);
            setContent('Error fetching AI response. Please try again later.');
            setLoading(false);
            stopPolling(); // Stop polling in case of an error
            return null;
        } finally {
            fetching.current = false; // Reset fetching flag
        }
    };

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
                                        <LoadingCircle/>
                                    ) : (
                                        <>
                                            <h1 id="text02" className="text-center">
                                                <span className="p">
                                                    Try Prognostic<mark>AI</mark>
                                                    {' '}
                                                    <strong>For Your Company</strong>
                                                    <br/>
                                                    <a href="https://prognostic.ai/#demo">
                                                        Book Your Free Demo Today!
                                                    </a>
                                                </span>
                                            </h1>
                                            <hr id="divider01" className="hr-custom"/>
                                            <div id="embed01">
                                                <div className="container">
                                                    <div className="row justify-content-center">
                                                        <div className="col-12">
                                                            <div className="result-header text-center">
                                                                <h1>Your PrognosticAI Vision</h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            {error ? (
                                                                <p className="content-box text-center">{error}</p>
                                                            ) : (
                                                                <TypedContent content={content}/>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="row justify-content-center">
                                                        <div className="col-12 col-sm-6 text-center">
                                                            <StreakCounter streak={streak}/>
                                                        </div>
                                                    </div>
                                                    <div className="row justify-content-center">
                                                        <div className="col-12 col-sm-6 text-center">
                                                            <PrognosticButton/>
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
                        {!loading && <Footer/>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;

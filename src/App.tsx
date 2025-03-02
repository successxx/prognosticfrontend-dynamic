/*******************************************************
11) APP 
*******************************************************/
function App() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [isContentVisible, setIsContentVisible] = React.useState(false);
  const [streak] = React.useState(1);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("user_email");
    if (!userEmail) {
      setError("Please provide your email to access the webinar.");
      setLoading(false);
      return;
    }
    setLoading(true);

    const pollId = setInterval(async () => {
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
            clearInterval(pollId);
          } else {
            console.log("Data not ready yet, poll again...");
          }
        } else {
          console.log("4xx error, continuing to poll...");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(pollId);
  }, []);

  return (
    <div className="wrapper py-4">
      {/* Smaller + centered logo */}
      <Header />

      {/* REMOVED the <hr id="divider02" className="hr-custom" /> divider */}

      {loading ? (
        <>
          <div style={{ textAlign: "center", margin: "30px" }}>
            <div>Loading...</div>
          </div>
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
              <div className={d-flex w-100 justify-content-center fade-in ${isContentVisible ? "visible" : ""}}>
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
}

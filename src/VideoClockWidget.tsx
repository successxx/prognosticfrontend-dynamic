/*******************************************************
8) CLOCKWIDGETCONTENT
*******************************************************/
function ClockWidgetContent() {
  const [timeString, setTimeString] = React.useState("");
  const [dateString, setDateString] = React.useState("");

  React.useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDateString(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="widgetContent">
      <div className="clockTime">{timeString}</div>
      <div className="clockDate">{dateString}</div>
    </div>
  );
}

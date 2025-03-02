2) HEADER (smaller + centered logo if you want)
*******************************************************/
function Header() {
  // Per your code, you can do something like:
  // import headerImage from './assets/header.png';
  // In pure JS, we might do a direct path or pass as a prop.
  // We'll just mock it:
  const headerImage = "./assets/header.png";
  return (
    <div id="image03" className="image" style={{ textAlign: "center" }}>
      <span className="frame">
        <img
          src={headerImage}
          alt="Header"
          style={{
            maxWidth: "220px", // smaller logo
            display: "block",
            margin: "0 auto", // center
          }}
        />
      </span>
    </div>
  );
}

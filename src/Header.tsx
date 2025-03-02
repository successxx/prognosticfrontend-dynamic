import React from "react";

function Header() {
  const headerImage = "./assets/header.png"; // Or wherever your logo is

  return (
    <div id="image03" className="image" style={{ textAlign: "center" }}>
      <span className="frame">
        <img
          src={headerImage}
          alt="Header"
          style={{
            maxWidth: "220px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </span>
    </div>
  );
}

export default Header;

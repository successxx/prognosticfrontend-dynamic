import React from "react";

const Header: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <img
        src="./assets/header.png"
        alt="Header Logo"
        style={{
          maxWidth: "220px",
          display: "block",
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export default Header;

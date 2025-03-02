/* Header.tsx 
   Renders a smaller, centered logo at the top 
*/
import React from "react";
import headerImage from "./assets/header.png";

const Header: React.FC = () => {
  return (
    <div style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
      <img
        src={headerImage}
        alt="Header"
        style={{
          maxWidth: "240px",
          height: "auto",
          display: "block",
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export default Header;

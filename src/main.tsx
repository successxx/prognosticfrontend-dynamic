import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // We'll define App below or in a separate file

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("No root element found for React");
}

const root = ReactDOM.createRoot(rootEl);
root.render(<App />);

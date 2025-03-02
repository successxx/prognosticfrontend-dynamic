/* main.tsx
   This is your entry point that does the "ReactDOM.createRoot(...)" 
   and renders <App />.
*/

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// The const rootEl + createRoot:
const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
}


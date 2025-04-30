import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ Ensure root element exists
const container = document.getElementById("root");

if (!container) {
  throw new Error("❌ Root element with id 'root' not found.");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

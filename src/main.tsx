import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./presentation/styles/global.css";
import { App } from "./App";

const root = document.querySelector<HTMLDivElement>("#root");

if (root === null) {
  throw new Error("Application root element is missing.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

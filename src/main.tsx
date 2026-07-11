import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import "./presentation/styles/global.css";

const root = document.querySelector<HTMLDivElement>("#root");

if (root === null) {
  throw new Error("Application root element is missing.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n from "./configs/i18n";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });

const root = createRoot(document.getElementById("root")!, {
  onCaughtError: (error, errorInfo) => {
    console.error("Error caught by boundary:", error, errorInfo);
  },
  onUncaughtError: (error, errorInfo) => {
    console.error("Uncaught error:", error, errorInfo);
  },
  onRecoverableError: (error, errorInfo) => {
    console.warn("Recoverable error:", error, errorInfo);
  },
});

root.render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </StrictMode>
);

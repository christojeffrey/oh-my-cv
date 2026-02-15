import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import i18n from "./configs/i18n";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);


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
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <I18nextProvider i18n={i18n}>
          <RouterProvider router={router} />
        </I18nextProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>
);

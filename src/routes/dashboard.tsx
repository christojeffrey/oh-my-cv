import { createFileRoute } from "@tanstack/react-router";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";
import { Dashboard } from "@/features/dashboard";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ErrorBoundary>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ErrorBoundary>
  ),
});

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useResumes } from "@/features/dashboard/hooks/use-resumes";
import { ResumeEditor } from "@/features/editor";
import { useConvexAuth } from "convex/react";

export const Route = createFileRoute("/")({
  component: HomeRedirect,
});

function HomeRedirect() {
  const { resumes, isLoading, createResume } = useResumes();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const navigate = useNavigate();
  // Use a ref to prevent double creation in strict mode
  const creatingRef = useRef(false);

  useEffect(() => {
    if (isLoading || isAuthLoading) return;

    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
      return;
    }

    // Guest mode: ensure we have a resume to show
    if (resumes.length === 0 && !creatingRef.current) {
      creatingRef.current = true;
      // Create a default resume for the guest
      createResume({}).then(() => {
        creatingRef.current = false;
      });
    }

  }, [resumes, isLoading, isAuthLoading, isAuthenticated, navigate, createResume]);

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // If authenticated, we are redirecting...
  if (isAuthenticated) return null;

  // If guest, show editor. 
  // ResumeEditor will pick up the latest resume via useEditorData once it's created/loaded.
  return <ResumeEditor />;
}

// Create a separate landing/marketing route if needed in future

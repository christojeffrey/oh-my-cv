import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef } from "react";
import { ResumeEditor } from "@/features/editor";
import { useCreateResume } from "@/hooks/use-create-resume";
import { useResumes } from "@/hooks/use-resumes";

export const Route = createFileRoute("/")({
  component: HomeRedirect,
});

function HomeRedirect() {
  const { resumes, isLoading } = useResumes();
  const { createResume } = useCreateResume();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const navigate = useNavigate();
  const creatingRef = useRef(false);

  useEffect(() => {
    if (isLoading || isAuthLoading) return;

    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
      return;
    }

    if (resumes.length === 0 && !creatingRef.current) {
      creatingRef.current = true;
      createResume().then(() => {
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

  if (isAuthenticated) return null;

  return <ResumeEditor />;
}

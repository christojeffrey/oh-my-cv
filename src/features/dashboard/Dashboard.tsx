import { Card } from "@/components/ui/card";
import { useResumes } from "./hooks/use-resumes";
import { NewResume } from "./components/NewResume";
import { ResumeCard } from "./components/ResumeCard";

export const SKELETON_COUNT = 4;

export function Dashboard() {
  const { resumes, isLoading } = useResumes();

  return (
    <div className="workspace flex flex-col px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-6 sm:mb-10 px-1 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">My Resumes</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Create and manage your resumes</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Mobile: list view */}
        <div className="sm:hidden flex flex-col gap-3">
          <NewResume />
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Card key={i} className="w-full h-20 bg-muted/40 rounded-sm animate-pulse" />
            ))
            : resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
        </div>

        {/* Desktop: grid view */}
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          <NewResume />
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Card key={i} className="w-full aspect-[210/297] bg-muted/40 rounded-sm animate-pulse" />
            ))
            : resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
        </div>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { useResumes } from "./hooks/use-resumes";
import { NewResume } from "./components/NewResume";
import { ResumeCard } from "./components/ResumeCard";

export const SKELETON_COUNT = 4;

export function Dashboard() {
  const { resumes, isLoading } = useResumes();

  return (
    <div className="workspace flex flex-col px-4 py-8">
      <div className="flex items-center justify-between mb-8 px-2 gap-2">
        <h1 className="text-3xl font-bold">My Resumes</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-wrap gap-x-4 gap-y-8 pt-4">
          <NewResume />

          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Card key={i} className="w-[210px] h-[299px] bg-secondary animate-pulse" />
            ))
            : resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
        </div>
      </div>
    </div>
  );
}

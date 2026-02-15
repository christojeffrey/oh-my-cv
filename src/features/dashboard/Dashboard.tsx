import { Card } from "@/components/ui/card";
import { SKELETON_COUNT } from "@/constants";
import { useResumes } from "./hooks/use-resumes";
import { FileActions } from "./components/FileActions";
import { NewResume } from "./components/NewResume";
import { ResumeCard } from "./components/ResumeCard";

export function Dashboard() {
  const { resumes, isLoading, reload } = useResumes();

  return (
    <div className="workspace flex flex-col px-4 py-8">
      <div className="flex items-center justify-between mb-8 px-2 gap-2">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <FileActions onUpdate={reload} />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-wrap gap-x-4 gap-y-8 pt-4">
          <NewResume onUpdate={reload} />

          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="w-56 h-80">
                <Card className="w-[210px] h-[299px] bg-secondary animate-pulse mx-auto" />
              </div>
            ))
            : resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onUpdate={reload} />
            ))}
        </div>
      </div>
    </div>
  );
}

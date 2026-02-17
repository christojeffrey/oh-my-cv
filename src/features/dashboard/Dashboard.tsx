import { Card } from "@/components/ui/card";
import { FileActions } from "./components/FileActions";
import { NewResume } from "./components/NewResume";
import { ResumeCard } from "./components/ResumeCard";
import { useResumes } from "./hooks/use-resumes";

export const SKELETON_COUNT = 4;

export function Dashboard() {
  const { resumes, isLoading, reload } = useResumes();

  return (
    <div className="workspace flex flex-col px-4 py-8">
      <div className="flex flex-col gap-4 px-2 mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <FileActions onUpdate={reload} />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 pt-4 sm:justify-start">
          <NewResume onUpdate={reload} />

          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Skeletons are identical
                <Card key={i} className="w-[210px] h-[299px] bg-secondary animate-pulse" />
              ))
            : resumes.map((resume) => <ResumeCard key={resume.id} resume={resume} />)}
        </div>
      </div>
    </div>
  );
}

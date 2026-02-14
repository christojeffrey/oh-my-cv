import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { type DbResume, storageService } from "@/services/storage";
import { FileActions } from "./FileActions";
import { NewResume } from "./NewResume";
import { ResumeCard } from "./ResumeCard";

export function Dashboard() {
  const [resumes, setResumes] = useState<DbResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadResumes = async () => {
    setIsLoading(true);
    const data = await storageService.getResumes();
    setResumes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleUpdate = () => {
    loadResumes();
  };

  return (
    <div className="workspace flex flex-col px-4 py-8">
      <div className="flex items-center justify-between mb-8 px-2 gap-2">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <FileActions onUpdate={handleUpdate} />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-wrap gap-x-4 gap-y-8 pt-4">
          <NewResume onUpdate={handleUpdate} />

          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-56 h-80">
                  <Card className="w-[210px] h-[299px] bg-secondary animate-pulse mx-auto" />
                </div>
              ))
            : resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} onUpdate={handleUpdate} />
              ))}
        </div>
      </div>
    </div>
  );
}

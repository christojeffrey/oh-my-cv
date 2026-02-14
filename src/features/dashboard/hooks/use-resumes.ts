import { useEffect, useState } from "react";
import { type DbResume, storageService } from "@/services/storage";

/**
 * Hook to fetch and manage all resumes
 */
export function useResumes() {
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

  return {
    resumes,
    isLoading,
    reload: loadResumes,
  };
}

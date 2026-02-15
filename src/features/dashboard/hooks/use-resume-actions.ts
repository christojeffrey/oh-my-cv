import { useResumes } from "./use-resumes";

/**
 * Hook to handle resume CRUD operations
 */
export function useResumeActions(onUpdate?: () => void) {
  const { deleteResume } = useResumes();

  const handleDuplicate = async (_resumeId: number | string) => {

    console.warn("Duplicate not implemented for Convex/Unified yet");
    onUpdate?.();
  };

  const handleDelete = async (resumeId: number | string, resumeName?: string) => {
    if (confirm(`Are you sure you want to delete "${resumeName || 'resume'}"?`)) {
      await deleteResume(resumeId);
      onUpdate?.();
    }
  };

  return {
    duplicate: handleDuplicate,
    deleteResume: handleDelete,
  };
}

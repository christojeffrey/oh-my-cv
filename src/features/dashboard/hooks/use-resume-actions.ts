import { storageService } from "@/services/storage";

/**
 * Hook to handle resume CRUD operations
 */
export function useResumeActions(onUpdate?: () => void) {
  const handleDuplicate = async (resumeId: number) => {
    await storageService.duplicateResume(resumeId);
    onUpdate?.();
  };

  const handleDelete = async (resumeId: number, resumeName: string) => {
    if (confirm(`Are you sure you want to delete "${resumeName}"?`)) {
      await storageService.deleteResume(resumeId);
      onUpdate?.();
    }
  };

  return {
    duplicate: handleDuplicate,
    deleteResume: handleDelete,
  };
}

import { useNavigate } from "@tanstack/react-router";
import { storageService } from "@/services/storage";

/**
 * Hook to handle creating a new resume and navigating to the editor
 */
export function useCreateResume() {
  const navigate = useNavigate();

  const createResume = async () => {
    const data = await storageService.createResume();
    if (data) {
      navigate({ to: `/editor/${data.id}` });
    }
  };

  return { createResume };
}

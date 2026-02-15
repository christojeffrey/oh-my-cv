import { useNavigate } from "@tanstack/react-router";
import { useResumes } from "./use-resumes";

/**
 * Hook to handle creating a new resume and navigating to the editor
 */
export function useCreateResume() {
  const navigate = useNavigate();
  const { createResume: create } = useResumes();

  const createResume = async () => {
    const id = await create({});
    if (id) {
      navigate({ to: `/editor/${id}` });
    }
  };

  return { createResume };
}

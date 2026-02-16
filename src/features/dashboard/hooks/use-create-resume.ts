import { useNavigate } from "@tanstack/react-router";
import { useResumes } from "./use-resumes";

export function useCreateResume() {
  const navigate = useNavigate();
  const { createResume } = useResumes();

  const handleCreate = async () => {
    const id = await createResume({});
    if (id) {
      navigate({ to: `/editor/${id}` });
    }
  };

  return { createResume: handleCreate };
}

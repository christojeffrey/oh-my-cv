import { Plus } from "lucide-react";
import { useCreateResume } from "../hooks/use-create-resume";

interface NewResumeProps {
  onUpdate: () => void;
}

export function NewResume({ onUpdate }: Readonly<NewResumeProps>) {
  const { createResume } = useCreateResume();

  const handleCreate = async () => {
    await createResume();
    onUpdate();
  };

  return (
    <div className="w-56 flex flex-col items-center">
      <div className="h-80 flex items-center justify-center w-full">
        <button
          className="resume-card group w-[210px] h-[299px] flex items-center justify-center bg-secondary hover:bg-background focus:ring-2 focus:ring-ring focus:outline-none overflow-hidden shrink-0"
          aria-label="Create new resume"
          onClick={handleCreate}
          type="button"
        >
          <Plus className="w-16 h-16 text-muted-foreground group-hover:text-primary flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { storageService } from "@/services/storage";
import { Plus } from "lucide-react";

interface NewResumeProps {
  onUpdate: () => void;
}

export function NewResume({ onUpdate }: NewResumeProps) {
  const navigate = useNavigate();

  const newAndSwitch = async () => {
    const data = await storageService.createResume();
    if (data) {
      onUpdate();
      navigate({ to: `/editor/${data.id}` });
    }
  };

  return (
    <div className="w-56 h-80">
      <button
        className="resume-card group w-[210px] h-[299px] flex items-center justify-center bg-secondary hover:bg-background focus:ring-2 focus:ring-ring focus:outline-none overflow-hidden"
        aria-label="Create new resume"
        onClick={newAndSwitch}
      >
        <Plus className="w-16 h-16 text-muted-foreground group-hover:text-primary flex-shrink-0" />
      </button>
    </div>
  );
}

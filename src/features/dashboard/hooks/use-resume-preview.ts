import { useEffect, useState } from "react";
import { googleFontsService } from "@/services/fonts";
import type { DbResume } from "@/types/resume";

/**
 * Hook to handle resume preview setup (fonts loading, etc.)
 */
export function useResumePreview(resume: DbResume) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const setupPreview = async () => {
      const styles = resume.styles;
      if (!styles) {
        setIsLoaded(true);
        return;
      }

      // Load fonts
      await googleFontsService.resolve(styles.fontEN);
      await googleFontsService.resolve(styles.fontCJK);

      setIsLoaded(true);
    };

    setupPreview();
  }, [resume]);

  return { isLoaded };
}

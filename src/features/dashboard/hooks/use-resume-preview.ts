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
      try {
        await Promise.all([
          googleFontsService.resolve(styles.fontEN).catch(e => console.warn("Failed to load EN font", e)),
          googleFontsService.resolve(styles.fontCJK).catch(e => console.warn("Failed to load CJK font", e))
        ]);
      } catch (error) {
        console.error("Font loading error:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    setupPreview();
  }, [resume]);

  return { isLoaded };
}

import { useAtom } from "jotai";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { darkModeAtom } from "@/atoms";
import { Button } from "@/components/ui/button";

const MODES = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

export function ToggleDark() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom) as [string, (value: string) => void];

  const currentIndex = MODES.findIndex((m) => m.value === darkMode);
  const nextMode = MODES[(currentIndex + 1) % MODES.length];

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      if (darkMode === "dark") {
        root.classList.add("dark");
      } else if (darkMode === "light") {
        root.classList.remove("dark");
      } else {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", systemDark);
      }
    };

    applyTheme();

    if (darkMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [darkMode]);

  const CurrentIcon = MODES[currentIndex].icon;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setDarkMode(nextMode.value)}
      className="w-9 h-9 p-0"
      title={`Current mode: ${darkMode}. Click to switch to ${nextMode.value}`}
    >
      <CurrentIcon className="w-4 h-4" />
    </Button>
  );
}

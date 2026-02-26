import { BookCopy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { copyLLMGuideToClipboard } from "@/constants/llm-guide";

export function CopyGuideButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (await copyLLMGuideToClipboard()) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="ghost" size="sm" className="h-8" onClick={handleCopy}>
      {copied ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : (
        <>
          <BookCopy className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">LLM Prompt</span>
        </>
      )}
    </Button>
  );
}

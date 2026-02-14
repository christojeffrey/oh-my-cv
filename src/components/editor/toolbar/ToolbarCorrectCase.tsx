import { useState } from "react";
import { useAtom } from "jotai";
import { cvDataAtom } from "@/atoms";
import { storageService } from "@/services/storage";
import { toast } from "@/services/toast";
import casePolice from "@ohmycv/case-police";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ToolbarCorrectCase() {
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const [result, setResult] = useState<{ num: number; text: string } | null>(null);

  const correctCase = () => {
    const result = casePolice(cvData.markdown);
    setResult(result ? { num: result.changed.length, text: result.code } : null);

    if (result?.changed.length === 0) {
      toast.correctAllGood();
    } else {
      toast.correct(result?.changed.length || 0);
    }
  };

  const applyCorrection = async () => {
    if (!result || !cvData.resumeId) return;

    setCvData((prev) => ({ ...prev, markdown: result.text }));

    await storageService.updateResume(cvData.resumeId, { markdown: result.text }, false);

    setResult(null);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Correct Case</div>
      <Button onClick={correctCase} className="w-full" disabled={result !== null}>
        Correct it!
      </Button>

      {result && (
        <Alert>
          <AlertTitle>Corrected {result.num} words</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Click the button below to apply the correction.</p>
            <Button onClick={applyCorrection} size="sm">
              Apply Correction
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SliderFieldProps {
  label: string;
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  className?: string;
  onValueChange: (value: number) => void;
}

export function SliderField({
  label,
  id,
  value,
  min,
  max,
  step,
  unit = "",
  className,
  onValueChange,
}: Readonly<SliderFieldProps>) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([newValue]) => onValueChange(newValue)}
        className="mt-2"
      />
      <span className="text-sm text-muted-foreground">
        {value}
        {unit}
      </span>
    </div>
  );
}

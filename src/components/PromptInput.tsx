import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PromptInput = ({ value, onChange }: PromptInputProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="prompt-input" className="text-sm font-semibold text-foreground">
        Enter Prompt for Evaluation
      </Label>
      <Textarea
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your prompt here for comprehensive evaluation..."
        className="min-h-[200px] font-mono text-sm bg-secondary border-border resize-none focus:ring-2 focus:ring-primary transition-all"
      />
    </div>
  );
};

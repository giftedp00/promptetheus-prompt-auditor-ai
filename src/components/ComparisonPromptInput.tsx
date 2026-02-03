import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, X, Palette } from "lucide-react";

interface PromptEntry {
  id: string;
  name: string;
  value: string;
  color: string;
}

interface ComparisonPromptInputProps {
  prompts: PromptEntry[];
  onPromptsChange: (prompts: PromptEntry[]) => void;
}

const COLORS = [
  { name: "Cyan", value: "hsl(189, 94%, 43%)" },
  { name: "Purple", value: "hsl(280, 80%, 60%)" },
  { name: "Orange", value: "hsl(25, 95%, 53%)" },
  { name: "Green", value: "hsl(142, 76%, 36%)" },
  { name: "Pink", value: "hsl(330, 80%, 60%)" },
];

export const ComparisonPromptInput = ({ prompts, onPromptsChange }: ComparisonPromptInputProps) => {
  const addPrompt = () => {
    const nextColorIndex = prompts.length % COLORS.length;
    const newPrompt: PromptEntry = {
      id: crypto.randomUUID(),
      name: `Prompt ${prompts.length + 1}`,
      value: "",
      color: COLORS[nextColorIndex].value,
    };
    onPromptsChange([...prompts, newPrompt]);
  };

  const removePrompt = (id: string) => {
    onPromptsChange(prompts.filter((p) => p.id !== id));
  };

  const updatePrompt = (id: string, field: keyof PromptEntry, value: string) => {
    onPromptsChange(
      prompts.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">
          Prompts to Compare
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={addPrompt}
          disabled={prompts.length >= 5}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Prompt
        </Button>
      </div>

      <div className="space-y-4">
        {prompts.map((prompt, index) => (
          <Card
            key={prompt.id}
            className="p-4 bg-secondary/30 border-border relative"
            style={{ borderLeftColor: prompt.color, borderLeftWidth: 4 }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: prompt.color }}
                  />
                  <input
                    type="text"
                    value={prompt.name}
                    onChange={(e) => updatePrompt(prompt.id, "name", e.target.value)}
                    className="bg-transparent border-none text-sm font-semibold text-foreground focus:outline-none focus:ring-0 flex-1"
                    placeholder="Prompt name..."
                  />
                </div>
                {prompts.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePrompt(prompt.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Textarea
                value={prompt.value}
                onChange={(e) => updatePrompt(prompt.id, "value", e.target.value)}
                placeholder={`Enter prompt ${index + 1} for comparison...`}
                className="min-h-[120px] font-mono text-sm bg-background border-border resize-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </Card>
        ))}
      </div>

      {prompts.length < 2 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          Add at least 2 prompts to compare
        </p>
      )}
    </div>
  );
};

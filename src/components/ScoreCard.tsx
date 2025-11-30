import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  label: string;
  score: number;
  maxScore?: number;
  delay?: number;
}

export const ScoreCard = ({ label, score, maxScore = 10, delay = 0 }: ScoreCardProps) => {
  const percentage = (score / maxScore) * 100;
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-success";
    if (score >= 6) return "text-warning";
    return "text-destructive";
  };

  return (
    <div 
      className="space-y-2 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className={cn("text-sm font-bold", getScoreColor(score))}>
          {score}/{maxScore}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

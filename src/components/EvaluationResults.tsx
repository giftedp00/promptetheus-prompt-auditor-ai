import { Card } from "@/components/ui/card";
import { ScoreCard } from "./ScoreCard";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

interface EvaluationScore {
  clarity: number;
  specificity: number;
  completeness: number;
  control: number;
  stability: number;
  safety: number;
  hallucinationResistance: number;
  formattingStrength: number;
  actionability: number;
  domainFit: number;
}

interface EvaluationResultsProps {
  scores: EvaluationScore;
  totalScore: number;
  issues: string[];
  recommendations: string[];
  optimizedPrompt: string;
  summary: string;
}

export const EvaluationResults = ({
  scores,
  totalScore,
  issues,
  recommendations,
  optimizedPrompt,
  summary,
}: EvaluationResultsProps) => {
  const getTotalScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const radarData = [
    { subject: "Clarity", value: scores.clarity, fullMark: 10 },
    { subject: "Specificity", value: scores.specificity, fullMark: 10 },
    { subject: "Completeness", value: scores.completeness, fullMark: 10 },
    { subject: "Control", value: scores.control, fullMark: 10 },
    { subject: "Stability", value: scores.stability, fullMark: 10 },
    { subject: "Safety", value: scores.safety, fullMark: 10 },
    { subject: "Hallucination Resist.", value: scores.hallucinationResistance, fullMark: 10 },
    { subject: "Formatting", value: scores.formattingStrength, fullMark: 10 },
    { subject: "Actionability", value: scores.actionability, fullMark: 10 },
    { subject: "Domain Fit", value: scores.domainFit, fullMark: 10 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6">
      {/* Summary */}
      <Card className="p-6 bg-gradient-card shadow-card border-border">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Prompt Quality Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
          </div>
        </div>
      </Card>

      {/* Total Score */}
      <Card className="p-6 bg-gradient-card shadow-card border-border">
        <div className="text-center space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Overall Score
          </h3>
          <div className={`text-6xl font-bold ${getTotalScoreColor(totalScore)}`}>
            {totalScore}
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
        </div>
      </Card>

      {/* Radar Chart */}
      <Card className="p-6 bg-gradient-card shadow-card border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Score Visualization
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 10]} 
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Radar 
              name="Score" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))" 
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Score Breakdown */}
      <Card className="p-6 bg-gradient-card shadow-card border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Score Breakdown
        </h3>
        <div className="grid gap-4">
          <ScoreCard label="Clarity" score={scores.clarity} delay={0} />
          <ScoreCard label="Specificity" score={scores.specificity} delay={50} />
          <ScoreCard label="Completeness" score={scores.completeness} delay={100} />
          <ScoreCard label="Control" score={scores.control} delay={150} />
          <ScoreCard label="Stability" score={scores.stability} delay={200} />
          <ScoreCard label="Safety" score={scores.safety} delay={250} />
          <ScoreCard label="Hallucination Resistance" score={scores.hallucinationResistance} delay={300} />
          <ScoreCard label="Formatting Strength" score={scores.formattingStrength} delay={350} />
          <ScoreCard label="Actionability" score={scores.actionability} delay={400} />
          <ScoreCard label="Domain Fit" score={scores.domainFit} delay={450} />
        </div>
      </Card>

      {/* Issues */}
      {issues.length > 0 && (
        <Card className="p-6 bg-gradient-card shadow-card border-border">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Identified Issues
          </h3>
          <div className="space-y-2">
            {issues.map((issue, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 animate-in fade-in slide-in-from-left"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
              >
                <Badge variant="destructive" className="mt-0.5">
                  {index + 1}
                </Badge>
                <p className="text-sm text-foreground flex-1">{issue}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="p-6 bg-gradient-card shadow-card border-border">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            Recommended Improvements
          </h3>
          <div className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 animate-in fade-in slide-in-from-left"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
              >
                <Badge variant="secondary" className="mt-0.5 bg-warning/20 text-warning border-warning/30">
                  {index + 1}
                </Badge>
                <p className="text-sm text-foreground flex-1">{recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Optimized Prompt */}
      {optimizedPrompt && (
        <Card className="p-6 bg-gradient-card shadow-card border-border">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Optimized Version
          </h3>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed">
              {optimizedPrompt}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};

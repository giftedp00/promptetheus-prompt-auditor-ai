import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Download, FileImage, Lightbulb, Sparkles, Trophy } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

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

interface ComparisonResult {
  id: string;
  name: string;
  color: string;
  scores: EvaluationScore;
  totalScore: number;
  issues: string[];
  recommendations: string[];
  summary: string;
}

interface ComparisonResultsProps {
  results: ComparisonResult[];
}

export const ComparisonResults = ({ results }: ComparisonResultsProps) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const getTotalScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const exportAsImage = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: "#0a0a0f",
        quality: 1,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `prompt-comparison-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast({
        title: "Image Exported",
        description: "Comparison results saved as PNG.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: "#0a0a0f",
        quality: 1,
        pixelRatio: 2,
      });
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));
      
      const pdf = new jsPDF({
        orientation: img.width > img.height ? "landscape" : "portrait",
        unit: "px",
        format: [img.width, img.height],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
      pdf.save(`prompt-comparison-${Date.now()}.pdf`);
      toast({
        title: "PDF Exported",
        description: "Comparison results saved as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Build radar data with all prompts
  const radarData = [
    { subject: "Clarity", fullMark: 10 },
    { subject: "Specificity", fullMark: 10 },
    { subject: "Completeness", fullMark: 10 },
    { subject: "Control", fullMark: 10 },
    { subject: "Stability", fullMark: 10 },
    { subject: "Safety", fullMark: 10 },
    { subject: "Hallucination Resist.", fullMark: 10 },
    { subject: "Formatting", fullMark: 10 },
    { subject: "Actionability", fullMark: 10 },
    { subject: "Domain Fit", fullMark: 10 },
  ].map((item) => {
    const dataPoint: any = { ...item };
    results.forEach((result) => {
      const key = item.subject.toLowerCase().replace(/[^a-z]/g, "");
      const scoreKey = Object.keys(result.scores).find(
        (k) => k.toLowerCase().replace(/[^a-z]/g, "").includes(key) || key.includes(k.toLowerCase())
      );
      if (scoreKey) {
        dataPoint[result.id] = result.scores[scoreKey as keyof EvaluationScore];
      }
    });
    return dataPoint;
  });

  // Map scores correctly
  const buildRadarData = () => {
    const scoreMapping: { subject: string; key: keyof EvaluationScore }[] = [
      { subject: "Clarity", key: "clarity" },
      { subject: "Specificity", key: "specificity" },
      { subject: "Completeness", key: "completeness" },
      { subject: "Control", key: "control" },
      { subject: "Stability", key: "stability" },
      { subject: "Safety", key: "safety" },
      { subject: "Hallucination Resist.", key: "hallucinationResistance" },
      { subject: "Formatting", key: "formattingStrength" },
      { subject: "Actionability", key: "actionability" },
      { subject: "Domain Fit", key: "domainFit" },
    ];

    return scoreMapping.map((item) => {
      const dataPoint: any = { subject: item.subject, fullMark: 10 };
      results.forEach((result) => {
        dataPoint[result.id] = result.scores[item.key];
      });
      return dataPoint;
    });
  };

  const finalRadarData = buildRadarData();

  // Find winner
  const winner = results.reduce((prev, current) =>
    prev.totalScore > current.totalScore ? prev : current
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6">
      {/* Export Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={exportAsImage}
          disabled={isExporting}
          className="gap-2"
        >
          <FileImage className="w-4 h-4" />
          Export as Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportAsPDF}
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export as PDF
        </Button>
      </div>

      <div ref={exportRef} className="space-y-6 p-1">
      <Card className="p-6 bg-gradient-card shadow-card border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          Comparison Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result) => (
            <div
              key={result.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                result.id === winner.id
                  ? "bg-primary/10 border-primary"
                  : "bg-secondary/30 border-border"
              }`}
              style={{ borderLeftColor: result.color, borderLeftWidth: 4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: result.color }}
                />
                <span className="text-sm font-semibold text-foreground truncate">
                  {result.name}
                </span>
                {result.id === winner.id && (
                  <Badge className="ml-auto bg-warning/20 text-warning border-warning/30">
                    Winner
                  </Badge>
                )}
              </div>
              <div className={`text-3xl font-bold ${getTotalScoreColor(result.totalScore)}`}>
                {result.totalScore}
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Overlaid Radar Chart */}
      <Card className="p-6 bg-gradient-card shadow-card border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Comparison Radar Chart
        </h3>
        <ResponsiveContainer width="100%" height={450}>
          <RadarChart data={finalRadarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            {results.map((result) => (
              <Radar
                key={result.id}
                name={result.name}
                dataKey={result.id}
                stroke={result.color}
                fill={result.color}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => (
                <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
              )}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Comparison per Category */}
      <Card className="p-6 bg-gradient-card shadow-card border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Score Breakdown Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                  Category
                </th>
                {results.map((result) => (
                  <th key={result.id} className="text-center py-3 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: result.color }}
                      />
                      <span className="text-foreground font-medium truncate max-w-[100px]">
                        {result.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Clarity", key: "clarity" },
                { label: "Specificity", key: "specificity" },
                { label: "Completeness", key: "completeness" },
                { label: "Control", key: "control" },
                { label: "Stability", key: "stability" },
                { label: "Safety", key: "safety" },
                { label: "Hallucination Resistance", key: "hallucinationResistance" },
                { label: "Formatting Strength", key: "formattingStrength" },
                { label: "Actionability", key: "actionability" },
                { label: "Domain Fit", key: "domainFit" },
              ].map((category) => {
                const scores = results.map((r) => r.scores[category.key as keyof EvaluationScore]);
                const maxScore = Math.max(...scores);
                return (
                  <tr key={category.key} className="border-b border-border/50">
                    <td className="py-3 px-2 text-foreground">{category.label}</td>
                    {results.map((result) => {
                      const score = result.scores[category.key as keyof EvaluationScore];
                      const isMax = score === maxScore && scores.filter((s) => s === maxScore).length === 1;
                      return (
                        <td key={result.id} className="text-center py-3 px-2">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              isMax
                                ? "bg-success/20 text-success"
                                : score >= 7
                                ? "text-success"
                                : score >= 5
                                ? "text-warning"
                                : "text-destructive"
                            }`}
                          >
                            {score}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr className="bg-secondary/30">
                <td className="py-3 px-2 text-foreground font-semibold">Total Score</td>
                {results.map((result) => (
                  <td key={result.id} className="text-center py-3 px-2">
                    <span className={`font-bold text-lg ${getTotalScoreColor(result.totalScore)}`}>
                      {result.totalScore}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Individual Summaries */}
      {results.map((result) => (
        <Card
          key={result.id}
          className="p-6 bg-gradient-card shadow-card border-border"
          style={{ borderLeftColor: result.color, borderLeftWidth: 4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: result.color }}
            />
            <h3 className="text-lg font-semibold text-foreground">{result.name}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold mb-1 text-foreground">Summary</h4>
                <p className="text-sm text-muted-foreground">{result.summary}</p>
              </div>
            </div>

            {result.issues.length > 0 && (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-2 text-foreground">Issues</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.issues.slice(0, 3).map((issue, i) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        {issue.length > 40 ? issue.slice(0, 40) + "..." : issue}
                      </Badge>
                    ))}
                    {result.issues.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{result.issues.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-2 text-foreground">Top Recommendations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.recommendations.slice(0, 2).map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-warning">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
      </div>
    </div>
  );
};

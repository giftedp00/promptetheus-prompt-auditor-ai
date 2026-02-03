import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptInput } from "@/components/PromptInput";
import { EvaluationResults } from "@/components/EvaluationResults";
import { ComparisonPromptInput } from "@/components/ComparisonPromptInput";
import { ComparisonResults } from "@/components/ComparisonResults";
import { Zap, Github, Code2, GitCompare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptEntry {
  id: string;
  name: string;
  value: string;
  color: string;
}

const Index = () => {
  const [mode, setMode] = useState<"single" | "compare">("single");
  const [prompt, setPrompt] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Comparison mode state
  const [comparisonPrompts, setComparisonPrompts] = useState<PromptEntry[]>([
    { id: crypto.randomUUID(), name: "Prompt 1", value: "", color: "hsl(189, 94%, 43%)" },
    { id: crypto.randomUUID(), name: "Prompt 2", value: "", color: "hsl(280, 80%, 60%)" },
  ]);
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);
  
  const { toast } = useToast();

  const generateMockScores = () => ({
    clarity: Math.floor(Math.random() * 4) + 5,
    specificity: Math.floor(Math.random() * 4) + 4,
    completeness: Math.floor(Math.random() * 4) + 4,
    control: Math.floor(Math.random() * 4) + 5,
    stability: Math.floor(Math.random() * 4) + 5,
    safety: Math.floor(Math.random() * 3) + 6,
    hallucinationResistance: Math.floor(Math.random() * 4) + 5,
    formattingStrength: Math.floor(Math.random() * 4) + 4,
    actionability: Math.floor(Math.random() * 4) + 5,
    domainFit: Math.floor(Math.random() * 3) + 6,
  });

  const evaluatePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to evaluate.",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const scores = generateMockScores();
    const totalScore = Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0)
    );

    const mockResults = {
      scores,
      totalScore,
      summary:
        "The prompt shows good intent but lacks specific constraints and structure. It would benefit from more precise instructions, clearer formatting requirements, and explicit boundaries to reduce ambiguity and improve output consistency.",
      issues: [
        "Lacks specific output format requirements",
        "Missing concrete examples of expected responses",
        "Ambiguous language in several instructions",
        "No explicit constraints on response length or style",
        "Insufficient context about the target audience",
      ],
      recommendations: [
        "Add explicit formatting requirements (e.g., 'Use numbered lists', 'Limit responses to 200 words')",
        "Include 2-3 concrete examples of ideal responses",
        "Replace vague terms like 'good' or 'appropriate' with measurable criteria",
        "Define clear boundaries for what the AI should and shouldn't include",
        "Specify the expertise level expected in responses",
      ],
      optimizedPrompt: `[OPTIMIZED VERSION OF PROMPT]\n\nYou are a professional [ROLE]. Your task is to [SPECIFIC TASK].\n\nContext:\n- [Context point 1]\n- [Context point 2]\n\nRequirements:\n1. [Specific requirement 1]\n2. [Specific requirement 2]\n3. [Specific requirement 3]\n\nFormat your response as:\n- [Format specification]\n- Keep it under [X] words\n- Use [specific style]\n\nAvoid:\n- [Thing to avoid 1]\n- [Thing to avoid 2]\n\nExample output:\n[Concrete example here]`,
    };

    setResults(mockResults);
    setIsEvaluating(false);

    toast({
      title: "Evaluation Complete",
      description: "Your prompt has been analyzed successfully.",
    });
  };

  const evaluateComparison = async () => {
    const validPrompts = comparisonPrompts.filter((p) => p.value.trim());
    
    if (validPrompts.length < 2) {
      toast({
        title: "Not Enough Prompts",
        description: "Please enter at least 2 prompts to compare.",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const results = validPrompts.map((prompt) => {
      const scores = generateMockScores();
      const totalScore = Math.round(
        Object.values(scores).reduce((a, b) => a + b, 0)
      );

      return {
        id: prompt.id,
        name: prompt.name,
        color: prompt.color,
        scores,
        totalScore,
        summary: `${prompt.name} demonstrates ${totalScore >= 70 ? "strong" : totalScore >= 50 ? "moderate" : "weak"} prompt engineering principles with room for improvement in specificity and control.`,
        issues: [
          "Could use more specific constraints",
          "Output format not clearly defined",
          "Missing edge case handling",
        ],
        recommendations: [
          "Add explicit output formatting",
          "Include example responses",
          "Define clear boundaries",
        ],
      };
    });

    setComparisonResults(results);
    setIsEvaluating(false);

    toast({
      title: "Comparison Complete",
      description: `${results.length} prompts have been analyzed and compared.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PROMPTETHEUS</h1>
              <p className="text-xs text-muted-foreground">Prompt Evaluation Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">Docs</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-block">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              Professional Prompt Engineering
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Transform Weak Prompts into
            <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent"> Professional-Grade </span>
            Instructions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered evaluation across 10 dimensions. Get brutally honest feedback, identify
            weaknesses, and receive optimized versions of your prompts.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Mode Tabs */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as "single" | "compare")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
              <TabsTrigger value="single" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Zap className="w-4 h-4" />
                Single Evaluation
              </TabsTrigger>
              <TabsTrigger value="compare" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <GitCompare className="w-4 h-4" />
                Compare Prompts
              </TabsTrigger>
            </TabsList>

            {/* Single Evaluation Mode */}
            <TabsContent value="single" className="mt-6 space-y-6">
              <Card className="p-6 bg-gradient-card shadow-card border-border">
                <PromptInput value={prompt} onChange={setPrompt} />
                <div className="mt-6">
                  <Button
                    onClick={evaluatePrompt}
                    disabled={isEvaluating}
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-glow"
                    size="lg"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Analyzing Prompt...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Evaluate Prompt
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {results && (
                <EvaluationResults
                  scores={results.scores}
                  totalScore={results.totalScore}
                  summary={results.summary}
                  issues={results.issues}
                  recommendations={results.recommendations}
                  optimizedPrompt={results.optimizedPrompt}
                />
              )}
            </TabsContent>

            {/* Comparison Mode */}
            <TabsContent value="compare" className="mt-6 space-y-6">
              <Card className="p-6 bg-gradient-card shadow-card border-border">
                <ComparisonPromptInput
                  prompts={comparisonPrompts}
                  onPromptsChange={setComparisonPrompts}
                />
                <div className="mt-6">
                  <Button
                    onClick={evaluateComparison}
                    disabled={isEvaluating || comparisonPrompts.filter((p) => p.value.trim()).length < 2}
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-glow"
                    size="lg"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Comparing Prompts...
                      </>
                    ) : (
                      <>
                        <GitCompare className="w-5 h-5 mr-2" />
                        Compare Prompts
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {comparisonResults.length > 0 && (
                <ComparisonResults results={comparisonResults} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Built with precision. Powered by advanced prompt engineering principles.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

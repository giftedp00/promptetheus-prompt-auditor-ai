import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PromptInput } from "@/components/PromptInput";
import { EvaluationResults } from "@/components/EvaluationResults";
import { Zap, Github, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

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

    // Simulate evaluation (in real app, this would call an AI API)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock results
    const mockResults = {
      scores: {
        clarity: 7,
        specificity: 6,
        completeness: 5,
        control: 6,
        stability: 7,
        safety: 8,
        hallucinationResistance: 6,
        formattingStrength: 5,
        actionability: 7,
        domainFit: 8,
      },
      totalScore: 65,
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
          {/* Input Section */}
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

          {/* Results Section */}
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

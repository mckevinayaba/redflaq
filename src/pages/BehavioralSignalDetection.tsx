import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Brain, AlertTriangle, Shield, TrendingUp, Users, Loader2, ArrowRight, ChevronRight } from "lucide-react";

const signalQuestions = [
  { id: "isolation", category: "Coercive Control", text: "Does this person try to limit your contact with friends or family?", weight: 3 },
  { id: "monitoring", category: "Digital Abuse", text: "Do they check your phone, emails, or social media without permission?", weight: 3 },
  { id: "finances", category: "Coercive Control", text: "Do they control your money or make you ask for access to finances?", weight: 3 },
  { id: "blame", category: "Manipulation", text: "Do they blame you for their anger or violent behaviour?", weight: 2 },
  { id: "threats", category: "Escalation", text: "Have they threatened to hurt you, themselves, or people you care about?", weight: 4 },
  { id: "jealousy", category: "Manipulation", text: "Do they show extreme jealousy or possessiveness?", weight: 2 },
  { id: "humiliation", category: "Coercive Control", text: "Do they humiliate or belittle you in front of others?", weight: 3 },
  { id: "pressure", category: "Manipulation", text: "Do they pressure you into things you're not comfortable with?", weight: 3 },
  { id: "unpredictable", category: "Escalation", text: "Is their mood unpredictable — loving one moment, explosive the next?", weight: 3 },
  { id: "damage", category: "Escalation", text: "Have they ever broken objects, punched walls, or destroyed your belongings?", weight: 4 },
  { id: "stalking", category: "Digital Abuse", text: "Do they show up unannounced or track your location without consent?", weight: 3 },
  { id: "reputation", category: "Social Engineering", text: "Have they tried to turn people against you or damage your reputation?", weight: 2 },
];

type Assessment = {
  risk_level: string;
  risk_score: number;
  categories: string[];
  analysis: string;
};

export default function BehavioralSignalDetection() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"quiz" | "freetext">("quiz");
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [freeText, setFreeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Assessment | null>(null);

  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const allAnswered = answeredCount === signalQuestions.length;

  const getRiskFromScore = (score: number, max: number): { level: string; label: string; color: string } => {
    const pct = (score / max) * 100;
    if (pct >= 60) return { level: "high", label: "🔴 High Risk", color: "text-red-600" };
    if (pct >= 35) return { level: "medium", label: "🟠 Moderate Risk", color: "text-orange-500" };
    if (pct >= 15) return { level: "low", label: "🟡 Some Concerns", color: "text-yellow-600" };
    return { level: "minimal", label: "🟢 Low Risk", color: "text-green-600" };
  };

  const handleQuizSubmit = async () => {
    if (!allAnswered) return;
    setAnalyzing(true);

    const maxScore = signalQuestions.reduce((s, q) => s + q.weight, 0);
    const score = signalQuestions.reduce((s, q) => s + (answers[q.id] ? q.weight : 0), 0);
    const detectedCategories = [...new Set(signalQuestions.filter((q) => answers[q.id]).map((q) => q.category))];
    const risk = getRiskFromScore(score, maxScore);

    const analysisLines = [
      `Risk Score: ${score}/${maxScore} (${Math.round((score / maxScore) * 100)}%)`,
      "",
      detectedCategories.length > 0
        ? `Warning signs detected in: ${detectedCategories.join(", ")}.`
        : "No significant warning signs detected based on your answers.",
      "",
    ];

    if (risk.level === "high") {
      analysisLines.push(
        "Multiple serious behavioral warning signs are present. This pattern is consistent with coercive control and potential danger.",
        "",
        "**Recommended actions:**",
        "• Contact the GBV Command Centre: 0800 428 428",
        "• Create a safety plan with someone you trust",
        "• Consider running a RedFlaq safety check on this person",
        "• Document incidents in your Safety Journal"
      );
    } else if (risk.level === "medium") {
      analysisLines.push(
        "Several concerning patterns are present. While not all situations escalate, these signals should not be ignored.",
        "",
        "**Recommended actions:**",
        "• Talk to someone you trust about what you're experiencing",
        "• Monitor for escalation patterns",
        "• Consider a RedFlaq safety check for more clarity"
      );
    } else if (risk.level === "low") {
      analysisLines.push(
        "A few mild concerns were noted. Stay aware and trust your instincts if something feels off.",
        "",
        "**Tip:** Regular check-ins with RedFlaq Habit can help build ongoing awareness."
      );
    } else {
      analysisLines.push(
        "No major behavioral warning signs detected based on your responses. Continue to trust your instincts and stay aware."
      );
    }

    const assessment: Assessment = {
      risk_level: risk.level,
      risk_score: score,
      categories: detectedCategories,
      analysis: analysisLines.join("\n"),
    };

    setResult(assessment);

    // Save to DB if logged in
    if (user) {
      await supabase.from("behavioral_assessments").insert({
        user_id: user.id,
        assessment_type: "questionnaire",
        responses: signalQuestions.map((q) => ({ id: q.id, text: q.text, answer: answers[q.id] })),
        risk_level: risk.level,
        risk_score: score,
        categories_detected: detectedCategories,
        ai_analysis: assessment.analysis,
      });
    }

    setAnalyzing(false);
  };

  const handleFreeTextSubmit = async () => {
    if (!freeText.trim() || freeText.trim().length < 20) {
      toast({ title: "Please describe the situation in more detail (at least 20 characters).", variant: "destructive" });
      return;
    }
    setAnalyzing(true);

    try {
      const response = await supabase.functions.invoke("analyze-behavioral-signals", {
        body: { description: freeText.trim() },
      });

      if (response.error) throw new Error(response.error.message);

      const data = response.data;
      const assessment: Assessment = {
        risk_level: data.risk_level || "unknown",
        risk_score: data.risk_score || 0,
        categories: data.categories_detected || [],
        analysis: data.analysis || "Analysis could not be completed.",
      };

      setResult(assessment);

      if (user) {
        await supabase.from("behavioral_assessments").insert({
          user_id: user.id,
          assessment_type: "freetext",
          free_text: freeText.trim(),
          risk_level: assessment.risk_level,
          risk_score: assessment.risk_score,
          categories_detected: assessment.categories,
          ai_analysis: assessment.analysis,
        });
      }
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message || "Please try again.", variant: "destructive" });
    }

    setAnalyzing(false);
  };

  const riskColors: Record<string, string> = {
    high: "border-red-500 bg-red-50 dark:bg-red-500/10",
    medium: "border-orange-400 bg-orange-50 dark:bg-orange-500/10",
    low: "border-yellow-400 bg-yellow-50 dark:bg-yellow-500/10",
    minimal: "border-green-400 bg-green-50 dark:bg-green-500/10",
  };

  const riskLabels: Record<string, string> = {
    high: "🔴 High Risk",
    medium: "🟠 Moderate Risk",
    low: "🟡 Some Concerns",
    minimal: "🟢 Low Risk",
  };

  const categoryIcons: Record<string, typeof Brain> = {
    "Coercive Control": Shield,
    "Manipulation": Brain,
    "Escalation": TrendingUp,
    "Digital Abuse": AlertTriangle,
    "Social Engineering": Users,
  };

  const content = (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-1">Behavioral Signal Detection</h1>
        <p className="font-body text-sm text-muted-foreground">Identify warning signs that go beyond criminal records.</p>
      </div>

      {/* Tab Toggle */}
      {!result && (
        <div className="flex gap-2 bg-muted/40 p-1 rounded-full w-fit">
          {[
            { key: "quiz" as const, label: "Quick Assessment" },
            { key: "freetext" as const, label: "Describe a Situation" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Quiz Tab */}
      {!result && tab === "quiz" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <p className="font-body text-sm text-muted-foreground">
            Answer these questions about someone's behaviour. Your responses are private.
          </p>
          {signalQuestions.map((q) => {
            const Icon = categoryIcons[q.category] || Brain;
            return (
              <div key={q.id} className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-body text-sm text-foreground leading-relaxed">{q.text}</p>
                  <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{q.category}</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {[{ l: "Yes", v: true }, { l: "No", v: false }].map((opt) => (
                    <button
                      key={opt.l}
                      onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt.v }))}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        answers[q.id] === opt.v
                          ? opt.v
                            ? "bg-destructive/10 border-destructive text-destructive"
                            : "bg-green-50 border-green-500 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-[10px] text-muted-foreground">{answeredCount}/{signalQuestions.length} answered</span>
            <Button onClick={handleQuizSubmit} disabled={!allAnswered || analyzing} className="rounded-full">
              {analyzing ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Analyzing...</> : <>Analyze Signals <ArrowRight className="w-4 h-4 ml-1" /></>}
            </Button>
          </div>
        </div>
      )}

      {/* Free Text Tab */}
      {!result && tab === "freetext" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <p className="font-body text-sm text-muted-foreground">
            Describe the behaviours or situations you're concerned about. Our AI will analyse for warning signs across 5 categories.
          </p>
          <Textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="E.g. 'My partner gets angry when I talk to male friends. They check my phone when I'm asleep and have started showing up at my workplace unannounced...'"
            className="min-h-[160px] rounded-xl"
          />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground">{freeText.length} characters</span>
            <Button onClick={handleFreeTextSubmit} disabled={freeText.trim().length < 20 || analyzing} className="rounded-full">
              {analyzing ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Analyzing...</> : <>Analyze with AI <Brain className="w-4 h-4 ml-1" /></>}
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className={`border-2 rounded-2xl p-6 text-center ${riskColors[result.risk_level] || riskColors.minimal}`}>
            <p className="text-4xl mb-2">{riskLabels[result.risk_level]?.split(" ")[0] || "🔵"}</p>
            <h2 className="font-heading text-2xl text-foreground mb-1">{riskLabels[result.risk_level] || "Assessment Complete"}</h2>
            <p className="font-mono text-sm text-muted-foreground">Score: {result.risk_score}</p>
          </div>

          {result.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {result.categories.map((c) => {
                const Icon = categoryIcons[c] || Brain;
                return (
                  <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    <Icon className="w-3 h-3" /> {c}
                  </span>
                );
              })}
            </div>
          )}

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-heading text-lg text-foreground mb-3">Analysis</h3>
            <div className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {result.analysis.split("**").map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : <span key={i}>{part}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => { setResult(null); setAnswers({}); setFreeText(""); }} variant="outline" className="rounded-full">
              New Assessment
            </Button>
            <Button onClick={() => navigate("/dashboard/new-check")} className="rounded-full">
              Run a Safety Check <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <p className="font-mono text-[10px] text-muted-foreground text-center tracking-wider">
            This tool provides guidance only and is not a substitute for professional help. If you are in danger, call 10111 or the GBV Command Centre: 0800 428 428.
          </p>
        </div>
      )}
    </div>
  );

  if (user) return <DashboardLayout>{content}</DashboardLayout>;
  return (
    <div className="min-h-screen bg-background">
      {content}
    </div>
  );
}

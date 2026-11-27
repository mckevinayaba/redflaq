import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type EvidenceCardVerdict = "STOP" | "PAUSE" | "PROCEED_WITH_CARE";

export type DetectedPattern = {
  name: string;
  explanation: string;
  severity: "high" | "medium" | "low";
};

export type Signal = {
  category: string;
  observation: string;
};

export type NextStep = {
  action: string;
  resource?: string;
};

export type EvidenceCard = {
  verdict: EvidenceCardVerdict;
  headline: string;
  patterns_detected: DetectedPattern[];
  signals: Signal[];
  context_note: string;
  questions_to_ask: string[];
  next_steps: NextStep[];
  intent_context: string;
  limitations: string;
};

type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; card: EvidenceCard }
  | { status: "error"; message: string };

export function useAnalyseTrust() {
  const [state, setState] = useState<AnalysisState>({ status: "idle" });

  const analyse = useCallback(async (text: string, intent?: string | null) => {
    setState({ status: "loading" });
    try {
      const { data, error } = await supabase.functions.invoke("analyse-trust", {
        body: { text, intent: intent ?? null },
      });

      if (error) {
        throw new Error(error.message ?? "Analysis failed");
      }

      if (!data || typeof data.verdict !== "string") {
        throw new Error("Invalid response from analysis service");
      }

      setState({ status: "done", card: data as EvidenceCard });
      return data as EvidenceCard;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Analysis failed. Please try again.";
      setState({ status: "error", message });
      throw e;
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, analyse, reset };
}

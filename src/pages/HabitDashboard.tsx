import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Flame, CalendarCheck, Trophy, ArrowRight, CheckCircle2, Circle, BookOpen } from "lucide-react";

const dailyPrompts = [
  { id: "isolation", text: "Did anyone try to limit who you see or talk to today?", weight: 3 },
  { id: "guilt", text: "Were you made to feel guilty for doing something normal?", weight: 2 },
  { id: "tracking", text: "Did someone demand to know your location or check your phone?", weight: 3 },
  { id: "belittling", text: "Were you criticised, mocked, or made to feel small?", weight: 2 },
  { id: "safe", text: "Did you feel physically safe in all your interactions today?", weight: 3, inverted: true },
];

const educationCards = [
  { title: "Love-Bombing", desc: "Excessive flattery, gifts, and attention early on to create dependency. It feels wonderful — but it's a control tactic.", category: "Manipulation" },
  { title: "Gaslighting", desc: "Making you question your memory, perception, or sanity. \"That never happened\" or \"You're overreacting\" are classic signs.", category: "Manipulation" },
  { title: "Financial Control", desc: "Controlling your access to money, making you account for every cent, or preventing you from working.", category: "Coercive Control" },
  { title: "Isolation Tactics", desc: "Slowly cutting you off from friends and family. Often starts as \"I just want you to myself\" and escalates.", category: "Coercive Control" },
  { title: "Threat Escalation", desc: "Verbal threats → property destruction → physical violence. Recognise the pattern before it peaks.", category: "Escalation" },
  { title: "Digital Surveillance", desc: "Demanding passwords, installing tracking apps, monitoring messages. Privacy is a right, not a privilege.", category: "Digital Abuse" },
  { title: "Future-Faking", desc: "Making grand promises about the future to keep you invested. \"Once we move in together, things will change.\"", category: "Manipulation" },
];

export default function HabitDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [streak, setStreak] = useState({ current: 0, longest: 0, total: 0 });
  const [todayDone, setTodayDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [todayEducation, setTodayEducation] = useState(educationCards[0]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/signup");
  }, [authLoading, user, navigate]);

  // Pick education card based on day of year
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setTodayEducation(educationCards[dayOfYear % educationCards.length]);
  }, []);

  // Load streak + check if today is done
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const today = new Date().toISOString().split("T")[0];

      const [{ data: checkin }, { data: streakData }] = await Promise.all([
        supabase.from("habit_checkins").select("id").eq("user_id", user.id).eq("checkin_date", today).maybeSingle(),
        supabase.from("habit_streaks").select("*").eq("user_id", user.id).maybeSingle(),
      ]);

      if (checkin) setTodayDone(true);
      if (streakData) setStreak({ current: streakData.current_streak, longest: streakData.longest_streak, total: streakData.total_checkins });
    };
    load();
  }, [user]);

  const allAnswered = dailyPrompts.every((p) => answers[p.id] !== undefined && answers[p.id] !== null);

  const handleSubmit = async () => {
    if (!user || !allAnswered) return;
    setSubmitting(true);

    const today = new Date().toISOString().split("T")[0];
    const score = dailyPrompts.reduce((sum, p) => {
      const ans = answers[p.id];
      const flagged = p.inverted ? ans === false : ans === true;
      return sum + (flagged ? p.weight : 0);
    }, 0);

    const responses = dailyPrompts.map((p) => ({ id: p.id, text: p.text, answer: answers[p.id] }));

    const { error: checkinErr } = await supabase.from("habit_checkins").insert({
      user_id: user.id,
      checkin_date: today,
      responses,
      score,
    });

    if (checkinErr) {
      if (checkinErr.code === "23505") {
        toast({ title: "Already checked in today! ✅" });
        setTodayDone(true);
      } else {
        toast({ title: "Error", description: checkinErr.message, variant: "destructive" });
      }
      setSubmitting(false);
      return;
    }

    // Update streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const { data: existing } = await supabase.from("habit_streaks").select("*").eq("user_id", user.id).maybeSingle();

    if (existing) {
      const wasYesterday = existing.last_checkin_date === yesterday;
      const newCurrent = wasYesterday ? existing.current_streak + 1 : 1;
      const newLongest = Math.max(existing.longest_streak, newCurrent);
      await supabase.from("habit_streaks").update({
        current_streak: newCurrent,
        longest_streak: newLongest,
        last_checkin_date: today,
        total_checkins: existing.total_checkins + 1,
        updated_at: new Date().toISOString(),
      }).eq("user_id", user.id);
      setStreak({ current: newCurrent, longest: newLongest, total: existing.total_checkins + 1 });
    } else {
      await supabase.from("habit_streaks").insert({
        user_id: user.id,
        current_streak: 1,
        longest_streak: 1,
        last_checkin_date: today,
        total_checkins: 1,
      });
      setStreak({ current: 1, longest: 1, total: 1 });
    }

    setTodayDone(true);
    setSubmitting(false);
    toast({ title: score === 0 ? "All clear today! 🟢" : "Check-in recorded. Stay aware. 💜" });
  };

  if (authLoading) return null;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-1">RedFlaq Habit</h1>
          <p className="font-body text-sm text-muted-foreground">Build safety awareness into your daily routine.</p>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Flame, label: "Current Streak", value: `${streak.current} day${streak.current !== 1 ? "s" : ""}`, color: "text-orange-500" },
            { icon: Trophy, label: "Longest Streak", value: `${streak.longest} day${streak.longest !== 1 ? "s" : ""}`, color: "text-yellow-500" },
            { icon: CalendarCheck, label: "Total Check-ins", value: String(streak.total), color: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
              <p className="font-heading text-xl text-foreground">{s.value}</p>
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Daily Check-In */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg text-foreground">Daily Safety Check-In</h2>
          </div>

          {todayDone ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-heading text-lg text-foreground mb-1">You've checked in today!</p>
              <p className="font-body text-sm text-muted-foreground">Come back tomorrow to keep your streak going.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-body text-sm text-muted-foreground">
                Answer honestly. Your responses are private and encrypted.
              </p>
              {dailyPrompts.map((prompt) => (
                <div key={prompt.id} className="flex items-start gap-3 p-4 bg-muted/40 rounded-xl">
                  <div className="flex-1">
                    <p className="font-body text-sm text-foreground leading-relaxed">{prompt.text}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setAnswers((prev) => ({ ...prev, [prompt.id]: opt.value }))}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          answers[prompt.id] === opt.value
                            ? opt.value
                              ? "bg-destructive/10 border-destructive text-destructive"
                              : "bg-green-50 border-green-500 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <Button onClick={handleSubmit} disabled={!allAnswered || submitting} className="w-full rounded-full mt-2">
                {submitting ? "Saving..." : "Complete Check-In"} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {/* Education Card */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg text-foreground">Today's Red Flag Lesson</h2>
            <span className="ml-auto font-mono text-[10px] tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">{todayEducation.category}</span>
          </div>
          <h3 className="font-heading text-base text-foreground mb-2">{todayEducation.title}</h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">{todayEducation.desc}</p>
        </div>

        <p className="font-mono text-[10px] text-muted-foreground text-center tracking-wider">
          Your check-in data is private and never shared. Only you can see your responses.
        </p>
      </div>
    </DashboardLayout>
  );
}

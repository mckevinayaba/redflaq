import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "@/hooks/use-toast";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const card: React.CSSProperties = {
  background: '#111118',
  border: '1px solid rgba(108,53,222,0.25)',
  borderRadius: 8,
  padding: '24px',
};

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

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setTodayEducation(educationCards[dayOfYear % educationCards.length]);
  }, []);

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
    const { error: checkinErr } = await supabase.from("habit_checkins").insert({ user_id: user.id, checkin_date: today, responses, score });
    if (checkinErr) {
      if (checkinErr.code === "23505") { toast({ title: "Already checked in today!" }); setTodayDone(true); }
      else toast({ title: "Error", description: checkinErr.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const { data: existing } = await supabase.from("habit_streaks").select("*").eq("user_id", user.id).maybeSingle();
    if (existing) {
      const wasYesterday = existing.last_checkin_date === yesterday;
      const newCurrent = wasYesterday ? existing.current_streak + 1 : 1;
      const newLongest = Math.max(existing.longest_streak, newCurrent);
      await supabase.from("habit_streaks").update({ current_streak: newCurrent, longest_streak: newLongest, last_checkin_date: today, total_checkins: existing.total_checkins + 1, updated_at: new Date().toISOString() }).eq("user_id", user.id);
      setStreak({ current: newCurrent, longest: newLongest, total: existing.total_checkins + 1 });
    } else {
      await supabase.from("habit_streaks").insert({ user_id: user.id, current_streak: 1, longest_streak: 1, last_checkin_date: today, total_checkins: 1 });
      setStreak({ current: 1, longest: 1, total: 1 });
    }
    setTodayDone(true);
    setSubmitting(false);
    toast({ title: score === 0 ? "All clear today!" : "Check-in recorded. Stay aware." });
  };

  if (authLoading) return null;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ ...mono, fontSize: 10, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
            Behavioral Patterns
          </p>
          <h1 style={{ ...inter, fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: 8 }}>
            Track What You're Seeing
          </h1>
          <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.7 }}>
            Patterns become evidence. Build daily safety awareness into your routine.
          </p>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-4" style={{ marginBottom: 24 }}>
          {[
            { label: "Current Streak", value: `${streak.current} day${streak.current !== 1 ? "s" : ""}`, color: '#E67E22', icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            )},
            { label: "Longest Streak", value: `${streak.longest} day${streak.longest !== 1 ? "s" : ""}`, color: '#F1C40F', icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F1C40F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
            )},
            { label: "Total Check-ins", value: String(streak.total), color: '#6C35DE', icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            )},
          ].map((s) => (
            <div key={s.label} style={{ ...card, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>{s.icon}</div>
              <p style={{ ...inter, fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>
                {s.value}
              </p>
              <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Daily Check-In */}
        <div style={{ ...card, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h2 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Daily Safety Check-In</h2>
          </div>

          {todayDone ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
                <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
              </svg>
              <p style={{ ...inter, fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>You've checked in today.</p>
              <p style={{ ...inter, fontSize: 14, color: '#8b8b91' }}>Come back tomorrow to keep your streak going.</p>
            </div>
          ) : (
            <div>
              <p style={{ ...inter, fontSize: 14, color: '#8b8b91', marginBottom: 20 }}>
                Answer honestly. Your responses are private and encrypted.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {dailyPrompts.map((prompt) => (
                  <div key={prompt.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '14px 16px',
                    background: '#0d0d1a',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 6,
                  }}>
                    <p style={{ ...inter, fontSize: 14, color: '#d1d1d6', flex: 1, lineHeight: 1.5 }}>{prompt.text}</p>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {[{ label: "Yes", value: true }, { label: "No", value: false }].map((opt) => {
                        const isSelected = answers[prompt.id] === opt.value;
                        const isDanger = isSelected && (opt.value === true ? !prompt.inverted : prompt.inverted);
                        const isSafe = isSelected && (opt.value === true ? !!prompt.inverted : !prompt.inverted);
                        return (
                          <button
                            key={opt.label}
                            onClick={() => setAnswers((prev) => ({ ...prev, [prompt.id]: opt.value }))}
                            style={{
                              ...inter, fontSize: 12, fontWeight: 600,
                              padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
                              border: isSelected
                                ? isDanger ? '1px solid #C0392B' : '1px solid #27AE60'
                                : '1px solid rgba(255,255,255,0.12)',
                              background: isSelected
                                ? isDanger ? 'rgba(192,57,43,0.15)' : 'rgba(39,174,96,0.15)'
                                : 'transparent',
                              color: isSelected
                                ? isDanger ? '#C0392B' : '#27AE60'
                                : '#8b8b91',
                              transition: 'all 0.15s',
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                style={{
                  ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff',
                  background: allAnswered ? '#6C35DE' : 'rgba(108,53,222,0.3)',
                  border: 'none', padding: '12px 24px', borderRadius: 4,
                  cursor: allAnswered ? 'pointer' : 'not-allowed', width: '100%',
                  transition: 'opacity 0.2s',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Saving..." : "Complete Check-In →"}
              </button>
            </div>
          )}
        </div>

        {/* Education Card */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <h2 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Today's Red Flag Lesson</h2>
            <span style={{ marginLeft: 'auto', ...mono, fontSize: 9, color: '#6C35DE', background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.25)', padding: '3px 10px', borderRadius: 4 }}>
              {todayEducation.category}
            </span>
          </div>
          <h3 style={{ ...inter, fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>{todayEducation.title}</h3>
          <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.7 }}>{todayEducation.desc}</p>
        </div>

        <p style={{ ...mono, fontSize: 10, color: '#8b8b91', textAlign: 'center', letterSpacing: '0.08em' }}>
          Your check-in data is private and never shared. Only you can see your responses.
        </p>
      </div>
    </DashboardLayout>
  );
}

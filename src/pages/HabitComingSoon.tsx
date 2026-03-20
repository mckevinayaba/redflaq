import { useState } from "react";
import { CalendarCheck, BookOpen, Flame, ArrowRight } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const pillars = [
  { icon: CalendarCheck, title: "Daily Check-Ins", desc: "Quick safety prompts that build awareness into your daily routine." },
  { icon: BookOpen, title: "Red Flag Education", desc: "Learn to recognise manipulation, coercion, and escalation patterns." },
  { icon: Flame, title: "Safety Streaks", desc: "Gamified consistency that rewards you for prioritising your safety." },
];

export default function HabitComingSoon() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "You're on the list! 🎉", description: "We'll notify you when RedFlaq Habit launches." });
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarPlinq />

      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)", paddingTop: 120, paddingBottom: 72 }}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70%] h-1/2 pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
        <div className="max-w-[700px] mx-auto px-5 sm:px-6 relative z-10 text-center">
          <span className="inline-block font-mono text-[11px] tracking-[0.15em] px-3 py-1 rounded-full border border-primary/30 text-primary mb-5">Launching April 2026</span>
          <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[48px] leading-[1.05] mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>
            Make Safety a <span className="text-primary">Daily Habit</span>
          </h1>
          <p className="font-body text-[15px] sm:text-lg text-white/60 max-w-[480px] mx-auto mb-8">
            RedFlaq Habit transforms awareness into action with daily check-ins, education, and streaks.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-[400px] mx-auto">
            <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40" required />
            <Button type="submit" className="rounded-full px-5 flex-shrink-0">Notify Me <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </form>
        </div>
      </section>

      <main className="max-w-[800px] mx-auto px-5 sm:px-6 py-12 sm:py-16 w-full">
        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="text-center p-6 bg-card border border-border rounded-[18px] shadow-sm">
                <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg text-foreground mb-2">{p.title}</h3>
                <p className="font-body text-[13px] text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="p-6 sm:p-8 bg-card border border-border rounded-[20px] shadow-sm text-center">
          <h2 className="font-heading text-xl sm:text-2xl text-foreground mb-3">Why Habits Matter</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[500px] mx-auto">
            Safety isn't a one-time action — it's a practice. RedFlaq Habit helps you build the muscle memory to recognise danger before it escalates, turning awareness into instinct.
          </p>
        </div>
      </main>

      <FooterPlinq />
    </div>
  );
}

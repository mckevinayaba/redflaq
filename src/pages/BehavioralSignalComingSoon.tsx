import { useState } from "react";
import { Brain, AlertTriangle, TrendingUp, Shield, Users, ArrowRight } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const categories = [
  { icon: AlertTriangle, title: "Coercive Control", desc: "Isolation, financial abuse, monitoring" },
  { icon: Brain, title: "Manipulation Patterns", desc: "Gaslighting, love-bombing, future-faking" },
  { icon: TrendingUp, title: "Escalation Indicators", desc: "Verbal → physical escalation markers" },
  { icon: Shield, title: "Digital Abuse", desc: "Stalking, account control, image threats" },
  { icon: Users, title: "Social Engineering", desc: "Triangulation, reputation attacks, flying monkeys" },
];

export default function BehavioralSignalComingSoon() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "You're on the list! 🎉", description: "We'll notify you when Behavioral Signal Detection launches." });
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarPlinq />

      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)", paddingTop: 120, paddingBottom: 72 }}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70%] h-1/2 pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
        <div className="max-w-[700px] mx-auto px-5 sm:px-6 relative z-10 text-center">
          <span className="inline-block font-mono text-[11px] tracking-[0.15em] px-3 py-1 rounded-full border border-primary/30 text-primary mb-5">Launching May 2026</span>
          <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[48px] leading-[1.05] mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>
            Beyond Records.<br />
            <span className="text-primary">Behavioral Signal Detection.</span>
          </h1>
          <p className="font-body text-[15px] sm:text-lg text-white/60 max-w-[500px] mx-auto mb-8">
            Not every dangerous person has a criminal record. Our AI-powered behavioral analysis identifies warning signs before they become headlines.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-[400px] mx-auto">
            <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40" required />
            <Button type="submit" className="rounded-full px-5 flex-shrink-0">Notify Me <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </form>
        </div>
      </section>

      <main className="max-w-[800px] mx-auto px-5 sm:px-6 py-12 sm:py-16 w-full">
        <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-primary" />
          5 Signal Categories
        </p>
        <h2 className="font-heading text-[24px] sm:text-[32px] text-foreground mb-6">What we'll detect</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="flex items-start gap-3 p-5 bg-card border border-border rounded-[14px] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-base text-foreground mb-1">{c.title}</h3>
                  <p className="font-body text-[13px] text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 sm:p-8 bg-card border border-border rounded-[20px] shadow-sm text-center">
          <h2 className="font-heading text-xl sm:text-2xl text-foreground mb-3">The Science</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[500px] mx-auto">
            Built on peer-reviewed research into domestic violence escalation patterns, coercive control frameworks, and digital abuse indicators. Our models are trained to spot what humans often normalise.
          </p>
        </div>
      </main>

      <FooterPlinq />
    </div>
  );
}

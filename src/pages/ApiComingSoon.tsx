import { useState } from "react";
import { Code, Webhook, FileCode, ArrowRight, Heart, Building2, Smartphone, Shield } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const forWho = [
  { icon: Smartphone, label: "Dating Apps" },
  { icon: Building2, label: "HR & Recruitment" },
  { icon: Shield, label: "Security Companies" },
  { icon: Heart, label: "NGOs & Shelters" },
];

const features = [
  { icon: Code, title: "REST API", desc: "Simple JSON endpoints for name, ID, and case-number lookups." },
  { icon: Webhook, title: "Webhooks", desc: "Real-time alerts when records matching your watchlist are added." },
  { icon: FileCode, title: "Full Documentation", desc: "OpenAPI spec, SDKs for Node.js & Python, and sandbox environment." },
];

export default function ApiComingSoon() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "You're on the list! 🎉", description: "We'll reach out when the API is ready for beta." });
    setEmail("");
    setCompany("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarPlinq />

      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)", paddingTop: 120, paddingBottom: 72 }}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70%] h-1/2 pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
        <div className="max-w-[700px] mx-auto px-5 sm:px-6 relative z-10 text-center">
          <span className="inline-block font-mono text-[11px] tracking-[0.15em] px-3 py-1 rounded-full border border-primary/30 text-primary mb-5">Q3 2026</span>
          <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[48px] leading-[1.05] mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>
            RedFlaq <span className="text-primary">API</span>
          </h1>
          <p className="font-body text-[15px] sm:text-lg text-white/60 max-w-[480px] mx-auto mb-8">
            Integrate public safety record checks directly into your platform. Build trust at scale.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-[440px] mx-auto">
            <Input type="email" placeholder="work@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40" required />
            <Input type="text" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} className="rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40" />
            <Button type="submit" className="rounded-full px-5 flex-shrink-0">Join Waitlist <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </form>
        </div>
      </section>

      <main className="max-w-[800px] mx-auto px-5 sm:px-6 py-12 sm:py-16 w-full">
        <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-primary" />
          Built For
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {forWho.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-[14px] shadow-sm">
                <Icon className="w-6 h-6 text-primary" />
                <span className="font-body text-[13px] text-foreground font-medium text-center">{f.label}</span>
              </div>
            );
          })}
        </div>

        <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-primary" />
          What You Get
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-5 bg-card border border-border rounded-[18px] shadow-sm text-center">
                <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-base text-foreground mb-1">{f.title}</h3>
                <p className="font-body text-[13px] text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </main>

      <FooterPlinq />
    </div>
  );
}

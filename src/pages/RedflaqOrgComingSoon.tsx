import { useState } from "react";
import { Building, Users, FileCheck, GraduationCap, BarChart3, ArrowRight } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const features = [
  { icon: Users, title: "Bulk Verification", desc: "Screen multiple individuals at once for shelters, schools, and organisations." },
  { icon: FileCheck, title: "Compliance Reports", desc: "Downloadable safety compliance documentation for audits and governance." },
  { icon: GraduationCap, title: "Training Materials", desc: "GBV awareness curriculum for staff, volunteers, and community leaders." },
  { icon: BarChart3, title: "Impact Dashboard", desc: "Track checks performed, risks flagged, and safety outcomes." },
];

export default function RedflaqOrgComingSoon() {
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "You're on the list! 🎉", description: "We'll reach out when RedFlaq for Organisations launches." });
    setEmail("");
    setOrg("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarPlinq />

      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)", paddingTop: 120, paddingBottom: 72 }}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70%] h-1/2 pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
        <div className="max-w-[700px] mx-auto px-5 sm:px-6 relative z-10 text-center">
          <span className="inline-block font-mono text-[11px] tracking-[0.15em] px-3 py-1 rounded-full border border-primary/30 text-primary mb-5">Coming Soon</span>
          <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[48px] leading-[1.05] mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>
            RedFlaq for <span className="text-primary">Organisations</span>
          </h1>
          <p className="font-body text-[15px] sm:text-lg text-white/60 max-w-[500px] mx-auto mb-8">
            Purpose-built safety infrastructure for NGOs, shelters, schools, and community organisations.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-[440px] mx-auto">
            <Input type="email" placeholder="you@organisation.org" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40" required />
            <Input type="text" placeholder="Organisation name" value={org} onChange={(e) => setOrg(e.target.value)} className="rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40" />
            <Button type="submit" className="rounded-full px-5 flex-shrink-0">Join Waitlist <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </form>
        </div>
      </section>

      <main className="max-w-[800px] mx-auto px-5 sm:px-6 py-12 sm:py-16 w-full">
        <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-primary" />
          What's Coming
        </p>
        <h2 className="font-heading text-[24px] sm:text-[32px] text-foreground mb-6">Built for impact at scale</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex items-start gap-3 p-5 bg-card border border-border rounded-[14px] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-base text-foreground mb-1">{f.title}</h3>
                  <p className="font-body text-[13px] text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <FooterPlinq />
    </div>
  );
}

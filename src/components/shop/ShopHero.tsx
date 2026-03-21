import { ShoppingBag, Mail } from "lucide-react";
import BackToHome from "@/components/landing/BackToHome";
import { Button } from "@/components/ui/button";

interface ShopHeroProps {
  email: string;
  setEmail: (v: string) => void;
  onNotify: (e: React.FormEvent) => void;
}

export default function ShopHero({ email, setEmail, onNotify }: ShopHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)",
        paddingTop: 100,
        paddingBottom: 72,
      }}
    >
      <BackToHome light />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70%] h-1/2 pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10 text-center">
        <p className="font-mono text-[11px] tracking-[0.15em] mb-4 text-primary">
          <ShoppingBag className="w-4 h-4 inline mr-2" />
          RedFlaq Shop
        </p>
        <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[48px] leading-[1.05] mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>
          Wear the Movement.<br />
          <span className="text-primary">Support Women's Safety.</span>
        </h1>
        <p className="font-body text-[15px] sm:text-lg text-white/60 max-w-[480px] mx-auto mb-8">
          Every purchase funds free safety tools for South African women.
        </p>

        <form onSubmit={onNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" className="rounded-full h-11 px-6">
            Notify Me
          </Button>
        </form>
      </div>
    </section>
  );
}

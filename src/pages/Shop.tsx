import { ShoppingBag } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const products = [
  {
    name: "RedFlaq Cap",
    description: "Embroidered logo on structured cotton. One size fits all.",
    price: "R249",
    emoji: "🧢",
  },
  {
    name: "RedFlaq Tracksuit",
    description: "Premium fleece with subtle branding. Unisex sizing.",
    price: "R899",
    emoji: "🏃‍♀️",
  },
  {
    name: "RedFlaq Jumpsuit",
    description: "Statement piece. Bold print. Limited edition.",
    price: "R1,199",
    emoji: "👗",
  },
];

export default function Shop() {
  const handleComingSoon = () => {
    toast({ title: "Coming Soon!", description: "We'll notify you when our shop launches." });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarPlinq />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)",
          paddingTop: 120,
          paddingBottom: 72,
        }}
      >
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
          <p className="font-body text-[15px] sm:text-lg text-white/60 max-w-[480px] mx-auto">
            Every purchase funds free safety tools for South African women.
          </p>
        </div>
      </section>

      {/* Products */}
      <main className="max-w-[900px] mx-auto px-5 sm:px-6 py-12 sm:py-16 w-full">
        <div className="grid sm:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.name} className="bg-card border border-border rounded-[20px] overflow-hidden shadow-sm flex flex-col">
              <div className="h-48 bg-muted flex items-center justify-center text-6xl">{p.emoji}</div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-heading text-lg text-foreground mb-1">{p.name}</h3>
                <p className="font-body text-[13px] text-muted-foreground leading-relaxed mb-4 flex-1">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl text-foreground">{p.price}</span>
                  <Button onClick={handleComingSoon} className="rounded-full text-xs px-4">
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <FooterPlinq />
    </div>
  );
}

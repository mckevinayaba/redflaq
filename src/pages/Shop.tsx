import { ShoppingBag, Mail } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

import tracksuitImg from "@/assets/shop/tracksuits.png";
import jumpsuitImg from "@/assets/shop/jumpsuits.png";
import capsImg from "@/assets/shop/caps.png";

interface Product {
  name: string;
  description: string;
  price: string;
  image: string;
  colors?: string[];
  sizes?: string[];
  tag?: string;
}

const products: Product[] = [
  {
    name: "RedFlaq Tracksuit Set — White",
    description: '"You\'re not crazy. You\'re protecting yourself." Half-zip top + shorts. Unisex.',
    price: "R899",
    image: tracksuitImg,
    colors: ["#FFFFFF", "#6B21A8"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "RedFlaq Tracksuit Set — Purple",
    description: '"Before You Trust, RedFlaq First." Half-zip top + skirt combo. Premium fleece.',
    price: "R949",
    image: tracksuitImg,
    colors: ["#6B21A8", "#FFFFFF"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "RedFlaq Cap",
    description: "Embroidered logo on structured cotton. Available in 4 colours. One size fits all.",
    price: "R249",
    image: capsImg,
    colors: ["#1A1A2E", "#FFFFFF", "#DC2626", "#1E3A5F"],
  },
  {
    name: "RedFlaq Sweatshirt",
    description: '"A New Safety Habit for South Africa." Oversized long-sleeve. Soft-touch cotton.',
    price: "R599",
    image: tracksuitImg,
    colors: ["#FFFFFF", "#6B21A8"],
    sizes: ["S", "M", "L", "XL"],
    tag: "New",
  },
  {
    name: "RedFlaq Jumpsuit — Denim",
    description: '"Before You Trust, RedFlaq First." Statement piece. Bold print. Limited edition.',
    price: "R1,199",
    image: jumpsuitImg,
    colors: ["#1E3A5F", "#FFFFFF", "#DC2626"],
    sizes: ["S", "M", "L", "XL"],
    tag: "Limited",
  },
  {
    name: "RedFlaq Jumpsuit — Block",
    description: "Navy + purple colour-block jumpsuit. Full-length. Zipper front.",
    price: "R1,199",
    image: jumpsuitImg,
    colors: ["#1E3A5F", "#6B21A8"],
    sizes: ["S", "M", "L", "XL"],
  },
];

export default function Shop() {
  const [email, setEmail] = useState("");

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "You're on the list! 🎉", description: "We'll email you when the shop launches." });
    setEmail("");
  };

  const handleComingSoon = () => {
    toast({ title: "Coming Soon!", description: "We'll notify you when this item is available." });
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
          <p className="font-body text-[15px] sm:text-lg text-white/60 max-w-[480px] mx-auto mb-8">
            Every purchase funds free safety tools for South African women.
          </p>

          {/* Email capture */}
          <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
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

      {/* Mission strip */}
      <div className="bg-primary text-primary-foreground text-center py-3 text-sm font-medium tracking-wide">
        🤍 100% of proceeds fund free safety tools for South African women
      </div>

      {/* Lookbook gallery */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[capsImg, tracksuitImg, jumpsuitImg].map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={img} alt="RedFlaq lookbook" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <main className="max-w-[1100px] mx-auto px-5 sm:px-6 py-12 sm:py-16 w-full">
        <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-8 text-center">The Collection</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.name} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col group">
              <div className="relative h-64 bg-muted overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {p.tag && (
                  <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-heading text-base text-foreground mb-1">{p.name}</h3>
                <p className="font-body text-[13px] text-muted-foreground leading-relaxed mb-3 flex-1">{p.description}</p>

                {/* Color dots */}
                {p.colors && (
                  <div className="flex gap-1.5 mb-3">
                    {p.colors.map((c) => (
                      <span
                        key={c}
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}

                {/* Sizes */}
                {p.sizes && (
                  <div className="flex gap-1.5 mb-4">
                    {p.sizes.map((s) => (
                      <span key={s} className="text-[11px] text-muted-foreground border border-border rounded px-2 py-0.5">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl text-foreground">{p.price}</span>
                  <Button onClick={handleComingSoon} size="sm" className="rounded-full text-xs px-4">
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

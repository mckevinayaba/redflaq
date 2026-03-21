import { ShoppingBag, Mail } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import BackToHome from "@/components/landing/BackToHome";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import ImageLightbox from "@/components/shop/ImageLightbox";

import tracksuitImg from "@/assets/shop/tracksuits.png";
import jumpsuitImg from "@/assets/shop/jumpsuits.png";
import capsImg from "@/assets/shop/caps.png";
import tracksuitBlackImg from "@/assets/shop/tracksuit-black.png";
import lookbookCollageImg from "@/assets/shop/lookbook-collage.png";
import jumpsuitTrioImg from "@/assets/shop/jumpsuits-trio.png";
import hoodieVestTrioImg from "@/assets/shop/hoodie-vest-trio.png";
import tracksuitDuoImg from "@/assets/shop/tracksuit-duo.png";

import ShopHero from "@/components/shop/ShopHero";
import ShopProductGrid from "@/components/shop/ShopProductGrid";

const galleryImages = [
  { src: tracksuitBlackImg, alt: "RedFlaq Tracksuit — Black with purple accents" },
  { src: lookbookCollageImg, alt: "RedFlaq full collection lookbook" },
  { src: jumpsuitTrioImg, alt: "RedFlaq Jumpsuits — Orange, Denim, White" },
  { src: hoodieVestTrioImg, alt: "RedFlaq Hoodies & Protective Vest" },
  { src: tracksuitDuoImg, alt: "RedFlaq Tracksuit — Black & Red-White" },
  { src: capsImg, alt: "RedFlaq Caps collection" },
  { src: tracksuitImg, alt: "RedFlaq Tracksuits" },
  { src: jumpsuitImg, alt: "RedFlaq Jumpsuits" },
];

export interface Product {
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
    name: "RedFlaq Tracksuit Set — Black",
    description: '"Before You Trust, RedFlaq First." Half-zip top + joggers. Purple accents. Unisex.',
    price: "R899",
    image: tracksuitBlackImg,
    colors: ["#1A1A2E", "#6B21A8"],
    sizes: ["S", "M", "L", "XL"],
    tag: "New",
  },
  {
    name: "RedFlaq Tracksuit Set — White",
    description: '"You\'re not crazy. You\'re protecting yourself." Half-zip top + shorts. Unisex.',
    price: "R899",
    image: tracksuitImg,
    colors: ["#FFFFFF", "#6B21A8"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "RedFlaq Tracksuit Set — Red/White",
    description: '"Before You Trust, RedFlaq First." Zip-up crop jacket + shorts. Bold and fresh.',
    price: "R949",
    image: tracksuitDuoImg,
    colors: ["#DC2626", "#FFFFFF"],
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
    name: "RedFlaq Sweatshirt — Purple",
    description: '"You\'re not crazy. You\'re protecting yourself." Oversized crop. Soft-touch cotton.',
    price: "R599",
    image: hoodieVestTrioImg,
    colors: ["#6B21A8", "#FFFFFF", "#1A1A2E"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "RedFlaq Jumpsuit — Denim",
    description: '"Before You Trust, RedFlaq First." Statement piece. Bold print. Limited edition.',
    price: "R1,199",
    image: jumpsuitTrioImg,
    colors: ["#1E3A5F", "#FFFFFF", "#DC2626"],
    sizes: ["S", "M", "L", "XL"],
    tag: "Limited",
  },
  {
    name: "RedFlaq Jumpsuit — Orange Hi-Vis",
    description: '"Before You Trust, RedFlaq First." Safety-inspired design. Reflective accents.',
    price: "R1,199",
    image: jumpsuitTrioImg,
    colors: ["#EA580C", "#FACC15"],
    sizes: ["S", "M", "L", "XL"],
    tag: "Limited",
  },
  {
    name: "RedFlaq Jumpsuit — White",
    description: '"You\'re Not Crazy. You\'re protecting yourself." Clean, minimal. Full-length.',
    price: "R1,199",
    image: jumpsuitTrioImg,
    colors: ["#FFFFFF", "#6B21A8"],
    sizes: ["S", "M", "L", "XL"],
  },
];

export default function Shop() {
  const [email, setEmail] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "You're on the list! 🎉", description: "We'll email you when the shop launches." });
    setEmail("");
  };

  const handleComingSoon = () => {
    toast({ title: "Coming Soon!", description: "We'll notify you when this item is available." });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Build product images for lightbox from product cards
  const allProductImages = products.map((p) => ({ src: p.image, alt: p.name }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarPlinq />

      <ShopHero email={email} setEmail={setEmail} onNotify={handleNotify} />

      {/* Mission strip */}
      <div className="bg-primary text-primary-foreground text-center py-3 text-sm font-medium tracking-wide">
        🤍 100% of proceeds fund free safety tools for South African women
      </div>

      {/* Lookbook gallery */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-12 sm:pt-16">
        <h2 className="font-heading text-xl sm:text-2xl text-foreground mb-6 text-center">The Lookbook</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i)}
              className="rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <ShopProductGrid products={products} onComingSoon={handleComingSoon} />

      <ImageLightbox
        images={galleryImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />

      <FooterPlinq />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import type { Product } from "@/pages/Shop";

interface ShopProductGridProps {
  products: Product[];
  onComingSoon: () => void;
}

export default function ShopProductGrid({ products, onComingSoon }: ShopProductGridProps) {
  return (
    <main className="max-w-[1100px] mx-auto px-5 sm:px-6 py-12 sm:py-16 w-full">
      <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-8 text-center">The Collection</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((p) => (
          <div key={p.name} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col group">
            <div className="relative h-56 bg-muted overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {p.tag && (
                <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                  {p.tag}
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-heading text-sm text-foreground mb-1">{p.name}</h3>
              <p className="font-body text-[12px] text-muted-foreground leading-relaxed mb-3 flex-1">{p.description}</p>

              {p.colors && (
                <div className="flex gap-1.5 mb-2">
                  {p.colors.map((c) => (
                    <span key={c} className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: c }} />
                  ))}
                </div>
              )}

              {p.sizes && (
                <div className="flex gap-1 mb-3">
                  {p.sizes.map((s) => (
                    <span key={s} className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="font-heading text-lg text-foreground">{p.price}</span>
                <Button onClick={onComingSoon} size="sm" className="rounded-full text-xs px-4">
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

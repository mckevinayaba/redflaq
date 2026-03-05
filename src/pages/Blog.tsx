import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  featured_image_url: string | null;
  created_at: string;
  author: string;
}

const categories = [
  { value: "all", label: "All" },
  { value: "dating-safety", label: "Dating Safety" },
  { value: "tenant-safety", label: "Tenant & Landlord" },
  { value: "domestic-worker-safety", label: "Domestic Worker" },
  { value: "popia-privacy", label: "POPIA & Privacy" },
  { value: "gbv-resources", label: "GBV Resources" },
];

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("academy_articles")
        .select("id, title, slug, excerpt, category, featured_image_url, created_at, author")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  const filtered = activeCategory === "all" ? articles : articles.filter((a) => a.category === activeCategory);

  return (
    <div style={{ background: "#F7F4F0", minHeight: "100vh", overflowX: "hidden" }}>
      <NavbarPlinq />

      {/* Hero — dark */}
      <section style={{
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
        paddingTop: 120, paddingBottom: 64,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10">
          <p className="font-mono text-[11px] tracking-[0.15em] mb-4 flex items-center gap-3" style={{ color: '#A855F7' }}>
            <span style={{ width: 24, height: 1, background: '#A855F7', display: 'inline-block' }} />
            Blog
          </p>
          <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[48px] leading-[1.05] mb-4" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            New risks, real stories,<br />
            <span style={{ color: '#A855F7' }}>better decisions.</span>
          </h1>
          <p className="font-body text-[15px] sm:text-base leading-relaxed max-w-[560px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Fresh information on scams, dating and tenant behaviours, GBV trends, and RedFlaq updates — helping South Africans make safer decisions.
          </p>
        </div>
      </section>

      <div className="max-w-[900px] mx-auto px-5 sm:px-6 py-10 sm:py-14">
        {/* Category filters — horizontal scroll on mobile */}
        <div className="mb-8 overflow-x-auto scrollbar-hide pb-2 -mx-1">
          <div className="flex gap-2.5 px-1 min-w-max">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className="transition-all duration-200 min-h-[44px] whitespace-nowrap"
                  style={{
                    padding: "10px 20px",
                    background: isActive ? "#7C3AED" : "#FFFFFF",
                    color: isActive ? "#FFFFFF" : "#4B4453",
                    border: `1.5px solid ${isActive ? "#7C3AED" : "rgba(214,211,205,0.6)"}`,
                    fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", borderRadius: 50,
                    boxShadow: isActive ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ width: 32, height: 32, border: "3px solid #7C3AED", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center p-10 sm:p-16" style={{
            background: "#FFFFFF", border: "1px solid rgba(214,211,205,0.6)",
            borderRadius: 20,
          }}>
            <span style={{ fontSize: 40 }}>📝</span>
            <h3 className="font-heading text-xl sm:text-2xl text-foreground mt-3 mb-2">Articles coming soon</h3>
            <p className="font-body text-sm text-muted-foreground">
              We're working on safety guides and resources. Check back soon, or{" "}
              <Link to="/safety-tips" style={{ color: "#7C3AED", fontWeight: 700 }}>explore our free safety tips</Link>.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5">
            {filtered.map((article) => (
              <Link
                key={article.id}
                to={`/blog/${article.slug}`}
                className="block no-underline transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "#FFFFFF", border: "1px solid rgba(214,211,205,0.6)",
                  padding: '24px 20px', borderRadius: 18,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <span className="font-mono text-[10px] tracking-[0.1em] font-semibold" style={{ color: '#A855F7', textTransform: 'uppercase' }}>
                  {article.category.replace(/-/g, " ")}
                </span>
                <h2 className="font-heading text-lg sm:text-xl text-foreground mt-1 mb-2">{article.title}</h2>
                {article.excerpt && (
                  <p className="font-body text-[13px] sm:text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                )}
                <p className="font-mono text-[10px] mt-3" style={{ color: '#9CA3AF' }}>
                  {article.author} · {new Date(article.created_at).toLocaleDateString("en-ZA")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
      <FooterPlinq />
    </div>
  );
};

export default Blog;

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
    <div style={{ background: "#F7F4F0", minHeight: "100vh" }}>
      <NavbarPlinq />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 24px 60px" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>
          BLOG
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: "#2D2235", marginBottom: 12, lineHeight: 1.2 }}>
          RedFlaq Blog: New Risks, Real Stories, Better Decisions
        </h1>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#78716C", lineHeight: 1.6, maxWidth: 650, marginBottom: 32 }}>
          Fresh information on scams, dating and tenant behaviours, GBV trends, and RedFlaq updates — helping South Africans make safer decisions.
        </p>

        {/* Category filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                padding: "8px 16px",
                background: activeCategory === cat.value ? "#7C3AED" : "white",
                color: activeCategory === cat.value ? "white" : "#4B4453",
                border: `1.5px solid ${activeCategory === cat.value ? "#7C3AED" : "#D6D3CD"}`,
                fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ width: 32, height: 32, border: "3px solid #7C3AED", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "white", border: "1.5px solid #D6D3CD" }}>
            <span style={{ fontSize: 40 }}>📝</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2235", margin: "12px 0" }}>
              Articles coming soon
            </h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C" }}>
              We're working on safety guides and resources. Check back soon, or{" "}
              <Link to="/safety-tips" style={{ color: "#7C3AED", fontWeight: 700 }}>explore our free safety tips</Link>.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 24 }}>
            {filtered.map((article) => (
              <Link
                key={article.id}
                to={`/blog/${article.slug}`}
                style={{ display: "block", background: "white", border: "1.5px solid #D6D3CD", padding: 28, textDecoration: "none" }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#7C3AED", fontWeight: 600, textTransform: "uppercase" }}>
                  {article.category.replace(/-/g, " ")}
                </span>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2235", margin: "6px 0 8px" }}>
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", lineHeight: 1.6 }}>
                    {article.excerpt}
                  </p>
                )}
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9CA3AF", marginTop: 12 }}>
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

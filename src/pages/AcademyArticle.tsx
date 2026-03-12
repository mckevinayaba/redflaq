import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  meta_description: string | null;
  created_at: string;
  author: string;
  related_tool_slug: string | null;
}

const toolMap: Record<string, { label: string; href: string }> = {
  "first-date-safety": { label: "First Date Safety Checklist", href: "/tools/first-date-safety" },
  "tenant-safety": { label: "Tenant Safety Checklist", href: "/tools/tenant-safety" },
  "domestic-worker-safety": { label: "Domestic Worker Safety Checklist", href: "/tools/domestic-worker-safety" },
  "red-flag-quiz": { label: "Is This a Red Flag? Quiz", href: "/tools/red-flag-quiz" },
};

const AcademyArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("academy_articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (data) {
        setArticle(data);
        // Fetch related
        const { data: rel } = await supabase
          .from("academy_articles")
          .select("id, title, slug")
          .eq("published", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);
        setRelated(rel || []);
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: "#F5F0EB", minHeight: "100vh" }}>
        <NavbarPlinq />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "200px 24px" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #7C3AED", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ background: "#F5F0EB", minHeight: "100vh" }}>
        <NavbarPlinq />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#2D2235" }}>Article not found</h1>
          <Link to="/academy" style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#7C3AED", marginTop: 16, display: "inline-block" }}>← Back to Safety Academy</Link>
        </div>
        <FooterPlinq />
      </div>
    );
  }

  const relatedTool = article.related_tool_slug ? toolMap[article.related_tool_slug] : null;

  return (
    <div style={{ background: "#F5F0EB", minHeight: "100vh" }}>
      <NavbarPlinq />
      <article style={{ maxWidth: 720, margin: "0 auto", padding: "100px 24px 60px" }}>
        <Link to="/academy" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#7C3AED", textDecoration: "none", textTransform: "uppercase", marginBottom: 16, display: "block" }}>
          ← Back to Safety Academy
        </Link>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#7C3AED", fontWeight: 600, textTransform: "uppercase" }}>
          {article.category.replace(/-/g, " ")}
        </span>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#2D2235", margin: "8px 0 12px", lineHeight: 1.2 }}>
          {article.title}
        </h1>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9CA3AF", marginBottom: 32 }}>
          {article.author} · {new Date(article.created_at).toLocaleDateString("en-ZA")}
        </p>

        {/* Article content - rendered as HTML */}
        <div
          style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: "#2D2235", lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA */}
        <div style={{ background: "#FAF5FF", border: "2px solid #7C3AED", padding: 32, textAlign: "center", marginTop: 40 }}>
          <Shield size={28} style={{ color: "#7C3AED", margin: "0 auto 8px" }} />
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2235", marginBottom: 8 }}>
            Run a safety check now
          </h3>
          <Link to="/search-form" style={{ display: "inline-block", background: "#7C3AED", color: "white", padding: "12px 28px", fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Check Public Records →
          </Link>
        </div>

        {/* Related tool */}
        {relatedTool && (
          <div style={{ background: "white", border: "1.5px solid #D6D3CD", padding: 20, marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9CA3AF", letterSpacing: "0.1em" }}>RELATED TOOL</span>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: "#2D2235" }}>{relatedTool.label}</p>
            </div>
            <Link to={relatedTool.href} style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#7C3AED", fontWeight: 700, textDecoration: "none" }}>Try it →</Link>
          </div>
        )}

        {/* Related articles */}
        {related.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#2D2235", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              Related Articles
            </h4>
            {related.map((r) => (
              <Link key={r.id} to={`/academy/${r.slug}`} style={{ display: "block", padding: "12px 0", borderBottom: "1px solid #D6D3CD", fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>
                {r.title} →
              </Link>
            ))}
          </div>
        )}
      </article>

      {/* JSON-LD FAQ schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "author": { "@type": "Organization", "name": "RedFlaq" },
        "datePublished": article.created_at,
        "description": article.meta_description || article.excerpt || "",
        "publisher": { "@type": "Organization", "name": "RedFlaq", "url": "https://redflaq.com" },
      })}} />

      <FooterPlinq />
    </div>
  );
};

export default AcademyArticle;

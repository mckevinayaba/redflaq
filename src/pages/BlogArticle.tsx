import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { supabase } from "@/integrations/supabase/client";
import { Heart, ArrowLeft } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import ShareInviteModal from "@/components/ShareInviteModal";

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
  "first-date-safety": { label: "First Date Safety Checklist", href: "/safety-tips/first-date-safety" },
  "tenant-safety": { label: "Tenant Safety Checklist", href: "/safety-tips/tenant-safety" },
  "domestic-worker-safety": { label: "Domestic Worker Safety Checklist", href: "/safety-tips/domestic-worker-safety" },
  "red-flag-quiz": { label: "Is This a Red Flag? Quiz", href: "/safety-tips/red-flag-quiz" },
};

const BlogArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const { guardedAction } = useAuthGuard();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("academy_articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (data) {
        setArticle(data);
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
    fetchData();
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
      <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
        <NavbarPlinq />
        <div className="max-w-[600px] mx-auto px-5 text-center" style={{ paddingTop: 140 }}>
          <h1 className="font-heading text-2xl text-foreground mb-4">Article not found</h1>
          <Link to="/blog" className="font-body text-sm" style={{ color: '#7C3AED' }}>← Back to Blog</Link>
        </div>
        <FooterPlinq />
      </div>
    );
  }

  const relatedTool = article.related_tool_slug ? toolMap[article.related_tool_slug] : null;

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <NavbarPlinq />

      {/* Article header — dark */}
      <section style={{
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)',
        paddingTop: 110, paddingBottom: 48,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: -40, right: '10%', width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 relative z-10">
          <Link to="/blog" className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] mb-5" style={{ color: '#A855F7', textDecoration: 'none', textTransform: 'uppercase' }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
          </Link>
          <span className="block font-mono text-[10px] tracking-[0.1em] font-semibold mb-2" style={{ color: '#A855F7', textTransform: 'uppercase' }}>
            {article.category.replace(/-/g, " ")}
          </span>
          <h1 className="font-heading text-[26px] sm:text-[36px] leading-[1.1] mb-3" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            {article.title}
          </h1>
          <p className="font-mono text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {article.author} · {new Date(article.created_at).toLocaleDateString("en-ZA")}
          </p>
        </div>
      </section>

      <article className="max-w-[720px] mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <div
          className="font-body text-[15px] text-foreground leading-[1.8] prose-headings:font-heading prose-headings:text-foreground prose-a:text-primary"
          style={{ fontFamily: "'Syne', sans-serif" }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA — dark glassmorphism */}
        <div className="mt-10 p-7 sm:p-10 text-center" style={{
          background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)',
          borderRadius: 20, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '50%', height: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)',
            filter: 'blur(30px)', pointerEvents: 'none',
          }} />
          <div className="relative z-10">
            <h3 className="font-heading text-xl sm:text-2xl mb-4" style={{ color: '#FFFFFF' }}>Ready to check someone?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => guardedAction()}
                className="inline-flex items-center justify-center font-body font-bold text-[14px] transition-all"
                style={{ background: '#7C3AED', color: '#FFFFFF', padding: '14px 28px', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}
              >
                Run a Safety Check — R99
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center justify-center gap-2 font-body font-bold text-[14px] transition-all"
                style={{ background: 'transparent', border: '1.5px solid rgba(124,58,237,0.5)', color: '#A855F7', padding: '14px 28px', borderRadius: 50, cursor: 'pointer' }}
              >
                <Heart className="h-4 w-4" /> Share RedFlaq
              </button>
            </div>
          </div>
        </div>

        {relatedTool && (
          <div className="mt-5 flex items-center justify-between p-5" style={{
            background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)',
            borderRadius: 14,
          }}>
            <div>
              <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: '#9CA3AF', textTransform: 'uppercase' }}>Related Tip</span>
              <p className="font-body text-sm font-semibold text-foreground">{relatedTool.label}</p>
            </div>
            <Link to={relatedTool.href} className="font-body text-[13px] font-bold" style={{ color: '#7C3AED', textDecoration: 'none' }}>Try it →</Link>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-8">
            <h4 className="font-mono text-[11px] tracking-[0.1em] mb-4" style={{ color: '#A855F7', textTransform: 'uppercase' }}>Related Articles</h4>
            {related.map((r) => (
              <Link key={r.id} to={`/blog/${r.slug}`} className="block py-3 font-body text-sm font-semibold transition-colors" style={{ color: '#7C3AED', textDecoration: 'none', borderBottom: '1px solid rgba(214,211,205,0.5)' }}>
                {r.title} →
              </Link>
            ))}
          </div>
        )}
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "author": { "@type": "Organization", "name": "RedFlaq" },
        "datePublished": article.created_at,
        "description": article.meta_description || article.excerpt || "",
        "publisher": { "@type": "Organization", "name": "RedFlaq", "url": "https://redflaq.com" },
      })}} />

      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
      <FooterPlinq />
    </div>
  );
};

export default BlogArticle;

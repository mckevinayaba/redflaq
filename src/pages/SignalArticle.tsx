import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import SignalEngagement from "@/components/signals/SignalEngagement";
import SignalActionBlock from "@/components/signals/SignalActionBlock";
import SignalCard from "@/components/signals/SignalCard";
import { supabase } from "@/integrations/supabase/client";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const CATEGORY_LABELS: Record<string, string> = {
  "behavioral-patterns": "Behavioral Patterns",
  "dating-relationships": "Dating & Relationships",
  "safety-habits": "Safety Habits",
  "gbvf-evidence": "GBVF & Evidence",
  "trust-denial": "Trust & Denial",
  "dating-safety": "Dating Safety",
  "gbv-resources": "GBV Resources",
  "tenant-safety": "Tenant & Landlord",
  "domestic-worker-safety": "Domestic Worker",
  "popia-privacy": "POPIA & Privacy",
};

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
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

const estimateReadTime = (content: string) => {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
};

const SignalArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

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
          .select("id, title, slug, excerpt, category, created_at, content, author, meta_description")
          .eq("published", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);
        setRelated((rel || []) as Article[]);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: '#08080f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 28, height: 28,
          border: '3px solid rgba(108,53,222,0.2)',
          borderTopColor: '#6C35DE',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ background: '#08080f', minHeight: '100vh' }}>
        <NavbarPlinq />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <h1 style={{ ...inter, fontSize: 32, fontWeight: 800, color: '#ffffff', marginBottom: 16 }}>
            Signal not found.
          </h1>
          <button
            onClick={() => navigate('/signals')}
            style={{ ...inter, fontSize: 14, color: '#6C35DE', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            View all Signals →
          </button>
        </div>
        <FooterPlinq />
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;
  const readTime = estimateReadTime(article.content);

  return (
    <div style={{ background: '#08080f', minHeight: '100vh', overflowX: 'hidden' }}>
      <NavbarPlinq />

      {/* Article header */}
      <header style={{ background: '#08080f', paddingTop: 72 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 0' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <button
              onClick={() => navigate('/signals')}
              style={{
                ...inter, fontSize: 13, color: '#6C35DE',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              ← Signals
            </button>
          </div>

          {/* Category + meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(108,53,222,0.15)', border: '1px solid rgba(108,53,222,0.3)',
              padding: '4px 12px', borderRadius: 4,
            }}>
              <span style={{ ...mono, fontSize: 9, fontWeight: 700, color: '#6C35DE', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                {categoryLabel}
              </span>
            </div>
            <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.06em' }}>
              {formatDate(article.created_at)} · {readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            ...inter,
            fontSize: 'clamp(26px, 5vw, 46px)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 20,
          }}>
            {article.title}
          </h1>

          {/* Excerpt / standfirst */}
          {article.excerpt && (
            <p style={{
              ...inter, fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#d1d1d6',
              lineHeight: 1.75, marginBottom: 28, fontWeight: 500,
              borderLeft: '3px solid #6C35DE', paddingLeft: 16,
            }}>
              {article.excerpt}
            </p>
          )}

          {/* Engagement row */}
          <div style={{
            padding: '16px 0',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 40,
          }}>
            <SignalEngagement
              signalId={article.id}
              signalSlug={article.slug}
              signalTitle={article.title}
            />
          </div>
        </div>
      </header>

      {/* Article body */}
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            ...inter,
            fontSize: 'clamp(15px, 1.6vw, 17px)',
            color: '#d1d1d6',
            lineHeight: 1.85,
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Action block */}
        <SignalActionBlock category={article.category} />

        {/* Bottom engagement */}
        <div style={{
          padding: '24px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: 40,
        }}>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', marginBottom: 12 }}>
            Was this signal useful?
          </p>
          <SignalEngagement
            signalId={article.id}
            signalSlug={article.slug}
            signalTitle={article.title}
          />
        </div>

        {/* Brand line */}
        <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
          <p style={{ ...playfair, fontSize: 22, color: '#6C35DE', fontStyle: 'italic', fontWeight: 700 }}>
            "Before you trust, RedFlaq first."
          </p>
        </div>
      </article>

      {/* Related signals */}
      {related.length > 0 && (
        <section style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '40px 24px 64px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h2 style={{
            ...inter, fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 800,
            color: '#ffffff', letterSpacing: '-0.025em', marginBottom: 24,
          }}>
            More Signals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map(r => (
              <SignalCard
                key={r.id}
                title={r.title}
                slug={r.slug}
                excerpt={r.excerpt}
                category={r.category}
                created_at={r.created_at}
              />
            ))}
          </div>
        </section>
      )}

      <FooterPlinq />
    </div>
  );
};

export default SignalArticle;

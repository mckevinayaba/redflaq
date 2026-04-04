import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import SignalEngagement from "@/components/signals/SignalEngagement";
import SignalActionBlock from "@/components/signals/SignalActionBlock";
import SignalCard from "@/components/signals/SignalCard";
import { supabase } from "@/integrations/supabase/client";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
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
      <div style={{ background: '#F5F0EB', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '3px solid #E6E0DA', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ background: '#F5F0EB', minHeight: '100vh' }}>
        <NavbarPlinq />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <h1 style={{ ...serif, fontSize: 32, color: '#1F1F1F', marginBottom: 16 }}>Signal not found.</h1>
          <button onClick={() => navigate('/signals')} style={{ ...sans, fontSize: 14, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
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
    <div style={{ background: '#F5F0EB', minHeight: '100vh', overflowX: 'hidden' }}>
      <NavbarPlinq />

      {/* Article header */}
      <header style={{ background: '#F5F0EB', paddingTop: 100, paddingBottom: 0 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 0' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <button
              onClick={() => navigate('/signals')}
              style={{ ...sans, fontSize: 13, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              ← Signals
            </button>
          </div>

          {/* Category + meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
              padding: '4px 12px', borderRadius: 50,
            }}>
              <span style={{ ...mono, fontSize: 9, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {categoryLabel}
              </span>
            </div>
            <span style={{ ...mono, fontSize: 10, color: '#999', letterSpacing: '0.06em' }}>
              {formatDate(article.created_at)} · {readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            ...serif, fontSize: 'clamp(26px, 5vw, 46px)', color: '#1F1F1F',
            lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: 20,
          }}>
            {article.title}
          </h1>

          {/* Excerpt / standfirst */}
          {article.excerpt && (
            <p style={{
              ...sans, fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#555555',
              lineHeight: 1.75, marginBottom: 28, fontWeight: 500,
              borderLeft: '3px solid #7C3AED', paddingLeft: 16,
            }}>
              {article.excerpt}
            </p>
          )}

          {/* Engagement row */}
          <div style={{ padding: '16px 0', borderTop: '1px solid #E8E2DC', borderBottom: '1px solid #E8E2DC', marginBottom: 40 }}>
            <SignalEngagement
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
            ...sans, fontSize: 'clamp(15px, 1.6vw, 17px)', color: '#1F1F1F',
            lineHeight: 1.85,
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Action block */}
        <SignalActionBlock category={article.category} />

        {/* Bottom engagement */}
        <div style={{ padding: '24px 0', borderTop: '1px solid #E8E2DC', marginTop: 40 }}>
          <p style={{ ...sans, fontSize: 13, color: '#888', marginBottom: 12 }}>Was this signal useful?</p>
          <SignalEngagement
            signalSlug={article.slug}
            signalTitle={article.title}
          />
        </div>

        {/* Brand line */}
        <div style={{ textAlign: 'center', padding: '32px 0', marginTop: 12 }}>
          <p style={{ ...serif, fontSize: 20, color: '#7C3AED', fontStyle: 'italic' }}>
            "Before you trust, RedFlaq first."
          </p>
        </div>
      </article>

      {/* Related signals */}
      {related.length > 0 && (
        <section style={{ maxWidth: 1100, margin: '40px auto 0', padding: '40px 24px 64px', borderTop: '1px solid #E8E2DC' }}>
          <h2 style={{ ...serif, fontSize: 'clamp(20px, 3vw, 28px)', color: '#1F1F1F', letterSpacing: '-0.02em', marginBottom: 24 }}>
            More Signals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

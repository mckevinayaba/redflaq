import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/shell/AppShell";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "behavioral-patterns": "#E0525B",
  "dating-relationships": "#3FA394",
  "safety-habits": "#D97706",
  "gbvf-evidence": "#E0525B",
  "trust-denial": "#9AA6AD",
  "dating-safety": "#3FA394",
  "gbv-resources": "#D97706",
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "#9AA6AD";
}

function categoryLabel(cat: string) {
  return cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function SignalSlide({
  article,
  index,
  total,
}: {
  article: Article;
  index: number;
  total: number;
}) {
  const navigate = useNavigate();
  const color = categoryColor(article.category);

  return (
    <div
      style={{
        height: "100svh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 max(20px, env(safe-area-inset-left, 0px))",
        paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
        position: "relative",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        flexShrink: 0,
      }}
    >
      {/* Background gradient overlay — bottom to top */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(11,19,24,0.97) 0%, rgba(11,19,24,0.7) 50%, rgba(11,19,24,0.2) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          maxWidth: 620,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Category + date row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--rf2-body)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color,
            }}
          >
            {categoryLabel(article.category)}
          </span>
          <span
            style={{
              fontFamily: "var(--rf2-body)",
              fontSize: 10,
              color: "var(--rf2-muted-2)",
              marginLeft: "auto",
            }}
          >
            {formatDate(article.created_at)}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--rf2-display)",
            fontSize: "clamp(22px, 5vw, 36px)",
            fontWeight: 700,
            color: "var(--rf2-ivory)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: 14,
            textWrap: "balance",
          }}
        >
          {article.title}
        </h2>

        {/* Excerpt */}
        {article.excerpt && (
          <p
            style={{
              fontFamily: "var(--rf2-body)",
              fontSize: 15,
              color: "var(--rf2-muted)",
              lineHeight: 1.65,
              marginBottom: 20,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.excerpt}
          </p>
        )}

        {/* CTA + progress */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <button
            onClick={() => navigate(`/signals/${article.slug}`)}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: `1px solid ${color}`,
              background: `rgba(${hexToRgb(color)},0.12)`,
              color,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--rf2-body)",
              cursor: "pointer",
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}
          >
            Read Signal
          </button>

          {/* Slide counter */}
          <span
            style={{
              fontFamily: "var(--rf2-body)",
              fontSize: 11,
              color: "var(--rf2-muted-2)",
              letterSpacing: "0.08em",
            }}
          >
            {index + 1} / {total}
          </span>
        </div>
      </div>

      {/* Scroll hint on first slide */}
      {index === 0 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            animation: "float 2s ease-in-out infinite",
          }}
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden>
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="rgba(247,245,240,0.2)" strokeWidth="1.5" />
            <circle cx="8" cy="6" r="2" fill="rgba(247,245,240,0.3)">
              <animate attributeName="cy" values="6;14;6" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(247,245,240,0.3)",
              fontFamily: "var(--rf2-body)",
            }}
          >
            Scroll
          </span>
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "224,82,91";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

function LoadingSlide() {
  return (
    <div
      style={{
        height: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scrollSnapAlign: "start",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "2.5px solid rgba(247,245,240,0.1)",
          borderTopColor: "var(--rf2-coral)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}

export default function SignalsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("academy_articles")
      .select("id, title, slug, excerpt, category, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) setArticles(data as Article[]);
        setLoading(false);
      });
  }, []);

  return (
    <AppShell>
      <div
        ref={containerRef}
        style={{
          height: "100svh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
          background: "var(--rf2-ink)",
          // Hide scrollbar visually but keep it functional
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Header slide */}
        <div
          style={{
            height: "100svh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            padding: "0 max(20px, env(safe-area-inset-left, 0px))",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--rf2-body)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--rf2-coral)",
              marginBottom: 16,
            }}
          >
            RedFlaq Signals
          </span>
          <h1
            style={{
              fontFamily: "var(--rf2-display)",
              fontSize: "clamp(28px, 6vw, 52px)",
              fontWeight: 700,
              color: "var(--rf2-ivory)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: 480,
              textWrap: "balance",
              marginBottom: 16,
            }}
          >
            Daily truth.{" "}
            <em style={{ color: "var(--rf2-coral)", fontStyle: "italic" }}>
              No comfort.
            </em>{" "}
            Just clarity.
          </h1>
          <p
            style={{
              fontFamily: "var(--rf2-body)",
              fontSize: 15,
              color: "var(--rf2-muted)",
              lineHeight: 1.65,
              maxWidth: 360,
              marginBottom: 32,
            }}
          >
            Behavioral patterns and safety truths South Africans need to hear.
            Scroll to read.
          </p>
          {/* Scroll indicator */}
          <div
            aria-hidden
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              animation: "float 2s ease-in-out infinite",
            }}
          >
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden>
              <rect x="1" y="1" width="14" height="22" rx="7" stroke="rgba(247,245,240,0.25)" strokeWidth="1.5" />
              <circle cx="8" cy="6" r="2" fill="rgba(247,245,240,0.4)">
                <animate attributeName="cy" values="6;14;6" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(247,245,240,0.3)",
                fontFamily: "var(--rf2-body)",
              }}
            >
              Scroll
            </span>
          </div>
        </div>

        {/* Article slides */}
        {loading ? (
          <LoadingSlide />
        ) : articles.length === 0 ? (
          <div
            style={{
              height: "100svh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scrollSnapAlign: "start",
              color: "var(--rf2-muted)",
              fontFamily: "var(--rf2-body)",
              fontSize: 15,
            }}
          >
            No signals yet.
          </div>
        ) : (
          articles.map((article, i) => (
            <SignalSlide
              key={article.id}
              article={article}
              index={i}
              total={articles.length}
            />
          ))
        )}

        {/* Scrollbar hide for WebKit */}
        <style>{`
          div::-webkit-scrollbar { display: none; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes float {
            0%, 100% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(6px); opacity: 0.6; }
          }
        `}</style>
      </div>
    </AppShell>
  );
}

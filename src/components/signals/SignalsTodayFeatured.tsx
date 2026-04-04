import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import SignalModal from "./SignalModal";
import { type SignalData, CATEGORY_LABELS, formatSignalDate } from "./types";
import { getArticleBySlug } from "./signalArticles";

// ── Fallback hardcoded content ───────────────────────────────────
const FALLBACK: SignalData = {
  id: "fallback",
  slug: "he-was-not-losing-control-he-was-using-it",
  title: "He Was Not Losing Control. He Was Using It.",
  excerpt:
    "Every time he lost his temper, you walked away wondering what you did wrong. That is not an accident. Rage is not something that slips out. It is deployed. The question is not whether he can control it. The question is what he receives every time he uses it on you.",
  category: "behavioral-patterns",
  created_at: new Date().toISOString(),
  body: null,
};

// ── Main component ───────────────────────────────────────────────
const SignalsTodayFeatured = () => {
  const [signal, setSignal] = useState<SignalData>(FALLBACK);
  const [isMobile, setIsMobile] = useState(false);
  const [liked, setLiked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  // Seed card display counts from article map — derived from current signal slug
  const resolvedArticle = getArticleBySlug(signal.slug);
  const likeCountSeed = resolvedArticle?.seededLikeCount ?? 247;
  const commentCount = resolvedArticle?.seededCommentCount ?? 34;
  const [likeCount, setLikeCount] = useState(likeCountSeed);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from("academy_articles")
        .select("id, title, slug, excerpt, category, created_at, content")
        .in("category", [
          "behavioral-patterns",
          "dating-relationships",
          "safety-habits",
          "gbvf-evidence",
          "trust-denial",
          "self-accountability",
        ])
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setSignal({
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt ?? FALLBACK.excerpt,
          category: data.category,
          created_at: data.created_at ?? new Date().toISOString(),
          body: data.content ?? null,
        });
      }
    };
    fetchFeatured();
  }, []);

  const handleLike = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }, []);

  const categoryLabel =
    CATEGORY_LABELS[signal.category] || signal.category;

  return (
    <>
      <section
        id="signals-today"
        style={{ background: "var(--rf-paper)", padding: "1.5rem 2rem 3rem" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--rf-purple)",
              }}
            >
              ■ Today's RedFlaq Signal
            </span>
          </div>

          {/* Card */}
          <div
            onClick={() => setModalOpen(true)}
            onMouseEnter={() => setCardHovered(true)}
            onMouseLeave={() => setCardHovered(false)}
            style={{
              background: "#FFFFFF",
              borderRadius: "1.5rem",
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              boxShadow: cardHovered
                ? "0 12px 40px rgba(124,58,237,0.14)"
                : "0 4px 24px rgba(0,0,0,0.07)",
              transform: cardHovered ? "translateY(-4px)" : "translateY(0)",
              cursor: "pointer",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            {/* Mobile: gradient panel on top */}
            {isMobile && <LeftPanel title={signal.title} isMobile />}

            {/* Body panel */}
            <div
              style={{
                padding: "2.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* Category tag */}
                <div
                  style={{
                    display: "inline-block",
                    background: "var(--rf-purple-light)",
                    color: "var(--rf-purple)",
                    fontSize: "0.68rem",
                    fontFamily: "var(--rf-sans)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "0.28rem 0.7rem",
                    borderRadius: "2rem",
                    marginBottom: "0.85rem",
                  }}
                >
                  {categoryLabel}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--rf-serif)",
                    fontSize: "1.55rem",
                    fontWeight: 900,
                    color: "var(--rf-ink)",
                    lineHeight: 1.25,
                    marginBottom: "0.85rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {signal.title}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--rf-sans)",
                    fontSize: "0.9rem",
                    color: "var(--rf-ink-mid)",
                    lineHeight: 1.7,
                    marginBottom: "1.25rem",
                  }}
                >
                  {signal.excerpt}
                </p>
              </div>

              <div>
                {/* Footer row */}
                <div
                  style={{
                    borderTop: "1px solid var(--rf-paper-dark)",
                    paddingTop: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--rf-sans)",
                      fontSize: "0.72rem",
                      color: "var(--rf-ink-soft)",
                    }}
                  >
                    RedFlaq Signals · {formatSignalDate(signal.created_at)} · 5 min read
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    {/* Like */}
                    <button
                      onClick={(e) => handleLike(e)}
                      aria-label={liked ? "Unlike" : "Like"}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--rf-sans)",
                        fontSize: "0.78rem",
                        color: liked ? "var(--rf-purple)" : "var(--rf-ink-soft)",
                        transition: "color 0.15s",
                        padding: "4px",
                      }}
                    >
                      <span style={{ fontSize: "0.95rem", lineHeight: 1 }}>
                        {liked ? "♥" : "♡"}
                      </span>
                      {likeCount}
                    </button>

                    {/* Comment */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
                      aria-label="View comments"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--rf-sans)",
                        fontSize: "0.78rem",
                        color: "var(--rf-ink-soft)",
                        padding: "4px",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--rf-purple)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--rf-ink-soft)")
                      }
                    >
                      <span style={{ fontSize: "0.9rem", lineHeight: 1 }}>💬</span>
                      {commentCount}
                    </button>
                  </div>
                </div>

                {/* Read button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
                  style={{
                    marginTop: "0.85rem",
                    fontFamily: "var(--rf-sans)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    background: "var(--rf-ink)",
                    border: "none",
                    borderRadius: "2rem",
                    padding: "0.6rem 1.1rem",
                    cursor: "pointer",
                    transition: "background 0.18s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--rf-purple)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--rf-ink)")
                  }
                >
                  Read full signal →
                </button>
              </div>
            </div>

            {/* Desktop: gradient panel on the right */}
            {!isMobile && <LeftPanel title={signal.title} isMobile={false} />}
          </div>
        </div>
      </section>

      {/* Full modal */}
      {modalOpen && (
        <SignalModal
          signal={signal}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

// ── Left / visual panel ──────────────────────────────────────────
const LeftPanel = ({ title, isMobile }: { title: string; isMobile: boolean }) => (
  <div
    style={{
      background:
        "linear-gradient(160deg, #13091F 0%, #1E1030 50%, #7C3AED 100%)",
      minHeight: isMobile ? 220 : 360,
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Decorative orb */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "10%",
        right: "-10%",
        width: 260,
        height: 260,
        borderRadius: "50%",
        background: "rgba(124,58,237,0.25)",
        filter: "blur(60px)",
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "var(--rf-purple)",
          color: "#FFFFFF",
          fontSize: "0.62rem",
          fontFamily: "var(--rf-sans)",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: "2rem",
          padding: "0.28rem 0.65rem",
          marginBottom: "0.6rem",
        }}
      >
        Today's Signal
      </div>

      <h2
        style={{
          fontFamily: "var(--rf-serif)",
          fontSize: "1.85rem",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
    </div>
  </div>
);

export default SignalsTodayFeatured;

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// ── Types ────────────────────────────────────────────────────────
interface SignalData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  body?: string | null;
}

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

const CATEGORY_LABELS: Record<string, string> = {
  "behavioral-patterns": "Behavioral Patterns",
  "dating-relationships": "Dating & Relationships",
  "safety-habits": "Safety Habits",
  "gbvf-evidence": "GBVF & Evidence",
  "trust-denial": "Trust & Denial",
  "self-accountability": "Self-Accountability",
  "dating-safety": "Dating Safety",
  "gbv-resources": "GBV Resources",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ── Article Modal ────────────────────────────────────────────────
const ArticleModal = ({
  signal,
  onClose,
}: {
  signal: SignalData;
  onClose: () => void;
}) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const navigate = useNavigate();

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(19,9,31,0.82)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: "1.5rem",
          maxWidth: 660,
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
          padding: "2.5rem",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close article"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "var(--rf-paper-dark)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            fontFamily: "var(--rf-sans)",
            fontSize: "1rem",
            color: "var(--rf-ink-mid)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Category pill */}
        <div
          style={{
            display: "inline-block",
            background: "var(--rf-purple-light)",
            color: "var(--rf-purple)",
            fontSize: "0.68rem",
            fontFamily: "var(--rf-sans)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            borderRadius: "2rem",
            padding: "0.28rem 0.7rem",
            marginBottom: "1rem",
          }}
        >
          {CATEGORY_LABELS[signal.category] || signal.category}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--rf-serif)",
            fontSize: "1.75rem",
            fontWeight: 900,
            color: "var(--rf-ink)",
            lineHeight: 1.25,
            marginBottom: "0.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          {signal.title}
        </h2>

        {/* Meta */}
        <p
          style={{
            fontFamily: "var(--rf-sans)",
            fontSize: "0.72rem",
            color: "var(--rf-ink-soft)",
            marginBottom: "1.5rem",
          }}
        >
          RedFlaq Signals · {formatDate(signal.created_at)} · 5 min read
        </p>

        {/* Body or excerpt */}
        {signal.body ? (
          <div
            style={{
              fontFamily: "var(--rf-sans)",
              fontSize: "0.95rem",
              color: "var(--rf-ink-mid)",
              lineHeight: 1.8,
            }}
            dangerouslySetInnerHTML={{ __html: signal.body }}
          />
        ) : (
          <p
            style={{
              fontFamily: "var(--rf-sans)",
              fontSize: "0.95rem",
              color: "var(--rf-ink-mid)",
              lineHeight: 1.8,
              marginBottom: "1.5rem",
            }}
          >
            {signal.excerpt}
          </p>
        )}

        {/* Read full article link */}
        {signal.slug && signal.id !== "fallback" && (
          <button
            onClick={() => {
              onClose();
              navigate(`/signals/${signal.slug}`);
            }}
            style={{
              marginTop: "1.5rem",
              fontFamily: "var(--rf-sans)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#FFFFFF",
              background: "var(--rf-purple)",
              border: "none",
              borderRadius: "2rem",
              padding: "0.7rem 1.4rem",
              cursor: "pointer",
              transition: "background 0.18s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--rf-purple-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--rf-purple)")
            }
          >
            Read full article →
          </button>
        )}
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────
const SignalsTodayFeatured = () => {
  const navigate = useNavigate();
  const [signal, setSignal] = useState<SignalData>(FALLBACK);
  const [isMobile, setIsMobile] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(247);
  const [commentCount] = useState(34);
  const [modalOpen, setModalOpen] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      // Try academy_articles for a recent signal-category article
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
      // On any error or empty result, FALLBACK stays as-is
    };
    fetchFeatured();
  }, []);

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setLiked((prev) => {
        setLikeCount((c) => (prev ? c - 1 : c + 1));
        return !prev;
      });
    },
    []
  );

  const handleOpenModal = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setModalOpen(true);
    },
    []
  );

  const categoryLabel =
    CATEGORY_LABELS[signal.category] || signal.category;

  return (
    <>
      <section
        id="signals-today"
        style={{
          background: "var(--rf-paper)",
          padding: "1.5rem 2rem 3rem",
        }}
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
            {/* ── LEFT: visual panel ── */}
            {isMobile && (
              <LeftPanel title={signal.title} isMobile={isMobile} />
            )}

            {/* ── RIGHT: body panel ── */}
            <div
              style={{
                padding: "2.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Category tag */}
              <div>
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

                {/* H3 title */}
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

                {/* Excerpt */}
                <p
                  style={{
                    fontFamily: "var(--rf-sans)",
                    fontSize: "0.9rem",
                    color: "var(--rf-ink-mid)",
                    lineHeight: 1.7,
                    flexGrow: 1,
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
                  {/* Meta */}
                  <span
                    style={{
                      fontFamily: "var(--rf-sans)",
                      fontSize: "0.72rem",
                      color: "var(--rf-ink-soft)",
                    }}
                  >
                    RedFlaq Signals · {formatDate(signal.created_at)} · 5 min read
                  </span>

                  {/* Action buttons */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
                  >
                    {/* Like */}
                    <button
                      onClick={handleLike}
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
                      onClick={handleOpenModal}
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
                        transition: "color 0.15s",
                        padding: "4px",
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

                {/* Read full signal button */}
                <button
                  onClick={handleOpenModal}
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

            {/* Desktop left panel */}
            {!isMobile && (
              <LeftPanel title={signal.title} isMobile={isMobile} />
            )}
          </div>
        </div>
      </section>

      {/* Article modal */}
      {modalOpen && (
        <ArticleModal signal={signal} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};

// ── Left visual panel (extracted to avoid duplication) ───────────
const LeftPanel = ({
  title,
  isMobile,
}: {
  title: string;
  isMobile: boolean;
}) => (
  <div
    style={{
      background:
        "linear-gradient(160deg, #13091F 0%, #1E1030 50%, #7C3AED 100%)",
      minHeight: isMobile ? 220 : 360,
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Decorative blurred orb */}
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

    {/* Content — pinned to bottom */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "2rem",
      }}
    >
      {/* Badge */}
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

      {/* Title */}
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

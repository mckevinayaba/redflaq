import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { type SignalData, CATEGORY_LABELS, formatSignalDate } from "./types";

// ── Full article content for the featured fallback signal ────────
// Completing the spec's cut-off paragraph 2 and continuing.
const FEATURED_BODY_PARAGRAPHS = [
  "Every time he lost his temper, you walked away wondering what you did wrong. You replayed the conversation. You adjusted your tone. You softened your language for next time. That is not confusion. That is conditioning.",
  "Rage is not something that slips out when someone cannot help themselves. In most cases — particularly in intimate partner violence — rage is deployed. It is used because it works. It ends arguments. It resets power. It teaches you what happens when you question him.",
  "Notice what happens after. Does he apologise? Does he minimise? Does he blame you for provoking him? Each of those responses tells you something different. The apology without change is a reset button. The minimisation is a correction. The blame is a transfer. What they all have in common: he is not confused about what happened. He knows exactly what he did.",
  "You have been asking the wrong question. You keep asking whether he can control it. Whether he is working on it. Whether it is just stress. The right question is: what does he receive when he does it? If the answer is compliance, silence, space, or forgiveness — then his anger is working exactly as intended.",
  "That is not a man losing control. That is a man whose control strategy is working perfectly.",
];

const FEATURED_PULL_QUOTE =
  "Rage is not something that slips out. It is deployed. The question is not whether he can control it. The question is what he receives every time he uses it on you.";

const FEATURED_ACTION = {
  headline: "Name what you have been calling 'his temper'.",
  description:
    "Write down the last three times it happened. What did you change after each one? That change is the evidence that his strategy is working.",
  cta: "Run a Background Check",
  href: "/search-form",
};

// ── Hardcoded seed comments ──────────────────────────────────────
interface Comment {
  id: string;
  initial: string;
  name: string;
  time: string;
  text: string;
}

const SEED_COMMENTS: Comment[] = [
  {
    id: "c1",
    initial: "T",
    name: "Thandi M.",
    time: "2 hours ago",
    text: "I read this three times. The part about rage being a tool is exactly what happened to me. I always thought I was the problem when he got angry. I was not the problem.",
  },
  {
    id: "c2",
    initial: "N",
    name: "Nomsa K.",
    time: "5 hours ago",
    text: "Shared this with my sister. She needed to see this today. We are running a check this weekend.",
  },
];

// ── Props ────────────────────────────────────────────────────────
interface SignalModalProps {
  signal: SignalData;
  onClose: () => void;
  liked: boolean;
  likeCount: number;
  onLike: () => void;
  commentCount?: number;
}

// ── Component ────────────────────────────────────────────────────
const SignalModal = ({
  signal,
  onClose,
  liked,
  likeCount,
  onLike,
  commentCount = 34,
}: SignalModalProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS);
  const [closeHovered, setCloseHovered] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFeaturedFallback =
    signal.id === "fallback" ||
    signal.slug === "he-was-not-losing-control-he-was-using-it";

  // Lock body scroll, handle Escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleShare = async () => {
    const url = `${window.location.origin}/signals/${signal.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: signal.title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleScrollToComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => inputRef.current?.focus(), 400);
  };

  const handlePostComment = () => {
    const text = newComment.trim();
    if (!text) return;
    const initial =
      user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() ||
      user?.email?.charAt(0)?.toUpperCase() ||
      "Y";
    const displayName =
      user?.user_metadata?.full_name || user?.email?.split("@")[0] || "You";
    setComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        initial,
        name: displayName,
        time: "just now",
        text,
      },
    ]);
    setNewComment("");
  };

  const categoryLabel =
    CATEGORY_LABELS[signal.category] || signal.category;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
        overflowY: "auto",
      }}
    >
      {/* Modal box — stop propagation so clicks inside don't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--rf-paper)",
          borderRadius: "1.5rem",
          maxWidth: 680,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            background:
              "linear-gradient(160deg, #13091F 0%, #1E1030 55%, #7C3AED 100%)",
            padding: "2.5rem 2rem 2rem",
            position: "relative",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: closeHovered
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,255,255,0.1)",
              border: "none",
              color: "#FFFFFF",
              width: 32,
              height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s",
              lineHeight: 1,
            }}
          >
            ×
          </button>

          {/* Category tag */}
          <div
            style={{
              display: "inline-block",
              background: "var(--rf-purple)",
              color: "#FFFFFF",
              fontSize: "0.68rem",
              fontFamily: "var(--rf-sans)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: "2rem",
              padding: "0.28rem 0.7rem",
              marginBottom: "0.85rem",
            }}
          >
            {categoryLabel}
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "var(--rf-serif)",
              fontSize: "1.9rem",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              paddingRight: "2rem",
            }}
          >
            {signal.title}
          </h2>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: "2rem" }}>
          {isFeaturedFallback ? (
            // Full structured article for the featured fallback
            <>
              <p style={pStyle}>{FEATURED_BODY_PARAGRAPHS[0]}</p>
              <p style={pStyle}>{FEATURED_BODY_PARAGRAPHS[1]}</p>

              {/* Pull-quote */}
              <blockquote style={pullQuoteStyle}>
                {FEATURED_PULL_QUOTE}
              </blockquote>

              <p style={pStyle}>{FEATURED_BODY_PARAGRAPHS[2]}</p>
              <p style={pStyle}>{FEATURED_BODY_PARAGRAPHS[3]}</p>
              <p style={pStyle}>{FEATURED_BODY_PARAGRAPHS[4]}</p>

              <ActionBox {...FEATURED_ACTION} />
            </>
          ) : signal.body ? (
            // HTML body from Supabase (academy_articles.content)
            <>
              <div
                style={{
                  fontFamily: "var(--rf-sans)",
                  fontSize: "0.92rem",
                  color: "var(--rf-ink-mid)",
                  lineHeight: 1.8,
                }}
                dangerouslySetInnerHTML={{ __html: signal.body }}
              />
              <ActionBox
                headline="Run a check before you trust."
                description="The signal you just read is based on documented behavioral patterns. The next step is verification."
                cta="Run a Safety Check — R99"
                href="/search-form"
              />
            </>
          ) : (
            // Excerpt fallback for signals without body yet
            <>
              <p style={pStyle}>{signal.excerpt}</p>
              <ActionBox
                headline="Run a check before you trust."
                description="The signal you just read is based on documented behavioral patterns. The next step is verification."
                cta="Run a Safety Check — R99"
                href="/search-form"
              />
            </>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            padding: "1.25rem 2rem",
            borderTop: "1px solid var(--rf-paper-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {/* Left: like / comment / share */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <EngagementBtn
              onClick={(e) => { e.stopPropagation(); onLike(); }}
              active={liked}
              icon={liked ? "♥" : "♡"}
              count={likeCount}
              label={liked ? "Unlike" : "Like"}
            />
            <EngagementBtn
              onClick={handleScrollToComments}
              icon="💬"
              count={commentCount}
              label="Comments"
            />
            <EngagementBtn
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              icon="🔗"
              label="Share"
            />
          </div>

          {/* Right: product CTA */}
          <button
            onClick={() => { onClose(); navigate("/search-form"); }}
            style={{
              fontFamily: "var(--rf-sans)",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#FFFFFF",
              background: "var(--rf-purple)",
              border: "none",
              borderRadius: "2rem",
              padding: "0.6rem 1.1rem",
              cursor: "pointer",
              transition: "background 0.18s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--rf-purple-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--rf-purple)")
            }
          >
            Run a Safety Check — R99
          </button>
        </div>

        {/* ── COMMENTS ── */}
        <div
          ref={commentsRef}
          style={{
            padding: "1.5rem 2rem",
            borderTop: "1px solid var(--rf-paper-dark)",
          }}
        >
          <h4
            style={{
              fontFamily: "var(--rf-sans)",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--rf-ink)",
              marginBottom: "1.25rem",
            }}
          >
            Comments ({comments.length + (commentCount - SEED_COMMENTS.length)})
          </h4>

          {/* Comment list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
            {comments.map((c) => (
              <div key={c.id} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--rf-purple-light)",
                    color: "var(--rf-purple)",
                    fontFamily: "var(--rf-sans)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {c.initial}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span style={{ fontFamily: "var(--rf-sans)", fontSize: "0.8rem", fontWeight: 600, color: "var(--rf-ink)" }}>
                      {c.name}
                    </span>
                    <span style={{ fontFamily: "var(--rf-sans)", fontSize: "0.7rem", color: "var(--rf-ink-soft)" }}>
                      {c.time}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--rf-sans)", fontSize: "0.82rem", color: "var(--rf-ink-mid)", lineHeight: 1.6, margin: 0 }}>
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment input */}
          {isAuthenticated ? (
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              <input
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handlePostComment(); }}
                placeholder="Add your voice..."
                style={{
                  flex: 1,
                  fontFamily: "var(--rf-sans)",
                  fontSize: "0.82rem",
                  color: "var(--rf-ink)",
                  background: "#FFFFFF",
                  border: "1.5px solid var(--rf-paper-dark)",
                  borderRadius: "2rem",
                  padding: "0.6rem 1rem",
                  outline: "none",
                  transition: "border-color 0.18s",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rf-purple)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rf-paper-dark)")
                }
              />
              <button
                onClick={handlePostComment}
                disabled={!newComment.trim()}
                style={{
                  fontFamily: "var(--rf-sans)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: newComment.trim() ? "var(--rf-purple)" : "var(--rf-ink-soft)",
                  border: "none",
                  borderRadius: "2rem",
                  padding: "0.6rem 1rem",
                  cursor: newComment.trim() ? "pointer" : "default",
                  transition: "background 0.18s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (newComment.trim())
                    e.currentTarget.style.background = "var(--rf-purple-dark)";
                }}
                onMouseLeave={(e) => {
                  if (newComment.trim())
                    e.currentTarget.style.background = "var(--rf-purple)";
                }}
              >
                Post
              </button>
            </div>
          ) : (
            <p style={{ fontFamily: "var(--rf-sans)", fontSize: "0.82rem", color: "var(--rf-ink-soft)" }}>
              <button
                onClick={() => { onClose(); navigate("/signup?mode=signin"); }}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: "var(--rf-sans)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--rf-purple)",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                Sign in to comment
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Paragraph style ──────────────────────────────────────────────
const pStyle: React.CSSProperties = {
  fontFamily: "var(--rf-sans)",
  fontSize: "0.92rem",
  color: "var(--rf-ink-mid)",
  lineHeight: 1.8,
  marginBottom: "1rem",
};

// ── Pull-quote style ─────────────────────────────────────────────
const pullQuoteStyle: React.CSSProperties = {
  fontFamily: "var(--rf-serif)",
  fontStyle: "italic",
  fontSize: "1rem",
  color: "var(--rf-ink)",
  background: "var(--rf-purple-light)",
  borderLeft: "4px solid var(--rf-purple)",
  borderRadius: "0 0.75rem 0.75rem 0",
  padding: "1rem 1.25rem",
  margin: "1.5rem 0",
};

// ── Behavioral Action Box ────────────────────────────────────────
interface ActionBoxProps {
  headline: string;
  description: string;
  cta: string;
  href: string;
}

const ActionBox = ({ headline, description, cta, href }: ActionBoxProps) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: "var(--rf-dark)",
        borderRadius: "1rem",
        padding: "1.5rem",
        marginTop: "1.5rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--rf-sans)",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--rf-purple)",
          marginBottom: "0.4rem",
        }}
      >
        Your behavioral action today
      </p>
      <h4
        style={{
          fontFamily: "var(--rf-serif)",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.35,
          marginBottom: "0.4rem",
        }}
      >
        {headline}
      </h4>
      <p
        style={{
          fontFamily: "var(--rf-sans)",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.5,
          marginBottom: "1rem",
        }}
      >
        {description}
      </p>
      <button
        onClick={() => navigate(href)}
        style={{
          fontFamily: "var(--rf-sans)",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#FFFFFF",
          background: "var(--rf-purple)",
          border: "none",
          borderRadius: "2rem",
          padding: "0.65rem 1.25rem",
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
        {cta} →
      </button>
    </div>
  );
};

// ── Engagement button ────────────────────────────────────────────
interface EngagementBtnProps {
  onClick: (e: React.MouseEvent) => void;
  icon: string;
  count?: number;
  label: string;
  active?: boolean;
}

const EngagementBtn = ({ onClick, icon, count, label, active }: EngagementBtnProps) => (
  <button
    onClick={onClick}
    aria-label={label}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--rf-sans)",
      fontSize: "0.78rem",
      color: active ? "var(--rf-purple)" : "var(--rf-ink-soft)",
      padding: "4px",
      transition: "color 0.15s",
    }}
    onMouseEnter={(e) => {
      if (!active) e.currentTarget.style.color = "var(--rf-purple)";
    }}
    onMouseLeave={(e) => {
      if (!active) e.currentTarget.style.color = "var(--rf-ink-soft)";
    }}
  >
    <span style={{ fontSize: "0.95rem", lineHeight: 1 }}>{icon}</span>
    {count !== undefined ? count : label}
  </button>
);

export default SignalModal;
export type { SignalModalProps };

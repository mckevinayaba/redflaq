import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { type SignalData, CATEGORY_LABELS } from "./types";
import { getArticleBySlug, type SignalArticleContent } from "./signalArticles";

// ── Supabase cast for tables not yet in generated types ──────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const COMMENTS_PAGE_SIZE = 5;

// ── Helpers ──────────────────────────────────────────────────────
const timeAgo = (iso: string): string => {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)} min ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} hours ago`;
  return `${Math.floor(secs / 86400)} days ago`;
};

// ── Types ────────────────────────────────────────────────────────
interface Comment {
  id: string;
  initial: string;
  name: string;
  time: string;
  text: string;
  pending?: boolean;
}

// ── Seed comments — fallback for Article 1 only ──────────────────
const SEED_COMMENTS: Comment[] = [
  {
    id: "seed-1",
    initial: "T",
    name: "Thandi M.",
    time: "2 hours ago",
    text: "I read this three times. The part about rage being a tool is exactly what happened to me. I always thought I was the problem when he got angry. I was not the problem.",
  },
  {
    id: "seed-2",
    initial: "N",
    name: "Nomsa K.",
    time: "5 hours ago",
    text: "Shared this with my sister. She needed to see this today. We are running a check this weekend.",
  },
];

// ── Props ────────────────────────────────────────────────────────
export interface SignalModalProps {
  signal: SignalData;
  onClose: () => void;
}

// ── Component ────────────────────────────────────────────────────
const SignalModal = ({ signal, onClose }: SignalModalProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const article: SignalArticleContent | undefined = getArticleBySlug(signal.slug);
  const categoryLabel = CATEGORY_LABELS[signal.category] || signal.category;
  const isFeaturedArticle = signal.slug === "he-was-not-losing-control-he-was-using-it";

  // ── Responsive ────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Like state ────────────────────────────────────────────────
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article?.seededLikeCount ?? 247);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showLikePrompt, setShowLikePrompt] = useState(false);
  const likePromptTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Share toast ───────────────────────────────────────────────
  const [showShareToast, setShowShareToast] = useState(false);
  const shareToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Comment state ─────────────────────────────────────────────
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [posting, setPosting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PAGE_SIZE);

  // ── Refs ──────────────────────────────────────────────────────
  // overlayRef      — desktop scroll-to-top target
  // innerRef        — dialog container (focus trap boundary) + mobile scroller
  // closeBtnRef     — receives focus on open
  // previousFocusRef — element to restore focus to on close
  const overlayRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const commentsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Body scroll lock · focus management · keyboard handling ───
  useEffect(() => {
    // Capture trigger element before we move focus
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Scroll both containers to top on open
    overlayRef.current?.scrollTo({ top: 0 });
    innerRef.current?.scrollTo({ top: 0 });

    // Move focus into dialog after the entry animation starts
    const rafId = requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      // Escape — close
      if (e.key === "Escape") { onClose(); return; }

      // Tab / Shift+Tab — trap focus within dialog
      if (e.key === "Tab" && innerRef.current) {
        const focusable = Array.from(
          innerRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), ' +
            'select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null); // skip hidden elements

        if (focusable.length === 0) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(rafId);
      if (likePromptTimer.current) clearTimeout(likePromptTimer.current);
      if (shareToastTimer.current) clearTimeout(shareToastTimer.current);
      // Restore focus to whichever element opened the modal
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  // ── Fetch like status (authenticated only) ────────────────────
  useEffect(() => {
    const fetchLikes = async () => {
      if (!isAuthenticated) return;
      try {
        const { count } = await db
          .from("signal_likes")
          .select("*", { count: "exact", head: true })
          .eq("signal_id", signal.slug);

        if (typeof count === "number") setLikeCount(count);

        if (user) {
          const { data } = await db
            .from("signal_likes")
            .select("id")
            .eq("signal_id", signal.slug)
            .eq("user_id", user.id)
            .maybeSingle();
          setLiked(!!data);
        }
      } catch {
        // Silently keep seeded count on error
      }
    };
    fetchLikes();
  }, [signal.slug, isAuthenticated, user]);

  // ── Fetch comments ────────────────────────────────────────────
  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      setCommentsError(false);
      setVisibleCount(COMMENTS_PAGE_SIZE); // reset pagination on signal change
      try {
        const { data, error } = await db
          .from("signal_comments")
          .select("id, comment_text, created_at, display_name")
          .eq("signal_id", signal.slug)
          .eq("moderated", true)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        if (data && data.length > 0) {
          setComments(
            data.map((c: { id: string; comment_text: string; created_at: string; display_name: string | null }) => ({
              id: c.id,
              initial: (c.display_name || "A").charAt(0).toUpperCase(),
              name: c.display_name || "Anonymous",
              time: timeAgo(c.created_at),
              text: c.comment_text,
            }))
          );
        } else {
          setComments(isFeaturedArticle ? SEED_COMMENTS : []);
        }
      } catch {
        setCommentsError(true);
        setComments(isFeaturedArticle ? SEED_COMMENTS : []);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [signal.slug, isFeaturedArticle]);

  // ── Like handler ──────────────────────────────────────────────
  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      setShowLikePrompt(true);
      if (likePromptTimer.current) clearTimeout(likePromptTimer.current);
      likePromptTimer.current = setTimeout(() => setShowLikePrompt(false), 4000);
      return;
    }

    if (likeLoading) return;

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    setLikeLoading(true);

    try {
      if (wasLiked) {
        await db
          .from("signal_likes")
          .delete()
          .eq("signal_id", signal.slug)
          .eq("user_id", user.id);
      } else {
        await db
          .from("signal_likes")
          .insert({ signal_id: signal.slug, user_id: user.id });
      }
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setLikeLoading(false);
    }
  }, [isAuthenticated, user, liked, likeLoading, signal.slug]);

  // ── Comment post handler ──────────────────────────────────────
  const handlePost = useCallback(async () => {
    const text = commentInput.trim();
    if (!text || !isAuthenticated || !user || posting) return;

    setPosting(true);
    const displayName =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Anonymous";

    try {
      const { error } = await db.from("signal_comments").insert({
        signal_id: signal.slug,
        user_id: user.id,
        comment_text: text,
        display_name: displayName,
      });

      if (!error) {
        setComments((prev) => [
          {
            id: `optimistic-${Date.now()}`,
            initial: displayName.charAt(0).toUpperCase(),
            name: displayName,
            time: "just now · pending review",
            text,
            pending: true,
          },
          ...prev,
        ]);
        setCommentInput("");
      }
    } catch {
      // Post silently fails — user can retry
    } finally {
      setPosting(false);
    }
  }, [commentInput, isAuthenticated, user, posting, signal.slug]);

  // ── Scroll to comments ────────────────────────────────────────
  const handleScrollToComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => inputRef.current?.focus(), 350);
  };

  // ── Share — desktop shows clipboard toast; mobile uses native share ──
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/signals/${signal.slug}`;
    if (navigator.share) {
      try { await navigator.share({ title: signal.title, url }); } catch { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShowShareToast(true);
        if (shareToastTimer.current) clearTimeout(shareToastTimer.current);
        shareToastTimer.current = setTimeout(() => setShowShareToast(false), 3000);
      } catch { /* clipboard denied */ }
    }
  };

  // ── Derived counts ────────────────────────────────────────────
  const confirmedComments = comments.filter((c) => !c.pending);
  const commentCount = confirmedComments.length;
  const displayCommentCount =
    commentCount > 0 ? commentCount : (article?.seededCommentCount ?? 34);

  // Comments pagination
  const displayedComments = comments.slice(0, visibleCount);
  const remainingCount = comments.length - visibleCount;

  // ── Overlay / panel styles — mobile vs desktop ────────────────
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 500,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "flex",
    alignItems: isMobile ? "flex-end" : "flex-start",
    justifyContent: "center",
    padding: isMobile ? 0 : "2rem 1rem",
    overflowY: isMobile ? "hidden" : "auto",
  };

  const innerStyle: React.CSSProperties = {
    background: "var(--rf-paper)",
    borderRadius: isMobile ? "1.5rem 1.5rem 0 0" : "1.5rem",
    maxWidth: isMobile ? "100%" : 680,
    width: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    overflow: "hidden",
    marginBottom: isMobile ? 0 : "2rem",
    maxHeight: isMobile ? "92dvh" : "none",
    overflowY: isMobile ? "auto" : "visible",
    WebkitOverflowScrolling: "touch",
    animation: isMobile
      ? "rf-modal-slide-up 0.32s cubic-bezier(0.32,0.72,0,1) both"
      : "rf-modal-fade-scale 0.22s ease both",
  } as React.CSSProperties;

  return (
    <>
      <div
        ref={overlayRef}
        onClick={onClose}
        style={overlayStyle}
      >
        <div
          ref={innerRef}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="signal-modal-title"
          tabIndex={-1}
          style={innerStyle}
        >
          {/* ── HEADER ── */}
          <div
            style={{
              background: "linear-gradient(160deg, #13091F 0%, #1E1030 55%, #7C3AED 100%)",
              padding: isMobile ? "2rem 1.25rem 1.75rem" : "2.5rem 2rem 2rem",
              position: "relative",
            }}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div
                aria-hidden="true"
                style={{
                  width: 36,
                  height: 4,
                  background: "rgba(255,255,255,0.25)",
                  borderRadius: 2,
                  margin: "0 auto 1.25rem",
                }}
              />
            )}

            <button
              ref={closeBtnRef}
              onClick={onClose}
              aria-label="Close article"
              style={{
                position: "absolute",
                top: isMobile ? "1.1rem" : "1rem",
                right: isMobile ? "1rem" : "1rem",
                background: "rgba(255,255,255,0.1)",
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
                lineHeight: 1,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              ×
            </button>

            <div style={{
              display: "inline-block",
              background: "var(--rf-purple)",
              color: "#FFFFFF",
              fontSize: "0.62rem",
              fontFamily: "var(--rf-sans)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "2rem",
              padding: "0.25rem 0.6rem",
              marginBottom: "0.7rem",
            }}>
              {categoryLabel}
            </div>

            <h2 id="signal-modal-title" style={{
              fontFamily: "var(--rf-serif)",
              fontSize: isMobile ? "1.55rem" : "1.9rem",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              paddingRight: "2.5rem",
            }}>
              {signal.title}
            </h2>
          </div>

          {/* ── BODY ── */}
          <div style={{ padding: isMobile ? "1.5rem 1.25rem" : "2rem" }}>
            {article ? (
              <>
                {article.bodySections.map((section, i) =>
                  section.type === "pullQuote" ? (
                    <blockquote key={i} style={pullQuoteStyle}>{section.text}</blockquote>
                  ) : (
                    <p key={i} style={pStyle}>{section.text}</p>
                  )
                )}
                <ActionBox
                  headline={article.action.headline}
                  description={article.action.description}
                  cta={article.action.cta}
                  href={article.action.href}
                />
              </>
            ) : signal.body ? (
              <>
                <div
                  style={{ fontFamily: "var(--rf-sans)", fontSize: "0.92rem", color: "var(--rf-ink-mid)", lineHeight: 1.8 }}
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
          <div style={{
            padding: isMobile ? "1rem 1.25rem" : "1.25rem 2rem",
            borderTop: "1px solid var(--rf-paper-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <EngagementBtn
                  onClick={handleLike}
                  active={liked}
                  disabled={likeLoading}
                  icon={liked ? "♥" : "♡"}
                  count={likeCount}
                  label={liked ? "Unlike" : "Like"}
                />
                <EngagementBtn
                  onClick={handleScrollToComments}
                  icon="💬"
                  count={displayCommentCount}
                  label="Comments"
                />
                <EngagementBtn
                  onClick={handleShare}
                  icon="🔗"
                  label="Share"
                />
              </div>

              {/* Inline like prompt for unauthenticated users */}
              {showLikePrompt && (
                <p style={{
                  fontFamily: "var(--rf-sans)",
                  fontSize: "0.72rem",
                  color: "var(--rf-ink-mid)",
                  margin: 0,
                }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onClose(); navigate("/signup?mode=signin"); }}
                    style={{
                      background: "none",
                      border: "none",
                      fontFamily: "var(--rf-sans)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--rf-purple)",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    Sign in to like this signal →
                  </button>
                </p>
              )}
            </div>

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
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--rf-purple-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--rf-purple)")}
            >
              Run a Safety Check — R99
            </button>
          </div>

          {/* ── COMMENTS ── */}
          <div
            ref={commentsRef}
            style={{ padding: isMobile ? "1.25rem 1.25rem 2rem" : "1.5rem 2rem", borderTop: "1px solid var(--rf-paper-dark)" }}
          >
            <h4 style={{
              fontFamily: "var(--rf-sans)",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--rf-ink)",
              marginBottom: "1.25rem",
            }}>
              Comments ({displayCommentCount})
            </h4>

            {/* Comment list */}
            {commentsLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "1.5rem 0" }}>
                <div style={{
                  width: 22,
                  height: 22,
                  border: "2.5px solid var(--rf-paper-dark)",
                  borderTopColor: "var(--rf-purple)",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }} />
              </div>
            ) : commentsError ? (
              <p style={{ fontFamily: "var(--rf-sans)", fontSize: "0.82rem", color: "var(--rf-ink-soft)", marginBottom: "1.25rem" }}>
                Comments could not be loaded right now.
              </p>
            ) : comments.length === 0 ? (
              <p style={{ fontFamily: "var(--rf-sans)", fontSize: "0.82rem", color: "var(--rf-ink-soft)", marginBottom: "1.25rem" }}>
                No comments yet. Be the first to add your voice.
              </p>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
                  {displayedComments.map((c) => (
                    <div key={c.id} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: c.pending ? "var(--rf-paper-dark)" : "var(--rf-purple-light)",
                        color: c.pending ? "var(--rf-ink-soft)" : "var(--rf-purple)",
                        fontFamily: "var(--rf-sans)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {c.initial}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                          <span style={{ fontFamily: "var(--rf-sans)", fontSize: "0.8rem", fontWeight: 600, color: "var(--rf-ink)" }}>
                            {c.name}
                          </span>
                          <span style={{
                            fontFamily: "var(--rf-sans)",
                            fontSize: "0.7rem",
                            color: "var(--rf-ink-soft)",
                            fontStyle: c.pending ? "italic" : "normal",
                          }}>
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

                {/* Load more */}
                {remainingCount > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setVisibleCount((v) => v + COMMENTS_PAGE_SIZE); }}
                    style={{
                      display: "block",
                      width: "100%",
                      fontFamily: "var(--rf-sans)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--rf-purple)",
                      background: "var(--rf-purple-light)",
                      border: "none",
                      borderRadius: "2rem",
                      padding: "0.65rem 1rem",
                      cursor: "pointer",
                      marginBottom: "1.25rem",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#DDD6FE")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--rf-purple-light)")}
                  >
                    Load {Math.min(COMMENTS_PAGE_SIZE, remainingCount)} more comment{Math.min(COMMENTS_PAGE_SIZE, remainingCount) !== 1 ? "s" : ""}
                  </button>
                )}
              </>
            )}

            {/* Comment input — auth-aware */}
            {isAuthenticated ? (
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <input
                  ref={inputRef}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePost(); } }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Add your voice..."
                  maxLength={1000}
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
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--rf-purple)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--rf-paper-dark)")}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handlePost(); }}
                  disabled={!commentInput.trim() || posting}
                  style={{
                    fontFamily: "var(--rf-sans)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    background: commentInput.trim() && !posting ? "var(--rf-purple)" : "var(--rf-ink-soft)",
                    border: "none",
                    borderRadius: "2rem",
                    padding: "0.6rem 1rem",
                    cursor: commentInput.trim() && !posting ? "pointer" : "default",
                    transition: "background 0.18s",
                    whiteSpace: "nowrap",
                    minWidth: 56,
                  }}
                  onMouseEnter={(e) => { if (commentInput.trim() && !posting) e.currentTarget.style.background = "var(--rf-purple-dark)"; }}
                  onMouseLeave={(e) => { if (commentInput.trim() && !posting) e.currentTarget.style.background = "var(--rf-purple)"; }}
                >
                  {posting ? "…" : "Post"}
                </button>
              </div>
            ) : (
              <p style={{ fontFamily: "var(--rf-sans)", fontSize: "0.82rem", color: "var(--rf-ink-soft)", margin: 0 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(); navigate("/signup?mode=signin"); }}
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
                  Sign in to add your voice →
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── SHARE TOAST (desktop clipboard confirmation) ── */}
      {showShareToast && (
        <div
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 600,
            background: "var(--rf-ink)",
            color: "#FFFFFF",
            fontFamily: "var(--rf-sans)",
            fontSize: "0.82rem",
            fontWeight: 600,
            padding: "0.7rem 1.4rem",
            borderRadius: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            animation: "rf-toast-in 0.2s ease both",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          ✓ Link copied to clipboard
        </div>
      )}
    </>
  );
};

// ── Shared styles ────────────────────────────────────────────────
const pStyle: React.CSSProperties = {
  fontFamily: "var(--rf-sans)",
  fontSize: "0.92rem",
  color: "var(--rf-ink-mid)",
  lineHeight: 1.8,
  marginBottom: "1rem",
};

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

// ── ActionBox ────────────────────────────────────────────────────
interface ActionBoxProps {
  headline: string;
  description: string;
  cta: string;
  href: string;
}

const ActionBox = ({ headline, description, cta, href }: ActionBoxProps) => {
  const navigate = useNavigate();
  return (
    <div style={{ background: "var(--rf-dark)", borderRadius: "1rem", padding: "1.5rem", marginTop: "1.5rem" }}>
      <p style={{ fontFamily: "var(--rf-sans)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--rf-purple)", marginBottom: "0.4rem" }}>
        Your behavioral action today
      </p>
      <h4 style={{ fontFamily: "var(--rf-serif)", fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.35, marginBottom: "0.4rem" }}>
        {headline}
      </h4>
      <p style={{ fontFamily: "var(--rf-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, marginBottom: "1rem" }}>
        {description}
      </p>
      <button
        onClick={() => navigate(href)}
        style={{ fontFamily: "var(--rf-sans)", fontSize: "0.8rem", fontWeight: 600, color: "#FFFFFF", background: "var(--rf-purple)", border: "none", borderRadius: "2rem", padding: "0.65rem 1.25rem", cursor: "pointer", transition: "background 0.18s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--rf-purple-dark)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--rf-purple)")}
      >
        {cta}
      </button>
    </div>
  );
};

// ── EngagementBtn ─────────────────────────────────────────────────
interface EngagementBtnProps {
  onClick: (e: React.MouseEvent) => void;
  icon: string;
  count?: number;
  label: string;
  active?: boolean;
  disabled?: boolean;
}

const EngagementBtn = ({ onClick, icon, count, label, active, disabled }: EngagementBtnProps) => (
  <button
    onClick={onClick}
    aria-label={label}
    disabled={disabled}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      background: "none",
      border: "none",
      cursor: disabled ? "default" : "pointer",
      fontFamily: "var(--rf-sans)",
      fontSize: "0.78rem",
      color: active ? "var(--rf-purple)" : "var(--rf-ink-soft)",
      padding: "4px",
      transition: "color 0.15s",
      opacity: disabled ? 0.6 : 1,
    }}
    onMouseEnter={(e) => { if (!active && !disabled) e.currentTarget.style.color = "var(--rf-purple)"; }}
    onMouseLeave={(e) => { if (!active && !disabled) e.currentTarget.style.color = "var(--rf-ink-soft)"; }}
  >
    <span style={{ fontSize: "0.95rem", lineHeight: 1 }}>{icon}</span>
    {count !== undefined ? count : label}
  </button>
);

export default SignalModal;

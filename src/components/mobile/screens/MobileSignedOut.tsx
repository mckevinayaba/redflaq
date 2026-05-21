import { Link } from "react-router-dom";
import MobileTopBar from "../MobileTopBar";
import { screen, page, card, h1, label, mono, syne, MUTED, ACCENT, primaryButton, ghostButton } from "./mobileTokens";

/**
 * Friendly sign-in screen for unauthenticated mobile users.
 * Replaces the desktop redirect-to-/signup behaviour so the bottom
 * tab bar stays visible and the surface stays consistent.
 */
export default function MobileSignedOut({ context }: { context: "home" | "journal" | "base" | "check" }) {
  const copy: Record<string, { eyebrow: string; title: string; body: string }> = {
    home: {
      eyebrow: "Safety Base",
      title: "Your private dashboard.",
      body: "Sign in to run checks, document incidents, and pick up where you left off.",
    },
    check: {
      eyebrow: "Run a check",
      title: "Verify before you trust.",
      body: "Create a free account to run your first check in under 60 seconds.",
    },
    journal: {
      eyebrow: "Safety Journal",
      title: "Encrypted. Yours alone.",
      body: "Sign in to write a locked, timestamped record only you can read.",
    },
    base: {
      eyebrow: "Saved",
      title: "Pick up where you left off.",
      body: "Reports, saved Signals, and bookmarks all live here once you sign in.",
    },
  };

  const c = copy[context];

  return (
    <div style={screen}>
      <MobileTopBar />
      <div style={page}>
        <div>
          <span style={label}>{c.eyebrow}</span>
          <h1 style={{ ...h1, marginTop: 12 }}>{c.title}</h1>
          <p style={{ ...syne, color: MUTED, fontSize: 15, lineHeight: 1.55, marginTop: 12 }}>{c.body}</p>
        </div>

        <div style={card}>
          <Link to="/signup" style={primaryButton}>Create free account</Link>
          <div style={{ height: 10 }} />
          <Link to="/signup?mode=signin" style={ghostButton}>I already have an account</Link>
        </div>

        <p style={{ ...mono, fontSize: 10, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center" }}>
          <span style={{ color: ACCENT }}>Before You Trust</span> — RedFlaq First.
        </p>
      </div>
    </div>
  );
}

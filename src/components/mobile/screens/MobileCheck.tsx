import { Link } from "react-router-dom";
import MobileTopBar from "../MobileTopBar";
import MobileSignedOut from "./MobileSignedOut";
import { useAuth } from "@/hooks/useAuth";
import {
  screen, page, card, h1, label, syne, mono, serif,
  MUTED, ACCENT, TEXT, primaryButton, ghostButton,
} from "./mobileTokens";

const STEPS = [
  ["01", "Name", "Full legal name + province. That's the minimum."],
  ["02", "ID (optional)", "13-digit SA ID sharpens the match."],
  ["03", "Result", "Risk level + matched records in seconds."],
];

/**
 * Mobile entry surface for "Check". Routes to the full form
 * which keeps all credit/POPIA logic intact.
 */
export default function MobileCheck() {
  const { user, loading: authLoading } = useAuth();
  if (!authLoading && !user) return <MobileSignedOut context="check" />;

  return (
    <div style={screen}>
      <MobileTopBar title="Check" />
      <div style={page}>
        <div>
          <span style={label}>Verify · R99 per check</span>
          <h1 style={{ ...h1, marginTop: 10 }}>
            Check someone <span style={{ color: ACCENT }}>before</span> you trust them.
          </h1>
          <p style={{ ...syne, color: MUTED, fontSize: 15, lineHeight: 1.55, marginTop: 10 }}>
            One name. One province. Sixty seconds. We search the RedFlaq Verified Public Records Network.
          </p>
        </div>

        <div style={card}>
          {STEPS.map(([n, t, d], i) => (
            <div
              key={n}
              style={{
                display: "flex",
                gap: 16,
                paddingTop: i === 0 ? 0 : 16,
                paddingBottom: i === STEPS.length - 1 ? 0 : 16,
                borderBottom: i === STEPS.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span style={{ ...serif, color: ACCENT, fontSize: 32, lineHeight: 1, minWidth: 38 }}>{n}</span>
              <div>
                <p style={{ ...syne, fontWeight: 700, fontSize: 15, color: TEXT }}>{t}</p>
                <p style={{ ...syne, color: MUTED, fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>

        <Link to="/dashboard/new-check" style={primaryButton}>Start a check →</Link>
        <Link to="/sources" style={ghostButton}>Where the data comes from</Link>

        <p style={{ ...mono, fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", marginTop: 4 }}>
          We never notify the person being checked.
        </p>
      </div>
    </div>
  );
}

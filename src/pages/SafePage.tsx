import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AppShell from "@/components/shell/AppShell";

type SafeCard = {
  id: string;
  title: string;
  description: string;
  path: string;
  authRequired: boolean;
  icon: React.ReactNode;
  tag: string;
  tagColor: string;
};

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 19.5V4.5C4 3.7 4.7 3 5.5 3H19V21H5.5C4.7 21 4 20.3 4 19.5Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M4 19.5C4 20.3 4.7 21 5.5 21H19" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8 7H15M8 11H12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const FileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M14 2H6C5.4 2 5 2.4 5 3V21C5 21.6 5.4 22 6 22H18C18.6 22 19 21.6 19 21V7L14 2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M14 2V7H19" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M9 13H15M9 17H13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 3L4 7V13C4 17 7.6 20.5 12 22C16.4 20.5 20 17 20 13V7L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.7" />
    <path d="M2 20C2 17.8 5.6 16 10 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M15 11C16.1 11 17 11.9 17 13C17 14.1 16.1 15 15 15C13.9 15 13 14.1 13 13C13 11.9 13.9 11 15 11Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M22 20C22 18.3 18.9 17 15 17C13.4 17 12 17.3 11 17.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const SAFE_CARDS: SafeCard[] = [
  {
    id: "journal",
    title: "Safety Journal",
    description:
      "Record incidents, track patterns, and document evidence privately. Entries are encrypted and belong only to you.",
    path: "/dashboard/journal",
    authRequired: true,
    icon: <BookIcon />,
    tag: "Private journal",
    tagColor: "#3FA394",
  },
  {
    id: "affidavit",
    title: "Affidavit Builder",
    description:
      "Build a legally structured statement of events you can use to report to SAPS or a court. Guides you step by step.",
    path: "/dashboard/affidavit",
    authRequired: true,
    icon: <FileIcon />,
    tag: "Legal document",
    tagColor: "#D97706",
  },
  {
    id: "first-date",
    title: "First Date Safety",
    description:
      "Step-by-step checklist before meeting someone for the first time. Share your location, tell someone where you're going.",
    path: "/safety-tips/first-date-safety",
    authRequired: false,
    icon: <HeartIcon />,
    tag: "Dating safety",
    tagColor: "#E0525B",
  },
  {
    id: "tenant",
    title: "Renting Safely",
    description:
      "Essential checks before signing a lease or handing over a deposit. Spot phantom properties and unverified landlords.",
    path: "/safety-tips/tenant-safety",
    authRequired: false,
    icon: <HomeIcon />,
    tag: "Housing",
    tagColor: "#3FA394",
  },
  {
    id: "domestic",
    title: "Domestic Worker Safety",
    description:
      "Practical steps when hiring someone to work in your home — checking identity, references, and setting boundaries.",
    path: "/safety-tips/domestic-worker-safety",
    authRequired: false,
    icon: <UsersIcon />,
    tag: "Home safety",
    tagColor: "#9AA6AD",
  },
  {
    id: "resources",
    title: "Emergency Resources",
    description:
      "GBV Command Centre · SAPS · Thuthuzela Care Centres · Legal Aid SA. Numbers you need, by province.",
    path: "/safety-tips#resources",
    authRequired: false,
    icon: <ShieldIcon />,
    tag: "SA resources",
    tagColor: "#E0525B",
  },
];

const EMERGENCY_LINES = [
  { name: "GBV Command Centre", number: "0800 428 428", note: "24/7 · Free · All languages" },
  { name: "SAPS Emergency", number: "10111", note: "Police emergency line" },
  { name: "Childline SA", number: "116", note: "24/7 · Child protection" },
  { name: "Lifeline SA", number: "0861 322 322", note: "Crisis counselling" },
];

export default function SafePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AppShell>
      <div
        style={{
          minHeight: "100dvh",
          background: "var(--rf2-ink)",
          color: "var(--rf2-ivory)",
          fontFamily: "var(--rf2-body)",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            width: "100%",
            margin: "0 auto",
            padding: "2rem max(16px, env(safe-area-inset-left, 0px))",
            display: "flex",
            flexDirection: "column",
            gap: "2.25rem",
          }}
        >
          {/* Heading */}
          <div>
            <span
              style={{
                fontFamily: "var(--rf2-body)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--rf2-teal)",
                display: "block",
                marginBottom: 8,
              }}
            >
              Safe
            </span>
            <h1
              style={{
                fontFamily: "var(--rf2-display)",
                fontSize: "clamp(24px, 5vw, 36px)",
                fontWeight: 700,
                color: "var(--rf2-ivory)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 10,
              }}
            >
              Your safety tools,{" "}
              <em style={{ color: "var(--rf2-teal)", fontStyle: "italic" }}>
                in one place.
              </em>
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "var(--rf2-muted)",
                lineHeight: 1.65,
              }}
            >
              Document incidents, prepare statements, and access South African
              safety resources — private to you, available when you need them.
            </p>
          </div>

          {/* Emergency banner */}
          <div
            style={{
              background: "rgba(224,82,91,0.08)",
              border: "1.5px solid rgba(224,82,91,0.25)",
              borderRadius: 10,
              padding: "1rem 1.1rem",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--rf2-coral)",
                marginBottom: 10,
              }}
            >
              In an emergency
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 10,
              }}
            >
              {EMERGENCY_LINES.map((line) => (
                <div key={line.name}>
                  <a
                    href={`tel:${line.number.replace(/\s/g, "")}`}
                    style={{
                      display: "block",
                      fontFamily: "var(--rf2-body)",
                      fontWeight: 700,
                      fontSize: 18,
                      color: "var(--rf2-ivory)",
                      textDecoration: "none",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {line.number}
                  </a>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--rf2-muted)",
                    }}
                  >
                    {line.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--rf2-muted-2)",
                      display: "block",
                    }}
                  >
                    {line.note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safe cards grid */}
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "var(--rf2-muted-2)",
                marginBottom: "0.75rem",
              }}
            >
              Tools
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 10,
              }}
            >
              {SAFE_CARDS.map((card) => {
                const locked = card.authRequired && !user;
                return (
                  <button
                    key={card.id}
                    onClick={() => navigate(locked ? "/signup" : card.path)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "1.1rem",
                      borderRadius: 10,
                      border: "1px solid var(--rf2-line-2)",
                      background: "var(--rf2-ink-2)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "border-color 0.1s ease",
                      opacity: locked ? 0.65 : 1,
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = card.tagColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--rf2-line-2)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span
                        style={{ color: card.tagColor }}
                        aria-hidden
                      >
                        {card.icon}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          color: card.tagColor,
                          fontFamily: "var(--rf2-body)",
                        }}
                      >
                        {locked ? "Sign in required" : card.tag}
                      </span>
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--rf2-body)",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--rf2-ivory)",
                          marginBottom: 4,
                          lineHeight: 1.3,
                        }}
                      >
                        {card.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--rf2-body)",
                          fontSize: 12.5,
                          color: "var(--rf2-muted)",
                          lineHeight: 1.55,
                          margin: 0,
                        }}
                      >
                        {card.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sign-in prompt if not logged in */}
          {!user && (
            <div
              style={{
                background: "var(--rf2-ink-2)",
                border: "1px solid var(--rf2-line-2)",
                borderRadius: 10,
                padding: "1rem 1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--rf2-body)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--rf2-ivory)",
                    margin: 0,
                  }}
                >
                  Sign in to access your Journal and Affidavit Builder
                </p>
                <p
                  style={{
                    fontFamily: "var(--rf2-body)",
                    fontSize: 12,
                    color: "var(--rf2-muted)",
                    margin: "2px 0 0",
                  }}
                >
                  Your documents are private and encrypted.
                </p>
              </div>
              <button
                onClick={() => navigate("/signup")}
                style={{
                  padding: "9px 18px",
                  borderRadius: 7,
                  border: "none",
                  background: "var(--rf2-teal)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "var(--rf2-body)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

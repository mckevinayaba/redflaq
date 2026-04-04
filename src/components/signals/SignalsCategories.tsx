export const SIGNAL_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "dating-relationships", label: "Dating & Relationships" },
  { value: "behavioral-patterns", label: "Behavioral Patterns" },
  { value: "safety-habits", label: "Safety Habits" },
  { value: "gbvf-evidence", label: "GBVF & Evidence" },
  { value: "self-accountability", label: "Self-Accountability" },
] as const;

export type SignalCategory = (typeof SIGNAL_CATEGORIES)[number]["value"];

interface SignalsCategoriesProps {
  activeCategory: SignalCategory;
  onCategoryChange: (category: SignalCategory) => void;
}

const SignalsCategories = ({
  activeCategory,
  onCategoryChange,
}: SignalsCategoriesProps) => {
  return (
    <div
      style={{
        background: "var(--rf-paper)",
        padding: "1.5rem 2rem 0.5rem",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {SIGNAL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: isActive ? "#FFFFFF" : "var(--rf-ink-mid)",
                background: isActive ? "var(--rf-purple)" : "var(--rf-paper-dark)",
                border: `1.5px solid ${isActive ? "var(--rf-purple)" : "transparent"}`,
                borderRadius: "2rem",
                padding: "0.4rem 0.95rem",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--rf-purple)";
                  e.currentTarget.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--rf-paper-dark)";
                  e.currentTarget.style.color = "var(--rf-ink-mid)";
                }
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SignalsCategories;

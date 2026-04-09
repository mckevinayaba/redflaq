const ITEMS = [
  "You already know something is off. The danger is in what you keep explaining away.",
  "This is not bad luck. This is trust given before a single fact was checked.",
  "GBVF does not begin with a bruise. It begins with a pattern you decided not to name.",
  "If R99 feels heavy, ask what it will cost to keep pretending you never saw the signs.",
  "He was not just stressed. He was teaching you what happens when you question him.",
  "You checked the restaurant, the Uber, the vibe. But not the person.",
];

const TICKER_ITEMS = [...ITEMS, ...ITEMS];

const SignalsTicker = () => {
  return (
    <>
      <style>{`
        @keyframes signals-ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .signals-ticker-track {
          animation: signals-ticker-scroll 45s linear infinite;
        }
        .signals-ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        style={{
          background: "#0d0d1a",
          borderTop: "1px solid rgba(108,53,222,0.2)",
          borderBottom: "1px solid rgba(108,53,222,0.2)",
          padding: "0.55rem 0",
          overflow: "hidden",
        }}
      >
        <div
          className="signals-ticker-track"
          style={{
            display: "flex",
            alignItems: "center",
            width: "max-content",
          }}
        >
          {TICKER_ITEMS.map((text, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#ffffff",
                padding: "0 2.5rem",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "#C0392B", marginRight: "0.6rem" }}>
                ◆
              </span>
              {text}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default SignalsTicker;

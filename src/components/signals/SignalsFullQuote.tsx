const SignalsFullQuote = () => {
  return (
    <section
      style={{
        background: "var(--rf-dark)",
        padding: "3rem 2rem",
        textAlign: "center",
      }}
    >
      <blockquote
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 0,
          border: "none",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "block",
            fontFamily: "var(--rf-serif)",
            fontSize: "2.5rem",
            color: "var(--rf-purple)",
            lineHeight: 1,
            marginBottom: "0.25rem",
          }}
        >
          &#8220;
        </span>
        <p
          style={{
            fontFamily: "var(--rf-serif)",
            fontStyle: "italic",
            fontSize: "1.3rem",
            color: "rgba(255,255,255,0.95)",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          The most dangerous thing you will do today is meet someone you have
          never verified. And you will not think twice about it.
        </p>
      </blockquote>
    </section>
  );
};

export default SignalsFullQuote;

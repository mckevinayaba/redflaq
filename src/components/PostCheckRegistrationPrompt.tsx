import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const PostCheckRegistrationPrompt = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "rgba(107, 78, 255, 0.04)",
        border: "1.5px solid rgba(107, 78, 255, 0.15)",
        borderRadius: 14,
        padding: "32px 28px",
        textAlign: "center",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#F1ECFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <Shield style={{ width: 22, height: 22, color: "#6B4EFF" }} />
      </div>

      <h3
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 22,
          color: "#1F1F1F",
          marginBottom: 10,
        }}
      >
        Save this result to your free RedFlaq account
      </h3>

      <p
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          color: "#78716C",
          lineHeight: 1.6,
          marginBottom: 24,
          maxWidth: 440,
          margin: "0 auto 24px",
        }}
      >
        Create a free account to save your check history, access your private
        Safety Journal, build an Affidavit if you need one, and get GBV
        helplines across all 9 provinces. No credit card needed.
      </p>

      <button
        onClick={() => navigate("/signup")}
        style={{
          background: "#6B4EFF",
          color: "#FFFFFF",
          padding: "14px 32px",
          border: "none",
          borderRadius: 50,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginBottom: 12,
          width: "100%",
          maxWidth: 320,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#5B3EE4";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#6B4EFF";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Create Free Account — It's Free
      </button>

      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#78716C" }}>
        Already have an account?{" "}
        <button
          onClick={() => navigate("/signup?mode=signin")}
          style={{
            background: "none",
            border: "none",
            color: "#6B4EFF",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            textDecoration: "underline",
            padding: 0,
          }}
        >
          Log in
        </button>
      </p>
    </div>
  );
};

export default PostCheckRegistrationPrompt;

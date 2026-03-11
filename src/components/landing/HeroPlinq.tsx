import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HeroPlinq = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleVerify = () => {
    if (isAuthenticated) {
      navigate("/dashboard/new-check");
    } else {
      navigate("/signup?intent=verify");
    }
  };

  const stats = [
    "Results in under 60 seconds",
    "Public records only",
    "100% confidential",
    "POPIA-aware use",
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(237,233,254,0.3) 0%, #FFFFFF 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10 md:py-16 lg:py-20 flex flex-col items-center text-center">
        {/* Badge */}
        <div
          className="transition-all duration-300 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-12px)",
          }}
        >
          <span
            className="inline-block rounded-3xl px-5 py-2.5 text-sm font-semibold leading-relaxed"
            style={{
              background: "#EDE9FE",
              color: "#7C3AED",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Built in South Africa for anyone facing GBV and violence —
            <br className="hidden sm:inline" />
            {" "}and everyone protecting their loved ones.
          </span>
        </div>

        {/* Primary Headline */}
        <h1
          className="mt-8 text-[36px] sm:text-[48px] md:text-[56px] lg:text-[68px] transition-all duration-[400ms] ease-out"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#1E1B4B",
            letterSpacing: "-0.02em",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "100ms",
          }}
        >
          Before you give him a spare key,
          <br />
          give yourself <em style={{ color: "#7C3AED", fontStyle: "italic" }}>clarity.</em>
        </h1>

        {/* Secondary Headline */}
        <h2
          className="mt-4 text-[22px] sm:text-[28px] md:text-[36px] lg:text-[44px] transition-all duration-[400ms] ease-out"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 500,
            lineHeight: 1.15,
            color: "#334155",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "150ms",
          }}
        >
          Before you trust anyone with your home, children, or safety — verify first.
        </h2>

        {/* Sub-headline */}
        <p
          className="mt-6 text-base md:text-lg lg:text-xl max-w-[700px] transition-all duration-500 ease-out"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 400,
            lineHeight: 1.7,
            color: "#475569",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "200ms",
          }}
        >
          RedFlaq searches South African public-record warning lists so you can make
          informed decisions about who to trust. Instant. Confidential. R99.
        </p>

        {/* Supporting Text */}
        <p
          className="mt-4 text-sm md:text-base max-w-[600px] transition-all duration-500 ease-out"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 400,
            color: "#64748B",
            lineHeight: 1.6,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "250ms",
          }}
        >
          Not a full criminal record check. A fast public-record safety check with
          a clear report in under 60 seconds.
        </p>

        {/* Stats Bar */}
        <div
          className="mt-6 overflow-x-auto w-full transition-all duration-[400ms] ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "300ms",
          }}
        >
          <div
            className="inline-flex items-center gap-3 md:gap-4 px-6 py-3 rounded-xl mx-auto whitespace-nowrap"
            style={{ background: "#EDE9FE" }}
          >
            {stats.map((s, i) => (
              <span key={s} className="inline-flex items-center gap-3 md:gap-4">
                <span
                  className="text-sm font-medium flex items-center gap-1.5"
                  style={{ color: "#7C3AED", fontFamily: "'Syne', sans-serif" }}
                >
                  <Check className="h-3.5 w-3.5 flex-shrink-0" />
                  {s}
                </span>
                {i < stats.length - 1 && (
                  <span style={{ color: "#7C3AED", opacity: 0.4 }}>•</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 transition-all duration-500 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "400ms",
          }}
        >
          <button
            onClick={handleVerify}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5"
            style={{
              background: "#7C3AED",
              color: "#FFFFFF",
              border: "none",
              fontFamily: "'Syne', sans-serif",
              boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#6D28D9";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(124,58,237,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#7C3AED";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.25)";
            }}
          >
            Verify Someone Now — R99
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5"
            style={{
              background: "#FFFFFF",
              color: "#7C3AED",
              border: "2px solid #7C3AED",
              fontFamily: "'Syne', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#EDE9FE";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
            }}
          >
            Create Free Safety Account
          </button>
        </div>

        {/* Trust Line */}
        <p
          className="mt-4 text-sm max-w-[500px]"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: "#64748B",
            lineHeight: 1.6,
          }}
        >
          Create a free safety account to save checks and use My Safety Journal.
          No card required.{" "}
          <span className="inline">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signup?mode=signin")}
              className="bg-transparent border-none cursor-pointer p-0 underline-offset-2 hover:underline"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#7C3AED",
              }}
            >
              Log in here
            </button>
          </span>
        </p>
      </div>
    </section>
  );
};

export default HeroPlinq;

import { useEffect, useState } from "react";
import { Check, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import saWoman from "@/assets/sa-professional-woman.jpg";

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
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT COLUMN — Text */}
          <div className="flex flex-col items-start text-left">
            {/* Badge */}
            <div
              className="transition-all duration-300 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(-12px)",
              }}
            >
              <span
                className="inline-flex items-center gap-2 rounded-3xl px-5 py-2.5 text-sm font-semibold leading-relaxed"
                style={{
                  background: "#EDE9FE",
                  color: "#7C3AED",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                <Heart className="h-4 w-4 flex-shrink-0" />
                <span>
                  Built in South Africa for people living with GBV and violence — and everyone protecting their loved ones.
                </span>
              </span>
            </div>

            {/* Primary Headline */}
            <h1
              className="mt-8 text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] transition-all duration-[400ms] ease-out"
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
              give yourself{" "}
              <em style={{ color: "#7C3AED", fontStyle: "italic" }}>clarity.</em>
            </h1>

            {/* Body text */}
            <p
              className="mt-6 text-base md:text-lg lg:text-xl max-w-[560px] transition-all duration-500 ease-out"
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
              RedFlaq searches South African public-record warning lists so you can
              make informed decisions about who to trust with your life, home, or
              business. Instant. Confidential. R99.
            </p>

            {/* Supporting Text */}
            <p
              className="mt-3 text-sm md:text-base max-w-[520px] transition-all duration-500 ease-out"
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
              Not a full criminal record check. A fast public-record safety check
              with a clear report in under 60 seconds.
            </p>

            {/* Stats */}
            <div
              className="mt-6 flex flex-wrap gap-x-5 gap-y-2 transition-all duration-[400ms] ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: "300ms",
              }}
            >
              {stats.map((s) => (
                <span
                  key={s}
                  className="text-sm font-medium flex items-center gap-1.5"
                  style={{ color: "#7C3AED", fontFamily: "'Syne', sans-serif" }}
                >
                  <Check className="h-4 w-4 flex-shrink-0" />
                  {s}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className="mt-8 flex flex-col sm:flex-row items-start gap-4 transition-all duration-500 ease-out"
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
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(124,58,237,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#7C3AED";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(124,58,237,0.25)";
                }}
              >
                Verify Someone Now — R99
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
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
                See How It Works
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
              Create a free safety account to save checks and use My Safety
              Journal. No card required.{" "}
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

          {/* RIGHT COLUMN — Oval image + stat cards */}
          <div
            className="flex flex-col items-center gap-5 transition-all duration-700 ease-out lg:mt-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "200ms",
            }}
          >
            {/* Oval image */}
            <div
              className="w-[280px] h-[340px] sm:w-[340px] sm:h-[420px] lg:w-[400px] lg:h-[480px] overflow-hidden"
              style={{ borderRadius: "50% / 48%" }}
            >
              <img
                src={saWoman}
                alt="South African woman looking through a window with determination"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 40,000+ stat card */}
            <div
              className="w-full max-w-[400px] rounded-2xl px-6 py-5 text-white"
              style={{ background: "#1E293B" }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="text-3xl sm:text-4xl font-bold"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  40,000+
                </span>
                <span
                  className="text-xs tracking-widest uppercase opacity-70"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Sexual Offences / Year
                </span>
              </div>
              <p
                className="mt-1 text-sm opacity-80"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Many offenders had prior warnings in public records.
              </p>
            </div>

            {/* Mission quote card */}
            <div
              className="w-full max-w-[400px] rounded-2xl px-6 py-5 text-white"
              style={{ background: "#7C3AED" }}
            >
              <p
                className="text-sm sm:text-base font-semibold italic leading-relaxed"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                We built RedFlaq so women and communities can access key
                public-record warnings quickly and affordably.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPlinq;

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AlertTriangle, MapPin, Scale } from "lucide-react";

const primaryStats = [
  { value: "7.3 million", label: "women experienced physical violence", source: "HSRC GBV Prevalence Study 2022" },
  { value: "2.1 million", label: "victims of sexual violence", source: "HSRC GBV Prevalence Study 2022" },
  { value: "3.4 million", label: "experienced intimate partner violence", source: "HSRC GBV Prevalence Study 2022" },
];

const secondaryStats = [
  { value: "1 in 3", label: "women experienced physical violence", source: "HSRC National GBV Prevalence Study" },
  { value: "1 in 5", label: "men reported perpetrating physical or sexual violence against a partner", source: "HSRC" },
  { value: "1 in 10", label: "women experienced economic abuse", source: "HSRC" },
  { value: "1 in 4", label: "women experienced emotional abuse", source: "HSRC" },
  { value: "29.4%", label: "of cohabiting women experienced physical violence", source: "HSRC" },
  { value: "25%", label: "of young women (18–24) experienced physical violence", source: "HSRC" },
];

const hotspots = [
  { province: "Gauteng", count: 8 },
  { province: "Western Cape", count: 8 },
  { province: "KwaZulu-Natal", count: 7 },
  { province: "Eastern Cape", count: 3 },
  { province: "Free State", count: 2 },
  { province: "North West", count: 1 },
];

const rootCauses = [
  "Patriarchal Norms",
  "Culture of Violence",
  "Substance Abuse",
  "Poverty & Unemployment",
  "Weak Law Enforcement",
  "~3% Conviction Rate",
];

const GovDataSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <>
      {/* Bridge line between hero and stats */}
      <section style={{ background: "hsl(var(--background))", padding: "56px 24px 0" }}>
        <p
          className="font-body text-center mx-auto"
          style={{
            maxWidth: 620,
            fontSize: "clamp(16px, 2vw, 19px)",
            fontWeight: 600,
            lineHeight: 1.7,
            color: "hsl(var(--foreground))",
          }}
        >
          You did everything they told you — met in public places, shared your location, checked his first impression and looks. They lied. Women still die. Before you trust, RedFlaq first.
        </p>
      </section>

      <section
        ref={ref}
        className={`reveal-section ${isVisible ? "visible" : ""}`}
        style={{ background: "hsl(var(--background))", padding: "60px 0 60px" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

          {/* Section title */}
          <div className="text-center mb-10">
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-0.02em", color: "hsl(var(--foreground))", lineHeight: 1.1 }}>
              The uncomfortable truth
            </h2>
            <p className="font-body text-muted-foreground mt-3 mx-auto" style={{ maxWidth: 520, fontSize: 15, lineHeight: 1.7 }}>
              This is the South African reality women are living in right now.
            </p>
          </div>

        {/* Uncomfortable truth tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {/* Card 1 – Time */}
          <div
            className="text-center card-lift flex flex-col"
            style={{
              background: "hsl(var(--card))",
              borderRadius: 20,
              padding: "44px 24px 36px",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(40px, 5vw, 60px)",
              color: "hsl(var(--primary))",
              lineHeight: 1,
              marginBottom: 14,
              letterSpacing: "-0.02em",
            }}>
              Every 4 hours
            </div>
            <div className="font-body" style={{ fontSize: 15, color: "hsl(var(--foreground))", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
              Another woman is killed in South Africa.
            </div>
            <div className="mt-auto pt-5 font-mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: "hsl(var(--muted-foreground))", opacity: 0.7 }}>
              Centre for Constitutional Rights, citing UNODC femicide data
            </div>
          </div>

          {/* Card 2 – Comparison */}
          <div
            className="text-center card-lift flex flex-col"
            style={{
              background: "hsl(var(--card))",
              borderRadius: 20,
              padding: "44px 24px 36px",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(40px, 5vw, 60px)",
              color: "hsl(var(--primary))",
              lineHeight: 1,
              marginBottom: 14,
              letterSpacing: "-0.02em",
            }}>
              5×
            </div>
            <div className="font-body" style={{ fontSize: 15, color: "hsl(var(--foreground))", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
              South Africa's femicide rate vs the global average.
            </div>
            <div className="mt-auto pt-5 font-mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: "hsl(var(--muted-foreground))", opacity: 0.7 }}>
              Africa Check analysis of South African and UNODC data
            </div>
          </div>

          {/* Card 3 – Volume + brutal statement */}
          <div
            className="text-center card-lift flex flex-col"
            style={{
              background: "hsl(var(--card))",
              borderRadius: 20,
              padding: "44px 24px 36px",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(40px, 5vw, 60px)",
              color: "hsl(var(--primary))",
              lineHeight: 1,
              marginBottom: 14,
              letterSpacing: "-0.02em",
            }}>
              3 000+
            </div>
            <div className="font-body" style={{ fontSize: 15, color: "hsl(var(--foreground))", lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
              Women murdered in South Africa in a typical year — roughly 9 every day.
            </div>
            <div className="font-body italic" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", lineHeight: 1.6, maxWidth: 280, margin: "14px auto 0" }}>
              Because the danger does not reveal itself on the first date, or second or even third. It shows up at Month 3, Month 6, Month 9 — when you are already emotionally invested, financially entangled, and isolated from support.
            </div>
            <div className="mt-auto pt-5 font-mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: "hsl(var(--muted-foreground))", opacity: 0.7 }}>
              SAPS national murder statistics (women)
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="text-center mb-10">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3 flex items-center justify-center gap-3" style={{ color: "hsl(var(--primary))" }}>
            <span className="inline-block w-6 h-px" style={{ background: "hsl(var(--primary))" }} />
            DCOG / DWYPD · November 2025
            <span className="inline-block w-6 h-px" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-0.02em", color: "hsl(var(--foreground))", lineHeight: 1.1 }}>
            Classified as a{" "}
            <span style={{ color: "#DC2626", fontStyle: "italic" }}>National Disaster</span>
          </h2>
          <p className="font-body text-muted-foreground mt-4 mx-auto" style={{ maxWidth: 580, fontSize: 15, lineHeight: 1.7 }}>
            On 21 November 2025, the National Disaster Management Centre classified gender-based violence as a national disaster under Section 23 of the Disaster Management Act. South Africa termed it a "second pandemic."
          </p>
        </div>

        {/* Primary hero stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {primaryStats.map((stat, i) => (
            <div
              key={i}
              className="card-lift text-center"
              style={{
                background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)",
                borderRadius: 20,
                padding: "40px 24px 32px",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(36px, 4vw, 52px)",
                color: "#DC2626",
                lineHeight: 1,
                marginBottom: 12,
                letterSpacing: "-0.02em",
              }}>
                {stat.value}
              </div>
              <div className="font-body" style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: 12 }}>
                {stat.label}
              </div>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}>
                {stat.source}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {secondaryStats.map((stat, i) => (
            <div
              key={i}
              className="card-lift"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 14,
                padding: "28px 22px",
              }}
            >
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 32,
                color: "hsl(var(--primary))",
                lineHeight: 1,
                marginBottom: 8,
                letterSpacing: "-0.01em",
              }}>
                {stat.value}
              </div>
              <div className="font-body text-muted-foreground" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>
                {stat.label}
              </div>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: "hsl(var(--muted-foreground))", opacity: 0.6 }}>
                {stat.source}
              </div>
            </div>
          ))}
        </div>

        {/* Hotspot banner */}
        <div
          className="mb-6"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 16,
            padding: "28px 24px",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: "50%", background: "hsl(var(--primary) / 0.1)" }}>
              <MapPin style={{ width: 18, height: 18, color: "hsl(var(--primary))" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "hsl(var(--foreground))" }}>
                30 GBVF Hotspot Areas Identified
              </div>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.08em", color: "hsl(var(--muted-foreground))" }}>
                DCOG Classification Report
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {hotspots.map((h) => (
              <span
                key={h.province}
                className="font-body"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "hsl(var(--primary) / 0.08)",
                  border: "1px solid hsl(var(--primary) / 0.15)",
                  borderRadius: 50,
                  padding: "6px 14px",
                  fontSize: 13,
                  color: "hsl(var(--foreground))",
                  fontWeight: 600,
                }}
              >
                {h.province}
                <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--primary))" }}>
                  {h.count}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Classification callout */}
        <div
          className="mb-8"
          style={{
            background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)",
            borderRadius: 16,
            padding: "32px 28px",
            borderLeft: "4px solid hsl(var(--primary))",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="absolute top-0 right-0 pointer-events-none"
            style={{ width: 200, height: 200, background: "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)", filter: "blur(40px)" }}
          />
          <div className="relative z-10 flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <AlertTriangle style={{ width: 22, height: 22, color: "#DC2626" }} />
            </div>
            <div>
              <blockquote style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "#fff",
                lineHeight: 1.5,
                fontStyle: "italic",
                marginBottom: 12,
              }}>
                "Gender-based violence and femicide is a national disaster. It is a second pandemic that requires the same urgency, coordination and resources as any other disaster."
              </blockquote>
              <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>
                DCOG / DWYPD · DMA Section 23 Classification · 21 November 2025
              </div>
            </div>
          </div>
        </div>

        {/* Root causes */}
        <div className="text-center">
          <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
            Root Causes Identified
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {rootCauses.map((cause) => (
              <span
                key={cause}
                className="font-body"
                style={{
                  background: "hsl(var(--foreground) / 0.05)",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 50,
                  padding: "8px 18px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "hsl(var(--foreground))",
                  letterSpacing: "0.01em",
                }}
              >
                {cause}
              </span>
            ))}
          </div>
        </div>

        {/* Conviction rate callout */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-3 px-6 py-3" style={{
            background: "rgba(220,38,38,0.06)",
            border: "1px solid rgba(220,38,38,0.15)",
            borderRadius: 12,
          }}>
            <Scale style={{ width: 16, height: 16, color: "#DC2626" }} />
            <span className="font-body" style={{ fontSize: 13, color: "hsl(var(--foreground))", fontWeight: 600 }}>
              During lockdown, the conviction rate for GBV cases dropped to approximately <span style={{ color: "#DC2626", fontWeight: 800 }}>3%</span>
            </span>
            <span className="font-mono" style={{ fontSize: 9, color: "hsl(var(--muted-foreground))" }}>NPA</span>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default GovDataSection;

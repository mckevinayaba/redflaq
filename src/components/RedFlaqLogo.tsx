import redflaqLogo from "@/assets/redflaq-logo.png";

interface RedFlaqLogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export default function RedFlaqLogo({ size = "md", showWordmark = true }: RedFlaqLogoProps) {
  const heights: Record<string, number> = { sm: 24, md: 28, lg: 36 };
  const fontSizes: Record<string, number> = { sm: 16, md: 18, lg: 22 };
  const h = heights[size];
  const fs = fontSizes[size];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <img src={redflaqLogo} alt="RedFlaq" style={{ height: h, width: 'auto' }} />
      {showWordmark && (
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: fs, letterSpacing: '0.1em' }}>
          <span style={{ color: '#2D2235' }}>RedFla</span><span style={{ color: '#DC2626' }}>q</span>
        </span>
      )}
    </span>
  );
}

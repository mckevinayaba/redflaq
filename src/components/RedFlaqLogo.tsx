interface RedFlaqLogoProps {
  height?: number;
  inverted?: boolean;
}

const RedFlaqLogo = ({ height = 36, inverted = false }: RedFlaqLogoProps) => {
  const iconSize = height;
  const fontSize = height * 0.52;
  const gap = 10;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, height }}>
      {/* Rounded square icon with R swoosh */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect x="2" y="2" width="44" height="44" rx="12" fill={inverted ? '#FFFFFF' : '#6B21A8'} />
        {/* Bold R with swoosh leg */}
        <path
          d="M16 36V14h8.5c2.2 0 3.9.6 5.1 1.7 1.2 1.1 1.8 2.6 1.8 4.4 0 1.4-.4 2.6-1.1 3.5-.7.9-1.7 1.6-3 1.9l5.2 10.5h-5.2L23 26.5h-2V36h-5zm5-14h3.2c1 0 1.8-.3 2.3-.8.5-.5.8-1.2.8-2s-.3-1.5-.8-2c-.5-.5-1.3-.8-2.3-.8H21v5.6z"
          fill={inverted ? '#6B21A8' : '#FFFFFF'}
        />
        {/* Swoosh accent on the R leg */}
        <path
          d="M27 30c1.5 1.8 3.2 3.8 5 5.5.6.5 1.2.8 1.8.5"
          stroke={inverted ? '#6B21A8' : '#FFFFFF'}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Wordmark */}
      <span
        style={{
          fontFamily: "'Syne', 'Inter', sans-serif",
          fontWeight: 800,
          fontSize,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: inverted ? '#FFFFFF' : '#3B0764' }}>RedFla</span>
        <span style={{ color: '#DC2626' }}>q</span>
      </span>
    </div>
  );
};

export default RedFlaqLogo;

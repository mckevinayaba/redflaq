import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Props = {
  title: string;
  subtitle: string;
  flagCount: number;
};

export const RedFlagVideo: React.FC<Props> = ({ title, subtitle, flagCount }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
    from: 0.6,
    to: 1,
  });

  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #1a0000 0%, #3d0000 60%, #1a0000 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 40,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Flag icon */}
      <div
        style={{
          fontSize: 120,
          transform: `scale(${scale})`,
          lineHeight: 1,
        }}
      >
        🚩
      </div>

      {/* Flag count badge */}
      <div
        style={{
          backgroundColor: '#ff2200',
          color: '#fff',
          borderRadius: 999,
          padding: '10px 36px',
          fontSize: 36,
          fontWeight: 800,
          opacity: titleOpacity,
          letterSpacing: 1,
        }}
      >
        {flagCount} Red Flag{flagCount !== 1 ? 's' : ''} Found
      </div>

      {/* Title */}
      <div
        style={{
          color: '#fff',
          fontSize: 52,
          fontWeight: 700,
          textAlign: 'center',
          opacity: titleOpacity,
          padding: '0 60px',
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: 32,
          textAlign: 'center',
          opacity: subtitleOpacity,
          padding: '0 80px',
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </div>

      {/* Branding */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          color: 'rgba(255,255,255,0.4)',
          fontSize: 28,
          letterSpacing: 3,
          fontWeight: 600,
        }}
      >
        REDFLAQ.COM
      </div>
    </AbsoluteFill>
  );
};

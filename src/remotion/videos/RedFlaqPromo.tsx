import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

// ─── Shared helpers ────────────────────────────────────────────────────────

const fadeIn = (frame: number, start: number, duration = 20) =>
  interpolate(frame, [start, start + duration], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

const slideUp = (frame: number, fps: number, start: number) =>
  spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 160 }, from: 40, to: 0 });

// ─── Scene 1 — The Stat ────────────────────────────────────────────────────

const StatScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const numOpacity = fadeIn(frame, 5);
  const numScale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 180 }, from: 0.5, to: 1 });
  const line1Opacity = fadeIn(frame, 30);
  const line1Y = slideUp(frame, fps, 30);
  const line2Opacity = fadeIn(frame, 50);
  const line2Y = slideUp(frame, fps, 50);

  return (
    <AbsoluteFill style={{ background: '#0D0D0D', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 0 }}>
      {/* Glow circle */}
      <div style={{
        position: 'absolute',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,38,38,0.25) 0%, transparent 70%)',
        top: '20%', left: '50%', transform: 'translateX(-50%)',
      }} />

      {/* Stat number */}
      <div style={{
        fontSize: 160,
        fontWeight: 900,
        color: '#DC2626',
        fontFamily: 'serif',
        opacity: numOpacity,
        transform: `scale(${numScale})`,
        lineHeight: 1,
        marginBottom: 16,
      }}>12
      </div>

      {/* "minutes" */}
      <div style={{
        fontSize: 48,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'sans-serif',
        letterSpacing: 6,
        textTransform: 'uppercase',
        opacity: line1Opacity,
        transform: `translateY(${line1Y}px)`,
        marginBottom: 40,
      }}>minutes</div>

      <div style={{ width: 60, height: 2, background: '#DC2626', marginBottom: 40, opacity: line2Opacity }} />

      <div style={{
        fontSize: 34,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        padding: '0 80px',
        lineHeight: 1.5,
        opacity: line2Opacity,
        transform: `translateY(${line2Y}px)`,
      }}>
        a woman in South Africa is{' '}
        <span style={{ color: '#DC2626', fontWeight: 700 }}>assaulted</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2 — The Problem ─────────────────────────────────────────────────

const ProblemScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const line1Opacity = fadeIn(frame, 5, 25);
  const line1Y = slideUp(frame, fps, 5);
  const line2Opacity = fadeIn(frame, 35, 25);
  const line2Y = slideUp(frame, fps, 35);
  const line3Opacity = fadeIn(frame, 55, 25);
  const line3Y = slideUp(frame, fps, 55);

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0D0D 0%, #1a0a2e 100%)',
      justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 28, padding: '0 70px',
    }}>
      {/* Subtle grid lines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(124,58,237,0.05) 0px, transparent 1px, transparent 80px)', }} />

      <div style={{ fontSize: 26, color: 'rgba(124,58,237,0.8)', letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', opacity: line1Opacity, transform: `translateY(${line1Y}px)` }}>
        The truth is
      </div>

      <div style={{ fontSize: 52, fontWeight: 800, color: '#FFFFFF', fontFamily: 'serif', textAlign: 'center', lineHeight: 1.2, opacity: line2Opacity, transform: `translateY(${line2Y}px)` }}>
        Violence rarely begins<br />with violence.
      </div>

      <div style={{ width: 50, height: 2, background: 'rgba(124,58,237,0.6)', opacity: line2Opacity }} />

      <div style={{ fontSize: 32, fontWeight: 400, color: 'rgba(255,255,255,0.65)', fontFamily: 'sans-serif', textAlign: 'center', lineHeight: 1.6, opacity: line3Opacity, transform: `translateY(${line3Y}px)` }}>
        It begins with information<br />
        <span style={{ color: '#A78BFA' }}>people didn't have.</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3 — Brand Reveal ─────────────────────────────────────────────────

const BrandScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const flagScale = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 200 }, from: 0, to: 1 });
  const nameOpacity = fadeIn(frame, 30, 20);
  const nameScale = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 150 }, from: 0.7, to: 1 });
  const tagOpacity = fadeIn(frame, 55, 20);
  const badgeOpacity = fadeIn(frame, 70, 20);

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(160deg, #1a0a2e 0%, #2d1b69 50%, #1a0a2e 100%)',
      justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 20,
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
      }} />

      {/* Flag */}
      <div style={{ fontSize: 130, transform: `scale(${flagScale})`, lineHeight: 1, marginBottom: 10 }}>🚩</div>

      {/* Brand name */}
      <div style={{
        fontSize: 96, fontWeight: 900, color: '#FFFFFF', fontFamily: 'sans-serif',
        letterSpacing: -2, opacity: nameOpacity, transform: `scale(${nameScale})`,
      }}>
        RED<span style={{ color: '#7C3AED' }}>FLAQ</span>
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 28, fontWeight: 400, color: 'rgba(255,255,255,0.6)', fontFamily: 'sans-serif',
        letterSpacing: 4, textTransform: 'uppercase', opacity: tagOpacity,
      }}>
        South Africa's Safety Platform
      </div>

      {/* Badge */}
      <div style={{
        marginTop: 30, borderRadius: 999, border: '1.5px solid rgba(124,58,237,0.6)',
        padding: '12px 36px', fontSize: 22, color: '#A78BFA', fontFamily: 'sans-serif',
        letterSpacing: 1, opacity: badgeOpacity,
      }}>
        Before you trust — RedFlaq first.
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4 — Public Record Check ─────────────────────────────────────────

const CheckScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const headerOpacity = fadeIn(frame, 5, 20);
  const headerY = slideUp(frame, fps, 5);
  const cardOpacity = fadeIn(frame, 25, 20);
  const cardY = slideUp(frame, fps, 25);
  const items = [
    { icon: '📋', label: 'Criminal Records', delay: 35 },
    { icon: '⚖️', label: 'Court Orders', delay: 45 },
    { icon: '📑', label: 'Court Judgments', delay: 55 },
    { icon: '🚨', label: 'Financial Sanctions', delay: 65 },
  ];

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0D0D 0%, #0d1117 100%)',
      justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24, padding: '0 60px',
    }}>
      {/* Top label */}
      <div style={{ fontSize: 22, color: '#7C3AED', letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', fontWeight: 700, opacity: headerOpacity, transform: `translateY(${headerY}px)` }}>
        Feature 01
      </div>

      <div style={{ fontSize: 54, fontWeight: 800, color: '#FFFFFF', fontFamily: 'serif', textAlign: 'center', lineHeight: 1.2, opacity: headerOpacity, transform: `translateY(${headerY}px)` }}>
        RedFlaq Their<br />Public Record
      </div>

      {/* Card */}
      <div style={{
        width: '100%', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: 24, padding: '32px 40px', opacity: cardOpacity, transform: `translateY(${cardY}px)`,
      }}>
        {items.map(({ icon, label, delay }) => {
          const itemOpacity = fadeIn(frame, delay, 15);
          const itemX = interpolate(frame, [delay, delay + 15], [-30, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 22, opacity: itemOpacity, transform: `translateX(${itemX}px)` }}>
              <span style={{ fontSize: 36 }}>{icon}</span>
              <span style={{ fontSize: 32, color: 'rgba(255,255,255,0.85)', fontFamily: 'sans-serif' }}>{label}</span>
              <span style={{ marginLeft: 'auto', color: '#10B981', fontSize: 28 }}>✓</span>
            </div>
          );
        })}
      </div>

      {/* Price */}
      <div style={{ opacity: fadeIn(frame, 70, 20), fontSize: 30, color: 'rgba(255,255,255,0.5)', fontFamily: 'sans-serif', textAlign: 'center' }}>
        Results in <span style={{ color: '#FFFFFF', fontWeight: 700 }}>60 seconds</span> · from <span style={{ color: '#7C3AED', fontWeight: 700 }}>R99</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5 — Safety Journal ────────────────────────────────────────────────

const JournalScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const headerOpacity = fadeIn(frame, 5, 20);
  const headerY = slideUp(frame, fps, 5);
  const pillars = [
    { icon: '🕐', text: 'Timestamped entries', delay: 25 },
    { icon: '🔒', text: 'SHA-256 encrypted', delay: 38 },
    { icon: '⚖️', text: 'Court-admissible evidence', delay: 51 },
    { icon: '📱', text: '100% free forever', delay: 64 },
  ];

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0D0D 0%, #001a0d 100%)',
      justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 28, padding: '0 60px',
    }}>
      <div style={{ fontSize: 22, color: '#10B981', letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', fontWeight: 700, opacity: headerOpacity, transform: `translateY(${headerY}px)` }}>
        Feature 02
      </div>

      <div style={{ fontSize: 54, fontWeight: 800, color: '#FFFFFF', fontFamily: 'serif', textAlign: 'center', lineHeight: 1.2, opacity: headerOpacity, transform: `translateY(${headerY}px)` }}>
        My Safety<br />Journal
      </div>

      <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.55)', fontFamily: 'sans-serif', textAlign: 'center', lineHeight: 1.5, opacity: fadeIn(frame, 20, 15) }}>
        Document everything<span style={{ color: '#10B981' }}> before </span>it escalates.
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {pillars.map(({ icon, text, delay }) => {
          const op = fadeIn(frame, delay, 15);
          const x = interpolate(frame, [delay, delay + 15], [-40, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          return (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: op, transform: `translateX(${x}px)`, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '20px 28px' }}>
              <span style={{ fontSize: 40 }}>{icon}</span>
              <span style={{ fontSize: 30, color: 'rgba(255,255,255,0.85)', fontFamily: 'sans-serif' }}>{text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6 — Free Tools ───────────────────────────────────────────────────

const FreeScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const headerOpacity = fadeIn(frame, 5, 20);
  const headerY = slideUp(frame, fps, 5);
  const tools = [
    '🛡️  Safety Journal',
    '📝  Affidavit Builder',
    '⚠️  Behavioral Signals',
    '🔔  Habit & Red Flags',
    '📞  WhatsApp Support',
  ];

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0D0D 0%, #1a0d00 100%)',
      justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24, padding: '0 60px',
    }}>
      <div style={{ fontSize: 52, fontWeight: 900, color: '#F59E0B', fontFamily: 'serif', textAlign: 'center', opacity: headerOpacity, transform: `translateY(${headerY}px)`, lineHeight: 1 }}>
        R0
      </div>
      <div style={{ fontSize: 34, fontWeight: 700, color: '#FFFFFF', fontFamily: 'sans-serif', textAlign: 'center', opacity: headerOpacity, transform: `translateY(${headerY}px)` }}>
        Free safety tools — forever.
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tools.map((tool, i) => {
          const delay = 25 + i * 12;
          const op = fadeIn(frame, delay, 12);
          const x = interpolate(frame, [delay, delay + 12], [-30, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          return (
            <div key={tool} style={{ fontSize: 30, color: 'rgba(255,255,255,0.85)', fontFamily: 'sans-serif', opacity: op, transform: `translateX(${x}px)`, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '18px 28px' }}>
              {tool}
            </div>
          );
        })}
      </div>

      <div style={{ opacity: fadeIn(frame, 90, 15), fontSize: 26, color: 'rgba(255,255,255,0.45)', fontFamily: 'sans-serif', textAlign: 'center' }}>
        Pay only when you check someone's record · from <span style={{ color: '#F59E0B' }}>R99</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 7 — Final CTA ────────────────────────────────────────────────────

const CTAScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const line1Opacity = fadeIn(frame, 5, 25);
  const line1Y = slideUp(frame, fps, 5);
  const line2Opacity = fadeIn(frame, 35, 25);
  const line2Scale = spring({ frame: frame - 35, fps, config: { damping: 12, stiffness: 160 }, from: 0.8, to: 1 });
  const urlOpacity = fadeIn(frame, 60, 20);
  const flagOpacity = fadeIn(frame, 10, 20);
  const flagScale = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 200 }, from: 0, to: 1 });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(160deg, #1a0a2e 0%, #0D0D0D 50%, #1a0000 100%)',
      justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 28,
    }}>
      {/* Dual glow */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', top: 0, left: 0 }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)', bottom: 0, right: 0 }} />

      <div style={{ fontSize: 100, transform: `scale(${flagScale})`, opacity: flagOpacity, lineHeight: 1 }}>🚩</div>

      <div style={{ fontSize: 40, fontWeight: 400, color: 'rgba(255,255,255,0.6)', fontFamily: 'sans-serif', textAlign: 'center', opacity: line1Opacity, transform: `translateY(${line1Y}px)`, letterSpacing: 1 }}>
        Before you trust...
      </div>

      <div style={{ fontSize: 72, fontWeight: 900, color: '#FFFFFF', fontFamily: 'serif', textAlign: 'center', lineHeight: 1.1, opacity: line2Opacity, transform: `scale(${line2Scale})` }}>
        <span style={{ color: '#DC2626' }}>Red</span>Flaq<br />
        <span style={{ fontSize: 56 }}>First.</span>
      </div>

      <div style={{
        opacity: urlOpacity, background: 'rgba(124,58,237,0.2)', border: '1.5px solid rgba(124,58,237,0.5)',
        borderRadius: 999, padding: '16px 48px', fontSize: 32, color: '#A78BFA', fontFamily: 'sans-serif', letterSpacing: 2,
      }}>
        redflaq.com
      </div>

      <div style={{ opacity: urlOpacity, fontSize: 24, color: 'rgba(255,255,255,0.35)', fontFamily: 'sans-serif', textAlign: 'center', padding: '0 80px', lineHeight: 1.5 }}>
        Clarity creates safety.
      </div>
    </AbsoluteFill>
  );
};

// ─── Main composition ───────────────────────────────────────────────────────

const SCENE_DURATION = 90; // 3s per scene at 30fps

export const RedFlaqPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={SCENE_DURATION}>
        <StatScene frame={frame} fps={fps} />
      </Sequence>
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <ProblemScene frame={frame - SCENE_DURATION} fps={fps} />
      </Sequence>
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <BrandScene frame={frame - SCENE_DURATION * 2} fps={fps} />
      </Sequence>
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <CheckScene frame={frame - SCENE_DURATION * 3} fps={fps} />
      </Sequence>
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <JournalScene frame={frame - SCENE_DURATION * 4} fps={fps} />
      </Sequence>
      <Sequence from={SCENE_DURATION * 5} durationInFrames={SCENE_DURATION}>
        <FreeScene frame={frame - SCENE_DURATION * 5} fps={fps} />
      </Sequence>
      <Sequence from={SCENE_DURATION * 6} durationInFrames={SCENE_DURATION}>
        <CTAScene frame={frame - SCENE_DURATION * 6} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

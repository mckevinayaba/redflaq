import { useEffect, useState } from "react";
import { getStreakInfo } from "@/hooks/useSignalStreak";
import { Flame, BookOpen, Eye } from "lucide-react";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const SignalStreakBar = () => {
  const [info, setInfo] = useState({ streak: 0, totalReads: 0, uniqueSignals: 0, hasReadToday: false });

  useEffect(() => {
    setInfo(getStreakInfo());
  }, []);

  // Don't show until the user has read at least 1 signal
  if (info.totalReads === 0) return null;

  return (
    <div style={{
      background: 'rgba(108,53,222,0.08)',
      border: '1px solid rgba(108,53,222,0.2)',
      borderRadius: 8,
      padding: '14px 20px',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {/* Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Flame size={16} color={info.streak >= 3 ? '#F59E0B' : '#6C35DE'} />
          <span style={{ ...mono, fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
            {info.streak} DAY{info.streak !== 1 ? 'S' : ''}
          </span>
          <span style={{ ...inter, fontSize: 11, color: '#8b8b91' }}>streak</span>
        </div>

        {/* Signals read */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <BookOpen size={14} color="#6C35DE" />
          <span style={{ ...mono, fontSize: 11, fontWeight: 700, color: '#fff' }}>
            {info.uniqueSignals}
          </span>
          <span style={{ ...inter, fontSize: 11, color: '#8b8b91' }}>signals read</span>
        </div>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          display: 'inline-block',
          width: 6, height: 6,
          borderRadius: '50%',
          background: info.hasReadToday ? '#10B981' : '#F59E0B',
        }} />
        <span style={{ ...inter, fontSize: 11, fontWeight: 600, color: info.hasReadToday ? '#10B981' : '#F59E0B' }}>
          {info.hasReadToday ? "Today's signal read" : "Read today's signal"}
        </span>
      </div>
    </div>
  );
};

export default SignalStreakBar;

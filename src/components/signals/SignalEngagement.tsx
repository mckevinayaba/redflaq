import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

interface SignalEngagementProps {
  signalId: string;
  signalSlug: string;
  signalTitle: string;
}

const SignalEngagement = ({ signalId, signalSlug, signalTitle }: SignalEngagementProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const { count } = await supabase
        .from("signal_likes")
        .select("*", { count: "exact", head: true })
        .eq("signal_id", signalId);
      setLikeCount(count || 0);

      if (user) {
        const { data: likeData } = await supabase
          .from("signal_likes")
          .select("id")
          .eq("signal_id", signalId)
          .eq("user_id", user.id)
          .maybeSingle();
        setLiked(!!likeData);

        const { data: saveData } = await supabase
          .from("signal_saves")
          .select("id")
          .eq("signal_id", signalId)
          .eq("user_id", user.id)
          .maybeSingle();
        setSaved(!!saveData);
      }
    };
    fetchCounts();
  }, [signalId, user]);

  const handleLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from("signal_likes").delete().eq("signal_id", signalId).eq("user_id", user.id);
      setLiked(false);
      setLikeCount(c => Math.max(0, c - 1));
    } else {
      await supabase.from("signal_likes").insert({ signal_id: signalId, user_id: user.id });
      setLiked(true);
      setLikeCount(c => c + 1);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (saved) {
      await supabase.from("signal_saves").delete().eq("signal_id", signalId).eq("user_id", user.id);
      setSaved(false);
    } else {
      await supabase.from("signal_saves").insert({ signal_id: signalId, user_id: user.id });
      setSaved(true);
    }
  };

  const shareUrl = `${window.location.origin}/signals/${signalSlug}`;
  const shareText = `"${signalTitle}" — Before you trust, RedFlaq first.`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: signalTitle, text: shareText, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const btnBase: React.CSSProperties = {
    ...inter, fontSize: 13, fontWeight: 600,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 6,
    transition: 'border-color 0.2s, color 0.2s',
    textDecoration: 'none',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
      {/* Like */}
      <button
        onClick={handleLike}
        style={{
          ...btnBase,
          color: liked ? '#6C35DE' : '#8b8b91',
          background: liked ? 'rgba(108,53,222,0.12)' : 'rgba(255,255,255,0.04)',
          border: liked ? '1px solid rgba(108,53,222,0.3)' : '1px solid rgba(255,255,255,0.08)',
        }}
        title={user ? (liked ? 'Unlike' : 'Like this signal') : 'Sign in to like'}
      >
        <span>{liked ? '♥' : '♡'}</span>
        <span>{likeCount > 0 ? likeCount : ''}</span>
      </button>

      {/* Save */}
      <button
        onClick={handleSave}
        style={{
          ...btnBase,
          color: saved ? '#6C35DE' : '#8b8b91',
          background: saved ? 'rgba(108,53,222,0.12)' : 'rgba(255,255,255,0.04)',
          border: saved ? '1px solid rgba(108,53,222,0.3)' : '1px solid rgba(255,255,255,0.08)',
        }}
        title={user ? (saved ? 'Unsave' : 'Save for later') : 'Sign in to save'}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span style={{ fontSize: 12 }}>{saved ? 'Saved' : 'Save'}</span>
      </button>

      {/* Share — WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...btnBase,
          color: '#25D366',
          background: 'rgba(37,211,102,0.06)',
          border: '1px solid rgba(37,211,102,0.15)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Share
      </a>

      {/* Share — Twitter/X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...btnBase, color: '#8b8b91' }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Post
      </a>

      {/* Copy link */}
      <button
        onClick={handleShare}
        style={{ ...btnBase, color: '#8b8b91' }}
        title="Copy link"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>
    </div>
  );
};

export default SignalEngagement;

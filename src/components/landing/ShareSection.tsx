import { useState } from "react";
import { Copy, Check, MessageCircle, Mail, Heart } from "lucide-react";

const SHARE_URL = "https://www.redflaq.com/";
const INVITE_TEXT =
  "I'm using RedFlaq to check public records before I trust someone with my life, home or business. It was built with South African women facing GBV in mind. You can try it here:";

const ShareSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${INVITE_TEXT} ${SHARE_URL}`)}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Check out RedFlaq — public-record safety checks");
    const body = encodeURIComponent(`${INVITE_TEXT} ${SHARE_URL}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <section style={{ background: '#F7F4F0', padding: '60px 20px', borderTop: '1.5px solid #EDE9FE' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <Heart className="h-8 w-8 mx-auto mb-4" style={{ color: '#7C3AED' }} />
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', marginBottom: 12 }}>
          Share RedFlaq
        </h3>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#4B4453', lineHeight: 1.7, marginBottom: 28 }}>
          Share RedFlaq to raise awareness and help another woman check for serious public‑record warning signs before trusting someone with her life, home or business.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-body text-sm font-semibold transition-colors"
            style={{ border: '2px solid #7C3AED', background: 'transparent', color: '#7C3AED', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}
          >
            {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy link</>}
          </button>
          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-body text-sm font-semibold transition-colors"
            style={{ background: '#25D366', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}
          >
            <MessageCircle className="h-4 w-4" /> Share via WhatsApp
          </button>
          <button
            onClick={handleEmail}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-body text-sm font-semibold transition-colors"
            style={{ border: '2px solid #D6D3CD', background: 'transparent', color: '#4B4453', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}
          >
            <Mail className="h-4 w-4" /> Share via email
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShareSection;

import { useState } from "react";
import { Copy, Check, MessageCircle, Mail, Heart } from "lucide-react";

const SHARE_URL = "https://www.redflaq.com/";
const INVITE_TEXT = "I'm using RedFlaq to check public records before I trust someone with my life, home or business. It was built with South African women facing GBV in mind. You can try it here:";

const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => { await navigator.clipboard.writeText(SHARE_URL); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleWhatsApp = () => { window.open(`https://wa.me/?text=${encodeURIComponent(`${INVITE_TEXT} ${SHARE_URL}`)}`, "_blank"); };
  const handleEmail = () => { window.open(`mailto:?subject=${encodeURIComponent("Check out RedFlaq — public-record safety checks")}&body=${encodeURIComponent(`${INVITE_TEXT} ${SHARE_URL}`)}`, "_blank"); };

  return (
    <section className="py-12 md:py-20 px-5" style={{ background: '#F5F0EB' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <Heart className="h-8 w-8 mx-auto mb-4" style={{ color: '#6B4EFF' }} />
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#1A1523', marginBottom: 12 }}>Share RedFlaq</h3>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#6B7280', lineHeight: 1.7, marginBottom: 28 }}>
          Share RedFlaq to raise awareness and help another woman check for serious public‑record warning signs before trusting someone with her life, home or business.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleCopy} className="inline-flex items-center justify-center gap-2" style={{ border: '2px solid #6B4EFF', background: 'transparent', color: '#6B4EFF', padding: '12px 24px', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, borderRadius: 50, transition: 'all 0.2s' }}>
            {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Link</>}
          </button>
          <button onClick={handleWhatsApp} className="inline-flex items-center justify-center gap-2" style={{ background: '#25D366', color: '#fff', border: 'none', padding: '12px 24px', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, borderRadius: 50, transition: 'all 0.2s' }}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
          <button onClick={handleEmail} className="inline-flex items-center justify-center gap-2" style={{ border: '2px solid #E6E0DA', background: 'transparent', color: '#555555', padding: '12px 24px', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, borderRadius: 50, transition: 'all 0.2s' }}>
            <Mail className="h-4 w-4" /> Email
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShareSection;

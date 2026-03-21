import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Copy, Check, MessageCircle, Mail, X, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ShareInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INVITE_TEXT =
  "I'm using RedFlaq to check public records before I trust someone with my life, home or business. It was built with South African women facing GBV in mind. You can try it here:";

export default function ShareInviteModal({ open, onOpenChange }: ShareInviteModalProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralUrl = user?.id
    ? `https://www.redflaq.com/?ref=${user.id}`
    : "https://www.redflaq.com/";

  const fullMessage = `${INVITE_TEXT} ${referralUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(fullMessage)}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Check out RedFlaq — public-record safety checks");
    const body = encodeURIComponent(fullMessage);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Invite others to use RedFlaq
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground leading-relaxed">
            Share RedFlaq to raise awareness and help another woman check for serious public‑record warning signs before trusting someone with her life, home or business.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Read-only referral URL */}
          <div className="flex gap-2">
            <input
              readOnly
              value={referralUrl}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted font-mono text-xs text-foreground truncate"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-body text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy link</>}
            </button>
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-body text-sm font-semibold transition-colors"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="h-4 w-4" />
              Share via WhatsApp
            </button>
            <button
              onClick={handleEmail}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg font-body text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Mail className="h-4 w-4" />
              Share via email
            </button>
          </div>

          <p className="font-body text-xs text-muted-foreground text-center leading-relaxed">
            Your link is unique to you. When someone signs up via your link, we'll know you helped spread the word.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

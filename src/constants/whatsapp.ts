// ═══════════════════════════════════════════════════════════
// WhatsApp Configuration — Update the number here once ready
// ═══════════════════════════════════════════════════════════

// WhatsApp API bot number removed — re-enable when API is ready
// export const WHATSAPP_NUMBER = "27663365296";
// export const WHATSAPP_CHAT_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const EMOTIONAL_SHARE_MESSAGE = `She loved him.

She trusted him.

His name was on a public warning list.

Nobody told her to check.

We buried her last month.

RedFlaq checks public safety records before you trust someone with your life, your home, or your children.

Before you trust — RedFlaq first.

60 seconds. R99: https://redflaq.com

Forward this to every woman you love.`;

export const WHATSAPP_MESSAGES = {
  shareAfterCheck: EMOTIONAL_SHARE_MESSAGE,

  emotionalShare: EMOTIONAL_SHARE_MESSAGE,

  journalShare:
    "I need to share something important with you privately. Please check this: I've stored it securely in my RedFlaq Safety Journal at redflaq.com",

  chatbotStart:
    "Hi, I want to run a safety check on RedFlaq",

  groupShare: EMOTIONAL_SHARE_MESSAGE,
};

export const getWhatsAppShareUrl = (message: string) =>
  `https://wa.me/?text=${encodeURIComponent(message)}`;

export const getWhatsAppChatUrl = (prefilledMessage?: string) =>
  prefilledMessage
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(prefilledMessage)}`
    : WHATSAPP_CHAT_URL;

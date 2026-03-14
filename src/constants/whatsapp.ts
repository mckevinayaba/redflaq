// ═══════════════════════════════════════════════════════════
// WhatsApp Configuration — Update the number here once ready
// ═══════════════════════════════════════════════════════════

export const WHATSAPP_NUMBER = "27663365296";

export const WHATSAPP_CHAT_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const WHATSAPP_MESSAGES = {
  shareAfterCheck:
    "I just used RedFlaq to check someone's public safety record before trusting them. Before you trust, RedFlaq first. Check anyone in under 60 seconds: https://redflaq.com",

  journalShare:
    "I need to share something important with you privately. Please check this: I've stored it securely in my RedFlaq Safety Journal at redflaq.com",

  chatbotStart:
    "Hi, I want to run a safety check",

  groupShare:
    "Save this number to check anyone's public safety record before trusting them — takes 60 seconds. Before you trust, RedFlaq first. Learn more: https://redflaq.com/whatsapp",
};

export const getWhatsAppShareUrl = (message: string) =>
  `https://wa.me/?text=${encodeURIComponent(message)}`;

export const getWhatsAppChatUrl = (prefilledMessage?: string) =>
  prefilledMessage
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(prefilledMessage)}`
    : WHATSAPP_CHAT_URL;

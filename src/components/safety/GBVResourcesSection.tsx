import { useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const provinces = [
  "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape",
  "Limpopo", "Mpumalanga", "Free State", "North West", "Northern Cape",
];

const nationalResources = [
  { name: "GBV Command Centre", phone: "0800 428 428", hours: "24/7, Free", category: "crisis" },
  { name: "Stop Gender Violence", phone: "0800 150 150", hours: "24/7, Free", category: "crisis" },
  { name: "TEARS Foundation", phone: "08000 83277", hours: "24/7, Free · USSD *134*7355#", category: "support" },
  { name: "Lifeline SA Crisis Line", phone: "0861 322 322", hours: "24/7", category: "counselling" },
  { name: "SAPS Emergency", phone: "10111", hours: "24/7", category: "crisis" },
  { name: "SADAG Mental Health", phone: "011 234 4837", hours: "8am–8pm", category: "counselling" },
  { name: "Childline SA", phone: "116", hours: "24/7, Free", category: "support" },
  { name: "Human Trafficking Hotline", phone: "0800 222 777", hours: "24/7, Free", category: "support" },
];

interface ProvResource {
  name: string;
  phone: string;
  whatsapp?: string;
  hours?: string;
  category: "crisis" | "tcc" | "counselling" | "legal" | "support";
}

const provincialResources: Record<string, ProvResource[]> = {
  Gauteng: [
    { name: "POWA Head Office (JHB)", phone: "011 642 4345", category: "legal" },
    { name: "POWA Katlehong", phone: "011 860 2858", category: "legal" },
    { name: "POWA Tembisa", phone: "065 868 3309", category: "legal" },
    { name: "POWA Soweto", phone: "081 383 7698", category: "legal" },
    { name: "Gender Links", phone: "011 622 2877", category: "support" },
    { name: "FAMSA East Rand", phone: "011 892 4272", category: "counselling" },
    { name: "FAMSA West Rand", phone: "011 766 3283", category: "counselling" },
    { name: "FAMSA Vaal Triangle", phone: "016 933 3128", category: "counselling" },
    { name: "Lifeline Pretoria", phone: "012 804 3619", category: "counselling" },
    { name: "ADAPT Counselling", phone: "011 786 6608", category: "counselling" },
    { name: "Mamelodi TCC (Mamelodi Hospital)", phone: "012 801 2717", hours: "24/7", category: "tcc" },
    { name: "Natalspruit TCC", phone: "011 898 8000", hours: "24/7", category: "tcc" },
    { name: "Laudium TCC", phone: "012 374 3710", hours: "24/7", category: "tcc" },
    { name: "Sebokeng TCC", phone: "016 930 3400", hours: "24/7", category: "tcc" },
  ],
  "Western Cape": [
    { name: "Rape Crisis CT (English 24/7)", phone: "021 447 9762", hours: "24/7", category: "crisis" },
    { name: "Rape Crisis CT (isiXhosa)", phone: "021 361 9085", category: "crisis" },
    { name: "Rape Crisis CT (Afrikaans)", phone: "021 633 9229", category: "crisis" },
    { name: "Rape Crisis WhatsApp", phone: "083 222 5164", whatsapp: "27832225164", category: "crisis" },
    { name: "MOSAIC Training & Healing", phone: "021 761 7585", category: "counselling" },
    { name: "Saartjie Baartman Centre", phone: "021 633 5287", category: "support" },
    { name: "Justice Desk Africa", phone: "060 627 1963", category: "legal" },
    { name: "FAMSA Cape Town", phone: "021 447 7951", category: "counselling" },
    { name: "FAMSA Worcester", phone: "023 347 5231", category: "counselling" },
    { name: "FAMSA George", phone: "044 874 5811", category: "counselling" },
    { name: "Sonke Gender Justice CT", phone: "021 423 7088", category: "support" },
    { name: "Khayelitsha TCC", phone: "021 361 9228", hours: "24/7", category: "tcc" },
    { name: "Mannenberg TCC (GF Jooste Hospital)", phone: "021 691 6194", hours: "24/7", category: "tcc" },
  ],
  "KwaZulu-Natal": [
    { name: "FAMSA KZN Durban", phone: "031 303 1744", category: "counselling" },
    { name: "Sonke Gender Justice KZN", phone: "031 305 2105", category: "support" },
    { name: "KZN Network on Violence Against Women", phone: "kznnetwork.co.za", category: "support" },
    { name: "Umlazi TCC (Prince Mshiyeni Hospital)", phone: "031 907 8496", hours: "24/7", category: "tcc" },
    { name: "Phoenix TCC (Mahatma Gandhi Hospital)", phone: "031 502 2338", hours: "24/7", category: "tcc" },
    { name: "Stanger TCC", phone: "032 437 6000", hours: "24/7", category: "tcc" },
    { name: "Edendale TCC (Pietermaritzburg)", phone: "033 395 4325", hours: "24/7", category: "tcc" },
  ],
  "Eastern Cape": [
    { name: "FAMSA East London", phone: "043 743 8277", category: "counselling" },
    { name: "FAMSA Port Elizabeth", phone: "041 585 9393", category: "counselling" },
    { name: "FAMSA Grahamstown", phone: "046 622 2580", category: "counselling" },
    { name: "Mdantsane TCC (Cecilia Makiwane Hospital)", phone: "043 761 2023", hours: "24/7", category: "tcc" },
    { name: "Dora Nginza TCC (Port Elizabeth)", phone: "041 406 4112", hours: "24/7", category: "tcc" },
    { name: "Libode TCC (St Barnabas Hospital)", phone: "047 568 6274", hours: "24/7", category: "tcc" },
    { name: "Grey Hospital TCC (King William's Town)", phone: "043 643 3300", hours: "24/7", category: "tcc" },
    { name: "Lusikisiki TCC (St Elizabeth Hospital)", phone: "039 253 5000", hours: "24/7", category: "tcc" },
  ],
  Limpopo: [
    { name: "FAMSA Tzaneen", phone: "015 307 4833", category: "counselling" },
    { name: "FAMSA Vhembe", phone: "015 962 3728", category: "counselling" },
    { name: "Sonke Gender Justice Polokwane", phone: "015 291 3070", category: "support" },
    { name: "Musina TCC", phone: "015 534 0446", hours: "24/7", category: "tcc" },
    { name: "Nkhensani TCC (Giyani)", phone: "015 812 0227", hours: "24/7", category: "tcc" },
    { name: "Mokopane TCC", phone: "015 483 4000", hours: "24/7", category: "tcc" },
    { name: "Groblersdal TCC", phone: "013 262 3024", hours: "24/7", category: "tcc" },
    { name: "Tshilidzini TCC", phone: "015 964 3257", hours: "24/7", category: "tcc" },
  ],
  Mpumalanga: [
    { name: "FAMSA Secunda", phone: "017 631 1593", category: "counselling" },
    { name: "Sonke Gender Justice Nelspruit", phone: "013 755 2428", category: "support" },
    { name: "Themba TCC (Kabokweni)", phone: "013 796 9623", hours: "24/7", category: "tcc" },
    { name: "Tonga TCC (Nkomazi)", phone: "013 780 9231", hours: "24/7", category: "tcc" },
    { name: "Ermelo TCC", phone: "017 811 2031", hours: "24/7", category: "tcc" },
    { name: "Witbank TCC", phone: "013 653 2208", hours: "24/7", category: "tcc" },
  ],
  "Free State": [
    { name: "FAMSA Bloemfontein", phone: "051 525 2395", category: "counselling" },
    { name: "FAMSA Welkom", phone: "057 352 5191", category: "counselling" },
    { name: "Pelonomi TCC (Bloemfontein)", phone: "051 405 1911", hours: "24/7", category: "tcc" },
    { name: "Tshepong TCC (Bloemfontein)", phone: "051 448 6023", hours: "24/7", category: "tcc" },
  ],
  "North West": [
    { name: "FAMSA North West", phone: "018 384 5136", category: "counselling" },
    { name: "Grace Help Centre (Mooinooi)", phone: "014 574 3476", category: "support" },
    { name: "Job Shimankana Tabane TCC (Rustenburg)", phone: "014 590 1000", hours: "24/7", category: "tcc" },
    { name: "Mafikeng TCC", phone: "018 389 1111", hours: "24/7", category: "tcc" },
  ],
  "Northern Cape": [
    { name: "FAMSA Kimberley", phone: "053 872 2644", category: "counselling" },
    { name: "FAMSA Upington", phone: "054 332 3955", category: "counselling" },
    { name: "Galeshewe TCC (Kimberley Hospital)", phone: "053 830 8900", hours: "24/7", category: "tcc" },
    { name: "De Aar TCC (Central Karoo Hospital)", phone: "053 631 2123", hours: "24/7", category: "tcc" },
    { name: "Kuruman TCC", phone: "073 334 3208", hours: "24/7", category: "tcc" },
    { name: "Springbok TCC (Van Niekerk Hospital)", phone: "027 712 1551", hours: "24/7", category: "tcc" },
  ],
};

const nationalBadgeConfig: Record<string, { label: string; bg: string; text: string }> = {
  crisis: { label: "Emergency", bg: "rgba(239,68,68,0.15)", text: "#FCA5A5" },
  counselling: { label: "Counselling", bg: "rgba(167,139,250,0.15)", text: "#C4B5FD" },
  support: { label: "Support", bg: "rgba(45,212,191,0.15)", text: "#5EEAD4" },
};

const categoryLeftBorder: Record<string, string> = {
  crisis: "#EF4444",
  tcc: "#EF4444",
  counselling: "#7C3AED",
  legal: "#14B8A6",
  support: "#6B7280",
};

const categoryBadgeConfig: Record<string, { label: string; bg: string; text: string }> = {
  crisis: { label: "Crisis Line", bg: "rgba(239,68,68,0.1)", text: "#DC2626" },
  tcc: { label: "TCC", bg: "rgba(239,68,68,0.1)", text: "#DC2626" },
  counselling: { label: "Counselling", bg: "rgba(124,58,237,0.1)", text: "#7C3AED" },
  legal: { label: "Legal", bg: "rgba(20,184,166,0.1)", text: "#14B8A6" },
  support: { label: "Support", bg: "rgba(107,114,128,0.1)", text: "#6B7280" },
};

function ResourceCard({ r }: { r: ProvResource }) {
  const badge = categoryBadgeConfig[r.category];
  const borderColor = categoryLeftBorder[r.category];

  return (
    <div
      className="bg-white rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-default group"
      style={{
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(124,58,237,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <h4 className="font-heading text-[15px] font-bold leading-snug" style={{ color: "#1F1F2E" }}>
          {r.name}
        </h4>
        <span
          className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: badge.bg, color: badge.text }}
        >
          {badge.label}
        </span>
      </div>

      {r.hours && (
        <p className="text-xs mb-2" style={{ color: "#6B7280" }}>{r.hours}</p>
      )}

      <div className="flex items-center gap-3 mt-1">
        {/\d/.test(r.phone) ? (
          <a
            href={`tel:${r.phone.replace(/\s/g, "")}`}
            aria-label={`Call ${r.name}`}
            className="inline-flex items-center gap-1.5 font-heading text-lg font-bold transition-colors min-h-[44px] hover:opacity-80"
            style={{ color: "#7C3AED" }}
          >
            <Phone className="w-4 h-4 shrink-0" />
            {r.phone}
          </a>
        ) : (
          <a
            href={`https://${r.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${r.name}`}
            className="inline-flex items-center gap-1.5 font-heading text-lg font-bold transition-colors min-h-[44px] underline hover:opacity-80"
            style={{ color: "#7C3AED" }}
          >
            {r.phone}
          </a>
        )}
        {r.whatsapp && (
          <a
            href={`https://wa.me/${r.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${r.name}`}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white min-h-[44px] transition-colors hover:opacity-90"
            style={{ background: "#25D366" }}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

const GBVResourcesSection = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const provincialList = selectedProvince ? provincialResources[selectedProvince] ?? [] : [];

  return (
    <section
      id="get-help"
      className="scroll-mt-24 py-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      style={{ background: "linear-gradient(180deg, #F5F3FF 0%, #FFFFFF 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <p
          className="text-xs font-semibold uppercase tracking-[0.15em] mb-3"
          style={{ color: "#7C3AED" }}
        >
          Support Services
        </p>
        <h2
          className="font-heading text-3xl sm:text-4xl font-bold mb-2"
          style={{ color: "#1F1F2E" }}
        >
          Find Help Near You
        </h2>
        <p className="text-base mb-10 max-w-xl" style={{ color: "#6B7280", lineHeight: 1.6 }}>
          Select your province. National helplines are always available.
        </p>

        {/* Province chips — horizontal scroll on mobile */}
        <div className="mb-10 overflow-x-auto scrollbar-hide pb-2 -mx-1">
          <div className="flex gap-2.5 px-1 min-w-max">
            {provinces.map((p) => {
              const isActive = selectedProvince === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedProvince(isActive ? null : p)}
                  aria-pressed={isActive}
                  className="rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    padding: "10px 20px",
                    background: isActive ? "#7C3AED" : "#FFFFFF",
                    color: isActive ? "#FFFFFF" : "#7C3AED",
                    border: isActive ? "1.5px solid #7C3AED" : "1.5px solid #7C3AED",
                    boxShadow: isActive ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
                    fontWeight: isActive ? 600 : 500,
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* National resources — dark immersive band */}
        <div
          className="rounded-2xl p-8 sm:p-10 mb-12"
          style={{ background: "#1A0533" }}
        >
          <h3 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
            🆘 National Helplines — Available Everywhere, Always
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {nationalResources.map((r) => {
              const badge = nationalBadgeConfig[r.category];
              return (
                <div
                  key={r.name}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 rounded-xl px-5 py-4"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white">{r.name}</p>
                      <span
                        className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ background: badge.bg, color: badge.text }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>{r.hours}</p>
                  </div>
                  <a
                    href={`tel:${r.phone.replace(/\s/g, "")}`}
                    aria-label={`Call ${r.name}`}
                    className="inline-flex items-center gap-1.5 font-heading text-base font-bold whitespace-nowrap min-h-[44px] transition-opacity hover:opacity-80 shrink-0"
                    style={{ color: "#C4B5FD" }}
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    {r.phone}
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Provincial resources */}
        {selectedProvince && (
          <div
            className="animate-fade-in"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            <h3
              className="font-heading text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: "#1F1F2E" }}
            >
              📍 Resources in {selectedProvince}
            </h3>
            {provincialList.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Limited local resources listed for this province. Please contact the{" "}
                  <a href="tel:0800428428" className="font-bold" style={{ color: "#7C3AED" }}>
                    GBV Command Centre (0800 428 428)
                  </a>{" "}
                  for 24/7 national support.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {provincialList.map((r) => (
                  <ResourceCard key={r.name} r={r} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Protection orders */}
        <div
          id="protection-orders"
          className="mt-14 rounded-2xl p-8 scroll-mt-24"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            borderLeft: "4px solid #7C3AED",
          }}
        >
          <h3 className="font-heading text-lg font-bold mb-3" style={{ color: "#1F1F2E" }}>
            ⚖️ Protection Orders
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280" }}>
            You have the legal right to apply for a protection order at any Magistrate's Court in South Africa at no cost. You do not need a lawyer.
          </p>
          <ul className="text-sm space-y-2 list-disc pl-5" style={{ color: "#6B7280" }}>
            <li>Available under the Domestic Violence Act (Act 116 of 1998)</li>
            <li>Can be obtained on the same day in urgent cases</li>
            <li>Covers physical, emotional, verbal, economic, and sexual abuse</li>
            <li>Violation of a protection order is a criminal offence</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default GBVResourcesSection;

import { useState } from "react";
import { Phone, MessageCircle } from "lucide-react";

const provinces = [
  "All Provinces",
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

const nationalResources = [
  {
    name: "GBV Command Centre",
    phone: "0800 428 428",
    description: "National GBV hotline — counselling & support",
    hours: "24/7 · Free · Confidential",
    icon: "📞",
  },
  {
    name: "SAPS Emergency",
    phone: "10111",
    description: "South African Police Service — immediate danger",
    hours: "24/7",
    icon: "🚨",
  },
  {
    name: "Lifeline South Africa",
    phone: "0861 322 322",
    description: "Crisis counselling and emotional support",
    hours: "24/7",
    icon: "💚",
  },
  {
    name: "TEARS Foundation",
    phone: "085 60 10 111",
    description: "SMS 'Help' — GBV survivor support",
    hours: "24/7 SMS line",
    icon: "💜",
  },
];

interface ProvincialResource {
  name: string;
  phone: string;
  whatsapp?: string;
  description: string;
  hours: string;
  provinces: string[];
}

const provincialResources: ProvincialResource[] = [
  {
    name: "People Opposing Women Abuse (POWA)",
    phone: "011 642 4345",
    whatsapp: "+27116424345",
    description: "Legal advice and shelter referrals",
    hours: "Mon–Fri 8am–4pm",
    provinces: ["Gauteng"],
  },
  {
    name: "MOSAIC Training",
    phone: "021 761 7585",
    description: "Trauma counselling and legal advocacy",
    hours: "Mon–Fri 8am–5pm",
    provinces: ["Western Cape"],
  },
  {
    name: "1000 Women Trust",
    phone: "087 373 1585",
    whatsapp: "0873731585",
    description: "First Responder network and community support",
    hours: "WhatsApp chatbot 24/7",
    provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape"],
  },
  {
    name: "Thuthuzela Care Centre",
    phone: "0800 428 428",
    description: "24/7 medical care & forensic evidence collection at hospitals",
    hours: "24/7 at participating hospitals",
    provinces: provinces.slice(1), // all provinces
  },
  {
    name: "FAMSA",
    phone: "011 975 7106",
    description: "Family counselling and mediation services",
    hours: "Mon–Fri 8am–5pm",
    provinces: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State"],
  },
];

const GBVResourcesSection = () => {
  const [selectedProvince, setSelectedProvince] = useState("All Provinces");

  const filtered =
    selectedProvince === "All Provinces"
      ? provincialResources
      : provincialResources.filter((r) => r.provinces.includes(selectedProvince));

  return (
    <section id="get-help" className="mb-16 scroll-mt-24">
      <p className="font-mono text-[11px] tracking-[0.15em] text-destructive uppercase mb-2 font-semibold">
        IF YOU NEED HELP RIGHT NOW
      </p>
      <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">
        You are not alone. Help is available right now.
      </h2>
      <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[650px] mb-8">
        All of these services are free, confidential, and staffed by trained professionals. You do not need to explain everything — you just need to reach out.
      </p>

      {/* National hotlines */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {nationalResources.map((r) => (
          <div key={r.name} className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-start gap-4">
            <span className="text-2xl flex-shrink-0">{r.icon}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-heading text-base text-foreground font-bold">{r.name}</h4>
              <p className="font-body text-sm text-muted-foreground mb-2">{r.description}</p>
              <a
                href={`tel:${r.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 font-heading text-lg font-bold text-primary hover:text-primary/80 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {r.phone}
              </a>
              <p className="font-body text-xs text-muted-foreground mt-1">{r.hours}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Province selector */}
      <div className="mb-6">
        <label className="font-heading text-sm font-bold text-foreground block mb-2">
          Find help in your province
        </label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-full sm:w-64 rounded-lg border border-border bg-card text-foreground px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {provinces.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Provincial resources */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="font-body text-sm text-muted-foreground">
            Limited local resources in this province. Please contact the{" "}
            <a href="tel:0800428428" className="text-primary font-bold">GBV Command Centre (0800 428 428)</a> for 24/7 national support.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div key={r.name} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
              <h4 className="font-heading text-sm font-bold text-foreground mb-1">{r.name}</h4>
              <p className="font-body text-xs text-muted-foreground mb-3 flex-1">{r.description}</p>
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${r.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {r.phone}
                </a>
                {r.whatsapp && (
                  <a
                    href={`https://wa.me/${r.whatsapp.replace(/[^0-9+]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-600 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                )}
              </div>
              <p className="font-body text-xs text-muted-foreground mt-2">{r.hours}</p>
            </div>
          ))}
        </div>
      )}

      {/* Protection orders section */}
      <div id="protection-orders" className="mt-10 bg-card border border-border rounded-xl p-6 shadow-sm scroll-mt-24">
        <h3 className="font-heading text-lg font-bold text-foreground mb-2">⚖️ Protection Orders</h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
          You have the legal right to apply for a protection order at any Magistrate's Court in South Africa at no cost. You do not need a lawyer.
        </p>
        <ul className="font-body text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
          <li>Available under the Domestic Violence Act (Act 116 of 1998)</li>
          <li>Can be obtained on the same day in urgent cases</li>
          <li>Covers physical, emotional, verbal, economic, and sexual abuse</li>
          <li>Violation of a protection order is a criminal offence</li>
        </ul>
      </div>
    </section>
  );
};

export default GBVResourcesSection;

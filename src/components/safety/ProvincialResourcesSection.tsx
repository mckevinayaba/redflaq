import { useState } from "react";

const provinces = [
  {
    name: "Gauteng",
    resources: [
      { name: "SAPS Emergency", phone: "10111", hours: "24/7" },
      { name: "People Opposing Women Abuse (POWA)", phone: "011 642 4345", hours: "Mon–Fri 8am–4pm" },
      { name: "Lifeline Gauteng", phone: "011 728 1347", hours: "24/7" },
      { name: "Teddy Bear Clinic", phone: "011 484 4554", hours: "Mon–Fri 8am–4pm" },
    ],
  },
  {
    name: "Western Cape",
    resources: [
      { name: "SAPS Emergency", phone: "10111", hours: "24/7" },
      { name: "MOSAIC Training", phone: "021 761 7585", hours: "Mon–Fri 8am–5pm" },
      { name: "Rape Crisis Cape Town Trust", phone: "021 447 9762", hours: "24/7" },
      { name: "Saartjie Baartman Centre", phone: "021 633 5287", hours: "24/7" },
    ],
  },
  {
    name: "KwaZulu-Natal",
    resources: [
      { name: "SAPS Emergency", phone: "10111", hours: "24/7" },
      { name: "KZN Network on Violence Against Women", phone: "031 303 9688", hours: "Mon–Fri 8am–4pm" },
      { name: "Lifeline Durban", phone: "031 312 2323", hours: "24/7" },
      { name: "ChildLine KZN", phone: "031 312 0904", hours: "Mon–Fri 8am–5pm" },
    ],
  },
  {
    name: "Eastern Cape",
    resources: [
      { name: "SAPS Emergency", phone: "10111", hours: "24/7" },
      { name: "Masimanyane Women's Support Centre", phone: "043 743 9169", hours: "Mon–Fri 8am–4pm" },
      { name: "Lifeline PE", phone: "041 373 4444", hours: "24/7" },
    ],
  },
  {
    name: "Free State",
    resources: [
      { name: "SAPS Emergency", phone: "10111", hours: "24/7" },
      { name: "GBV Command Centre", phone: "0800 428 428", hours: "24/7" },
      { name: "Lifeline Bloemfontein", phone: "051 444 5000", hours: "24/7" },
    ],
  },
  {
    name: "Limpopo",
    resources: [
      { name: "SAPS Emergency", phone: "10111", hours: "24/7" },
      { name: "GBV Command Centre", phone: "0800 428 428", hours: "24/7" },
      { name: "Lifeline Limpopo", phone: "015 297 1218", hours: "Mon–Fri 8am–4pm" },
    ],
  },
  {
    name: "Mpumalanga",
    resources: [
      { name: "SAPS Emergency", phone: "10111", hours: "24/7" },
      { name: "GBV Command Centre", phone: "0800 428 428", hours: "24/7" },
      { name: "Lifeline Mpumalanga", phone: "013 755 2070", hours: "Mon–Fri 8am–4pm" },
    ],
  },
  {
    name: "North West",
    resources: [
      { name: "SAPS Emergency", phone: "10111", hours: "24/7" },
      { name: "GBV Command Centre", phone: "0800 428 428", hours: "24/7" },
      { name: "Lifeline Rustenburg", phone: "014 594 2775", hours: "Mon–Fri 8am–4pm" },
    ],
  },
  {
    name: "Northern Cape",
    resources: [
      { name: "SAPS Emergency", phone: "10111", hours: "24/7" },
      { name: "GBV Command Centre", phone: "0800 428 428", hours: "24/7" },
      { name: "Lifeline Kimberley", phone: "053 842 0911", hours: "Mon–Fri 8am–4pm" },
    ],
  },
];

const ProvincialResourcesSection = () => {
  const [active, setActive] = useState("Gauteng");

  return (
    <div className="-mx-5 sm:-mx-6 px-5 sm:px-6 py-12 sm:py-16 mb-12 sm:mb-16" style={{
      background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)',
      borderRadius: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '40%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="relative z-10">
        <p className="font-mono text-[11px] tracking-[0.15em] mb-3 flex items-center gap-3" style={{ color: '#A855F7' }}>
          <span style={{ width: 24, height: 1, background: '#A855F7', display: 'inline-block' }} />
          Provincial Support
        </p>
        <h2 className="font-heading text-[24px] sm:text-[32px] mb-8 leading-tight" style={{ color: '#FFFFFF' }}>
          Emergency contacts by province
        </h2>

        {/* Province tabs — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          {provinces.map((p) => (
            <button
              key={p.name}
              onClick={() => setActive(p.name)}
              className="font-body text-[12px] sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-200"
              style={{
                padding: '8px 18px',
                borderRadius: 50,
                border: active === p.name ? '1px solid #7C3AED' : '1px solid rgba(124,58,237,0.2)',
                background: active === p.name ? '#7C3AED' : 'rgba(124,58,237,0.06)',
                color: active === p.name ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Resources list */}
        <div className="grid gap-3">
          {provinces
            .find((p) => p.name === active)
            ?.resources.map((r) => (
              <div key={r.name + r.phone} className="flex items-center justify-between p-4 sm:p-5" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(124,58,237,0.12)',
                borderRadius: 14,
                backdropFilter: 'blur(8px)',
              }}>
                <div className="min-w-0 flex-1">
                  <h4 className="font-body text-[14px] sm:text-[15px] font-bold mb-0.5" style={{ color: '#FFFFFF' }}>{r.name}</h4>
                  <p className="font-body text-[11px] sm:text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{r.hours}</p>
                </div>
                <a
                  href={`tel:${r.phone.replace(/\s/g, '')}`}
                  className="font-mono text-[13px] sm:text-[14px] font-bold flex-shrink-0 ml-4 transition-colors"
                  style={{
                    color: '#A855F7',
                    padding: '8px 16px',
                    borderRadius: 50,
                    background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(124,58,237,0.2)',
                    textDecoration: 'none',
                  }}
                >
                  {r.phone}
                </a>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProvincialResourcesSection;

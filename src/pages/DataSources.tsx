import { Link } from "react-router-dom";
import { Shield, CheckCircle, Clock, AlertTriangle, ExternalLink, Database, Scale, FileText, Ban, Eye } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";

interface DataSource {
  name: string;
  shortName: string;
  url: string;
  description: string;
  dataTypes: string[];
  legalBasis: string;
  updateFrequency: string;
  status: "active" | "coming_soon" | "pending";
  statusLabel: string;
  icon: React.ReactNode;
  trustLabel: string;
}

const DATA_SOURCES: DataSource[] = [
  {
    name: "South African Police Service (SAPS) — Wanted Persons List",
    shortName: "SAPS Wanted",
    url: "https://www.saps.gov.za/crimestop/wanted/list.php",
    description: "Official SAPS wanted persons list including suspects and persons of interest across all nine provinces.",
    dataTypes: ["Wanted persons", "Suspect status", "Crime type", "Province", "Police station"],
    legalBasis: "Published by SAPS under the South African Police Service Act 68 of 1995.",
    updateFrequency: "Daily (automated)",
    status: "active", statusLabel: "Active & Updated",
    icon: <Shield className="h-5 w-5" />,
    trustLabel: "Source: South African Police Service (SAPS)",
  },
  {
    name: "Southern African Legal Information Institute (SAFLII) — Court Judgments",
    shortName: "SAFLII Courts",
    url: "https://www.saflii.org",
    description: "Criminal court judgments from all South African High Courts, Supreme Court of Appeal, and Constitutional Court.",
    dataTypes: ["Court judgments", "Party names", "Case numbers", "Crime type", "Court name"],
    legalBasis: "Public records under PAIA and the Open Justice principle.",
    updateFrequency: "Nightly (automated)",
    status: "active", statusLabel: "Active & Updated",
    icon: <Scale className="h-5 w-5" />,
    trustLabel: "Source: SAFLII — Official Court Records",
  },
  {
    name: "Government Gazette — Legal Notices (GPW)",
    shortName: "Govt Gazette",
    url: "https://www.gpwonline.co.za/egazettes/",
    description: "Court-ordered insolvencies, sequestrations, rehabilitations, and fraud-related court orders.",
    dataTypes: ["Insolvency orders", "Sequestration orders", "Rehabilitation notices", "Fraud court orders"],
    legalBasis: "Published by the Government Printing Works.",
    updateFrequency: "Weekly (manual upload)",
    status: "coming_soon", statusLabel: "Coming Soon",
    icon: <FileText className="h-5 w-5" />,
    trustLabel: "Source: Government Printing Works",
  },
  {
    name: "National Register for Sex Offenders (NRSO)",
    shortName: "NRSO",
    url: "https://www.justice.gov.za/vg/nrso.html",
    description: "National register of convicted sex offenders maintained by the Department of Justice. Public access pending.",
    dataTypes: ["Registered sex offenders", "Conviction details", "Victim category"],
    legalBasis: "Criminal Law (Sexual Offences) Amendment Act 32 of 2007.",
    updateFrequency: "Pending public access",
    status: "pending", statusLabel: "Pending Legislation",
    icon: <Eye className="h-5 w-5" />,
    trustLabel: "Source: Department of Justice",
  },
  {
    name: "OpenSanctions — Live API (PEPs, Sanctions & Criminal Records)",
    shortName: "OpenSanctions API",
    url: "https://www.opensanctions.org",
    description: "Real-time API queries across 80+ international datasets including PEPs, sanctions lists, wanted persons, and corruption-linked entities. Results are live — not cached snapshots.",
    dataTypes: ["PEPs", "Sanctions lists", "Wanted persons", "Corruption links", "FIC sanctions", "International crime lists"],
    legalBasis: "Aggregated from publicly available government sanctions lists and law enforcement databases worldwide.",
    updateFrequency: "Real-time (live API query per search)",
    status: "active", statusLabel: "Live API",
    icon: <Database className="h-5 w-5" />,
    trustLabel: "Source: OpenSanctions — Verified API",
  },
];

const EXCLUDED_SOURCES = [
  "Social media posts (Twitter/X, Facebook, TikTok)",
  "News articles about alleged crimes (not convictions)",
  "Community WhatsApp group reports",
  "User-submitted accusations on any platform",
  "Blogs, forums, or crowdsourced content",
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  active: { bg: 'rgba(34,197,94,0.1)', text: '#22C55E', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  coming_soon: { bg: 'rgba(234,179,8,0.1)', text: '#EAB308', icon: <Clock className="h-3.5 w-3.5" /> },
  pending: { bg: 'rgba(156,163,175,0.1)', text: '#9CA3AF', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
};

export default function DataSources() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <NavbarPlinq />

      {/* Hero — dark */}
      <section style={{
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
        paddingTop: 120, paddingBottom: 64,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10">
          <p className="font-mono text-[11px] tracking-[0.15em] mb-4 flex items-center gap-3" style={{ color: '#A855F7' }}>
            <span style={{ width: 24, height: 1, background: '#A855F7', display: 'inline-block' }} />
            Data Integrity
          </p>
          <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[48px] leading-[1.05] mb-4" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Our <span style={{ color: '#A855F7' }}>data sources.</span>
          </h1>
          <p className="font-body text-[15px] sm:text-base leading-relaxed max-w-[560px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Every record has a traceable, auditable source from a South African government institution or officially recognised legal database.
          </p>
        </div>
      </section>

      <main className="max-w-[900px] mx-auto px-5 sm:px-6 py-10 sm:py-14">

        {/* Verification promise */}
        <div className="p-5 sm:p-6 mb-10" style={{
          background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 16,
        }}>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
            <div>
              <h3 className="font-heading text-base text-foreground mb-1">Data Verification Promise</h3>
              <p className="font-body text-[13px] text-muted-foreground leading-relaxed">
                All records are sourced exclusively from verified government institutions, official court systems, and internationally recognised compliance databases.
              </p>
            </div>
          </div>
        </div>

        {/* Sources */}
        <div className="space-y-4 sm:space-y-5 mb-12 sm:mb-14">
          {DATA_SOURCES.map((source) => {
            const sc = statusConfig[source.status];
            return (
              <div key={source.shortName} className="p-5 sm:p-7" style={{
                background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)',
                borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', flexShrink: 0 }}>
                      {source.icon}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-heading text-base sm:text-lg text-foreground leading-snug">{source.name}</h2>
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-body text-[11px] flex items-center gap-1 mt-0.5" style={{ color: '#7C3AED' }}>
                        {source.url.replace('https://', '')} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] tracking-wider self-start whitespace-nowrap"
                    style={{ background: sc.bg, color: sc.text, textTransform: 'uppercase' }}>
                    {sc.icon} {source.statusLabel}
                  </span>
                </div>

                <p className="font-body text-[13px] text-muted-foreground mb-4 leading-relaxed">{source.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="font-mono text-[10px] tracking-wider text-muted-foreground mb-1.5" style={{ textTransform: 'uppercase' }}>Data Types</p>
                    <div className="flex flex-wrap gap-1.5">
                      {source.dataTypes.map(dt => (
                        <span key={dt} className="inline-block px-2 py-0.5 font-body text-[11px] text-foreground" style={{
                          background: 'rgba(124,58,237,0.05)', borderRadius: 8,
                        }}>{dt}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-wider text-muted-foreground mb-1.5" style={{ textTransform: 'uppercase' }}>Update Frequency</p>
                    <p className="font-body text-[13px] text-foreground">{source.updateFrequency}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-wider text-muted-foreground mb-1.5" style={{ textTransform: 'uppercase' }}>Trust Label</p>
                    <p className="font-body text-[11px] text-foreground flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" style={{ color: '#22C55E' }} />
                      {source.trustLabel}
                    </p>
                  </div>
                </div>

                <details className="group">
                  <summary className="font-mono text-[10px] tracking-wider cursor-pointer" style={{ color: '#A855F7', textTransform: 'uppercase' }}>
                    Legal Basis ▸
                  </summary>
                  <p className="font-body text-[12px] text-muted-foreground mt-2 leading-relaxed pl-4" style={{ borderLeft: '2px solid rgba(124,58,237,0.2)' }}>
                    {source.legalBasis}
                  </p>
                </details>
              </div>
            );
          })}
        </div>

        {/* Excluded Sources */}
        <div className="p-5 sm:p-7 mb-10" style={{
          background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 18,
        }}>
          <div className="flex items-center gap-3 mb-4">
            <Ban className="h-5 w-5" style={{ color: '#EF4444' }} />
            <h2 className="font-heading text-base sm:text-lg text-foreground">Sources We Will Never Use</h2>
          </div>
          <p className="font-body text-[13px] text-muted-foreground mb-4 leading-relaxed">
            Using unverified internet reports is the single biggest risk to legal standing and POPIA compliance.
          </p>
          <ul className="space-y-2">
            {EXCLUDED_SOURCES.map(s => (
              <li key={s} className="flex items-center gap-2 font-body text-[13px] text-muted-foreground">
                <Ban className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#EF4444' }} /> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="font-body text-[11px] text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div className="flex justify-center gap-6 mt-3">
            <Link to="/privacy" className="font-body text-[12px]" style={{ color: '#7C3AED' }}>Privacy Policy</Link>
            <Link to="/terms" className="font-body text-[12px]" style={{ color: '#7C3AED' }}>Terms of Service</Link>
            <Link to="/about" className="font-body text-[12px]" style={{ color: '#7C3AED' }}>About RedFlaq</Link>
          </div>
        </div>
      </main>
      <FooterPlinq />
    </div>
  );
}

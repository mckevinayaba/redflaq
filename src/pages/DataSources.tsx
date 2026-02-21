import { Link } from "react-router-dom";
import { Shield, CheckCircle, Clock, AlertTriangle, ExternalLink, Database, Scale, FileText, Ban, Eye } from "lucide-react";

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
    description: "Official SAPS wanted persons list including suspects and persons of interest across all nine provinces. Integrated via the OpenSanctions za_wanted dataset for daily updates.",
    dataTypes: ["Wanted persons", "Suspect status", "Crime type", "Province", "Police station"],
    legalBasis: "Published by the South African Police Service under the South African Police Service Act 68 of 1995. This is publicly accessible information intended for public safety.",
    updateFrequency: "Daily (automated)",
    status: "active",
    statusLabel: "Active & Updated",
    icon: <Shield className="h-6 w-6" />,
    trustLabel: "Source: South African Police Service (SAPS) — Official Government Record",
  },
  {
    name: "Southern African Legal Information Institute (SAFLII) — Court Judgments",
    shortName: "SAFLII Courts",
    url: "https://www.saflii.org",
    description: "Criminal court judgments from all South African High Courts, Supreme Court of Appeal, and Constitutional Court. Full party names extracted from judgment bodies for accurate matching.",
    dataTypes: ["Court judgments", "Party names (first + surname)", "Case numbers", "Crime type", "Court name", "Judgment date"],
    legalBasis: "Court judgments are public records under the Promotion of Access to Information Act (PAIA) and the Open Justice principle. SAFLII is the official free legal information portal for Southern Africa.",
    updateFrequency: "Nightly (automated, cycling through 14 courts)",
    status: "active",
    statusLabel: "Active & Updated",
    icon: <Scale className="h-6 w-6" />,
    trustLabel: "Source: Southern African Legal Information Institute (SAFLII) — Official Court Records",
  },
  {
    name: "Government Gazette — Legal Notices (GPW)",
    shortName: "Govt Gazette",
    url: "https://www.gpwonline.co.za/egazettes/",
    description: "Court-ordered insolvencies, sequestrations, rehabilitations, and fraud-related court orders published in Legal Gazettes A & B by the Government Printing Works.",
    dataTypes: ["Insolvency orders", "Sequestration orders", "Rehabilitation notices", "Fraud court orders", "ID numbers (when published)"],
    legalBasis: "Published by the Government Printing Works under the Government Printing Works Act. Legal Gazettes are official public notices with legal force.",
    updateFrequency: "Manual upload by RedFlaq team (weekly as Gazettes are published)",
    status: "coming_soon",
    statusLabel: "Coming Soon",
    icon: <FileText className="h-6 w-6" />,
    trustLabel: "Source: Government Printing Works — Official Government Gazette",
  },
  {
    name: "National Register for Sex Offenders (NRSO)",
    shortName: "NRSO",
    url: "https://www.justice.gov.za/vg/nrso.html",
    description: "The national register of convicted sex offenders maintained by the Department of Justice. Legislative amendments to make this register publicly accessible are in progress (announced September 2025).",
    dataTypes: ["Registered sex offenders", "Conviction details", "Victim category"],
    legalBasis: "Criminal Law (Sexual Offences and Related Matters) Amendment Act 32 of 2007. Public access pending legislative amendment.",
    updateFrequency: "Pending public access",
    status: "pending",
    statusLabel: "Pending Legislation",
    icon: <Eye className="h-6 w-6" />,
    trustLabel: "Source: Department of Justice and Constitutional Development — National Register for Sex Offenders",
  },
  {
    name: "OpenSanctions — PEPs and International Sanctions",
    shortName: "OpenSanctions",
    url: "https://www.opensanctions.org",
    description: "Politically Exposed Persons (PEPs), international sanctions lists, and corruption-linked entities including State Capture-implicated individuals. Used for employer vetting and business partner checks.",
    dataTypes: ["PEPs", "Sanctions lists", "Corruption links", "State Capture connections", "FIC sanctions"],
    legalBasis: "Aggregated from publicly available government sanctions lists and international compliance databases. Data is provided under open data licenses.",
    updateFrequency: "Daily (automated)",
    status: "active",
    statusLabel: "Active & Updated",
    icon: <Database className="h-6 w-6" />,
    trustLabel: "Source: OpenSanctions — International Compliance Database",
  },
];

const EXCLUDED_SOURCES = [
  "Social media posts (Twitter/X, Facebook, TikTok)",
  "News articles about alleged crimes (not convictions)",
  "Community WhatsApp group reports",
  "User-submitted accusations on any platform",
  "Blogs, forums, or crowdsourced content",
];

const StatusBadge = ({ status, label }: { status: string; label: string }) => {
  const config = {
    active: { bg: "bg-risk-green/10", text: "text-risk-green", icon: <CheckCircle className="h-3.5 w-3.5" /> },
    coming_soon: { bg: "bg-amber-100", text: "text-amber-700", icon: <Clock className="h-3.5 w-3.5" /> },
    pending: { bg: "bg-muted", text: "text-muted-foreground", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  }[status] || { bg: "bg-muted", text: "text-muted-foreground", icon: null };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] tracking-wider uppercase ${config.bg} ${config.text}`}>
      {config.icon}
      {label}
    </span>
  );
};

export default function DataSources() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">REDFLAQ</span>
          </Link>
          <Link to="/" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Intro */}
        <div className="mb-12">
          <p className="font-mono text-[11px] tracking-widest text-primary uppercase mb-2">Data Integrity</p>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Our Data Sources
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-3xl leading-relaxed">
            RedFlaq is built on a zero-tolerance policy for unverified data. Every record displayed has a traceable, 
            auditable source from a South African government institution or officially recognised legal database. 
            We do not aggregate social media, user-generated content, or unverified internet reports.
          </p>
        </div>

        {/* Data Verification Watermark */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading text-base text-foreground mb-1">Data Verification Promise</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                All records displayed on RedFlaq are sourced exclusively from verified South African government institutions, 
                official court systems, and internationally recognised compliance databases. RedFlaq does not publish unverified, 
                user-generated, or social media-sourced information.
              </p>
            </div>
          </div>
        </div>

        {/* Sources */}
        <div className="space-y-6 mb-16">
          {DATA_SOURCES.map((source) => (
            <div key={source.shortName} className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {source.icon}
                  </div>
                  <div>
                    <h2 className="font-heading text-lg text-foreground">{source.name}</h2>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-primary hover:underline flex items-center gap-1">
                      {source.url} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <StatusBadge status={source.status} label={source.statusLabel} />
              </div>

              <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">{source.description}</p>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1.5">Data Types</p>
                  <div className="flex flex-wrap gap-1.5">
                    {source.dataTypes.map(dt => (
                      <span key={dt} className="inline-block px-2 py-0.5 bg-muted rounded font-body text-xs text-foreground">{dt}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1.5">Update Frequency</p>
                  <p className="font-body text-sm text-foreground">{source.updateFrequency}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1.5">Trust Label</p>
                  <p className="font-body text-xs text-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-risk-green" />
                    {source.trustLabel}
                  </p>
                </div>
              </div>

              <details className="group">
                <summary className="font-mono text-[10px] tracking-wider text-primary uppercase cursor-pointer hover:underline">
                  Legal Basis ▸
                </summary>
                <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed pl-4 border-l-2 border-primary/20">
                  {source.legalBasis}
                </p>
              </details>
            </div>
          ))}
        </div>

        {/* Excluded Sources */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 md:p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Ban className="h-6 w-6 text-destructive" />
            <h2 className="font-heading text-lg text-foreground">Sources We Will NEVER Use</h2>
          </div>
          <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">
            The following sources are permanently excluded from RedFlaq's data pipeline. Using unverified internet reports 
            is the single biggest risk to legal standing, reputation, and POPIA compliance. One wrongful listing based on a 
            social media accusation could result in a defamation lawsuit.
          </p>
          <ul className="space-y-2">
            {EXCLUDED_SOURCES.map(s => (
              <li key={s} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                <Ban className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="font-body text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/privacy" className="font-body text-xs text-primary hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="font-body text-xs text-primary hover:underline">Terms of Service</Link>
            <Link to="/about" className="font-body text-xs text-primary hover:underline">About RedFlaq</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

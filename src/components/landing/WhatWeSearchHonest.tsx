import { Check, X } from "lucide-react";

const WhatWeSearchHonest = () => {
  const canSearch = [
    {
      source: "SAPS Wanted Persons Database",
      description: "Active warrants for arrest",
      link: "https://www.saps.gov.za"
    },
    {
      source: "SAFLII Court Judgments",
      description: "High Court criminal judgments — rape, assault, murder convictions across all 9 provinces (2003–present)",
      link: "https://www.saflii.org"
    },
    {
      source: "Government Gazette Notices",
      description: "Legal notices, liquidations, name changes",
      link: "https://www.gpwonline.co.za"
    }
  ];

  const cantSearch = [
    {
      item: "Protection orders",
      reason: "Not publicly accessible under SA law"
    },
    {
      item: "Sealed court records",
      reason: "Protected by court order"
    },
    {
      item: "Juvenile records",
      reason: "Sealed to protect minors"
    },
    {
      item: "Private security databases",
      reason: "Proprietary, not public"
    },
    {
      item: "ID number lookups",
      reason: "Not searchable in public records; courts redact IDs"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              TRANSPARENCY
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              What We Can (and Can't) Search
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We only report what exists in public government records. Here's exactly what that means.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* What we CAN search */}
            <div className="bg-hsl(var(--risk-green-light)) border-2 border-risk-green/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-risk-green/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-risk-green" />
                </div>
                <h3 className="text-xl font-bold text-foreground">What We Search</h3>
              </div>
              
              <div className="space-y-4">
                {canSearch.map((item, index) => (
                  <div key={index} className="bg-card rounded-xl p-4 border border-border">
                    <p className="font-semibold text-foreground">{item.source}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      View source →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* What we CAN'T search */}
            <div className="bg-muted/50 border-2 border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <X className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">What We Can't Access</h3>
              </div>
              
              <div className="space-y-3">
                {cantSearch.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg">
                    <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{item.item}</p>
                      <p className="text-sm text-muted-foreground">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* POPIA note */}
          <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1">Why Not ID Numbers?</h4>
                <p className="text-muted-foreground text-sm">
                  ID numbers are not publicly searchable in South African criminal records. Courts typically redact them 
                  for privacy. Under POPIA, we cannot collect or process ID numbers without explicit consent for a lawful purpose.
                  We match using name + date of birth + location—more accurate and legally compliant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeSearchHonest;

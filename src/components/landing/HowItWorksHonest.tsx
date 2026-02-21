import { FileText, Search, UserCheck, Mail } from "lucide-react";

const HowItWorksHonest = () => {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "You provide details",
      description: "Full name, date of birth, and province. The more detail, the more accurate the match.",
      time: "30 seconds"
    },
    {
      number: "02",
      icon: Search,
      title: "We search public records",
      description: "SAPS wanted list, court judgments, government gazettes. All verified government sources.",
      time: "Automated"
    },
    {
      number: "03",
      icon: UserCheck,
      title: "Human verification",
      description: "Our team verifies matches to avoid false positives. Common names require extra care.",
      time: "2-5 minutes"
    },
    {
      number: "04",
      icon: Mail,
      title: "You receive your report",
      description: "Clear results via email with source links and verification date.",
      time: "Delivered"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
              THE PROCESS
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How We Actually Verify Records
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Honest about timing. Transparent about limitations.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-6 md:gap-8">
                  {/* Number circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-card border-2 flex items-center justify-center shadow-sm" style={{ borderColor: 'hsl(var(--primary) / 0.2)' }}>
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">STEP {step.number}</span>
                        <h3 className="text-xl font-bold text-foreground mt-1">{step.title}</h3>
                      </div>
                      <span className="text-sm font-medium text-primary px-3 py-1 rounded-full" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
                        {step.time}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <div className="mt-12 p-6 bg-card rounded-xl border border-border text-center">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Why human verification?</strong> South Africa has many duplicate names. 
              Automated matching alone would flag the wrong person. We verify every match before sending results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHonest;

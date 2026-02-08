import { FileText, Search, CheckCircle, Mail } from "lucide-react";

const HowItWorksPlinq = () => {
  const steps = [
    {
      number: "1",
      icon: FileText,
      title: "You Provide Information",
      description: "Full name, ID number, and reason for search. All information encrypted and secured.",
      time: "30 seconds",
    },
    {
      number: "2",
      icon: Search,
      title: "We Search Public Records",
      description: "Our system searches SAPS wanted persons, SAFLII court judgments, and government gazettes.",
      time: "1-2 minutes",
    },
    {
      number: "3",
      icon: CheckCircle,
      title: "Human Verification",
      description: "Our team verifies matches are the correct person. Common names require extra verification to avoid false positives.",
      time: "2-3 minutes",
    },
    {
      number: "4",
      icon: Mail,
      title: "You Receive Report",
      description: "Clear, color-coded report with source links sent via email. Every result is defensible and traceable.",
      time: "Immediate delivery",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-background">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            OUR PROCESS
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How RedFlaq Actually Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Human-verified. Factual. Transparent.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-primary/20" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex gap-6 md:gap-8">
                {/* Step number circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl md:text-3xl shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2 md:pt-4">
                  <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {step.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why human verification callout */}
        <div className="mt-16 bg-accent rounded-2xl p-8 border-l-4 border-primary">
          <p className="text-foreground leading-relaxed">
            <span className="font-semibold">Why human verification?</span> South Africa has many people with the same name. 
            We verify DOB and location to ensure we report on the correct person. This protects you from defamation and ensures accuracy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksPlinq;

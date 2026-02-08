import { DollarSign, FileText, Clock } from "lucide-react";

const RealitySection = () => {
  const problems = [
    {
      icon: DollarSign,
      title: "TOO EXPENSIVE",
      description: "R500 to R5,000 per check",
    },
    {
      icon: FileText,
      title: "TOO COMPLICATED",
      description: "Fingerprints, police visits, weeks of waiting",
    },
    {
      icon: Clock,
      title: "TOO INACCESSIBLE",
      description: "Not designed for everyday decisions",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-8">
          THE SOUTH AFRICAN REALITY
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
          Violence Rarely Begins With Violence
        </h2>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          It begins with information people didn't have, patterns they couldn't verify, and warnings they were never shown.
        </p>

        {/* Main Statistic Card */}
        <div className="bg-accent rounded-3xl p-8 md:p-12 mb-12 shadow-lg">
          <p className="text-muted-foreground text-lg mb-4">In South Africa,</p>
          <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-4">1 in 5 Women</p>
          <p className="text-xl text-foreground font-medium mb-6">
            experience intimate partner violence
          </p>
          <div className="max-w-lg mx-auto space-y-2 text-muted-foreground">
            <p>Most will never know their partner had legal history in public records.</p>
            <p>Not because records don't exist.</p>
            <p className="font-semibold text-foreground">Because access was impossible.</p>
          </div>
        </div>

        {/* Citation */}
        <p className="text-sm text-muted-foreground italic mb-16">
          Source: Statistics South Africa, 2023
        </p>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div key={problem.title} className="bg-card rounded-2xl p-6 shadow-md border border-border">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <problem.icon className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>

        {/* Until Now */}
        <p className="text-2xl font-bold text-foreground mt-12">Until Now.</p>
      </div>
    </section>
  );
};

export default RealitySection;

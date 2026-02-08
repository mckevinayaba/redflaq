import { AlertTriangle, Clock, Check, Shield } from "lucide-react";

const RiskLevelsSection = () => {
  const riskLevels = [
    {
      level: "HIGH RISK",
      icon: AlertTriangle,
      description: "Active warrants, violent offenses, multiple convictions, protection order violations",
      bgColor: "bg-risk-red-light",
      borderColor: "border-risk-red",
      textColor: "text-risk-red",
      badgeBg: "bg-risk-red",
    },
    {
      level: "MODERATE RISK",
      icon: AlertTriangle,
      description: "Past convictions, protection orders, pending court cases",
      bgColor: "bg-risk-amber-light",
      borderColor: "border-risk-amber",
      textColor: "text-risk-amber",
      badgeBg: "bg-risk-amber",
    },
    {
      level: "LOW RISK",
      icon: Clock,
      description: "Minor offenses, old records, resolved cases",
      bgColor: "bg-risk-yellow-light",
      borderColor: "border-risk-yellow",
      textColor: "text-risk-yellow",
      badgeBg: "bg-risk-yellow",
    },
    {
      level: "CLEAR",
      icon: Check,
      description: "No criminal records found in database",
      bgColor: "bg-risk-green-light",
      borderColor: "border-risk-green",
      textColor: "text-risk-green",
      badgeBg: "bg-risk-green",
    },
  ];

  const checklistItems = [
    "Criminal convictions (all courts)",
    "Domestic violence cases",
    "Protection orders (active & violated)",
    "Sexual offense records",
    "Assault & battery charges",
    "Fraud & theft convictions",
    "Active warrants",
    "Full source attribution",
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
          What Your Report Reveals
        </h2>

        {/* Risk Level Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {riskLevels.map((risk, index) => (
            <div 
              key={index}
              className={`${risk.bgColor} border-2 ${risk.borderColor} rounded-xl p-6 text-center`}
            >
              <risk.icon className={`h-12 w-12 mx-auto mb-4 ${risk.textColor}`} />
              <span className={`${risk.badgeBg} text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4`}>
                {risk.level}
              </span>
              <p className="text-gray-700 text-sm">{risk.description}</p>
            </div>
          ))}
        </div>

        {/* What You Get Section */}
        <div className="bg-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto shadow-md">
          <div className="flex justify-center mb-8">
            <Shield className="h-16 w-16 text-purple-600" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            What You Get
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {checklistItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-risk-green flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiskLevelsSection;

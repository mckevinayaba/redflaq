import { Shield, Users, Check } from "lucide-react";

const WhyRedflaqSection = () => {
  const values = [
    {
      icon: Shield,
      title: "Proactive Security",
      description: "Verified data from official sources at your fingertips to make informed decisions.",
      badge: null,
    },
    {
      icon: Users,
      title: "Support Community",
      description: "A network where women share experiences, advice, and support each other.",
      badge: "Coming Soon",
    },
    {
      icon: Check,
      title: "Verified Information",
      description: "Everything on RedFlaq is based on real public data from official government sources.",
      badge: null,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
            OUR STORY
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
          Why RedFlaq Exists
        </h2>

        {/* Body Text */}
        <div className="prose prose-lg max-w-none text-gray-700 mb-12 space-y-6">
          <p>
            Gender-based violence remains a critical safety concern in South Africa. According to SAPS crime statistics, thousands of assault and domestic violence cases are reported annually. Many incidents occur within relationships where warning signs existed in public records but were never accessed.
          </p>
          <p>
            Traditional background checks were designed for employers, not everyday people. At R500 to R5,000 per check, with fingerprints and weeks of waiting, most women never checked. Not because they didn't want to, but because the system made it impossible.
          </p>
          <p>
            <strong>RedFlaq was built to change that.</strong>
          </p>
          <p>
            We make public record verification instant, affordable, and accessible. So that anyone, anywhere in South Africa can answer one simple question before trusting someone new:
          </p>
          <p className="text-xl font-semibold text-purple-600 text-center">
            "Is there anything I should know?"
          </p>
        </div>

        {/* Value Prop Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <value.icon className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{value.description}</p>
              {value.badge && (
                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
                  {value.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Source Citation */}
        <p className="text-sm text-gray-400 text-center italic">
          Sources: SAPS Crime Statistics 2023, Statistics South Africa Gender Report 2023
        </p>
      </div>
    </section>
  );
};

export default WhyRedflaqSection;

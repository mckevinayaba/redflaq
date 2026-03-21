import { ClipboardList, Search, CheckCircle } from "lucide-react";

const SolutionSection = () => {
  const steps = [
    {
      number: "1",
      icon: ClipboardList,
      title: "Enter Basic Details",
      description: "Provide the person's full name, SA ID number, or case reference. Takes 15 seconds.",
    },
    {
      number: "2",
      icon: Search,
      title: "We Scan Public Records",
      description: "RedFlaq searches SAPS, courts, and official gazettes. All from verified government sources.",
    },
    {
      number: "3",
      icon: CheckCircle,
      title: "Get Clear Risk Report",
      description: "Receive a color-coded report (Green, Amber, or Red) with full details and source links.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
            INTRODUCING
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4">
          RedFlaq Background Check™
        </h2>
        
        <p className="text-xl text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          The first affordable, instant legal risk verification designed specifically for everyday decisions.
        </p>

        {/* How It Works Subheading */}
        <h3 className="text-2xl md:text-3xl font-bold text-purple-600 text-center mb-12">
          How It Works (Under 60 Seconds)
        </h3>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow text-center relative"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {step.number}
              </div>
              
              <step.icon className="h-12 w-12 mx-auto mb-4 text-purple-600 mt-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <p className="text-center text-gray-500 mt-12 text-lg">
          Fast. Simple. Confidential.
        </p>
      </div>
    </section>
  );
};

export default SolutionSection;

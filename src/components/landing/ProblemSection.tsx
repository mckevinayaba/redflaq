import { DollarSign, FileText, Clock } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      icon: DollarSign,
      title: "EXPENSIVE",
      description: "R500 to R5,000 for official checks",
      color: "text-risk-red",
    },
    {
      icon: FileText,
      title: "COMPLICATED",
      description: "Fingerprints, police visits, paperwork",
      color: "text-risk-red",
    },
    {
      icon: Clock,
      title: "SLOW",
      description: "4 days to 3 weeks for results",
      color: "text-risk-red",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
            THE CHALLENGE
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
          The Truth About Background Checks in South Africa
        </h2>

        {/* Main Stat Card */}
        <div className="bg-purple-50 rounded-2xl p-8 md:p-12 text-center mb-12">
          <h3 className="text-2xl md:text-4xl font-bold text-purple-600 mb-4">
            In South Africa, 1 in 5 Women Experience Intimate Partner Violence
          </h3>
          <p className="text-lg text-gray-600 mb-4">
            Most will never know their partner had a criminal history in public records.
          </p>
          <p className="text-sm text-gray-400 italic">
            Source: Statistics South Africa, 2023 Gender Statistics Report
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <problem.icon className={`h-12 w-12 mx-auto mb-4 ${problem.color}`} />
              <h4 className="text-lg font-bold text-gray-900 mb-2">{problem.title}</h4>
              <p className="text-gray-600">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

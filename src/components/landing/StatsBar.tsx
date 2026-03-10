import { Clock, FileCheck, Shield } from "lucide-react";

const StatsBar = () => {
  const stats = [
    { icon: Clock, value: "<60 sec", label: "Average Search Time" },
    { icon: FileCheck, value: "100%", label: "Public Sources" },
    { icon: Shield, value: "POPIA", label: "Compliant" },
  ];

  return (
    <section className="bg-purple-600 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center text-white">
              <stat.icon className="h-6 w-6 mb-2 opacity-90" />
              <span className="text-2xl md:text-3xl font-bold">{stat.value}</span>
              <span className="text-sm opacity-90">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;

import { useEffect, useState } from "react";
import { BarChart3, Clock, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TrustBarPlinq = () => {
  const [recordCount, setRecordCount] = useState(69);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('wanted_persons')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (count) setRecordCount(count);
    };
    fetchCount();
  }, []);

  const stats = [
    {
      icon: BarChart3,
      value: recordCount.toLocaleString(),
      label: "Active Records",
    },
    {
      icon: Clock,
      value: "<5 min",
      label: "Avg Response",
    },
    {
      icon: Lock,
      value: "100%",
      label: "Confidential",
    },
    {
      icon: ShieldCheck,
      value: "POPIA",
      label: "Compliant",
    },
  ];

  return (
    <section className="w-full py-8" style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(263 70% 50%) 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <stat.icon className="w-6 h-6 mx-auto mb-2 opacity-90" />
              <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBarPlinq;

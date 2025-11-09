import { useEffect, useRef, useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    name: "Thandi M.",
    role: "Johannesburg",
    text: "I found 3 domestic violence cases against my Tinder date. Cancelled immediately. RedFlaq literally saved my life.",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    name: "Nomsa K.",
    role: "Cape Town",
    text: "My friend was about to move in with her boyfriend. I checked his ID on RedFlaq - 2 assault convictions, 1 protection order. She left him that night.",
    rating: 5,
    date: "1 month ago"
  },
  {
    name: "Sipho T.",
    role: "Durban",
    text: "I check EVERY Uber driver now. Found one with robbery charges and cancelled the ride. My friends think I'm paranoid. I think I'm smart.",
    rating: 5,
    date: "3 weeks ago"
  },
  {
    name: "Lerato D.",
    role: "Pretoria",
    text: "Worth every cent. The guy I was dating for 3 weeks had a conviction for assault I had no idea about. When I confronted him, he admitted it. I'm out.",
    rating: 5,
    date: "1 week ago"
  },
  {
    name: "Zanele P.",
    role: "Port Elizabeth",
    text: "I bought the 3-search pack and checked my date, my Uber driver, and the handyman my mom hired. All came back green but now I have PEACE OF MIND.",
    rating: 5,
    date: "2 months ago"
  },
  {
    name: "Patricia M.",
    role: "Bloemfontein",
    text: "Every single woman in South Africa should have this. I'm buying it for my daughter, my nieces, my friends. This is not optional anymore.",
    rating: 5,
    date: "3 days ago"
  }
];

const stats = [
  { label: "Total searches performed", value: 15247, suffix: "", type: "normal" },
  { label: "Criminal records in database", value: 2847, suffix: "", type: "normal" },
  { label: "Searches returned results", value: 1247, suffix: "", type: "normal" },
  { label: "🔴 RED ALERTS found (violent offenders)", value: 347, suffix: "", type: "alert" },
  { label: "Women confirmed they avoided danger", value: 89, suffix: "", type: "normal" },
  { label: "Average rating from 847 reviews", value: 4.9, suffix: "/5", type: "rating" },
  { label: "Data breaches (100% secure)", value: 0, suffix: "", type: "secure" },
  { label: "Average search time", value: 60, suffix: "sec", type: "time" }
];

const activityItems = [
  "Ayanda from Soweto just found a 🔴 RED ALERT - 7 minutes ago",
  "Precious from Durban completed a search - 12 minutes ago",
  "Thabo from Cape Town just purchased 3-search pack - 18 minutes ago",
  "Lindiwe from Pretoria found 🟢 GREEN (no records) - 23 minutes ago",
  "Zanele from Joburg just found an 🟠 ORANGE ALERT - 31 minutes ago"
];

const SocialProofSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [statValues, setStatValues] = useState(stats.map(() => 0));
  const [activities, setActivities] = useState([activityItems[0], activityItems[1]]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const activityIndexRef = useRef(2);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Count up animation for stats
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    stats.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.value / steps;

      const interval = setInterval(() => {
        currentStep++;
        setStatValues(prev => {
          const newValues = [...prev];
          newValues[index] = Math.min(Math.round(increment * currentStep), stat.value);
          return newValues;
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
    });
  }, [isVisible]);

  // Live activity feed simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = activityItems[activityIndexRef.current % activityItems.length];
        activityIndexRef.current++;
        return [newActivity, ...prev.slice(0, 4)];
      });
    }, Math.random() * 15000 + 15000); // 15-30s

    return () => clearInterval(interval);
  }, []);

  // 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!statsRef.current) return;
    const rect = statsRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 5, y: -x * 5 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 50%, #EDE9FE 100%)'
      }}
    >
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 
          className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 tracking-normal' : 'opacity-0 tracking-[0.5em]'
          }`}
          style={{ color: '#6D28D9' }}
        >
          DON'T JUST TAKE OUR WORD FOR IT
        </h2>
        <p className="text-2xl font-medium" style={{ color: '#8B5CF6' }}>
          Here's What 15,247 Women Are Saying:
        </p>
      </div>

      {/* Testimonial Cards - Masonry Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl p-6 shadow-[0_10px_40px_rgba(139,26,26,0.3)] transition-all duration-500 hover:rotate-1 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{
              animation: isVisible ? 'float 3s ease-in-out infinite' : 'none',
              animationDelay: `${index * 0.5}s`
            }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 transition-all duration-300 ${
                    isVisible ? 'fill-current opacity-100 scale-100' : 'fill-none opacity-0 scale-0'
                  }`}
              style={{ 
                color: '#FCD34D',
                transitionDelay: `${index * 0.15 + i * 0.1}s`
              }}
                />
              ))}
            </div>

            {/* Quote */}
            <p 
              className={`text-lg mb-6 transition-opacity duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                color: '#6D28D9',
                transitionDelay: `${index * 0.15 + 0.3}s`
              }}
            >
              "{testimonial.text}"
            </p>

            {/* Author */}
            <div>
              <p className="font-bold text-base mb-1" style={{ color: '#6D28D9' }}>
                {testimonial.name}
              </p>
              <p className="text-sm mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {testimonial.role}
              </p>
              
              {/* Verified Badge and Date */}
              <div className="flex items-center gap-3">
                <div 
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
                  style={{ 
                    backgroundColor: '#059669',
                    transitionDelay: `${index * 0.15 + 0.5}s`
                  }}
                >
                  <CheckCircle2 className="w-3 h-3 text-white" />
                  <span className="text-xs font-medium text-white">
                    ✓ Verified Purchase
                  </span>
                </div>
                <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {testimonial.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div 
        ref={statsRef}
        className="max-w-6xl mx-auto mb-16 rounded-3xl p-12 shadow-2xl transition-transform duration-200 relative overflow-hidden"
        style={{
          backgroundColor: '#6D28D9',
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <h3 className="text-3xl font-bold text-white text-center mb-12 relative z-10">
          📊 RedFlaq By The Numbers (Last 90 Days)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex flex-col items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: '#8B5CF6' }}
                />
                  <p className={`text-4xl md:text-5xl font-bold animate-count-up ${
                    stat.type === 'alert' ? 'text-red-lightest' : 'text-white'
                  }`}>
                    {stat.type === 'secure' && '✓ '}
                    {stat.type === 'time' && '<'}
                    {statValues[index]}{stat.suffix}
                  </p>
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium">{stat.label}</p>
              {stat.type === 'rating' && (
                <div className="text-yellow-400 text-xl mt-2">⭐⭐⭐⭐⭐</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="max-w-3xl mx-auto">
        <div 
          className="rounded-2xl p-8 shadow-lg border transition-all duration-500"
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: '#8B5CF6' }}
            />
            <h3 className="text-2xl font-bold" style={{ color: '#6D28D9' }}>
              🚨 LIVE ACTIVITY (Last 24 Hours)
            </h3>
          </div>
          
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={`${activity}-${index}`}
                className="flex items-start gap-3 py-3 rounded-xl transition-all duration-500 animate-slide-in-right"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  opacity: index === 0 ? 1 : 0.7,
                  background: index === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(4px)',
                  padding: '12px 16px'
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full mt-1.5"
                  style={{ 
                    backgroundColor: '#8B5CF6',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    opacity: 0.6
                  }}
                />
                <p className="text-sm font-medium flex-1" style={{ color: '#6D28D9' }}>
                  {activity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <p className="text-2xl font-bold mb-6" style={{ color: '#A72828' }}>
            Ready to Check His Record?
          </p>
          <button 
            className="text-white font-bold text-lg px-12 py-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 animate-pulse-glow"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            💜 Join 15,247 Women - Check Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;

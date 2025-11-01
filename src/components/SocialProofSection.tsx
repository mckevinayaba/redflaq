import { useEffect, useRef, useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Property Manager",
    text: "RedFlaq saved us from a tenant with 3 prior evictions. The system caught what traditional screening missed.",
    rating: 5,
    date: "2 days ago"
  },
  {
    name: "James Rodriguez",
    role: "Landlord",
    text: "Within 24 hours of using RedFlaq, I discovered my applicant had pending lawsuits in two states.",
    rating: 5,
    date: "1 week ago"
  },
  {
    name: "Emily Chen",
    role: "Real Estate Investor",
    text: "The risk scoring is incredibly accurate. We've reduced problem tenancies by 87% since implementing RedFlaq.",
    rating: 5,
    date: "3 days ago"
  },
  {
    name: "Michael Thompson",
    role: "Property Owner",
    text: "Finally, a screening tool that actually works. The comprehensive reports give me peace of mind.",
    rating: 5,
    date: "5 days ago"
  },
  {
    name: "Lisa Anderson",
    role: "Portfolio Manager",
    text: "RedFlaq's AI-powered analysis uncovered red flags in minutes that would have taken us weeks to find manually.",
    rating: 5,
    date: "1 week ago"
  },
  {
    name: "David Park",
    role: "Landlord",
    text: "Best investment I've made for my rental business. The ROI paid for itself after avoiding just one bad tenant.",
    rating: 5,
    date: "4 days ago"
  }
];

const stats = [
  { label: "Tenants Screened", value: 50000, suffix: "+" },
  { label: "Red Flags Detected", value: 12500, suffix: "+" },
  { label: "Success Rate", value: 99, suffix: "%" },
  { label: "Average Time Saved", value: 48, suffix: "hrs" }
];

const activityItems = [
  "Jessica M. just screened a tenant in Los Angeles, CA",
  "Michael R. detected 3 red flags in Chicago, IL",
  "Sarah L. completed a screening in Austin, TX",
  "David K. upgraded to Premium in Miami, FL",
  "Emily W. just screened a tenant in Seattle, WA",
  "Robert P. detected 2 red flags in Boston, MA"
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
      className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-red-lightest via-red-cream to-red-lightest animate-gradient"
    >
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 
          className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 tracking-normal' : 'opacity-0 tracking-[0.5em]'
          }`}
          style={{ color: 'hsl(var(--red-ultra-dark))' }}
        >
          Join Thousands of Protected Landlords
        </h2>
      </div>

      {/* Testimonial Cards - Masonry Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl p-6 shadow-[0_10px_40px_rgba(220,38,38,0.15)] transition-all duration-500 hover:rotate-1 hover:scale-105 ${
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
                    color: 'hsl(var(--brand-gold))',
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
                color: 'hsl(var(--red-ultra-dark))',
                transitionDelay: `${index * 0.15 + 0.3}s`
              }}
            >
              "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold" style={{ color: 'hsl(var(--red-ultra-dark))' }}>
                  {testimonial.name}
                </p>
                <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {testimonial.role}
                </p>
              </div>
              
              {/* Verified Badge */}
              <div 
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ 
                  backgroundColor: 'hsl(var(--red-lightest))',
                  transitionDelay: `${index * 0.15 + 0.5}s`
                }}
              >
                <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(var(--red-primary))' }} />
                <span className="text-xs font-medium" style={{ color: 'hsl(var(--red-primary))' }}>
                  Verified
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div 
        ref={statsRef}
        className="max-w-5xl mx-auto mb-16 rounded-2xl p-12 shadow-2xl transition-transform duration-200"
        style={{
          backgroundColor: 'hsl(var(--red-dark))',
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: 'hsl(var(--red-primary))' }}
                />
                <p className="text-5xl md:text-6xl font-bold text-white animate-count-up">
                  {statValues[index]}{stat.suffix}
                </p>
              </div>
              <p className="text-red-lightest font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="max-w-2xl mx-auto">
        <div 
          className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-red-lightest">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: 'hsl(var(--red-primary))' }}
            />
            <h3 className="font-semibold" style={{ color: 'hsl(var(--red-ultra-dark))' }}>
              Live Activity
            </h3>
          </div>
          
          <div className="space-y-3 transition-all duration-500">
            {activities.map((activity, index) => (
              <div
                key={`${activity}-${index}`}
                className={`p-3 rounded-lg transition-all duration-500 ${
                  index === 0 ? 'opacity-100 translate-x-0' : 'opacity-70'
                }`}
                style={{ 
                  backgroundColor: index === 0 ? 'hsl(var(--red-lightest))' : 'transparent'
                }}
              >
                <p className="text-sm" style={{ color: 'hsl(var(--red-ultra-dark))' }}>
                  {activity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;

import { Star, Check } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "I discovered information about someone I was about to meet. RedFlaq gave me clarity to ask better questions and make a safer decision.",
      name: "Thandi M.",
      location: "Johannesburg",
      timeAgo: "2 weeks ago",
    },
    {
      quote: "Now I check every new person before meeting. It's as essential as looking at their social media. I feel much safer.",
      name: "Naledi K.",
      location: "Cape Town",
      timeAgo: "1 month ago",
    },
    {
      quote: "My friends and I all use RedFlaq now. For less than a coffee, you get peace of mind. That's priceless.",
      name: "Zanele D.",
      location: "Durban",
      timeAgo: "3 weeks ago",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
            SOCIAL PROOF
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
          Real Stories From South African Women
        </h2>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-purple-600 text-purple-600" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-risk-green text-sm font-medium">
                    <Check className="h-4 w-4" />
                    Verified Purchase
                  </div>
                  <p className="text-xs text-gray-400">{testimonial.timeAgo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

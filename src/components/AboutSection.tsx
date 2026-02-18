const AboutSection = () => {
  return (
    <section className="py-16 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          
          <h2 className="text-3xl font-bold text-primary mb-6">
            About RedFlaq
          </h2>
          
          <p className="text-lg text-gray-700 mb-4">
            RedFlaq is a safety initiative by <strong>Setup A Startup</strong>, 
            launched in solidarity with South Africa's National Shutdown 
            against Gender-Based Violence (November 21, 2024).
          </p>
          
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="font-bold text-[#8B5CF6] mb-3">
              💜 Our Mission
            </h3>
            <p className="text-gray-700">
              Too many South African women have been hurt or killed by 
              partners they trusted. RedFlaq gives women the power to 
              check criminal backgrounds BEFORE meeting someone - using 
              publicly available SAPS and court records.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-bold text-[#6D28D9] mb-2">
                🏢 Built By
              </p>
              <p className="text-sm text-gray-700">
                Setup A Startup - Supporting 300+ African startups 
                across 34 countries
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-bold text-[#6D28D9] mb-2">
                👨‍💼 Founded By
              </p>
              <p className="text-sm text-gray-700">
                Founder, RedFlaq
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 italic">
            "We build technology that protects lives and creates 
            safer communities. RedFlaq is our contribution to 
            ending GBV in South Africa."
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

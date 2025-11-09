const TrustBadgesSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <p className="text-4xl mb-3">🏢</p>
              <p className="text-sm font-bold text-foreground">Setup A Startup</p>
              <p className="text-xs text-muted-foreground mt-1">Registered Business</p>
            </div>
            
            <div className="text-center p-4">
              <p className="text-4xl mb-3">🌍</p>
              <p className="text-sm font-bold text-foreground">300+ Startups</p>
              <p className="text-xs text-muted-foreground mt-1">Supported Across Africa</p>
            </div>
            
            <div className="text-center p-4">
              <p className="text-4xl mb-3">🎯</p>
              <p className="text-sm font-bold text-foreground">34 Countries</p>
              <p className="text-xs text-muted-foreground mt-1">African Presence</p>
            </div>
            
            <div className="text-center p-4">
              <p className="text-4xl mb-3">💜</p>
              <p className="text-sm font-bold text-foreground">GBV Prevention</p>
              <p className="text-xs text-muted-foreground mt-1">Mission Driven</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;

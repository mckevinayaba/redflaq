const DiscreetConfirmation = () => {
  const email = new URLSearchParams(window.location.search).get("email") || "your email";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-3xl">🔒</span>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl text-foreground leading-snug">
          Your results have been sent privately to{" "}
          <span className="text-primary">{email}</span>.
        </h1>

        <p className="font-body text-base text-muted-foreground leading-relaxed">
          Check your inbox when you're ready — there's no rush.
        </p>

        <hr className="border-border" />

        <p className="font-body text-sm text-muted-foreground">
          🆘 If you need support right now, call GBV Command Centre:{" "}
          <a href="tel:0800428428" className="font-bold text-foreground hover:underline">
            0800 428 428
          </a>{" "}
          — Free · 24/7
        </p>

        <a
          href="/"
          className="inline-block font-body text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to redflaq.com
        </a>
      </div>
    </div>
  );
};

export default DiscreetConfirmation;

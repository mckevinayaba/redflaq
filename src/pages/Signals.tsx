import SignalsNav from "@/components/signals/SignalsNav";
import SignalsTicker from "@/components/signals/SignalsTicker";
import SignalsHero from "@/components/signals/SignalsHero";
import SignalsFullQuote from "@/components/signals/SignalsFullQuote";
import SignalsCategories from "@/components/signals/SignalsCategories";
import SignalsTodayFeatured from "@/components/signals/SignalsTodayFeatured";
import SignalsGrid from "@/components/signals/SignalsGrid";
import SignalsPricing from "@/components/signals/SignalsPricing";
import SignalsFooter from "@/components/signals/SignalsFooter";

const Signals = () => {
  return (
    <div style={{ background: "var(--rf-paper)", minHeight: "100vh", overflowX: "hidden" }}>
      <SignalsNav />
      <SignalsTicker />
      <SignalsHero />
      <SignalsFullQuote />
      <SignalsCategories />
      <SignalsTodayFeatured />
      <SignalsGrid />
      <SignalsPricing />
      <SignalsFooter />
    </div>
  );
};

export default Signals;

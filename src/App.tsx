import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SearchForm from "./pages/SearchForm";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import AdminScraper from "./pages/AdminScraper";
import AdminImport from "./pages/AdminImport";
import AdminLogin from "./pages/AdminLogin";
import AdminVerifyPayments from "./pages/AdminVerifyPayments";
import Receipt from "./pages/Receipt";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Dispute from "./pages/Dispute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search-form" element={<SearchForm />} />
          <Route path="/results" element={<Results />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/dispute" element={<Dispute />} />
          <Route path="/admin/scraper" element={<AdminScraper />} />
          <Route path="/admin/import" element={<AdminImport />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/verify-payments" element={<AdminVerifyPayments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

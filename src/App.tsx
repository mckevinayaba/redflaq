import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SearchForm from "./pages/SearchFormHonest";
import Results from "./pages/ResultsPageUpdated";
import NotFound from "./pages/NotFound";
import AdminScraper from "./pages/AdminScraper";
import AdminImport from "./pages/AdminImport";
import AdminLogin from "./pages/AdminLogin";
import AdminVerifyPayments from "./pages/AdminVerifyPayments";
import AdminMergeReview from "./pages/AdminMergeReview";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardNew from "./pages/AdminDashboardNew";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminChecksPage from "./pages/AdminChecksPage";
import Receipt from "./pages/Receipt";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Dispute from "./pages/Dispute";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import DashboardNewCheck from "./pages/DashboardNewCheck";
import DashboardReports from "./pages/DashboardReports";
import DashboardAccount from "./pages/DashboardAccount";
import DashboardHelp from "./pages/DashboardHelp";

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
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/new-check" element={<DashboardNewCheck />} />
          <Route path="/dashboard/reports" element={<DashboardReports />} />
          <Route path="/dashboard/account" element={<DashboardAccount />} />
          <Route path="/dashboard/help" element={<DashboardHelp />} />
          <Route path="/admin" element={<AdminDashboardNew />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/checks" element={<AdminChecksPage />} />
          <Route path="/admin/scraper" element={<AdminScraper />} />
          <Route path="/admin/import" element={<AdminImport />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/verify-payments" element={<AdminVerifyPayments />} />
          <Route path="/admin/merge-review" element={<AdminMergeReview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

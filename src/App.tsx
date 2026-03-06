import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AdminContentPage from "./pages/AdminContentPage";
import AdminPricingPage from "./pages/AdminPricingPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import AdminSystemPage from "./pages/AdminSystemPage";
import AdminGazettePage from "./pages/AdminGazettePage";
import DataSources from "./pages/DataSources";
import Receipt from "./pages/Receipt";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Dispute from "./pages/Dispute";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Pricing from "./pages/Pricing";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import DashboardNewCheck from "./pages/DashboardNewCheck";
import DashboardReports from "./pages/DashboardReports";
import DashboardAccount from "./pages/DashboardAccount";
import DashboardHelp from "./pages/DashboardHelp";
import ClaimReference from "./pages/ClaimReference";
import SafetyTips from "./pages/SafetyTips";
import ConversationGuide from "./pages/ConversationGuide";
import FirstDateSafety from "./pages/tools/FirstDateSafety";
import TenantSafety from "./pages/tools/TenantSafety";
import DomesticWorkerSafety from "./pages/tools/DomesticWorkerSafety";
import RedFlagQuiz from "./pages/tools/RedFlagQuiz";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import Partners from "./pages/Partners";
import PartnersApply from "./pages/PartnersApply";
import DemoResult from "./pages/DemoResult";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import DiscreetConfirmation from "./pages/DiscreetConfirmation";
import SecureReportView from "./pages/SecureReportView";
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
          <Route path="/demo-result" element={<DemoResult />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/discreet-sent" element={<DiscreetConfirmation />} />
          <Route path="/reports/view/:token" element={<SecureReportView />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/dispute" element={<Dispute />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/new-check" element={<DashboardNewCheck />} />
          <Route path="/dashboard/reports" element={<DashboardReports />} />
          <Route path="/dashboard/account" element={<DashboardAccount />} />
          <Route path="/dashboard/help" element={<DashboardHelp />} />
          {/* Safety Tips (formerly Tools) */}
          <Route path="/safety-tips" element={<SafetyTips />} />
          <Route path="/conversation-guide" element={<ConversationGuide />} />
          <Route path="/safety-tips/first-date-safety" element={<FirstDateSafety />} />
          <Route path="/safety-tips/tenant-safety" element={<TenantSafety />} />
          <Route path="/safety-tips/domestic-worker-safety" element={<DomesticWorkerSafety />} />
          <Route path="/safety-tips/red-flag-quiz" element={<RedFlagQuiz />} />
          {/* Legacy /tools redirects */}
          <Route path="/tools" element={<Navigate to="/safety-tips" replace />} />
          <Route path="/tools/first-date-safety" element={<Navigate to="/safety-tips/first-date-safety" replace />} />
          <Route path="/tools/tenant-safety" element={<Navigate to="/safety-tips/tenant-safety" replace />} />
          <Route path="/tools/domestic-worker-safety" element={<Navigate to="/safety-tips/domestic-worker-safety" replace />} />
          <Route path="/tools/red-flag-quiz" element={<Navigate to="/safety-tips/red-flag-quiz" replace />} />
          {/* Blog (formerly Academy) */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          {/* Legacy /academy redirects */}
          <Route path="/academy" element={<Navigate to="/blog" replace />} />
          <Route path="/academy/:slug" element={<Navigate to="/blog/:slug" replace />} />
          {/* Partners */}
          <Route path="/partners" element={<Partners />} />
          <Route path="/partners/apply" element={<PartnersApply />} />
          {/* Admin */}
          <Route path="/admin" element={<AdminDashboardNew />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/checks" element={<AdminChecksPage />} />
          <Route path="/admin/content" element={<AdminContentPage />} />
          <Route path="/admin/pricing" element={<AdminPricingPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/system" element={<AdminSystemPage />} />
          <Route path="/admin/gazette" element={<AdminGazettePage />} />
          <Route path="/sources" element={<DataSources />} />
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

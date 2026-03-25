import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

// Dynamic redirect for /academy/:slug → /blog/:slug
const AcademyRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
};

// Eagerly loaded (critical path)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loaded routes
const SearchForm = lazy(() => import("./pages/SearchFormHonest"));
const Results = lazy(() => import("./pages/ResultsPageUpdated"));
const AdminScraper = lazy(() => import("./pages/AdminScraper"));
const AdminImport = lazy(() => import("./pages/AdminImport"));
const AdminVerifyPayments = lazy(() => import("./pages/AdminVerifyPayments"));
const AdminMergeReview = lazy(() => import("./pages/AdminMergeReview"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminDashboardNew = lazy(() => import("./pages/AdminDashboardNew"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const AdminChecksPage = lazy(() => import("./pages/AdminChecksPage"));
const AdminContentPage = lazy(() => import("./pages/AdminContentPage"));
const AdminPricingPage = lazy(() => import("./pages/AdminPricingPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/AdminAnalyticsPage"));
const AdminSystemPage = lazy(() => import("./pages/AdminSystemPage"));
const AdminGazettePage = lazy(() => import("./pages/AdminGazettePage"));
const DataSources = lazy(() => import("./pages/DataSources"));
const Receipt = lazy(() => import("./pages/Receipt"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Dispute = lazy(() => import("./pages/Dispute"));
const Signup = lazy(() => import("./pages/Signup"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardNewCheck = lazy(() => import("./pages/DashboardNewCheck"));
const DashboardReports = lazy(() => import("./pages/DashboardReports"));
const DashboardAccount = lazy(() => import("./pages/DashboardAccount"));
const DashboardHelp = lazy(() => import("./pages/DashboardHelp"));
const ClaimReference = lazy(() => import("./pages/ClaimReference"));
const SafetyTips = lazy(() => import("./pages/SafetyTips"));
const ConversationGuide = lazy(() => import("./pages/ConversationGuide"));
const FirstDateSafety = lazy(() => import("./pages/tools/FirstDateSafety"));
const TenantSafety = lazy(() => import("./pages/tools/TenantSafety"));
const DomesticWorkerSafety = lazy(() => import("./pages/tools/DomesticWorkerSafety"));
const RedFlagQuiz = lazy(() => import("./pages/tools/RedFlagQuiz"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const Partners = lazy(() => import("./pages/Partners"));
const PartnersApply = lazy(() => import("./pages/PartnersApply"));
const DemoResult = lazy(() => import("./pages/DemoResult"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("./pages/PaymentCancelled"));
const DiscreetConfirmation = lazy(() => import("./pages/DiscreetConfirmation"));
const SecureReportView = lazy(() => import("./pages/SecureReportView"));
const JournalList = lazy(() => import("./pages/JournalList"));
const JournalNew = lazy(() => import("./pages/JournalNew"));
const JournalDetail = lazy(() => import("./pages/JournalDetail"));
const JournalEdit = lazy(() => import("./pages/JournalEdit"));
const JournalExport = lazy(() => import("./pages/JournalExport"));
const AffidavitBuilder = lazy(() => import("./pages/AffidavitBuilder"));
const WhatsAppPage = lazy(() => import("./pages/WhatsApp"));
const Shop = lazy(() => import("./pages/Shop"));
const HabitComingSoon = lazy(() => import("./pages/HabitComingSoon"));
const BehavioralSignalComingSoon = lazy(() => import("./pages/BehavioralSignalComingSoon"));
const HabitDashboard = lazy(() => import("./pages/HabitDashboard"));
const BehavioralSignalDetection = lazy(() => import("./pages/BehavioralSignalDetection"));
const ApiComingSoon = lazy(() => import("./pages/ApiComingSoon"));
const RedflaqOrgComingSoon = lazy(() => import("./pages/RedflaqOrgComingSoon"));

const queryClient = new QueryClient();

// Minimal loading fallback
const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0EB' }}>
    <div style={{ width: 32, height: 32, border: '3px solid #E6E0DA', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/dashboard/claim" element={<ClaimReference />} />
            {/* Journal */}
            <Route path="/dashboard/journal" element={<JournalList />} />
            <Route path="/dashboard/journal/new" element={<JournalNew />} />
            <Route path="/dashboard/journal/export" element={<JournalExport />} />
            <Route path="/dashboard/journal/:id" element={<JournalDetail />} />
            <Route path="/dashboard/journal/:id/edit" element={<JournalEdit />} />
            <Route path="/dashboard/affidavit" element={<AffidavitBuilder />} />
            <Route path="/dashboard/habit" element={<HabitDashboard />} />
            <Route path="/dashboard/behavioral-signals" element={<BehavioralSignalDetection />} />
            {/* Safety Tips */}
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
            {/* Blog */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            {/* Legacy /academy redirects */}
            <Route path="/academy" element={<Navigate to="/blog" replace />} />
            <Route path="/academy/:slug" element={<AcademyRedirect />} />
            {/* Partners */}
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/apply" element={<PartnersApply />} />
            {/* WhatsApp */}
            <Route path="/whatsapp" element={<WhatsAppPage />} />
            {/* Shop */}
            <Route path="/shop" element={<Shop />} />
            {/* Coming Soon */}
            <Route path="/habit-coming-soon" element={<HabitComingSoon />} />
            <Route path="/behavioral-signal-coming-soon" element={<BehavioralSignalComingSoon />} />
            <Route path="/api-coming-soon" element={<ApiComingSoon />} />
            <Route path="/redflaq-org-coming-soon" element={<RedflaqOrgComingSoon />} />
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
            <Route path="/admin/verify-payments" element={<AdminVerifyPayments />} />
            <Route path="/admin/merge-review" element={<AdminMergeReview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

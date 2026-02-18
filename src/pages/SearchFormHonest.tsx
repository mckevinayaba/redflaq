import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Shield, Clock, Mail, FileText, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SA_PROVINCES = [
  "Select province (optional)",
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

export default function SearchForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get("payment_id");

  // Form state
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [province, setProvince] = useState("");
  const [courtReference, setCourtReference] = useState("");
  
  // Consent checkboxes
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentLegitimate, setConsentLegitimate] = useState(false);

  // UI state
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [isValidatingPurchase, setIsValidatingPurchase] = useState(true);
  const [paymentValid, setPaymentValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Validation
  const [fullNameError, setFullNameError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Validate purchase ID
  useEffect(() => {
    const validatePayment = async () => {
      const paymentId = searchParams.get("payment_id");
      
      if (!paymentId) {
        setPaymentValid(false);
        setIsValidatingPurchase(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('manual_payments')
          .select('*')
          .eq('payment_id', paymentId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setPaymentValid(false);
          return;
        }

        if (data.credits_used >= data.search_credits) {
          setPaymentValid(false);
          return;
        }

        setPaymentValid(true);
        setPurchaseData({
          credits_remaining: data.search_credits - data.credits_used,
          email: data.email,
          payment_id: data.payment_id
        });
      } catch (error: any) {
        console.error('Payment validation error:', error);
        setPaymentValid(false);
      } finally {
        setIsValidatingPurchase(false);
      }
    };

    validatePayment();
  }, [searchParams]);

  // Sanitize input
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>\"'`]/g, "")
      .slice(0, 100);
  };

  // Validate full name
  const validateFullName = (name: string): boolean => {
    const sanitized = name.trim();
    if (!sanitized || sanitized.length < 3) {
      setFullNameError("Please enter a full name (at least 3 characters)");
      return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(sanitized)) {
      setFullNameError("Please use only letters, spaces, hyphens, and apostrophes");
      return false;
    }
    setFullNameError("");
    return true;
  };

  const isFormValid = 
    fullName.trim().length >= 3 && 
    consentTerms && 
    consentLegitimate && 
    !honeypot;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      console.warn("Bot detected");
      return;
    }

    if (!validateFullName(fullName)) return;

    if (!consentTerms || !consentLegitimate) {
      alert("Please confirm both consent checkboxes");
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 5;
      });
    }, 300);

    try {
      const paymentId = searchParams.get("payment_id");

      // Build search query - credit deduction is now handled server-side
      const searchBody = {
        full_name: sanitizeInput(fullName).trim(),
        date_of_birth: dateOfBirth || undefined,
        province: province && province !== "Select province (optional)" ? province : undefined,
        case_number: courtReference ? sanitizeInput(courtReference).trim() : undefined,
        payment_id: paymentId || undefined,
      };

      const { data: searchResult, error } = await supabase.functions.invoke(
        'multi-parameter-search',
        { body: searchBody }
      );

      if (error) throw new Error(error.message || "Search failed");
      
      if (searchResult?.success) {
        clearInterval(progressInterval);
        setProgress(100);

        sessionStorage.setItem("searchType", "verification");
        sessionStorage.setItem("searchResult", JSON.stringify(searchResult));

        setTimeout(() => {
          navigate(`/results?search_id=${searchResult.searchId}`);
        }, 1000);
      } else {
        throw new Error(searchResult.error || "Search failed");
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      setProgress(0);
      setIsSubmitting(false);
      console.error("Search error:", error);
      alert(error.message || "Search failed. Please try again.");
    }
  };

  // Loading state
  if (isValidatingPurchase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="bg-card rounded-2xl p-12 max-w-md text-center shadow-xl border border-border">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Validating Purchase</h1>
          <p className="text-muted-foreground">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  // Invalid payment state
  if (!paymentValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="bg-card rounded-2xl p-12 max-w-md text-center shadow-xl border border-border">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Invalid or Expired Purchase</h1>
          <p className="text-muted-foreground mb-6">Please complete your payment first to access the verification form.</p>
          <Button onClick={() => navigate("/")} className="w-full bg-primary hover:bg-primary/90">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl text-foreground">REDFLAQ</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-xl mx-auto">
        <div className="bg-card rounded-2xl p-8 md:p-10 shadow-xl border border-border">
          {/* Success Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-risk-green/10 text-risk-green px-4 py-2 rounded-full font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              {purchaseData?.credits_remaining || 0} Verification{purchaseData?.credits_remaining !== 1 ? 's' : ''} Available
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Verify Legal Records
          </h1>
          <p className="text-muted-foreground mb-8">
            We search public government records using the information you provide.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-foreground mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(sanitizeInput(e.target.value))}
                onBlur={() => fullName && validateFullName(fullName)}
                placeholder="First name and surname as they appear on ID"
                maxLength={100}
                className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-colors ${
                  fullNameError ? "border-destructive" : "border-border"
                } focus:outline-none focus:border-primary bg-background`}
                disabled={isSubmitting}
                required
              />
              {fullNameError && <p className="text-sm text-destructive mt-1">{fullNameError}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-foreground mb-2">
                Date of Birth <span className="text-muted-foreground font-normal">(recommended)</span>
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border rounded-xl text-base focus:outline-none focus:border-primary bg-background"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">Helps us verify the correct person</p>
            </div>

            {/* Province */}
            <div>
              <label htmlFor="province" className="block text-sm font-semibold text-foreground mb-2">
                Province <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <select
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border rounded-xl text-base focus:outline-none focus:border-primary bg-background"
                disabled={isSubmitting}
              >
                {SA_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Court Reference */}
            <div>
              <label htmlFor="courtReference" className="block text-sm font-semibold text-foreground mb-2">
                Known Court or Case Reference <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                id="courtReference"
                type="text"
                value={courtReference}
                onChange={(e) => setCourtReference(e.target.value)}
                placeholder="e.g., Case number, court name"
                className="w-full px-4 py-3 border-2 border-border rounded-xl text-base focus:outline-none focus:border-primary bg-background"
                disabled={isSubmitting}
              />
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consentTerms"
                  checked={consentTerms}
                  onCheckedChange={(checked) => setConsentTerms(checked === true)}
                  className="mt-1"
                  disabled={isSubmitting}
                />
                <Label htmlFor="consentTerms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  I have read and agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline" target="_blank">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="consentLegitimate"
                  checked={consentLegitimate}
                  onCheckedChange={(checked) => setConsentLegitimate(checked === true)}
                  className="mt-1"
                  disabled={isSubmitting}
                />
                <Label htmlFor="consentLegitimate" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  I confirm I have a legitimate reason to search this person's public records
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Searching... {progress}%
                </div>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Start Verification
                </>
              )}
            </Button>

            {/* Info Box */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Results in 2-5 minutes (human-verified)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>Report sent to: <strong className="text-foreground">{purchaseData?.email}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 text-primary" />
                <span>Sources: SAPS, Courts (SAFLII), Government Gazette</span>
              </div>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>POPIA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>100% Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
}

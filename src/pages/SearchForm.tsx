import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function SearchForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get("payment_id");

  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [aliases, setAliases] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [nameError, setNameError] = useState("");
  const [idError, setIdError] = useState("");
  const [nameValid, setNameValid] = useState(false);
  const [idValid, setIdValid] = useState(false);

  // Validate payment ID
  const [paymentValid, setPaymentValid] = useState(true);

  useEffect(() => {
    if (!paymentId) {
      setPaymentValid(false);
    }
  }, [paymentId]);

  // Validate full name
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError("Full name is required");
      setNameValid(false);
      return false;
    }
    if (name.trim().length < 3) {
      setNameError("Name must be at least 3 characters");
      setNameValid(false);
      return false;
    }
    const words = name.trim().split(/\s+/);
    if (words.length < 2) {
      setNameError("Please enter both first and last name");
      setNameValid(false);
      return false;
    }
    setNameError("");
    setNameValid(true);
    return true;
  };

  // Validate ID number
  const validateId = (id: string) => {
    if (!id.trim()) {
      setIdError("ID number is required");
      setIdValid(false);
      return false;
    }
    if (!/^\d{13}$/.test(id)) {
      setIdError("Please enter a valid 13-digit South African ID number");
      setIdValid(false);
      return false;
    }
    setIdError("");
    setIdValid(true);
    return true;
  };

  const handleNameBlur = () => {
    validateName(fullName);
  };

  const handleIdBlur = () => {
    validateId(idNumber);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 13);
    setIdNumber(value);
    if (value.length === 13) {
      validateId(value);
    } else {
      setIdValid(false);
    }
  };

  const isFormValid = nameValid && idValid && consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(fullName) || !validateId(idNumber)) {
      return;
    }

    if (!consent) {
      alert("Please confirm that you have read and agree to the terms");
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    // Call backend search API
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-criminal-records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            idNumber,
          }),
        }
      );

      const searchResult = await response.json();
      
      if (searchResult.success) {
        clearInterval(progressInterval);
        setProgress(100);

        // Save search data to sessionStorage
        sessionStorage.setItem("searchName", fullName);
        sessionStorage.setItem("searchIdNumber", idNumber);
        sessionStorage.setItem("searchResult", JSON.stringify(searchResult));
        if (aliases) {
          sessionStorage.setItem("searchAliases", aliases);
        }

        // Redirect to results page
        setTimeout(() => {
          navigate(`/results?search_id=${searchResult.searchId}`);
        }, 1000);
      } else {
        throw new Error(searchResult.error || "Search failed");
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setIsSubmitting(false);
      console.error("Search error:", error);
      alert("Search failed. Please try again.");
    }
  };

  if (!paymentValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #E06055 0%, #C94A47 100%)" }}>
        <div className="bg-white rounded-3xl p-12 max-w-md text-center shadow-2xl">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Invalid Payment</h1>
          <p className="text-gray-600 mb-6">Please complete your payment first to access the search form.</p>
          <Button onClick={() => navigate("/")} className="w-full bg-primary hover:bg-primary/90">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 md:p-12" style={{ background: "linear-gradient(180deg, #E06055 0%, #C94A47 100%)" }}>
      {/* Header */}
      <div className="text-center mb-8">
        <button onClick={() => navigate("/")} className="inline-block">
          <h1 className="text-3xl font-bold text-white font-heading">🔴 REDFLAQ</h1>
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-16 shadow-2xl animate-fade-in">
        {/* Success Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            Payment Successful - 1 Search Credit Available
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-heading">
          Enter His Details
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          We need his full name AND South African ID number for accurate results.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-bold text-gray-900 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="e.g., John David Smith"
                className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-colors duration-200 ${
                  nameError ? "border-red-500" : nameValid ? "border-green-500" : "border-gray-200"
                } focus:outline-none focus:border-primary`}
                disabled={isSubmitting}
                required
              />
              {nameValid && (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
              )}
            </div>
            {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
            <p className="text-xs text-gray-500 mt-2">
              Enter first name, middle name(s), and surname as they appear on his ID document
            </p>
          </div>

          {/* ID Number */}
          <div>
            <label htmlFor="idNumber" className="block text-sm font-bold text-gray-900 mb-2">
              South African ID Number *
            </label>
            <div className="relative">
              <input
                id="idNumber"
                type="text"
                inputMode="numeric"
                value={idNumber}
                onChange={handleIdChange}
                onBlur={handleIdBlur}
                placeholder="e.g., 8001015009087"
                maxLength={13}
                className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-colors duration-200 ${
                  idError ? "border-red-500" : idValid ? "border-green-500" : "border-gray-200"
                } focus:outline-none focus:border-primary`}
                disabled={isSubmitting}
                required
              />
              {idValid && (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
              )}
              {idNumber && !idValid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  {idNumber.length}/13
                </span>
              )}
            </div>
            {idError && <p className="text-sm text-red-600 mt-1">{idError}</p>}
            <p className="text-xs text-gray-500 mt-2">
              13-digit ID number from his driver's license, ID card, or bank statement
            </p>
          </div>

          {/* Aliases */}
          <div>
            <label htmlFor="aliases" className="block text-sm font-bold text-gray-900 mb-2">
              Known Aliases or Previous Names (Optional)
            </label>
            <input
              id="aliases"
              type="text"
              value={aliases}
              onChange={(e) => setAliases(e.target.value)}
              placeholder="e.g., Nickname, previous surname, alias"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary transition-colors duration-200"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-2">
              Helps us find records if he uses different names or has changed his surname
            </p>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              className="mt-1"
              disabled={isSubmitting}
            />
            <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
              I confirm this information is accurate and I have the right to search this person's public criminal records. 
              I understand this search is for personal safety purposes only and will be conducted according to{" "}
              <a href="/privacy-policy" className="text-primary underline hover:text-primary/80">
                South African law (POPIA)
              </a>.
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Searching Databases...
              </span>
            ) : (
              "🔍 Search Criminal Records Now"
            )}
          </Button>

          {/* Progress Indicator */}
          {isSubmitting && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Searching databases... {Math.floor((progress / 100) * 60)} seconds
              </p>
            </div>
          )}

          {!isSubmitting && (
            <p className="text-xs text-gray-500 text-center">
              ⏱️ Typical search time: 30-60 seconds
            </p>
          )}
        </form>

        {/* Information Boxes */}
        <div className="mt-8 space-y-4">
          {/* What We're Searching */}
          <div className="bg-gray-50 border-l-4 border-primary rounded-xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>📊</span> Databases We Search:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>High Court & Magistrate Court criminal convictions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Domestic violence cases and assault charges</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Active and violated protection orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Sexual offense allegations and convictions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Fraud, theft, and property crime records</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Outstanding warrants and court summons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Case history for the last 10 years</span>
              </li>
            </ul>
          </div>

          {/* Privacy Guarantee */}
          <div className="bg-green-50 border-l-4 border-green-600 rounded-xl p-6">
            <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
              <span>🔒</span> 100% Anonymous & Confidential
            </h3>
            <p className="text-sm text-green-800 leading-relaxed">
              Your search is completely private. The person you're checking will NEVER be notified. 
              We don't send alerts, emails, or leave any trace. Only you will see the results. 
              Bank-level encryption protects all searches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertCircle, User, Shield, Gavel, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SearchType = "person" | "police_case" | "protection_order" | "court_case";

export default function SearchForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const purchaseId = searchParams.get("purchase_id");

  // Search type state
  const [searchType, setSearchType] = useState<SearchType>("person");
  
  // Purchase validation state
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [isValidatingPurchase, setIsValidatingPurchase] = useState(true);

  // Person search fields
  const [firstName, setFirstName] = useState("");
  const [middleNames, setMiddleNames] = useState("");
  const [surname, setSurname] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [aliases, setAliases] = useState("");
  
  // Case number search fields
  const [caseNumber, setCaseNumber] = useState("");
  const [policeStation, setPoliceStation] = useState("");
  const [relationship, setRelationship] = useState("");
  
  // Protection order fields
  const [protectionOrderNumber, setProtectionOrderNumber] = useState("");
  const [issuingCourt, setIssuingCourt] = useState("");
  const [orderDate, setOrderDate] = useState("");
  
  // Court case fields
  const [courtCaseNumber, setCourtCaseNumber] = useState("");
  const [courtName, setCourtName] = useState("");
  const [caseType, setCaseType] = useState("");

  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [honeypot, setHoneypot] = useState("");

  // Validation states
  const [firstNameError, setFirstNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [idError, setIdError] = useState("");
  const [caseNumberError, setCaseNumberError] = useState("");
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [surnameValid, setSurnameValid] = useState(false);
  const [idValid, setIdValid] = useState(false);
  const [caseNumberValid, setCaseNumberValid] = useState(false);

  // Validate purchase ID
  const [paymentValid, setPaymentValid] = useState(false);

  useEffect(() => {
    const validatePurchase = async () => {
      if (!purchaseId) {
        setPaymentValid(false);
        setIsValidatingPurchase(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('process-payment', {
          body: {
            action: 'validate-purchase',
            data: { purchaseId }
          }
        });

        if (error) throw error;

        if (data.valid) {
          setPaymentValid(true);
          setPurchaseData(data.purchase);
        } else {
          setPaymentValid(false);
          alert(data.error || 'Invalid purchase');
        }
      } catch (error: any) {
        console.error('Purchase validation error:', error);
        setPaymentValid(false);
      } finally {
        setIsValidatingPurchase(false);
      }
    };

    validatePurchase();
  }, [purchaseId]);

  // Sanitize input to prevent injection attacks
  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/[<>\"'`]/g, "") // Remove dangerous characters
      .slice(0, 50); // Max length
  };

  // Validate name field
  const validateNameField = (name: string, fieldName: string): boolean => {
    const sanitized = name.trim();
    
    if (!sanitized) {
      return false;
    }
    
    if (sanitized.length < 2) {
      return false;
    }
    
    // Only allow letters, spaces, hyphens, apostrophes
    if (!/^[a-zA-Z\s'-]+$/.test(sanitized)) {
      return false;
    }
    
    return true;
  };

  // Validate first name
  const validateFirstName = (name: string) => {
    if (!validateNameField(name, "First name")) {
      setFirstNameError("Please enter a valid first name (letters only)");
      setFirstNameValid(false);
      return false;
    }
    setFirstNameError("");
    setFirstNameValid(true);
    return true;
  };

  // Validate surname
  const validateSurname = (name: string) => {
    if (!validateNameField(name, "Surname")) {
      setSurnameError("Please enter a valid surname (letters only)");
      setSurnameValid(false);
      return false;
    }
    setSurnameError("");
    setSurnameValid(true);
    return true;
  };

  // Luhn algorithm for SA ID checksum validation
  const validateIdChecksum = (id: string): boolean => {
    if (id.length !== 13) return false;
    
    // Extract date of birth (first 6 digits: YYMMDD)
    const year = parseInt(id.substring(0, 2));
    const month = parseInt(id.substring(2, 4));
    const day = parseInt(id.substring(4, 6));
    
    // Validate month and day
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
    
    // Luhn checksum validation
    let sum = 0;
    for (let i = 0; i < 13; i++) {
      let digit = parseInt(id[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    
    return sum % 10 === 0;
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
    if (!validateIdChecksum(id)) {
      setIdError("Invalid ID number (checksum failed). Please verify the number.");
      setIdValid(false);
      return false;
    }
    setIdError("");
    setIdValid(true);
    return true;
  };

  const handleFirstNameBlur = () => {
    if (firstName) validateFirstName(firstName);
  };

  const handleSurnameBlur = () => {
    if (surname) validateSurname(surname);
  };

  const handleIdBlur = () => {
    if (idNumber.length === 13) validateId(idNumber);
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

  // Validate case number format
  const validateCaseNumber = (number: string, type: SearchType) => {
    if (!number.trim()) {
      setCaseNumberError("Case number is required");
      setCaseNumberValid(false);
      return false;
    }
    
    if (type === "police_case" && !/^\d{1,4}\/\d{1,2}\/\d{4}$/.test(number)) {
      setCaseNumberError("Format must be: XXX/DD/YYYY (e.g., 106/10/2024)");
      setCaseNumberValid(false);
      return false;
    }
    
    if (type === "protection_order" && !/^\d{1,4}\/\d{1,2}\/\d{4}$/.test(number)) {
      setCaseNumberError("Format must be: XXX/DD/YYYY (e.g., 123/05/2024)");
      setCaseNumberValid(false);
      return false;
    }
    
    setCaseNumberError("");
    setCaseNumberValid(true);
    return true;
  };

  const isFormValid = 
    searchType === "person" 
      ? firstNameValid && surnameValid && idValid && consent && !honeypot
      : searchType === "police_case" || searchType === "protection_order"
      ? caseNumberValid && consent && !honeypot
      : searchType === "court_case"
      ? courtCaseNumber.trim().length > 0 && consent && !honeypot
      : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detection
    if (honeypot) {
      console.warn("Bot detected");
      return;
    }

    if (!consent) {
      alert("Please confirm that you have read and agree to the terms");
      return;
    }

    let searchBody: any = { searchType };

    // Validate and build search body based on search type
    if (searchType === "person") {
      if (!validateFirstName(firstName) || !validateSurname(surname) || !validateId(idNumber)) {
        return;
      }
      const sanitizedFirstName = sanitizeInput(firstName);
      const sanitizedMiddleNames = sanitizeInput(middleNames);
      const sanitizedSurname = sanitizeInput(surname);
      searchBody = {
        ...searchBody,
        firstName: sanitizedFirstName,
        middleNames: sanitizedMiddleNames || undefined,
        surname: sanitizedSurname,
        idNumber,
      };
    } else if (searchType === "police_case") {
      if (!validateCaseNumber(caseNumber, "police_case")) {
        return;
      }
      searchBody = {
        ...searchBody,
        caseNumber: caseNumber.trim(),
        policeStation: policeStation || undefined,
        relationship: relationship || undefined,
      };
    } else if (searchType === "protection_order") {
      if (!validateCaseNumber(protectionOrderNumber, "protection_order")) {
        return;
      }
      searchBody = {
        ...searchBody,
        protectionOrderNumber: protectionOrderNumber.trim(),
        issuingCourt: issuingCourt || undefined,
        orderDate: orderDate || undefined,
      };
    } else if (searchType === "court_case") {
      if (!courtCaseNumber.trim()) {
        alert("Please enter a court case number");
        return;
      }
      searchBody = {
        ...searchBody,
        courtCaseNumber: courtCaseNumber.trim(),
        courtName: courtName || undefined,
        caseType: caseType || undefined,
      };
    }

    setIsSubmitting(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // First, deduct a credit
      const { data: creditData, error: creditError } = await supabase.functions.invoke('process-payment', {
        body: {
          action: 'use-credit',
          data: { purchaseId }
        }
      });

      if (creditError || !creditData.success) {
        throw new Error(creditData?.error || 'Failed to use credit');
      }

      // Then perform the search
      const { data: searchResult, error } = await supabase.functions.invoke(
        'search-criminal-records',
        { body: searchBody }
      );

      if (error) {
        throw new Error(error.message || "Search failed");
      }
      
      if (searchResult?.success) {
        clearInterval(progressInterval);
        setProgress(100);

        sessionStorage.setItem("searchType", searchType);
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

  if (isValidatingPurchase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #E06055 0%, #C94A47 100%)" }}>
        <div className="bg-white rounded-3xl p-12 max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Validating Purchase</h1>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  if (!paymentValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #E06055 0%, #C94A47 100%)" }}>
        <div className="bg-white rounded-3xl p-12 max-w-md text-center shadow-2xl">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Invalid or Expired Purchase</h1>
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
            Payment Successful - {purchaseData?.credits_remaining || 0} Search Credit{purchaseData?.credits_remaining !== 1 ? 's' : ''} Available
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-heading">
          How would you like to search?
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Choose your search method below
        </p>

        {/* Search Type Selector */}
        <RadioGroup value={searchType} onValueChange={(value) => setSearchType(value as SearchType)} className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Option 1: Person Search */}
          <div className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all ${searchType === "person" ? "border-primary bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
            <RadioGroupItem value="person" id="person" className="absolute top-4 right-4" />
            <Label htmlFor="person" className="cursor-pointer flex items-start gap-3">
              <User className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg text-gray-900 mb-1">Search by Person ⭐</div>
                <div className="text-sm text-gray-600">Search using full name and ID number</div>
              </div>
            </Label>
          </div>

          {/* Option 2: Police Case */}
          <div className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all ${searchType === "police_case" ? "border-primary bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
            <RadioGroupItem value="police_case" id="police_case" className="absolute top-4 right-4" />
            <Label htmlFor="police_case" className="cursor-pointer flex items-start gap-3">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg text-gray-900 mb-1">Police Case Number</div>
                <div className="text-sm text-gray-600">Search using a police case number (XXX/DD/YYYY)</div>
              </div>
            </Label>
          </div>

          {/* Option 3: Protection Order */}
          <div className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all ${searchType === "protection_order" ? "border-primary bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
            <RadioGroupItem value="protection_order" id="protection_order" className="absolute top-4 right-4" />
            <Label htmlFor="protection_order" className="cursor-pointer flex items-start gap-3">
              <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg text-gray-900 mb-1">Protection Order</div>
                <div className="text-sm text-gray-600">Search using a protection order number (XXX/DD/YYYY)</div>
              </div>
            </Label>
          </div>

          {/* Option 4: Court Case */}
          <div className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all ${searchType === "court_case" ? "border-primary bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
            <RadioGroupItem value="court_case" id="court_case" className="absolute top-4 right-4" />
            <Label htmlFor="court_case" className="cursor-pointer flex items-start gap-3">
              <Gavel className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg text-gray-900 mb-1">Court Case Number</div>
                <div className="text-sm text-gray-600">Search using a court case number (A XXX/2024)</div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ position: 'absolute', left: '-9999px' }}
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Dynamic Form Fields Based on Search Type */}
          {searchType === "person" && (
            <>
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-gray-900 mb-2">
                  Name(s) *
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(sanitizeInput(e.target.value))}
                    onBlur={handleFirstNameBlur}
                    placeholder="e.g., John or John David"
                    maxLength={50}
                    className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-colors ${
                      firstNameError ? "border-red-500" : firstNameValid ? "border-green-500" : "border-gray-200"
                    } focus:outline-none focus:border-primary`}
                    disabled={isSubmitting}
                    required
                  />
                  {firstNameValid && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />}
                </div>
                {firstNameError && <p className="text-sm text-red-600 mt-1">{firstNameError}</p>}
                <p className="text-xs text-gray-500 mt-2">First name and middle name(s) as they appear on ID</p>
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-bold text-gray-900 mb-2">
                  Surname *
                </label>
                <div className="relative">
                  <input
                    id="surname"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(sanitizeInput(e.target.value))}
                    onBlur={handleSurnameBlur}
                    placeholder="e.g., Smith"
                    maxLength={50}
                    className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-colors ${
                      surnameError ? "border-red-500" : surnameValid ? "border-green-500" : "border-gray-200"
                    } focus:outline-none focus:border-primary`}
                    disabled={isSubmitting}
                    required
                  />
                  {surnameValid && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />}
                </div>
                {surnameError && <p className="text-sm text-red-600 mt-1">{surnameError}</p>}
                <p className="text-xs text-gray-500 mt-2">Last name / family name as it appears on ID</p>
              </div>

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
                    className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-colors ${
                      idError ? "border-red-500" : idValid ? "border-green-500" : "border-gray-200"
                    } focus:outline-none focus:border-primary`}
                    disabled={isSubmitting}
                    required
                  />
                  {idValid && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />}
                </div>
                {idError && <p className="text-sm text-red-600 mt-1">{idError}</p>}
                <p className="text-xs text-gray-500 mt-2">13-digit ID number from driver's license, ID card, or bank statement</p>
              </div>

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
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary"
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {searchType === "police_case" && (
            <>
              <div>
                <label htmlFor="caseNumber" className="block text-sm font-bold text-gray-900 mb-2">
                  Police Case Number *
                </label>
                <div className="relative">
                  <input
                    id="caseNumber"
                    type="text"
                    value={caseNumber}
                    onChange={(e) => {
                      setCaseNumber(e.target.value.toUpperCase());
                      if (e.target.value) validateCaseNumber(e.target.value, "police_case");
                    }}
                    placeholder="e.g., 106/10/2024"
                    className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-colors ${
                      caseNumberError ? "border-red-500" : caseNumberValid ? "border-green-500" : "border-gray-200"
                    } focus:outline-none focus:border-primary`}
                    disabled={isSubmitting}
                    required
                  />
                  {caseNumberValid && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />}
                </div>
                {caseNumberError && <p className="text-sm text-red-600 mt-1">{caseNumberError}</p>}
                <p className="text-xs text-gray-500 mt-2">Format: XXX/DD/YYYY (e.g., 106/10/2024)</p>
              </div>

              <div>
                <label htmlFor="policeStation" className="block text-sm font-bold text-gray-900 mb-2">
                  Police Station (Optional but Recommended)
                </label>
                <input
                  id="policeStation"
                  type="text"
                  value={policeStation}
                  onChange={(e) => setPoliceStation(e.target.value)}
                  placeholder="e.g., Johannesburg Central"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-2">Helps verify the case faster</p>
              </div>

              <div>
                <label htmlFor="relationship" className="block text-sm font-bold text-gray-900 mb-2">
                  Why are you searching this case? (Optional)
                </label>
                <select
                  id="relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary bg-white"
                  disabled={isSubmitting}
                >
                  <option value="">Select a reason...</option>
                  <option value="victim">I'm the victim/complainant</option>
                  <option value="friend">I'm a friend/family of victim</option>
                  <option value="dating">I'm dating the accused</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          {searchType === "protection_order" && (
            <>
              <div>
                <label htmlFor="protectionOrderNumber" className="block text-sm font-bold text-gray-900 mb-2">
                  Protection Order Number *
                </label>
                <div className="relative">
                  <input
                    id="protectionOrderNumber"
                    type="text"
                    value={protectionOrderNumber}
                    onChange={(e) => {
                      setProtectionOrderNumber(e.target.value.toUpperCase());
                      if (e.target.value) validateCaseNumber(e.target.value, "protection_order");
                    }}
                    placeholder="e.g., 123/05/2024"
                    className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-colors ${
                      caseNumberError ? "border-red-500" : caseNumberValid ? "border-green-500" : "border-gray-200"
                    } focus:outline-none focus:border-primary`}
                    disabled={isSubmitting}
                    required
                  />
                  {caseNumberValid && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />}
                </div>
                {caseNumberError && <p className="text-sm text-red-600 mt-1">{caseNumberError}</p>}
                <p className="text-xs text-gray-500 mt-2">Format: XXX/DD/YYYY (e.g., 123/05/2024)</p>
              </div>

              <div>
                <label htmlFor="issuingCourt" className="block text-sm font-bold text-gray-900 mb-2">
                  Which Court Issued the Order? (Optional)
                </label>
                <select
                  id="issuingCourt"
                  value={issuingCourt}
                  onChange={(e) => setIssuingCourt(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary bg-white"
                  disabled={isSubmitting}
                >
                  <option value="">Select court...</option>
                  <option value="Randburg Magistrate Court">Randburg Magistrate Court</option>
                  <option value="Johannesburg Magistrate Court">Johannesburg Magistrate Court</option>
                  <option value="Pretoria Magistrate Court">Pretoria Magistrate Court</option>
                  <option value="Cape Town Magistrate Court">Cape Town Magistrate Court</option>
                  <option value="Durban Magistrate Court">Durban Magistrate Court</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">Found on the protection order document</p>
              </div>

              <div>
                <label htmlFor="orderDate" className="block text-sm font-bold text-gray-900 mb-2">
                  Date Order Was Issued (Optional)
                </label>
                <input
                  id="orderDate"
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary"
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {searchType === "court_case" && (
            <>
              <div>
                <label htmlFor="courtCaseNumber" className="block text-sm font-bold text-gray-900 mb-2">
                  Court Case Number *
                </label>
                <input
                  id="courtCaseNumber"
                  type="text"
                  value={courtCaseNumber}
                  onChange={(e) => setCourtCaseNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., A 123/2024, RC 456/2024"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary"
                  disabled={isSubmitting}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Format varies by court (A, RC, CCT, etc.)</p>
              </div>

              <div>
                <label htmlFor="courtName" className="block text-sm font-bold text-gray-900 mb-2">
                  Which Court? (Optional)
                </label>
                <select
                  id="courtName"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary bg-white"
                  disabled={isSubmitting}
                >
                  <option value="">Select court...</option>
                  <option value="Johannesburg High Court">Johannesburg High Court</option>
                  <option value="Cape Town High Court">Cape Town High Court</option>
                  <option value="Pretoria High Court">Pretoria High Court</option>
                  <option value="Johannesburg Magistrate Court">Johannesburg Magistrate Court</option>
                </select>
              </div>

              <div>
                <label htmlFor="caseType" className="block text-sm font-bold text-gray-900 mb-2">
                  Type of Case (Optional)
                </label>
                <select
                  id="caseType"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary bg-white"
                  disabled={isSubmitting}
                >
                  <option value="">Select type...</option>
                  <option value="criminal">Criminal case</option>
                  <option value="civil">Civil case</option>
                  <option value="protection_order_app">Protection order application</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

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
            className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Searching Databases...
              </span>
            ) : (
              `🔍 ${
                searchType === "person" ? "Search Criminal Records Now" :
                searchType === "police_case" ? "Search Police Case Now" :
                searchType === "protection_order" ? "Search Protection Order Now" :
                "Search Court Case Now"
              }`
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
          {/* Information Box */}
          <div className="bg-gray-50 border-l-4 border-primary rounded-xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>📊</span> {searchType === "person" ? "Databases We Search:" : "What We'll Find:"}
            </h3>
            {searchType === "person" ? (
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
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="mb-3">
                  When you search by case/order number, we'll show you:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>The accused/respondent's full name and ID number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Complete case details and status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Any related criminal convictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Additional cases involving the same person</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Protection orders or other legal actions</span>
                  </li>
                </ul>
                <p className="mt-3">
                  You can then search that person by name to see their full criminal history.
                </p>
              </div>
            )}
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

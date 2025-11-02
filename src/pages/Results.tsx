import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Home, Search, AlertTriangle, ShieldAlert, ShieldCheck, User, Phone } from "lucide-react";
import { toast } from "sonner";

interface WantedPerson {
  id: string;
  full_name: string;
  first_name: string;
  surname: string;
  charges: string;
  photo_url?: string;
  detail_page_url?: string;
}

interface SearchResultData {
  searchId: string;
  searchType?: string;
  searchIdentifier?: string;
  fullName?: string;
  idNumber?: string;
  riskLevel: string;
  riskScore: number;
  isWanted: boolean;
  wantedPersonsCount: number;
  wantedPersons: WantedPerson[];
  searchedAt: string;
}

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResultData | null>(null);
  const searchId = searchParams.get("search_id");

  useEffect(() => {
    if (!searchId) {
      toast.error("Invalid search ID");
      navigate("/");
      return;
    }

    // Retrieve search results from sessionStorage
    const storedResult = sessionStorage.getItem("searchResult");
    
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResults(parsedResult);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing search result:", error);
        toast.error("Failed to load search results");
        navigate("/");
      }
    } else {
      // Fallback for testing
      setResults({
        searchId,
        fullName: sessionStorage.getItem("searchName") || "Test Person",
        idNumber: sessionStorage.getItem("searchIdNumber") || "",
        riskLevel: "GREEN",
        riskScore: 0,
        isWanted: false,
        wantedPersonsCount: 0,
        wantedPersons: [],
        searchedAt: new Date().toISOString(),
      });
      setLoading(false);
    }
  }, [searchId, navigate]);

  const getRiskBadgeColor = (level: string) => {
    switch (level.toUpperCase()) {
      case "RED":
        return "bg-red-600 text-white";
      case "ORANGE":
        return "bg-orange-500 text-white";
      case "YELLOW":
        return "bg-yellow-500 text-white";
      default:
        return "bg-green-600 text-white";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toUpperCase()) {
      case "RED":
        return <ShieldAlert className="h-8 w-8" />;
      case "ORANGE":
      case "YELLOW":
        return <AlertTriangle className="h-8 w-8" />;
      default:
        return <ShieldCheck className="h-8 w-8" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Wanted Alert Banner */}
        {results.isWanted && (
          <div className="mb-8 animate-pulse">
            <Card className="border-0 overflow-hidden shadow-2xl">
              <div 
                className="relative bg-red-600 text-white p-8 md:p-12 text-center"
                style={{
                  background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              >
                <div className="absolute inset-0 bg-red-600/20 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                    🚨 EXTREME ALERT - WANTED BY SAPS
                  </h1>
                  <p className="text-lg md:text-xl font-semibold leading-relaxed">
                    THIS PERSON IS CURRENTLY WANTED BY THE SOUTH AFRICAN POLICE SERVICE
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Search Summary Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl mb-2">
                  {results.searchType === "person" ? "Criminal Record Search Results" :
                   results.searchType === "police_case" ? "Police Case Search Results" :
                   results.searchType === "protection_order" ? "Protection Order Search Results" :
                   results.searchType === "court_case" ? "Court Case Search Results" :
                   "Search Results"}
                </CardTitle>
                <CardDescription className="text-base">
                  Search ID: {results.searchId}
                </CardDescription>
              </div>
              <Badge className={`${getRiskBadgeColor(results.riskLevel)} text-lg px-4 py-2 flex items-center gap-2`}>
                {getRiskIcon(results.riskLevel)}
                {results.riskLevel} RISK
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">
                  {results.searchType === "person" ? "Full Name" : "Search Query"}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {results.searchIdentifier || results.fullName || "N/A"}
                </p>
              </div>
              {results.idNumber && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">ID Number</p>
                  <p className="text-lg font-mono text-gray-900">{results.idNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Search Completed</p>
                <p className="text-lg text-gray-900">
                  {new Date(results.searchedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wanted Persons Details */}
        {results.isWanted && results.wantedPersons.map((person) => (
          <Card 
            key={person.id} 
            className="mb-8 border-l-8 border-red-600 shadow-2xl overflow-hidden"
            style={{
              boxShadow: "0 10px 40px rgba(220, 38, 38, 0.3)",
            }}
          >
            <CardContent className="p-8">
              <div className="grid md:grid-cols-[200px_1fr] gap-8">
                {/* Photo Column */}
                <div className="flex justify-center md:justify-start">
                  {person.photo_url ? (
                    <img
                      src={person.photo_url}
                      alt={person.full_name}
                      className="w-48 h-48 object-cover rounded-xl border-4 border-red-600 shadow-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-red-50 border-4 border-red-600 rounded-xl flex items-center justify-center">
                      <User className="w-20 h-20 text-red-600" />
                    </div>
                  )}
                </div>

                {/* Details Column */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-red-600 mb-2">
                      {person.full_name}
                    </h2>
                  <div className="space-y-2">
                      <div>
                        <span className="text-sm font-bold text-gray-600">Wanted For:</span>
                        <p className="text-xl font-bold text-red-600">{person.charges}</p>
                      </div>
                      {person.detail_page_url && (
                        <a
                          href={person.detail_page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-700 hover:text-red-800 underline font-semibold inline-flex items-center gap-1"
                        >
                          View Full SAPS Listing →
                        </a>
                      )}
                      {(results.searchType === "police_case" || results.searchType === "protection_order" || results.searchType === "court_case") && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-900 font-semibold mb-2">
                            ℹ️ Match found through {
                              results.searchType === "police_case" ? "police case number" :
                              results.searchType === "protection_order" ? "protection order" :
                              "court case number"
                            }
                          </p>
                          <p className="text-sm text-blue-800">
                            You can now search this person by name and ID to see their full criminal history.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Warning Box */}
                  <div className="bg-red-50 border-3 border-red-600 p-6 rounded-xl mt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">⚠️</span>
                      <h3 className="text-xl font-bold text-red-900">
                        DO NOT APPROACH THIS PERSON
                      </h3>
                    </div>
                    <p className="text-red-900 leading-relaxed mb-4">
                      If you have seen this person or know their whereabouts, contact:
                    </p>
                    <ul className="space-y-2 text-red-900 mb-6">
                      <li>• <strong>SAPS Emergency:</strong> 10111</li>
                      <li>• <strong>Crime Stop:</strong> 08600 10111 (Anonymous tips)</li>
                      <li>• <strong>Your nearest police station</strong></li>
                    </ul>
                    <p className="text-sm text-red-900 font-semibold">
                      DO NOT confront them. DO NOT meet them alone. Share this information with a trusted friend or family member immediately.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <Button
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white h-14 text-base font-bold"
                      onClick={() => window.location.href = 'tel:10111'}
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Call SAPS Emergency (10111)
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-red-600 text-red-600 hover:bg-red-50 h-14 text-base font-bold"
                      onClick={() => window.location.href = 'tel:0860010111'}
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Crime Stop Anonymous Tip
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Not Wanted Badge */}
        {!results.isWanted && (
          <Card className="mb-8 border-l-4 border-green-600 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <p className="text-green-900 font-semibold">
                  ✅ Not Wanted by SAPS
                </p>
              </div>
              <p className="text-green-800 mt-2">
                This person is not currently listed as wanted by the South African Police Service.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <Card className="mb-8 bg-gray-50">
          <CardHeader>
            <CardTitle>About This Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>• This search checked the official SAPS wanted persons database</p>
            <p>• Data is updated daily from public SAPS records</p>
            <p>• This is a preliminary check and should not be considered a complete background verification</p>
            <p>• For comprehensive criminal record checks, contact SAPS directly</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/search-form")}
            className="w-full"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Another Person
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {/* Implement PDF download */}}
            className="w-full"
          >
            <Download className="mr-2 h-5 w-5" />
            Download PDF Report
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate("/")}
            className="w-full"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Homepage
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 border-2 border-gray-300 bg-gray-50">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-2">Important Disclaimer</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              This report is provided for informational purposes only and should not be the sole basis for making decisions about relationships, employment, or legal matters. The information is sourced from publicly available SAPS records and may not be complete or up-to-date. RedFlaq is not responsible for any decisions made based on this information. For official criminal record checks, contact SAPS directly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;

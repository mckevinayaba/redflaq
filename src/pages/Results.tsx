import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Home, Search, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface SearchResult {
  searchId: string;
  personName: string;
  idNumber: string;
  timestamp: string;
  riskLevel: "red" | "orange" | "yellow" | "clear";
  criminalConvictions: Array<{
    date: string;
    caseNumber: string;
    offense: string;
    sentence: string;
  }>;
  protectionOrders: Array<{
    date: string;
    caseNumber: string;
    type: string;
    status: string;
  }>;
  courtCases: Array<{
    date: string;
    caseNumber: string;
    type: string;
    status: string;
  }>;
  warrants: Array<{
    date: string;
    warrantNumber: string;
    type: string;
    status: string;
  }>;
}

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResult | null>(null);
  const searchId = searchParams.get("search_id");

  useEffect(() => {
    if (!searchId) {
      toast.error("Invalid search ID");
      navigate("/");
      return;
    }

    // Simulate API call to fetch results
    setTimeout(() => {
      // Generate demo results based on search_id
      const demoResults = generateDemoResults(searchId);
      setResults(demoResults);
      setLoading(false);
    }, 2000);
  }, [searchId, navigate]);

  const generateDemoResults = (searchId: string): SearchResult => {
    // Retrieve from sessionStorage if available
    const storedName = sessionStorage.getItem("searchName") || "John Doe";
    const storedId = sessionStorage.getItem("searchIdNumber") || "9001015800089";

    // Generate random risk level based on searchId hash
    const hash = searchId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const riskLevels: Array<"red" | "orange" | "yellow" | "clear"> = ["red", "orange", "yellow", "clear"];
    const riskLevel = riskLevels[hash % 4];

    const baseResult: SearchResult = {
      searchId,
      personName: storedName,
      idNumber: storedId,
      timestamp: new Date().toLocaleString(),
      riskLevel,
      criminalConvictions: [],
      protectionOrders: [],
      courtCases: [],
      warrants: [],
    };

    // Add records based on risk level
    if (riskLevel === "red") {
      baseResult.criminalConvictions = [
        {
          date: "2019-03-15",
          caseNumber: "CC-2019-1234",
          offense: "Assault with Intent to Cause Grievous Bodily Harm",
          sentence: "5 years imprisonment (suspended)",
        },
        {
          date: "2021-07-22",
          caseNumber: "CC-2021-5678",
          offense: "Fraud",
          sentence: "3 years imprisonment + R50,000 fine",
        },
      ];
      baseResult.warrants = [
        {
          date: "2023-11-10",
          warrantNumber: "W-2023-9876",
          type: "Arrest Warrant",
          status: "Active",
        },
      ];
    } else if (riskLevel === "orange") {
      baseResult.protectionOrders = [
        {
          date: "2020-06-12",
          caseNumber: "PO-2020-3456",
          type: "Domestic Violence Protection Order",
          status: "Active",
        },
      ];
      baseResult.courtCases = [
        {
          date: "2022-09-05",
          caseNumber: "MC-2022-7890",
          type: "Theft",
          status: "Pending",
        },
      ];
    } else if (riskLevel === "yellow") {
      baseResult.courtCases = [
        {
          date: "2021-02-18",
          caseNumber: "MC-2021-4567",
          type: "Reckless Driving",
          status: "Closed - Fine Paid",
        },
      ];
    }

    return baseResult;
  };

  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case "red":
        return {
          icon: ShieldAlert,
          label: "RED FLAG",
          description: "Serious criminal records found",
          bgColor: "bg-destructive",
          textColor: "text-destructive-foreground",
          badgeColor: "bg-red-600 text-white",
        };
      case "orange":
        return {
          icon: AlertTriangle,
          label: "ORANGE FLAG",
          description: "Moderate concerns found",
          bgColor: "bg-orange-500",
          textColor: "text-white",
          badgeColor: "bg-orange-500 text-white",
        };
      case "yellow":
        return {
          icon: AlertTriangle,
          label: "YELLOW FLAG",
          description: "Minor issues found",
          bgColor: "bg-yellow-500",
          textColor: "text-white",
          badgeColor: "bg-yellow-500 text-white",
        };
      default:
        return {
          icon: ShieldCheck,
          label: "ALL CLEAR",
          description: "No criminal records found",
          bgColor: "bg-green-600",
          textColor: "text-white",
          badgeColor: "bg-green-600 text-white",
        };
    }
  };

  const handleDownloadPDF = () => {
    toast.success("PDF report will be available soon!");
    // TODO: Implement PDF generation
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E06055] to-[#C94A47] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6" />
            <h2 className="text-2xl font-heading font-bold mb-2">Processing Your Search</h2>
            <p className="text-muted-foreground">Scanning criminal records database...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E06055] to-[#C94A47] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl font-heading font-bold mb-2">Search Not Found</h2>
            <p className="text-muted-foreground mb-6">Unable to retrieve search results.</p>
            <Button onClick={() => navigate("/")} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskConfig = getRiskConfig(results.riskLevel);
  const RiskIcon = riskConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E06055] to-[#C94A47] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
            REDFLAQ
          </h1>
          <p className="text-white/90">Criminal Background Check Results</p>
        </div>

        {/* Results Card */}
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-6">
            <Badge className="mx-auto mb-4 bg-green-600 text-white hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Search Complete
            </Badge>
            <CardTitle className="text-3xl font-heading">Search Results</CardTitle>
            <CardDescription>
              <div className="mt-2 space-y-1">
                <p><strong>Name:</strong> {results.personName}</p>
                <p><strong>ID Number:</strong> {results.idNumber}</p>
                <p><strong>Search ID:</strong> {results.searchId}</p>
                <p className="text-xs text-muted-foreground mt-2">Completed: {results.timestamp}</p>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Risk Indicator */}
            <div className={`${riskConfig.bgColor} ${riskConfig.textColor} rounded-xl p-8 text-center`}>
              <RiskIcon className="w-20 h-20 mx-auto mb-4" />
              <h2 className="text-3xl font-heading font-bold mb-2">{riskConfig.label}</h2>
              <p className="text-lg">{riskConfig.description}</p>
            </div>

            <Separator />

            {/* Criminal Convictions */}
            <div>
              <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                Criminal Convictions
              </h3>
              {results.criminalConvictions.length > 0 ? (
                <div className="space-y-4">
                  {results.criminalConvictions.map((conviction, index) => (
                    <Card key={index} className="bg-destructive/5 border-destructive/20">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p><strong>Date:</strong> {conviction.date}</p>
                          <p><strong>Case #:</strong> {conviction.caseNumber}</p>
                          <p className="md:col-span-2"><strong>Offense:</strong> {conviction.offense}</p>
                          <p className="md:col-span-2"><strong>Sentence:</strong> {conviction.sentence}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center text-green-700">
                    <ShieldCheck className="h-8 w-8 mx-auto mb-2" />
                    No criminal convictions found
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Protection Orders */}
            <div>
              <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Protection Orders
              </h3>
              {results.protectionOrders.length > 0 ? (
                <div className="space-y-4">
                  {results.protectionOrders.map((order, index) => (
                    <Card key={index} className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p><strong>Date:</strong> {order.date}</p>
                          <p><strong>Case #:</strong> {order.caseNumber}</p>
                          <p className="md:col-span-2"><strong>Type:</strong> {order.type}</p>
                          <p><strong>Status:</strong> <Badge className="ml-2" variant="outline">{order.status}</Badge></p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center text-green-700">
                    <ShieldCheck className="h-8 w-8 mx-auto mb-2" />
                    No protection orders found
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Court Cases */}
            <div>
              <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Court Cases
              </h3>
              {results.courtCases.length > 0 ? (
                <div className="space-y-4">
                  {results.courtCases.map((courtCase, index) => (
                    <Card key={index} className="bg-yellow-50 border-yellow-200">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p><strong>Date:</strong> {courtCase.date}</p>
                          <p><strong>Case #:</strong> {courtCase.caseNumber}</p>
                          <p className="md:col-span-2"><strong>Type:</strong> {courtCase.type}</p>
                          <p><strong>Status:</strong> <Badge className="ml-2" variant="outline">{courtCase.status}</Badge></p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center text-green-700">
                    <ShieldCheck className="h-8 w-8 mx-auto mb-2" />
                    No court cases found
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Warrants */}
            <div>
              <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                Warrants
              </h3>
              {results.warrants.length > 0 ? (
                <div className="space-y-4">
                  {results.warrants.map((warrant, index) => (
                    <Card key={index} className="bg-destructive/5 border-destructive/20">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p><strong>Date:</strong> {warrant.date}</p>
                          <p><strong>Warrant #:</strong> {warrant.warrantNumber}</p>
                          <p className="md:col-span-2"><strong>Type:</strong> {warrant.type}</p>
                          <p><strong>Status:</strong> <Badge className="ml-2 bg-red-600 text-white">{warrant.status}</Badge></p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center text-green-700">
                    <ShieldCheck className="h-8 w-8 mx-auto mb-2" />
                    No warrants found
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button onClick={handleDownloadPDF} size="lg" className="w-full">
                <Download className="mr-2 h-5 w-5" />
                Download Full PDF Report
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => navigate("/search-form?payment_id=new-search")}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Another Person
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Return to Homepage
                </Button>
              </div>
            </div>

            {/* Disclaimer */}
            <Card className="bg-muted">
              <CardContent className="p-4 text-xs text-muted-foreground">
                <p className="font-semibold mb-2">Important Disclaimer:</p>
                <p>
                  This report is based on publicly available records and may not include all relevant information.
                  Records may be incomplete, outdated, or contain errors. This report should not be used as the sole
                  basis for making employment, housing, or other important decisions. Always verify information through
                  official channels.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;

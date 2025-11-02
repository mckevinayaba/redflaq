import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Database, CheckCircle2, AlertCircle, Upload, Users } from "lucide-react";

interface ScraperResult {
  success: boolean;
  total_scraped?: number;
  new_records?: number;
  updated_records?: number;
  deactivated_records?: number;
  errors?: string[];
  scrapedAt?: string;
  error?: string;
}

const AdminScraper = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [dbStats, setDbStats] = useState({ total: 0, active: 0 });

  useState(() => {
    fetchDbStats();
  });

  const fetchDbStats = async () => {
    const { count: total } = await supabase
      .from("wanted_persons")
      .select("*", { count: "exact", head: true });

    const { count: active } = await supabase
      .from("wanted_persons")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    setDbStats({ total: total || 0, active: active || 0 });
  };

  const runScraper = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log("Starting SAPS scraper...");
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrape-saps-wanted`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data: ScraperResult = await response.json();
      console.log("Scraper result:", data);

      setResult(data);
      setLastRun(new Date().toLocaleString());

      if (data.success) {
        await fetchDbStats();
        toast({
          title: "✅ Scraper completed successfully!",
          description: `Scraped ${data.total_scraped} persons. ${data.new_records} new, ${data.updated_records} updated, ${data.deactivated_records} deactivated.`,
        });
      } else {
        toast({
          title: "❌ Scraper failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error running scraper:", error);
      toast({
        title: "❌ Request failed",
        description: error instanceof Error ? error.message : "Failed to connect to scraper",
        variant: "destructive",
      });
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">SAPS Data Management</h1>
            <p className="text-muted-foreground">
              Manage wanted persons data via automatic scraper or manual import
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/import")}>
              <Upload className="h-4 w-4 mr-2" />
              Manual Import
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>

        {/* Database Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Database Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-3xl font-bold">{dbStats.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Records</p>
              <p className="text-3xl font-bold text-green-600">{dbStats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Scraper Control</h2>
              {lastRun && (
                <p className="text-sm text-muted-foreground">
                  Last run: {lastRun}
                </p>
              )}
            </div>
            <Button
              onClick={runScraper}
              disabled={isLoading}
              size="lg"
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-5 w-5" />
                  Run SAPS Scraper
                </>
              )}
            </Button>
          </div>

          {result && (
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-2">
                {result.success ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-green-600">
                      Scraper Completed Successfully
                    </h3>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    <h3 className="text-xl font-semibold text-destructive">
                      Scraper Failed
                    </h3>
                  </>
                )}
              </div>

              {result.success && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Scraped</p>
                    <p className="text-3xl font-bold text-primary">
                      {result.total_scraped}
                    </p>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">New Records</p>
                    <p className="text-3xl font-bold text-green-600">
                      {result.new_records}
                    </p>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Updated</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {result.updated_records}
                    </p>
                  </div>
                  <div className="bg-orange-500/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Deactivated</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {result.deactivated_records}
                    </p>
                  </div>
                </div>
              )}

              {result.error && (
                <div className="bg-destructive/10 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-destructive mb-2">
                    Error Details:
                  </p>
                  <p className="text-sm text-destructive/90">{result.error}</p>
                </div>
              )}

              {result.errors && result.errors.length > 0 && (
                <div className="bg-orange-500/10 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-orange-600 mb-2">
                    Partial Errors ({result.errors.length}):
                  </p>
                  <ul className="text-xs text-orange-600/90 space-y-1 max-h-40 overflow-auto">
                    {result.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.scrapedAt && (
                <p className="text-xs text-muted-foreground">
                  Completed at: {new Date(result.scrapedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-3">About This Tool</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Scrapes the official SAPS wanted persons list from{" "}
              <code className="text-xs bg-background px-1 py-0.5 rounded">
                saps.gov.za
              </code>
            </li>
            <li>
              • Extracts names, charges, photos, and detail page URLs for 300+
              wanted persons
            </li>
            <li>
              • Updates existing records and adds new ones to the database
            </li>
            <li>
              • Marks persons as inactive if not found in the latest scrape
              (removed from SAPS list)
            </li>
            <li>• Can be scheduled to run automatically daily at 2:00 AM</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminScraper;

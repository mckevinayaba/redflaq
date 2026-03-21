import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Database, CheckCircle2, AlertCircle, Upload, Users, FileSearch, Globe, ClipboardPaste } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ScraperResult {
  success: boolean;
  total_scraped?: number;
  details_fetched?: number;
  new_records?: number;
  updated_records?: number;
  deactivated_records?: number;
  errors?: string[];
  scrapedAt?: string;
  error?: string;
}

interface DetailScraperResult {
  success: boolean;
  processed?: number;
  failed?: number;
  remaining?: number;
  message?: string;
  errors?: string[];
  error?: string;
}

interface SapswantedResult {
  success: boolean;
  total_parsed?: number;
  enriched?: number;
  inserted?: number;
  skipped?: number;
  errors?: string[];
  error?: string;
  message?: string;
}

const AdminScraper = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);
  const [detailResult, setDetailResult] = useState<DetailScraperResult | null>(null);
  const [isLoadingSapswanted, setIsLoadingSapswanted] = useState(false);
  const [sapswantedResult, setSapswantedResult] = useState<SapswantedResult | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [csvText, setCsvText] = useState("");
  const [isImportingCsv, setIsImportingCsv] = useState(false);
  const [csvImportResult, setCsvImportResult] = useState<{ inserted: number; updated: number; skipped: number; errors: string[] } | null>(null);
  const [dbStats, setDbStats] = useState({ total: 0, active: 0, withDetails: 0, needingDetails: 0 });

  useEffect(() => {
    fetchDbStats();
  }, []);

  const fetchDbStats = async () => {
    const { count: total } = await supabase
      .from("wanted_persons")
      .select("*", { count: "exact", head: true });

    const { count: active } = await supabase
      .from("wanted_persons")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    const { count: withDetails } = await supabase
      .from("wanted_persons")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .not("case_number", "is", null)
      .neq("case_number", "NOT_FOUND");

    const { count: needingDetails } = await supabase
      .from("wanted_persons")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .is("case_number", null)
      .not("detail_page_url", "is", null);

    setDbStats({ 
      total: total || 0, 
      active: active || 0, 
      withDetails: withDetails || 0,
      needingDetails: needingDetails || 0,
    });
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
          description: `Scraped ${data.total_scraped} persons (${data.details_fetched || 0} with details). ${data.new_records} new, ${data.updated_records} updated.`,
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

  const runDetailScraper = async () => {
    setIsLoadingDetails(true);
    setDetailResult(null);

    try {
      console.log("Starting detail scraper...");
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrape-saps-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data: DetailScraperResult = await response.json();
      console.log("Detail scraper result:", data);

      setDetailResult(data);

      if (data.success) {
        await fetchDbStats();
        if (data.message) {
          toast({
            title: "✅ All records processed!",
            description: data.message,
          });
        } else {
          toast({
            title: "✅ Detail scrape completed!",
            description: `Processed ${data.processed} records. ${data.remaining} remaining.`,
          });
        }
      } else {
        toast({
          title: "❌ Detail scraper failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error running detail scraper:", error);
      toast({
        title: "❌ Request failed",
        description: error instanceof Error ? error.message : "Failed to connect to detail scraper",
        variant: "destructive",
      });
      setDetailResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const detailProgress = dbStats.active > 0 
    ? ((dbStats.withDetails / dbStats.active) * 100) 
    : 0;

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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-3xl font-bold">{dbStats.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Records</p>
                <p className="text-3xl font-bold text-primary">{dbStats.active}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">With Case Numbers</p>
                <p className="text-3xl font-bold text-primary">{dbStats.withDetails}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Needing Details</p>
                <p className="text-3xl font-bold text-muted-foreground">{dbStats.needingDetails}</p>
              </div>
            </div>
            
            {/* Detail Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Detail Scraping Progress</span>
                <span className="font-medium">{dbStats.withDetails} / {dbStats.active} ({detailProgress.toFixed(0)}%)</span>
              </div>
              <Progress value={detailProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Main Scraper Control */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Main Scraper</h2>
              <p className="text-sm text-muted-foreground">
                Fetches the list of wanted persons from SAPS website
              </p>
              {lastRun && (
                <p className="text-xs text-muted-foreground">
                  Last run: {lastRun}
                </p>
              )}
            </div>
            <Button
              onClick={runScraper}
              disabled={isLoading || isLoadingDetails}
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
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold text-primary">
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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 rounded-lg" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
                    <p className="text-sm text-muted-foreground">Total Scraped</p>
                    <p className="text-3xl font-bold text-primary">
                      {result.total_scraped}
                    </p>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Details Fetched</p>
                    <p className="text-3xl font-bold text-secondary-foreground">
                      {result.details_fetched || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
                    <p className="text-sm text-muted-foreground">New Records</p>
                    <p className="text-3xl font-bold text-primary">
                      {result.new_records}
                    </p>
                  </div>
                  <div className="bg-accent p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Updated</p>
                    <p className="text-3xl font-bold text-accent-foreground">
                      {result.updated_records}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Deactivated</p>
                    <p className="text-3xl font-bold text-muted-foreground">
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
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Partial Errors ({result.errors.length}):
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 max-h-40 overflow-auto">
                    {result.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Detail Scraper Control */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Detail Scraper</h2>
              <p className="text-sm text-muted-foreground">
                Fetches case numbers, police stations from individual detail pages (5 at a time)
              </p>
            </div>
            <Button
              onClick={runDetailScraper}
              disabled={isLoading || isLoadingDetails || dbStats.needingDetails === 0}
              size="lg"
              variant="secondary"
              className="min-w-[200px]"
            >
              {isLoadingDetails ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Fetching Details...
                </>
              ) : (
                <>
                  <FileSearch className="mr-2 h-5 w-5" />
                  Fetch Missing Details
                </>
              )}
            </Button>
          </div>

          {detailResult && (
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-2">
                {detailResult.success ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold text-primary">
                      {detailResult.message || `Processed ${detailResult.processed} records`}
                    </h3>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    <h3 className="text-xl font-semibold text-destructive">
                      Detail Scraper Failed
                    </h3>
                  </>
                )}
              </div>

              {detailResult.success && !detailResult.message && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
                    <p className="text-sm text-muted-foreground">Processed</p>
                    <p className="text-3xl font-bold text-primary">
                      {detailResult.processed}
                    </p>
                  </div>
                  <div className="bg-destructive/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-3xl font-bold text-destructive">
                      {detailResult.failed}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-3xl font-bold text-muted-foreground">
                      {detailResult.remaining}
                    </p>
                  </div>
                </div>
              )}

              {detailResult.error && (
                <div className="bg-destructive/10 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-destructive mb-2">
                    Error Details:
                  </p>
                  <p className="text-sm text-destructive/90">{detailResult.error}</p>
                </div>
              )}

              {detailResult.errors && detailResult.errors.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Errors ({detailResult.errors.length}):
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 max-h-40 overflow-auto">
                    {detailResult.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* SAPS Wanted Import */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">SAPS Wanted Import</h2>
              <p className="text-sm text-muted-foreground">
                Enriches records from sapswanted.netlify.app (merge only, never overwrites OpenSanctions)
              </p>
            </div>
            <Button
              onClick={async () => {
                setIsLoadingSapswanted(true);
                setSapswantedResult(null);
                try {
                  const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/import-sapswanted`,
                    { method: "POST", headers: { "Content-Type": "application/json" } }
                  );
                  const data: SapswantedResult = await response.json();
                  setSapswantedResult(data);
                  if (data.success) {
                    await fetchDbStats();
                    toast({
                      title: "✅ SAPS Wanted import complete!",
                      description: `Parsed ${data.total_parsed}. Enriched ${data.enriched}, inserted ${data.inserted}, skipped ${data.skipped}.`,
                    });
                  } else {
                    toast({ title: "❌ Import failed", description: data.error || data.message, variant: "destructive" });
                  }
                } catch (error) {
                  toast({ title: "❌ Request failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
                  setSapswantedResult({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
                } finally {
                  setIsLoadingSapswanted(false);
                }
              }}
              disabled={isLoading || isLoadingDetails || isLoadingSapswanted}
              size="lg"
              variant="outline"
              className="min-w-[200px]"
            >
              {isLoadingSapswanted ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-5 w-5" />
                  Import SAPS Wanted
                </>
              )}
            </Button>
          </div>

          {sapswantedResult && (
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-2">
                {sapswantedResult.success ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold text-primary">
                      {sapswantedResult.message || `Parsed ${sapswantedResult.total_parsed} persons`}
                    </h3>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    <h3 className="text-xl font-semibold text-destructive">Import Failed</h3>
                  </>
                )}
              </div>

              {sapswantedResult.success && !sapswantedResult.message && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
                    <p className="text-sm text-muted-foreground">Enriched</p>
                    <p className="text-3xl font-bold text-primary">{sapswantedResult.enriched}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
                    <p className="text-sm text-muted-foreground">Inserted</p>
                    <p className="text-3xl font-bold text-primary">{sapswantedResult.inserted}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Skipped</p>
                    <p className="text-3xl font-bold text-muted-foreground">{sapswantedResult.skipped}</p>
                  </div>
                </div>
              )}

              {sapswantedResult.error && (
                <div className="bg-destructive/10 p-4 rounded-lg">
                  <p className="text-sm text-destructive">{sapswantedResult.error}</p>
                </div>
              )}

              {sapswantedResult.errors && sapswantedResult.errors.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Errors ({sapswantedResult.errors.length}):</p>
                  <ul className="text-xs text-muted-foreground space-y-1 max-h-40 overflow-auto">
                    {sapswantedResult.errors.map((error, i) => <li key={i}>• {error}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* CSV Paste Import */}
        <Card className="p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <ClipboardPaste className="h-5 w-5" />
              CSV Paste Import
            </h2>
            <p className="text-sm text-muted-foreground">
              Paste CSV rows with format: "Name","Crime","Status","details_url" — one per line. Skips "Unknown Unknown".
            </p>
          </div>
          <Textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`"Nsibande Sipho Doctor","Rape","Wanted","https://www.saps.gov.za/crimestop/wanted/detail.php?bid=18639"\n"Ndlovu Abby","Attempted Murder","Wanted","https://www.saps.gov.za/crimestop/wanted/detail.php?bid=18638"`}
            rows={8}
            className="font-mono text-xs"
          />
          <div className="flex items-center gap-4">
            <Button
              disabled={isImportingCsv || !csvText.trim()}
              onClick={async () => {
                setIsImportingCsv(true);
                setCsvImportResult(null);
                try {
                  const lines = csvText.trim().split('\n').filter(l => l.trim());
                  const records: Array<{ name: string; crime: string; status: string; url: string }> = [];
                  for (const line of lines) {
                    const match = line.match(/"([^"]+)","([^"]+)","([^"]+)","([^"]+)"/);
                    if (!match) continue;
                    const [, name, crime, status, url] = match;
                    if (name === 'Unknown Unknown' || name === 'name') continue;
                    records.push({ name, crime, status, url });
                  }
                  if (records.length === 0) {
                    toast({ title: "No valid rows found", variant: "destructive" });
                    setIsImportingCsv(false);
                    return;
                  }

                  const categorize = (c: string) => {
                    const cl = c.toLowerCase();
                    if (cl.includes('murder') || cl.includes('homicide')) return ['Murder/Homicide'];
                    if (cl.includes('rape') || cl.includes('sexual')) return ['Sexual Offenses'];
                    if (cl.includes('robbery') || cl.includes('theft') || cl.includes('burglary') || cl.includes('housebreaking') || cl.includes('shoplifting') || cl.includes('stolen')) return ['Robbery/Theft'];
                    if (cl.includes('fraud') || cl.includes('forgery') || cl.includes('corruption')) return ['Fraud/Financial Crime'];
                    if (cl.includes('assault') || cl.includes('gbh')) return ['Assault'];
                    if (cl.includes('drug') || cl.includes('mandrax') || cl.includes('dealing')) return ['Drug Offenses'];
                    if (cl.includes('kidnap') || cl.includes('abduction')) return ['Kidnapping'];
                    return ['Other'];
                  };
                  const riskLevel = (c: string) => {
                    const cl = c.toLowerCase();
                    if (cl.includes('murder') || cl.includes('rape') || cl.includes('armed robbery')) return 'red';
                    if (cl.includes('shoplifting') || cl.includes('driving under')) return 'yellow';
                    return 'orange';
                  };

                  let inserted = 0, skipped = 0;
                  const errors: string[] = [];

                  // Batch all records through the import edge function
                  const importRecords = records.map(r => {
                    const nameParts = r.name.split(' ');
                    return {
                      surname: nameParts[0],
                      first_name: nameParts.slice(1).join(' ') || nameParts[0],
                      full_name: r.name,
                      charges: r.crime,
                    };
                  });

                  const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/import-wanted-persons`,
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ records: importRecords })
                    }
                  );
                  const result = await response.json();
                  inserted = result.inserted || 0;
                  skipped = result.updated || 0;

                  setCsvImportResult({ inserted, updated: skipped, skipped: 0, errors: result.errorDetails || [] });
                  await fetchDbStats();
                  toast({
                    title: "✅ CSV import complete",
                    description: `${inserted} inserted, ${skipped} updated`,
                  });
                } catch (err) {
                  toast({ title: "❌ Import failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
                } finally {
                  setIsImportingCsv(false);
                }
              }}
            >
              {isImportingCsv ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" /> Import CSV</>
              )}
            </Button>
            {csvImportResult && (
              <span className="text-sm text-muted-foreground">
                {csvImportResult.inserted} inserted, {csvImportResult.updated} updated
                {csvImportResult.errors.length > 0 && `, ${csvImportResult.errors.length} errors`}
              </span>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-3">About This Tool</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • <strong>Main Scraper:</strong> Fetches the list of wanted persons (names, charges, photos)
            </li>
            <li>
              • <strong>Detail Scraper:</strong> Fetches case numbers, police stations from individual pages (run multiple times)
            </li>
            <li>
              • Uses Firecrawl to bypass anti-bot protection with 10-second wait times and retries
            </li>
            <li>
              • Detail scraper processes 5 records per run to avoid timeouts - click repeatedly until complete
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminScraper;

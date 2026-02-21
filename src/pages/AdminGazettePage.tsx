import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, Database } from "lucide-react";

interface GazetteRecord {
  id: string;
  full_name: string;
  first_name: string | null;
  surname: string | null;
  record_type: string;
  gazette_number: string | null;
  gazette_date: string | null;
  court_name: string | null;
  order_type: string | null;
  province: string | null;
  created_at: string;
}

export default function AdminGazettePage() {
  const { isAdmin } = useUserRole();
  const { toast } = useToast();

  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [gazetteNumber, setGazetteNumber] = useState("");
  const [gazetteDate, setGazetteDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const [recentRecords, setRecentRecords] = useState<GazetteRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const { data, count } = await supabase
      .from("gazette_records" as any)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(20);
    setRecentRecords((data as any) || []);
    setTotalCount(count || 0);
    setLoading(false);
  };

  const handleUploadAndExtract = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setLastResult(null);

    try {
      // Upload to storage
      const filePath = `gazette-${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("gazette-pdfs")
        .upload(filePath, selectedFile, { contentType: "application/pdf" });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
      
      setUploading(false);
      setExtracting(true);

      // Trigger AI extraction
      const { data, error } = await supabase.functions.invoke("extract-gazette", {
        body: {
          file_path: filePath,
          gazette_number: gazetteNumber || undefined,
          gazette_date: gazetteDate || undefined,
        },
      });

      if (error) throw new Error(error.message);

      setLastResult(data);
      toast({
        title: "Gazette processed",
        description: `Extracted ${data.extracted} records, inserted ${data.inserted}`,
      });
      
      // Refresh records list
      fetchRecords();
      setSelectedFile(null);
      setGazetteNumber("");
      setGazetteDate("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      setExtracting(false);
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Admin access required.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Government Gazette</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Upload Legal Gazette PDFs and extract financial court orders using AI
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="font-heading text-lg text-foreground mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Gazette PDF
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1.5">
                  Gazette Number
                </label>
                <input
                  value={gazetteNumber}
                  onChange={(e) => setGazetteNumber(e.target.value)}
                  placeholder="e.g., 52314"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1.5">
                  Gazette Date
                </label>
                <input
                  type="date"
                  value={gazetteDate}
                  onChange={(e) => setGazetteDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1.5">
                PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background font-body text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-muted file:text-foreground file:text-xs file:font-medium"
              />
            </div>

            <button
              onClick={handleUploadAndExtract}
              disabled={!selectedFile || uploading || extracting}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-body text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
              ) : extracting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> AI Extracting Names...</>
              ) : (
                <><FileText className="h-4 w-4" /> Upload & Extract</>
              )}
            </button>
          </div>

          {/* Last Result */}
          {lastResult && (
            <div className="mt-4 p-4 bg-risk-green/10 border border-risk-green/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-risk-green" />
                <span className="font-body text-sm font-medium text-foreground">Extraction Complete</span>
              </div>
              <p className="font-body text-sm text-muted-foreground">
                Extracted {lastResult.extracted} records from Gazette {lastResult.gazette_number || "N/A"}, 
                inserted {lastResult.inserted} into database.
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg text-foreground flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Gazette Records
            </h2>
            <span className="px-3 py-1 bg-muted text-foreground rounded-full font-mono text-xs">
              {totalCount} total
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : recentRecords.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-body text-sm text-muted-foreground">
                No gazette records yet. Upload a Legal Gazette PDF to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentRecords.map((record) => (
                <div key={record.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{record.full_name}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {record.order_type || record.record_type} · {record.court_name || "Court N/A"} · Gazette {record.gazette_number || "N/A"}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-mono text-[10px] uppercase">
                    {record.record_type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

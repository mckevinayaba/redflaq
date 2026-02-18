import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, XCircle, GitMerge, ArrowLeft, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WantedPerson {
  id: string;
  full_name: string;
  first_name: string | null;
  surname: string | null;
  charges: string;
  photo_url: string | null;
  province: string | null;
  police_station: string | null;
  case_number: string | null;
  court_case_number: string | null;
  id_number: string | null;
  date_wanted: string | null;
  saps_case_numbers: string[];
  court_case_numbers: string[];
  alleged_offenses: string[];
  needs_human_review: boolean | null;
  identity_confidence_score: number | null;
  name_normalized: string | null;
}

const AdminMergeReview = () => {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);
  const [records, setRecords] = useState<WantedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [merging, setMerging] = useState<string | null>(null);

  useEffect(() => {
    const authed = localStorage.getItem("admin_authenticated");
    if (authed !== "true") {
      navigate("/admin/login");
      return;
    }
    setIsAuthed(true);
    loadPendingRecords();
  }, [navigate]);

  const loadPendingRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wanted_persons')
      .select('*')
      .eq('needs_human_review', true)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) {
      toast.error("Failed to load records");
      console.error(error);
    } else {
      setRecords((data as unknown as WantedPerson[]) || []);
    }
    setLoading(false);
  };

  const findDuplicates = (record: WantedPerson): WantedPerson[] => {
    return records.filter(
      r => r.id !== record.id && r.name_normalized === record.name_normalized
    );
  };

  const handleMerge = async (primary: WantedPerson, secondary: WantedPerson) => {
    setMerging(secondary.id);
    try {
      // Merge arrays
      const mergedSapsCases = [...new Set([
        ...(primary.saps_case_numbers || []),
        ...(secondary.saps_case_numbers || []),
      ])];
      const mergedCourtCases = [...new Set([
        ...(primary.court_case_numbers || []),
        ...(secondary.court_case_numbers || []),
      ])];
      const mergedOffenses = [...new Set([
        ...(primary.alleged_offenses || []),
        ...(secondary.alleged_offenses || []),
      ])];

      // Update primary record with merged data
      const { error: updateError } = await supabase
        .from('wanted_persons')
        .update({
          saps_case_numbers: mergedSapsCases,
          court_case_numbers: mergedCourtCases,
          alleged_offenses: mergedOffenses,
          identity_confidence_score: 95,
          needs_human_review: false,
          merged_from_records: [secondary.id],
          photo_url: primary.photo_url || secondary.photo_url,
          police_station: primary.police_station || secondary.police_station,
          province: primary.province || secondary.province,
        })
        .eq('id', primary.id);

      if (updateError) throw updateError;

      // Deactivate secondary record
      const { error: deactivateError } = await supabase
        .from('wanted_persons')
        .update({ is_active: false, needs_human_review: false })
        .eq('id', secondary.id);

      if (deactivateError) throw deactivateError;

      // Log the merge
      await supabase.from('record_merge_log').insert({
        final_record_id: primary.id,
        source_1_type: 'existing',
        source_1_data: primary as any,
        source_2_type: 'duplicate',
        source_2_data: secondary as any,
        match_confidence: 100,
        match_criteria: ['admin_manual_merge'],
        matched_by: 'admin',
      });

      toast.success(`Merged "${secondary.full_name}" into "${primary.full_name}"`);
      await loadPendingRecords();
    } catch (error) {
      console.error("Merge error:", error);
      toast.error("Failed to merge records");
    }
    setMerging(null);
  };

  const handleDismiss = async (record: WantedPerson) => {
    const { error } = await supabase
      .from('wanted_persons')
      .update({ needs_human_review: false })
      .eq('id', record.id);

    if (error) {
      toast.error("Failed to dismiss");
    } else {
      toast.success("Record dismissed from review");
      await loadPendingRecords();
    }
  };

  if (!isAuthed) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/import")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Merge Review Panel</h1>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {records.length} pending
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading records...</p>
          </div>
        ) : records.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">All Clear</h2>
              <p className="text-muted-foreground">No records pending human review.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {records.map((record) => {
              const duplicates = findDuplicates(record);
              return (
                <Card key={record.id} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{record.full_name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {record.charges} • {record.province || 'No province'} • {record.police_station || 'No station'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {record.identity_confidence_score !== null && (
                          <Badge variant={record.identity_confidence_score >= 70 ? 'default' : 'destructive'}>
                            {record.identity_confidence_score}% confidence
                          </Badge>
                        )}
                        <Badge variant="outline">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Review
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground block text-xs">Case #</span>
                        <span className="text-foreground">{record.case_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Court Case</span>
                        <span className="text-foreground">{record.court_case_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">ID Number</span>
                        <span className="text-foreground">{record.id_number ? `****${record.id_number.slice(-4)}` : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Date Wanted</span>
                        <span className="text-foreground">{record.date_wanted || 'N/A'}</span>
                      </div>
                    </div>

                    {duplicates.length > 0 && (
                      <div className="border border-amber-200 bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 mt-4">
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <GitMerge className="h-4 w-4 text-amber-600" />
                          Possible Duplicates ({duplicates.length})
                        </h4>
                        {duplicates.map((dup) => (
                          <div key={dup.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <div>
                              <span className="text-sm font-medium text-foreground">{dup.full_name}</span>
                              <span className="text-xs text-muted-foreground ml-2">{dup.charges}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMerge(record, dup)}
                              disabled={merging === dup.id}
                            >
                              <GitMerge className="h-3 w-3 mr-1" />
                              {merging === dup.id ? 'Merging...' : 'Merge Into This'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleDismiss(record)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMergeReview;

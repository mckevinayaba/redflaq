import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle2, XCircle, GitMerge, ArrowLeft, AlertTriangle, User, Clock } from "lucide-react";
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

interface VerificationRequest {
  id: string;
  search_name: string;
  search_dob: string | null;
  search_id_number: string | null;
  search_province: string | null;
  additional_info: string | null;
  status: string | null;
  possible_match_ids: string[] | null;
  verified_match_id: string | null;
  verification_notes: string | null;
  verified_by_admin: string | null;
  created_at: string | null;
  completed_at: string | null;
}

const AdminMergeReview = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<WantedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [merging, setMerging] = useState<string | null>(null);

  // Verification requests state
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    loadPendingRecords();
    loadVerificationRequests();
  }, []);

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

  const loadVerificationRequests = async () => {
    setLoadingRequests(true);
    const { data, error } = await supabase
      .from('human_verification_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      toast.error("Failed to load verification requests");
      console.error(error);
    } else {
      setVerificationRequests((data as unknown as VerificationRequest[]) || []);
    }
    setLoadingRequests(false);
  };

  const findDuplicates = (record: WantedPerson): WantedPerson[] => {
    return records.filter(
      r => r.id !== record.id && r.name_normalized === record.name_normalized
    );
  };

  const handleMerge = async (primary: WantedPerson, secondary: WantedPerson) => {
    setMerging(secondary.id);
    try {
      const mergedSapsCases = [...new Set([...(primary.saps_case_numbers || []), ...(secondary.saps_case_numbers || [])])];
      const mergedCourtCases = [...new Set([...(primary.court_case_numbers || []), ...(secondary.court_case_numbers || [])])];
      const mergedOffenses = [...new Set([...(primary.alleged_offenses || []), ...(secondary.alleged_offenses || [])])];

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

      const { error: deactivateError } = await supabase
        .from('wanted_persons')
        .update({ is_active: false, needs_human_review: false })
        .eq('id', secondary.id);
      if (deactivateError) throw deactivateError;

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

  const handleStartVerification = async (requestId: string) => {
    const { error } = await supabase
      .from('human_verification_requests')
      .update({ status: 'in_progress' })
      .eq('id', requestId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Verification started");
      await loadVerificationRequests();
    }
  };

  const handleCompleteVerification = async (requestId: string, matchId: string | null) => {
    const { error } = await supabase
      .from('human_verification_requests')
      .update({
        status: 'completed',
        verified_match_id: matchId,
        verification_notes: adminNotes,
        verified_by_admin: 'admin',
        completed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) {
      toast.error("Failed to complete verification");
    } else {
      toast.success("Verification completed");
      setVerifyingId(null);
      setAdminNotes("");
      await loadVerificationRequests();
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="text-amber-600 border-amber-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'in_progress': return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'completed': return <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/import")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Merge & Verification Review</h1>
          </div>
        </div>

        <Tabs defaultValue="merge" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="merge">Merge Review ({records.length})</TabsTrigger>
            <TabsTrigger value="verification">Human Verification ({verificationRequests.filter(r => r.status !== 'completed').length})</TabsTrigger>
          </TabsList>

          {/* Merge Review Tab */}
          <TabsContent value="merge">
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
          </TabsContent>

          {/* Human Verification Tab */}
          <TabsContent value="verification">
            {loadingRequests ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading requests...</p>
              </div>
            ) : verificationRequests.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">No Requests</h2>
                  <p className="text-muted-foreground">No human verification requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {verificationRequests.map((req) => (
                  <Card key={req.id} className="border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {req.search_name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Requested: {req.created_at ? new Date(req.created_at).toLocaleDateString('en-ZA') : 'N/A'}
                            {req.possible_match_ids && ` · ${req.possible_match_ids.length} possible matches`}
                          </p>
                        </div>
                        {getStatusBadge(req.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground block text-xs">DOB</span>
                          <span className="text-foreground">{req.search_dob || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">ID Number</span>
                          <span className="text-foreground">{req.search_id_number ? `****${req.search_id_number.slice(-4)}` : 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">Province</span>
                          <span className="text-foreground">{req.search_province || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">Match IDs</span>
                          <span className="text-foreground">{req.possible_match_ids?.length || 0}</span>
                        </div>
                      </div>

                      {req.additional_info && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-4">
                          <span className="text-xs text-muted-foreground block mb-1">Additional Info from User</span>
                          <p className="text-sm text-foreground">{req.additional_info}</p>
                        </div>
                      )}

                      {verifyingId === req.id ? (
                        <div className="border border-border rounded-lg p-4 space-y-3">
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Admin verification notes..."
                            className="w-full border border-border rounded p-3 text-sm min-h-[80px] bg-background text-foreground"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleCompleteVerification(req.id, null)}>
                              <XCircle className="h-3 w-3 mr-1" />
                              No Match Found
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setVerifyingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          {req.status === 'pending' && (
                            <Button size="sm" variant="outline" onClick={() => handleStartVerification(req.id)}>
                              <Clock className="h-3 w-3 mr-1" />
                              Start Verification
                            </Button>
                          )}
                          {(req.status === 'pending' || req.status === 'in_progress') && (
                            <Button size="sm" onClick={() => setVerifyingId(req.id)}>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Mark as Verified
                            </Button>
                          )}
                        </div>
                      )}

                      {req.status === 'completed' && req.verification_notes && (
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg p-3 mt-3">
                          <span className="text-xs text-green-700 dark:text-green-400 block mb-1">Verification Notes</span>
                          <p className="text-sm text-foreground">{req.verification_notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminMergeReview;

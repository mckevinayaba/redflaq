import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Download, Trash2, Search, Users, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImportResult {
  success: boolean;
  total: number;
  inserted: number;
  updated: number;
  errors: number;
  errorDetails: string[];
}

interface WantedPerson {
  id: string;
  full_name: string;
  surname: string;
  first_name: string;
  charges: string;
  is_active: boolean;
  added_at: string;
  id_number?: string;
}

const AdminImport = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dbStats, setDbStats] = useState({ total: 0, active: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [persons, setPersons] = useState<WantedPerson[]>([]);
  const [quickImportData, setQuickImportData] = useState("");

  // Manual entry form
  const [manualForm, setManualForm] = useState({
    surname: "",
    first_name: "",
    charges: "",
    id_number: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/admin/login"); return; }
    checkAdminAccess();
  }, [user, authLoading]);

  const checkAdminAccess = async () => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user!.id)
      .in("role", ["admin", "owner"])
      .maybeSingle();
    if (!roleData) { navigate("/"); return; }
    fetchDbStats();
  };

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

  const searchPersons = async () => {
    if (!searchTerm.trim()) {
      setPersons([]);
      return;
    }

    const { data, error } = await supabase
      .from("wanted_persons")
      .select("*")
      .or(`full_name.ilike.%${searchTerm}%,charges.ilike.%${searchTerm}%,id_number.ilike.%${searchTerm}%`)
      .order("added_at", { ascending: false })
      .limit(50);

    if (error) {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPersons(data || []);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const processCSV = (csvText: string) => {
    const lines = csvText.split("\n").filter(line => line.trim());
    const headers = lines[0].split(",").map(h => h.trim());
    
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const record: any = {};
      headers.forEach((header, index) => {
        record[header] = values[index]?.trim() || "";
      });
      
      // Construct full_name if not provided
      if (!record.full_name && record.first_name && record.surname) {
        record.full_name = `${record.first_name} ${record.surname}`;
      }
      
      records.push(record);
    }
    return records;
  };

  const handleImport = async () => {
    if (!csvContent) {
      toast({
        title: "No data",
        description: "Please upload a CSV file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const records = processCSV(csvContent);
      
      const { data, error } = await supabase.functions.invoke("import-wanted-persons", {
        body: { records },
      });

      if (error) throw error;

      setImportResult(data);
      await fetchDbStats();
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${data.inserted} records, updated ${data.updated} records`,
      });
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickImport = async () => {
    if (!quickImportData.trim()) {
      toast({
        title: "No data",
        description: "Please paste the table data first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Parse the table format data (tab-separated or line-separated)
      const lines = quickImportData.trim().split('\n').filter(line => line.trim());
      const records: any[] = [];
      
      for (const line of lines) {
        // Try tab-separated first
        let parts = line.split('\t');
        if (parts.length < 3) {
          // Try multiple spaces
          parts = line.split(/\s{2,}/).filter(p => p.trim());
        }
        
        if (parts.length < 3) continue;
        
        const surname = parts[0]?.trim();
        const firstName = parts[1]?.trim();
        const charges = parts[2]?.trim();
        
        // Skip header or invalid rows
        if (!surname || !firstName || !charges || 
            surname === 'Surname' || surname === 'Suspect Image') continue;
        
        records.push({
          surname: surname.toUpperCase(),
          first_name: firstName.toUpperCase(),
          full_name: `${firstName.toUpperCase()} ${surname.toUpperCase()}`,
          charges: charges,
          is_active: true
        });
      }
      
      if (records.length === 0) {
        toast({
          title: "No valid records",
          description: "Could not parse any valid records from the data",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`Importing ${records.length} records...`);

      const { data, error } = await supabase.functions.invoke("import-wanted-persons", {
        body: { records }
      });

      if (error) throw error;

      setImportResult(data);
      await fetchDbStats();
      setQuickImportData(""); // Clear the textarea
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${data.inserted} new records, updated ${data.updated} existing records`,
      });
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualAdd = async () => {
    if (!manualForm.surname || !manualForm.first_name || !manualForm.charges) {
      toast({
        title: "Missing fields",
        description: "Surname, first name, and charges are required",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const record = {
        ...manualForm,
        full_name: `${manualForm.first_name} ${manualForm.surname}`,
        is_active: true,
      };

      const { data, error } = await supabase.functions.invoke("import-wanted-persons", {
        body: { records: [record] },
      });

      if (error) throw error;

      setImportResult(data);
      await fetchDbStats();
      
      // Reset form
      setManualForm({ surname: "", first_name: "", charges: "", id_number: "" });
      
      toast({
        title: "Person added",
        description: "Successfully added wanted person",
      });
    } catch (error: any) {
      toast({
        title: "Add failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearAll = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("wanted_persons")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (error) throw error;

      await fetchDbStats();
      setPersons([]);
      
      toast({
        title: "Database cleared",
        description: "All wanted persons have been removed",
      });
    } catch (error: any) {
      toast({
        title: "Clear failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAllInactive = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("wanted_persons")
        .update({ is_active: false })
        .eq("is_active", true);

      if (error) throw error;

      await fetchDbStats();
      
      toast({
        title: "Records updated",
        description: "All active records marked as inactive",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = async () => {
    const { data, error } = await supabase
      .from("wanted_persons")
      .select("*")
      .order("added_at", { ascending: false });

    if (error) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const headers = "surname,first_name,full_name,charges,id_number,is_active,added_at";
    const rows = data?.map(p => 
      `${p.surname},${p.first_name},${p.full_name},${p.charges},${p.id_number || ""},${p.is_active},${p.added_at}`
    ).join("\n");
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wanted-persons-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const togglePersonActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("wanted_persons")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await searchPersons();
      await fetchDbStats();
      toast({
        title: "Status updated",
        description: "Person status has been changed",
      });
    }
  };

  const deletePerson = async (id: string) => {
    const { error } = await supabase
      .from("wanted_persons")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await searchPersons();
      await fetchDbStats();
      toast({
        title: "Deleted",
        description: "Person has been removed",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Import Tool</h1>
            <p className="text-muted-foreground">Manage SAPS wanted persons database</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/scraper")}>
            Back to Scraper
          </Button>
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

        <Tabs defaultValue="import" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="import">CSV Import</TabsTrigger>
            <TabsTrigger value="quick">Quick Import</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="manage">Manage Data</TabsTrigger>
          </TabsList>

          {/* CSV Import Tab */}
          <TabsContent value="import" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload CSV File
                </CardTitle>
                <CardDescription>
                  Import multiple wanted persons from a CSV file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                </div>

                {csvContent && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <Textarea
                      value={csvContent}
                      readOnly
                      className="font-mono text-xs h-32"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleImport}
                    disabled={!csvContent || isProcessing}
                  >
                    {isProcessing ? "Importing..." : "Import Data"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("/wanted-persons-template.csv", "_blank")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                {importResult && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h3 className="font-semibold">Import Results</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Total: {importResult.total}</div>
                      <div>Inserted: {importResult.inserted}</div>
                      <div>Updated: {importResult.updated}</div>
                      <div>Errors: {importResult.errors}</div>
                    </div>
                    {importResult.errorDetails.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-destructive">Errors:</p>
                        <ul className="text-xs list-disc list-inside">
                          {importResult.errorDetails.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Import Tab */}
          <TabsContent value="quick" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Quick Import from Table
                </CardTitle>
                <CardDescription>
                  Paste table data directly from SAPS website or spreadsheet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quick-import">Paste Table Data</Label>
                  <Textarea
                    id="quick-import"
                    placeholder="Paste table data here (Surname, Name, Crime format)..."
                    value={quickImportData}
                    onChange={(e) => setQuickImportData(e.target.value)}
                    className="font-mono text-sm h-64"
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste data with columns: Surname, Name, Crime (tab or space separated)
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleQuickImport}
                    disabled={!quickImportData.trim() || isProcessing}
                  >
                    {isProcessing ? "Importing..." : "Import Data"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setQuickImportData("")}
                    disabled={isProcessing}
                  >
                    Clear
                  </Button>
                </div>

                {importResult && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h3 className="font-semibold">Import Results</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Total: {importResult.total}</div>
                      <div>Inserted: {importResult.inserted}</div>
                      <div>Updated: {importResult.updated}</div>
                      <div>Errors: {importResult.errors}</div>
                    </div>
                    {importResult.errorDetails.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-destructive">Errors:</p>
                        <ul className="text-xs list-disc list-inside">
                          {importResult.errorDetails.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Single Person</CardTitle>
                <CardDescription>
                  Manually add one wanted person to the database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="surname">Surname *</Label>
                    <Input
                      id="surname"
                      value={manualForm.surname}
                      onChange={(e) => setManualForm({ ...manualForm, surname: e.target.value })}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={manualForm.first_name}
                      onChange={(e) => setManualForm({ ...manualForm, first_name: e.target.value })}
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="charges">Charges *</Label>
                  <Input
                    id="charges"
                    value={manualForm.charges}
                    onChange={(e) => setManualForm({ ...manualForm, charges: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_number">ID Number (Optional)</Label>
                  <Input
                    id="id_number"
                    value={manualForm.id_number}
                    onChange={(e) => setManualForm({ ...manualForm, id_number: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>

                <Button onClick={handleManualAdd} disabled={isProcessing}>
                  {isProcessing ? "Adding..." : "Add Person"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Data Tab */}
          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Operations</CardTitle>
                <CardDescription>
                  Manage all database records at once
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={handleExportCSV}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Mark All Inactive
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark all as inactive?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark all active wanted persons as inactive. This action can be reversed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMarkAllInactive}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Database
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all wanted persons from the database.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAll}>
                          Delete All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by name, charges, or ID number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchPersons()}
                  />
                  <Button onClick={searchPersons}>Search</Button>
                </div>

                {persons.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{persons.length} results found</p>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {persons.map((person) => (
                        <div
                          key={person.id}
                          className="p-4 border rounded-lg flex justify-between items-start"
                        >
                          <div>
                            <p className="font-semibold">{person.full_name}</p>
                            <p className="text-sm text-muted-foreground">{person.charges}</p>
                            {person.id_number && (
                              <p className="text-xs text-muted-foreground">ID: {person.id_number}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Status: {person.is_active ? "Active" : "Inactive"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => togglePersonActive(person.id, person.is_active)}
                            >
                              {person.is_active ? "Deactivate" : "Activate"}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete this person?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently remove {person.full_name} from the database.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deletePerson(person.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminImport;

import { useState } from "react";
import { User, AlertTriangle, Shield, FileText, Scale, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentModal } from "@/components/PaymentModal";

type SearchType = "person" | "warrants" | "police-case" | "protection-order" | "court-cases";

const SearchOptionsSection = () => {
  const [selectedType, setSelectedType] = useState<SearchType>("person");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const searchOptions = [
    {
      id: "person" as SearchType,
      icon: User,
      title: "Search by Person",
      description: "Search using full name and ID number",
      recommended: true,
    },
    {
      id: "warrants" as SearchType,
      icon: AlertTriangle,
      title: "Active Warrants",
      description: "Search SAPS wanted persons database",
      alert: true,
    },
    {
      id: "police-case" as SearchType,
      icon: Shield,
      title: "Police Case Number",
      description: "Search using a police case number (XXX/DD/YYYY)",
    },
    {
      id: "protection-order" as SearchType,
      icon: FileText,
      title: "Protection Order",
      description: "Search for protection order violations by keyword",
    },
    {
      id: "court-cases" as SearchType,
      icon: Scale,
      title: "Court Cases",
      description: "Search by court case number or keyword",
      fullWidth: true,
    },
  ];

  const provinces = [
    "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape",
    "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"
  ];

  const searchReasons = [
    "Potential romantic partner",
    "Tenant screening",
    "Employee verification",
    "Childcare provider",
    "Business partner",
    "Other legitimate purpose"
  ];

  return (
    <section id="search" className="py-24 md:py-32 bg-muted/50">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How Would You Like to Search?
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose your search method below
          </p>
        </div>

        {/* Search Option Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {searchOptions.filter(o => !o.fullWidth).map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedType(option.id)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                selectedType === option.id 
                  ? 'border-primary bg-accent' 
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              {/* Radio indicator */}
              <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedType === option.id ? 'border-primary bg-primary' : 'border-muted-foreground'
              }`}>
                {selectedType === option.id && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>

              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  option.alert ? 'bg-red-100' : 'bg-primary/10'
                }`}>
                  <option.icon className={`w-6 h-6 ${option.alert ? 'text-red-600' : 'text-primary'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-foreground">{option.title}</h3>
                    {option.recommended && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3" /> Recommended
                      </span>
                    )}
                    {option.alert && <span className="text-red-600">🚨</span>}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Full width option */}
        {searchOptions.filter(o => o.fullWidth).map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedType(option.id)}
            className={`relative w-full p-6 rounded-2xl border-2 text-left transition-all mb-8 ${
              selectedType === option.id 
                ? 'border-primary bg-accent' 
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedType === option.id ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
              {selectedType === option.id && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <option.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">{option.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{option.description}</p>
              </div>
            </div>
          </button>
        ))}

        {/* Search Form */}
        <div className="bg-card rounded-3xl border border-border p-8 shadow-lg">
          {selectedType === "person" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="e.g., John David Smith" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">SA ID Number *</Label>
                  <Input id="idNumber" placeholder="13-digit ID number" className="h-12" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth (Optional)</Label>
                  <Input id="dob" type="date" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province (Optional)</Label>
                  <Select>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province.toLowerCase().replace(' ', '-')}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Search *</Label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {searchReasons.map((reason) => (
                      <SelectItem key={reason} value={reason.toLowerCase().replace(/ /g, '-')}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedType === "warrants" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="warrantName">Full Name *</Label>
                <Input id="warrantName" placeholder="Enter full name to search" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantProvince">Province (Optional)</Label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province.toLowerCase().replace(' ', '-')}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedType === "police-case" && (
            <div className="space-y-2">
              <Label htmlFor="caseNumber">Police Case Number *</Label>
              <Input id="caseNumber" placeholder="e.g., CAS123/01/2024" className="h-12" />
              <p className="text-sm text-muted-foreground">Format: XXX/DD/YYYY or station reference</p>
            </div>
          )}

          {selectedType === "protection-order" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="poName">Name or Keyword *</Label>
                <Input id="poName" placeholder="Enter name or keyword" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poProvince">Province (Optional)</Label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province.toLowerCase().replace(' ', '-')}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedType === "court-cases" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="courtCase">Court Case Number or Keyword *</Label>
                <Input id="courtCase" placeholder="Enter case number or search term" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courtType">Court Type (Optional)</Label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select court type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="magistrate">Magistrate Court</SelectItem>
                    <SelectItem value="high">High Court</SelectItem>
                    <SelectItem value="supreme">Supreme Court of Appeal</SelectItem>
                    <SelectItem value="constitutional">Constitutional Court</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Consent checkbox */}
          <div className="flex items-start gap-3 mt-8 p-4 bg-muted/50 rounded-xl">
            <Checkbox 
              id="consent" 
              checked={consentChecked}
              onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              I confirm I have consent and legitimate reason to search this person's public records. 
              I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{" "}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </Label>
          </div>

          {/* Submit button */}
          <div className="mt-8 space-y-4">
            <Button 
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={!consentChecked}
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              Check Now — R99
            </Button>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <span>💾 Already in database? Instant (R79)</span>
              <span>🔍 First time? 2-5 minutes (R99)</span>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        packageType="single"
      />
    </section>
  );
};

export default SearchOptionsSection;

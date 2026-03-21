import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: {
    id: string;
    full_name: string;
    legal_status?: string;
    case_number?: string;
  } | null;
}

const DISPUTE_REASONS = [
  { value: "incorrect", label: "This information is incorrect" },
  { value: "not_me", label: "I am not this person" },
  { value: "expired", label: "This record should be expired" },
  { value: "resolved", label: "This case was resolved" },
  { value: "other", label: "Other reason" },
];

export function DisputeModal({ isOpen, onClose, record }: DisputeModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason || !email || !record) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("disputes").insert({
        record_id: record.id,
        user_email: email,
        reason: DISPUTE_REASONS.find(r => r.value === reason)?.label || reason,
        details: details || null,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Dispute Submitted",
        description: "We will review your dispute within 5 business days.",
      });

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setReason("");
        setDetails("");
        setEmail("");
      }, 2000);
    } catch (error: any) {
      console.error("Dispute submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Dispute Submitted</h3>
            <p className="text-gray-600">
              We will review your dispute and respond via email within 5 business days.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Challenge This Result
          </DialogTitle>
          <DialogDescription>
            If you believe this information is incorrect, you can submit a dispute for review.
          </DialogDescription>
        </DialogHeader>

        {record && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Record:</span> {record.full_name}
            </p>
            {record.legal_status && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Status:</span> {record.legal_status}
              </p>
            )}
            {record.case_number && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Reference:</span> {record.case_number}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="font-semibold">Reason for Dispute *</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {DISPUTE_REASONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="font-semibold">
              Additional Details (Optional)
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide any additional information that supports your dispute..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold">
              Your Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <p className="text-xs text-gray-500">
              We will send dispute updates to this email address.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSubmitting || !reason || !email}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Dispute"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

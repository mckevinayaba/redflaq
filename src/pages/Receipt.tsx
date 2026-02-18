import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, Download, Printer } from 'lucide-react';

interface Payment {
  id: string;
  payment_id: string;
  email: string;
  package_type: string;
  amount: number;
  search_credits: number;
  credits_used: number;
  status: string;
  created_at: string;
  reference?: string;
  payment_method?: string;
}

export default function Receipt() {
  const [searchParams] = useSearchParams();
  const payment_id = searchParams.get('payment_id');
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayment = async () => {
      if (!payment_id) {
        setError('No payment ID provided');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('manual_payments')
        .select('*')
        .eq('payment_id', payment_id)
        .single();

      if (error || !data) {
        setError('Payment not found');
        setLoading(false);
        return;
      }

      setPayment(data);
      setLoading(false);
    };

    fetchPayment();
  }, [payment_id]);

  const handlePrint = () => {
    window.print();
  };

  const getPackageDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      single: 'RedFlaq Background Check',
      triple: 'RedFlaq Background Check (3-Pack)',
      five: 'RedFlaq Background Check (5-Pack)',
    };
    return descriptions[type] || 'RedFlaq Background Check';
  };

  const getReceiptNumber = (id: string) => {
    return `RQ-${id.substring(0, 8).toUpperCase()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading receipt...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Payment not found'}</p>
          <a href="/" className="text-primary hover:underline">Return to Home</a>
        </div>
      </div>
    );
  }

  const searchUrl = `${window.location.origin}/search-form?payment_id=${payment.payment_id}`;

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 print:bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="bg-background rounded-lg shadow-lg border border-border print:shadow-none print:border-2">
          {/* Header */}
          <div className="border-b border-border p-8 print:p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">PAYMENT RECEIPT</h1>
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold">Setup A Startup (Pty) Ltd</p>
                  <p>Johannesburg, South Africa</p>
                </div>
              </div>
              <div className="flex gap-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Print receipt"
                >
                  <Printer className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Date:</p>
                <p className="font-semibold text-foreground">
                  {new Date(payment.created_at).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground mb-1">Receipt #:</p>
                <p className="font-semibold text-foreground">{getReceiptNumber(payment.id)}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="p-8 print:p-6 border-b border-border">
            <p className="text-sm text-muted-foreground mb-2">BILL TO:</p>
            <p className="font-semibold text-foreground">{payment.email}</p>
          </div>

          {/* Items */}
          <div className="p-8 print:p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-semibold">DESCRIPTION</th>
                  <th className="text-center py-2 text-muted-foreground font-semibold">QTY</th>
                  <th className="text-right py-2 text-muted-foreground font-semibold">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-4 text-foreground">{getPackageDescription(payment.package_type)}</td>
                  <td className="text-center py-4 text-foreground">{payment.search_credits}</td>
                  <td className="text-right py-4 text-foreground">R{payment.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-right py-4 font-semibold text-foreground">TOTAL</td>
                  <td className="text-right py-4 font-bold text-lg text-primary">R{payment.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Details */}
          <div className="p-8 print:p-6 bg-muted/30 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="text-muted-foreground mb-1">Payment Method:</p>
                <p className="font-semibold text-foreground">
                  {payment.payment_method || 'Bank Transfer (EFT)'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Reference:</p>
                <p className="font-semibold text-foreground">
                  {payment.reference || payment.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              {payment.status === 'verified' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-600">Status: VERIFIED ✅</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-600">Status: PENDING VERIFICATION ⏳</span>
                </>
              )}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Your search link:</p>
              <a
                href={searchUrl}
                className="text-primary hover:underline font-medium break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {searchUrl}
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Credits remaining: {payment.search_credits - payment.credits_used} of {payment.search_credits}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 print:p-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-4">Thank you for your business!</p>
            <div className="space-y-1 text-sm text-muted-foreground mb-6">
              <p>Questions? <a href="mailto:support@redflaq.com" className="text-primary hover:underline">support@redflaq.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/27663365296" className="text-primary hover:underline">+27 66 336 5296</a></p>
            </div>
            <div className="text-sm">
              <p className="text-primary font-semibold mb-1">💜 RedFlaq - A Setup A Startup Initiative</p>
              <p className="text-muted-foreground">Stay Safe, Date Smart</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 print:hidden">
          <a href="/" className="text-primary hover:underline">Return to Home</a>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, XCircle, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  payment_method?: string;
  reference?: string;
  notes?: string;
}

export default function AdminVerifyPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'verified' | 'all'>('pending');
  const { toast } = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('manual_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const handleVerify = async (paymentId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('manual_payments')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          verified_by: 'admin'
        })
        .eq('payment_id', paymentId);

      if (error) throw error;

      // Generate search URL
      const searchUrl = `${window.location.origin}/search-form?payment_id=${paymentId}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(searchUrl);

      toast({
        title: 'Payment Verified!',
        description: `Search URL copied to clipboard. Send to ${email}`,
      });

      fetchPayments();
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify payment',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('manual_payments')
        .update({
          status: 'rejected',
          verified_at: new Date().toISOString(),
          verified_by: 'admin'
        })
        .eq('payment_id', paymentId);

      if (error) throw error;

      toast({
        title: 'Payment Rejected',
        description: 'Payment has been marked as rejected',
      });

      fetchPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject payment',
        variant: 'destructive'
      });
    }
  };

  const copySearchUrl = async (paymentId: string) => {
    const searchUrl = `${window.location.origin}/search-form?payment_id=${paymentId}`;
    await navigator.clipboard.writeText(searchUrl);
    toast({
      title: 'Copied!',
      description: 'Search URL copied to clipboard',
    });
  };

  const copyReceiptUrl = async (paymentId: string) => {
    const receiptUrl = `${window.location.origin}/receipt?payment_id=${paymentId}`;
    await navigator.clipboard.writeText(receiptUrl);
    toast({
      title: 'Copied!',
      description: 'Receipt URL copied to clipboard',
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Payment Verification Admin</h1>
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {(['pending', 'verified', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No {filter !== 'all' ? filter : ''} payments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-card border border-border rounded-lg p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">{payment.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-semibold text-foreground">R{payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Package</p>
                    <p className="font-semibold text-foreground">
                      {payment.package_type} ({payment.search_credits} credit{payment.search_credits > 1 ? 's' : ''})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credits Used</p>
                    <p className="font-semibold text-foreground">
                      {payment.credits_used} / {payment.search_credits}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        payment.status === 'verified'
                          ? 'bg-green-500/10 text-green-600'
                          : payment.status === 'rejected'
                          ? 'bg-red-500/10 text-red-600'
                          : 'bg-yellow-500/10 text-yellow-600'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="text-sm text-foreground">
                      {new Date(payment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  {payment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerify(payment.payment_id, payment.email)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Verify & Copy Link
                      </button>
                      <button
                        onClick={() => handleReject(payment.payment_id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  {payment.status === 'verified' && (
                    <>
                      <button
                        onClick={() => copySearchUrl(payment.payment_id)}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Search Link
                      </button>
                      <button
                        onClick={() => copyReceiptUrl(payment.payment_id)}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Receipt Link
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

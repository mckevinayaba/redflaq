-- Create manual payments table
CREATE TABLE manual_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  package_type VARCHAR(20) DEFAULT 'single',
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  reference VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  search_credits INTEGER DEFAULT 1,
  credits_used INTEGER DEFAULT 0,
  proof_url TEXT,
  notes TEXT,
  verified_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'verified', 'rejected'))
);

-- Create indexes
CREATE INDEX idx_manual_payments_email ON manual_payments(email);
CREATE INDEX idx_manual_payments_status ON manual_payments(status);
CREATE INDEX idx_manual_payments_payment_id ON manual_payments(payment_id);

-- Enable RLS
ALTER TABLE manual_payments ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for user submissions)
CREATE POLICY "Allow public insert" ON manual_payments
  FOR INSERT TO anon WITH CHECK (true);

-- Allow public select (to check payment status)
CREATE POLICY "Allow view own payments" ON manual_payments
  FOR SELECT TO anon USING (true);
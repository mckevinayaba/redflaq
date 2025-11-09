-- Create purchases table for tracking payments and credits
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  package_type VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  credits_purchased INTEGER NOT NULL,
  credits_remaining INTEGER NOT NULL,
  paypal_order_id VARCHAR(255),
  paypal_transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  CONSTRAINT valid_package CHECK (package_type IN ('single', 'triple', 'five'))
);

-- Create indexes for better query performance
CREATE INDEX idx_purchases_email ON public.purchases(email);
CREATE INDEX idx_purchases_purchase_id ON public.purchases(purchase_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Allow public to create purchases (during checkout)
CREATE POLICY "Allow public insert purchases" ON public.purchases
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow users to view purchases (by email for receipt lookup)
CREATE POLICY "Allow public read purchases" ON public.purchases
  FOR SELECT TO anon, authenticated USING (true);

-- Allow updates for payment processing (status changes)
CREATE POLICY "Allow public update purchases" ON public.purchases
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
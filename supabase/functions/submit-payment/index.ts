import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, package_type } = await req.json();
    
    console.log(`Processing manual payment submission for ${email}, package: ${package_type}`);
    
    // Validate email
    if (!email || !email.includes('@')) {
      throw new Error('Valid email required');
    }
    
    // Package details
    const packages: Record<string, { amount: number; credits: number }> = {
      'single': { amount: 50, credits: 1 },
      'triple': { amount: 120, credits: 3 },
      'five': { amount: 180, credits: 5 }
    };
    
    const pkg = packages[package_type] || packages.single;
    
    // Generate payment ID
    const payment_id = crypto.randomUUID();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Save to database
    const { data, error } = await supabase
      .from('manual_payments')
      .insert({
        payment_id,
        email,
        package_type,
        amount: pkg.amount,
        search_credits: pkg.credits,
        credits_used: 0,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save payment submission');
    }
    
    console.log(`Payment submission saved: ${payment_id}`);
    
    return new Response(JSON.stringify({
      success: true,
      payment_id,
      message: 'Submission received! Check your email in 5 minutes.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Payment submission error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

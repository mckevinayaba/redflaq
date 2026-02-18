import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payment_id, action, admin_password } = await req.json();

    // Verify admin
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    if (!adminPassword || admin_password !== adminPassword) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!payment_id || !action) {
      return new Response(JSON.stringify({ success: false, error: 'payment_id and action required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === 'verify') {
      const { error } = await supabase
        .from('manual_payments')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          verified_by: 'admin',
        })
        .eq('payment_id', payment_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, message: 'Payment verified' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'reject') {
      const { error } = await supabase
        .from('manual_payments')
        .update({
          status: 'rejected',
          verified_at: new Date().toISOString(),
          verified_by: 'admin',
        })
        .eq('payment_id', payment_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, message: 'Payment rejected' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Admin verify error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

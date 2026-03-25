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
    // Authenticate via JWT — no password comparison.
    // The Supabase client on the frontend automatically sends the session JWT
    // in the Authorization header when supabase.functions.invoke() is called
    // by a logged-in user.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, error: 'Missing authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.replace('Bearer ', '');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid or expired session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'owner'])
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ success: false, error: 'Insufficient privileges' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { payment_id, action } = await req.json();

    if (!payment_id || !action) {
      return new Response(JSON.stringify({ success: false, error: 'payment_id and action required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log admin event
    await supabase.from('admin_events').insert({
      event_type: `payment_${action}`,
      performed_by: 'admin',
      details: { payment_id, action },
    });

    if (action === 'verify') {
      // Get payment details for email
      const { data: payment } = await supabase
        .from('manual_payments')
        .select('email, package_type, search_credits')
        .eq('payment_id', payment_id)
        .single();

      const { error } = await supabase
        .from('manual_payments')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          verified_by: 'admin',
        })
        .eq('payment_id', payment_id);

      if (error) throw error;

      // Send email notification
      if (payment?.email) {
        const searchUrl = `https://redflaq.com/search-form?payment_id=${payment_id}`;
        try {
          await supabase.functions.invoke('send-email', {
            body: {
              to: payment.email,
              subject: '✅ RedFlaq Payment Confirmed — Your Search Link is Ready',
              html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                  <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="font-size: 28px; color: #1a1a1a; margin: 0;">🔍 RedFlaq</h1>
                    <p style="color: #666; font-size: 14px; margin-top: 4px;">Background Verification Service</p>
                  </div>
                  
                  <div style="background: #F0FDF4; border: 2px solid #16A34A; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                    <h2 style="color: #16A34A; font-size: 20px; margin: 0 0 8px;">✅ Payment Confirmed</h2>
                    <p style="color: #333; font-size: 15px; margin: 0;">Your ${payment.package_type || 'single'} package (${payment.search_credits || 1} search${(payment.search_credits || 1) > 1 ? 'es' : ''}) is now active.</p>
                  </div>
                  
                  <p style="color: #333; font-size: 15px; line-height: 1.6;">Click the button below to start your background verification:</p>
                  
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${searchUrl}" style="display: inline-block; background: #1a1a1a; color: white; padding: 16px 40px; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 8px;">Start Your Search →</a>
                  </div>
                  
                  <div style="background: #FEF3C7; border-left: 4px solid #CA8A04; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                    <p style="color: #92400E; font-size: 13px; margin: 0; font-weight: 600;">⚠️ Keep this link private</p>
                    <p style="color: #92400E; font-size: 13px; margin: 4px 0 0;">This link contains your search credits. Do not share it with others.</p>
                  </div>
                  
                  <p style="color: #666; font-size: 13px; line-height: 1.6;">
                    If you did not make this purchase, please contact us at support@redflaq.com
                  </p>
                  
                  <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
                  <p style="color: #999; font-size: 11px; text-align: center;">
                    RedFlaq · South African Background Checks · <a href="https://redflaq.com/privacy" style="color: #999;">Privacy Policy</a> · <a href="https://redflaq.com/terms" style="color: #999;">Terms</a>
                  </p>
                </div>
              `,
            },
          });
        } catch (emailErr) {
          console.error('Email send failed (non-blocking):', emailErr);
        }
      }

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

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
    const { email, full_name } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const firstName = (full_name || '').split(' ')[0] || 'there';

    await supabase.functions.invoke('send-email', {
      body: {
        admin_password: adminPassword,
        to: email,
        subject: `Welcome to RedFlaq, ${firstName} 🛡️`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 28px; color: #1a1a1a; margin: 0;">🛡️ RedFlaq</h1>
              <p style="color: #666; font-size: 14px; margin-top: 4px;">Background Verification Service</p>
            </div>

            <h2 style="font-size: 24px; color: #1a1a1a; margin: 0 0 16px;">Welcome, ${firstName}!</h2>

            <p style="color: #333; font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
              You've taken the first step to protecting yourself and your loved ones. RedFlaq checks public records across South Africa to help you make safer decisions.
            </p>

            <p style="color: #333; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
              Here's what you can do:
            </p>

            <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="color: #333; font-size: 14px; margin: 0 0 8px;">✅ Run a background check in under 60 seconds</p>
              <p style="color: #333; font-size: 14px; margin: 0 0 8px;">✅ Search across SAPS, court records &amp; gazette data</p>
              <p style="color: #333; font-size: 14px; margin: 0;">✅ Get a clear risk report you can share</p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://redflaq.co.za/dashboard/new-check" style="display: inline-block; background: #7C3AED; color: white; padding: 16px 40px; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 8px;">Run Your First Check →</a>
            </div>

            <p style="color: #666; font-size: 13px; line-height: 1.6;">
              Questions? Reply to this email or visit <a href="https://redflaq.co.za" style="color: #7C3AED;">redflaq.co.za</a>
            </p>

            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
            <p style="color: #999; font-size: 11px; text-align: center;">
              RedFlaq · South African Background Checks · <a href="https://redflaq.co.za/privacy" style="color: #999;">Privacy Policy</a> · <a href="https://redflaq.co.za/terms" style="color: #999;">Terms</a>
            </p>
          </div>
        `,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Welcome email error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

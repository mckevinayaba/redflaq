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
    const now = new Date();
    const sastTime = now.toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" });

    // 1. Welcome email to user — tells them to confirm their email
    await supabase.functions.invoke('send-email', {
      body: {
        admin_password: adminPassword,
        to: email,
        subject: `Welcome to RedFlaq, ${firstName} — one step to go`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 28px;">
              <img src="https://redflaq.lovable.app/redflaq-logo-email.png" alt="RedFlaq" height="48" style="display: inline-block; margin-bottom: 8px; height: 48px; width: auto;" />
              <p style="color: #78716C; font-size: 13px; margin: 4px 0 0; letter-spacing: 0.02em;">Public Record Safety Check · South Africa</p>
            </div>

            <h2 style="font-size: 24px; color: #1a1a1a; margin: 0 0 16px; font-family: Georgia, serif;">Welcome, ${firstName}! One step to go.</h2>

            <p style="color: #333; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
              Thank you for joining RedFlaq. To activate your account, please confirm your email address by clicking the button in the <strong>separate confirmation email</strong> we just sent you. It takes one second.
            </p>

            <div style="text-align: center; margin: 28px 0;">
              <div style="display: inline-block; background: #F3F0FF; border: 1px solid #E9E0FF; border-radius: 12px; padding: 20px 28px;">
                <p style="color: #7C3AED; font-size: 14px; font-weight: 700; margin: 0 0 4px;">📧 Check your inbox now</p>
                <p style="color: #78716C; font-size: 13px; margin: 0;">Look for an email with the subject "Confirm your email"</p>
              </div>
            </div>

            <p style="color: #78716C; font-size: 13px; line-height: 1.6; margin-bottom: 28px; text-align: center;">
              Check your <strong>spam</strong> or <strong>junk</strong> folder if you don't see it within 2 minutes.
            </p>

            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 28px 0;" />

            <p style="color: #333; font-size: 14px; font-weight: 700; margin: 0 0 12px;">Once confirmed, you can:</p>
            <div style="margin-bottom: 24px;">
              <p style="color: #333; font-size: 14px; margin: 0 0 6px;">✅ Run a public-record safety check in under 60 seconds</p>
              <p style="color: #333; font-size: 14px; margin: 0 0 6px;">✅ Get a clear risk report for R99</p>
              <p style="color: #333; font-size: 14px; margin: 0;">✅ Keep your search 100% confidential</p>
            </div>

            <p style="color: #666; font-size: 13px; line-height: 1.6;">
              Questions? Reply to this email or visit <a href="https://redflaq.com" style="color: #7C3AED;">redflaq.com</a>
            </p>

            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 28px 0;" />
            <p style="color: #999; font-size: 11px; text-align: center;">
              RedFlaq is operated by Setup A Startup (Pty) Ltd · South Africa<br />
              <a href="https://redflaq.com/privacy" style="color: #999;">Privacy Policy</a> · <a href="https://redflaq.com/terms" style="color: #999;">Terms</a>
            </p>
          </div>
        `,
      },
    });

    // 2. Notification email to founder
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          admin_password: adminPassword,
          to: 'support@redflaq.com',
          subject: `New RedFlaq Registration — ${full_name || email}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <img src="https://redflaq.lovable.app/redflaq-logo-email.png" alt="RedFlaq" height="40" style="margin-bottom: 24px;" />
              <h2 style="color: #1a1a1a; margin: 0 0 20px;">🆕 New User Registration</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0; font-weight: 700;">${full_name || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0; font-weight: 700;">${email}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Date/Time (SAST)</td><td style="padding: 8px 0; font-weight: 700;">${sastTime}</td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="font-size: 13px; color: #999;">Log in to your <a href="https://redflaq.lovable.app/admin/users" style="color: #7C3AED;">admin dashboard</a> to view all users.</p>
            </div>
          `,
        },
      });
    } catch (e) {
      console.error('Failed to send founder registration notification:', e);
    }

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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://redflaq.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Accept either:
  //   (a) the Supabase service-role key — used by server-to-server calls
  //       from admin-verify-payment and other trusted edge functions, or
  //   (b) a short-lived user JWT from an admin/owner-role account.
  //
  // The old admin_password body param is removed. Secrets must not be
  // passed in request bodies where they will be logged or cached.
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  let isAuthorized = false;

  if (token === serviceRoleKey) {
    // Server-to-server call from a trusted edge function using service role
    isAuthorized = true;
  } else if (token) {
    // Direct call from an authenticated admin browser session
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['admin', 'owner'])
        .maybeSingle();
      isAuthorized = !!roleData;
    }
  }

  if (!isAuthorized) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { to, subject, html }: EmailRequest = await req.json();

    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, logging email instead');
      console.log(`EMAIL TO: ${to} | SUBJECT: ${subject}`);
      return new Response(JSON.stringify({
        success: true,
        message: 'Email logged (no email service configured)',
        logged: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RedFlaq <hello@redflaq.com>',
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Resend error:', errorText);
      throw new Error(`Email send failed: ${res.status}`);
    }

    const data = await res.json();
    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Send email error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

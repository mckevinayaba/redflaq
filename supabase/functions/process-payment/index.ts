import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_API = Deno.env.get('PAYPAL_MODE') === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Processing payment action: ${action}`);
    
    if (action === 'generate-client-token') {
      // Generate OAuth access token
      const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
      const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
      if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials not configured');
      }

      const oauthRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (!oauthRes.ok) {
        const txt = await oauthRes.text();
        console.error('PayPal oAuth failed:', txt);
        throw new Error('Failed to authenticate with PayPal');
      }
      const { access_token } = await oauthRes.json();

      const tokenRes = await fetch(`${PAYPAL_API}/v1/identity/generate-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!tokenRes.ok) {
        const txt = await tokenRes.text();
        console.error('Client token generation failed:', txt);
        throw new Error('Failed to generate client token');
      }

      const tokenData = await tokenRes.json();
      return new Response(JSON.stringify({ success: true, clientToken: tokenData.client_token }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'create-order') {
      const { email, packageType } = data;
      
      if (!email || !packageType) {
        throw new Error('Email and package type are required');
      }
      
      const packages: Record<string, { amount: number; credits: number }> = {
        'single': { amount: 50, credits: 1 },
        'triple': { amount: 120, credits: 3 },
        'five': { amount: 180, credits: 5 }
      };
      
      const pkg = packages[packageType];
      if (!pkg) {
        throw new Error('Invalid package type');
      }
      
      console.log(`Creating order for ${email}, package: ${packageType}`);
      
      // Get PayPal credentials
      const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
      const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
      
      if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials not configured');
      }
      
      // Call PayPal API to create order
      const auth = btoa(`${clientId}:${clientSecret}`);
      
      const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'ZAR',
              value: pkg.amount.toFixed(2)
            },
            description: `RedFlaq Background Check - ${pkg.credits} Credit${pkg.credits > 1 ? 's' : ''}`
          }]
        })
      });
      
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('PayPal order creation failed:', errorText);
        throw new Error(`PayPal API error: ${orderResponse.status}`);
      }
      
      const order = await orderResponse.json();
      console.log('PayPal order created:', order.id);
      
      // Generate unique purchase ID
      const purchaseId = crypto.randomUUID();
      
      // Save to database
      const { error: dbError } = await supabase.from('purchases').insert({
        purchase_id: purchaseId,
        email,
        package_type: packageType,
        amount: pkg.amount,
        currency: 'ZAR',
        credits_purchased: pkg.credits,
        credits_remaining: pkg.credits,
        paypal_order_id: order.id,
        status: 'pending'
      });
      
      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save purchase record');
      }
      
      console.log(`Purchase record created: ${purchaseId}`);
      
      return new Response(JSON.stringify({
        success: true,
        orderID: order.id,
        purchaseId: purchaseId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'capture-order') {
      const { orderID } = data;
      
      if (!orderID) {
        throw new Error('Order ID is required');
      }
      
      console.log(`Capturing payment for order: ${orderID}`);
      
      const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
      const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
      
      if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials not configured');
      }
      
      const auth = btoa(`${clientId}:${clientSecret}`);
      
      const captureResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        }
      });
      
      if (!captureResponse.ok) {
        const errorText = await captureResponse.text();
        console.error('PayPal capture failed:', errorText);
        throw new Error(`PayPal capture error: ${captureResponse.status}`);
      }
      
      const capture = await captureResponse.json();
      console.log('Payment captured:', capture.id);
      
      if (capture.status === 'COMPLETED') {
        const transactionId = capture.purchase_units[0].payments.captures[0].id;
        
        // Update database
        const { data: purchase, error: updateError } = await supabase
          .from('purchases')
          .update({
            status: 'completed',
            paypal_transaction_id: transactionId
          })
          .eq('paypal_order_id', orderID)
          .select()
          .single();
        
        if (updateError) {
          console.error('Database update error:', updateError);
          throw new Error('Failed to update purchase status');
        }
        
        console.log(`Purchase completed: ${purchase.purchase_id}`);
        
        return new Response(JSON.stringify({
          success: true,
          purchaseId: purchase.purchase_id,
          credits: purchase.credits_remaining,
          email: purchase.email
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        throw new Error(`Payment not completed. Status: ${capture.status}`);
      }
    }
    
    if (action === 'validate-purchase') {
      const { purchaseId } = data;
      
      if (!purchaseId) {
        throw new Error('Purchase ID is required');
      }
      
      const { data: purchase, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('purchase_id', purchaseId)
        .eq('status', 'completed')
        .single();
      
      if (error || !purchase) {
        return new Response(JSON.stringify({
          valid: false,
          error: 'Invalid or expired purchase'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      if (purchase.credits_remaining < 1) {
        return new Response(JSON.stringify({
          valid: false,
          error: 'No credits remaining'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({
        valid: true,
        purchase: purchase
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'use-credit') {
      const { purchaseId } = data;
      
      if (!purchaseId) {
        throw new Error('Purchase ID is required');
      }
      
      // Get current purchase
      const { data: purchase, error: fetchError } = await supabase
        .from('purchases')
        .select('*')
        .eq('purchase_id', purchaseId)
        .eq('status', 'completed')
        .single();
      
      if (fetchError || !purchase) {
        throw new Error('Invalid purchase');
      }
      
      if (purchase.credits_remaining < 1) {
        throw new Error('No credits remaining');
      }
      
      // Deduct one credit
      const { error: updateError } = await supabase
        .from('purchases')
        .update({
          credits_remaining: purchase.credits_remaining - 1
        })
        .eq('purchase_id', purchaseId);
      
      if (updateError) {
        console.error('Failed to deduct credit:', updateError);
        throw new Error('Failed to use credit');
      }
      
      console.log(`Credit used for purchase: ${purchaseId}, remaining: ${purchase.credits_remaining - 1}`);
      
      return new Response(JSON.stringify({
        success: true,
        creditsRemaining: purchase.credits_remaining - 1
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    throw new Error('Invalid action');
    
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});



# Add Stripe as Payment Option

## Current State
- PayFast is already integrated (create-payfast-payment, payfast-itn webhook)
- PaymentModal currently only offers PayFast checkout

## Plan

1. **Enable Stripe integration** using the Stripe tool — this will prompt you for your Stripe secret key and set up the necessary infrastructure
2. **Add a Stripe checkout option** to the PaymentModal alongside PayFast — users can choose either payment method
3. **Create a Stripe checkout edge function** to generate Stripe Checkout Sessions for the same 3 packages (R99/R249/R399)
4. **Handle Stripe webhook** (payment confirmation) to credit the user's account, mirroring the PayFast ITN flow
5. **Update PaymentSuccess page** to handle both Stripe and PayFast return flows

Let me start by enabling Stripe.


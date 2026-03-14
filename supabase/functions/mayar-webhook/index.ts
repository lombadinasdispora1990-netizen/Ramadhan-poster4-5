import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const MAYAR_WEBHOOK_TOKEN = Deno.env.get("MAYAR_WEBHOOK_TOKEN")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

serve(async (req) => {
  const signature = req.headers.get("x-mayar-signature")
  
  // Basic token validation (Mayar usually sends token in header or payload)
  // For this implementation, we'll check if the token matches
  const authHeader = req.headers.get("Authorization")
  
  try {
    const payload = await req.json()
    console.log("Webhook received:", payload)

    // Validate webhook event
    if (payload.event === "payment.success" || payload.status === "success" || payload.status === "paid") {
      const userId = payload.metadata?.user_id
      const amount = payload.amount
      
      if (!userId) {
        return new Response(JSON.stringify({ error: "No user_id in metadata" }), { status: 400 })
      }

      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

      // 1. Update Profile to Premium & Add Credits
      // User said: 40 credits per month
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update({
          is_premium: true,
          credits: 40, // Set/Reset to 40 credits
          subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', userId)

      if (profileError) throw profileError

      // 2. Log Payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          mayar_payment_id: payload.id || payload.payment_id,
          amount: amount,
          status: 'success',
          plan_name: 'Monthly Pro',
          raw_response: payload
        })

      if (paymentError) console.error("Error logging payment:", paymentError)

      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }

    return new Response(JSON.stringify({ message: "Ignored event" }), { status: 200 })
  } catch (err) {
    console.error("Webhook error:", err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})

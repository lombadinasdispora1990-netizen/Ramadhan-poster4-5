import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAYAR_API_KEY = Deno.env.get("MAYAR_API_KEY")

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { userId, email } = await req.json()

    if (!userId || !email) {
      return new Response(JSON.stringify({ error: "Missing userId or email" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    console.log(`Creating payment for user: ${email} (${userId})`)

    const response = await fetch('https://api.mayar.id/hl/v1/payment/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAYAR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'BarokahGen Pro Subscription',
        amount: 100000,
        description: `Pro Subscription for user ${email}`,
        email: email,
        metadata: {
          user_id: userId,
          plan: 'monthly_100k'
        },
        callback_url: "https://barokahgen.vercel.app", // Fixed callback
        redirect_url: "https://barokahgen.vercel.app" // Fixed redirect
      })
    })

    const data = await response.json()
    console.log("Mayar Response:", data)

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })

  } catch (error) {
    console.error("Function error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
})

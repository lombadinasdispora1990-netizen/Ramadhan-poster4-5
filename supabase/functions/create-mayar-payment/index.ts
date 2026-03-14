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

    // Generate unique identifier and expiration (7 days from now)
    const timestamp = Date.now()
    const namePrefix = email.split('@')[0]
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    console.log(`Creating payment for user: ${email} (${userId}) - TS: ${timestamp}`)

    const payload = {
      name: namePrefix,
      email: email,
      amount: 100000,
      mobile: "081234567890",
      description: `BarokahGen Pro - ${timestamp}`,
      redirectUrl: "https://barokahgen.vercel.app",
      expiredAt: expiredAt
    }

    console.log("Sending payload to Mayar:", JSON.stringify(payload))

    const response = await fetch('https://api.mayar.id/hl/v1/payment/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAYAR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    
    console.log("Mayar Response Status:", response.status)
    console.log("Mayar Response Body:", JSON.stringify(data))

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

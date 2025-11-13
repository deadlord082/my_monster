import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import Wallet from '@/db/models/wallet.model'
import { pricingTable } from '@/config/pricing'
import { connectMongooseToDatabase } from '@/db'

export const runtime = 'nodejs'

export async function POST (req: Request): Promise<Response> {
  const sig = (await headers()).get('stripe-signature')
  const payload = await req.text() // corps brut requis
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err) {
    const error = err as Error
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Assurer la connexion DB avant toute opération Mongoose
  try {
    await connectMongooseToDatabase()
  } catch (err) {
    console.error('Database connection error in webhook:', err)
    return new Response('Database connection failed', { status: 500 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('Checkout session completed')
      console.log(event.data.object)

      const wallet = await Wallet.findOne({ ownerId: event?.data?.object?.metadata?.userId })
      if (wallet !== null && wallet !== undefined) {
        const entry = Object.entries(pricingTable).find(([_, pkg]) => pkg.productId === event?.data?.object?.metadata?.productId)

        if (entry !== undefined) {
          const koinsToAdd = Number(entry[0])
          wallet.balance = Number(wallet.balance) + koinsToAdd
          wallet.markModified('balance')
          await wallet.save()
        }
      }
      break
    }
    case 'payment_intent.succeeded': {
      console.log('Payment intent succeeded')
      console.log(event.data.object)
      break
    }
  }
  return new Response('ok', { status: 200 })
}

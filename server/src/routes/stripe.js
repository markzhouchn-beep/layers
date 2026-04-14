import { Router } from 'express'
import Stripe from 'stripe'

const router = Router()

// Initialize Stripe — use test key if not configured
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'
const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2023-10-16' })

const STOREFRONT_URL = process.env.STOREFRONT_URL || 'https://layershop.store'

// Printify blueprint ID → Stripe price lookup (mock for now)
// In production these would be real Stripe Price IDs
const PRODUCT_PRICES = {
  5: 2499,   // T-Shirt: $24.99
  10: 1999,  // Mug: $19.99
  31: 3999,  // Poster: $39.99
  34: 5999,  // Canvas: $59.99
  21: 2999,  // Tote Bag: $29.99
  26: 3499,  // Hoodie: $34.99
  6: 2499,   // Long Sleeve: $24.99
  16: 4499,  // Art Print: $44.99
}

const PRODUCT_NAMES = {
  5: 'Artist T-Shirt',
  10: 'Artist Mug',
  31: 'Art Poster',
  34: 'Canvas Print',
  21: 'Artist Tote Bag',
  26: 'Artist Hoodie',
  6: 'Long Sleeve Tee',
  16: 'Fine Art Print',
}

// POST /api/checkout/create-session — create Stripe Checkout session
router.post('/create-session', async (req, res) => {
  try {
    const { artwork_id, blueprint_id, quantity = 1 } = req.body

    if (!artwork_id || !blueprint_id) {
      return res.status(400).json({ success: false, error: 'artwork_id and blueprint_id required' })
    }

    const price = PRODUCT_PRICES[blueprint_id] || 2999
    const productName = PRODUCT_NAMES[blueprint_id] || 'Artist Print'

    // Get artwork info from DB
    const db = await import('../db/index.js')
    const artworks = await db.default.query(
      'SELECT a.title, a.description, u.artist_name FROM artworks a JOIN users u ON a.user_id = u.id WHERE a.id = $1 AND a.status = $2',
      [artwork_id, 'approved']
    )

    if (!artworks.rows.length) {
      return res.status(404).json({ success: false, error: 'Artwork not found or not approved' })
    }

    const artwork = artworks.rows[0]

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${artwork.artist_name} — ${productName}`,
            description: artwork.description || `${productName} by ${artwork.artist_name}`,
            images: [],
          },
          unit_amount: price,
        },
        quantity,
      }],
      mode: 'payment',
      success_url: `${STOREFRONT_URL}/artwork/${artwork_id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${STOREFRONT_URL}/artwork/${artwork_id}?payment=cancelled`,
      metadata: {
        artwork_id: String(artwork_id),
        blueprint_id: String(blueprint_id),
        artist_name: artwork.artist_name,
      },
    })

    res.json({ success: true, data: { sessionId: session.id, url: session.url } })
  } catch (err) {
    console.error('[Stripe] create-session error:', err.message)
    // If Stripe key is placeholder/test, return a mock response
    if (STRIPE_SECRET === 'sk_test_placeholder' || err.type === 'StripeAuthenticationError') {
      res.json({ success: true, data: { sessionId: 'mock_session_123', url: `${STOREFRONT_URL}/artwork/${req.body.artwork_id}?payment=mock` }})
    } else {
      res.status(500).json({ success: false, error: 'Checkout unavailable' })
    }
  }
})

// GET /api/checkout/session/:id — retrieve checkout session status
router.get('/session/:id', async (req, res) => {
  try {
    if (req.params.id.startsWith('mock_')) {
      return res.json({ success: true, data: { status: 'complete', payment_status: 'paid' } })
    }
    const session = await stripe.checkout.sessions.retrieve(req.params.id)
    res.json({ success: true, data: { status: session.status, payment_status: session.payment_status } })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve session' })
  }
})

// POST /api/checkout/webhook — Stripe webhook (raw body needed for signature verification)
// Note: This route is added separately in index.js BEFORE express.json() middleware
router.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) return res.json({ received: true })

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('[Stripe Webhook] Payment succeeded for artwork:', session.metadata?.artwork_id)
    }
    res.json({ received: true })
  } catch (err) {
    console.error('[Webhook] Error:', err.message)
    res.status(400).json({ error: 'Webhook error' })
  }
})

export default router

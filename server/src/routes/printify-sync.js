import { Router } from 'express'
import jwt from 'jsonwebtoken'
import db from '../db/index.js'
import { syncArtworkToPrintify, getShopProducts } from '../services/printify.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'layers-dev-secret-change-in-production'
const SHOP_ID = process.env.PRINTIFY_SHOP_ID || '27136321'

function adminAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }
  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin required' })
    }
    req.admin = decoded
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
}

// POST /api/printify/sync/:artworkId — sync single artwork to Printify
router.post('/sync/:artworkId', adminAuth, async (req, res) => {
  try {
    const { artworkId } = req.params

    // Get artwork
    const result = await db.query(
      'SELECT a.*, u.artist_name FROM artworks a JOIN users u ON a.user_id = u.id WHERE a.id = $1',
      [artworkId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Artwork not found' })
    }

    const artwork = result.rows[0]

    if (artwork.status !== 'approved') {
      return res.status(400).json({ success: false, error: `Artwork status is '${artwork.status}', must be 'approved'` })
    }

    // Sync to Printify
    const syncResult = await syncArtworkToPrintify(artwork)

    if (syncResult.success) {
      await db.query(
        'UPDATE artworks SET printify_product_id = $1, external_url = $2, updated_at = NOW() WHERE id = $3',
        [syncResult.printify_product_id, `https://layershop.store/product/${syncResult.printify_product_id}`, artworkId]
      )

      await db.query(
        `INSERT INTO printify_sync_log (sync_type, status, items_synced, performed_at)
         VALUES ('artwork', 'success', 1, NOW())`
      )
    } else {
      await db.query(
        `INSERT INTO printify_sync_log (sync_type, status, error_message, performed_at)
         VALUES ('artwork', 'failed', $1, NOW())`,
        [syncResult.message]
      )
    }

    res.json({ success: syncResult.success, data: syncResult })
  } catch (err) {
    console.error('[Printify sync]', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/printify/pending — list approved artworks not yet synced
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.id, a.title, a.mockup_url, a.original_image_url, a.status,
             u.artist_name, a.printify_product_id, a.created_at
      FROM artworks a
      JOIN users u ON a.user_id = u.id
      WHERE a.status = 'approved'
        AND (a.printify_product_id IS NULL OR a.printify_product_id = '' OR a.printify_product_id = '-1')
      ORDER BY a.created_at ASC
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/printify/products — list all Printify shop products
router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await getShopProducts()
    res.json({ success: true, data: products })
  } catch (err) {
    console.error('[Printify products]', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/printify/sync/all — sync all pending approved artworks
router.post('/sync/all', adminAuth, async (req, res) => {
  try {
    const pending = await db.query(`
      SELECT a.*, u.artist_name FROM artworks a
      JOIN users u ON a.user_id = u.id
      WHERE a.status = 'approved'
        AND (a.printify_product_id IS NULL OR a.printify_product_id = '' OR a.printify_product_id = '-1')
    `)

    const results = []
    for (const artwork of pending.rows) {
      const r = await syncArtworkToPrintify(artwork)
      if (r.success) {
        await db.query(
          'UPDATE artworks SET printify_product_id = $1, external_url = $2, updated_at = NOW() WHERE id = $3',
          [r.printify_product_id, `https://layershop.store/product/${r.printify_product_id}`, artwork.id]
        )
      }
      results.push({ artwork_id: artwork.id, title: artwork.title, ...r })
      // Be nice to Printify API
      await new Promise(r => setTimeout(r, 1500))
    }

    res.json({ success: true, data: results })
  } catch (err) {
    console.status(500).json({ success: false, error: err.message })
  }
})

export default router

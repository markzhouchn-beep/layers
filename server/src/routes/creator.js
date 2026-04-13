import { Router } from 'express'
import jwt from 'jsonwebtoken'
import db from '../db/index.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'layers-dev-secret-change-in-production'

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }
  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
}

// GET /api/creator/dashboard — creator stats
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id

    const [artworksResult, ordersResult, earningsResult, pendingResult] = await Promise.all([
      db.query('SELECT COUNT(*) FROM artworks WHERE user_id = $1', [userId]),
      db.query(`
        SELECT COUNT(*) FROM orders WHERE creator_id = $1 AND status != 'refunded'
      `, [userId]),
      db.query(`
        SELECT COALESCE(SUM(royalty_amount), 0) as total
        FROM earnings WHERE creator_id = $1 AND status IN ('settled', 'paid')
      `, [userId]),
      db.query("SELECT COUNT(*) FROM artworks WHERE user_id = $1 AND status = 'pending'", [userId]),
    ])

    res.json({
      success: true,
      data: {
        total_artworks: parseInt(artworksResult.rows[0].count),
        total_orders: parseInt(ordersResult.rows[0].count),
        total_earnings: parseFloat(earningsResult.rows[0].total),
        pending_review: parseInt(pendingResult.rows[0].count),
      }
    })
  } catch (err) {
    console.error('[Creator dashboard]', err.message)
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard' })
  }
})

// GET /api/creator/earnings — creator earnings history
router.get('/earnings', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.*, a.title as artwork_title, o.order_number, o.platform
      FROM earnings e
      LEFT JOIN artworks a ON e.order_id = a.id
      LEFT JOIN orders o ON e.order_id = o.id
      WHERE e.creator_id = $1
      ORDER BY e.created_at DESC
      LIMIT 50
    `, [req.user.id])
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch earnings' })
  }
})

// GET /api/creator/orders
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, a.title as artwork_title
      FROM orders o
      LEFT JOIN artworks a ON o.artwork_id = a.id
      WHERE o.creator_id = $1
      ORDER BY o.created_at DESC
      LIMIT 50
    `, [req.user.id])
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' })
  }
})

// GET /api/creator/external-accounts
router.get('/external-accounts', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM external_accounts WHERE user_id = $1 ORDER BY created_at DESC
    `, [req.user.id])
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch accounts' })
  }
})

// POST /api/creator/external-accounts
router.post('/external-accounts', authMiddleware, async (req, res) => {
  try {
    const { platform, account_name, api_key, shop_url } = req.body
    const result = await db.query(`
      INSERT INTO external_accounts (user_id, platform, account_name, api_key, shop_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [req.user.id, platform, account_name, api_key, shop_url])
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to add account' })
  }
})

// PUT /api/creator/external-accounts/:id
router.put('/external-accounts/:id', authMiddleware, async (req, res) => {
  try {
    const { is_active, api_key } = req.body
    const result = await db.query(`
      UPDATE external_accounts
      SET is_active = COALESCE($1, is_active),
          api_key = COALESCE($2, api_key),
          last_sync_at = NOW()
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `, [is_active, api_key, req.params.id, req.user.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update account' })
  }
})

export default router

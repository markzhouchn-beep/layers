import { Router } from 'express'
import jwt from 'jsonwebtoken'
import db from '../db/index.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'layers-dev-secret-change-in-production'

function adminAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }
  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' })
    }
    req.admin = decoded
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
}

// GET /api/admin/dashboard
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      artworksRes, pendingRes, creatorsRes, ordersRes,
      earningsRes, platformsRes
    ] = await Promise.all([
      db.query('SELECT COUNT(*) FROM artworks'),
      db.query("SELECT COUNT(*) FROM artworks WHERE status = 'pending'"),
      db.query("SELECT COUNT(*) FROM users WHERE role = 'creator'"),
      db.query('SELECT COUNT(*) FROM orders'),
      db.query('SELECT COALESCE(SUM(platform_revenue), 0) as total FROM platform_revenue'),
      db.query('SELECT platform, COUNT(*) as count, COALESCE(SUM(gross_amount), 0) as revenue FROM orders GROUP BY platform'),
    ])

    res.json({
      success: true,
      data: {
        total_artworks: parseInt(artworksRes.rows[0].count),
        pending_artworks: parseInt(pendingRes.rows[0].count),
        total_creators: parseInt(creatorsRes.rows[0].count),
        total_orders: parseInt(ordersRes.rows[0].count),
        total_revenue: parseFloat(earningsRes.rows[0].total),
        platforms: platformsRes.rows,
      }
    })
  } catch (err) {
    console.error('[Admin dashboard]', err.message)
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard' })
  }
})

// GET /api/admin/artworks
router.get('/artworks', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const params = []
    let where = '1=1'
    if (status && status !== 'all') {
      params.push(status)
      where += ` AND a.status = $${params.length}`
    }
    params.push(parseInt(limit), offset)
    const result = await db.query(`
      SELECT a.*, u.username, u.artist_name, u.plan
      FROM artworks a JOIN users u ON a.user_id = u.id
      WHERE ${where}
      ORDER BY a.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params)
    const countResult = await db.query(
      `SELECT COUNT(*) FROM artworks a WHERE ${where}`,
      status && status !== 'all' ? [status] : []
    )
    res.json({
      success: true,
      data: { items: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page) }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch artworks' })
  }
})

// POST /api/admin/artworks/:id/approve
router.post('/artworks/:id/approve', adminAuth, async (req, res) => {
  try {
    await db.query(
      "UPDATE artworks SET status = 'approved', updated_at = NOW() WHERE id = $1",
      [req.params.id]
    )
    res.json({ success: true, message: 'Artwork approved' })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to approve artwork' })
  }
})

// POST /api/admin/artworks/:id/reject
router.post('/artworks/:id/reject', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body
    await db.query(
      "UPDATE artworks SET status = 'rejected', rejection_reason = $1, updated_at = NOW() WHERE id = $2",
      [reason || '', req.params.id]
    )
    res.json({ success: true, message: 'Artwork rejected' })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reject artwork' })
  }
})

// GET /api/admin/creators
router.get('/creators', adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u.username, u.email, u.artist_name, u.plan, u.subscription_status, u.enabled, u.created_at,
             (SELECT COUNT(*) FROM artworks WHERE user_id = u.id) as artworks_count
      FROM users u WHERE u.role = 'creator'
      ORDER BY u.created_at DESC
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch creators' })
  }
})

// PUT /api/admin/creators/:id
router.put('/creators/:id', adminAuth, async (req, res) => {
  try {
    const { plan, enabled } = req.body
    const result = await db.query(`
      UPDATE users SET
        plan = COALESCE($1, plan),
        enabled = COALESCE($2, enabled),
        updated_at = NOW()
      WHERE id = $3 AND role = 'creator'
      RETURNING id, username, email, plan, enabled
    `, [plan, enabled, req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Creator not found' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update creator' })
  }
})

// GET /api/admin/orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, a.title as artwork_title, u.username, u.artist_name
      FROM orders o
      LEFT JOIN artworks a ON o.artwork_id = a.id
      LEFT JOIN users u ON o.creator_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' })
  }
})

export default router

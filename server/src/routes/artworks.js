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

// GET /api/artworks — public, list approved artworks
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status = 'approved' } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const params = []
    let where = status ? `WHERE a.status = $${params.length + 1}` : ''
    params.push(status)
    if (search) {
      params.push(`%${search}%`)
      where += ` AND (a.title ILIKE $${params.length} OR u.artist_name ILIKE $${params.length})`
    }
    params.push(parseInt(limit), offset)

    const result = await db.query(`
      SELECT a.id, a.title, a.description, a.mockup_url, a.status, a.tags, a.created_at,
             u.username, u.artist_name, u.avatar
      FROM artworks a
      JOIN users u ON a.user_id = u.id
      ${where}
      ORDER BY a.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params)

    const countResult = await db.query(
      `SELECT COUNT(*) FROM artworks a ${where}`,
      [status]
    )

    res.json({
      success: true,
      data: {
        items: result.rows,
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
      }
    })
  } catch (err) {
    console.error('[Artworks list]', err.message)
    res.status(500).json({ success: false, error: 'Failed to fetch artworks' })
  }
})

// GET /api/artworks/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, u.username, u.artist_name, u.avatar, u.bio
      FROM artworks a
      JOIN users u ON a.user_id = u.id
      WHERE a.id = $1
    `, [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Artwork not found' })
    }

    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch artwork' })
  }
})

// POST /api/artworks — creator upload
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, original_image_url, mockup_url, tags = [] } = req.body

    if (!title || !original_image_url) {
      return res.status(400).json({ success: false, error: 'Title and image are required' })
    }

    // Check plan limits
    const userResult = await db.query('SELECT plan FROM users WHERE id = $1', [req.user.id])
    const plan = userResult.rows[0]?.plan || 'free'
    const maxWorks = plan === 'pro' ? 9999 : plan === 'basic' ? 50 : 10

    const countResult = await db.query(
      'SELECT COUNT(*) FROM artworks WHERE user_id = $1',
      [req.user.id]
    )
    if (parseInt(countResult.rows[0].count) >= maxWorks) {
      return res.status(403).json({ success: false, error: `Your plan limits you to ${maxWorks} artworks. Upgrade to upload more.` })
    }

    const result = await db.query(`
      INSERT INTO artworks (user_id, title, description, original_image_url, mockup_url, tags, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `, [req.user.id, title, description || '', original_image_url, mockup_url || '', JSON.stringify(tags)])

    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('[Artwork create]', err.message)
    res.status(500).json({ success: false, error: 'Failed to create artwork' })
  }
})

// GET /api/artworks/creator/mine — creator's own artworks
router.get('/creator/mine', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM artworks WHERE user_id = $1 ORDER BY created_at DESC
    `, [req.user.id])
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch artworks' })
  }
})

export default router

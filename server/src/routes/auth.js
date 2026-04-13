import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db/index.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'layers-dev-secret-change-in-production'
const JWT_EXPIRES = '7d'

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, artist_name, plan = 'free' } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' })
    }

    // Check duplicates
    const existing = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Username or email already exists' })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, artist_name, role, plan)
       VALUES ($1, $2, $3, $4, 'creator', $5)
       RETURNING id, username, email, artist_name, role, plan, created_at`,
      [username, email, password_hash, artist_name || username, plan]
    )

    const user = result.rows[0]
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.json({ success: true, data: { token, user } })
  } catch (err) {
    console.error('[Auth register]', err.message)
    res.status(500).json({ success: false, error: 'Registration failed' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    if (!user.enabled) {
      return res.status(403).json({ success: false, error: 'Account disabled' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          artist_name: user.artist_name,
          role: user.role,
          plan: user.plan,
          avatar: user.avatar,
        }
      }
    })
  } catch (err) {
    console.error('[Auth login]', err.message)
    res.status(500).json({ success: false, error: 'Login failed' })
  }
})

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    const result = await db.query(
      'SELECT id, username, email, artist_name, role, plan, avatar, bio, subscription_status, stripe_account_id, created_at FROM users WHERE id = $1',
      [decoded.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, error: 'Invalid token' })
    }
    console.error('[Auth me]', err.message)
    res.status(500).json({ success: false, error: 'Failed to get user' })
  }
})

export default router

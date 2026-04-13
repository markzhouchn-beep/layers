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

// GET /api/external-platforms/platforms — list supported platforms
router.get('/platforms', async (req, res) => {
  const platforms = [
    {
      id: 'gumroad',
      name: 'Gumroad',
      desc: '全球最受欢迎的创作者销售平台，支持数字和实体产品',
      website: 'gumroad.com',
      color: '#FF6B35',
      features: ['OAuth 连接', 'API Key 连接', '自动订单同步', '实物+数字产品'],
    },
    {
      id: 'etsy',
      name: 'Etsy',
      desc: '手工艺和原创设计产品的顶级市场',
      website: 'etsy.com',
      color: '#F56400',
      features: ['OAuth 连接', 'API Key 连接', '自动订单同步', '需要 Etsy API 申请'],
    },
    {
      id: 'amazon',
      name: 'Amazon Merch',
      desc: '全球最大电商平台，按需印刷服务',
      website: 'merch.amazon.com',
      color: '#FF9900',
      features: ['API Key 连接', '大批量上传', '需要 Amazon 账号注册'],
    },
  ]
  res.json({ success: true, data: platforms })
})

// POST /api/external-platforms/sync — trigger sync for a platform (called by AI agent)
router.post('/sync', async (req, res) => {
  try {
    const { platform, user_id } = req.body

    if (!platform) {
      return res.status(400).json({ success: false, error: 'Platform is required' })
    }

    // Get all active accounts for this platform
    let query = 'SELECT * FROM external_accounts WHERE platform = $1 AND is_active = true'
    const params = [platform]
    if (user_id) {
      query += ' AND user_id = $2'
      params.push(user_id)
    }

    const accounts = await db.query(query, params)

    // For each account, fetch orders from external platform
    // This is a stub — real implementation would call Gumroad/Etsy/Amazon APIs
    const results = []
    for (const account of accounts.rows) {
      // TODO: Call platform API to fetch new orders
      // For now, just log and return
      results.push({
        account_id: account.id,
        platform: account.platform,
        new_orders: 0,
        synced_at: new Date().toISOString(),
      })

      await db.query(
        'UPDATE external_accounts SET last_sync_at = NOW() WHERE id = $1',
        [account.id]
      )
    }

    res.json({ success: true, data: results })
  } catch (err) {
    console.error('[External sync]', err.message)
    res.status(500).json({ success: false, error: 'Sync failed' })
  }
})

// GET /api/external-platforms/sync/status/:accountId
router.get('/sync/status/:accountId', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT last_sync_at, is_active FROM external_accounts WHERE id = $1 AND user_id = $2',
      [req.params.accountId, req.user.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get sync status' })
  }
})

export default router

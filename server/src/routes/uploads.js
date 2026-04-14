import { Router } from 'express'
import { writeFileSync } from 'fs'
import { join } from 'path'
import jwt from 'jsonwebtoken'
import db from '../db/index.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'layers-dev-secret-change-in-production'
const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), '../../uploads')

function auth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'Unauthorized' })
  try {
    const token = auth.split(' ')[1]
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
}

// POST /api/uploads/image — receive base64 PNG, write to disk, return URL
router.post('/image', auth, async (req, res) => {
  try {
    const { dataUrl, filename } = req.body
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({ success: false, error: 'Invalid image data' })
    }

    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) {
      return res.status(400).json({ success: false, error: 'Invalid base64 format' })
    }
    const mimeType = matches[1]
    const base64Data = matches[2]
    const ext = mimeType.split('/')[1] || 'png'
    const name = `${req.user.id}_${Date.now()}_${filename || 'artwork'}.${ext}`
    const filePath = join(UPLOAD_DIR, name)

    const buffer = Buffer.from(base64Data, 'base64')
    writeFileSync(filePath, buffer)

    const url = `/uploads/${name}`
    res.json({ success: true, data: { url, size: buffer.length } })
  } catch (err) {
    console.error('[Upload]', err.message)
    res.status(500).json({ success: false, error: 'Upload failed' })
  }
})

export default router

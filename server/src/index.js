import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load env
try {
  const envFile = readFileSync(join(__dirname, '../../.env'), 'utf8')
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim()
  })
} catch {}

import authRoutes from './routes/auth.js'
import artworkRoutes from './routes/artworks.js'
import creatorRoutes from './routes/creator.js'
import adminRoutes from './routes/admin.js'
import externalRoutes from './routes/external-platforms.js'
import printifyRoutes from './routes/printify.js'
import printifySyncRoutes from './routes/printify-sync.js'
import uploadRoutes from './routes/uploads.js'
import stripeRoutes from './routes/stripe.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, '../../uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/artworks', artworkRoutes)
app.use('/api/creator', creatorRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/external-platforms', externalRoutes)
app.use('/api/printify', printifyRoutes)
app.use('/api/printify-sync', printifySyncRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/checkout', stripeRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'layers-api', version: '1.0.0', timestamp: new Date().toISOString() })
})

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ success: false, error: err.message || 'Internal server error' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Layers API running on port ${PORT}`)
})

export default app

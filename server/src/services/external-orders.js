/**
 * External Platform Order Sync Agent
 * 
 * Polls external platforms (Gumroad, Etsy, Amazon) for new orders
 * and creates corresponding records in the Layers platform.
 * 
 * Run as a cron job: every 15 minutes
 * 
 * In production this would:
 * 1. Query each platform's API for new orders since last sync
 * 2. Create order + order_items records in DB
 * 3. Update artist's earnings
 * 4. Log sync results
 */

import db from '../db/index.js'

const PLATFORM_CONFIGS = {
  gumroad: {
    name: 'Gumroad',
    apiKey: process.env.GUMROAD_API_KEY,
    baseUrl: 'https://api.gumroad.com/v2',
    enabled: !!process.env.GUMROAD_API_KEY,
  },
  etsy: {
    name: 'Etsy',
    apiKey: process.env.ETSY_API_KEY,
    shopId: process.env.ETSY_SHOP_ID,
    baseUrl: 'https://api.etsy.com/v3',
    enabled: !!process.env.ETSY_API_KEY,
  },
}

export async function syncExternalOrders() {
  const results = []
  
  for (const [platform, config] of Object.entries(PLATFORM_CONFIGS)) {
    if (!config.enabled) {
      results.push({ platform, status: 'skipped', reason: 'Not configured' })
      continue
    }

    try {
      const lastSync = await getLastSyncTime(platform)
      const orders = await fetchNewOrders(platform, config, lastSync)
      
      for (const order of orders) {
        await processExternalOrder(platform, order)
      }

      await updateLastSyncTime(platform)
      results.push({ platform, status: 'success', newOrders: orders.length })
    } catch (err) {
      console.error(`[ExternalSync] ${platform}:`, err.message)
      results.push({ platform, status: 'error', error: err.message })
    }
  }

  return results
}

async function getLastSyncTime(platform) {
  try {
    const result = await db.query(
      `SELECT value FROM sync_state WHERE platform = $1 AND key_name = 'last_sync'`,
      [platform]
    )
    return result.rows[0]?.value || null
  } catch {
    return null
  }
}

async function updateLastSyncTime(platform) {
  const now = new Date().toISOString()
  await db.query(`
    INSERT INTO sync_state (platform, key_name, value, updated_at)
    VALUES ($1, 'last_sync', $2, NOW())
    ON CONFLICT (platform, key_name) DO UPDATE SET value = $2, updated_at = NOW()
  `, [platform, now])
}

async function fetchNewOrders(platform, config, lastSync) {
  // Placeholder — each platform has different API
  // Real implementation would use platform-specific SDK/auth
  if (platform === 'gumroad') {
    return fetchGumroadOrders(config, lastSync)
  } else if (platform === 'etsy') {
    return fetchEtsyOrders(config, lastSync)
  }
  return []
}

async function fetchGumroadOrders(config, lastSync) {
  // Gumroad API: GET /v2/sales
  // Filter by created_at > lastSync
  // Requires: Authorization: Bearer {api_key}
  // Returns: sales array with { product_name, buyer_email, amount, created_at }
  
  const params = new URLSearchParams({
    api_key: config.apiKey,
    ...(lastSync ? { after: lastSync } : {}),
  })

  const res = await fetch(`${config.baseUrl}/sales?${params}`)
  if (!res.ok) throw new Error(`Gumroad API error: ${res.status}`)
  
  const data = await res.json()
  return (data.sales || []).map(sale => ({
    external_id: sale.id,
    platform: 'gumroad',
    buyer_email: sale.buyer_email,
    product_name: sale.product_name,
    amount: sale.amount,
    currency: sale.currency,
    created_at: sale.created_at,
  }))
}

async function fetchEtsyOrders(config, lastSync) {
  // Etsy API: GET /v3/application/shops/{shop_id}/orders
  // Filter by creation_dates>
  // Requires: Authorization: Bearer {token}
  // Headers: x-api-key: {api_key}
  
  const headers = {
    'Authorization': `Bearer ${config.apiKey}`,
    'x-api-key': config.apiKey,
    'Content-Type': 'application/json',
  }
  
  const params = new URLSearchParams({
    shop_id: config.shopId,
    ...(lastSync ? { created_after: lastSync } : {}),
  })

  const res = await fetch(`${config.baseUrl}/application/shops/${config.shopId}/orders?${params}`, { headers })
  if (!res.ok) throw new Error(`Etsy API error: ${res.status}`)
  
  const data = await res.json()
  return (data.results || []).map(order => ({
    external_id: order.order_id,
    platform: 'etsy',
    buyer_email: order.buyer_email,
    product_name: order.title,
    amount: order.total_price,
    currency: order.currency,
    created_at: order.created_timestamp,
  }))
}

async function processExternalOrder(platform, order) {
  // Check if we already processed this order
  const existing = await db.query(
    `SELECT id FROM orders WHERE external_order_id = $1 AND platform = $2`,
    [order.external_id, platform]
  )
  if (existing.rows.length > 0) return // Already processed

  // Find the artwork that matches this product
  const artwork = await db.query(
    `SELECT id, user_id FROM artworks WHERE title ILIKE $1 AND status = 'approved' LIMIT 1`,
    [`%${order.product_name}%`]
  )

  if (!artwork.rows.length) {
    console.log(`[ExternalSync] No artwork found for: ${order.product_name}`)
    return
  }

  const artistId = artwork.rows[0].user_id

  // Create order record
  const orderResult = await db.query(`
    INSERT INTO orders (user_id, external_order_id, platform, buyer_email, total_amount, currency, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, 'paid', $7)
    RETURNING id
  `, [artistId, order.external_id, platform, order.buyer_email, order.amount, order.currency, order.created_at])

  const orderId = orderResult.rows[0].id

  // Create order item
  await db.query(`
    INSERT INTO order_items (order_id, artwork_id, quantity, unit_price)
    VALUES ($1, $2, 1, $3)
  `, [orderId, artwork.rows[0].id, order.amount])

  // Calculate and update artist earnings
  const royalty = order.amount * 0.7 // 70% to artist (after platform fees)
  await db.query(`
    INSERT INTO earnings (user_id, order_id, amount, platform_fee, net_earnings, status)
    VALUES ($1, $2, $3, $4, $5, 'pending')
  `, [artistId, orderId, order.amount, order.amount - royalty, royalty])

  // Update platform revenue
  await db.query(`
    INSERT INTO platform_revenue (source, amount, currency, description)
    VALUES ($1, $2, $3, $4)
  `, [platform, order.amount - royalty, order.currency, `Order ${order.external_id}`])

  console.log(`[ExternalSync] Processed ${platform} order: ${order.external_id} → artist ${artistId}`)
}

export default { syncExternalOrders }

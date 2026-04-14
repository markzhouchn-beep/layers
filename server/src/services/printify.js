/**
 * Printify Sync Service
 * Handles artwork → Printify product publishing
 * Flow: Upload image → Create product → Publish to shop
 */

const PRINTIFY_API = 'https://api.printify.com/v1'
const SHOP_ID = process.env.PRINTIFY_SHOP_ID || '27136321'
const TOKEN = process.env.PRINTIFY_API_TOKEN

async function printifyRequest(method, path, body = null) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(`${PRINTIFY_API}${path}`, opts)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(`Printify ${method} ${path} failed: ${JSON.stringify(data)}`)
  }
  return data
}

/**
 * Upload an image to Printify from a public URL
 * Returns the Printify image ID
 */
export async function uploadImageToPrintify(imageUrl, title) {
  // Step 1: Initiate upload
  const upload = await printifyRequest('POST', '/v1/uploads.json', {
    files: [{
      url: imageUrl,
      name: `${title}.png`,
    }],
  })

  const uploadId = upload[0].id

  // Step 2: Poll until ready
  let attempts = 0
  while (attempts < 30) {
    const status = await printifyRequest('GET', `/v1/uploads/${uploadId}.json`)
    if (status.status === 'success') {
      return status.files[0].id
    }
    if (status.status === 'failed') {
      throw new Error('Image upload to Printify failed')
    }
    await new Promise(r => setTimeout(r, 2000))
    attempts++
  }
  throw new Error('Image upload timed out')
}

/**
 * Create a Printify product from an artwork
 */
export async function createPrintifyProduct(artwork, imageId, blueprintId = 5) {
  const product = await printifyRequest('POST', `/v1/shops/${SHOP_ID}/products.json`, {
    title: artwork.title,
    description: artwork.description || `Original artwork by ${artwork.artist_name || 'Layers artist'}`,
    tags: artwork.tags || [],
    blueprints: [blueprintId],
    variants: [
      {
        blueprint_id: blueprintId,
        variant_id: 1, // First variant
        options: [{ id: 1, value: 'S' }, { id: 2, value: 'White' }],
        price: 30,
      },
    ],
    images: [
      {
        id: imageId,
        variant_ids: [],
        position: 'front',
        angle: 'front',
      },
    ],
  })

  return product
}

/**
 * Publish a Printify product to the shop
 */
export async function publishProduct(productId) {
  await printifyRequest('POST', `/v1/shops/${SHOP_ID}/products/${productId}/publish.json`)
}

/**
 * Full sync: artwork → Printify
 * Returns { success, printify_product_id, message }
 */
export async function syncArtworkToPrintify(artwork) {
  try {
    if (!artwork.mockup_url && !artwork.original_image_url) {
      return { success: false, message: 'No image URL available' }
    }

    const imageUrl = artwork.mockup_url || artwork.original_image_url
    console.log(`[Printify] Uploading image for: ${artwork.title}`)

    const imageId = await uploadImageToPrintify(imageUrl, artwork.title)
    console.log(`[Printify] Image uploaded: ${imageId}`)

    const blueprintId = artwork.printify_blueprint_id || 5
    console.log(`[Printify] Creating product: ${artwork.title}`)

    const product = await createPrintifyProduct(artwork, imageId, blueprintId)
    console.log(`[Printify] Product created: ${product.id}`)

    await publishProduct(product.id)
    console.log(`[Printify] Product published: ${product.id}`)

    return {
      success: true,
      printify_product_id: String(product.id),
      message: `Published to Printify as product #${product.id}`,
    }
  } catch (err) {
    console.error(`[Printify] Sync failed for artwork ${artwork.id}:`, err.message)
    return { success: false, message: err.message }
  }
}

/**
 * Get all products from Printify shop
 */
export async function getShopProducts() {
  const products = await printifyRequest('GET', `/v1/shops/${SHOP_ID}/products.json`)
  return products
}

export default {
  uploadImageToPrintify,
  createPrintifyProduct,
  publishProduct,
  syncArtworkToPrintify,
  getShopProducts,
}

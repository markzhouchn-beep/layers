import { Router } from 'express'

const router = Router()

// Curated 12 product blueprints
const BLUEPRINTS = [
  { id: 1,  title: 'Classic T-Shirt',    print_area: { width: 2000, height: 2200 } },
  { id: 2,  title: 'Premium T-Shirt',   print_area: { width: 2000, height: 2400 } },
  { id: 6,  title: 'Canvas Print',       print_area: { width: 4000, height: 4000 } },
  { id: 10, title: 'Mug',                print_area: { width: 1500, height: 1500 } },
  { id: 14, title: 'Hoodie',             print_area: { width: 2000, height: 2400 } },
  { id: 16, title: 'Pillow',             print_area: { width: 3600, height: 3600 } },
  { id: 21, title: 'Tote Bag',           print_area: { width: 2000, height: 2400 } },
  { id: 26, title: 'Poster',              print_area: { width: 3000, height: 4600 } },
  { id: 27, title: 'Phone Case',         print_area: { width: 1260, height: 2520 } },
  { id: 38, title: 'Long Sleeve',        print_area: { width: 2000, height: 2200 } },
  { id: 71, title: 'Tapestry',           print_area: { width: 4800, height: 7200 } },
  { id: 9,  title: 'Apron',             print_area: { width: 2000, height: 2400 } },
]

// GET /api/printify/blueprints — public, list available product templates
router.get('/blueprints', (req, res) => {
  res.json({ success: true, data: BLUEPRINTS })
})

export default router

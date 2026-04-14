import { Router } from 'express'

const router = Router()

// Curated 12 product blueprints (T-Shirts, Mug, Poster, Canvas, Tote, Phone Case)
const BLUEPRINTS = [
  { id: 5,  title: 'Unisex Cotton Crew Tee',     print_area: { width: 2000, height: 2200 }, category: ' apparel' },
  { id: 6,  title: 'Unisex Heavy Cotton Tee',    print_area: { width: 2000, height: 2400 }, category: 'apparel' },
  { id: 10, title: 'Classic Mug',                print_area: { width: 1500, height: 1500 }, category: 'accessories' },
  { id: 15, title: "Men's Very Important Tee",    print_area: { width: 2000, height: 2200 }, category: 'apparel' },
  { id: 26, title: "Men's Lightweight Fashion",   print_area: { width: 2000, height: 2200 }, category: 'apparel' },
  { id: 18, title: "Women's Ideal Racerback",     print_area: { width: 2000, height: 2200 }, category: 'apparel' },
  { id: 31, title: 'Poster',                      print_area: { width: 3000, height: 4600 }, category: 'art' },
  { id: 34, title: 'Canvas Print',                 print_area: { width: 4000, height: 4000 }, category: 'art' },
  { id: 21, title: 'Tote Bag',                    print_area: { width: 2000, height: 2400 }, category: 'accessories' },
  { id: 27, title: 'Phone Case',                  print_area: { width: 1260, height: 2520 }, category: 'accessories' },
  { id: 16, title: 'Pillow',                      print_area: { width: 3600, height: 3600 }, category: 'home' },
  { id: 9,  title: 'Apron',                       print_area: { width: 2000, height: 2400 }, category: 'home' },
]

// GET /api/printify/blueprints — public list of available product templates
router.get('/blueprints', (req, res) => {
  res.json({ success: true, data: BLUEPRINTS })
})

// GET /api/printify/blueprints/:id — single blueprint
router.get('/blueprints/:id', (req, res) => {
  const bp = BLUEPRINTS.find(b => String(b.id) === req.params.id)
  if (!bp) return res.status(404).json({ success: false, error: 'Blueprint not found' })
  res.json({ success: true, data: bp })
})

export default router

import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, FabricImage, FabricObject } from 'fabric'
import { Upload, RotateCw, ZoomIn, ZoomOut, Download } from 'lucide-react'

// Product templates mapped to Printify blueprint IDs
const products = [
  { id: 'tshirt', name: 'Classic T-Shirt', blueprintId: 5, width: 400, height: 450, printArea: { x: 100, y: 80, w: 200, h: 220 } },
  { id: 'mug', name: 'Classic Mug', blueprintId: 10, width: 500, height: 300, printArea: { x: 175, y: 75, w: 150, h: 150 } },
  { id: 'poster', name: 'Poster', blueprintId: 31, width: 400, height: 560, printArea: { x: 50, y: 50, w: 300, h: 460 } },
  { id: 'canvas', name: 'Canvas Print', blueprintId: 34, width: 480, height: 480, printArea: { x: 40, y: 40, w: 400, h: 400 } },
  { id: 'tote', name: 'Tote Bag', blueprintId: 21, width: 420, height: 480, printArea: { x: 110, y: 120, w: 200, h: 240 } },
]

export interface MockupData {
  dataUrl: string
  blueprintId: number
  productName: string
}

interface Props {
  artworkUrl?: string
  onSave?: (data: MockupData) => void
  initialProductId?: string
}

export default function MockupGenerator({ artworkUrl, onSave, initialProductId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedProduct, setSelectedProduct] = useState(products.find(p => p.id === initialProductId) || products[0])
  const [artwork, setArtwork] = useState<string | null>(artworkUrl || null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      width: selectedProduct.width,
      height: selectedProduct.height,
      backgroundColor: '#f5f4f0',
    })
    fabricRef.current = canvas
    drawProduct(selectedProduct)

    return () => { canvas.dispose(); fabricRef.current = null }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !fabricRef.current) return
    fabricRef.current.dispose()
    fabricRef.current = null
    const canvas = new Canvas(canvasRef.current, {
      width: selectedProduct.width,
      height: selectedProduct.height,
      backgroundColor: '#f5f4f0',
    })
    fabricRef.current = canvas
    drawProduct(selectedProduct)
  }, [selectedProduct])

  const drawProduct = (product: typeof products[0]) => {
    const canvas = fabricRef.current
    if (!canvas) return
    canvas.clear()
    canvas.backgroundColor = '#f5f4f0'

    const body = new FabricObject({
      left: 0, top: 0, width: product.width, height: product.height,
      fill: '#e8e7e3', stroke: '#d0cfc9', strokeWidth: 1, selectable: false,
    })
    canvas.add(body)

    const printArea = new FabricObject({
      left: product.printArea.x, top: product.printArea.y,
      width: product.printArea.w, height: product.printArea.h,
      fill: 'transparent', stroke: '#c9382a', strokeWidth: 1, strokeDashArray: [5, 3],
      selectable: false,
    })
    canvas.add(printArea)

    if (artwork) addArtworkToCanvas(artwork, product)
  }

  const addArtworkToCanvas = useCallback((url: string, product = selectedProduct) => {
    const canvas = fabricRef.current
    if (!canvas) return
    FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
      const maxW = product.printArea.w * 0.9
      const maxH = product.printArea.h * 0.9
      const scaleToFit = Math.min(maxW / img.width!, maxH / img.height!)
      img.scale(scaleToFit)
      img.set({
        left: product.printArea.x + product.printArea.w / 2,
        top: product.printArea.y + product.printArea.h / 2,
        originX: 'center', originY: 'center',
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      img.on('modified', () => {
        setScale(img.scaleX || 1)
        setRotation(img.angle || 0)
      })
      setScale(scaleToFit)
      canvas.renderAll()
    }).catch(console.error)
  }, [selectedProduct])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      setArtwork(url)
      const canvas = fabricRef.current
      if (!canvas) return
      const objs = canvas.getObjects()
      objs.slice(2).forEach(o => canvas.remove(o))
      addArtworkToCanvas(url)
    }
    reader.readAsDataURL(file)
  }

  const handleRotate = (deg: number) => {
    const canvas = fabricRef.current
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return
    obj.rotate((obj.angle || 0) + deg)
    setRotation(obj.angle || 0)
    canvas.renderAll()
  }

  const handleScale = (delta: number) => {
    const canvas = fabricRef.current
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return
    const newScale = Math.max(0.1, Math.min(5, (obj.scaleX || 1) + delta))
    obj.scale(newScale)
    setScale(newScale)
    canvas.renderAll()
  }

  const fitToContainer = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return
    const p = selectedProduct
    const newScale = Math.min((p.printArea.w * 0.9) / (obj.width! * obj.scaleX!), (p.printArea.h * 0.9) / (obj.height! * obj.scaleY!))
    obj.scale(newScale)
    obj.set({ left: p.printArea.x + p.printArea.w / 2, top: p.printArea.y + p.printArea.h / 2, originX: 'center', originY: 'center' })
    obj.setCoords()
    setScale(newScale)
    canvas.renderAll()
  }

  const exportImage = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataUrl = (canvas as any).toDataURL('image/png')
    onSave?.({ dataUrl, blueprintId: selectedProduct.blueprintId, productName: selectedProduct.name })

    // Download
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `mockup-${selectedProduct.id}.png`
    a.click()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Product selector */}
      <div>
        <p className="text-xs text-smoke uppercase tracking-wider mb-2">选择产品模板</p>
        <div className="flex gap-2 flex-wrap">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                selectedProduct.id === p.id
                  ? 'border-vermilion bg-vermilion/5 text-vermilion'
                  : 'border-light-ink text-smoke hover:border-smoke'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex flex-col items-center gap-4">
        <div ref={containerRef} className="overflow-auto max-w-full bg-warm-gray rounded-xl p-4" style={{ maxHeight: '400px' }}>
          <canvas ref={canvasRef} />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 justify-center">
          <label className="flex items-center gap-1.5 px-4 py-2 bg-warm-gray border border-light-ink rounded-lg text-xs font-medium text-smoke hover:bg-light-ink cursor-pointer">
            <Upload size={14} />
            <span>上传作品</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          <button onClick={fitToContainer} className="flex items-center gap-1.5 px-4 py-2 bg-warm-gray border border-light-ink rounded-lg text-xs font-medium text-smoke hover:bg-light-ink">
            <ZoomIn size={14} /> 适应框
          </button>

          <button onClick={() => handleScale(-0.1)} className="w-8 h-8 flex items-center justify-center bg-warm-gray border border-light-ink rounded-lg text-smoke hover:bg-light-ink">
            <ZoomOut size={14} />
          </button>
          <span className="text-xs text-smoke w-16 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => handleScale(0.1)} className="w-8 h-8 flex items-center justify-center bg-warm-gray border border-light-ink rounded-lg text-smoke hover:bg-light-ink">
            <ZoomIn size={14} />
          </button>

          <button onClick={() => handleRotate(-15)} className="w-8 h-8 flex items-center justify-center bg-warm-gray border border-light-ink rounded-lg text-smoke hover:bg-light-ink">
            <RotateCw size={14} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <span className="text-xs text-smoke w-12 text-center">{Math.round(rotation)}°</span>
          <button onClick={() => handleRotate(15)} className="w-8 h-8 flex items-center justify-center bg-warm-gray border border-light-ink rounded-lg text-smoke hover:bg-light-ink">
            <RotateCw size={14} />
          </button>

          <button onClick={exportImage} className="flex items-center gap-1.5 px-4 py-2 bg-vermilion text-paper rounded-lg text-xs font-medium hover:bg-vermilion/90">
            <Download size={14} /> 保存并导出
          </button>
        </div>

        <p className="text-xs text-smoke">
          红色虚线内为印刷区域 · 导出分辨率: {selectedProduct.width}x{selectedProduct.height}px
        </p>
      </div>
    </div>
  )
}

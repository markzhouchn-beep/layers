import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, FabricImage, FabricObject } from 'fabric'
import { Upload, RotateCw, ZoomIn, ZoomOut, Download } from 'lucide-react'

// Product templates - in production these would be real product mask images
const products = [
  { id: 'tshirt', name: 'T-Shirt', width: 400, height: 450, printArea: { x: 100, y: 80, w: 200, h: 220 } },
  { id: 'mug', name: 'Mug', width: 500, height: 300, printArea: { x: 175, y: 75, w: 150, h: 150 } },
  { id: 'poster', name: 'Poster', width: 400, height: 560, printArea: { x: 50, y: 50, w: 300, h: 460 } },
  { id: 'canvas', name: 'Canvas', width: 480, height: 480, printArea: { x: 40, y: 40, w: 400, h: 400 } },
  { id: 'tote', name: 'Tote Bag', width: 420, height: 480, printArea: { x: 110, y: 120, w: 200, h: 240 } },
]

interface Props {
  artworkUrl?: string
  onSave?: (dataUrl: string) => void
}

export default function MockupGenerator({ artworkUrl, onSave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [artwork, setArtwork] = useState<string | null>(artworkUrl || null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)


  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return

    const product = selectedProduct
    const canvas = new Canvas(canvasRef.current, {
      width: product.width,
      height: product.height,
      backgroundColor: '#f5f4f0',
    })

    fabricRef.current = canvas

    // Draw product shape
    const drawProduct = () => {
      const p = selectedProduct
      canvas.clear()
      canvas.backgroundColor = '#f5f4f0'

      // Draw placeholder product outline
      const rect = new FabricObject({
        left: 0,
        top: 0,
        width: p.width,
        height: p.height,
        fill: '#e8e7e3',
        stroke: '#d0cfc9',
        strokeWidth: 1,
        selectable: false,
      })
      canvas.add(rect)

      // Print area indicator (dashed)
      const printArea = new FabricObject({
        left: p.printArea.x,
        top: p.printArea.y,
        width: p.printArea.w,
        height: p.printArea.h,
        fill: 'transparent',
        stroke: '#c9382a',
        strokeWidth: 1,
        strokeDashArray: [5, 3],
        selectable: false,
      })
      canvas.add(printArea)

      if (artwork) {
        addArtworkToCanvas(artwork)
      }
    }

    drawProduct()

    return () => {
      canvas.dispose()
      fabricRef.current = null
    }
  }, [])

  // Re-init canvas on product change
  useEffect(() => {
    if (!canvasRef.current) return
    if (fabricRef.current) {
      fabricRef.current.dispose()
      fabricRef.current = null
    }

    const product = selectedProduct
    const canvas = new Canvas(canvasRef.current, {
      width: product.width,
      height: product.height,
      backgroundColor: '#f5f4f0',
    })
    fabricRef.current = canvas

    const rect = new FabricObject({
      left: 0, top: 0, width: product.width, height: product.height,
      fill: '#e8e7e3', stroke: '#d0cfc9', strokeWidth: 1, selectable: false,
    })
    canvas.add(rect)

    const printArea = new FabricObject({
      left: product.printArea.x, top: product.printArea.y,
      width: product.printArea.w, height: product.printArea.h,
      fill: 'transparent', stroke: '#c9382a', strokeWidth: 1, strokeDashArray: [5, 3],
      selectable: false,
    })
    canvas.add(printArea)

    if (artwork) addArtworkToCanvas(artwork)
  }, [selectedProduct])

  const addArtworkToCanvas = useCallback((url: string) => {
    const canvas = fabricRef.current
    if (!canvas) return
    const p = selectedProduct

    FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
      const maxW = p.printArea.w * 0.9
      const maxH = p.printArea.h * 0.9
      const scaleToFit = Math.min(maxW / img.width!, maxH / img.height!)
      img.scale(scaleToFit)
      img.set({
        left: p.printArea.x + p.printArea.w / 2,
        top: p.printArea.y + p.printArea.h / 2,
        originX: 'center',
        originY: 'center',
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      img.on('modified', () => {
        setScale(img.scaleX || 1)
        setRotation(img.angle || 0)
      })
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
      if (canvas) {
        const objs = canvas.getObjects().filter(o => o !== canvas.getObjects()[0] && o !== canvas.getObjects()[1])
        objs.forEach(o => canvas.remove(o))
        addArtworkToCanvas(url)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRotate = (deg: number) => {
    const canvas = fabricRef.current
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return
    obj.rotate((obj.angle || 0) + deg)
    setRotation(obj.angle)
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

  const exportImage = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataUrl = (canvas as any).toDataURL('image/png')
    onSave?.(dataUrl)
    // Download
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `mockup-${selectedProduct.id}.png`
    a.click()
  }

  const fitToContainer = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return
    const p = selectedProduct
    const maxW = p.printArea.w * 0.9
    const maxH = p.printArea.h * 0.9
    const scaleToFit = Math.min(maxW / (obj.width! * obj.scaleX!), maxH / (obj.height! * obj.scaleY!))
    obj.scale(scaleToFit)
    obj.set({ left: p.printArea.x + p.printArea.w / 2, top: p.printArea.y + p.printArea.h / 2, originX: 'center', originY: 'center' })
    obj.setCoords()
    setScale(scaleToFit)
    canvas.renderAll()
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

      {/* Canvas area */}
      <div className="flex flex-col items-center gap-4">
        <div
          ref={containerRef}
          className="overflow-auto max-w-full bg-warm-gray rounded-xl p-4"
          style={{ maxHeight: '400px' }}
        >
          <canvas ref={canvasRef} />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 justify-center">
          {/* Upload */}
          <label className="flex items-center gap-1.5 px-4 py-2 bg-warm-gray border border-light-ink rounded-lg text-xs font-medium text-smoke hover:bg-light-ink cursor-pointer">
            <Upload size={14} />
            <span>上传作品</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          {/* Fit */}
          <button onClick={fitToContainer} className="flex items-center gap-1.5 px-4 py-2 bg-warm-gray border border-light-ink rounded-lg text-xs font-medium text-smoke hover:bg-light-ink">
            <ZoomIn size={14} /> 适应框
          </button>

          {/* Scale */}
          <button onClick={() => handleScale(-0.1)} className="w-8 h-8 flex items-center justify-center bg-warm-gray border border-light-ink rounded-lg text-smoke hover:bg-light-ink">
            <ZoomOut size={14} />
          </button>
          <span className="text-xs text-smoke w-16 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => handleScale(0.1)} className="w-8 h-8 flex items-center justify-center bg-warm-gray border border-light-ink rounded-lg text-smoke hover:bg-light-ink">
            <ZoomIn size={14} />
          </button>

          {/* Rotate */}
          <button onClick={() => handleRotate(-15)} className="w-8 h-8 flex items-center justify-center bg-warm-gray border border-light-ink rounded-lg text-smoke hover:bg-light-ink">
            <RotateCw size={14} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <span className="text-xs text-smoke w-12 text-center">{Math.round(rotation)}°</span>
          <button onClick={() => handleRotate(15)} className="w-8 h-8 flex items-center justify-center bg-warm-gray border border-light-ink rounded-lg text-smoke hover:bg-light-ink">
            <RotateCw size={14} />
          </button>

          {/* Export */}
          <button onClick={exportImage} className="flex items-center gap-1.5 px-4 py-2 bg-vermilion text-paper rounded-lg text-xs font-medium hover:bg-vermilion/90">
            <Download size={14} /> 导出 PNG
          </button>
        </div>

        {/* Scale info */}
        <p className="text-xs text-smoke">
          红色虚线内为印刷区域 · 导出分辨率: {selectedProduct.width}x{selectedProduct.height}px
        </p>
      </div>
    </div>
  )
}

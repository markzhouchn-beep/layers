import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, FabricImage, FabricObject } from 'fabric'
import { Upload, RotateCw, ZoomIn, ZoomOut, Download } from 'lucide-react'

const products = [
  {
    id: 'tshirt',
    name: 'Classic T-Shirt',
    blueprintId: 5,
    width: 420,
    height: 460,
    printArea: { x: 105, y: 85, w: 210, h: 220 },
    // CSS shape dimensions
    shirt: { left: 0, top: 0, width: 420, height: 460, color: '#e8e7e3' },
  },
  {
    id: 'mug',
    name: 'Classic Mug',
    blueprintId: 10,
    width: 480,
    height: 300,
    printArea: { x: 165, y: 60, w: 150, h: 150 },
    mug: { left: 0, top: 0, width: 480, height: 300, color: '#f0eeea' },
  },
  {
    id: 'poster',
    name: 'Poster',
    blueprintId: 31,
    width: 400,
    height: 560,
    printArea: { x: 50, y: 50, w: 300, h: 460 },
  },
  {
    id: 'canvas',
    name: 'Canvas Print',
    blueprintId: 34,
    width: 480,
    height: 480,
    printArea: { x: 40, y: 40, w: 400, h: 400 },
  },
  {
    id: 'tote',
    name: 'Tote Bag',
    blueprintId: 21,
    width: 420,
    height: 480,
    printArea: { x: 110, y: 110, w: 200, h: 260 },
    tote: { left: 0, top: 0, width: 420, height: 480, color: '#e8e7e3' },
  },
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

// Draw a t-shirt silhouette on canvas
function drawTShirtShape(canvas: Canvas) {
  const body = new FabricObject({
    left: 60, top: 40, width: 300, height: 400,
    fill: '#e0dfdb', stroke: '#c8c7c1', strokeWidth: 1, selectable: false,
  })
  // Left sleeve
  const leftSleeve = new FabricObject({
    left: 30, top: 60, width: 60, height: 130,
    angle: -30, fill: '#e0dfdb', stroke: '#c8c7c1', strokeWidth: 1, selectable: false,
  })
  // Right sleeve
  const rightSleeve = new FabricObject({
    left: 330, top: 60, width: 60, height: 130,
    angle: 30, fill: '#e0dfdb', stroke: '#c8c7c1', strokeWidth: 1, selectable: false,
  })
  // Collar
  const collar = new FabricObject({
    left: 170, top: 30, width: 80, height: 30,
    fill: '#e0dfdb', stroke: '#c8c7c1', strokeWidth: 1, selectable: false,
  })
  canvas.add(body, leftSleeve, rightSleeve, collar)
}

// Draw a mug silhouette on canvas
function drawMugShape(canvas: Canvas) {
  // Mug body
  const body = new FabricObject({
    left: 40, top: 30, width: 240, height: 240,
    fill: '#f0eeea', stroke: '#d4d2cc', strokeWidth: 1, selectable: false,
  })
  // Handle
  const handle = new FabricObject({
    left: 270, top: 80, width: 80, height: 150,
    fill: 'transparent', stroke: '#d4d2cc', strokeWidth: 14, selectable: false,
  })
  canvas.add(body, handle)
}

// Draw a tote bag shape on canvas
function drawToteShape(canvas: Canvas) {
  const body = new FabricObject({
    left: 30, top: 60, width: 360, height: 380,
    fill: '#e0dfdb', stroke: '#c8c7c1', strokeWidth: 1, selectable: false,
  })
  // Left strap
  const leftStrap = new FabricObject({
    left: 80, top: 0, width: 30, height: 90,
    fill: '#d8d7d3', stroke: '#c8c7c1', strokeWidth: 1, selectable: false,
  })
  // Right strap
  const rightStrap = new FabricObject({
    left: 310, top: 0, width: 30, height: 90,
    fill: '#d8d7d3', stroke: '#c8c7c1', strokeWidth: 1, selectable: false,
  })
  canvas.add(body, leftStrap, rightStrap)
}

export default function MockupGenerator({ artworkUrl, onSave, initialProductId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedProduct, setSelectedProduct] = useState(products.find(p => p.id === initialProductId) || products[0])
  const [artwork, setArtwork] = useState<string | null>(artworkUrl || null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  // Initialize canvas
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-init canvas when product changes
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

    // Re-add artwork if it exists
    if (artwork) {
      addArtworkToCanvas(artwork)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct.id])

  // Add artwork when it changes (product already drawn)
  useEffect(() => {
    if (!artwork || !fabricRef.current) return
    addArtworkToCanvas(artwork)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artwork])

  const drawProduct = (product: typeof products[0]) => {
    const canvas = fabricRef.current
    if (!canvas) return
    canvas.clear()
    canvas.backgroundColor = '#f5f4f0'

    // Draw product-specific shapes
    if (product.id === 'tshirt') drawTShirtShape(canvas)
    else if (product.id === 'mug') drawMugShape(canvas)
    else if (product.id === 'tote') drawToteShape(canvas)
    else {
      // Default: poster/canvas = white rectangle with border
      const body = new FabricObject({
        left: 0, top: 0, width: product.width, height: product.height,
        fill: product.id === 'poster' ? '#faf9f6' : '#f5f4f0',
        stroke: product.id === 'poster' ? '#d0cfc9' : '#c8c7c1',
        strokeWidth: 1, selectable: false,
      })
      canvas.add(body)
    }

    // Print area indicator (dashed red border)
    const printArea = new FabricObject({
      left: product.printArea.x,
      top: product.printArea.y,
      width: product.printArea.w,
      height: product.printArea.h,
      fill: 'transparent',
      stroke: '#c9382a',
      strokeWidth: 1.5,
      strokeDashArray: [6, 3],
      selectable: false,
      evented: false,
    })
    canvas.add(printArea)
  }

  const addArtworkToCanvas = useCallback((url: string) => {
    const canvas = fabricRef.current
    if (!canvas) return
    FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
      const p = selectedProduct
      const maxW = p.printArea.w * 0.92
      const maxH = p.printArea.h * 0.92
      const scaleToFit = Math.min(maxW / (img.width || 1), maxH / (img.height || 1))
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
      // Remove existing artwork objects (keep product shape + print area)
      const objs = canvas.getObjects()
      objs.slice(4).forEach(o => canvas.remove(o))
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

  const fitToPrintArea = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return
    const p = selectedProduct
    const newScale = Math.min((p.printArea.w * 0.9) / (obj.width! * obj.scaleX!), (p.printArea.h * 0.9) / (obj.height! * obj.scaleY!))
    obj.scale(newScale)
    obj.set({
      left: p.printArea.x + p.printArea.w / 2,
      top: p.printArea.y + p.printArea.h / 2,
      originX: 'center',
      originY: 'center',
    })
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

    // Also trigger browser download
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `mockup-${selectedProduct.id}.png`
    a.click()
  }

  return (
    <div>
      {/* Product selector */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 8 }}>
          Product Template
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                border: `1.5px solid ${selectedProduct.id === p.id ? '#0075de' : 'rgba(0,0,0,0.12)'}`,
                background: selectedProduct.id === p.id ? 'rgba(0,117,222,0.06)' : 'transparent',
                color: selectedProduct.id === p.id ? '#0075de' : 'rgba(0,0,0,0.7)',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div
          ref={containerRef}
          style={{
            overflow: 'auto',
            maxWidth: '100%',
            background: '#f0eeea',
            borderRadius: 10,
            padding: 16,
            maxHeight: 420,
          }}
        >
          <canvas ref={canvasRef} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          {/* Upload artwork */}
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: 'rgba(0,0,0,0.75)',
              cursor: 'pointer',
              transition: 'background 0.12s',
            }}
          >
            <Upload size={13} />
            Upload Artwork
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Fit to print area */}
          <button
            onClick={fitToPrintArea}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 12px',
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: 'rgba(0,0,0,0.75)',
              cursor: 'pointer',
            }}
          >
            <ZoomIn size={13} />
            Fit to Print Area
          </button>

          {/* Zoom out */}
          <button
            onClick={() => handleScale(-0.1)}
            style={{
              width: 30,
              height: 30,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            <ZoomOut size={13} />
          </button>
          <span style={{ fontSize: 12, color: '#a39e98', minWidth: 44, textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          {/* Zoom in */}
          <button
            onClick={() => handleScale(0.1)}
            style={{
              width: 30,
              height: 30,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            <ZoomIn size={13} />
          </button>

          {/* Rotate */}
          <button
            onClick={() => handleRotate(-15)}
            style={{
              width: 30,
              height: 30,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            <RotateCw size={13} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <span style={{ fontSize: 12, color: '#a39e98', minWidth: 36, textAlign: 'center' }}>
            {Math.round(rotation)}°
          </span>
          <button
            onClick={() => handleRotate(15)}
            style={{
              width: 30,
              height: 30,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            <RotateCw size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 380 }}>
          <button
            onClick={exportImage}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: '#0075de',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Download size={14} />
            Save & Export Mockup
          </button>
          <p style={{ fontSize: 11, color: '#a39e98', textAlign: 'center' }}>
            Red dashed area = print area · Export resolution: {selectedProduct.width}×{selectedProduct.height}px
          </p>
        </div>
      </div>
    </div>
  )
}

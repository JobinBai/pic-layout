/** 画布主面板组件 */

import { useRef, useEffect, useCallback } from 'react'
import { Rect, FabricImage } from 'fabric'
import { useCanvas } from '../hooks'
import { useCanvasStore, useTemplateStore, useImageStore } from '../stores'
import { UNIT_CONVERSION } from '../utils/constants'

export default function CanvasPanel() {
  const canvasElRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { getCanvas } = useCanvas(canvasElRef)

  const setContainerBounds = useCanvasStore((s) => s.setContainerBounds)
  const canvasWidth = useCanvasStore((s) => s.width)
  const canvasHeight = useCanvasStore((s) => s.height)
  const canvasUnit = useCanvasStore((s) => s.unit)
  const canvasDpi = useCanvasStore((s) => s.dpi)
  const backgroundColor = useCanvasStore((s) => s.backgroundColor)
  const zoom = useCanvasStore((s) => s.zoom)

  const currentTemplate = useTemplateStore((s) => s.currentTemplate)
  const slotGap = useTemplateStore((s) => s.slotGap)
  const slotRadius = useTemplateStore((s) => s.slotRadius)

  const images = useImageStore((s) => s.images)

  // 计算画布像素尺寸（显示用）
  const displayWidth = Math.round(canvasWidth * UNIT_CONVERSION[canvasUnit])
  const displayHeight = Math.round(canvasHeight * UNIT_CONVERSION[canvasUnit])

  // 更新容器尺寸到 store
  useEffect(() => {
    const el = containerRef.current
    if (el && el.clientWidth > 0 && el.clientHeight > 0) {
      setContainerBounds({
        width: el.clientWidth,
        height: el.clientHeight,
      })
    }
  }, [setContainerBounds])

  // 监听容器尺寸变化并自动适应缩放
  const containerBounds = useCanvasStore((s) => s.containerBounds)
  useEffect(() => {
    if (containerBounds && containerBounds.width > 0 && containerBounds.height > 0) {
      useCanvasStore.getState().fitZoom()
    }
  }, [containerBounds])

  // 渲染模板槽位和图片
  const renderCanvas = useCallback(() => {
    const canvas = getCanvas()
    if (!canvas) return

    canvas.clear()
    canvas.backgroundColor = backgroundColor

    const tpl = currentTemplate
    const gap = slotGap
    const radius = slotRadius
    const allImages = images

    const cw = displayWidth
    const ch = displayHeight

    tpl.slots.forEach((slot) => {
      const sx = slot.x * cw + gap
      const sy = slot.y * ch + gap
      const sw = slot.width * cw - gap * 2
      const sh = slot.height * ch - gap * 2

      const assignedImage = allImages.find((img) => img.slotId === slot.id)

      if (assignedImage) {
        FabricImage.fromURL(assignedImage.url).then((fabricImg) => {
          const imgW = fabricImg.width || 1
          const imgH = fabricImg.height || 1
          const imgRatio = imgW / imgH
          const slotRatio = sw / sh
          let drawW: number, drawH: number

          if (assignedImage.fillMode === 'cover') {
            if (imgRatio > slotRatio) { drawH = sh; drawW = sh * imgRatio }
            else { drawW = sw; drawH = sw / imgRatio }
          } else if (assignedImage.fillMode === 'contain') {
            if (imgRatio > slotRatio) { drawW = sw; drawH = sw / imgRatio }
            else { drawH = sh; drawW = sh * imgRatio }
          } else {
            drawW = sw; drawH = sh
          }

          fabricImg.set({
            left: sx + (sw - drawW) / 2,
            top: sy + (sh - drawH) / 2,
            scaleX: drawW / imgW,
            scaleY: drawH / imgH,
            selectable: true,
            evented: true,
            name: `img-${assignedImage.id}`,
            _slotBounds: { x: sx, y: sy, w: sw, h: sh },
          })
          
          fabricImg.on('mouseup', () => {
            const centerX = fabricImg.left! + drawW / 2
            const centerY = fabricImg.top! + drawH / 2

            let targetSlotId: string | null = null
            for (const slot of tpl.slots) {
              if (slot.id === assignedImage.slotId) continue
              const tsx = slot.x * cw + gap
              const tsy = slot.y * ch + gap
              const tsw = slot.width * cw - gap * 2
              const tsh = slot.height * ch - gap * 2

              if (centerX >= tsx && centerX <= tsx + tsw && centerY >= tsy && centerY <= tsy + tsh) {
                targetSlotId = slot.id
                break
              }
            }

            if (targetSlotId) {
              const isTargetEmpty = !useImageStore.getState().images.find(img => img.slotId === targetSlotId)
              if (isTargetEmpty) {
                useImageStore.getState().assignImageToSlot(assignedImage.id, targetSlotId)
                return
              }
            }

            // Snap back if no valid drop target
            const bounds = fabricImg.get('_slotBounds') as { x: number; y: number; w: number; h: number }
            if (bounds) {
              const newLeft = Math.max(bounds.x, Math.min(bounds.x + bounds.w - drawW, fabricImg.left!))
              const newTop = Math.max(bounds.y, Math.min(bounds.y + bounds.h - drawH, fabricImg.top!))
              fabricImg.set({ left: newLeft, top: newTop })
              canvas.renderAll()
            }
          })
          
          // Double click to remove from slot
          fabricImg.on('mousedblclick', () => {
            useImageStore.getState().removeImageFromSlot(assignedImage.id)
          })

          canvas.add(fabricImg)
          canvas.renderAll()
        })
      } else {
        const slotRect = new Rect({
          left: sx, top: sy, width: sw, height: sh,
          fill: 'rgba(42, 42, 60, 0.3)',
          stroke: '#585b70', strokeWidth: 1.5, strokeDashArray: [6, 4],
          rx: radius, ry: radius,
          selectable: false, evented: false,
          name: `slot-${slot.id}`,
        })
        canvas.add(slotRect)
      }
    })

    canvas.setDimensions({ width: displayWidth, height: displayHeight })
    canvas.renderAll()
  }, [getCanvas, displayWidth, displayHeight, backgroundColor, currentTemplate, slotGap, slotRadius, images])

  // 当模板/图片/画布变化时重新渲染
  useEffect(() => {
    renderCanvas()
  }, [renderCanvas, currentTemplate, images, canvasWidth, canvasHeight, canvasUnit, slotGap, slotRadius, backgroundColor])

  // 滚轮缩放（缩放 DOM，不修改 Fabric Zoom）
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return

      const prevZoom = useCanvasStore.getState().zoom
      const nextZoom = Math.max(0.1, Math.min(5, prevZoom * (e.deltaY > 0 ? 0.95 : 1.05)))

      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left + el.scrollLeft
      const y = e.clientY - rect.top + el.scrollTop
      const ux = x / prevZoom
      const uy = y / prevZoom

      useCanvasStore.getState().setZoom(nextZoom)

      requestAnimationFrame(() => {
        el.scrollLeft = ux * nextZoom - (e.clientX - rect.left)
        el.scrollTop = uy * nextZoom - (e.clientY - rect.top)
      })

      e.preventDefault()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const getObjectName = (obj: unknown): string | undefined => {
    const nameValue = (obj as { name?: unknown }).name
    if (typeof nameValue === 'string') return nameValue

    const get = (obj as { get?: (key: string) => unknown }).get
    if (typeof get !== 'function') return undefined

    const v = get.call(obj, 'name')
    return typeof v === 'string' ? v : undefined
  }

  // 键盘事件（删除选中图片）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const canvas = getCanvas()
        if (!canvas) return
        
        const activeObjects = canvas.getActiveObjects()
        if (activeObjects.length > 0) {
          activeObjects.forEach(obj => {
            const name = getObjectName(obj)
            if (name && name.startsWith('img-')) {
              const imageId = name.replace('img-', '')
              useImageStore.getState().removeImageFromSlot(imageId)
            }
          })
          // 清除选中状态以防残留
          canvas.discardActiveObject()
          canvas.renderAll()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [getCanvas])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const imageId = e.dataTransfer.getData('application/x-pic-layout-image')
    if (!imageId) return

    // 获取放置坐标，相对 canvas 左上角
    const canvasEl = canvasElRef.current
    if (!canvasEl) return
    const rect = canvasEl.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    // 查找包含该点的槽位
    const tpl = useTemplateStore.getState().currentTemplate
    const gap = useTemplateStore.getState().slotGap
    const cw = displayWidth
    const ch = displayHeight

    for (const slot of tpl.slots) {
      const sx = slot.x * cw + gap
      const sy = slot.y * ch + gap
      const sw = slot.width * cw - gap * 2
      const sh = slot.height * ch - gap * 2

      if (x >= sx && x <= sx + sw && y >= sy && y <= sy + sh) {
        useImageStore.getState().assignImageToSlot(imageId, slot.id)
        break
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  return (
    <div ref={containerRef} className="flex-1 flex items-center justify-center bg-surface-deep overflow-auto relative">
      <div 
        className="shadow-2xl" 
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <canvas ref={canvasElRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-surface-secondary/80 backdrop-blur-sm flex items-center px-4 text-xs text-text-secondary gap-4">
        <span>{canvasWidth} × {canvasHeight} {canvasUnit}</span>
        <span>|</span>
        <span>{displayWidth} × {displayHeight} px</span>
        <span>|</span>
        <span>{Math.round(zoom * 100)}%</span>
        <span>|</span>
        <span>DPI {canvasDpi}</span>
      </div>
    </div>
  )
}

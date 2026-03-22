/** Fabric.js Canvas 生命周期管理 hook */

import { useEffect, useRef, useCallback } from 'react'
import { Canvas } from 'fabric'
import { useCanvasStore } from '../stores'

export function useCanvas(canvasElRef: React.RefObject<HTMLCanvasElement | null>) {
  const fabricRef = useRef<Canvas | null>(null)

  const getCanvas = useCallback(() => fabricRef.current, [])

  /** 初始化 Fabric.js Canvas */
  useEffect(() => {
    const el = canvasElRef.current
    if (!el) return

    const canvas = new Canvas(el, {
      selection: false,
      preserveObjectStacking: true,
      backgroundColor: useCanvasStore.getState().backgroundColor,
    })

    fabricRef.current = canvas
    useCanvasStore.getState().setCanvas(canvas)

    return () => {
      canvas.dispose()
      fabricRef.current = null
      useCanvasStore.getState().setCanvas(null)
    }
  }, [canvasElRef])

  return { getCanvas }
}

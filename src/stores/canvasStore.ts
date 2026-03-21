/** 画布状态管理 */

import { create } from 'zustand'
import type { Canvas as FabricCanvas } from 'fabric'
import type { CanvasSize, SizeUnit } from '../types'
import { DEFAULT_CANVAS_CONFIG, UNIT_CONVERSION } from '../utils/constants'

interface CanvasState {
  canvas: FabricCanvas | null
  width: number
  height: number
  unit: SizeUnit
  backgroundColor: string
  dpi: number
  zoom: number

  setCanvas: (c: FabricCanvas | null) => void
  setWidth: (w: number) => void
  setHeight: (h: number) => void
  setSize: (size: CanvasSize) => void
  setUnit: (u: SizeUnit) => void
  setBackgroundColor: (c: string) => void
  setDpi: (d: number) => void
  setZoom: (z: number) => void
  zoomIn: () => void
  zoomOut: () => void
  fitZoom: () => void
  swapOrientation: () => void

  /** 获取画布像素尺寸 */
  getPixelSize: () => { width: number; height: number }
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvas: null,
  width: DEFAULT_CANVAS_CONFIG.width,
  height: DEFAULT_CANVAS_CONFIG.height,
  unit: DEFAULT_CANVAS_CONFIG.unit,
  backgroundColor: DEFAULT_CANVAS_CONFIG.backgroundColor,
  dpi: DEFAULT_CANVAS_CONFIG.dpi,
  zoom: 1,

  setCanvas: (c) => set({ canvas: c }),
  setWidth: (w) => set({ width: w }),
  setHeight: (h) => set({ height: h }),
  setSize: (size) => set({ width: size.width, height: size.height, unit: size.unit }),
  setUnit: (u) => set({ unit: u }),
  setBackgroundColor: (c) => set({ backgroundColor: c }),
  setDpi: (d) => set({ dpi: d }),
  setZoom: (z) => set({ zoom: Math.max(0.1, Math.min(5, z)) }),
  zoomIn: () => {
    const { zoom } = get()
    set({ zoom: Math.min(5, zoom + 0.1) })
  },
  zoomOut: () => {
    const { zoom } = get()
    set({ zoom: Math.max(0.1, zoom - 0.1) })
  },
  fitZoom: () => {
    const { getPixelSize } = get()
    const px = getPixelSize()
    const containerW = window.innerWidth - 480
    const containerH = window.innerHeight - 64
    const scaleX = containerW / px.width
    const scaleY = containerH / px.height
    set({ zoom: Math.min(scaleX, scaleY, 1) })
  },
  swapOrientation: () => {
    const { width, height } = get()
    set({ width: height, height: width })
  },

  getPixelSize: () => {
    const { width, height, unit, dpi } = get()
    const scale = UNIT_CONVERSION[unit] * (dpi / 96)
    return {
      width: Math.round(width * scale),
      height: Math.round(height * scale),
    }
  },
}))

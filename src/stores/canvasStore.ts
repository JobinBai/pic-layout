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

  // 动态获取容器尺寸（用于 fitZoom）
  containerBounds: { width: number; height: number } | null

  setCanvas: (c: FabricCanvas | null) => void
  setWidth: (w: number) => void
  setHeight: (h: number) => void
  setSize: (size: CanvasSize) => void
  setUnit: (u: SizeUnit) => void
  setBackgroundColor: (c: string) => void
  setDpi: (d: number) => void
  setZoom: (z: number) => void
  setContainerBounds: (bounds: { width: number; height: number } | null) => void
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
  containerBounds: null,

  setCanvas: (c) => set({ canvas: c }),
  setWidth: (w) => {
    set({ width: w })
    // 尺寸变化时自动适应缩放
    setTimeout(() => get().fitZoom(), 0)
  },
  setHeight: (h) => {
    set({ height: h })
    setTimeout(() => get().fitZoom(), 0)
  },
  setSize: (size) => {
    set({ width: size.width, height: size.height, unit: size.unit })
    setTimeout(() => get().fitZoom(), 0)
  },
  setUnit: (u) => {
    set({ unit: u })
    setTimeout(() => get().fitZoom(), 0)
  },
  setBackgroundColor: (c) => set({ backgroundColor: c }),
  setDpi: (d) => set({ dpi: d }),
  setZoom: (z) => set({ zoom: Math.max(0.1, Math.min(5, z)) }),
  setContainerBounds: (bounds) => set({ containerBounds: bounds }),
  zoomIn: () => {
    const { zoom } = get()
    set({ zoom: Math.min(5, zoom + 0.1) })
  },
  zoomOut: () => {
    const { zoom } = get()
    set({ zoom: Math.max(0.1, zoom - 0.1) })
  },
  fitZoom: () => {
    const { containerBounds } = get()
    
    // 如果没有容器尺寸，跳过
    if (!containerBounds || containerBounds.width <= 0 || containerBounds.height <= 0) {
      return
    }
    
    // 使用 display 尺寸（基于 96 DPI 的标准显示尺寸，与 CanvasPanel 一致）
    const { width, height, unit } = get()
    const pxWidth = width * UNIT_CONVERSION[unit]
    const pxHeight = height * UNIT_CONVERSION[unit]
    
    // 容器可用尺寸（减去边距和底部状态栏）
    const paddingX = 48
    const paddingY = 80 // 顶部和底部状态栏
    const usableW = containerBounds.width - paddingX
    const usableH = containerBounds.height - paddingY
    
    const scaleX = usableW / pxWidth
    const scaleY = usableH / pxHeight
    set({ zoom: Math.min(scaleX, scaleY, 1) })
  },
  swapOrientation: () => {
    const { width, height } = get()
    set({ width: height, height: width })
    setTimeout(() => get().fitZoom(), 0)
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

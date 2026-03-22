/** 画布状态管理 */

import { create } from 'zustand'
import type { Canvas as FabricCanvas } from 'fabric'
import type { CanvasSize, SizeUnit } from '../types'
import { DEFAULT_CANVAS_CONFIG, UNIT_CONVERSION } from '../utils/constants'

// 本地存储持久化
const STORAGE_KEY = 'canvas_config'

interface SavedCanvasConfig {
  width: number
  height: number
  unit: SizeUnit
  backgroundColor: string
  dpi: number
}

const loadSavedConfig = (): Partial<SavedCanvasConfig> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

const saveConfig = (state: SavedCanvasConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

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

  // 初始值（用于重置）
  initialConfig: SavedCanvasConfig

  // 导出模式（显示空白槽位）
  exportMode: 'normal' | 'blank'
  setExportMode: (mode: 'normal' | 'blank') => void

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
  resetToInitial: () => void

  /** 获取画布像素尺寸 */
  getPixelSize: () => { width: number; height: number }
}

const defaultConfig: SavedCanvasConfig = {
  width: DEFAULT_CANVAS_CONFIG.width,
  height: DEFAULT_CANVAS_CONFIG.height,
  unit: DEFAULT_CANVAS_CONFIG.unit,
  backgroundColor: DEFAULT_CANVAS_CONFIG.backgroundColor,
  dpi: DEFAULT_CANVAS_CONFIG.dpi,
}

const savedConfig = loadSavedConfig()
const initialConfig = { ...defaultConfig, ...savedConfig }

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvas: null,
  width: initialConfig.width,
  height: initialConfig.height,
  unit: initialConfig.unit,
  backgroundColor: initialConfig.backgroundColor,
  dpi: initialConfig.dpi,
  zoom: 1,
  containerBounds: null,
  initialConfig,
  exportMode: 'normal',
  setExportMode: (mode) => set({ exportMode: mode }),

  setCanvas: (c) => set({ canvas: c }),
  setWidth: (w) => {
    set({ width: w })
    saveConfig({ width: w, height: get().height, unit: get().unit, backgroundColor: get().backgroundColor, dpi: get().dpi })
    setTimeout(() => get().fitZoom(), 0)
  },
  setHeight: (h) => {
    set({ height: h })
    saveConfig({ width: get().width, height: h, unit: get().unit, backgroundColor: get().backgroundColor, dpi: get().dpi })
    setTimeout(() => get().fitZoom(), 0)
  },
  setSize: (size) => {
    set({ width: size.width, height: size.height, unit: size.unit })
    saveConfig({ width: size.width, height: size.height, unit: size.unit, backgroundColor: get().backgroundColor, dpi: get().dpi })
    setTimeout(() => get().fitZoom(), 0)
  },
  setUnit: (u) => {
    set({ unit: u })
    saveConfig({ width: get().width, height: get().height, unit: u, backgroundColor: get().backgroundColor, dpi: get().dpi })
    setTimeout(() => get().fitZoom(), 0)
  },
  setBackgroundColor: (c) => {
    set({ backgroundColor: c })
    saveConfig({ width: get().width, height: get().height, unit: get().unit, backgroundColor: c, dpi: get().dpi })
  },
  setDpi: (d) => {
    set({ dpi: d })
    saveConfig({ width: get().width, height: get().height, unit: get().unit, backgroundColor: get().backgroundColor, dpi: d })
  },
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
    
    // 如果没有容器尺寸，使用窗口尺寸作为备选
    const bounds = containerBounds && containerBounds.width > 0 && containerBounds.height > 0
      ? containerBounds
      : { width: window.innerWidth, height: window.innerHeight - 32 } // 32px toolbar
    
    // 容器可用尺寸（减去边距和底部状态栏）
    const paddingX = 48
    const paddingY = 80 // 顶部和底部状态栏
    const usableW = bounds.width - paddingX
    const usableH = bounds.height - paddingY
    
    // 使用 display 尺寸（基于 96 DPI 的标准显示尺寸，与 CanvasPanel 一致）
    const { width, height, unit } = get()
    const pxWidth = width * UNIT_CONVERSION[unit]
    const pxHeight = height * UNIT_CONVERSION[unit]
    
    const scaleX = usableW / pxWidth
    const scaleY = usableH / pxHeight
    set({ zoom: Math.min(scaleX, scaleY, 1) })
  },
  swapOrientation: () => {
    const { width, height } = get()
    const newWidth = height
    const newHeight = width
    set({ width: newWidth, height: newHeight })
    saveConfig({ width: newWidth, height: newHeight, unit: get().unit, backgroundColor: get().backgroundColor, dpi: get().dpi })
    setTimeout(() => get().fitZoom(), 0)
  },
  resetToInitial: () => {
    const { initialConfig } = get()
    set({
      width: initialConfig.width,
      height: initialConfig.height,
      unit: initialConfig.unit,
      backgroundColor: initialConfig.backgroundColor,
      dpi: initialConfig.dpi,
    })
    saveConfig(initialConfig)
    setTimeout(() => get().fitZoom(), 0)
  },
  resetToDefaults: () => {
    // 重置到系统默认值：A4 纸张 + 单张模板
    const defaults = {
      width: DEFAULT_CANVAS_CONFIG.width,
      height: DEFAULT_CANVAS_CONFIG.height,
      unit: DEFAULT_CANVAS_CONFIG.unit,
      backgroundColor: DEFAULT_CANVAS_CONFIG.backgroundColor,
      dpi: DEFAULT_CANVAS_CONFIG.dpi,
    }
    set(defaults)
    saveConfig(defaults)
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

/** 核心类型定义 */

// ============ 画布相关 ============

export type SizeUnit = 'mm' | 'cm' | 'inch' | 'px'

export interface CanvasSize {
  width: number
  height: number
  unit: SizeUnit
}

export interface CanvasConfig {
  size: CanvasSize
  backgroundColor: string
  dpi: number
  zoom: number
}

// ============ 模板相关 ============

export type TemplateCategory = 'grid' | 'collage' | 'custom'

export interface Slot {
  id: string
  x: number        // 相对画布的比例位置 (0~1)
  y: number
  width: number     // 相对画布的比例大小 (0~1)
  height: number
}

export interface Template {
  id: string
  name: string
  category: TemplateCategory
  slots: Slot[]
  thumbnail?: string // 模板预览缩略图
  rowCount?: number
  colCount?: number
}

// ============ 图片相关 ============

export type FillMode = 'cover' | 'contain' | 'stretch'

export interface ImageItem {
  id: string
  file: File
  name: string
  url: string        // Object URL
  width: number      // 原始尺寸
  height: number
  slotId?: string    // 已分配的槽位 ID
  fillMode: FillMode
}

// ============ 导出相关 ============

export type ExportFormat = 'png' | 'jpg' | 'pdf'

export interface ExportConfig {
  format: ExportFormat
  dpi: number
  jpgQuality: number   // 0 ~ 1
  transparent: boolean // 仅 PNG
}

// ============ 历史记录 ============

export interface HistoryEntry {
  id: string
  timestamp: number
  description: string
  state: unknown
}

// ============ 画布预设尺寸 ============

export interface PresetSize {
  id: string
  name: string
  width: number
  height: number
  unit: SizeUnit
  category?: string
}

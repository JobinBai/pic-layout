/** 常量定义 */

import type { PresetSize, SizeUnit, ExportFormat } from '../types'

// 单位换算：mm -> px（基于 96 DPI）
const MM_TO_PX = 96 / 25.4
const CM_TO_PX = MM_TO_PX * 10
const INCH_TO_PX = 96

export const UNIT_CONVERSION: Record<SizeUnit, number> = {
  mm: MM_TO_PX,
  cm: CM_TO_PX,
  inch: INCH_TO_PX,
  px: 1,
}

// 预设画布尺寸
export const PRESET_SIZES: PresetSize[] = [
  { id: 'a4', name: 'A4', width: 210, height: 297, unit: 'mm', category: '纸张' },
  { id: 'a3', name: 'A3', width: 297, height: 420, unit: 'mm', category: '纸张' },
  { id: 'a5', name: 'A5', width: 148, height: 210, unit: 'mm', category: '纸张' },
  { id: 'photo-3', name: '3 寸', width: 89, height: 63, unit: 'mm', category: '照片' },
  { id: 'photo-4', name: '4 寸', width: 102, height: 152, unit: 'mm', category: '照片' },
  { id: 'photo-6', name: '6 寸', width: 152, height: 102, unit: 'mm', category: '照片' },
  { id: 'photo-7', name: '7 寸', width: 178, height: 127, unit: 'mm', category: '照片' },
  { id: 'square', name: '正方形', width: 300, height: 300, unit: 'mm', category: '社交' },
  { id: '16-9', name: '16:9', width: 400, height: 225, unit: 'mm', category: '社交' },
  { id: '9-16', name: '9:16', width: 225, height: 400, unit: 'mm', category: '社交' },
  { id: 'wechat-h', name: '朋友圈横版', width: 1080, height: 540, unit: 'px', category: '社交' },
  { id: 'wechat-v', name: '朋友圈竖版', width: 540, height: 960, unit: 'px', category: '社交' },
]

// DPI 预设
export const DPI_PRESETS = [72, 150, 300, 600]

// 导出格式
export const EXPORT_FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'png', label: 'PNG（无损）' },
  { value: 'jpg', label: 'JPG（较小）' },
  { value: 'pdf', label: 'PDF（打印）' },
]

// 默认导出配置
export const DEFAULT_EXPORT_CONFIG = {
  format: 'png' as ExportFormat,
  dpi: 300,
  jpgQuality: 0.92,
  transparent: false,
}

// 默认画布配置
export const DEFAULT_CANVAS_CONFIG = {
  width: 210,
  height: 297,
  unit: 'mm' as SizeUnit,
  backgroundColor: '#FFFFFF',
  dpi: 300,
  zoom: 1,
}

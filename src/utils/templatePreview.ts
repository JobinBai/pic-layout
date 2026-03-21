/** 模板预览 SVG 生成工具 */

import type { Slot } from '../types'

/**
 * 生成模板缩略图的 SVG 字符串
 */
export function generateTemplatePreview(
  slots: Slot[],
  width: number = 120,
  height: number = 90
): string {
  const slotElements = slots
    .map((slot) => {
      const x = slot.x * width
      const y = slot.y * height
      const w = slot.width * width
      const h = slot.height * height
      return `<rect x="${x + 2}" y="${y + 2}" width="${Math.max(w - 4, 2)}" height="${Math.max(h - 4, 2)}" rx="4" fill="#3B82F6" opacity="0.4" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3,2"/>`
    })
    .join('')

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" rx="8" fill="#2A2A3C"/>
      ${slotElements}
    </svg>`
  )}`
}

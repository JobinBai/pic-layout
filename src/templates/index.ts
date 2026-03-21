/** 内置排版模板配置 */

import type { Template } from '../types'

let slotCounter = 0
function slot(x: number, y: number, w: number, h: number) {
  return { id: `slot-${++slotCounter}`, x, y, width: w, height: h }
}

function resetSlots() {
  slotCounter = 0
}

// ==================== 网格类模板 ====================

export function createGridTemplate(rowCount: number, colCount: number): Template {
  resetSlots()
  const slots = []
  const cellW = 1 / colCount
  const cellH = 1 / rowCount
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      slots.push(slot(c * cellW, r * cellH, cellW, cellH))
    }
  }
  return {
    id: `custom-${rowCount}x${colCount}`,
    name: `${colCount}×${rowCount}`,
    category: 'custom',
    slots,
    rowCount,
    colCount,
  }
}

// ==================== 预设模板 ====================

export const BUILT_IN_TEMPLATES: Template[] = [
  // --- 网格类 ---
  (() => {
    resetSlots()
    return {
      id: 'single',
      name: '单张',
      category: 'grid',
      slots: [slot(0, 0, 1, 1)],
    }
  })(),

  (() => {
    resetSlots()
    return {
      id: 'h2',
      name: '2 张横排',
      category: 'grid',
      slots: [slot(0, 0, 0.5, 1), slot(0.5, 0, 0.5, 1)],
    }
  })(),

  (() => {
    resetSlots()
    return {
      id: 'v2',
      name: '2 张竖排',
      category: 'grid',
      slots: [slot(0, 0, 1, 0.5), slot(0, 0.5, 1, 0.5)],
    }
  })(),

  (() => {
    resetSlots()
    return {
      id: 'grid-2x2',
      name: '2×2 网格',
      category: 'grid',
      slots: [
        slot(0, 0, 0.5, 0.5),
        slot(0.5, 0, 0.5, 0.5),
        slot(0, 0.5, 0.5, 0.5),
        slot(0.5, 0.5, 0.5, 0.5),
      ],
    }
  })(),

  (() => {
    resetSlots()
    return {
      id: 'grid-3x3',
      name: '3×3 网格',
      category: 'grid',
      slots: [
        slot(0, 0, 1/3, 1/3), slot(1/3, 0, 1/3, 1/3), slot(2/3, 0, 1/3, 1/3),
        slot(0, 1/3, 1/3, 1/3), slot(1/3, 1/3, 1/3, 1/3), slot(2/3, 1/3, 1/3, 1/3),
        slot(0, 2/3, 1/3, 1/3), slot(1/3, 2/3, 1/3, 1/3), slot(2/3, 2/3, 1/3, 1/3),
      ],
    }
  })(),

  (() => {
    resetSlots()
    return {
      id: 'h4',
      name: '4 张横排',
      category: 'grid',
      slots: [
        slot(0, 0, 0.25, 1),
        slot(0.25, 0, 0.25, 1),
        slot(0.5, 0, 0.25, 1),
        slot(0.75, 0, 0.25, 1),
      ],
    }
  })(),

  // --- 拼接类 ---
  (() => {
    resetSlots()
    return {
      id: 'collage-1l2r',
      name: '1 大 + 2 小',
      category: 'collage',
      slots: [
        slot(0, 0, 0.5, 1),
        slot(0.5, 0, 0.5, 0.5),
        slot(0.5, 0.5, 0.5, 0.5),
      ],
    }
  })(),

  (() => {
    resetSlots()
    return {
      id: 'collage-1t2b',
      name: '1 上 + 2 下',
      category: 'collage',
      slots: [
        slot(0, 0, 1, 0.55),
        slot(0, 0.55, 0.5, 0.45),
        slot(0.5, 0.55, 0.5, 0.45),
      ],
    }
  })(),

  (() => {
    resetSlots()
    return {
      id: 'collage-1l3r',
      name: '1 大 + 3 小',
      category: 'collage',
      slots: [
        slot(0, 0, 0.5, 1),
        slot(0.5, 0, 0.5, 1/3),
        slot(0.5, 1/3, 0.5, 1/3),
        slot(0.5, 2/3, 0.5, 1/3),
      ],
    }
  })(),

  (() => {
    resetSlots()
    return {
      id: 'collage-1t3b',
      name: '1 上 + 3 下',
      category: 'collage',
      slots: [
        slot(0, 0, 1, 0.55),
        slot(0, 0.55, 1/3, 0.45),
        slot(1/3, 0.55, 1/3, 0.45),
        slot(2/3, 0.55, 1/3, 0.45),
      ],
    }
  })(),
]

/** 模板状态管理 */

import { create } from 'zustand'
import type { Template } from '../types'
import { BUILT_IN_TEMPLATES, createGridTemplate } from '../templates'

// 本地存储持久化
const CUSTOM_TEMPLATES_KEY = 'custom_templates'
const CURRENT_TEMPLATE_KEY = 'current_template_id'

const loadCustomTemplates = (): Template[] => {
  try {
    const saved = localStorage.getItem(CUSTOM_TEMPLATES_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveCustomTemplates = (templates: Template[]) => {
  const custom = templates.filter(t => t.category === 'custom')
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(custom))
}

const initialCustomTemplates = loadCustomTemplates()
const initialTemplates = [...BUILT_IN_TEMPLATES, ...initialCustomTemplates]

// 恢复上次选择的模板
const loadCurrentTemplate = (templates: Template[]): Template => {
  try {
    const savedId = localStorage.getItem(CURRENT_TEMPLATE_KEY)
    if (savedId) {
      const found = templates.find(t => t.id === savedId)
      if (found) return found
    }
  } catch {}
  return templates[0]
}

const initialCurrentTemplate = loadCurrentTemplate(initialTemplates)

interface TemplateState {
  templates: Template[]
  currentTemplate: Template
  slotGap: number
  slotRadius: number

  // 边距和间距
  canvasPadding: { top: number; right: number; bottom: number; left: number }
  slotMargin: number

  // 初始值（用于重置）
  initialTemplateId: string

  setTemplate: (t: Template) => void
  setSlotGap: (g: number) => void
  setSlotRadius: (r: number) => void
  setCanvasPadding: (padding: { top?: number; right?: number; bottom?: number; left?: number }) => void
  setSlotMargin: (margin: number) => void
  addCustomGrid: (rows: number, cols: number) => void
  deleteTemplate: (id: string) => void
  resetToInitial: () => void
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: initialTemplates,
  currentTemplate: initialCurrentTemplate,
  slotGap: 4,
  slotRadius: 0,
  canvasPadding: { top: 8, right: 8, bottom: 8, left: 8 },
  slotMargin: 4,
  initialTemplateId: initialCurrentTemplate.id,

  setTemplate: (t) => {
    localStorage.setItem(CURRENT_TEMPLATE_KEY, t.id)
    set({ currentTemplate: t })
  },
  setSlotGap: (g) => {
    const gap = Math.max(0, Math.min(20, g))
    set({ slotGap: gap, slotMargin: gap })
  },
  setSlotRadius: (r) => set({ slotRadius: Math.max(0, Math.min(20, r)) }),
  setCanvasPadding: (padding) => set((state) => ({
    canvasPadding: { ...state.canvasPadding, ...padding }
  })),
  setSlotMargin: (margin) => set({ slotMargin: margin, slotGap: margin }),
  addCustomGrid: (rows, cols) => {
    const custom = createGridTemplate(rows, cols)
    const { templates } = get()
    if (!templates.find((t) => t.id === custom.id)) {
      const newTemplates = [...templates, custom]
      saveCustomTemplates(newTemplates)
      set({ templates: newTemplates, currentTemplate: custom })
    } else {
      set({ currentTemplate: custom })
    }
  },
  deleteTemplate: (id: string) => {
    const { templates, currentTemplate } = get()
    const newTemplates = templates.filter(t => t.id !== id)
    saveCustomTemplates(newTemplates)
    
    set({
      templates: newTemplates,
      currentTemplate: currentTemplate.id === id ? newTemplates[0] : currentTemplate
    })
  },
  resetToInitial: () => {
    const { templates, initialTemplateId } = get()
    const initialTemplate = templates.find(t => t.id === initialTemplateId) || templates[0]
    set({
      currentTemplate: initialTemplate,
      slotGap: 4,
      slotRadius: 0,
      canvasPadding: { top: 8, right: 8, bottom: 8, left: 8 },
      slotMargin: 4,
    })
  },
  resetToDefaults: () => {
    // 重置到系统默认值：第一个预设模板（单张）
    const { templates } = get()
    const defaultTemplate = templates.find(t => t.id === 'single') || templates[0]
    set({
      currentTemplate: defaultTemplate,
      slotGap: 4,
      slotRadius: 0,
      canvasPadding: { top: 8, right: 8, bottom: 8, left: 8 },
      slotMargin: 4,
    })
  }
}))

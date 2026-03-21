/** 模板状态管理 */

import { create } from 'zustand'
import type { Template } from '../types'
import { BUILT_IN_TEMPLATES, createGridTemplate } from '../templates'

interface TemplateState {
  templates: Template[]
  currentTemplate: Template
  slotGap: number
  slotRadius: number

  setTemplate: (t: Template) => void
  setSlotGap: (g: number) => void
  setSlotRadius: (r: number) => void
  addCustomGrid: (rows: number, cols: number) => void
  deleteTemplate: (id: string) => void
}

const loadCustomTemplates = (): Template[] => {
  try {
    const saved = localStorage.getItem('custom_templates')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveCustomTemplates = (templates: Template[]) => {
  const custom = templates.filter(t => t.category === 'custom')
  localStorage.setItem('custom_templates', JSON.stringify(custom))
}

const initialCustomTemplates = loadCustomTemplates()
const initialTemplates = [...BUILT_IN_TEMPLATES, ...initialCustomTemplates]

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: initialTemplates,
  currentTemplate: initialTemplates[0],
  slotGap: 4,
  slotRadius: 0,

  setTemplate: (t) => set({ currentTemplate: t }),
  setSlotGap: (g) => set({ slotGap: Math.max(0, Math.min(20, g)) }),
  setSlotRadius: (r) => set({ slotRadius: Math.max(0, Math.min(20, r)) }),
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
  }
}))

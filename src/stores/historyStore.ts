/** 撤销/重做历史管理 */

import { create } from 'zustand'

interface HistoryState {
  undoStack: string[]
  redoStack: string[]
  maxHistory: number

  pushState: (jsonState: string) => void
  undo: (restore: (state: string) => void) => void
  redo: (restore: (state: string) => void) => void
  canUndo: () => boolean
  canRedo: () => boolean
  clear: () => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],
  maxHistory: 50,

  pushState: (jsonState) => {
    set((state) => ({
      undoStack: [...state.undoStack.slice(-(state.maxHistory - 1)), jsonState],
      redoStack: [],
    }))
  },

  undo: (restore) => {
    const { undoStack, redoStack } = get()
    if (undoStack.length === 0) return
    const newUndo = [...undoStack]
    const prev = newUndo.pop()!
    const current = undoStack[undoStack.length - 1] || ''
    set({ undoStack: newUndo, redoStack: [...redoStack, current] })
    restore(prev)
  },

  redo: (restore) => {
    const { undoStack, redoStack } = get()
    if (redoStack.length === 0) return
    const newRedo = [...redoStack]
    const next = newRedo.pop()!
    const current = undoStack[undoStack.length - 1] || ''
    set({ undoStack: [...undoStack, current], redoStack: newRedo })
    restore(next)
  },

  canUndo: () => get().undoStack.length > 1,
  canRedo: () => get().redoStack.length > 0,
  clear: () => set({ undoStack: [], redoStack: [] }),
}))

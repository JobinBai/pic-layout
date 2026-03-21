/** 图片列表状态管理 */

import { create } from 'zustand'
import type { ImageItem, FillMode } from '../types'

interface ImageState {
  images: ImageItem[]
  selectedImageId: string | null

  addImages: (files: File[]) => Promise<void>
  removeImage: (id: string) => void
  assignImageToSlot: (imageId: string, slotId: string) => void
  removeImageFromSlot: (imageId: string) => void
  setFillMode: (imageId: string, mode: FillMode) => void
  selectImage: (id: string | null) => void
  clearAll: () => void

  /** 获取已分配槽位的图片 */
  getAssignedImages: () => ImageItem[]
  /** 获取未分配槽位的图片 */
  getUnassignedImages: () => ImageItem[]
}

let imageCounter = 0

export const useImageStore = create<ImageState>((set, get) => ({
  images: [],
  selectedImageId: null,

  addImages: async (files: File[]) => {
    const newImages: ImageItem[] = []
    for (const file of files) {
      const id = `img-${++imageCounter}-${Date.now()}`
      const url = URL.createObjectURL(file)
      const dims = await loadImageDimensions(url)
      newImages.push({
        id,
        file,
        name: file.name,
        url,
        width: dims.width,
        height: dims.height,
        fillMode: 'cover',
      })
    }
    set((state) => ({ images: [...state.images, ...newImages] }))
  },

  removeImage: (id) => {
    const img = get().images.find((i) => i.id === id)
    if (img) URL.revokeObjectURL(img.url)
    set((state) => ({
      images: state.images.filter((i) => i.id !== id),
      selectedImageId: state.selectedImageId === id ? null : state.selectedImageId,
    }))
  },

  assignImageToSlot: (imageId, slotId) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId ? { ...img, slotId } : img.slotId === slotId ? { ...img, slotId: undefined } : img
      ),
    }))
  },

  removeImageFromSlot: (imageId) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId ? { ...img, slotId: undefined } : img
      ),
    }))
  },

  setFillMode: (imageId, mode) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId ? { ...img, fillMode: mode } : img
      ),
    }))
  },

  selectImage: (id) => set({ selectedImageId: id }),

  clearAll: () => {
    const { images } = get()
    images.forEach((img) => URL.revokeObjectURL(img.url))
    set({ images: [], selectedImageId: null })
  },

  getAssignedImages: () => get().images.filter((i) => i.slotId),
  getUnassignedImages: () => get().images.filter((i) => !i.slotId),
}))

/** 辅助：加载图片尺寸 */
function loadImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve({ width: 800, height: 600 })
    img.src = url
  })
}

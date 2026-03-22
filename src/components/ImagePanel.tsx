/** 右侧图片列表面板 */

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, ImagePlus, Trash2, X, MoveHorizontal, MoveVertical } from 'lucide-react'
import { useImageStore, useTemplateStore } from '../stores'
import ImageItem from './ImageItem'
import type { FillMode } from '../types'

const FILL_MODES: { value: FillMode; label: string }[] = [
  { value: 'cover', label: '裁剪填充' },
  { value: 'contain', label: '完整显示' },
  { value: 'stretch', label: '拉伸填充' },
]

export default function ImagePanel() {
  const images = useImageStore((s) => s.images)
  const selectedImageId = useImageStore((s) => s.selectedImageId)
  const addImages = useImageStore((s) => s.addImages)
  const removeImage = useImageStore((s) => s.removeImage)
  const selectImage = useImageStore((s) => s.selectImage)
  const clearAll = useImageStore((s) => s.clearAll)
  const setFillMode = useImageStore((s) => s.setFillMode)
  const assignImageToSlot = useImageStore((s) => s.assignImageToSlot)

  const currentTemplate = useTemplateStore((s) => s.currentTemplate)
  const canvasPadding = useTemplateStore((s) => s.canvasPadding)
  const setCanvasPadding = useTemplateStore((s) => s.setCanvasPadding)
  const slotMargin = useTemplateStore((s) => s.slotMargin)
  const setSlotMargin = useTemplateStore((s) => s.setSlotMargin)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addImages(acceptedFiles)
  }, [addImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    noClick: false,
  })

  const selectedImage = images.find((i) => i.id === selectedImageId)

  const autoAssign = () => {
    const slots = currentTemplate.slots
    if (slots.length === 0) return

    const assigned = new Set(images.filter((i) => i.slotId).map((i) => i.slotId!))
    let replaceIndex = 0

    const getNextSlotId = () => {
      const emptySlot = slots.find((s) => !assigned.has(s.id))
      if (emptySlot) {
        assigned.add(emptySlot.id)
        return emptySlot.id
      }

      const id = slots[replaceIndex % slots.length].id
      replaceIndex++
      return id
    }

    images.forEach((img) => {
      if (img.slotId) return
      assignImageToSlot(img.id, getNextSlotId())
    })
  }

  return (
    <div className="w-60 bg-surface border-l border-white/5 flex flex-col shrink-0">
      {/* 标题 */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-white/5">
        <span className="text-xs font-semibold text-text-primary">图片素材</span>
        {images.length > 0 && (
          <button onClick={clearAll} className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer" title="清空全部">
            <Trash2 className="w-3.5 h-3.5 text-text-secondary" />
          </button>
        )}
      </div>

      {/* 上传区域 */}
      <div className="p-3">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${isDragActive ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
          <input {...getInputProps()} />
          <Upload className="w-5 h-5 text-text-secondary mx-auto mb-1" />
          <p className="text-[11px] text-text-secondary">{isDragActive ? '释放以上传' : '点击或拖拽上传'}</p>
          <p className="text-[10px] text-text-secondary mt-0.5 opacity-60">JPG / PNG / WebP</p>
        </div>
      </div>

      {/* 自动填入 */}
      {images.length > 0 && (
        <div className="px-3 flex gap-2 mb-2">
          <button onClick={autoAssign} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary/15 text-primary text-[11px] hover:bg-primary/25 transition-colors cursor-pointer">
            <ImagePlus className="w-3 h-3" />
            自动填入
          </button>
        </div>
      )}

      {/* 画布边距 */}
      <div className="px-3 mb-2">
        <div className="flex items-center gap-1 mb-2">
          <MoveHorizontal className="w-3 h-3 text-text-secondary" />
          <span className="text-[11px] text-text-secondary">画布边距</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-secondary">左右</span>
              <span className="text-[10px] text-text-primary">{canvasPadding.left}px</span>
            </div>
            <input type="range" min={0} max={50} value={canvasPadding.left} onChange={(e) => setCanvasPadding({ left: Number(e.target.value), right: Number(e.target.value) })} className="w-full h-1 bg-surface-secondary rounded-full appearance-none cursor-pointer accent-primary" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-secondary">上下</span>
              <span className="text-[10px] text-text-primary">{canvasPadding.top}px</span>
            </div>
            <input type="range" min={0} max={50} value={canvasPadding.top} onChange={(e) => setCanvasPadding({ top: Number(e.target.value), bottom: Number(e.target.value) })} className="w-full h-1 bg-surface-secondary rounded-full appearance-none cursor-pointer accent-primary" />
          </div>
        </div>
      </div>

      {/* 槽位间距 */}
      <div className="px-3 mb-2">
        <div className="flex items-center gap-1 mb-2">
          <MoveVertical className="w-3 h-3 text-text-secondary" />
          <span className="text-[11px] text-text-secondary">槽位间距</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-secondary">左右</span>
              <span className="text-[10px] text-text-primary">{slotMargin.horizontal}px</span>
            </div>
            <input type="range" min={0} max={30} value={slotMargin.horizontal} onChange={(e) => setSlotMargin({ horizontal: Number(e.target.value) })} className="w-full h-1 bg-surface-secondary rounded-full appearance-none cursor-pointer accent-primary" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-secondary">上下</span>
              <span className="text-[10px] text-text-primary">{slotMargin.vertical}px</span>
            </div>
            <input type="range" min={0} max={30} value={slotMargin.vertical} onChange={(e) => setSlotMargin({ vertical: Number(e.target.value) })} className="w-full h-1 bg-surface-secondary rounded-full appearance-none cursor-pointer accent-primary" />
          </div>
        </div>
      </div>

      {/* 图片列表 */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {images.length === 0 ? (
          <div className="text-center text-xs text-text-secondary py-8 opacity-60">还没有上传图片</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {images.map((img) => (
              <ImageItem key={img.id} image={img} onDelete={removeImage} onClick={selectImage} isSelected={img.id === selectedImageId} />
            ))}
          </div>
        )}
      </div>

      {/* 图片属性 */}
      {selectedImage && (
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-text-primary">图片属性</span>
            <button onClick={() => useImageStore.getState().removeImageFromSlot(selectedImage.id)} className="p-0.5 rounded hover:bg-white/10 cursor-pointer" title="从槽位移除">
              <X className="w-3 h-3 text-text-secondary" />
            </button>
          </div>
          <div className="text-[10px] text-text-secondary mb-2 truncate">{selectedImage.name}</div>
          <div className="text-[10px] text-text-secondary mb-2">{selectedImage.width} × {selectedImage.height}px</div>
          <div className="flex gap-1">
            {FILL_MODES.map((mode) => (
              <button key={mode.value} onClick={() => setFillMode(selectedImage.id, mode.value)} className={`px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${selectedImage.fillMode === mode.value ? 'bg-primary/20 text-primary' : 'bg-surface-secondary text-text-secondary hover:bg-white/10'}`}>
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

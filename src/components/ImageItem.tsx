/** 单张图片缩略图组件 */

import { Trash2 } from 'lucide-react'
import type { ImageItem as ImageItemType } from '../types'

interface Props {
  image: ImageItemType
  onDelete: (id: string) => void
  onClick: (id: string) => void
  isSelected?: boolean
}

export default function ImageItem({ image, onDelete, onClick, isSelected }: Props) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-pic-layout-image', image.id)
        e.dataTransfer.effectAllowed = 'copy'
      }}
      onClick={() => onClick(image.id)}
      className={`relative group rounded-lg overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-white/20'
      }`}
    >
      <img
        src={image.url}
        alt={image.name}
        className="w-full aspect-square object-cover"
      />
      {/* 悬浮操作 */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
        <div className="w-full flex items-center justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-white truncate max-w-[70%]">{image.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(image.id) }}
            className="p-1 rounded bg-danger/80 hover:bg-danger text-white transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

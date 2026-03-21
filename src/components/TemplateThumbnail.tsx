/** 模板缩略图卡片 */

import type { Template } from '../types'
import { generateTemplatePreview } from '../utils/templatePreview'
import { X } from 'lucide-react'

interface Props {
  template: Template
  isSelected: boolean
  onClick: () => void
  onDelete?: () => void
}

export default function TemplateThumbnail({ template, isSelected, onClick, onDelete }: Props) {
  const preview = generateTemplatePreview(template.slots)

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all cursor-pointer ${
          isSelected
            ? 'bg-primary/15 ring-2 ring-primary'
            : 'bg-surface-secondary hover:bg-white/10'
        }`}
      >
        <img
          src={preview}
          alt={template.name}
          className="w-full aspect-[4/3] rounded-md object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <span className={`text-[11px] ${isSelected ? 'text-primary font-medium' : 'text-text-secondary'}`}>
          {template.name}
        </span>
      </button>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80 cursor-pointer"
          title="删除模板"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

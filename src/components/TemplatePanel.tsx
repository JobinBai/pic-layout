/** 左侧模板选择面板 */

import { useState } from 'react'
import { Plus, Grid3x3 } from 'lucide-react'
import { useTemplateStore } from '../stores'
import TemplateThumbnail from './TemplateThumbnail'
import type { TemplateCategory } from '../types'

const CATEGORIES: { key: TemplateCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'grid', label: '网格' },
  { key: 'collage', label: '拼接' },
  { key: 'custom', label: '自定义' },
]

export default function TemplatePanel() {
  const templates = useTemplateStore((s) => s.templates)
  const currentTemplate = useTemplateStore((s) => s.currentTemplate)
  const setTemplate = useTemplateStore((s) => s.setTemplate)
  const addCustomGrid = useTemplateStore((s) => s.addCustomGrid)

  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all')
  const [customRows, setCustomRows] = useState(2)
  const [customCols, setCustomCols] = useState(2)
  const [showCustomInput, setShowCustomInput] = useState(false)

  const filtered = activeCategory === 'all'
    ? templates
    : templates.filter((t) => t.category === activeCategory)

  const handleAddCustom = () => {
    if (customRows >= 1 && customRows <= 10 && customCols >= 1 && customCols <= 10) {
      addCustomGrid(customRows, customCols)
      setShowCustomInput(false)
    }
  }

  return (
    <div className="w-60 bg-surface border-r border-white/5 flex flex-col shrink-0">
      {/* 标题 */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-white/5">
        <span className="text-xs font-semibold text-text-primary">排版模板</span>
        <button onClick={() => setShowCustomInput(!showCustomInput)} className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer" title="自定义网格">
          <Plus className="w-3.5 h-3.5 text-text-secondary" />
        </button>
      </div>

      {/* 自定义网格输入 */}
      {showCustomInput && (
        <div className="px-4 py-3 border-b border-white/5 bg-surface-secondary">
          <div className="flex items-center gap-1.5 mb-2">
            <Grid3x3 className="w-3.5 h-3.5 text-text-secondary" />
            <span className="text-xs text-text-secondary">自定义网格</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-text-secondary">列</span>
              <input type="number" min={1} max={10} value={customCols} onChange={(e) => setCustomCols(Number(e.target.value))} className="w-12 h-7 text-center text-xs bg-surface-deep text-text-primary rounded border border-white/10 focus:outline-none focus:border-primary" />
            </div>
            <span className="text-text-secondary text-xs">×</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-text-secondary">行</span>
              <input type="number" min={1} max={10} value={customRows} onChange={(e) => setCustomRows(Number(e.target.value))} className="w-12 h-7 text-center text-xs bg-surface-deep text-text-primary rounded border border-white/10 focus:outline-none focus:border-primary" />
            </div>
            <button onClick={handleAddCustom} className="px-2 h-7 text-xs bg-primary hover:bg-primary-hover text-white rounded transition-colors cursor-pointer">生成</button>
          </div>
        </div>
      )}

      {/* 分类标签 */}
      <div className="flex gap-1 px-4 py-2 border-b border-white/5">
        {CATEGORIES.map((cat) => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${activeCategory === cat.key ? 'bg-primary/20 text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* 模板列表 */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {filtered.map((t) => (
            <TemplateThumbnail
              key={t.id}
              template={t}
              isSelected={t.id === currentTemplate.id}
              onClick={() => setTemplate(t)}
              onDelete={t.category === 'custom' ? () => useTemplateStore.getState().deleteTemplate(t.id) : undefined}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-xs text-text-secondary py-8">暂无该分类模板</div>
        )}
      </div>
    </div>
  )
}

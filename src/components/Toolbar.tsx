/** 顶部工具栏 */

import { useState } from 'react'
import {
  ZoomIn, ZoomOut, Maximize2, Download, Undo2, Redo2, Settings2, LayoutGrid
} from 'lucide-react'
import { useCanvasStore, useTemplateStore, useHistoryStore } from '../stores'
import { PRESET_SIZES } from '../utils/constants'
import CanvasSizeDialog from './CanvasSizeDialog'
import ExportDialog from './ExportDialog'

export default function Toolbar() {
  const zoom = useCanvasStore((s) => s.zoom)
  const zoomIn = useCanvasStore((s) => s.zoomIn)
  const zoomOut = useCanvasStore((s) => s.zoomOut)
  const fitZoom = useCanvasStore((s) => s.fitZoom)
  const width = useCanvasStore((s) => s.width)
  const height = useCanvasStore((s) => s.height)
  const unit = useCanvasStore((s) => s.unit)
  const canvasSize = { width, height, unit }

  const currentTemplate = useTemplateStore((s) => s.currentTemplate)

  const canUndo = useHistoryStore((s) => s.canUndo)
  const canRedo = useHistoryStore((s) => s.canRedo)
  const undo = useHistoryStore((s) => s.undo)
  const redo = useHistoryStore((s) => s.redo)

  const [showSizeDialog, setShowSizeDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const preset = PRESET_SIZES.find(
    (p) => p.width === canvasSize.width && p.height === canvasSize.height && p.unit === canvasSize.unit
  )

  return (
    <>
      <div className="h-14 bg-surface flex items-center px-4 gap-3 border-b border-white/5 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-4">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <span className="font-semibold text-text-white text-sm tracking-wide">PicLayout</span>
        </div>

        {/* 画布尺寸 */}
        <button
          onClick={() => setShowSizeDialog(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-white/10 text-xs text-text-primary transition-colors cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{preset ? preset.name : '自定义'}</span>
          <span className="text-text-secondary">{canvasSize.width}×{canvasSize.height}{canvasSize.unit}</span>
        </button>

        {/* 模板名称 */}
        <div className="px-3 py-1.5 rounded-lg bg-surface-secondary text-xs text-text-secondary">
          {currentTemplate.name}
        </div>

        <div className="flex-1" />

        {/* 缩放控件 */}
        <div className="flex items-center gap-1">
          <button onClick={zoomOut} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <ZoomOut className="w-4 h-4 text-text-secondary" />
          </button>
          <span className="text-xs text-text-secondary w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={zoomIn} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <ZoomIn className="w-4 h-4 text-text-secondary" />
          </button>
          <button onClick={fitZoom} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" title="适应窗口">
            <Maximize2 className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* 撤销/重做 */}
        <button onClick={() => undo(() => {})} disabled={!canUndo()} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
          <Undo2 className="w-4 h-4 text-text-secondary" />
        </button>
        <button onClick={() => redo(() => {})} disabled={!canRedo()} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
          <Redo2 className="w-4 h-4 text-text-secondary" />
        </button>

        <div className="w-px h-6 bg-white/10" />

        {/* 导出 */}
        <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors cursor-pointer">
          <Download className="w-3.5 h-3.5" />
          导出
        </button>
      </div>

      {showSizeDialog && <CanvasSizeDialog onClose={() => setShowSizeDialog(false)} />}
      {showExportDialog && <ExportDialog onClose={() => setShowExportDialog(false)} />}
    </>
  )
}

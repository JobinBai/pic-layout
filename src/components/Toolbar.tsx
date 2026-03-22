/** 顶部工具栏 */

import { useState, useEffect } from 'react'
import {
  ZoomIn, ZoomOut, Maximize2, Download, Settings2, LayoutGrid, Printer, RotateCcw, Minimize2
} from 'lucide-react'
import { useCanvasStore, useTemplateStore, useImageStore } from '../stores'
import { PRESET_SIZES } from '../utils/constants'
import CanvasSizeDialog from './CanvasSizeDialog'
import ExportDialog from './ExportDialog'
import { useExport } from '../hooks'

export default function Toolbar() {
  const zoom = useCanvasStore((s) => s.zoom)
  const zoomIn = useCanvasStore((s) => s.zoomIn)
  const zoomOut = useCanvasStore((s) => s.zoomOut)
  const width = useCanvasStore((s) => s.width)
  const height = useCanvasStore((s) => s.height)
  const unit = useCanvasStore((s) => s.unit)
  const canvasSize = { width, height, unit }
  const resetCanvasToDefaults = useCanvasStore((s) => s.resetToDefaults)

  const currentTemplate = useTemplateStore((s) => s.currentTemplate)
  const resetTemplateToDefaults = useTemplateStore((s) => s.resetToDefaults)
  const clearAllImages = useImageStore((s) => s.clearAll)

  const [showSizeDialog, setShowSizeDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const preset = PRESET_SIZES.find(
    (p) => p.width === canvasSize.width && p.height === canvasSize.height && p.unit === canvasSize.unit
  )

  const handleReset = () => {
    // 重置到系统默认值：A4 纸张 + 单张模板
    resetCanvasToDefaults()
    resetTemplateToDefaults()
    clearAllImages()
  }

  // 全屏切换
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // 打印功能
  const { printCanvas } = useExport(() => useCanvasStore.getState().canvas)

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
          <button onClick={handleFullscreen} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" title="全屏">
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-text-secondary" /> : <Maximize2 className="w-4 h-4 text-text-secondary" />}
          </button>
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* 重置 */}
        <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-white/10 text-xs text-text-secondary transition-colors cursor-pointer" title="重置">
          <RotateCcw className="w-3.5 h-3.5" />
          重置
        </button>

        {/* 打印 */}
        <button onClick={printCanvas} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-white/10 text-xs text-text-secondary transition-colors cursor-pointer" title="打印">
          <Printer className="w-3.5 h-3.5" />
          打印
        </button>

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

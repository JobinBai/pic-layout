/** 导出设置弹窗 */

import { useCallback, useState } from 'react'
import { X, Download } from 'lucide-react'
import { useCanvasStore } from '../stores'
import { useExport } from '../hooks'
import { DPI_PRESETS, EXPORT_FORMATS, DEFAULT_EXPORT_CONFIG } from '../utils/constants'
import type { ExportConfig } from '../types'

interface Props {
  onClose: () => void
}

export default function ExportDialog({ onClose }: Props) {
  const dpi = useCanvasStore((s) => s.dpi)
  const getCanvas = useCallback(() => useCanvasStore.getState().canvas, [])
  const { exportAs } = useExport(getCanvas)

  const [config, setConfig] = useState<ExportConfig>({ ...DEFAULT_EXPORT_CONFIG, dpi })
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setExporting(true)
    setError(null)
    const result = await exportAs(config)
    setExporting(false)
    if (result.success) onClose()
    else setError(result.error || '导出失败')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-secondary rounded-xl border border-white/10 shadow-2xl w-[400px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-text-primary">导出设置</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* 格式 */}
          <div>
            <span className="text-xs text-text-secondary font-medium mb-2 block">导出格式</span>
            <div className="flex gap-2">
              {EXPORT_FORMATS.map((fmt) => (
                <button key={fmt.value} onClick={() => setConfig({ ...config, format: fmt.value })} className={`flex-1 py-2 rounded-lg text-xs transition-colors cursor-pointer ${config.format === fmt.value ? 'bg-primary/20 text-primary ring-1 ring-primary font-medium' : 'bg-surface-deep text-text-primary hover:bg-white/10'}`}>
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* DPI */}
          <div>
            <span className="text-xs text-text-secondary font-medium mb-2 block">分辨率 (DPI)</span>
            <div className="flex gap-2 mb-2">
              {DPI_PRESETS.map((d) => (
                <button key={d} onClick={() => setConfig({ ...config, dpi: d })} className={`flex-1 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${config.dpi === d ? 'bg-primary/20 text-primary ring-1 ring-primary' : 'bg-surface-deep text-text-secondary hover:bg-white/10'}`}>
                  {d}
                </button>
              ))}
            </div>
            <input type="number" value={config.dpi} onChange={(e) => setConfig({ ...config, dpi: Math.max(72, Number(e.target.value)) })} className="w-full h-8 px-3 text-xs bg-surface-deep text-text-primary rounded-lg border border-white/10 focus:outline-none focus:border-primary" placeholder="自定义 DPI" />
          </div>

          {/* JPG 质量 */}
          {config.format === 'jpg' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-secondary font-medium">JPG 质量</span>
                <span className="text-xs text-text-primary">{Math.round(config.jpgQuality * 100)}%</span>
              </div>
              <input type="range" min={0.1} max={1} step={0.01} value={config.jpgQuality} onChange={(e) => setConfig({ ...config, jpgQuality: Number(e.target.value) })} className="w-full h-1 bg-surface-deep rounded-full appearance-none cursor-pointer accent-primary" />
              <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                <span>文件更小</span>
                <span>质量更高</span>
              </div>
            </div>
          )}

          {/* 透明背景 */}
          {config.format === 'png' && (
            <div className="flex items-center gap-2">
              <input type="checkbox" id="transparent" checked={config.transparent} onChange={(e) => setConfig({ ...config, transparent: e.target.checked })} className="rounded border-white/20 accent-primary cursor-pointer" />
              <label htmlFor="transparent" className="text-xs text-text-primary cursor-pointer">透明背景</label>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs text-text-secondary hover:bg-white/10 transition-colors cursor-pointer">取消</button>
          <button onClick={handleExport} disabled={exporting} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs bg-primary hover:bg-primary-hover text-white font-medium transition-colors cursor-pointer disabled:opacity-50">
            <Download className="w-3.5 h-3.5" />
            {exporting ? '导出中...' : '导出'}
          </button>
        </div>
      </div>
    </div>
  )
}

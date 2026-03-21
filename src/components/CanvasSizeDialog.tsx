/** 画布尺寸设置弹窗 */

import { useState } from 'react'
import { X, ArrowRightLeft } from 'lucide-react'
import { useCanvasStore } from '../stores'
import { PRESET_SIZES } from '../utils/constants'
import type { SizeUnit } from '../types'

const UNITS: SizeUnit[] = ['mm', 'cm', 'inch', 'px']

interface Props {
  onClose: () => void
}

export default function CanvasSizeDialog({ onClose }: Props) {
  const canvasStore = useCanvasStore()
  const [width, setWidth] = useState(canvasStore.width)
  const [height, setHeight] = useState(canvasStore.height)
  const [unit, setUnit] = useState(canvasStore.unit)
  const [bgColor, setBgColor] = useState(canvasStore.backgroundColor)

  const categories = [...new Set(PRESET_SIZES.map((p) => p.category || '其他'))]

  const handleApply = () => {
    canvasStore.setSize({ width, height, unit })
    canvasStore.setBackgroundColor(bgColor)
    onClose()
  }

  const handlePreset = (preset: typeof PRESET_SIZES[number]) => {
    setWidth(preset.width)
    setHeight(preset.height)
    setUnit(preset.unit)
  }

  const handleSwap = () => {
    setWidth(height)
    setHeight(width)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-secondary rounded-xl border border-white/10 shadow-2xl w-[480px] max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-text-primary">画布尺寸</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {/* 预设尺寸 */}
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <span className="text-xs text-text-secondary font-medium mb-2 block">{cat}</span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_SIZES.filter((p) => (p.category || '其他') === cat).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePreset(preset)}
                    className={`px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                      width === preset.width && height === preset.height && unit === preset.unit
                        ? 'bg-primary/20 text-primary ring-1 ring-primary'
                        : 'bg-surface-deep text-text-primary hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-[10px] text-text-secondary mt-0.5">
                      {preset.width} × {preset.height} {preset.unit}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* 自定义尺寸 */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-text-secondary font-medium mb-3 block">自定义尺寸</span>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-text-secondary mb-1 block">宽度</label>
                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full h-9 px-3 text-xs bg-surface-deep text-text-primary rounded-lg border border-white/10 focus:outline-none focus:border-primary" />
              </div>
              <button onClick={handleSwap} className="mt-5 p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" title="交换宽高">
                <ArrowRightLeft className="w-3.5 h-3.5 text-text-secondary" />
              </button>
              <div className="flex-1">
                <label className="text-[10px] text-text-secondary mb-1 block">高度</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full h-9 px-3 text-xs bg-surface-deep text-text-primary rounded-lg border border-white/10 focus:outline-none focus:border-primary" />
              </div>
              <div className="w-20">
                <label className="text-[10px] text-text-secondary mb-1 block">单位</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value as SizeUnit)} className="w-full h-9 px-2 text-xs bg-surface-deep text-text-primary rounded-lg border border-white/10 focus:outline-none focus:border-primary cursor-pointer">
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 背景色 */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-text-secondary font-medium mb-3 block">背景颜色</span>
            <div className="flex items-center gap-3">
              {['#FFFFFF', 'transparent'].map((c) => (
                <button
                  key={c}
                  onClick={() => setBgColor(c)}
                  className={`w-8 h-8 rounded-lg border-2 transition-colors cursor-pointer ${
                    bgColor === c ? 'border-primary' : 'border-white/10'
                  } ${c === 'transparent' ? 'bg-[conic-gradient(#ccc_25%,white_25%_50%,#ccc_50%_75%,white_75%)] bg-[length:8px_8px]' : ''}`}
                  style={c !== 'transparent' ? { backgroundColor: c } : {}}
                />
              ))}
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor === 'transparent' ? '#ffffff' : bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-[11px] text-text-secondary">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs text-text-secondary hover:bg-white/10 transition-colors cursor-pointer">取消</button>
          <button onClick={handleApply} className="px-4 py-2 rounded-lg text-xs bg-primary hover:bg-primary-hover text-white font-medium transition-colors cursor-pointer">应用</button>
        </div>
      </div>
    </div>
  )
}

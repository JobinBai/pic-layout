/** 导出逻辑 hook */

import { useCallback } from 'react'
import { jsPDF } from 'jspdf'
import { useCanvasStore, useHistoryStore } from '../stores'
import type { ExportConfig } from '../types'

interface ExportResult {
  success: boolean
  error?: string
}

export function useExport(getCanvas: () => import('fabric').Canvas | null) {
  const getPixelSize = useCanvasStore((s) => s.getPixelSize)
  const pushState = useHistoryStore((s) => s.pushState)
  const setExportMode = useCanvasStore((s) => s.setExportMode)

  const exportAs = useCallback(
    async (config: ExportConfig): Promise<ExportResult> => {
      const canvas = getCanvas()
      if (!canvas) return { success: false, error: '画布未初始化' }

      const pixelSize = getPixelSize()

      // 保存当前状态
      pushState(canvas.toJSON())

      // 临时调整 canvas 到导出尺寸
      const origW = canvas.getWidth()
      const origH = canvas.getHeight()
      const origZoom = canvas.getZoom()
      const origVpt = canvas.viewportTransform?.slice() || [1, 0, 0, 1, 0, 0]
      const origBg = canvas.backgroundColor

      try {
        if (config.format === 'png' && config.transparent) {
          canvas.backgroundColor = 'rgba(0,0,0,0)'
        }

        // 缩放到导出分辨率
        const scaleX = pixelSize.width / origW
        const scaleY = pixelSize.height / origH
        const scale = Math.min(scaleX, scaleY)

        canvas.setDimensions({ width: pixelSize.width, height: pixelSize.height })
        canvas.setZoom(1)
        canvas.viewportTransform = [scale, 0, 0, scale, 0, 0]
        canvas.renderAll()

        if (config.format === 'pdf') {
          return exportPDF(canvas, pixelSize)
        } else {
          return exportImage(canvas, config)
        }
      } finally {
        // 恢复原始尺寸
        canvas.setDimensions({ width: origW, height: origH })
        canvas.setZoom(origZoom)
        canvas.viewportTransform = origVpt as [number, number, number, number, number, number]
        canvas.backgroundColor = origBg
        canvas.renderAll()
      }
    },
    [getCanvas, getPixelSize, pushState]
  )

  // 打印功能 - 显示空白槽位
  const printCanvas = useCallback(async (): Promise<ExportResult> => {
    const canvas = getCanvas()
    if (!canvas) return { success: false, error: '画布未初始化' }

    const pixelSize = getPixelSize()

    // 保存当前状态
    pushState(canvas.toJSON())

    // 设置空白导出模式
    setExportMode('blank')
    
    // 触发重新渲染
    canvas.renderAll()

    // 临时调整 canvas 到导出尺寸
    const origW = canvas.getWidth()
    const origH = canvas.getHeight()
    const origZoom = canvas.getZoom()
    const origVpt = canvas.viewportTransform?.slice() || [1, 0, 0, 1, 0, 0]

    try {
      // 缩放到导出分辨率
      const scaleX = pixelSize.width / origW
      const scaleY = pixelSize.height / origH
      const scale = Math.min(scaleX, scaleY)

      canvas.setDimensions({ width: pixelSize.width, height: pixelSize.height })
      canvas.setZoom(1)
      canvas.viewportTransform = [scale, 0, 0, scale, 0, 0]
      canvas.renderAll()

      // 打开打印对话框
      const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 })
      printDataUrl(dataUrl, pixelSize)
      
      return { success: true }
    } finally {
      // 恢复原始尺寸和导出模式
      canvas.setDimensions({ width: origW, height: origH })
      canvas.setZoom(origZoom)
      canvas.viewportTransform = origVpt as [number, number, number, number, number, number]
      setExportMode('normal')
      canvas.renderAll()
    }
  }, [getCanvas, getPixelSize, pushState, setExportMode])

  return { exportAs, printCanvas }
}

async function exportImage(
  canvas: import('fabric').Canvas,
  config: ExportConfig
): Promise<ExportResult> {
  const format = config.format === 'jpg' ? 'jpeg' : 'png'
  const quality = config.format === 'jpg' ? config.jpgQuality : 1
  const dataUrl = canvas.toDataURL({ format, quality, multiplier: 1 })

  downloadDataUrl(dataUrl, `pic-layout.${config.format}`)
  return { success: true }
}

async function exportPDF(
  canvas: import('fabric').Canvas,
  pixelSize: { width: number; height: number }
): Promise<ExportResult> {
  const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 })
  const pdf = new jsPDF({
    orientation: pixelSize.width > pixelSize.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [pixelSize.width, pixelSize.height],
  })

  pdf.addImage(dataUrl, 'PNG', 0, 0, pixelSize.width, pixelSize.height)
  pdf.save('pic-layout.pdf')
  return { success: true }
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function printDataUrl(dataUrl: string, size: { width: number; height: number }) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('请允许弹出窗口以进行打印')
    return
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>打印</title>
      <style>
        @page {
          size: ${size.width}px ${size.height}px;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
        }
        img {
          width: ${size.width}px;
          height: ${size.height}px;
        }
        @media print {
          body { margin: 0; }
          img { width: 100%; height: auto; }
        }
      </style>
    </head>
    <body>
      <img src="${dataUrl}" />
      <script>
        window.onload = function() {
          window.print();
          window.close();
        }
      </script>
    </body>
    </html>
  `)
  printWindow.document.close()
}

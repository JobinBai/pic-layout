# PicLayout 项目记忆

## 项目定位
通用图片排版 Web 工具 - 模板驱动 + 微调模式

## 技术栈
React 18 + TS + Vite 5 + Fabric.js 6 + Zustand + Tailwind CSS 3.4.17 + jsPDF + react-dropzone + lucide-react

## 关键设计决策
- Fabric.js 作为 Canvas 引擎（原生对象操作 + 高 DPI 导出）
- Zustand 而非 Redux（中等复杂度，更轻量）
- 深色主题 + Inter 字体 + 蓝色主色调
- 模板数据驱动设计（槽位配置数组）

## 用户偏好
- 模板支持自定义行列数（N×M 网格）
- 画布预设含 7 寸照片
- 导出 PNG/JPG/PDF

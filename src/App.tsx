import Toolbar from './components/Toolbar'
import TemplatePanel from './components/TemplatePanel'
import CanvasPanel from './components/CanvasPanel'
import ImagePanel from './components/ImagePanel'

function App() {
  return (
    <div className="h-screen flex flex-col bg-surface text-text-primary">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <TemplatePanel />
        <CanvasPanel />
        <ImagePanel />
      </div>
    </div>
  )
}

export default App

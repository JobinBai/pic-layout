import './index.css'
import App from './App.tsx'
import * as ReactDOM from 'react-dom/client'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

const createRootFn = (ReactDOM as any).createRoot || (ReactDOM as any).default?.createRoot
if (!createRootFn) throw new Error('createRoot not found in react-dom/client')

createRootFn(root).render(<App />)

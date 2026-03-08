import { Scene } from './components/Scene'
import { Sidebar } from './components/Sidebar'

export default function App() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: '#030712' }}>
      <div style={{ flex: 1, position: 'relative', minWidth: 0, height: '100%' }}>
        <Scene />
      </div>
      <Sidebar />
    </div>
  )
}

import { Canvas } from '@react-three/fiber'
import { OrbitControls, TransformControls } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Floor } from './Floor'
import { Subject } from './Subject'
import { LightObject } from './LightObject'
import { useSceneStore } from '../store/scene'

type TransformMode = 'translate' | 'rotate'

// Overlay s tlačítky pro ovládání — mimo Canvas
interface ControlsOverlayProps {
  hasSelection: boolean
  mode: TransformMode
  onMode: (m: TransformMode) => void
  onDeselect: () => void
}

function ControlsOverlay({ hasSelection, mode, onMode, onDeselect }: ControlsOverlayProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 10,
      }}
    >
      {/* Orbit hint — always visible */}
      <div style={{
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid #374151',
        borderRadius: 6,
        padding: '6px 10px',
        color: '#6b7280',
        fontSize: 11,
        lineHeight: 1.6,
      }}>
        <div><b style={{ color: '#9ca3af' }}>Rotace scény:</b> levé tlačítko + tažení</div>
        <div><b style={{ color: '#9ca3af' }}>Zoom:</b> kolečko myši</div>
        <div><b style={{ color: '#9ca3af' }}>Pan:</b> pravé tlačítko + tažení</div>
      </div>

      {/* Transform controls — jen když je vybráno světlo */}
      {hasSelection && (
        <div style={{
          background: 'rgba(0,0,0,0.75)',
          border: '1px solid #374151',
          borderRadius: 6,
          padding: '6px 10px',
          pointerEvents: 'auto',
        }}>
          <div style={{ color: '#9ca3af', fontSize: 11, marginBottom: 6 }}>
            Vybrané světlo:
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => onMode('translate')}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'translate' ? '#2563eb' : '#374151',
                color: mode === 'translate' ? '#fff' : '#9ca3af',
                fontWeight: mode === 'translate' ? 600 : 400,
              }}
            >
              ↔ Posun
            </button>
            <button
              onClick={() => onMode('rotate')}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'rotate' ? '#2563eb' : '#374151',
                color: mode === 'rotate' ? '#fff' : '#9ca3af',
                fontWeight: mode === 'rotate' ? 600 : 400,
              }}
            >
              ↻ Rotace
            </button>
            <button
              onClick={onDeselect}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                background: '#374151',
                color: '#9ca3af',
                marginLeft: 4,
              }}
            >
              ✕ Zrušit
            </button>
          </div>
          <div style={{ color: '#4b5563', fontSize: 10, marginTop: 5 }}>
            Táhni osy gizma v 3D scéně
          </div>
        </div>
      )}
    </div>
  )
}

// Vnitřní komponenta — přístup k useThree pro disable orbitControls
function SceneContent({
  mode,
  orbitRef,
}: {
  mode: TransformMode
  orbitRef: React.RefObject<any>
}) {
  const { lights, selectedId, selectLight, updateLight } = useSceneStore()
  const selectedLight = lights.find((l) => l.id === selectedId)

  // Klávesa Escape pro deselect
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectLight(null)
      if (e.key === 'g' || e.key === 'G') { /* handled outside */ }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectLight])

  return (
    <>
      <ambientLight intensity={0.05} />
      <Floor />
      <Subject />

      {lights.map((light) => (
        <LightObject
          key={light.id}
          light={light}
          isSelected={light.id === selectedId}
          onSelect={() => selectLight(light.id)}
        />
      ))}

      {selectedLight && (
        <TransformControls
          mode={mode}
          position={selectedLight.position}
          rotation={selectedLight.rotation}
          onMouseDown={() => {
            if (orbitRef.current) orbitRef.current.enabled = false
          }}
          onMouseUp={() => {
            if (orbitRef.current) orbitRef.current.enabled = true
          }}
          onObjectChange={(e: any) => {
            const obj = e?.target?.object
            if (!obj) return
            const pos = obj.position
            const rot = obj.rotation
            updateLight(selectedLight.id, {
              position: [pos.x, pos.y, pos.z],
              rotation: [rot.x, rot.y, rot.z],
            })
          }}
        >
          {/* Neviditelný placeholder — TransformControls pohybuje tímto objektem */}
          <mesh>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        </TransformControls>
      )}

      <OrbitControls
        ref={orbitRef}
        target={[0, 1, 0]}
        minDistance={1.5}
        maxDistance={15}
        makeDefault
      />
    </>
  )
}

export function Scene() {
  const { selectedId, selectLight } = useSceneStore()
  const orbitRef = useRef<any>(null)
  const [mode, setMode] = useState<TransformMode>('translate')

  // Klávesové zkratky pro mode
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'g' || e.key === 'G') setMode('translate')
      if (e.key === 'r' || e.key === 'R') setMode('rotate')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ position: [4, 3, 5], fov: 45 }}
        style={{ display: 'block', width: '100%', height: '100%' }}
        onPointerMissed={() => selectLight(null)}
      >
        <SceneContent mode={mode} orbitRef={orbitRef} />
      </Canvas>

      <ControlsOverlay
        hasSelection={!!selectedId}
        mode={mode}
        onMode={setMode}
        onDeselect={() => selectLight(null)}
      />
    </div>
  )
}

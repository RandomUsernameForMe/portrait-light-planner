import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, TransformControls } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Floor } from './Floor'
import { Subject } from './Subject'
import { LightObject } from './LightObject'
import { useSceneStore } from '../store/scene'
import type { ViewMode } from '../store/scene'

type TransformMode = 'translate' | 'rotate'

const PERSPECTIVE_POS: [number, number, number] = [4, 3, 5]
const TOPDOWN_POS: [number, number, number] = [0, 10, 0.001] // 0.001 aby lookAt fungoval

// ── Overlay ──────────────────────────────────────────────────────────────────

interface ControlsOverlayProps {
  hasSelection: boolean
  transformMode: TransformMode
  viewMode: ViewMode
  onTransformMode: (m: TransformMode) => void
  onToggleView: () => void
  onDeselect: () => void
}

function ControlsOverlay({
  hasSelection,
  transformMode,
  viewMode,
  onTransformMode,
  onToggleView,
  onDeselect,
}: ControlsOverlayProps) {
  const isTopDown = viewMode === 'topdown'

  return (
    <div style={{
      position: 'absolute',
      bottom: 16,
      left: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 10,
    }}>
      {/* Přepínač pohledu */}
      <div style={{
        background: 'rgba(0,0,0,0.75)',
        border: '1px solid #374151',
        borderRadius: 6,
        padding: '6px 10px',
        pointerEvents: 'auto',
        display: 'flex',
        gap: 4,
        alignItems: 'center',
      }}>
        <span style={{ color: '#6b7280', fontSize: 11, marginRight: 4 }}>Pohled:</span>
        <button
          onClick={() => !isTopDown && onToggleView()}
          style={{
            padding: '4px 10px',
            fontSize: 11,
            borderRadius: 4,
            border: 'none',
            cursor: isTopDown ? 'default' : 'pointer',
            background: !isTopDown ? '#2563eb' : '#374151',
            color: !isTopDown ? '#fff' : '#9ca3af',
            fontWeight: !isTopDown ? 600 : 400,
          }}
        >
          3D perspektiva
        </button>
        <button
          onClick={() => isTopDown && onToggleView()}
          style={{
            padding: '4px 10px',
            fontSize: 11,
            borderRadius: 4,
            border: 'none',
            cursor: !isTopDown ? 'pointer' : 'default',
            background: isTopDown ? '#2563eb' : '#374151',
            color: isTopDown ? '#fff' : '#9ca3af',
            fontWeight: isTopDown ? 600 : 400,
          }}
        >
          ↑ Top-down
        </button>
      </div>

      {/* Orbit hint */}
      <div style={{
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid #374151',
        borderRadius: 6,
        padding: '6px 10px',
        color: '#6b7280',
        fontSize: 11,
        lineHeight: 1.6,
      }}>
        {isTopDown ? (
          <>
            <div><b style={{ color: '#9ca3af' }}>Pan:</b> levé tlačítko + tažení</div>
            <div><b style={{ color: '#9ca3af' }}>Zoom:</b> kolečko myši</div>
            <div><b style={{ color: '#6b7280', fontStyle: 'italic' }}>Rotace scény zakázána</b></div>
          </>
        ) : (
          <>
            <div><b style={{ color: '#9ca3af' }}>Rotace scény:</b> levé tlačítko + tažení</div>
            <div><b style={{ color: '#9ca3af' }}>Zoom:</b> kolečko myši</div>
            <div><b style={{ color: '#9ca3af' }}>Pan:</b> pravé tlačítko + tažení</div>
          </>
        )}
      </div>

      {/* Transform controls — jen při výběru světla */}
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
              onClick={() => onTransformMode('translate')}
              style={{
                padding: '4px 10px', fontSize: 11, borderRadius: 4, border: 'none', cursor: 'pointer',
                background: transformMode === 'translate' ? '#2563eb' : '#374151',
                color: transformMode === 'translate' ? '#fff' : '#9ca3af',
                fontWeight: transformMode === 'translate' ? 600 : 400,
              }}
            >
              ↔ Posun
            </button>
            <button
              onClick={() => onTransformMode('rotate')}
              style={{
                padding: '4px 10px', fontSize: 11, borderRadius: 4, border: 'none', cursor: 'pointer',
                background: transformMode === 'rotate' ? '#2563eb' : '#374151',
                color: transformMode === 'rotate' ? '#fff' : '#9ca3af',
                fontWeight: transformMode === 'rotate' ? 600 : 400,
              }}
            >
              ↻ Rotace
            </button>
            <button
              onClick={onDeselect}
              style={{
                padding: '4px 10px', fontSize: 11, borderRadius: 4, border: 'none', cursor: 'pointer',
                background: '#374151', color: '#9ca3af', marginLeft: 4,
              }}
            >
              ✕ Zrušit
            </button>
          </div>
          <div style={{ color: '#4b5563', fontSize: 10, marginTop: 5 }}>
            {isTopDown
              ? 'Pohyb světla v rovině XZ (výška zachována) · G posun · R rotace'
              : 'Táhni osy gizma v 3D scéně · G posun · R rotace'}
          </div>
        </div>
      )}
    </div>
  )
}

// ── SceneContent (uvnitř Canvas) ─────────────────────────────────────────────

function CameraController({ isTopDown }: { isTopDown: boolean }) {
  const { camera, invalidate } = useThree()

  useEffect(() => {
    if (isTopDown) {
      camera.position.set(...TOPDOWN_POS)
      camera.lookAt(0, 0, 0)
    } else {
      camera.position.set(...PERSPECTIVE_POS)
      camera.lookAt(0, 1, 0)
    }
    camera.updateProjectionMatrix()
    invalidate()
  }, [isTopDown, camera, invalidate])

  return null
}

function SceneContent({
  transformMode,
  isTopDown,
  orbitRef,
}: {
  transformMode: TransformMode
  isTopDown: boolean
  orbitRef: React.RefObject<any>
}) {
  const { lights, selectedId, selectLight, updateLight } = useSceneStore()
  const selectedLight = lights.find((l) => l.id === selectedId)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectLight(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectLight])

  return (
    <>
      <CameraController isTopDown={isTopDown} />

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
          mode={transformMode}
          position={selectedLight.position}
          rotation={selectedLight.rotation}
          showY={!isTopDown}
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
              position: [
                pos.x,
                isTopDown ? selectedLight.position[1] : pos.y,
                pos.z,
              ],
              rotation: [rot.x, rot.y, rot.z],
            })
          }}
        >
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
        maxDistance={20}
        enableRotate={!isTopDown}
        screenSpacePanning={isTopDown}
        makeDefault
      />
    </>
  )
}

// ── Scene (root) ──────────────────────────────────────────────────────────────

export function Scene() {
  const { selectedId, selectLight, viewMode, setViewMode } = useSceneStore()
  const orbitRef = useRef<any>(null)
  const [transformMode, setTransformMode] = useState<TransformMode>('translate')

  const toggleView = () => {
    setViewMode(viewMode === 'perspective' ? 'topdown' : 'perspective')
    // selectLight(null) je voláno uvnitř setViewMode ve store
  }

  // Klávesové zkratky
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'g' || e.key === 'G') setTransformMode('translate')
      if (e.key === 'r' || e.key === 'R') setTransformMode('rotate')
      if (e.key === 'Tab') { e.preventDefault(); toggleView() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isTopDown = viewMode === 'topdown'

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ position: PERSPECTIVE_POS, fov: 45 }}
        style={{ display: 'block', width: '100%', height: '100%' }}
        onPointerMissed={() => selectLight(null)}
      >
        <SceneContent
          transformMode={transformMode}
          isTopDown={isTopDown}
          orbitRef={orbitRef}
        />
      </Canvas>

      <ControlsOverlay
        hasSelection={!!selectedId}
        transformMode={transformMode}
        viewMode={viewMode}
        onTransformMode={setTransformMode}
        onToggleView={toggleView}
        onDeselect={() => selectLight(null)}
      />
    </div>
  )
}

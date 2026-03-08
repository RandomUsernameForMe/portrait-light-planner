import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Box, Cone } from '@react-three/drei'
import * as THREE from 'three'
import type { LightConfig } from '../lights/types'
import { kelvinToColor } from '../lights/colorTemp'

interface LightObjectProps {
  light: LightConfig
  isSelected: boolean
  onSelect: () => void
}

function SoftboxIcon({ color, selected }: { color: string; selected: boolean }) {
  return (
    <group>
      <Box args={[0.4, 0.3, 0.1]}>
        <meshStandardMaterial
          color={selected ? '#ffffff' : '#cccccc'}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </Box>
      {/* diffuzer */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[0.38, 0.28]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function SpotlightIcon({ color, selected }: { color: string; selected: boolean }) {
  return (
    <group>
      <Cone args={[0.15, 0.3, 12]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color={selected ? '#ffffff' : '#aaaaaa'} />
      </Cone>
      <Sphere args={[0.08, 12, 12]} position={[0, 0.18, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </Sphere>
    </group>
  )
}

function BounceIcon({ color, selected }: { color: string; selected: boolean }) {
  return (
    <Box args={[0.5, 0.5, 0.05]}>
      <meshStandardMaterial
        color={selected ? '#ffffff' : '#eeeeee'}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.1}
        metalness={0.5}
      />
    </Box>
  )
}

export function LightObject({ light, isSelected, onSelect }: LightObjectProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const color = kelvinToColor(light.colorTemp)

  useFrame(() => {
    if (groupRef.current && hovered) {
      groupRef.current.rotation.y += 0.01
    }
  })

  const iconProps = { color, selected: isSelected }

  return (
    <group
      position={light.position}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
    >
      {/* Ikona světla */}
      <group ref={groupRef} scale={hovered ? 1.1 : 1}>
        {(light.type === 'softbox' || light.type === 'window') && <SoftboxIcon {...iconProps} />}
        {(light.type === 'reflector' || light.type === 'beauty_dish') && <SpotlightIcon {...iconProps} />}
        {light.type === 'bounce' && <BounceIcon {...iconProps} />}
      </group>

      {/* Výběrový ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.02, 8, 32]} />
          <meshBasicMaterial color="#00aaff" />
        </mesh>
      )}

      {/* Aktuální Three.js světlo */}
      <LightSource light={light} />
    </group>
  )
}

function LightSource({ light }: { light: LightConfig }) {
  const color = kelvinToColor(light.colorTemp)
  const intensity = light.intensity

  // Směr světla — lookAt origin (subjekt na [0,0,0])
  const targetRef = useRef<THREE.Object3D>(null)

  if (light.type === 'softbox' || light.type === 'window') {
    return (
      <rectAreaLight
        color={color}
        intensity={intensity * 3}
        width={light.width ?? 1}
        height={light.height ?? 1}
        lookAt={[0, 1.2, 0]}
      />
    )
  }

  if (light.type === 'reflector' || light.type === 'beauty_dish') {
    return (
      <>
        <object3D ref={targetRef} position={[0, 1.2, 0]} />
        <spotLight
          color={color}
          intensity={intensity * 20}
          angle={light.angle ?? 0.4}
          penumbra={light.penumbra ?? 0.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
          target={targetRef.current ?? undefined}
        />
      </>
    )
  }

  if (light.type === 'bounce') {
    return (
      <rectAreaLight
        color={color}
        intensity={intensity * 1.5}
        width={light.width ?? 1.5}
        height={light.height ?? 1.5}
        lookAt={[0, 1.2, 0]}
      />
    )
  }

  return null
}

export function Subject() {
  return (
    <group position={[0, 0, 0]}>
      {/* Tělo */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 1.2, 16]} />
        <meshStandardMaterial color="#d4a27a" roughness={0.7} metalness={0.0} />
      </mesh>
      {/* Hlava */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#d4a27a" roughness={0.6} metalness={0.0} />
      </mesh>
      {/* Nos */}
      <mesh castShadow position={[0, 1.48, 0.38]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#c4926a" roughness={0.7} />
      </mesh>
      {/* Oko levé */}
      <mesh position={[-0.15, 1.58, 0.34]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.3} />
      </mesh>
      {/* Oko pravé */}
      <mesh position={[0.15, 1.58, 0.34]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.3} />
      </mesh>
    </group>
  )
}

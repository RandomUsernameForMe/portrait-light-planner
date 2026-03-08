export function Floor() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.1} />
    </mesh>
  )
}

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function Sculpture() {
  const ref = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * .12;
    ref.current.rotation.x += (state.pointer.y * .22 - ref.current.rotation.x) * .035;
    ref.current.rotation.z += (state.pointer.x * .14 - ref.current.rotation.z) * .035;
  });
  return <group ref={ref} rotation={[.2, -.2, 0]}><Float speed={.8} floatIntensity={.3} rotationIntensity={.15}>
    <mesh><dodecahedronGeometry args={[1.3, 1]} /><meshPhysicalMaterial color="#d8bcac" roughness={.12} metalness={.1} transmission={.36} thickness={1.4} /></mesh>
    <mesh rotation={[1.15,.2,.55]}><torusGeometry args={[1.8,.022,10,80]} /><meshStandardMaterial color="#4d0e13" metalness={.78} roughness={.22} /></mesh>
    <mesh rotation={[-.2,1.4,-.7]}><torusGeometry args={[1.55,.012,8,72]} /><meshStandardMaterial color="#eee4da" metalness={.72} roughness={.25} /></mesh>
    <mesh position={[1.38,.72,.22]}><sphereGeometry args={[.14,18,18]} /><meshStandardMaterial color="#4d0e13" /></mesh>
  </Float></group>;
}

export default function LabScene() {
  return <Canvas dpr={[1,1.35]} camera={{ position: [0,0,5.7], fov: 42 }} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
    <ambientLight intensity={1.25} /><directionalLight position={[3,4,5]} intensity={2.6} color="#eee4da" /><pointLight position={[-3,-2,2]} intensity={2.4} color="#4d0e13" /><Sculpture />
  </Canvas>;
}

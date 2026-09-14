"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function Sculpture() {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.075;
    group.current.rotation.x += (state.pointer.y * 0.12 - group.current.rotation.x) * 0.025;
    group.current.rotation.y += (state.pointer.x * 0.18 - group.current.rotation.y) * 0.012;
  });
  return <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.35}>
    <group ref={group} rotation={[0.12, -0.4, -0.12]}>
      <mesh castShadow position={[-0.58, .18, 0]} rotation={[.3, 0, -.45]}>
        <torusKnotGeometry args={[.76, .22, 112, 16, 2, 3]} />
        <meshPhysicalMaterial color="#d8bcac" roughness={.18} metalness={.08} clearcoat={1} clearcoatRoughness={.16} />
      </mesh>
      <mesh castShadow position={[.72, -.18, .2]} rotation={[0, .2, .42]}>
        <icosahedronGeometry args={[.78, 2]} />
        <meshPhysicalMaterial color="#4a342a" roughness={.24} metalness={.36} clearcoat={.7} />
      </mesh>
      <mesh position={[.15, .36, .72]}>
        <sphereGeometry args={[.46, 48, 48]} />
        <meshPhysicalMaterial color="#eee4da" transparent opacity={.4} transmission={.72} thickness={1.4} roughness={.08} ior={1.45} />
      </mesh>
      {[1.22, 1.52, 1.78].map((radius, index) => <mesh key={radius} rotation={[Math.PI / 2 + index * .33, index * .48, .25]}>
        <torusGeometry args={[radius, index === 1 ? .018 : .012, 8, 96]} />
        <meshStandardMaterial color={index === 1 ? "#4d0e13" : "#7b6c63"} metalness={.9} roughness={.17} />
      </mesh>)}
      <pointLight position={[0, 0, 1]} color="#70151d" intensity={5} distance={3.5} />
    </group>
  </Float>;
}

export default function IntelligenceScene() {
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.2], fov: 37 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} shadows>
    <ambientLight intensity={.95} />
    <directionalLight castShadow position={[4, 5, 5]} intensity={3.2} color="#fff2e7" />
    <directionalLight position={[-4, -2, 3]} intensity={1.4} color="#d8bcac" />
    <Sculpture />
    <Environment preset="studio" environmentIntensity={.4} />
  </Canvas>;
}

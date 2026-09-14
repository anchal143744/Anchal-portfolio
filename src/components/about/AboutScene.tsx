"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function EvolvingForm() {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * .09;
    group.current.rotation.x += (state.pointer.y * .12 - group.current.rotation.x) * .025;
    group.current.rotation.z += (state.pointer.x * .1 - group.current.rotation.z) * .025;
  });
  return <group ref={group} rotation={[.22, -.35, 0]}>
    <Float speed={.65} rotationIntensity={.18} floatIntensity={.25}>
      <mesh><icosahedronGeometry args={[1.25, 2]} /><meshPhysicalMaterial color="#d8bcac" roughness={.2} metalness={.08} transmission={.28} thickness={1.2} /></mesh>
      <mesh rotation={[Math.PI / 2.8, .4, 0]}><torusGeometry args={[1.85, .018, 10, 96]} /><meshStandardMaterial color="#4d0e13" metalness={.8} roughness={.2} /></mesh>
      <mesh rotation={[-.45, Math.PI / 2, .7]}><torusGeometry args={[1.55, .012, 10, 96]} /><meshStandardMaterial color="#eee4da" metalness={.75} roughness={.22} /></mesh>
      {[[-1.7,.15,.35],[1.35,.85,-.2],[.2,-1.55,.55]].map((p, i) => <mesh key={i} position={p as [number,number,number]}><sphereGeometry args={[.11 + i * .025, 20, 20]} /><meshStandardMaterial color={i === 1 ? "#4d0e13" : "#eee4da"} metalness={.35} roughness={.25} /></mesh>)}
    </Float>
  </group>;
}

export default function AboutScene() {
  return <Canvas dpr={[1, 1.4]} camera={{ position: [0, 0, 5.8], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
    <ambientLight intensity={1.35} /><directionalLight position={[3, 4, 5]} intensity={2.8} color="#eee4da" /><pointLight position={[-3, -1, 2]} intensity={3} color="#4d0e13" />
    <EvolvingForm />
  </Canvas>;
}

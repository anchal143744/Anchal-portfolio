"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import type { Project } from "@/data/projects";

function SystemObjects({ mode }: { mode: Project["visual"] }) {
  const root = useRef<Group>(null);
  const architectural = useRef<Group>(null);
  const organic = useRef<Group>(null);
  const material = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!root.current) return;
    root.current.rotation.y += delta * .055;
    root.current.rotation.x += (state.pointer.y * .08 - root.current.rotation.x) * .03;
    root.current.position.x += (state.pointer.x * .12 - root.current.position.x) * .025;
    [[architectural, mode === "architectural"], [organic, mode === "organic"], [material, mode === "material"]].forEach(([ref, active]) => {
      const group = (ref as React.RefObject<Group>).current;
      if (group) {
        const next = group.scale.x + ((active ? 1 : .001) - group.scale.x) * .07;
        group.scale.setScalar(next);
      }
    });
  });
  return <Float speed={.8} rotationIntensity={.08} floatIntensity={.22}><group ref={root}>
    <group ref={architectural}>
      {[-1.15, 0, 1.15].map((x, i) => <mesh key={x} position={[x, (i - 1) * .35, 0]} rotation={[.08 * i, .25, 0]} castShadow>
        <boxGeometry args={[.82, 1.6, .5]} /><meshPhysicalMaterial color={i === 1 ? "#4d0e13" : "#171312"} metalness={.55} roughness={.23} clearcoat={.8} />
      </mesh>)}
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.85, .018, 8, 120]} /><meshStandardMaterial color="#d8bcac" metalness={.9} /></mesh>
    </group>
    <group ref={organic} scale={.001}>
      <mesh castShadow><sphereGeometry args={[1.25, 64, 64]} /><meshPhysicalMaterial color="#eee4da" transmission={.72} transparent opacity={.75} roughness={.08} thickness={1.2} /></mesh>
      <mesh position={[.7, .5, .7]}><sphereGeometry args={[.52, 48, 48]} /><meshPhysicalMaterial color="#d8bcac" roughness={.28} clearcoat={1} /></mesh>
      <mesh position={[-.72, -.52, .7]}><sphereGeometry args={[.3, 36, 36]} /><meshPhysicalMaterial color="#4d0e13" roughness={.24} /></mesh>
    </group>
    <group ref={material} scale={.001} rotation={[.2, -.4, -.14]}>
      {[-.65, 0, .65].map((y, i) => <mesh key={y} position={[i * .32 - .32, y, i * -.28]} rotation={[.2, -.18, -.3]} castShadow>
        <boxGeometry args={[2.2, .46, 1.38]} /><meshPhysicalMaterial color={["#4a342a", "#d8bcac", "#4d0e13"][i]} metalness={.18 + i * .2} roughness={.2} clearcoat={1} />
      </mesh>)}
    </group>
  </group></Float>;
}

export default function WorkScene({ mode }: { mode: Project["visual"] }) {
  return <Canvas dpr={[1, 1.45]} camera={{ position: [0, 0, 5.7], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} shadows>
    <color attach="background" args={[mode === "organic" ? "#d8bcac" : mode === "material" ? "#271a16" : "#090909"]} />
    <ambientLight intensity={.8} /><directionalLight castShadow position={[4, 5, 5]} intensity={3} color="#fff1e6" /><pointLight position={[-3, -1, 3]} intensity={5} color="#6d111a" distance={7} />
    <SystemObjects mode={mode} /><Environment preset="studio" environmentIntensity={.35} />
  </Canvas>;
}

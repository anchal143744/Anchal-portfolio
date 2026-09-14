"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function Connection() {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * .07;
    group.current.rotation.x += (state.pointer.y * .1 - group.current.rotation.x) * .025;
    group.current.position.x += (state.pointer.x * .12 - group.current.position.x) * .025;
  });
  return <group ref={group}><Float speed={.55} floatIntensity={.18} rotationIntensity={.1}>
    <mesh position={[-.82,.15,0]}><icosahedronGeometry args={[.92,2]} /><meshPhysicalMaterial color="#eee4da" transmission={.35} thickness={1.1} roughness={.18} /></mesh>
    <mesh position={[.88,-.1,.12]}><dodecahedronGeometry args={[.78,1]} /><meshStandardMaterial color="#4a342a" metalness={.72} roughness={.25} /></mesh>
    <mesh rotation={[Math.PI/2.5,.2,.1]}><torusGeometry args={[1.55,.018,8,80]} /><meshStandardMaterial color="#4d0e13" metalness={.75} roughness={.22} /></mesh>
    <mesh><sphereGeometry args={[.18,20,20]} /><meshStandardMaterial color="#4d0e13" metalness={.3} roughness={.2} /></mesh>
  </Float></group>;
}

export default function ContactScene() {
  return <Canvas dpr={[1,1.35]} camera={{position:[0,0,5.5],fov:42}} gl={{alpha:true,antialias:true,powerPreference:"high-performance"}}>
    <ambientLight intensity={1.1}/><directionalLight position={[3,4,4]} intensity={2.7} color="#eee4da"/><pointLight position={[-3,-2,2]} intensity={2.1} color="#4d0e13"/><Connection/>
  </Canvas>;
}

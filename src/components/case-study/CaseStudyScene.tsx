"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Line } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import type { CaseStudy } from "@/data/case-studies";

const nodes: [number, number, number][] = [[-1.5,.9,0],[-.5,.15,.55],[.45,.65,-.15],[1.45,-.55,.15],[0,-1,.4]];

function StudyObject({ mode }: { mode: CaseStudy["visual"] }) {
  const root = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!root.current) return;
    root.current.rotation.y += delta * .045;
    root.current.rotation.x += (state.pointer.y * .09 - root.current.rotation.x) * .025;
    root.current.position.x += (state.pointer.x * .1 - root.current.position.x) * .02;
  });
  return <Float speed={.7} rotationIntensity={.08} floatIntensity={.2}><group ref={root}>
    {mode === "architectural" && <group>
      {nodes.map((position, i) => <mesh key={i} position={position} castShadow><icosahedronGeometry args={[i === 1 ? .3 : .16, 1]} /><meshPhysicalMaterial color={i === 1 ? "#4d0e13" : "#d8bcac"} metalness={.68} roughness={.19} clearcoat={1} /></mesh>)}
      <Line points={nodes} color="#889096" lineWidth={.65} transparent opacity={.55} />
      <mesh rotation={[Math.PI / 2,0,0]}><torusGeometry args={[1.65,.012,8,100]} /><meshStandardMaterial color="#4a342a" metalness={.85} /></mesh>
      <mesh rotation={[0,Math.PI / 2,.2]}><torusGeometry args={[1.12,.01,8,100]} /><meshStandardMaterial color="#d8bcac" metalness={.8} /></mesh>
    </group>}
    {mode === "organic" && <group>
      <mesh castShadow><sphereGeometry args={[1.2,48,48]} /><meshPhysicalMaterial color="#eee4da" transmission={.74} transparent opacity={.8} thickness={1.25} roughness={.08} /></mesh>
      <mesh position={[.8,.42,.55]}><sphereGeometry args={[.48,40,40]} /><meshPhysicalMaterial color="#d8bcac" clearcoat={1} roughness={.25} /></mesh>
      <mesh position={[-.78,-.55,.7]}><sphereGeometry args={[.28,32,32]} /><meshPhysicalMaterial color="#4d0e13" clearcoat={.8} roughness={.2} /></mesh>
      <mesh rotation={[Math.PI/2,.35,0]}><torusGeometry args={[1.65,.015,8,100]} /><meshStandardMaterial color="#4d0e13" /></mesh>
    </group>}
    {mode === "material" && <group rotation={[.1,-.4,-.14]}>
      {[-.7,0,.7].map((y,i) => <mesh key={y} position={[i*.36-.36,y,-i*.2]} rotation={[.2,-.18,-.32]} castShadow><boxGeometry args={[2.25,.48,1.4]} /><meshPhysicalMaterial color={["#4a342a","#d8bcac","#4d0e13"][i]} metalness={.18+i*.2} roughness={.18} clearcoat={1} /></mesh>)}
      <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[1.85,.012,8,100]} /><meshStandardMaterial color="#eee4da" metalness={.85} /></mesh>
    </group>}
  </group></Float>;
}

export default function CaseStudyScene({ study }: { study: CaseStudy }) {
  const background = study.visual === "organic" ? "#d8bcac" : study.visual === "material" ? "#271a16" : "#090909";
  return <Canvas dpr={[1,1.45]} camera={{ position: [0,0,5.2], fov: 38 }} gl={{ antialias: true, powerPreference: "high-performance" }} shadows>
    <color attach="background" args={[background]} /><ambientLight intensity={.75} /><directionalLight castShadow position={[4,5,5]} intensity={3} color="#fff1e6" /><pointLight position={[-3,-1,3]} intensity={4} color="#6d111a" distance={7} />
    <StudyObject mode={study.visual} /><Environment preset="studio" environmentIntensity={.3} />
  </Canvas>;
}

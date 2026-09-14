"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

function Workspace() {
  const group = useRef<Group>(null);
  const sphere = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += (state.pointer.x * 0.055 - group.current.rotation.y) * 0.025;
    group.current.rotation.x += (-state.pointer.y * 0.025 - group.current.rotation.x) * 0.025;
    if (sphere.current) sphere.current.rotation.y += delta * 0.08;
  });

  return <group ref={group} position={[0.45, -0.35, 0]}>
    <mesh rotation={[1.3, .12, -.42]} position={[-.35, .35, -.45]} scale={[1.35, 1.35, 1.35]}>
      <torusGeometry args={[1.8, .085, 18, 128, 5.35]} />
      <meshStandardMaterial color="#9c6c4d" metalness={.92} roughness={.21} />
    </mesh>
    <mesh ref={sphere} position={[-1.18, .58, .42]}>
      <sphereGeometry args={[.52, 48, 48]} />
      <meshPhysicalMaterial color="#392620" transparent opacity={.5} transmission={.35} roughness={.1} metalness={.15} clearcoat={1} />
    </mesh>
    <mesh position={[1.55, .45, -.05]} rotation={[0, -.13, 0]}>
      <boxGeometry args={[.045, 2.25, 1.25]} />
      <meshPhysicalMaterial color="#d7c1ad" transparent opacity={.17} transmission={.8} roughness={.04} />
    </mesh>
    <mesh position={[.35, -1.56, .2]} receiveShadow>
      <boxGeometry args={[5.6, .18, 2.1]} />
      <meshStandardMaterial color="#211714" roughness={.5} metalness={.12} />
    </mesh>
    <group position={[-.65, -1.08, .85]} rotation={[-.12, .08, 0]}>
      <mesh><boxGeometry args={[1.65, .08, 1.05]} /><meshStandardMaterial color="#5b443a" metalness={.45} roughness={.24} /></mesh>
      <mesh position={[0,.52,-.45]} rotation={[-.42,0,0]}><boxGeometry args={[1.65, 1.05, .055]} /><meshStandardMaterial color="#30231f" metalness={.58} roughness={.19} /></mesh>
    </group>
    <group position={[1.25,-1.22,.62]}>
      {[0,.18,.36].map((y,index)=><mesh key={y} position={[0,y,0]}><boxGeometry args={[1.05,.14,.72]} /><meshStandardMaterial color={["#6f473d","#c5aa91","#3c2924"][index]} roughness={.55}/></mesh>)}
    </group>
    <group position={[2.05,-1.17,.78]}>
      <mesh><cylinderGeometry args={[.3,.26,.62,32]} /><meshStandardMaterial color="#241916" roughness={.32} metalness={.42}/></mesh>
      <mesh position={[.32,.05,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.19,.045,10,28,Math.PI*1.55]} /><meshStandardMaterial color="#241916"/></mesh>
    </group>
    <group position={[2.55,-.95,.25]}>
      <mesh position={[0,.5,0]}><cylinderGeometry args={[.08,.12,1,12]} /><meshStandardMaterial color="#5f4938"/></mesh>
      {[-.25,0,.25].map((x)=><mesh key={x} position={[x,.95,0]} rotation={[0,0,x*1.8]}><sphereGeometry args={[.24,12,12]} /><meshStandardMaterial color="#403d2d" roughness={.72}/></mesh>)}
    </group>
  </group>;
}

export default function HomeHeroScene() {
  return <Canvas dpr={[1, 1.35]} camera={{ position: [0, .15, 6.2], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
    <ambientLight intensity={.7} />
    <directionalLight position={[3, 5, 5]} intensity={3.8} color="#ffe7cc" />
    <directionalLight position={[-4, 1, 3]} intensity={1.5} color="#c99073" />
    <pointLight position={[1, 0, 3]} intensity={18} distance={7} color="#6b2927" />
    <Workspace />
  </Canvas>;
}

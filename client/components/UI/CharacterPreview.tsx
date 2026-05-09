'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ color }: { color: string }) {
  return (
    <group position={[0, -1, 0]}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[1, 1.5, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#ffcc99" />
      </mesh>
      {/* Arms */}
      <mesh position={[0.6, 0.1, 0]} castShadow>
        <boxGeometry args={[0.25, 1, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.6, 0.1, 0]} castShadow>
        <boxGeometry args={[0.25, 1, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.25, -1.2, 0]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.25, -1.2, 0]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

export default function CharacterPreview({ roleColor }: { roleColor: string }) {
  return (
    <div className="w-full h-64 bg-black/40 rounded-2xl overflow-hidden border border-white/5">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} contactShadow={false}>
            <Model color={roleColor} />
          </Stage>
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={4}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, Torus, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// The main interactive 3D object
function AbstractGymCore() {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Smooth continuous rotation
      groupRef.current.rotation.y = t * 0.3;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      
      // Interactive mouse follow
      groupRef.current.rotation.y += (state.pointer.x * 0.5 - groupRef.current.rotation.y) * 0.1;
      groupRef.current.rotation.x += (-state.pointer.y * 0.5 - groupRef.current.rotation.x) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        {/* Outer Ring - Dark Metallic */}
        <Torus args={[2.5, 0.1, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial 
            color="#111111" 
            metalness={0.9} 
            roughness={0.1} 
            envMapIntensity={2} 
          />
        </Torus>

        {/* Middle Ring - Gym Red Neon */}
        <Torus args={[1.8, 0.05, 16, 100]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000" 
            emissiveIntensity={2} 
            toneMapped={false} 
          />
        </Torus>

        {/* Inner Core - Dark Sphere */}
        <Sphere args={[1.2, 64, 64]}>
          <meshStandardMaterial 
            color="#050505" 
            metalness={1} 
            roughness={0.2} 
            envMapIntensity={1.5} 
          />
        </Sphere>
      </Float>

      {/* Floating red sparks around the core */}
      <Sparkles 
        count={150} 
        scale={6} 
        size={2} 
        speed={0.4} 
        color="#ff2222" 
      />
    </group>
  );
}

// The wrapping canvas component
export default function Canvas3D() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {/* We use pointer-events-auto on the Canvas so mouse movement is captured, 
          but ensure it doesn't block clicks on HTML buttons by keeping z-index low */}
      <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0000" />
          
          <AbstractGymCore />
          
          <Environment preset="city" />
          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#ff0000" />
        </Canvas>
      </div>
    </div>
  );
}

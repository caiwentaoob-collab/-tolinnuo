import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Stars, 
  Sparkles, 
  Float,
  ContactShadows,
  Html
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeState } from '../types';
import { TreeParticles } from './TreeParticles';
import { Rabbit } from './Cinnamoroll';
import { COLORS, CONFIG } from '../constants';
import * as THREE from 'three';

interface ExperienceProps {
  treeState: TreeState;
  onToggle: () => void;
}

// A component to manage the Topper Animation separate from the particles
const TreeTopper = ({ state }: { state: TreeState }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetY = CONFIG.treeHeight / 2 + 0.2;
  const chaosPos = new THREE.Vector3(0, 8, 0); // High up in chaos
  
  useFrame((stateThree, delta) => {
    if(!groupRef.current) return;
    
    const target = state === TreeState.FORMED 
      ? new THREE.Vector3(0, targetY, 0)
      : new THREE.Vector3(
          Math.sin(stateThree.clock.elapsedTime) * 5, 
          5 + Math.cos(stateThree.clock.elapsedTime * 0.5) * 2, 
          Math.cos(stateThree.clock.elapsedTime) * 5
        );

    // Smooth lerp
    groupRef.current.position.lerp(target, delta * 2);
    
    // Rotation
    if (state === TreeState.FORMED) {
       groupRef.current.rotation.y += delta * 0.5; // Slow spin on top
       groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, delta);
       groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, delta);
    } else {
       groupRef.current.rotation.x += delta;
       groupRef.current.rotation.z += delta;
    }
  });

  return (
    <group ref={groupRef}>
      <Rabbit scale={0.8} isTopper={true} />
    </group>
  );
};

export const Experience: React.FC<ExperienceProps> = ({ treeState, onToggle }) => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 12], fov: 45 }}
      gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
    >
      <color attach="background" args={['#001a0f']} />
      
      {/* --- Controls --- */}
      <OrbitControls 
        enablePan={false}  
        enableZoom={true} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8} 
        minDistance={6} 
        maxDistance={20}
      />

      {/* --- Environment & Lighting --- */}
      <Environment preset="city" />
      <ambientLight intensity={0.2} color={COLORS.emerald} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        color={COLORS.champagne} 
      />
      <pointLight position={[-10, -5, -10]} intensity={5} color={COLORS.emerald} />
      <pointLight position={[0, 5, 5]} intensity={2} color={COLORS.gold} distance={10} />

      {/* --- Background Elements --- */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* --- The Tree --- */}
      <group position={[0, -1, 0]}>
        <TreeParticles state={treeState} />
        <TreeTopper state={treeState} />
      </group>

      {/* --- Magic Effects --- */}
      <Sparkles 
        count={200} 
        scale={12} 
        size={4} 
        speed={0.4} 
        opacity={0.5} 
        color={COLORS.gold} 
      />
      
      {/* --- Floor Reflections --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
            color="#001a0f" 
            roughness={0} 
            metalness={0.5} 
            transparent 
            opacity={0.8} 
        />
      </mesh>
      
      {/* --- Post Processing --- */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.2} 
          radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>

    </Canvas>
  );
};

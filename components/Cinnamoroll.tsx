import React, { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../constants';

export const Rabbit: React.FC<{ scale?: number; isTopper?: boolean }> = ({ scale = 1, isTopper = false }) => {
  
  const whiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.white,
    roughness: 0.3,
    metalness: 0.1,
  }), []);

  const pinkMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.rabbitPink,
    roughness: 0.4,
    metalness: 0.0,
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#333333",
    roughness: 0.2,
  }), []);

  return (
    <group scale={scale}>
      {/* Head */}
      <mesh position={[0, 0, 0]} material={whiteMaterial} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 32, 32]} />
      </mesh>

      {/* Body (only if topper, otherwise just head/hanging style) */}
      {isTopper && (
        <mesh position={[0, -0.65, 0]} material={whiteMaterial} castShadow>
          <capsuleGeometry args={[0.3, 0.6, 4, 16]} />
        </mesh>
      )}

      {/* Ears - Upright Rabbit Ears */}
      <group position={[0, 0.3, 0]}>
         {/* Left Ear */}
         <group position={[0.25, 0.3, 0]} rotation={[0, 0, -0.2]}>
             <mesh position={[0, 0.2, 0]} material={whiteMaterial} castShadow>
                <capsuleGeometry args={[0.12, 0.8, 4, 16]} />
             </mesh>
             {/* Inner Ear Pink */}
             <mesh position={[0, 0.2, 0.08]} rotation={[0,0,0]} material={pinkMaterial}>
                <capsuleGeometry args={[0.08, 0.6, 4, 16]} />
             </mesh>
         </group>

         {/* Right Ear */}
         <group position={[-0.25, 0.3, 0]} rotation={[0, 0, 0.2]}>
             <mesh position={[0, 0.2, 0]} material={whiteMaterial} castShadow>
                <capsuleGeometry args={[0.12, 0.8, 4, 16]} />
             </mesh>
             {/* Inner Ear Pink */}
             <mesh position={[0, 0.2, 0.08]} rotation={[0,0,0]} material={pinkMaterial}>
                <capsuleGeometry args={[0.08, 0.6, 4, 16]} />
             </mesh>
         </group>
      </group>

      {/* Eyes */}
      <mesh position={[0.2, 0.05, 0.45]} material={eyeMaterial}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>
      <mesh position={[-0.2, 0.05, 0.45]} material={eyeMaterial}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>

      {/* Cheeks */}
      <mesh position={[0.32, -0.05, 0.4]} material={pinkMaterial}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>
      <mesh position={[-0.32, -0.05, 0.4]} material={pinkMaterial}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>

      {/* Nose/Mouth */}
      <mesh position={[0, -0.05, 0.5]} material={pinkMaterial}>
         <sphereGeometry args={[0.04, 16, 16]} />
      </mesh>
       
       {/* Tail (Round) */}
       {isTopper && (
         <mesh position={[0, -0.8, -0.3]} material={whiteMaterial}>
           <sphereGeometry args={[0.15, 16, 16]} />
         </mesh>
       )}
       
       {/* Halo/Glow if topper */}
       {isTopper && (
         <pointLight position={[0, 1.2, 0]} intensity={2} distance={5} color={COLORS.gold} />
       )}
    </group>
  );
};
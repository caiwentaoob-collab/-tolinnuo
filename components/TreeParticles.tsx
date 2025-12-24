import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState, ParticleData } from '../types';
import { CONFIG, COLORS } from '../constants';
import { Rabbit } from './Cinnamoroll';

const tempObject = new THREE.Object3D();
const tempPos = new THREE.Vector3();
const tempQuat = new THREE.Quaternion();

interface TreeParticlesProps {
  state: TreeState;
}

// Helper component for individual character animation
const AnimatedRabbit: React.FC<{ data: ParticleData, state: TreeState }> = ({ data, state }) => {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(0);
  
  useFrame((stateThree, delta) => {
    if (!groupRef.current) return;
    
    const targetProgress = state === TreeState.FORMED ? 1 : 0;
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress, delta * CONFIG.transitionSpeed);
    const t = THREE.MathUtils.smoothstep(progress.current, 0, 1);
    
    // Position Lerp
    const pos = new THREE.Vector3().lerpVectors(data.chaosPos, data.targetPos, t);
    
    // Sway animation when in tree mode
    if (progress.current > 0.8) {
       // Gentle pendulum swing effect
       pos.x += Math.sin(stateThree.clock.elapsedTime * 1.5 + data.speed * 10) * 0.05;
       pos.z += Math.cos(stateThree.clock.elapsedTime * 1.2 + data.speed * 10) * 0.05;
    }

    // Rotation Lerp
    const qChaos = new THREE.Quaternion().setFromEuler(data.chaosRot);
    const qTarget = new THREE.Quaternion().setFromEuler(data.targetRot);
    const currentQuat = new THREE.Quaternion().slerpQuaternions(qChaos, qTarget, t);
    
    // Apply sway rotation
    if (progress.current > 0.8) {
        const swayQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(
            Math.cos(stateThree.clock.elapsedTime + data.speed) * 0.1, 
            0, 
            Math.sin(stateThree.clock.elapsedTime + data.speed) * 0.1
        ));
        currentQuat.multiply(swayQ);
    }

    groupRef.current.position.copy(pos);
    groupRef.current.quaternion.copy(currentQuat);
    groupRef.current.scale.setScalar(data.scale);
  });

  return (
    <group ref={groupRef}>
      {/* The Character */}
      <group position={[0, -0.2, 0]}> {/* Offset center of gravity for hanging effect */}
          <Rabbit scale={1} />
      </group>
      
      {/* Gold Thread */}
      <mesh position={[0, 0.5, 0]}>
         <cylinderGeometry args={[0.005, 0.005, 1.2]} />
         <meshStandardMaterial color={COLORS.gold} metalness={1} roughness={0} />
      </mesh>
    </group>
  );
};

export const TreeParticles: React.FC<TreeParticlesProps> = ({ state }) => {
  // We use multiple InstancedMeshes
  const needlesRef = useRef<THREE.InstancedMesh>(null);
  const ornamentsRef = useRef<THREE.InstancedMesh>(null);
  const redLightsRef = useRef<THREE.InstancedMesh>(null);
  const blueLightsRef = useRef<THREE.InstancedMesh>(null);
  
  // Animation progress: 0 = CHAOS, 1 = FORMED
  const progress = useRef(0);

  // Generate Data
  const { needlesData, ornamentsData, characterData, redLightsData, blueLightsData } = useMemo(() => {
    const nData: ParticleData[] = [];
    const oData: ParticleData[] = [];
    const cData: ParticleData[] = [];
    const rlData: ParticleData[] = []; // Red Lights
    const blData: ParticleData[] = []; // Blue Lights
    
    // --- Helper: Random Point in Sphere (Chaos) ---
    const getRandomChaosPos = () => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = Math.cbrt(Math.random()) * CONFIG.chaosRadius;
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    };

    // --- Helper: Cone Distribution (Tree) ---
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    // 1. Needles
    for (let i = 0; i < CONFIG.needleCount; i++) {
      const chaosPos = getRandomChaosPos();
      
      const y = (i / CONFIG.needleCount) * CONFIG.treeHeight - (CONFIG.treeHeight / 2);
      const relativeY = (y + CONFIG.treeHeight / 2) / CONFIG.treeHeight;
      const radius = CONFIG.baseRadius * (1 - relativeY);
      const angle = i * goldenRatio * 2 * Math.PI;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      const jitter = 0.2;
      const treePos = new THREE.Vector3(
        x + (Math.random() - 0.5) * jitter, 
        y, 
        z + (Math.random() - 0.5) * jitter
      );

      const targetRot = new THREE.Euler(
        -Math.PI / 2 - 0.5 + Math.random() * 0.5,
        Math.random() * Math.PI * 2,
        0
      );

      nData.push({
        chaosPos,
        targetPos: treePos,
        chaosRot: new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI),
        targetRot,
        speed: 0.5 + Math.random() * 0.5,
        scale: 0.1 + Math.random() * 0.15,
        type: 'needle'
      });
    }

    // 2. Ornaments
    for (let i = 0; i < CONFIG.ornamentCount; i++) {
      const chaosPos = getRandomChaosPos();
      
      const h = Math.random() * CONFIG.treeHeight - (CONFIG.treeHeight / 2);
      const relativeH = (h + CONFIG.treeHeight / 2) / CONFIG.treeHeight;
      const radius = (CONFIG.baseRadius * (1 - relativeH)) + 0.2;
      const angle = Math.random() * Math.PI * 2;
      
      const treePos = new THREE.Vector3(
        Math.cos(angle) * radius,
        h,
        Math.sin(angle) * radius
      );

      oData.push({
        chaosPos,
        targetPos: treePos,
        chaosRot: new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI),
        targetRot: new THREE.Euler(0, 0, 0),
        speed: 0.3 + Math.random() * 0.4,
        scale: 0.15 + Math.random() * 0.2,
        type: 'ornament'
      });
    }

    // 3. Characters (Rabbits)
    for (let i = 0; i < CONFIG.characterCount; i++) {
        const chaosPos = getRandomChaosPos();
        
        const h = (Math.random() * 0.7 + 0.15) * CONFIG.treeHeight - (CONFIG.treeHeight / 2);
        const relativeH = (h + CONFIG.treeHeight / 2) / CONFIG.treeHeight;
        const radius = (CONFIG.baseRadius * (1 - relativeH)) + 0.5;
        const angle = (i / CONFIG.characterCount) * Math.PI * 2 + (Math.random() * 0.5); 
        
        const treePos = new THREE.Vector3(
          Math.cos(angle) * radius,
          h,
          Math.sin(angle) * radius
        );
  
        const facingAngle = -angle - Math.PI / 2;

        cData.push({
          chaosPos,
          targetPos: treePos,
          chaosRot: new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI),
          targetRot: new THREE.Euler(0, facingAngle, 0),
          speed: 0.2 + Math.random() * 0.2,
          scale: 0.35,
          type: 'character'
        });
    }

    // 4. Lights (Red and Blue Strips)
    const windings = 12; // Number of times the light strip wraps around
    for (let i = 0; i < CONFIG.lightCount; i++) {
        const chaosPos = getRandomChaosPos();
        
        // Progress from bottom to top
        const t = i / CONFIG.lightCount;
        const y = t * CONFIG.treeHeight - (CONFIG.treeHeight / 2);
        
        const relativeY = (y + CONFIG.treeHeight / 2) / CONFIG.treeHeight;
        // Radius slightly larger than needles to float on top
        const radius = (CONFIG.baseRadius * (1 - relativeY)) + 0.15;
        
        // Spiral Angle
        const angle = t * windings * 2 * Math.PI;
        
        const treePos = new THREE.Vector3(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius
        );

        // Interleave colors: Even = Red, Odd = Blue
        const isRed = i % 2 === 0;
        const targetList = isRed ? rlData : blData;

        targetList.push({
            chaosPos,
            targetPos: treePos,
            chaosRot: new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI),
            targetRot: new THREE.Euler(0, 0, 0),
            speed: 1 + Math.random(), // Twinkle speed
            scale: 0.06 + Math.random() * 0.04,
            type: 'light'
        });
    }

    return { needlesData: nData, ornamentsData: oData, characterData: cData, redLightsData: rlData, blueLightsData: blData };
  }, []);

  // Update loop
  useFrame((stateThree, delta) => {
    // 1. Update Progress state
    const targetProgress = state === TreeState.FORMED ? 1 : 0;
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress, delta * CONFIG.transitionSpeed);
    const t = THREE.MathUtils.smoothstep(progress.current, 0, 1);

    const updateInstance = (
        ref: React.RefObject<THREE.InstancedMesh>, 
        data: ParticleData[], 
        animateScale: boolean = false
    ) => {
        if (!ref.current) return;
        data.forEach((d, i) => {
            tempPos.lerpVectors(d.chaosPos, d.targetPos, t);
            
            // Add some "float" in chaos mode or slight sway in tree mode
            if (progress.current < 0.5) {
                 tempPos.y += Math.sin(stateThree.clock.elapsedTime * d.speed + i) * 0.02;
            }

            const qChaos = new THREE.Quaternion().setFromEuler(d.chaosRot);
            const qTarget = new THREE.Quaternion().setFromEuler(d.targetRot);
            tempQuat.slerpQuaternions(qChaos, qTarget, t);

            // Twinkle effect for lights
            let scale = d.scale;
            if (animateScale && progress.current > 0.8) {
                scale = d.scale * (0.8 + Math.sin(stateThree.clock.elapsedTime * d.speed * 5 + i) * 0.3);
            }

            tempObject.scale.setScalar(scale);
            tempObject.position.copy(tempPos);
            tempObject.quaternion.copy(tempQuat);
            tempObject.updateMatrix();
            ref.current!.setMatrixAt(i, tempObject.matrix);
        });
        ref.current.instanceMatrix.needsUpdate = true;
    };

    updateInstance(needlesRef, needlesData);
    updateInstance(ornamentsRef, ornamentsData);
    // Enable scale animation (twinkling) for lights
    updateInstance(redLightsRef, redLightsData, true);
    updateInstance(blueLightsRef, blueLightsData, true);
  });

  return (
    <>
      {/* Needles */}
      <instancedMesh ref={needlesRef} args={[undefined, undefined, CONFIG.needleCount]} castShadow receiveShadow>
        <coneGeometry args={[1, 3, 4]} />
        <meshStandardMaterial color={COLORS.emerald} roughness={0.4} metalness={0.1} />
      </instancedMesh>

      {/* Ornaments */}
      <instancedMesh ref={ornamentsRef} args={[undefined, undefined, CONFIG.ornamentCount]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={COLORS.gold} roughness={0.1} metalness={0.9} emissive={COLORS.gold} emissiveIntensity={0.2} />
      </instancedMesh>

      {/* Red Lights */}
      <instancedMesh ref={redLightsRef} args={[undefined, undefined, redLightsData.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial 
            color={COLORS.christmasRed} 
            emissive={COLORS.christmasRed} 
            emissiveIntensity={2} 
            toneMapped={false} 
        />
      </instancedMesh>

      {/* Blue Lights */}
      <instancedMesh ref={blueLightsRef} args={[undefined, undefined, blueLightsData.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial 
            color={COLORS.electricBlue} 
            emissive={COLORS.electricBlue} 
            emissiveIntensity={2} 
            toneMapped={false} 
        />
      </instancedMesh>

      {/* Rabbit Characters */}
      {characterData.map((data, i) => (
        <AnimatedRabbit key={i} data={data} state={state} />
      ))}
    </>
  );
};
import * as THREE from 'three';

export enum TreeState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED',
}

export interface ParticleData {
  chaosPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  chaosRot: THREE.Euler;
  targetRot: THREE.Euler;
  speed: number;
  scale: number;
  type: 'needle' | 'ornament' | 'character' | 'light';
}

export interface DecorationProps {
  position: [number, number, number];
  scale?: number;
}
import * as THREE from 'three';

export const COLORS = {
  emerald: new THREE.Color("#004225"),
  darkGreen: new THREE.Color("#013220"),
  gold: new THREE.Color("#FFD700"),
  champagne: new THREE.Color("#F7E7CE"),
  white: new THREE.Color("#FFFFFF"),
  rabbitPink: new THREE.Color("#FFB7C5"),
  glow: new THREE.Color("#FFFAF0"),
  christmasRed: new THREE.Color("#FF0033"),
  electricBlue: new THREE.Color("#0088FF"),
};

export const CONFIG = {
  needleCount: 1800,
  ornamentCount: 150,
  characterCount: 8,
  lightCount: 600, // High density for strip effect
  treeHeight: 6,
  baseRadius: 2.8,
  chaosRadius: 15,
  transitionSpeed: 1.5,
};
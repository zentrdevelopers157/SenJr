'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MannequinProps {
  url?: string; // Optional: provide a default or placeholder
  onSkeletonLoad?: (skeleton: THREE.Skeleton) => void;
}

export const Mannequin = ({ 
  url = '/models/character_base.glb', 
  onSkeletonLoad 
}: MannequinProps) => {
  const group = useRef<THREE.Group>(null);
  
  // Attempt to load the model - using placeholder logic if file doesn't exist
  // In a real scenario, we'd use useGLTF(url)
  // For now, let's create a programmatic "Skinned Mesh" placeholder or assume useGLTF will fail gracefully
  
  let scene: THREE.Group | undefined, skeleton: THREE.Skeleton | undefined;
  try {
    const gltf = useGLTF(url);
    scene = gltf.scene;
    
    // Find the first skeleton in the model
    scene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        skeleton = (child as THREE.SkinnedMesh).skeleton;
      }
    });
  } catch {
    console.warn("Mannequin model not found at", url, ". Using placeholder.");
  }

  useEffect(() => {
    if (skeleton && onSkeletonLoad) {
      onSkeletonLoad(skeleton);
    }
  }, [skeleton, onSkeletonLoad]);

  // Rotation logic
  useFrame(() => {
    if (group.current) {
      // Slow auto-rotate if no user interaction (placeholder for now)
    }
  });

  if (!scene) {
    return (
      <group ref={group}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[0.5, 1.8, 0.2]} />
            <meshStandardMaterial 
              color="#00ff00" 
              emissive="#00ff00" 
              emissiveIntensity={2} 
              transparent 
              opacity={0.3} 
              wireframe
            />
          </mesh>
          <mesh position={[0, 2, 0]}>
            <sphereGeometry args={[0.15]} />
            <meshStandardMaterial 
              color="#00ff00" 
              emissive="#00ff00" 
              emissiveIntensity={4} 
              transparent 
              opacity={0.5} 
            />
          </mesh>
          {/* Internal Glow Core */}
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={10} />
          </mesh>
        </Float>
      </group>
    );
  }

  return <primitive ref={group} object={scene} scale={1} position={[0, 0, 0]} />;
};

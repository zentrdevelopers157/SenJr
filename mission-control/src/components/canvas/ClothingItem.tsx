'use client';

import React, { useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ClothingItemProps {
  url: string;
  mannequinSkeleton: THREE.Skeleton | null;
}

export const ClothingItem = ({ url, mannequinSkeleton }: ClothingItemProps) => {
  const { scene } = useGLTF(url);
  
  const clothingMesh = useMemo(() => {
    let mesh: THREE.SkinnedMesh | null = null;
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        mesh = child as THREE.SkinnedMesh;
      }
    });
    return mesh;
  }, [scene]);

  useEffect(() => {
    if (clothingMesh && mannequinSkeleton) {
      // Skeletal Binding: Map the clothing mesh to the mannequin's skeleton
      (clothingMesh as THREE.SkinnedMesh).bind(mannequinSkeleton, (clothingMesh as THREE.SkinnedMesh).bindMatrix);
      console.log(`Bound clothing model ${url} to mannequin skeleton.`);
    }
  }, [clothingMesh, mannequinSkeleton, url]);

  return <primitive object={scene} />;
};

'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei';
import { Mannequin } from './Mannequin';
import { ClothingItem } from './ClothingItem';
import { useAppStore } from '@/store/useAppStore';
import { GoldenSnowfall } from './GoldenSnowfall';
import { useWindowSize } from '@react-hook/window-size';
import * as THREE from 'three';
import { productsData } from '@/data/products';

interface CharacterSceneProps {
  rotationy?: number;
  opacity?: number;
}

export const CharacterScene = ({ rotationy = 0 }: CharacterSceneProps) => {
  const [skeleton, setSkeleton] = useState<THREE.Skeleton | null>(null);
  const equippedClothes = useAppStore((state) => state.equippedClothes);
  const currentMainProductIndex = useAppStore((state) => state.currentMainProductIndex);
  const activeDressIndex = useAppStore((state) => state.activeDressIndex);
  const isPageThreeActive = useAppStore((state) => state.isPageThreeActive);
  
  const [width] = useWindowSize();
  const isMobile = width < 768;

  const currentOutfitUrl = productsData[currentMainProductIndex]?.dressVariations[activeDressIndex - 1];

  return (
    <div className="absolute inset-0 z-0">
      <Canvas 
        shadows 
        camera={{ 
            position: isMobile ? [0, 1.2, 5] : [0, 1.5, 4], 
            fov: isMobile ? 50 : 45 
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <GoldenSnowfall count={800} />
          
          {/* Main Cinematic Rim Light */}
          <spotLight 
            position={[5, 10, 5]} 
            angle={0.15} 
            penumbra={1} 
            intensity={2}
            castShadow 
            shadow-mapSize={[1024, 1024]}
          />
          
          {/* Subtle Back Light for Silhouette */}
          <pointLight position={[-5, 5, -5]} intensity={1.5} color="#d4af37" />
          
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={[0, isMobile ? -0.8 : -1, 0]} rotation={[0, rotationy, 0]}>
              {/* Base Mannequin */}
              <Mannequin onSkeletonLoad={setSkeleton} />
              
              {/* Conditional Clothing Rendering */}
              {skeleton && (
                <>
                  {isPageThreeActive && currentOutfitUrl ? (
                    <ClothingItem url={currentOutfitUrl} mannequinSkeleton={skeleton} />
                  ) : (
                    equippedClothes.map((url: string, index: number) => (
                      <ClothingItem key={url + index} url={url} mannequinSkeleton={skeleton} />
                    ))
                  )}
                </>
              )}
            </group>
          </Float>

          <ContactShadows 
            opacity={0.5} 
            scale={12} 
            blur={2} 
            far={10} 
            resolution={512} 
            color="#000000" 
          />
          
          <Environment preset="city" />
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 2} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

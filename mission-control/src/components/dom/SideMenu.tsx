'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { useAppStore } from '@/store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';

const RotatingModel = () => {
  return (
    <Suspense fallback={null}>
      <Stage environment="city" intensity={0.6} castShadow={false}>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
      </Stage>
      <OrbitControls autoRotate enableZoom={false} />
    </Suspense>
  );
};

export const SideMenu = () => {
  const isOpen = useAppStore((state) => state.isGoldenMenuOpen);
  const toggleMenu = useAppStore((state) => state.toggleGoldenMenu);

  const categories = [
    { name: 'T-SHIRT' },
    { name: 'TROUSER' },
    { name: 'HOODIE' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl"
        >
          <div className="absolute top-8 right-8 cursor-pointer text-white/50 hover:text-white" onClick={toggleMenu}>
            [ CLOSE ]
          </div>

          <div className="relative w-full max-w-6xl h-[60vh] flex justify-around items-center px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" />

            {categories.map((cat, i) => (
              <motion.div 
                key={cat.name}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col items-center w-1/4 h-full"
              >
                <div className="w-full h-full cursor-grab active:cursor-grabbing">
                  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <RotatingModel />
                  </Canvas>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold tracking-[0.2em] text-gold-400 group-hover:text-white transition-colors">
                    {cat.name}
                  </h3>
                  <div className="w-0 group-hover:w-full h-[1px] bg-gold-400 mx-auto transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

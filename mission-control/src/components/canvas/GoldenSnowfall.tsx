'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const GoldenSnowfall = ({ count = 500 }) => {
  const points = useRef<THREE.Points>(null);

  // Initialize random positions and velocities only once
  const [{ positions, velocities }] = React.useState(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = -0.01 - Math.random() * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions: pos, velocities: vel };
  });

  useFrame(() => {
    if (!points.current) return;
    
    const attr = points.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
        // Update Y position
        attr.setY(i, attr.getY(i) + velocities[i * 3 + 1]);
        // Update X/Z drift
        attr.setX(i, attr.getX(i) + velocities[i * 3]);
        attr.setZ(i, attr.getZ(i) + velocities[i * 3 + 2]);

        // Reset particle if it falls below -7 (roughly out of view)
        if (attr.getY(i) < -7) {
            attr.setY(i, 7);
            attr.setX(i, (Math.random() - 0.5) * 15);
        }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#d4af37"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
};

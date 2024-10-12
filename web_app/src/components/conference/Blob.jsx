import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { useSpring } from 'react-spring/three';
import { MeshStandardMaterial, SphereBufferGeometry } from 'three';

const Blob = () => {
  const mesh = useRef();

  const { scale } = useSpring({
    from: { scale: [1, 1, 1] },
    to: { scale: [1.5, 1.5, 1.5] },
    loop: { reverse: true },
    config: { duration: 2000 },
  });

  useFrame(() => {
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={mesh} scale={scale}>
      <SphereBufferGeometry args={[1, 64, 64]} />
      <MeshStandardMaterial color="pink" />
    </mesh>
  );
};

export default Blob;

import React, { useEffect, useRef } from "react";
import * as THREE from 'three';
const Blob = () => {
  const containerRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    camera.position.set(0, 0, 5);

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;// Make the background transparent

      renderer.render(scene, camera);
      
    };

    animate();

    return () => {
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} />;
};

export default Blob;

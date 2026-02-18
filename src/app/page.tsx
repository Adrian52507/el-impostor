"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Text } from "@react-three/drei";
import { useRef, useState, useEffect, useCallback } from "react";
import { Mesh, Group } from "three";
import { DoubleSide } from "three";

function Cube() {
  const groupRef = useRef<Group>(null!);
  const textRef = useRef<any>(null);

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [exploding, setExploding] = useState(false);
  const [showText, setShowText] = useState(false);

  const speed = useRef({
    x: 0.02 + Math.random() * 0.04,
    y: 0.02 + Math.random() * 0.04,
  });

  const baseSpeed = useRef({ x: 0.03, y: 0.035 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioPlayed = useRef(false);
  const textAnimationRef = useRef(0);
  const redSweepRef = useRef(0); // NEW: Left-to-right red sweep

  // Store explosion data for each face
  const faceDataRef = useRef<any[]>([
    { velocity: [0, 0, 1], spinX: 0, spinY: 0, spinZ: 0, time: 0 },
    { velocity: [0, 0, -1], spinX: 0, spinY: 0, spinZ: 0, time: 0 },
    { velocity: [1, 0, 0], spinX: 0, spinY: 0, spinZ: 0, time: 0 },
    { velocity: [-1, 0, 0], spinX: 0, spinY: 0, spinZ: 0, time: 0 },
    { velocity: [0, 1, 0], spinX: 0, spinY: 0, spinZ: 0, time: 0 },
    { velocity: [0, -1, 0], spinX: 0, spinY: 0, spinZ: 0, time: 0 },
  ]);

  // Preload audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/reveal.mp3");
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.8;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!clicked) {
      setClicked(true);
      setTimeout(() => {
        if (audioRef.current && !audioPlayed.current) {
          audioRef.current.play().catch(console.error);
          audioPlayed.current = true;
        }
      }, 1400);
    }
  }, [clicked]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Normal rotation when not clicked
    if (!clicked) {
      if (hovered) {
        speed.current.x += (0 - speed.current.x) * 0.08;
        speed.current.y += (0 - speed.current.y) * 0.08;
      } else {
        speed.current.x += (baseSpeed.current.x - speed.current.x) * 0.05;
        speed.current.y += (baseSpeed.current.y - speed.current.y) * 0.05;
      }
      groupRef.current.rotation.x += speed.current.x;
      groupRef.current.rotation.y += speed.current.y;
    }

    // Slow down after click
    if (clicked && !exploding) {
      speed.current.x *= 0.95;
      speed.current.y *= 0.95;
      groupRef.current.rotation.x += speed.current.x;
      groupRef.current.rotation.y += speed.current.y;

      if (Math.abs(speed.current.x) < 0.001 && Math.abs(speed.current.y) < 0.001) {
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.y = 0;
        setExploding(true);
        textAnimationRef.current = 0;
        redSweepRef.current = 0; // Reset sweep

        // Initialize random spins for each face
        faceDataRef.current.forEach((face) => {
          face.spinX = (Math.random() - 0.5) * 20;
          face.spinY = (Math.random() - 0.5) * 20;
          face.spinZ = (Math.random() - 0.5) * 15;
          face.velocity = [
            face.velocity[0] + (Math.random() - 0.5) * 0.3,
            face.velocity[1] + (Math.random() - 0.5) * 0.3,
            face.velocity[2] + (Math.random() - 0.5) * 0.3
          ];
        });
      }
    }

    // EXPLOSION ANIMATION
    if (exploding) {
      // Animate faces
      groupRef.current.children.forEach((child: any, index) => {
        if (!child || index >= 6) return;
        
        const faceData = faceDataRef.current[index];
        faceData.time += delta;

        // Move outward with velocity
        const speed = 4 + index * 0.5;
        child.position.x += faceData.velocity[0] * speed * delta;
        child.position.y += faceData.velocity[1] * speed * delta;
        child.position.z += faceData.velocity[2] * speed * delta;

        // Chaotic rotation
        child.rotation.x += faceData.spinX * delta;
        child.rotation.y += faceData.spinY * delta;
        child.rotation.z += faceData.spinZ * delta;

        // Scale down
        const scale = Math.max(0.05, 1 - faceData.time * 2);
        child.scale.setScalar(scale);

        // Fade out materials
        child.children.forEach((mesh: any) => {
          if (mesh.material) {
            mesh.material.transparent = true;
            mesh.material.opacity = Math.max(0, 1 - faceData.time * 1.5);
          }
        });
      });

      // SHOW TEXT 0.8s AFTER EXPLOSION STARTS
      if (faceDataRef.current[0].time > 0.8 && !showText) {
        setShowText(true);
      }
    }

    // TEXT ANIMATION - Normal fade/scale first, THEN red sweep
    if (exploding && textRef.current) {
      textAnimationRef.current += delta;
      const textProgress = Math.min(textAnimationRef.current * 4, 1);
      const eased = 1 - Math.pow(1 - textProgress, 3);
      
      // 🔥 RED SWEEP starts AFTER text is fully sized (textProgress > 0.95)
      let color = "white";
      let extraScale = 1;
      
      if (textProgress > 0.95) { // Wait for normal animation to complete
        redSweepRef.current += delta * 3; // Fast sweep speed
        const sweepProgress = Math.min(redSweepRef.current, 1); // 0 to 1
        
        if (sweepProgress < 1) {
          // LEFT-TO-RIGHT RED SWEEP effect
          const sweepPeak = Math.sin(sweepProgress * Math.PI);
          color = `hsl(0, ${100 * sweepPeak}%, 50%)`; // Pure RED sweep
          extraScale = 1 + sweepPeak * 0.3; // Pulse growth
        }
      }
      
      const mat = textRef.current.material as any;
      mat.opacity = eased;
      mat.color.set(color);
      
      const scale = (0.2 + 0.8 * eased) * extraScale;
      textRef.current.scale.set(scale, scale, scale);
      textRef.current.position.z = -4 + 2 * eased;
    }
  });

  const Face = ({ position, rotation, index }: any) => (
    <group position={position}>
      <mesh rotation={rotation}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffffff" side={DoubleSide} />
        <Edges scale={1.01} threshold={15} color="black" />
      </mesh>
    </group>
  );

  return (
    <>
      <group
        ref={groupRef}
        scale={0.5}
        onPointerOver={() => !clicked && setHovered(true)}
        onPointerOut={() => !clicked && setHovered(false)}
        onClick={handleClick}
      >
        <Face index={0} position={[0, 0, 0.5]} rotation={[0, 0, 0]} />
        <Face index={1} position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]} />
        <Face index={2} position={[0.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <Face index={3} position={[-0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        <Face index={4} position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        <Face index={5} position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} />
      </group>

      {showText && (
        <Text
          ref={textRef}
          position={[0, 0, -4]}
          fontSize={0.7}
          color="white"
          anchorX="center"
          anchorY="middle"
          scale={[0.2, 0.2, 0.2]}
        >
          😈
        </Text>
      )}
    </>
  );
}

export default function Home() {
  return (
    <main className="w-full h-screen bg-black flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <Cube />
      </Canvas>
    </main>
  );
}

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import { Mesh, Group } from "three";
import { DoubleSide } from "three";


function Cube() {
  const groupRef = useRef<Group>(null!);

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [exploding, setExploding] = useState(false);
  const [showText, setShowText] = useState(false);

  const speed = useRef({
    x: 0.02 + Math.random() * 0.04,
    y: 0.02 + Math.random() * 0.04,
  });

  const textRef = useRef<any>(null);
  const textOpacity = useRef(0);
  const textReady = useRef(false);



  useFrame(() => {
    if (!groupRef.current) return;

    // Hover detiene temporalmente
    if (hovered && !clicked) {
      speed.current.x *= 0.92;
      speed.current.y *= 0.92;
    }

    if (!hovered && !clicked) {
      speed.current.x += (0.02 - speed.current.x) * 0.02;
      speed.current.y += (0.02 - speed.current.y) * 0.02;
    }

    if (!clicked) {
      groupRef.current.rotation.x += speed.current.x;
      groupRef.current.rotation.y += speed.current.y;
    }

    // CLICK → detener definitivo
    if (clicked && !exploding) {
      speed.current.x *= 0.9;
      speed.current.y *= 0.9;

      groupRef.current.rotation.x += speed.current.x;
      groupRef.current.rotation.y += speed.current.y;

      if (
        Math.abs(speed.current.x) < 0.001 &&
        Math.abs(speed.current.y) < 0.001
      ) {
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.y = 0;
        setExploding(true);

        // 👇 AGREGA ESTO
        setTimeout(() => {
          textOpacity.current = 0;
          textReady.current = false;
          setShowText(true);
        }, 800);

      }
    }


    // EXPLOSIÓN REAL
    if (exploding) {
      groupRef.current.children.forEach((face, i) => {
        const direction = [
          [0, 0, 1],
          [0, 0, -1],
          [1, 0, 0],
          [-1, 0, 0],
          [0, 1, 0],
          [0, -1, 0],
        ][i];

        if (!direction) return;

        face.position.x += direction[0] * 0.2;
        face.position.y += direction[1] * 0.2;
        face.position.z += direction[2] * 0.2;

        face.rotation.x += 0.1;
        face.rotation.y += 0.1;
      });

      // Fade-in + animación suave del texto (SIN state)
      if (showText && textRef.current) {
        const mat: any = textRef.current.material;

        // inicializar una sola vez
        if (!textReady.current) {
          mat.transparent = true;
          mat.opacity = 0;
          textRef.current.scale.set(0.2, 0.2, 0.2);
          textRef.current.position.z = -2;
          textReady.current = true;
        }

        // subir opacidad
        textOpacity.current = Math.min(textOpacity.current + 0.03, 1);
        mat.opacity = textOpacity.current;

        // escala suave
        textRef.current.scale.x += (1 - textRef.current.scale.x) * 0.08;
        textRef.current.scale.y += (1 - textRef.current.scale.y) * 0.08;
        textRef.current.scale.z += (1 - textRef.current.scale.z) * 0.08;

        // mover hacia delante
        textRef.current.position.z += (0 - textRef.current.position.z) * 0.08;
      }



    }
  });

  const Face = ({ position, rotation }: any) => (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ffffff" side={DoubleSide} />
      <Edges scale={1.01} threshold={15} color="black" />
    </mesh>
  );

  return (
    <>
      {!showText && (
        <group
          ref={groupRef}
          scale={0.5}
          onPointerOver={() => !clicked && setHovered(true)}
          onPointerOut={() => !clicked && setHovered(false)}
          onClick={() => !clicked && setClicked(true)}
        >
          <Face position={[0, 0, 0.5]} rotation={[0, 0, 0]} />
          <Face position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]} />
          <Face position={[0.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
          <Face position={[-0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Face position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
          <Face position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
      )}

      {showText && (
        <Text
          ref={textRef}
          position={[0, 0, -2]}
          fontSize={2.5}
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

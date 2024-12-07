"use client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Line,
  Sphere,
  Text,
  useGLTF,
  useTexture,
  useHelper,
} from "@react-three/drei";
import { useControls } from "leva";
import { Group, Mesh } from "three";

interface OrbitRingProps {
  radius: number;
  color: string;
  label: string;
  initialOffset: number;
  texturePath: string;
  globalHovered: boolean;
  setGlobalHovered: (state: boolean) => void;
}
function OrbitRing({
  radius,
  color,
  label,
  initialOffset,
  texturePath,
  globalHovered,
  setGlobalHovered,
}: OrbitRingProps) {
  const points: [number, number, number][] = [];
  const sphereRef = useRef<Mesh>(null);
  const labelRef = useRef<Mesh>();
  const texture = useTexture(texturePath);
  // const [hovered, setHovered] = useState(false);

  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    points.push([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
  }

  useFrame(({ clock }) => {
    // const elapsed = clock.getElapsedTime() * 0.2;
    // const angle = (elapsed + initialOffset) % (Math.PI * 2);
    // const x = Math.cos(angle) * radius;
    // const y = Math.sin(angle) * radius;

    if (!globalHovered) {
      const elapsed = clock.getElapsedTime() * 0.2;
      const angle = (elapsed + initialOffset) % (Math.PI * 2);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (sphereRef.current) {
        sphereRef.current.position.set(x, y, 0);
      }

      if (labelRef.current) {
        labelRef.current.position.set(x, y + 0.8, 0);
      }
    } else {
      // Stop sphere movement
      if (sphereRef.current && labelRef.current) {
        const spherePosition = sphereRef.current.position;
        labelRef.current.position.set(
          spherePosition.x,
          spherePosition.y + 0.8,
          spherePosition.z
        );
      }
    }

    // if (sphereRef.current) {
    //   sphereRef.current.position.set(x, y, 0);
    // }

    // if (labelRef.current) {
    //   labelRef.current.position.set(x, y + 0.8, 0);
    // }
  });
  const textRef = useRef();

  const {
    textRotationX,
    textRotationY,
    textRotationZ,
    textPositionX,
    textPositionY,
    textPositionZ,
  } = useControls({
    rotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    positionX: { value: 0, min: -10, max: 10, step: 0.1 },
    positionY: { value: 0, min: -10, max: 10, step: 0.1 },
    positionZ: { value: 0, min: -10, max: 10, step: 0.1 },
    textPositionX: { value: 0, min: -10, max: 10, step: 0.1 },
    textPositionY: { value: 0, min: -10, max: 10, step: 0.1 },
    textPositionZ: { value: 0, min: -10, max: 10, step: 0.1 },
    textRotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    textRotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    textRotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
  });

  return (
    <group>
      <Line points={points} color={color} lineWidth={1} dashed={false} />

      <Sphere
        ref={sphereRef}
        scale={0.4}
        args={[0.5, 32, 32]}
        // onPointerOver={() => setHovered(true)}
        // onPointerOut={() => setHovered(false)}
        onPointerOver={() => setGlobalHovered(true)}
        onPointerOut={() => setGlobalHovered(false)}
      >
        <meshStandardMaterial map={texture} />
      </Sphere>

      <Text
        ref={labelRef}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        position={[textPositionY, 40, textPositionZ]}
        rotation={[4.45, 6.28, 6.28]}
      >
        {label}
      </Text>
    </group>
  );
}

function CentralModel() {
  const { scene } = useGLTF("/3Dlogo.gltf");
  const logoRef = useRef<Mesh>();
  const [mouse, setMouse] = useState({ x: -2, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.7) * 5;
      const y = -(e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.addEventListener("mousemove", handleMouseMove);
  }, []);
  useFrame(() => {
    if (logoRef.current) {
      const { x, y } = mouse;
      logoRef.current.rotation.x = y * 0.2;
      logoRef.current.rotation.y = x * 0.2;
    }
  });
  const {
    rotationModelX,
    rotationModelY,
    rotationModelZ,
    positionX,
    positionY,
    positionZ,
  } = useControls({
    rotationModelX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationModelY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationModelZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    positionX: { value: 0, min: -10, max: 10, step: 0.1 },
    positionY: { value: 0, min: -10, max: 10, step: 0.1 },
    positionZ: { value: 0, min: -10, max: 10, step: 0.1 },
  });

  return (
    <primitive
      ref={logoRef}
      object={scene}
      scale={60}
      rotation={[rotationModelX, -2.71, rotationModelZ]}
      // rotation={[rotationModelX, rotationModelY, rotationModelZ]}
      // Enable shadow casting
      // Enable casting shadow from model

      receiveShadow
    />
  );
}

export default function Home() {
  const groupRef = useRef<Group>(null);
  // const directionalLightHelper = useRef();
  // useHelper(directionalLightHelper, directionalLightHelper, "white");

  const {
    rotationX,
    rotationY,
    rotationZ,
    positionX,
    positionY,
    positionZ,
    lightPositionX,
    lightPositionY,
    lightPositionZ,
  } = useControls({
    rotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    positionX: { value: 0, min: -10, max: 10, step: 0.1 },
    positionY: { value: 0, min: -10, max: 10, step: 0.1 },
    positionZ: { value: 0, min: -10, max: 10, step: 0.1 },
    lightPositionX: { value: 0, min: -10, max: 10, step: 0.1 },
    lightPositionY: { value: 0, min: -10, max: 10, step: 0.1 },
    lightPositionZ: { value: 0, min: -10, max: 10, step: 0.1 },
  });

  const triangleOffsets = [0, (2 / 3) * Math.PI, (4 / 3) * Math.PI];
  const labels = ["Efficiency", "Reliability", "Creativity"];
  const textures = [
    "/textures/texture1.png",
    "/textures/texture2.jpg",
    "/textures/texture3.jpg",
  ];
  const [globalHovered, setGlobalHovered] = useState(false);
  return (
    <div className="bg-black w-screen h-screen">
      <Canvas camera={{ position: [-3, 2, 18], fov: 50 }} shadows={"soft"}>
        <directionalLight
          position={[5.9, 6.8, -3.7]}
          // position={[10, 4.3, 0.9]}
          intensity={2}
          // castShadow={true}
          castShadow={true}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          // ref={directionalLightHelper}
        />
        <ambientLight intensity={0.8} />

        <group
          ref={groupRef}
          rotation={[1.73, 0.79, rotationZ]}
          // rotation={[1.78, 0.82, rotationZ]}
          position={[positionX, 0.6, positionZ]}
        >
          {triangleOffsets.map((offset, index) => (
            <OrbitRing
              key={index}
              radius={5 + index * 0.6}
              color={"white"}
              label={labels[index]}
              initialOffset={offset}
              texturePath={textures[index]}
              globalHovered={globalHovered}
              setGlobalHovered={setGlobalHovered}
            />
          ))}
        </group>

        <CentralModel />

        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3Dlogo.gltf");

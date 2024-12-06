"use client";
import React, { useRef } from "react";
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
}
function OrbitRing({
  radius,
  color,
  label,
  initialOffset,
  texturePath,
}: OrbitRingProps) {
  const points: [number, number, number][] = [];
  const sphereRef = useRef<Mesh>(null);
  const labelRef = useRef<Mesh>();
  const texture = useTexture(texturePath);

  // Generate circular points for the orbit
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2; // Full circle
    points.push([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
  }

  // UseFrame for animation
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() * 0.2; // Get time since start
    const angle = (elapsed + initialOffset) % (Math.PI * 2); // Ensure the angle loops with an offset
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Update Sphere's position
    if (sphereRef.current) {
      sphereRef.current.position.set(x, y, 0);
    }

    // Update label's position (slightly above the Sphere)
    if (labelRef.current) {
      labelRef.current.position.set(x, y + 0.8, 0);
    }
  });
  const textRef = useRef();

  // Leva controls for group rotation and position
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
      {/* Orbit Line */}
      <Line
        points={points} // Circular points
        color={color} // Orbit color
        lineWidth={1} // Thickness
        dashed={false} // Optional: set true for dashed lines
      />

      {/* Sphere */}

      <Sphere ref={sphereRef} scale={0.4} args={[0.5, 32, 32]}>
        <meshStandardMaterial map={texture} />
      </Sphere>

      {/* Label */}
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
  const logoRef = useRef();

  // Leva controls for group rotation and position
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
      rotation={[rotationModelX, 2.71, rotationModelZ]}
      // rotation={[rotationModelX, rotationModelY, rotationModelZ]}
      // Enable shadow casting
      castShadow={true} // Enable casting shadow from model
      receiveShadow={true}
    />
  );
}

export default function Home() {
  const groupRef = useRef<Group>(null);
  // const directionalLightHelper = useRef();
  // useHelper(directionalLightHelper, directionalLightHelper, "white");
  // Leva controls for group rotation and position
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

  return (
    <div className="bg-black w-screen h-screen">
      <Canvas camera={{ position: [-3, 2, 18], fov: 50 }} shadows>
        <directionalLight
          position={[10, 4.3, 0.9]}
          intensity={1}

          // ref={directionalLightHelper}
        />
        <ambientLight intensity={1} castShadow={true} />

        <group
          ref={groupRef}
          rotation={[1.78, 0.82, rotationZ]}
          position={[positionX, positionY, positionZ]}
        >
          {triangleOffsets.map((offset, index) => (
            <OrbitRing
              key={index}
              radius={5 + index * 0.6}
              color={"white"}
              label={labels[index]}
              initialOffset={offset}
              texturePath={textures[index]}
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

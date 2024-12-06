"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Line,
  Sphere,
  Text,
  Box,
  useGLTF,
  useHelper,
} from "@react-three/drei";
import { useControls } from "leva";
import { DirectionalLightHelper } from "three";

function OrbitRing({ radius, color, label, initialOffset }) {
  const points = [];
  const sphereRef = useRef();
  const labelRef = useRef();

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

  return (
    <group>
      {/* Orbit Line */}
      <Line
        points={points} // Circular points
        color={color} // Orbit color
        lineWidth={2} // Thickness
        dashed={false} // Optional: set true for dashed lines
      />

      {/* Sphere */}
      <Sphere ref={sphereRef} scale={0.6} args={[0.5, 32, 32]}>
        <meshStandardMaterial color={color} />
      </Sphere>

      {/* Label */}
      <Text
        ref={labelRef}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
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
      rotation={[rotationModelX, rotationModelY, rotationModelZ]}
      position={[0, 0, 0]}
    />
  );
}

export default function Home() {
  const groupRef = useRef();

  // Leva controls for group rotation and position
  const { rotationX, rotationY, rotationZ, positionX, positionY, positionZ } =
    useControls({
      rotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      rotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      positionX: { value: 0, min: -10, max: 10, step: 0.1 },
      positionY: { value: 0, min: -10, max: 10, step: 0.1 },
      positionZ: { value: 0, min: -10, max: 10, step: 0.1 },
    });

  const triangleOffsets = [0, (2 / 3) * Math.PI, (4 / 3) * Math.PI];
  const labels = ["Efficiency", "Reliability", "Creativity"];
  const directionalLightRef = useRef();
  // useHelper(directionalLightRef, DirectionalLightHelper);
  return (
    <div className="bg-black w-screen h-screen">
      <Canvas camera={{ position: [0, 0, 15], fov: 100 }}>
        {/* Lights */}
        <directionalLight
          ref={directionalLightRef}
          position={[2, 4, 5]}
          intensity={1}
        />
        <ambientLight intensity={0.5} />

        {/* Orbit Rings Group */}
        <group
          ref={groupRef}
          rotation={[rotationX, rotationY, rotationZ]}
          position={[positionX, positionY, positionZ]}
        >
          {triangleOffsets.map((offset, index) => (
            <OrbitRing
              key={index}
              radius={5 + index * 2}
              color={["white", "white", "white"][index]}
              label={labels[index]}
              initialOffset={offset}
            />
          ))}
        </group>

        {/* Central Model */}
        <CentralModel />

        {/* Controls */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
useGLTF.preload("/3Dlogo.gltf");

"use client";
import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Line, OrbitControls, Text, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { Mesh, TextureLoader } from "three";

// Generate points for the orbital line
const generatePoints = (radius: number) => {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    points.push([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
  }
  return points;
};

const OrbitalScene = ({
  radius,
  speed,
  offset,
  paused,
  setPaused,
  label,
  texture, // Added texture prop
}: {
  radius: number;
  speed: number;
  offset: number;
  paused: boolean;
  setPaused: (state: boolean) => void;
  label: string;
  texture: string; // Texture URL
}) => {
  // Animate the angle around the orbit
  const { angle } = useSpring({
    from: { angle: offset },
    to: { angle: Math.PI * 2 + offset },
    loop: true,
    pause: paused,
    config: { duration: speed },
  });

  const points = generatePoints(radius);

  const handlePointerEnter = () => {
    setPaused(true);
  };

  const handlePointerLeave = () => {
    setPaused(false);
  };

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

  const loadedTexture = useLoader(TextureLoader, texture); // Load texture

  return (
    <group
      rotation={[1.73, 0.79, 0]}
      // rotation={[1.78, 0.82, rotationZ]}
      position={[0, 0.6, 0]}
    >
      {/* Orbital line */}
      <Line points={points} color="white" lineWidth={1} />

      {/* Animated sphere with texture */}
      <animated.mesh
        position={angle.to((a) => [
          Math.cos(a) * radius, // Sphere x-coordinate
          Math.sin(a) * radius, // Sphere y-coordinate
          0, // Sphere z-coordinate
        ])}
        scale={0.3}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial map={loadedTexture} /> {/* Apply texture */}
      </animated.mesh>

      {/* Animated text */}
      <animated.mesh
        position={angle.to((a) => [
          Math.cos(a) * radius, // Text x-coordinate
          Math.sin(a) * radius + 1.5, // Slightly above the sphere
          0, // Text z-coordinate
        ])}
      >
        <Text
          rotation={[4.29, textRotationY, -0.8]}
          position={[textPositionX, textPositionY, textPositionZ]}
          //   rotation={[4.44, textRotationY, textRotationZ]}
          //   position={[textPositionX, -0.9, -0.9]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </animated.mesh>
    </group>
  );
};
// const OrbitalScene = ({
//   radius,
//   speed,
//   offset,
//   paused,
//   setPaused,
//   label,
//   texture,
// }: {
//   radius: number;
//   speed: number;
//   offset: number;
//   paused: boolean;
//   setPaused: (state: boolean) => void;
//   label: string;
//   texture: string;
// }) => {
//   // Animate the angle around the orbit
//   const { angle } = useSpring({
//     from: { angle: offset },
//     to: { angle: Math.PI * 2 + offset },
//     loop: true,
//     pause: paused,
//     config: { duration: speed },
//   });

//   const points = generatePoints(radius);

//   const handlePointerEnter = () => {
//     setPaused(true);
//   };

//   const handlePointerLeave = () => {
//     setPaused(false);
//   };

//   const loadedTexture = useLoader(TextureLoader, texture); // Load texture

//   return (
//     <group rotation={[1.73, 0.79, 0]} position={[0, 0.6, 0]}>
//       {/* Orbital line */}
//       <Line points={points} color="white" lineWidth={1} />

//       {/* Animated sphere with texture */}
//       <animated.mesh
//         position={angle.to((a) => [
//           Math.cos(a) * radius, // Sphere x-coordinate
//           Math.sin(a) * radius, // Sphere y-coordinate
//           0, // Sphere z-coordinate
//         ])}
//         scale={0.3}
//         onPointerEnter={handlePointerEnter}
//         onPointerLeave={handlePointerLeave}
//       >
//         <sphereGeometry args={[0.7, 32, 32]} />
//         <meshStandardMaterial map={loadedTexture} /> {/* Apply texture */}
//       </animated.mesh>

//       {/* Animated text */}
//       <animated.mesh
//         position={angle.to((a) => [
//           Math.cos(a) * radius, // Text x-coordinate
//           Math.sin(a) * radius + Math.sin(a) * 0.5, // Dynamic offset along Y-axis
//           Math.cos(a) * 0.5, // Dynamic offset along Z-axis
//         ])}
//       >
//         <Text
//           rotation={[4.29, 0, 0]} // You can adjust these rotation values as needed
//           fontSize={0.3}
//           color="white"
//           anchorX="center"
//           anchorY="middle"
//         >
//           {label}
//         </Text>
//       </animated.mesh>
//     </group>
//   );
// };

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

  const springProps = useSpring<{ rotation: [number, number, number] }>({
    rotation: [0, mouse.x * 0.2, 0],
    config: { tension: 170, friction: 26 },
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
    //@ts-expect-error
    <animated.primitive
      ref={logoRef}
      object={scene}
      scale={60}
      rotation={springProps.rotation}
      position={[positionX, positionY, positionZ]}
      receiveShadow
    />
  );
}
export default function Page() {
  const [paused, setPaused] = useState(false);
  const triangleOffsets = [0, (2 / 3) * Math.PI, (4 / 3) * Math.PI];
  const labels = ["Efficiency", "Reliability", "Creativity"];
  const textures = [
    "/textures/texture1.png",
    "/textures/texture2.jpg",
    "/textures/texture3.jpg",
  ];

  return (
    <div className="bg-black h-screen">
      <Canvas camera={{ position: [-3, 2, 17], fov: 50 }} shadows={"soft"}>
        {/* <Canvas camera={{ position: [-3, 2, 17], fov: 50 }} shadows={"soft"}> */}
        <directionalLight
          position={[5.9, 6.8, -3.7]}
          // position={[10, 4.3, 0.9]}
          intensity={5}
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

        {/* Orbital Scenes with textures */}
        {triangleOffsets.map((offset, index) => (
          <OrbitalScene
            key={index}
            radius={5 + index * 0.6}
            speed={13000}
            offset={offset}
            paused={paused}
            setPaused={setPaused}
            label={labels[index]}
            texture={textures[index]} // Pass texture URL
          />
        ))}
        <CentralModel />
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
useGLTF.preload("/3Dlogo.gltf");

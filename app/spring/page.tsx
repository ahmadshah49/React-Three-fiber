"use client";
import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  ContactShadows,
  Line,
  OrbitControls,
  Text,
  useGLTF,
  useHelper,
} from "@react-three/drei";
import { useControls } from "leva";
import {
  DirectionalLightHelper,
  HemisphereLightHelper,
  Mesh,
  PointLightHelper,
  TextureLoader,
} from "three";

const generatePoints = (radius: number) => {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= 1000; i++) {
    const angle = (i / 1000) * Math.PI * 2;
    points.push([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
  }
  return points;
};

// const OrbitalScene = ({
//   radius,
//   speed,
//   offset,
//   paused,
//   setPaused,
//   label,
//   texture, // Added texture prop
// }: {
//   radius: number;
//   speed: number;
//   offset: number;
//   paused: boolean;
//   setPaused: (state: boolean) => void;
//   label: string;
//   texture: string;
// }) => {
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

//   const {
//     textRotationX,
//     textRotationY,
//     textRotationZ,
//     textPositionX,
//     textPositionY,
//     textPositionZ,
//   } = useControls({
//     rotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
//     rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
//     rotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
//     positionX: { value: 0, min: -10, max: 10, step: 0.1 },
//     positionY: { value: 0, min: -10, max: 10, step: 0.1 },
//     positionZ: { value: 0, min: -10, max: 10, step: 0.1 },
//     textPositionX: { value: 0, min: -10, max: 10, step: 0.1 },
//     textPositionY: { value: 0, min: -10, max: 10, step: 0.1 },
//     textPositionZ: { value: 0, min: -10, max: 10, step: 0.1 },
//     textRotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
//     textRotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
//     textRotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
//   });

//   const loadedTexture = useLoader(TextureLoader, texture);

//   return (
//     <group
//       rotation={[1.73, 0.79, 0]}
//       // rotation={[1.78, 0.82, rotationZ]}
//       position={[0, 0.6, 0]}
//     >
//       {/* Orbital line */}
//       <Line points={points} color="white" lineWidth={1} />

//       <animated.mesh
//         position={angle.to((a) => [
//           Math.cos(a) * radius,
//           Math.sin(a) * radius,
//           0,
//         ])}
//         scale={0.3}
//         onPointerEnter={handlePointerEnter}
//         onPointerLeave={handlePointerLeave}
//       >
//         <sphereGeometry args={[0.7, 32, 32]} />
//         <meshStandardMaterial map={loadedTexture} />
//       </animated.mesh>

//       <animated.mesh
//         position={angle.to((a) => [
//           Math.cos(a) * radius,
//           Math.sin(a) * radius + 1.5,
//           0,
//         ])}
//       >
//         <Text
//           rotation={[4.29, textRotationY, -0.8]}
//           position={[textPositionX, textPositionY, textPositionZ]}
//           //   rotation={[4.44, textRotationY, textRotationZ]}
//           //   position={[textPositionX, -0.9, -0.9]}
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
const OrbitalScene = ({
  radius,
  speed,
  offset,
  paused,
  setPaused,
  label,
  texture,
}: {
  radius: number;
  speed: number;
  offset: number;
  paused: boolean;
  setPaused: (state: boolean) => void;
  label: string;
  texture: string;
}) => {
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

  const loadedTexture = useLoader(TextureLoader, texture);

  return (
    <group rotation={[1.73, 0.79, 0]} position={[0, 0.6, 0]}>
      <Line castShadow points={points} color="white" lineWidth={1} />

      <animated.mesh
        castShadow
        position={angle.to((a) => [
          Math.cos(a) * radius,
          Math.sin(a) * radius,
          0,
        ])}
        scale={0.3}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial map={loadedTexture} />
      </animated.mesh>

      <animated.mesh
        castShadow
        position={angle.to((a) => [
          Math.cos(a) * radius,
          Math.sin(a) * radius + Math.sin(a) * 0.5,
          Math.cos(a) * 0.5,
        ])}
      >
        <Text
          rotation={[4.29, 0, -0.8]}
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

function CentralModel() {
  const { scene } = useGLTF("/3Dlogo.gltf");
  const logoRef = useRef<Mesh>();
  const [mouse, setMouse] = useState({ x: -2, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.7) * 5;
      const y = -(e.clientY / window.innerHeight - 0.6) * 5;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.addEventListener("mousemove", handleMouseMove);
  }, []);

  const springProps = useSpring<{ rotation: [number, number, number] }>({
    rotation: [-mouse.y * 0.08, mouse.x * 0.2, 0],
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
      receiveShadow={true}
      castShadow={true}
    />
  );
}
function Scene() {
  const [paused, setPaused] = useState(false);
  const triangleOffsets = [0, (2 / 3) * Math.PI, (4 / 3) * Math.PI];
  const labels = ["Efficiency", "Reliability", "Creativity"];
  const textures = [
    "/textures/texture1.png",
    "/textures/texture2.jpg",
    "/textures/texture3.jpg",
  ];
  const directionalLightRef = useRef();
  // useHelper(directionalLightRef, DirectionalLightHelper);

  return (
    <>
      {/* <Canvas camera={{ position: [-3, 2, 17], fov: 50 }} shadows={"soft"}> */}
      <directionalLight
        position={[5.9, 6.8, -3.7]}
        intensity={5}
        castShadow
        // ref={directionalLightRef}
      />
      {/* <directionalLight
        position={[5.9, 6.8, -3.7]}
        intensity={5}
        castShadow
        ref={directionalLightRef}
      /> */}
      <ambientLight intensity={0.8} />
      {/* <hemisphereLight
        position={[5.9, 6.8, -3.7]}
        intensity={0.5}
        castShadow
        ref={directionalLightRef2}
      /> */}
      {triangleOffsets.map((offset, index) => (
        <OrbitalScene
          key={index}
          radius={5 + index * 0.6}
          speed={18000}
          offset={offset}
          paused={paused}
          setPaused={setPaused}
          label={labels[index]}
          texture={textures[index]}
        />
      ))}

      <CentralModel />
    </>
  );
}
export default function Page() {
  // const [paused, setPaused] = useState(false);
  // const triangleOffsets = [0, (2 / 3) * Math.PI, (4 / 3) * Math.PI];
  // const labels = ["Efficiency", "Reliability", "Creativity"];
  // const textures = [
  //   "/textures/texture1.png",
  //   "/textures/texture2.jpg",
  //   "/textures/texture3.jpg",
  // ];
  // const directionalLightRef = useRef();
  // useHelper(directionalLightRef, DirectionalLightHelper);
  return (
    <div className="bg-black h-screen">
      <Canvas camera={{ position: [-3, 2, 17], fov: 50 }}>
        {/* <Canvas camera={{ position: [-3, 2, 17], fov: 50 }} shadows={"soft"}> */}
        {/* <directionalLight
          position={[5.9, 6.8, -3.7]}
          intensity={5}
          castShadow
          ref={directionalLightRef}
        />
        <ambientLight intensity={0.8} />

        {triangleOffsets.map((offset, index) => (
          <OrbitalScene
            key={index}
            radius={5 + index * 0.6}
            speed={18000}
            offset={offset}
            paused={paused}
            setPaused={setPaused}
            label={labels[index]}
            texture={textures[index]}
          />
        ))}

        <CentralModel /> */}
        <Scene />
      </Canvas>
    </div>
  );
}
useGLTF.preload("/3Dlogo.gltf");

"use client";
import { animated, useSpring } from "@react-spring/three";
import { Line, Text, useGLTF } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Mesh, TextureLoader } from "three";

const generatePoints = (radius: number) => {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= 1000; i++) {
    const angle = (i / 1000) * Math.PI * 2;
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

  return (
    //@ts-expect-error
    <animated.primitive
      ref={logoRef}
      object={scene}
      scale={60}
      rotation={springProps.rotation}
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

  return (
    <>
      <directionalLight position={[5.9, 6.8, -3.7]} intensity={5} />
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

      <CentralModel />
    </>
  );
}
export default function Page() {
  return (
    <div className="bg-[#130D29] w-full h-screen flex justify-between ">
      <span className=" absolute left-[25%] top-[10%] w-fit animate-bounceY">
        <Image
          src={"/pictures/mirror1.png"}
          width={1000}
          height={1000}
          alt="Mirror"
          className="w-[154px] h-[172px]"
        />
      </span>
      <Canvas camera={{ position: [-3, 2, 17], fov: 50 }}>
        <Scene />
      </Canvas>
      <span className=" absolute right-[25%] bottom-[30%] w-fit animate-bounceY">
        <Image
          src={"/pictures/mirror2.png"}
          width={1000}
          height={1000}
          alt="Mirror"
          className="w-[115px] h-[125px]"
        />
      </span>
    </div>
  );
}
useGLTF.preload("/3Dlogo.gltf");

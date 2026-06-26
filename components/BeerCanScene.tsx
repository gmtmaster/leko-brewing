"use client";

import { Environment, Float, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type CanPalette = {
  label: string;
  deep: string;
  cream: string;
  accent: string;
  secondary: string;
};

type BeerCanProps = {
  palette: CanPalette;
  scale?: number;
  brand?: boolean;
  beerName?: string;
};

const palettes: CanPalette[] = [
  { label: "#f2b9bd", deep: "#263b2d", cream: "#fff1d0", accent: "#7f2846", secondary: "#d7a56c" },
  { label: "#f7dfad", deep: "#244031", cream: "#fff7df", accent: "#bb7a43", secondary: "#d99aa3" },
  { label: "#efe7d5", deep: "#3f1727", cream: "#fff7df", accent: "#6f8b5a", secondary: "#d7a56c" },
  { label: "#1d1717", deep: "#f7dfad", cream: "#fff7df", accent: "#d99aa3", secondary: "#6f8b5a" }
];

function useCanLabelTexture({ palette, brand, beerName }: { palette: CanPalette; brand?: boolean; beerName?: string }) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, palette.label);
    gradient.addColorStop(0.45, palette.cream);
    gradient.addColorStop(1, palette.secondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.18;
    for (let x = -120; x < canvas.width + 220; x += 84) {
      ctx.fillStyle = palette.deep;
      ctx.fillRect(x, 0, 2, canvas.height);
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = palette.accent;
    ctx.fillRect(0, 0, canvas.width, 92);
    ctx.fillRect(0, canvas.height - 102, canvas.width, 102);

    ctx.strokeStyle = "rgba(255,255,255,0.36)";
    ctx.lineWidth = 2;
    ctx.strokeRect(70, 128, canvas.width - 140, canvas.height - 256);

    ctx.fillStyle = brand ? "rgba(33,52,40,0.18)" : "rgba(33,52,40,0.14)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 120px Georgia, serif";
    ctx.fillText(brand ? "LEKO" : beerName ?? "LEKO", canvas.width / 2, 360);

    ctx.font = brand ? "700 52px Arial, sans-serif" : "700 42px Arial, sans-serif";
    ctx.letterSpacing = "8px";
    ctx.fillText(brand ? "BREWING CO." : "LEKO BREWING CO.", canvas.width / 2, 450);

    if (!brand && beerName) {
      ctx.font = "700 38px Georgia, serif";
      ctx.fillText(beerName.toUpperCase(), canvas.width / 2, 560);
    }

    ctx.strokeStyle = palette.deep;
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(512, 730);
    ctx.bezierCurveTo(510, 680, 502, 648, 470, 615);
    ctx.moveTo(512, 696);
    ctx.bezierCurveTo(454, 662, 400, 658, 354, 688);
    ctx.moveTo(512, 690);
    ctx.bezierCurveTo(570, 644, 634, 632, 704, 664);
    ctx.moveTo(512, 730);
    ctx.lineTo(512, 784);
    ctx.stroke();

    ctx.fillStyle = palette.deep;
    [[382, 676, 56, 34], [642, 652, 64, 36], [476, 618, 42, 26]].forEach(([x, y, rx, ry]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, -0.3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(130, 154, 20, 710);
    ctx.globalAlpha = 0.18;
    ctx.fillRect(820, 160, 48, 660);
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 8;
    return texture;
  }, [palette, brand, beerName]);
}

function useFrontPrintTexture({ palette, brand, beerName }: { palette: CanPalette; brand?: boolean; beerName?: string }) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const ink = brand ? "#1d3328" : palette.deep;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = brand ? "500 176px Arial, sans-serif" : "700 64px Arial, sans-serif";
    ctx.fillText(brand ? "LEKO" : (beerName ?? "LEKO").toUpperCase(), canvas.width / 2, brand ? 245 : 290);

    ctx.font = brand ? "600 56px Arial, sans-serif" : "600 34px Arial, sans-serif";
    ctx.fillText(brand ? "BREWING CO." : "LEKO BREWING CO.", canvas.width / 2, brand ? 350 : 365);

    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    ctx.lineWidth = brand ? 18 : 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 690);
    ctx.lineTo(canvas.width / 2, 820);
    ctx.stroke();
    [
      [canvas.width / 2 - 88, 650, 54, 70, -0.25],
      [canvas.width / 2 + 88, 650, 54, 70, 0.25],
      [canvas.width / 2, 590, 48, 62, 0]
    ].forEach(([x, y, rx, ry, rotation]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 0.72;
    ctx.fillRect(canvas.width / 2 - 180, 900, 360, 10);
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, [palette, brand, beerName]);
}

function PrintedFront({ palette, brand, beerName }: { palette: CanPalette; brand?: boolean; beerName?: string }) {
  const texture = useFrontPrintTexture({ palette, brand, beerName });

  return (
    <mesh position={[0, brand ? -0.04 : 0.02, 0.854]}>
      <planeGeometry args={[brand ? 0.74 : 0.48, brand ? 1.4 : 0.9]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

function CanBodyProfile() {
  return useMemo(() => {
    const points: THREE.Vector2[] = [];
    const h = 4.25;
    const r = 0.82;
    points.push(new THREE.Vector2(0.69, -h / 2));
    points.push(new THREE.Vector2(0.79, -h / 2 + 0.06));
    points.push(new THREE.Vector2(0.84, -h / 2 + 0.18));
    points.push(new THREE.Vector2(r, -h / 2 + 0.38));
    points.push(new THREE.Vector2(r, h / 2 - 0.38));
    points.push(new THREE.Vector2(0.84, h / 2 - 0.18));
    points.push(new THREE.Vector2(0.79, h / 2 - 0.06));
    points.push(new THREE.Vector2(0.69, h / 2));
    return points;
  }, []);
}

function DrinkingOpening() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.25, -0.07);
    s.quadraticCurveTo(-0.25, -0.18, -0.12, -0.2);
    s.lineTo(0.25, -0.15);
    s.quadraticCurveTo(0.38, -0.13, 0.35, 0.02);
    s.lineTo(0.28, 0.16);
    s.quadraticCurveTo(0.24, 0.24, 0.12, 0.22);
    s.lineTo(-0.18, 0.15);
    s.quadraticCurveTo(-0.29, 0.12, -0.27, 0.02);
    s.closePath();
    return s;
  }, []);

  return (
    <mesh position={[0.22, 2.169, -0.08]} rotation={[-Math.PI / 2, 0, -0.22]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color="#211c1a" roughness={0.7} metalness={0.2} />
    </mesh>
  );
}

function Condensation({ radius = 0.833 }: { radius?: number }) {
  const drops = useMemo(
    () =>
      Array.from({ length: 32 }, (_, index) => {
        const angle = -0.95 + ((index * 0.37) % 1.9);
        const y = -1.42 + ((index * 47) % 230) / 100;
        const size = 0.012 + ((index * 13) % 12) / 1000;
        return { angle, y, size };
      }),
    []
  );

  return (
    <group>
      {drops.map((drop) => (
        <mesh
          key={`${drop.angle}-${drop.y}`}
          position={[Math.sin(drop.angle) * radius, drop.y, Math.cos(drop.angle) * radius]}
          rotation={[0, drop.angle, 0]}
        >
          <sphereGeometry args={[drop.size, 12, 8]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.45} roughness={0.05} transmission={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function BeerCan({ palette, scale = 1, brand = false, beerName }: BeerCanProps) {
  const labelTexture = useCanLabelTexture({ palette, brand, beerName });
  const profile = CanBodyProfile();

  return (
    <group scale={scale}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[profile, 128]} />
        <meshPhysicalMaterial
          color="#d6d1c6"
          metalness={0.92}
          roughness={0.23}
          clearcoat={0.35}
          clearcoatRoughness={0.18}
          envMapIntensity={1.8}
        />
      </mesh>

      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.836, 0.836, 2.68, 128, 1, true]} />
        <meshPhysicalMaterial
          map={labelTexture}
          metalness={0.05}
          roughness={0.36}
          clearcoat={0.55}
          clearcoatRoughness={0.14}
          envMapIntensity={1.2}
        />
      </mesh>

      <mesh position={[0, 2.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.69, 0.055, 18, 128]} />
        <meshStandardMaterial color="#ede8dc" metalness={0.94} roughness={0.2} />
      </mesh>
      <mesh position={[0, -2.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.69, 0.056, 18, 128]} />
        <meshStandardMaterial color="#c7c2b8" metalness={0.92} roughness={0.22} />
      </mesh>

      <mesh position={[0, 2.14, 0]}>
        <cylinderGeometry args={[0.66, 0.72, 0.045, 128]} />
        <meshStandardMaterial color="#d9d5ca" metalness={0.96} roughness={0.24} />
      </mesh>
      <mesh position={[0, 2.171, 0]}>
        <cylinderGeometry args={[0.47, 0.5, 0.026, 128]} />
        <meshStandardMaterial color="#c8c3b8" metalness={0.94} roughness={0.3} />
      </mesh>

      <RoundedBox args={[0.64, 0.105, 0.28]} radius={0.055} smoothness={8} position={[0, 2.205, 0.07]} rotation={[0, -0.2, 0]}>
        <meshStandardMaterial color="#f3efe4" metalness={0.95} roughness={0.18} />
      </RoundedBox>
      <mesh position={[0, 2.212, 0.07]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <torusGeometry args={[0.17, 0.018, 12, 42]} />
        <meshStandardMaterial color="#bab5aa" metalness={0.9} roughness={0.24} />
      </mesh>
      <DrinkingOpening />

      <mesh position={[-0.58, 0.03, 0.59]} rotation={[0, -0.2, 0]}>
        <planeGeometry args={[0.08, 2.55]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.19} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0.5, 0.02, 0.66]} rotation={[0, 0.22, 0]}>
        <planeGeometry args={[0.14, 2.34]} />
        <meshBasicMaterial color="#fff7db" transparent opacity={0.11} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <PrintedFront palette={palette} brand={brand} beerName={beerName} />
      <Condensation />
    </group>
  );
}

function AtmosphereDust() {
  const positions = useMemo(() => {
    const coords: number[] = [];
    for (let i = 0; i < 72; i += 1) {
      const angle = i * 2.19;
      const radius = 3.8 + ((i * 29) % 100) / 22;
      coords.push(
        Math.cos(angle) * radius,
        -2.9 + ((i * 41) % 100) / 15,
        Math.sin(angle) * radius - 2.4
      );
    }
    return new Float32Array(coords);
  }, []);

  const points = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.012;
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#f5dfb3" size={0.026} transparent opacity={0.26} depthWrite={false} />
    </points>
  );
}

function SceneContent() {
  const mainCan = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { camera, scene } = useThree();

  useEffect(() => {
    scene.background = null;
    camera.position.set(0, 0.3, 7.6);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      camera.position.set(0, 0.32, 7.6);
      mainCan.current?.scale.setScalar(0.9);
      mainCan.current?.position.set(0.58, -0.02, 0);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-pin",
          start: "top top",
          end: "+=165%",
          scrub: 1.15,
          pin: true,
          anticipatePin: 1
        }
      });

      timeline
        .to(camera.position, { z: 6.75, y: 0.1, ease: "none" }, 0)
        .to(mainCan.current!.rotation, { y: Math.PI * 1.05, z: -0.07, ease: "none" }, 0)
        .to(mainCan.current!.position, { x: 0.86, y: -0.12, ease: "none" }, 0.1);

      return () => timeline.kill();
    });

    mm.add("(max-width: 767px)", () => {
      camera.position.set(0, 0.2, 9.6);
      mainCan.current?.scale.setScalar(0.52);
      mainCan.current?.position.set(0, 0.56, -0.25);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-pin",
          start: "top top",
          end: "+=120%",
          scrub: 1.05,
          pin: true,
          anticipatePin: 1
        }
      });

      timeline
        .to(camera.position, { z: 8.45, y: 0.04, ease: "none" }, 0)
        .to(mainCan.current!.rotation, { y: Math.PI * 0.9, z: -0.05, ease: "none" }, 0)
        .to(mainCan.current!.position, { x: 0.06, y: 0.22, ease: "none" }, 0.1);

      return () => timeline.kill();
    });

    return () => mm.revert();
  }, [camera, scene]);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    if (mainCan.current) {
      mainCan.current.rotation.y += 0.0011;
      mainCan.current.rotation.x = THREE.MathUtils.lerp(mainCan.current.rotation.x, pointer.current.y * 0.1, 0.04);
      mainCan.current.position.y += Math.sin(elapsed * 0.7) * 0.0012;
    }

    if (rig.current) {
      rig.current.rotation.y = THREE.MathUtils.lerp(rig.current.rotation.y, pointer.current.x * 0.08, 0.035);
      rig.current.rotation.x = THREE.MathUtils.lerp(rig.current.rotation.x, -pointer.current.y * 0.055, 0.035);
    }

    camera.lookAt(0, 0, 0);
  });

  return (
    <group
      ref={rig}
      onPointerMove={(event) => {
        pointer.current.x = (event.pointer.x - 0.5) * 2;
        pointer.current.y = (event.pointer.y - 0.5) * 2;
      }}
    >
      <fog attach="fog" args={["#211814", 9, 18]} />
      <ambientLight intensity={0.58} />
      <directionalLight position={[3.8, 5.4, 4.2]} intensity={2.9} castShadow shadow-mapSize={[2048, 2048]} />
      <spotLight position={[-3.5, 4.5, 5]} angle={0.38} penumbra={0.7} intensity={8.2} color="#fff1cf" castShadow />
      <pointLight position={[-4, 1.8, 2]} color="#d99aa3" intensity={4.8} distance={9} />
      <pointLight position={[4, -1.4, -3]} color="#6f8b5a" intensity={2.4} distance={12} />

      <group ref={mainCan} position={[0.58, -0.02, 0]} rotation={[0.06, 0.06, 0]}>
        <BeerCan palette={palettes[0]} brand />
      </group>

      <Float speed={0.9} rotationIntensity={0.22} floatIntensity={0.45}>
        <group position={[-3.2, 0.88, -2.7]} rotation={[0.12, 0.7, -0.1]}>
          <BeerCan palette={palettes[1]} beerName="Daylight Haze" scale={0.43} />
        </group>
      </Float>
      <Float speed={1.15} rotationIntensity={0.28} floatIntensity={0.55}>
        <group position={[3.16, 1.08, -3.2]} rotation={[-0.14, -0.7, 0.14]}>
          <BeerCan palette={palettes[2]} beerName="Luna Blanca" scale={0.37} />
        </group>
      </Float>
      <Float speed={0.98} rotationIntensity={0.22} floatIntensity={0.48}>
        <group position={[2.75, -1.45, -2.15]} rotation={[0.08, -1.04, -0.1]}>
          <BeerCan palette={palettes[3]} beerName="West Coast IPA" scale={0.31} />
        </group>
      </Float>
      <Float speed={1.05} rotationIntensity={0.22} floatIntensity={0.42}>
        <group position={[-2.55, -1.55, -3.1]} rotation={[-0.08, 0.44, 0.09]}>
          <BeerCan palette={palettes[2]} beerName="Helles Morning" scale={0.28} />
        </group>
      </Float>

      <AtmosphereDust />
      <Environment preset="sunset" />
    </group>
  );
}

export function BeerCanScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.3, 7.6], fov: 35 }}
      className="h-full w-full"
    >
      <SceneContent />
    </Canvas>
  );
}

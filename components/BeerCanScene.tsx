"use client";

import { Environment, Float, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type BeerCanProps = {
  scale?: number;
  labelSrc?: string;
};

const LABEL_TEXTURE_ROTATION = 0.85;

function createPrintedCanMaterial(labelTexture: THREE.Texture) {
  return new THREE.MeshPhysicalMaterial({
    map: labelTexture,
    color: "#ffffff",
    metalness: 0.02,
    roughness: 0.46,
    clearcoat: 0.32,
    clearcoatRoughness: 0.58,
    envMapIntensity: 1.55
  });
}

function createAluminiumMaterial(tone: "shell" | "lid" | "tab" = "shell") {
  const settings = {
    shell: { color: "#d7d3c9", roughness: 0.2, clearcoat: 0.42 },
    lid: { color: "#e0ddd3", roughness: 0.17, clearcoat: 0.5 },
    tab: { color: "#c9c6bd", roughness: 0.24, clearcoat: 0.36 }
  }[tone];

  return new THREE.MeshPhysicalMaterial({
    color: settings.color,
    metalness: 1,
    roughness: settings.roughness,
    clearcoat: settings.clearcoat,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.9
  });
}

function buildLabelBandGeometry(sourceGeometry: THREE.BufferGeometry) {
  const source = sourceGeometry.index ? sourceGeometry.toNonIndexed() : sourceGeometry.clone();
  source.computeBoundingBox();

  const box = source.boundingBox;
  const position = source.getAttribute("position");
  const normal = source.getAttribute("normal");

  if (!box || !position || !normal) return source;

  const minY = box.min.y;
  const maxY = box.max.y;
  const height = maxY - minY;
  const labelMinY = minY + height * 0.08;
  const labelMaxY = maxY - height * 0.10;
  const labelHeight = labelMaxY - labelMinY;

  const printed: number[] = [];
  const metal: number[] = [];

  for (let triangle = 0; triangle < position.count; triangle += 3) {
    const ys = [position.getY(triangle), position.getY(triangle + 1), position.getY(triangle + 2)];
    const normalY =
      Math.abs(normal.getY(triangle)) + Math.abs(normal.getY(triangle + 1)) + Math.abs(normal.getY(triangle + 2));
    const averageY = (ys[0] + ys[1] + ys[2]) / 3;
    const isVerticalSide = normalY / 3 < 0.58;
    const isLabelBand = averageY > labelMinY && averageY < labelMaxY && isVerticalSide;

    (isLabelBand ? printed : metal).push(triangle, triangle + 1, triangle + 2);
  }

  const ordered = [...printed, ...metal];
  const positions = new Float32Array(ordered.length * 3);
  const normals = new Float32Array(ordered.length * 3);
  const uvs = new Float32Array(ordered.length * 2);

  for (let triangle = 0; triangle < ordered.length; triangle += 3) {
    const rawUvs = [0, 1, 2].map((offset) => {
      const sourceIndex = ordered[triangle + offset];
      const x = position.getX(sourceIndex);
      const z = position.getZ(sourceIndex);
      const u = Math.atan2(x, z) / (Math.PI * 2) + LABEL_TEXTURE_ROTATION;
      const v = THREE.MathUtils.clamp((position.getY(sourceIndex) - labelMinY) / labelHeight, 0, 1);
      return { u, v };
    });

    const minU = Math.min(...rawUvs.map((uv) => uv.u));
    const maxU = Math.max(...rawUvs.map((uv) => uv.u));
    if (maxU - minU > 0.5) {
      rawUvs.forEach((uv) => {
        if (uv.u < 0.5) uv.u += 1;
      });
    }

    for (let offset = 0; offset < 3; offset += 1) {
      const sourceIndex = ordered[triangle + offset];
      const target = triangle + offset;
      positions[target * 3] = position.getX(sourceIndex);
      positions[target * 3 + 1] = position.getY(sourceIndex);
      positions[target * 3 + 2] = position.getZ(sourceIndex);
      normals[target * 3] = normal.getX(sourceIndex);
      normals[target * 3 + 1] = normal.getY(sourceIndex);
      normals[target * 3 + 2] = normal.getZ(sourceIndex);
      uvs[target * 2] = rawUvs[offset].u;
      uvs[target * 2 + 1] = rawUvs[offset].v;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.clearGroups();
  geometry.addGroup(0, printed.length, 0);
  geometry.addGroup(printed.length, metal.length, 1);
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();
  return geometry;
}


function BeerCan({
  scale = 1,
  labelSrc = "/textures/golden-hour-label.png",
}: BeerCanProps) {
  const gltf = useGLTF("/models/beer-can.glb");
  const labelTexture = useTexture(labelSrc);

  useEffect(() => {
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    labelTexture.flipY = true;
    labelTexture.wrapS = THREE.RepeatWrapping;
    labelTexture.wrapT = THREE.ClampToEdgeWrapping;
    labelTexture.anisotropy = 16;
    labelTexture.needsUpdate = true;
  }, [labelTexture]);

  const canScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const meshes: THREE.Mesh[] = [];

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      meshes.push(child);
    });

    const bodyMesh = meshes.reduce<THREE.Mesh | null>((largest, mesh) => {
      const vertexCount = mesh.geometry.getAttribute("position")?.count ?? 0;
      const largestVertexCount = largest?.geometry.getAttribute("position")?.count ?? 0;
      return vertexCount > largestVertexCount ? mesh : largest;
    }, null);

    const labelMaterial = createPrintedCanMaterial(labelTexture);
    const shellMaterial = createAluminiumMaterial("shell");
    const lidMaterial = createAluminiumMaterial("lid");
    const tabMaterial = createAluminiumMaterial("tab");

    meshes.forEach((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (mesh === bodyMesh) {
        mesh.geometry = buildLabelBandGeometry(mesh.geometry);
        mesh.material = [labelMaterial, shellMaterial];
        return;
      }

      mesh.geometry.computeBoundingBox();
      const box = mesh.geometry.boundingBox;
      const size = box ? new THREE.Vector3().subVectors(box.max, box.min) : new THREE.Vector3();
      mesh.material = size.z > size.x * 1.4 ? tabMaterial : lidMaterial;
    });

    clone.rotation.y = Math.PI;
    return clone;
  }, [gltf, labelTexture]);

  return (
    <group scale={scale}>
      <primitive object={canScene} />
      
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
        <BeerCan labelSrc="/textures/daylight_haze.png"/>
      </group>

      <Float speed={0.9} rotationIntensity={0.22} floatIntensity={0.45}>
        <group position={[-3.2, 0.88, -2.7]} rotation={[0.12, 0.7, -0.1]}>
          <BeerCan scale={0.43} labelSrc="/textures/sweet_illusion.png"/>
        </group>
      </Float>
      <Float speed={1.15} rotationIntensity={0.28} floatIntensity={0.55}>
        <group position={[3.16, 1.08, -3.2]} rotation={[-0.14, -0.7, 0.14]}>
          <BeerCan scale={0.37} labelSrc="/textures/daylight_haze.png"/>
        </group>
      </Float>
      <Float speed={0.98} rotationIntensity={0.22} floatIntensity={0.48}>
        <group position={[2.75, -1.45, -2.15]} rotation={[0.08, -1.04, -0.1]}>
          <BeerCan scale={0.31} labelSrc="/textures/sweet_illusion.png"/>
        </group>
      </Float>
      <Float speed={1.05} rotationIntensity={0.22} floatIntensity={0.42}>
        <group position={[-2.55, -1.55, -3.1]} rotation={[-0.08, 0.44, 0.09]}>
          <BeerCan scale={0.28} labelSrc="/textures/daylight_haze.png"/>
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
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
      camera={{ position: [0, 0.3, 7.6], fov: 35 }}
      className="h-full w-full"
    >
      <SceneContent />
    </Canvas>
  );
}

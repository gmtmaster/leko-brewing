"use client";

import { Environment, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type ProductCanCanvasProps = {
  labelSrc?: string;
  cameraZ?: number;
  cameraY?: number;
  fov?: number;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  idleSpeed?: number;
};

type ProductCanProps = Pick<
  ProductCanCanvasProps,
  "labelSrc" | "scale" | "position" | "rotation" | "idleSpeed"
> & {
  reducedMotion?: boolean;
};

const LABEL_TEXTURE_ROTATION = 0.85;

function createPrintedMaterial(labelTexture: THREE.Texture) {
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
  const labelMaxY = maxY - height * 0.1;
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

function ProductCan({
  labelSrc = "/textures/golden-hour-label.png",
  scale = 1,
  position = [0, 0, 0],
  rotation = [0.04, Math.PI, 0],
  idleSpeed = 0.18,
  reducedMotion = false,
}: ProductCanProps) {
  const group = useRef<THREE.Group>(null);
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
      if (child instanceof THREE.Mesh) meshes.push(child);
    });

    const bodyMesh = meshes.reduce<THREE.Mesh | null>((largest, mesh) => {
      const vertexCount = mesh.geometry.getAttribute("position")?.count ?? 0;
      const largestVertexCount = largest?.geometry.getAttribute("position")?.count ?? 0;
      return vertexCount > largestVertexCount ? mesh : largest;
    }, null);

    const labelMaterial = createPrintedMaterial(labelTexture);
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

    return clone;
  }, [gltf, labelTexture]);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = rotation[1] + state.clock.elapsedTime * idleSpeed;
    group.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.7) * 0.025;
  });

  return (
    <group ref={group} scale={scale} position={position} rotation={rotation}>
      <primitive object={canScene} />
    </group>
  );
}

export function ProductCanCanvas({
  labelSrc = "/textures/golden-hour-label.png",
  cameraZ = 6.2,
  cameraY = 0.62,
  fov = 26,
  scale = 0.72,
  position = [0, -0.38, 0],
  rotation = [0.02, Math.PI * 0.94, 0],
  idleSpeed = 0.12,
}: ProductCanCanvasProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);
    const updatePreference = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, cameraY, cameraZ], fov }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3.2, 4.5, 4.4]} intensity={2.4} />
      <spotLight position={[-2.8, 3.2, 4.5]} angle={0.42} penumbra={0.75} intensity={4.8} color="#e0f2fe" />
      <pointLight position={[3, -1.6, -2.2]} intensity={1.7} color="#67e8f9" />
      <Suspense fallback={null}>
        <ProductCan
          labelSrc={labelSrc}
          scale={scale}
          position={position}
          rotation={rotation}
          idleSpeed={idleSpeed}
          reducedMotion={prefersReducedMotion}
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/beer-can.glb");
useTexture.preload("/textures/daylight-haze-label.png");
useTexture.preload("/textures/golden-hour-label.png");
useTexture.preload("/textures/luna-blanca-label.png");
useTexture.preload("/textures/west-coast-ipa-label.png");
useTexture.preload("/textures/daylight_haze.png");
useTexture.preload("/textures/sweet_illusion.png");

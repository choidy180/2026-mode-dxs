'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Center, Environment, Html, OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { AlertOctagon, Wrench } from 'lucide-react';
import * as THREE from 'three';
import { FLOOR_MODEL_PATH, JIG_MODEL_PATH, PROCESS_CONFIG } from '@/constants/smartFactoryViewer';
import type { ApiDataItem, UnitData, ViewerLayoutType } from '@/types/smartFactoryViewer';
import {
  BubbleAction,
  BubbleText,
  BubbleTitle,
  ErrorBubble,
  ModelErrorPointer,
  ModelLabelBadge,
  ModelLabelRoot,
  ProcessDot,
  ProcessLabelContainer,
  ProcessText,
} from '@/styles/smartFactoryViewer.styles';

interface FactorySceneProps {
  layout: ViewerLayoutType;
  apiData: ApiDataItem[];
  onHoverChange: (data: UnitData | null) => void;
  onInjectUnitChange: (unit: ApiDataItem | null) => void;
}

interface JigModelProps {
  url: string;
  apiData: ApiDataItem[];
  onHoverChange: (data: UnitData | null) => void;
  onInjectUnitChange: (unit: ApiDataItem | null) => void;
}

interface MeshLocation {
  id: string;
  position: THREE.Vector3;
  mesh: THREE.Mesh;
}

interface ProcessLabelLocation {
  position: THREE.Vector3;
  name: string;
  color: string;
}

type Vector3Tuple = [number, number, number];

interface SceneViewConfig {
  cameraPosition: Vector3Tuple;
  modelPosition: Vector3Tuple;
  controlTarget: Vector3Tuple;
  cameraFov: number;
  modelScale: number;
}

const SCENE_VIEW_CONFIG: Record<ViewerLayoutType, SceneViewConfig> = {
  modelOnly: {
    // 카메라 위치 [좌우, 높이, 앞뒤]
    cameraPosition: [-22, 15, -20],

    // 모델 전체 위치 [좌우, 상하, 앞뒤]
    modelPosition: [4, -2.05, 3],

    // 카메라가 바라보는 중심점 [좌우, 높이, 앞뒤]
    controlTarget: [0.5, 0.25, 0.8],

    // 카메라 화각. 값이 커지면 넓게 보이고 모델은 작아짐
    cameraFov: 14,

    // 모델 크기
    modelScale: 0.88,
  },

  balanced: {
    cameraPosition: [-22, 18, -20],
    modelPosition: [3.4, -2.05, 3],
    controlTarget: [0.5, 0.25, 0.8],
    cameraFov: 14,
    modelScale: 0.82,
  },

  detailRight: {
    cameraPosition: [-26, 20, -26],
    modelPosition: [-1.2, -0.95, -1.2],
    controlTarget: [-0.4, -0.15, -0.4],
    cameraFov: 16,
    modelScale: 1.15,
  },
};

const SOFT_EDGE_NAME = '__soft-object-edge__';

const CART_BASE_POSITION_OFFSET: Vector3Tuple = [0, 0, 0];

const CART_LABEL_OFFSET: Vector3Tuple = [0.5, 0.35, 0];

const CART_LABEL_OFFSETS: Partial<Record<string, Vector3Tuple>> = {
  // 개별 조정이 필요한 라벨만 여기에 추가
  // 'M-01': [0.1, 1.1, 0],
  // 'M-02': [-0.1, 1.05, 0],
};
function SceneCameraController({ config }: { config: SceneViewConfig }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const resetCamera = useCallback(() => {
    camera.position.set(...config.cameraPosition);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = config.cameraFov;
    }

    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(...config.controlTarget);
      controlsRef.current.update();
      controlsRef.current.saveState();
    }
  }, [camera, config]);

  useEffect(() => {
    resetCamera();

    const handlePageShow = () => {
      resetCamera();
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [resetCamera]);

  return (
    <OrbitControls
      ref={controlsRef}
      target={config.controlTarget}
      makeDefault
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2.1}
    />
  );
}

const addSoftObjectEdge = (mesh: THREE.Mesh, isStaticPart: boolean) => {
  if (!mesh.geometry || mesh.children.some((child) => child.name === SOFT_EDGE_NAME)) return;

  const edgeGeometry = new THREE.EdgesGeometry(mesh.geometry, isStaticPart ? 52 : 36);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: isStaticPart ? '#94a3b8' : '#475569',
    transparent: true,
    opacity: isStaticPart ? 0.08 : 0.18,
    depthTest: true,
    depthWrite: false,
  });
  const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);

  edgeLines.name = SOFT_EDGE_NAME;
  edgeLines.renderOrder = 2;
  mesh.add(edgeLines);
};

class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('3D Model Loading Failed:', error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function FloorModel() {
  const { scene } = useGLTF(FLOOR_MODEL_PATH);
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = false;
      mesh.receiveShadow = true;
      addSoftObjectEdge(mesh, true);
    });

    return cloned;
  }, [scene]);

  return <primitive object={clonedScene} raycast={() => null} />;
}

const MovingLabel = React.memo(({
  labelIndex,
  locations,
  errorIndices,
  apiData,
}: {
  labelIndex: number;
  locations: MeshLocation[];
  errorIndices: number[];
  apiData: ApiDataItem[];
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const cycleDuration = 15;
  const waitDuration = 10;
  const moveDuration = 5;

  const labelText = useMemo(() => {
    return `M-${String(labelIndex + 1).padStart(2, '0')}`;
  }, [labelIndex]);

  const labelOffset = useMemo(() => {
    const offset = CART_LABEL_OFFSETS[labelText] ?? CART_LABEL_OFFSET;

    return new THREE.Vector3(offset[0], offset[1], offset[2]);
  }, [labelText]);

  useFrame((state) => {
    if (!groupRef.current || locations.length === 0) return;

    const time = state.clock.getElapsedTime();
    const cycleIndex = Math.floor(time / cycleDuration);
    const timeInCycle = time % cycleDuration;
    const currentIndex = (labelIndex + cycleIndex) % locations.length;
    const nextIndex = (currentIndex + 1) % locations.length;
    const currentPos = locations[currentIndex].position;
    const nextPos = locations[nextIndex].position;
    const currentLabelPosition = currentPos.clone().add(labelOffset);
    const nextLabelPosition = nextPos.clone().add(labelOffset);

    if (timeInCycle < waitDuration) {
      groupRef.current.position.copy(currentLabelPosition);
      return;
    }

    const moveTime = timeInCycle - waitDuration;
    const progress = Math.min(moveTime / moveDuration, 1);

    groupRef.current.position.lerpVectors(currentLabelPosition, nextLabelPosition, progress);
  });

  const isError = errorIndices.includes(labelIndex);
  const errorReason = useMemo(() => {
    if (!isError) {
      return {
        problem: '',
        solution: '',
      };
    }

    const matched = apiData.find((item) => Number.parseInt(item.대차번호, 10) === labelIndex + 1);

    if (matched && matched.AI_LABEL !== '정상') {
      return {
        problem: matched.AI_LABEL,
        solution: '관리자 점검 요망',
      };
    }

    return {
      problem: '시스템 오류 감지',
      solution: '현장 확인 요망',
    };
  }, [apiData, isError, labelIndex]);

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={15} zIndexRange={isError ? [45, 0] : [30, 0]}>
        <ModelLabelRoot>
          <ModelLabelBadge $isError={isError}>{labelText}</ModelLabelBadge>
          {isError && (
            <ModelErrorPointer>
              <ErrorBubble>
                <BubbleTitle>
                  <AlertOctagon size={12} />
                  Error Detected
                </BubbleTitle>
                <BubbleText>
                  <span>PROBLEM</span>
                  {errorReason.problem}
                </BubbleText>
                <BubbleText>
                  <span>SOLUTION</span>
                  <BubbleAction>
                    <Wrench size={10} color="#34d399" />
                    {errorReason.solution}
                  </BubbleAction>
                </BubbleText>
              </ErrorBubble>
            </ModelErrorPointer>
          )}
        </ModelLabelRoot>
      </Html>
    </group>
  );
});

MovingLabel.displayName = 'MovingLabel';

const ProcessLabel = React.memo(({ position, name, color }: ProcessLabelLocation) => {
  return (
    <Html position={position} center zIndexRange={[50, 0]}>
      <ProcessLabelContainer $color={color}>
        <ProcessDot $color={color} />
        <ProcessText>{name}</ProcessText>
      </ProcessLabelContainer>
    </Html>
  );
});

ProcessLabel.displayName = 'ProcessLabel';

function InteractiveJigModel({ url, apiData, onHoverChange, onInjectUnitChange }: JigModelProps) {
  const { scene } = useGLTF(url);
  const modelScene = useMemo(() => scene.clone(true), [scene]);
  const activeIdRef = useRef<string | null>(null);
  const lastInjectKeyRef = useRef<string | null>(null);
  const highlightColor = useMemo(() => new THREE.Color('#ef4444'), []);
  const errorColor = useMemo(() => new THREE.Color('#ff0000'), []);
  const [meshLocations, setMeshLocations] = useState<MeshLocation[]>([]);
  const [processLabelLocations, setProcessLabelLocations] = useState<ProcessLabelLocation[]>([]);
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const lastCycleRef = useRef(-1);
  const offsetStartIndex = 6;
  const cycleDuration = 15;

  const activeErrorIndices = useMemo(() => {
    return apiData
      .filter((item) => item.AI_LABEL !== '정상')
      .map((item) => Number.parseInt(item.대차번호, 10) - 1);
  }, [apiData]);

  useEffect(() => {
    const meshes: { mesh: THREE.Mesh; position: THREE.Vector3 }[] = [];

    modelScene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const name = mesh.name.toLowerCase();
      const isStaticPart = [
        'floor',
        'ground',
        'plane',
        'base',
        'plate',
        'bottom',
        'stand',
        'support',
        'frame',
        'line',
        'rail',
      ].some((keyword) => name.includes(keyword));

      mesh.castShadow = !isStaticPart;
      mesh.receiveShadow = true;
      addSoftObjectEdge(mesh, isStaticPart);

      if (isStaticPart) return;

      if (mesh.material) {
        const baseMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        const standardMaterial = baseMaterial as THREE.MeshStandardMaterial;
        const originalColor = standardMaterial.color ?? new THREE.Color(0xffffff);

        mesh.material = new THREE.MeshPhysicalMaterial({
          color: originalColor,
          metalness: 0.1,
          roughness: 0.2,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
          side: THREE.DoubleSide,
        });
      }

      const worldPosition = new THREE.Vector3();
      mesh.getWorldPosition(worldPosition);
      meshes.push({ mesh, position: worldPosition });
    });

    if (meshes.length === 0) return;

    const center = meshes.reduce(
      (acc, item) => ({
        x: acc.x + item.position.x,
        z: acc.z + item.position.z,
      }),
      { x: 0, z: 0 },
    );
    center.x /= meshes.length;
    center.z /= meshes.length;

    meshes.sort((a, b) => {
      let angleA = Math.atan2(a.position.z - center.z, a.position.x - center.x);
      let angleB = Math.atan2(b.position.z - center.z, b.position.x - center.x);

      if (angleA < 0) angleA += Math.PI * 2;
      if (angleB < 0) angleB += Math.PI * 2;

      return angleB - angleA;
    });

    const sliceIndex = offsetStartIndex % meshes.length;
    const sortedMeshes = [...meshes.slice(sliceIndex), ...meshes.slice(0, sliceIndex)];

    if (sortedMeshes.length > 12) {
      sortedMeshes.splice(12, 1);
    }

    const processLabels: ProcessLabelLocation[] = [];

    sortedMeshes.forEach((item, index) => {
      if (index >= PROCESS_CONFIG.length) return;

      const config = PROCESS_CONFIG[index];
      const material = item.mesh.material as THREE.MeshPhysicalMaterial;
      material.color.set(config.color);

      processLabels.push({
        position: item.position.clone().add(new THREE.Vector3(0, 1.2, 0)),
        name: config.name,
        color: config.color,
      });
    });

    setProcessLabelLocations(processLabels);
    setMeshLocations(
      sortedMeshes.map((item) => ({
        id: item.mesh.uuid,
        position: item.position.clone().add(
          new THREE.Vector3(
            CART_BASE_POSITION_OFFSET[0],
            CART_BASE_POSITION_OFFSET[1],
            CART_BASE_POSITION_OFFSET[2],
          ),
        ),
        mesh: item.mesh,
      })),
    );
  }, [modelScene]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cycleIndex = Math.floor(time / cycleDuration);

    if (cycleIndex !== lastCycleRef.current) {
      lastCycleRef.current = cycleIndex;
      setCurrentCycleIndex(cycleIndex);
    }

    if (meshLocations.length === 0) return;

    const flashIntensity = 1.5 + Math.sin(time * 12) * 1.0;

    meshLocations.forEach((location) => {
      if (location.mesh.uuid === activeIdRef.current) return;

      const material = location.mesh.material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = 0;
    });

    activeErrorIndices.forEach((labelIndex) => {
      const total = meshLocations.length;
      const currentPositionIndex = (labelIndex + cycleIndex) % total;
      const mesh = meshLocations[currentPositionIndex]?.mesh;

      if (!mesh || mesh.uuid === activeIdRef.current) return;

      const material = mesh.material as THREE.MeshPhysicalMaterial;
      material.emissive.set(errorColor);
      material.emissiveIntensity = flashIntensity;
    });

    const total = meshLocations.length;
    const injectStationIndex = 4;
    let targetCartIndex = (injectStationIndex - cycleIndex) % total;
    if (targetCartIndex < 0) targetCartIndex += total;

    const matchedUnit = apiData.find((item) => Number.parseInt(item.대차번호, 10) === targetCartIndex + 1) ?? null;
    const nextKey = matchedUnit?.대차번호 ?? null;

    if (nextKey !== lastInjectKeyRef.current) {
      lastInjectKeyRef.current = nextKey;
      onInjectUnitChange(matchedUnit);
    }
  });

  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';

    const mesh = event.object as THREE.Mesh;
    if (!mesh.isMesh) return;

    activeIdRef.current = mesh.uuid;
    const material = mesh.material as THREE.MeshPhysicalMaterial;

    if (material.emissive) {
      material.emissive.copy(highlightColor);
      material.emissiveIntensity = 2;
    }

    const meshIndex = meshLocations.findIndex((location) => location.mesh.uuid === mesh.uuid);
    if (meshIndex === -1) return;

    const total = meshLocations.length;
    let foundLabelIndex = -1;

    for (let labelIndex = 0; labelIndex < total; labelIndex += 1) {
      if ((labelIndex + currentCycleIndex) % total === meshIndex) {
        foundLabelIndex = labelIndex;
        break;
      }
    }

    if (foundLabelIndex === -1) return;

    const name = `M-${String(foundLabelIndex + 1).padStart(2, '0')}`;
    const matchedData = apiData.find((item) => Number.parseInt(item.대차번호, 10) === foundLabelIndex + 1);
    const isError = matchedData ? matchedData.AI_LABEL !== '정상' : false;

    onHoverChange({
      name,
      status: isError ? 'error' : 'normal',
      temp: matchedData ? Number.parseFloat(matchedData['가조립온도(℃)']) : 0,
      load: matchedData ? Number.parseFloat(matchedData['R액 압력(kg/㎥)']) : 0,
      problem: matchedData?.AI_LABEL,
      uuid: mesh.uuid,
    });
  }, [apiData, currentCycleIndex, highlightColor, meshLocations, onHoverChange]);

  const handlePointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    const mesh = event.object as THREE.Mesh;

    if (activeIdRef.current !== mesh.uuid) return;

    document.body.style.cursor = 'auto';
    activeIdRef.current = null;

    const material = mesh.material as THREE.MeshPhysicalMaterial;
    if (material) material.emissiveIntensity = 0;

    onHoverChange(null);
  }, [onHoverChange]);

  return (
    <group>
      <primitive object={modelScene} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} />
      {meshLocations.map((_, index) => (
        <MovingLabel
          key={`cart-label-${index}`}
          labelIndex={index}
          locations={meshLocations}
          errorIndices={activeErrorIndices}
          apiData={apiData}
        />
      ))}
      {processLabelLocations.map((location) => (
        <ProcessLabel
          key={`proc-${location.name}`}
          position={location.position}
          name={location.name}
          color={location.color}
        />
      ))}
    </group>
  );
}

export function FactoryScene({ layout, apiData, onHoverChange, onInjectUnitChange }: FactorySceneProps) {
  const sceneConfig = SCENE_VIEW_CONFIG[layout];

  const {
    cameraPosition,
    modelPosition,
    cameraFov,
    modelScale,
  } = sceneConfig;

  return (
    <Canvas
      key={layout}
      dpr={[1, 1.5]}
      camera={{ position: cameraPosition, fov: cameraFov }}
      shadows="soft"
      gl={{
        logarithmicDepthBuffer: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-20, 30, -20]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.05}
      >
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8]} />
      </directionalLight>

      <Suspense fallback={null}>
        <Stage environment="city" intensity={2} adjustCamera={false} shadows={false}>
          <Center position={modelPosition}>
            <group scale={modelScale}>
              <ModelErrorBoundary fallback={null}>
                <FloorModel />
              </ModelErrorBoundary>
              <ModelErrorBoundary fallback={null}>
                <InteractiveJigModel
                  url={JIG_MODEL_PATH}
                  apiData={apiData}
                  onHoverChange={onHoverChange}
                  onInjectUnitChange={onInjectUnitChange}
                />
              </ModelErrorBoundary>
            </group>
          </Center>
        </Stage>
        <Environment preset="city" blur={1} background={false} />
      </Suspense>

      <SceneCameraController config={sceneConfig} />
    </Canvas>
  );
}

useGLTF.preload(JIG_MODEL_PATH);
useGLTF.preload(FLOOR_MODEL_PATH);
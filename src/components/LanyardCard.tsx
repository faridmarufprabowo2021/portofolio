import React, { useRef, useState, useEffect, Suspense, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { Physics, RigidBody, BallCollider, CuboidCollider, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

// Extend R3F with MeshLine
extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

const CARD_MODEL_URL = '/assets/card.glb';
const LANYARD_BAND_URL = '/assets/lanyard-band.webp';
const CARD_ATLAS_URL = '/assets/farid_card_atlas.webp';

const tempVec = new THREE.Vector3();
const tempAngVel = new THREE.Vector3();
const tempRot = new THREE.Vector3();
const tempDir = new THREE.Vector3();

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
}

function PhysicalBandAndCard({ maxSpeed = 60, minSpeed = 10, isMobile = false }: BandProps) {
  const lineRef = useRef<THREE.Mesh>(null);
  const fixedJointRef = useRef<RapierRigidBody>(null);
  const j1Ref = useRef<RapierRigidBody>(null);
  const j2Ref = useRef<RapierRigidBody>(null);
  const j3Ref = useRef<RapierRigidBody>(null);
  const cardRigidRef = useRef<RapierRigidBody>(null);

  const { nodes, materials } = useGLTF(CARD_MODEL_URL) as any;
  const bandTexture = useTexture(LANYARD_BAND_URL);
  const cardTexture = useTexture(CARD_ATLAS_URL);

  useEffect(() => {
    if (cardTexture) {
      cardTexture.colorSpace = THREE.SRGBColorSpace;
      cardTexture.flipY = false;
      cardTexture.anisotropy = 16;
      cardTexture.needsUpdate = true;
    }
  }, [cardTexture]);

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]));

  const [isDragged, setIsDragged] = useState<THREE.Vector3 | false>(false);
  const [isHovered, setIsHovered] = useState(false);

  // Rope joints for flexible cloth physics
  useRopeJoint(fixedJointRef as any, j1Ref as any, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1Ref as any, j2Ref as any, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2Ref as any, j3Ref as any, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3Ref as any, cardRigidRef as any, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (isHovered) {
      document.body.style.cursor = isDragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [isHovered, isDragged]);

  useFrame((state, delta) => {
    // Pointer Dragging Physics
    if (isDragged && cardRigidRef.current) {
      tempVec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      tempDir.copy(tempVec).sub(state.camera.position).normalize();
      tempVec.add(tempDir.multiplyScalar(state.camera.position.length()));

      [cardRigidRef, j1Ref, j2Ref, j3Ref, fixedJointRef].forEach((r) => r.current?.wakeUp());
      cardRigidRef.current.setNextKinematicTranslation({
        x: tempVec.x - isDragged.x,
        y: tempVec.y - isDragged.y,
        z: tempVec.z - isDragged.z,
      });
    }

    // Smooth Ribbon Joint Interpolation
    if (fixedJointRef.current && cardRigidRef.current && lineRef.current) {
      [j1Ref, j2Ref].forEach((joint) => {
        if (joint.current) {
          const trans = joint.current.translation();
          const obj = joint.current as any;
          if (!obj.lerped) {
            obj.lerped = new THREE.Vector3(trans.x, trans.y, trans.z);
          }
          const dist = Math.max(0.1, Math.min(1, obj.lerped.distanceTo(trans)));
          obj.lerped.lerp(trans, delta * (minSpeed + dist * (maxSpeed - minSpeed)));
        }
      });

      if (j3Ref.current && j2Ref.current && j1Ref.current && fixedJointRef.current) {
        const j3Trans = j3Ref.current.translation();
        const j2Lerp = (j2Ref.current as any).lerped || j2Ref.current.translation();
        const j1Lerp = (j1Ref.current as any).lerped || j1Ref.current.translation();
        const fixedTrans = fixedJointRef.current.translation();

        curve.points[0].set(j3Trans.x, j3Trans.y, j3Trans.z);
        curve.points[1].copy(j2Lerp);
        curve.points[2].copy(j1Lerp);
        curve.points[3].set(fixedTrans.x, fixedTrans.y, fixedTrans.z);

        (lineRef.current.geometry as any).setPoints(curve.getPoints(isMobile ? 16 : 32));
      }

      const angVel = cardRigidRef.current.angvel();
      const rot = cardRigidRef.current.rotation();
      tempAngVel.set(angVel.x, angVel.y, angVel.z);
      tempRot.set(rot.x, rot.y, rot.z);

      cardRigidRef.current.setAngvel(
        {
          x: tempAngVel.x,
          y: tempAngVel.y - tempRot.y * 0.25,
          z: tempAngVel.z,
        },
        true
      );
    }
  });

  curve.curveType = 'chordal';
  if (bandTexture) {
    bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;
  }

  const segmentConfig = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 2,
    linearDamping: 2,
  };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixedJointRef} {...segmentConfig} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1Ref} {...segmentConfig}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2Ref} {...segmentConfig}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3Ref} {...segmentConfig}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={cardRigidRef}
          {...segmentConfig}
          type={isDragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            onPointerUp={(e) => {
              (e.target as any).releasePointerCapture(e.pointerId);
              setIsDragged(false);
            }}
            onPointerDown={(e) => {
              (e.target as any).setPointerCapture(e.pointerId);
              if (cardRigidRef.current) {
                const trans = cardRigidRef.current.translation();
                tempVec.set(trans.x, trans.y, trans.z);
                setIsDragged(new THREE.Vector3().copy(e.point).sub(tempVec));
              }
            }}
          >
            {/* Card Mesh with Perfect Atlas Mapping */}
            {nodes?.card?.geometry && (
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardTexture}
                  map-anisotropy={16}
                  clearcoat={0.08}
                  clearcoatRoughness={0.6}
                  roughness={0.6}
                  metalness={0.02}
                />
              </mesh>
            )}

            {/* Metallic Clip */}
            {nodes?.clip?.geometry && (
              <mesh
                geometry={nodes.clip.geometry}
                material={materials?.metal}
                material-roughness={0.3}
                material-metalness={0.8}
              />
            )}

            {/* Clasp Ring */}
            {nodes?.clamp?.geometry && (
              <mesh
                geometry={nodes.clamp.geometry}
                material={materials?.metal}
                material-roughness={0.3}
                material-metalness={0.8}
              />
            )}
          </group>
        </RigidBody>
      </group>

      {/* Physics Ribbon Mesh */}
      <mesh ref={lineRef}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [800, 1400] : [1200, 1600]}
          useMap={1}
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

// Preload models & textures
useGLTF.preload(CARD_MODEL_URL);
useTexture.preload(LANYARD_BAND_URL);
useTexture.preload(CARD_ATLAS_URL);

const FallbackCard: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] brick-shadow max-w-xs text-center rounded-xl">
    <div className="w-24 h-28 bg-brick-blue border-3 border-on-surface rounded-xl overflow-hidden mb-3 brick-shadow-sm flex items-center justify-center">
      <img src="/images.webp" alt="Farid Ma'ruf Prabowo" className="w-full h-full object-cover" />
    </div>
    <h3 className="font-display font-extrabold text-base text-on-surface dark:text-white">FARID MA'RUF PRABOWO</h3>
    <p className="font-mono font-bold text-xs text-primary dark:text-red-400 mt-0.5">FULL-STACK ENGINEER</p>
    <div className="w-full mt-4 pt-3 border-t-2 border-dashed border-on-surface/30 font-mono text-[9px] text-on-surface-variant dark:text-slate-400 flex justify-between">
      <span>ID: UMS-2026-FMP</span>
      <span>STATUS: ACTIVE</span>
    </div>
  </div>
);

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Canvas 3D Lanyard fallback active:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackCard />;
    }
    return this.props.children;
  }
}

interface LanyardCardProps {
  transparent?: boolean;
}

export const LanyardCard: React.FC<LanyardCardProps> = ({ transparent = false }) => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[560px] md:h-[600px] flex items-center justify-center select-none overflow-hidden rounded-xl">
      
      {/* Decorative Baseplate Grid Accent (only when not transparent) */}
      {!transparent && (
        <div className="absolute inset-2 bg-[#FBF9F8] dark:bg-[#12141A] border-2 border-dashed border-on-surface/15 dark:border-white/10 rounded-xl pointer-events-none" />
      )}

      {/* Floating Interactive Badge Indicator */}
      {!transparent && (
        <div className="absolute top-3 right-3 z-30 px-3 py-1 bg-white dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-full text-[10px] font-mono font-bold text-on-surface dark:text-slate-200 flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-brick-green animate-ping" />
          DRAG & FLING ME 3D
        </div>
      )}

      {/* 3D Physical Lanyard Canvas */}
      <CanvasErrorBoundary>
        <div className="relative z-20 w-full h-full flex justify-center items-center">
          <Canvas
            camera={{ position: [0, 0, 24], fov: 20 }}
            dpr={[1, isMobile ? 1.5 : 2]}
            gl={{ alpha: true, antialias: true }}
            className="w-full h-full"
          >
            <ambientLight intensity={1.8} />
            <Suspense fallback={null}>
              <Physics gravity={[0, -60, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
                <PhysicalBandAndCard isMobile={isMobile} />
              </Physics>

              {/* Studio Environment Reflections */}
              <Environment blur={0.85}>
                <Lightformer
                  intensity={0.8}
                  color="white"
                  position={[0, -1, 5]}
                  rotation={[0, 0, Math.PI / 3]}
                  scale={[100, 0.1, 1]}
                />
                <Lightformer
                  intensity={1}
                  color="white"
                  position={[-1, -1, 1]}
                  rotation={[0, 0, Math.PI / 3]}
                  scale={[100, 0.1, 1]}
                />
                <Lightformer
                  intensity={1}
                  color="white"
                  position={[1, 1, 1]}
                  rotation={[0, 0, Math.PI / 3]}
                  scale={[100, 0.1, 1]}
                />
                <Lightformer
                  intensity={1.5}
                  color="white"
                  position={[-10, 0, 14]}
                  rotation={[0, Math.PI / 2, Math.PI / 3]}
                  scale={[100, 10, 1]}
                />
              </Environment>
            </Suspense>
          </Canvas>
        </div>
      </CanvasErrorBoundary>
    </div>
  );
};

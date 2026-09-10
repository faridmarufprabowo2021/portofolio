import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils, VRM } from '@pixiv/three-vrm';
import confetti from 'canvas-confetti';

interface VirtualAnimeAvatarProps {
  className?: string;
}

type ModelKey = 'denia' | 'alicia' | 'sample';

interface ModelConfig {
  key: ModelKey;
  name: string;
  badge: string;
  path: string;
  isVRM: boolean;
  camDistance: number;
}

const MODELS: Record<ModelKey, ModelConfig> = {
  denia: {
    key: 'denia',
    name: '🌸 DANIYA (鸣潮)',
    badge: '⚔️ WUTHERING WAVES 3D',
    path: '/assets/denia_anime.glb',
    isVRM: false,
    camDistance: 3.2,
  },
  alicia: {
    key: 'alicia',
    name: '🎌 ALICIA SOLID',
    badge: '✨ DWANGO VRM',
    path: '/assets/alicia_solid.vrm',
    isVRM: true,
    camDistance: 3.4,
  },
  sample: {
    key: 'sample',
    name: '👤 AVATAR SAMPLE',
    badge: '🎨 PIXIV VROID',
    path: '/assets/avatar_sample_b.vrm',
    isVRM: true,
    camDistance: 3.4,
  },
};

const ANIME_GREETINGS: Record<ModelKey, string[]> = {
  denia: [
    'DANIYA // 鸣潮 SIAP BERAKSI! ⚔️',
    'GREETINGS FROM WUTHERING WAVES! ⚡',
    'FARID M.P. • INFORMATIKA UMS 🎓',
    'HIGH PERFORMANCE 3D RENDERING ✨',
    'WELCOME TO FARID\'S 3D UNIVERSE! 🚀',
  ],
  alicia: [
    'KONNICHIWA! SAYA FARID 👋',
    'UMS INFORMATIKA 2026 🎓',
    'FULL-STACK & AI ARCHITECT ⚡',
    'WELCOME TO MY 3D WORLD! ✨',
    'ALUMNI MAN 1 SURAKARTA 🏫',
    'SUGOI! READY TO COLLABORATE 🚀',
  ],
  sample: [
    'HALO! SAYA VIRTUAL AVATAR FARID ✨',
    'SYSTEM ARCHITECTURE & CLOUD ☁️',
    'WEBGL & THREE.JS INTERACTIVE 🎮',
    'LET\'S BUILD SOMETHING GREAT! 💡',
  ],
};

export const VirtualAnimeAvatar: React.FC<VirtualAnimeAvatarProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speechBubbleRef = useRef<HTMLDivElement>(null);
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeModel, setActiveModel] = useState<ModelKey>('denia');
  const [isSmiling, setIsSmiling] = useState<boolean>(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentVRMRef = useRef<VRM | null>(null);
  const currentGLTFSceneRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const lookAtTargetRef = useRef<THREE.Object3D | null>(null);
  const baseModelPosYRef = useRef<number>(-0.65);

  const mousePosRef = useRef<{ x: number; y: number; isHovered: boolean }>({
    x: 0,
    y: 0,
    isHovered: false,
  });

  const dragRef = useRef<{ isDragging: boolean; startX: number; startRotation: number; currentRotation: number }>({
    isDragging: false,
    startX: 0,
    startRotation: 0,
    currentRotation: 0,
  });

  const smileTimeoutRef = useRef<number | null>(null);
  const speechTimeoutRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Blink state for VRM
  const blinkStateRef = useRef<{ nextBlinkTime: number; isBlinking: boolean; blinkStart: number }>({
    nextBlinkTime: 2.0,
    isBlinking: false,
    blinkStart: 0,
  });

  // Load Model (VRM or standard GLB)
  const loadModel = useCallback((modelCfg: ModelConfig) => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!scene) return;

    setIsLoading(true);

    // Clean previous models
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }
    if (currentVRMRef.current) {
      scene.remove(currentVRMRef.current.scene);
      VRMUtils.deepDispose(currentVRMRef.current.scene);
      currentVRMRef.current = null;
    }
    if (currentGLTFSceneRef.current) {
      scene.remove(currentGLTFSceneRef.current);
      currentGLTFSceneRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
      currentGLTFSceneRef.current = null;
    }

    if (camera) {
      camera.position.set(0, 0.05, modelCfg.camDistance);
      camera.lookAt(0, 0, 0);
    }

    const loader = new GLTFLoader();
    loader.crossOrigin = 'anonymous';

    if (modelCfg.isVRM) {
      loader.register((parser) => new VRMLoaderPlugin(parser));
      loader.load(
        modelCfg.path,
        (gltf) => {
          const vrm: VRM = gltf.userData.vrm;
          if (!vrm) {
            console.error('No VRM data found in GLTF asset');
            setIsLoading(false);
            return;
          }

          VRMUtils.rotateVRM0(vrm);
          VRMUtils.removeUnnecessaryVertices(gltf.scene);
          VRMUtils.combineSkeletons(gltf.scene);

          vrm.scene.position.set(0, -1.15, 0);
          vrm.scene.rotation.y = dragRef.current.currentRotation;
          baseModelPosYRef.current = -1.15;

          vrm.scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
            }
          });

          if (vrm.lookAt && lookAtTargetRef.current) {
            vrm.lookAt.target = lookAtTargetRef.current;
          }

          scene.add(vrm.scene);
          currentVRMRef.current = vrm;
          setIsLoading(false);
        },
        undefined,
        (error) => {
          console.error('Error loading VRM:', error);
          setIsLoading(false);
        }
      );
    } else {
      // Standard GLB Model (Denia Wuthering Waves)
      loader.load(
        modelCfg.path,
        (gltf) => {
          const model = gltf.scene;

          // Accurately compute bounding box and scale to fit beautifully inside the card
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          // Target height in 3D scene: 1.35 units (leaves ~15% top and bottom margin)
          const targetHeight = 1.35;
          const scale = size.y > 0 ? targetHeight / size.y : 1;
          model.scale.setScalar(scale);

          // Center precisely after scale
          box.setFromObject(model);
          box.getCenter(center);

          const targetPosY = -center.y - 0.02;
          model.position.set(-center.x, targetPosY, -center.z);
          model.rotation.y = dragRef.current.currentRotation;
          baseModelPosYRef.current = targetPosY;

          // Configure materials for soft, clean anime look
          model.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;

              if (obj.material) {
                const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                mats.forEach((m) => {
                  if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) {
                    const matName = m.name.toLowerCase();

                    m.roughness = 0.5;
                    m.metalness = 0.05;

                    // Separate alpha layers (hair highlights, blush, eye highlights) from solid base mesh
                    if (
                      matName.includes('+') ||
                      matName.includes('hi') ||
                      matName.includes('cheek') ||
                      matName.includes('emo')
                    ) {
                      m.transparent = true;
                      m.depthWrite = false; // Prevents sorting artifacts where highlights block the eye/face!
                      m.alphaTest = 0.02;
                      m.side = THREE.DoubleSide;
                    } else {
                      m.transparent = false;
                      m.depthWrite = true;
                      m.alphaTest = 0.5;
                      m.side = THREE.FrontSide;
                    }

                    // Glowing chest tacet mark tattoo
                    if (matName.includes('声痕') || matName.includes('fx')) {
                      m.emissive = new THREE.Color(0x00d8ff);
                      m.emissiveIntensity = 2.5;
                    }
                  }
                });
              }
            }
          });

          scene.add(model);
          currentGLTFSceneRef.current = model;

          // Play baked glTF skeletal & facial animations if present
          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
              const action = mixer.clipAction(clip);
              action.play();
            });
            mixerRef.current = mixer;
          }

          setIsLoading(false);
        },
        undefined,
        (error) => {
          console.error('Error loading GLB:', error);
          setIsLoading(false);
        }
      );
    }
  }, []);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 50);
    camera.position.set(0, 0.05, MODELS[activeModel].camDistance);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // LookAt Tracker Dummy Object
    const lookAtTarget = new THREE.Object3D();
    lookAtTarget.position.set(0, 0.1, 3.8);
    scene.add(lookAtTarget);
    lookAtTargetRef.current = lookAtTarget;

    // Studio Anime Lighting (Clean, soft, flattering)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d8ff, 0.8);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd700, 1.4);
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    // Initial Model Load
    loadModel(MODELS[activeModel]);

    // Animation Loop with Clock & Delta
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      if (!isVisibleRef.current) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      const vrm = currentVRMRef.current;
      const gltfScene = currentGLTFSceneRef.current;

      if (vrm) {
        // VRM 1. Natural Breathing & Idle Sway
        const chest = vrm.humanoid?.getNormalizedBoneNode('chest');
        const head = vrm.humanoid?.getNormalizedBoneNode('head');
        const spine = vrm.humanoid?.getNormalizedBoneNode('spine');

        if (chest) {
          chest.rotation.x = Math.sin(time * 2.2) * 0.025;
        }
        if (spine) {
          spine.rotation.y = Math.sin(time * 0.8) * 0.015;
        }

        // 2. Cursor Head/Eye Tracking
        if (lookAtTargetRef.current) {
          const mouse = mousePosRef.current;
          if (mouse.isHovered) {
            lookAtTargetRef.current.position.x = mouse.x * 2.4;
            lookAtTargetRef.current.position.y = -mouse.y * 1.8;
            lookAtTargetRef.current.position.z = 2.5;

            if (head) {
              head.rotation.y = mouse.x * 0.25;
              head.rotation.x = -mouse.y * 0.18;
            }
          } else {
            lookAtTargetRef.current.position.x = Math.sin(time * 0.7) * 0.9;
            lookAtTargetRef.current.position.y = Math.cos(time * 0.5) * 0.3;
            lookAtTargetRef.current.position.z = 3.5;
            if (head) {
              head.rotation.y = Math.sin(time * 0.7) * 0.08;
              head.rotation.x = Math.cos(time * 0.9) * 0.04;
            }
          }
        }

        // 3. Auto-Blinking Animation
        const blink = blinkStateRef.current;
        if (time > blink.nextBlinkTime && !blink.isBlinking) {
          blink.isBlinking = true;
          blink.blinkStart = time;
          blink.nextBlinkTime = time + 2.5 + Math.random() * 3.5;
        }

        if (blink.isBlinking) {
          const blinkElapsed = (time - blink.blinkStart) / 0.16;
          if (blinkElapsed < 1) {
            const blinkVal = Math.sin(blinkElapsed * Math.PI);
            vrm.expressionManager?.setValue('blink', blinkVal);
          } else {
            vrm.expressionManager?.setValue('blink', 0);
            blink.isBlinking = false;
          }
        }

        vrm.update(delta);
      } else if (gltfScene) {
        // GLB Model (Denia) Responsive Sway & Organic Floating
        const mouse = mousePosRef.current;
        const targetRotY = dragRef.current.isDragging
          ? dragRef.current.currentRotation
          : dragRef.current.currentRotation + (mouse.isHovered ? mouse.x * 0.22 : Math.sin(time * 0.7) * 0.04);

        const targetRotX = mouse.isHovered ? -mouse.y * 0.08 : 0;

        gltfScene.rotation.y = THREE.MathUtils.lerp(gltfScene.rotation.y, targetRotY, 0.1);
        gltfScene.rotation.x = THREE.MathUtils.lerp(gltfScene.rotation.x, targetRotX, 0.1);
        gltfScene.position.y = baseModelPosYRef.current + Math.sin(time * 1.8) * 0.012;

        if (mixerRef.current) {
          mixerRef.current.update(delta);
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [loadModel, activeModel]);

  // Viewport Intersection Observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Mouse Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (dragRef.current.isDragging) {
      const deltaX = (e.clientX - dragRef.current.startX) * 0.012;
      dragRef.current.currentRotation = dragRef.current.startRotation + deltaX;

      if (currentVRMRef.current) {
        currentVRMRef.current.scene.rotation.y = dragRef.current.currentRotation;
      } else if (currentGLTFSceneRef.current) {
        currentGLTFSceneRef.current.rotation.y = dragRef.current.currentRotation;
      }
      return;
    }

    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    mousePosRef.current = {
      x: normX,
      y: normY,
      isHovered: true,
    };
  };

  const handleMouseEnter = () => {
    mousePosRef.current.isHovered = true;
  };

  const handleMouseLeave = () => {
    mousePosRef.current.isHovered = false;
    dragRef.current.isDragging = false;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startRotation =
      currentVRMRef.current?.scene.rotation.y ?? currentGLTFSceneRef.current?.rotation.y ?? 0;
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
  };

  // Click Trigger: Confetti & Greetings
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const vrm = currentVRMRef.current;
    if (vrm?.expressionManager) {
      vrm.expressionManager.setValue('happy', 1);
      vrm.expressionManager.setValue('relaxed', 0.8);
      setIsSmiling(true);

      if (smileTimeoutRef.current) clearTimeout(smileTimeoutRef.current);
      smileTimeoutRef.current = window.setTimeout(() => {
        vrm.expressionManager?.setValue('happy', 0);
        vrm.expressionManager?.setValue('relaxed', 0);
        setIsSmiling(false);
      }, 2200);
    } else {
      setIsSmiling(true);
      if (smileTimeoutRef.current) clearTimeout(smileTimeoutRef.current);
      smileTimeoutRef.current = window.setTimeout(() => {
        setIsSmiling(false);
      }, 2000);
    }

    const quotes = ANIME_GREETINGS[activeModel] || ANIME_GREETINGS.denia;
    const msg = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeechText(msg);

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = window.setTimeout(() => {
      setSpeechText(null);
    }, 2500);

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 36,
      spread: 80,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#008E9B', '#FFD700', '#FF2A85', '#00DFD8', '#9333EA'],
      shapes: ['circle', 'square'],
      scalar: 0.9,
    });
  };

  const handleToggleModel = (e: React.MouseEvent) => {
    e.stopPropagation();
    const keys: ModelKey[] = ['denia', 'alicia', 'sample'];
    const nextIdx = (keys.indexOf(activeModel) + 1) % keys.length;
    setActiveModel(keys[nextIdx]);
  };

  const currentCfg = MODELS[activeModel];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      className={`relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-[440px] bg-gradient-to-b from-[#FFF5F8] via-[#F0F4F8] to-[#E2E8F0] dark:from-[#1D172A] dark:via-[#131622] dark:to-[#090B10] border-4 border-on-surface dark:border-[#2A2F3D] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-2xl flex flex-col items-center justify-center group ${className}`}
      title="Klik untuk berinteraksi! Drag geser horizontal untuk putar 360°"
    >
      {/* Anime Soft Ambient Backdrop Glow */}
      <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-[#F0F4F8]/90 dark:bg-[#131622]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-3 border-t-pink-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin" />
          <span className="font-mono text-xs font-bold text-on-surface dark:text-white">
            MEMUAT 3D ({currentCfg.name})...
          </span>
        </div>
      )}

      {/* Top HUD Badges */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <span className="px-2.5 py-1 bg-pink-500 text-white font-mono text-[10px] font-black uppercase rounded-md border-2 border-on-surface shadow-sm flex items-center gap-1.5 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>{isSmiling ? '✨ KAWAII ACTIVE!' : currentCfg.badge}</span>
        </span>

        {/* Avatar Switcher */}
        <button
          onClick={handleToggleModel}
          type="button"
          aria-label="Switch 3D Anime Model"
          title="Klik untuk mengganti Karakter 3D"
          className="px-2.5 py-1 bg-white dark:bg-[#1E222B] text-on-surface dark:text-white hover:bg-pink-500 hover:text-white font-mono text-[10px] font-bold uppercase rounded-md border-2 border-on-surface dark:border-[#2A2F3D] shadow-sm pointer-events-auto transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>GANTI:</span>
          <span className="font-black text-pink-500 hover:text-white">{currentCfg.name}</span>
        </button>
      </div>

      {/* Dynamic Floating Speech Bubble */}
      {speechText && (
        <div
          ref={speechBubbleRef}
          className="absolute top-12 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 bg-pink-500 text-white border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase tracking-wide brick-shadow-sm pointer-events-none animate-bounce whitespace-nowrap shadow-lg flex items-center gap-1.5"
        >
          <span>{speechText}</span>
        </div>
      )}

      {/* Main Three.js WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block absolute inset-0 z-10" />

      {/* Bottom Micro Hint Bar */}
      <div className="absolute bottom-3 z-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-85">
        <span className="px-3 py-1 bg-black/75 dark:bg-black/65 text-white backdrop-blur-sm border border-white/20 rounded-full font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <span>🔄 360° DRAG ROTATE</span>
          <span className="text-pink-400">•</span>
          <span>👀 MOUSE TRACKING</span>
          <span className="text-pink-400">•</span>
          <span>🎉 KLIK INTERAKSI</span>
        </span>
      </div>
    </div>
  );
};

export default VirtualAnimeAvatar;

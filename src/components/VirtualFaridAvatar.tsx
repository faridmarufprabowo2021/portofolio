import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import confetti from 'canvas-confetti';

interface VirtualFaridAvatarProps {
  className?: string;
}

const GREETINGS = [
  'HALO! SAYA FARID 👋',
  'UMS INFORMATICS 2026 🎓',
  'FULL-STACK & AI ARCHITECT ⚡',
  'BRICK BY BRICK! 🧱',
  'READY TO COLLABORATE! 🚀',
  'ALUMNI MAN 1 SURAKARTA 🏫',
];

export const VirtualFaridAvatar: React.FC<VirtualFaridAvatarProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speechBubbleRef = useRef<HTMLDivElement>(null);
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [isWaving, setIsWaving] = useState<boolean>(false);
  const [outfitMode, setOutfitMode] = useState<'ums' | 'cyber' | 'stealth'>('ums');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Three.js object references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const minifigureGroupRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const rightArmGroupRef = useRef<THREE.Group | null>(null);
  const turntableRingRef = useRef<THREE.Mesh | null>(null);
  const torsoFrontDecalRef = useRef<THREE.Mesh | null>(null);

  const mousePosRef = useRef<{ x: number; y: number; isHovered: boolean }>({
    x: 0,
    y: 0,
    isHovered: false,
  });

  const dragRef = useRef<{ isDragging: boolean; startX: number; startRotation: number }>({
    isDragging: false,
    startX: 0,
    startRotation: 0,
  });

  const jumpAnimRef = useRef<{ isJumping: boolean; startTime: number }>({
    isJumping: false,
    startTime: 0,
  });

  const waveAnimRef = useRef<{ isWaving: boolean; startTime: number }>({
    isWaving: false,
    startTime: 0,
  });

  const speechTimeoutRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Generate Ultra High-Res Face Canvas Texture (1024x1024)
  const createFaceTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    // Base Glossy Lego Yellow
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 0, 1024, 1024);

    // Warm radial glow on cheeks
    const grad = ctx.createRadialGradient(512, 580, 60, 512, 580, 440);
    grad.addColorStop(0, 'rgba(255, 175, 50, 0.15)');
    grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Eyebrows
    ctx.fillStyle = '#1A1818';
    ctx.beginPath();
    ctx.moveTo(310, 350);
    ctx.quadraticCurveTo(390, 315, 455, 355);
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1A1818';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(569, 355);
    ctx.quadraticCurveTo(634, 315, 714, 350);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#12141A';
    ctx.beginPath();
    ctx.ellipse(380, 435, 34, 44, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(644, 435, 34, 44, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big Catchlights
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(368, 420, 14, 0, Math.PI * 2);
    ctx.arc(632, 420, 14, 0, Math.PI * 2);
    ctx.fill();

    // Secondary Catchlights
    ctx.beginPath();
    ctx.arc(392, 452, 7, 0, Math.PI * 2);
    ctx.arc(656, 452, 7, 0, Math.PI * 2);
    ctx.fill();

    // Soft Blush
    ctx.fillStyle = 'rgba(255, 90, 70, 0.25)';
    ctx.beginPath();
    ctx.ellipse(310, 515, 44, 26, 0, 0, Math.PI * 2);
    ctx.ellipse(714, 515, 44, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Warm Confident Smile
    ctx.strokeStyle = '#1A1818';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(512, 535, 115, 0.2 * Math.PI, 0.8 * Math.PI, false);
    ctx.stroke();

    // Dimples
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(414, 595, 14, 0.8 * Math.PI, 1.4 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(610, 595, 14, 1.6 * Math.PI, 2.2 * Math.PI);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Generate High-DPI Torso Print Texture (Biru Telur Asin UMS / Cyber / Stealth)
  const createTorsoTexture = useCallback((mode: 'ums' | 'cyber' | 'stealth') => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    if (mode === 'ums') {
      // --- 1. AUTHENTIC JAS ALMAMATER UMS (BIRU TELUR ASIN / EGGSHELL CYAN-BLUE) ---
      const almamaterCyan = '#008E9B'; // Vibrant Biru Telur Asin UMS
      const almamaterDarkCyan = '#00626B';

      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      bgGrad.addColorStop(0, almamaterCyan);
      bgGrad.addColorStop(1, almamaterDarkCyan);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Inner White Collared Shirt V-Shape
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(350, 0);
      ctx.lineTo(512, 390);
      ctx.lineTo(674, 0);
      ctx.closePath();
      ctx.fill();

      // Shirt Collar Wings with drop shadows
      ctx.fillStyle = '#F0F3F6';
      ctx.beginPath();
      ctx.moveTo(350, 0);
      ctx.lineTo(435, 165);
      ctx.lineTo(512, 105);
      ctx.lineTo(589, 165);
      ctx.lineTo(674, 0);
      ctx.closePath();
      ctx.fill();

      // Formal Black Tie
      ctx.fillStyle = '#14171F';
      ctx.beginPath();
      ctx.moveTo(486, 105);
      ctx.lineTo(538, 105);
      ctx.lineTo(546, 155);
      ctx.lineTo(512, 180);
      ctx.lineTo(478, 155);
      ctx.closePath();
      ctx.fill();

      // Tie Body
      ctx.beginPath();
      ctx.moveTo(492, 175);
      ctx.lineTo(532, 175);
      ctx.lineTo(546, 440);
      ctx.lineTo(512, 495);
      ctx.lineTo(478, 440);
      ctx.closePath();
      ctx.fill();

      // Gold Tie Bar Clip
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(490, 275, 44, 12);

      // Notch Lapel Collars of Jas Almamater
      ctx.fillStyle = almamaterCyan;
      ctx.strokeStyle = '#004A52';
      ctx.lineWidth = 10;

      // Left Lapel (Viewer's Left = Character's Right)
      ctx.beginPath();
      ctx.moveTo(330, 0);
      ctx.lineTo(425, 245);
      ctx.lineTo(380, 280);
      ctx.lineTo(504, 500);
      ctx.lineTo(504, 1024);
      ctx.lineTo(0, 1024);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Lapel (Viewer's Right = Character's Left)
      ctx.beginPath();
      ctx.moveTo(694, 0);
      ctx.lineTo(599, 245);
      ctx.lineTo(644, 280);
      ctx.lineTo(520, 500);
      ctx.lineTo(520, 1024);
      ctx.lineTo(1024, 1024);
      ctx.lineTo(1024, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // --- SEBELAH KANAN BAJU (DADA KANAN): TULISAN RESMI "UMS" BESAR EMAS ---
      ctx.fillStyle = '#00727D';
      ctx.beginPath();
      ctx.roundRect(85, 430, 290, 145, 18);
      ctx.fill();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Tulisan "UMS" Besar & Jelas
      ctx.fillStyle = '#FFD700';
      ctx.font = '900 62px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('UMS', 230, 505);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('SURAKARTA', 230, 548);

      // Name Tag Di Bawah UMS: "FARID M.P."
      ctx.fillStyle = '#12141A';
      ctx.beginPath();
      ctx.roundRect(85, 595, 290, 70, 12);
      ctx.fill();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#FFD700';
      ctx.font = '900 26px "Space Mono", monospace';
      ctx.fillText('FARID M.P.', 230, 640);

      // --- SEBELAH KIRI BAJU (DADA KIRI): EMBLEM MATAHARI EMAS UMS ---
      ctx.fillStyle = '#00727D';
      ctx.beginPath();
      ctx.roundRect(645, 430, 290, 280, [18, 18, 42, 42]);
      ctx.fill();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Lambang Surya Muhammadiyah Emas
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(790, 535, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#008E9B';
      ctx.beginPath();
      ctx.arc(790, 535, 54, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFD700';
      ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('UMS', 790, 545);

      ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('INFORMATIKA', 790, 638);
      ctx.fillStyle = '#FFD700';
      ctx.fillText('CLASS OF 2026', 790, 668);

      // --- 3 KANCING EMAS TIMBUL DI TENGAH ---
      [565, 725, 885].forEach((btnY) => {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(512, btnY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.fillStyle = '#B8860B';
        ctx.beginPath();
        ctx.arc(512, btnY, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      // Saku Bawah Kiri & Kanan
      ctx.fillStyle = '#00727D';
      ctx.strokeStyle = '#004A52';
      ctx.lineWidth = 5;
      ctx.roundRect(70, 790, 250, 44, 8);
      ctx.fill();
      ctx.stroke();

      ctx.roundRect(704, 790, 250, 44, 8);
      ctx.fill();
      ctx.stroke();

    } else {
      // --- 2. CYBER & STEALTH DEV HOODIE STYLES ---
      const isCyber = mode === 'cyber';
      const bgColor = isCyber ? '#0B1120' : '#14171F';
      const accentColor = isCyber ? '#00DFD8' : '#FF3B30';
      const textColor = isCyber ? '#00DFD8' : '#F3F4F6';

      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      bgGrad.addColorStop(0, bgColor);
      bgGrad.addColorStop(1, '#05070B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Hoodie Seams
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(320, 0);
      ctx.lineTo(512, 180);
      ctx.lineTo(704, 0);
      ctx.stroke();

      // Zipper
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(512, 180);
      ctx.lineTo(512, 1024);
      ctx.stroke();

      // Center Badge
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.roundRect(160, 420, 704, 360, 36);
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = accentColor;
      ctx.stroke();

      ctx.fillStyle = accentColor;
      ctx.font = '900 72px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText("FARID // DEV", 512, 530);

      ctx.fillStyle = textColor;
      ctx.font = '700 44px "Space Mono", monospace';
      ctx.fillText(isCyber ? "AI & CLOUD ARCHITECT" : "UMS INFORMATICS '26", 512, 620);

      ctx.fillStyle = accentColor;
      ctx.font = '900 38px "Space Mono", monospace';
      ctx.fillText("BRICK BY BRICK", 512, 700);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Initialize Three.js Studio Scene and load the 3D GLB Model
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Studio Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 6.5);
    camera.lookAt(0, 0.1, 0);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 3. Studio HDRI Reflection Environment (Clearcoat Gloss)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // 4. Studio Cinematic 3-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ed, 2.6);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d8ff, 1.3);
    fillLight.position.set(-5, 3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd700, 2.2);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // 5. Load the standalone 3D GLB Model Asset
    const loader = new GLTFLoader();
    loader.load(
      '/assets/farid_lego_avatar.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.74, 0.74, 0.74);
        model.position.set(0, -1.05, 0);
        scene.add(model);
        minifigureGroupRef.current = model;

        // Dynamic High-Res Textures
        const faceTex = createFaceTexture();
        const torsoTex = createTorsoTexture(outfitMode);
        const umsJacketColor = outfitMode === 'ums' ? 0x008E9B : outfitMode === 'cyber' ? 0x0B1120 : 0x14171F;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.name === 'HeadMesh') {
              child.material = new THREE.MeshPhysicalMaterial({
                map: faceTex,
                color: 0xffffff, // White base so face canvas colors remain 100% vibrant
                roughness: 0.12,
                metalness: 0.02,
                clearcoat: 1.0,
                clearcoatRoughness: 0.08,
              });
            } else if (child.name === 'TorsoFrontDecal') {
              torsoFrontDecalRef.current = child;
              child.material = new THREE.MeshPhysicalMaterial({
                map: torsoTex,
                color: 0xffffff, // White base so UMS cyan, gold and white shirt render with exact fidelity
                roughness: 0.2,
                metalness: 0.05,
                clearcoat: 0.8,
                clearcoatRoughness: 0.15,
              });
            } else if (child.name === 'TorsoBackDecal') {
              child.material = new THREE.MeshPhysicalMaterial({
                color: umsJacketColor,
                roughness: 0.28,
                metalness: 0.05,
                clearcoat: 0.6,
              });
            } else if (child.name === 'Torso') {
              child.material = new THREE.MeshPhysicalMaterial({
                color: umsJacketColor,
                roughness: 0.28,
                metalness: 0.05,
                clearcoat: 0.6,
              });
            } else if (child.name === 'NeonRing') {
              turntableRingRef.current = child;
            } else if (child.name.includes('RightArm') || child.name.includes('LeftArm') || child.name.includes('Shoulder')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: umsJacketColor,
                roughness: 0.28,
                metalness: 0.05,
                clearcoat: 0.6,
              });
            } else if (child.name.includes('Hair')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x16171a,
                roughness: 0.22,
                metalness: 0.15,
                clearcoat: 1.0,
                clearcoatRoughness: 0.12,
              });
            } else if (child.name.includes('Glasses') || child.name.includes('Frame') || child.name.includes('Temple') || child.name.includes('Bridge')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x111317,
                roughness: 0.1,
                metalness: 0.9,
                clearcoat: 1.0,
              });
            } else if (child.name.includes('Pedestal')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x12141a,
                roughness: 0.15,
                metalness: 0.85,
                clearcoat: 1.0,
              });
            } else if (child.name.includes('Yellow') || child.name.includes('Stud') || child.name.includes('Clamp') || child.name.includes('Mug') || child.name.includes('Wrist') || child.name.includes('Neck')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0xffd700,
                roughness: 0.12,
                metalness: 0.05,
                clearcoat: 1.0,
                clearcoatRoughness: 0.08,
                reflectivity: 0.9,
              });
            } else if (child.name.includes('Leg') || child.name.includes('Hips') || child.name.includes('Toe')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x121418,
                roughness: 0.18,
                metalness: 0.08,
                clearcoat: 0.9,
                clearcoatRoughness: 0.1,
              });
            }
          }

          if (child.name === 'HeadGroup') {
            headGroupRef.current = child as THREE.Group;
          }
          if (child.name === 'RightArmGroup') {
            rightArmGroupRef.current = child as THREE.Group;
          }
        });

        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error('Error loading 3D Lego avatar GLB:', err);
        setIsLoading(false);
      }
    );

    // 6. Animation Render Loop
    let animId: number;

    const render = () => {
      if (!isVisibleRef.current) {
        animId = requestAnimationFrame(render);
        return;
      }

      const now = performance.now();
      const timeSec = now * 0.001;

      // Rotate Turntable Neon Ring slowly
      if (turntableRingRef.current) {
        turntableRingRef.current.rotation.z += 0.015;
      }

      // 1. Mouse Head Tracking (Smooth Lerp)
      if (headGroupRef.current) {
        const mouse = mousePosRef.current;
        const targetRotY = mouse.isHovered ? mouse.x * 0.95 : Math.sin(timeSec * 0.7) * 0.22;
        const targetRotX = mouse.isHovered ? -mouse.y * 0.48 : Math.cos(timeSec * 1.1) * 0.08;

        headGroupRef.current.rotation.y += (targetRotY - headGroupRef.current.rotation.y) * 0.085;
        headGroupRef.current.rotation.x += (targetRotX - headGroupRef.current.rotation.x) * 0.085;
      }

      // 2. Idle Torso & Natural Breathing Sway
      if (minifigureGroupRef.current && !dragRef.current.isDragging) {
        const breathing = Math.sin(timeSec * 2.4) * 0.015;
        const idleSway = Math.sin(timeSec * 1.2) * 0.035;
        minifigureGroupRef.current.position.y = -1.05 + breathing;
        minifigureGroupRef.current.rotation.z = idleSway;
      }

      // 3. Jump Animation
      if (jumpAnimRef.current.isJumping && minifigureGroupRef.current) {
        const elapsed = (now - jumpAnimRef.current.startTime) / 520;
        if (elapsed < 1) {
          const jumpHeight = Math.sin(elapsed * Math.PI) * 0.42;
          minifigureGroupRef.current.position.y = -1.05 + jumpHeight;
        } else {
          jumpAnimRef.current.isJumping = false;
          minifigureGroupRef.current.position.y = -1.05;
        }
      }

      // 4. Waving Animation
      if (waveAnimRef.current.isWaving && rightArmGroupRef.current) {
        const waveElapsed = (now - waveAnimRef.current.startTime) / 1400;
        if (waveElapsed < 1) {
          const wavePhase = Math.sin(waveElapsed * Math.PI * 6);
          rightArmGroupRef.current.rotation.z = -Math.PI * 0.82 + wavePhase * 0.38;
          rightArmGroupRef.current.rotation.x = Math.sin(waveElapsed * Math.PI * 4) * 0.25;
        } else {
          waveAnimRef.current.isWaving = false;
          rightArmGroupRef.current.rotation.z = 0;
          rightArmGroupRef.current.rotation.x = 0;
          setIsWaving(false);
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!container || !renderer) return;
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
  }, [createFaceTexture, createTorsoTexture, outfitMode]);

  // Viewport Observer
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

    if (dragRef.current.isDragging && minifigureGroupRef.current) {
      const deltaX = (e.clientX - dragRef.current.startX) * 0.015;
      minifigureGroupRef.current.rotation.y = dragRef.current.startRotation + deltaX;
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
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startRotation: minifigureGroupRef.current?.rotation.y ?? 0,
    };
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now();

    jumpAnimRef.current = { isJumping: true, startTime: now };
    waveAnimRef.current = { isWaving: true, startTime: now };
    setIsWaving(true);

    const msg = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setSpeechText(msg);

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = window.setTimeout(() => {
      setSpeechText(null);
    }, 2400);

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 28,
      spread: 70,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#008E9B', '#FFD700', '#00DFD8', '#AF101A'],
      shapes: ['square'],
      scalar: 0.9,
    });
  };

  const handleCycleOutfit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const modes: ('ums' | 'cyber' | 'stealth')[] = ['ums', 'cyber', 'stealth'];
    const next = modes[(modes.indexOf(outfitMode) + 1) % modes.length];
    setOutfitMode(next);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      className={`relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-[440px] bg-gradient-to-b from-[#FFFFFF] via-[#F3F4F6] to-[#E5E7EB] dark:from-[#181B26] dark:via-[#12141D] dark:to-[#090A0E] border-4 border-on-surface dark:border-[#2A2F3D] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-2xl flex flex-col items-center justify-center group ${className}`}
      title="Click to wave & jump! Drag horizontally to rotate 360°"
    >
      {/* Soft Vignette & Studio Lighting Accent */}
      <div className="absolute inset-0 bg-radial-gradient opacity-25 pointer-events-none" />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-[#F3F4F6]/90 dark:bg-[#12141D]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brick-yellow border-2 border-on-surface animate-spin" />
          <span className="font-mono text-xs font-bold text-on-surface dark:text-white">LOADING 3D FARID...</span>
        </div>
      )}

      {/* Top HUD Badges */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <span className="px-2.5 py-1 bg-brick-yellow text-on-surface font-mono text-[10px] font-black uppercase rounded-md border-2 border-on-surface shadow-sm flex items-center gap-1.5 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>{isWaving ? '👋 SAYS HI!' : 'VIRTUAL FARID 3D'}</span>
        </span>

        {/* Outfit Changer Button */}
        <button
          onClick={handleCycleOutfit}
          type="button"
          aria-label="Cycle outfit theme"
          title="Change outfit style"
          className="px-2.5 py-1 bg-white dark:bg-[#1E222B] text-on-surface dark:text-white hover:bg-brick-yellow hover:text-on-surface font-mono text-[10px] font-bold uppercase rounded-md border-2 border-on-surface dark:border-[#2A2F3D] shadow-sm pointer-events-auto transition-colors cursor-pointer"
        >
          {outfitMode === 'ums' ? '🎓 ALMAMATER UMS' : outfitMode === 'cyber' ? '⚡ CYBER DEV' : '🥷 STEALTH TECH'}
        </button>
      </div>

      {/* Dynamic Floating Speech Bubble */}
      {speechText && (
        <div
          ref={speechBubbleRef}
          className="absolute top-12 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 bg-brick-yellow text-on-surface border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase tracking-wide brick-shadow-sm pointer-events-none animate-bounce whitespace-nowrap shadow-lg flex items-center gap-1.5"
        >
          <span>{speechText}</span>
        </div>
      )}

      {/* Main Three.js WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block absolute inset-0 z-10"
      />

      {/* Bottom Micro Hint Bar */}
      <div className="absolute bottom-3 z-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-85">
        <span className="px-3 py-1 bg-black/75 dark:bg-black/65 text-white backdrop-blur-sm border border-white/20 rounded-full font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <span>👀 CURSOR TRACKING</span>
          <span className="text-brick-yellow">•</span>
          <span>👋 CLICK TO WAVE</span>
          <span className="text-brick-yellow">•</span>
          <span>🔄 360° DRAG</span>
        </span>
      </div>
    </div>
  );
};

export default VirtualFaridAvatar;

import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Polyfill FileReader for Node.js
if (typeof global.FileReader === 'undefined') {
  class FileReaderPolyfill {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
        if (this.onload) this.onload();
      });
    }
  }
  global.FileReader = FileReaderPolyfill;
}

async function createModel() {
  const rootScene = new THREE.Scene();
  rootScene.name = 'LegoMinifigureFarid';

  // Standard Materials
  const legoYellowMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.15,
    metalness: 0.05,
    name: 'Mat_LegoYellow',
  });

  const legoBlackMat = new THREE.MeshStandardMaterial({
    color: 0x14161a,
    roughness: 0.2,
    metalness: 0.1,
    name: 'Mat_LegoBlack',
  });

  const legoHairMat = new THREE.MeshStandardMaterial({
    color: 0x16181d,
    roughness: 0.25,
    metalness: 0.15,
    name: 'Mat_LegoHair',
  });

  const blazerClothMat = new THREE.MeshStandardMaterial({
    color: 0x008e9b, // Biru Telur Asin UMS
    roughness: 0.28,
    metalness: 0.05,
    name: 'Mat_UMSBlazer',
  });

  const glassesFrameMat = new THREE.MeshStandardMaterial({
    color: 0x0f1115,
    roughness: 0.12,
    metalness: 0.9,
    name: 'Mat_GlassesFrame',
  });

  // Minifigure Root Group
  const minifigure = new THREE.Group();
  minifigure.name = 'Minifigure';
  rootScene.add(minifigure);

  // 1. Pedestal Base
  const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.75, 0.2, 48);
  const pedestalMesh = new THREE.Mesh(pedestalGeo, legoBlackMat);
  pedestalMesh.name = 'Pedestal';
  pedestalMesh.position.y = -0.1;
  minifigure.add(pedestalMesh);

  // Glowing Neon Cyan Ring
  const ringGeo = new THREE.TorusGeometry(1.62, 0.04, 16, 48);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00dfd8, name: 'Mat_NeonRing' });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.name = 'NeonRing';
  ringMesh.rotation.x = Math.PI / 2;
  minifigure.add(ringMesh);

  // 4 Base Studs
  const studGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 24);
  const studOffsets = [
    [-0.7, 0.07, -0.65],
    [0.7, 0.07, -0.65],
    [-0.7, 0.07, 0.65],
    [0.7, 0.07, 0.65],
  ];
  studOffsets.forEach(([sx, sy, sz], i) => {
    const s = new THREE.Mesh(studGeo, legoYellowMat);
    s.name = `BaseStud_${i + 1}`;
    s.position.set(sx, sy, sz);
    minifigure.add(s);
  });

  // 2. Legs & Hips
  const hipsGeo = new THREE.BoxGeometry(1.12, 0.34, 0.68);
  const hipsMesh = new THREE.Mesh(hipsGeo, legoBlackMat);
  hipsMesh.name = 'Hips';
  hipsMesh.position.set(0, 0.96, 0);
  minifigure.add(hipsMesh);

  const legGeo = new THREE.BoxGeometry(0.48, 0.88, 0.6);
  const leftLeg = new THREE.Mesh(legGeo, legoBlackMat);
  leftLeg.name = 'LeftLeg';
  leftLeg.position.set(-0.31, 0.46, 0);
  minifigure.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, legoBlackMat);
  rightLeg.name = 'RightLeg';
  rightLeg.position.set(0.31, 0.46, 0);
  minifigure.add(rightLeg);

  const toeGeo = new THREE.BoxGeometry(0.48, 0.24, 0.24);
  const leftToe = new THREE.Mesh(toeGeo, legoBlackMat);
  leftToe.name = 'LeftToe';
  leftToe.position.set(-0.31, 0.12, 0.38);
  minifigure.add(leftToe);

  const rightToe = new THREE.Mesh(toeGeo, legoBlackMat);
  rightToe.name = 'RightToe';
  rightToe.position.set(0.31, 0.12, 0.38);
  minifigure.add(rightToe);

  // 3. Torso (Filleted Trapezoid in Biru Telur Asin UMS)
  const torsoShape = new THREE.Shape();
  torsoShape.moveTo(-0.6, -0.62);
  torsoShape.lineTo(0.6, -0.62);
  torsoShape.lineTo(0.47, 0.62);
  torsoShape.lineTo(-0.47, 0.62);
  torsoShape.closePath();

  const torsoExtrudeSettings = {
    depth: 0.64,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  };
  const torsoGeo = new THREE.ExtrudeGeometry(torsoShape, torsoExtrudeSettings);
  torsoGeo.center();

  const torsoMesh = new THREE.Mesh(torsoGeo, blazerClothMat);
  torsoMesh.name = 'Torso';
  torsoMesh.position.set(0, 1.76, 0);
  minifigure.add(torsoMesh);

  // Front Decal Plane (Exact alignment with front face for 100% crisp, unclipped texture display)
  const frontDecalGeo = new THREE.PlaneGeometry(1.08, 1.28);
  const frontDecalMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.05,
    name: 'Mat_TorsoFrontDecal',
  });
  const frontDecalMesh = new THREE.Mesh(frontDecalGeo, frontDecalMat);
  frontDecalMesh.name = 'TorsoFrontDecal';
  frontDecalMesh.position.set(0, 1.76, 0.328);
  minifigure.add(frontDecalMesh);

  // Back Decal Plane
  const backDecalGeo = new THREE.PlaneGeometry(1.08, 1.28);
  const backDecalMesh = new THREE.Mesh(backDecalGeo, frontDecalMat);
  backDecalMesh.name = 'TorsoBackDecal';
  backDecalMesh.rotation.y = Math.PI;
  backDecalMesh.position.set(0, 1.76, -0.328);
  minifigure.add(backDecalMesh);

  // Neck Pin
  const neckPinGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.2, 24);
  const neckPin = new THREE.Mesh(neckPinGeo, legoYellowMat);
  neckPin.name = 'NeckPin';
  neckPin.position.set(0, 2.44, 0);
  minifigure.add(neckPin);

  // 4. Head Group (Animatable)
  const headGroup = new THREE.Group();
  headGroup.name = 'HeadGroup';
  headGroup.position.set(0, 2.82, 0);
  minifigure.add(headGroup);

  const headGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.74, 36);
  const headMesh = new THREE.Mesh(headGeo, legoYellowMat);
  headMesh.name = 'HeadMesh';
  headMesh.rotation.y = -Math.PI / 2;
  headGroup.add(headMesh);

  const headStudGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.18, 24);
  const headStud = new THREE.Mesh(headStudGeo, legoYellowMat);
  headStud.name = 'HeadTopStud';
  headStud.position.y = 0.46;
  headGroup.add(headStud);

  // 3D Glasses
  const glassesGroup = new THREE.Group();
  glassesGroup.name = 'Glasses';
  glassesGroup.position.set(0, 0.08, 0.48);

  const lensFrameGeo = new THREE.TorusGeometry(0.15, 0.035, 12, 24);
  const leftFrame = new THREE.Mesh(lensFrameGeo, glassesFrameMat);
  leftFrame.name = 'LeftLensFrame';
  leftFrame.position.set(-0.21, 0, 0);
  glassesGroup.add(leftFrame);

  const rightFrame = new THREE.Mesh(lensFrameGeo, glassesFrameMat);
  rightFrame.name = 'RightLensFrame';
  rightFrame.position.set(0.21, 0, 0);
  glassesGroup.add(rightFrame);

  const bridgeGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.16, 12);
  const bridge = new THREE.Mesh(bridgeGeo, glassesFrameMat);
  bridge.name = 'GlassesBridge';
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, 0.04, 0);
  glassesGroup.add(bridge);

  const templeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.44, 12);
  const leftTemple = new THREE.Mesh(templeGeo, glassesFrameMat);
  leftTemple.name = 'LeftTemple';
  leftTemple.rotation.x = Math.PI / 2;
  leftTemple.position.set(-0.36, 0.02, -0.22);
  glassesGroup.add(leftTemple);

  const rightTemple = new THREE.Mesh(templeGeo, glassesFrameMat);
  rightTemple.name = 'RightTemple';
  rightTemple.rotation.x = Math.PI / 2;
  rightTemple.position.set(0.36, 0.02, -0.22);
  glassesGroup.add(rightTemple);

  headGroup.add(glassesGroup);

  // 3D Sculpted Hairpiece
  const hairGroup = new THREE.Group();
  hairGroup.name = 'Hair';
  hairGroup.position.set(0, 0.28, 0);

  const capGeo = new THREE.SphereGeometry(0.48, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
  const mainCap = new THREE.Mesh(capGeo, legoHairMat);
  mainCap.name = 'HairMainCap';
  mainCap.position.set(0, 0.12, -0.04);
  hairGroup.add(mainCap);

  const quiff1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.38, 8, 16), legoHairMat);
  quiff1.name = 'HairQuiff1';
  quiff1.rotation.z = -Math.PI / 4;
  quiff1.rotation.x = Math.PI / 7;
  quiff1.position.set(0.16, 0.38, 0.24);
  hairGroup.add(quiff1);

  const quiff2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.32, 8, 16), legoHairMat);
  quiff2.name = 'HairQuiff2';
  quiff2.rotation.z = -Math.PI / 6;
  quiff2.rotation.y = -Math.PI / 8;
  quiff2.position.set(-0.14, 0.36, 0.22);
  hairGroup.add(quiff2);

  const leftSideHair = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.32, 8, 12), legoHairMat);
  leftSideHair.name = 'HairLeftSide';
  leftSideHair.position.set(-0.46, 0.04, 0.02);
  hairGroup.add(leftSideHair);

  const rightSideHair = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.32, 8, 12), legoHairMat);
  rightSideHair.name = 'HairRightSide';
  rightSideHair.position.set(0.46, 0.04, 0.02);
  hairGroup.add(rightSideHair);

  headGroup.add(hairGroup);

  // 5. Arms & Hands
  // Right Arm (Waving Arm)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.name = 'RightArmGroup';
  rightArmGroup.position.set(0.62, 2.2, 0);
  minifigure.add(rightArmGroup);

  const shoulderGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const rightShoulder = new THREE.Mesh(shoulderGeo, blazerClothMat);
  rightShoulder.name = 'RightShoulder';
  rightArmGroup.add(rightShoulder);

  const armGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.74, 16);
  const rightArmMesh = new THREE.Mesh(armGeo, blazerClothMat);
  rightArmMesh.name = 'RightArm';
  rightArmMesh.position.set(0.18, -0.34, 0);
  rightArmMesh.rotation.z = -Math.PI / 7;
  rightArmGroup.add(rightArmMesh);

  const handGroup = new THREE.Group();
  handGroup.name = 'RightHandGroup';
  handGroup.position.set(0.34, -0.72, 0);

  const wristGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.16, 16);
  const wristMesh = new THREE.Mesh(wristGeo, legoYellowMat);
  wristMesh.name = 'RightWrist';
  handGroup.add(wristMesh);

  const clampGeo = new THREE.TorusGeometry(0.17, 0.07, 12, 24, Math.PI * 1.55);
  const clampMesh = new THREE.Mesh(clampGeo, legoYellowMat);
  clampMesh.name = 'RightHandClamp';
  clampMesh.rotation.z = Math.PI / 2;
  clampMesh.position.y = -0.14;
  handGroup.add(clampMesh);

  // Accessory: Yellow Lego Coffee Mug
  const mugGroup = new THREE.Group();
  mugGroup.name = 'CoffeeMug';
  mugGroup.position.set(0, -0.16, 0.24);

  const mugBodyGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.26, 16);
  const mugMesh = new THREE.Mesh(mugBodyGeo, legoYellowMat);
  mugMesh.name = 'MugBody';
  mugGroup.add(mugMesh);

  const handleGeo = new THREE.TorusGeometry(0.09, 0.035, 8, 16, Math.PI);
  const handleMesh = new THREE.Mesh(handleGeo, legoYellowMat);
  handleMesh.name = 'MugHandle';
  handleMesh.rotation.y = Math.PI / 2;
  handleMesh.position.set(0.15, 0, 0);
  mugGroup.add(handleMesh);

  handGroup.add(mugGroup);
  rightArmGroup.add(handGroup);

  // Left Arm
  const leftArmGroup = new THREE.Group();
  leftArmGroup.name = 'LeftArmGroup';
  leftArmGroup.position.set(-0.62, 2.2, 0);
  minifigure.add(leftArmGroup);

  const leftShoulder = new THREE.Mesh(shoulderGeo, blazerClothMat);
  leftShoulder.name = 'LeftShoulder';
  leftArmGroup.add(leftShoulder);

  const leftArmMesh = new THREE.Mesh(armGeo, blazerClothMat);
  leftArmMesh.name = 'LeftArm';
  leftArmMesh.position.set(-0.18, -0.34, 0);
  leftArmMesh.rotation.z = Math.PI / 7;
  leftArmGroup.add(leftArmMesh);

  const leftHandGroup = new THREE.Group();
  leftHandGroup.name = 'LeftHandGroup';
  leftHandGroup.position.set(-0.34, -0.72, 0);

  const leftWrist = new THREE.Mesh(wristGeo, legoYellowMat);
  leftWrist.name = 'LeftWrist';
  leftHandGroup.add(leftWrist);

  const leftClamp = new THREE.Mesh(clampGeo, legoYellowMat);
  leftClamp.name = 'LeftHandClamp';
  leftClamp.rotation.z = Math.PI / 2;
  leftClamp.position.y = -0.14;
  leftHandGroup.add(leftClamp);
  leftArmGroup.add(leftHandGroup);

  // Export to GLB
  const exporter = new GLTFExporter();
  const outputPath = path.join(process.cwd(), 'public', 'assets', 'farid_lego_avatar.glb');

  exporter.parse(
    rootScene,
    (gltf) => {
      const buffer = Buffer.from(gltf);
      fs.writeFileSync(outputPath, buffer);
      console.log(`GLB exported successfully to: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    },
    (err) => {
      console.error('Error exporting GLB:', err);
    },
    { binary: true }
  );
}

createModel().catch(console.error);

import * as THREE from 'three';

export function createLanyardCardTexture(imageSrc = '/images.webp'): THREE.CanvasTexture {
  const width = 2048;
  const height = 2048;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const cardW = 1024;
  const cardH = 1546;

  const renderCard = (loadedImg?: HTMLImageElement) => {
    // Clear
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // ==========================================
    // 1. DRAW FRONT CARD (Left Half)
    // ==========================================
    ctx.save();
    ctx.translate(0, 0);

    // Background base
    ctx.fillStyle = '#FDFDFD';
    ctx.fillRect(0, 0, cardW, cardH);

    // Subtle Lego Dot Baseplate pattern
    ctx.fillStyle = 'rgba(26, 28, 28, 0.06)';
    const dotSpacing = 32;
    for (let x = 30; x < cardW - 30; x += dotSpacing) {
      for (let y = 30; y < cardH - 30; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Heavy Ink Border
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(20, 20, cardW - 40, cardH - 40);

    // Top Header Banner (Lego Red)
    ctx.fillStyle = '#AF101A';
    ctx.fillRect(30, 30, cardW - 60, 240);

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(30, 30, cardW - 60, 240);

    // Header Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNIVERSITAS MUHAMMADIYAH SURAKARTA', cardW / 2, 95);

    ctx.font = 'bold 26px "Space Mono", monospace';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('FAKULTAS KOMUNIKASI & INFORMATIKA', cardW / 2, 145);

    ctx.font = 'bold 22px "Space Mono", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('KARTU IDENTITAS MAHASISWA BARU • 2026', cardW / 2, 195);

    // 4 Corner Lego Studs
    const studs = [
      [75, 75],
      [cardW - 75, 75],
      [75, cardH - 75],
      [cardW - 75, cardH - 75],
    ];
    studs.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#1A1C1C';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sx, sy, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF275';
      ctx.fill();
    });

    // Center Photo Frame
    const photoX = cardW / 2 - 200;
    const photoY = 300;
    const photoW = 400;
    const photoH = 490;

    // Shadow
    ctx.fillStyle = '#1A1C1C';
    ctx.fillRect(photoX + 16, photoY + 16, photoW, photoH);

    // Frame (Brick Blue)
    ctx.fillStyle = '#0055A4';
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // Photo Inner Area
    const innerX = photoX + 16;
    const innerY = photoY + 16;
    const innerW = photoW - 32;
    const innerH = photoH - 32;

    if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(innerX, innerY, innerW, innerH);
      ctx.clip();

      const imgAspect = loadedImg.naturalWidth / loadedImg.naturalHeight;
      const targetAspect = innerW / innerH;
      let drawW = innerW;
      let drawH = innerH;
      let drawX = innerX;
      let drawY = innerY;

      if (imgAspect > targetAspect) {
        drawW = innerH * imgAspect;
        drawX = innerX + (innerW - drawW) / 2;
      } else {
        drawH = innerW / imgAspect;
        drawY = innerY + (innerH - drawH) / 2;
      }

      ctx.drawImage(loadedImg, drawX, drawY, drawW, drawH);
      ctx.restore();

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#1A1C1C';
      ctx.strokeRect(innerX, innerY, innerW, innerH);
    } else {
      ctx.fillStyle = '#1A1C1C';
      ctx.fillRect(innerX, innerY, innerW, innerH);
      ctx.fillStyle = '#FFD700';
      ctx.font = '900 130px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FMP', cardW / 2, photoY + 250);
    }

    // Gold Security Microchip (RFID)
    const chipX = 90;
    const chipY = 820;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(chipX, chipY, 110, 80);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(chipX, chipY, 110, 80);
    ctx.beginPath();
    ctx.moveTo(chipX + 35, chipY);
    ctx.lineTo(chipX + 35, chipY + 80);
    ctx.moveTo(chipX + 75, chipY);
    ctx.lineTo(chipX + 75, chipY + 80);
    ctx.moveTo(chipX, chipY + 40);
    ctx.lineTo(chipX + 110, chipY + 40);
    ctx.stroke();

    // Name Box
    ctx.fillStyle = '#1A1C1C';
    ctx.font = '900 46px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("FARID MA'RUF PRABOWO", cardW / 2, 850);

    // Role Tag Banner
    ctx.fillStyle = '#AF101A';
    ctx.fillRect(cardW / 2 - 260, 885, 520, 56);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(cardW / 2 - 260, 885, 520, 56);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px "Space Mono", monospace';
    ctx.fillText('FULL-STACK & AI ENGINEER', cardW / 2, 924);

    // Academic Details Box
    ctx.fillStyle = '#EEEEEE';
    ctx.fillRect(70, 975, cardW - 140, 160);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(70, 975, cardW - 140, 160);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1A1C1C';
    ctx.font = 'bold 22px "Space Mono", monospace';
    ctx.fillText('PROGRAM STUDI : S1 TEKNIK INFORMATIKA (UMS)', 100, 1020);
    ctx.fillText('ASAL SEKOLAH  : MAN 1 SURAKARTA (ALUMNI 2026)', 100, 1060);
    ctx.fillText('STATUS        : MAHASISWA BARU (BATCH 2026)', 100, 1100);

    // Barcode Container
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(70, 1170, cardW - 140, 200);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(70, 1170, cardW - 140, 200);

    // Draw Barcode
    ctx.fillStyle = '#1A1C1C';
    const barXStart = 110;
    const barWidthTotal = cardW - 220;
    const barHeights = 110;
    const barY = 1195;

    const pattern = '1011001010111001011010011010101110101100101011100101101001101010111010110010101110010110100110101';
    const singleBarW = barWidthTotal / pattern.length;

    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '1') {
        ctx.fillRect(barXStart + i * singleBarW, barY, singleBarW + 0.5, barHeights);
      }
    }

    ctx.textAlign = 'center';
    ctx.font = 'bold 22px "Space Mono", monospace';
    ctx.fillText('ID: UMS-2026-ENG-88210-FMP // MAN1-SKA', cardW / 2, 1345);

    // Bottom Footer
    ctx.fillStyle = '#00852B';
    ctx.fillRect(30, cardH - 120, cardW - 60, 70);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(30, cardH - 120, cardW - 60, 70);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Space Mono", monospace';
    ctx.fillText('AUTHENTICATED DIGITAL STUDENT ID PASS', cardW / 2, cardH - 76);

    ctx.restore();

    // ==========================================
    // 2. DRAW BACK CARD (Right Half)
    // ==========================================
    ctx.save();
    ctx.translate(cardW, 0);

    // Background
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, cardW, cardH);

    // Dot grid
    ctx.fillStyle = 'rgba(26, 28, 28, 0.06)';
    for (let x = 30; x < cardW - 30; x += dotSpacing) {
      for (let y = 30; y < cardH - 30; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Heavy Border
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(20, 20, cardW - 40, cardH - 40);

    // Header Back
    ctx.fillStyle = '#0055A4';
    ctx.fillRect(30, 30, cardW - 60, 160);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(30, 30, cardW - 60, 160);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IDENTITAS & PORTOFOLIO TEKNOLOGI', cardW / 2, 90);
    ctx.font = 'bold 20px "Space Mono", monospace';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('UNIVERSITAS MUHAMMADIYAH SURAKARTA', cardW / 2, 135);

    // Info paragraphs
    ctx.fillStyle = '#1A1C1C';
    ctx.font = '19px "Work Sans", sans-serif';
    ctx.textAlign = 'left';

    const textLines = [
      '1. Pemegang kartu adalah Mahasiswa Baru S1 Teknik Informatika UMS',
      '   Angkatan 2026 dan Alumni Madrasah Aliyah Negeri (MAN) 1 Surakarta.',
      '2. Telah merancang dan membangun platform nyata skala produksi:',
      '   • Senja CS (WhatsApp Bot & Multi-Tenant CRM SaaS untuk UMKM)',
      '   • UjianCBT (Self-hosted CBT platform & AI Exam Proctoring)',
      '   • SignHand AI (Computer Vision sign language gesture recognition)',
      '   • UMKM Cepat (AI-driven landing page builder untuk UMKM)',
      '3. Kontak kolaborasi: faridmarufprabowo@gmail.com | Surakarta, Jawa Tengah.',
    ];

    let ty = 240;
    textLines.forEach((line) => {
      ctx.fillText(line, 60, ty);
      ty += 34;
    });

    // Tech Stack Matrix Chips on Back
    ctx.fillStyle = '#1A1C1C';
    ctx.font = 'bold 24px "Space Mono", monospace';
    ctx.fillText('CORE COMPETENCIES & REAL STACK', 60, 530);

    const skills = [
      'WHATSAPP BAILEYS',
      'NEXT.JS 15',
      'TYPESCRIPT',
      'FASTIFY 5.0',
      'TURBOREPO',
      'PRISMA / POSTGRES',
      'REDIS CACHE',
      'PYTHON / OPENCV',
      'MEDIAPIPE AI',
      'DOCKER / CI-CD',
      'AI SDK / OPENAI',
      'TAILWIND CSS',
    ];

    let sx = 60;
    let sy = 560;
    skills.forEach((s) => {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(sx, sy, 200, 48);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#1A1C1C';
      ctx.strokeRect(sx, sy, 200, 48);

      ctx.fillStyle = '#1A1C1C';
      ctx.font = 'bold 15px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(s, sx + 100, sy + 30);

      sx += 220;
      if (sx > cardW - 240) {
        sx = 60;
        sy += 65;
      }
    });

    // Hologram Simulation Box
    const holoY = 880;
    const grad = ctx.createLinearGradient(60, holoY, cardW - 120, holoY + 220);
    grad.addColorStop(0, '#00DFD8');
    grad.addColorStop(0.3, '#7928CA');
    grad.addColorStop(0.7, '#FF0080');
    grad.addColorStop(1, '#FFD700');

    ctx.fillStyle = grad;
    ctx.fillRect(60, holoY, cardW - 120, 220);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(60, holoY, cardW - 120, 220);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 42px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("FARID MA'RUF PRABOWO", cardW / 2, holoY + 100);
    ctx.font = 'bold 22px "Space Mono", monospace';
    ctx.fillText('GENUINE DEVELOPER PASS • MAN 1 SURAKARTA ➔ UMS 2026', cardW / 2, holoY + 150);

    // Campus Address
    ctx.fillStyle = '#EEEEEE';
    ctx.fillRect(60, 1140, cardW - 120, 220);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(60, 1140, cardW - 120, 220);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1A1C1C';
    ctx.font = 'bold 20px "Space Mono", monospace';
    ctx.fillText('UNIVERSITAS MUHAMMADIYAH SURAKARTA', 90, 1190);
    ctx.font = '18px "Work Sans", sans-serif';
    ctx.fillText('Jl. A. Yani, Pabelan, Kec. Kartasura, Kab. Sukoharjo,', 90, 1230);
    ctx.fillText('Jawa Tengah 57162, Indonesia.', 90, 1265);
    ctx.fillText('Alumni: MAN 1 Surakarta (Jl. Sumpah Pemuda No. 25, Solo)', 90, 1300);

    // Bottom Warning Strip
    ctx.fillStyle = '#AF101A';
    ctx.fillRect(30, cardH - 120, cardW - 60, 70);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1A1C1C';
    ctx.strokeRect(30, cardH - 120, cardW - 60, 70);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('UMS INFORMATICS • CLASS OF 2026', cardW / 2, cardH - 76);

    ctx.restore();
  };

  renderCard();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.needsUpdate = true;

  if (imageSrc && typeof window !== 'undefined') {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      renderCard(img);
      texture.needsUpdate = true;
    };
  }

  return texture;
}

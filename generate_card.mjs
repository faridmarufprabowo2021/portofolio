import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateCard() {
  const photoPath = path.resolve('public/images.webp');
  const umsLogoPath = path.resolve('public/assets/logo_ums.png');
  const man1LogoPath = path.resolve('public/assets/logo_man1ska.png');

  console.log('Compositing ultra-crisp logos and card graphics...');

  // 1. User photo (580x580)
  const photoBuf = await sharp(photoPath)
    .resize(580, 580, { fit: 'cover', position: 'center' })
    .png()
    .toBuffer();

  const maskSvg = Buffer.from(`
    <svg width="580" height="580" viewBox="0 0 580 580" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="580" height="580" rx="24" fill="#FFFFFF" />
    </svg>
  `);

  const maskedPhoto = await sharp(photoBuf)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Helper to resize transparent PNGs
  async function getTransparentLogo(imgPath, width, height) {
    return await sharp(imgPath)
      .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  // Top studs logos (70x70)
  const man1TopLogo = await getTransparentLogo(man1LogoPath, 70, 70);
  const umsTopLogo = await getTransparentLogo(umsLogoPath, 70, 70);

  // Front badge logos (56x56)
  const umsBadgeLogo = await getTransparentLogo(umsLogoPath, 56, 56);
  const man1BadgeLogo = await getTransparentLogo(man1LogoPath, 56, 56);

  // Back large showcase logos (180x180)
  const umsBackLogo = await getTransparentLogo(umsLogoPath, 184, 184);
  const man1BackLogo = await getTransparentLogo(man1LogoPath, 184, 184);

  // -------------------------------------------------------------
  // FRONT SVG LAYOUT
  // -------------------------------------------------------------
  const svgBase = `
    <svg width="1024" height="1536" viewBox="0 0 1024 1536" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="2.5" fill="#1A1C1C" opacity="0.12" />
        </pattern>
        <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="8" dy="8" stdDeviation="0" flood-color="#1A1C1C" />
        </filter>
        <filter id="smallShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="5" dy="5" stdDeviation="0" flood-color="#1A1C1C" />
        </filter>
      </defs>

      <!-- Card Base Background -->
      <rect width="1024" height="1536" fill="#FBF9F8" />
      <rect width="1024" height="1536" fill="url(#dots)" />

      <!-- Heavy Outer Border -->
      <rect x="24" y="24" width="976" height="1488" rx="36" fill="none" stroke="#1A1C1C" stroke-width="18" />

      <!-- Top Left: MAN 1 SKA Stud Badge -->
      <g transform="translate(50, 48)">
        <rect x="0" y="0" width="138" height="114" rx="16" fill="#0055A4" stroke="#1A1C1C" stroke-width="8" filter="url(#smallShadow)" />
        <circle cx="69" cy="57" r="44" fill="#FFFFFF" stroke="#1A1C1C" stroke-width="5" />
      </g>

      <!-- Top Right: UMS Stud Badge -->
      <g transform="translate(836, 48)">
        <rect x="0" y="0" width="138" height="114" rx="16" fill="#AF101A" stroke="#1A1C1C" stroke-width="8" filter="url(#smallShadow)" />
        <circle cx="69" cy="57" r="44" fill="#FFFFFF" stroke="#1A1C1C" stroke-width="5" />
      </g>

      <!-- Photo Frame Shadow & Outer Border -->
      <rect x="212" y="177" width="600" height="600" rx="24" fill="#1A1C1C" />
      <rect x="202" y="167" width="600" height="600" rx="24" fill="#FFD700" stroke="#1A1C1C" stroke-width="12" />

      <!-- 3D Lego Studs on Top of Frame -->
      <circle cx="260" cy="195" r="18" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="340" cy="195" r="18" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="420" cy="195" r="18" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="502" cy="195" r="18" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="584" cy="195" r="18" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="664" cy="195" r="18" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="744" cy="195" r="18" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />

      <!-- Left Lego Red Brick Border -->
      <rect x="180" y="440" width="40" height="300" rx="8" fill="#AF101A" stroke="#1A1C1C" stroke-width="7" />
      <circle cx="200" cy="500" r="12" fill="#AF101A" stroke="#1A1C1C" stroke-width="4" />
      <circle cx="200" cy="580" r="12" fill="#AF101A" stroke="#1A1C1C" stroke-width="4" />
      <circle cx="200" cy="660" r="12" fill="#AF101A" stroke="#1A1C1C" stroke-width="4" />

      <!-- Right Lego Blue Brick Border -->
      <rect x="784" y="270" width="40" height="300" rx="8" fill="#0055A4" stroke="#1A1C1C" stroke-width="7" />
      <circle cx="804" cy="330" r="12" fill="#0055A4" stroke="#1A1C1C" stroke-width="4" />
      <circle cx="804" cy="410" r="12" fill="#0055A4" stroke="#1A1C1C" stroke-width="4" />
      <circle cx="804" cy="490" r="12" fill="#0055A4" stroke="#1A1C1C" stroke-width="4" />

      <!-- 3D Lego Stack on Bottom Right of Photo -->
      <rect x="710" y="690" width="120" height="110" rx="10" fill="#AF101A" stroke="#1A1C1C" stroke-width="8" filter="url(#smallShadow)" />
      <circle cx="745" cy="715" r="14" fill="#AF101A" stroke="#1A1C1C" stroke-width="4" />
      <circle cx="795" cy="715" r="14" fill="#AF101A" stroke="#1A1C1C" stroke-width="4" />
      <rect x="770" y="740" width="110" height="100" rx="10" fill="#FFD700" stroke="#1A1C1C" stroke-width="8" filter="url(#smallShadow)" />
      <circle cx="805" cy="765" r="14" fill="#FFD700" stroke="#1A1C1C" stroke-width="4" />
      <circle cx="845" cy="765" r="14" fill="#FFD700" stroke="#1A1C1C" stroke-width="4" />

      <!-- Main Name Box Banner -->
      <rect x="90" y="850" width="844" height="344" rx="28" fill="#FFFFFF" stroke="#1A1C1C" stroke-width="14" filter="url(#dropShadow)" />

      <!-- Name Text: FARID MA'RUF PRABOWO -->
      <text x="512" y="930" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="56" fill="#1A1C1C" text-anchor="middle" letter-spacing="1">FARID MA&apos;RUF</text>
      <text x="512" y="1015" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="64" fill="#AF101A" text-anchor="middle" letter-spacing="2">PRABOWO</text>

      <!-- Dual Institution Badge Strip (UMS + MAN 1 SKA) -->
      <g transform="translate(106, 1070)">
        <!-- Left Badge: UMS -->
        <rect x="0" y="0" width="394" height="92" rx="16" fill="#F0F7FF" stroke="#0055A4" stroke-width="6" />
        <circle cx="44" cy="46" r="32" fill="#FFFFFF" stroke="#0055A4" stroke-width="3" />
        <text x="90" y="44" font-family="Courier New, monospace" font-weight="900" font-size="25" fill="#0055A4">INFORMATIKA UMS</text>
        <text x="90" y="72" font-family="Courier New, monospace" font-weight="900" font-size="20" fill="#1A1C1C">CLASS OF 2026</text>

        <!-- Right Badge: MAN 1 SKA -->
        <rect x="418" y="0" width="394" height="92" rx="16" fill="#F0FDF4" stroke="#00852B" stroke-width="6" />
        <circle cx="462" cy="46" r="32" fill="#FFFFFF" stroke="#00852B" stroke-width="3" />
        <text x="508" y="44" font-family="Courier New, monospace" font-weight="900" font-size="25" fill="#00852B">MAN 1 SURAKARTA</text>
        <text x="508" y="72" font-family="Courier New, monospace" font-weight="900" font-size="20" fill="#1A1C1C">ALUMNI 2026</text>
      </g>

      <!-- Yellow Tag Banner: FULL-STACK & AI DEV -->
      <g transform="translate(160, 1228)">
        <rect x="0" y="0" width="704" height="100" rx="22" fill="#FFD700" stroke="#1A1C1C" stroke-width="12" filter="url(#dropShadow)" />
        <circle cx="50" cy="50" r="20" fill="#AF101A" stroke="#1A1C1C" stroke-width="6" />
        <circle cx="654" cy="50" r="20" fill="#0055A4" stroke="#1A1C1C" stroke-width="6" />
        <text x="352" y="63" font-family="Courier New, monospace" font-weight="900" font-size="34" fill="#1A1C1C" text-anchor="middle" letter-spacing="2">FULL-STACK &amp; AI DEV</text>
      </g>

      <!-- Bottom Lego Stud Strip -->
      <rect x="50" y="1370" width="924" height="90" rx="18" fill="#AF101A" stroke="#1A1C1C" stroke-width="10" filter="url(#smallShadow)" />
      <circle cx="130" cy="1415" r="22" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="230" cy="1415" r="22" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="330" cy="1415" r="22" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="430" cy="1415" r="22" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="530" cy="1415" r="22" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="630" cy="1415" r="22" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="730" cy="1415" r="22" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="830" cy="1415" r="22" fill="#FFD700" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="905" cy="1415" r="15" fill="#FFFFFF" stroke="#1A1C1C" stroke-width="4" />
    </svg>
  `;

  const baseFrontImg = await sharp(Buffer.from(svgBase))
    .png()
    .toBuffer();

  const finalFrontCard = await sharp(baseFrontImg)
    .composite([
      { input: maskedPhoto, top: 177, left: 212 },
      { input: man1TopLogo, top: 70, left: 84 }, // top-left logo MAN 1 (centered in 114x138 stud box at 50,48)
      { input: umsTopLogo, top: 70, left: 870 }, // top-right logo UMS (centered in 114x138 stud box at 836,48)
      { input: umsBadgeLogo, top: 1088, left: 122 }, // badge UMS (centered in circle at 106+44=150, 1070+46=1116)
      { input: man1BadgeLogo, top: 1088, left: 540 }, // badge MAN 1 (centered in circle at 106+418+44=568, 1070+46=1116)
    ])
    .png()
    .toBuffer();

  await sharp(finalFrontCard).toFile('public/assets/farid_lanyard_card.png');

  // -------------------------------------------------------------
  // BACK SVG LAYOUT (Dual Institution Showcase)
  // -------------------------------------------------------------
  const svgBack = `
    <svg width="1024" height="1536" viewBox="0 0 1024 1536" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="backDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" opacity="0.15" />
        </pattern>
        <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="8" dy="8" stdDeviation="0" flood-color="#000000" />
        </filter>
      </defs>

      <!-- Back Card Background: Obsidian Black -->
      <rect width="1024" height="1536" fill="#161920" />
      <rect width="1024" height="1536" fill="url(#backDots)" />

      <!-- Outer Border -->
      <rect x="24" y="24" width="976" height="1488" rx="36" fill="none" stroke="#FFD700" stroke-width="16" />

      <!-- Top Badge -->
      <g transform="translate(112, 90)">
        <rect x="0" y="0" width="800" height="140" rx="24" fill="#AF101A" stroke="#FFFFFF" stroke-width="8" filter="url(#dropShadow)" />
        <text x="400" y="90" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="56" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">ACADEMIC &amp; IDENTITY</text>
      </g>

      <!-- Left Institution Showcase Box (UMS) -->
      <g transform="translate(90, 270)">
        <rect x="0" y="0" width="400" height="690" rx="24" fill="#20242D" stroke="#0055A4" stroke-width="10" filter="url(#dropShadow)" />
        
        <!-- White Circular Disc for Logo -->
        <circle cx="200" cy="170" r="115" fill="#FFFFFF" stroke="#0055A4" stroke-width="8" />

        <text x="200" y="380" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="32" fill="#FFD700" text-anchor="middle">UNIVERSITAS</text>
        <text x="200" y="425" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle">MUHAMMADIYAH</text>
        <text x="200" y="470" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle">SURAKARTA</text>
        
        <rect x="30" y="515" width="340" height="70" rx="12" fill="#0055A4" stroke="#FFFFFF" stroke-width="4" />
        <text x="200" y="560" font-family="Courier New, monospace" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">S1 TEKNIK INFORMATIKA</text>
        
        <text x="200" y="640" font-family="Courier New, monospace" font-weight="900" font-size="22" fill="#00DFD8" text-anchor="middle">// MABA ANGKATAN 2026</text>
      </g>

      <!-- Right Institution Showcase Box (MAN 1 Surakarta) -->
      <g transform="translate(534, 270)">
        <rect x="0" y="0" width="400" height="690" rx="24" fill="#20242D" stroke="#00852B" stroke-width="10" filter="url(#dropShadow)" />
        
        <!-- White Circular Disc for Logo -->
        <circle cx="200" cy="170" r="115" fill="#FFFFFF" stroke="#00852B" stroke-width="8" />

        <text x="200" y="380" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="32" fill="#FFD700" text-anchor="middle">MADRASAH</text>
        <text x="200" y="425" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle">ALIYAH NEGERI 1</text>
        <text x="200" y="470" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle">SURAKARTA</text>
        
        <rect x="30" y="515" width="340" height="70" rx="12" fill="#00852B" stroke="#FFFFFF" stroke-width="4" />
        <text x="200" y="560" font-family="Courier New, monospace" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">SAINS &amp; PEMINATAN IT</text>
        
        <text x="200" y="640" font-family="Courier New, monospace" font-weight="900" font-size="22" fill="#00E676" text-anchor="middle">// LULUSAN ALUMNI 2026</text>
      </g>

      <!-- Education & Code Signature Banner -->
      <g transform="translate(90, 1020)">
        <rect x="0" y="0" width="844" height="230" rx="24" fill="#FFFFFF" stroke="#1A1C1C" stroke-width="10" filter="url(#dropShadow)" />
        <text x="422" y="65" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="34" fill="#1A1C1C" text-anchor="middle">FARID MA&apos;RUF PRABOWO</text>
        <text x="422" y="125" font-family="Courier New, monospace" font-weight="900" font-size="26" fill="#AF101A" text-anchor="middle">FULL-STACK SOFTWARE &amp; AI ENGINEER</text>
        <text x="422" y="180" font-family="Courier New, monospace" font-weight="900" font-size="24" fill="#0055A4" text-anchor="middle">SURAKARTA, JAWA TENGAH, INDONESIA</text>
      </g>

      <!-- Bottom Lego Stud Strip -->
      <rect x="50" y="1370" width="924" height="90" rx="18" fill="#FFD700" stroke="#FFFFFF" stroke-width="8" filter="url(#dropShadow)" />
      <circle cx="130" cy="1415" r="22" fill="#AF101A" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="230" cy="1415" r="22" fill="#0055A4" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="330" cy="1415" r="22" fill="#00852B" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="430" cy="1415" r="22" fill="#FF6B00" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="530" cy="1415" r="22" fill="#7928CA" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="630" cy="1415" r="22" fill="#AF101A" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="730" cy="1415" r="22" fill="#0055A4" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="830" cy="1415" r="22" fill="#00852B" stroke="#1A1C1C" stroke-width="5" />
      <circle cx="905" cy="1415" r="15" fill="#1A1C1C" stroke="#FFFFFF" stroke-width="4" />
    </svg>
  `;

  const baseBackImg = await sharp(Buffer.from(svgBack))
    .png()
    .toBuffer();

  // Circle is at x: 90+200=290, y: 270+170=440. Size 184 -> top: 440-92=348, left: 290-92=198
  // Right Circle is at x: 534+200=734, y: 270+170=440. Size 184 -> top: 440-92=348, left: 734-92=642
  const finalBackCard = await sharp(baseBackImg)
    .composite([
      { input: umsBackLogo, top: 348, left: 198 }, // UMS Back Logo precisely centered in disc
      { input: man1BackLogo, top: 348, left: 642 }, // MAN 1 Back Logo precisely centered in disc
    ])
    .png()
    .toBuffer();

  // Resize both front and back to exact texture mapping dimensions
  const frontResized = await sharp(finalFrontCard)
    .resize(1024, 1546, { fit: 'fill' })
    .png()
    .toBuffer();

  const backResized = await sharp(finalBackCard)
    .resize(1024, 1550, { fit: 'fill' })
    .png()
    .toBuffer();

  // Create 2048 x 2048 Texture Atlas
  const atlas = await sharp({
    create: {
      width: 2048,
      height: 2048,
      channels: 4,
      background: { r: 245, g: 245, b: 245, alpha: 1 },
    },
  })
    .composite([
      { input: frontResized, top: 0, left: 0 },
      { input: backResized, top: 0, left: 1024 },
    ])
    .png()
    .toFile('public/assets/farid_card_atlas.png');

  console.log('Successfully regenerated 100% polished public/assets/farid_card_atlas.png!');
}

generateCard().catch(console.error);

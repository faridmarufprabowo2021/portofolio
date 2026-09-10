<div align="center">

  <!-- Header Banner -->
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:fa5d00,100:0d1117&height=220&section=header&text=FARID%20MA'RUF%20PRABOWO&fontSize=38&fontColor=ffffff&fontAlignY=36&desc=Lego%20Neo-Brutalist%20%E2%80%A2%203D%20Interactive%20Lanyard%20%E2%80%A2%20VRM%20Avatar&descFontSize=16&descAlignY=58&descAlign=50" width="100%" alt="Header Banner" />

  <br/>

  <h3>🧱 Interactive 3D Lego Neo-Brutalist Portfolio</h3>
  <p><em>A cutting-edge, tactile personal portfolio featuring interactive 3D physics lanyard, real-time VRM avatar tracking, and modular Lego-inspired UI architecture.</em></p>

  <p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-0.185-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
  </p>

</div>

---

## 🌟 Overview

**Portfolio Farid** is a distinctive, tactile web experience engineered with a **Lego Neo-Brutalist** aesthetic. Breaking away from generic AI portfolio templates, it unites physical-world tactile metaphors (brick studs, heavy borders, bold solid drop-shadows, responsive springs) with advanced WebGL 3D graphics, physics simulations, and modular code architecture.

Designed for **Farid Ma'ruf Prabowo** — Full-Stack Engineer, AI Developer, and Undergraduate Informatics student at Universitas Muhammadiyah Surakarta (UMS 2026, Alumni MAN 1 Surakarta).

---

## 🎮 Key Architectural Highlights & Features

### 1. 🪪 Interactive 3D Physics Lanyard Card (`LanyardCard.tsx`)
- **Physics-Driven Movement:** Powered by `@react-three/fiber` and `@react-three/rapier`, the virtual student/engineer ID badge swings realistically according to mouse physics and momentum.
- **Procedural Canvas Texture (`generateLanyardTexture.ts`):** Dynamically renders user credentials, QR codes, academic badge identifiers, and barcodes directly onto high-resolution Three.js canvas materials.
- **Tactile Interaction:** Users can click, pull, flick, and spin the lanyard in 3D space with collision boundaries and spring damping.

### 2. 👤 3D VRM Virtual Avatar (`VirtualFaridAvatar.tsx` & `VirtualAnimeAvatar.tsx`)
- Integrated with `@pixiv/three-vrm` to render production-grade 3D avatars.
- **Head & Gaze Tracking:** Follows cursor movement with smooth interpolated quaternions for life-like interaction.
- **Blink & Expression Engine:** Automated micro-movements, breathing animations, and facial blend-shapes.

### 3. 🧱 Modular Lego Neo-Brutalist Design System
- **Tactile Brick Elements:** Custom `.brick-btn`, `.brick-card`, and stud dot-matrix grids creating an authentic modular toy sensation.
- **Spring-Loaded Feedback:** Micro-interactions that compress upon click and release with bounce kinetics.
- **Dual-Tone Theme Support:** Seamless toggle between high-contrast Neo-Brutalist Light and Cyber Lego Dark palettes.

### 4. 🚀 Filterable Projects Showcase & Architecture Modals (`Projects.tsx`)
- Multi-dimensional taxonomy filters (*Full-Stack, Backend & DB, Machine Learning, Cloud/DevOps*).
- **Case Study Modals:** Comprehensive problem-solution breakdowns, architecture diagrams, live demos, and GitHub repository links for flagship works:
  - 🌾 **Harvest Anime** (Svelte 5 Runes, SvelteKit 2, 3-tier caching, multi-provider stream resolver)
  - 💬 **Senja CS** (WhatsApp Baileys hybrid engine, TurboRepo, multi-tenant CRM for UMKM)
  - 📝 **UjianCBT** (Self-hosted CBT platform with real-time AI anti-cheat proctoring)
  - 🕌 **Website Masjid AL-MA'RUF** (Next.js 15 App Router, Supabase PostgreSQL)
  - 🤖 **Gemi-chan** (Multimodal AI assistant with Gemini Flash API)
  - 👁️ **MediaPipe Motion** (Browser-based low-latency human pose tracking)

### 5. 📄 Interactive Resume Modal (`ResumeModal.tsx`)
- Embedded CV viewer with direct print-to-PDF styles and download options.
- Structured academic trajectory (UMS '26, MAN 1 Surakarta), certifications, and verified achievements.

### 6. 📬 Brutalist Contact Transmission (`Contact.tsx`)
- Clean, accessible contact portal integrated with celebratory Lego-palette confetti bursts (`canvas-confetti`) upon submission.

---

## 🛠️ Tech Stack & Engineering Arsenal

```
Frontend Core        : React 19.2 • TypeScript • Vite 8.2
Styling Engine       : Tailwind CSS v4 • PostCSS • Lucide Icons
3D & WebGL Graphics  : Three.js • @react-three/fiber • @react-three/drei
Physics Simulation   : @react-three/rapier • meshline
Avatars & Rigging    : @pixiv/three-vrm (3D Humanoid VRM models)
Animation & Effects  : Canvas Confetti • Custom Canvas Wave Particles
Code Quality         : Oxlint • TypeScript Strict Checking
Deployment           : Vercel • Cloudflare Edge Compatible
```

---

## 📂 Project Architecture & Directory Layout

```
portfolio-farid/
├── public/                     # Static assets, 3D VRM models, fonts
│   ├── avatar.vrm              # 3D Humanoid VRM model
│   └── favicon.ico
├── src/
│   ├── components/             # Reusable UI & 3D components
│   │   ├── About.tsx           # Bento grid profile & academic history
│   │   ├── Certifications.tsx  # Verified credentials & achievements
│   │   ├── Contact.tsx         # Contact form with kinetic confetti
│   │   ├── Experience.tsx      # Lab assistant, freelance & work timeline
│   │   ├── Footer.tsx          # Lego-themed footer & social links
│   │   ├── Hero.tsx            # Headline typography, badges & primary CTAs
│   │   ├── LanyardCard.tsx     # 3D Physics Lanyard Card canvas
│   │   ├── LegoCarTrack.tsx    # Interactive canvas Lego car track
│   │   ├── LegoIntroSequence.tsx# Lego brick building animation
│   │   ├── Navbar.tsx          # Sticky navigation, status indicator & CV button
│   │   ├── ProjectModal.tsx    # Deep architectural case study modal
│   │   ├── Projects.tsx        # Categorized project showcase grid
│   │   ├── ResumeModal.tsx     # Vector print-ready CV viewer
│   │   ├── Skills.tsx          # Tactile categorized skill matrix
│   │   ├── ThemeToggle.tsx     # Light/Dark mode switcher
│   │   ├── VirtualFaridAvatar.tsx # Three-VRM interactive avatar
│   │   └── ...                 # Micro-interaction modules
│   ├── data/
│   │   └── portfolioData.ts    # Single Source of Truth (SSOT) data store
│   ├── hooks/
│   │   └── useTheme.ts         # Theme state & localStorage synchronization
│   ├── types/
│   │   └── portfolio.ts        # Type contracts & data schemas
│   ├── utils/
│   │   └── generateLanyardTexture.ts # Dynamic Three.js badge texture generator
│   ├── App.tsx                 # Root layout & component pipeline
│   ├── index.css               # Tailwind v4 imports, Lego studs & tactile styles
│   └── main.tsx                # Client bootstrap
├── tailwind.config.js          # Design tokens & color extensions
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundling, chunk optimization & plugins
└── package.json
```

---

## ⚡ Quick Start & Development

### Prerequisites
- **Node.js**: `v20.x` or higher recommended
- **npm** / **pnpm** / **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/faridmarufprabowo2021/portofolio.git
cd portofolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized, minified bundle in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## ⚙️ Configuration & Content Updates

All profile content, project descriptions, skills, and academic history are decoupled from UI components and centralized inside:

```
src/data/portfolioData.ts
```

To update your projects, skills, or contact info, simply modify the exported objects in that file:
- `personalInfo`: Name, bio, status, headline, metrics
- `skillsData`: Categories, icon SVGs, and groupings
- `projectsData`: Case studies, architecture bullets, GitHub & live URLs
- `experiencesData`: Lab assistant, freelance, and organizational tracks
- `certificationsData`: Professional licenses and achievements

---

## 🚀 Deployment

The project is optimized for deployment on **Vercel**, **Cloudflare Pages**, or **Netlify**:

```bash
# Deploy with Vercel CLI
vercel --prod
```

Or connect the repository directly in the [Vercel Dashboard](https://vercel.com):
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 👨‍💻 Author

**Farid Ma'ruf Prabowo**
- **GitHub**: [@faridmarufprabowo2021](https://github.com/faridmarufprabowo2021)
- **Email**: [faridmarufprabowo@gmail.com](mailto:faridmarufprabowo@gmail.com)
- **Institution**: Universitas Muhammadiyah Surakarta (UMS) — Informatics 2026

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:fa5d00,100:0d1117&height=90&section=footer" width="100%" alt="Footer Banner" />
  
  <p align="center">
    <code>Built with precision, curiosity, and modular bricks. 🧱</code>
  </p>
</div>

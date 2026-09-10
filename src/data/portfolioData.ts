import type { Project, SkillCategory, SkillItem, Experience, Education, Certification, SocialLink } from '../types/portfolio';

export const personalInfo = {
  name: "Farid Ma'ruf Prabowo",
  shortName: "Farid",
  role: "Full-Stack Engineer & AI Developer",
  roles: [
    "Full-Stack Software Engineer",
    "WhatsApp Bot & Backend Specialist",
    "Computer Vision & AI Developer",
    "Undergraduate Informatics @ UMS (2026)",
    "Alumni MAN 1 Surakarta"
  ],
  university: "Universitas Muhammadiyah Surakarta (UMS)",
  highSchool: "MAN 1 Surakarta",
  batch: "2026",
  location: "Surakarta / Solo, Jawa Tengah, Indonesia",
  email: "faridmarufprabowo@gmail.com",
  status: "AVAILABLE FOR COLLABORATION & PROJECTS",
  bioHeadline: "Full-Stack Software Engineer • S1 Informatika UMS (Alumni MAN 1 Surakarta)",
  about: {
    intro: "Membangun perangkat lunak dengan pendekatan modular dan presisi seperti balok LEGO.",
    description: "Halo! Saya Farid Ma'ruf Prabowo, mahasiswa Teknik Informatika di Universitas Muhammadiyah Surakarta (UMS) dan alumni MAN 1 Surakarta. Saya adalah problem solver yang berfokus pada rekayasa backend berkinerja tinggi, otomatisasi sistem modern, dan integrasi Artificial Intelligence. Bagi saya, perangkat lunak yang hebat bukan hanya yang sekadar berfungsi, melainkan yang dibangun dengan arsitektur modular yang bersih, performa tangguh, dan siap dikembangkan ke masa depan.",
    highlights: [
      "Mahasiswa Baru S1 Teknik Informatika di Universitas Muhammadiyah Surakarta (UMS 2026).",
      "Alumni MAN 1 Surakarta dengan spesialisasi peminatan sains, logika pemrograman, dan robotika.",
      "Spesialis arsitektur backend TypeScript (Next.js, Fastify, NestJS) dan otomatisasi WhatsApp CRM multi-tenant.",
      "Pengembangan sistem Computer Vision & AI proctoring berbasis Python (MediaPipe & OpenCV).",
      "Fondasi rekayasa perangkat lunak dengan Docker, Redis, PostgreSQL, arsitektur microservices, dan clean code."
    ]
  },
  metrics: [
    { label: "ACADEMIC TRACK", value: "UMS '26" },
    { label: "ALUMNI ORIGIN", value: "MAN 1 SKA" },
    { label: "PRODUCTION APPS", value: "10+ APPS" },
    { label: "TECH ARSENAL", value: "25+ TOOLS" },
  ]
};

export const skillsData: SkillItem[] = [
  // Development (Frontend)
  {
    name: "REACT.JS",
    category: "Frontend Web",
    group: "Development",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
  },
  {
    name: "NEXT.JS 15",
    category: "React Framework",
    group: "Development",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
  },
  {
    name: "SVELTEKIT 2",
    category: "Full-Stack Svelte",
    group: "Development",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg"
  },
  {
    name: "GRAPHQL",
    category: "Query Language",
    group: "Backend & DB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg"
  },
  {
    name: "TYPESCRIPT",
    category: "Type-Safe JS",
    group: "Development",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
  },
  {
    name: "TAILWIND CSS",
    category: "Styling Engine",
    group: "Development",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
  },
  {
    name: "TURBOREPO",
    category: "Monorepo Build",
    group: "Development",
    logo: "https://cdn.simpleicons.org/turborepo/000000"
  },
  {
    name: "JAVASCRIPT",
    category: "Core Web",
    group: "Development",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
  },
  {
    name: "HTML5 / CSS3",
    category: "Semantic Web",
    group: "Development",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
  },
  {
    name: "VITE",
    category: "Build Tool",
    group: "Development",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg"
  },

  // Backend & DB
  {
    name: "WHATSAPP BAILEYS",
    category: "WA Socket Engine",
    group: "Backend & DB",
    logo: "https://cdn.simpleicons.org/whatsapp/25D366"
  },
  {
    name: "FASTIFY",
    category: "High-Speed API",
    group: "Backend & DB",
    logo: "https://cdn.simpleicons.org/fastify/000000"
  },
  {
    name: "NODE.JS",
    category: "Runtime Engine",
    group: "Backend & DB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
  },
  {
    name: "NESTJS",
    category: "Enterprise Backend",
    group: "Backend & DB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg"
  },
  {
    name: "GO (GOLANG)",
    category: "Concurrent Backend",
    group: "Backend & DB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg"
  },
  {
    name: "POSTGRESQL",
    category: "Relational DB",
    group: "Backend & DB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
  },
  {
    name: "REDIS",
    category: "In-Memory Cache",
    group: "Backend & DB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
  },
  {
    name: "PRISMA ORM",
    category: "Schema & Query",
    group: "Backend & DB",
    logo: "https://cdn.simpleicons.org/prisma/2D3748"
  },
  {
    name: "SUPABASE",
    category: "BaaS & Realtime",
    group: "Backend & DB",
    logo: "https://cdn.simpleicons.org/supabase/3ECF8E"
  },

  // Machine Learning & AI
  {
    name: "PYTHON",
    category: "Core Language",
    group: "Machine Learning",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
  },
  {
    name: "MEDIAPIPE",
    category: "Gesture Tracking",
    group: "Machine Learning",
    logo: "https://cdn.simpleicons.org/google/4285F4"
  },
  {
    name: "OPENCV",
    category: "Computer Vision",
    group: "Machine Learning",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg"
  },
  {
    name: "AI SDK / OPENAI",
    category: "Generative AI",
    group: "Machine Learning",
    logo: "https://cdn.simpleicons.org/openai/412991"
  },
  {
    name: "PYTORCH",
    category: "Deep Learning",
    group: "Machine Learning",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg"
  },
  {
    name: "SCIKIT-LEARN",
    category: "ML Algorithms",
    group: "Machine Learning",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg"
  },

  // DevOps & Cloud
  {
    name: "DOCKER",
    category: "Containerization",
    group: "DevOps & Cloud",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
  },
  {
    name: "GIT & GITHUB",
    category: "Version Control",
    group: "DevOps & Cloud",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
  },
  {
    name: "LINUX / BASH",
    category: "Server OS",
    group: "DevOps & Cloud",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
  },
  {
    name: "VERCEL",
    category: "Cloud Hosting",
    group: "DevOps & Cloud",
    logo: "https://cdn.simpleicons.org/vercel/000000"
  },

  // Tools
  {
    name: "VS CODE",
    category: "Code Editor",
    group: "Tools",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
  },
  {
    name: "POSTMAN",
    category: "API Testing",
    group: "Tools",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg"
  },
  {
    name: "FIGMA",
    category: "UI/UX Design",
    group: "Tools",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"
  }
];

export const skillGroups = ['ALL', 'Development', 'Backend & DB', 'Machine Learning', 'DevOps & Cloud', 'Tools'] as const;

export const projectsData: Project[] = [
  {
    id: "proj-1",
    slug: "senja-cs-whatsapp-bot-umkm",
    title: "Senja CS - WhatsApp Bot & Multi-Tenant CRM Platform untuk UMKM",
    category: "Full-Stack",
    year: "2026",
    tagline: "Platform SaaS Omnichannel Customer Service & Otomasi Penjualan WhatsApp Multi-Tenant untuk UMKM Indonesia.",
    description: "Sistem otomasi WhatsApp customer service dan sales multi-tenant berbasis cloud yang memungkinkan ratusan bisnis UMKM menghubungkan nomor WhatsApp mereka, mengelola antrian chat pelanggan dengan AI auto-reply, sistem booking otomatis, dan pengiriman pesan reminder H-1 terjadwal.",
    problem: "Pelaku UMKM di Indonesia sering kehilangan pesanan karena keterbatasan staf merespons ratusan chat WhatsApp yang masuk, lupa mengirim pengingat jadwal booking/reservasi, dan ketiadaan sistem rekapitulasi order terpusat.",
    solution: "Merancang arsitektur monorepo TurboRepo dengan Fastify 5.0 dan Next.js 15, mengimplementasikan Hybrid WhatsApp Driver Pattern (Baileys direct WebSocket socket + Open-WA REST Docker), isolasi multi-tenant via JWT & `X-Tenant-Id`, serta background worker otomatis untuk reminder booking H-1.",
    architecture: [
      "Monorepo Architecture: TurboRepo + pnpm workspaces (@cs/web, @cs/api, @cs/shared)",
      "Frontend Dashboard: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Lucide Icons",
      "Backend API: Fastify 5.0 High-Performance Engine + Prisma ORM + PostgreSQL",
      "Hybrid WA Engine: Baileys (@whiskeysockets/baileys) direct socket & Open-WA Docker Client (port 8008)",
      "Background Jobs: Automated Cron Worker untuk auto-reminder booking H-1 dan broadcast promo",
      "Security: Multi-tenant data isolation dengan X-Tenant-Id header + JWT Bearer Auth"
    ],
    features: [
      "QR Code Scan Pairing WhatsApp instan berbasis web session",
      "Otomasi Auto-Reply pintar berbasis kata kunci & integrasi AI sales assistant",
      "Manajemen Booking & Reservasi terpadu dengan auto-reminder WhatsApp H-1 otomatis",
      "Rekapitulasi pesanan (Order Management) dengan ekspor laporan CSV & analitik chat",
      "Multi-agent CS: satu nomor WhatsApp bisnis dapat dikelola oleh banyak staf admin secara bersamaan"
    ],
    technologies: ["Next.js 15", "TypeScript", "Fastify", "WhatsApp Baileys", "Prisma", "PostgreSQL", "TurboRepo", "Docker"],
    githubUrl: "https://github.com/faridmaruf/customer-service",
    liveUrl: "https://senjacs.app",
    featured: true,
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "proj-harvest-anime",
    slug: "harvest-anime-streaming",
    title: "Harvest Anime - Editorial Anime Streaming & Discovery Platform",
    category: "Full-Stack",
    year: "2026",
    tagline: "Platform streaming anime modern dengan estetika editorial Harvest Style, integrasi AniList GraphQL, dan custom HLS player.",
    description: "Aplikasi web streaming anime berkinerja tinggi yang menggabungkan estetika desain editorial premium (Harvest Style - warm cream canvas, floating cards, dan aksen flame orange) dengan katalog kaya metadata AniList GraphQL, pemutar video kustom HLS/Artplayer dengan multi-provider stream, dan sinkronisasi data Supabase.",
    problem: "Situs streaming anime konvensional umumnya memiliki antarmuka yang gelap, berantakan, dipenuhi iklan agresif, pemutar video yang lambat atau sering rusak, serta minimnya sistem katalog dan tracking tontonan yang rapi.",
    solution: "Merancang platform web modern dengan SvelteKit 2 dan Tailwind CSS berstandar Harvest Design System, mengintegrasikan AniList GraphQL API dengan multi-tier caching (L1 in-memory + L2 disk/Supabase cache), custom Artplayer HLS dengan fitur Skip Intro/Outro & Cinema Mode, dan provider fallback multi-server.",
    architecture: [
      "Frontend & SSR: SvelteKit 2 + Svelte 5 (Runes) + Tailwind CSS + Lucide Icons",
      "Design System: Harvest Aesthetic (Warm Cream #fff8f1, Flame Accent #fa5d00, Floating White Cards)",
      "Metadata Engine: AniList GraphQL API + In-Memory LRU & Two-Tier Cache Service",
      "Video Player Engine: Artplayer / HLS.js Custom Cinema Player dengan multi-source resolution switcher (360p - 1080p)",
      "Database & Auth: Supabase (PostgreSQL + Row Level Security + SSR Auth)",
      "Deployment & Edge: Vercel Adapter / Cloudflare Worker Streaming Proxy"
    ],
    features: [
      "Hero Spotlight & Weekly Airing Schedule Grid real-time berbasis AniList GraphQL",
      "Custom HTML5 / HLS Video Player dengan pilihan resolusi, skip opening/ending 90 detik, dan Cinema Ambient Mode",
      "Halaman Detail Anime komprehensif: sinopsis, trailer YouTube, daftar karakter & voice actors, serta episode selector",
      "Multi-provider stream failover otomatis untuk menjaga link video tetap aktif dan bebas buffering",
      "User Watchlist & History sinkronisasi real-time dengan Supabase database"
    ],
    technologies: ["SvelteKit 2", "Svelte 5", "TypeScript", "Tailwind CSS", "AniList GraphQL", "Artplayer / HLS", "Supabase", "Vercel"],
    githubUrl: "https://github.com/faridmaruf/harvest-anime",
    liveUrl: "https://test-deisgn.vercel.app",
    featured: true,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "proj-2",
    slug: "ujian-cbt-proctoring",
    title: "UjianCBT - Self-Hosted CBT & AI Exam Proctoring",
    category: "Full-Stack",
    year: "2026",
    tagline: "Platform ujian berbasis komputer self-hosted dengan web proctoring real-time dan generator soal AI.",
    description: "Sistem ujian online terdistribusi untuk institusi pendidikan yang dilengkapi deteksi kecurangan real-time (tab-switch, face tracking), auto-grading instan, dan generator bank soal bertenaga AI.",
    problem: "Pelaksanaan ujian online konvensional rentan kecurangan, membebani server saat ribuan siswa submit serentak, dan pembuatan variasi soal membutuhkan waktu guru yang sangat lama.",
    solution: "Membangun arsitektur monorepo mandiri dengan Fastify & Next.js, sinkronisasi state via Redis cluster, proteksi anti-concurrency lock dengan PostgreSQL, dan integrasi AI SDK untuk pembuatan soal otomatis.",
    architecture: [
      "Frontend: Next.js 15 + TypeScript + Tailwind CSS + WebRTC Proctoring",
      "Backend API: Fastify / Node.js High-Throughput HTTP Engine",
      "Database: PostgreSQL + ACID Transaction Locks untuk mencegah jawaban hilang",
      "Caching & Real-time: Redis Pub/Sub untuk live monitoring status peserta ujian",
      "Infrastructure: Docker Compose Multi-Container Deployment"
    ],
    features: [
      "Real-time webcam & browser proctoring dengan deteksi pelanggaran otomatis",
      "AI Prompt-to-Questions: generate bank soal pilihan ganda & essay dalam hitungan detik",
      "Auto-save jawaban setiap detik secara background dengan proteksi offline mode",
      "Export rekapitulasi nilai dan analitik butir soal ke format PDF & Excel",
      "Anti-cheating security: lock fullscreen, block copy-paste, dan watermark identitas"
    ],
    technologies: ["Next.js", "TypeScript", "Fastify", "PostgreSQL", "Redis", "Docker", "AI SDK"],
    githubUrl: "https://github.com/faridmaruf/ujian-cbt",
    liveUrl: "https://ujiancbt.demo.app",
    featured: true,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "proj-3",
    slug: "signhand-introduce-ai",
    title: "SignHand AI - Deteksi Gestur Bahasa Isyarat Real-Time",
    category: "Mobile / IoT",
    year: "2026",
    tagline: "Aplikasi Computer Vision interaktif untuk pengenalan gestur tangan dan perkenalan diri Bahasa Indonesia.",
    description: "Sistem pengenalan gestur tangan interaktif berbasis Computer Vision dan Machine Learning yang menerjemahkan bahasa isyarat ke teks dan suara sintetis (Text-to-Speech) secara instan.",
    problem: "Keterbatasan komunikasi antara penyandang tunarungu dan masyarakat umum saat melakukan perkenalan diri dan interaksi dasar.",
    solution: "Mengimplementasikan model MediaPipe Hand Landmarker 21-titik koordinat 3D yang dipadukan dengan logika klasifikasi gestur OpenCV dan Google Text-to-Speech (gTTS) untuk output audio real-time.",
    architecture: [
      "Tracking Engine: Google MediaPipe Hand Landmarker 3D Keypoints",
      "Vision Pipeline: OpenCV Python frame processing & landmark normalization",
      "Audio Synthesizer: gTTS (Google Text-to-Speech) + SoundDevice streaming",
      "UI / Feedback: Visual feedback overlay dengan bounding box dan deteksi confidence score"
    ],
    features: [
      "Pelacakan 21 sendi tangan secara real-time pada 60 FPS tanpa GPU berat",
      "Menerjemahkan gestur alfabet dan kata perkenalan diri Bahasa Indonesia",
      "Output audio suara otomatis yang menyuarakan maksud isyarat tangan",
      "Tampilan interaktif dengan visualisasi landmark tangan berwarna"
    ],
    technologies: ["Python", "MediaPipe", "OpenCV", "gTTS", "Machine Learning", "Computer Vision"],
    githubUrl: "https://github.com/faridmaruf/signHand-introduce",
    featured: true,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "proj-4",
    slug: "umkm-cepat-ai-builder",
    title: "UMKM Cepat - AI Website & Landing Page Builder",
    category: "Full-Stack",
    year: "2026",
    tagline: "Platform pembuat website instan berbasis AI khusus pelaku usaha UMKM Indonesia.",
    description: "Aplikasi web open-source bertenaga AI yang membantu pelaku UMKM membuat landing page katalog produk profesional, responsif, dan siap jualan hanya melalui instruksi bahasa natural.",
    problem: "Banyak pelaku UMKM lokal kesulitan membuat website bisnis karena biaya jasa pembuatan web yang mahal dan kerumitan coding.",
    solution: "Membangun website generator bertenaga AI SDK dan Monaco Editor yang mengubah deskripsi bisnis menjadi website interaktif lengkap dengan sistem autentikasi dan database produk.",
    architecture: [
      "Core Framework: Next.js 15 (App Router) + TypeScript + Tailwind CSS",
      "AI Engine: Vercel AI SDK dengan model OpenAI-compatible",
      "Database & Auth: Prisma ORM + PostgreSQL + Auth.js",
      "Code Playground: Monaco Editor untuk kustomisasi kode langsung secara live preview"
    ],
    features: [
      "One-click generate landing page UMKM lengkap dengan hero, produk, dan kontak WA",
      "Live code & design editor interaktif dengan real-time preview",
      "Katalog produk dinamis dengan integrasi tombol checkout WhatsApp",
      "Otomatisasi SEO meta tag dan optimasi kecepatan gambar"
    ],
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "AI SDK", "Tailwind CSS"],
    githubUrl: "https://github.com/faridmaruf/umkmcepat",
    liveUrl: "https://umkmcepat.vercel.app",
    featured: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "proj-5",
    slug: "gamelypay-gaming-store",
    title: "GamelyPay - High-Concurrency Game Top-Up Store",
    category: "Frontend",
    year: "2026",
    tagline: "Platform top-up voucher game dan currency instan dengan transaksi otomatis 24/7.",
    description: "Sistem e-commerce modern dengan pengalaman checkout kilat untuk top-up game populer, terintegrasi dengan Supabase real-time backend dan animasi interaktif Framer Motion.",
    problem: "Proses transaksi top-up game seringkali lambat, UI membingungkan, dan rawan gagal validasi ID akun pemain.",
    solution: "Merancang UI neo-modern dengan validasi instan nickname pemain via API, filter nominal dinamis, dan sistem invoice real-time.",
    architecture: [
      "Frontend: Next.js 15 + TypeScript + Tailwind CSS + Framer Motion",
      "Backend & Storage: Supabase PostgreSQL + Row Level Security (RLS)",
      "Icons: Phosphor Icons + Lucide React",
      "Deployment: Vercel Edge Network"
    ],
    features: [
      "Pengecekan ID Game otomatis (Mobile Legends, Free Fire, Genshin, dll.)",
      "Pilihan metode pembayaran lengkap (QRIS, E-Wallet, Virtual Account)",
      "Animasi mikro interaktif dan status pemrosesan transaksi real-time",
      "Sistem voucher promo dan diskon dinamis"
    ],
    technologies: ["Next.js", "TypeScript", "Supabase", "Framer Motion", "Tailwind CSS"],
    githubUrl: "https://github.com/faridmaruf/gamelypay",
    featured: false,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "proj-6",
    slug: "sirsgm-hospital-system",
    title: "SIRSGM - Sistem Informasi Rumah Sakit Gigi & Mulut",
    category: "Backend",
    year: "2025",
    tagline: "Sistem manajemen rekam medis elektronik dan antrian poliklinik rumah sakit.",
    description: "Sistem informasi rumah sakit komprehensif untuk mendigitalkan alur pelayanan pasien, rekam medis odontogram gigi, jadwal dokter, dan billing farmasi.",
    problem: "Pencatatan medis gigi konvensional masih menggunakan kertas fisik yang rawan hilang dan memperlambat waktu tunggu antrian pasien.",
    solution: "Membangun backend modular berbasis NestJS enterprise architecture dengan TypeScript, PostgreSQL terenkripsi, dan antarmuka Next.js 14.",
    architecture: [
      "Frontend: Next.js 14 Enterprise Dashboard",
      "Backend Engine: NestJS + TypeScript + RESTful microservices",
      "Database: PostgreSQL dengan enkripsi data medis sensitif",
      "Container: Docker multi-stage environment"
    ],
    features: [
      "Peta odontogram digital interaktif untuk pencatatan kondisi gigi pasien",
      "Manajemen antrian poliklinik terintegrasi dengan layar display ruang tunggu",
      "Sistem resep elektronik farmasi dan billing kasir otomatis",
      "Hak akses berbasis peran ketat (Dokter, Perawat, Kasir, Admin)"
    ],
    technologies: ["NestJS", "Next.js", "TypeScript", "PostgreSQL", "Docker", "REST API"],
    githubUrl: "https://github.com/faridmaruf/sirsgm-hospital",
    featured: false,
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
  }
];

export const experiencesData: Experience[] = [
  {
    id: "exp-1",
    role: "Mahasiswa Baru (Freshman) & Independent Software Developer",
    institution: "Universitas Muhammadiyah Surakarta (UMS)",
    location: "Surakarta, Jawa Tengah",
    period: "2026 — Sekarang",
    type: "Akademik & Proyek",
    description: "Menempuh pendidikan S1 Teknik Informatika di UMS sambil terus aktif mengembangkan proyek perangkat lunak mandiri, platform SaaS WhatsApp UMKM, dan sistem AI open-source.",
    highlights: [
      "Mengembangkan platform SaaS WhatsApp multi-tenant 'Senja CS' dengan arsitektur Hybrid Driver (Baileys + Open-WA).",
      "Mengembangkan arsitektur platform ujian self-hosted UjianCBT dengan web proctoring terpadu.",
      "Mengeksplorasi integrasi AI SDK dan Computer Vision untuk aplikasi praktis masyarakat."
    ],
    technologies: ["Next.js", "TypeScript", "Fastify", "WhatsApp Baileys", "NestJS", "PostgreSQL", "Docker"]
  },
  {
    id: "exp-2",
    role: "Siswa & Pengembang Proyek Teknologi",
    institution: "MAN 1 Surakarta (Madrasah Aliyah Negeri 1 Surakarta)",
    location: "Surakarta, Jawa Tengah",
    period: "2023 — 2026",
    type: "Pendidikan Menengah",
    description: "Menyelesaikan pendidikan madrasah aliyah dengan fokus pada peminatan sains, logika pemrograman, dan pembuatan proyek perangkat lunak praktis.",
    highlights: [
      "Membangun proyek riset Computer Vision 'SignHand AI' pengenal bahasa isyarat dengan MediaPipe & OpenCV.",
      "Membangun fondasi kuat dalam algoritma, struktur data, dan teknologi web modern.",
      "Merancang berbagai tool otomasi dan platform digital mandiri."
    ],
    technologies: ["Python", "OpenCV", "MediaPipe", "JavaScript", "TypeScript", "HTML/CSS"]
  }
];

export const educationData: Education[] = [
  {
    degree: "S1 Teknik Informatika (Informatics Engineering)",
    institution: "Universitas Muhammadiyah Surakarta (UMS)",
    location: "Surakarta, Jawa Tengah",
    period: "2026 — 2030 (Mahasiswa Baru)",
    logo: "/assets/logo_ums.webp",
    description: "Program Sarjana yang berfokus pada Rekayasa Perangkat Lunak, Sistem Terdistribusi, Kecerdasan Buatan (AI), Algoritma Komputasi, dan Keamanan Siber.",
    courses: [
      "Algoritma & Pemrograman",
      "Struktur Data & Analisis Algoritma",
      "Arsitektur Komputer & Jaringan",
      "Sistem Basis Data & SQL",
      "Rekayasa Perangkat Lunak Terdistribusi",
      "Kecerdasan Buatan & Machine Learning"
    ]
  },
  {
    degree: "Pendidikan Menengah Atas (MIPA / Sains & Teknologi)",
    institution: "MAN 1 Surakarta (Madrasah Aliyah Negeri 1 Surakarta)",
    location: "Surakarta, Jawa Tengah",
    period: "2023 — 2026 (Lulusan 2026)",
    logo: "/assets/logo_man1ska.webp",
    description: "Menempuh pendidikan dengan fokus sains, matematika, dan aktif mengembangkan eksplorasi teknologi informasi serta pemrograman mandiri.",
    courses: [
      "Matematika & Logika Komputasi",
      "Fisika Terapan & Elektronika Dasar",
      "Teknologi Informasi & Komunikasi",
      "Dasar Pemrograman & Algoritma"
    ]
  }
];

export const certificationsData: Certification[] = [
  {
    id: "cert-1",
    title: "Full-Stack Web & Backend Development",
    issuer: "Dicoding Indonesia",
    date: "2026",
    credentialId: "DICODING-FS-2026",
    verifyUrl: "https://dicoding.com",
    skills: ["React", "Fastify", "Node.js", "RESTful API", "TypeScript", "Clean Architecture"]
  },
  {
    id: "cert-2",
    title: "Python for Computer Vision & Machine Learning",
    issuer: "Coursera & DeepLearning.AI",
    date: "2025",
    credentialId: "CV-AI-88210",
    verifyUrl: "https://coursera.org",
    skills: ["Python", "OpenCV", "MediaPipe", "Machine Learning", "Object Detection"]
  },
  {
    id: "cert-3",
    title: "Docker & Containerization for Developers",
    issuer: "Udemy & Linux Foundation",
    date: "2025",
    credentialId: "DCK-ENG-9102",
    verifyUrl: "https://udemy.com",
    skills: ["Docker", "Docker Compose", "Linux", "DevOps Pipeline"]
  }
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/faridmaruf",
    icon: "github",
    username: "@faridmaruf"
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/faridmarufprabowo",
    icon: "linkedin",
    username: "Farid Ma'ruf Prabowo"
  },
  {
    name: "Instagram",
    url: "https://instagram.com/faridmaruf_",
    icon: "instagram",
    username: "@faridmaruf_"
  },
  {
    name: "Email",
    url: "mailto:faridmarufprabowo@gmail.com",
    icon: "mail",
    username: "faridmarufprabowo@gmail.com"
  }
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend Engineering",
    icon: "laptop",
    accentColor: "primary",
    skills: [
      { name: "Next.js 15 (App Router)", level: "Advanced" },
      { name: "React 19 / TypeScript", level: "Advanced" },
      { name: "Tailwind CSS", level: "Master" },
      { name: "TurboRepo Monorepo", level: "Advanced" },
      { name: "Three.js / 3D Canvas", level: "Proficient" },
    ]
  },
  {
    title: "Backend & Systems",
    icon: "server",
    accentColor: "brick-blue",
    skills: [
      { name: "WhatsApp Baileys / Open-WA", level: "Master" },
      { name: "Fastify 5.0 / Node.js", level: "Advanced" },
      { name: "NestJS Framework", level: "Proficient" },
      { name: "Go / Golang", level: "Proficient" },
      { name: "PostgreSQL & Prisma ORM", level: "Advanced" },
      { name: "Redis Cache & PubSub", level: "Advanced" },
    ]
  },
  {
    title: "Computer Vision & AI",
    icon: "cpu",
    accentColor: "brick-yellow",
    skills: [
      { name: "Python", level: "Advanced" },
      { name: "MediaPipe (Hand Tracking)", level: "Advanced" },
      { name: "OpenCV (Vision Pipeline)", level: "Advanced" },
      { name: "Vercel AI SDK / OpenAI", level: "Proficient" },
      { name: "PyTorch & Scikit-learn", level: "Intermediate" },
    ]
  },
  {
    title: "DevOps & Tooling",
    icon: "database",
    accentColor: "brick-green",
    skills: [
      { name: "Docker & Multi-Container", level: "Advanced" },
      { name: "Git & GitHub Actions", level: "Advanced" },
      { name: "Linux / Bash Environment", level: "Proficient" },
      { name: "Vercel Cloud Deploy", level: "Master" },
      { name: "Playwright Automated Testing", level: "Proficient" },
    ]
  }
];

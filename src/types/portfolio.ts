export interface SkillItem {
  name: string;
  category: string;
  group: 'Development' | 'Backend & DB' | 'Machine Learning' | 'DevOps & Cloud' | 'Tools';
  logo: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: 'Full-Stack' | 'Backend' | 'Frontend' | 'DevOps & Cloud' | 'Mobile / IoT';
  year: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  architecture: string[];
  features: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  image: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  accentColor: string;
  skills: {
    name: string;
    level: string;
    icon?: string;
  }[];
}

export interface Experience {
  id: string;
  role: string;
  institution: string;
  location: string;
  period: string;
  type: string;
  description: string;
  highlights: string[];
  technologies: string[];
  logo?: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa?: string;
  description: string;
  courses: string[];
  logo?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  verifyUrl?: string;
  skills: string[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  username: string;
}

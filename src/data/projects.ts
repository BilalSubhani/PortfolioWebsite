export type ProjectType = 'open-source' | 'frontend' | 'backend';

export interface Project {
  title: string;
  description: string;
  type: ProjectType;
  technologies: string[];
  github?: string;
  npm?: string;
  demo?: string;
}

export const projectTypes: { type: ProjectType; label: string; icon: string }[] = [
  { type: 'open-source', label: 'Open Source', icon: 'fab fa-npm' },
  { type: 'frontend', label: 'Frontend', icon: 'fas fa-laptop-code' },
  { type: 'backend', label: 'Backend', icon: 'fas fa-server' },
];

export const projects: Project[] = [
  // Open source: npm packages published under the Clear Wave GitHub organization
  {
    title: '@live-tabs/next',
    description:
      'Browser-style tabs for Next.js where each page stays open in the background, so scroll position, form input and loading data survive tab switches. Framework-free core published as @live-tabs/core.',
    type: 'open-source',
    technologies: ['Next.js', 'React', 'TypeScript'],
    npm: 'https://www.npmjs.com/package/@live-tabs/next',
  },
  {
    title: 'verlux',
    description:
      'Offline profanity filter for Node.js. Checks 5 languages in one pass, catches disguised words, no dependencies.',
    type: 'open-source',
    technologies: ['Node.js', 'TypeScript', 'Zero deps'],
    npm: 'https://www.npmjs.com/package/verlux',
  },
  {
    title: 'envcanary',
    description:
      "Catches missing or wrong environment settings before deploy and fails CI when they don't match.",
    type: 'open-source',
    technologies: ['Node.js', 'CLI', 'CI'],
    npm: 'https://www.npmjs.com/package/envcanary',
  },
  {
    title: 'currency-icon-map',
    description:
      'Finds the right icon for 184 currencies by code, symbol, country or name, across 4 icon libraries.',
    type: 'open-source',
    technologies: ['TypeScript', 'Icons', 'i18n'],
    npm: 'https://www.npmjs.com/package/currency-icon-map',
  },

  // Frontend projects
  {
    title: 'Builder App',
    description: 'Admin dashboard to manage text, images, and videos shown on the main landing page.',
    type: 'frontend',
    technologies: ['Angular', 'TypeScript', 'Dashboard', 'WebSocket Client'],
    github: 'https://github.com/BilalSubhani/BuilderAppFrontend',
  },
  {
    title: 'Haider Desk',
    description:
      'E-commerce site for purchasing copyrighted logos, banners, and other graphic assets, including an admin dashboard.',
    type: 'frontend',
    technologies: ['Angular', 'TypeScript', 'Dashboard', 'E-Commerce'],
    github: 'https://github.com/BilalSubhani/haiderDesk',
  },
  {
    title: 'Portfolio Website',
    description: 'This site: a React + Vite portfolio with light/dark themes and Netlify forms.',
    type: 'frontend',
    technologies: ['React', 'TypeScript', 'Vite', 'Netlify'],
    github: 'https://github.com/BilalSubhani/PortfolioWebsite',
  },

  // Backend projects
  {
    title: 'Burq Backend',
    description:
      'Built with NestJS, MongoDB, JWT, Passport, Cloudinary, and WebSockets for real-time features.',
    type: 'backend',
    technologies: ['NestJS', 'MongoDB', 'JWT', 'Cloudinary', 'WebSockets'],
    github: 'https://github.com/BilalSubhani/BuilderAppBackend',
  },
  {
    title: 'Haider Desk Backend',
    description:
      'NestJS backend using MongoDB, JWT, Passport, Cloudinary, WebSockets, and analytics tracking.',
    type: 'backend',
    technologies: ['NestJS', 'MongoDB', 'JWT', 'Cloudinary', 'WebSockets'],
    github: 'https://github.com/BilalSubhani/haiderDeskBackend',
  },
  {
    title: 'Voxa',
    description:
      'Comprehensive backend with REST APIs, WebSockets, Nodemailer, Cloudinary, JWT, and chatbox support.',
    type: 'backend',
    technologies: ['NestJS', 'MongoDB', 'JWT', 'Chatbox', 'WebSockets'],
    github: 'https://github.com/BilalSubhani/Backend-NestJs',
  },
];

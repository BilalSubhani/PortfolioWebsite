export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', icon: 'fab fa-python' },
      { name: 'Go', icon: 'fab fa-golang' },
      { name: 'TypeScript', icon: 'fas fa-code' },
      { name: 'JavaScript', icon: 'fab fa-js' },
      { name: 'SQL', icon: 'fas fa-database' },
      { name: 'C++', icon: 'fas fa-laptop-code' },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'Next.js', icon: 'fas fa-n' },
      { name: 'React', icon: 'fab fa-react' },
      { name: 'Angular', icon: 'fab fa-angular' },
      { name: 'Zustand', icon: 'fas fa-store' },
      { name: 'TanStack Query', icon: 'fas fa-sync-alt' },
      { name: 'Radix UI', icon: 'fas fa-shapes' },
      { name: 'Shopify (Liquid, Polaris, Remix)', icon: 'fab fa-shopify' },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'FastAPI', icon: 'fas fa-bolt' },
      { name: 'NestJS', icon: 'fas fa-server' },
      { name: 'Node.js', icon: 'fab fa-node-js' },
      { name: 'Express.js', icon: 'fas fa-server' },
      { name: 'Celery', icon: 'fas fa-tasks' },
      { name: 'REST', icon: 'fas fa-project-diagram' },
      { name: 'WebSockets', icon: 'fas fa-plug' },
      { name: 'SSE', icon: 'fas fa-stream' },
      { name: 'Webhooks', icon: 'fas fa-link' },
      { name: 'Microservices', icon: 'fas fa-cubes' },
      { name: 'MCP servers', icon: 'fas fa-robot' },
    ],
  },
  {
    title: 'Databases & Messaging',
    skills: [
      { name: 'PostgreSQL', icon: 'fas fa-database' },
      { name: 'MySQL', icon: 'fas fa-database' },
      { name: 'MongoDB', icon: 'fas fa-leaf' },
      { name: 'Redis', icon: 'fas fa-layer-group' },
      { name: 'Valkey', icon: 'fas fa-key' },
      { name: 'PgBouncer', icon: 'fas fa-network-wired' },
      { name: 'RabbitMQ', icon: 'fas fa-share-alt' },
      { name: 'Change Data Capture', icon: 'fas fa-exchange-alt' },
    ],
  },
  {
    title: 'Voice & AI',
    skills: [
      { name: 'Asterisk', icon: 'fas fa-phone-alt' },
      { name: 'OpenSIPS', icon: 'fas fa-phone-volume' },
      { name: 'SIP', icon: 'fas fa-headset' },
      { name: 'LiveKit', icon: 'fas fa-broadcast-tower' },
      { name: 'VICIdial', icon: 'fas fa-phone-square-alt' },
      { name: 'Self-hosted TTS (Qwen3-TTS)', icon: 'fas fa-microphone-alt' },
      { name: 'Fine-tuning', icon: 'fas fa-sliders-h' },
      { name: 'RAG', icon: 'fas fa-search' },
      { name: 'LLMs', icon: 'fas fa-brain' },
    ],
  },
  {
    title: 'Testing & DevOps',
    skills: [
      { name: 'pytest', icon: 'fas fa-vial' },
      { name: 'Playwright', icon: 'fas fa-theater-masks' },
      { name: 'Jest', icon: 'fas fa-check-double' },
      { name: 'Docker', icon: 'fab fa-docker' },
      { name: 'Linux', icon: 'fab fa-linux' },
      { name: 'Gunicorn', icon: 'fas fa-cogs' },
      { name: 'Sentry', icon: 'fas fa-bug' },
      { name: 'Prometheus', icon: 'fas fa-fire' },
      { name: 'Grafana', icon: 'fas fa-chart-line' },
    ],
  },
];

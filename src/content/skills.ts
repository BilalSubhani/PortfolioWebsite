// Skills shown in the IDE explorer. `usedIn` only references work stated on the resume;
// the evidence label is derived from it, never set by hand.

export const usageRefs = {
  'voice-agent': { label: 'AI Voice Agent platform', where: 'Clear Wave' },
  'contact-centre': { label: 'Contact Centre platform', where: 'Clear Wave' },
  automation: { label: 'Automation Service', where: 'Clear Wave' },
  'tech-hype': { label: 'Pakistan Food Portal, Shopify & ERP work', where: 'Tech Hype' },
  'live-tabs': { label: '@live-tabs/next', where: 'Open source' },
  verlux: { label: 'verlux', where: 'Open source' },
  envcanary: { label: 'envcanary', where: 'Open source' },
  'currency-icon-map': { label: 'currency-icon-map', where: 'Open source' },
  portfolio: { label: 'bilalsubhani.com', where: 'This site' },
} as const;

export type UsageKey = keyof typeof usageRefs;

export interface Skill {
  name: string;
  dev: string;
  plain: string;
  usedIn: UsageKey[];
}

export interface SkillFile {
  file: string;
  title: string;
  skills: Skill[];
}

export type Evidence = 'Used in production' | 'Open source' | 'Hands-on';

const PRODUCTION: UsageKey[] = ['voice-agent', 'contact-centre', 'automation', 'tech-hype'];

export function evidenceFor(skill: Skill): Evidence {
  if (skill.usedIn.some((k) => PRODUCTION.includes(k))) return 'Used in production';
  if (skill.usedIn.length > 0) return 'Open source';
  return 'Hands-on';
}

export const skillFiles: SkillFile[] = [
  {
    file: 'languages.json',
    title: 'Languages',
    skills: [
      { name: 'Go', dev: 'Gateways and services that need high throughput with a small footprint.', plain: 'A fast language for parts of a system that must handle lots of work at once.', usedIn: ['voice-agent', 'automation'] },
      { name: 'Python', dev: 'Speech engine, FastAPI services and Celery workers.', plain: 'A versatile language, used here for AI speech and server code.', usedIn: ['voice-agent', 'contact-centre'] },
      { name: 'TypeScript', dev: 'Typed frontends and Node.js services.', plain: 'JavaScript with safety checks that catch mistakes before users see them.', usedIn: ['portfolio'] },
      { name: 'JavaScript', dev: 'Browser and Node.js code across web apps and npm packages.', plain: 'The language of the web, running in every browser.', usedIn: ['tech-hype', 'verlux', 'envcanary', 'currency-icon-map'] },
      { name: 'SQL', dev: 'Query tuning, migrations and reporting on PostgreSQL and MySQL.', plain: 'How you ask a database questions and change its data.', usedIn: ['contact-centre'] },
      { name: 'C++', dev: 'Systems-level fundamentals from engineering studies.', plain: 'A low-level language that runs close to the hardware.', usedIn: [] },
    ],
  },
  {
    file: 'frontend.json',
    title: 'Frontend',
    skills: [
      { name: 'Next.js', dev: 'App Router apps, SSR/SSG, and a tabs library for Next.js.', plain: 'A framework for building fast websites with React.', usedIn: ['contact-centre', 'live-tabs', 'portfolio'] },
      { name: 'React', dev: 'Component architecture and state management for large apps.', plain: 'A popular tool for building interactive web interfaces.', usedIn: ['live-tabs', 'portfolio'] },
      { name: 'Angular', dev: 'Feature modules for an in-house ERP.', plain: 'A framework from Google for building large web apps.', usedIn: ['tech-hype'] },
      { name: 'Zustand', dev: 'Lightweight shared client state.', plain: 'Keeps different parts of a page in sync.', usedIn: [] },
      { name: 'TanStack Query', dev: 'Server-state caching, refetching and mutations.', plain: 'Makes apps load data quickly and keep it fresh.', usedIn: [] },
      { name: 'Radix UI', dev: 'Accessible headless primitives.', plain: 'Building blocks that make menus and dialogs work for everyone, including keyboard users.', usedIn: [] },
      { name: 'Tailwind CSS', dev: 'Utility-first styling with design tokens.', plain: 'A fast way to style websites consistently.', usedIn: ['portfolio'] },
      { name: 'GSAP', dev: 'Timelines, ScrollTrigger and interaction motion.', plain: 'The animation engine behind this site’s motion.', usedIn: ['portfolio'] },
      { name: 'Shopify (Liquid, Polaris, Remix)', dev: 'Custom themes and embedded admin apps.', plain: 'Custom online stores and the tools to run them.', usedIn: ['tech-hype'] },
    ],
  },
  {
    file: 'backend.json',
    title: 'Backend',
    skills: [
      { name: 'FastAPI', dev: 'Async Python APIs for the voice agent and contact centre.', plain: 'A Python tool for building fast server APIs.', usedIn: ['voice-agent', 'contact-centre'] },
      { name: 'NestJS', dev: 'Structured Node.js backends for ERP features.', plain: 'An organised way to build Node.js servers.', usedIn: ['tech-hype'] },
      { name: 'Node.js', dev: 'Server runtime and npm package development.', plain: 'Runs JavaScript on servers instead of in the browser.', usedIn: ['tech-hype', 'verlux', 'envcanary'] },
      { name: 'Express.js', dev: 'Minimal HTTP services in the MERN stack.', plain: 'A small, popular toolkit for Node.js web servers.', usedIn: ['tech-hype'] },
      { name: 'Celery', dev: 'Distributed background jobs for the contact centre.', plain: 'Runs slow jobs in the background so the app stays fast.', usedIn: ['contact-centre'] },
      { name: 'Microservices', dev: 'Built 3 services around the contact centre platform.', plain: 'Splitting a big system into smaller parts that can scale on their own.', usedIn: ['contact-centre'] },
      { name: 'MCP servers', dev: 'An MCP server that lets AI agents create tickets, leads and tasks and log time.', plain: 'A bridge that lets AI assistants safely use a real app.', usedIn: ['contact-centre'] },
      { name: 'REST', dev: 'Resource APIs, validation and versioning.', plain: 'The standard way apps talk to servers.', usedIn: [] },
      { name: 'WebSockets & SSE', dev: 'Live, server-pushed updates.', plain: 'Lets a page update instantly without reloading.', usedIn: [] },
      { name: 'Webhooks', dev: 'Event-driven integrations between systems.', plain: 'Lets one app notify another the moment something happens.', usedIn: [] },
    ],
  },
  {
    file: 'data.json',
    title: 'Databases & Messaging',
    skills: [
      { name: 'PostgreSQL', dev: 'Primary database; led the migration from MySQL.', plain: 'A reliable database that stores the app’s data.', usedIn: ['contact-centre', 'automation'] },
      { name: 'MySQL', dev: 'Legacy database, migrated to PostgreSQL.', plain: 'A widely used database.', usedIn: ['contact-centre'] },
      { name: 'MongoDB', dev: 'Document storage for ERP and MERN apps.', plain: 'A flexible database for loosely structured data.', usedIn: ['tech-hype'] },
      { name: 'Redis', dev: 'Caching and fast shared state.', plain: 'Super-fast memory storage that keeps apps snappy.', usedIn: ['contact-centre', 'automation'] },
      { name: 'Valkey', dev: 'Sits between the app and DB to remove row locking at 250 active calls.', plain: 'A fast in-memory store that stopped the database becoming a bottleneck.', usedIn: ['voice-agent'] },
      { name: 'RabbitMQ', dev: 'Queues that took ticket intake from 50 to 16,000 req/s bursts.', plain: 'A queue that lets a system accept huge bursts of work without falling over.', usedIn: ['contact-centre', 'automation'] },
      { name: 'PgBouncer', dev: 'Connection pooling for Postgres.', plain: 'Lets many users share a few database connections.', usedIn: [] },
      { name: 'Change Data Capture', dev: 'Streaming database changes to other systems.', plain: 'Tells other systems the moment data changes.', usedIn: [] },
    ],
  },
  {
    file: 'voice-ai.json',
    title: 'Voice & AI',
    skills: [
      { name: 'Asterisk', dev: 'Call handling that scaled the voice agent to 250 concurrent calls.', plain: 'Open-source phone system software.', usedIn: ['voice-agent'] },
      { name: 'OpenSIPS', dev: 'SIP routing in front of Asterisk at 20 calls per second.', plain: 'Directs phone calls to the right place at high volume.', usedIn: ['voice-agent'] },
      { name: 'SIP', dev: 'The signalling protocol behind VoIP calls.', plain: 'The standard that internet phone calls use.', usedIn: ['voice-agent'] },
      { name: 'LiveKit', dev: 'Real-time media; the earlier voice stack before Asterisk.', plain: 'Real-time audio and video infrastructure.', usedIn: ['voice-agent'] },
      { name: 'VICIdial', dev: 'Contact-centre dialer integration.', plain: 'Software call centres use to place and manage calls.', usedIn: ['voice-agent'] },
      { name: 'Self-hosted TTS', dev: 'Fine-tuned Qwen3-TTS 1.7B; 70 req/s at under 20% GPU on an RTX 6000 Pro.', plain: 'Our own text-to-speech voice, which cut speech costs by 70%.', usedIn: ['voice-agent'] },
      { name: 'RAG', dev: 'Retrieval-augmented chatbot for public websites.', plain: 'An AI that answers using a company’s own information.', usedIn: ['voice-agent'] },
      { name: 'LLMs', dev: 'Used where they add value; removed from most of the call to cut costs 90%.', plain: 'Large language models, the AI behind chat assistants.', usedIn: ['voice-agent'] },
    ],
  },
  {
    file: 'devops.json',
    title: 'Testing & DevOps',
    skills: [
      { name: 'Docker', dev: 'Containerised services across environments.', plain: 'Packages an app so it runs the same everywhere.', usedIn: ['voice-agent'] },
      { name: 'Linux', dev: 'Running and tuning production servers.', plain: 'The operating system most servers run on.', usedIn: [] },
      { name: 'pytest', dev: 'Backend test suites.', plain: 'Automated checks for Python code.', usedIn: [] },
      { name: 'Playwright', dev: 'End-to-end browser tests.', plain: 'A robot that clicks through the app to check it works.', usedIn: [] },
      { name: 'Jest', dev: 'Unit tests for JavaScript and TypeScript.', plain: 'Automated checks for JavaScript code.', usedIn: [] },
      { name: 'Gunicorn', dev: 'Python app server tuning.', plain: 'Runs Python web apps in production.', usedIn: [] },
      { name: 'Sentry', dev: 'Error tracking and alerting.', plain: 'Alerts the team when something breaks for a user.', usedIn: [] },
      { name: 'Prometheus & Grafana', dev: 'Metrics and dashboards.', plain: 'Charts that show how healthy the system is.', usedIn: [] },
    ],
  },
];

export const allSkills = skillFiles.flatMap((f) => f.skills.map((s) => ({ ...s, file: f.file, category: f.title })));

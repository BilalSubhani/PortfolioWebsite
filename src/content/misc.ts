import { profile } from './profile';

export const quotes = [
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  {
    text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    author: 'Harold Abelson',
  },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
];

// Visible on the page AND emitted as FAQPage JSON-LD — keep both in sync by only editing here.
export const faq = [
  {
    q: 'Who is Bilal Subhani?',
    a: `${profile.name} is a full-stack software engineer and team lead at ${profile.currentCompany} in Lahore, Pakistan, with 2+ years of experience building web apps, backends and AI voice agents.`,
  },
  {
    q: 'What does Bilal specialise in?',
    a: 'Making systems hold up under real load: high-concurrency voice AI (Go, Python, Asterisk, OpenSIPS), queue-based backends (RabbitMQ, PostgreSQL, Redis) and full-stack web apps (Next.js, React, FastAPI, NestJS).',
  },
  {
    q: 'Is Bilal available for remote work?',
    a: 'Yes. He is based in Lahore, Pakistan, and open to remote roles as well as freelance and collaboration work.',
  },
  {
    q: 'What has Bilal built?',
    a: 'An AI voice agent platform running 250 concurrent calls, a contact centre platform used by 500+ people, a Go automation service, and 4+ open-source npm packages including @live-tabs/next and verlux.',
  },
  {
    q: 'How can I contact Bilal Subhani?',
    a: `Use the contact form on this site, email ${profile.email}, or message him on LinkedIn or WhatsApp.`,
  },
];

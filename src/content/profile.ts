// Single source of truth for profile facts. Everything here comes from the resume;
// keep it that way — the terminal, SEO metadata and llms.txt all read from this file.

export const SITE_URL = 'https://bilalsubhani.com';

export const profile = {
  name: 'Bilal Subhani',
  initials: 'BS',
  role: 'Full-Stack Software Engineer',
  roles: ['Full-Stack Software Engineer', 'Team Lead'],
  tagline: 'Engineering with purpose.',
  heroLines: ['Building software.', 'Solving problems.', 'Making things work.'],
  intro:
    'Full-stack engineer with 2+ years of building web apps and making them hold up under real load. ' +
    'I lead a team of 6 developers at Clear Wave, build AI voice agents, and publish open-source npm packages.',
  introPlain:
    'I build the software behind websites, business tools and AI phone systems, and make sure it keeps working when thousands of people use it at once. ' +
    'I lead a team of 6 developers at Clear Wave and publish free tools for other developers.',
  location: 'Lahore, Pakistan',
  availability: 'Open to remote roles',
  email: 'bilalsubhanii@outlook.com',
  phone: '+92 305 401 8401',
  phoneHref: 'tel:+923054018401',
  resumeUrl: '/Bilal-Subhani-Resume.pdf',
  currentCompany: 'Clear Wave Information Technologies',
  education: {
    degree: 'BSc Electrical Engineering',
    school: 'FAST NUCES, Lahore',
    period: '2019 – 2023',
    detail: 'Specialisation in Computer Engineering',
  },
  english: 'IELTS overall band 8.0 (2024)',
};

export const stats = [
  { value: 250, suffix: '', label: 'concurrent AI calls on one server', labelPlain: 'AI phone calls at once, on one server' },
  { value: 16000, suffix: '', label: 'req/s ticket bursts handled', labelPlain: 'support requests a second, without crashing' },
  { value: 500, suffix: '+', label: 'people on platforms I own', labelPlain: 'people use software I look after' },
  { value: 4, suffix: '+', label: 'npm packages published', labelPlain: 'free tools published for developers' },
];

// The plain-English hero's "in plain words" highlights.
export const plainHighlights = ['I build software that keeps working when it gets busy', 'I lead a team of 6 developers', 'I make AI useful and affordable'];

export type SocialKey = 'github' | 'linkedin' | 'upwork' | 'whatsapp' | 'email';

export const socials: { key: SocialKey; label: string; href: string; handle: string }[] = [
  { key: 'github', label: 'GitHub', href: 'https://github.com/BilalSubhani', handle: 'BilalSubhani' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/bilal-subhani', handle: 'in/bilal-subhani' },
  {
    key: 'upwork',
    label: 'Upwork',
    href: 'https://www.upwork.com/freelancers/~017b5c0c306ea4f8c0?mp_source=share',
    handle: 'Bilal Subhani',
  },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/923054018401', handle: '+92 305 401 8401' },
  { key: 'email', label: 'Email', href: 'mailto:bilalsubhanii@outlook.com', handle: 'bilalsubhanii@outlook.com' },
];

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'lab', label: 'Lab' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

// Reasons to get in touch — each one backed by a number from the resume.
export const reasons = [
  {
    title: 'Your system needs to survive real traffic',
    body: 'Rebuilt ticket intake from failing at 50 req/s to absorbing 16,000 req/s bursts, and cut report loads from 20+ seconds to 250 ms.',
    bodyPlain: 'A support-ticket system that crashed at 50 requests a second now copes with bursts of 16,000. Reports that took 20+ seconds now open in a quarter of a second.',
    metric: '320×',
    metricLabel: 'more ticket throughput',
  },
  {
    title: 'Your cloud or AI bill is too high',
    body: 'Self-hosted and fine-tuned a TTS model to cut speech costs by 70%, and took the LLM out of most calls to cut outbound costs by 90%.',
    bodyPlain: 'Running our own AI voice instead of a paid service cut speech costs by 70%. Using AI only where it was actually needed cut the cost of outgoing calls by 90%.',
    metric: '90%',
    metricLabel: 'lower outbound call cost',
  },
  {
    title: 'You want AI that works in production',
    body: 'Built a voice agent that runs 250 concurrent calls, a RAG chatbot for public websites, and an MCP server that lets AI agents work inside a real platform.',
    bodyPlain: 'An AI phone agent that handles 250 calls at the same time, a chatbot that answers visitors’ questions on websites, and a safe way for AI assistants to do real work inside a business app.',
    metric: '12.5×',
    metricLabel: 'more concurrent calls',
  },
  {
    title: 'You need someone who can lead, not just ship',
    body: 'Lead 6 developers on a platform used by 500+ people, own its architecture and production issues, and have run 50+ technical interviews.',
    bodyPlain: 'Lead a team of 6 developers on software used by 500+ people, am responsible for how it’s built and for fixing it when something breaks, and have interviewed 50+ job candidates.',
    metric: '10+',
    metricLabel: 'junior developers trained',
  },
];

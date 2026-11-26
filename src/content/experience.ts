// Kept deliberately short — the full detail lives in the resume.

export interface Experience {
  id: string;
  company: string;
  role: string;
  start: string; // ISO yyyy-mm
  end: string | null; // null = present
  period: string;
  location: string;
  summary: string;
  summaryPlain: string;
  wins: string[];
  winsPlain: string[];
  stack: string[];
}

export const experiences: Experience[] = [
  {
    id: 'clear-wave',
    company: 'Clear Wave Information Technologies',
    role: 'Software Engineer, Team Lead',
    start: '2025-07',
    end: null,
    period: 'Jul 2025 – Present',
    location: 'Lahore, Pakistan',
    summary:
      'Lead a team of 6 on a contact centre platform used by 500+ people, and build the company’s AI voice agent and Go automation service.',
    summaryPlain:
      'Lead a team of 6 building customer-support software used by 500+ people, and build the company’s AI phone agent and the service that automates its routine work.',
    wins: [
      'Voice agent: 20 → 250 concurrent calls on the same server',
      'Ticket intake: 50 → 16,000 req/s bursts',
      'Speech costs down 70% with a self-hosted TTS model',
    ],
    winsPlain: [
      'AI phone agent: from 20 to 250 calls at once on the same server',
      'Support tickets: from crashing at 50 a second to handling bursts of 16,000',
      'Speech costs down 70% by running our own AI voice',
    ],
    stack: ['Go', 'Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'RabbitMQ', 'Asterisk'],
  },
  {
    id: 'tech-hype',
    company: 'Tech Hype',
    role: 'Junior Developer · MERN Intern',
    start: '2024-09',
    end: '2025-06',
    period: 'Sep 2024 – Jun 2025',
    location: 'Lahore, Pakistan',
    summary:
      'Helped launch the Pakistan Food Portal and led its data team, and built Shopify themes and apps and HR features for an in-house ERP.',
    summaryPlain:
      'Helped launch the Pakistan Food Portal and led its data team, and built online-store designs and apps on Shopify plus HR features for the company’s internal business software.',
    wins: [
      'Pakistan Food Portal: 2,000+ restaurants listed in 6 months',
      '5 Shopify themes + 2 admin apps',
      'Public sites scoring 95+ on Lighthouse',
    ],
    winsPlain: [
      'Pakistan Food Portal: 2,000+ restaurants listed in 6 months',
      '5 online-store designs and 2 store admin apps',
      'Public websites scoring 95+ on Google’s Lighthouse quality check',
    ],
    stack: ['Angular', 'NestJS', 'MongoDB', 'Shopify', 'Remix'],
  },
];

// Earlier roles, before full-time engineering.
export interface Sidequest {
  id: string;
  org: string;
  role: string;
  period: string;
  note: string;
  icon: 'code' | 'megaphone' | 'sparkles';
}

export const sidequests: Sidequest[] = [
  {
    id: 'purelogics',
    org: 'PureLogics',
    role: 'Intern Software Engineer (MERN)',
    period: 'Sep – Dec 2023',
    note: 'Completed MERN training and built an e-commerce platform with product and order management.',
    icon: 'code',
  },
  {
    id: 'pro-it-city',
    org: 'Pro IT City',
    role: 'Media Manager',
    period: 'Nov 2021 – Mar 2022',
    note: 'Grew social followings by 30%, built a client site on Wix, and helped a client reach 10,000+ YouTube subscribers.',
    icon: 'megaphone',
  },
  {
    id: 'alphas',
    org: 'The Alpha’s Digital Marketing',
    role: 'Marketing Intern',
    period: 'Oct 2018 – Apr 2019',
    note: 'Worked on 5+ Facebook and Instagram campaigns and managed content for 10+ client pages, lifting average engagement by 15%.',
    icon: 'sparkles',
  },
];

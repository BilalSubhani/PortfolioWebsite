// Text wrapped in **double asterisks** is rendered bold (see components/RichText).

export interface ExperienceProject {
  name: string;
  description?: string;
  stack?: string;
  highlights: string[];
}

export interface Experience {
  company: string;
  title: string;
  period: string;
  location: string;
  highlights?: string[];
  projects?: ExperienceProject[];
}

export const experiences: Experience[] = [
  {
    company: 'Clear Wave Information Technologies',
    title: 'Software Engineer, Team Lead',
    period: 'Jul 2025 – Present',
    location: 'Lahore, Pakistan',
    projects: [
      {
        name: 'AI Voice Agent and Chatbot Platform',
        description:
          'Multi-tenant SaaS: companies sign up and get a set number of calling campaigns and chatbots based on their plan.',
        stack: 'Go, Python, FastAPI, Asterisk, OpenSIPS, LiveKit, VICIdial, Valkey, Docker',
        highlights: [
          'Took the voice agent from **20 to 250 concurrent calls** on the same server, at 20 calls per second, by moving from LiveKit to Asterisk and OpenSIPS.',
          'Self-hosted and fine-tuned a Qwen3-TTS 1.7B model, cutting our Deepgram costs by **70%**.',
          'Built the speech engine in Python with a Go gateway in front. It handles **70 requests per second** continuously at under **20%** GPU load on an RTX 6000 Pro.',
          'Put Valkey between the app and the database to remove row locking, so the system now runs **250 active calls** at once.',
          'Cut outbound calling costs by **90%** and inbound by **50%** by taking the LLM out of most of the call.',
          'Raised the call transfer rate from **1% to 7%** by fixing answering machine detection and handling interruptions and noise.',
          'Moved call flows into per-campaign settings, so new campaigns need no code changes.',
          'Built a RAG chatbot that answers visitor questions on public websites.',
          'Now moving speech-to-text, voice detection, answering machine detection and barge-in onto our own models.',
        ],
      },
      {
        name: 'Contact Centre Platform',
        description: 'Ticketing, CRM, projects and time tracking.',
        stack: 'Next.js, FastAPI, PostgreSQL, Redis, RabbitMQ, Celery',
        highlights: [
          'Lead a team of **6 developers** and support 3 more on a platform used by **500+ people** at a UK client. I own its architecture, scaling and production issues.',
          'Handle the technical side of the client relationship: meetings, data audits, support and documentation.',
          'Took ticket intake from failing at **50 req/s** to handling bursts of **16,000 req/s** by rebuilding it around RabbitMQ.',
          'Cut report load times from **20+ seconds to 250 ms**.',
          'Cut database connections under load from **130 to 40**, so the platform runs well on a low-spec server.',
          'Migrated the database from MySQL to PostgreSQL.',
          'Added live updates for users, such as permission changes and forced logout, without page reloads.',
          "Set up the platform's first automated tests on both frontend and backend.",
          'Built 3 microservices and an MCP server that lets AI agents create tickets, leads and tasks and log time.',
        ],
      },
      {
        name: 'Automation Service',
        description: 'Standalone service for the contact centre platform.',
        stack: 'Go, PostgreSQL, RabbitMQ, Redis',
        highlights: [
          'Designed and built it from scratch. Users set up automations that run on a schedule, on platform events or from outside triggers. It runs approvals and escalations for the whole platform.',
          'Serves **500+ users** using at most **5%** of a shared 24-core server that runs 12 other apps.',
        ],
      },
      {
        name: 'Team and Engineering Practices',
        highlights: [
          'Trained **10+** junior developers and onboard every new junior on the team.',
          'On the interview panel: ran **50+** technical interviews for junior to senior roles.',
          'Run internal sessions for the team, including on using AI tools well.',
          'Replaced manual SQL changes on the database with versioned migrations.',
        ],
      },
    ],
  },
  {
    company: 'Tech Hype',
    title: 'Junior Developer (Dec 2024 – Jun 2025), MERN Intern (Sep – Nov 2024)',
    period: 'Sep 2024 – Jun 2025',
    location: 'Lahore, Pakistan',
    highlights: [
      'Helped launch the Pakistan Food Portal, which listed **2,000+** Lahore restaurants in 6 months, and led its data team.',
      'Replaced manual restaurant data entry with bulk CSV imports.',
      'Built 5 custom Shopify themes and 2 Shopify admin apps with Remix and Polaris.',
      'Built HR features for an in-house ERP (Angular, NestJS, MongoDB).',
      'Built public websites scoring **95+** on Lighthouse.',
    ],
  },
];

export const education = {
  degree: 'Bachelor of Science in Electrical Engineering',
  school: 'FAST NUCES, Lahore',
  period: '2019 – 2023',
  detail: 'Specialisation in Computer Engineering',
  extra: 'English: Professional working proficiency, IELTS overall band 8.0 (2024)',
};

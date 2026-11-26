export type ProjectStatus = 'Published on npm' | 'Live';

export interface Project {
  slug: string;
  title: string;
  category: 'Open source' | 'Web';
  summary: string;
  summaryPlain: string;
  status: ProjectStatus;
  stack: string[];
  links: { npm?: string; github?: string; live?: string };
  featured: boolean;
  caseStudy: {
    problem: string;
    approach: string;
    features: string[];
    role: string;
  };
}

export const projects: Project[] = [
  {
    slug: 'live-tabs',
    title: '@live-tabs/next',
    category: 'Open source',
    summary:
      'Browser-style tabs for Next.js where each page stays open in the background, so scroll position, form input and loaded data survive tab switches.',
    summaryPlain: 'Lets websites keep several pages open like browser tabs, so nothing you typed or scrolled to is lost when you switch between them.',
    status: 'Published on npm',
    stack: ['Next.js', 'React'],
    links: { npm: 'https://www.npmjs.com/package/@live-tabs/next' },
    featured: true,
    caseStudy: {
      problem:
        'In Next.js, switching between pages unmounts them: scroll position, half-filled forms and fetched data are lost. No existing package kept pages alive like browser tabs.',
      approach:
        'Keep each opened page mounted in the background and switch between them like tabs. The framework-free logic is published separately as @live-tabs/core so other frameworks can build on it.',
      features: [
        'Pages stay open in the background between tab switches',
        'Scroll position, form input and loading data survive switching',
        'Framework-free core published as @live-tabs/core',
      ],
      role: 'Designed and built from scratch; published under the Clear Wave GitHub organization.',
    },
  },
  {
    slug: 'verlux',
    title: 'verlux',
    category: 'Open source',
    summary: 'Offline profanity filter for Node.js. Checks 5 languages in one pass, catches disguised words, no dependencies.',
    summaryPlain: 'Filters out swear words in 5 languages, even disguised ones, without needing an internet connection.',
    status: 'Published on npm',
    stack: ['Node.js'],
    links: { npm: 'https://www.npmjs.com/package/verlux' },
    featured: true,
    caseStudy: {
      problem: 'Filtering profanity usually means calling an external API or shipping heavy dependencies, and simple word lists miss disguised spellings.',
      approach: 'A self-contained Node.js filter that runs fully offline and checks several languages in a single pass.',
      features: ['5 languages checked in one pass', 'Catches disguised words', 'Zero dependencies, works offline'],
      role: 'Designed and built from scratch; published under the Clear Wave GitHub organization.',
    },
  },
  {
    slug: 'envcanary',
    title: 'envcanary',
    category: 'Open source',
    summary: 'Catches missing or wrong environment settings before deploy, and fails CI when they don’t match.',
    summaryPlain: 'Catches missing or wrong settings before an app goes live, so a broken release is stopped before anyone sees it.',
    status: 'Published on npm',
    stack: ['Node.js', 'CI'],
    links: { npm: 'https://www.npmjs.com/package/envcanary' },
    featured: true,
    caseStudy: {
      problem: 'A missing or mistyped environment variable often only shows up after a deploy, when the app is already broken.',
      approach: 'Check environment settings before deploy and make CI fail when they don’t match what the app expects.',
      features: ['Detects missing environment settings', 'Detects wrong values', 'Fails CI on mismatch'],
      role: 'Designed and built from scratch; published under the Clear Wave GitHub organization.',
    },
  },
  {
    slug: 'currency-icon-map',
    title: 'currency-icon-map',
    category: 'Open source',
    summary: 'Finds the right icon for 184 currencies by code, symbol, country or name, across 4 icon libraries.',
    summaryPlain: 'Finds the right symbol for 184 currencies, whether you search by currency code, symbol, country or name.',
    status: 'Published on npm',
    stack: ['JavaScript', 'Icons'],
    links: { npm: 'https://www.npmjs.com/package/currency-icon-map' },
    featured: true,
    caseStudy: {
      problem: 'Matching a currency to the right icon is tedious: libraries name icons differently, and input arrives as a code, a symbol, a country or a name.',
      approach: 'One lookup that resolves any of those inputs to the matching icon in each supported icon library.',
      features: ['184 currencies', 'Look up by code, symbol, country or name', '4 icon libraries supported'],
      role: 'Designed and built from scratch; published under the Clear Wave GitHub organization.',
    },
  },
  {
    slug: 'portfolio',
    title: 'bilalsubhani.com',
    category: 'Web',
    summary:
      'This site: a statically generated Next.js portfolio with GSAP motion, an interactive skills IDE and a command-line terminal you can actually type into.',
    summaryPlain: 'This website: fast, readable and full of things to play with, including a load-testing lab and a terminal you can type into.',
    status: 'Live',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis'],
    links: { github: 'https://github.com/BilalSubhani/PortfolioWebsite', live: 'https://bilalsubhani.com' },
    featured: true,
    caseStudy: {
      problem: 'A resume says what you did. A portfolio should show how you think and build, and still let a recruiter get the picture in 30 seconds.',
      approach:
        'Static generation for speed and SEO, small client-side islands for interaction, and GSAP for all motion, with reduced-motion fallbacks throughout.',
      features: [
        'Interactive terminal with history, autocomplete and offline answers',
        'IDE-style skills explorer with developer and plain-language views',
        'Structured data, sitemap and llms.txt for search and answer engines',
        'Warm dark and light themes with no flash on load',
      ],
      role: 'Designed and built end to end.',
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

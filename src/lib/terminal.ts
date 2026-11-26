// Terminal engine: a pure command parser over the approved content files.
// It never executes shell commands, never fetches arbitrary URLs and never evals input.

import { faq, quotes } from '@/content/misc';
import { experiences, sidequests } from '@/content/experience';
import { navItems, profile, reasons, socials } from '@/content/profile';
import { projects } from '@/content/projects';
import { allSkills, evidenceFor, skillFiles, usageRefs } from '@/content/skills';
import type { AchievementId } from './achievements';

export type Tone = 'accent' | 'muted' | 'ok' | 'err' | 'strong';
export interface Seg {
  t: string;
  tone?: Tone;
  href?: string;
  cmd?: string; // clicking runs this command
}
export type Line = Seg[];

export type Effect =
  | { type: 'clear' }
  | { type: 'navigate'; href: string }
  | { type: 'scroll'; id: string }
  | { type: 'theme'; value: 'dark' | 'light' | 'toggle' }
  | { type: 'close' }
  | { type: 'role'; value?: 'dev' | 'plain' }
  | { type: 'buddy'; value: string };

export interface Result {
  lines: Line[];
  effect?: Effect;
  achievement?: AchievementId;
}

export const MAX_INPUT = 200;

const L = (...segs: (Seg | string)[]): Line => segs.map((s) => (typeof s === 'string' ? { t: s } : s));
const blank: Line = [{ t: '' }];
const pad = (s: string, n: number) => s + ' '.repeat(Math.max(1, n - s.length));

interface Command {
  name: string;
  desc: string;
  args?: () => string[];
  hidden?: boolean;
  run: (args: string[], ctx: { history: string[] }) => Result;
}

const sectionIds = [...navItems.map((n) => n.id), 'terminal', 'reasons', 'side-quests', 'faq', 'home'];

const commands: Command[] = [
  {
    name: 'help',
    desc: 'list available commands',
    run: () => ({
      lines: [
        L({ t: 'Available commands', tone: 'strong' }),
        ...commands
          .filter((c) => !c.hidden)
          .map((c) => L({ t: pad(c.name, 13), tone: 'accent', cmd: c.name }, { t: c.desc, tone: 'muted' })),
        blank,
        L({ t: 'Or just ask a question, e.g. ', tone: 'muted' }, { t: 'has he built anything with RabbitMQ?', cmd: 'has he built anything with RabbitMQ?' }),
        L({ t: '↑/↓ history · Tab autocomplete · Ctrl+L clear', tone: 'muted' }),
      ],
    }),
  },
  {
    name: 'about',
    desc: 'who is Bilal?',
    run: () => ({
      lines: [
        L({ t: profile.name, tone: 'strong' }, { t: ` — ${profile.roles.join(' · ')}`, tone: 'muted' }),
        L(profile.intro),
        L({ t: `${profile.location} · ${profile.availability}`, tone: 'muted' }),
        L({ t: `${profile.education.degree}, ${profile.education.school} (${profile.education.period})`, tone: 'muted' }),
      ],
    }),
  },
  {
    name: 'whoami',
    desc: 'who are you?',
    hidden: true,
    run: () => ({ lines: [L('guest@bilalsubhani.com — welcome. Type '), L({ t: 'hire', cmd: 'hire', tone: 'accent' }, ' to see why people reach out.')] }),
  },
  {
    name: 'skills',
    desc: 'skills by category  [skills <category>]',
    args: () => skillFiles.map((f) => f.file.replace('.json', '')),
    run: (args) => {
      const key = args[0]?.toLowerCase();
      const files = key ? skillFiles.filter((f) => f.file.startsWith(key) || f.title.toLowerCase().includes(key)) : skillFiles;
      if (!files.length) return { lines: [L({ t: `No category "${key}". Try: `, tone: 'err' }, skillFiles.map((f) => f.file.replace('.json', '')).join(', '))] };
      return {
        lines: files.flatMap((f) => [
          L({ t: f.title, tone: 'strong' }),
          L({ t: f.skills.map((s) => s.name).join(' · '), tone: 'muted' }),
        ]),
      };
    },
  },
  {
    name: 'projects',
    desc: 'open source & projects',
    run: () => ({
      lines: [
        ...projects.map((p) => L({ t: pad(p.slug, 20), tone: 'accent', cmd: `open ${p.slug}` }, { t: p.summary, tone: 'muted' })),
        blank,
        L({ t: 'open <name>', tone: 'accent' }, { t: ' to read a case study', tone: 'muted' }),
      ],
    }),
  },
  {
    name: 'open',
    desc: 'open a project  [open <name>]',
    args: () => projects.map((p) => p.slug),
    run: (args) => {
      const p = projects.find((x) => x.slug === args[0]?.toLowerCase());
      if (!p) return { lines: [L({ t: 'Usage: open <name>. Try ', tone: 'err' }, { t: 'projects', cmd: 'projects', tone: 'accent' })] };
      return { lines: [L({ t: `Opening ${p.title}…`, tone: 'ok' })], effect: { type: 'navigate', href: `/projects/${p.slug}` } };
    },
  },
  {
    name: 'experience',
    desc: 'where Bilal has worked',
    run: () => ({
      lines: [
        ...experiences.flatMap((e) => [
          L({ t: e.company, tone: 'strong' }, { t: `  ${e.period}`, tone: 'muted' }),
          L({ t: e.role, tone: 'accent' }),
          ...e.wins.map((w) => L({ t: '  ▸ ', tone: 'accent' }, w)),
        ]),
        blank,
        L({ t: 'Full history → ', tone: 'muted' }, { t: 'resume', cmd: 'resume', tone: 'accent' }, { t: ' · earlier roles → ', tone: 'muted' }, { t: 'side-quests', cmd: 'side-quests', tone: 'accent' }),
      ],
    }),
  },
  {
    name: 'side-quests',
    desc: 'life before full-time engineering',
    run: () => ({
      lines: sidequests.flatMap((s) => [L({ t: s.org, tone: 'strong' }, { t: `  ${s.role} · ${s.period}`, tone: 'muted' }), L(s.note)]),
    }),
  },
  {
    name: 'hire',
    desc: 'why people reach out',
    run: () => ({
      lines: [
        ...reasons.flatMap((r) => [L({ t: `${r.metric} `, tone: 'accent' }, { t: r.title, tone: 'strong' }), L({ t: r.body, tone: 'muted' })]),
        blank,
        L({ t: '→ ', tone: 'accent' }, { t: 'contact', cmd: 'contact', tone: 'accent' }, ' to start a conversation'),
      ],
    }),
  },
  {
    name: 'contact',
    desc: 'ways to reach Bilal',
    run: () => ({
      lines: [
        L({ t: pad('email', 10), tone: 'muted' }, { t: profile.email, href: `mailto:${profile.email}` }),
        L({ t: pad('phone', 10), tone: 'muted' }, { t: profile.phone, href: profile.phoneHref }),
        L({ t: pad('form', 10), tone: 'muted' }, { t: '/contact', href: '/contact' }),
      ],
      effect: { type: 'scroll', id: 'contact' },
    }),
  },
  {
    name: 'socials',
    desc: 'social profiles',
    run: () => ({ lines: socials.map((s) => L({ t: pad(s.label.toLowerCase(), 10), tone: 'muted' }, { t: s.handle, href: s.href })) }),
  },
  {
    name: 'resume',
    desc: 'open the full resume',
    run: () => ({ lines: [L({ t: 'Resume → ', tone: 'muted' }, { t: 'open in a new tab', href: profile.resumeUrl })] }),
  },
  {
    name: 'quote',
    desc: 'a random engineering quote',
    run: () => {
      const q = quotes[Math.floor(Math.random() * quotes.length)];
      return { lines: [L({ t: `“${q.text}”`, tone: 'strong' }), L({ t: `— ${q.author}`, tone: 'muted' })] };
    },
  },
  {
    name: 'goto',
    desc: 'scroll to a section  [goto <section>]',
    args: () => sectionIds,
    run: (args) => {
      const id = args[0]?.toLowerCase();
      if (!id || !sectionIds.includes(id)) return { lines: [L({ t: `Usage: goto <${sectionIds.join('|')}>`, tone: 'err' })] };
      return { lines: [L({ t: `→ #${id}`, tone: 'ok' })], effect: { type: 'scroll', id } };
    },
  },
  {
    name: 'theme',
    desc: 'switch theme  [theme dark|light]',
    args: () => ['dark', 'light'],
    run: (args) => {
      const v = args[0]?.toLowerCase();
      const value = v === 'dark' || v === 'light' ? v : 'toggle';
      return { lines: [L({ t: `Theme: ${value}`, tone: 'ok' })], effect: { type: 'theme', value } };
    },
  },
  {
    name: 'role',
    desc: 'switch path  [role dev|plain]',
    args: () => ['dev', 'plain'],
    run: (args) => {
      const v = args[0]?.toLowerCase();
      if (v === 'dev' || v === 'plain')
        return { lines: [L({ t: `Path: ${v === 'dev' ? 'Merge Conflict Survivor' : 'Quest Merchant'}`, tone: 'ok' })], effect: { type: 'role', value: v } };
      return { lines: [L({ t: 'Opening the path picker…', tone: 'muted' })], effect: { type: 'role' } };
    },
  },
  {
    name: 'buddy',
    desc: 'your roaming companion  [buddy robot|alien|knight|zombie|off]',
    args: () => ['robot', 'alien', 'knight', 'zombie', 'off', 'on'],
    run: (args) => {
      const v = (args[0] ?? 'on').toLowerCase();
      if (!['robot', 'alien', 'knight', 'zombie', 'off', 'on'].includes(v))
        return { lines: [L({ t: 'Usage: buddy robot|alien|knight|zombie|off', tone: 'err' })] };
      return {
        lines: [L({ t: v === 'off' ? 'Buddy sent home. Type buddy on to bring them back.' : `Here comes the ${v === 'on' ? 'robot' : v}.`, tone: 'ok' })],
        effect: { type: 'buddy', value: v },
      };
    },
  },
  {
    name: 'history',
    desc: 'commands you have run',
    run: (_a, { history }) => ({
      lines: history.length ? history.map((h, i) => L({ t: pad(String(i + 1), 5), tone: 'muted' }, { t: h, cmd: h })) : [L({ t: 'No history yet.', tone: 'muted' })],
    }),
  },
  {
    name: 'clear',
    desc: 'clear the screen',
    run: () => ({ lines: [], effect: { type: 'clear' } }),
  },
  {
    name: 'sudo',
    desc: '',
    hidden: true,
    run: () => ({
      lines: [L({ t: 'Nice try. This terminal can only read the portfolio — it can’t run anything.', tone: 'err' })],
      achievement: 'sudo',
    }),
  },
  {
    name: 'coffee',
    desc: '',
    hidden: true,
    run: () => ({
      lines: [
        L({ t: '      ( (', tone: 'muted' }),
        L({ t: '       ) )', tone: 'muted' }),
        L({ t: '    ........', tone: 'accent' }),
        L({ t: '    |      |]', tone: 'accent' }),
        L({ t: '    \\      /', tone: 'accent' }),
        L({ t: "     `----'", tone: 'accent' }),
        L({ t: 'Brewing… ☕ Thanks for stopping by.', tone: 'muted' }),
      ],
      achievement: 'coffee',
    }),
  },
  {
    name: 'hello',
    desc: '',
    hidden: true,
    run: () => ({ lines: [L('Hey 👋 Glad you’re here. Try '), L({ t: 'hire', cmd: 'hire', tone: 'accent' }, { t: ' or ', tone: 'muted' }, { t: 'projects', cmd: 'projects', tone: 'accent' }, { t: '.', tone: 'muted' })] }),
  },
  {
    name: 'ping',
    desc: '',
    hidden: true,
    run: () => ({ lines: [L({ t: 'pong — 0 dropped, thanks to a queue.', tone: 'ok' })] }),
  },
  {
    name: 'ls',
    desc: '',
    hidden: true,
    run: () => ({ lines: [L({ t: sectionIds.filter((s) => s !== 'home').map((s) => s.replace(/-/g, '‑') + '/').join('  '), tone: 'accent' }), L({ t: 'Use goto <name> to jump to one.', tone: 'muted' })] }),
  },
  {
    name: 'exit',
    desc: '',
    hidden: true,
    run: () => ({ lines: [L({ t: 'Bye for now.', tone: 'muted' })], effect: { type: 'close' } }),
  },
];

const commandNames = commands.map((c) => c.name);

// ---------- offline question answering (grounded in content only) ----------

interface Entry {
  text: Line;
  haystack: string;
  boost: string[];
}

const STOP = new Set(
  'a an the is are was were be been does do did has have had he his him bilal bilals subhani what which who whom how when where why any anything something with in on of for to and or it its this that use uses used using ever built build work worked know knows can could you your me i tell about there'.split(' '),
);

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9.+#\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((w) => w.length > 1 && !STOP.has(w));

let index: Entry[] | null = null;
function buildIndex(): Entry[] {
  const entries: Entry[] = [];
  for (const s of allSkills) {
    const where = s.usedIn.map((k) => usageRefs[k].label);
    entries.push({
      text: L(
        { t: s.name, tone: 'strong' },
        { t: ` [${evidenceFor(s)}] `, tone: 'muted' },
        s.dev,
        ...(where.length ? [{ t: ` Used in: ${where.join(', ')}.`, tone: 'muted' as Tone }] : []),
      ),
      haystack: `${s.name} ${s.category} ${s.dev} ${s.plain} ${where.join(' ')}`.toLowerCase(),
      boost: tokenize(s.name),
    });
  }
  for (const e of experiences) {
    entries.push({
      text: L({ t: `${e.company} (${e.period}) `, tone: 'strong' }, e.summary, { t: ` ${e.wins.join('; ')}.`, tone: 'muted' }),
      haystack: `${e.company} ${e.role} ${e.summary} ${e.wins.join(' ')} ${e.stack.join(' ')} experience job work company role`.toLowerCase(),
      boost: tokenize(e.company),
    });
  }
  for (const s of sidequests) {
    entries.push({ text: L({ t: `${s.org} (${s.period}) `, tone: 'strong' }, `${s.role}. ${s.note}`), haystack: `${s.org} ${s.role} ${s.note} marketing side quest`.toLowerCase(), boost: tokenize(s.org) });
  }
  for (const p of projects) {
    entries.push({
      text: L({ t: p.title, tone: 'strong', cmd: `open ${p.slug}` }, ` ${p.summary}`),
      haystack: `${p.title} ${p.slug} ${p.summary} ${p.stack.join(' ')} project open source npm package`.toLowerCase(),
      boost: tokenize(`${p.title} ${p.slug}`),
    });
  }
  for (const r of reasons) entries.push({ text: L({ t: r.title, tone: 'strong' }, ` ${r.body}`), haystack: `${r.title} ${r.body}`.toLowerCase(), boost: [] });
  for (const f of faq) entries.push({ text: L(f.a), haystack: `${f.q} ${f.a}`.toLowerCase(), boost: [] });
  return entries;
}

function answer(question: string): Result {
  index ??= buildIndex();
  const terms = tokenize(question);
  if (!terms.length) return fallback(question);

  // Category questions ("what backend tech…", "which databases…") list the whole category.
  const CATEGORY_WORDS: Record<string, string[]> = {
    'languages.json': ['language', 'languages', 'programming'],
    'frontend.json': ['frontend', 'front-end', 'ui', 'react'],
    'backend.json': ['backend', 'back-end', 'server', 'api', 'apis'],
    'data.json': ['database', 'databases', 'db', 'messaging', 'queue', 'queues'],
    'voice-ai.json': ['ai', 'voice', 'llm', 'llms', 'ml'],
    'devops.json': ['devops', 'testing', 'tests', 'deployment', 'monitoring'],
  };
  const asksList = /\b(what|which|list)\b/i.test(question) && /\b(tech|technolog|stack|tools?|skills?|languages?|databases?|framework)/i.test(question);
  const cat = asksList && skillFiles.find((f) => CATEGORY_WORDS[f.file]?.some((w) => terms.includes(w)));
  if (cat) {
    return {
      achievement: 'curious',
      lines: [
        L({ t: `${cat.title}:`, tone: 'strong' }),
        ...cat.skills.map((s) => L({ t: '  ▸ ', tone: 'accent' }, { t: s.name, tone: 'strong' }, { t: ` [${evidenceFor(s)}]`, tone: 'muted' })),
      ],
    };
  }

  const scored = index
    .map((e) => {
      let score = 0;
      for (const t of terms) {
        if (e.boost.includes(t)) score += 5;
        else if (e.haystack.includes(t)) score += 1;
      }
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length || scored[0].score < 2) return fallback(question);
  const top = scored.filter((x) => x.score >= scored[0].score / 2).slice(0, 3);
  return {
    achievement: 'curious',
    lines: [
      L({ t: 'From the portfolio:', tone: 'muted' }),
      ...top.flatMap((x) => [x.e.text]),
      L({ t: '(offline answers from approved content — AI answers coming soon)', tone: 'muted' }),
    ],
  };
}

function fallback(input: string): Result {
  return {
    lines: [
      L({ t: `I don’t have information about “${input}” in the portfolio.`, tone: 'err' }),
      L({ t: 'Type ', tone: 'muted' }, { t: 'help', cmd: 'help', tone: 'accent' }, { t: ' for commands, or ask about a skill, project or job.', tone: 'muted' }),
    ],
  };
}

// ---------- public API ----------

export function run(raw: string, ctx: { history: string[] }): Result {
  const input = raw.trim().slice(0, MAX_INPUT);
  if (!input) return { lines: [] };
  const [name, ...args] = input.split(/\s+/);
  const cmd = commands.find((c) => c.name === name.toLowerCase());
  if (cmd) return cmd.run(args, ctx);
  if (input.split(/\s+/).length === 1 && !input.endsWith('?')) {
    const near = commandNames.find((c) => c.startsWith(name.toLowerCase()));
    if (near) return { lines: [L({ t: `command not found: ${name}. Did you mean `, tone: 'err' }, { t: near, cmd: near, tone: 'accent' }, '?')] };
  }
  return answer(input);
}

export function complete(partial: string): string[] {
  const parts = partial.trimStart().split(/\s+/);
  if (parts.length <= 1) {
    const p = (parts[0] ?? '').toLowerCase();
    return commands.filter((c) => !c.hidden && c.name.startsWith(p)).map((c) => c.name);
  }
  const cmd = commands.find((c) => c.name === parts[0].toLowerCase());
  const argPrefix = (parts[1] ?? '').toLowerCase();
  return (cmd?.args?.() ?? []).filter((a) => a.startsWith(argPrefix)).map((a) => `${cmd!.name} ${a}`);
}

export const lineText = (line: Line) => line.map((s) => s.t).join('');

export const suggestions = [
  { label: 'help', cmd: 'help' },
  { label: 'hire', cmd: 'hire' },
  { label: 'projects', cmd: 'projects' },
  { label: 'Backend stack?', cmd: 'What backend technologies does Bilal use?' },
  { label: 'RabbitMQ?', cmd: 'Has he built anything with RabbitMQ?' },
];

const QUESTIONS = [
  'What backend technologies does Bilal use?',
  'Has he built anything with RabbitMQ?',
  'Which databases does Bilal use?',
  'What AI work has Bilal done?',
  'Where does Bilal work?',
  'Is Bilal available for remote work?',
];

// Single best completion for inline "ghost" autofill (accepted with Tab).
export function suggest(input: string): string | null {
  if (!input.trim()) return null;
  const lower = input.toLowerCase();
  const fromCommands = complete(input).find((c) => c.toLowerCase().startsWith(lower) && c.length > input.length);
  if (fromCommands) return fromCommands;
  if (input.length < 2) return null;
  return QUESTIONS.find((q) => q.toLowerCase().startsWith(lower) && q.length > input.length) ?? null;
}


// /llms.txt — a plain-text profile for AI assistants and answer engines,
// generated from the same content files as the site so it never drifts.
import { experiences, sidequests } from '@/content/experience';
import { faq } from '@/content/misc';
import { profile, reasons, SITE_URL, socials } from '@/content/profile';
import { projects } from '@/content/projects';
import { skillFiles } from '@/content/skills';

export const dynamic = 'force-static';

export function GET() {
  const body = [
    `# ${profile.name}`,
    '',
    `> ${profile.role} and team lead in ${profile.location}. ${profile.availability}. ${profile.intro}`,
    '',
    '## Experience',
    ...experiences.map((e) => `- ${e.role}, ${e.company} (${e.period}): ${e.summary} Highlights: ${e.wins.join('; ')}.`),
    ...sidequests.map((s) => `- ${s.role}, ${s.org} (${s.period}): ${s.note}`),
    '',
    '## Why people reach out',
    ...reasons.map((r) => `- ${r.title}: ${r.body}`),
    '',
    '## Skills',
    ...skillFiles.map((f) => `- ${f.title}: ${f.skills.map((s) => s.name).join(', ')}`),
    '',
    '## Projects',
    ...projects.map((p) => `- [${p.title}](${SITE_URL}/projects/${p.slug}): ${p.summary}`),
    '',
    '## Education',
    `- ${profile.education.degree}, ${profile.education.school} (${profile.education.period}). ${profile.education.detail}.`,
    `- English: ${profile.english}`,
    '',
    '## FAQ',
    ...faq.flatMap((f) => [`### ${f.q}`, f.a, '']),
    '## Contact',
    `- Email: ${profile.email}`,
    `- Contact form: ${SITE_URL}/contact`,
    ...socials.filter((s) => s.key !== 'email').map((s) => `- ${s.label}: ${s.href}`),
    `- Resume (PDF): ${SITE_URL}${profile.resumeUrl}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

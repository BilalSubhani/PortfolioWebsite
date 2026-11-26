import { getProject, projects } from '@/content/projects';
import { OG_SIZE, ogCard } from '@/lib/og';

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));
export const alt = 'Project case study';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug)!;
  return ogCard({ eyebrow: `${p.category} · case study`, title: p.title, subtitle: p.summary });
}

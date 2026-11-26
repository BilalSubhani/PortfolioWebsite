import { FaGithub, FaLinkedinIn, FaUpwork, FaWhatsapp } from 'react-icons/fa6';
import { LuMail } from 'react-icons/lu';
import type { SocialKey } from '@/content/profile';

const ICONS = { github: FaGithub, linkedin: FaLinkedinIn, upwork: FaUpwork, whatsapp: FaWhatsapp, email: LuMail };

export default function SocialIcon({ name, className }: { name: SocialKey; className?: string }) {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" className={className} />;
}

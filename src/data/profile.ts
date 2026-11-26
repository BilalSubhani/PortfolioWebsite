export const profile = {
  name: 'Bilal Subhani',
  headline: 'Full-Stack Software Engineer | Team Lead',
  roles: ['Full-Stack Software Engineer', 'Team Lead', 'Voice AI Engineer', 'Open-Source Author'],
  summary:
    'Full-stack engineer with 2+ years of experience building web apps and making them hold up under real load. ' +
    'I lead a team of 6 developers on a contact centre platform used by 500+ people, built an automation service in Go ' +
    'from scratch, and took an AI voice agent from 20 to 250 concurrent calls on the same server.',
  location: 'Lahore, Pakistan',
  availability: 'Open to remote',
  email: 'bilalsubhanii@outlook.com',
  phone: '+92 305 401 8401',
  resumeUrl: 'https://drive.google.com/file/d/1JRRCjmQEE-bFINsy-FloC8LyFYu4enLQ/view?usp=sharing',
  stats: [
    { value: '2+', label: 'Years building' },
    { value: '250', label: 'Concurrent AI calls' },
    { value: '500+', label: 'Platform users' },
    { value: '4+', label: 'npm packages' },
  ],
};

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact Me' },
];

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/BilalSubhani', icon: 'fab fa-github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/bilal-subhani', icon: 'fab fa-linkedin' },
  {
    label: 'Upwork',
    href: 'https://www.upwork.com/freelancers/~017b5c0c306ea4f8c0?mp_source=share',
    icon: 'fab fa-upwork',
  },
  { label: 'WhatsApp', href: 'https://wa.me/+923054018401', icon: 'fab fa-whatsapp' },
];

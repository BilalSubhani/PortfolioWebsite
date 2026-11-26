import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import Buddy from '@/components/buddy/Buddy';
import FloatingActions from '@/components/layout/FloatingActions';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Preloader from '@/components/layout/Preloader';
import RolePicker from '@/components/layout/RolePicker';
import Cursor from '@/components/providers/Cursor';
import GlowController from '@/components/providers/GlowController';
import RevealController from '@/components/providers/RevealController';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { TerminalProvider } from '@/components/terminal/TerminalContext';
import TerminalDialog from '@/components/terminal/TerminalDialog';
import { profile, SITE_URL } from '@/content/profile';
import './globals.css';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

const title = `${profile.name} — Full-Stack Software Engineer & Team Lead`;
const description =
  'Bilal Subhani is a full-stack software engineer and team lead in Lahore, Pakistan, building high-load backends, AI voice agents and web apps with Go, Python, TypeScript, Next.js and FastAPI. Open to remote roles.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${profile.name}` },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    'Bilal Subhani',
    'full-stack software engineer',
    'team lead',
    'Lahore',
    'Pakistan',
    'remote software engineer',
    'Go developer',
    'Python developer',
    'Next.js developer',
    'FastAPI',
    'AI voice agent',
    'Asterisk',
    'RabbitMQ',
    'PostgreSQL',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: SITE_URL,
    siteName: profile.name,
    title,
    description,
    locale: 'en_US',
    firstName: 'Bilal',
    lastName: 'Subhani',
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: { google: '1IVB8V7TfgGih5paIs0uRMK5vOtGvCAFSoA5loxR74g' },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#171613',
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
};

// Runs before paint: applies the saved theme (dark by default), flags JS/reduced-motion,
// and opts into the preloader on the first visit of a session. Safety timer removes the
// preloader if the app bundle fails to load.
const boot = `(function(){try{var d=document.documentElement,t=localStorage.getItem('theme');d.dataset.theme=t==='light'?'light':'dark';var ro=localStorage.getItem('bs-role');d.dataset.role=ro==='plain'?'plain':'dev';if(!ro&&!/bot|crawl|spider|slurp|lighthouse|headlesschrome/i.test(navigator.userAgent)){d.classList.add('needs-role');setTimeout(function(){if(!document.querySelector('dialog[open]'))d.classList.remove('needs-role')},10000)}d.classList.add('js');if(t==='light'){var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute('content','#f4efe6')}var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(r)d.classList.add('reduce-motion');if(!r&&!sessionStorage.getItem('bs-preloaded')){d.classList.add('preload');setTimeout(function(){d.classList.remove('preload')},6000)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-role="dev" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body className="grain">
        <TerminalProvider>
          <Preloader />
          <SmoothScroll />
          <RevealController />
          <GlowController />
          <Cursor />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <FloatingActions />
          <TerminalDialog />
          <RolePicker />
          <Buddy />
        </TerminalProvider>
      </body>
    </html>
  );
}

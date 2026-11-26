import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-start justify-center pt-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,8vw,5rem)] leading-none font-semibold">Nothing lives here.</h1>
      <p className="mt-5 max-w-md font-mono text-sm text-muted">
        <span className="text-accent">guest@bilal:~$</span> cd this-page
        <br />
        <span className="text-err">cd: no such file or directory</span>
      </p>
      <Link href="/" className="btn-primary mt-10">
        <LuArrowLeft className="h-4 w-4" /> Back home
      </Link>
    </section>
  );
}

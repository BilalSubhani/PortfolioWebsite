import Lens from './Lens';
import SplitHeading from './SplitHeading';

export default function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  as = 'h2',
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  as?: 'h1' | 'h2';
}) {
  return (
    <header className="mb-10 max-w-3xl sm:mb-14">
      <p className="eyebrow mb-4" data-reveal="fade">
        <Lens dev={<span className="normal-case">{`// ${eyebrow.toLowerCase()}`}</span>} plain={eyebrow.replace(/^\d+\s+—\s+/, '')} />
      </p>
      <SplitHeading
        id={id}
        as={as}
        text={title}
        immediate={as === 'h1'}
        className={as === 'h1' ? 'text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] font-semibold' : 'text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-semibold'}
      />
      {intro && (
        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg" data-reveal>
          {intro}
        </p>
      )}
    </header>
  );
}

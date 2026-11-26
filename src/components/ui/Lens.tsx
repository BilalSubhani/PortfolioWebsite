// Renders both the developer and plain-English versions of a piece of copy.
// CSS (keyed on html[data-role]) shows the right one before first paint, so it works in
// server components, with no hydration flash, and crawlers still see both.
export default function Lens({ dev, plain, block = false }: { dev: React.ReactNode; plain: React.ReactNode; block?: boolean }) {
  const Tag = block ? 'div' : 'span';
  return (
    <>
      <Tag className="lens-dev">{dev}</Tag>
      <Tag className="lens-plain">{plain}</Tag>
    </>
  );
}

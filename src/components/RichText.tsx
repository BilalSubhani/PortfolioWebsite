// Renders a string where **double-asterisk** segments become <strong>.
export default function RichText({ text }: { text: string }) {
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </>
  );
}

import Terminal from '../terminal/Terminal';
import SectionHeading from '../ui/SectionHeading';

export default function TerminalSection() {
  return (
    <section id="terminal" className="section-y" aria-labelledby="terminal-title">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16 [&>*]:min-w-0">
          <div>
            <SectionHeading
              id="terminal-title"
              eyebrow="07 — Terminal"
              title="Prefer the command line?"
              intro="Explore the whole portfolio from here. Type a command or ask a question in plain English. It can be opened anywhere on the site, too."
            />
            <ul className="space-y-3 font-mono text-sm text-muted" data-reveal>
              <li>
                <kbd className="chip mr-2">Ctrl/⌘ K</kbd> open from anywhere
              </li>
              <li>
                <kbd className="chip mr-2">↑ ↓</kbd> command history
              </li>
              <li>
                <kbd className="chip mr-2">Tab</kbd> autocomplete
              </li>
            </ul>
          </div>
          <div data-reveal="scale">
            <Terminal className="h-[440px] sm:h-[500px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { unlock } from '@/lib/achievements';
import { cn } from '@/lib/cn';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { scrollToId } from '@/lib/scroll';
import { complete, type Line, lineText, MAX_INPUT, run, suggest, suggestions } from '@/lib/terminal';
import { openRolePicker } from '@/lib/role';
import { setTheme } from '@/lib/theme';
import { switchRole } from '../layout/RolePicker';

interface Entry {
  id: number;
  cmd?: string;
  lines: Line[];
}

// History is shared between the inline terminal and the pop-up one.
const sharedHistory: string[] = [];
let nextId = 1;

const PROMPT = 'guest@bilal:~$';

const welcome = (): Entry => ({
  id: nextId++,
  lines: [
    [{ t: 'Welcome to bilalsubhani.com — an interactive portfolio terminal.', tone: 'strong' }],
    [
      { t: 'Type ', tone: 'muted' },
      { t: 'help', tone: 'accent', cmd: 'help' },
      { t: ' to see commands, or ask a question in plain English. Press Tab to autofill.', tone: 'muted' },
    ],
  ],
});

export default function Terminal({
  className,
  autoFocus = false,
  onNavigate,
  onClose,
  initialCommand,
  onInitialCommandRun,
}: {
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
  initialCommand?: string | null;
  onInitialCommandRun?: () => void;
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>(() => [welcome()]);
  const [input, setInput] = useState('');
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastAnimated = useRef(0);
  const inputId = useId();

  const ghost = suggest(input);
  const ghostRest = ghost ? ghost.slice(input.length) : '';

  const execute = useCallback(
    (raw: string) => {
      const cmd = raw.trim().slice(0, MAX_INPUT);
      unlock('terminal');
      if (!cmd) {
        setEntries((e) => [...e, { id: nextId++, cmd: '', lines: [] }]);
        return;
      }
      if (sharedHistory[sharedHistory.length - 1] !== cmd) sharedHistory.push(cmd);
      const result = run(cmd, { history: sharedHistory });
      if (result.achievement) unlock(result.achievement);
      setHistIdx(null);
      setInput('');

      if (result.effect?.type === 'clear') {
        setEntries([]);
        return;
      }
      setEntries((e) => [...e, { id: nextId++, cmd, lines: result.lines }]);

      const fx = result.effect;
      if (!fx) return;
      if (fx.type === 'theme') {
        setTheme(fx.value);
        unlock('theme');
      }
      if (fx.type === 'close') setTimeout(() => onClose?.(), 500);
      if (fx.type === 'buddy') window.dispatchEvent(new CustomEvent('buddy', { detail: fx.value }));
      if (fx.type === 'role') {
        if (fx.value) switchRole(fx.value);
        else {
          onClose?.();
          setTimeout(openRolePicker, 300);
        }
      }
      if (fx.type === 'navigate') {
        setTimeout(() => {
          onNavigate?.();
          router.push(fx.href);
        }, 450);
      }
      if (fx.type === 'scroll') {
        setTimeout(() => {
          if (document.getElementById(fx.id)) {
            onNavigate?.();
            scrollToId(fx.id);
          } else if (fx.id !== 'contact') {
            onNavigate?.();
            router.push(`/#${fx.id}`);
          }
        }, 450);
      }
    },
    [onNavigate, onClose, router],
  );

  // Run a command handed over by a "launch terminal with…" button.
  useEffect(() => {
    if (initialCommand) {
      execute(initialCommand);
      onInitialCommandRun?.();
    }
  }, [initialCommand, execute, onInitialCommandRun]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  // Animate newly added output and keep the view pinned to the bottom.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const newest = entries[entries.length - 1];
    if (newest && newest.id > lastAnimated.current) {
      lastAnimated.current = newest.id;
      const lines = body.querySelectorAll<HTMLElement>(`[data-entry="${newest.id}"] [data-line]`);
      if (lines.length && !prefersReducedMotion()) {
        gsap.fromTo(
          lines,
          { autoAlpha: 0, x: -8, clipPath: 'inset(0 100% 0 0)' },
          { autoAlpha: 1, x: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.35, stagger: 0.035, ease: 'power2.out' },
        );
      }
    }
    body.scrollTop = body.scrollHeight;
  }, [entries]);

  const acceptGhost = () => {
    if (!ghost) return false;
    setInput(ghost + (ghost.endsWith('?') ? '' : ' '));
    inputRef.current?.focus({ preventScroll: true });
    if (!prefersReducedMotion()) gsap.fromTo(inputRef.current, { x: 4 }, { x: 0, duration: 0.3, ease: 'power3.out' });
    return true;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      execute(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!sharedHistory.length) return;
      const i = histIdx === null ? sharedHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(i);
      setInput(sharedHistory[i]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === null) return;
      const i = histIdx + 1;
      if (i >= sharedHistory.length) {
        setHistIdx(null);
        setInput('');
      } else {
        setHistIdx(i);
        setInput(sharedHistory[i]);
      }
    } else if (e.key === 'Tab') {
      if (!input) return;
      e.preventDefault();
      if (acceptGhost()) return;
      const options = complete(input);
      if (options.length > 1)
        setEntries((en) => [...en, { id: nextId++, cmd: input, lines: [options.map((o) => ({ t: o.split(' ').pop() + '   ', tone: 'accent' as const }))] }]);
    } else if (e.key === 'ArrowRight' && ghost && e.currentTarget.selectionStart === input.length) {
      e.preventDefault();
      acceptGhost();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    } else if (e.key === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault();
      setEntries((en) => [...en, { id: nextId++, cmd: input + '^C', lines: [] }]);
      setInput('');
    }
  };

  const copy = async (entry: Entry) => {
    try {
      await navigator.clipboard.writeText(entry.lines.map(lineText).join('\n'));
      setCopied(entry.id);
      setTimeout(() => setCopied((c) => (c === entry.id ? null : c)), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  const focusInput = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div
      data-glow
      className={cn('flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface font-mono shadow-2xl shadow-black/20', className)}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-line bg-surface-2/60 px-4 py-3">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#d98b7a]" />
          <span className="h-3 w-3 rounded-full bg-[#d6b46a]" />
          <span className="h-3 w-3 rounded-full bg-[#9cb380]" />
        </div>
        <p className="min-w-0 truncate text-xs text-muted">bilal@portfolio — zsh</p>
      </div>

      {/* Output */}
      <div
        ref={bodyRef}
        onClick={focusInput}
        data-lenis-prevent
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="min-h-0 flex-1 cursor-text overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 text-[13px] leading-relaxed sm:px-5 sm:text-sm"
      >
        {entries.map((entry) => (
          <div key={entry.id} data-entry={entry.id} className="group relative mb-3 pr-8 last:mb-1">
            {entry.cmd !== undefined && (
              <p className="break-words">
                <span className="text-accent">{PROMPT}</span> <span className="text-fg">{entry.cmd}</span>
              </p>
            )}
            {entry.lines.map((line, i) => (
              <p key={i} data-line className="min-h-[1.5em] break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                {line.map((seg, j) => (
                  <Seg key={j} seg={seg} onRun={execute} />
                ))}
              </p>
            ))}
            {entry.lines.length > 1 && (
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  copy(entry);
                }}
                className="absolute top-0 right-0 rounded-md border border-line bg-surface p-1.5 text-muted opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-accent max-sm:opacity-60"
                aria-label="Copy output"
              >
                {copied === entry.id ? <LuCheck className="h-3.5 w-3.5" /> : <LuCopy className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        ))}

        {/* Prompt with inline ghost autofill */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <label htmlFor={inputId} className="shrink-0 text-accent">
            {PROMPT}
            <span className="sr-only"> Terminal command</span>
          </label>
          <div className="relative min-w-[8ch] flex-1">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-base whitespace-pre sm:text-sm">
              <span className="invisible">{input}</span>
              <span className="text-muted/60">{ghostRest}</span>
            </div>
            <input
              id={inputId}
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value.slice(0, MAX_INPUT));
                setHistIdx(null);
              }}
              onKeyDown={onKeyDown}
              maxLength={MAX_INPUT}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              aria-describedby={ghost ? `${inputId}-hint` : undefined}
              className="relative w-full bg-transparent text-base text-fg caret-accent outline-none sm:text-sm"
              style={{ outline: 'none' }}
            />
          </div>
          {ghost && (
            <button
              type="button"
              id={`${inputId}-hint`}
              onClick={(e) => {
                e.stopPropagation();
                acceptGhost();
              }}
              className="shrink-0 rounded-md border border-line px-1.5 py-0.5 text-[10px] text-muted transition-colors hover:border-accent hover:text-accent"
              aria-label={`Autofill: ${ghost}`}
            >
              ⇥ Tab
            </button>
          )}
        </div>
      </div>

      {/* Suggestions — wrap, never scroll sideways */}
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {suggestions.map((s, i) => (
          <button
            key={s.cmd}
            type="button"
            onClick={() => {
              execute(s.cmd);
              inputRef.current?.focus({ preventScroll: true });
            }}
            className={cn(
              'rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent',
              i > 3 && 'max-sm:hidden',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Seg({ seg, onRun }: { seg: Line[number]; onRun: (cmd: string) => void }) {
  const tone = {
    accent: 'text-accent',
    muted: 'text-muted',
    ok: 'text-ok',
    err: 'text-err',
    strong: 'text-fg font-semibold',
  }[seg.tone ?? 'strong'];
  const base = seg.tone ? tone : 'text-fg';

  if (seg.href) {
    const newTab = seg.href.startsWith('http') || seg.href.endsWith('.pdf');
    return (
      <a
        href={seg.href}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        onClick={(e) => e.stopPropagation()}
      >
        {seg.t}
      </a>
    );
  }
  if (seg.cmd) {
    const cmd = seg.cmd;
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRun(cmd);
        }}
        className={cn(base, 'cursor-pointer text-left underline decoration-dotted decoration-current/40 underline-offset-4 hover:decoration-current')}
      >
        {seg.t}
      </button>
    );
  }
  return <span className={base}>{seg.t}</span>;
}

import { useState, type ReactNode } from "react";
import { Link } from "react-router";

/** Turns a heading's text into a stable anchor id. */
function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PageTitle({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
}) {
  return (
    <header className="mb-12">
      {eyebrow ? (
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2.5 text-[34px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[42px]">
        {title}
      </h1>
      {intro ? (
        <p className="mt-5 text-[17px] leading-[1.65] text-[#b8b8b8]">{intro}</p>
      ) : null}
    </header>
  );
}

function Anchor({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label={`Link to ${label}`}
      className="heading-anchor absolute -left-5 top-0 text-muted no-underline hover:text-gold"
    >
      #
    </a>
  );
}

export function H2({ children }: { children: string }) {
  const id = slug(children);
  return (
    <h2
      id={id}
      data-toc={children}
      data-level="2"
      className="group relative mt-16 scroll-mt-28 text-[24px] font-bold tracking-[-0.015em] text-white first:mt-0"
    >
      <Anchor id={id} label={children} />
      {children}
    </h2>
  );
}

export function H3({ children }: { children: string }) {
  const id = slug(children);
  return (
    <h3
      id={id}
      data-toc={children}
      data-level="3"
      className="group relative mt-10 scroll-mt-28 text-[17px] font-semibold tracking-[-0.01em] text-white"
    >
      <Anchor id={id} label={children} />
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-[15.5px] leading-[1.7] text-[#b8b8b8]">{children}</p>
  );
}

export function Ul({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 space-y-2.5 text-[15.5px] leading-[1.7] text-[#b8b8b8]">
      {children}
    </ul>
  );
}

export function Li({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-5">
      <span className="absolute left-0 top-[0.66em] h-1.5 w-1.5 rounded-full bg-gold/60" />
      {children}
    </li>
  );
}

/** An inline link inside body copy. Internal by default; pass href to leave. */
export function A({
  to,
  href,
  children,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
}) {
  const className =
    "font-medium text-gold underline decoration-gold/30 underline-offset-2 transition hover:decoration-gold";
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to ?? "/"} prefetch="intent" className={className}>
      {children}
    </Link>
  );
}

/** Inline literal: a file path, a symbol, an env var, a token amount. */
export function C({ children }: { children: ReactNode }) {
  return (
    <code className="whitespace-nowrap rounded-md border border-white/10 bg-white/[0.04] px-[0.4em] py-[0.15em] font-mono text-[0.85em] text-gold-soft">
      {children}
    </code>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          },
          () => {},
        );
      }}
      className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-sans text-[11px] font-semibold text-muted opacity-0 transition hover:border-gold/30 hover:text-gold focus-visible:opacity-100 group-hover/code:opacity-100"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function Code({
  children,
  title,
}: {
  children: string;
  title?: string;
}) {
  return (
    <figure className="group/code relative mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#111]">
      <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-2">
        <figcaption className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-muted">
          {title ?? ""}
        </figcaption>
        <CopyButton value={children} />
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-[1.65]">
        <code className="font-mono text-[#d4d4d4]">{children}</code>
      </pre>
    </figure>
  );
}

export function Note({
  kind = "note",
  title,
  children,
}: {
  kind?: "note" | "warning";
  title?: string;
  children: ReactNode;
}) {
  const warn = kind === "warning";
  return (
    <aside
      className={`mt-6 rounded-xl border-l-2 px-4 py-3.5 text-[14.5px] leading-[1.65] ${
        warn
          ? "border-l-down border-y border-r border-y-down/15 border-r-down/15 bg-down/[0.07] text-[#e8bdb4]"
          : "border-l-gold border-y border-r border-y-gold/15 border-r-gold/15 bg-gold/[0.05] text-[#ddd3ae]"
      }`}
    >
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white">
        {title ?? (warn ? "Careful" : "Note")}
      </p>
      <div className="mt-1.5">{children}</div>
    </aside>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="mt-6 space-y-0">{children}</ol>;
}

export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="group relative pb-8 pl-11 last:pb-0">
      <span className="absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-full border border-gold/30 bg-gold/10 text-[12px] font-bold text-gold">
        {n}
      </span>
      {/* Connector, hidden on the last step so the line does not trail off. */}
      <span className="absolute bottom-1 left-[13.5px] top-8 w-px bg-white/10 group-last:hidden" />
      <p className="pt-1 text-[15.5px] font-semibold text-white">{title}</p>
      {children ? (
        <div className="text-[15.5px] leading-[1.7] text-[#b8b8b8]">
          {children}
        </div>
      ) : null}
    </li>
  );
}

export function Table({
  head,
  children,
}: {
  head: string[];
  children: ReactNode;
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="bg-white/[0.03]">
            {head.map((cell) => (
              <th
                key={cell}
                className="whitespace-nowrap px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[#b8b8b8]">{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return (
    <tr className="border-t border-white/[0.07] align-top transition hover:bg-white/[0.02]">
      {children}
    </tr>
  );
}

export function Td({ children }: { children: ReactNode }) {
  return <td className="px-4 py-3 leading-[1.6]">{children}</td>;
}

/* ------------------------------------------------------------------ *
 * Link cards
 * ------------------------------------------------------------------ */

export function Cards({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">{children}</div>
  );
}

export function Card({
  to,
  title,
  children,
}: {
  to: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Link
      to={to}
      prefetch="intent"
      className="group flex flex-col rounded-xl border border-white/10 bg-card-2/60 p-4 transition hover:border-gold/30 hover:bg-card-2"
    >
      <span className="flex items-center gap-1.5 text-[15px] font-semibold text-white group-hover:text-gold">
        {title}
        <span
          aria-hidden
          className="translate-x-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-gold"
        >
          →
        </span>
      </span>
      {children ? (
        <span className="mt-1.5 text-[13.5px] leading-[1.6] text-[#a0a0a0]">
          {children}
        </span>
      ) : null}
    </Link>
  );
}

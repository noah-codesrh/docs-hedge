import type { ReactNode } from "react";

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
    <header className="mb-10">
      {eyebrow ? (
        <p className="text-[13px] font-semibold uppercase tracking-wider text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {intro ? (
        <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-[#c9c9c9]">
          {intro}
        </p>
      ) : null}
    </header>
  );
}

export function H2({ children }: { children: string }) {
  const id = slug(children);
  return (
    <h2
      id={id}
      className="group mt-14 scroll-mt-24 border-b border-white/5 pb-2.5 text-[22px] font-bold tracking-tight sm:text-2xl"
    >
      {children}
      <a
        href={`#${id}`}
        aria-label={`Link to ${children}`}
        className="heading-anchor ml-2 text-muted no-underline hover:text-gold"
      >
        #
      </a>
    </h2>
  );
}

export function H3({ children }: { children: string }) {
  const id = slug(children);
  return (
    <h3
      id={id}
      className="group mt-9 scroll-mt-24 text-[17px] font-semibold tracking-tight text-white sm:text-lg"
    >
      {children}
      <a
        href={`#${id}`}
        aria-label={`Link to ${children}`}
        className="heading-anchor ml-2 text-muted no-underline hover:text-gold"
      >
        #
      </a>
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[#c4c4c4]">
      {children}
    </p>
  );
}

export function Ul({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 max-w-3xl space-y-2.5 text-[15px] leading-relaxed text-[#c4c4c4]">
      {children}
    </ul>
  );
}

export function Li({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-5">
      <span className="absolute left-0 top-[0.62em] h-1.5 w-1.5 rounded-full bg-gold/70" />
      {children}
    </li>
  );
}

/** Inline literal: a file path, a symbol, an env var, a token amount. */
export function C({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-white/10 bg-card-2 px-1.5 py-0.5 font-mono text-[0.86em] text-gold-soft">
      {children}
    </code>
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
    <figure className="mt-5 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-card-2">
      {title ? (
        <figcaption className="border-b border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[12px] text-muted">
          {title}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed">
        <code className="font-mono text-[#d8d8d8]">{children}</code>
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
      className={`mt-5 max-w-3xl rounded-2xl border px-4 py-3.5 text-[14px] leading-relaxed ${
        warn
          ? "border-down/25 bg-down/10 text-[#f3c8c0]"
          : "border-gold/20 bg-gold/[0.07] text-[#e6dcb4]"
      }`}
    >
      <p className="font-semibold text-white">
        {title ?? (warn ? "Careful" : "Note")}
      </p>
      <div className="mt-1.5">{children}</div>
    </aside>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return (
    <ol className="mt-5 max-w-3xl space-y-0 border-l border-white/10 pl-0">
      {children}
    </ol>
  );
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
    <li className="relative -ml-px border-l border-transparent pb-7 pl-7 last:pb-0">
      <span className="absolute -left-[13px] top-0 grid h-6 w-6 place-items-center rounded-full bg-gold text-[12px] font-bold text-black">
        {n}
      </span>
      <p className="text-[15px] font-semibold text-white">{title}</p>
      {children ? (
        <div className="text-[15px] leading-relaxed text-[#c4c4c4]">
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
    <div className="mt-5 max-w-3xl overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="bg-white/[0.04]">
            {head.map((cell) => (
              <th
                key={cell}
                className="whitespace-nowrap px-4 py-2.5 font-semibold text-white"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[#c4c4c4]">{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="border-t border-white/5 align-top">{children}</tr>;
}

export function Td({ children }: { children: ReactNode }) {
  return <td className="px-4 py-2.5 leading-relaxed">{children}</td>;
}

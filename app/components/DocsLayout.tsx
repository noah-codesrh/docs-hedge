import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  docsBook,
  flatNav,
  navFor,
  navItem,
  navNeighbours,
} from "../lib/nav";

const APP_URL = "https://hedgeapp.trade";

/* ------------------------------------------------------------------ *
 * Sidebar
 * ------------------------------------------------------------------ */

function SidebarLinks({
  onNavigate,
  inputRef,
}: {
  onNavigate?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const book = navFor(pathname);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return book;
    return book
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.summary.toLowerCase().includes(q),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [book, query]);

  return (
    <div className="flex h-full flex-col">
      <label className="relative block shrink-0">
        <span className="sr-only">Filter pages</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setQuery("");
          }}
          placeholder="Search docs"
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-10 text-[13.5px] text-white placeholder-muted outline-none transition focus:border-gold/40 focus:bg-white/[0.05]"
        />
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        {query ? null : (
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-sans text-[10.5px] font-semibold text-muted">
            /
          </kbd>
        )}
      </label>

      <nav className="no-scrollbar mt-6 min-h-0 flex-1 space-y-7 overflow-y-auto pb-10">
        {sections.length === 0 ? (
          <p className="text-[13.5px] text-muted">No pages match that.</p>
        ) : null}

        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
              {section.title}
            </p>
            <ul className="mt-2.5 border-l border-white/[0.08]">
              {section.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      prefetch="intent"
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`-ml-px block border-l-2 py-[7px] pl-4 text-[14px] transition ${
                        active
                          ? "border-gold font-semibold text-white"
                          : "border-transparent text-[#9a9a9a] hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * On this page
 * ------------------------------------------------------------------ */

type Heading = { id: string; text: string; level: number };

/**
 * Read headings out of the rendered page rather than asking each page to
 * declare them. One source of truth: whatever the reader can actually see is
 * exactly what the rail lists.
 */
function useHeadings(pathname: string) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("main [data-toc]");
    setHeadings(
      Array.from(nodes).map((node) => ({
        id: node.id,
        text: node.dataset.toc ?? "",
        level: Number(node.dataset.level ?? 2),
      })),
    );
  }, [pathname]);

  return headings;
}

/** Highlights the heading the reader is currently under. */
function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) {
      setActive(null);
      return;
    }

    let frame = 0;
    const compute = () => {
      frame = 0;
      // Sits just below the sticky header, so a heading becomes current as it
      // reaches the top of the readable area rather than the top of the window.
      const line = 140;
      let current = headings[0]!.id;
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top > line) break;
        current = heading.id;
      }
      // The last heading may be too short to ever cross the line, so at the
      // bottom of the page it wins outright.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8;
      setActive(atBottom ? headings[headings.length - 1]!.id : current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  return active;
}

function OnThisPage({ pathname }: { pathname: string }) {
  const headings = useHeadings(pathname);
  const active = useActiveHeading(headings);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
        On this page
      </p>
      <ul className="mt-3 border-l border-white/[0.08]">
        {headings.map((heading) => {
          const current = active === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`-ml-px block border-l-2 py-[5px] text-[13px] leading-snug transition ${
                  heading.level > 2 ? "pl-7" : "pl-4"
                } ${
                  current
                    ? "border-gold font-medium text-white"
                    : "border-transparent text-[#8f8f8f] hover:border-white/25 hover:text-white"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * Chrome
 * ------------------------------------------------------------------ */

function BookToggle() {
  const { pathname } = useLocation();
  const developers = docsBook(pathname) === "developers";
  const tab = (active: boolean) =>
    `rounded-md px-2.5 py-1 text-[12px] font-semibold transition ${
      active ? "bg-gold text-black" : "text-muted hover:text-white"
    }`;
  return (
    <div
      role="tablist"
      aria-label="Docs book"
      className="flex shrink-0 rounded-lg border border-white/12 bg-white/[0.03] p-0.5"
    >
      <Link
        to="/"
        prefetch="intent"
        role="tab"
        aria-selected={!developers}
        className={tab(!developers)}
      >
        App
      </Link>
      <Link
        to="/developers"
        prefetch="intent"
        role="tab"
        aria-selected={developers}
        className={tab(developers)}
      >
        Developers
      </Link>
    </div>
  );
}

function Header({ onOpenNav }: { onOpenNav: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-bg/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          to="/"
          prefetch="intent"
          className="flex shrink-0 items-center gap-2.5"
        >
          <img
            src="/logo-full.png"
            alt="Hedge"
            width={160}
            height={32}
            className="h-7 w-auto max-w-[104px] sm:h-[30px] sm:max-w-none"
          />
          <span className="hidden rounded border border-white/12 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted sm:inline">
            Docs
          </span>
        </Link>
        <BookToggle />

        <div className="ml-auto flex items-center gap-2">
          <a
            href={APP_URL}
            className="rounded-lg bg-gold px-3.5 py-2 text-[13px] font-semibold text-black transition hover:brightness-105 sm:px-4"
          >
            Launch app
          </a>
          <button
            onClick={onOpenNav}
            aria-label="Open navigation"
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/12 bg-white/[0.04] text-[#cfcfcf] transition hover:bg-white/[0.08] hover:text-white lg:hidden"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function PageFooter() {
  const { pathname } = useLocation();
  const { prev, next } = navNeighbours(pathname);
  const pages = flatNav(pathname).length;

  return (
    <footer className="mt-20 border-t border-white/[0.07] pt-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to={prev.to}
            prefetch="intent"
            className="group rounded-xl border border-white/10 bg-card-2/60 px-4 py-3 transition hover:border-gold/30 hover:bg-card-2"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
              Previous
            </span>
            <span className="mt-1 block text-[15px] font-semibold text-white group-hover:text-gold">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <Link
            to={next.to}
            prefetch="intent"
            className="group rounded-xl border border-white/10 bg-card-2/60 px-4 py-3 transition hover:border-gold/30 hover:bg-card-2 sm:text-right"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
              Next
            </span>
            <span className="mt-1 block text-[15px] font-semibold text-white group-hover:text-gold">
              {next.title}
            </span>
          </Link>
        ) : null}
      </div>
      <p className="mt-10 pb-12 text-[12.5px] text-muted">
        Hedge documentation · {pages} pages
      </p>
    </footer>
  );
}

/* ------------------------------------------------------------------ *
 * Layout
 * ------------------------------------------------------------------ */

/**
 * Used as a layout route in `routes.ts`, which resolves the module's default
 * export. A named-only export renders the child page with no chrome at all.
 */
export default function DocsLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  const search = useRef<HTMLInputElement>(null);
  const here = navItem(pathname);

  // A route change inside the drawer should close it, and the reader expects to
  // start at the top of the new page rather than mid-scroll. Hash links are the
  // exception: those are meant to land partway down.
  useEffect(() => {
    setNavOpen(false);
    if (!window.location.hash) window.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);

      // "/" is the convention for jumping to search, but only when the reader
      // is not already typing somewhere.
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Header onOpenNav={() => setNavOpen(true)} />

      <div className="mx-auto flex max-w-[1440px] gap-8 px-4 sm:px-6 xl:gap-12">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[236px] shrink-0 pt-9 lg:block">
          <SidebarLinks inputRef={search} />
        </aside>

        <main className="min-w-0 flex-1 pt-9 lg:border-l lg:border-white/[0.05] lg:pl-8 xl:pl-12">
          <div className="animate-fade-in max-w-[46rem]" key={pathname}>
            {here ? (
              <p className="mb-6 truncate text-[12.5px] text-muted lg:hidden">
                {here.section} <span className="px-1 text-white/25">/</span>{" "}
                <span className="text-[#c4c4c4]">{here.title}</span>
              </p>
            ) : null}
            <Outlet />
            <PageFooter />
          </div>
        </main>

        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[196px] shrink-0 overflow-y-auto pb-10 pt-9 xl:block">
          <OnThisPage pathname={pathname} />
        </aside>
      </div>

      {navOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-sm border-r border-white/10 bg-bg p-5 pt-[calc(1.25rem+env(safe-area-inset-top))]">
            <SidebarLinks onNavigate={() => setNavOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}

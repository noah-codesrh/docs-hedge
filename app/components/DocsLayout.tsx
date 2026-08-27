import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { NAV, flatNav, navNeighbours } from "../lib/nav";

const APP_URL = "https://hedgeapp.trade";

function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV;
    return NAV.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q),
      ),
    })).filter((section) => section.items.length > 0);
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      <label className="relative block shrink-0">
        <span className="sr-only">Filter pages</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter pages"
          className="w-full rounded-full border border-white/10 bg-[#1e1e1e] px-4 py-2 text-[13px] text-white placeholder-muted outline-none focus:border-gold/40"
        />
      </label>

      <nav className="mt-5 min-h-0 flex-1 space-y-6 overflow-y-auto pb-8">
        {sections.length === 0 ? (
          <p className="text-[13px] text-muted">No pages match that.</p>
        ) : null}

        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {section.title}
            </p>
            <ul className="mt-2 space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      prefetch="intent"
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-xl px-3 py-1.5 text-[14px] transition ${
                        active
                          ? "bg-gold/10 font-semibold text-gold"
                          : "text-[#c4c4c4] hover:bg-white/5 hover:text-white"
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

function Header({ onOpenNav }: { onOpenNav: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg/85 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 sm:h-16">
        <Link to="/" prefetch="intent" className="flex items-center gap-2.5">
          <img
            src="/logo-full.png"
            alt="Hedge"
            width={160}
            height={32}
            className="h-7 w-auto max-w-[112px] sm:h-8 sm:max-w-none"
          />
          <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold text-muted">
            Docs
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={APP_URL}
            className="rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-black transition hover:brightness-105 sm:px-4 sm:py-2 sm:text-sm"
          >
            Open app
          </a>
          <button
            onClick={onOpenNav}
            aria-label="Open navigation"
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#cfcfcf] transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}

function PageFooter() {
  const { pathname } = useLocation();
  const { prev, next } = navNeighbours(pathname);

  return (
    <footer className="mt-16 border-t border-white/5 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
        {prev ? (
          <Link
            to={prev.to}
            prefetch="intent"
            className="group flex-1 rounded-2xl border border-white/10 bg-card-2 px-4 py-3 transition hover:border-gold/30"
          >
            <span className="text-[12px] text-muted">Previous</span>
            <span className="mt-0.5 block text-[15px] font-semibold text-white group-hover:text-gold">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            to={next.to}
            prefetch="intent"
            className="group flex-1 rounded-2xl border border-white/10 bg-card-2 px-4 py-3 text-right transition hover:border-gold/30"
          >
            <span className="text-[12px] text-muted">Next</span>
            <span className="mt-0.5 block text-[15px] font-semibold text-white group-hover:text-gold">
              {next.title}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </div>
      <p className="mt-8 pb-10 text-[13px] text-muted">
        Hedge documentation · {flatNav().length} pages
      </p>
    </footer>
  );
}

export function DocsLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);

  // A route change inside the drawer should close it, and the reader expects to
  // start at the top of the new page rather than mid-scroll.
  useEffect(() => {
    setNavOpen(false);
    main.current?.scrollTo?.({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  return (
    <>
      <Header onOpenNav={() => setNavOpen(true)} />

      <div className="mx-auto flex max-w-[1400px] gap-10 px-4">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 pt-8 lg:block">
          <SidebarLinks />
        </aside>

        <main ref={main} className="min-w-0 flex-1 pt-8">
          <div className="animate-fade-in" key={pathname}>
            <Outlet />
            <PageFooter />
          </div>
        </main>
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

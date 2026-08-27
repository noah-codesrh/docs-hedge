import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { docMeta } from "./lib/seo";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/logo-mark.svg", type: "image/svg+xml" },
  {
    rel: "preload",
    href: "/assets/Font/Onest/Onest-VariableFont_wght.ttf",
    as: "font",
    type: "font/ttf",
    crossOrigin: "anonymous",
  },
];

export function meta() {
  return docMeta({
    title: "Hedge Docs",
    description:
      "Documentation for Hedge: accounts, funding, trading, and the architecture behind them.",
    bare: true,
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "That page does not exist in the docs."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="mx-auto max-w-lg p-6 pt-20">
      <h1 className="text-2xl font-bold">{message}</h1>
      <p className="mt-2 text-muted">{details}</p>
      <a href="/" className="mt-6 inline-block text-sm font-semibold text-gold">
        Back to the introduction
      </a>
      {stack && (
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-card p-4 text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

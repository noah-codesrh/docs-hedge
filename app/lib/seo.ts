/**
 * Meta tags for a docs page.
 *
 * React Router resolves `meta` from the deepest matching route and does not
 * merge a parent's tags in, so every page has to emit the full set or it loses
 * the social card entirely. Hence one helper rather than tags in `root.tsx`.
 */

const SUFFIX = "Hedge Docs";

/**
 * Open Graph requires absolute URLs, so the deployed origin has to be known at
 * build time. Override with VITE_DOCS_ORIGIN when the domain differs.
 */
export const ORIGIN = (
  import.meta.env.VITE_DOCS_ORIGIN ?? "https://docs.hedgeapp.trade"
).replace(/\/$/, "");

const IMAGE = `${ORIGIN}/og.png`;

export function docMeta({
  title,
  description,
  /** Set on the index page, where the title should not read "Introduction · Hedge Docs". */
  bare = false,
}: {
  title: string;
  description: string;
  bare?: boolean;
}) {
  const full = bare ? title : `${title} · ${SUFFIX}`;

  return [
    { title: full },
    { name: "description", content: description },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SUFFIX },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:image", content: IMAGE },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: "Hedge Docs — trade prediction markets, in dollars",
    },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: full },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: IMAGE },

    { name: "theme-color", content: "#141414" },
  ];
}

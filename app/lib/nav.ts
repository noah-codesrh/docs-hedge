export type NavItem = {
  title: string;
  to: string;
  summary: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type DocsBook = "app" | "developers";

/**
 * Two books. The header toggle switches the sidebar. Adding a page means
 * adding it here and in `routes.ts`.
 */
export const APP_NAV: NavSection[] = [
  {
    title: "Getting started",
    items: [
      {
        title: "Introduction",
        to: "/",
        summary: "What Hedge is and how the pieces fit together.",
      },
      {
        title: "How to get started with predicting on Hedge",
        to: "/getting-started",
        summary: "Sign in, fund the wallet, and place a first prediction.",
      },
      {
        title: "Why Hedge",
        to: "/why",
        summary: "Traders, LPs, makers, and what is live.",
      },
      {
        title: "Quick start",
        to: "/quick-start",
        summary: "Sign in, add funds, and place a first trade.",
      },
    ],
  },
  {
    title: "Core concepts",
    items: [
      {
        title: "Accounts and wallets",
        to: "/concepts/wallets",
        summary: "Sign-in, the cash wallet, the trading wallet, and the proxy.",
      },
      {
        title: "Markets and prices",
        to: "/concepts/markets",
        summary: "Events, markets, outcomes, and what a price means.",
      },
      {
        title: "Money and tokens",
        to: "/concepts/tokens",
        summary: "USDG, pUSD, and why a trade converts between them.",
      },
      {
        title: "Positions and P&L",
        to: "/concepts/positions",
        summary: "How holdings are valued and profit and loss is derived.",
      },
    ],
  },
  {
    title: "Guides",
    items: [
      {
        title: "Adding funds",
        to: "/guides/adding-funds",
        summary: "Deposit USDG and confirm it landed.",
      },
      {
        title: "Placing a trade",
        to: "/guides/placing-a-trade",
        summary: "Pick a side, size it, and read the confirmation.",
      },
      {
        title: "Closing and cashing out",
        to: "/guides/cashing-out",
        summary: "Sell a position and move the money back out.",
      },
      {
        title: "Sharing a position",
        to: "/guides/sharing",
        summary: "Generate a shareable P&L card.",
      },
      {
        title: "Hedgie",
        to: "/guides/hedgie",
        summary: "The prediction copilot: live odds, leverage context, and trade tickets.",
      },
    ],
  },
  {
    title: "Pool",
    items: [
      {
        title: "Pool and liquidity",
        to: "/pool",
        summary: "Parimutuel USDG on allowlisted memes. Pots pay. Tape is display.",
      },
      {
        title: "The mathematics",
        to: "/pool/mathematics",
        summary: "Tape, blend, pots, overlay, and settlement formulas.",
      },
      {
        title: "Money and payouts",
        to: "/pool/money",
        summary: "Where USDG sits, who claims, who pays the overlay.",
      },
    ],
  },
  {
    title: "Leverage",
    items: [
      {
        title: "Leverage markets",
        to: "/leverage/overview",
        summary: "2x/3x: margin, fees, liquidation, vault as counterparty.",
      },
      {
        title: "Earning as an LP",
        to: "/leverage/earn",
        summary: "Deposit USDG. Back tickets. Earn fees and trader losses.",
      },
      {
        title: "Market makers",
        to: "/leverage/market-makers",
        summary: "Vault fills leverage today. No maker programme yet.",
      },
      {
        title: "The mathematics",
        to: "/leverage/mathematics",
        summary: "Every formula, as implemented on-chain.",
      },
    ],
  },
];

export const DEV_NAV: NavSection[] = [
  {
    title: "Developers",
    items: [
      {
        title: "Overview",
        to: "/developers",
        summary: "How another product uses Hedge without holding Privy or a builder key.",
      },
      {
        title: "Architecture",
        to: "/developers/architecture",
        summary: "Hedge abstracts Polymarket. Your vault can stay on Robinhood Chain.",
      },
      {
        title: "1x from a vault",
        to: "/developers/vaults",
        summary: "Keep the vault on Robinhood Chain. Hedge runs the 1x book hop.",
      },
      {
        title: "Your codebase",
        to: "/developers/code",
        summary: "Drop-in quote + ticket. Turn off your CLOB client and builder keys.",
      },
      {
        title: "Leveraged markets",
        to: "/developers/leverage",
        summary: "Put Hedge 2x to 4x tickets in another app. HTTP, engine, or deep link.",
      },
      {
        title: "Contracts",
        to: "/developers/contracts",
        summary: "Live addresses on Robinhood Chain. Engine, vault, oracle, pool, tokens.",
      },
    ],
  },
  {
    title: "HTTP APIs",
    items: [
      {
        title: "1x spot",
        to: "/guides/spot",
        summary: "List, quote, and deep-link a 1x ticket. The fill stays in Hedge.",
      },
      {
        title: "Agent Wall",
        to: "/guides/agent-wall",
        summary: "Quote every live market. Vault tickets from the agent wallet.",
      },
    ],
  },
];

/** User book. Introduction still maps this. */
export const NAV = APP_NAV;

function flatten(sections: NavSection[]) {
  return sections.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.title })),
  );
}

const APP_FLAT = flatten(APP_NAV);
const DEV_FLAT = flatten(DEV_NAV);

export function isDeveloperPath(pathname: string) {
  return (
    pathname === "/developers" ||
    pathname.startsWith("/developers/") ||
    pathname === "/guides/spot" ||
    pathname === "/guides/agent-wall"
  );
}

export function docsBook(pathname: string): DocsBook {
  return isDeveloperPath(pathname) ? "developers" : "app";
}

export function navFor(pathname: string) {
  return docsBook(pathname) === "developers" ? DEV_NAV : APP_NAV;
}

export function flatNav(pathname?: string) {
  if (!pathname) return APP_FLAT;
  return docsBook(pathname) === "developers" ? DEV_FLAT : APP_FLAT;
}

export function navNeighbours(pathname: string) {
  const list = flatNav(pathname);
  const index = list.findIndex((item) => item.to === pathname);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? list[index - 1]! : null,
    next: index < list.length - 1 ? list[index + 1]! : null,
  };
}

export function navItem(pathname: string) {
  return APP_FLAT.find((item) => item.to === pathname) ??
    DEV_FLAT.find((item) => item.to === pathname) ??
    null;
}

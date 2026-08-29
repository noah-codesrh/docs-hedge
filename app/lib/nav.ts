export type NavItem = {
  title: string;
  to: string;
  summary: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

/**
 * Single source of truth for the sidebar, the mobile picker, the search filter
 * and the prev/next footer links. Adding a page means adding it here and in
 * `routes.ts`, and nothing else.
 */
export const NAV: NavSection[] = [
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

const FLAT = NAV.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.title })),
);

export function flatNav() {
  return FLAT;
}

export function navNeighbours(pathname: string) {
  const index = FLAT.findIndex((item) => item.to === pathname);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? FLAT[index - 1]! : null,
    next: index < FLAT.length - 1 ? FLAT[index + 1]! : null,
  };
}

export function navItem(pathname: string) {
  return FLAT.find((item) => item.to === pathname) ?? null;
}

import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("components/DocsLayout.tsx", [
    index("routes/introduction.tsx"),
    route("getting-started", "routes/getting-started.tsx"),
    route("why", "routes/why.tsx"),
    route("quick-start", "routes/quick-start.tsx"),

    route("concepts/wallets", "routes/concepts.wallets.tsx"),
    route("concepts/markets", "routes/concepts.markets.tsx"),
    route("concepts/tokens", "routes/concepts.tokens.tsx"),
    route("concepts/positions", "routes/concepts.positions.tsx"),

    route("guides/adding-funds", "routes/guides.adding-funds.tsx"),
    route("guides/placing-a-trade", "routes/guides.placing-a-trade.tsx"),
    route("guides/cashing-out", "routes/guides.cashing-out.tsx"),
    route("guides/sharing", "routes/guides.sharing.tsx"),

    route("leverage/overview", "routes/leverage.overview.tsx"),
    route("leverage/earn", "routes/leverage.earn.tsx"),
    route("leverage/market-makers", "routes/leverage.market-makers.tsx"),
    route("leverage/mathematics", "routes/leverage.mathematics.tsx"),
  ]),
] satisfies RouteConfig;

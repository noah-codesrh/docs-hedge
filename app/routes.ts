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
    route("guides/hedgie", "routes/guides.hedgie.tsx"),
    route("guides/spot", "routes/guides.spot.tsx"),
    route("guides/agent-wall", "routes/guides.agent-wall.tsx"),

    route("developers", "routes/developers.tsx"),
    route("developers/architecture", "routes/developers.architecture.tsx"),
    route("developers/vaults", "routes/developers.vaults.tsx"),
    route("developers/code", "routes/developers.code.tsx"),
    route("developers/leverage", "routes/developers.leverage.tsx"),
    route("developers/contracts", "routes/developers.contracts.tsx"),
    route("developers/pool", "routes/developers.pool.tsx"),

    route("pool", "routes/pool.tsx"),
    route("pool/mathematics", "routes/pool.mathematics.tsx"),
    route("pool/money", "routes/pool.money.tsx"),
    route("pool/claim", "routes/pool.claim.tsx"),

    route("leverage/overview", "routes/leverage.overview.tsx"),
    route("leverage/earn", "routes/leverage.earn.tsx"),
    route("leverage/market-makers", "routes/leverage.market-makers.tsx"),
    route("leverage/mathematics", "routes/leverage.mathematics.tsx"),
  ]),
] satisfies RouteConfig;

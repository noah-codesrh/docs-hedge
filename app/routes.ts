import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("components/DocsLayout.tsx", [
    index("routes/introduction.tsx"),
    route("quick-start", "routes/quick-start.tsx"),

    route("concepts/wallets", "routes/concepts.wallets.tsx"),
    route("concepts/markets", "routes/concepts.markets.tsx"),
    route("concepts/tokens", "routes/concepts.tokens.tsx"),
    route("concepts/positions", "routes/concepts.positions.tsx"),

    route("guides/adding-funds", "routes/guides.adding-funds.tsx"),
    route("guides/placing-a-trade", "routes/guides.placing-a-trade.tsx"),
    route("guides/cashing-out", "routes/guides.cashing-out.tsx"),
    route("guides/sharing", "routes/guides.sharing.tsx"),

    route("architecture/overview", "routes/architecture.overview.tsx"),
    route(
      "architecture/trade-lifecycle",
      "routes/architecture.trade-lifecycle.tsx",
    ),
    route("architecture/data", "routes/architecture.data.tsx"),

    route("reference/api", "routes/reference.api.tsx"),
    route("reference/configuration", "routes/reference.configuration.tsx"),
    route("reference/project-layout", "routes/reference.project-layout.tsx"),

    route("operations/local-development", "routes/operations.local-development.tsx"),
    route("operations/deployment", "routes/operations.deployment.tsx"),
    route("operations/troubleshooting", "routes/operations.troubleshooting.tsx"),
  ]),
] satisfies RouteConfig;

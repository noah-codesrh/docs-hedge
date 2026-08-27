import { C, Code, H2, H3, Note, P, PageTitle } from "../components/prose";

export function meta() {
  return [
    { title: "Project layout · Hedge Docs" },
    {
      name: "description",
      content: "Where everything lives in the repository.",
    },
  ];
}

export default function ProjectLayout() {
  return (
    <>
      <PageTitle
        eyebrow="Reference"
        title="Project layout"
        intro="Two separate applications sit side by side: the app itself and this documentation site. Each has its own dependencies and its own dev server."
      />

      <H2>Top level</H2>
      <Code title="Repository root">{`frontend/        the Hedge application
docs/            this documentation site
previouslogic/   a snapshot of an earlier known-good state`}</Code>
      <Note>
        <C>previouslogic/</C> is a reference copy, not a build target. It is useful
        for diffing when a change needs to be reverted to a state that worked.
      </Note>

      <H2>The application</H2>
      <Code title="frontend/">{`app/
  root.tsx            document shell, error boundary
  routes.ts           explicit route table
  app.css             Tailwind theme tokens and keyframes
  routes/             page and API route modules
  components/         UI, one concern per file
  lib/                non-visual logic
  lib/trade/          the trading flows
  lib/server/         server-only modules
supabase/migrations/  SQL schema
public/               fonts, logos, static images
contracts/            Solidity sources, excluded from typecheck`}</Code>

      <H3>app/routes/</H3>
      <P>
        Flat, and named for the URL rather than nested by folder. API routes are
        prefixed <C>api.</C> with dots standing in for path separators, so{" "}
        <C>api.pm.balance.ts</C> serves <C>/api/pm/balance</C>. Page routes are{" "}
        <C>home.tsx</C>, <C>market.$id.tsx</C>, <C>profile.tsx</C>,{" "}
        <C>earn.tsx</C>, <C>terms.tsx</C>, and <C>shell.tsx</C> as their shared
        layout.
      </P>

      <H3>app/lib/</H3>
      <Code>{`chains.ts               chain ids, RPCs, token addresses
robinhood.ts            Robinhood Chain constants and helpers
evm.ts                  chain switching, receipts, rejection detection
wallet.ts               wallet selection and classification
pm-wallet.ts            deposit wallet storage
pm-funder.ts            deriving the Polymarket proxy
polymarket.ts           market shaping and liveness
polymarket-portfolio.ts positions and portfolio value
polymarket-account.ts   venue account lookups
orderbook.ts            fetching and walking the book
positions.ts            local position bookkeeping
pnl.ts                  profit and loss formatting
convert.ts              conversion quoting for display
format.ts               currency, cents, percentages
sponsored-send.ts       sponsored transfer helpers
track.ts                analytics reporting
seo.ts                  meta tags
env.ts                  reading client configuration`}</Code>

      <H3>app/lib/trade/</H3>
      <P>The trading flows, kept apart from the rest of the library:</P>
      <Code>{`session.ts       credentials, auth headers, balance reads
live.ts          runLiveTrade      the buy flow
close.ts         runClosePosition, runCashOut
relay-steps.ts   executing and polling a Relay quote
creds.ts         caching CLOB credentials in the browser`}</Code>

      <H3>app/lib/server/</H3>
      <Code>{`privy-auth.ts    token verification and ownership checks
relay.ts         Relay client
secrets.ts       reading server environment variables
supabase.ts      Supabase client`}</Code>
      <P>
        Nothing here should ever be imported from a browser module. These hold or
        use secrets.
      </P>

      <H2>The docs site</H2>
      <Code title="docs/">{`app/
  root.tsx                document shell
  routes.ts               one entry per page
  app.css                 the same theme tokens as the app
  components/
    DocsLayout.tsx        header, sidebar, mobile drawer, prev/next
    prose.tsx             typographic building blocks
  lib/nav.ts              the sidebar, in one place
  routes/                 one module per documentation page
public/                   logo and font, copied from the app`}</Code>
      <P>
        Adding a page means creating a module in <C>app/routes/</C>, registering it
        in <C>app/routes.ts</C>, and listing it in <C>app/lib/nav.ts</C>. The
        sidebar, the filter, and the previous and next links all derive from that
        one list.
      </P>

      <Note kind="warning" title="routes.ts and the filesystem must agree">
        React Router reads the route table at startup and opens each file it names.
        A route pointing at a module that does not exist stops the dev server with
        an <C>ENOENT</C> before it serves anything, so register a page and create
        its file in the same change.
      </Note>

      <H2>Notable configuration</H2>
      <Code>{`vite.config.ts           Tailwind and React Router plugins, dev port
react-router.config.ts   SSR on
tsconfig.json            strict, bundler resolution, ~/* -> ./app/*
Dockerfile               multi-stage build (frontend only)`}</Code>
      <P>
        The app&rsquo;s <C>tsconfig.json</C> excludes <C>contracts</C>, because the
        Solidity tooling&rsquo;s import style does not typecheck under the
        app&rsquo;s settings.
      </P>
    </>
  );
}

import { Link } from "react-router";
import {
  C,
  Code,
  H2,
  H3,
  Li,
  Note,
  P,
  PageTitle,
  Table,
  Td,
  Tr,
  Ul,
} from "../components/prose";

export function meta() {
  return [
    { title: "System overview · Hedge Docs" },
    {
      name: "description",
      content:
        "The application, its server routes, and the external services behind them.",
    },
  ];
}

export default function Overview() {
  return (
    <>
      <PageTitle
        eyebrow="Architecture"
        title="System overview"
        intro="Hedge is a single server-rendered React Router application. It owns no database of record for markets or positions; it composes external services and keeps their credentials on the server."
      />

      <H2>The stack</H2>
      <Table head={["Layer", "Choice"]}>
        <Tr>
          <Td>Framework</Td>
          <Td>React Router 8 with SSR enabled</Td>
        </Tr>
        <Tr>
          <Td>Build tool</Td>
          <Td>Vite 8</Td>
        </Tr>
        <Tr>
          <Td>UI</Td>
          <Td>React 19, Tailwind CSS 4</Td>
        </Tr>
        <Tr>
          <Td>Chain access</Td>
          <Td>viem</Td>
        </Tr>
        <Tr>
          <Td>Venue SDK</Td>
          <Td>
            <C>@polymarket/client</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Auth and wallets</Td>
          <Td>
            <C>@privy-io/react-auth</C> in the browser, <C>@privy-io/node</C> on
            the server
          </Td>
        </Tr>
        <Tr>
          <Td>Storage</Td>
          <Td>Supabase</Td>
        </Tr>
        <Tr>
          <Td>Charts</Td>
          <Td>
            <C>lightweight-charts</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Package manager</Td>
          <Td>pnpm</Td>
        </Tr>
      </Table>

      <H2>Shape of the app</H2>
      <P>
        Routing is configured explicitly in <C>app/routes.ts</C> rather than by
        file convention. API routes are declared first and are flat; the
        user-facing pages sit inside a shared layout that provides the header and
        navigation.
      </P>
      <Code title="app/routes.ts, abridged">{`route("api/events", ...)         // ~20 flat API routes
route("api/pm/...", ...)
route("api/relay/...", ...)

layout("routes/shell.tsx", [     // header, nav, balances
  index("routes/home.tsx"),      // market listings
  route("market/:id", ...),      // one market plus trade panel
  route("profile", ...),         // balances, positions, deposit
  route("earn", ...),
  route("terms", ...),
])`}</Code>

      <H3>Why the browser never calls upstream services directly</H3>
      <P>
        Every external call is proxied through the app&rsquo;s own routes. This
        keeps API keys server-side, hides upstream hostnames from the client,
        allows short-lived caching, and gives one place to verify the
        caller&rsquo;s Privy token before doing anything on their behalf.
      </P>

      <H2>External services</H2>
      <Table head={["Service", "Host", "Used for"]}>
        <Tr>
          <Td>Polymarket Gamma</Td>
          <Td>
            <C>gamma-api.polymarket.com</C>
          </Td>
          <Td>Events, markets, metadata</Td>
        </Tr>
        <Tr>
          <Td>Polymarket CLOB</Td>
          <Td>
            <C>clob.polymarket.com</C>
          </Td>
          <Td>Order book, prices, order placement</Td>
        </Tr>
        <Tr>
          <Td>Polymarket Data</Td>
          <Td>
            <C>data-api.polymarket.com</C>
          </Td>
          <Td>Positions and portfolio value</Td>
        </Tr>
        <Tr>
          <Td>Polymarket status</Td>
          <Td>
            <C>status.polymarket.com</C>
          </Td>
          <Td>Checked before a trade so an outage is reported plainly</Td>
        </Tr>
        <Tr>
          <Td>Polymarket relayer</Td>
          <Td>reached through the SDK</Td>
          <Td>Gasless transfers and approvals on Polygon</Td>
        </Tr>
        <Tr>
          <Td>Privy</Td>
          <Td>
            <C>api.privy.io</C>
          </Td>
          <Td>Token verification, embedded wallets, sponsored transactions</Td>
        </Tr>
        <Tr>
          <Td>Relay</Td>
          <Td>
            <C>api.relay.link</C>
          </Td>
          <Td>Converting between USDG and pUSD</Td>
        </Tr>
        <Tr>
          <Td>Robinhood Chain RPC</Td>
          <Td>
            <C>rpc.mainnet.chain.robinhood.com</C>
          </Td>
          <Td>USDG, ETH, and WETH balances and transfers</Td>
        </Tr>
        <Tr>
          <Td>Polygon RPC</Td>
          <Td>
            <C>polygon-bor-rpc.publicnode.com</C>
          </Td>
          <Td>Reading Polygon state and receipts</Td>
        </Tr>
      </Table>

      <H2>Authentication boundary</H2>
      <P>
        Protected routes read a bearer token from the request and verify it with
        Privy. There are two strengths of check, and the difference matters:
      </P>
      <Ul>
        <Li>
          <strong className="text-white">Session check</strong> — the token is
          valid. Enough for reads and for signing helpers that reveal nothing
          user-specific.
        </Li>
        <Li>
          <strong className="text-white">User check</strong> — the token is valid{" "}
          <em>and</em> the resolved user actually owns the wallet named in the
          request. Required before anything that moves value.
        </Li>
      </Ul>
      <Note>
        The ownership check is what stops a valid token being used to request a
        conversion into somebody else&rsquo;s wallet. Routes that move funds use
        it; routes that only read do not need to. The{" "}
        <Link
          to="/reference/api"
          className="font-semibold text-gold underline decoration-gold/30 underline-offset-2 hover:decoration-gold"
        >
          API reference
        </Link>{" "}
        lists which is which.
      </Note>

      <H2>Client-side trading logic</H2>
      <P>
        Order signing happens in the browser, because the trading wallet&rsquo;s
        signer lives there. The modules under <C>app/lib/trade/</C> own this:
      </P>
      <Code title="app/lib/trade/">{`session.ts       credentials, auth headers, balance reads
live.ts          runLiveTrade    — the buy flow
close.ts         runClosePosition, runCashOut — the sell flows
relay-steps.ts   executing and polling a Relay quote
creds.ts         caching CLOB API credentials in the browser`}</Code>
      <P>
        A consequence worth knowing: because the flow is driven from the browser,
        closing the tab midway stops it. The money is never lost, but it stops at
        whichever hop it had reached.
      </P>
    </>
  );
}

import { A, C, Code, H2, H3, Note, P, PageTitle, Table, Td, Tr } from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "HTTP API",
    description: "Every server route in the Hedge app, its inputs, its auth requirement, and what it returns.",
  });
}

function Auth({ level }: { level: "none" | "session" | "user" }) {
  const label =
    level === "none" ? "Public" : level === "session" ? "Session" : "User";
  const tone =
    level === "none"
      ? "border-white/15 text-muted"
      : level === "session"
        ? "border-gold/30 text-gold"
        : "border-up/30 text-up";
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone}`}
    >
      {label}
    </span>
  );
}

export default function Api() {
  return (
    <>
      <PageTitle
        eyebrow="Reference"
        title="HTTP API"
        intro="These routes belong to the Hedge app itself. They exist so the browser never talks to upstream services directly, which keeps credentials on the server and gives one place to authorise the caller."
      />

      <H2>Authorisation levels</H2>
      <P>
        Protected routes expect a Privy access token as{" "}
        <C>Authorization: Bearer &lt;token&gt;</C>. There are three levels:
      </P>
      <Table head={["Level", "Meaning"]}>
        <Tr>
          <Td>
            <Auth level="none" />
          </Td>
          <Td>No token required. Market data and other non-sensitive reads.</Td>
        </Tr>
        <Tr>
          <Td>
            <Auth level="session" />
          </Td>
          <Td>
            A valid token is required, but the route does not tie the action to a
            specific wallet.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Auth level="user" />
          </Td>
          <Td>
            A valid token <em>and</em> the resolved user must own the wallets named
            in the request. Used before anything that moves value.
          </Td>
        </Tr>
      </Table>

      <Note>
        The ownership check on the <Auth level="user" /> routes is the important
        one. It is what prevents a valid token from being used to move funds into a
        wallet the caller does not control.
      </Note>

      <H2>Market data</H2>

      <H3>GET /api/events</H3>
      <P>
        <Auth level="none" /> Market listings from the venue’s market data API.
      </P>
      <Code>{`Query
  tag      string   defaults to "all"
  sort     string   defaults to "trending"
  offset   number   defaults to 0

Returns  { events, nextOffset, hasMore }`}</Code>

      <H3>GET /api/quotes</H3>
      <P>
        <Auth level="none" /> Current prices for a set of markets.
      </P>
      <Code>{`Query
  ids      comma-separated market ids, up to 40

Returns  { quotes: { [marketId]: { yes, no } } }`}</Code>

      <H3>GET /api/pm/book</H3>
      <P>
        <Auth level="none" /> Raw order book depth, proxied from the CLOB.
      </P>
      <Code>{`Query
  tokenIds   comma-separated outcome token ids, up to 4

Returns  { books }   bids and asks per token id
           cached for two seconds, since the UI polls every six`}</Code>

      <H3>GET /api/pm/status</H3>
      <P>
        <Auth level="none" /> Whether the venue is accepting orders. The trade
        flows call this first so maintenance is reported plainly.
      </P>
      <Code>{`Returns  { ok, status, service }`}</Code>

      <H3>GET /api/pm/config</H3>
      <P>
        <Auth level="none" /> Public trading configuration, including the builder
        code attached to orders. The client sends a bearer token here out of habit,
        but the route does not require or verify one.
      </P>
      <Code>{`Returns  { builderCode: string }`}</Code>

      <H2>Balances and positions</H2>

      <H3>GET /api/assets</H3>
      <P>
        <Auth level="none" /> Robinhood Chain balances for an address: <C>USDG</C>,{" "}
        <C>ETH</C>, and <C>WETH</C>.
      </P>
      <Code>{`Query
  address    the wallet to read

Returns  { assets: [{ symbol, balance, ... }] }`}</Code>

      <H3>GET /api/pm/balance</H3>
      <P>
        <Auth level="session" /> The <C>pUSD</C> balance of one wallet on Polygon.
      </P>
      <Code>{`Query
  wallet     the address to read

Returns  { pusd: number, raw: string }
           raw is base units as a string, to survive JSON`}</Code>

      <H3>GET /api/pm/portfolio</H3>
      <P>
        <Auth level="none" /> Open positions and portfolio value from
        the venue&rsquo;s data API.
      </P>
      <Code>{`Query
  addresses   comma-separated wallet addresses, up to 6

Returns  open positions, closed positions, activity, and total value`}</Code>

      <H3>GET /api/pm/account</H3>
      <P>
        <Auth level="none" /> Venue account information for one or more
        addresses.
      </P>
      <Code>{`Query
  addresses   comma-separated wallet addresses`}</Code>

      <H2>Trading support</H2>

      <H3>POST /api/pm/builder-sign</H3>
      <P>
        <Auth level="session" /> Signs an order attribution payload with the
        builder credentials. Those keys stay on the server, so the SDK calls this
        route instead of holding them.
      </P>

      <H3>GET /api/pm/relayer-key</H3>
      <P>
        <Auth level="session" /> Returns the relayer API key and its address, which
        is what makes proxy transfers and approvals gasless.
      </P>
      <Code>{`Returns  { key: string, address: string }
           an empty or invalid response degrades to non-gasless`}</Code>

      <H3>POST /api/pm/sponsor-tx</H3>
      <P>
        <Auth level="user" /> Submits a Polygon transaction on the user&rsquo;s
        behalf with sponsored gas. Used to sweep <C>pUSD</C> from the signer into
        the proxy.
      </P>
      <Code>{`Body
  from, to, data, chainId
  signature, requestExpiry    on the second call, if authorisation is needed

Returns  { hash } or { payload, requestExpiry } to be signed and resent`}</Code>

      <H3>POST /api/rh/sponsor-send</H3>
      <P>
        <Auth level="user" /> Sponsored token send on Robinhood Chain. Rejects any
        request for a different chain.
      </P>

      <H2>Conversions</H2>

      <H3>POST /api/relay/quote</H3>
      <P>
        <Auth level="user" /> Requests a conversion route from Relay. Both the
        origin and the destination are checked against the authenticated
        user&rsquo;s wallets before a quote is returned.
      </P>
      <Code>{`Body
  user         origin wallet
  recipient    destination wallet
  amount       base units, as a string
  direction    "in" | "out"
  mode         e.g. "deposit"
  refundTo     wallet to refund if the conversion fails

Returns  a quote containing steps, a deposit address, and a requestId`}</Code>

      <H3>GET /api/relay/status</H3>
      <P>
        <Auth level="session" /> Progress of a conversion. Polled until it reports a
        terminal state.
      </P>
      <Code>{`Query
  requestId    from the quote

Returns  { status }
           success | complete | completed   -> done
           failure | failed                 -> failed
           refund  | refunded               -> funds returned to refundTo`}</Code>

      <H3>POST /api/relay/forward</H3>
      <P>
        <Auth level="session" /> Forwards a signed step to a Relay endpoint named by
        the quote, so the browser does not call Relay directly.
      </P>
      <Code>{`Body
  endpoint, method, body, signature`}</Code>

      <H2>App data</H2>

      <H3>POST /api/track/trade</H3>
      <P>
        <Auth level="user" /> Records a completed trade. Idempotent on the CLOB
        order id, so a retried report cannot double-count.
      </P>

      <H3>POST /api/track/nickname</H3>
      <P>
        <Auth level="user" /> Sets a display name and appends to the nickname
        history.
      </P>

      <H2>Utilities</H2>

      <H3>GET /api/qr</H3>
      <P>
        <Auth level="none" /> Returns a QR code as a PNG, encoding the site URL.
        Proxied so the browser does not call the QR service directly.
      </P>

      <H3>POST /api/convert</H3>
      <P>
        <Auth level="none" /> <strong className="text-white">Disabled.</strong>{" "}
        Always responds <C>410 Gone</C>. It was a mock conversion endpoint from
        before real conversions existed, and it is retained only so old clients get
        an unambiguous answer rather than a 404. Do not build against it.
      </P>

      <Note kind="warning" title="Method matters">
        The POST routes check the request method and reject anything else. A GET
        against them returns an error rather than falling through to a loader.
      </Note>

      <Note kind="warning" title="503 means a missing secret">
        Each route that needs a server credential returns <C>503</C> when it is
        absent, rather than failing further in. So a <C>503</C> from{" "}
        <C>/api/relay/quote</C> or <C>/api/pm/builder-sign</C> is a deployment
        problem, not an upstream outage. The{" "}
        <A to="/reference/configuration">configuration reference</A>{" "}
        lists which variable each route depends on.
      </Note>
    </>
  );
}

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
    { title: "Data and storage · Hedge Docs" },
    {
      name: "description",
      content:
        "Where market and position data comes from, and the small amount the app persists itself.",
    },
  ];
}

export default function Data() {
  return (
    <>
      <PageTitle
        eyebrow="Architecture"
        title="Data and storage"
        intro="Almost nothing is the app's own data. Markets, prices, balances, and positions are all read live from upstream services or from chain state. Supabase holds only a thin layer of app-specific records."
      />

      <H2>Where each number comes from</H2>
      <Table head={["Shown in the UI", "Source", "Via"]}>
        <Tr>
          <Td>Market listings, metadata</Td>
          <Td>Polymarket Gamma</Td>
          <Td>
            <C>/api/events</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Current prices</Td>
          <Td>Polymarket CLOB</Td>
          <Td>
            <C>/api/quotes</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Order book depth</Td>
          <Td>Polymarket CLOB</Td>
          <Td>
            <C>/api/pm/book</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Open positions, portfolio value</Td>
          <Td>Polymarket Data API</Td>
          <Td>
            <C>/api/pm/portfolio</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Cash balance</Td>
          <Td>Robinhood Chain</Td>
          <Td>
            <C>/api/assets</C>
          </Td>
        </Tr>
        <Tr>
          <Td>pUSD balance</Td>
          <Td>Polygon</Td>
          <Td>
            <C>/api/pm/balance</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Venue health</Td>
          <Td>Polymarket status</Td>
          <Td>
            <C>/api/pm/status</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Nicknames, trade history</Td>
          <Td>Supabase</Td>
          <Td>
            <C>/api/track/*</C>
          </Td>
        </Tr>
      </Table>

      <Note>
        Because positions are read from the venue rather than stored locally, they
        reflect the venue&rsquo;s own view of what you hold. There is no local
        ledger that can drift out of sync with reality.
      </Note>

      <H3>How the order book is used</H3>
      <P>
        Book data is fetched for a set of token ids and parsed into sorted bid and
        ask levels. Two helpers then simulate an order against it: one walks the
        asks to work out what a given dollar amount would buy, the other walks the
        bids to work out what a given number of shares would return.
      </P>
      <P>
        This is what lets the trade panel show a realistic share count and average
        price rather than dividing by the quoted midpoint, and it is what makes the
        round-trip cost of the spread visible before you commit.
      </P>

      <H2>Persistence</H2>
      <P>
        Supabase is reached only from the server, using a secret key that bypasses
        row-level security. It is never exposed to the browser. Three tables exist,
        defined in <C>supabase/migrations/</C>.
      </P>

      <H3>trades</H3>
      <P>
        One row per reported trade, written after a buy or sell succeeds. Used for
        volume accounting rather than as the source of truth for positions.
      </P>
      <Code title="Notable columns">{`privy_user_id    stable identity of the trader
wallet           Robinhood Chain address the USDG moved through
proxy_wallet     the Polymarket funder
direction        'buy' | 'sell'
outcome          'yes' | 'no'   (+ outcome_label for the market's own name)
event_slug, market_slug, token_id, title
usdg             what went in on a buy, or out on a sell
pusd, shares, price
order_id         CLOB order id
conversion_id    Relay request id`}</Code>
      <P>
        There is a unique index on <C>order_id</C> where it is not null, so a
        client that retries a report cannot double-count volume. A daily volume
        view is defined on top of the table.
      </P>

      <H3>profiles</H3>
      <P>
        Keyed by <C>privy_user_id</C>, holding an optional <C>nickname</C> and the
        user&rsquo;s wallet. A null nickname means the user never set one and the
        app falls back to a social handle or a shortened address.
      </P>

      <H3>nickname_changes</H3>
      <P>
        Append-only history, one row per actual change, referencing{" "}
        <C>profiles</C> with cascade on delete. Counting rows per user gives how
        often they have renamed themselves.
      </P>

      <H2>Browser storage</H2>
      <P>
        The rest of the state the app keeps lives in <C>localStorage</C>, which
        means it is per-browser and clearing site data resets it. None of it is
        authoritative — it is either a cache of something derivable or a display
        preference.
      </P>
      <Table head={["Key", "Holds", "If cleared"]}>
        <Tr>
          <Td>
            <C>hedge:pm:deposit:&lt;signer&gt;</C>
          </Td>
          <Td>The derived Polymarket proxy address</Td>
          <Td>Re-derived deterministically; the address is unchanged.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>hedge:pm:creds:&lt;address&gt;</C>
          </Td>
          <Td>CLOB API credentials</Td>
          <Td>
            Re-derived on the next trade, which costs one extra signature. Also
            cleared automatically if the venue rejects them.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>hedge:positions</C>
          </Td>
          <Td>A local record of trades made in the app</Td>
          <Td>
            Nothing of consequence. Real positions come from the venue, so they
            still appear.
          </Td>
        </Tr>
      </Table>

      <H2>What is not persisted</H2>
      <Ul>
        <Li>Market and price data — always fetched live.</Li>
        <Li>Positions and balances — always read from the venue or the chain.</Li>
        <Li>Private keys — held by Privy, never by the app.</Li>
      </Ul>
      <Note>
        Because nothing the app stores locally is authoritative, clearing site data
        is a safe first move when the interface misbehaves. Your funds and positions
        live on-chain and at the venue, not in the browser.
      </Note>

      <Note>
        Supabase configuration is optional. Leaving its environment variables blank
        disables the analytics writes rather than breaking trading, which keeps a
        local environment runnable without a database.
      </Note>

      <P>
        Exact parameters for every route above are in the{" "}
        <Link
          to="/reference/api"
          className="font-semibold text-gold underline decoration-gold/30 underline-offset-2 hover:decoration-gold"
        >
          HTTP API reference
        </Link>
        .
      </P>
    </>
  );
}

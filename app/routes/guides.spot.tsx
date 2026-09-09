import {
  A,
  C,
  Code,
  H2,
  H3,
  Li,
  Note,
  P,
  PageTitle,
  Step,
  Steps,
  Table,
  Td,
  Tr,
  Ul,
} from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "1x spot integration",
    description:
      "How another product lists Hedge 1x markets, quotes the book, and sends the user to a prefilled ticket.",
  });
}

export default function SpotIntegrationDocs() {
  return (
    <>
      <PageTitle
        eyebrow="Developers"
        title="1x spot integration"
        intro="Another product can list every live 1x market, walk the book, and hand the user a prefilled ticket. The fill happens in Hedge. You never hold a builder key."
      />

      <P>
        1x is real Yes/No shares on the venue book. USDG converts to pUSD, then
        a fill-and-kill order matches. That last step needs the user&rsquo;s
        Hedge session, so an external app does not place the order. It quotes
        and deep-links.
      </P>
      <Ul>
        <Li>
          Capability card:{" "}
          <A href="https://hedgeapp.trade/api/spot">/api/spot</A>
        </Li>
        <Li>
          Index: <A href="https://hedgeapp.trade/llms.txt">/llms.txt</A>
        </Li>
      </Ul>

      <H2>Recommended flow</H2>
      <Steps>
        <Step n={1} title="List">
          <P>
            <C>GET /api/spot/markets</C> returns live venue markets: slug,
            Gamma id, title, Yes/No, token ids, and a bare <C>ticketUrl</C>.
            Filter with <C>?q=</C>. Page with <C>?limit=</C> and{" "}
            <C>?offset=</C>.
          </P>
        </Step>
        <Step n={2} title="Quote">
          <P>
            <C>GET /api/spot/quote</C> walks the live asks for that size. Use
            this on your ticket, not the mid, so a thin book does not look
            cheaper than it is.
          </P>
        </Step>
        <Step n={3} title="Hand off">
          <P>
            Open <C>ticketUrl</C> from the quote, or build{" "}
            <C>/market/{"{eventSlug}"}?m={"{marketId}"}&s=yes&amt=5</C>. The
            panel lands on that side and size. The user signs in, converts if
            needed, and confirms. Optional <C>&ref=</C> attributes the volume
            to a Hedge invite code.
          </P>
        </Step>
      </Steps>

      <Note title="Why the fill stays in Hedge">
        Builder HMAC, the gasless relayer, and Relay conversion are first-party.
        They require a Hedge Privy session. A partner that tried to call{" "}
        <C>/api/pm/builder-sign</C> from another origin would get 401. The
        ticket is the integration. Architecture:{" "}
        <A to="/developers/architecture">Hedge abstracts Polymarket</A>.
        Vault loop: <A to="/developers/vaults">Vaults on Robinhood</A>.
      </Note>

      <H2>Endpoints</H2>
      <Table head={["Method", "Path", "Auth"]}>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/api/spot</C> capability card
          </Td>
          <Td>No</Td>
        </Tr>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/api/spot/markets</C>
          </Td>
          <Td>No</Td>
        </Tr>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/api/spot/quote</C>
          </Td>
          <Td>No</Td>
        </Tr>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/api/spot/ticket</C> quote plus ticket URL
          </Td>
          <Td>No</Td>
        </Tr>
      </Table>
      <P>
        CORS is open. These are GET-only. There is no POST that fills 1x.
      </P>

      <H3>Markets</H3>
      <Code title="GET /api/spot/markets">{`{
  "markets": [
    {
      "marketSlug": "will-luiz-incio-lula-da-silva-win-the-2026-brazilian-presidential-election",
      "marketId": "601819",
      "eventSlug": "brazil-presidential-election",
      "title": "Will Lula win the 2026 Brazilian presidential election?",
      "yes": 0.42,
      "no": 0.58,
      "yesCents": "42¢",
      "yesTokenId": "123…",
      "noTokenId": "456…",
      "live": true,
      "ticketUrl": "https://hedgeapp.trade/market/brazil-presidential-election?m=601819"
    }
  ],
  "total": 80,
  "hasMore": true
}`}</Code>

      <H3>Quote</H3>
      <Code title="GET /api/spot/quote">{`?marketId=601819&side=yes&amount=5`}</Code>
      <P>
        <C>marketSlug</C> works in place of <C>marketId</C>. <C>side</C> is{" "}
        <C>yes</C> / <C>long</C> or <C>no</C> / <C>short</C>. <C>amount</C> is
        USDG, minimum $1, maximum $10,000.
      </P>
      <Code title="200">{`{
  "desk": "spot",
  "marketId": "601819",
  "eventSlug": "brazil-presidential-election",
  "side": "yes",
  "amount": 5,
  "ticketUrl": "https://hedgeapp.trade/market/brazil-presidential-election?m=601819&s=yes&amt=5",
  "quote": {
    "size": 5,
    "spent": 5,
    "shares": 11.9,
    "entryPrice": 0.42,
    "unfilled": 0,
    "fillable": true,
    "source": "book"
  },
  "next": "Open ticketUrl. The user signs in on Hedge and confirms the 1x fill."
}`}</Code>
      <P>
        <C>fillable</C> is false when more than 5% of the size would not lift.
        Show that before you send the user over.
      </P>

      <H3>Ticket URL</H3>
      <Code title="shape">{`https://hedgeapp.trade/market/{eventSlug}?m={marketId}&s=yes|no&amt=5&ref=yourcode`}</Code>
      <Table head={["Query", "Role"]}>
        <Tr>
          <Td>
            <C>m</C>
          </Td>
          <Td>Gamma market id. Required when the event has more than one outcome.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>s</C>
          </Td>
          <Td>
            <C>yes</C> or <C>no</C>. Defaults to Yes.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>amt</C>
          </Td>
          <Td>Prefills the panel. Dollars. Minimum 1.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>ref</C>
          </Td>
          <Td>Optional Hedge invite code. First touch only.</Td>
        </Tr>
      </Table>

      <H2>Worked example</H2>
      <Code title="shell">{`curl -s https://hedgeapp.trade/api/spot

curl -s "https://hedgeapp.trade/api/spot/markets?q=lula"

curl -s "https://hedgeapp.trade/api/spot/quote?marketId=601819&side=yes&amount=5"

# Open the returned ticketUrl in the user's browser.`}</Code>
      <Code title="browser">{`const ticket = await fetch(
  "https://hedgeapp.trade/api/spot/ticket?marketId=601819&side=yes&amount=5",
).then((r) => r.json());

window.location.assign(ticket.ticketUrl);`}</Code>

      <H2>Catalog extras</H2>
      <P>
        Same book as the app, also CORS-open if you want to render your own
        cards:
      </P>
      <Ul>
        <Li>
          <C>GET /api/events?tag=&sort=&offset=</C>
        </Li>
        <Li>
          <C>GET /api/quotes?ids=601819,601820</C>
        </Li>
        <Li>
          <C>GET /api/pm/book?tokenIds=</C> using <C>yesTokenId</C> /{" "}
          <C>noTokenId</C> from the market row
        </Li>
      </Ul>

      <H2>What this API does not do</H2>
      <Ul>
        <Li>Place the CLOB order for you.</Li>
        <Li>Convert USDG to pUSD on a server.</Li>
        <Li>Hand out Hedge builder or relayer secrets.</Li>
        <Li>Open a vault ticket. That is a different product.</Li>
      </Ul>
      <P>
        How a confirmed buy moves money:{" "}
        <A to="/guides/placing-a-trade">Placing a trade</A>. Wallets:{" "}
        <A to="/concepts/wallets">Accounts and wallets</A>.
      </P>
    </>
  );
}

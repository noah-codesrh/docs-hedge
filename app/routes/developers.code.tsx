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
  Ul,
} from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Your codebase",
    description:
      "Drop-in TypeScript for quoting Hedge 1x from a Robinhood vault. How to stop using your Polymarket CLOB client and builder code for this loop.",
  });
}

export default function DevelopersCode() {
  return (
    <>
      <PageTitle
        eyebrow="Developers"
        title="Drop this in your repo"
        intro="Quote Hedge, sweep USDG, open the ticket. Do not construct a Polymarket CLOB client or attach your builder code for this loop. Hedge already signs, attributes, and relays."
      />

      <P>
        Flow: <A to="/developers/architecture">Architecture</A>. Operator
        steps: <A to="/developers/vaults">1x from a vault</A>. HTTP shapes:{" "}
        <A to="/guides/spot">1x spot</A>.
      </P>

      <Note kind="warning" title="Do not point your builder at Hedge">
        <C>/api/pm/builder-sign</C> is origin-locked. Hedge stamps its own{" "}
        <C>builderCode</C> on the fill. Your{" "}
        <C>POLY_BUILDER_*</C> keys and{" "}
        <C>@polymarket/clob-client</C> stay out of this path.
      </Note>

      <H2>Env</H2>
      <P>
        You need a Hedge origin, an operator cash wallet, and the condition
        id your vault already stores. You do not need a CLOB key or a builder
        secret.
      </P>
      <Code title=".env">{`HEDGE_ORIGIN=https://hedgeapp.trade
# Cash wallet of the signed-in Hedge operator (Robinhood Chain).
HEDGE_OPERATOR=0x
# Optional. First-touch invite on the ticket URL.
HEDGE_REF=`}</Code>
      <P>Leave these unused for the 1x loop. Delete them if this was the only CLOB client:</P>
      <Code title=".env (unused)">{`# Do not send these at Hedge. Do not pass them into ClobClient for this vault.
POLY_BUILDER_CODE=
POLY_BUILDER_API_KEY=
POLY_BUILDER_SECRET=
POLY_BUILDER_PASSPHRASE=
CLOB_API_KEY=
CLOB_API_SECRET=
CLOB_API_PASSPHRASE=`}</Code>

      <H2>hedge.ts</H2>
      <P>
        Drop this next to your vault keeper. It maps a condition id to a
        Gamma market id, quotes the live book, and returns the ticket the
        operator opens.
      </P>
      <Code title="hedge.ts">{`const HEDGE = process.env.HEDGE_ORIGIN ?? "https://hedgeapp.trade";

export type HedgeSide = "yes" | "no";

export type HedgeQuote = {
  marketId: string;
  eventSlug: string;
  ticketUrl: string;
  quote: {
    size: number;
    spent: number;
    shares: number;
    entryPrice: number;
    unfilled: number;
    fillable: boolean;
  };
};

export async function marketIdFromCondition(conditionId: string) {
  const url =
    "https://gamma-api.polymarket.com/markets?closed=false&condition_id=" +
    encodeURIComponent(conditionId);
  const rows = (await fetch(url).then((r) => r.json())) as unknown;
  const row = Array.isArray(rows) ? rows[0] : rows;
  const id = String((row as { id?: string } | null)?.id ?? "");
  if (!id) throw new Error("No live Gamma market for that condition id");
  return id;
}

export async function quoteHedge(input: {
  conditionId: string;
  side: HedgeSide;
  amount: number;
  ref?: string;
}): Promise<HedgeQuote> {
  const marketId = await marketIdFromCondition(input.conditionId);
  const params = new URLSearchParams({
    marketId,
    side: input.side,
    amount: String(input.amount),
  });
  const ref = input.ref ?? process.env.HEDGE_REF;
  if (ref) params.set("ref", ref);

  const res = await fetch(HEDGE + "/api/spot/quote?" + params.toString());
  const body = (await res.json()) as HedgeQuote & { error?: string };
  if (!res.ok) throw new Error(body.error ?? "Hedge quote failed");
  if (!body.quote?.fillable) throw new Error("Book too thin");
  return body;
}`}</Code>

      <H2>Keeper</H2>
      <P>
        Quote, then sweep only that size to <C>HEDGE_OPERATOR</C>. The fill
        still happens in the app. There is no POST that places 1x.
      </P>
      <Code title="keeper.ts">{`import { quoteHedge } from "./hedge";

export async function buyOutcome(input: {
  conditionId: string;
  side: "yes" | "no";
  amount: number;
  sweepUsdg: (to: string, amount: number) => Promise<void>;
}) {
  const operator = process.env.HEDGE_OPERATOR;
  if (!operator) throw new Error("Set HEDGE_OPERATOR");

  const quote = await quoteHedge(input);
  await input.sweepUsdg(operator, quote.quote.size);

  // Signed-in operator opens this URL and confirms.
  return quote.ticketUrl;
}`}</Code>

      <H2>Your Polymarket builder code</H2>
      <P>
        If this vault used to talk to the CLOB on Polygon, you already have
        something like{" "}
        <A href="https://docs.polymarket.com/builders/api-keys">
          builder API keys
        </A>{" "}
        and a{" "}
        <A href="https://docs.polymarket.com/trading/orders/attribution">
          builder code
        </A>{" "}
        on <C>createAndPostOrder</C>. That stack is what Hedge replaces for
        this loop.
      </P>

      <H3>Stop constructing the CLOB client</H3>
      <Code title="fill.ts (before)">{`import { ClobClient } from "@polymarket/clob-client";

const client = new ClobClient({
  host: process.env.CLOB_HOST,
  chain: 137,
  creds: {
    key: process.env.CLOB_API_KEY,
    secret: process.env.CLOB_API_SECRET,
    passphrase: process.env.CLOB_API_PASSPHRASE,
  },
  builderConfig: {
    builderCode: process.env.POLY_BUILDER_CODE,
  },
});

await client.createAndPostOrder({
  tokenID,
  side: "BUY",
  size,
  builderCode: process.env.POLY_BUILDER_CODE,
});`}</Code>
      <Code title="fill.ts (after)">{`import { quoteHedge } from "./hedge";

const quote = await quoteHedge({
  conditionId,
  side: "yes",
  amount,
});

await vault.transferUsdg(process.env.HEDGE_OPERATOR!, quote.quote.size);
// Operator confirms quote.ticketUrl on hedgeapp.trade
// Hedge attaches its builderCode, HMAC, and relayer.`}</Code>

      <H3>What to turn off</H3>
      <Ul>
        <Li>
          <C>@polymarket/clob-client</C> / <C>clob-client-v2</C> for this
          vault
        </Li>
        <Li>
          <C>@polymarket/builder-signing-sdk</C> and any{" "}
          <C>POLY_BUILDER_*</C> HMAC headers
        </Li>
        <Li>Polygon twin vault, bridge, and CLOB L2 keys for this loop</Li>
        <Li>
          Any call to Hedge <C>/api/pm/builder-sign</C> (401 from your origin)
        </Li>
      </Ul>
      <P>
        Keep those packages only if another product still places its own CLOB
        orders. The vault 1x path does not import them.
      </P>

      <H3>Why your builder profile is not on the fill</H3>
      <P>
        A{" "}
        <A href="https://docs.polymarket.com/trading/orders/attribution">
          builder code
        </A>{" "}
        is a public <C>bytes32</C> on the signed order. Polymarket credits the
        matched trade to whoever posted that order. Today that is you: your
        CLOB client, your keys, your <C>POLY_BUILDER_CODE</C>.
      </P>
      <P>
        On this path Hedge is the app that posts the order. The operator
        confirms in hedgeapp.trade. Hedge session, Hedge HMAC, Hedge relayer,
        Hedge builder code. That is the same wrapper that lets you drop Polygon
        and the twin vault.
      </P>
      <Ul>
        <Li>
          You cannot pass <C>POLY_BUILDER_CODE</C> into{" "}
          <C>GET /api/spot</C>. The quote has no builder field.
        </Li>
        <Li>
          You cannot call <C>/api/pm/builder-sign</C> from your origin. That
          route is 401 on purpose.
        </Li>
        <Li>
          Builder fees and profile volume for these 1x fills sit on Hedge,
          not on your builder settings page.
        </Li>
        <Li>
          Your builder profile still counts orders you post yourself on any
          other product. This vault loop is not one of those orders.
        </Li>
      </Ul>
      <Note title="What you are choosing">
        Routing 1x through Hedge means you give up posting the CLOB order, and
        the builder attribution that comes with posting it. You keep the
        vault, USDG, condition id, and relink on Robinhood Chain. If a fill
        must show your builder code on-chain, you are still on your own CLOB
        client. That is the stack this integration replaces, not an extra
        Hedge flag.
      </Note>

      <H2>After resolve</H2>
      <P>
        Redeem in Hedge (
        <A to="/guides/cashing-out">Closing and cashing out</A>
        ). USDG lands in the operator cash wallet. Transfer it back to the
        vault, then run your existing buyback and write the next condition id.
        Hedge does not store that id.
      </P>

      <H2>Third-party</H2>
      <Ul>
        <Li>
          <A href="https://docs.polymarket.com/developers/gamma-markets">
            Gamma markets
          </A>
          : conditionId to market id
        </Li>
        <Li>
          <A href="https://docs.polymarket.com/builders/api-keys">
            Builder API keys
          </A>
          : what you are turning off
        </Li>
        <Li>
          <A href="https://docs.polymarket.com/trading/orders/attribution">
            Order attribution
          </A>
          : why <C>builderCode</C> used to sit on your order
        </Li>
        <Li>
          <A href="https://docs.polymarket.com/developers/CLOB/introduction">
            CLOB
          </A>
          : only if you still need a fully automated book with no Hedge session
        </Li>
      </Ul>
    </>
  );
}

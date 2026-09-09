import {
  A,
  C,
  Code,
  H2,
  Li,
  Note,
  P,
  PageTitle,
  Step,
  Steps,
  Ul,
} from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "1x from a vault",
    description:
      "Keep your vault on Robinhood Chain. Quote Hedge, fill 1x in the app, redeem, send USDG home, relink.",
  });
}

export default function DevelopersVaults() {
  return (
    <>
      <PageTitle
        eyebrow="Developers"
        title="1x from a vault"
        intro="Same six-step flow as Architecture, with the calls you actually make. Your vault never talks to Polymarket. Hedge does."
      />

      <P>
        Same six steps as the{" "}
        <A to="/developers/architecture">architecture flow</A>. Copy-paste
        keeper and builder teardown:{" "}
        <A to="/developers/code">Your codebase</A>. HTTP shapes:{" "}
        <A to="/guides/spot">1x spot</A>.
      </P>

      <Note>
        There is no POST that fills 1x. A keeper can quote and sweep. A signed-in
        Hedge session still confirms the ticket. The fill uses Hedge&rsquo;s
        builder code, not yours.{" "}
        <A to="/developers/code">Why your builder profile is not on the fill</A>.
      </Note>

      <H2>Steps</H2>
      <Steps>
        <Step n={1} title="Keep the vault on Robinhood Chain">
          <P>
            Chain 4663. Cash is <C>USDG</C>{" "}
            <C>0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168</C>. Do not bridge to
            Polygon for this loop.{" "}
            <A href="https://robinhoodchain.blockscout.com">Explorer</A>.
          </P>
        </Step>
        <Step n={2} title="Quote Hedge">
          <P>
            Map your stored condition id to a Gamma market id (
            <A href="https://docs.polymarket.com/developers/gamma-markets">
              Gamma
            </A>
            ), then:
          </P>
          <Code title="shell">{`curl -s "https://hedgeapp.trade/api/spot/quote?marketId=601819&side=yes&amount=25"`}</Code>
          <P>
            Use <C>ticketUrl</C> only when <C>quote.fillable</C> is true.
          </P>
        </Step>
        <Step n={3} title="Sweep USDG to the Hedge operator">
          <P>
            One account on{" "}
            <A href="https://hedgeapp.trade">hedgeapp.trade</A>. Fund that
            cash wallet (
            <A to="/guides/adding-funds">Adding funds</A>
            ). Send only the quote size from your vault.
          </P>
        </Step>
        <Step n={4} title="Open the ticket in Hedge">
          <P>
            Signed in as that operator, open:
          </P>
          <Code title="ticket">{`https://hedgeapp.trade/market/{eventSlug}?m={marketId}&s=yes&amt=25`}</Code>
          <P>
            Convert if the panel asks. Confirm. Builder and relayer stay inside
            Hedge.
          </P>
        </Step>
        <Step n={5} title="Wait for the venue, then redeem">
          <P>
            Resolution is Polymarket&rsquo;s:{" "}
            <A href="https://docs.polymarket.com/developers/resolution/overview">
              resolution
            </A>
            . Close or redeem in Hedge (
            <A to="/guides/cashing-out">Closing and cashing out</A>
            ). USDG lands in the same cash wallet.
          </P>
        </Step>
        <Step n={6} title="Send USDG home and relink">
          <P>
            Transfer USDG back to your vault. Run whatever buyback you already
            have. Write the next condition id on the vault. Repeat from step 2.
            Hedge does not store your next market.
          </P>
        </Step>
      </Steps>

      <H2>Keeper (quote + sweep only)</H2>
      <Code title="keeper.ts">{`const gamma = await fetch(
  "https://gamma-api.polymarket.com/markets?closed=false&condition_id=" +
    conditionId,
).then((r) => r.json());

const row = Array.isArray(gamma) ? gamma[0] : gamma;
const marketId = String(row?.id ?? "");
const quote = await fetch(
  "https://hedgeapp.trade/api/spot/quote?marketId=" +
    marketId +
    "&side=yes&amount=" +
    amount,
).then((r) => r.json());

if (!quote.quote?.fillable) throw new Error("Book too thin");
// Sweep USDG from your vault to the operator, then open quote.ticketUrl.`}</Code>

      <H2>If you need a fully automated CLOB</H2>
      <P>
        A contract that must buy shares with no session still has to be a
        Polymarket CLOB client:{" "}
        <A href="https://docs.polymarket.com/developers/CLOB/introduction">
          CLOB
        </A>
        ,{" "}
        <A href="https://docs.polymarket.com/developers/CLOB/authentication">
          auth
        </A>
        . That is the path Hedge is replacing for you, not an extra Hedge
        endpoint.
      </P>
      <Ul>
        <Li>
          Catalog: <C>GET /api/spot/markets</C> and <C>/quote</C>
        </Li>
        <Li>
          Fill: operator opens <C>ticketUrl</C>
        </Li>
        <Li>Return: redeem in Hedge, USDG back to your vault</Li>
      </Ul>
    </>
  );
}

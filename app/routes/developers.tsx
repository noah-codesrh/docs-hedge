import {
  A,
  C,
  Card,
  Cards,
  H2,
  Li,
  Note,
  P,
  PageTitle,
  Ul,
} from "../components/prose";
import { HedgePmFigure } from "../components/figures";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Developers",
    description:
      "How another product uses Hedge as the Polymarket execution layer. Vaults stay on Robinhood Chain. No Privy token. No builder key.",
  });
}

export default function Developers() {
  return (
    <>
      <PageTitle
        eyebrow="Developers"
        title="Build on Hedge, not on Polymarket"
        intro="Hedge already wraps the venue: session, USDG conversion, builder HMAC, and the gasless relayer. Another product lists, quotes, and hands off. 1x fills stay here. 2x to 4x is on-chain on Robinhood Chain, so another app can open those tickets itself."
      />

      <HedgePmFigure />

      <P>
        You cannot drop Hedge in as a raw Polymarket SDK. The cash wallet is
        Privy. Builder sign and the relayer are first-party and origin-locked.
        That is by design. You do not get those secrets. You get a public
        catalog, a live quote, a 1x ticket, and on listed names the
        leverage engine itself (HTTP calldata or a direct contract call).
      </P>

      <Note title="What this book is">
        App docs are for traders. This book is for another product. 1x:
        <A to="/developers/architecture">Architecture</A>, then{" "}
        <A to="/developers/vaults">1x from a vault</A>, then{" "}
        <A to="/developers/code">Your codebase</A>. Leveraged markets:{" "}
        <A to="/developers/leverage">Integrate leveraged markets</A> and{" "}
        <A to="/developers/contracts">Contracts</A>. HTTP only:{" "}
        <A to="/guides/spot">1x spot</A> or{" "}
        <A to="/guides/agent-wall">Agent Wall</A>.
      </Note>

      <H2>What Hedge will do for you</H2>
      <Ul>
        <Li>
          Hold the 1x Yes/No shares on the venue book. You never talk to the
          CLOB.
        </Li>
        <Li>
          Convert USDG on Robinhood Chain (4663) to the venue token and back.
        </Li>
        <Li>Quote the live asks so you do not size off a mid.</Li>
        <Li>
          Redeem after resolve, then you pull USDG back to your vault.
        </Li>
        <Li>
          On listed names, settle 2x to 4x on chain 4663. Your wallet or
          contract is the trader. See{" "}
          <A to="/developers/leverage">Leveraged markets</A>.
        </Li>
      </Ul>

      <H2>What Hedge will not do</H2>
      <Ul>
        <Li>
          Hand you a Privy access token, a builder secret, or{" "}
          <C>/api/pm/builder-sign</C>. Another origin gets 401.
        </Li>
        <Li>
          Let a smart contract on Robinhood Chain place the CLOB order. The
          fill needs a Hedge session (1x) or an agent wallet signing vault
          calldata (listed leverage only).
        </Li>
        <Li>
          Custody the shares inside your vault. They sit in the Hedge cash
          wallet until you send proceeds home.
        </Li>
        <Li>
          Stamp your <C>POLY_BUILDER_CODE</C> on the 1x order. Hedge posts
          the fill, so Hedge&rsquo;s builder code is on it.{" "}
          <A to="/developers/code">Why, in your repo</A>.
        </Li>
      </Ul>

      <H2>Where to start</H2>
      <Cards>
        <Card to="/developers/leverage" title="Leveraged markets">
          Put 2x to 4x tickets in your app. Agent Wall, engine calls, or a
          deep link. Settles on chain 4663.
        </Card>
        <Card to="/developers/contracts" title="Contracts">
          Live engine, vault, oracle, stock desk, pool, USDG, and $HEDGE.
        </Card>
        <Card to="/developers/architecture" title="Architecture">
          Numbered flow: vault, quote, sweep, wrapper, venue, redeem.
        </Card>
        <Card to="/developers/vaults" title="1x from a vault">
          Same six steps, with curl, ticket URL, and third-party links.
        </Card>
        <Card to="/developers/code" title="Your codebase">
          Drop-in hedge.ts. Stop wiring ClobClient and POLY_BUILDER_* for this
          loop.
        </Card>
        <Card to="/guides/spot" title="1x spot">
          List every live market, walk the book, open a prefilled ticket. CORS
          is open. There is no POST that fills.
        </Card>
        <Card to="/guides/agent-wall" title="Agent Wall">
          Same catalog. Spot still fills in the app. Listed leverage names
          return unsigned engine calls your wallet signs on chain 4663.
        </Card>
      </Cards>

      <H2>Live URLs</H2>
      <Ul>
        <Li>
          App: <A href="https://hedgeapp.trade">hedgeapp.trade</A>
        </Li>
        <Li>
          Spot card:{" "}
          <A href="https://hedgeapp.trade/api/spot">/api/spot</A>
        </Li>
        <Li>
          Agent card:{" "}
          <A href="https://hedgeapp.trade/api/agent">/api/agent</A>
        </Li>
        <Li>
          Machine index:{" "}
          <A href="https://hedgeapp.trade/llms.txt">/llms.txt</A>
        </Li>
      </Ul>
    </>
  );
}

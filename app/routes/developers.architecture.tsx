import {
  A,
  C,
  H2,
  Li,
  Note,
  P,
  PageTitle,
  Step,
  Steps,
  Ul,
} from "../components/prose";
import { HedgePmFigure, VaultBridgeFigure } from "../components/figures";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Architecture",
    description:
      "Step-by-step flow: your Robinhood vault through Hedge to the Polymarket book. Privy, Relay, builder, and relayer stay first-party.",
  });
}

export default function DevelopersArchitecture() {
  return (
    <>
      <PageTitle
        eyebrow="Developers"
        title="Hedge abstracts Polymarket"
        intro="Your vault stays on Robinhood Chain. Hedge is the hop to the 1x book. You never hold a Privy token or a builder key. Follow the numbered flow, then the same six steps below."
      />

      <HedgePmFigure />

      <H2>The flow</H2>
      <Steps>
        <Step n={1} title="Your vault stays on Robinhood Chain">
          <P>
            USDG, your condition id, relink. No Polygon twin. No bridge for
            this loop.
          </P>
        </Step>
        <Step n={2} title="Quote Hedge">
          <P>
            <C>GET /api/spot/quote</C> walks the live asks. You get size, entry,
            <C>fillable</C>, and <C>ticketUrl</C>. Details:{" "}
            <A to="/guides/spot">1x spot</A>.
          </P>
        </Step>
        <Step n={3} title="Sweep USDG to the operator">
          <P>
            One Hedge account (Google, email, or wallet). That session owns
            the cash wallet. Send only what the quote needs.
          </P>
        </Step>
        <Step n={4} title="Hedge wrapper">
          <P>
            Privy session, Relay (USDG to pUSD), origin-locked builder HMAC,{" "}
            gasless relayer. Your contract cannot call this. The signed-in
            operator can.
          </P>
        </Step>
        <Step n={5} title="Venue 1x">
          <P>
            Hedge places the FAK on the Polymarket book. You never talk to the
            CLOB. Shares sit in that Hedge wallet until resolve.
          </P>
        </Step>
        <Step n={6} title="Redeem and return">
          <P>
            After the venue resolves, redeem in Hedge. USDG lands in the same
            wallet. Send it back to your vault. Relink the next market on your
            side.
          </P>
        </Step>
      </Steps>

      <Note kind="warning" title="Why this is not a contract call">
        <C>/api/pm/builder-sign</C> is 401 from another origin. There is no
        POST that fills 1x. A smart contract cannot mint a Privy session. The
        operator is the signer Hedge already knows.
      </Note>

      <H2>What you still own</H2>
      <Ul>
        <Li>The vault and any token logic on chain 4663.</Li>
        <Li>The condition id (or Gamma market id) and relink.</Li>
        <Li>How much USDG leaves the vault, and when it comes home.</Li>
      </Ul>
      <P>
        Hedge owns the session, conversion, builder, relayer, and the 1x
        shares until you pull USDG back. The fill is attributed to Hedge&rsquo;s
        builder profile, not yours. Why, and what that means for{" "}
        <C>POLY_BUILDER_CODE</C>:{" "}
        <A to="/developers/code">Your codebase</A>.
      </P>

      <VaultBridgeFigure />

      <H2>Third-party docs</H2>
      <Ul>
        <Li>
          <A href="https://docs.polymarket.com/developers/gamma-markets">
            Gamma markets
          </A>{" "}
          : conditionId to market id
        </Li>
        <Li>
          <A href="https://docs.polymarket.com/developers/CLOB/introduction">
            CLOB
          </A>{" "}
          : why a raw order needs an API key (Hedge already has one)
        </Li>
        <Li>
          <A href="https://docs.polymarket.com/developers/resolution/overview">
            Resolution
          </A>
        </Li>
        <Li>
          <A href="https://docs.privy.io">Privy</A>: why the cash wallet is
          not a key in your vault
        </Li>
        <Li>
          <A href="https://robinhoodchain.blockscout.com">
            Robinhood Chain explorer
          </A>{" "}
          : chain 4663, USDG
        </Li>
      </Ul>
      <P>
        Same six steps with curl and the ticket URL:{" "}
        <A to="/developers/vaults">1x from a vault</A>. Drop-in{" "}
        <C>hedge.ts</C> and how to tear out your builder client:{" "}
        <A to="/developers/code">Your codebase</A>.
      </P>
    </>
  );
}

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
    title: "Hedgie",
    description:
      "Hedge's prediction copilot: live market context, leverage-aware answers, and trade tickets you still have to open.",
  });
}

export default function HedgieGuide() {
  return (
    <>
      <PageTitle
        eyebrow="Guides"
        title="Hedgie"
        intro="Hedgie is Hedge's prediction copilot. Ask about live markets in plain English, get odds and context grounded in the desk, and when you clearly want a position, receive a trade ticket you review and open yourself."
      />

      <P>
        Open{" "}
        <A href="https://hedgeapp.trade/ai">hedgeapp.trade/ai</A> or tap the
        Hedgie icon in the header. Hedgie is not a general chatbot and not an
        autotrader. He is scoped to Hedge: listed leverage markets, trending
        spot, how the vault works, and how to read a ticket.
      </P>

      <H2>What Hedgie can do</H2>
      <Ul>
        <Li>
          <strong className="text-white">Answer from the live book.</strong>{" "}
          Every turn refreshes a snapshot of listed leverage markets and trending
          spot. Yes and No are quoted in cents from that feed, not from memory.
        </Li>
        <Li>
          <strong className="text-white">Explain the desk.</strong> 1x vs vault
          leverage, the 35&cent; to 65&cent; band, max leverage per market, fees,
          carry, Earn, and how spot differs from synthetic margin. See{" "}
          <A to="/leverage/overview">Leverage markets</A> for the full rules.
        </Li>
        <Li>
          <strong className="text-white">Compare names.</strong> Which leverage
          market has the best Yes in band, what the implied chance is on a
          headline, whether a name is on the allowlist for 2x to 4x.
        </Li>
        <Li>
          <strong className="text-white">Draft a trade ticket.</strong> When you
          clearly want to open a position, Hedgie can propose margin, side, and
          leverage on a real market id. The app turns that into a card with{" "}
          <C>Review &amp; open</C>.
        </Li>
      </Ul>

      <H2>What Hedgie cannot do</H2>
      <Ul>
        <Li>
          <strong className="text-white">Place or cancel orders.</strong> The
          model never signs a transaction. You always land on the market page and
          confirm on the trade panel.
        </Li>
        <Li>
          <strong className="text-white">Invent markets or prices.</strong> If a
          slug, id, or quote is not in the live context for that turn, Hedgie is
          instructed to treat it as unavailable.
        </Li>
        <Li>
          <strong className="text-white">Offer vault leverage everywhere.</strong>{" "}
          2x to 4x only applies to hand-listed markets when Yes sits inside the
          band. Everything else is 1x spot.
        </Li>
        <Li>
          <strong className="text-white">Discuss off-desk topics.</strong> News
          digests, portfolio advice outside Hedge, or unrelated prompts get a
          short decline and a steer back to the product.
        </Li>
      </Ul>

      <Note kind="warning" title="Prices move">
        The snapshot is fresh at the start of each message, but the book can
        shift before you confirm. The market page and trade panel are still the
        source of truth when you open a ticket.
      </Note>

      <H2>How a turn works</H2>
      <P>
        Hedgie runs on the server. Your browser posts the conversation to{" "}
        <C>/api/hedgie</C>. The model API key never ships to the client.
      </P>
      <Steps>
        <Step n={1} title="Build live context">
          <P>
            The server pulls the leverage allowlist (titles, slugs, ids, Yes/No,
            in-band or off-band, max leverage, 24h volume) and up to twelve
            trending spot markets that are not already on that list.
          </P>
        </Step>
        <Step n={2} title="Stream the reply">
          <P>
            That snapshot is injected as the source of truth for the turn. The
            last sixteen messages of your thread are kept so follow-ups like
            &ldquo;make that 2x&rdquo; still make sense. Tokens stream back into
            the chat as they arrive.
          </P>
        </Step>
        <Step n={3} title="Parse a ticket, if any">
          <P>
            When Hedgie proposes a trade, he emits a structured block the app
            strips out of the prose and renders as a ticket card. Pure questions
            do not produce a ticket.
          </P>
        </Step>
        <Step n={4} title="Review and open">
          <P>
            <C>Review &amp; open</C> deep-links to the market with side and
            leverage query params pre-filled on the trade panel. You still size,
            read the quote, and confirm. See{" "}
            <A to="/guides/placing-a-trade">Placing a trade</A>.
          </P>
        </Step>
      </Steps>

      <H2>Trade tickets</H2>
      <P>
        A ticket card shows the market title, <C>Yes</C> or <C>No</C>, margin,
        leverage, and notional (margin &times; leverage). Defaults are
        conservative: if you do not name a stake, margin defaults to $5; if you
        do not name leverage, it defaults to 1x. Hedgie will not exceed that
        market&rsquo;s max leverage.
      </P>
      <Table head={["Field", "Meaning"]}>
        <Tr>
          <Td>
            <C>margin</C>
          </Td>
          <Td>USDG you post. On 1x this is the buy size; on leverage it is collateral.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>leverage</C>
          </Td>
          <Td>
            1x is spot. 2x to 4x is vault margin on listed markets when Yes is
            in band.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>Review &amp; open</C>
          </Td>
          <Td>
            Opens the market page with <C>?m=</C> market id, <C>?s=</C> side, and{" "}
            <C>?lev=</C> when leverage is above 1x.
          </Td>
        </Tr>
      </Table>

      <H2>Example prompts</H2>
      <Ul>
        <Li>Which leverage market has the best Yes price in band?</Li>
        <Li>What is the implied chance on [event]?</Li>
        <Li>Open $5 Yes on [market] at 2x</Li>
        <Li>How does vault leverage work?</Li>
        <Li>Is [market] listed for leverage right now?</Li>
      </Ul>

      <H2>Who this helps</H2>
      <H3>New traders</H3>
      <P>
        Hedgie is a guided path into the vocabulary: cents as probability, spot vs
        vault, why a selector might be greyed out off-band. You can ask before
        you click.
      </P>
      <H3>Active traders</H3>
      <P>
        A second screen that already knows which names are listed, which can take
        4x at current TVL, and what the live Yes is. Faster from intent to a
        reviewed ticket, without giving the model your keys.
      </P>
      <H3>LPs and readers</H3>
      <P>
        Plain-language explanations of Earn, fees, and how trader P&amp;L flows
        through senior and junior tranches. For formulas, use{" "}
        <A to="/leverage/mathematics">The mathematics</A>.
      </P>

      <H2>Privacy and availability</H2>
      <P>
        Conversation text is sent to the server for each turn so Hedgie can
        answer with live context. The OpenRouter credential lives in server
        environment variables only. If Hedgie is not configured, the app shows
        that he is unavailable rather than exposing setup details in the browser.
      </P>
      <P>
        Hedgie can be wrong or briefly out of date. Treat him as a clerk on the
        desk: useful, fast, and never the person who hits send.
      </P>

      <Note title="You are still the trader">
        The copilot compresses discovery and ticket prep. Execution, slippage,
        and settlement are unchanged. When in doubt, trust the market page.
        Outside agents that need a fill use the{" "}
        <A to="/guides/agent-wall">Agent Wall</A>, not Hedgie.
      </Note>
    </>
  );
}

import { A, C, H2, Li, Note, P, PageTitle, Step, Steps, Table, Td, Tr, Ul } from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Placing a trade",
    description: "Choose a side, size the order, read the confirmation steps, and understand what can go wrong.",
  });
}

export default function PlacingATrade() {
  return (
    <>
      <PageTitle
        eyebrow="Guides"
        title="Placing a trade"
        intro="Buying takes a few seconds and several steps, because your funds have to cross to the venue before an order can fill. Here is what each part of the panel means and what happens after you confirm."
      />

      <Steps>
        <Step n={1} title="Open a market and pick a side">
          <P>
            From the home page, open any market. The trade panel offers <C>Yes</C>{" "}
            and <C>No</C> with their current prices in cents. Selecting a side sets
            what you are buying.
          </P>
        </Step>

        <Step n={2} title="Enter an amount">
          <P>
            Type a dollar amount or use the quick-add buttons. The amount is capped
            at your available cash. The panel shows the shares that amount buys,
            calculated by walking the live order book rather than dividing by the
            quoted price, so it reflects what you would actually get.
          </P>
        </Step>

        <Step n={3} title="Confirm">
          <P>
            Confirm the ticket and leave the tab open. A progress overlay reports
            each step as it completes.
          </P>
        </Step>

        <Step n={4} title="See the position">
          <P>
            On success the panel shows the fill and your new position appears on
            the market page and in <C>Profile</C>.
          </P>
        </Step>
      </Steps>

      <H2>2x and 3x</H2>
      <P>
        On listed markets the panel offers a multiple. 1x is the spot path
        above. 2x/3x stays on Robinhood Chain: margin vs the vault, no share
        conversion. You get a success modal and a P&amp;L card when it lands.
        Rules and fees: <A to="/leverage/overview">Leverage markets</A>.
      </P>

      <H2>Pool</H2>
      <P>
        <A href="https://hedgeapp.trade/pool">hedgeapp.trade/pool</A> is a
        different ticket. You pick a side, stake $1–$25 of USDG, and wait
        for the window. There are no shares to sell. Winners split the two
        pots. How the pots pay:{" "}
        <A to="/pool">Pool and liquidity</A>.
      </P>

      <H2>Hedgie</H2>
      <P>
        <A to="/guides/hedgie">Hedgie</A> is the in-app copilot at{" "}
        <A href="https://hedgeapp.trade/ai">hedgeapp.trade/ai</A>. Ask for live
        odds, compare listed leverage names, or say what you want to open. When
        the intent is clear, Hedgie hands you a ticket with{" "}
        <C>Review &amp; open</C>. He never places the trade for you.
      </P>
      <P>
        Another product that should send a user into this panel uses{" "}
        <A to="/guides/spot">1x spot integration</A>.
      </P>

      <H2>What is happening while you wait</H2>
      <P>
        The overlay is a progress ring rather than a labelled checklist, so it
        shows movement without naming the stage. Internally a buy passes through
        four:
      </P>
      <Table head={["Stage", "What is happening"]}>
        <Tr>
          <Td>
            <C>setup</C>
          </Td>
          <Td>
            Validating the amount, deriving your proxy wallet, obtaining trading
            credentials, and setting the venue&rsquo;s one-time approvals. Only
            slow the first time.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>debit</C>
          </Td>
          <Td>
            Taking the <C>USDG</C> from your cash wallet, which involves signing on
            Robinhood Chain.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>convert</C>
          </Td>
          <Td>
            Turning it into <C>pUSD</C> via Relay and waiting for it to land in
            your proxy wallet.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>fill</C>
          </Td>
          <Td>Placing the market order and matching it against the book.</Td>
        </Tr>
      </Table>

      <Note title="The first trade is the slow one">
        Setup signs for API credentials and sets token approvals. Both are cached
        for the rest of the session, so later trades skip straight ahead.
      </Note>

      <Note title="Sometimes the conversion is skipped entirely">
        Before converting, the app checks what <C>pUSD</C> your proxy already
        holds. If there is at least a dollar and it covers the order, the debit and
        convert stages are skipped and the order is placed directly from that
        balance. This is what makes a retry after an interrupted trade fast, and
        why it does not convert your money twice.
      </Note>

      <H2>How the order is placed</H2>
      <P>
        Orders are market orders of the fill-or-kill kind. A buy carries a{" "}
        <em>maximum</em> price and a sell carries a <em>minimum</em>, derived from
        an estimate of the current market price. That limit is a slippage guard: if
        the book has moved far enough that your order would fill much worse than
        quoted, it is rejected rather than filled at a bad price.
      </P>
      <P>
        The consequence is that a rejected order in a fast-moving market is the
        guard doing its job. Your <C>pUSD</C> stays in the proxy and retrying
        re-quotes against the new book.
      </P>

      <H2>Things that can stop a trade</H2>
      <Ul>
        <Li>
          <strong className="text-white">Amount too small.</strong> Both the
          conversion and the venue have minimums. Increase the amount.
        </Li>
        <Li>
          <strong className="text-white">No fillable liquidity.</strong> Nothing is
          resting on the other side at an acceptable price. Try a smaller size or a
          more active market.
        </Li>
        <Li>
          <strong className="text-white">Price moved.</strong> The slippage guard
          rejected the fill. Retry.
        </Li>
        <Li>
          <strong className="text-white">Venue in maintenance.</strong> The app
          checks the order book&rsquo;s health first and says so plainly rather
          than failing obscurely.
        </Li>
      </Ul>
      <P>
        In each of these your money is safe. If the conversion already ran, it is
        sitting as <C>pUSD</C> in your proxy and a retry spends it rather than
        converting again.
      </P>

      <Note kind="warning" title="Do not navigate away mid-trade">
        The sequence is driven from the browser. Closing the tab between converting
        and filling stops it partway, leaving <C>pUSD</C> in the proxy. Nothing is
        lost, but you will need to retry the buy or cash out to move it.
      </Note>

      <H2>Cost, honestly</H2>
      <P>
        Buying pays the ask and selling receives the bid, so a position is worth
        slightly less than you paid the moment it opens. That is the spread, not a
        charge, and{" "}
        <A to="/concepts/positions">positions and P&amp;L</A>{" "}
        works through the arithmetic.
      </P>
    </>
  );
}

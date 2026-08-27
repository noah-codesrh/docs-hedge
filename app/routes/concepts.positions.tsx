import { Code, H2, H3, Li, Note, P, PageTitle, Ul } from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Positions and P&L",
    description: "How a position is valued, how profit and loss is derived, and why a new position can open slightly negative.",
  });
}

export default function Positions() {
  return (
    <>
      <PageTitle
        eyebrow="Core concepts"
        title="Positions and P&amp;L"
        intro="A position is a number of shares in one outcome. Its value is whatever the market will currently pay for them, which is why the number moves long before the question resolves."
      />

      <H2>What a position is made of</H2>
      <Ul>
        <Li>
          <strong className="text-white">Shares</strong> — how many units of the
          outcome you hold.
        </Li>
        <Li>
          <strong className="text-white">Entry price</strong> — the average price
          you paid per share.
        </Li>
        <Li>
          <strong className="text-white">Cost basis</strong> — shares multiplied
          by entry price. What you put in.
        </Li>
        <Li>
          <strong className="text-white">Current value</strong> — what the shares
          are worth at the market&rsquo;s present price.
        </Li>
      </Ul>
      <P>
        For an open position, profit and loss is current value minus cost basis,
        and the percentage shown is that difference over the cost basis. Green is a
        gain, red a loss, and the app colours the figure accordingly.
      </P>
      <P>
        For a closed one the app does not recompute anything. It shows the realised
        figure the venue reports, alongside the total you originally paid. That way
        a closed position cannot drift as prices move afterwards, and it agrees with
        what the venue itself says you made.
      </P>

      <H2>Resolution</H2>
      <P>
        When a market resolves, each share of the correct outcome is worth $1.00
        and each share of the wrong one is worth nothing. You do not have to hold
        to resolution; selling early realises whatever the position is worth at
        that moment.
      </P>

      <H2>Why a brand new position can show a loss</H2>
      <P>
        This surprises almost everyone, and it is not a fee and not a bug. It
        comes from the spread.
      </P>
      <P>
        Buying fills against the <strong className="text-white">asks</strong>, the
        prices sellers are asking. Selling fills against the{" "}
        <strong className="text-white">bids</strong>, the prices buyers are
        offering. The bid is always below the ask, so the instant you buy, the
        price at which you could sell is lower than the price you just paid. Value
        the position at the bid and it is immediately worth slightly less than it
        cost.
      </P>

      <Code title="A worked example">{`Best ask   0.42     you buy here
Best bid   0.40     you would sell here
Spread     0.02

Buy $5.00 at 0.42        ->  11.90 shares
Sell 11.90 at 0.40       ->  $4.76
Round trip                   -$0.24, about -4.8%`}</Code>

      <P>
        Nothing moved in the market. That $0.24 is the cost of crossing the spread
        twice, and it is why a $5 buy sold straight back does not return $5. Wider
        spreads in thin markets make it larger; deep, liquid markets make it small.
      </P>

      <Note title="Two ways to reduce it">
        Trade markets with tighter spreads and more depth, and avoid buying and
        selling in quick succession. The cost is paid on entry and again on exit,
        so fewer round trips means less of it.
      </Note>

      <H3>Depth makes it worse than the top of the book suggests</H3>
      <P>
        The example above assumes your whole order fills at the best price. If your
        order is larger than the size resting there, the remainder fills at worse
        prices and your average entry is higher than the quote. The app works out
        your share count by walking the real book rather than dividing by the
        quoted price, so the estimate you see before confirming already accounts
        for this.
      </P>

      <H2>Where positions are shown</H2>
      <P>
        Open positions appear on the market page for the market they belong to, and
        all of them together on the profile page. The profile page also totals them
        into a portfolio value alongside your cash balance.
      </P>
      <P>
        Position and price data is read from the venue rather than stored by the
        app, so it reflects the venue&rsquo;s own view of what you hold. Nothing
        here is cached in a way that could go stale against it.
      </P>
    </>
  );
}

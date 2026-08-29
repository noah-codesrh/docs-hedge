import {
  A,
  C,
  H2,
  Li,
  P,
  PageTitle,
  Table,
  Td,
  Tr,
  Ul,
} from "../components/prose";
import {
  LeverageSizeFigure,
  LiquidationFigure,
  PnlModelFigure,
  PriceBandFigure,
  TvlLadderFigure,
} from "../components/figures";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Leverage markets",
    description:
      "How 2x and 3x work: size, profit and loss, liquidation, the price band, and how vault TVL raises the multiple.",
  });
}

export default function LeverageOverview() {
  return (
    <>
      <PageTitle
        eyebrow="Leverage"
        title="Leverage markets"
        intro="On listed markets you can size Yes or No at 2x or 3x. USDG stays on Robinhood Chain as margin. The vault takes the other side. 1x is a normal spot buy."
      />

      <H2>Leverage</H2>
      <P>
        <strong className="text-white">1x</strong> buys real shares. No vault,
        no liquidation, no carry.{" "}
        <strong className="text-white">2x / 3x</strong> is synthetic. You do
        not hold shares. You can be long or short.
      </P>
      <LeverageSizeFigure />

      <H2>Profit and loss</H2>
      <P>
        P&amp;L is on size, so 2x moves twice as fast as the margin you
        posted. You cannot lose more than that margin. The vault is the
        mirror: it pays winners and keeps losers.
      </P>
      <PnlModelFigure />
      <P>
        Fees sit on top: 1.5% of size in, 1.5% out, 1% entry spread against
        you. Carry is 1 bp per hour on the borrowed slice only. Round trip is
        about 3% of size before the price moves.
      </P>

      <H2>Liquidation</H2>
      <P>
        A 2x long at 50¢ is not a 25¢ wipe. The close hits when loss plus
        carry consume 90% of net margin. On the default $2.50 / 2x example
        that is about 28¢. Formulas:{" "}
        <A to="/leverage/mathematics">mathematics</A>.
      </P>
      <LiquidationFigure />
      <Ul>
        <Li>Close all or half. Remainder must stay at least $1.</Li>
        <Li>A wiped-out ticket pays no leftover carry or exit fee.</Li>
        <Li>Your carry rate is fixed at open.</Li>
      </Ul>

      <H2>Why the price is capped</H2>
      <P>
        A 90¢ Yes cannot really be liquidated at 2x. The vault would lock
        capital on a ticket that never comes back. So the engine only opens
        between 35¢ and 65¢.
      </P>
      <PriceBandFigure />

      <H2>How more liquidity raises leverage</H2>
      <P>
        The multiple is read from vault TVL on every open. More deposits, next
        rung. Less TVL, the cap steps down. A market can also sit below the
        pool cap.
      </P>
      <TvlLadderFigure />
      <Table head={["Limit", "Default"]}>
        <Tr>
          <Td>Min / max margin</Td>
          <Td>$1 / $5</Td>
        </Tr>
        <Tr>
          <Td>Max position size</Td>
          <Td>$25</Td>
        </Tr>
        <Tr>
          <Td>Vault capital in use</Td>
          <Td>30% of TVL</Td>
        </Tr>
      </Table>
      <P>
        Why LPs should add size: <A to="/why">Why Hedge</A> and{" "}
        <A to="/leverage/earn">Earning as an LP</A>.
      </P>

      <H2>If the price feed lags</H2>
      <Ul>
        <Li>
          On-chain price can only move 20% per update. No new opens while it
          catches up. Closes and liquidations stay on.
        </Li>
        <Li>Older than 5 minutes is no price. Opening stops.</Li>
        <Li>
          After 24 hours with no fresh price you can exit at zero P&amp;L.
          Net margin back, no exit fee. A frozen mark would pick a winner.
        </Li>
      </Ul>
    </>
  );
}

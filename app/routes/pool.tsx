import {
  A,
  C,
  Card,
  Cards,
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
  Code,
} from "../components/prose";
import {
  PoolDeskFigure,
  PoolSplitFigure,
  PoolTapeFigure,
} from "../components/figures";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Pool and liquidity",
    description:
      "How the native USDG pool works: parimutuel pots, tape odds vs payout, timeframes, desk caps, and on-chain tickets.",
  });
}

export default function Pool() {
  return (
    <>
      <PageTitle
        eyebrow="Pool"
        title="Pool and liquidity"
        intro="A separate desk from spot and from 2x–4x. USDG parimutuel on allowlisted memes. The tape shows a line. The two pots pay. Featured long races add a Hedge overlay."
      />

      <P>
        Open it at{" "}
        <A href="https://hedgeapp.trade/pool">hedgeapp.trade/pool</A>. This is
        not a Polymarket book and not the leverage vault. There is no LP on
        the other side. Traders are the liquidity. Every formula is on{" "}
        <A to="/pool/mathematics">The mathematics</A>.
      </P>
      <PoolDeskFigure />

      <H2>Three kinds of card</H2>
      <Table head={["Kind", "Question", "Who wins"]}>
        <Tr>
          <Td>Strike</Td>
          <Td>
            Will this name sit above a market-cap strike when the window
            ends.
          </Td>
          <Td>
            Side A if live cap is at or above the strike. Side B if it is
            under.
          </Td>
        </Tr>
        <Tr>
          <Td>PvP</Td>
          <Td>Which name printed more from the open snapshot.</Td>
          <Td>
            The larger market-cap return from open. A tie voids and refunds
            the stake.
          </Td>
        </Tr>
        <Tr>
          <Td>Community race</Td>
          <Td>
            Which name is closer to $1.00b. ZCAT vs ANSEM, then ANSEM vs
            MEME, CASHCAT, AI, and PONS.
          </Td>
          <Td>
            The larger live market cap at expiry. A tie voids.
          </Td>
        </Tr>
      </Table>
      <P>
        Names are an allowlist, not a live screener. Robinhood strikes use
        PONS, AI, CASHCAT, INDEX, STONKBROKER, SHROOM, OPTIMUS, and MEME.
        Featured races also use Solana ZCAT (Anonymous Cat) and ANSEM (The
        Black Bull).
      </P>

      <H2>Timeframes</H2>
      <P>
        Windows roll on UTC. Lock is a slice of the window, not a flat hour.
        After lock, no new tickets. After expiry, a reporter pushes the
        outcome and winners claim. Buttons, stuck cards, and one-sided
        pots: <A to="/pool/claim">Refund, redeem, and claim</A>.
      </P>
      <Table head={["Window", "Lock before expiry"]}>
        <Tr>
          <Td>15m</Td>
          <Td>1m</Td>
        </Tr>
        <Tr>
          <Td>1h</Td>
          <Td>5m</Td>
        </Tr>
        <Tr>
          <Td>4h</Td>
          <Td>15m</Td>
        </Tr>
        <Tr>
          <Td>6h</Td>
          <Td>20m</Td>
        </Tr>
        <Tr>
          <Td>12h</Td>
          <Td>30m</Td>
        </Tr>
        <Tr>
          <Td>24h</Td>
          <Td>1h</Td>
        </Tr>
        <Tr>
          <Td>7d</Td>
          <Td>12h</Td>
        </Tr>
        <Tr>
          <Td>14d</Td>
          <Td>24h</Td>
        </Tr>
        <Tr>
          <Td>30d</Td>
          <Td>48h</Td>
        </Tr>
      </Table>
      <P>
        Short community races use 4h to 24h. Featured long races use 7d / 14d /
        30d. Each card has its own slug, so a 15m PONS strike and a 24h PONS
        strike are different markets and different pots.
      </P>

      <H2>Where liquidity comes from</H2>
      <P>
        Each market has two USDG pots, side A and side B. Your stake goes
        into one of them. There is no house seed. The first tickets{" "}
        <em>are</em> the book.
      </P>
      <PoolSplitFigure />
      <Ul>
        <Li>
          A fat side is the favorite in payout terms. It pays a small
          multiple if it hits.
        </Li>
        <Li>
          A thin side pays more if it hits, because it splits a larger
          losing pot. It also pays nothing if it misses.
        </Li>
        <Li>
          The vault on{" "}
          <A to="/leverage/overview">leverage markets</A> is a different
          pool. Deeper vault TVL raises 2x–4x size. It does not back these
          tickets.
        </Li>
      </Ul>
      <Note>
        If nobody is on the side that should win, that outcome cannot
        resolve. The contract refuses an empty winning side, so the market
        voids and every ticket is refunded. Liquidity has to exist on the
        winning side for a payout to run.
      </Note>

      <H2>How a winner is paid</H2>
      <P>
        Not a fixed 2x or 3x. Winners split the whole pot in proportion to
        their stake. Featured long races also add $1,000 USDG from Hedge:
      </P>
      <Code title="payout">{`pot  = poolA + poolB + overlay

payout = (stake × pot) / winning side

void     -> refund the stake
wrong    -> 0
unresolved or already claimed -> 0`}</Code>
      <P>
        Money is <C>USDG</C> with 6 decimals. Integer division truncates.
        Dust stays in the contract. The on-chain claim is the two pots.
        The overlay is paid from escrow. Full derivation, including the
        displayed blend: <A to="/pool/mathematics">The mathematics</A>.
      </P>

      <H3>Worked example</H3>
      <P>
        The pots are $60 on A and $40 on B. You put $10 on B. After the
        ticket lands:
      </P>
      <Table head={["Quantity", "Working", "Result"]}>
        <Tr>
          <Td>Pot</Td>
          <Td>
            <C>60 + 50</C>
          </Td>
          <Td>$110</Td>
        </Tr>
        <Tr>
          <Td>Winning side, if B</Td>
          <Td>
            <C>50</C>
          </Td>
          <Td>$50</Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Your payout if B hits</strong>
          </Td>
          <Td>
            <C>10 × 110 / 50</C>
          </Td>
          <Td>
            <strong className="text-white">$22.00</strong>
          </Td>
        </Tr>
        <Tr>
          <Td>Your payout if A hits</Td>
          <Td>—</Td>
          <Td>$0</Td>
        </Tr>
      </Table>
      <P>
        That $22 is your $10 back plus $12 from the losing side. The
        multiple is <C>pot / side</C>, here 2.2x, and it moves every time
        someone else stakes. The number on the card at confirm is an
        estimate against the pots at that moment.
      </P>

      <H2>Tape odds are not the payout</H2>
      <PoolTapeFigure />
      <P>
        The board quotes a live line so the card is readable when the pots
        are still thin:
      </P>
      <Ul>
        <Li>
          <strong className="text-white">Strike.</strong> Compare live
          market cap (or price) to the strike. Implied Yes is{" "}
          <C>live² / (live² + strike²)</C>.
        </Li>
        <Li>
          <strong className="text-white">Community race.</strong> Live
          mcap share, <C>M_A / (M_A + M_B)</C>.
        </Li>
        <Li>
          <strong className="text-white">PvP.</strong> Score each name as
          live cap over open cap, then take that share of the two scores.
        </Li>
      </Ul>
      <P>
        As tickets land, the card mixes tape with pot share. Weight is{" "}
        <C>depth / (depth + 100)</C>. An empty book follows the tape. A
        filled book follows the pots. Settlement still ignores the
        displayed number. A 70% line with $90 / $10 in the pots still pays
        as $90 / $10, plus overlay if the race has one.
      </P>
      <Note kind="warning" title="Do not size from the tape alone">
        Display odds can look like a CLOB. They are not. Your payout is
        whoever else put USDG on the other side, after lock.
      </Note>

      <H2>Desk limits</H2>
      <Table head={["Limit", "Default"]}>
        <Tr>
          <Td>Min / max stake</Td>
          <Td>$1 / $25</Td>
        </Tr>
        <Tr>
          <Td>Tickets per wallet per market</Td>
          <Td>One. You cannot add.</Td>
        </Tr>
        <Tr>
          <Td>Open desk float</Td>
          <Td>$1,000 across every unresolved pool market</Td>
        </Tr>
        <Tr>
          <Td>House seed</Td>
          <Td>$0</Td>
        </Tr>
      </Table>
      <P>
        The contract checks the range and the desk cap <em>before</em> it
        pulls USDG, so an oversize send does not land and then bounce. The
        app also blocks a stake outside $1–$25 on the button.
      </P>
      <P>
        $1,000 is a risk cap on open tickets, not TVL you can earn on. When a
        market resolves, that pot leaves <C>deskOpen</C> and the room
        frees up. The live on-chain cap is <C>deskCap()</C>, now $1,000
        after admin <C>setLimits</C>.
      </P>

      <H2>Tickets live on chain</H2>
      <P>
        <C>HedgePool</C> on Robinhood Chain is the money. The app lists the
        card, shows the tape, and sponsors the call. The ticket is{" "}
        <C>stake(id, side, amount)</C> against{" "}
        <C>id = keccak256(slug)</C>.
      </P>
      <P>
        The live pool with refund is{" "}
        <C>0x40863A67e096B55C5847FA738086Eae67c18f39f</C>. The first live
        pool, with no refund, is{" "}
        <C>0xf0D392e67904acE892A6024E0501AbfAD67A1c8c</C>. Tickets there
        wait until expiry, then <C>claim</C>. How to pull a test stake
        back: <A to="/pool/money">Money and payouts</A>, first live pool.
      </P>
      <Ul>
        <Li>
          <C>listMarket</C> opens the window. That happens at first stake,
          not when you load the board.
        </Li>
        <Li>
          <C>resolve</C> after expiry sets A, B, or void. It cannot pick
          an empty winning side.
        </Li>
        <Li>
          <C>claim</C> is a pull. Winners take{" "}
          <C>(stake × pot) / side</C>. A void returns the stake.
          Redeem is hidden until <C>previewPayout</C> is above zero.
        </Li>
      </Ul>
      <P>
        Older tickets that went to the previous escrow wallet still pay
        from that path. New stakes go to the contract once the pool
        address is set. Who holds the USDG, who claims, and who pays
        the overlay: <A to="/pool/money">Money and payouts</A>.
      </P>

      <H2>What this is not</H2>
      <Ul>
        <Li>
          Not 1x shares on a venue book. Refund the stake before lock. After lock there is nothing to sell.
        </Li>
        <Li>
          Not 2x–4x. No margin, no liquidation, no carry. You can lose the
          stake and no more.
        </Li>
        <Li>
          Not an AMM. Adding size does not reprice a curve. It only changes
          the two pots.
        </Li>
      </Ul>
      <P>
        Spot and leverage still settle in USDG too. How those tickets
        work: <A to="/concepts/markets">Markets and prices</A> and{" "}
        <A to="/leverage/overview">Leverage markets</A>. Every pool
        formula: <A to="/pool/mathematics">The mathematics</A>.
      </P>
      <Cards>
        <Card to="/pool/mathematics" title="The mathematics">
          Tape, blend, pots, overlay, strikes, settlement, caps.
        </Card>
        <Card to="/pool/money" title="Money and payouts">
          Where USDG sits, who claims, who pays.
        </Card>
        <Card to="/pool/claim" title="Refund, redeem, and claim">
          Refund, Claim stake, Redeem. Why a $0 mark is not a failed ticket.
        </Card>
      </Cards>
    </>
  );
}

import {
  A,
  C,
  Card,
  Cards,
  Code,
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
} from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "The mathematics",
    description:
      "Every formula behind the native pool: tape odds, displayed blend, parimutuel payout, Hedge overlay, strikes, settlement, and desk caps.",
  });
}

export default function PoolMathematics() {
  return (
    <>
      <PageTitle
        eyebrow="Pool"
        title="The mathematics"
        intro="The formulas the desk actually runs. The chain holds USDG. The tape is display. Settlement is a reporter push after expiry. Integer math truncates."
      />

      <P>
        This page is the pool counterpart to{" "}
        <A to="/leverage/mathematics">leverage mathematics</A>. Trader-facing
        overview: <A to="/pool">Pool and liquidity</A>.
      </P>

      <H2>Units and notation</H2>
      <Table head={["Quantity", "Representation"]}>
        <Tr>
          <Td>Money</Td>
          <Td>
            <C>USDG</C>, 6 decimals. <C>$1.00</C> is <C>1e6</C>.
          </Td>
        </Tr>
        <Tr>
          <Td>Odds</Td>
          <Td>
            Probabilities in <C>[0, 1]</C>. The board prints them as percent.
          </Td>
        </Tr>
        <Tr>
          <Td>Market id</Td>
          <Td>
            <C>id = keccak256(slug)</C>. One slug, one pot pair.
          </Td>
        </Tr>
      </Table>
      <P>
        Write <C>A</C> and <C>B</C> for the two pots in USDG after your ticket
        would land. Write <C>s</C> for your stake. Write <C>H</C> for the Hedge
        overlay on featured long races, else <C>0</C>.
      </P>

      <H2>Three kinds of card</H2>
      <Table head={["Kind", "Question", "Tape prior", "Who wins at expiry"]}>
        <Tr>
          <Td>Strike</Td>
          <Td>Will this name sit above a strike.</Td>
          <Td>
            Live vs strike, squared.
          </Td>
          <Td>
            Yes if live is at or above the strike. No if under.
          </Td>
        </Tr>
        <Tr>
          <Td>PvP</Td>
          <Td>Which name printed more from the open snapshot.</Td>
          <Td>
            Return from open, then share of the two scores.
          </Td>
          <Td>
            Higher return from open. A tie voids.
          </Td>
        </Tr>
        <Tr>
          <Td>Community race</Td>
          <Td>
            Which name is closer to $1.00b. Framed as first to $1.00b.
          </Td>
          <Td>
            Live mcap share.
          </Td>
          <Td>
            Higher live mcap at expiry. A tie voids.
          </Td>
        </Tr>
      </Table>
      <Note>
        The race copy says &ldquo;hits $1.00b first.&rdquo; There is no
        first-to-cross clock. At expiry the reporter reads both live market
        caps. The larger cap wins. $1.00b is the narrative target, not a
        timestamped print.
      </Note>

      <H2>Tape implied chance</H2>
      <P>
        Display starts from the Dexscreener or CoinGecko tape, not from empty
        pots. Call this <C>p_tape</C>, the chance of side A. Side B is{" "}
        <C>1 - p_tape</C>. If the tape is missing, the card falls back to pot
        share.
      </P>

      <H3>Strike</H3>
      <P>
        Let <C>L</C> be live market cap (or price) and <C>K</C> the strike.
        Implied Yes is the squared-distance share:
      </P>
      <Code title="tapeImpliedP, strike">{`p_yes = L² / (L² + K²)

missing L or K  ->  pot share`}</Code>
      <P>
        Squaring pulls the line toward 50% when live is near the strike, and
        toward a sure Yes or No as live runs away. A name at the strike is 50%.
        A name at twice the strike is 80% Yes. A name at half the strike is 20%
        Yes.
      </P>
      <Table head={["Live vs strike", "Working", "Yes"]}>
        <Tr>
          <Td>
            <C>L = K</C>
          </Td>
          <Td>
            <C>K² / (K² + K²)</C>
          </Td>
          <Td>50%</Td>
        </Tr>
        <Tr>
          <Td>
            <C>L = 2K</C>
          </Td>
          <Td>
            <C>4 / (4 + 1)</C>
          </Td>
          <Td>80%</Td>
        </Tr>
        <Tr>
          <Td>
            <C>L = K / 2</C>
          </Td>
          <Td>
            <C>1 / (1 + 4)</C>
          </Td>
          <Td>20%</Td>
        </Tr>
      </Table>
      <P>
        Settlement does not use that curve. Yes wins if <C>L ≥ K</C>. No
        wins if <C>L &lt; K</C>.
      </P>

      <H3>How the strike is picked</H3>
      <P>
        A new strike window snaps a slightly out-of-the-money round number
        from live cap:
      </P>
      <Code title="niceStrike">{`mag  = 10 ^ floor(log10(L))
step = mag >= 1e8 ? mag / 2 : mag / 5

K = ceil((L × 1.02) / step) × step`}</Code>
      <P>
        The 2% bump plus rounding puts Yes a little above spot so the card is
        not a coin flip the second it opens.
      </P>

      <H3>Community race</H3>
      <P>
        Let <C>M_A</C> and <C>M_B</C> be live market caps.
      </P>
      <Code title="tapeImpliedP, race">{`p_A = M_A / (M_A + M_B)

missing either cap  ->  pot share`}</Code>
      <P>
        A $120m name vs a $180m name is 40% / 60%. The layered chart on the
        race page is those two caps over time, not this share. The share is
        what the chance numbers use.
      </P>
      <P>
        At expiry, <C>M_A &gt; M_B</C> pays A. <C>M_B &gt; M_A</C> pays B.
        Equal caps void.
      </P>

      <H3>Meme PvP</H3>
      <P>
        Each name is scored as live cap over the open snapshot. Implied A is
        that score&apos;s share:
      </P>
      <Code title="tapeImpliedP, PvP">{`score_A = M_A / open_A
score_B = M_B / open_B

p_A = score_A / (score_A + score_B)`}</Code>
      <P>
        If either open print is missing, the card falls back to live mcap
        share, then to pot share.
      </P>
      <P>
        Settlement uses return from open, not the score share:
      </P>
      <Code title="resolveNativeOutcome, PvP">{`ret_A = (M_A - open_A) / open_A
ret_B = (M_B - open_B) / open_B

A wins if ret_A > ret_B
B wins if ret_B > ret_A
equal returns void`}</Code>
      <P>
        Score share and return ranking agree whenever both opens are
        positive, because <C>score = 1 + ret</C>. A 10% print beats a 5%
        print. A 5% dump loses to a 2% dump.
      </P>

      <H2>Displayed chance blends tape and pots</H2>
      <P>
        The number on the card is not tape alone and not pot share alone.
        Tape is the prior. USDG in the two pots pulls it as tickets land:
      </P>
      <Code title="displayImpliedP">{`depth  = poolA + poolB
book   = poolA / (poolA + poolB)
w      = depth / (depth + 100)

p_display = (1 - w) × p_tape + w × book

empty book  ->  p_tape`}</Code>
      <P>
        <C>100</C> is <C>NATIVE_POOL_BLEND</C>. At $0 in the pots the card is
        all tape. At $100 of combined tickets, tape and pots weigh equally.
        At $900, the pots are 90% of the line.
      </P>
      <Table head={["Depth", "w", "Meaning"]}>
        <Tr>
          <Td>$0</Td>
          <Td>0</Td>
          <Td>Pure tape.</Td>
        </Tr>
        <Tr>
          <Td>$100</Td>
          <Td>50%</Td>
          <Td>Half tape, half pots.</Td>
        </Tr>
        <Tr>
          <Td>$400</Td>
          <Td>80%</Td>
          <Td>Pots dominate.</Td>
        </Tr>
      </Table>
      <Note kind="warning" title="Do not size from the displayed line">
        A 70% displayed chance with $90 / $10 in the pots still pays as
        $90 / $10, plus any Hedge overlay. The blend is so an empty book is
        readable. Settlement never uses <C>p_display</C>.
      </Note>

      <H2>Parimutuel payout</H2>
      <P>
        Winners split the whole pot in proportion to their stake. Hedge overlay
        <C>H</C> is added to the winning pot on featured long races only
        (ZCAT vs ANSEM, and ANSEM vs the top Robinhood names, on 7d / 14d /
        30d).
      </P>
      <Code title="payoutIfWin">{`pot    = A + B + H
side   = winning pot (A or B, without H)

payout = (s × (side + other + H)) / side
       = s × pot / side

multiple = pot / side`}</Code>
      <P>
        Split another way, so the card can show where the dollars come from:
      </P>
      <Code title="winBreakdown">{`returned    = s
fromOthers  = (s × other) / side
fromHedge   = (s × H) / side

payout = returned + fromOthers + fromHedge`}</Code>
      <Ul>
        <Li>
          Wrong side pays 0. You lose the stake. Nothing else.
        </Li>
        <Li>
          Void refunds the stake.
        </Li>
        <Li>
          Unresolved or already claimed is 0 on-chain.
        </Li>
      </Ul>

      <H3>On-chain vs overlay</H3>
      <P>
        <C>HedgePool.previewPayout</C> is pure parimutuel. It does not know{" "}
        <C>H</C>:
      </P>
      <Code title="HedgePool.previewPayout">{`pot  = poolA + poolB
side = winning pot

paid = (stake × pot) / side

void  ->  stake
wrong ->  0`}</Code>
      <P>
        The $1,000 overlay is paid from the escrow path after settle, split
        the same way as <C>fromHedge</C>. Integer division truncates. Dust
        stays in the contract. Money is 6-decimal USDG. Who holds it and
        who sends it: <A to="/pool/money">Money and payouts</A>.
      </P>

      <H3>Worked example, no overlay</H3>
      <P>
        Pots are $60 on A and $40 on B. You put $10 on B. After the ticket
        lands, B is $50 and the pot is $110.
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
          <Td>If B wins</Td>
          <Td>
            <C>10 × 110 / 50</C>
          </Td>
          <Td>
            <strong className="text-white">$22.00</strong>
          </Td>
        </Tr>
        <Tr>
          <Td>Returned</Td>
          <Td>
            <C>10</C>
          </Td>
          <Td>$10</Td>
        </Tr>
        <Tr>
          <Td>From A tickets</Td>
          <Td>
            <C>10 × 60 / 50</C>
          </Td>
          <Td>$12</Td>
        </Tr>
        <Tr>
          <Td>If A wins</Td>
          <Td>—</Td>
          <Td>$0</Td>
        </Tr>
      </Table>
      <P>
        Multiple is <C>110 / 50 = 2.2x</C>. It moves every time someone else
        stakes. The number on the card at confirm is an estimate against the
        pots at that moment, including your own ticket.
      </P>

      <H3>Worked example, featured overlay</H3>
      <P>
        Featured long race. Hedge overlay <C>H = $1,000</C>. You put $25 on
        ZCAT. ANSEM already has $75. After you land, ZCAT is $25.
      </P>
      <Table head={["Quantity", "Working", "Result"]}>
        <Tr>
          <Td>Pot if ZCAT wins</Td>
          <Td>
            <C>25 + 75 + 1000</C>
          </Td>
          <Td>$1,100</Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Your payout if ZCAT wins</strong>
          </Td>
          <Td>
            <C>25 × 1100 / 25</C>
          </Td>
          <Td>
            <strong className="text-white">$1,100.00</strong>
          </Td>
        </Tr>
        <Tr>
          <Td>Returned</Td>
          <Td>
            <C>25</C>
          </Td>
          <Td>$25</Td>
        </Tr>
        <Tr>
          <Td>From ANSEM tickets</Td>
          <Td>
            <C>25 × 75 / 25</C>
          </Td>
          <Td>$75</Td>
        </Tr>
        <Tr>
          <Td>From Hedge</Td>
          <Td>
            <C>25 × 1000 / 25</C>
          </Td>
          <Td>$1,000</Td>
        </Tr>
        <Tr>
          <Td>If you are not alone on ZCAT</Td>
          <Td>split <C>H</C> and the ANSEM pot by your share of ZCAT</Td>
          <Td>less than $1,100</Td>
        </Tr>
      </Table>
      <P>
        The card can show that $1,025 while the window is open. If ANSEM is
        still empty at expiry, the reporter cannot pick ZCAT. The market
        voids, <C>claim</C> returns the $25, and the overlay does not pay.
        Hedge does not cover an empty book. Path of the dollars:{" "}
        <A to="/pool/money">Money and payouts</A>.
      </P>

      <H2>Empty winning side</H2>
      <Code title="HedgePool.resolve">{`if outcome == A and poolA == 0  ->  EmptyWinningSide
if outcome == B and poolB == 0  ->  EmptyWinningSide`}</Code>
      <P>
        Liquidity has to exist on the winning side for a payout to run. If
        the tape says A won and nobody staked A, the reporter cannot resolve
        A. The market voids and every ticket is refunded. That is why the
        first tickets <em>are</em> the book: there is no house seed (
        <C>NATIVE_SEED = 0</C>).
      </P>

      <H2>Windows and lock</H2>
      <P>
        Windows roll on UTC. Lock is a slice of the window, not a flat hour.
        After lock, no new tickets. After expiry, the reporter pushes the
        outcome and winners claim.
      </P>
      <Table head={["Window", "Length", "Lock before expiry"]}>
        <Tr>
          <Td>15m</Td>
          <Td>15 minutes</Td>
          <Td>1m</Td>
        </Tr>
        <Tr>
          <Td>1h</Td>
          <Td>1 hour</Td>
          <Td>5m</Td>
        </Tr>
        <Tr>
          <Td>4h</Td>
          <Td>4 hours</Td>
          <Td>15m</Td>
        </Tr>
        <Tr>
          <Td>6h</Td>
          <Td>6 hours</Td>
          <Td>20m</Td>
        </Tr>
        <Tr>
          <Td>12h</Td>
          <Td>12 hours</Td>
          <Td>30m</Td>
        </Tr>
        <Tr>
          <Td>24h</Td>
          <Td>24 hours</Td>
          <Td>1h</Td>
        </Tr>
        <Tr>
          <Td>7d</Td>
          <Td>7 days</Td>
          <Td>12h</Td>
        </Tr>
        <Tr>
          <Td>14d</Td>
          <Td>14 days</Td>
          <Td>24h</Td>
        </Tr>
        <Tr>
          <Td>30d</Td>
          <Td>30 days</Td>
          <Td>48h</Td>
        </Tr>
      </Table>
      <P>
        Short community races use 4h to 24h. Featured long races use 7d / 14d /
        30d. Each card has its own slug, so a 7d ZCAT vs ANSEM and a 30d
        ZCAT vs ANSEM are different markets and different pots.
      </P>
      <Code title="nativeWindowSlug">{`start   = floor(now / windowMs) × windowMs
expiry  = start + windowMs
lock    = expiry − lockMs

slug = base + "-" + timeframe + "-" + floor(expiry / 1000)`}</Code>
      <P>
        If the current window is already locked, the board also lists the
        next window so tickets can still land.
      </P>

      <H2>Desk limits</H2>
      <Table head={["Limit", "App", "Contract default"]}>
        <Tr>
          <Td>Min / max stake</Td>
          <Td>$1 / $25</Td>
          <Td>$1 / $25</Td>
        </Tr>
        <Tr>
          <Td>Tickets per wallet per market</Td>
          <Td>One. You cannot add.</Td>
          <Td>One</Td>
        </Tr>
        <Tr>
          <Td>Open desk float</Td>
          <Td>$1,000 across unresolved pool markets</Td>
          <Td>$1,000. Admin can change it with <C>setLimits</C></Td>
        </Tr>
        <Tr>
          <Td>House seed</Td>
          <Td>$0</Td>
          <Td>$0</Td>
        </Tr>
        <Tr>
          <Td>Featured overlay</Td>
          <Td>$1,000 on long races</Td>
          <Td>Not in <C>HedgePool</C></Td>
        </Tr>
      </Table>
      <P>
        The contract checks the range and <C>deskOpen + amount &gt; deskCap</C>{" "}
        before it pulls USDG. The app also blocks a stake outside $1 to $25 on
        the button. <C>deskOpen</C> falls when a market resolves, and the room
        frees up.
      </P>
      <Note>
        A ticket the app would allow can still revert <C>DeskCapReached</C>{" "}
        if <C>deskCap()</C> on chain is below the app copy. The live cap is
        whatever <C>deskCap()</C> returns, not the number on the card.
      </Note>

      <H2>Phase</H2>
      <Code title="nativePhase">{`resolved or void stored  ->  resolved / void
now >= expiry            ->  locked
now >= lock              ->  locked
else                     ->  open`}</Code>
      <P>
        Open takes tickets. Locked does not. Resolved has a winner. Void
        refunds.
      </P>

      <H2>Where rounding falls</H2>
      <Ul>
        <Li>
          On-chain payout truncates down. Dust stays in <C>HedgePool</C>.
        </Li>
        <Li>
          App stakes round to cents: <C>round(n × 100) / 100</C>.
        </Li>
        <Li>
          Overlay splits use the same <C>(stake × H) / side</C> share. The
          last winner in a batch can be paid the remainder so the overlay
          sums.
        </Li>
        <Li>
          Displayed percent is UI rounding. The blend is computed in
          floating point. Settlement ignores it.
        </Li>
      </Ul>

      <H2>What this is not</H2>
      <Ul>
        <Li>
          Not a CLOB. Refund the stake before lock. After lock there is nothing to sell.
        </Li>
        <Li>
          Not 2x to 4x. No margin, no liquidation, no carry. You can lose the
          stake and no more.
        </Li>
        <Li>
          Not an AMM. Adding size does not reprice a curve. It only changes
          the two pots, which changes the multiple and the blend weight.
        </Li>
      </Ul>
      <P>
        How 2x to 4x tickets are sized:{" "}
        <A to="/leverage/mathematics">The mathematics</A> under leverage.
        Path of the USDG: <A to="/pool/money">Money and payouts</A>.
      </P>
      <Cards>
        <Card to="/pool/money" title="Money and payouts">
          Where USDG sits, who claims, who pays the overlay.
        </Card>
        <Card to="/pool" title="Pool and liquidity">
          What the desk is, the three card kinds, and the board.
        </Card>
      </Cards>
    </>
  );
}

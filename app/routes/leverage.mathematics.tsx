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
      "Every formula behind leveraged positions and the vault, as implemented on-chain: sizing, entry price, shares, carry, liquidation, and share accounting.",
  });
}

export default function Mathematics() {
  return (
    <>
      <PageTitle
        eyebrow="Leverage"
        title="The mathematics"
        intro="The formulas the contracts run. Integer math truncates. The chain is the source of truth; the trade panel estimate can differ by a unit."
      />

      <H2>Units and notation</H2>
      <Table head={["Quantity", "Representation"]}>
        <Tr>
          <Td>Money</Td>
          <Td>
            <C>USDG</C>, 6 decimals. <C>$1.00</C> is <C>1e6</C>.
          </Td>
        </Tr>
        <Tr>
          <Td>Prices</Td>
          <Td>
            18 decimals, denoted <C>ONE = 1e18</C>. A $0.50 outcome is{" "}
            <C>0.5e18</C>.
          </Td>
        </Tr>
        <Tr>
          <Td>Rates and fractions</Td>
          <Td>
            Basis points, <C>BPS = 10_000</C>. So <C>150</C> is 1.5% and{" "}
            <C>20_000</C> is 2.0x.
          </Td>
        </Tr>
      </Table>
      <Note>
        Every cap in the engine is written as a 6-decimal literal, so the vault
        refuses a collateral token that does not report 6 decimals. An 18-decimal
        token would silently inflate every limit by a factor of 1e12 rather than
        fail visibly.
      </Note>

      <H2>Opening a position</H2>
      <P>
        Given a margin <C>m</C>, a leverage <C>L</C> in basis points, a spot price{" "}
        <C>s</C>, and a direction:
      </P>

      <H3>Position size</H3>
      <Code>{`size = (m × L) / BPS`}</Code>

      <H3>Entry price</H3>
      <P>
        The spread always moves against the trader, and the vault keeps the
        difference.
      </P>
      <Code>{`long   entry = (s × (BPS + spreadBps)) / BPS
short  entry = (s × (BPS − spreadBps)) / BPS

clamped into (0, ONE): entry of 0 becomes 1, entry >= ONE becomes ONE − 1`}</Code>

      <H3>Fee and net margin</H3>
      <Code>{`fee       = (size × openFeeBps) / BPS
netMargin = m − fee

opening reverts if m <= fee`}</Code>
      <P>
        Note the base: the fee is a percentage of <em>size</em>, not of margin. At
        2x a 1.5% fee therefore consumes 3% of the margin posted, and at 5x it
        consumes 7.5%.
      </P>

      <H3>Shares</H3>
      <Code>{`shares = (size × ONE) / entry`}</Code>
      <P>
        These are synthetic. They are the unit the position is marked in, not
        shares held at the venue.
      </P>

      <H3>The vault reservation</H3>
      <P>
        The vault locks the worst it could ever owe on the position, which is not
        the borrowed amount:
      </P>
      <Code>{`long   reserve = shares > size ? shares − size : 0
short  reserve = size`}</Code>
      <P>
        The reasoning is the payoff structure. A long is worth <C>shares</C> if the
        price reaches $1.00, so the profit owed is <C>shares − size</C>. A short
        gains the entire position size if the price reaches zero. Reserving only
        the leverage top-up would let a few winners leave the vault unable to pay.
      </P>

      <H2>Marking a position</H2>
      <Code>{`value = (shares × s) / ONE

long   pnl = value − size
short  pnl = size − value`}</Code>
      <P>
        Profit and loss is signed and computed against size, which is why a 2x
        position moves twice as fast as the margin would suggest.
      </P>

      <H2>Carry on borrowed capital</H2>
      <Code>{`borrowed = size > m ? size − m : 0
owed     = (borrowed × borrowRateBps × elapsed) / (BPS × 3600)

capped:  owed > netMargin  ->  netMargin`}</Code>
      <Ul>
        <Li>
          <C>elapsed</C> is in seconds since the position opened, so carry accrues
          continuously rather than in hourly steps.
        </Li>
        <Li>
          The base is <C>size − margin</C>, so a 1x position borrows nothing and
          pays nothing.
        </Li>
        <Li>
          <C>borrowRateBps</C> is stored per position at open, so a later change to
          the global rate does not apply to it.
        </Li>
        <Li>
          The cap matters: once carry would exceed the margin at risk, the position
          is already liquidatable and the vault takes the whole margin anyway.
        </Li>
      </Ul>

      <H2>Liquidation</H2>

      <H3>The condition</H3>
      <P>
        Not a comparison against a stored price. The test is whether losses plus
        carry have eaten the permitted share of net margin:
      </P>
      <Code>{`loss    = pnl < 0 ? −pnl : 0
charged = loss + owed

liquidatable  when  charged >= (netMargin × liquidationThresholdBps) / BPS`}</Code>

      <H3>The liquidation price</H3>
      <P>
        Invert the profit and loss expression for the price at which the loss
        equals a given budget:
      </P>
      <Code>{`maxLoss = (netMargin × liquidationThresholdBps) / BPS

long    loss = size × (1 − P/entry)   ->   P = entry × (size − maxLoss) / size
short   loss = size × (P/entry − 1)   ->   P = entry × (size + maxLoss) / size

long, if maxLoss >= size            ->   P = 0
short, if P >= ONE                  ->   P = ONE − 1`}</Code>

      <H3>Two liquidation prices, and which one to trust</H3>
      <P>
        The figure stored at open never moves. The live figure subtracts accrued
        carry from the loss budget first, which pulls it closer as the position
        ages:
      </P>
      <Code>{`budget  = (netMargin × liquidationThresholdBps) / BPS
maxLoss = budget > owed ? budget − owed : 0

then the same inversion, with this smaller maxLoss`}</Code>
      <Note kind="warning">
        The live figure is the one a trader should be shown. The stored one
        understates the risk on any position that has been open long enough to
        accrue meaningful carry.
      </Note>

      <H2>Closing</H2>
      <P>
        A partial close takes a fraction <C>f</C> in basis points and scales every
        component by it:
      </P>
      <Code>{`closedSize   = (size × f) / BPS
closedShares = (shares × f) / BPS
closedMargin = (margin × f) / BPS
closedNet    = (netMargin × f) / BPS
closedReserve= (reserved × f) / BPS
closedOwed   = (accruedFunding × f) / BPS

exit fee     = (closedSize × closeFeeBps) / BPS`}</Code>
      <P>
        Because both size and margin shrink by the same fraction, the remainder
        accrues carry from the original timestamp on a smaller base, and the two
        pieces sum to what the whole position would have owed. Nothing is double
        charged and nothing is forgiven. Entry price and liquidation price are
        unchanged, so the remainder is the same trade in miniature.
      </P>
      <P>
        Passing the full <C>BPS</C> closes everything. Anything less must leave a
        margin that still clears the minimum.
      </P>

      <H3>The settlement order</H3>
      <P>
        What the trader receives is computed by working down from the net margin
        being closed. The order is fixed, and each deduction is capped by what is
        still left, which is how a wiped-out position settles without ever going
        negative:
      </P>
      <Code>{`remaining = closedNet

profit    remaining += pnl              (paid out of the vault)
loss      loss = min(−pnl, remaining)   (absorbed by the vault)
          remaining −= loss

carry     owed = min(owed, remaining)
          remaining −= owed

exit fee  fee = min(fee, remaining)
          remaining −= fee

payout    = remaining`}</Code>
      <Ul>
        <Li>
          Profit is added before anything is deducted, so a winning position pays
          its carry and exit fee out of the enlarged balance.
        </Li>
        <Li>
          Each of the three deductions is capped at what remains. A position whose
          loss consumed the whole margin therefore pays no carry and no exit fee,
          not because they are waived, but because there is nothing to take.
        </Li>
        <Li>
          The floor is zero. A trader can lose the entire margin and no more, and
          the vault cannot claim beyond it.
        </Li>
      </Ul>
      <P>
        Losses and liquidated margin are credited to the vault by a different path
        than fees and carry, which is why the two have separate splits.
      </P>

      <H3>Liquidation and the emergency exit</H3>
      <Code>{`liquidated       absorbed = netMargin      (trader receives nothing)
emergency close  refund   = netMargin      (trader receives all of it)`}</Code>
      <P>
        The symmetry is the point. Both bypass the profit and loss calculation
        entirely. One because the margin is spent, the other because no trustworthy
        price exists to settle against. In both cases the entry fee stays with the
        vault, having been collected at open, and no exit fee is charged.
      </P>

      <H2>Worked example</H2>
      <P>
        A 2x long on a $0.50 outcome with $2.50 of margin, at the default
        parameters:
      </P>
      <Table head={["Quantity", "Working", "Result"]}>
        <Tr>
          <Td>Size</Td>
          <Td>
            <C>2.50 × 20000 / 10000</C>
          </Td>
          <Td>$5.00</Td>
        </Tr>
        <Tr>
          <Td>Entry price</Td>
          <Td>
            <C>0.50 × 10100 / 10000</C>
          </Td>
          <Td>$0.505</Td>
        </Tr>
        <Tr>
          <Td>Entry fee</Td>
          <Td>
            <C>5.00 × 150 / 10000</C>
          </Td>
          <Td>$0.075</Td>
        </Tr>
        <Tr>
          <Td>Net margin</Td>
          <Td>
            <C>2.50 − 0.075</C>
          </Td>
          <Td>$2.425</Td>
        </Tr>
        <Tr>
          <Td>Shares</Td>
          <Td>
            <C>5.00 / 0.505</C>
          </Td>
          <Td>9.900990</Td>
        </Tr>
        <Tr>
          <Td>Vault reservation</Td>
          <Td>
            <C>9.900990 − 5.00</C>
          </Td>
          <Td>$4.900990</Td>
        </Tr>
        <Tr>
          <Td>Max loss</Td>
          <Td>
            <C>2.425 × 0.90</C>
          </Td>
          <Td>$2.1825</Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Liquidation price</strong>
          </Td>
          <Td>
            <C>0.505 × (5.00 − 2.1825) / 5.00</C>
          </Td>
          <Td>
            <strong className="text-white">$0.284568</strong>
          </Td>
        </Tr>
      </Table>
      <P>
        Worth reading the last row carefully: liquidation is a 43% fall from the
        $0.50 spot price, not the 20-odd percent that &ldquo;2x with a 90%
        threshold&rdquo; might suggest at a glance. The threshold applies to net
        margin, and the loss is measured against size.
      </P>
      <P>
        Note also that the vault reserves $4.90 against a position the trader
        entered with $2.50, nearly twice the borrowed amount. That is the cost of
        reserving the true worst case, and it is why a $100 vault at the 30%
        exposure cap backs about six concurrent $5 positions rather than twelve.
      </P>

      <H2>Capacity</H2>
      <P>
        Two independent ceilings, and the binding one is whichever is lower:
      </P>
      <Code>{`used        = lockedAssets
byExposure  = (totalAssets × maxPoolExposureBps) / BPS
byLiquidity = used + freeAssets

ceiling   = min(byExposure, byLiquidity)
available = ceiling > used ? ceiling − used : 0`}</Code>
      <P>
        The exposure ceiling is the risk limit, a deliberate cap on how much of
        the vault may be committed. The liquidity ceiling is physical: capital that
        is not there cannot be reserved regardless of what the risk limit permits.
      </P>
      <P>
        A position is rejected if its reservation exceeds what remains available,
        and the check runs before any transfer, so hitting a full pool costs the
        trader nothing but gas and returns a distinguishable error rather than a
        generic failure.
      </P>

      <H2>Available leverage</H2>
      <P>
        Read from the tier schedule against live vault assets, then capped:
      </P>
      <Code>{`walk the tiers while totalAssets >= tier.minTvl,
taking the last matching tier.maxLeverageBps

result = min(tierLeverage, maxLeverageBps)

default schedule
  $0       -> 20_000   (2.0x)
  $1,000   -> 30_000   (3.0x)
  $5,000   -> 40_000   (4.0x)
  $20,000  -> 50_000   (5.0x)`}</Code>
      <P>
        A replacement schedule must start at zero assets, ascend, and contain no
        row above the ceiling. Lowering the ceiling caps the result immediately,
        whatever the schedule says, which is the emergency brake.
      </P>
      <Note kind="warning" title="A silent interaction">
        The maximum position size bounds the whole position, so it caps leverage
        too. With a $5 maximum margin and a $10 maximum size, nobody posting the
        full margin can exceed 2x. The upper tiers stay advertised while every
        attempt to use them reverts. Keeping maximum size at or above{" "}
        <C>maxMargin × maxLeverage</C> avoids this; the $25 default does.
      </Note>

      <H2>Vault share accounting</H2>
      <Code>{`totalAssets = seniorAssets + juniorAssets
freeAssets  = totalAssets > lockedAssets ? totalAssets − lockedAssets : 0

deposit     shares = totalShares == 0 || seniorAssets == 0
                       ? assets
                       : (assets × totalShares) / seniorAssets

withdraw    assets = (shares × seniorAssets) / totalShares
                     reverts if assets > freeAssets

holding     assetsOf(lp) = (sharesOf[lp] × seniorAssets) / totalShares`}</Code>

      <H3>How income is split</H3>
      <Code>{`fees                toSenior = (amount × feeSeniorBps) / BPS
                    toJunior = amount − toSenior

absorbed margin     toSenior = (amount × liquidationSeniorBps) / BPS
                    toJunior = amount − toSenior

both default to 7_000, i.e. 70% senior`}</Code>
      <P>
        Both add to the tranche totals without minting shares, which is exactly why
        the share price rises rather than balances changing.
      </P>

      <H3>How losses are paid</H3>
      <Code>{`fromJunior = amount > juniorAssets ? juniorAssets : amount
fromSenior = amount − fromJunior

reverts if fromSenior > seniorAssets`}</Code>
      <P>
        This is the first-loss rule in three lines: junior is drained to zero
        before senior is touched at all. The revert should be unreachable while the
        exposure cap holds, and exists because a silent underflow here would
        corrupt every depositor&rsquo;s share price.
      </P>

      <H2>Price feed constraints</H2>
      <Table head={["Rule", "Default", "Effect"]}>
        <Tr>
          <Td>Maximum price age</Td>
          <Td>5 minutes</Td>
          <Td>Older than this is treated as no price; opening halts.</Td>
        </Tr>
        <Tr>
          <Td>Maximum deviation per update</Td>
          <Td>20%</Td>
          <Td>
            A larger gap is walked in over several updates rather than applied at
            once.
          </Td>
        </Tr>
        <Tr>
          <Td>Converging</Td>
          <Td>n/a</Td>
          <Td>
            True while the stored price differs from the reported target. Opening
            reverts; closing and liquidation stay available.
          </Td>
        </Tr>
      </Table>
      <P>
        The clamp is computed on-chain from the true reported midpoint, so the
        contract knows the size of the gap itself. A compromised reporter cannot
        hide one by flattening it before submission.
      </P>

      <H2>Where rounding falls</H2>
      <P>
        All of the above is integer arithmetic with truncating division. The
        directions are worth knowing:
      </P>
      <Ul>
        <Li>
          <C>shares</C> truncates down, so a trader receives marginally less
          exposure than the exact quotient.
        </Li>
        <Li>
          Fees truncate down, which favours the trader by at most one unit, and is
          precisely why a minimum margin exists, since below roughly $0.67 a 1.5%
          fee truncates to zero.
        </Li>
        <Li>
          The senior share of income truncates down and the junior tranche receives
          the remainder, so the buffer collects the dust.
        </Li>
        <Li>
          Deposit shares truncate down, so a depositor never mints more claim than
          they paid for.
        </Li>
      </Ul>

      <H2>Panel vs chain</H2>
      <P>
        The browser quotes in floating point. The contract uses integer
        division. If they disagree, the contract is right. Read{" "}
        <C>quoteOpen</C> on-chain for the number you will be held to. Markets
        are keyed by the hash of the slug. No venue ids on-chain.
      </P>
      <P>
        Defaults above are deploy-time and admin-settable.{" "}
        <A to="/leverage/overview">Leverage markets</A> for traders,{" "}
        <A to="/leverage/earn">Earning as an LP</A> for the vault.
      </P>
    </>
  );
}

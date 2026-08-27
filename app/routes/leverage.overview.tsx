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
    title: "Leverage markets",
    description:
      "Synthetic leverage on binary outcomes: margin, position size, fees, carry, and the limits that apply.",
  });
}

export default function LeverageOverview() {
  return (
    <>
      <PageTitle
        eyebrow="Leverage"
        title="Leverage markets"
        intro="Leverage lets a small deposit control a larger position on a binary outcome. It is a separate on-chain system from spot trading: a set of contracts on Robinhood Chain that escrow your margin, borrow capacity from a vault of lenders, and close you out if the position runs against you far enough."
      />

      <Note kind="warning" title="Read this part first">
        Leverage is <strong className="text-white">not open to traders yet</strong>.
        The contracts are deployed, but the feature is switched off in the build,
        and the trading panel deliberately refuses to submit a leveraged ticket
        while it is — so a levered ticket can never quietly fall through to an
        unlevered spot fill. The contracts have{" "}
        <strong className="text-white">not been audited</strong>. Everything below
        describes what the code does, not a service you can currently use.
      </Note>

      <H2>How it differs from a spot trade</H2>
      <P>
        A spot trade sends your money to the market venue and you own the shares
        outright. Leverage never leaves Robinhood Chain: your <C>USDG</C> margin
        is escrowed by a contract, and the position is synthetic — priced against
        the venue&rsquo;s outcome price, which is relayed on-chain, but not backed
        by shares you hold.
      </P>
      <Ul>
        <Li>
          <strong className="text-white">You can be short.</strong> Spot only lets
          you buy a side. Here, a position can be long or short the outcome.
        </Li>
        <Li>
          <strong className="text-white">You can be closed out.</strong> A spot
          position can fall to zero but is never taken from you. A leveraged
          position is liquidated once losses reach a threshold, and the remaining
          margin goes to the vault.
        </Li>
        <Li>
          <strong className="text-white">It costs something to hold.</strong> The
          borrowed portion accrues carry by the second.
        </Li>
      </Ul>

      <H2>Sizing a position</H2>
      <P>
        You choose a margin — the amount you are risking — and a leverage
        multiple. The position size is simply the product, and it is the size,
        not the margin, that the market moves against.
      </P>
      <Code>{`size = margin × leverage

$2.50 margin at 2x  ->  $5.00 position`}</Code>
      <P>
        Leverage is stored in basis points, so <C>20_000</C> is 2.0x. It can never
        be below <C>10_000</C> (1x), and the ceiling is described below.
      </P>

      <H3>The limits</H3>
      <Table head={["Limit", "Default", "What it does"]}>
        <Tr>
          <Td>Minimum margin</Td>
          <Td>$1.00</Td>
          <Td>
            Not a UX choice. Below roughly $0.67 the entry fee rounds to zero
            under integer division, so dust positions would open almost free and
            slow the liquidation scan for everyone.
          </Td>
        </Tr>
        <Tr>
          <Td>Maximum margin</Td>
          <Td>$5.00</Td>
          <Td>Caps what any one position can risk.</Td>
        </Tr>
        <Tr>
          <Td>Maximum position size</Td>
          <Td>$25.00</Td>
          <Td>
            Bounds the whole position, so it also caps leverage in practice.
          </Td>
        </Tr>
        <Tr>
          <Td>Leverage ceiling</Td>
          <Td>5.00x</Td>
          <Td>A hard cap, above whatever the tier schedule allows.</Td>
        </Tr>
        <Tr>
          <Td>Tradeable price band</Td>
          <Td>$0.35 – $0.65</Td>
          <Td>
            Outcomes near certainty are excluded: there is no real liquidation
            risk on them, so capital would just sit.
          </Td>
        </Tr>
        <Tr>
          <Td>Maximum pool exposure</Td>
          <Td>30% of vault assets</Td>
          <Td>Limits how much of the vault can back positions at once.</Td>
        </Tr>
      </Table>

      <H2>Leverage rises with the size of the vault</H2>
      <P>
        The ceiling is not what traders get. The available multiple is read from a
        schedule against the vault&rsquo;s live total assets, every time a
        position opens:
      </P>
      <Table head={["Vault size", "Maximum leverage"]}>
        <Tr>
          <Td>Under $1,000</Td>
          <Td>2.0x</Td>
        </Tr>
        <Tr>
          <Td>$1,000 and above</Td>
          <Td>3.0x</Td>
        </Tr>
        <Tr>
          <Td>$5,000 and above</Td>
          <Td>4.0x</Td>
        </Tr>
        <Tr>
          <Td>$20,000 and above</Td>
          <Td>5.0x</Td>
        </Tr>
      </Table>
      <P>
        Nothing has to be called to move between rows. A deposit that crosses
        $1,000 raises the cap on the next transaction, and a withdrawal that drops
        below it lowers the cap again — so the pool cannot end up backing more
        leverage than it can absorb.
      </P>
      <P>
        This is the mechanism behind the claim that leverage scales with what
        providers supply. It is also the honest answer to &ldquo;how do you get to
        10x&rdquo;: the schedule and the ceiling are both parameters, so reaching
        it is a configuration change once the vault is deep enough to stand behind
        it — not new code.
      </P>
      <Note title="What the numbers are today">
        The deployed ceiling is 5x, the schedule above tops out at 5x, and the
        interface offers up to 3x. Where you see 10x described as the target,
        that is what it is: a target.
      </Note>

      <H2>What it costs</H2>
      <Table head={["Charge", "Default", "Basis"]}>
        <Tr>
          <Td>Entry fee</Td>
          <Td>1.5%</Td>
          <Td>Of position size, taken from margin at open</Td>
        </Tr>
        <Tr>
          <Td>Exit fee</Td>
          <Td>1.5%</Td>
          <Td>Of the size being closed</Td>
        </Tr>
        <Tr>
          <Td>Entry spread</Td>
          <Td>1.0%</Td>
          <Td>
            Moves the entry price against you — up for a long, down for a short
          </Td>
        </Tr>
        <Tr>
          <Td>Carry</Td>
          <Td>1 bp per hour</Td>
          <Td>
            On the borrowed portion only, so a 1x position pays none at all
          </Td>
        </Tr>
      </Table>
      <P>
        The round trip is therefore about 3% of size before the price does
        anything. Carry is deliberately tiny beside that — at the default rate a
        $5 position with $2.50 borrowed costs under a cent a day. Its job is to
        stop a winning position parking vault capacity for free, not to earn
        revenue.
      </P>
      <Note>
        A position keeps the carry rate it opened at, so a later change to the
        rate cannot be applied retroactively to positions already open.
      </Note>
      <P>
        The exit fee and the carry are both capped by whatever margin is left when
        the position settles. A position wiped out by the price move pays neither —
        not as a concession, but because there is nothing left to take. Your loss
        cannot exceed the margin you posted.
      </P>

      <H3>What the interface offers</H3>
      <P>
        The multiples presented are 1x, 2x, and 3x, which is narrower than the
        contract&rsquo;s current ceiling. Individual markets can also carry their
        own lower cap, applied on top of whatever the vault-size tier allows.
      </P>
      <P>
        Choosing 1x is not a leveraged position at all: it routes through the
        ordinary spot path, where you buy real shares at the venue. The leverage
        engine is only involved above 1x, which is also consistent with the carry
        rule, since a 1x position borrows nothing.
      </P>

      <H2>Liquidation</H2>
      <P>
        A position becomes liquidatable once price losses plus accrued carry have
        consumed 90% of its net margin. The check is not a simple comparison
        against the liquidation price recorded at open, because that figure was
        computed before any carry had accrued — carry eats margin, so it pulls the
        real liquidation price closer as the position ages.
      </P>
      <P>
        When it triggers, the remaining margin is absorbed by the vault. There is
        no partial recovery and no negative balance: your loss is capped at the
        margin you posted, and the vault&rsquo;s gain is capped at the same
        amount.
      </P>
      <P>
        Both the open-time figure and the live one are readable on-chain, and the
        live one is what a trader should be shown. The{" "}
        <A to="/leverage/mathematics">mathematics page</A> gives the exact
        expressions.
      </P>

      <H2>Closing, in whole or in part</H2>
      <P>
        A position can be closed entirely, or reduced by a fraction expressed in
        basis points. A partial close scales everything together — size, shares,
        margin, the vault reservation, and the carry owed — so what remains is the
        same trade in miniature, at the same entry price and the same liquidation
        price. The freed reservation returns to the vault immediately and is
        available to the next trader.
      </P>
      <P>
        Whatever is left must still clear the minimum margin, so you cannot reduce
        a position down to dust.
      </P>

      <H2>Three safeguards worth understanding</H2>

      <H3>The price feed admits when it is behind</H3>
      <P>
        A binary market can gap tens of cents on a single headline. The on-chain
        price is only allowed to move 20% per update, which is what stops one bad
        print from liquidating everybody at once — but it means that during a real
        gap the on-chain price is knowingly stale, and anyone watching the real
        book could open into that lag at the vault&rsquo;s expense.
      </P>
      <P>
        So opening is blocked while the price is still catching up. Closing and
        liquidation stay available, because those positions already carry real
        exposure and freezing their exits would be worse than settling a few ticks
        behind. The clamp is enforced by the contract rather than by the process
        pushing prices, so a compromised price reporter cannot conceal a gap by
        flattening it beforehand.
      </P>

      <H3>Prices go stale on purpose</H3>
      <P>
        A price older than five minutes is treated as no price at all, and opening
        halts. This is the protection against a dead price feed: trading stops
        rather than continuing against a frozen number.
      </P>

      <H3>There is an escape hatch if the feed dies</H3>
      <P>
        Closing needs a fresh price, so a prolonged outage would otherwise trap
        margin indefinitely. After 24 hours a trader can unwind at{" "}
        <strong className="text-white">zero profit and loss</strong> — net margin
        returned, no payout computed against a frozen price, and no exit fee on a
        path that only exists because the system stopped working.
      </P>
      <P>
        Settling at the last known price instead would hand the vault&rsquo;s
        money to whoever the outage happened to favour, and let losing positions
        cash out above their true value.
      </P>

      <H2>Every threshold is adjustable</H2>
      <P>
        None of the numbers above are compiled in. Each has an admin setter, so
        the risk envelope can widen as the vault grows without redeploying
        anything. That also means an administrator can change the rules under
        which your position operates — with the exception of your carry rate,
        which is fixed at open.
      </P>
      <P>
        Administration is intended to be a multisig, and the role transfers in two
        steps so a mistyped address cannot strand it.
      </P>
    </>
  );
}

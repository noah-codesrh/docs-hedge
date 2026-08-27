import {
  A,
  C,
  Code,
  H2,
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
    title: "Earning as an LP",
    description:
      "The Hedge vault: senior and junior tranches, how share price works, where the yield comes from, and what the risks are.",
  });
}

export default function LeverageEarn() {
  return (
    <>
      <PageTitle
        eyebrow="Leverage"
        title="Earning as an LP"
        intro="Leverage needs capital on the other side of it. The vault is where that capital sits: you deposit USDG, it backs traders' positions, and it earns the fees and the margin those positions leave behind. It is the counterparty, which means it profits when traders lose and pays when they win."
      />

      <Note kind="warning" title="Not live, and not audited">
        The vault is behind the same build flag as leverage itself, and the Earn
        page reports it as not yet live until deployment addresses are set. The
        contracts have not been audited. Treat everything here as a description of
        code, not an invitation to deposit.
      </Note>

      <H2>Two tranches</H2>
      <P>
        The vault holds one asset, <C>USDG</C> on Robinhood Chain, split into two
        claims on it.
      </P>
      <Table head={["Tranche", "Who holds it", "Position in a loss"]}>
        <Tr>
          <Td>
            <strong className="text-white">Senior</strong>
          </Td>
          <Td>Ordinary depositors — this is what Earn deposits into</Td>
          <Td>
            Paid last out of losses. Only touched once junior is exhausted.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Junior</strong>
          </Td>
          <Td>
            The protocol&rsquo;s own first-loss buffer, seeded at deployment
          </Td>
          <Td>Absorbs the first losses in full.</Td>
        </Tr>
      </Table>
      <P>
        This is the whole point of the structure. When a trader wins, the vault
        pays the profit out of junior first, and senior capital is only reduced
        once junior has reached zero. That is the protection senior depositors are
        being offered — not an absence of risk, but a buffer that takes the first
        hit.
      </P>
      <Note>
        Junior can be topped up by anyone, deliberately, so that a revenue source
        can inject into the buffer without holding administrative rights. Only an
        administrator can withdraw from it.
      </Note>

      <H2>Shares, not balances</H2>
      <P>
        A senior deposit mints shares. Your claim is your share of the
        tranche&rsquo;s assets, so the balance you can withdraw grows as the
        tranche earns without your share count changing.
      </P>
      <Code>{`first deposit          shares = assets

thereafter             shares = assets × totalShares / seniorAssets
withdrawing            assets = shares × seniorAssets / totalShares`}</Code>
      <P>
        There is no separate reward to claim and no rebasing balance. Fees landing
        in the tranche raise <C>seniorAssets</C> while the share count is
        unchanged, which raises what every share is worth.
      </P>

      <H2>Where the yield comes from</H2>
      <P>
        Three sources, all of them paid by traders, and each split the same way by
        default — <strong className="text-white">70% to senior, 30% to
        junior</strong>:
      </P>
      <Ul>
        <Li>
          <strong className="text-white">Entry and exit fees.</strong> 1.5% of
          position size on each side. This is the reliable part: it is collected
          whether the trader wins or loses, at the moment they open and close.
        </Li>
        <Li>
          <strong className="text-white">The entry spread.</strong> 1% moved
          against the trader on entry, kept by the vault.
        </Li>
        <Li>
          <strong className="text-white">Absorbed margin.</strong> When a position
          is liquidated, the margin remaining in it goes to the vault. This is the
          largest and least predictable component.
        </Li>
      </Ul>
      <P>
        Carry on borrowed capital settles out of the trader&rsquo;s margin on exit
        and splits the same way.
      </P>
      <P>
        Both splits are adjustable. Setting the liquidation split to zero would
        route all liquidation proceeds to junior instead, to rebuild the buffer
        faster after a bad run.
      </P>

      <H2>What you are actually exposed to</H2>
      <P>
        The vault is the counterparty to every leveraged position. Its outcome is
        the mirror image of the traders&rsquo;:
      </P>
      <Table head={["What happens", "Effect on the vault"]}>
        <Tr>
          <Td>Trader opens a position</Td>
          <Td>
            Collects the entry fee immediately. Locks capital to cover the
            worst-case payout.
          </Td>
        </Tr>
        <Tr>
          <Td>Trader closes at a profit</Td>
          <Td>
            Pays the profit — junior first, then senior. Collects the exit fee and
            the carry. Releases the lock.
          </Td>
        </Tr>
        <Tr>
          <Td>Trader closes at a loss</Td>
          <Td>
            Keeps the shortfall out of their margin, plus the exit fee. Releases
            the lock.
          </Td>
        </Tr>
        <Tr>
          <Td>Position is liquidated</Td>
          <Td>
            Absorbs the whole remaining margin. Releases the lock. This is the
            best case for the vault.
          </Td>
        </Tr>
      </Table>
      <P>
        So a sustained run of winning traders reduces the vault, and senior
        capital is genuinely at risk once the junior buffer is gone. The fee
        income is what compensates for taking that side.
      </P>

      <H2>Locked capital and withdrawals</H2>
      <P>
        When a position opens, the vault locks enough to cover the worst it could
        owe. That reservation is not the borrowed amount — a binary outcome can run
        to $1.00, so a winning long can be worth far more than the leverage
        top-up, and a short&rsquo;s maximum payout is the entire position size.
        Reserving only the borrowed slice would let a handful of winners leave the
        vault unable to pay.
      </P>
      <P>
        Locked capital still belongs to your tranche on paper, but it is not
        withdrawable while it backs a live position. A withdrawal reverts if it
        would exceed the free portion.
      </P>
      <Ul>
        <Li>
          There is no lockup period, no cooldown, and no withdrawal queue. The
          only constraint is whether the capital is currently free.
        </Li>
        <Li>
          At most 30% of vault assets can be locked at once, so in normal
          conditions the majority is withdrawable.
        </Li>
        <Li>
          Deposits can be paused by an administrator, and there is a configurable
          cap on total senior assets. It defaults to unlimited.
        </Li>
      </Ul>
      <P>
        The practical cost of reserving the worst case is capacity rather than
        safety: a $100 vault at the 30% cap backs roughly six concurrent $5
        positions rather than twelve.
      </P>

      <H2>Yield figures</H2>
      <P>
        No rate is displayed anywhere yet. The inputs exist on-chain — fee and
        absorbed-margin events, against the tranche&rsquo;s total assets — but the
        figure is not currently computed or surfaced.
      </P>
      <P>
        The intended derivation annualises a trailing window and compounds weekly:
      </P>
      <Code>{`APR = (senior fees over 30 days × 12) / total senior USDG × 100
APY = (1 + APR / 52) ^ 52 − 1`}</Code>
      <Note kind="warning">
        Any figure derived this way is backward-looking. It annualises whatever
        trading happened to occur in one 30-day window, and the largest component
        of the yield — absorbed margin from liquidations — is the least
        predictable. It is not a rate anyone is promising.
      </Note>

      <H2>Risks, stated plainly</H2>
      <Ul>
        <Li>
          <strong className="text-white">The contracts are unaudited</strong> and
          hold real funds when live.
        </Li>
        <Li>
          <strong className="text-white">Senior is not principal-protected.</strong>{" "}
          The junior buffer takes the first loss, but it is finite.
        </Li>
        <Li>
          <strong className="text-white">Withdrawals depend on free
          capital.</strong> Capital backing live positions cannot be withdrawn
          until those positions close.
        </Li>
        <Li>
          <strong className="text-white">Administrative reach is broad.</strong> An
          administrator can change every risk parameter, pause deposits, withdraw
          the junior tranche, and set prices past the jump guard. This is intended
          to be a multisig.
        </Li>
        <Li>
          <strong className="text-white">The price feed is a dependency.</strong> If
          it stalls, liquidations stop while underwater positions stay open at the
          vault&rsquo;s expense.
        </Li>
      </Ul>
      <P>
        The exact accounting behind all of this is on the{" "}
        <A to="/leverage/mathematics">mathematics page</A>.
      </P>
    </>
  );
}

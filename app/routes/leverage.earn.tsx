import {
  A,
  C,
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
import { PnlModelFigure, TvlLadderFigure } from "../components/figures";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Earning as an LP",
    description:
      "How the Hedge vault works: deposit USDG, back 2x/3x tickets, earn fees and losses, take the other side of winners.",
  });
}

export default function LeverageEarn() {
  return (
    <>
      <PageTitle
        eyebrow="Leverage"
        title="Earning as an LP"
        intro="Deposit USDG on Earn. That capital is the other side of every 2x and 3x ticket. You earn fees, carry, and trader losses. You pay when traders win."
      />

      <Note kind="warning" title="Do not send USDG to the vault address">
        Deposit only from <C>Earn</C>. A transfer to the vault contract does
        not mint shares and is not a deposit.
      </Note>

      <H2>Two tranches</H2>
      <Table head={["", "Senior", "Junior"]}>
        <Tr>
          <Td>Who</Td>
          <Td>Anyone, via Earn</Td>
          <Td>First-loss buffer, seeded at deploy</Td>
        </Tr>
        <Tr>
          <Td>Losses</Td>
          <Td>Hit only after junior is gone</Td>
          <Td>Take the first hit in full</Td>
        </Tr>
        <Tr>
          <Td>Income</Td>
          <Td>70% of fees and absorbed margin</Td>
          <Td>30%</Td>
        </Tr>
      </Table>
      <P>
        Senior is not principal-protected. Junior is a buffer, not insurance.
        Anyone can top up junior on-chain; only admin can withdraw it. The app
        does not expose junior deposits.
      </P>
      <PnlModelFigure />
      <TvlLadderFigure />

      <H2>How you get paid</H2>
      <P>
        A deposit mints shares. Fees raise the tranche&rsquo;s assets; your
        share count stays put, so each share is worth more. Nothing to claim.
      </P>
      <Table head={["Source", "What it is"]}>
        <Tr>
          <Td>Entry / exit fees</Td>
          <Td>1.5% of size each side. Paid whether the trader wins or loses.</Td>
        </Tr>
        <Tr>
          <Td>Carry</Td>
          <Td>1 bp/hour on the borrowed slice, taken on close.</Td>
        </Tr>
        <Tr>
          <Td>Trader losses</Td>
          <Td>Closed at a loss, or the whole remaining margin on liquidation.</Td>
        </Tr>
      </Table>
      <P>
        The 1% entry spread is not a separate transfer. It worsens the
        trader&rsquo;s entry, so it shows up in their P&amp;L at settlement.
      </P>

      <H2>What is locked</H2>
      <P>
        On open the vault locks the worst it could owe, not the borrowed
        slice. A long to $1 can owe more than the top-up. A short can owe the
        whole size. Reserving less would leave winners unpaid.
      </P>

      <H2>Withdrawals</H2>
      <Ul>
        <Li>No lockup, cooldown, or queue.</Li>
        <Li>You can only withdraw free capital, not what is locked behind open tickets.</Li>
        <Li>At most 30% of TVL can be locked, so most of the pool stays withdrawable.</Li>
      </Ul>
      <P>
        That reservation is why a $100 vault at the cap backs about six $5
        tickets, not twelve.
      </P>

      <H2>The two APRs on Earn</H2>
      <Ul>
        <Li>
          <strong className="text-white">In use</strong> is realised: senior
          income over a recent window, annualised. No history under a day
          means no number.
        </Li>
        <Li>
          <strong className="text-white">Est.</strong> is a model from assumed
          trade volume. More deposits do not create more trades, so
          compounding barely lifts APY.
        </Li>
      </Ul>
      <P>
        Do not treat either as a promise. Absorbed margin is the largest and
        least predictable piece. Formulas:{" "}
        <A to="/leverage/mathematics">mathematics</A>.
      </P>

      <H2>Risks</H2>
      <Ul>
        <Li>A run of winning traders drains junior, then senior.</Li>
        <Li>A stalled price feed pauses liquidations while losers stay open.</Li>
        <Li>Admin can change every parameter, pause deposits, and withdraw junior. Intended to be a multisig.</Li>
      </Ul>
    </>
  );
}

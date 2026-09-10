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
  Step,
  Steps,
  Table,
  Td,
  Tr,
  Ul,
} from "../components/prose";
import { PoolClaimFigure } from "../components/figures";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Refund, redeem, and claim",
    description:
      "How a pool ticket comes back as USDG: refund before lock, Claim stake after expiry, Redeem only when the chain would pay.",
  });
}

export default function PoolClaim() {
  return (
    <>
      <PageTitle
        eyebrow="Pool"
        title="Refund, redeem, and claim"
        intro="A pool ticket is not Close. USDG sits in HedgePool until you pull it. Three buttons do that work: Refund before lock, Claim stake after expiry if the chain is still unresolved, and Redeem once previewPayout is above zero."
      />

      <P>
        Board and pots: <A to="/pool">Pool and liquidity</A>. Path of the
        dollars: <A to="/pool/money">Money and payouts</A>. Formulas:{" "}
        <A to="/pool/mathematics">The mathematics</A>. Integrators:{" "}
        <A to="/developers/pool">Pool tickets</A>.
      </P>
      <PoolClaimFigure />

      <H2>Not Close</H2>
      <P>
        <C>Close</C> sells 1x shares on the venue book, or exits a 2x–4x
        engine ticket. Pool never has shares to sell. After lock there is
        nothing to dump at the mark. The card can print $0 while the
        window is over and still hold your $25 in the contract.
      </P>
      <Table head={["Button", "Desk", "What it does"]}>
        <Tr>
          <Td>Close</Td>
          <Td>Spot or 2x–4x</Td>
          <Td>Sell or reduce. Not pool.</Td>
        </Tr>
        <Tr>
          <Td>Refund</Td>
          <Td>Pool, before lock</Td>
          <Td>
            <C>refund(id)</C>. Stake back. Ticket cleared. You can stake
            again.
          </Td>
        </Tr>
        <Tr>
          <Td>Claim stake</Td>
          <Td>Pool, expired, still unresolved on chain</Td>
          <Td>
            Reporter <C>resolve</C>s (void on a one-sided pot), then you{" "}
            <C>claim</C>. That is a refund, not a profit.
          </Td>
        </Tr>
        <Tr>
          <Td>Redeem</Td>
          <Td>Pool, <C>previewPayout &gt; 0</C></Td>
          <Td>
            You pull <C>claim(id)</C>. Win or void. Losers get 0.
          </Td>
        </Tr>
      </Table>
      <Note kind="warning" title="A $0 mark is not a failed ticket">
        Worth now follows the tape. After expiry a one-sided book often
        marks at $0 because nobody is on the other side. The USDG is still
        in <C>HedgePool</C> until you Claim stake, then Redeem / claim.
      </Note>

      <H2>The ticket clock</H2>
      <Table head={["Phase", "On chain", "What you can do"]}>
        <Tr>
          <Td>Open</Td>
          <Td>
            Listed. <C>outcome = 0</C>. Before lock.
          </Td>
          <Td>Refund. One ticket per wallet. No add.</Td>
        </Tr>
        <Tr>
          <Td>Locked</Td>
          <Td>Past lock. Still <C>outcome = 0</C>.</Td>
          <Td>Wait. No refund. No new stake.</Td>
        </Tr>
        <Tr>
          <Td>Expired, unresolved</Td>
          <Td>
            Past expiry. Still <C>outcome = 0</C>.{" "}
            <C>previewPayout = 0</C>.
          </Td>
          <Td>
            Claim stake. Redeem is hidden because claim would revert.
          </Td>
        </Tr>
        <Tr>
          <Td>Resolved, you can be paid</Td>
          <Td>
            <C>outcome</C> is A, B, or void, and{" "}
            <C>previewPayout &gt; 0</C>.
          </Td>
          <Td>Redeem. That is the pull.</Td>
        </Tr>
        <Tr>
          <Td>Resolved, you lost</Td>
          <Td>
            Winning side is the other pot. <C>previewPayout = 0</C>.
          </Td>
          <Td>
            Nothing. The stake stays in the contract for the winners.
          </Td>
        </Tr>
        <Tr>
          <Td>Claimed</Td>
          <Td>
            <C>tickets.claimed = true</C>
          </Td>
          <Td>Done. A second claim reverts.</Td>
        </Tr>
      </Table>
      <P>
        <C>id</C> is <C>keccak256(utf8(slug))</C>. The slug is the path
        after <C>/pool/</C>. Outcome codes: <C>0</C> none, <C>1</C> side
        A, <C>2</C> side B, <C>3</C> void.
      </P>

      <H2>Refund</H2>
      <P>
        Live pool only:{" "}
        <C>0x40863A67e096B55C5847FA738086Eae67c18f39f</C>. The first live
        pool has no refund. Tickets there wait until expiry, then claim.
      </P>
      <Ul>
        <Li>
          Shown while the card is <C>open</C>, you have not been paid, and
          the database has no resolved side yet.
        </Li>
        <Li>
          You send <C>refund(id)</C> from the wallet that staked. USDG
          returns. The pot drops. The wallet can stake again.
        </Li>
        <Li>
          The app then records the refund so Your tickets drops the row.
        </Li>
      </Ul>
      <P>
        Copy in the app: refund is an undo, not a sale. You get the stake
        back before lock. After lock the ticket stays until expiry.
      </P>

      <H2>Redeem</H2>
      <P>
        Redeem is a pull of money the contract already owes you. The app
        does not show it from a database flag alone. It reads{" "}
        <C>previewPayout(id, wallet)</C> on the live pool, then the first
        live pool. If that number is 0, Redeem is hidden.
      </P>
      <Code title="HedgePool.previewPayout">{`unresolved (outcome == 0)  ->  0
already claimed            ->  0
void                       ->  stake
winning side               ->  (stake × (poolA + poolB)) / winning side
losing side                ->  0`}</Code>
      <P>
        That is pots only. Featured long overlay is a separate escrow
        push after settle. You still have to claim the pots yourself.
        Integer division truncates. Dust stays in the contract.
      </P>
      <P>
        You send <C>claim(id)</C> from the ticket wallet. The app tries
        the live pool first, then{" "}
        <C>0xf0D392e67904acE892A6024E0501AbfAD67A1c8c</C>, so an old
        ticket still redeems after a new deploy. A loser reverts{" "}
        <C>NothingToClaim</C>. The app says this side lost, there is
        nothing to claim.
      </P>

      <H2>Claim stake</H2>
      <P>
        After expiry a card can sit with <C>outcome = 0</C> forever if
        the keeper never landed <C>resolve</C>. Redeem cannot help:{" "}
        <C>previewPayout</C> is 0 until the chain has an outcome. Claim
        stake is the holder asking the reporter to finish the card, then
        claiming.
      </P>
      <Steps>
        <Step n={1} title="You are signed in as the ticket wallet">
          <P>
            The ticket must live in a linked wallet. The call is{" "}
            <C>POST /api/native/release</C> with the slug. The card must
            be past expiry.
          </P>
        </Step>
        <Step n={2} title="The reporter reads the pots">
          <P>
            If one side is empty, the contract cannot pick that side as
            the winner. The reporter voids. Every open ticket is owed its
            stake. If both sides have USDG, the tape picks A or B and
            <C>settleNative</C> runs. An empty winning side still falls
            back to void.
          </P>
        </Step>
        <Step n={3} title="previewPayout is read again">
          <P>
            Above zero: you send <C>claim</C>. Zero: this side lost.
            There is nothing to claim. Void pays the stake. That is a
            refund, not a win against the other side.
          </P>
        </Step>
      </Steps>
      <Note kind="warning" title="One-sided pot is a refund">
        If you are the only book, you did not hit a multiple. After void
        you get the stake back. Three $25 tickets on empty books return
        $75, not a parimutuel profit.
      </Note>

      <H3>Worked example</H3>
      <P>
        You put $25 No on a 15m CASHCAT card. Nobody else stakes. The
        window ends. The tape can say the name printed under the strike.
        The contract still refuses <C>resolve(No)</C> because the Yes pot
        is empty, and it would also refuse <C>resolve(Yes)</C> because
        the Yes pot is empty. The only legal outcome is void. Claim
        stake voids, then claim returns $25.
      </P>

      <H2>How the app decides</H2>
      <P>
        Your tickets on{" "}
        <A href="https://hedgeapp.trade/pool">hedgeapp.trade/pool</A>{" "}
        (and the same cards on Profile) use the chain, not the mark:
      </P>
      <Code title="Your tickets">{`claimable   = previewPayout(slug, wallet) > 0
expired     = now >= expiry
releasable  = expired
            && ticket.amount > 0
            && !ticket.claimed

Redeem       if claimable
Claim stake  if releasable and not yet claimable
hidden       if neither`}</Code>
      <P>
        The market page itself is stricter: Redeem there still needs the
        database to already say void or that you won. Claim stake lives
        on Your tickets so a stuck card can be finished without waiting
        on the board row.
      </P>
      <Table head={["Flag", "Meaning"]}>
        <Tr>
          <Td>
            <C>claimable</C>
          </Td>
          <Td>
            The contract would pay this wallet right now. Redeem is safe.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>releasable</C>
          </Td>
          <Td>
            Expired, still on chain, unclaimed. Needs resolve, then claim.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>payoutTx</C> or <C>claimed</C>
          </Td>
          <Td>Already pulled. Buttons stay off.</Td>
        </Tr>
      </Table>

      <H2>Why Redeem used to sit dead</H2>
      <P>
        Settlement writes <C>resolved_side</C> in the app database, then
        calls <C>resolve</C> on chain. If that second step fails, the
        board can look settled while <C>outcome</C> is still 0. Older
        keeper jobs then skipped the card because they only selected
        rows with <C>resolved_side</C> still null. Redeem showed.{" "}
        <C>claim</C> reverted. The USDG never moved.
      </P>
      <P>
        Two fixes are live. The keeper retries <C>resolve</C> even when
        the database already has a side. You can also Claim stake: that
        path voids a one-sided pot or settles a two-sided one, then you
        claim. The reporter key (<C>NATIVE_POOL_KEY</C>) still has to be
        able to send <C>resolve</C>.
      </P>

      <H2>Who holds the USDG</H2>
      <Ul>
        <Li>
          New tickets:{" "}
          <C>0x40863A67e096B55C5847FA738086Eae67c18f39f</C> until you
          claim.
        </Li>
        <Li>
          First live pool:{" "}
          <C>0xf0D392e67904acE892A6024E0501AbfAD67A1c8c</C>. No refund.
          Same claim after resolve.
        </Li>
        <Li>
          The app lists cards and sponsors gas for embedded wallets. It
          never takes custody of a new ticket.
        </Li>
        <Li>
          Older escrow tickets (before HedgePool) still pay as a push.
          No <C>claim()</C>.
        </Li>
      </Ul>
      <P>
        Embedded Privy wallets get gas sponsored. A connected external
        wallet needs a little RH ETH. Either way, <C>claim</C> must come
        from the address that holds the ticket.
      </P>

      <H2>What this is not</H2>
      <Ul>
        <Li>
          Not Close. There is no book to sell into after lock.
        </Li>
        <Li>
          Not a $HEDGE buyback. Losing stakes pay winners. Dust stays in
          the pool.
        </Li>
        <Li>
          Not the vault. Vault TVL does not back these tickets.
        </Li>
        <Li>
          Not a win because the name &quot;hit.&quot; A one-sided pot voids.
          You get the stake, not the multiple on the card.
        </Li>
      </Ul>
      <Cards>
        <Card to="/pool/money" title="Money and payouts">
          Who pays on a win, a void, and a featured overlay.
        </Card>
        <Card to="/developers/pool" title="Pool tickets">
          Contract calls, release API, and settle retry.
        </Card>
        <Card to="/guides/cashing-out" title="Closing and cashing out">
          Close on spot and 2x–4x. Different desk.
        </Card>
      </Cards>
    </>
  );
}

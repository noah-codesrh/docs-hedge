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
import { PoolMoneyFigure } from "../components/figures";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Money and payouts",
    description:
      "How pool USDG moves: stake into HedgePool, who holds it, who claims, and who pays the Hedge overlay.",
  });
}

export default function PoolMoney() {
  return (
    <>
      <PageTitle
        eyebrow="Pool"
        title="Money and payouts"
        intro="Your USDG leaves your wallet, sits in HedgePool, and comes back only if you claim. Other traders pay the pots. Hedge pays the overlay on featured long races. The app never takes custody of a new ticket."
      />

      <P>
        Formulas: <A to="/pool/mathematics">The mathematics</A>. Trader
        overview: <A to="/pool">Pool and liquidity</A>. This page is the
        path the dollars take.
      </P>
      <PoolMoneyFigure />

      <H2>Who pays</H2>
      <Table head={["Outcome", "Who pays you", "How"]}>
        <Tr>
          <Td>You win</Td>
          <Td>
            Losing tickets, held in <C>HedgePool</C>
          </Td>
          <Td>
            You pull <C>claim()</C>. Payout is your share of both pots.
          </Td>
        </Tr>
        <Tr>
          <Td>You win a featured long</Td>
          <Td>
            Losing tickets, then Hedge
          </Td>
          <Td>
            Same claim for the pots. Escrow pushes your share of the $1,000
            overlay.
          </Td>
        </Tr>
        <Tr>
          <Td>You lose</Td>
          <Td>Nobody</Td>
          <Td>
            Your stake stays in the contract and is what winners claim.
            Nothing else is taken.
          </Td>
        </Tr>
        <Tr>
          <Td>Void</Td>
          <Td>
            <C>HedgePool</C>
          </Td>
          <Td>
            <C>claim()</C> returns the stake. No overlay.
          </Td>
        </Tr>
      </Table>
      <P>
        Hedge is not the counterparty on a normal card. There is no house
        seed. The first tickets <em>are</em> the book. The $1,000 overlay is
        extra USDG on featured 7d / 14d / 30d races only, paid from a
        separate escrow wallet, not from the contract pots.
      </P>
      <Note kind="warning" title="Not a CLOB, not the vault">
        Spot tickets convert USDG to pUSD and settle on Polymarket. Leverage
        tickets are sized against the vault. Pool never leaves Robinhood
        Chain and never touches either of those books.
      </Note>

      <H2>How a ticket moves</H2>
      <Steps>
        <Step n={1} title="Approve">
          <P>
            Your wallet allows <C>HedgePool</C> to pull USDG. The app
            grants a small budget so the next ticket does not need a
            second approval. USDG has not left yet.
          </P>
        </Step>
        <Step n={2} title="Stake">
          <P>
            You send <C>stake(id, side, amount)</C>. The contract checks
            the $1 to $25 range, one ticket per wallet, the lock, and the
            desk cap, then{" "}
            <C>transferFrom</C> pulls USDG into{" "}
            <C>HedgePool</C>. That amount is added to pool A or pool B
            and to <C>deskOpen</C>.
          </P>
        </Step>
        <Step n={3} title="Hold or refund">
          <P>
            Before lock you can pull <C>refund(id)</C>. That returns the
            stake, drops the pot, and clears the ticket so the wallet can
            stake again. After lock the USDG stays until expiry. There is
            no sell. The app row is not a second copy of the USDG.
          </P>
        </Step>
        <Step n={4} title="Resolve">
          <P>
            After expiry the reporter reads the tape and pushes{" "}
            <C>resolve(id, A | B | void)</C>. That unlocks claims. It
            does not send USDG. An empty winning side cannot resolve and
            falls back to void.
          </P>
        </Step>
        <Step n={5} title="Claim">
          <P>
            You pull <C>claim(id)</C>. Winners receive{" "}
            <C>(stake × (poolA + poolB)) / winning side</C>. A void
            returns the stake. A loser gets 0 and the call reverts{" "}
            <C>NothingToClaim</C>. Dust from integer division stays in the
            contract.
          </P>
        </Step>
      </Steps>
      <P>
        Embedded Privy wallets get gas sponsored. A connected external
        wallet needs a little RH ETH. Either way, the USDG path is the
        same: your address to <C>HedgePool</C>, then back to your address.
      </P>

      <H2>Who holds what</H2>
      <Table head={["Place", "What it holds", "What it does not"]}>
        <Tr>
          <Td>Your cash wallet</Td>
          <Td>USDG before stake and after claim</Td>
          <Td>The open ticket</Td>
        </Tr>
        <Tr>
          <Td>
            <C>HedgePool</C>
          </Td>
          <Td>Every new-path stake until it is claimed</Td>
          <Td>
            The $1,000 overlay. Tape odds. The app database.
          </Td>
        </Tr>
        <Tr>
          <Td>Hedge escrow</Td>
          <Td>
            Overlay float, plus leftover tickets from before the contract
          </Td>
          <Td>New <C>stake()</C> deposits</Td>
        </Tr>
        <Tr>
          <Td>The app</Td>
          <Td>
            Market rows, stake records, tape quotes
          </Td>
          <Td>Your USDG</Td>
        </Tr>
        <Tr>
          <Td>Reporter</Td>
          <Td>Nothing of yours</Td>
          <Td>
            Payout. It only lists cards and pushes the outcome.
          </Td>
        </Tr>
      </Table>
      <Code title="calls">{`you        approve USDG -> HedgePool
you        stake(id, side, amount)
reporter   listMarket(id, lock, expiry)   // first ticket
reporter   resolve(id, A | B | void)    // after expiry
you        claim(id)                     // pots or refund
escrow     transfer USDG                 // overlay only`}</Code>

      <H3>On-chain vs overlay</H3>
      <P>
        <C>HedgePool.previewPayout</C> is pots only. It does not know the
        overlay. After a featured long resolves, the settle job pays
        each winner{" "}
        <C>(stake × 1000) / winning side</C> from escrow as a separate
        USDG transfer. You still have to claim the pots yourself.
      </P>
      <P>
        The overlay is not locked in the contract when you stake. If
        escrow is empty, the pots still pay. The extra $1,000 is the
        piece that can miss.
      </P>

      <H2>Empty winning side</H2>
      <P>
        If the tape says A won and pool A is empty, the contract reverts{" "}
        <C>EmptyWinningSide</C>. The reporter voids. Every ticket claims
        its stake back. Hedge does not cover the missing side, and the
        overlay does not pay on a void.
      </P>
      <P>
        The card can still show a fat overlay multiple while the window
        is open. That number is an estimate against the pots <em>and</em>{" "}
        <C>H</C>. Settlement will not run that payout unless someone is
        actually on the winning side.
      </P>
      <Note>
        House cover (Hedge paying the winner when the other pot is empty)
        is not live. Today that market refunds.
      </Note>

      <H2>Current pool</H2>
      <P>
        New tickets go to <C>0x40863A67e096B55C5847FA738086Eae67c18f39f</C>.
        That deploy has <C>refund</C> before lock. Same admin and reporter.
        Deploy tx <C>0x1ae88d39f1fd19648e844bd432d6b93b5b6846d74ae86a2d7afdb6ae05b511ca</C>.
      </P>

      <H2>First live pool</H2>
      <P>
        The first <C>HedgePool</C> on Robinhood Chain has no{" "}
        <C>refund</C>. Tickets already in it stay there until expiry. A 7d
        window pays at the end of those 7 days, not at lock. Then the
        reporter voids or sets the winner, and the ticket wallet{" "}
        <C>claim</C>s. A void returns the stake. Admin cannot pull USDG
        out.
      </P>
      <Table head={["", ""]}>
        <Tr>
          <Td>Pool</Td>
          <Td>
            <C>0xf0D392e67904acE892A6024E0501AbfAD67A1c8c</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Chain</Td>
          <Td>Robinhood Chain (4663)</Td>
        </Tr>
        <Tr>
          <Td>USDG</Td>
          <Td>
            <C>0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Admin</Td>
          <Td>
            <C>0xd78610499138b019d15DBD0246e1B0A10778390D</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Reporter</Td>
          <Td>
            <C>0x4E2822FaD96d625fd5bAa7526CB8Fd42ecB88161</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Limits</Td>
          <Td>$1 / $25 / $1,000 desk cap. No refund.</Td>
        </Tr>
      </Table>
      <P>
        <C>id</C> is <C>keccak256(slug)</C>. The slug is the pool URL after{" "}
        <C>/pool/</C>. After expiry, admin or reporter resolves. Void is{" "}
        <C>3</C> if you want the test stake back. Then claim from the
        wallet that staked.
      </P>
      <Code title="after expiry, first pool">{`# void, then claim. lock is not a payout.
ID=$(cast keccak "$SLUG")
OLD=0xf0D392e67904acE892A6024E0501AbfAD67A1c8c
RPC=https://rpc.mainnet.chain.robinhood.com

cast send $OLD "resolve(bytes32,uint8)" $ID 3 \\
  --rpc-url $RPC --account hedge-admin --sender $ADMIN --broadcast

cast send $OLD "claim(bytes32)" $ID \\
  --rpc-url $RPC --account hedge-admin --sender $ADMIN --broadcast`}</Code>
      <Note>
        <C>claim</C> must come from the wallet that holds the ticket. If
        that is not the admin keystore, send <C>claim</C> from that
        wallet instead. Redeem in the app still talks to this address
        for tickets that live here.
      </Note>

      <H2>Older tickets</H2>
      <P>
        Before <C>HedgePool</C> shipped, a stake was a USDG transfer into
        the escrow wallet. Those tickets still pay as a push from that
        wallet: full parimutuel amount, overlay included, no{" "}
        <C>claim()</C>. New stakes go to the contract. If a wallet
        somehow has both, the contract ticket is claimed on chain and
        escrow only sends the overlay.
      </P>

      <H2>What this is not</H2>
      <Ul>
        <Li>
          Not a conversion. Pool USDG never becomes pUSD and never
          crosses to Polygon. See{" "}
          <A to="/concepts/tokens">Money and tokens</A> for the spot
          path.
        </Li>
        <Li>
          Not the leverage vault. Vault TVL does not back these tickets.
        </Li>
        <Li>
          Not a house book. Hedge does not take a cut of the pots. Dust
          from truncation stays in <C>HedgePool</C>.
        </Li>
      </Ul>
      <Cards>
        <Card to="/pool/mathematics" title="The mathematics">
          Tape, blend, pots, overlay, strikes, settlement, caps.
        </Card>
        <Card to="/pool" title="Pool and liquidity">
          What the desk is, the three card kinds, and the board.
        </Card>
      </Cards>
    </>
  );
}

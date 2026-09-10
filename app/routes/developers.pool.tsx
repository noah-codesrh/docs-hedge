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
import { PoolReleaseFigure } from "../components/figures";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Pool tickets",
    description:
      "How HedgePool stake, refund, resolve, and claim work, and how the app releases a stuck ticket.",
  });
}

export default function DevelopersPool() {
  return (
    <>
      <PageTitle
        eyebrow="Developers"
        title="Pool tickets"
        intro="Native parimutuel on Robinhood Chain. Another product can read the pots and send the same calls the app sends. USDG never leaves chain 4663. This is not the leverage vault and not the 1x venue book."
      />

      <P>
        Trader walkthrough:{" "}
        <A to="/pool/claim">Refund, redeem, and claim</A>. Addresses:{" "}
        <A to="/developers/contracts">Contracts</A>. Formulas:{" "}
        <A to="/pool/mathematics">The mathematics</A>.
      </P>
      <PoolReleaseFigure />

      <H2>Live addresses</H2>
      <Table head={["Contract", "Address", "Notes"]}>
        <Tr>
          <Td>HedgePool</Td>
          <Td>
            <C>0x40863A67e096B55C5847FA738086Eae67c18f39f</C>
          </Td>
          <Td>Current desk. Refund before lock. Claim after resolve.</Td>
        </Tr>
        <Tr>
          <Td>First live pool</Td>
          <Td>
            <C>0xf0D392e67904acE892A6024E0501AbfAD67A1c8c</C>
          </Td>
          <Td>No refund. Tickets stay until expiry, then claim.</Td>
        </Tr>
        <Tr>
          <Td>USDG</Td>
          <Td>
            <C>0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168</C>
          </Td>
          <Td>6 decimals. Approve this to the pool, then stake.</Td>
        </Tr>
      </Table>
      <P>
        Market id is <C>keccak256(utf8(slug))</C>. The slug is the pool
        URL after <C>/pool/</C>, for example{" "}
        <C>cashcat-mcap-15m-1788998400</C>.
      </P>
      <Code title="id">{`id = keccak256(utf8(slug))
// 0x + 64 hex. Same join key the leverage engine uses.`}</Code>

      <H2>Outcome and ticket</H2>
      <Table head={["Value", "Meaning"]}>
        <Tr>
          <Td>
            <C>0</C>
          </Td>
          <Td>Unresolved. <C>previewPayout</C> is 0. <C>claim</C> reverts.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>1</C>
          </Td>
          <Td>Side A won.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>2</C>
          </Td>
          <Td>Side B won.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>3</C>
          </Td>
          <Td>Void. Every unclaimed ticket is owed its stake.</Td>
        </Tr>
      </Table>
      <Code title="markets(id)">{`lockAt, expiryAt, poolA, poolB, outcome, listed`}</Code>
      <Code title="tickets(id, user)">{`side, amount, claimed
// side 1 = A, 2 = B`}</Code>
      <Code title="previewPayout(id, user)">{`outcome == 0 or claimed -> 0
void                     -> stake
winner                   -> (stake × (poolA + poolB)) / winning side
loser                    -> 0`}</Code>
      <Note kind="warning" title="Do not treat the app row as money">
        <C>resolved_side</C> in Supabase can land before{" "}
        <C>resolve</C> mines. The pay gate is{" "}
        <C>previewPayout</C>. If it is 0, do not send <C>claim</C>.
      </Note>

      <H2>Writes</H2>
      <Table head={["Who", "Call", "When"]}>
        <Tr>
          <Td>Reporter</Td>
          <Td>
            <C>listMarket(id, lockAt, expiryAt)</C>
          </Td>
          <Td>First stake. The board load does not list the card.</Td>
        </Tr>
        <Tr>
          <Td>Holder</Td>
          <Td>
            <C>approve</C> USDG, then <C>stake(id, side, amount)</C>
          </Td>
          <Td>
            $1–$25. One ticket per wallet. Before lock. Under desk cap.
          </Td>
        </Tr>
        <Tr>
          <Td>Holder</Td>
          <Td>
            <C>refund(id)</C>
          </Td>
          <Td>Live pool, before lock. First pool has no refund.</Td>
        </Tr>
        <Tr>
          <Td>Reporter</Td>
          <Td>
            <C>resolve(id, 1 | 2 | 3)</C>
          </Td>
          <Td>
            After expiry. Empty winning side reverts{" "}
            <C>EmptyWinningSide</C>. Fall back to void.
          </Td>
        </Tr>
        <Tr>
          <Td>Holder</Td>
          <Td>
            <C>claim(id)</C>
          </Td>
          <Td>
            After resolve, from the ticket wallet. Tries live pool, then
            first pool.
          </Td>
        </Tr>
      </Table>
      <P>
        Explorer:{" "}
        <A href="https://robinhoodchain.blockscout.com">
          robinhoodchain.blockscout.com
        </A>
        . RPC: <C>https://rpc-robinhood.blockmachine.io</C>. Chain{" "}
        <C>4663</C>.
      </P>

      <H2>App HTTP</H2>
      <P>
        These routes are first-party. They need a Privy session except
        settle, which is a keeper key. Another origin does not get a
        fill. You can still send the contract calls from your own
        wallet.
      </P>
      <Table head={["Route", "Auth", "Job"]}>
        <Tr>
          <Td>
            <C>GET /api/native/tickets</C>
          </Td>
          <Td>Privy</Td>
          <Td>
            Lists rows plus <C>claimable</C> and <C>releasable</C> from
            chain.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>POST /api/native/refund</C>
          </Td>
          <Td>Privy</Td>
          <Td>Records a mined <C>refund</C> so the row drops.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>POST /api/native/release</C>
          </Td>
          <Td>Privy</Td>
          <Td>
            Holder-triggered resolve, then returns{" "}
            <C>previewPayout</C>.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>POST /api/native/settle</C>
          </Td>
          <Td>
            <C>NATIVE_SETTLE_KEY</C> when set
          </Td>
          <Td>
            Keeper. Body <C>{`{ slug, side? }`}</C> or empty for every
            expired card that still has stakes.
          </Td>
        </Tr>
      </Table>

      <H3>releaseNativeTicket</H3>
      <Code title="POST /api/native/release">{`body: { slug }

require: signed-in user, card past expiry,
         open ticket in a linked wallet

if markets.outcome == 0:
  if poolA == 0 or poolB == 0:
    resolve(id, void)          // 3
    write resolved_side = void
  else:
    tape = resolveNativeOutcome(...)
    settleNative(slug, tape)   // resolve A/B, EmptyWinningSide -> void

return { payout: previewPayout(id, wallet), wallet }`}</Code>
      <P>
        The app then sends <C>claim</C> only if <C>payout &gt; 0</C>.
        Zero means this side lost. The reporter key is{" "}
        <C>NATIVE_POOL_KEY</C> (or the older <C>NATIVE_ESCROW_KEY</C>).
        Without it, release returns pool under maintenance.
      </P>

      <H3>settleNative</H3>
      <Code title="settleNative">{`if resolved_side already in DB:
  resolvePool(slug, resolved_side)   // retry if the first send failed
  pay overlay from escrow if any
  return

side = body.side or tape
write resolved_side
resolvePool(slug, side)
pay overlay`}</Code>
      <P>
        Housekeeping on the desk list also walks every market that still
        has stakes and is locked or expired, including rows that already
        have <C>resolved_side</C>. That is how a failed on-chain resolve
        gets a second send without waiting for Claim stake.
      </P>
      <P>
        Overlay is not in <C>previewPayout</C>. Featured longs get{" "}
        <C>(stake × 1000) / winning side</C> as a separate USDG
        transfer from escrow after settle. A void does not pay overlay.
      </P>

      <H2>Empty winning side</H2>
      <Code title="HedgePool.resolve">{`if outcome == A and poolA == 0  ->  EmptyWinningSide
if outcome == B and poolB == 0  ->  EmptyWinningSide`}</Code>
      <P>
        The app catches that revert and calls <C>resolve(id, 3)</C>.
        Do the same if you resolve from your own key. Hedge does not
        cover a missing book. House cover is not live.
      </P>

      <H2>Reverts the UI maps</H2>
      <Table head={["Revert", "Shown as"]}>
        <Tr>
          <Td>
            <C>StakeOutOfRange</C>
          </Td>
          <Td>Tickets are $1–$25 USDG.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>AlreadyTicketed</C>
          </Td>
          <Td>One ticket per wallet on this card.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>WindowLocked</C>
          </Td>
          <Td>This window is locked.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>NothingToClaim</C>
          </Td>
          <Td>Nothing to claim on this ticket.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>NoTicket</C>
          </Td>
          <Td>No ticket in this wallet.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>EmptyWinningSide</C>
          </Td>
          <Td>Not shown. Reporter voids.</Td>
        </Tr>
      </Table>

      <H2>What you should not do</H2>
      <Ul>
        <Li>
          Do not send USDG to the pool address as a plain transfer. Use{" "}
          <C>stake</C>.
        </Li>
        <Li>
          Do not send USDG to the vault for a pool ticket. Vault is{" "}
          <C>depositSenior</C> only.
        </Li>
        <Li>
          Do not call <C>claim</C> while <C>outcome == 0</C>.
        </Li>
        <Li>
          Do not treat a $0 mark or a tape “hit” as a win on a
          one-sided pot.
        </Li>
      </Ul>
      <Cards>
        <Card to="/developers/contracts" title="Contracts">
          Engine, vault, oracle, stock desk, both pools, tokens.
        </Card>
        <Card to="/pool/claim" title="Refund, redeem, and claim">
          The same logic in trader words.
        </Card>
        <Card to="/developers/leverage" title="Leveraged markets">
          2x to 4x. Different contract. Different buttons.
        </Card>
      </Cards>
    </>
  );
}

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
import { LeverageIntegrateFigure } from "../components/figures";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Leveraged markets",
    description:
      "How another product lists Hedge 2x to 4x tickets: Agent Wall HTTP, direct HedgeLeverageEngine calls, or a deep link into the app.",
  });
}

export default function DevelopersLeverage() {
  return (
    <>
      <PageTitle
        eyebrow="Developers"
        title="Integrate leveraged markets"
        intro="Listed Hedge names can sit inside another app, bot, or vault. 2x to 4x settles on Robinhood Chain against the vault. You do not talk to the Polymarket CLOB for these tickets."
      />

      <LeverageIntegrateFigure />

      <P>
        Addresses: <A to="/developers/contracts">Contracts</A>. Full HTTP
        shapes: <A to="/guides/agent-wall">Agent Wall</A>. Trader rules:{" "}
        <A to="/leverage/overview">Leverage markets</A>. 1x (real shares)
        is a different path: <A to="/developers/architecture">Architecture</A>.
      </P>

      <H2>What you are integrating</H2>
      <P>
        <strong className="text-white">1x</strong> buys Yes/No on the venue
        book. That fill stays in a Hedge session.{" "}
        <strong className="text-white">2x to 4x</strong> is synthetic. The
        trader posts USDG margin to{" "}
        <C>HedgeLeverageEngine</C>. The vault takes the other side. No
        shares move on Polygon. The price is a relayed Polymarket Yes mid.
      </P>
      <Ul>
        <Li>Only names Hedge has listed on-chain. The catalog is small on purpose.</Li>
        <Li>Yes must sit inside 35¢ to 65¢ or the engine reverts.</Li>
        <Li>The multiple is capped by vault TVL and by that market&rsquo;s own max.</Li>
        <Li>Live ceiling advertised in the app is 4x, not 10x.</Li>
      </Ul>

      <H2>Pick a path</H2>
      <Table head={["Path", "You run", "Fill"]}>
        <Tr>
          <Td>Agent Wall</Td>
          <Td>
            <C>GET /api/agent/quote</C> then <C>POST /api/agent/bets</C>
          </Td>
          <Td>
            Hedge returns calldata. Your wallet signs on chain 4663.
          </Td>
        </Tr>
        <Tr>
          <Td>Engine</Td>
          <Td>
            <C>approve</C> USDG, <C>quoteOpen</C>, <C>openPosition</C>
          </Td>
          <Td>
            Your app talks to the contract. No Hedge HTTP required.
          </Td>
        </Tr>
        <Tr>
          <Td>Deep link</Td>
          <Td>Open a prefilled market URL</Td>
          <Td>The user confirms in hedgeapp.trade</Td>
        </Tr>
      </Table>
      <P>
        A smart contract on Robinhood Chain can be the trader: it holds USDG
        and calls the engine. It cannot mint a Privy session, so it cannot
        place 1x. Leverage is the path that stays fully on 4663.
      </P>

      <H2>1. Agent Wall</H2>
      <P>
        Best default for another product. Hedge already knows which slugs
        are listed, walks <C>quoteOpen</C>, simulates the ticket, and
        returns unsigned calls. You never encode <C>marketId</C> wrong.
      </P>
      <Steps>
        <Step n={1} title="List leverage names">
          <Code title="shell">{`curl -s "https://hedgeapp.trade/api/agent/markets?desk=leverage"`}</Code>
          <P>
            Use <C>marketSlug</C> or Gamma <C>marketId</C>. Skip rows where{" "}
            <C>openable</C> is false or <C>band</C> is not{" "}
            <C>in-band</C>.
          </P>
        </Step>
        <Step n={2} title="Quote">
          <Code title="shell">{`curl -s "https://hedgeapp.trade/api/agent/quote?marketSlug=will-luiz-incio-lula-da-silva-win-the-2026-brazilian-presidential-election&side=yes&margin=5&leverage=2"`}</Code>
          <P>
            <C>quote.hasCapacity</C> must be true. <C>quote.source</C> is{" "}
            <C>engine</C> on listed names.
          </P>
        </Step>
        <Step n={3} title="Build the ticket">
          <Code title="shell">{`curl -s -X POST https://hedgeapp.trade/api/agent/bets \\
  -H "Content-Type: application/json" \\
  -d '{"action":"open","from":"0xYourWallet","marketSlug":"<slug>","side":"yes","margin":5,"leverage":2}'`}</Code>
          <P>
            Response <C>calls</C> are USDG <C>approve</C> (if needed) then{" "}
            <C>openPosition</C>. Sign each from <C>from</C> on chain 4663.
            Hedge does not hold that key. Then{" "}
            <C>POST action=submit</C> with the open hash if you want the
            fill on <A href="https://hedgeapp.trade/wall">/wall</A>.
          </P>
        </Step>
        <Step n={4} title="Close">
          <P>
            <C>POST action=close</C> with <C>from</C> and{" "}
            <C>positionId</C>. Hedge returns <C>reducePosition</C> calldata
            for that wallet only.
          </P>
        </Step>
      </Steps>
      <P>
        Request bodies, errors, and daily caps:{" "}
        <A to="/guides/agent-wall">Agent Wall</A>.
      </P>

      <H2>2. Call the engine</H2>
      <P>
        Use this when your product already has a 4663 wallet (or a contract)
        and you want no Hedge origin in the fill path. Reads can use any
        public RPC. Writes need USDG and a little RH ETH for gas unless you
        sponsor it yourself.
      </P>
      <Code title="addresses.ts">{`export const CHAIN_ID = 4663;
export const RPC = "https://rpc-robinhood.blockmachine.io";

export const ENGINE = "0xF29f50cf06ac63A834f68B8b0820D0d82f24B43A";
export const VAULT = "0xa60026C9f5a217730Bb647a5b8eA2aAEAb32a558";
export const ORACLE = "0x19E7bd8d16b5D8dD1b619da5a791e6a04fFd3461";
export const USDG = "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168";`}</Code>

      <H3>Market id</H3>
      <P>
        The on-chain key is the Polymarket <strong className="text-white">market slug</strong>,
        hashed. Not the Gamma numeric id.
      </P>
      <Code title="marketId.ts">{`import { keccak256, stringToBytes } from "viem";

export function marketIdFor(slug: string) {
  return keccak256(stringToBytes(slug.trim()));
}

// example:
// will-luiz-incio-lula-da-silva-win-the-2026-brazilian-presidential-election`}</Code>
      <P>
        Confirm <C>markets(id).enabled</C> before you send. A slug that is
        live on Polymarket but not listed here reverts.
      </P>

      <H3>Quote, then open</H3>
      <Code title="open.ts">{`import { parseUnits } from "viem";

const engineAbi = [
  {
    type: "function",
    name: "quoteOpen",
    stateMutability: "view",
    inputs: [
      { name: "marketId", type: "bytes32" },
      { name: "isLong", type: "bool" },
      { name: "margin", type: "uint256" },
      { name: "leverageBps", type: "uint256" },
    ],
    outputs: [
      {
        name: "q",
        type: "tuple",
        components: [
          { name: "size", type: "uint256" },
          { name: "entryPrice", type: "uint256" },
          { name: "fee", type: "uint256" },
          { name: "netMargin", type: "uint256" },
          { name: "shares", type: "uint256" },
          { name: "liquidationPrice", type: "uint256" },
          { name: "reserve", type: "uint256" },
          { name: "hasCapacity", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "openPosition",
    stateMutability: "nonpayable",
    inputs: [
      { name: "marketId", type: "bytes32" },
      { name: "isLong", type: "bool" },
      { name: "margin", type: "uint256" },
      { name: "leverageBps", type: "uint256" },
    ],
    outputs: [{ name: "id", type: "uint256" }],
  },
] as const;

const margin = parseUnits("5", 6); // $5.00 USDG
const leverageBps = 20_000n; // 2.00x
const isLong = true; // Yes. false is No / short

const quote = await publicClient.readContract({
  address: ENGINE,
  abi: engineAbi,
  functionName: "quoteOpen",
  args: [marketId, isLong, margin, leverageBps],
});

if (!quote.hasCapacity) throw new Error("Vault is full");

// ERC-20 approve(ENGINE, margin) first, then:
const hash = await walletClient.writeContract({
  address: ENGINE,
  abi: engineAbi,
  functionName: "openPosition",
  args: [marketId, isLong, margin, leverageBps],
});`}</Code>
      <P>
        USDG amounts are 6 decimals. Prices in the quote are 1e18. The
        engine charges 1.5% of size on the way in, applies a 1% entry
        spread against the trader, and pins carry at the open-time rate.
        Formulas: <A to="/leverage/mathematics">The mathematics</A>.
      </P>

      <H3>Read and close</H3>
      <Ul>
        <Li>
          <C>positions(id)</C> : trader, side, size, margin, entry,
          liquidation, whether it is still open
        </Li>
        <Li>
          <C>pnlOf(id)</C>, <C>fundingOwed(id)</C>,{" "}
          <C>liquidationPriceNow(id)</C> (carry pulls the live liq price in)
        </Li>
        <Li>
          <C>reducePosition(id, 5000)</C> closes half. Remainder must stay
          at or above <C>minMargin</C> ($1)
        </Li>
        <Li>
          <C>closePosition(id)</C> or <C>reducePosition(id, 10000)</C> for
          the lot
        </Li>
        <Li>
          <C>emergencyClose(id)</C> if the oracle has been stale for 24
          hours: net margin back, no P&amp;L, no exit fee
        </Li>
      </Ul>
      <P>
        Only the position&rsquo;s <C>trader</C> can reduce or close it.
        Anyone may call <C>liquidatePosition</C> once{" "}
        <C>isLiquidatable</C> is true.
      </P>

      <H3>Guards that revert an open</H3>
      <Table head={["Check", "What to read"]}>
        <Tr>
          <Td>Openings paused</Td>
          <Td>
            <C>openingPaused()</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Market not listed or resolved</Td>
          <Td>
            <C>markets(id)</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Yes outside 35¢–65¢</Td>
          <Td>
            Oracle <C>price(id)</C> vs that market&rsquo;s min/max
          </Td>
        </Tr>
        <Tr>
          <Td>Price catching up a gap</Td>
          <Td>
            Oracle <C>isConverging(id)</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Stale feed</Td>
          <Td>
            <C>updatedAt</C> older than <C>maxPriceAge</C> (5 minutes)
          </Td>
        </Tr>
        <Tr>
          <Td>No vault room</Td>
          <Td>
            <C>quote.hasCapacity</C> or <C>capacity()</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Size or leverage too high</Td>
          <Td>
            <C>minMargin</C>, <C>maxMargin</C>,{" "}
            <C>effectiveMaxLeverageBps</C>
          </Td>
        </Tr>
      </Table>
      <P>
        Simulate the open before you send. Custom errors from the engine
        are the same sentences the trade panel shows.
      </P>

      <H2>3. Deep link</H2>
      <P>
        Use this when a human should see Hedge&rsquo;s ticket and confirm.
        Same listed names. The fill still hits the engine once they are
        signed in.
      </P>
      <Code title="ticket">{`https://hedgeapp.trade/market/{eventSlug}?m={gammaMarketId}&s=yes&amt=5`}</Code>
      <P>
        <C>eventSlug</C> and Gamma <C>m=</C> come from{" "}
        <C>GET /api/agent/markets?desk=leverage</C> as{" "}
        <C>ticketUrl</C>. 1x on a name that is not leverage-listed still
        fills the venue book in the app. Do not promise 2x on that URL
        unless <C>desk</C> is <C>leverage</C> and the band is open.
      </P>

      <H2>Embed this in another product</H2>
      <Ul>
        <Li>
          <strong className="text-white">Wallet app or bot.</strong> Agent
          Wall quote plus your signer. Show size, entry, fee, and live
          liquidation from the engine quote, not a mid you invent.
        </Li>
        <Li>
          <strong className="text-white">Vault or strategy.</strong> Keep
          USDG on 4663. The strategy contract calls{" "}
          <C>openPosition</C>. It is the trader. Hedge never needs a Privy
          token for this loop.
        </Li>
        <Li>
          <strong className="text-white">Front end on your domain.</strong>{" "}
          List from the wall. Deep-link to confirm, or let the user sign
          engine calldata from their own injected wallet.
        </Li>
        <Li>
          <strong className="text-white">LP widget.</strong>{" "}
          <C>depositSenior</C> on the vault. Never transfer USDG to the
          vault address. See <A to="/leverage/earn">Earning as an LP</A>.
        </Li>
      </Ul>

      <Note kind="warning" title="What this is not">
        You do not get Privy, builder HMAC, or{" "}
        <C>/api/pm/builder-sign</C>. Those wrap 1x. Leveraged tickets do
        not need them. Do not send USDG to the vault. Do not label the 30%
        junior fee a $HEDGE buyback. Do not advertise a multiple the
        engine cannot open (TVL ladder and the per-market cap both bind).
      </Note>

      <H2>Worked numbers</H2>
      <P>
        $5 margin, 2x, Yes at 50¢ after the 1% spread is 50.5¢. Size is
        $10. Entry fee is 1.5% of size ($0.15). Net margin is $4.85. The
        vault reserves the worst-case payout, not only the borrowed $5.
        Liquidation is when loss plus carry eat 90% of net margin (about
        28¢ on this long, not 25¢). Same worked example as{" "}
        <A to="/leverage/mathematics">The mathematics</A>.
      </P>

      <H2>Next</H2>
      <Cards>
        <Card to="/developers/contracts" title="Contracts">
          Engine, vault, oracle, stock desk, pool, USDG, $HEDGE.
        </Card>
        <Card to="/guides/agent-wall" title="Agent Wall">
          Full HTTP: markets, quote, open, close, submit, errors.
        </Card>
        <Card to="/leverage/mathematics" title="The mathematics">
          Every formula the engine uses on open and close.
        </Card>
        <Card to="/developers/architecture" title="1x architecture">
          If you also need venue shares, that fill still happens in Hedge.
        </Card>
      </Cards>
    </>
  );
}

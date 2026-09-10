import {
  A,
  C,
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

const EXPLORER = "https://robinhoodchain.blockscout.com";

function Addr({
  address,
  kind = "address",
}: {
  address: string;
  kind?: "address" | "token";
}) {
  return (
    <A href={`${EXPLORER}/${kind}/${address}`}>
      <C>{address}</C>
    </A>
  );
}

export function meta() {
  return docMeta({
    title: "Contracts",
    description:
      "Live Hedge contracts on Robinhood Chain: engine, vault, oracle, stock desk, pool, USDG, and $HEDGE.",
  });
}

export default function DevelopersContracts() {
  return (
    <>
      <PageTitle
        eyebrow="Developers"
        title="Contracts"
        intro="Everything that settles leveraged tickets, LP deposits, pool stakes, and $HEDGE lives on Robinhood Chain. These addresses are live. Do not replace them."
      />

      <P>
        Leverage integration (HTTP, engine calls, deep link):{" "}
        <A to="/developers/leverage">Leveraged markets</A>. Trader rules:{" "}
        <A to="/leverage/overview">Leverage markets</A>. Maths:{" "}
        <A to="/leverage/mathematics">The mathematics</A>.
      </P>

      <H2>Chain</H2>
      <Table head={["", "Value"]}>
        <Tr>
          <Td>Network</Td>
          <Td>Robinhood Chain</Td>
        </Tr>
        <Tr>
          <Td>Chain id</Td>
          <Td>
            <C>4663</C>
          </Td>
        </Tr>
        <Tr>
          <Td>RPC</Td>
          <Td>
            <A href="https://rpc-robinhood.blockmachine.io">
              rpc-robinhood.blockmachine.io
            </A>
          </Td>
        </Tr>
        <Tr>
          <Td>RPC (official)</Td>
          <Td>
            <A href="https://rpc.mainnet.chain.robinhood.com">
              rpc.mainnet.chain.robinhood.com
            </A>
          </Td>
        </Tr>
        <Tr>
          <Td>Explorer</Td>
          <Td>
            <A href={EXPLORER}>robinhoodchain.blockscout.com</A>
          </Td>
        </Tr>
        <Tr>
          <Td>Native gas</Td>
          <Td>ETH on chain 4663. Not USDG.</Td>
        </Tr>
      </Table>
      <P>
        Robinhood Chain has no Multicall3. Batch reads with parallel{" "}
        <C>eth_call</C>. viem&rsquo;s <C>multicall</C> throws here.
      </P>

      <H2>Protocol</H2>
      <Table head={["Contract", "Address", "Role"]}>
        <Tr>
          <Td>HedgeLeverageEngine</Td>
          <Td>
            <Addr address="0xF29f50cf06ac63A834f68B8b0820D0d82f24B43A" />
          </Td>
          <Td>
            Open, reduce, close, and liquidate 2x to 4x tickets. Escrows
            trader margin. Talks to the vault and the oracle.
          </Td>
        </Tr>
        <Tr>
          <Td>HedgeVault</Td>
          <Td>
            <Addr address="0xa60026C9f5a217730Bb647a5b8eA2aAEAb32a558" />
          </Td>
          <Td>
            Dual-tranche USDG that backs tickets. Senior takes most fees.
            Junior is first-loss. The engine is the only spender of LP
            capital.
          </Td>
        </Tr>
        <Tr>
          <Td>HedgeOracle</Td>
          <Td>
            <Addr address="0x19E7bd8d16b5D8dD1b619da5a791e6a04fFd3461" />
          </Td>
          <Td>
            Relayed Polymarket Yes prices. Settlement is 1e18. A 20% jump
            guard and a 5-minute stale window sit on-chain.
          </Td>
        </Tr>
        <Tr>
          <Td>HedgeStockCollateral</Td>
          <Td>
            <Addr address="0xFDD4FA8985D6FC2F4818a5Bc9f27C62228Ab6746" />
          </Td>
          <Td>
            Escrow for listed Robinhood equity tokens.{" "}
            <C>openWithStock</C> posts USDG margin into the engine and
            freezes the stock.
          </Td>
        </Tr>
        <Tr>
          <Td>HedgePool</Td>
          <Td>
            <Addr address="0x40863A67e096B55C5847FA738086Eae67c18f39f" />
          </Td>
          <Td>
            Native parimutuel desk. USDG tickets, refund before lock, claim
            after resolve. Not the leverage vault.
          </Td>
        </Tr>
      </Table>

      <H2>Tokens</H2>
      <Table head={["Token", "Address", "Notes"]}>
        <Tr>
          <Td>USDG</Td>
          <Td>
            <Addr
              kind="token"
              address="0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168"
            />
          </Td>
          <Td>
            6 decimals. Cash, margin, vault deposits, and pool stakes. The
            engine constructor requires 6 decimals.
          </Td>
        </Tr>
        <Tr>
          <Td>$HEDGE</Td>
          <Td>
            <Addr
              kind="token"
              address="0x48DCA2206189013Fa50b9b2C38233B9363d72bD9"
            />
          </Td>
          <Td>
            Protocol token. Not margin. Not vault collateral. Pair:{" "}
            <A href="https://dexscreener.com/robinhood/0xbe67ce8260d03681734e39bc062145bc47984b7e052b35a2b285a3841a836777">
              Dexscreener
            </A>
            .
          </Td>
        </Tr>
      </Table>

      <Note kind="warning" title="Do not send USDG to the vault">
        LP capital enters through <C>depositSenior</C> (and junior through{" "}
        <C>depositJunior</C>). A plain transfer to{" "}
        <C>0xa60026C9f5a217730Bb647a5b8eA2aAEAb32a558</C> does not mint
        shares. Traders approve USDG to the engine, not the vault.
      </Note>

      <H2>What each contract is for</H2>
      <H3>HedgeLeverageEngine</H3>
      <P>
        Synthetic Yes/No vs the vault. 1x is not this contract: 1x buys
        venue shares through Hedge. 2x to 4x posts USDG here. The engine
        recomputes size, fee, shares, reserve, and liquidation on every
        open. A client-side quote is a preview.
      </P>
      <Ul>
        <Li>
          <C>quoteOpen(marketId, isLong, margin, leverageBps)</C>
        </Li>
        <Li>
          <C>openPosition(...)</C> same args, returns a position id
        </Li>
        <Li>
          <C>reducePosition(id, fractionBps)</C> pass <C>10000</C> to close
          the lot
        </Li>
        <Li>
          <C>closePosition(id)</C> full exit
        </Li>
        <Li>
          <C>emergencyClose(id)</C> after 24 hours of a stale price: net
          margin back, zero P&amp;L
        </Li>
        <Li>
          Views: <C>positions</C>, <C>pnlOf</C>, <C>fundingOwed</C>,{" "}
          <C>liquidationPriceNow</C>, <C>markets</C>, <C>capacity</C>,{" "}
          <C>effectiveMaxLeverageBps</C>, <C>openingPaused</C>
        </Li>
      </Ul>
      <P>
        <C>marketId</C> is <C>keccak256(utf8(marketSlug))</C>. Only slugs
        listed on-chain open. Live names:{" "}
        <A href="https://hedgeapp.trade/api/agent/markets?desk=leverage">
          /api/agent/markets?desk=leverage
        </A>
        .
      </P>

      <H3>HedgeVault</H3>
      <P>
        Two tranches, one USDG pot. Fees and absorbed margin split 70%
        senior / 30% junior. That junior slice is first-loss capital, not a
        $HEDGE buyback.
      </P>
      <Ul>
        <Li>
          <C>depositSenior(assets)</C> / <C>withdrawSenior(shares)</C>
        </Li>
        <Li>
          Views: <C>totalAssets</C>, <C>freeAssets</C>, <C>seniorAssets</C>,{" "}
          <C>juniorAssets</C>, <C>lockedAssets</C>,{" "}
          <C>seniorSharesOf</C>, <C>convertToShares</C>,{" "}
          <C>convertToAssets</C>, <C>depositsPaused</C>
        </Li>
        <Li>
          Events: <C>FeeCollected</C>, <C>MarginAbsorbed</C>
        </Li>
      </Ul>
      <P>
        Earn UI: <A to="/leverage/earn">Earning as an LP</A>.
      </P>

      <H3>HedgeOracle</H3>
      <P>
        Reporters push the true Polymarket Yes mid. The contract clamps each
        print to 20% and stores both the clamped settlement price and the
        unclamped <C>target</C>. While they differ, <C>isConverging</C> is
        true and the engine refuses new opens. Closes and liquidations stay
        on. A price older than 5 minutes is stale.
      </P>
      <Ul>
        <Li>
          <C>price(marketId)</C> returns <C>(value, updatedAt)</C>
        </Li>
        <Li>
          <C>priceDetail(marketId)</C> returns{" "}
          <C>(value, target, updatedAt)</C>
        </Li>
        <Li>
          <C>isConverging(marketId)</C>, <C>maxPriceAge</C>
        </Li>
      </Ul>
      <P>
        Integrators read. Only a registered reporter can{" "}
        <C>pushPrice</C>.
      </P>

      <H3>HedgeStockCollateral</H3>
      <P>
        Listed Robinhood equity stays in this contract. A free deposit is
        book liquidity. <C>openWithStock</C> sizes USDG margin from the
        stock mark after a haircut, opens on the engine from the desk float,
        and locks the units. On close, profit pays in USDG and leftover
        stock returns. The user does not sell the name to open.
      </P>
      <Ul>
        <Li>
          <C>deposit(token, amount)</C> / <C>withdraw(token, amount)</C>
        </Li>
        <Li>
          <C>quoteMargin(token, stockAmount)</C>
        </Li>
        <Li>
          <C>openWithStock(token, stockAmount, marketId, isLong, leverageBps)</C>
        </Li>
        <Li>
          <C>closeTicket(ticketId)</C>
        </Li>
        <Li>
          Views: <C>listed</C>, <C>markUsd6</C>, <C>deposited</C>,{" "}
          <C>locked</C>, <C>freeOf</C>, <C>haircutBps</C>
        </Li>
      </Ul>

      <H3>HedgePool</H3>
      <P>
        Separate from leverage. <C>stake</C>, <C>refund</C> before lock,{" "}
        <C>claim</C> after resolve. Market id is also{" "}
        <C>keccak256(utf8(slug))</C>. $1 to $25, one ticket per wallet per
        card, $1,000 desk cap. App docs: <A to="/pool">Pool</A>. Ticket
        lifecycle and release: <A to="/developers/pool">Pool tickets</A>.
        Trader buttons: <A to="/pool/claim">Refund, redeem, and claim</A>.
      </P>
      <P>
        First live pool (no refund, tickets stay until expiry):{" "}
        <Addr address="0xf0D392e67904acE892A6024E0501AbfAD67A1c8c" />.
      </P>

      <H2>Units</H2>
      <Table head={["Quantity", "Scale"]}>
        <Tr>
          <Td>USDG amounts</Td>
          <Td>
            6 decimals. $5.00 is <C>5000000</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Outcome prices</Td>
          <Td>
            1e18 = $1.00. 50¢ is <C>5e17</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Leverage</Td>
          <Td>
            Basis points. 2x is <C>20000</C>, 4x is <C>40000</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Fractions</Td>
          <Td>
            Basis points. Half a position is <C>5000</C>
          </Td>
        </Tr>
      </Table>

      <H2>Who can call what</H2>
      <Ul>
        <Li>
          <strong className="text-white">Anyone with USDG.</strong>{" "}
          <C>openPosition</C>, <C>reducePosition</C>, <C>closePosition</C>,{" "}
          <C>depositSenior</C>, pool <C>stake</C> / <C>claim</C>. The
          on-chain trader is <C>msg.sender</C>.
        </Li>
        <Li>
          <strong className="text-white">Anyone.</strong>{" "}
          <C>liquidatePosition</C> on an underwater id. The engine re-checks.
        </Li>
        <Li>
          <strong className="text-white">Reporter / keeper.</strong> Oracle{" "}
          <C>pushPrice</C>. Engine guardian pause. Pool <C>listMarket</C> /{" "}
          <C>resolve</C>.
        </Li>
        <Li>
          <strong className="text-white">Admin only.</strong> List markets,
          risk params, fee split, pause, junior withdraw, transfer admin.
        </Li>
      </Ul>
      <P>
        Hedge does not hand out the admin or reporter key. Your product
        signs as the trader (or LP). Unsigned vault calls from the{" "}
        <A to="/guides/agent-wall">Agent Wall</A> are the same functions
        with <C>from</C> set to your wallet.
      </P>
    </>
  );
}

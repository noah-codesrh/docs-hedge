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
    title: "Money and tokens",
    description: "USDG, the collateral the markets settle in, and why placing a trade converts between two chains.",
  });
}

export default function Tokens() {
  return (
    <>
      <PageTitle
        eyebrow="Core concepts"
        title="Money and tokens"
        intro="Your balance and the markets live on different chains in different tokens. Every trade therefore includes a conversion, and that single fact explains most of the app's timing and most of its error messages."
      />

      <H2>The two tokens</H2>
      <Table head={["Token", "Chain", "Role", "Decimals"]}>
        <Tr>
          <Td>
            <C>USDG</C>
          </Td>
          <Td>Robinhood Chain</Td>
          <Td>Your spendable balance. What you deposit and withdraw.</Td>
          <Td>6</Td>
        </Tr>
        <Tr>
          <Td>
            <C>pUSD</C>
          </Td>
          <Td>Polygon</Td>
          <Td>the venue&rsquo;s collateral. What orders settle in.</Td>
          <Td>6</Td>
        </Tr>
      </Table>
      <P>
        Both track the US dollar, so a conversion is not a trade in the usual
        sense and you are not exposed to a moving exchange rate between them. Both
        also use 6 decimals, which is why amounts in the code appear as integer
        base units: <C>1000000</C> base units is $1.00.
      </P>

      <Code title="Relevant addresses">{`USDG   0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168   (Robinhood Chain)
pUSD   0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB   (Polygon)`}</Code>

      <H2>Why a conversion is needed</H2>
      <P>
        You hold <C>USDG</C> because that is the chain the app&rsquo;s balances and
        deposits live on. The venue only accepts its own collateral on Polygon.
        Neither side can be changed from the app, so buying means turning{" "}
        <C>USDG</C> into <C>pUSD</C> first, and cashing out means turning it back.
      </P>
      <P>
        This crossing is handled by Relay, a bridging service. The app requests a
        quote for the conversion, sends funds to the address the quote names, and
        then polls until the far side reports the conversion complete.
      </P>

      <H3>Which direction, and when</H3>
      <Ul>
        <Li>
          <strong className="text-white">Buying</strong> converts <C>USDG</C> from
          your cash wallet into <C>pUSD</C> in your trading proxy, then places
          the order.
        </Li>
        <Li>
          <strong className="text-white">Selling</strong> puts <C>pUSD</C> in the
          proxy, then converts it back to <C>USDG</C> in your cash wallet.
        </Li>
      </Ul>

      <Note title="Minimums">
        A conversion needs at least $1 to be worth executing, and the venue
        enforces its own minimum order size. Very small amounts are rejected up
        front rather than part-way through, and a leftover balance below the
        conversion minimum has to be topped up before it can be moved.
      </Note>

      <H2>Where funds can pause</H2>
      <P>
        Because the journey has several hops, an interrupted trade leaves money at
        whichever hop it reached. It is always in one of these places, and always
        yours:
      </P>
      <Code title="The path, and the resting points along it">{`Cash wallet (USDG, Robinhood Chain)
      |
      |  Relay conversion
      v
trading proxy (pUSD, Polygon)
      |
      |  order fills on the CLOB
      v
Outcome shares (Polygon)`}</Code>
      <P>
        The most common pause is <C>pUSD</C> sitting in the proxy: the conversion
        finished but the order did not fill, or a sale completed but the conversion
        back has not run. The app reports this explicitly, and the remedy is
        normally to repeat the action, which picks up the existing balance instead
        of converting again.
      </P>

      <Note kind="warning" title="A stalled trade is not a lost trade">
        If you see a message saying your <C>pUSD</C> is still in the trading
        proxy, the funds are intact at that address. Retrying the buy fills from
        that balance, and cashing out converts it back.
      </Note>

      <H2>Gas</H2>
      <P>
        Movements on Polygon are sponsored through the venue&rsquo;s gasless
        relayer, so you never hold <C>POL</C>. On Robinhood Chain, gas is paid in{" "}
        <C>ETH</C>; the app sponsors some transfers itself, but keeping a small{" "}
        <C>ETH</C> balance in the cash wallet avoids trouble on the ones it does
        not.
      </P>
      <P>
        Both directions are walked through step by step in{" "}
        <A to="/guides/placing-a-trade">placing a trade</A> and{" "}
        <A to="/guides/cashing-out">cashing out</A>.
      </P>
    </>
  );
}

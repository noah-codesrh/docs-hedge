import { A, C, H2, H3, Li, Note, P, PageTitle, Step, Steps, Table, Td, Tr, Ul } from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Closing and cashing out",
    description: "Sell a position, convert the proceeds back to USDG, and recover funds from an interrupted flow.",
  });
}

export default function CashingOut() {
  return (
    <>
      <PageTitle
        eyebrow="Guides"
        title="Closing and cashing out"
        intro="Closing sells your shares and converts the proceeds back into spendable USDG. It is the buy flow in reverse, and it has the same resting points if something interrupts it."
      />

      <H2>Closing a position</H2>
      <Steps>
        <Step n={1} title="Find the position">
          <P>
            Open positions appear on the market page they belong to and on{" "}
            <C>Profile</C>. Each shows its shares, current value, and profit or
            loss.
          </P>
        </Step>
        <Step n={2} title="Choose Close">
          <P>
            This sells your shares into the book at the going rate. You do not need
            to wait for the market to resolve.
          </P>
        </Step>
        <Step n={3} title="Let the steps run">
          <P>
            The overlay reports selling, moving, converting, and arriving. Keep the
            tab open until it finishes.
          </P>
        </Step>
        <Step n={4} title="Check your cash">
          <P>
            The proceeds arrive as <C>USDG</C> in your cash wallet and show up as{" "}
            <strong className="text-white">Cash</strong> in the header.
          </P>
        </Step>
      </Steps>

      <H3>What the steps mean</H3>
      <Table head={["Step", "What is happening"]}>
        <Tr>
          <Td>
            <strong className="text-white">Sell</strong>
          </Td>
          <Td>
            A market sell order matched against the bids, priced with a slippage
            guard.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Move</strong>
          </Td>
          <Td>
            Gathering the resulting <C>pUSD</C> into your trading proxy wallet.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Convert</strong>
          </Td>
          <Td>
            Sending that <C>pUSD</C> to Relay to be converted back into <C>USDG</C>
            .
          </Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Arrive</strong>
          </Td>
          <Td>Waiting for the USDG to land in your cash wallet.</Td>
        </Tr>
      </Table>

      <H2>Cashing out a leftover balance</H2>
      <P>
        <C>Cash out</C> converts <C>pUSD</C> back to <C>USDG</C> without selling
        anything. Use it when a previous flow stopped after converting but before
        filling, leaving a balance in the proxy with no position attached.
      </P>
      <P>
        It requires at least $1 in the proxy, because a conversion below that is not
        worth executing. If you have less than that stranded, it has to be topped up
        before it can be moved out.
      </P>

      <H2>Recovering an interrupted flow</H2>
      <P>
        Every stopping point is recoverable, and in all of them the money is at an
        address you control. Match the message to the remedy:
      </P>
      <Table head={["What you see", "Where the money is", "What to do"]}>
        <Tr>
          <Td>
            <C>pUSD</C> is still in the trading proxy
          </Td>
          <Td>Proxy wallet, on Polygon</Td>
          <Td>
            Retry the buy to spend it, or <C>Cash out</C> to convert it back
          </Td>
        </Tr>
        <Tr>
          <Td>Position sold, pUSD still in the trading proxy</Td>
          <Td>Proxy wallet, on Polygon</Td>
          <Td>
            <C>Cash out</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Conversion is still pending</Td>
          <Td>In transit through Relay</Td>
          <Td>Wait, then reload the profile page</Td>
        </Tr>
        <Tr>
          <Td>Relay refunded the conversion</Td>
          <Td>Returned to the wallet it came from</Td>
          <Td>
            Try <C>Cash out</C> again
          </Td>
        </Tr>
      </Table>

      <Note kind="warning" title="A relayer timeout is not a failed transfer">
        Moving pUSD out of the proxy goes through the venue&rsquo;s gasless
        relayer, which can take longer than the app is willing to wait. A timeout
        means the app stopped watching, not that the transfer failed. Check your
        balances before assuming anything went wrong, and retry rather than
        panicking.
      </Note>

      <H2>Things that can stop a close</H2>
      <Ul>
        <Li>
          <strong className="text-white">Position too small to close.</strong>{" "}
          Below a fraction of a share the venue will not accept the order.
        </Li>
        <Li>
          <strong className="text-white">No fillable liquidity.</strong> Nobody is
          bidding at an acceptable price. Try again, or wait for the book to fill
          in.
        </Li>
        <Li>
          <strong className="text-white">Below the conversion minimum.</strong> The
          sale succeeded but the proceeds are under $1, so they cannot be converted
          out on their own.
        </Li>
      </Ul>

      <P>
        For why the money moves between two tokens at all, see{" "}
        <A to="/concepts/tokens">money and tokens</A>.
      </P>
    </>
  );
}

import { A, C, H2, Li, Note, P, PageTitle, Step, Steps, Ul } from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Adding funds",
    description: "Deposit USDG on Robinhood Chain and confirm it arrived.",
  });
}

export default function AddingFunds() {
  return (
    <>
      <PageTitle
        eyebrow="Guides"
        title="Adding funds"
        intro="Your balance is USDG held on Robinhood Chain. Depositing means sending USDG to your cash wallet address on that chain."
      />

      <Steps>
        <Step n={1} title="Open your deposit details">
          <P>
            Go to <C>Profile</C> and choose <C>Deposit</C>. The panel shows your
            cash wallet address and a QR code for it.
          </P>
        </Step>

        <Step n={2} title="Check the network">
          <P>
            Send on <strong className="text-white">Robinhood Chain</strong>, chain
            id <C>4663</C>. This is the single most common mistake. The same
            address on another network is not monitored by the app.
          </P>
        </Step>

        <Step n={3} title="Send USDG">
          <P>
            Transfer <C>USDG</C> to that address. The app also recognises{" "}
            <C>ETH</C> and <C>WETH</C> on the same chain and shows them on your
            profile, but <C>USDG</C> is what trading spends.
          </P>
        </Step>

        <Step n={4} title="Wait for it to appear">
          <P>
            Balances are read from the chain, so the deposit shows up as{" "}
            <strong className="text-white">Cash</strong> in the header once the
            transfer confirms. Reload the profile page if it lags.
          </P>
        </Step>
      </Steps>

      <Note kind="warning" title="Send on the right chain, to the right address">
        Only send to the address the app gives you, and only on Robinhood Chain.
        Funds sent on a different network, or to the trading wallet or the proxy
        instead of the cash wallet, will not appear as spendable cash.
      </Note>

      <H2>Keep a little ETH</H2>
      <P>
        Robinhood Chain charges gas in <C>ETH</C>. Trading itself is sponsored, but
        transfers you initiate from the profile page are ordinary transactions, so
        keep a small <C>ETH</C> balance in the cash wallet. A dollar or two of it
        is plenty.
      </P>

      <H2>If your deposit has not shown up</H2>
      <Ul>
        <Li>
          <strong className="text-white">Confirm the network.</strong> Check the
          transaction on the Robinhood Chain explorer. If it is not there, it went
          to another chain.
        </Li>
        <Li>
          <strong className="text-white">Confirm the address.</strong> Compare it
          against the one shown under <C>Deposit</C>, not an address you saved
          previously.
        </Li>
        <Li>
          <strong className="text-white">Confirm the token.</strong> Only{" "}
          <C>USDG</C> counts as cash. Another stablecoin on the same chain will
          not be picked up.
        </Li>
        <Li>
          <strong className="text-white">Give it a moment, then reload.</strong>{" "}
          Balances are fetched, not pushed, so a hard reload is sometimes all it
          needs.
        </Li>
      </Ul>

      <H2>Withdrawing</H2>
      <P>
        The same profile page sends <C>USDG</C>, <C>ETH</C>, or <C>WETH</C> back
        out to any address on Robinhood Chain. Anything currently held as a
        position or as <C>pUSD</C> has to be closed and converted back first, which
        is covered in{" "}
        <A to="/guides/cashing-out">closing and cashing out</A>.
      </P>
    </>
  );
}

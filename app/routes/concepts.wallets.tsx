import { A, C, Code, H2, H3, Li, Note, P, PageTitle, Table, Td, Tr, Ul } from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Accounts and wallets",
    description: "How sign-in works and the difference between the cash wallet, the trading wallet, and the trading proxy.",
  });
}

export default function Wallets() {
  return (
    <>
      <PageTitle
        eyebrow="Core concepts"
        title="Accounts and wallets"
        intro="Signing in creates more than one wallet, and they are not interchangeable. Knowing which is which explains most of what you see on the profile page."
      />

      <H2>Signing in</H2>
      <P>
        Authentication runs through Privy, and there are five ways in: an email
        one-time code, Google, X, Discord, or connecting an external wallet.
        Whichever you use, Privy provisions an <em>embedded</em> wallet for you on
        login — keys it manages on your behalf, so there is nothing to back up.
      </P>
      <P>
        Supported external wallets include MetaMask, Coinbase Wallet, Rainbow,
        Robinhood, WalletConnect, OKX, Zerion, and Bybit, plus anything else the
        browser advertises.
      </P>
      <P>
        Every request the browser makes to a protected server route carries a
        Privy access token as a bearer token, and the server verifies it before
        acting. Tokens are short-lived and refresh on their own, which is why a
        long-lived trading session has to read the current token rather than
        capture one at page load.
      </P>

      <H2>The three wallets</H2>
      <P>
        These have distinct jobs, and money moves between them during a trade.
      </P>

      <Table head={["Wallet", "Chain", "Holds", "Created by"]}>
        <Tr>
          <Td>
            <strong className="text-white">Cash wallet</strong>
          </Td>
          <Td>Robinhood Chain</Td>
          <Td>
            Your <C>USDG</C> balance and a little <C>ETH</C> for gas
          </Td>
          <Td>Your external wallet if you linked one, otherwise embedded</Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Trading wallet</strong>
          </Td>
          <Td>Polygon</Td>
          <Td>Nothing, normally. It signs.</Td>
          <Td>Privy, embedded</Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Trading proxy</strong>
          </Td>
          <Td>Polygon</Td>
          <Td>Collateral and your outcome shares</Td>
          <Td>Derived from the trading wallet</Td>
        </Tr>
      </Table>

      <H3>Cash wallet</H3>
      <P>
        This is the one you deposit into and withdraw from, and the balance shown
        as <strong className="text-white">Cash</strong> in the header. It is the
        only address you should ever send funds to from outside the app.
      </P>
      <P>
        Unlike the other two, this is not necessarily an embedded wallet. If you
        have linked an external wallet, that one is preferred as your cash wallet;
        the embedded one is the fallback when you have not. The order of preference
        is a linked external wallet, then a linked embedded wallet, then a
        connected embedded wallet.
      </P>

      <H3>Trading wallet</H3>
      <P>
        A separate embedded wallet that acts purely as a signer on Polygon. It
        proves you are you when the app opens a trading session and when it
        authorises orders. It is deliberately not where your balance lives, and
        it usually holds nothing at all.
      </P>

      <H3>Trading proxy</H3>
      <P>
        The venue gives each signer a deterministic wallet of its own, referred
        to in the code as the <em>funder</em> or deposit wallet. It is a contract
        rather than a key you hold, computed with <C>CREATE2</C> from a deposit
        wallet factory and the trading wallet&rsquo;s address, so it is always the
        same address for the same account and no transaction is needed to know it
        in advance. This is the wallet that actually holds collateral and your
        positions.
      </P>
      <P>
        Once derived it is cached in the browser under a per-signer key, which is
        also how the profile page knows to include it when totalling your
        portfolio.
      </P>
      <P>
        It also explains a message you may see if a trade stops partway: funds
        described as sitting &ldquo;in the trading proxy&rdquo; are yours and
        are recoverable, they are simply one hop short of where they were headed.
      </P>

      <Note>
        The app refuses to open a session if the derived proxy comes back equal to
        the signer address, because that would mean trading directly from the
        signer rather than through the proxy. That check is why you occasionally
        see &ldquo;Could not open the trading proxy wallet&rdquo; instead of a
        stranger failure later on.
      </Note>

      <H2>Gas, and why you rarely pay it</H2>
      <P>
        Two different chains are involved, and gas is handled differently on each:
      </P>
      <Ul>
        <Li>
          On <strong className="text-white">Polygon</strong>, orders and approvals
          go through the venue&rsquo;s gasless relayer. Your trading wallet signs
          and the relayer pays, so you never need to hold <C>POL</C>.
        </Li>
        <Li>
          On <strong className="text-white">Robinhood Chain</strong>, some
          transfers are sponsored by the app&rsquo;s own server route, but you
          should still keep a small <C>ETH</C> balance in the cash wallet for
          sends you initiate yourself.
        </Li>
      </Ul>

      <H2>Trading credentials</H2>
      <P>
        Before it can place orders, the app has to prove control of the trading
        wallet to the venue&rsquo;s order book. It does this by signing a typed
        message and exchanging it for API credentials:
      </P>
      <Code title="The credential handshake, in order">{`1. Sign an EIP-712 "ClobAuth" message with the trading wallet
2. Exchange that signature for CLOB API credentials
3. Cache the credentials in the browser for reuse
4. Open a client bound to the proxy wallet as the funder
5. Set the one-time token approvals the venue needs`}</Code>
      <P>
        Steps two and five are the slow ones, which is why the first trade in a
        session takes noticeably longer than the ones after it. Credentials are
        cached locally; if the venue later rejects them, the app discards them and
        redoes the handshake automatically.
      </P>
      <P>
        The approvals in step five let the venue move your collateral and your
        outcome shares when an order fills. They are set once and are idempotent,
        so repeating them is harmless.
      </P>

      <P>
        Next, see{" "}
        <A to="/concepts/tokens">money and tokens</A>{" "}
        for what moves between these wallets.
      </P>
    </>
  );
}

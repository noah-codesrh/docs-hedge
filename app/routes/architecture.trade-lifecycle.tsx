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
  Ul,
} from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Trade lifecycle",
    description: "Every hop a buy and a cash-out make, and where funds rest if one is interrupted.",
  });
}

export default function TradeLifecycle() {
  return (
    <>
      <PageTitle
        eyebrow="Architecture"
        title="Trade lifecycle"
        intro="Both directions cross two chains and an order book. This page follows each hop in order, names the service responsible, and marks the points where funds can come to rest."
      />

      <H2>Opening the session</H2>
      <P>
        Before any order, the app needs a session against the venue. This runs
        once and is reused:
      </P>
      <Code title="Session setup">{`1. Switch the trading wallet's provider to Polygon
2. Derive the trading proxy (funder) from the signer address
3. Load cached CLOB credentials, or sign an EIP-712 "ClobAuth"
   message and exchange it for fresh ones
4. Open a secure client bound to the proxy as the funder
5. Set the CTF and collateral approvals the venue requires`}</Code>
      <P>
        Steps three and five are the expensive ones. Credentials are cached in the
        browser; if the venue later rejects them the app clears the cache and
        redoes the handshake once before giving up. Approvals are idempotent
        on-chain, so repeating them is harmless.
      </P>
      <P>
        Authorisation headers are built per request rather than once, because two
        different credentials are combined: a builder HMAC for order attribution
        and a relayer API key that makes proxy transfers gasless. Both are fetched
        through server routes, and the builder signer is rebuilt whenever the
        Privy access token rolls over.
      </P>

      <H2>Buying</H2>
      <P>
        Stages reported to the UI are <C>setup</C>, <C>debit</C>, <C>convert</C>,
        and <C>fill</C>.
      </P>

      <Code title="runLiveTrade, in app/lib/trade/live.ts">{`read the proxy's pUSD balance first
  >= $1 and covers the order?  -> skip ahead to the fill

GET  /api/pm/status          refuse early if the venue is down
POST /api/relay/quote        USDG on 4663 -> pUSD on 137, via permit
executeRelayQuote            sign permits, submit steps
POST /api/relay/forward      hand signed steps back to Relay
GET  /api/relay/status       poll until Relay reports success
waitForPusd                  poll the proxy until the pUSD lands

size the order against the live proxy balance
estimate the price, derive a maximum
placeMarketOrder             fill-or-kill buy, with the builder code`}</Code>

      <H3>Notes on the buy</H3>
      <Ul>
        <Li>
          <strong className="text-white">The conversion is often skipped.</strong>{" "}
          The proxy balance is read first, and if it already holds at least a
          dollar and covers the order — with a small slack allowance — Relay is not
          involved at all. This is why retrying an interrupted trade is fast and
          does not convert twice.
        </Li>
        <Li>
          The conversion is requested against your own wallets. The server checks
          that both the origin and the destination belong to the authenticated
          user before it will quote.
        </Li>
        <Li>
          A buy carries a <strong className="text-white">maximum</strong> price
          derived from an estimate, or from the displayed price plus a buffer. This
          is the slippage guard; a book that has moved too far causes a rejection
          rather than a bad fill.
        </Li>
        <Li>
          The order is sized against the proxy&rsquo;s live balance rather than the
          amount typed, so a conversion that delivered slightly less than quoted
          cannot produce an order the balance will not cover.
        </Li>
        <Li>
          Settlement is waited on only briefly. The fill amounts the venue reports
          are final regardless.
        </Li>
        <Li>
          If the order fails after the conversion succeeded, <C>pUSD</C> stays in
          the proxy and the error says so. Retrying spends that balance.
        </Li>
      </Ul>

      <H2>Closing a position</H2>
      <P>
        Stages reported to the UI are <C>sell</C>, <C>move</C>, <C>convert</C>, and{" "}
        <C>arrive</C>.
      </P>
      <Code title="runClosePosition, in app/lib/trade/close.ts">{`GET /api/pm/status           check the venue is healthy
ensure approvals are set
estimate the sell price, derive a minimum
placeMarketOrder             fill-or-kill sell

then the cash-out path below, from the proxy onwards`}</Code>
      <P>
        Selling rounds the share amount down before submitting. A quantity even
        slightly above the real position triggers a balance rejection from the
        venue that reads confusingly like an allowance problem, so the code avoids
        provoking it.
      </P>

      <H2>Cashing out</H2>
      <P>
        This is the second half of a close, and also runs on its own when a
        balance is stranded:
      </P>
      <Code title="runCashOut, in app/lib/trade/close.ts">{`1. Sweep any pUSD held by the signer into the proxy
     (sponsored through /api/pm/sponsor-tx if needed)
2. Require at least $1 of pUSD in the proxy
3. POST /api/relay/quote with direction "out"
     -> yields a deposit address and a request id
4. Transfer the proxy's pUSD to that deposit address
     via the venue's gasless relayer
5. GET /api/relay/status until Relay reports success
6. Poll the cash wallet's USDG balance until it rises`}</Code>

      <Note kind="warning" title="Step 4 is the fragile one">
        The transfer is submitted to the venue&rsquo;s relayer, which estimates
        gas, signs, and broadcasts to Polygon. That can take longer than the SDK
        is willing to wait, and the SDK does not retry this kind of request. A
        timeout there means the app gave up watching — not necessarily that the
        transfer failed. Confirm against the proxy balance before concluding
        anything.
      </Note>

      <H2>Resting points, summarised</H2>
      <P>
        An interrupted flow always leaves funds at one of three places, all of
        them addresses the user controls:
      </P>
      <Ul>
        <Li>
          <strong className="text-white">Cash wallet</strong>, as <C>USDG</C> —
          nothing happened, or a conversion was refunded.
        </Li>
        <Li>
          <strong className="text-white">Trading proxy</strong>, as <C>pUSD</C>{" "}
          — the common case. Retry the buy to spend it, or cash out to convert it
          back.
        </Li>
        <Li>
          <strong className="text-white">In transit through Relay</strong> — it
          will arrive; polling is only observation, not a condition of delivery.
        </Li>
      </Ul>
      <P>
        The user-facing version of this table is in{" "}
        <A to="/guides/cashing-out">closing and cashing out</A>.
      </P>
    </>
  );
}

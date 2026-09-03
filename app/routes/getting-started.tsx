import {
  A,
  C,
  Card,
  Cards,
  H2,
  Li,
  Note,
  P,
  PageTitle,
  Step,
  Steps,
  Ul,
} from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "How to get started with predicting on Hedge",
    description:
      "Sign in, fund your wallet, pick a market, and place your first prediction on Hedge.",
  });
}

export default function GettingStartedPredicting() {
  return (
    <>
      <PageTitle
        eyebrow="Getting started"
        title="How to get started with predicting on Hedge"
        intro="From a new browser to a live position. You will sign in, put USDG in the wallet the app gives you, pick a side on a market, and confirm. Nothing here asks you to manage a seed phrase."
      />

      <P>
        Hedge is a prediction market you trade in dollars. Every market is a
        question with two sides, <C>Yes</C> and <C>No</C>. Buying a side gives
        you shares in that outcome. A share pays $1.00 if that side is right and
        nothing if it is not, so a price of 40&cent; is the market saying the
        outcome looks about 40% likely.
      </P>
      <P>
        Start on spot. On listed markets the panel also offers 2x and 3x.
        That path is{" "}
        <A to="/leverage/overview">Leverage markets</A>.
      </P>

      <Steps>
        <Step n={1} title="Open Hedge and tap Get Started">
          <P>
            Go to{" "}
            <A href="https://hedgeapp.trade">hedgeapp.trade</A>. On a phone, the
            menu is the hamburger in the top right. On a larger screen,{" "}
            <C>Get Started</C> sits in the header.
          </P>
          <P>
            Sign in with an email code, with Google, X, or Discord, or by
            connecting a wallet you already have. Hedge creates the wallets it
            needs in the background either way. There is no seed phrase to write
            down.
          </P>
        </Step>

        <Step n={2} title="Put cash in the wallet">
          <P>
            Trading spends <C>USDG</C> on Robinhood Chain. That is the only
            token a buy will take. Two ways to get it there:
          </P>
          <Ul>
            <Li>
              <strong className="text-white">Deposit USDG.</strong> Open{" "}
              <C>Profile</C> or tap <C>Deposit</C> in the header, copy the
              address, and send <C>USDG</C> on Robinhood Chain (chain id{" "}
              <C>4663</C>). Sending the same address on another network will not
              show up as cash.
            </Li>
            <Li>
              <strong className="text-white">
                Convert a token you already hold.
              </strong>{" "}
              On <C>Profile</C>, switch the Polymarket / Swap toggle to{" "}
              <C>Swap</C>. Any Robinhood Chain token in that wallet can be
              quoted into <C>USDG</C>. Confirm the amount, then wait for the
              cash to land.
            </Li>
          </Ul>
          <P>
            When it has landed, the header shows it as{" "}
            <strong className="text-white">Cash</strong>. A few dollars is
            enough for a first trade. The venue will not take an order under
            about a dollar.
          </P>
        </Step>

        <Step n={3} title="Pick a market">
          <P>
            The home page is the market list. Search, or filter by category.
            Open anything you have a view on. Each card shows the question and
            the current <C>Yes</C> / <C>No</C> prices in cents.
          </P>
        </Step>

        <Step n={4} title="Choose a side and an amount">
          <P>
            In the trade panel, tap <C>Yes</C> or <C>No</C>, then type a dollar
            amount. The panel shows the shares that amount buys and what those
            shares pay if you are right. That share count comes from the live
            book, not a back-of-the-envelope divide, so it is what you would
            actually get.
          </P>
        </Step>

        <Step n={5} title="Confirm, and leave the tab open">
          <P>
            Tap buy and stay on the page while the steps run. The first trade is
            the slow one: Hedge has to open a trading session and convert{" "}
            <C>USDG</C> into the token the venue settles in. Both of those are
            cached, so the next buy is faster.
          </P>
          <P>
            On success you hold a position. It shows on that market and under{" "}
            <C>Profile</C>.
          </P>
        </Step>

        <Step n={6} title="Sell when you want out">
          <P>
            You do not have to wait for the question to resolve. Closing sells
            your shares at the going rate and returns the proceeds as{" "}
            <C>USDG</C> in your cash wallet. If leftover venue-side funds are
            sitting as <C>pUSD</C>, <C>Cash out</C> on Profile moves them back
            the same way.
          </P>
        </Step>
      </Steps>

      <H2>Ask Hedgie first</H2>
      <P>
        Not sure which market to open? Tap the Hedgie icon or go to{" "}
        <A href="https://hedgeapp.trade/ai">hedgeapp.trade/ai</A>. The copilot
        reads the live book, explains spot vs leverage, and can hand you a ticket
        with <C>Review &amp; open</C>. Full guide:{" "}
        <A to="/guides/hedgie">Hedgie</A>.
      </P>

      <H2>What a first trade feels like</H2>
      <Ul>
        <Li>
          <strong className="text-white">It is not one click.</strong> A buy
          crosses two chains and an order book. You will watch a short sequence
          rather than an instant fill.
        </Li>
        <Li>
          <strong className="text-white">
            Selling immediately usually loses a little.
          </strong>{" "}
          You buy the ask and sell the bid. That gap is the spread, not a hidden
          fee, and a brand-new position can show a small loss for that reason
          alone.
        </Li>
        <Li>
          <strong className="text-white">
            If something fails, the money is still yours.
          </strong>{" "}
          A conversion that already ran sits in your Polymarket wallet. The next
          Buy spends that balance instead of converting again.
        </Li>
      </Ul>

      <Note kind="warning" title="Do not close the tab mid-trade">
        The steps are driven from the browser. Leaving while funds are converting
        or filling can stop the flow one hop short. Nothing is lost, but you
        will need to tap Buy again, or Cash out, before the money is spendable.
      </Note>

      <H2>If you get stuck</H2>
      <Ul>
        <Li>
          Deposit not showing: confirm the send was <C>USDG</C> on Robinhood
          Chain, to the address under <C>Deposit</C>. Details in{" "}
          <A to="/guides/adding-funds">Adding funds</A>.
        </Li>
        <Li>
          A token will not convert: some holdings on that chain have no route
          into <C>USDG</C> yet. Try a more liquid token, or deposit{" "}
          <C>USDG</C> directly.
        </Li>
        <Li>
          Need a person: email{" "}
          <A href="mailto:support@hedgeapp.trade">support@hedgeapp.trade</A>.
        </Li>
      </Ul>

      <H2>Go deeper</H2>
      <Cards>
        <Card to="/guides/placing-a-trade" title="Placing a trade">
          What each confirmation step is doing, and what a rejection actually
          means.
        </Card>
        <Card to="/guides/cashing-out" title="Closing and cashing out">
          Sell a position and move the money back to USDG.
        </Card>
        <Card to="/concepts/markets" title="Markets and prices">
          What a cent-price is saying, and how shares pay out.
        </Card>
        <Card to="/concepts/tokens" title="Money and tokens">
          Why a buy converts USDG, and where the funds sit while it does.
        </Card>
      </Cards>
    </>
  );
}

import { A, C, H2, Li, Note, P, PageTitle, Step, Steps, Ul } from "../components/prose";

export function meta() {
  return [
    { title: "Quick start · Hedge Docs" },
    {
      name: "description",
      content: "Sign in, add funds, and place your first trade on Hedge.",
    },
  ];
}

export default function QuickStart() {
  return (
    <>
      <PageTitle
        eyebrow="Getting started"
        title="Quick start"
        intro="Four steps from a cold start to holding a position. Everything here happens in the browser, and none of it requires you to manage a private key."
      />

      <Steps>
        <Step n={1} title="Sign in">
          <P>
            Open the app and choose <C>Get Started</C>. Sign in with an email
            one-time code, with Google, X, or Discord, or by connecting a wallet you
            already have. Either way the wallets the app needs are created for you
            in the background, so there is no seed phrase to record.
          </P>
        </Step>

        <Step n={2} title="Add funds">
          <P>
            Go to <C>Profile</C> and copy your deposit address, then send{" "}
            <C>USDG</C> to it on Robinhood Chain. Keep a small amount of{" "}
            <C>ETH</C> in the same wallet, because that chain charges gas in ETH
            for transfers you send yourself.
          </P>
          <P>
            Your balance appears as <strong className="text-white">Cash</strong>{" "}
            in the header once the deposit confirms. The{" "}
            <A to="/guides/adding-funds">full funding guide</A>{" "}
            covers what to do if it does not show up.
          </P>
        </Step>

        <Step n={3} title="Place a trade">
          <P>
            Open a market, pick <C>Yes</C> or <C>No</C>, and type an amount. The
            panel shows how many shares that buys before you commit. Confirm, and
            leave the tab open while the steps run.
          </P>
          <P>
            The first trade is the slow one. It has to set up your trading
            session and convert funds for the first time, and both of those are
            cached afterwards.
          </P>
        </Step>

        <Step n={4} title="Sell when you want out">
          <P>
            Positions appear on the market page and in <C>Profile</C>. Closing
            sells your shares at the going rate and returns the proceeds as{" "}
            <C>USDG</C>. You do not have to wait for the question to resolve.
          </P>
        </Step>
      </Steps>

      <H2>What to expect the first time</H2>
      <Ul>
        <Li>
          <strong className="text-white">A trade is not instant.</strong> It
          crosses two chains and an order book. Expect to watch a short sequence
          of steps rather than a single click.
        </Li>
        <Li>
          <strong className="text-white">
            You will not get every cent back if you sell immediately.
          </strong>{" "}
          Buying pays the asking price and selling receives the bid, and the gap
          between them is a real cost even when the market has not moved.{" "}
          <A to="/concepts/positions">Positions and P&amp;L</A>{" "}
          explains why a brand new position can show a small loss.
        </Li>
        <Li>
          <strong className="text-white">Small amounts can be rejected.</strong>{" "}
          The venue enforces a minimum order size, and a conversion needs at
          least a dollar to be worth doing.
        </Li>
      </Ul>

      <Note kind="warning" title="Do not close the tab mid-trade">
        The steps are driven from the browser. If you navigate away while a trade
        is converting or filling, it can stop partway and leave your funds
        one hop short of where they were going. Nothing is lost, but you will need
        to finish the flow before the money is spendable again.
      </Note>
    </>
  );
}

import { NAV } from "../lib/nav";
import {
  A,
  C,
  Card,
  Cards,
  H2,
  Note,
  P,
  PageTitle,
} from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Hedge Docs",
    description:
      "Hedge brings leveraged perpetual trading to prediction markets. Trade news, elections, and global events in USDG on Robinhood Chain.",
    bare: true,
  });
}

export default function Introduction() {
  return (
    <>
      <PageTitle
        eyebrow="Getting started"
        title="Welcome to Hedge"
        intro="Trade Yes/No event markets in USDG on Robinhood Chain. Spot is 1x on the venue book. Listed markets also offer 2x and 3x against the vault."
      />

      <P>
        <strong className="text-white">Spot</strong> buys real shares.{" "}
        <strong className="text-white">Leverage</strong> is synthetic margin
        vs LPs, on listed markets only.{" "}
        <A to="/getting-started">Get started</A>, or read{" "}
        <A to="/why">Why Hedge</A>.
      </P>

      <H2>What you actually trade</H2>
      <P>
        Every market is a question with two sides, <C>Yes</C> and <C>No</C>.
        Buying a side gives you shares in that outcome. A share pays out $1.00 if
        the outcome happens and nothing if it does not, so a share priced at
        40&cent; is the market&rsquo;s way of saying the outcome looks roughly 40%
        likely.
      </P>
      <P>
        That single fact explains most of the interface. A price is a probability
        quoted in cents. The number of shares your money buys is the amount
        divided by the price. Your position is worth what someone else will
        currently pay for those shares, which is why its value moves before the
        question is ever settled.
      </P>
      <P>
        2x/3x uses the same price. You do not hold the shares. Margin controls
        a larger size; the vault takes the other side.
      </P>

      <H2>One balance, one chain</H2>
      <P>
        Cash is <C>USDG</C> on Robinhood Chain. Spot converts to the venue
        token and back. See <A to="/concepts/tokens">Money and tokens</A>.
        Levered margin never leaves this chain.
      </P>

      <Note>
        Nothing in these docs is financial advice, and none of it is a guarantee
        about how a market will resolve or what a position will be worth.
      </Note>

      <H2>Where to start</H2>
      <Cards>
        <Card
          to="/getting-started"
          title="How to get started with predicting on Hedge"
        >
          Sign in, fund the wallet, pick a market, and place a first trade.
          Read this and stop if you are only here to use the app.
        </Card>
        <Card to="/why" title="Why Hedge">
          Traders, LPs, and makers, and what is live.
        </Card>
        <Card to="/guides/hedgie" title="Hedgie">
          Ask the prediction copilot. Live odds, leverage context, and tickets
          you still open yourself.
        </Card>
        <Card to="/leverage/overview" title="Leverage markets">
          Margin, fees, liquidation, and how 2x/3x differs from spot.
        </Card>
        <Card to="/leverage/earn" title="Earning as an LP">
          Deposit USDG. Back levered tickets. Earn fees and losses.
        </Card>
        <Card to="/leverage/mathematics" title="The mathematics">
          Sizing, carry, liquidation, and vault share accounting.
        </Card>
      </Cards>

      <H2>How to read these docs</H2>
      <P>
        Guides first if you just want to trade. Concepts for the vocabulary.
        Leverage for traders, LPs, and future makers.
      </P>

      <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {NAV.filter((section) => section.title !== "Getting started").map(
          (section) => (
            <div key={section.title}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                {section.title}
              </p>
              <ul className="mt-2.5 space-y-2">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <A to={item.to}>{item.title}</A>
                    <span className="mt-0.5 block text-[13px] leading-snug text-[#8f8f8f]">
                      {item.summary}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
      </div>
    </>
  );
}

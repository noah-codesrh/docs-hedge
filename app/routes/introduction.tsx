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
        intro="Hedge brings high-leverage perpetual trading to prediction markets. Trade major news, elections, and global events in USDG on Robinhood Chain. Prediction markets capped you at 1x — Hedge is the leverage layer for event betting."
      />

      <P>
        There are two products described in these docs, and it is worth knowing
        which is which before you read further.{" "}
        <strong className="text-white">Spot trading is live:</strong> deposit
        dollar-denominated funds, buy the side of a question you think is right,
        and sell when you want out.{" "}
        <strong className="text-white">Leverage is built but not open yet</strong>{" "}
        — the contracts are deployed and unaudited, and the feature is switched
        off in the build.
      </P>
      <P>
        The reasoning behind the whole thing is on{" "}
        <A to="/why">Why Hedge</A>. If you just want to place a trade, skip to{" "}
        <A to="/quick-start">Quick start</A>.
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
        Leverage changes what that exposure costs you rather than what it is. A
        leveraged position is synthetic — priced against the same outcome, but you
        do not hold the shares, and a small deposit controls a larger position.
      </P>

      <H2>One balance, one chain</H2>
      <P>
        Your funds are held as <C>USDG</C> on Robinhood Chain and stay
        denominated that way throughout. Spot trades convert into the token the
        underlying markets settle in and back again, which is the single most
        important thing to understand about how the app behaves; it has{" "}
        <A to="/concepts/tokens">a page of its own</A>. Leveraged positions never
        leave the chain at all.
      </P>

      <Note>
        Nothing in these docs is financial advice, and none of it is a guarantee
        about how a market will resolve or what a position will be worth.
      </Note>

      <H2>Where to start</H2>
      <Cards>
        <Card to="/quick-start" title="Quick start">
          Sign in, add funds, and place a first trade. Read this and stop if you
          are only here to use the app.
        </Card>
        <Card to="/why" title="Why Hedge">
          The gap this is built to fill, and an honest table of what is live
          versus what is intended.
        </Card>
        <Card to="/leverage/overview" title="Leverage markets">
          Margin, position size, carry, and liquidation — plus the vault that
          backs it all.
        </Card>
        <Card to="/leverage/mathematics" title="The mathematics">
          Every formula behind sizing, carry, liquidation, and the vault&rsquo;s
          share accounting.
        </Card>
      </Cards>

      <H2>How to read these docs</H2>
      <P>
        The sections are ordered so you can stop whenever you have what you need.
        Guides are task-shaped and safe to follow blind. Concepts explain the
        vocabulary behind them. The Leverage section is deeper and assumes you
        have read the concepts first.
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

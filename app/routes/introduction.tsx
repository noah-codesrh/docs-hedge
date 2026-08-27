import { NAV } from "../lib/nav";
import {
  A,
  C,
  Card,
  Cards,
  Flow,
  FlowArrow,
  FlowStep,
  H2,
  Li,
  Note,
  P,
  PageTitle,
  Ul,
} from "../components/prose";

export function meta() {
  return [
    { title: "Introduction · Hedge Docs" },
    {
      name: "description",
      content:
        "What Hedge is, the vocabulary the rest of the documentation uses, and where to go next.",
    },
  ];
}

export default function Introduction() {
  return (
    <>
      <PageTitle
        eyebrow="Getting started"
        title="Trade prediction markets, in dollars"
        intro="Hedge is an app for trading prediction markets. You deposit dollar-denominated funds, buy the side of a question you think is right, and sell when you want out. This documentation covers how to use it and how it is built."
      />

      <Flow caption="One round trip, end to end">
        <FlowStep label="Deposit" sub="USDG" tone="gold" />
        <FlowArrow />
        <FlowStep label="Convert" sub="to pUSD" />
        <FlowArrow />
        <FlowStep label="Buy" sub="yes / no" />
        <FlowArrow />
        <FlowStep label="Hold" sub="marked live" />
        <FlowArrow />
        <FlowStep label="Sell" sub="back to pUSD" />
        <FlowArrow />
        <FlowStep label="Cash out" sub="USDG" tone="gold" />
      </Flow>

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

      <H2>The shape of the system</H2>
      <P>
        Hedge is one web application, built with React Router and served
        server-side. It talks to a handful of outside services, and each one has a
        clear job:
      </P>
      <Ul>
        <Li>
          <strong className="text-white">Polymarket</strong> supplies the markets,
          the prices, the order book, and the venue where orders are matched and
          positions are held.
        </Li>
        <Li>
          <strong className="text-white">Privy</strong> handles sign-in and
          creates the wallets that hold your funds, so there is no seed phrase to
          write down.
        </Li>
        <Li>
          <strong className="text-white">Relay</strong> moves value between the
          chain your cash sits on and the chain the markets settle on.
        </Li>
        <Li>
          <strong className="text-white">Supabase</strong> stores a small amount
          of app data such as trade records and display names.
        </Li>
      </Ul>
      <P>
        Your funds are held as <C>USDG</C> on Robinhood Chain. Polymarket settles
        in its own collateral token on Polygon. A trade therefore involves a
        conversion between the two, which is the single most important thing to
        understand about how the app behaves, and it has{" "}
        <A to="/concepts/tokens">a page of its own</A>.
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
        <Card to="/architecture/overview" title="System overview">
          The app, its server routes, and the services behind them. Start here if
          you are changing the code.
        </Card>
      </Cards>

      <H2>How to read these docs</H2>
      <P>
        The sections are ordered so you can stop whenever you have what you need.
        Guides are task-shaped and safe to follow blind. Concepts explain the
        vocabulary behind them. Architecture and Reference are for people changing
        or operating the code.
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

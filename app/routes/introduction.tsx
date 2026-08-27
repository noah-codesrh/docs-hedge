import { Link } from "react-router";
import { NAV } from "../lib/nav";
import { C, H2, P, PageTitle, Ul, Li, Note } from "../components/prose";

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
        title="Introduction"
        intro="Hedge is an app for trading prediction markets. You deposit dollar-denominated funds, buy the side of a question you think is right, and sell when you want out. This documentation covers how to use it and how it is built."
      />

      <H2>What you actually trade</H2>
      <P>
        Every market is a question with two sides, <C>Yes</C> and <C>No</C>.
        Buying a side gives you shares in that outcome. A share pays out $1.00 if
        the outcome happens and nothing if it does not, so a share priced at 40&cent;
        is the market&rsquo;s way of saying the outcome looks roughly 40% likely.
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
        <Link
          to="/concepts/tokens"
          className="font-semibold text-gold underline decoration-gold/30 underline-offset-2 hover:decoration-gold"
        >
          a page of its own
        </Link>
        .
      </P>

      <Note>
        Nothing in these docs is financial advice, and none of it is a guarantee
        about how a market will resolve or what a position will be worth.
      </Note>

      <H2>How to read these docs</H2>
      <P>
        The sections are ordered so you can stop whenever you have what you need.
        Guides are task-shaped and safe to follow blind. Concepts explain the
        vocabulary behind them. Architecture and Reference are for people
        changing or operating the code.
      </P>

      <div className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
        {NAV.filter((section) => section.title !== "Getting started").map(
          (section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-white/10 bg-card-2 p-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                {section.title}
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      prefetch="intent"
                      className="text-[14px] font-medium text-[#c4c4c4] transition hover:text-gold"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
      </div>

      <H2>Where to start</H2>
      <P>
        If you are here to use the app, read the{" "}
        <Link
          to="/quick-start"
          className="font-semibold text-gold underline decoration-gold/30 underline-offset-2 hover:decoration-gold"
        >
          quick start
        </Link>{" "}
        and stop. If you are here to work on it, skim{" "}
        <Link
          to="/architecture/overview"
          className="font-semibold text-gold underline decoration-gold/30 underline-offset-2 hover:decoration-gold"
        >
          the system overview
        </Link>{" "}
        first, then set up{" "}
        <Link
          to="/operations/local-development"
          className="font-semibold text-gold underline decoration-gold/30 underline-offset-2 hover:decoration-gold"
        >
          a local environment
        </Link>
        .
      </P>
    </>
  );
}

import { Link } from "react-router";
import {
  C,
  Code,
  H2,
  H3,
  Li,
  Note,
  P,
  PageTitle,
  Table,
  Td,
  Tr,
  Ul,
} from "../components/prose";

export function meta() {
  return [
    { title: "Markets and prices · Hedge Docs" },
    {
      name: "description",
      content:
        "Events, markets, outcomes, order books, and what a price actually represents.",
    },
  ];
}

export default function Markets() {
  return (
    <>
      <PageTitle
        eyebrow="Core concepts"
        title="Markets and prices"
        intro="A price on Hedge is a probability wearing a dollar sign. This page explains the data model behind the market pages and where the numbers come from."
      />

      <H2>Events, markets, and outcomes</H2>
      <P>
        The data has three levels, and the interface mirrors them:
      </P>
      <Table head={["Level", "Meaning", "Example"]}>
        <Tr>
          <Td>
            <strong className="text-white">Event</strong>
          </Td>
          <Td>A subject that groups related questions</Td>
          <Td>A given election</Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Market</strong>
          </Td>
          <Td>One binary question that resolves Yes or No</Td>
          <Td>Will candidate X win?</Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Outcome</strong>
          </Td>
          <Td>A tradeable side of that question</Td>
          <Td>
            <C>Yes</C> or <C>No</C>
          </Td>
        </Tr>
      </Table>
      <P>
        An event with a single market renders as one card. An event with many
        markets renders as a list of candidates, each with its own pair of prices.
        Every outcome has a token id, and that id is what identifies the thing you
        actually buy and sell.
      </P>

      <H2>What a price means</H2>
      <P>
        Prices run between $0.00 and $1.00 and are displayed in cents. A share
        pays $1.00 if its outcome happens, so the price is the market&rsquo;s
        estimate of the probability. The two sides of a market are complementary:
        if <C>Yes</C> trades at 60&cent;, <C>No</C> is priced around 40&cent;.
      </P>
      <P>
        Buying $10 of a 40&cent; outcome therefore gets you roughly 25 shares,
        which pay $25 if the outcome happens and nothing if it does not.
      </P>

      <H2>The order book</H2>
      <P>
        Markets are not priced by a formula. There is a real order book with two
        sides, and the single &ldquo;price&rdquo; on a card is a summary of it:
      </P>
      <Ul>
        <Li>
          <strong className="text-white">Bids</strong> are what buyers are
          offering. Selling into the book fills against these.
        </Li>
        <Li>
          <strong className="text-white">Asks</strong> are what sellers are
          asking. Buying fills against these.
        </Li>
        <Li>
          The <strong className="text-white">spread</strong> is the gap between
          the best bid and the best ask, and the midpoint between them is the
          quoted price.
        </Li>
      </Ul>

      <Note title="Why the quoted price is not the price you pay">
        A market order eats the book from the best price outward. If you buy more
        than is available at the best ask, the rest fills at worse prices and your
        average is higher than the quote. Hedge accounts for this by walking the
        actual book to work out how many shares your money buys, rather than
        dividing the amount by the quoted price.
      </Note>

      <H3>Depth and slippage</H3>
      <P>
        Thin markets have little size resting at each price, so even a modest
        order moves through several levels. This is normal and is not a fee. It is
        the reason the shares estimate can change between typing an amount and
        confirming it, and the reason an unusually large order in a quiet market
        may not fill at all.
      </P>

      <H2>Where the data comes from</H2>
      <P>
        Market data is Polymarket&rsquo;s, fetched through the app&rsquo;s own
        server routes rather than directly from the browser. That keeps upstream
        hosts and any keys off the client and lets responses be cached briefly.
      </P>
      <Code title="Server routes backing the market pages">{`GET /api/events        listings, filtered by tag and sort
GET /api/quotes        current prices for a set of markets
GET /api/pm/book       raw order book for one or more token ids`}</Code>
      <P>
        Full parameters and responses are in the{" "}
        <Link
          to="/reference/api"
          className="font-semibold text-gold underline decoration-gold/30 underline-offset-2 hover:decoration-gold"
        >
          HTTP API reference
        </Link>
        .
      </P>

      <H2>Market states</H2>
      <P>
        Not every market can be traded. The app checks whether a market is live
        before enabling the buy panel, and a market that is closed, resolved, or
        missing a valid price renders as read-only. If Polymarket&rsquo;s order
        book is down for maintenance the app reports that explicitly instead of
        letting an order fail in a confusing way.
      </P>
    </>
  );
}

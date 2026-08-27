import {
  A,
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
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Market makers",
    description:
      "Where liquidity comes from today, and what a market maker programme would require that does not yet exist.",
  });
}

export default function MarketMakers() {
  return (
    <>
      <PageTitle
        eyebrow="Leverage"
        title="Market makers"
        intro="This page is here to be clear about a gap. Hedge has no market maker programme, no market maker interface, and no incentive scheme — none of it exists in the code. What follows is where liquidity actually comes from today, and what would have to be built for designated market making to mean anything."
      />

      <Note kind="warning" title="Nothing here is implemented">
        There is no contract, route, configuration, or interface for market makers
        anywhere in the repository. If you are reading this looking for how to
        register as one, the answer is that you cannot, because the concept does
        not exist yet.
      </Note>

      <H2>Where liquidity comes from today</H2>
      <P>
        Two different mechanisms, depending on which product you are using, and
        neither involves a market maker relationship with Hedge.
      </P>
      <Table head={["Product", "Liquidity source", "Hedge's role"]}>
        <Tr>
          <Td>Spot trading</Td>
          <Td>
            The market venue&rsquo;s own central limit order book, populated by
            whoever is quoting there
          </Td>
          <Td>
            None. Hedge routes an order to the venue and takes whatever is resting
            on the book.
          </Td>
        </Tr>
        <Tr>
          <Td>Leverage</Td>
          <Td>The vault, as sole counterparty</Td>
          <Td>
            Hedge sets the price from a relayed feed and the vault takes the other
            side of every position.
          </Td>
        </Tr>
      </Table>

      <H3>Spot: Hedge is a taker, not a venue</H3>
      <P>
        For spot trades Hedge places fill-or-kill market orders against the
        venue&rsquo;s book. The depth you trade against belongs to that venue, and
        the spread you pay is theirs. Hedge does not quote, does not hold
        inventory, and has no ability to offer anyone a rebate for quoting —
        there is no book of its own to quote into.
      </P>
      <P>
        The one thing Hedge does do is read that book honestly. Before you commit,
        the panel walks the resting orders to simulate what your size would
        actually fill at, rather than quoting the top of book and letting you
        discover the difference afterwards.{" "}
        <A to="/concepts/markets">Markets and prices</A> covers this.
      </P>

      <H3>Leverage: the vault is the only counterparty</H3>
      <P>
        A leveraged position has no counterparty trader. The vault takes the entire
        other side, at a price derived from the relayed feed plus a fixed spread.
        There is no order book, so there is nothing for a third party to make a
        market in.
      </P>
      <P>
        This is a deliberate simplification and it has a real consequence: pricing
        quality depends entirely on the feed and on the fixed spread, not on
        competition between quoters. A tighter spread cannot be achieved by
        attracting better market makers, because there are none to attract.
      </P>

      <H2>What a market maker programme would require</H2>
      <P>
        Set out plainly, because the distance is larger than it might appear. None
        of this exists.
      </P>
      <Ul>
        <Li>
          <strong className="text-white">An order book of Hedge&rsquo;s
          own,</strong> or a quoting interface into the leverage engine. Today the
          engine prices from a feed and a constant; there is no mechanism for a
          third party to offer a better price.
        </Li>
        <Li>
          <strong className="text-white">Identity and permissioning</strong> for
          designated participants, with the obligations that make the designation
          mean something — quote presence, maximum spread, minimum size.
        </Li>
        <Li>
          <strong className="text-white">Measurement.</strong> Uptime, spread, and
          depth would have to be recorded on-chain or attested, since an incentive
          paid against unmeasured obligations is just a transfer.
        </Li>
        <Li>
          <strong className="text-white">An incentive source.</strong> Fees
          currently route entirely to the vault&rsquo;s two tranches. Paying market
          makers means diverting part of that, which changes the return LPs are
          being offered.
        </Li>
        <Li>
          <strong className="text-white">Inventory risk management,</strong> since a
          maker quoting both sides of a binary outcome needs a way to hedge, and
          the only venue for that is the external book Hedge is already taking
          from.
        </Li>
      </Ul>

      <H2>Why the vault is not a market maker</H2>
      <P>
        It is worth being precise about this, because the vault superficially
        resembles an automated market maker and is not one.
      </P>
      <Ul>
        <Li>
          It does not quote a two-sided price and does not adjust its price based
          on its own inventory or flow. The price comes from an external feed.
        </Li>
        <Li>
          It has no pricing curve. There is no bonding function; size is limited by
          hard caps rather than by a price that worsens as you take more.
        </Li>
        <Li>
          It cannot decline a trade on pricing grounds. Within the configured
          limits it takes the other side at the feed price plus the fixed spread,
          whether or not that price is good for it.
        </Li>
      </Ul>
      <P>
        The protections against that are structural rather than economic: the
        tradeable price band, the position and exposure caps, the staleness window,
        and the rule that blocks opening while the on-chain price is catching up to
        a gap. Those are described in{" "}
        <A to="/leverage/overview">Leverage markets</A>.
      </P>

      <H2>If you are evaluating this</H2>
      <P>
        The honest summary is that Hedge currently has one source of leverage
        liquidity — its own vault — and depends on an external venue for spot
        depth. That concentrates two risks worth naming: the vault is exposed to
        informed flow it cannot re-price against, and spot execution quality is
        entirely outside Hedge&rsquo;s control.
      </P>
      <P>
        A market maker programme is the usual answer to the first. It is not
        started.
      </P>
    </>
  );
}

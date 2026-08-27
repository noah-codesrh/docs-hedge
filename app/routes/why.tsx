import {
  A,
  C,
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
    title: "Why Hedge",
    description:
      "Prediction markets capped you at 1x. Hedge is the leverage layer for event outcomes, settled in USDG on Robinhood Chain.",
  });
}

export default function Why() {
  return (
    <>
      <PageTitle
        eyebrow="Getting started"
        title="Why Hedge"
        intro="Prediction markets are growing quickly and are missing one thing: leverage. Event betting is stuck on static 1x outcome tokens, priced between zero and one dollar, with capital locked up at low velocity. Hedge is being built to change that."
      />

      <H2>Robinhood brought a dollar onchain</H2>
      <P>
        <C>USDG</C> is in wallets. The chain is live. What is missing is the
        market those users would actually want to trade.
      </P>
      <P>
        There is no native Yes/No. No way to take a view on an election, a game,
        or a print, using the balance you already hold. The deepest prediction
        books in the world sit elsewhere, and reaching them from Robinhood means
        bridging, swapping, and giving up the asset you wanted to keep.
      </P>

      <H2>And event markets stayed static</H2>
      <Ul>
        <Li>No leverage.</Li>
        <Li>
          Rigid 1x binary betting — outcome tokens that move between $0 and $1 and
          nothing more.
        </Li>
        <Li>Capital locked up, with low velocity.</Li>
      </Ul>
      <P>
        Traders want leverage, and prediction markets are ready for it. That is
        the whole thesis.
      </P>

      <H2>The idea: a leverage layer, not another venue</H2>
      <P>
        Hedge is a leveraged perpetual layer for event outcomes. Rather than
        capping your conviction at 1x, the intent is to let you go long or short
        with a multiple on major global events — elections, sport, rate decisions,
        regulation, technology milestones — collateralised in <C>USDG</C> on
        Robinhood Chain.
      </P>
      <P>
        The important part is what it is <em>not</em>. Hedge is not a separate
        casino with its own thin book. It is a leverage and access layer over
        liquidity that already trades.
      </P>

      <H3>How existing depth is used</H3>
      <Table head={["Layer", "What it does"]}>
        <Tr>
          <Td>
            <strong className="text-white">Underlying depth</strong>
          </Td>
          <Td>
            Hedge references real outcome tokens on established prediction
            venues, rather than trying to bootstrap a book of its own.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Synthetic perpetuals</strong>
          </Td>
          <Td>
            Fast synthetic futures are written on top of collateral pools, priced
            against those underlying outcomes.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <strong className="text-white">Execution</strong>
          </Td>
          <Td>
            Settled natively on Robinhood Chain in <C>USDG</C>, so the trader
            keeps one balance throughout.
          </Td>
        </Tr>
      </Table>
      <P>
        Because a position is synthetic, you never hold the underlying outcome
        token and no bridging is involved. The mechanics of that are described in{" "}
        <A to="/leverage/overview">Leverage markets</A>.
      </P>

      <H2>Why market makers and liquidity providers belong here</H2>
      <P>
        That architecture is also what makes room for two other participants. A
        leverage layer sitting beside a 1x spot book creates a relationship
        between two prices, and a pool that has to stand behind the leveraged
        side.
      </P>

      <H3>Market makers</H3>
      <P>
        A maker can run delta-neutral between the 1x spot share and the leveraged
        synthetic perpetual, capturing the difference. Fast finality is what makes
        that viable, since the two legs have to be held in line.
      </P>

      <H3>Liquidity providers</H3>
      <P>
        A provider deposits <C>USDG</C> into a passive, single-sided vault and
        earns from trading fees, borrowing costs, and the margin left behind by
        liquidations. Providers supply the inventory that turns a 1x ticket into a
        leveraged one.
      </P>
      <P>
        This is the mechanism behind a claim that would otherwise sound like
        marketing: available leverage scales with what providers actually supply.
        More capital in the layer, more size a trader can run. Makers earn the
        spread, providers underwrite the size, and users keep a single balance.
        The <A to="/leverage/earn">LP page</A> sets out the accounting, and{" "}
        <A to="/leverage/market-makers">Market makers</A> is candid about how much
        of the maker side is built.
      </P>

      <H2>Where this actually stands</H2>
      <Note kind="warning" title="Read the vision and the build separately">
        Everything above is the intent. What is implemented today is narrower, and
        these docs try hard not to blur the two.
      </Note>
      <Table head={["Claim", "Where it stands"]}>
        <Tr>
          <Td>Spot prediction trading in USDG</Td>
          <Td>
            <strong className="text-white">Live.</strong> This is the product you
            can use now, at 1x.
          </Td>
        </Tr>
        <Tr>
          <Td>Leveraged perpetuals on event outcomes</Td>
          <Td>
            <strong className="text-white">Built and deployed, switched
            off.</strong> The contracts exist on Robinhood Chain and are unaudited;
            the feature is disabled in the build.
          </Td>
        </Tr>
        <Tr>
          <Td>Leverage scaling with LP capital</Td>
          <Td>
            <strong className="text-white">Implemented.</strong> A tier schedule
            raises the ceiling as vault size grows, with no intervention.
          </Td>
        </Tr>
        <Tr>
          <Td>Up to 10x</Td>
          <Td>
            <strong className="text-white">A target, not the current
            setting.</strong> The deployed ceiling is 5x and the interface offers
            up to 3x. Raising it is a parameter change, not a redeployment.
          </Td>
        </Tr>
        <Tr>
          <Td>LP vault with fee, carry, and liquidation income</Td>
          <Td>
            <strong className="text-white">Built, deposits closed.</strong>
          </Td>
        </Tr>
        <Tr>
          <Td>Market maker programme</Td>
          <Td>
            <strong className="text-white">Not started.</strong> No contract,
            interface, or incentive scheme exists.
          </Td>
        </Tr>
      </Table>

      <H2>The short version</H2>
      <P>
        Robinhood has the dollar. The prediction markets already exist. Hedge is
        the layer in between.
      </P>
    </>
  );
}

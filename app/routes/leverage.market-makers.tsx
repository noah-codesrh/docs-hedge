import {
  A,
  H2,
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
      "Where Hedge liquidity comes from today, and what a market maker programme would need.",
  });
}

export default function MarketMakers() {
  return (
    <>
      <PageTitle
        eyebrow="Leverage"
        title="Market makers"
        intro="There is no Hedge order book and no maker programme. Spot takes the venue book. Leverage is filled entirely by the vault."
      />

      <Note kind="warning" title="Nothing to register for">
        No contract, route, or rebate exists for designated makers. You cannot
        quote into the leverage engine today.
      </Note>

      <H2>Liquidity today</H2>
      <Table head={["Product", "Who fills you", "Hedge"]}>
        <Tr>
          <Td>Spot (1x)</Td>
          <Td>The venue CLOB</Td>
          <Td>Taker only. Fill-or-kill market orders.</Td>
        </Tr>
        <Tr>
          <Td>Leverage (2x / 3x)</Td>
          <Td>The vault</Td>
          <Td>Prices from the oracle plus a fixed 1% spread.</Td>
        </Tr>
      </Table>
      <P>
        Spot depth and spread are the venue&rsquo;s. Hedge walks the book
        before you confirm so the quoted fill is real. See{" "}
        <A to="/concepts/markets">Markets and prices</A>.
      </P>

      <H2>The vault is not an AMM</H2>
      <Ul>
        <Li>It does not quote two-sided or move price with inventory.</Li>
        <Li>No bonding curve. Size is capped, not repriced.</Li>
        <Li>
          Inside the limits it must take the other side at feed + spread,
          even when that is a bad print for LPs.
        </Li>
      </Ul>
      <P>
        Protection is structural: the $0.35 to $0.65 band, position and 30%
        exposure caps, a 5-minute stale cutoff, and no new opens while the
        on-chain price is catching up a gap. Details in{" "}
        <A to="/leverage/overview">Leverage markets</A>.
      </P>

      <H2>The role that is not built yet</H2>
      <P>
        A maker could sit between the venue 1x share and the Hedge synthetic
        and keep the two in line. That needs a way to quote the engine. There
        is none, so there is no second price to arb.
      </P>
      <P>To make that real, all of this would have to exist:</P>
      <Ul>
        <Li>A Hedge book, or a quoting API into the engine.</Li>
        <Li>Who is allowed to quote, and rules (presence, spread, size).</Li>
        <Li>Measured uptime, spread, and depth. Without that, the rebate is just a transfer.</Li>
        <Li>
          A cut of fees. Those fees currently go 70/30 to senior/junior LPs.
        </Li>
        <Li>A hedge venue. Today that is the same external book Hedge already takes.</Li>
      </Ul>

      <H2>If you are sizing this up</H2>
      <P>
        Leverage liquidity is one pool that cannot re-price against informed
        flow. Spot quality is outside Hedge. A maker programme is the usual
        answer to the first. It is not started. LPs who want the current
        setup: <A to="/leverage/earn">Earning as an LP</A>.
      </P>
    </>
  );
}

import {
  A,
  C,
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
import {
  CapacityFigure,
  TvlLadderFigure,
  VisionFigure,
} from "../components/figures";
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
        intro="Robinhood has a dollar onchain. Prediction markets already have the books. Hedge sits in between: Yes/No in USDG, and 2x or 3x against a vault on listed markets."
      />

      <H2>The vision</H2>
      <P>
        Event tickets were stuck at 1x. Getting to a prediction book from
        Robinhood meant leaving USDG. Hedge is the leverage layer, not a new
        thin venue.
      </P>
      <VisionFigure />
      <Ul>
        <Li>
          <strong className="text-white">Traders</strong> keep one cash
          balance. 1x is real shares. 2x/3x is margin vs the vault.
        </Li>
        <Li>
          <strong className="text-white">LPs</strong> deposit on Earn and
          underwrite that size. More TVL unlocks the next multiple.
        </Li>
        <Li>
          <strong className="text-white">Makers</strong> are the next step:
          quote between venue 1x and the Hedge synthetic. Not built yet.
        </Li>
      </Ul>
      <P>
        Target is 10x on major events, still in <C>USDG</C>. How a ticket
        pays: <A to="/leverage/overview">Leverage markets</A>.
      </P>

      <H2>Why the pool has to grow</H2>
      <P>
        The vault is the only fill for 2x and 3x. A small pool can only back
        a few tickets, and only at 2x. Deposits raise both the multiple and
        how many tickets fit under the 30% lock.
      </P>
      <TvlLadderFigure />
      <CapacityFigure />
      <P>
        Deposit from Earn. Do not send USDG to the vault address.{" "}
        <A to="/leverage/earn">Earning as an LP</A>.
      </P>

      <H2>What is live</H2>
      <Note>
        The UI offers up to 3x. The chain ceiling is 5x. 10x is a parameter
        change once the vault can stand behind it.
      </Note>
      <Table head={["", "Status"]}>
        <Tr>
          <Td>Spot in USDG</Td>
          <Td>
            <strong className="text-white">Live</strong>
          </Td>
        </Tr>
        <Tr>
          <Td>2x / 3x on listed markets</Td>
          <Td>
            <strong className="text-white">Live.</strong> Vault is the only
            counterparty.
          </Td>
        </Tr>
        <Tr>
          <Td>LP vault (Earn)</Td>
          <Td>
            <strong className="text-white">Live.</strong> Deposit on Earn
            only.
          </Td>
        </Tr>
        <Tr>
          <Td>Maker programme</Td>
          <Td>
            <strong className="text-white">Not started</strong>
          </Td>
        </Tr>
      </Table>
    </>
  );
}

import {
  C,
  H2,
  Li,
  Note,
  P,
  PageTitle,
  Step,
  Steps,
  Ul,
} from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Sharing a position",
    description: "Generate a shareable P&L card for a position.",
  });
}

export default function Sharing() {
  return (
    <>
      <PageTitle
        eyebrow="Guides"
        title="Sharing a position"
        intro="Any position can be turned into an image showing the market and how it is doing, rendered in the browser and saved as a file you can post anywhere."
      />

      <Steps>
        <Step n={1} title="Open a position">
          <P>
            Find the position on its market page or on <C>Profile</C>.
          </P>
        </Step>
        <Step n={2} title="Choose share">
          <P>
            A card is composed from the position: the market, the side you are on,
            your entry, and the current profit or loss.
          </P>
        </Step>
        <Step n={3} title="Save or share it">
          <P>
            The card is rendered to an image in the browser. Download it, or use
            your device&rsquo;s share sheet on mobile.
          </P>
        </Step>
      </Steps>

      <H2>What is on the card</H2>
      <Ul>
        <Li>The market question and the outcome you hold.</Li>
        <Li>Your entry price and the current price.</Li>
        <Li>
          Profit or loss as an amount and a percentage, coloured green or red.
        </Li>
        <Li>Hedge branding, so the card stands on its own.</Li>
      </Ul>

      <Note>
        The image is generated on your device from data already on the page.
        Nothing is uploaded to produce it, and the card contains no wallet address
        or account identifier.
      </Note>

      <H2>If the image looks wrong</H2>
      <P>
        Rendering a DOM node to an image depends on fonts and images having
        finished loading. If a card comes out with fallback type or a missing
        logo, let the page settle for a second and generate it again. On very old
        browsers the render may not be supported at all, in which case a
        screenshot is the fallback.
      </P>
    </>
  );
}

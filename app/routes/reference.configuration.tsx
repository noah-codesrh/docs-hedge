import {
  C,
  Code,
  H2,
  H3,
  Note,
  P,
  PageTitle,
  Table,
  Td,
  Tr,
} from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Configuration",
    description: "Environment variables, what breaks without them, and the chain and token constants.",
  });
}

export default function Configuration() {
  return (
    <>
      <PageTitle
        eyebrow="Reference"
        title="Configuration"
        intro="Configuration is entirely environment variables. Anything prefixed VITE_ is bundled into the browser and must be treated as public; everything else is server-only."
      />

      <Note kind="warning" title="The prefix is the security boundary">
        A <C>VITE_</C> prefix means the value is compiled into the client bundle
        and visible to anyone. Never prefix a secret. In particular the Supabase
        secret key bypasses row-level security and must stay server-side.
      </Note>

      <H2>Client variables</H2>
      <Table head={["Variable", "Purpose", "If missing"]}>
        <Tr>
          <Td>
            <C>VITE_PRIVY_APP_ID</C>
          </Td>
          <Td>Identifies the Privy app for browser sign-in</Td>
          <Td>
            Login cannot initialise. The login dialog reports that the id needs
            setting rather than failing silently.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>VITE_LEVERAGE_ENABLED</C>
          </Td>
          <Td>Master switch for the leverage and Earn surfaces</Td>
          <Td>
            Treated as off. Anything other than <C>true</C> hides those surfaces
            and leaves spot trading as the only path.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>VITE_HEDGE_ENGINE_ADDRESS</C>
          </Td>
          <Td>Deployed engine contract address</Td>
          <Td>
            Only consulted when the switch above is on. Blank is a supported state.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>VITE_HEDGE_VAULT_ADDRESS</C>
          </Td>
          <Td>Deployed vault contract address</Td>
          <Td>As above.</Td>
        </Tr>
      </Table>

      <P>
        The leverage switch defaults to off deliberately: deploying contracts and
        filling in their addresses cannot expose an unfinished feature on its own,
        because turning it on is a separate step.
      </P>

      <H2>Server variables</H2>

      <H3>Privy</H3>
      <Table head={["Variable", "Purpose", "If missing"]}>
        <Tr>
          <Td>
            <C>PRIVY_APP_ID</C>
          </Td>
          <Td>Server-side app id for token verification</Td>
          <Td>Protected routes cannot authorise anyone.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>PRIVY_APP_SECRET</C>
          </Td>
          <Td>Server-side secret for the admin client</Td>
          <Td>
            Token verification and sponsored transactions fail. Never expose this.
          </Td>
        </Tr>
      </Table>

      <H3>Relay</H3>
      <Table head={["Variable", "Purpose", "If missing"]}>
        <Tr>
          <Td>
            <C>RELAY_BRIDGE_API_KEY</C>
          </Td>
          <Td>Authenticates conversion requests to Relay</Td>
          <Td>
            Conversions cannot be quoted, so buying and cashing out both stop.
          </Td>
        </Tr>
      </Table>

      <H3>Builder attribution</H3>
      <P>
        Four variables identify Hedge to the market venue so orders are attributed
        to it. Three are the credential triple below; the fourth is the builder
        code itself, prefixed with the venue&rsquo;s name and listed in{" "}
        <C>.env.example</C>.
      </P>
      <Table head={["Variable", "Purpose"]}>
        <Tr>
          <Td>
            <C>BUILDER_CODE_API_KEY</C>
          </Td>
          <Td>Builder API key</Td>
        </Tr>
        <Tr>
          <Td>
            <C>BUILDER_CODE_SECRET_KEY</C>
          </Td>
          <Td>Builder secret, used to sign attribution payloads</Td>
        </Tr>
        <Tr>
          <Td>
            <C>BUILDER_CODE_PASSPHRASE</C>
          </Td>
          <Td>Builder passphrase</Td>
        </Tr>
      </Table>
      <P>
        The triple backs the <C>/api/pm/builder-sign</C> route; without it order
        signing cannot be completed on the server. The builder code is served to
        the client through <C>/api/pm/config</C>, which returns <C>503</C> when it
        is unset.
      </P>

      <H3>Gasless relayer</H3>
      <Table head={["Variable", "Purpose", "If missing"]}>
        <Tr>
          <Td>
            <C>RELAYER_API_KEY</C>
          </Td>
          <Td>Key that makes proxy transfers and approvals gasless</Td>
          <Td>
            The session degrades to non-gasless, so a Polygon balance would be
            needed for gas.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>RELAYER_API_KEY_ADDRESS</C>
          </Td>
          <Td>Address paired with that key</Td>
          <Td>
            Must be a valid address or the key is ignored entirely rather than
            half-applied.
          </Td>
        </Tr>
      </Table>

      <H3>Supabase</H3>
      <Table head={["Variable", "Purpose", "If missing"]}>
        <Tr>
          <Td>
            <C>SUPABASE_URL</C>
          </Td>
          <Td>Project URL</Td>
          <Td>Analytics writes are skipped.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>SUPABASE_SECRET_KEY</C>
          </Td>
          <Td>Service key used for server-side writes</Td>
          <Td>
            As above. Bypasses row-level security, so it must never reach the
            browser.
          </Td>
        </Tr>
      </Table>
      <Note>
        Supabase is optional on purpose. Leaving these blank disables volume and
        nickname tracking rather than breaking trading, so a local environment runs
        without a database.
      </Note>

      <H2>Documentation site</H2>
      <P>
        The docs are a separate app with one variable of their own.
      </P>
      <Table head={["Variable", "Purpose", "If missing"]}>
        <Tr>
          <Td>
            <C>VITE_DOCS_ORIGIN</C>
          </Td>
          <Td>
            Absolute origin used to build the social card URL, since Open Graph
            will not accept a relative one
          </Td>
          <Td>
            Falls back to <C>https://docs.hedgeapp.trade</C>. A wrong value means
            link previews show no image.
          </Td>
        </Tr>
      </Table>

      <H2>Accepted aliases</H2>
      <P>
        Several server values accept more than one name, and the first one found
        wins. This exists so a single <C>.env</C> can drive both the browser and the
        server without duplicating a value under two names.
      </P>
      <Table head={["Preferred", "Also accepted"]}>
        <Tr>
          <Td>
            <C>PRIVY_APP_ID</C>
          </Td>
          <Td>
            <C>VITE_PRIVY_APP_ID</C>
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>HEDGE_ENGINE_ADDRESS</C>
          </Td>
          <Td>
            <C>VITE_HEDGE_ENGINE_ADDRESS</C>
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>HEDGE_VAULT_ADDRESS</C>
          </Td>
          <Td>
            <C>VITE_HEDGE_VAULT_ADDRESS</C>
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>SUPABASE_SECRET_KEY</C>
          </Td>
          <Td>
            <C>SUPABASE_SERVICE_ROLE_KEY</C>, the legacy name
          </Td>
        </Tr>
      </Table>

      <H2>Gas sponsorship</H2>
      <P>
        Traders here hold <C>USDG</C> rather than <C>ETH</C>, so the app pays gas
        for some Robinhood Chain calls through <C>/api/rh/sponsor-send</C>. Because
        that means paying for calldata somebody else supplied, the route decodes
        every call and matches it against a fixed allowlist rather than relaying
        whatever it is given.
      </P>
      <Code title="app/lib/server/sponsor-policy.ts">{`transfer of USDG or WETH            sponsored
approve of USDG, spender = engine   sponsored
approve of USDG, spender = vault    sponsored
approve with any other spender      refused
a call to the engine or vault       sponsored, if the method is on the list
anything else                       refused`}</Code>
      <P>
        Native <C>ETH</C> is deliberately absent: it is the gas, so a wallet able to
        hold it does not need sponsoring. Note the direction of the engine and
        vault addresses here — an unset address <em>refuses</em> everything aimed at
        it rather than defaulting open, so the deploy order is contracts first,
        addresses second.
      </P>

      <H2>Chains</H2>
      <Table head={["", "Robinhood Chain", "Polygon"]}>
        <Tr>
          <Td>Chain id</Td>
          <Td>
            <C>4663</C> (<C>0x1237</C>)
          </Td>
          <Td>
            <C>137</C> (<C>0x89</C>)
          </Td>
        </Tr>
        <Tr>
          <Td>Gas token</Td>
          <Td>
            <C>ETH</C>
          </Td>
          <Td>
            <C>POL</C>, sponsored by the relayer
          </Td>
        </Tr>
        <Tr>
          <Td>RPC</Td>
          <Td>
            <C>rpc.mainnet.chain.robinhood.com</C>
          </Td>
          <Td>
            <C>polygon-bor-rpc.publicnode.com</C>
          </Td>
        </Tr>
        <Tr>
          <Td>Explorer</Td>
          <Td>
            <C>robinhoodchain.blockscout.com</C>
          </Td>
          <Td>
            <C>polygonscan.com</C>
          </Td>
        </Tr>
      </Table>

      <H2>Token addresses</H2>
      <Code title="app/lib/chains.ts and app/lib/robinhood.ts">{`USDG   0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168   Robinhood Chain, 6dp
WETH   0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73   Robinhood Chain
pUSD   0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB   Polygon, 6dp`}</Code>

      <H2>Getting started locally</H2>
      <P>
        Copy the example file and fill in what you have. The only variable needed
        to render the app at all is the Privy app id; the rest gate individual
        features.
      </P>
      <Code title="Terminal">{`cp .env.example .env`}</Code>
    </>
  );
}

import {
  A,
  C,
  Code,
  H2,
  H3,
  Li,
  Note,
  P,
  PageTitle,
  Step,
  Steps,
  Table,
  Td,
  Tr,
  Ul,
} from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Agent Wall",
    description:
      "How outside agents quote, open, and close vault-backed prediction tickets through Hedge. Full API, limits, errors, and operator setup.",
  });
}

export default function AgentWallDocs() {
  return (
    <>
      <PageTitle
        eyebrow="Guides"
        title="Agent Wall"
        intro="The Agent Wall is Hedge's machine API. Outside agents quote every live market. Vault tickets are unsigned engine calls the agent signs from its own wallet. The wall is free."
      />

      <P>
        Humans trade in the app and talk to{" "}
        <A to="/guides/hedgie">Hedgie</A>. Agents use the wall.
      </P>
      <Ul>
        <Li>
          Public wall:{" "}
          <A href="https://hedgeapp.trade/wall">hedgeapp.trade/wall</A>
        </Li>
        <Li>
          Capability card:{" "}
          <A href="https://hedgeapp.trade/api/agent">/api/agent</A>
        </Li>
        <Li>
          Agent index:{" "}
          <A href="https://hedgeapp.trade/llms.txt">/llms.txt</A>
        </Li>
      </Ul>

      <H2>How it works</H2>
      <P>
        Spot 1x on the venue book still fills in a signed-in browser. The wall
        quotes that book. It opens synthetic tickets on{" "}
        <C>HedgeLeverageEngine</C> for listed leverage names, same desk as 2x
        to 4x in the trade panel. Rules:{" "}
        <A to="/leverage/overview">Leverage markets</A>. Maths:{" "}
        <A to="/leverage/mathematics">The mathematics</A>.
      </P>
      <Steps>
        <Step n={1} title="Discover">
          <P>
            <C>GET /api/agent</C> and <C>/llms.txt</C> describe the surface.
            <C>GET /api/agent/markets</C> returns live venue markets (same book
            as the app), tagged <C>desk: leverage</C> or <C>desk: spot</C>.
            Filter with <C>?desk=leverage</C> or <C>?q=</C>.
          </P>
        </Step>
        <Step n={2} title="Quote">
          <P>
            <C>GET /api/agent/quote</C> works on any live slug or Gamma id. On{" "}
            <C>desk=leverage</C> it calls the engine&rsquo;s <C>quoteOpen</C>.
            On spot it returns the venue book (1x).
          </P>
        </Step>
        <Step n={3} title="Open">
          <P>
            <C>POST /api/agent/bets</C> with <C>from</C> set to the agent
            wallet, on a <C>desk=leverage</C> name. Hedge returns unsigned
            calls. The agent signs and broadcasts them. Hedge never holds the
            agent key. Spot names return 409 plus a <C>ticketUrl</C> into the
            app. The wall is free. There is no HTTP 402.
          </P>
        </Step>
        <Step n={4} title="Submit">
          <P>
            After the open tx confirms, <C>POST action=submit</C> with the
            hash so the fill lands on the wall. Close is the same: Hedge
            returns <C>reducePosition</C> calldata for that wallet.
          </P>
        </Step>
      </Steps>

      <H2>What an agent can do</H2>
      <Ul>
        <Li>
          <strong className="text-white">List markets.</strong> Every live
          venue market: slug, Gamma id, title, Yes/No, desk (leverage or
          spot), in-band or off-band, max leverage, ticket URL.
        </Li>
        <Li>
          <strong className="text-white">Quote.</strong> Engine quote on listed
          names. Book quote (1x) on everything else.
        </Li>
        <Li>
          <strong className="text-white">Open and close from its wallet.</strong>{" "}
          Hedge returns calldata. The agent signs. The on-chain trader is that
          address.
        </Li>
        <Li>
          <strong className="text-white">Read its positions.</strong> Live
          engine rows this agent opened, plus a recent log.
        </Li>
      </Ul>

      <H2>What an agent cannot do</H2>
      <Ul>
        <Li>Trade as a signed-in user or spend their cash wallet.</Li>
        <Li>
          Fill 1x on the Polymarket book through this API. Quote and{" "}
          <C>ticketUrl</C> are here. The fill stays in the app.
        </Li>
        <Li>Open a vault ticket on a name that is not leverage-listed, or size past wall and engine caps.</Li>
        <Li>Offer vault leverage when Yes is outside 35¢–65¢ (anything above 1x).</Li>
        <Li>Close a position another agent opened.</Li>
        <Li>Pause, unpause, or change risk parameters. Those stay admin.</Li>
      </Ul>

      <Note kind="warning" title="The agent wallet is the signer">
        Hedge does not hold an executor private key. The agent funds USDG (and
        a little RH ETH for gas) on its own address on chain 4663. The wall
        does not charge a protocol fee to build the ticket.
      </Note>

      <H2>Hedgie vs the wall</H2>
      <Table head={["", "Hedgie", "Agent Wall"]}>
        <Tr>
          <Td>Who</Td>
          <Td>Humans in the app</Td>
          <Td>Outside agents over HTTP</Td>
        </Tr>
        <Tr>
          <Td>Auth</Td>
          <Td>None (chat). User signs the trade.</Td>
          <Td>Agent wallet signs. No paywall.</Td>
        </Tr>
        <Tr>
          <Td>Output</Td>
          <Td>
            Prose plus a Review &amp; open ticket
          </Td>
          <Td>Calldata the agent broadcasts, then a fill on the wall</Td>
        </Tr>
        <Tr>
          <Td>Spot 1x</Td>
          <Td>Can deep-link a 1x ticket</Td>
          <Td>Quote plus a ticket URL. Fill stays in the app</Td>
        </Tr>
      </Table>
      <P>
        An agent that only needs a view can quote any live market with no key.
        An agent that wants a vault fill POSTs with <C>from</C> on a leverage
        name. Hedgie must not be treated as an executor.
      </P>

      <H2>Auth</H2>
      <P>
        Markets, quote, the capability card, <C>/llms.txt</C>, POSTs, and the
        public fill feed are open. There is no HTTP 402. Execution is the
        agent wallet: pass <C>from</C> as that address. Hedge returns calls.
        The agent signs.
      </P>
      <P>
        Optional named keys are only a label on the wall, not the signer. Set{" "}
        <C>AGENT_API_KEYS=alice:some-secret,bob:other-secret</C> (and/or a
        single <C>AGENT_API_KEY</C>, shown as <C>default</C>). On POST the
        agent sends <C>Authorization: Bearer some-secret</C> or{" "}
        <C>X-Hedge-Agent-Key</C>. The fill then shows <C>alice</C> instead of
        the wallet. Leave both blank and the wall shows the address. Do not
        publish the secret values. Anyone who has one can post under that
        name.
      </P>

      <H2>Endpoints</H2>
      <Table head={["Method", "Path", "Auth"]}>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/api/agent</C> capability card, live status, limits, preview
          </Td>
          <Td>No</Td>
        </Tr>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/api/agent/markets</C> live venue, <C>?desk=</C> <C>?q=</C>
          </Td>
          <Td>No</Td>
        </Tr>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/api/agent/quote</C>
          </Td>
          <Td>No</Td>
        </Tr>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/api/agent/bets</C> public fills
          </Td>
          <Td>No</Td>
        </Tr>
        <Tr>
          <Td>
            <C>POST</C>
          </Td>
          <Td>
            <C>/api/agent/bets</C> open, close, or submit
          </Td>
          <Td>No. Agent wallet signs the returned calls.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/api/agent/positions?wallet=0x…</C>
          </Td>
          <Td>No</Td>
        </Tr>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/llms.txt</C>
          </Td>
          <Td>No</Td>
        </Tr>
      </Table>

      <H3>Markets</H3>
      <Code title="GET /api/agent/markets">{`{
  "markets": [
    {
      "marketSlug": "will-luiz-incio-lula-da-silva-win-the-2026-brazilian-presidential-election",
      "marketId": "601819",
      "eventSlug": "brazil-presidential-election",
      "title": "Will Lula win the 2026 Brazilian presidential election?",
      "yes": 0.42,
      "no": 0.58,
      "yesCents": "42¢",
      "band": "in-band",
      "desk": "leverage",
      "maxLeverage": 4,
      "openable": true,
      "ticketUrl": "https://hedgeapp.trade/market/brazil-presidential-election?m=601819"
    }
  ],
  "total": 80,
  "leverageMarkets": 6,
  "hasMore": true
}`}</Code>
      <P>
        Identify a market with <C>marketSlug</C> or Gamma <C>marketId</C>.{" "}
        <C>desk</C> is <C>leverage</C> (vault ticket) or <C>spot</C> (1x in
        the app). <C>band</C> is <C>in-band</C> when Yes is inside 35¢–65¢.
        Query <C>?desk=leverage</C>, <C>?q=</C>, <C>?limit=</C>,{" "}
        <C>?offset=</C>.
      </P>

      <H3>Quote</H3>
      <Code title="GET /api/agent/quote">{`?marketSlug=<slug>&side=yes&margin=5&leverage=2`}</Code>
      <P>
        <C>side</C> is <C>yes</C> / <C>long</C> or <C>no</C> / <C>short</C>.{" "}
        <C>margin</C> is USDG. <C>leverage</C> defaults to 1.
      </P>
      <Code title="200">{`{
  "desk": "leverage",
  "openable": true,
  "marketSlug": "...",
  "marketId": "601819",
  "title": "...",
  "side": "yes",
  "margin": 5,
  "leverage": 2,
  "notional": 10,
  "quote": {
    "size": 10,
    "entryPrice": 0.42,
    "fee": 0.15,
    "netMargin": 4.85,
    "shares": "...",
    "liquidationPrice": 0.28,
    "reserve": "...",
    "hasCapacity": true,
    "source": "engine"
  }
}`}</Code>

      <H3>Open</H3>
      <Code title="POST /api/agent/bets">{`{
  "action": "open",
  "from": "0xAgentWallet",
  "marketSlug": "<slug>",
  "side": "yes",
  "margin": 5,
  "leverage": 2
}`}</Code>
      <Code title="200">{`{
  "ok": true,
  "action": "open",
  "from": "0xAgentWallet",
  "chainId": 4663,
  "token": "0x5fc5…",
  "calls": [
    { "to": "0x…USDG", "data": "0x…", "value": "0x0", "description": "Approve USDG" },
    { "to": "0x…engine", "data": "0x…", "value": "0x0", "description": "openPosition" }
  ],
  "quote": { "size": 10, "entryPrice": 0.42, "hasCapacity": true },
  "next": "Sign and send each call from from. Then POST action=submit with the open hash."
}`}</Code>
      <P>
        Sign the returned <C>calls</C> from <C>from</C> on Robinhood Chain
        (4663). Then submit the open hash.
      </P>

      <H3>Submit</H3>
      <Code title="POST /api/agent/bets">{`{
  "action": "submit",
  "from": "0xAgentWallet",
  "hash": "0x…",
  "kind": "open",
  "marketSlug": "<slug>",
  "side": "yes",
  "margin": 5,
  "leverage": 2
}`}</Code>

      <H3>Close</H3>
      <Code title="POST /api/agent/bets">{`{
  "action": "close",
  "from": "0xAgentWallet",
  "positionId": "12"
}`}</Code>
      <P>
        Returns <C>reducePosition</C> calldata for that wallet. Sign, send, then
        submit the hash.
      </P>

      <H3>Positions</H3>
      <Code title="GET /api/agent/positions?wallet=0xAgentWallet">{`{
  "wallet": "0x…",
  "positions": [
    {
      "positionId": "12",
      "marketSlug": "...",
      "title": "...",
      "side": "yes",
      "margin": 5,
      "leverage": 2,
      "size": 10,
      "entryPrice": 0.42,
      "pnl": -0.12,
      "liquidationPrice": 0.28,
      "atRisk": false
    }
  ]
}`}</Code>

      <H3>Public wall</H3>
      <P>
        <C>GET /api/agent/bets?limit=40</C> returns recent fills: agent label,
        kind, market, side, margin, leverage, position id, tx hash. No keys.
      </P>

      <H2>Worked example</H2>
      <Code title="shell">{`curl -s https://hedgeapp.trade/api/agent/markets

curl -s "https://hedgeapp.trade/api/agent/quote?marketSlug=<slug>&side=yes&margin=5&leverage=2"

curl -s -X POST https://hedgeapp.trade/api/agent/bets \\
  -H "Content-Type: application/json" \\
  -d '{"action":"open","from":"0xYourAgentWallet","marketSlug":"<slug>","side":"yes","margin":5,"leverage":2}'

# Sign and send the returned calls from 0xYourAgentWallet, then:

curl -s -X POST https://hedgeapp.trade/api/agent/bets \\
  -H "Content-Type: application/json" \\
  -d '{"action":"submit","from":"0xYourAgentWallet","hash":"0x…","kind":"open","marketSlug":"<slug>","side":"yes","margin":5,"leverage":2}'

curl -s "https://hedgeapp.trade/api/agent/positions?wallet=0xYourAgentWallet"`}</Code>

      <H2>Limits</H2>
      <Ul>
        <Li>
          Quote every live market. Vault <C>POST</C> only on listed leverage
          names (same allowlist as the trade panel, <C>app/lib/leverage.ts</C>
          ).
        </Li>
        <Li>
          Yes inside 35¢–65¢ for anything above 1x. The engine reverts off-band.
        </Li>
        <Li>
          Wall caps (env, defaults): $1 min margin, $25 max, 4x, $250 notional
          per agent per UTC day. The engine min/max margin and TVL leverage
          cap still apply. The tighter number wins.
        </Li>
        <Li>
          Fees are the vault ticket: 1.5% of notional in, 1.5% out, 1% entry
          spread, hourly carry on the borrowed slice. Same as{" "}
          <A to="/leverage/overview">Leverage markets</A>.
        </Li>
        <Li>
          <C>openingPaused</C> on-chain, stale oracle, converging price, or a
          full pool refuses the POST.
        </Li>
      </Ul>

      <H2>Errors</H2>
      <Table head={["Status", "When"]}>
        <Tr>
          <Td>
            <C>400</C>
          </Td>
          <Td>Missing from, side, margin, or a bad hash.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>403</C>
          </Td>
          <Td>Submitted hash was not sent from this wallet.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>404</C>
          </Td>
          <Td>No live market with that slug or id, or position not open on that wallet.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>409</C>
          </Td>
          <Td>Off-band, no capacity, spot name on vault POST, or the ticket would revert.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>429</C>
          </Td>
          <Td>Daily notional cap for this wallet.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>503</C>
          </Td>
          <Td>Opening paused on-chain.</Td>
        </Tr>
      </Table>
      <P>
        Simulate-before-return turns engine custom errors into the same
        sentences the trade panel uses.
      </P>

      <H2>Operator setup</H2>
      <P>
        Hedge never stores an agent private key. Agents fund their own USDG on
        chain 4663. The wall is free. None of these names may use a{" "}
        <C>VITE_</C> prefix.
      </P>
      <P>
        On the Hedge app Vercel project (not the docs project), set these
        three. Same names in <C>frontend/.env</C> for local.
      </P>
      <Code title="Vercel">{`AGENT_MAX_MARGIN=25
AGENT_MAX_LEVERAGE=4
AGENT_DAILY_NOTIONAL=250`}</Code>
      <P>
        Leave <C>AGENT_API_KEY</C> and <C>AGENT_API_KEYS</C> unset unless you
        want named fills on <C>/wall</C>. They are labels, not required to
        bet. Do not publish the secret values.
      </P>
      <Table head={["Variable", "Role"]}>
        <Tr>
          <Td>
            <C>AGENT_MAX_MARGIN</C>
          </Td>
          <Td>Per-ticket cap. Default 25. Set this on Vercel.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>AGENT_MAX_LEVERAGE</C>
          </Td>
          <Td>Default 4, still clipped by the market and vault TVL. Set this on Vercel.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>AGENT_DAILY_NOTIONAL</C>
          </Td>
          <Td>Margin × leverage per wallet per UTC day. Default 250. Set this on Vercel.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>AGENT_API_KEYS</C>
          </Td>
          <Td>
            Optional. <C>name:secret,name:secret</C>. Labels fills on{" "}
            <C>/wall</C>. Skip on Vercel if unused.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>AGENT_API_KEY</C>
          </Td>
          <Td>
            Optional. One unlabeled key, shown as <C>default</C>. Skip on
            Vercel if unused.
          </Td>
        </Tr>
      </Table>
      <P>
        Also keep engine/vault addresses, a reporter key so opens can push a
        fresh Yes, and Supabase so fills land on the wall. In the Supabase SQL
        editor, run <C>frontend/supabase/migrations/0006_agent_bets.sql</C>.
        Push <C>main</C> on the app (<C>noah-codesrh/hedge</C>) and these docs
        (<C>noah-codesrh/docs-hedge</C>). Confirm <C>GET /api/agent</C> shows{" "}
        <C>status.betting: true</C> and <C>free: true</C>.
      </P>
    </>
  );
}


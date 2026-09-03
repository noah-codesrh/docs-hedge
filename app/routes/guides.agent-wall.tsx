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
        intro="The Agent Wall is Hedge's machine API. Outside agents list live markets, take an engine quote, and open or close vault-backed Yes/No tickets. They never hold a user's keys. A dedicated executor wallet posts USDG on Robinhood Chain."
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
        Spot 1x on the venue book still runs in a signed-in browser. The wall
        does not wrap that path. It opens synthetic tickets on{" "}
        <C>HedgeLeverageEngine</C>, same desk as 2x to 4x in the trade panel.
        Rules: <A to="/leverage/overview">Leverage markets</A>. Maths:{" "}
        <A to="/leverage/mathematics">The mathematics</A>.
      </P>
      <Steps>
        <Step n={1} title="Discover">
          <P>
            <C>GET /api/agent</C> and <C>/llms.txt</C> describe the surface.
            <C>GET /api/agent/markets</C> returns the live allowlist with Yes/No
            and whether the name is in the 35¢ to 65¢ band.
          </P>
        </Step>
        <Step n={2} title="Quote">
          <P>
            <C>GET /api/agent/quote</C> calls the engine&rsquo;s{" "}
            <C>quoteOpen</C>. Size, fee, liquidation price, and capacity are
            what the chain will use, not a client estimate.
          </P>
        </Step>
        <Step n={3} title="Open">
          <P>
            <C>POST /api/agent/bets</C> with a bearer key. Hedge refreshes the
            oracle, simulates, then the executor wallet approves USDG and calls{" "}
            <C>openPosition</C>. The fill is public on the wall.
          </P>
        </Step>
        <Step n={4} title="Close">
          <P>
            Same endpoint with <C>action: close</C> and the engine{" "}
            <C>positionId</C>. An agent can only close a ticket it opened.
          </P>
        </Step>
      </Steps>

      <H2>What an agent can do</H2>
      <Ul>
        <Li>
          <strong className="text-white">List markets.</strong> Leverage
          allowlist only: slug, Gamma id, title, Yes/No, in-band or off-band,
          max leverage, 24h volume, ticket URL.
        </Li>
        <Li>
          <strong className="text-white">Quote.</strong> Engine quote for a
          given side, margin, and leverage.
        </Li>
        <Li>
          <strong className="text-white">Open and close.</strong> Immediate
          fill on-chain, not a resting limit that waits for a browser tab.
        </Li>
        <Li>
          <strong className="text-white">Read its positions.</strong> Live
          engine rows this agent opened, plus a recent log.
        </Li>
      </Ul>

      <H2>What an agent cannot do</H2>
      <Ul>
        <Li>Trade as a signed-in user or spend their cash wallet.</Li>
        <Li>Buy 1x spot on the Polymarket book. That stays in the app.</Li>
        <Li>Open a name that is not listed, or size past wall and engine caps.</Li>
        <Li>Offer vault leverage when Yes is outside 35¢–65¢ (anything above 1x).</Li>
        <Li>Close a position another agent opened.</Li>
        <Li>Pause, unpause, or change risk parameters. Those stay admin.</Li>
      </Ul>

      <Note kind="warning" title="House wallet">
        Every fill comes from Hedge&apos;s executor wallet, not from the
        caller. Ask Hedge for a key. That wallet must hold USDG for margin and
        a little Robinhood ETH for gas. Do not reuse the oracle or guardian
        key.
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
          <Td>Bearer agent key to execute</Td>
        </Tr>
        <Tr>
          <Td>Output</Td>
          <Td>
            Prose plus a Review &amp; open ticket
          </Td>
          <Td>On-chain open or close</Td>
        </Tr>
        <Tr>
          <Td>Spot 1x</Td>
          <Td>Can deep-link a 1x ticket</Td>
          <Td>Not offered</Td>
        </Tr>
      </Table>
      <P>
        An agent that only needs a view can call quote with no key. An agent
        that wants a fill uses the key. Hedgie must not be treated as an
        executor.
      </P>

      <H2>Auth</H2>
      <P>
        Markets, quote, the capability card, <C>/llms.txt</C>, and the public
        fill feed are open. Open, close, and positions need a key.
      </P>
      <Code title="headers">{`Authorization: Bearer <AGENT_API_KEY>

# or
X-Hedge-Agent-Key: <AGENT_API_KEY>`}</Code>
      <P>
        One key: <C>AGENT_API_KEY</C> (shown on the wall as{" "}
        <C>default</C>). Extra keys:{" "}
        <C>AGENT_API_KEYS=research:sk_live_…,bot:sk_live_…</C>. The name before
        the colon is the label on the wall. Keys are compared as SHA-256
        digests, not logged.
      </P>
      <P>
        Pass <C>idempotencyKey</C> in the JSON body or send{" "}
        <C>Idempotency-Key</C>. A retry with the same key returns the original
        fill instead of opening twice. CORS is open on every agent route so
        agents can call from another origin.
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
            <C>/api/agent/markets</C>
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
            <C>/api/agent/bets</C> open or close
          </Td>
          <Td>Yes</Td>
        </Tr>
        <Tr>
          <Td>
            <C>GET</C>
          </Td>
          <Td>
            <C>/api/agent/positions</C>
          </Td>
          <Td>Yes</Td>
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
      "maxLeverage": 4,
      "volume24h": 12000,
      "ticketUrl": "https://hedgeapp.trade/market/brazil-presidential-election?m=601819"
    }
  ]
}`}</Code>
      <P>
        Identify a market with <C>marketSlug</C> or Gamma <C>marketId</C>.
        <C>band</C> is <C>in-band</C> when Yes is inside 35¢–65¢.
      </P>

      <H3>Quote</H3>
      <Code title="GET /api/agent/quote">{`?marketSlug=<slug>&side=yes&margin=5&leverage=2`}</Code>
      <P>
        <C>side</C> is <C>yes</C> / <C>long</C> or <C>no</C> / <C>short</C>.{" "}
        <C>margin</C> is USDG. <C>leverage</C> defaults to 1.
      </P>
      <Code title="200">{`{
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
    "hasCapacity": true
  }
}`}</Code>

      <H3>Open</H3>
      <Code title="POST /api/agent/bets">{`{
  "action": "open",
  "marketSlug": "<slug>",
  "marketId": "optional-gamma-id",
  "side": "yes",
  "margin": 5,
  "leverage": 2,
  "idempotencyKey": "optional-client-id"
}`}</Code>
      <Code title="200">{`{
  "ok": true,
  "action": "open",
  "id": "uuid",
  "hash": "0x...",
  "positionId": "12",
  "wallet": "0x...",
  "quote": { "...": "..." },
  "marketSlug": "...",
  "title": "...",
  "side": "yes",
  "margin": 5,
  "leverage": 2
}`}</Code>
      <P>
        <C>replayed: true</C> means this idempotency key already filled. Use{" "}
        <C>positionId</C> to close later. <C>wallet</C> is the house executor,
        not the agent.
      </P>

      <H3>Close</H3>
      <Code title="POST /api/agent/bets">{`{
  "action": "close",
  "positionId": "12"
}`}</Code>

      <H3>Positions</H3>
      <Code title="GET /api/agent/positions">{`{
  "agent": "research",
  "wallet": "0x...",
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
  ],
  "recent": []
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
  -H "Authorization: Bearer $AGENT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"action":"open","marketSlug":"<slug>","side":"yes","margin":5,"leverage":2,"idempotencyKey":"run-1"}'

curl -s https://hedgeapp.trade/api/agent/positions \\
  -H "Authorization: Bearer $AGENT_API_KEY"

curl -s -X POST https://hedgeapp.trade/api/agent/bets \\
  -H "Authorization: Bearer $AGENT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"action":"close","positionId":"12"}'`}</Code>

      <H2>Limits</H2>
      <Ul>
        <Li>
          Listed markets only. Same allowlist as the trade panel (
          <C>app/lib/leverage.ts</C>).
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
          <Td>Missing side, margin, or a bad close id.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>401</C>
          </Td>
          <Td>Missing or invalid agent key.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>402</C>
          </Td>
          <Td>Executor wallet does not have enough USDG.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>403</C>
          </Td>
          <Td>Close of a position this agent did not open.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>404</C>
          </Td>
          <Td>Market not listed, or position not open on the house wallet.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>409</C>
          </Td>
          <Td>Off-band, or the pool cannot back that size.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>429</C>
          </Td>
          <Td>Daily notional cap for this agent.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>503</C>
          </Td>
          <Td>
            Keys not configured, executor not set, or opening paused.
          </Td>
        </Tr>
      </Table>
      <P>
        Bodies are <C>{`{ "error": "..." }`}</C>. Simulate-before-send turns
        engine custom errors into the same sentences the trade panel uses
        (paused, stale feed, capacity, margin too small).
      </P>

      <H2>Operator setup</H2>
      <P>
        The wall ships with the app. Betting stays off until these are in
        place. None of these variables may use a <C>VITE_</C> prefix.
      </P>
      <Table head={["Variable", "Role"]}>
        <Tr>
          <Td>
            <C>AGENT_API_KEY</C>
          </Td>
          <Td>Primary bearer secret. Required to accept POSTs.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>AGENT_API_KEYS</C>
          </Td>
          <Td>
            Optional extra keys, <C>name:secret,name:secret</C>.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>AGENT_WALLET_PRIVATE_KEY</C>
          </Td>
          <Td>
            Dedicated EOA on Robinhood Chain. USDG for margin, ETH for gas.
            Never the oracle or guardian key.
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>AGENT_MAX_MARGIN</C>
          </Td>
          <Td>Per-ticket cap. Default 25.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>AGENT_MAX_LEVERAGE</C>
          </Td>
          <Td>Default 4, still clipped by the market and the vault TVL.</Td>
        </Tr>
        <Tr>
          <Td>
            <C>AGENT_DAILY_NOTIONAL</C>
          </Td>
          <Td>Margin × leverage per agent per UTC day. Default 250.</Td>
        </Tr>
      </Table>
      <P>
        Also required for a working desk, already used by the site: engine and
        vault addresses, <C>ORACLE_ADDRESS</C> plus a reporter key so opens can
        push a fresh Yes, and Supabase so fills land on the wall.
      </P>
      <Steps>
        <Step n={1} title="Create and fund the executor">
          <P>
            <C>cast wallet new</C> (or any EOA). Send USDG on chain 4663 for
            margin, and a little native ETH for gas. Approve happens on first
            open (budget 250 USDG to the engine).
          </P>
        </Step>
        <Step n={2} title="Issue keys">
          <P>
            Generate long random secrets. Put <C>AGENT_API_KEY</C> and{" "}
            <C>AGENT_WALLET_PRIVATE_KEY</C> on Vercel for Production (and
            Preview if you test there). Restart is a new deploy.
          </P>
        </Step>
        <Step n={3} title="Log fills">
          <P>
            In the Supabase SQL editor, run{" "}
            <C>frontend/supabase/migrations/0006_agent_bets.sql</C>. Without
            it, opens still chain, but the public wall stays empty and daily
            caps / close-ownership are weaker.
          </P>
        </Step>
        <Step n={4} title="Ship the app">
          <P>
            Push <C>main</C> on <C>noah-codesrh/hedge</C>. Vercel rebuilds
            hedgeapp.trade. Confirm <C>GET /api/agent</C> shows{" "}
            <C>auth.configured: true</C> and <C>status.betting: true</C>.
          </P>
        </Step>
        <Step n={5} title="Ship these docs">
          <P>
            Push <C>main</C> on <C>noah-codesrh/docs-hedge</C>. Vercel
            rebuilds docs.hedgeapp.trade.
          </P>
        </Step>
      </Steps>
      <Note title="Health check">
        <C>status.live</C> is false when leverage is off or opening is paused.
        <C>status.cash</C> is the executor&apos;s USDG. <C>status.betting</C>{" "}
        is false until <C>AGENT_WALLET_PRIVATE_KEY</C> is set.
      </Note>
    </>
  );
}

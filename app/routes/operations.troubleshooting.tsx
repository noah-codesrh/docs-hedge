import { A, C, Code, H2, H3, Li, Note, P, PageTitle, Table, Td, Tr, Ul } from "../components/prose";
import { docMeta } from "../lib/seo";

export function meta() {
  return docMeta({
    title: "Troubleshooting",
    description: "Common failures, what they actually mean, and how to recover.",
  });
}

export default function Troubleshooting() {
  return (
    <>
      <PageTitle
        eyebrow="Operations"
        title="Troubleshooting"
        intro="Grouped by where the problem actually lives rather than by what it looks like, because the two are often different."
      />

      <Note title="First, the reassuring part">
        No failure in the trade flows destroys funds. Every stopping point leaves
        money at an address you control, and the message names which one. Read it
        before assuming the worst.
      </Note>

      <H2>Sign-in</H2>

      <H3>Nothing happens when I try to log in</H3>
      <P>Work through these in order:</P>
      <Ul>
        <Li>
          <strong className="text-white">Is the app id set?</strong> Without{" "}
          <C>VITE_PRIVY_APP_ID</C> the login dialog cannot initialise. In a
          deployed build the variable had to be present when the build ran, not just
          at runtime.
        </Li>
        <Li>
          <strong className="text-white">Is the origin allowlisted?</strong> Privy
          checks the requesting origin against its allowed domains. The port is part
          of the origin, so <C>localhost:5174</C> and <C>localhost:5175</C> are
          different entries.
        </Li>
        <Li>
          <strong className="text-white">Does another browser profile work?</strong>{" "}
          If yes, the code is fine and the problem is local to that profile. Usual
          culprits are an extension blocking Privy&rsquo;s domains, a cookie policy
          blocking third-party storage, or stale data for the origin.
        </Li>
        <Li>
          <strong className="text-white">Try a different origin.</strong> A
          different port has its own storage, so serving on another port is a clean
          test of whether stored state is the problem.
        </Li>
        <Li>
          <strong className="text-white">Clear site data.</strong> Safe to do:
          nothing the app keeps in the browser is authoritative, as the{" "}
          <A to="/architecture/data">storage table</A>{" "}
          sets out. Your funds and positions are on-chain and at the venue.
        </Li>
      </Ul>

      <H2>Balances</H2>

      <H3>My deposit has not appeared</H3>
      <Ul>
        <Li>
          Confirm the transfer was on <strong className="text-white">Robinhood
          Chain</strong>, chain id <C>4663</C>, using the explorer.
        </Li>
        <Li>
          Confirm it went to the cash wallet address shown under <C>Deposit</C>,
          not the trading wallet or the proxy.
        </Li>
        <Li>
          Confirm the token was <C>USDG</C>. Other stablecoins are not counted as
          cash.
        </Li>
        <Li>Reload. Balances are fetched rather than pushed.</Li>
      </Ul>

      <H3>My money is showing as pUSD instead of cash</H3>
      <P>
        A flow stopped after converting. The <C>pUSD</C> is in your trading
        proxy. Retry the buy to spend it, or use <C>Cash out</C> to convert it back
        to <C>USDG</C>. Cashing out needs at least $1 in the proxy.
      </P>

      <H2>Trading</H2>

      <P>
        Messages are paraphrased here rather than quoted exactly, since the
        wording changes from time to time. Match on the gist.
      </P>
      <Table head={["What you see", "What it means", "What to do"]}>
        <Tr>
          <Td>pUSD is still in the trading proxy</Td>
          <Td>Conversion succeeded, the next hop did not</Td>
          <Td>
            Retry the buy, or <C>Cash out</C>
          </Td>
        </Tr>
        <Tr>
          <Td>This outcome had no fillable liquidity</Td>
          <Td>Nothing resting on the other side at an acceptable price</Td>
          <Td>Smaller size, or a more active market</Td>
        </Tr>
        <Tr>
          <Td>Convert needs at least $1</Td>
          <Td>Balance is below the conversion minimum</Td>
          <Td>Top it up so the total clears $1</Td>
        </Tr>
        <Tr>
          <Td>Trading is down for maintenance</Td>
          <Td>The venue is not accepting orders</Td>
          <Td>Wait and retry</Td>
        </Tr>
        <Tr>
          <Td>Could not open the trading proxy wallet</Td>
          <Td>Session setup failed, or the derived proxy looked wrong</Td>
          <Td>Reload and retry; the session rebuilds</Td>
        </Tr>
        <Tr>
          <Td>Could not connect this wallet to the venue</Td>
          <Td>Credential derivation failed</Td>
          <Td>Retry; cached credentials are cleared and re-derived</Td>
        </Tr>
        <Tr>
          <Td>Wallet request was cancelled</Td>
          <Td>A signature prompt was dismissed</Td>
          <Td>Retry and approve it</Td>
        </Tr>
        <Tr>
          <Td>Relay refunded the conversion</Td>
          <Td>The conversion failed and funds were returned</Td>
          <Td>Retry; funds are back at the origin wallet</Td>
        </Tr>
      </Table>

      <H3>A request timed out against the relayer</H3>
      <P>
        Moving <C>pUSD</C> out of the proxy goes through the venue&rsquo;s gasless
        relayer, which estimates gas, signs, and broadcasts. That can take longer
        than the SDK waits, and the SDK does not retry this class of request.
      </P>
      <Note kind="warning" title="A timeout is not proof of failure">
        The relayer may have accepted the transfer after the app stopped waiting.
        Check the proxy balance before concluding it failed: if the balance dropped,
        it went through. This matters both ways — treating a timeout as a definite
        failure risks acting twice on a transfer that already succeeded.
      </Note>

      <H3>I sold and got back less than I paid, but the price did not move</H3>
      <P>
        That is the spread, not a fee. Buying pays the ask, selling receives the
        bid, and the gap is a real cost paid on both entry and exit.{" "}
        <A to="/concepts/positions">Positions and P&amp;L</A>{" "}
        works through the arithmetic with an example.
      </P>

      <H3>The first trade of a session is slow</H3>
      <P>
        Expected. The first trade signs for API credentials and sets token
        approvals; both are cached afterwards, so later trades skip straight to
        converting.
      </P>

      <H2>Development</H2>

      <H3>A route returns 503</H3>
      <P>
        A server credential that route depends on is not set. This is deliberate:
        the routes check up front rather than failing deeper in, so a <C>503</C> is a
        configuration problem rather than an upstream outage. The{" "}
        <A to="/reference/configuration">configuration reference</A>{" "}
        lists which variable each one needs.
      </P>

      <H3>ENOENT on a route module</H3>
      <Code>{`Error: ENOENT: no such file or directory, open '.../app/routes/<name>.tsx'`}</Code>
      <P>
        The route table names a file that does not exist. React Router reads{" "}
        <C>routes.ts</C> at startup and opens every module it references, so this
        stops the dev server before it serves anything. Create the missing module,
        or remove its entry from <C>routes.ts</C>.
      </P>

      <H3>Typecheck errors about missing ./+types/ modules</H3>
      <P>
        Route types have not been generated. Run <C>pnpm typecheck</C>, which
        generates them before invoking <C>tsc</C>, or run a build once to populate{" "}
        <C>.react-router/types</C>.
      </P>

      <H3>Port already in use</H3>
      <P>
        Both dev servers use <C>strictPort</C> and will refuse to start rather than
        move. That is deliberate, since the port is part of the origin. Find and
        stop whatever holds it:
      </P>
      <Code title="Terminal">{`lsof -ti tcp:5174 | xargs kill`}</Code>

      <H3>File watcher errors about too many open files</H3>
      <P>
        A local file descriptor limit rather than a code problem. Raise the limit or
        restart. The server usually still runs.
      </P>
    </>
  );
}

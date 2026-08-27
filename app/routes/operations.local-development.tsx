import { A, C, Code, H2, H3, Li, Note, P, PageTitle, Table, Td, Tr, Ul } from "../components/prose";

export function meta() {
  return [
    { title: "Local development · Hedge Docs" },
    {
      name: "description",
      content: "Install, run, typecheck, and build both applications.",
    },
  ];
}

export default function LocalDevelopment() {
  return (
    <>
      <PageTitle
        eyebrow="Operations"
        title="Local development"
        intro="Two applications, each installed and run on its own. Both use pnpm and both serve on a fixed port."
      />

      <H2>Prerequisites</H2>
      <Ul>
        <Li>Node 20 or newer. The container image builds on Node 24.</Li>
        <Li>
          pnpm. The app pins a set of packages allowed to run build scripts in{" "}
          <C>pnpm-workspace.yaml</C>.
        </Li>
        <Li>
          A Privy app id, at minimum. Everything else gates individual features
          rather than the app rendering.
        </Li>
      </Ul>

      <H2>Running the app</H2>
      <Code title="Terminal">{`cd frontend
pnpm install
cp .env.example .env      # then fill in VITE_PRIVY_APP_ID
pnpm dev                  # http://localhost:5174`}</Code>

      <H2>Running the docs</H2>
      <Code title="Terminal">{`cd docs
pnpm install
pnpm dev                  # http://localhost:5175`}</Code>
      <P>
        The docs site needs no environment variables. It is entirely static content
        and talks to nothing.
      </P>

      <Note title="Fixed ports, on purpose">
        Both dev servers set <C>strictPort</C>, so a busy port fails loudly instead
        of quietly moving. The port is part of the browser origin, and a silent move
        changes which stored session and which Privy allowlist entry the app runs
        against — which is confusing to debug. If a port is taken, find the process
        holding it rather than letting the server wander.
      </Note>

      <H2>Scripts</H2>
      <Table head={["Command", "Does"]}>
        <Tr>
          <Td>
            <C>pnpm dev</C>
          </Td>
          <Td>Dev server with HMR</Td>
        </Tr>
        <Tr>
          <Td>
            <C>pnpm build</C>
          </Td>
          <Td>
            Production build into <C>build/</C>
          </Td>
        </Tr>
        <Tr>
          <Td>
            <C>pnpm start</C>
          </Td>
          <Td>Serve the built output</Td>
        </Tr>
        <Tr>
          <Td>
            <C>pnpm typecheck</C>
          </Td>
          <Td>
            Generate route types, then run <C>tsc</C>
          </Td>
        </Tr>
      </Table>
      <P>
        The app also has <C>pnpm check:sponsor</C>, which validates the sponsorship
        policy configuration.
      </P>

      <Note kind="warning" title="Typecheck needs generated route types first">
        React Router generates per-route types into <C>.react-router/types</C>, and{" "}
        <C>tsconfig.json</C> includes that directory. Running <C>tsc</C> on a clean
        checkout without generating them first produces a wave of errors about
        missing <C>./+types/*</C> modules. Use <C>pnpm typecheck</C>, which does
        both in order, or run a build once to populate them.
      </Note>

      <H2>Working on the docs</H2>
      <P>
        Adding a page is three edits, and all three are required:
      </P>
      <Code>{`1. app/routes/<name>.tsx     create the page module
2. app/routes.ts             register its URL
3. app/lib/nav.ts            add it to the sidebar`}</Code>
      <P>
        Skipping the first while doing the second stops the dev server outright: the
        route table is read at startup and each file it names is opened, so a
        missing module is an <C>ENOENT</C> before anything is served. Skipping the
        third leaves the page reachable but unlisted, and it drops out of the
        previous and next links.
      </P>

      <H3>Writing style in the page modules</H3>
      <P>
        Pages compose the primitives in <C>app/components/prose.tsx</C> rather than
        raw markup, which keeps typography consistent. <C>H2</C> and <C>H3</C>{" "}
        generate their own anchor ids from their text, so headings are linkable
        without extra work.
      </P>

      <H2>Common local problems</H2>
      <Ul>
        <Li>
          <strong className="text-white">Login does nothing.</strong> Usually a
          missing <C>VITE_PRIVY_APP_ID</C>, or the origin you are serving from is
          not in the Privy dashboard&rsquo;s allowed domains. Remember the port is
          part of the origin.
        </Li>
        <Li>
          <strong className="text-white">
            Dependencies re-optimise on every start.
          </strong>{" "}
          Vite invalidates its cache when config changes. Harmless, but it does
          force a reload on first load.
        </Li>
        <Li>
          <strong className="text-white">
            File watcher errors about too many open files.
          </strong>{" "}
          A local descriptor limit, not a code problem. Raise the limit or restart.
        </Li>
      </Ul>
      <P>
        More failure modes, including ones that involve real funds, are in{" "}
        <A to="/operations/troubleshooting">troubleshooting</A>.
      </P>
    </>
  );
}

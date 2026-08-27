import {
  C,
  Code,
  H2,
  H3,
  Li,
  Note,
  P,
  PageTitle,
  Ul,
} from "../components/prose";

export function meta() {
  return [
    { title: "Deployment · Hedge Docs" },
    {
      name: "description",
      content: "Build output, running the server, and the container image.",
    },
  ];
}

export default function Deployment() {
  return (
    <>
      <PageTitle
        eyebrow="Operations"
        title="Deployment"
        intro="Both applications are server-rendered, so a deployment runs a Node process rather than serving static files."
      />

      <H2>Build output</H2>
      <Code title="Terminal">{`pnpm build`}</Code>
      <P>
        This produces a client bundle and a server bundle under <C>build/</C>:
      </P>
      <Code>{`build/
  client/     browser assets, safe to serve from a CDN
  server/     the SSR entry point`}</Code>

      <H2>Running the server</H2>
      <Code title="Terminal">{`pnpm start
# equivalently
react-router-serve ./build/server/index.js`}</Code>
      <P>
        Server-only environment variables must be present in the runtime
        environment, not just at build time. Client variables are the opposite:{" "}
        <C>VITE_</C> values are compiled into the bundle during the build, so
        changing one requires rebuilding rather than restarting.
      </P>

      <Note kind="warning" title="Client variables are baked in at build time">
        Setting <C>VITE_PRIVY_APP_ID</C> only in the runtime environment has no
        effect on an already-built bundle. If sign-in is broken in a deployed build,
        check that the variable was present when the build ran.
      </Note>

      <H2>Container image</H2>
      <P>
        The app ships a multi-stage <C>Dockerfile</C> based on{" "}
        <C>node:24-alpine</C>. It installs dev dependencies to build, installs
        production dependencies separately, then copies only the build output and
        production modules into the final image.
      </P>
      <Code title="frontend/Dockerfile, in outline">{`development-dependencies-env   npm ci
production-dependencies-env    npm ci --omit=dev
build-env                      npm run build
final                          build output + prod modules
                               CMD ["npm", "run", "start"]`}</Code>

      <Note>
        The Dockerfile uses <C>npm ci</C> and expects a lockfile it can consume,
        while local development uses pnpm. If you build the image from a checkout
        that only has a pnpm lockfile, either generate the lockfile the Dockerfile
        expects or adapt those stages to pnpm.
      </Note>

      <H2>Before going live</H2>
      <Ul>
        <Li>
          <strong className="text-white">Privy allowed domains.</strong> Add the
          deployed origin in the Privy dashboard. A missing entry means sign-in
          silently refuses to initialise.
        </Li>
        <Li>
          <strong className="text-white">Server secrets present.</strong> Privy app
          secret, the Relay key, the builder credentials, and the relayer key. See{" "}
          <C>/reference/configuration</C> for what degrades versus what breaks.
        </Li>
        <Li>
          <strong className="text-white">Supabase migrations applied</strong>, if
          you want volume and nickname tracking. Leaving Supabase unset disables
          those writes rather than breaking trading.
        </Li>
        <Li>
          <strong className="text-white">Feature switch deliberate.</strong>{" "}
          <C>VITE_LEVERAGE_ENABLED</C> is off unless explicitly set to <C>true</C>,
          and turning it on is a separate step from deploying contracts.
        </Li>
      </Ul>

      <H3>Deploying the docs</H3>
      <P>
        The docs site has no secrets and no runtime configuration. Build it and run
        the server the same way. Because it is SSR rather than static, it still
        needs a Node process; if you would rather host it as static files, that
        would mean turning off SSR in <C>react-router.config.ts</C> and
        prerendering instead.
      </P>
    </>
  );
}

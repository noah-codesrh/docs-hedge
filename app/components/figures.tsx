import type { ReactNode } from "react";

export function Figure({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#111]">
      <figcaption className="border-b border-white/[0.07] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
        {title}
      </figcaption>
      <div className="px-4 py-5 sm:px-6 sm:py-6">{children}</div>
      {caption ? (
        <div className="border-t border-white/[0.07] px-4 py-3 text-[13px] leading-snug text-muted">
          {caption}
        </div>
      ) : null}
    </figure>
  );
}

function Node({
  label,
  sub,
  tone = "neutral",
}: {
  label: string;
  sub?: string;
  tone?: "neutral" | "gold" | "up" | "down";
}) {
  const ring =
    tone === "gold"
      ? "border-gold/35 bg-gold/[0.08] text-gold"
      : tone === "up"
        ? "border-up/35 bg-up/[0.08] text-up"
        : tone === "down"
          ? "border-down/35 bg-down/[0.08] text-down"
          : "border-white/10 bg-white/[0.04] text-white";
  return (
    <div
      className={`min-w-0 rounded-xl border px-3.5 py-3 text-center ${ring}`}
    >
      <p className="text-[14px] font-semibold leading-tight">{label}</p>
      {sub ? (
        <p className="mt-1 text-[12px] leading-snug text-muted">{sub}</p>
      ) : null}
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-1 text-muted sm:py-0">
      <span className="hidden text-[11px] font-medium sm:block" aria-hidden>
        {label}
      </span>
      <svg
        viewBox="0 0 48 12"
        className="hidden h-3 w-12 text-white/30 sm:block"
        aria-hidden
      >
        <path
          d="M0 6h42M38 1.5L46 6l-8 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        viewBox="0 0 12 20"
        className="h-5 w-3 text-white/30 sm:hidden"
        aria-hidden
      >
        <path
          d="M6 0v16M1.5 12.5L6 18.5l4.5-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Venue book, Hedge layer, USDG cash. */
export function VisionFigure() {
  return (
    <Figure
      title="The layer"
      caption="Hedge does not bootstrap a new book. It sizes event tickets in USDG on top of prices that already trade."
    >
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <Node label="Venue book" sub="1x Yes / No shares" />
        <Arrow label="price" />
        <Node
          label="Hedge"
          sub="2x to 10x vs the vault"
          tone="gold"
        />
        <Arrow label="settle" />
        <Node label="USDG" sub="one cash balance" />
      </div>
    </Figure>
  );
}

/** Size is margin times the multiple. */
export function LeverageSizeFigure() {
  return (
    <Figure
      title="Position size"
      caption="You risk the margin. The market moves against the size."
    >
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <Node label="$2.50" sub="margin you post" tone="gold" />
        <div className="text-center text-[15px] font-semibold text-muted">
          × 2x
        </div>
        <Node label="$5.00" sub="position size" />
        <Arrow />
        <Node label="P&L" sub="on the $5.00" />
      </div>
    </Figure>
  );
}

/** Trader vs vault on the same ticket. */
export function PnlModelFigure() {
  const rows = [
    {
      move: "Price goes your way",
      trader: "Profit, capped by the $1 outcome",
      vault: "Pays you, junior first",
      tone: "up" as const,
    },
    {
      move: "Price goes against you",
      trader: "Loss, never more than margin",
      vault: "Keeps the shortfall",
      tone: "down" as const,
    },
    {
      move: "Hits liquidation",
      trader: "Position closed. Margin gone.",
      vault: "Takes what is left",
      tone: "down" as const,
    },
  ];

  return (
    <Figure
      title="Who pays whom"
      caption="The vault is the other side of every 2x and 3x ticket. Fees and carry accrue either way."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-[13.5px]">
          <thead>
            <tr className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
              <th className="pb-2 pr-3 font-semibold">If</th>
              <th className="pb-2 pr-3 font-semibold">Trader</th>
              <th className="pb-2 font-semibold">Vault (LPs)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.move} className="border-t border-white/[0.07]">
                <td className="py-3 pr-3 align-top font-medium text-white">
                  {row.move}
                </td>
                <td
                  className={`py-3 pr-3 align-top ${
                    row.tone === "up" ? "text-up" : "text-down"
                  }`}
                >
                  {row.trader}
                </td>
                <td className="py-3 align-top text-[#c8c8c8]">{row.vault}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Figure>
  );
}

/** Entry to liquidation runway on a 2x long. */
export function LiquidationFigure() {
  return (
    <Figure
      title="Liquidation"
      caption="Closed once losses plus carry use 90% of net margin. Watch the live liq price. Carry pulls it closer."
    >
      <div className="space-y-4">
        <div className="flex items-end justify-between text-[12px] text-muted">
          <span>
            Liq <span className="font-semibold text-down">28¢</span>
          </span>
          <span>
            Entry <span className="font-semibold text-white">50¢</span>
          </span>
          <span>$1.00</span>
        </div>
        <svg
          viewBox="0 0 320 36"
          className="h-9 w-full"
          role="img"
          aria-label="Runway from 50 cent entry down to 28 cent liquidation"
        >
          <rect x="0" y="12" width="320" height="8" rx="4" fill="#1f1f1f" />
          <rect x="0" y="12" width="90" height="8" rx="4" fill="#3a2220" />
          <rect x="90" y="12" width="70" height="8" fill="#f26d5b" />
          <circle cx="160" cy="16" r="5.5" fill="#fff" />
          <circle cx="90" cy="16" r="5.5" fill="#f26d5b" />
        </svg>
        <div className="grid gap-2 text-[13px] sm:grid-cols-3">
          <Node label="90% of margin" sub="loss + carry to close" tone="down" />
          <Node label="You lose margin" sub="never more than you posted" />
          <Node label="Vault absorbs" sub="no leftover for you" tone="gold" />
        </div>
      </div>
    </Figure>
  );
}

/** TVL unlocks the next multiple. */
export function TvlLadderFigure() {
  const steps = [
    { tvl: "$0", x: "2x", w: "28%" },
    { tvl: "$1,000", x: "3x", w: "46%" },
    { tvl: "$5,000", x: "4x", w: "68%" },
    { tvl: "$20,000", x: "5x", w: "88%" },
  ];

  return (
    <Figure
      title="More pool, more leverage"
      caption="A deposit that crosses a rung raises the cap on the next open. A withdrawal that drops below it lowers the cap. 10x is the target. UI today stops at 3x."
    >
      <div className="space-y-2.5">
        {steps.map((step) => (
          <div key={step.tvl} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-right text-[13px] font-semibold tabular-nums text-white">
              {step.x}
            </span>
            <div className="h-2.5 min-w-0 flex-1 rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: step.w }}
              />
            </div>
            <span className="w-[4.5rem] shrink-0 text-[12px] tabular-nums text-muted">
              {step.tvl}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-3 opacity-50">
          <span className="w-16 shrink-0 text-right text-[13px] font-semibold text-white">
            10x
          </span>
          <div className="h-2.5 min-w-0 flex-1 rounded-full border border-dashed border-white/15" />
          <span className="w-[4.5rem] shrink-0 text-[12px] text-muted">
            target
          </span>
        </div>
      </div>
    </Figure>
  );
}

/** Why opens only between 35¢ and 65¢. */
export function PriceBandFigure() {
  return (
    <Figure
      title="Why the price is capped"
      caption="Near 0¢ or 100¢ a 2x ticket has no room to liquidate. Capital would sit. Opens only in the middle."
    >
      <div className="space-y-3">
        <div className="flex justify-between text-[12px] text-muted">
          <span>0¢</span>
          <span className="text-gold">35¢</span>
          <span className="text-gold">65¢</span>
          <span>100¢</span>
        </div>
        <svg
          viewBox="0 0 320 28"
          className="h-7 w-full"
          role="img"
          aria-label="Opens only between 35 and 65 cents"
        >
          <rect x="0" y="10" width="320" height="8" rx="4" fill="#2a2a2a" />
          <rect x="112" y="10" width="96" height="8" fill="#f1d65a" />
        </svg>
        <div className="grid grid-cols-3 gap-2 text-center text-[12px]">
          <p className="text-muted">Too certain. No liq risk.</p>
          <p className="font-medium text-gold">Can open</p>
          <p className="text-muted">Too certain. No liq risk.</p>
        </div>
      </div>
    </Figure>
  );
}

/** Native pool: traders are both sides of the book. */
export function PoolDeskFigure() {
  return (
    <Figure
      title="The desk"
      caption="USDG never sits in an app wallet. HedgePool holds it until you claim."
    >
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <Node label="You" sub="Pick a side. Stake USDG." />
        <Arrow label="stake()" />
        <Node
          label="HedgePool"
          sub="Two pots. Caps. One ticket."
          tone="gold"
        />
        <Arrow label="claim()" />
        <Node label="USDG back" sub="Winners split the pot" />
      </div>
    </Figure>
  );
}

/** Two payers: pots from the contract, overlay from escrow. */
export function PoolMoneyFigure() {
  return (
    <Figure
      title="Who pays"
      caption="Losing tickets fund the pots. Hedge only adds the $1,000 overlay on featured long races. The app never holds new-path USDG."
    >
      <div className="space-y-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
            Pots
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <Node label="Your wallet" sub="Approve USDG" />
            <Arrow label="stake()" />
            <Node
              label="HedgePool"
              sub="Holds both pots"
              tone="gold"
            />
            <Arrow label="claim()" />
            <Node label="Your wallet" sub="Winners pull USDG" tone="up" />
          </div>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
            Overlay, featured longs only
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <Node
              label="Hedge escrow"
              sub="$1,000 extra USDG"
              tone="gold"
            />
            <Arrow label="transfer" />
            <Node label="Your wallet" sub="Push after settle" tone="up" />
          </div>
        </div>
      </div>
    </Figure>
  );
}

/** Parimutuel: payout is the other side, not a fixed multiple. */
export function PoolSplitFigure() {
  return (
    <Figure
      title="Liquidity is the other side"
      caption="No vault. No LP. The losing pot pays the winning pot. A thin side pays more if it hits, and nothing if it does not."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
            Side A
          </p>
          <p className="mt-2 text-[22px] font-bold tracking-tight text-white">
            $60
          </p>
          <p className="mt-1 text-[13px] leading-snug text-muted">
            Favorite. If A wins, $60 splits $100. About 1.67x.
          </p>
        </div>
        <div className="rounded-xl border border-gold/25 bg-gold/[0.06] p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gold">
            Side B
          </p>
          <p className="mt-2 text-[22px] font-bold tracking-tight text-white">
            $40
          </p>
          <p className="mt-1 text-[13px] leading-snug text-muted">
            Underdog. If B wins, $40 splits $100. 2.5x.
          </p>
        </div>
      </div>
      <p className="mt-4 text-center text-[13px] text-muted">
        Pot $100. Payout = stake × pot / winning side.
      </p>
    </Figure>
  );
}

/** Display odds from the tape. Money from the pots. */
export function PoolTapeFigure() {
  return (
    <Figure
      title="Tape shows. Pools pay."
      caption="The board quotes Dexscreener. Settlement ignores that quote. Only USDG in each pot sets the multiple."
    >
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <Node label="Live tape" sub="Odds and the strike line" />
        <Arrow label="display" />
        <Node
          label="Two USDG pots"
          sub="This is the payout"
          tone="gold"
        />
      </div>
    </Figure>
  );
}

function FlowStep({
  n,
  label,
  sub,
  tone = "neutral",
}: {
  n: string;
  label: string;
  sub: string;
  tone?: "neutral" | "gold";
}) {
  return (
    <div
      className={`flex min-w-0 items-start gap-3 rounded-xl border p-3.5 ${
        tone === "gold"
          ? "border-gold/30 bg-gold/[0.07]"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-[12px] font-bold text-gold">
        {n}
      </span>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold leading-tight text-white">
          {label}
        </p>
        <p className="mt-1 text-[12px] leading-snug text-muted">{sub}</p>
      </div>
    </div>
  );
}

function DownArrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5 pl-3 text-[11px] font-medium text-gold/80">
      <svg
        viewBox="0 0 12 22"
        className="h-5 w-3 shrink-0 text-gold/70"
        aria-hidden
      >
        <path
          d="M6 0v18M1.5 14.5L6 20.5l4.5-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </div>
  );
}

/** Numbered hop from a Robinhood vault through Hedge to the venue book. */
export function HedgePmFigure() {
  return (
    <Figure
      title="Architecture flow"
      caption="Your vault never talks to Polymarket. Hedge quotes, converts, signs, and fills. Shares sit in the operator session until USDG comes home."
    >
      <div className="space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            Your product
          </p>
          <FlowStep
            n="1"
            label="Your vault"
            sub="Robinhood Chain. USDG. Condition id. Relink lives here."
          />
          <DownArrow label="quote" />
          <FlowStep
            n="2"
            label="Quote Hedge"
            sub="GET /api/spot/quote. Size, entry, fillable, ticketUrl."
          />
        </div>

        <DownArrow label="sweep only what the quote needs" />

        <div className="rounded-2xl border border-gold/25 bg-gold/[0.05] p-3 sm:p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-gold">
            Hedge
          </p>
          <FlowStep
            n="3"
            label="Sweep USDG to the operator"
            sub="One Hedge session. That cash wallet is the signer."
            tone="gold"
          />
          <DownArrow label="first-party only" />
          <FlowStep
            n="4"
            label="Hedge wrapper"
            sub="Privy session. Relay USDG to pUSD. Builder HMAC. Gasless relayer."
            tone="gold"
          />
        </div>

        <DownArrow label="you never call this" />

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            Venue
          </p>
          <FlowStep
            n="5"
            label="1x fill"
            sub="Hedge places the FAK. You never talk to the CLOB."
          />
          <DownArrow label="after resolve" />
          <FlowStep
            n="6"
            label="Redeem, USDG home, relink"
            sub="Redeem in Hedge. Send USDG back to the vault. Point at the next market."
          />
        </div>
      </div>
    </Figure>
  );
}

/** What you drop when Hedge is the book hop. */
export function VaultBridgeFigure() {
  return (
    <Figure
      title="What you no longer run"
      caption="Polygon, the bridge, and a CLOB key exist only to reach the venue. Hedge already has that path. You keep the vault and relink on Robinhood Chain."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
            Without Hedge
          </p>
          <ol className="mt-3 space-y-2 text-[13px] leading-snug text-muted">
            <li>1. Vault on Robinhood Chain</li>
            <li>2. Twin vault on Polygon</li>
            <li>3. Bridge across</li>
            <li>4. Your stack talks to the CLOB</li>
            <li>5. Redeem, bridge back</li>
          </ol>
        </div>
        <div className="rounded-xl border border-gold/25 bg-gold/[0.06] p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gold">
            With Hedge
          </p>
          <ol className="mt-3 space-y-2 text-[13px] leading-snug text-muted">
            <li>1. Vault stays on Robinhood Chain</li>
            <li>2. Quote and ticket from Hedge</li>
            <li>3. Operator confirms 1x in the app</li>
            <li>4. Hedge redeems on resolve</li>
            <li>5. USDG returns. You relink.</li>
          </ol>
        </div>
      </div>
    </Figure>
  );
}

/** Why the vault needs to grow. */
export function CapacityFigure() {
  return (
    <Figure
      title="Why the vault needs deposits"
      caption="Only 30% of TVL can back tickets at once. Each open locks the worst-case payout, not just the borrowed slice."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
            Small pool
          </p>
          <p className="mt-2 text-[22px] font-bold tracking-tight text-white">
            2x
          </p>
          <p className="mt-1 text-[13px] leading-snug text-muted">
            Few tickets. Next multiple locked. A winner can use a large share
            of what is there.
          </p>
        </div>
        <div className="rounded-xl border border-gold/25 bg-gold/[0.06] p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gold">
            Deeper pool
          </p>
          <p className="mt-2 text-[22px] font-bold tracking-tight text-white">
            3x, then 4x, 5x
          </p>
          <p className="mt-1 text-[13px] leading-snug text-muted">
            More concurrent size. Higher multiple. Same 30% cap, more dollars
            behind it.
          </p>
        </div>
      </div>
    </Figure>
  );
}

/**
 * Renders tools/og-card.html to public/og.png at 1200x630.
 *
 * Uses the Chrome already on the machine rather than pulling in a headless
 * browser dependency, since this runs by hand when the card changes rather
 * than as part of the build.
 *
 *   node tools/build-og.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].find(existsSync);

if (!CHROME) {
  console.error("No Chrome-family browser found. Install Chrome and re-run.");
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const source = join(root, "tools", "og-card.html");
const out = join(root, "public", "og.png");

// A throwaway profile keeps this from touching the user's real Chrome session.
const profile = mkdtempSync(join(tmpdir(), "hedge-og-"));
const startedAt = Date.now();

try {
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      // Chrome otherwise spends its time talking to the update service and
      // logging about it, which is what makes the run slow and the exit noisy.
      "--disable-component-update",
      "--disable-background-networking",
      "--disable-features=Translate,OptimizationHints",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1200,630",
      `--user-data-dir=${profile}`,
      // The card loads the font and logo over file://, which Chrome blocks
      // from a file:// page unless this is set.
      "--allow-file-access-from-files",
      `--screenshot=${out}`,
      `file://${source}`,
    ],
    { stdio: ["ignore", "ignore", "pipe"], timeout: 90_000 },
  );
} catch {
  // Swallowed on purpose. Chrome writes the screenshot and then exits non-zero
  // over unrelated updater and allocator complaints, so its exit code says
  // nothing useful — whether the PNG landed is the only thing worth checking.
} finally {
  rmSync(profile, { recursive: true, force: true });
}

const wrote = existsSync(out) && statSync(out).mtimeMs >= startedAt;
if (!wrote) {
  console.error(`Chrome did not write ${out}.`);
  process.exit(1);
}
console.log(`Wrote ${out} (${Math.round(statSync(out).size / 1024)} kB)`);

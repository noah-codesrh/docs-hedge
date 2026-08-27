"""
Builds public/og.png from tools/og-source.png.

The supplied banner is roughly 3:1, but a link preview wants 1.91:1 — so
platforms would either letterbox it or crop the wordmark. Rather than upscale
the banner to fill 630px of height, which would visibly soften the text, this
widens it to 1200 and extends the artwork vertically by mirroring its own top
and bottom edges. The gradient and the honeycomb both continue naturally across
the join, so the result reads as one image and the wordmark stays at close to
its native resolution.

    python3 tools/build-og.py
"""

from pathlib import Path

from PIL import Image

WIDTH, HEIGHT = 1200, 630

root = Path(__file__).resolve().parent.parent
source = root / "tools" / "og-source.png"
out = root / "public" / "og.png"

banner = Image.open(source).convert("RGB")

# Width first: a small upscale here costs far less sharpness than scaling the
# whole banner up to 630 tall would.
scaled_height = round(banner.height * WIDTH / banner.width)
banner = banner.resize((WIDTH, scaled_height), Image.LANCZOS)

if scaled_height >= HEIGHT:
    top = (scaled_height - HEIGHT) // 2
    banner.crop((0, top, WIDTH, top + HEIGHT)).save(out)
    print(f"Cropped to {WIDTH}x{HEIGHT} -> {out}")
    raise SystemExit

pad_top = (HEIGHT - scaled_height) // 2
pad_bottom = HEIGHT - scaled_height - pad_top

canvas = Image.new("RGB", (WIDTH, HEIGHT))
canvas.paste(banner, (0, pad_top))

# Reflect the edges outward. A single replicated row would streak wherever the
# honeycomb outline crosses it; a reflection continues the pattern instead.
if pad_top:
    strip = banner.crop((0, 0, WIDTH, pad_top)).transpose(Image.FLIP_TOP_BOTTOM)
    canvas.paste(strip, (0, 0))

if pad_bottom:
    strip = banner.crop(
        (0, scaled_height - pad_bottom, WIDTH, scaled_height)
    ).transpose(Image.FLIP_TOP_BOTTOM)
    canvas.paste(strip, (0, pad_top + scaled_height))

canvas.save(out, optimize=True)
print(
    f"Wrote {out} ({WIDTH}x{HEIGHT}, banner at {scaled_height}px, "
    f"mirrored {pad_top}px top / {pad_bottom}px bottom)"
)

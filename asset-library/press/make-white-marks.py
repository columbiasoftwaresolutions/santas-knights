"""
Build white-on-transparent variants of the press marks for the dark hero strip.

Every mark in the set is dark artwork on either transparent or a baked white
ground, and two of them (ABC's disc, NPR's blocks) carry their letters as white
knockouts *inside* the dark shape. A CSS filter can only push the whole opaque
area one way, so it either loses the knockouts or leaves the baked white ground
as a box. Rebuilding alpha from luminance handles both: dark ink becomes opaque
white, the ground and the knockouts become transparent.

Each mark is then cropped to its ink and written at 3x its display height, so
the file carries retina detail and nothing more.
Run it from anywhere (`python3 asset-library/press/make-white-marks.py`) after
adding a mark to SPECS below and dropping its source file in
`public/images/press/`. Then copy the printed dimensions into `pressLogos[].white`
in content/site.ts — the hero strip sizes itself from those numbers.
"""

import os

from PIL import Image  # pip install pillow

SRC = os.path.join(os.path.dirname(__file__), "..", "..", "public", "images", "press")
OUT = os.path.join(SRC, "white")

# Luminance at or above THRESH is ground (or a knockout) and goes fully clear;
# below THRESH - RAMP is ink and goes fully opaque. The ramp in between keeps
# the original antialiasing instead of hard-edging every curve.
THRESH = 205
RAMP = 45

# Display height in CSS px, chosen for optical parity rather than equal boxes:
# a lockup on two lines and a disc both have to stand taller than a single line
# of caps to carry the same weight. These are the numbers content/site.ts uses.
SPECS = [
    ("gothamist.png", 33),          # one line, ascenders, no descenders
    ("abc-news.png", 42),           # a disc — needs the most height of the set
    ("business-insider.png", 38),   # two lines of caps
    ("mens-journal.jpg", 25),       # one line of caps, very wide
    ("yahoo-news.webp", 42),        # two-line lockup
    ("gizmodo.jpg", 23),            # one line of caps, widest per unit height
    ("los-angeles-times.webp", 28), # blackletter masthead — tall ascenders eat
                                    # into the cap height, so it stands taller
    ("npr.png", 27),                # solid blocks — the only filled mark in the
                                    # set, so it sits below the others by mass
]

os.makedirs(OUT, exist_ok=True)

for name, display_h in SPECS:
    im = Image.open(os.path.join(SRC, name)).convert("RGBA")
    px = im.load()
    w, h = im.size
    out = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            lum = (299 * r + 587 * g + 114 * b) // 1000
            t = (THRESH - lum) / RAMP
            t = 0.0 if t < 0 else (1.0 if t > 1 else t)
            op[x, y] = (255, 255, 255, int(a * t))

    box = out.getbbox()
    if box:
        out = out.crop(box)

    target_h = display_h * 3
    if out.height > target_h:
        out = out.resize(
            (max(1, round(out.width * target_h / out.height)), target_h), Image.LANCZOS
        )

    dst = os.path.join(OUT, os.path.splitext(name)[0] + ".png")
    out.save(dst, optimize=True)
    ratio = out.width / out.height
    print(
        f"{name:26s} -> {out.size[0]:4d}x{out.size[1]:3d}  "
        f"display {round(display_h * ratio):3d}x{display_h:2d}  "
        f"{os.path.getsize(dst) // 1024}kB"
    )

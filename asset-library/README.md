# Asset library

Raw, source-of-truth media for the two linked brands — **Santa's Knights** (this
repo: nonprofit + Letters to Santa) and **Gladiators NYC** (the separate combat
site, see [docs/GLADIATORS-SITE.md](../docs/GLADIATORS-SITE.md)). This is a
staging library; web-optimized, hand-picked copies live in `public/images/`.
Nothing here is referenced by app code, so it can be reorganized freely.

Organized by **what the asset is**; brand ownership is noted per folder since the
combat/shop/armory material will eventually migrate to the Gladiators NYC repo.

```
brand/                 Logos, wordmarks, identity
  santas-knights/      SK marks (nonprofit / Letters)
  gladiators-nyc/      GNYC red roundel, line logo, "Fts NY" mark
  icons/               SVG UI/spot icons
press/                 Media-outlet logos (Guardian, Yahoo, ABC, BI, NY Post, …)
photography/           Real photography
  combat-training/     GNYC: armored combat, fighters, classes, events
  community-classes/   SK: free community classes (e.g. kids karate)
  gallery/             Real event/people photos not yet finely sub-sorted
graphics/              Illustrations, banners, event maps, decorative & AI-gen art
shop-merch/            Printful product mockups (GNYC shop)
  apparel/ accessories/ home-decor/ wall-art/ tech-cases/ stickers-patches/
armory/                Combat-gear product renders — swords, blades, armor (GNYC)
backgrounds/           Background textures / hero plates (wix-* = old Wix exports)
video/                 clips/ · background-loops/ · promos/
documents/             Waiver/release PDF, class brochure
_review/               Low-value thumbnails, screenshots, ambiguous files
  duplicates/          Byte-identical dupes pulled out of the main tree
```

## Notes
- **Brand split:** `armory/`, `shop-merch/`, and most of `photography/combat-training`
  belong to **Gladiators NYC** (separate site). `photography/community-classes`,
  the Letters/holiday imagery, and `brand/santas-knights` belong to **Santa's Knights**.
- **`_review/` needs human eyes:** thumbnails (`*-300x*`), an Instagram screenshot,
  `pngwing.com*` (unclear logos/icons), and the duplicates in `_review/duplicates/`
  (including one of the two identical 115 MB promo videos). Delete or refile as wanted.
- **Large media:** `video/` is ~460 MB. Consider Git LFS or keeping `video/` out of
  git rather than committing the raw clips. Source `*.zip` files are already gitignored.
- **`*_edited` files** are alternate edits kept next to their originals.

# Asset library

Raw, source-of-truth media for **Santa's Knights** (nonprofit + Letters to
Santa). This is a staging library; web-optimized, hand-picked copies live in
`public/images/`. Nothing here is referenced by app code, so it can be
reorganized freely.

All **Gladiators NYC** material (shop/merch mockups, armory renders, the GNYC
brand marks, combat-training photography, GNYC graphics and documents) now
lives in the Gladiators NYC repo's own `asset-library/`.

```
brand/                 Logos, wordmarks, identity
  santas-knights/      SK marks (nonprofit / Letters)
  icons/               SVG UI/spot icons
press/                 Media-outlet logos (Guardian, Yahoo, ABC, BI, NY Post, …)
photography/           Real photography
  community-classes/   Free community classes (e.g. kids karate)
  gallery/             Real event/people photos not yet finely sub-sorted
graphics/              Illustrations, banners, event maps, decorative & AI-gen art
backgrounds/           Background textures / hero plates (wix-* = old Wix exports)
video/                 clips/ · background-loops/ · promos/
_review/               Low-value thumbnails, screenshots, ambiguous files
  duplicates/          Byte-identical dupes pulled out of the main tree
```

## Notes
- **`_review/` needs human eyes:** thumbnails (`*-300x*`), an Instagram screenshot,
  `pngwing.com*` (unclear logos/icons), and the duplicates in `_review/duplicates/`
  (including one of the two identical 115 MB promo videos). Delete or refile as wanted.
- **Large media:** `video/` is gitignored. Consider Git LFS or object storage
  rather than committing raw clips.
- **`*_edited` files** are alternate edits kept next to their originals.

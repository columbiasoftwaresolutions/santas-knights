/**
 * Single source of truth for site copy and links.
 *
 * This is the nonprofit site: nonprofit pages, the Santa's Letters program,
 * donation/member pages, and organizational content. Gladiators NYC public
 * class marketing, booking, waivers, dashboards, training videos, Shop, and
 * Armory live on the separate gladiators.nyc site; this site cross-links out
 * to it. One login works on both sites.
 *
 * Placeholder hrefs ("#") are intentional until the real destinations exist.
 * "Buy now" membership URLs must be added manually in code. See Plan v2 §D5.
 */

// Canonical home of the public domain (used for absolute URLs in JSON-LD).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://santasknights.org";

// The OPERATIONAL + commercial companion site on gladiators.nyc: booking,
// waivers, dashboards, training videos, and the Shop + Armory, all kept off
// the 501(c)(3) domain. Same Supabase backend — one login works on both.
export const GLADIATORS_URL = process.env.NEXT_PUBLIC_GLADIATORS_URL || "https://gladiators.nyc";
// Gladiators NYC class marketing and booking live on the training site.
export const TRAINING_HREF = `${GLADIATORS_URL}/classes`;
export const GLADIATORS_HREF = TRAINING_HREF;
/** Class booking (session picker). Deep-link a class type with `?type=<slug>`. */
export const BOOK_HREF = `${GLADIATORS_URL}/classes`;
/** Participant dashboard — XP, rank, registrations. */
export const DASHBOARD_HREF = `${GLADIATORS_URL}/dashboard`;
/** Members-only training video library. */
export const TRAIN_ONLINE_HREF = `${GLADIATORS_URL}/videos`;
export const SHOP_HREF = process.env.NEXT_PUBLIC_GLADIATORS_SHOP_URL || `${GLADIATORS_URL}/shop`;
export const ARMORY_HREF = process.env.NEXT_PUBLIC_GLADIATORS_ARMORY_URL || `${GLADIATORS_URL}/armory`;

/** Brand trademark restored per Plan v2 §E0. */
export const TRADEMARK = "The Gift of Martial Arts™";

export const links = {
  donate: "/donate",
  // Public, stable charity links — kept in code (not env vars) per the donate-page note.
  paypal: "https://www.paypal.com/us/fundraiser/charity/3355259",
  venmo: "https://account.venmo.com/u/santasknights",
  // Volunteering and sponsorship no longer have pages of their own: the
  // volunteer application is a section of /contact and the sponsor wall is a
  // section of /santas-knights. /get-involved and /sponsors stay as redirects.
  volunteer: "/contact#volunteer",
  adoptLetter: "/letters",
  submitLetter: "/letters?do=submit",
  findClass: TRAINING_HREF,
  about: "/santas-knights",
  contact: "/contact",
  getInvolved: "/contact#volunteer",
  sponsors: "/santas-knights#sponsors",
  linkInBio: "/links",
  // Plan v2 §D2 new routes
  gallery: "/gallery",
  membership: "/membership",
  training: TRAINING_HREF,
  online: TRAIN_ONLINE_HREF,
  account: "/account",
  accountLogin: "/login",
  accountRegister: "/signup",
  accountLetters: "/account/letters",
  instagram: "https://www.instagram.com/santasknights/",
  facebook: "https://www.facebook.com/santasknights",
  youtube: "https://www.youtube.com/channel/UC5trQ89gJ3e-pRy-d977KCg",
} as const;

export const org = {
  name: "Santa's Knights",
  legalName: "Santa's Knights, Inc.",
  tagline: "Strengthening kids and lifting communities. Free training all year, and gifts that answer kids' letters to Santa.",
  venue: "Manhattanville Community Center",
  address1: "530 W 133rd St",
  address2: "New York, NY 10027",
  phone: "(212) 873-5818",
  phoneHref: "tel:+12128735818",
  email: "contact@santasknights.org",
  /** Used for the embedded map + "Get directions" link. */
  mapsQuery: "Manhattanville Community Center, 530 West 133rd Street, New York, NY 10027",
} as const;

/* ------------------------------------------------------------------ *
 * Navigation dropdown tree (Plan v2 §E1)
 * ------------------------------------------------------------------ */

export type NavChild = { label: string; href: string; external?: boolean };
export type NavItem = {
  label: string;
  href?: string;
  external?: boolean;
  gladiators?: boolean;
  children?: NavChild[];
};

/** Top-level nav with optional dropdown children. */
export const navLinks: NavItem[] = [
  {
    label: "About",
    children: [
      { label: "About Us", href: "/santas-knights" },
      { label: "Sponsors", href: "/santas-knights#sponsors" },
    ],
  },
  {
    label: "Gladiators NYC",
    href: TRAINING_HREF,
    external: true,
    gladiators: true,
  },
  { label: "Letters to Santa", href: "/letters" },
  { label: "Membership", href: "/membership" },
  { label: "Donate", href: "/donate" },
  { label: "Gallery", href: "/gallery" },
  {
    label: "Contact",
    children: [
      { label: "Contact Us", href: "/contact" },
      { label: "Volunteer", href: "/contact#volunteer" },
    ],
  },
];

export const stats: { value: string; unit?: string; label: string }[] = [
  { value: "100", unit: "%", label: "Free for everyone we serve" },
  // TODO: Confirm founding year with Damion. The live site says 2015; our story says 2016.
  { value: "2016", label: "Nonprofit since" },
  { value: "Harlem", label: "Where we're based" },
  { value: "501(c)(3)", label: "Gifts are tax-deductible" },
];

/* ------------------------------------------------------------------ *
 * Homepage "what we do" overview cards
 * ------------------------------------------------------------------ */

export const pillars: {
  variant: "train" | "give";
  tag: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  image?: string;
  imageAlt?: string;
  /** object-position for the cover crop; keeps the subject centered when the
   *  wide photo is cropped into a tall/narrow block (esp. on mobile). */
  imagePosition?: string;
  photo: string;
}[] = [
  {
    variant: "give",
    tag: "Santa's Letters",
    title: "Answering letters to Santa",
    body: "Every December, kids write about their wishes to Santa. You can help those wishes come true.",
    cta: "How it works",
    href: "/letters",
    image: "/images/gallery/48424779_10161478137715422_7170425562547093504_o.jpg",
    imageAlt: "Santa sitting with a smiling child holding a wrapped gift at a Santa's Knights holiday event",
    // Santa + child sit right-of-centre in the frame — pull the crop right so
    // they stay centred in the narrow block.
    imagePosition: "62% center",
    photo: "PHOTO: kids and volunteers at the holiday gift event",
  },
  {
    variant: "train",
    tag: "Free training",
    title: "Martial arts & fitness, year-round",
    body: "We teach armored combat and fitness in Harlem at no cost, beginners welcome. Browse our programs and reserve a spot now.",
    cta: "See the classes",
    href: TRAINING_HREF,
    image: "/images/hero-community.jpg",
    imageAlt: "Santa's Knights members and families together at a community event",
    photo: "PHOTO: armored fighter, steel weapon",
  },
];

/* ------------------------------------------------------------------ *
 * Santa's Letters, the program this site is built around
 * ------------------------------------------------------------------ */

export const letters = {
  eyebrow: "Santa's Letters",
  title: "Every kid deserves an answer.",
  intro:
    "Each December, children around the world write to Santa. We make sure those letters don't go unanswered. You read a wish, pick one, and send the gift, and a kid wakes up to something they asked for.",
  origin:
    "The idea isn't new. The Postal Service has been answering kids' letters to Santa since 1912, and Damion grew up taking part in it, picking a stranger's letter off the pile and mailing a gift. Santa's Letters is him running that same idea out of Harlem, and reaching a few more kids every year.",
} as const;

/**
 * Per-gift value guidance displayed on submit and adopt flows (Plan v2 §C1/E5).
 * Verbatim from the live Wix site.
 */
export const giftGuidance = {
  valueRange: "$20–50",
  submit:
    "It's best to keep your request to $20–50 in total value of gifts per child/person.",
  adopt: "Suggested gift value: $20–50 per child/person.",
} as const;

/**
 * Privacy instruction shown on the submit form (Plan v2 §E5).
 * Verbatim from the live site.
 */
export const privacyInstruction =
  "Do NOT include your, or your child's, last name or mailing address in your physical letter or online post!";

/* ------------------------------------------------------------------ *
 * Training (Gladiators NYC): the free program, built and booked on gladiators.nyc
 * ------------------------------------------------------------------ */

/**
 * Class catalog mirror used only for cross-links. Canonical pages live on
 * gladiators.nyc at /classes/[slug].
 */
export type ClassCard = {
  slug: string;
  name: string;
  audience: string;
  duration: string;
  tagline?: string;
  /** Fuller description shown on the per-class page. */
  details?: string;
  /** Session-table slug/class_type filter on gladiators.nyc. */
  bookingSlug: string;
  /** Canonical per-class marketing route on gladiators.nyc. */
  bookHref: string;
};

export const classes: ClassCard[] = [
  {
    slug: "gladiator-bootcamp",
    name: "Gladiator Bootcamp (open to all levels)",
    audience: "Adults & Teens",
    duration: "Duration Varies",
    tagline: undefined, // detail page falls back to bootcampBlurb
    bookingSlug: "bootcamp",
    bookHref: `${GLADIATORS_URL}/classes/gladiator-bootcamp`,
  },
  {
    slug: "gladiator-armored-practice",
    name: "Gladiator Armored Practice (advanced)",
    audience: "Adults (as fighters & spectators) & Teens/Children as spectators",
    duration: "",
    details:
      "Advanced, full-contact armored practice with steel weapons for experienced fighters, with space for teens and children to spectate. Protective armor required; instructors run the floor.",
    bookingSlug: "armored-practice",
    bookHref: `${GLADIATORS_URL}/classes/gladiator-armored-practice`,
  },
  {
    slug: "womens-medieval-combat-fitness",
    name: "Women's Medieval Combat & Fitness",
    audience: "Women",
    duration: "2 hr",
    tagline: "Empowerment through Strength, Skill, and Sisterhood",
    details:
      "A women's medieval combat and fitness class built around strength, skill, and sisterhood. Beginners welcome; all equipment provided.",
    bookingSlug: "womens-combat",
    bookHref: `${GLADIATORS_URL}/classes/womens-medieval-combat-fitness`,
  },
  {
    slug: "womens-premium-combat-midtown",
    name: "Women's (Premium) Combat Class, Midtown",
    audience: "Women",
    duration: "",
    tagline: "Combat, conditioning, and community in a Midtown studio.",
    details:
      "Combat, conditioning, and community for women in a Midtown studio. Same free program, a second location.",
    bookingSlug: "womens-midtown",
    bookHref: `${GLADIATORS_URL}/classes/womens-premium-combat-midtown`,
  },
  {
    slug: "military-veterans-combat-training",
    name: "Gladiators NYC for Military Veterans",
    audience: "U.S. Military Veterans",
    duration: "2 hr",
    tagline:
      "This class is (only) for U.S. Military Veterans (sponsored by the Department of Veterans Services)",
    details:
      "A class exclusively for U.S. Military Veterans, sponsored by the Department of Veterans Services. Camaraderie, fitness, and full-contact combat in a veteran-only space.",
    bookingSlug: "veterans",
    bookHref: `${GLADIATORS_URL}/classes/military-veterans-combat-training`,
  },
  {
    slug: "medieval-combat-fundamentals",
    name: "Medieval Combat Fundamentals",
    audience: "All levels",
    duration: "1 hr 30 min",
    tagline: "Step into the world of historical martial arts with Gladiators NYC",
    details:
      "Step into the world of historical martial arts. Fundamentals covers stance, footwork, and weapon basics for every level, no experience needed.",
    bookingSlug: "fundamentals",
    bookHref: `${GLADIATORS_URL}/classes/medieval-combat-fundamentals`,
  },
];

/** Short class names for About-page program chips. */
export const programs: { name: string; audience: string }[] = [
  { name: "Gladiator Bootcamp", audience: "Adults & Teens" },
  { name: "Armored Practice", audience: "Advanced" },
  { name: "Women's Combat & Fitness", audience: "Women" },
  { name: "Women's Combat, Midtown", audience: "Women" },
  { name: "Gladiators for Veterans", audience: "Veterans" },
  { name: "Medieval Combat Fundamentals", audience: "All levels" },
];

/**
 * Featured-class bootcamp description (Plan v2 §E2). Verbatim from live site.
 */
export const bootcampBlurb =
  "Inspired by classes such as Barry's Bootcamp®, SoulCycle®, and GRIT BXNG®, Gladiator Kids (for children) and Gladiator Bootcamp (for adults) teaches students how to fight as an armored combatant (using foam weapons and armor to train with) in the style of high-energy, high-intensity, non-stop, music-driven, headset-wearing instructors, bringing gladiatorial and medieval training into the modern age of fitness and martial arts practice.";

/**
 * App promo copy (Plan v2 §E2). On-site class registration arrives with the
 * training tracker (Execution Plan Phase 5); for now this routes to the program hub.
 */
export const appPromo = {
  text: "Register for and manage your classes online! Membership is 100% FREE, always!",
  href: TRAINING_HREF,
  cta: "Browse classes",
} as const;

/* ------------------------------------------------------------------ *
 * Membership tiers (Plan v2 §A4/E7)
 * ------------------------------------------------------------------ */

/**
 * Free class membership. Deliberately NOT one of the paid tiers: pricing it in
 * the same row as monthly giving reads as "the cheap plan", and the whole point
 * is that training costs nothing and never will. The redesigned /membership
 * page states it on the paper above the tier grid.
 */
export const freeMembership = {
  name: "Class membership",
  priceLabel: "$0",
  headline: "Class membership is $0, always",
  description:
    "Sign up once and book any of the six Gladiators NYC classes. Equipment provided, beginners welcome.",
  ctaLabel: "Sign up free",
  href: TRAINING_HREF,
} as const;

export type MembershipTier = {
  /** The monthly amount. `null` = "you choose", which sends them to /donate. */
  price: number | null;
  priceLabel: string;
  /** What the money buys, not a package name. */
  name: string;
  description: string;
  ctaLabel: string;
  /** Resolved from content/billing.ts at render; falls back to PayPal. */
  href?: string;
  /** Rendered under the description with a hand-drawn underline. */
  note?: string;
  /** Renders as the open, dashed card at the end of the grid. */
  open?: boolean;
};

/**
 * Monthly giving. Every tier is phrased as what it buys — the redesign drops
 * the old perk-package framing and the "Recommended" badge (rule 4: no chips
 * bolted onto cards); the one tier we actually steer people to carries `note`
 * instead, marked with a brush underline.
 *
 * `href` is intentionally absent: /membership resolves each one through
 * `checkoutUrl(price, "monthly")` so recurring links can be turned on in one
 * place (content/billing.ts) without touching this list.
 */
export const membershipTiers: MembershipTier[] = [
  {
    price: 20,
    priceLabel: "$20",
    name: "A gift every month",
    description: "One wrapped present for a child in need.",
    note: "Most people start here.",
    ctaLabel: "Give $20/mo",
  },
  {
    price: 50,
    priceLabel: "$50",
    name: "A gift and a sword",
    description: "A present plus a foam sword, so a kid can join a class and keep training.",
    ctaLabel: "Give $50/mo",
  },
  {
    price: 100,
    priceLabel: "$100",
    name: "Two kids covered",
    description: "A present and a foam sword each, for two children.",
    ctaLabel: "Give $100/mo",
  },
  {
    price: 250,
    priceLabel: "$250",
    name: "Five kids covered",
    description: "A present and a foam sword each, for five children.",
    ctaLabel: "Give $250/mo",
  },
  {
    price: 500,
    priceLabel: "$500",
    name: "Corporate membership",
    description: "For companies backing the program. We'll credit you on the sponsors page.",
    ctaLabel: "Talk to us",
    href: `mailto:${org.email}?subject=Corporate%20membership`,
  },
  {
    price: null,
    priceLabel: "You choose",
    name: "Another amount",
    description: "Any monthly amount, or a one-time gift instead.",
    ctaLabel: "Set an amount",
    href: links.donate,
    open: true,
  },
];

/* ------------------------------------------------------------------ *
 * Partners / sponsors (Plan v2 §A5/E4)
 * ------------------------------------------------------------------ */

/**
 * Full partners roster from the live site — the single source of truth for both
 * the homepage "In good company" strip and the sponsor wall folded into
 * /santas-knights. `featured` marks the handful shown on the homepage; `logo`
 * (in /public/images/sponsors) renders the real mark instead of a wordmark.
 */
export const sponsors: { name: string; logo?: string; href?: string; featured?: boolean }[] = [
  { name: "Google", logo: "/images/sponsors/google.png", featured: true },
  { name: "Graham Windham", logo: "/images/sponsors/graham-windham.png", featured: true },
  { name: "Whole Foods Market", logo: "/images/sponsors/whole-foods-market.png", featured: true },
  { name: "NYU", logo: "/images/sponsors/nyu.png", featured: true },
  { name: "Kohl's", logo: "/images/sponsors/kohls.png", featured: true },
  { name: "Wounded Warrior Project", logo: "/images/sponsors/wounded-warrior-project.png", featured: true },
  { name: "Combat Wounded Veterans of America" },
  { name: "Futurelabs" },
  { name: "ClassPass" },
  { name: "NYPD Community Affairs", logo: "/images/sponsors/nypd-community-affairs.png" },
  { name: "New York Adventure Club" },
  { name: "Armored Combat Worldwide" },
  { name: "Bohemian Hall" },
  { name: "Draft Barn Beach" },
  { name: "Manhattanville Community Center" },
];

/**
 * What a business can actually back, as a flowing list rather than a grid of
 * cards. Each row opens a pre-addressed email — there is no sponsorship form.
 */
export const sponsorWays: { title: string; body: string; subject: string }[] = [
  {
    title: "Back the letter drive",
    body: "Gifts and shipping for a batch of December letters.",
    subject: "Sponsoring the letter drive",
  },
  {
    title: "Sponsor a season",
    body: "Equipment, space, and insurance for a session of free training.",
    subject: "Sponsoring a season of classes",
  },
  {
    title: "Sponsor an event",
    body: "Your name on the holiday gift event, or a public demo.",
    subject: "Sponsoring an event",
  },
];

/**
 * "Seen in" press strip. Each logo links to the actual article. Only outlets
 * with a verified, live article are listed (all checked 200; sourced from the
 * Gladiators NYC media page + search). The Guardian and New York Magazine were
 * dropped — no traceable article exists for either, so the logos can't back a
 * coverage claim. Re-add with an `href` if a real article surfaces.
 */
export const pressLogos: {
  name: string;
  src: string;
  href: string;
  width?: number;
  height?: number;
  displayHeight?: number;
  maxWidth?: number;
}[] = [
  {
    name: "Gothamist",
    src: "/images/press/gothamist.png",
    href: "https://gothamist.com/arts-entertainment/nycs-knights-get-medieval-on-each-other-in-central-park",
  },
  {
    name: "ABC News",
    src: "/images/press/abc-news.png",
    href: "https://abcnews.go.com/Travel/competing-axe-wielding-bone-crushing-sport-medieval-combat/story?id=24865343",
  },
  {
    name: "Business Insider",
    src: "/images/press/business-insider.png",
    href: "https://www.businessinsider.com/armored-combat-league-warriors-management-consultant-hobby-2017-3",
  },
  {
    name: "Men's Journal",
    src: "/images/press/mens-journal.jpg",
    href: "https://www.mensjournal.com/features/the-wild-violent-world-of-armored-combat-league-20140922/",
  },
  {
    name: "Yahoo",
    src: "/images/press/yahoo-news.webp",
    href: "https://sports.yahoo.com/knights-shining-armor-them-doing-162058863.html",
    width: 1500,
    height: 550,
    displayHeight: 34,
    maxWidth: 188,
  },
  {
    name: "Gizmodo",
    src: "/images/press/gizmodo.jpg",
    href: "https://gizmodo.com/harlem-knight-fight-shows-off-the-appeal-of-the-armored-1774117164",
  },
  {
    name: "Los Angeles Times",
    src: "/images/press/los-angeles-times.webp",
    href: "https://www.latimes.com/entertainment-arts/movies/story/2020-12-05/dear-santa-documentary-usps-operation-santa",
    width: 960,
    height: 121,
    displayHeight: 26,
    maxWidth: 190,
  },
  {
    name: "NPR",
    src: "/images/press/npr.png",
    href: "https://www.npr.org/2020/12/20/947119957/could-you-help-santa-in-christmas-wishlists-children-write-of-pandemic-hardships",
    width: 612,
    height: 204,
    displayHeight: 28,
    maxWidth: 112,
  },
];

/* ------------------------------------------------------------------ *
 * Donate page copy (Plan v2 §E6)
 * ------------------------------------------------------------------ */

export const donateCopy = {
  headline: "Help Santa's Knights keep classes free and answer letters to Santa.",
  encouragement: "Every donation helps pay for gifts, classes, equipment, and events.",
  /** Tax-deductibility guidance. General information, not tax advice. */
  taxGuidance: [
    "Cash donations are generally deductible up to 60% of your adjusted gross income (AGI).",
    "Property donations are typically deductible at 20–50% of value, depending on the type of property.",
    "Excess contributions above AGI limits can carry over for up to five years.",
    "Non-cash and vehicle donations are valued at fair market value for deduction purposes.",
    "Donors age 70½ and older may make qualified charitable distributions (QCDs) of up to $100,000 per year directly from IRAs.",
  ],
} as const;

/* ------------------------------------------------------------------ *
 * Footer
 * ------------------------------------------------------------------ */

export const footerColumns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "About", href: "/santas-knights" },
      { label: "Santa's Letters", href: "/letters" },
      { label: "Training", href: TRAINING_HREF },
      { label: "Membership", href: "/membership" },
      { label: "Gallery", href: "/gallery" },
      { label: "Partners", href: "/santas-knights#sponsors" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "Adopt a Letter", href: "/letters" },
      { label: "Submit a Letter", href: "/letters?do=submit" },
      { label: "Volunteer", href: "/contact#volunteer" },
      { label: "Become a Sponsor", href: "/santas-knights#sponsors" },
    ],
  },
  {
    heading: "Visit",
    links: [
      {
        label: `${org.venue}, ${org.address1}, ${org.address2}`,
        href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(org.mapsQuery)}`,
      },
      { label: org.phone, href: org.phoneHref },
      { label: org.email, href: `mailto:${org.email}` },
    ],
  },
  {
    heading: "Follow",
    links: [
      { label: "Instagram", href: links.instagram },
      { label: "Facebook", href: links.facebook },
      { label: "YouTube", href: links.youtube },
    ],
  },
];

export const socials: { label: string; glyph: string; href: string }[] = [
  { label: "Facebook", glyph: "f", href: links.facebook },
  { label: "Instagram", glyph: "◎", href: links.instagram },
  { label: "YouTube", glyph: "▷", href: links.youtube },
];

/* ------------------------------------------------------------------ *
 * About page
 * ------------------------------------------------------------------ */

/**
 * The organization's own mission statement, quoted from the live site (Plan v2 §E0).
 * Used on Home, About, and wherever the canonical mission appears.
 */
export const missionStatement =
  "Santa's Knights' mission is to bring free martial arts, fitness, and activities to everyone, equitably, transcending socioeconomic, racial, and location boundaries, positively changing children's and adults' lives through exposure and lifestyle enhancement.";

/**
 * The record, on a line — the About page's timeline band. One date, one fact.
 *
 * These are the four dated entries only. The band's fifth node is the live
 * "today" one, and the page renders it itself: its numbers carry inline
 * emphasis, and it is styled as still-running rather than as one more past
 * event (see `.tl li:last-child` in app/redesign.css).
 */
export const timeline: { when: string; body: string }[] = [
  { when: "2013", body: "Gladiators NYC starts in a Harlem basement." },
  { when: "2015", body: "It becomes a 501(c)(3). Training goes free." },
  { when: "2020", body: "The documentary Dear Santa tells Damion's story." },
  { when: "2021", body: "The knights start fighting in public, in Central Park." },
];

/**
 * Founder bio reconciled per Plan v2 §E4 to incorporate live-site wording.
 * TODO: Confirm founding year (live: 2015; story: 2016 for nonprofit) with Damion.
 */
export const founder = {
  name: "Damion DiGrazia",
  role: "Founder, Santa's Knights",
  photoLabel: "PHOTO: Damion DiGrazia, founder",
  bio: [
    "Founded in 2015 by Damion DiGrazia, Santa's Knights is a service-disabled military veteran founded non-profit, 501(c)(3), that is tax-exempt federally and in the State of New York. Damion was inspired to create Santa's Knights by his own experience as an impoverished child that received a very thoughtful gift from Operation Santa Claus (through the U.S. Post Office) and also how when he received a career-altering injury in the line of duty in the military, from which he eventually recovered years later through the pursuit of martial arts, endurance training, and High-Intensity Interval Training (HIIT).",
    "After a career on Wall Street, and a bachelor's and master's at Ivy League universities, and also teaching martial arts for 5+ years on the side, Damion realized his passion was to create a free platform/program for people to be able to pursue their best-selves through martial arts and fitness. Combining all of these factors was how Santa's Knights was born and continues to thrive and grow every day! We welcome you in any way that you would like to be involved!",
  ],
  quote:
    "I'm ex-military and I got heavily injured while I was in. When I came out I was just a mess. Fitness and sports really saved my life.",
  quoteAttribution: "Damion DiGrazia, to Gothamist",
};

export const values: { title: string; body: string }[] = [
  {
    title: "Nobody pays",
    body: "Classes, the holiday gifts, the events. The people who use them never see a bill. Donations and grants cover the rest.",
  },
  {
    title: "Open to whoever shows up",
    body: "Kids, adults, women, veterans. You don't need experience, money, or a reason to be here.",
  },
  {
    title: "We work in Harlem",
    body: "Our home is the Manhattanville Community Center on 133rd Street, and most of what we do happens within walking distance of it.",
  },
  {
    title: "Giving is the point",
    body: "The training is what we're known for. Santa's Letters and the community work are why the nonprofit exists.",
  },
];

/* ------------------------------------------------------------------ *
 * Contact page — the three colour panels
 * ------------------------------------------------------------------ */

export const waysToHelp: {
  variant: "green" | "red" | "gold";
  title: string;
  body: string;
  cta: string;
  href: string;
}[] = [
  {
    variant: "green",
    title: "Adopt a letter",
    body: "Read a kid's wish, pick one, send the gift. It lands on Christmas morning.",
    cta: "See how it works",
    href: links.adoptLetter,
  },
  {
    variant: "red",
    title: "Give us a hand",
    body: "Sort letters, run the holiday event, coach a class, keep the books.",
    cta: "Volunteer roles",
    href: "#volunteer",
  },
  {
    variant: "gold",
    title: "Cover the cost",
    body: "Donations keep the gifts coming and the classes free.",
    cta: "Ways to give",
    href: links.donate,
  },
];

/**
 * Volunteer application role options — the checkbox rows on /contact#volunteer.
 * `value` is what lands in the admin inbox and matches the live Wix form's
 * wording, so applications stay comparable across the two sites; `label` is the
 * shorter thing a person actually reads next to a checkbox.
 */
export const volunteerRoles: { value: string; label: string }[] = [
  { value: "Martial Art Instructor", label: "Martial Art Instructor" },
  { value: "Martial Art Assistant Instructor", label: "Assistant Instructor" },
  { value: "Event Management", label: "Event Management" },
  { value: "Admin - General", label: "Admin — general" },
  { value: "Relationship Management", label: "Relationship Management" },
  { value: "Social Media", label: "Social Media" },
  { value: "Marketing", label: "Marketing" },
  { value: "Internship", label: "Internship" },
  { value: "Santa's Elf", label: "Santa's Elf" },
  { value: "Other", label: "Other" },
];

/* ------------------------------------------------------------------ *
 * Contact page
 * ------------------------------------------------------------------ */

export const contactReasons: { value: string; label: string }[] = [
  { value: "letters", label: "Santa's Letters" },
  { value: "volunteer", label: "Volunteering" },
  { value: "employment", label: "Employment" },
  { value: "donate", label: "Donating or sponsorship" },
  { value: "training", label: "Training and classes" },
  { value: "press", label: "Press or media" },
  { value: "other", label: "Something else" },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "What is Santa's Letters?",
    a: "Kids around the world write letters to Santa. We remove anything that could identify a child, then post the wishes so people can adopt them and send the gifts. It runs every December.",
  },
  {
    q: "How do I adopt a letter?",
    a: "Head to the Santa's Letters section to see how it works, or message us. You'll pick a wish, buy the gift, and send it. The child's identity stays private the whole way through.",
  },
  {
    q: "Is everything really free?",
    a: "Yes. We're a 501(c)(3), so the people we serve never pay. Donors and grants cover the classes, the gifts, and the events.",
  },
  {
    q: "I want to train. Where do I start?",
    a: "Browse the six free Gladiators NYC classes on the training site and pick the one that fits. You can reserve an upcoming session online — create a free account, sign a quick one-time waiver, and you're booked.",
  },
];

/* ------------------------------------------------------------------ *
 * Structured data (Plan v2 §SEO / Execution Plan Phase 0)
 *
 * Organization entity (sitewide) + per-class Course stubs (price $0). Booking
 * actions (potentialAction / ReserveAction → on-site URLs) are filled in once
 * the training tracker ships (Execution Plan Phase 5/7).
 * ------------------------------------------------------------------ */

/** Sitewide Organization (NGO) schema. Gladiators NYC is the program brand. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: org.name,
  legalName: org.legalName,
  url: SITE_URL,
  description: missionStatement,
  email: org.email,
  telephone: org.phone,
  slogan: TRADEMARK,
  brand: { "@type": "Brand", name: "Gladiators NYC" },
  address: {
    "@type": "PostalAddress",
    streetAddress: org.address1,
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10027",
    addressCountry: "US",
  },
  sameAs: socials.map((s) => s.href),
} as const;

/** Per-class Course stub. Free program, so offers price is $0. */
export function courseSchema(cls: ClassCard) {
  const url = cls.bookHref.startsWith("http") ? cls.bookHref : `${SITE_URL}${cls.bookHref}`;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: cls.name,
    description: cls.details ?? cls.tagline ?? bootcampBlurb,
    url,
    provider: {
      "@type": "Organization",
      name: org.name,
      sameAs: SITE_URL,
    },
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "Free",
      availability: "https://schema.org/InStock",
    },
  };
}

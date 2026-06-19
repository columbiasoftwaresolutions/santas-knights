/**
 * Single source of truth for site copy and links.
 *
 * This site is the public face of the organization and the home of the
 * Santa's Letters program. The training program (Gladiators NYC) has its own
 * dedicated site for the armory, schedule, and class booking. Links here
 * point there rather than handling logistics in-page.
 *
 * Placeholder hrefs ("#") are intentional until the real destinations exist.
 * "Buy now" membership URLs must be added manually in code. See Plan v2 §D5.
 */

// Points to the dedicated training site once it's live (separate project).
export const TRAINING_HREF = process.env.NEXT_PUBLIC_GLADIATORS_URL || "#training";
// Kept for existing imports; both refer to the training program's destination.
export const GLADIATORS_HREF = TRAINING_HREF;

/** Brand trademark restored per Plan v2 §E0. */
export const TRADEMARK = "The Gift of Martial Arts™";

export const links = {
  donate: "/donate",
  paypal: process.env.NEXT_PUBLIC_PAYPAL_URL || "/donate",
  venmo: process.env.NEXT_PUBLIC_VENMO_URL || "/donate",
  volunteer: "/get-involved",
  adoptLetter: "/letters/give",
  submitLetter: "/letters/submit",
  lettersLearnMore: "/letters",
  findClass: TRAINING_HREF,
  about: "/about",
  contact: "/contact",
  getInvolved: "/get-involved",
  sponsors: "/sponsors",
  linkInBio: "/links",
  // Plan v2 §D2 new routes
  gallery: "/gallery",
  membership: "/membership",
  training: "/training",
  online: "/online",
  account: "/account",
  accountLogin: "/account/login",
  accountRegister: "/account/register",
  accountLetters: "/account/letters",
} as const;

export const org = {
  name: "Santa's Knights",
  legalName: "Santa's Knights, Inc.",
  tagline: "A Harlem nonprofit. Free training all year, and a letter to Santa answered every December.",
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
  { label: "Donate", href: "/donate" },
  {
    label: "Santa's Knights",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Partners", href: "/sponsors" },
      { label: "Founder", href: "/about#founder" },
      { label: "Members", href: "/account" },
    ],
  },
  {
    label: "Classes",
    children: [
      { label: "In-Person", href: "/training" },
      { label: "Online", href: "/online" },
    ],
  },
  {
    label: "Letters to Santa",
    children: [
      { label: "Write a Letter", href: "/letters/submit" },
      { label: "Adopt a Letter", href: "/letters/give" },
    ],
  },
  { label: "Membership", href: "/membership" },
  { label: "Gallery", href: "/gallery" },
  {
    label: "Contact",
    children: [
      { label: "Contact Us", href: "/contact" },
      { label: "Volunteer", href: "/get-involved" },
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
  photo: string;
}[] = [
  {
    variant: "give",
    tag: "Santa's Letters",
    title: "Answering kids' letters to Santa",
    body: "Every December we collect letters from kids around Harlem, take off anything that could identify them, and post the wishes so anyone can pick one and send a gift. It's the reason the nonprofit exists.",
    cta: "How it works",
    href: "/letters",
    image: "/images/hero-community.jpg",
    imageAlt: "Santa's Knights members and families together at a community event",
    photo: "PHOTO: kids and volunteers at the holiday gift event",
  },
  {
    variant: "train",
    tag: "Free training",
    title: "Martial arts & fitness, year-round",
    body: "We teach armored combat and fitness in Harlem at no cost, beginners welcome. The classes, schedule, and booking live on our training site.",
    cta: "Go to the training site",
    href: TRAINING_HREF,
    image: "/images/gladiators-sparring.jpg",
    imageAlt: "Gladiators NYC fighters sparring in full armor",
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
    "Each December, children around Harlem write to Santa. We make sure those letters don't go unanswered. You read a wish, pick one, and send the gift, and a kid wakes up to something they asked for.",
  origin:
    "The idea isn't new. The Postal Service has been answering kids' letters to Santa since 1912, and Damion grew up taking part in it, picking a stranger's letter off the pile and mailing a gift. Santa's Letters is him running that same idea out of Harlem, and reaching a few more kids every year.",
  steps: [
    {
      title: "A kid writes",
      body: "Children around the neighborhood write to Santa with what they're hoping for that year.",
    },
    {
      title: "We take the names off",
      body: "Before a letter goes anywhere, we remove last names, addresses, and anything else that points to a real child.",
    },
    {
      title: "Someone sends the gift",
      body: "You read a wish, adopt it, and ship the present. You never see who the child is, and they never see who you are.",
    },
  ],
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
 * Training (Gladiators NYC): content for this site; booking on gladiators.nyc
 * ------------------------------------------------------------------ */

export const gladiatorsMeta: { value: string; label: string }[] = [
  { value: "Full-contact", label: "Steel weapons and armor" },
  { value: "Free", label: "No cost to train" },
  { value: "Since 2013", label: "Oldest league in NYC" },
];

/**
 * Full class catalog for /training (Plan v2 §E3/B1).
 * "Book Now" CTAs link to gladiators.nyc. Booking is not on this site.
 * TODO: Replace TRAINING_HREF with deep-links to specific classes on gladiators.nyc once available.
 */
export type ClassCard = {
  name: string;
  audience: string;
  duration: string;
  tagline?: string;
  bookHref: string;
};

export const classes: ClassCard[] = [
  {
    name: "Gladiator Bootcamp (open to all levels)",
    audience: "Adults & Teens",
    duration: "Duration Varies",
    tagline: undefined, // uses bootcampBlurb
    bookHref: TRAINING_HREF,
  },
  {
    name: "Gladiator Armored Practice (advanced)",
    audience: "Adults (as fighters & spectators) & Teens/Children as spectators",
    duration: "",
    bookHref: TRAINING_HREF,
  },
  {
    name: "Women's Medieval Combat & Fitness",
    audience: "Women",
    duration: "2 hr",
    tagline: "Empowerment through Strength, Skill, and Sisterhood",
    bookHref: TRAINING_HREF,
  },
  {
    name: "Women's (Premium) Combat Class, Midtown",
    audience: "Women",
    duration: "",
    tagline: "Combat, conditioning, and community in a Midtown studio.",
    bookHref: TRAINING_HREF,
  },
  {
    name: "Gladiators NYC for Military Veterans",
    audience: "U.S. Military Veterans",
    duration: "2 hr",
    tagline:
      "This class is (only) for U.S. Military Veterans (sponsored by the Department of Veterans Services)",
    bookHref: TRAINING_HREF,
  },
  {
    name: "Medieval Combat Fundamentals",
    audience: "All levels",
    duration: "1 hr 30 min",
    tagline: "Step into the world of historical martial arts with Gladiators NYC",
    bookHref: TRAINING_HREF,
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
 * App promo copy (Plan v2 §E2). Registration app is on gladiators.nyc.
 */
export const appPromo = {
  text: "Use the app to register for and manage your classes! The app is 100% FREE, always!",
  href: TRAINING_HREF,
  cta: "Register for classes ↗",
} as const;

/* ------------------------------------------------------------------ *
 * Membership tiers (Plan v2 §A4/E7)
 * ------------------------------------------------------------------ */

export type MembershipTier = {
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  ctaLabel: string;
  /** TODO: Replace placeholder /donate hrefs with real recurring-billing URLs. */
  href: string;
  isFree?: boolean;
};

export const membershipTiers: MembershipTier[] = [
  {
    name: "Class Membership",
    price: 0,
    priceLabel: "$0/mo",
    description: "100% free membership that lets you sign up for all classes!",
    ctaLabel: "Sign up free",
    href: TRAINING_HREF,
    isFree: true,
  },
  {
    name: "Gifts",
    price: 20,
    priceLabel: "$20/mo",
    description: "A present for a child in need per month!",
    ctaLabel: "Buy now", // TODO: add external recurring-billing URL
    href: links.donate,
  },
  {
    name: "Gifts and Equipment",
    price: 50,
    priceLabel: "$50/mo",
    description: "A present and a foam sword for a child-student in need!",
    ctaLabel: "Buy now", // TODO: add external recurring-billing URL
    href: links.donate,
  },
  {
    name: "Sponsor 2 Children",
    price: 100,
    priceLabel: "$100/mo",
    description: "Sponsor 2 children per month: gifts and foam swords for each.",
    ctaLabel: "Buy now", // TODO: add external recurring-billing URL
    href: links.donate,
  },
  {
    name: "Sponsor 5 Children",
    price: 250,
    priceLabel: "$250/mo",
    description: "Sponsor 5 children per month with gifts and equipment.",
    ctaLabel: "Buy now", // TODO: add external recurring-billing URL
    href: links.donate,
  },
  {
    name: "Corporate Membership",
    price: 500,
    priceLabel: "$500/mo",
    description:
      "This tier covers equipment and gifts for 10 children.",
    ctaLabel: "Buy now", // TODO: add external recurring-billing URL
    href: links.donate,
  },
];

/* ------------------------------------------------------------------ *
 * Partners / sponsors (Plan v2 §A5/E4)
 * ------------------------------------------------------------------ */

/**
 * Full partners roster from the live site. Logos are not yet in asset-library/
 * for most entries; text tiles render as fallback until client supplies logos.
 * See Plan v2 §F3 for the open question about partner logos.
 */
export const sponsors: { name: string; logo?: string; href?: string }[] = [
  { name: "Google" },
  { name: "Graham Windham" },
  { name: "Whole Foods Market" },
  { name: "NYU" },
  { name: "Kohl's" },
  { name: "Wounded Warrior Project" },
  { name: "Combat Wounded Veterans of America" },
  { name: "Futurelabs" },
  { name: "ClassPass" },
  { name: "NYPD Community Affairs" },
  { name: "New York Adventure Club" },
  { name: "Armored Combat Worldwide" },
  { name: "Bohemian Hall" },
  { name: "Draft Barn Beach" },
  { name: "Manhattanville Community Center" },
];

export const pressLogos: { name: string; src: string }[] = [
  { name: "The Guardian", src: "/images/press/the-guardian.png" },
  { name: "Men's Journal", src: "/images/press/mens-journal.jpg" },
  { name: "Yahoo News", src: "/images/press/yahoo-news.jpg" },
  { name: "Business Insider", src: "/images/press/business-insider.jpg" },
  { name: "New York Magazine", src: "/images/press/new-york-magazine.jpg" },
  { name: "Gizmodo", src: "/images/press/gizmodo.jpg" },
  { name: "ABC News", src: "/images/press/abc-news.jpg" },
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
      { label: "About", href: "/about" },
      { label: "Santa's Letters", href: "/letters" },
      { label: "Training", href: "/training" },
      { label: "Online Classes", href: "/online" },
      { label: "Membership", href: "/membership" },
      { label: "Gallery", href: "/gallery" },
      { label: "Partners", href: "/sponsors" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "Adopt a Letter", href: "/letters/give" },
      { label: "Submit a Letter", href: "/letters/submit" },
      { label: "Volunteer", href: "/get-involved" },
      { label: "Become a Sponsor", href: "/sponsors" },
      { label: "All our links", href: "/links" },
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
      { label: "Instagram", href: "https://www.instagram.com/santasknights/" },
      { label: "Facebook", href: "https://www.facebook.com/santasknights" },
      { label: "YouTube", href: "https://www.youtube.com/channel/UC5trQ89gJ3e-pRy-d977KCg" },
    ],
  },
];

export const socials: { label: string; glyph: string; href: string }[] = [
  { label: "Facebook", glyph: "f", href: "https://www.facebook.com/santasknights" },
  { label: "Instagram", glyph: "◎", href: "https://www.instagram.com/santasknights/" },
  {
    label: "YouTube",
    glyph: "▷",
    href: "https://www.youtube.com/channel/UC5trQ89gJ3e-pRy-d977KCg",
  },
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

export const aboutStory: { heading: string; body: string }[] = [
  {
    heading: "A letter, picked off a pile",
    body: "As a kid, Damion DiGrazia took part in the Postal Service's Operation Santa: you adopt a stranger's letter to Santa and send the gift they asked for. It stuck with him. Years later, Santa's Letters became his way of doing the same thing for Harlem, on a bigger scale.",
  },
  {
    heading: "The training came first",
    body: "In 2013 he started Gladiators NYC, full-contact armored combat with steel weapons. It grew into the oldest league of its kind in the city. In 2016 he made it a nonprofit so the classes could be free, and the giving could have a home.",
  },
  {
    heading: "One organization, two jobs",
    body: "Today Santa's Knights does two things out of Harlem. It runs free martial arts and fitness all year, and every holiday season it answers kids' letters to Santa. The training has its own site now. This one is for everything else.",
  },
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
    "Damion DiGrazia is a service-disabled military veteran and fourth-generation New Yorker. He came home from the service badly injured. Martial arts and fitness helped him recover. After more than five years of teaching martial arts, he set out to build a free program where other people could train and improve their health. The idea also drew on a thoughtful gift he received through Operation Santa Claus as a child.",
    "Damion brought experience from Wall Street and degrees from Ivy League universities to the work. He eventually left finance to run Santa's Knights full time and give other people the support that had helped him recover.",
    "He started Gladiators NYC in 2013, turning it into the Santa's Knights 501(c)(3) nonprofit. The Letters to Santa program came from his own childhood, adopting a stranger's letter through Operation Santa, and he has been widening it every December since.",
  ],
  quote:
    "I'm ex-military and I got heavily injured while I was in. When I came out I was just a mess. Fitness and sports really saved my life.",
  quoteAttribution: "Damion DiGrazia, to CBS New York",
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
 * Get Involved page
 * ------------------------------------------------------------------ */

export const waysToHelp: {
  variant: "green" | "red" | "gold";
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}[] = [
  {
    variant: "green",
    eyebrow: "Santa's Letters",
    title: "Adopt a letter",
    body: "Read a kid's wish, pick one, and send the gift. It's the most direct thing you can do here, and it lands on Christmas morning.",
    cta: "See how it works",
    href: links.adoptLetter,
  },
  {
    variant: "red",
    eyebrow: "Volunteer",
    title: "Give us a hand",
    body: "Help sort letters, run the holiday event, coach a class, or keep the books. Most of it fits around a regular schedule.",
    cta: "Volunteer roles",
    href: "#volunteer",
  },
  {
    variant: "gold",
    eyebrow: "Donate",
    title: "Cover the cost",
    body: "Donations are what keep the gifts coming and the classes free. Every dollar is tax-deductible.",
    cta: "Ways to give",
    href: "#give",
  },
];

export const volunteerRoles: string[] = [
  "Santa's Letters helper",
  "Event Management",
  "Martial Arts Instructor",
  "Assistant Instructor",
  "Relationship Management",
  "Social Media",
  "Marketing",
  "Admin / General",
  "Internship",
  "Something else",
];

export const waysToGive: { label: string; body: string; cta: string; href: string }[] = [
  {
    label: "Adopt a letter",
    body: "Grant a child's holiday wish directly, or sponsor a batch of letters at once.",
    cta: "Start with Santa's Letters",
    href: links.adoptLetter,
  },
  {
    label: "PayPal",
    body: "Make a one-time or recurring gift. It's tax-deductible and goes straight to the programs.",
    cta: "Give with PayPal",
    href: links.paypal,
  },
  {
    label: "Venmo",
    body: "Send a one-time gift through Venmo.",
    cta: "Give with Venmo",
    href: links.venmo,
  },
];

/* ------------------------------------------------------------------ *
 * Contact page
 * ------------------------------------------------------------------ */

export const contactReasons: { value: string; label: string }[] = [
  { value: "letters", label: "Santa's Letters" },
  { value: "volunteer", label: "Volunteering" },
  { value: "donate", label: "Donating or sponsorship" },
  { value: "training", label: "Training and classes" },
  { value: "press", label: "Press or media" },
  { value: "other", label: "Something else" },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "What is Santa's Letters?",
    a: "Kids around Harlem write letters to Santa. We remove anything that could identify a child, then post the wishes so people can adopt them and send the gifts. It runs every December.",
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
    a: "The classes, schedule, and booking live on our training site. Head there to find a class, or message us and we'll point you the right way.",
  },
];

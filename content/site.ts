/**
 * Single source of truth for site copy and links.
 *
 * This site is the public face of the organization and the home of the
 * Santa's Letters program. The training program (Gladiators NYC) has its own
 * dedicated site for the armory, schedule, and class booking — links here
 * point there rather than handling logistics in-page.
 *
 * Placeholder hrefs ("#") are intentional until the real destinations exist.
 */

// TODO: point to the dedicated training site once it's live (separate project).
export const TRAINING_HREF = "#training";
// Kept for existing imports; both refer to the training program's destination.
export const GLADIATORS_HREF = TRAINING_HREF;

export const links = {
  donate: "/#donate",
  paypal: "#",
  venmo: "#",
  volunteer: "/get-involved",
  adoptLetter: "/#letters",
  lettersLearnMore: "/#letters",
  findClass: TRAINING_HREF,
  about: "/about",
  contact: "/contact",
  getInvolved: "/get-involved",
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

export const navLinks: { label: string; href: string; gladiators?: boolean }[] = [
  { label: "About", href: "/about" },
  { label: "Santa's Letters", href: "/#letters" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Training", href: TRAINING_HREF, gladiators: true },
  { label: "Contact", href: "/contact" },
];

export const stats: { value: string; unit?: string; label: string }[] = [
  { value: "100", unit: "%", label: "Free for everyone we serve" },
  { value: "2016", label: "Nonprofit since" },
  { value: "Harlem", label: "Where we're based" },
  { value: "501(c)(3)", label: "Gifts are tax-deductible" },
];

/* ------------------------------------------------------------------ *
 * Homepage — "what we do" overview cards
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
    href: "/#letters",
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
 * Santa's Letters — the program this site is built around
 * ------------------------------------------------------------------ */

export const letters = {
  eyebrow: "Santa's Letters",
  title: "Every kid deserves an answer.",
  intro:
    "Each December, children around Harlem write to Santa. We make sure those letters don't go unanswered. You read a wish, pick one, and send the gift — and a kid wakes up to something they actually asked for.",
  /** The Operation Santa origin, kept short and concrete. */
  origin:
    "The idea isn't new. The Postal Service has been answering kids' letters to Santa since 1912, and Damion grew up taking part in it — picking a stranger's letter off the pile and mailing a gift. Santa's Letters is him running that same idea out of Harlem, and trying to reach more kids every year.",
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

/* ------------------------------------------------------------------ *
 * Training (Gladiators NYC) — overview only; lives on its own site
 * ------------------------------------------------------------------ */

export const gladiatorsMeta: { value: string; label: string }[] = [
  { value: "Full-contact", label: "Steel weapons and armor" },
  { value: "Free", label: "No cost to train" },
  { value: "Since 2013", label: "Oldest league in NYC" },
];

/** Class names only — full descriptions and booking are on the training site. */
export const programs: { name: string; audience: string }[] = [
  { name: "Gladiator Bootcamp", audience: "All levels" },
  { name: "Medieval Combat Fundamentals", audience: "Beginners" },
  { name: "Armored Practice", audience: "Advanced" },
  { name: "Women's Combat & Fitness", audience: "Women" },
  { name: "Gladiators for Veterans", audience: "Veterans" },
  { name: "Gladiator Kids", audience: "Children" },
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

export const footerColumns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "Santa's Letters", href: "/#letters" },
      { label: "Get Involved", href: "/get-involved" },
      { label: "Training site", href: TRAINING_HREF },
      { label: "Donate", href: "/#donate" },
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

/** The organization's own mission statement, used verbatim. */
export const missionStatement =
  "Santa's Knights brings free martial arts, fitness, and activities to everyone, equitably, transcending socioeconomic, racial, and location boundaries, positively changing children's and adults' lives through exposure and lifestyle enhancement.";

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

export const founder = {
  name: "Damion DiGrazia",
  role: "Founder, Santa's Knights",
  /** Honest placeholder label until a real portrait is supplied. */
  photoLabel: "PHOTO: Damion DiGrazia, founder",
  bio: [
    "Damion is a fourth-generation New Yorker and an Air Force veteran. He was badly injured in service and came home struggling. Sport and training were what pulled him out of it, and that's stayed the point of everything he's built since.",
    "He studied at Columbia, earned a master's in finance at Harvard, and worked at Morgan Stanley before leaving Wall Street. He wanted to spend his time giving people the two things that had helped him most: a reason to move, and people to do it with.",
    "He started Gladiators NYC in 2013 and turned it into the Santa's Knights nonprofit in 2016. The letters program came from his own childhood — adopting a letter through Operation Santa — and he's been widening it ever since.",
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
    body: "Prefer Venmo? Send your gift there and it does the same work.",
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

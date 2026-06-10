/**
 * Single source of truth for homepage copy and links.
 * Placeholder hrefs ("#") are intentional until the real destinations exist.
 * Gladiators NYC is a separate brand/site — its links are centralized here.
 */

// TODO: point to the Gladiators NYC section/site once it's built (separate project).
export const GLADIATORS_HREF = "#training";

export const links = {
  donate: "/#donate",
  paypal: "#",
  venmo: "#",
  volunteer: "/get-involved",
  lettersLearnMore: "/#letters",
  findClass: GLADIATORS_HREF,
  about: "/about",
  contact: "/contact",
  getInvolved: "/get-involved",
} as const;

export const org = {
  name: "Santa's Knights",
  legalName: "Santa's Knights, Inc.",
  tagline: "Free martial arts, fitness & community in Harlem",
  trademark: "The Gift of Martial Arts™",
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
  { label: "Training", href: GLADIATORS_HREF, gladiators: true },
  { label: "Letters to Santa", href: "/#letters" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

export const stats: { value: string; unit?: string; label: string }[] = [
  { value: "100", unit: "%", label: "Free, always" },
  { value: "All", unit: "·ages", label: "Kids, adults, veterans" },
  { value: "Harlem", label: "Home base · all welcome" },
  { value: "501(c)(3)", label: "Tax-deductible giving" },
];

export const pillars: {
  variant: "train" | "give";
  tag: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  /** Real photo if available; otherwise `photo` is used as a Placeholder label. */
  image?: string;
  imageAlt?: string;
  photo: string;
}[] = [
  {
    variant: "train",
    tag: "Free combat training",
    title: "Gladiators NYC",
    body: "Our flagship program: full-contact armored combat with steel weapons and armor, the oldest and premiere league of its kind in NYC. Bootcamp, fundamentals, women's and veterans' classes. All free.",
    cta: "Enter the arena",
    href: GLADIATORS_HREF,
    image: "/images/gladiators-sparring.jpg",
    imageAlt: "Gladiators NYC fighters sparring in full armor",
    photo: "PHOTO: armored fighter, steel weapon, dramatic",
  },
  {
    variant: "give",
    tag: "Community & giving",
    title: "Service & events",
    body: "Beyond the mat, we show up for Harlem, from the annual Letters to Santa gift drive to community events that bring neighbors together. Volunteer, donate, or simply join us.",
    cta: "Get involved",
    href: "#letters",
    photo: "PHOTO: community event, families, celebration",
  },
];

export const gladiatorsMeta: { value: string; label: string }[] = [
  { value: "Full-contact", label: "1v1 & team vs. team" },
  { value: "Steel & armor", label: "The real sport" },
  { value: "$0", label: "Always free to train" },
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
      { label: "About / Mission", href: "/about" },
      { label: "Gladiators NYC", href: GLADIATORS_HREF },
      { label: "Letters to Santa", href: "/#letters" },
      { label: "Get Involved", href: "/get-involved" },
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
      { label: "Instagram", href: "#" },
      { label: "YouTube", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "TikTok", href: "#" },
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

/** The real, full mission statement used on santasknights.org. */
export const missionStatement =
  "Santa's Knights brings free martial arts, fitness, and activities to everyone, equitably, transcending socioeconomic, racial, and location boundaries, positively changing children's and adults' lives through exposure and lifestyle enhancement.";

export const aboutStory: { heading: string; body: string }[] = [
  {
    heading: "It started with a sport nobody was teaching for free",
    body: "In 2013, founder Damion DiGrazia started Gladiators NYC, full-contact armored combat with steel weapons and team-vs-team fighting. It became the oldest and premiere league, school, and team of the sport in New York City. Three years later he turned that community into a nonprofit so the training could be given away, no questions asked.",
  },
  {
    heading: "A nonprofit built on one idea: fitness should be free",
    body: "Santa's Knights, Inc. was founded in 2016 as a 501(c)(3). Today it runs free classes three days a week out of the Manhattanville Community Center in Harlem, for kids, adults, women, and military veterans. There are no fees and no barriers. If you show up, you train.",
  },
  {
    heading: "From the mat to the whole neighborhood",
    body: "Beyond combat training, Santa's Knights shows up for Harlem all year, from community fitness to the annual Letters to Santa gift drive, which helps make the holidays brighter for local kids. The same belief runs through all of it: strength, purpose, and belonging should be available to everyone.",
  },
];

export const founder = {
  name: "Damion DiGrazia",
  role: "Founder · Santa's Knights & Gladiators NYC",
  /** Honest placeholder label until a real portrait is supplied. */
  photoLabel: "PHOTO: Damion DiGrazia, founder, in the gym",
  bio: [
    "Damion DiGrazia is a fourth-generation New Yorker and U.S. Air Force veteran. After being seriously injured in service, he came home struggling, and found his way back through fitness and sport. That recovery became the whole point of his work.",
    "He went on to Columbia University and earned a master's in finance at Harvard, then worked as a management consultant at Morgan Stanley. He left Wall Street to build something that gives people what saved him: a healthy outlet for competitive energy, and a community that fights social isolation.",
    "In 2013 he founded Gladiators NYC; in 2016 he turned it into the Santa's Knights nonprofit so the training could be free for everyone. He still leads the program as the founder of armored combat in NYC.",
  ],
  quote:
    "I'm ex-military and I got heavily injured while I was in. When I came out I was just a mess. Fitness and sports really saved my life.",
  quoteAttribution: "Damion DiGrazia, to CBS New York",
};

export const values: { title: string; body: string }[] = [
  {
    title: "Free, always",
    body: "Every class and program is free, all year long, with a no-questions-asked policy. Donations and grants cover the cost so participants never have to.",
  },
  {
    title: "Everyone belongs",
    body: "Kids, adults, women, and veterans train side by side, regardless of background, income, or zip code. Beginners are not just welcome, they're expected.",
  },
  {
    title: "Strength with purpose",
    body: "We channel competitive energy into discipline, fitness, and confidence, the same things that pull people out of isolation and into a community.",
  },
  {
    title: "Rooted in Harlem",
    body: "Home base is the Manhattanville Community Center, and we show up for our neighborhood all year, on the mat and off it.",
  },
];

/* ------------------------------------------------------------------ *
 * Programs (shared by About + Get Involved)
 * ------------------------------------------------------------------ */

export const programs: { name: string; audience: string; body: string }[] = [
  {
    name: "Gladiator Bootcamp",
    audience: "All levels",
    body: "High-energy, music-driven combat fitness using foam weapons and training armor. The front door to the sport, no experience needed.",
  },
  {
    name: "Medieval Combat Fundamentals",
    audience: "Beginners",
    body: "Learn the techniques of armored combat from the ground up, footwork, strikes, and weapon basics, before stepping up to full kit.",
  },
  {
    name: "Gladiator Armored Practice",
    audience: "Advanced",
    body: "Full-contact, steel-weapon, team-vs-team fighting in real armor for experienced members training toward tournaments.",
  },
  {
    name: "Women's Medieval Combat & Fitness",
    audience: "Women",
    body: "A women's class blending combat fundamentals and fitness, one of our largest and fastest-growing groups.",
  },
  {
    name: "Gladiators NYC for Veterans",
    audience: "Military veterans",
    body: "A dedicated class for veterans, built on the same belief in fitness and camaraderie that started Santa's Knights.",
  },
  {
    name: "Gladiator Kids",
    audience: "Children",
    body: "Kids learn to train as armored combatants with foam weapons and armor in a safe, high-energy, confidence-building class.",
  },
];

/* ------------------------------------------------------------------ *
 * Get Involved page
 * ------------------------------------------------------------------ */

export const waysToHelp: {
  variant: "red" | "green" | "gold";
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}[] = [
  {
    variant: "red",
    eyebrow: "Train",
    title: "Step onto the mat",
    body: "The simplest way in: come to a free class. No fees, no experience, no commitment, just show up. Every participant strengthens the community.",
    cta: "Find a free class",
    href: GLADIATORS_HREF,
  },
  {
    variant: "green",
    eyebrow: "Volunteer",
    title: "Lend your time & skills",
    body: "Coach, help run events, manage social media, or play Santa's Elf at the holiday drive. There's a role for every skill set and schedule.",
    cta: "See volunteer roles",
    href: "#volunteer",
  },
  {
    variant: "gold",
    eyebrow: "Give",
    title: "Fund free training",
    body: "Every tax-deductible dollar goes straight to free classes, armor, and community programs. Donations are what keep the doors open and the cost at zero.",
    cta: "Ways to give",
    href: "#give",
  },
];

export const volunteerRoles: string[] = [
  "Martial Arts Instructor",
  "Assistant Instructor",
  "Event Management",
  "Admin / General",
  "Relationship Management",
  "Social Media",
  "Marketing",
  "Internship",
  "Santa's Elf (holiday drive)",
  "Something else",
];

export const waysToGive: { label: string; body: string; cta: string; href: string }[] = [
  {
    label: "PayPal",
    body: "Make a one-time or recurring tax-deductible gift online in a few seconds.",
    cta: "Give with PayPal",
    href: links.paypal,
  },
  {
    label: "Venmo",
    body: "Prefer Venmo? Send your gift directly, every dollar funds free programs.",
    cta: "Give with Venmo",
    href: links.venmo,
  },
  {
    label: "Letters to Santa",
    body: "Adopt a child's letter and grant a holiday wish, or sponsor the celebration.",
    cta: "Learn how it works",
    href: links.lettersLearnMore,
  },
];

/* ------------------------------------------------------------------ *
 * Contact page
 * ------------------------------------------------------------------ */

export const contactReasons: { value: string; label: string }[] = [
  { value: "classes", label: "Joining a class" },
  { value: "volunteer", label: "Volunteering" },
  { value: "donate", label: "Donating / sponsorship" },
  { value: "letters", label: "Letters to Santa" },
  { value: "press", label: "Press / media" },
  { value: "other", label: "Something else" },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Are classes really free?",
    a: "Yes. Every Santa's Knights class is free, all year, with a no-questions-asked policy. We're a 501(c)(3) nonprofit funded by donors so participants never pay.",
  },
  {
    q: "Do I need experience or my own gear?",
    a: "No. Beginners are expected, and we provide foam weapons and training armor to learn with. Just wear clothes you can move in.",
  },
  {
    q: "Where and when do you train?",
    a: "At the Manhattanville Community Center, 530 West 133rd Street in Harlem, three days a week. Message us for the current class schedule.",
  },
  {
    q: "Who can join?",
    a: "Everyone. We run classes for kids, adults, women, and military veterans, regardless of background, income, or zip code.",
  },
];

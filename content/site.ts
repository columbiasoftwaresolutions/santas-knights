/**
 * Single source of truth for homepage copy and links.
 * Placeholder hrefs ("#") are intentional until the real destinations exist.
 * Gladiators NYC is a separate brand/site — its links are centralized here.
 */

// TODO: point to the Gladiators NYC section/site once it's built (separate project).
export const GLADIATORS_HREF = "#training";

export const links = {
  donate: "#donate",
  paypal: "#",
  venmo: "#",
  volunteer: "#",
  lettersLearnMore: "#",
  findClass: GLADIATORS_HREF,
} as const;

export const org = {
  name: "Santa's Knights",
  legalName: "Santa's Knights, Inc.",
  tagline: "Free martial arts, fitness & community in Harlem",
  address1: "530 W 133rd St",
  address2: "New York, NY 10027",
  phone: "(212) 873-5818",
  phoneHref: "tel:+12128735818",
  email: "info@santasknights.org",
} as const;

export const navLinks: { label: string; href: string; gladiators?: boolean }[] = [
  { label: "About", href: "#about" },
  { label: "Training", href: GLADIATORS_HREF, gladiators: true },
  { label: "Letters to Santa", href: "#letters" },
  { label: "Get Involved", href: "#involved" },
  { label: "Contact", href: "#contact" },
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
  photo: string;
}[] = [
  {
    variant: "train",
    tag: "Free combat training",
    title: "Gladiators NYC",
    body: "Our flagship program: full-contact armored combat with steel weapons and armor, the oldest and premiere league of its kind in NYC. Bootcamp, fundamentals, women's and veterans' classes. All free.",
    cta: "Enter the arena",
    href: GLADIATORS_HREF,
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

export const pressLogos = ["The Guardian", "Men's Journal", "Yahoo News", "NY Post", "History"];

export const footerColumns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "About / Mission", href: "#about" },
      { label: "Gladiators NYC", href: GLADIATORS_HREF },
      { label: "Letters to Santa", href: "#letters" },
      { label: "Get Involved", href: "#involved" },
      { label: "Donate", href: "#donate" },
    ],
  },
  {
    heading: "Visit",
    links: [
      { label: `${org.address1}, ${org.address2}`, href: "#" },
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
  { label: "Facebook", glyph: "f", href: "#" },
  { label: "Instagram", glyph: "◎", href: "#" },
  { label: "YouTube", glyph: "▷", href: "#" },
  { label: "TikTok", glyph: "♪", href: "#" },
];

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { links, org, socials, TRAINING_HREF } from "@/content/site";

export const metadata: Metadata = {
  title: "Links · Santa's Knights",
  description:
    "Every Santa's Knights link in one place: donate, Santa's Letters, training, volunteering, and our social channels.",
};

/**
 * Link-in-bio page used by the Instagram profile, so it is built
 * as a single thumb-friendly column of large tap targets.
 */
const bioLinks: { label: string; sub: string; href: string; primary?: boolean }[] = [
  {
    label: "Adopt a letter to Santa",
    sub: "Read a kid's wish and send the gift",
    href: links.adoptLetter,
    primary: true,
  },
  {
    label: "Submit your child's letter",
    sub: "Parents and guardians can join the gift drive",
    href: links.submitLetter,
  },
  { label: "Donate", sub: "Tax-deductible · keeps everything free", href: links.donate },
  { label: "Free training & classes", sub: "Gladiators NYC combat program", href: TRAINING_HREF },
  { label: "Volunteer with us", sub: "Letters, events, coaching, and more", href: links.getInvolved },
  { label: "About Santa's Knights", sub: "A Harlem 501(c)(3) since 2016", href: links.about },
  { label: "Contact", sub: "Questions, press, partnerships", href: links.contact },
];

export default function LinksPage() {
  return (
    <section className="py-section">
      <Container className="max-w-[560px]">
        <div className="text-center">
          <span
            aria-hidden
            className="mx-auto flex h-[64px] w-[64px] items-center justify-center bg-red text-[30px] text-white"
          >
            ♔
          </span>
          <h1 className="mt-5 text-[34px] font-black tracking-[-0.03em]">{org.name}</h1>
          <p className="mt-2 text-[12px] font-bold tracking-[0.16em] text-amber uppercase">
            Harlem 501(c)(3) · 100% free
          </p>
          <p className="mt-3 text-[16px] text-muted">{org.tagline}</p>
        </div>

        <nav className="mt-9 grid gap-3.5">
          {bioLinks.map((link) => {
            const internal = link.href.startsWith("/");
            const Tag = "a";
            return (
              <Tag
                key={link.label}
                href={link.href}
                {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className={
                  link.primary
                    ? "block border border-transparent bg-red px-7 py-[18px] text-center transition-colors duration-150 hover:bg-red-deep"
                    : "block border border-line bg-card px-7 py-[18px] text-center transition-colors duration-150 hover:bg-paper-raised"
                }
              >
                <span
                  className={
                    link.primary ? "block font-extrabold text-white" : "block font-extrabold text-ink"
                  }
                >
                  {link.label}
                </span>
                <span
                  className={
                    link.primary
                      ? "mt-0.5 block text-[13.5px] text-white/80"
                      : "mt-0.5 block text-[13.5px] text-muted"
                  }
                >
                  {link.sub}
                </span>
              </Tag>
            );
          })}
        </nav>

        <div className="mt-9 flex items-center justify-center gap-3">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-[44px] w-[44px] items-center justify-center border border-line bg-card text-[17px] text-ink transition-colors duration-150 hover:bg-paper-raised"
            >
              <span aria-hidden>{social.glyph}</span>
            </a>
          ))}
        </div>

        <p className="mt-7 text-center text-[13.5px] text-muted">
          {org.venue} · {org.address1}, {org.address2}
        </p>
      </Container>
    </section>
  );
}

import { Brand } from "@/components/layout/Brand";
import { Container } from "@/components/ui/Container";
import { footerColumns, socials } from "@/content/site";

export function Footer() {
  return (
    <footer id="contact" className="bg-ink pt-16 pb-[30px] text-[#cfc4b2]">
      <Container>
        <div className="mb-[42px] grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Brand className="mb-3.5 text-white" />
            <p className="max-w-[36ch] text-[15px] text-[#a89d8b]">
              A Harlem nonprofit. We answer kids&apos; letters to Santa each December, and teach free
              martial arts and fitness the rest of the year.
            </p>
            <p className="mt-4 max-w-[42ch] text-[13px] leading-relaxed text-[#8a8071]">
              Santa&apos;s Knights, Inc. is a registered 501(c)(3) nonprofit. Gladiators NYC is its
              free training program; the schedule and class booking live on the training site.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-[15px] text-[13px] font-bold uppercase tracking-[0.1em] text-white">
                {col.heading}
              </h4>
              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-1.5 text-[15px] text-[#cfc4b2] transition-colors hover:text-gold-soft"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 border-t border-white/10 pt-[22px] text-[13px] text-[#8a8071]">
          <span>
            © 2026 Santa&apos;s Knights, Inc. · All rights reserved · Donations are tax-deductible
          </span>
          <div className="flex gap-2.5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.08] text-[13px] transition-colors hover:bg-red"
              >
                <span aria-hidden>{social.glyph}</span>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

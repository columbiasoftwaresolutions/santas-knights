import { Brand } from "@/components/layout/Brand";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { footerColumns, socials } from "@/content/site";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-bone/12 bg-ink2 pt-16 pb-[30px] text-bone/70">
      <Container>
        {/* Two columns from the smallest phone up: four stacked link lists is
            more scrolling than the page above them. The blurb spans both. */}
        <div className="mb-[42px] grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Brand className="mb-3 text-bone" tagline={false} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber">
              The Gift of Martial Arts&trade;
            </p>
            <p className="mt-4 max-w-[36ch] text-[15px] text-bone/60">
              A Harlem nonprofit. We answer kids&apos; letters to Santa each December, and teach free
              martial arts and fitness the rest of the year.
            </p>
            <p className="mt-4 max-w-[42ch] text-[13px] leading-relaxed text-bone/45">
              Santa&apos;s Knights, Inc. is a registered 501(c)(3) nonprofit. Free Gladiators
              NYC classes, schedule, and booking live on gladiators.nyc.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading} className={cn(col.wide && "col-span-2 lg:col-span-1")}>
              <h4 className="mb-[15px] text-[11px] font-bold uppercase tracking-[0.24em] text-bone/45">
                {col.heading}
              </h4>
              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-2 text-[14.5px] text-bone/78 transition-colors hover:text-amber lg:py-1.5"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-5 border-t border-bone/12 pt-[22px] text-center text-[12.5px] text-bone/50 sm:flex-row sm:justify-between sm:gap-3.5 sm:text-left">
          <span>
            © 2026 Santa&apos;s Knights, Inc. A 501(c)(3) nonprofit. Donations are tax-deductible.
          </span>
          <div className="flex gap-2.5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="grid h-9 w-9 place-items-center bg-bone/[0.08] text-[13px] transition-colors hover:bg-red hover:text-paper"
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

import { cn } from "@/lib/cn";
import { Brand } from "@/components/layout/Brand";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { navLinks, links, GLADIATORS_HREF } from "@/content/site";

/** Sticky translucent nav. Links collapse on narrow viewports (mobile menu TBD). */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/[0.88] backdrop-blur-[10px]">
      <Container className="flex h-[76px] items-center gap-[30px]">
        <Brand />

        <nav className="ml-2 hidden gap-[26px] text-[15.5px] font-semibold text-[#4c443b] lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "border-b-2 border-transparent py-1.5 transition-colors hover:text-ink",
                link.gladiators ? "hover:border-steel" : "hover:border-red",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Button href={GLADIATORS_HREF} variant="ghost" className="px-5 py-[11px] text-[15px]">
            Gladiators NYC ↗
          </Button>
          <Button href={links.donate} variant="red" className="px-[22px] py-[11px] text-[15px]">
            Donate
          </Button>
        </div>
      </Container>
    </header>
  );
}

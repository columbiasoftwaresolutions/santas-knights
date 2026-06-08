import { Container } from "@/components/ui/Container";
import { links } from "@/content/site";

/** Slim dark bar with the 501(c)(3) status badge and donation quick-links. */
export function UtilityBar() {
  return (
    <div className="bg-ink text-[13.5px] text-[#d8cdbb]">
      <Container className="flex h-[42px] items-center gap-[18px]">
        <span className="flex items-center gap-2 font-bold text-gold-soft">
          <span className="h-[7px] w-[7px] rounded-full bg-green" aria-hidden />
          501(c)(3) nonprofit
          <span className="hidden font-normal text-[#d8cdbb] sm:inline">· 100% free, always</span>
        </span>
        <nav className="ml-auto flex items-center gap-4 font-semibold">
          <a href={links.donate} className="transition-colors hover:text-white">
            Donate
          </a>
          <span className="opacity-30" aria-hidden>
            ·
          </span>
          <a href={links.paypal} className="transition-colors hover:text-white">
            PayPal
          </a>
          <span className="opacity-30" aria-hidden>
            ·
          </span>
          <a href={links.venmo} className="transition-colors hover:text-white">
            Venmo
          </a>
        </nav>
      </Container>
    </div>
  );
}

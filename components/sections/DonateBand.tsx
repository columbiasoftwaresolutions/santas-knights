import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { links } from "@/content/site";

export function DonateBand() {
  return (
    <section
      id="donate"
      className="relative overflow-hidden bg-red text-white after:absolute after:-right-[30px] after:-bottom-[70px] after:text-[300px] after:leading-none after:text-white/[0.07] after:content-['♔']"
    >
      <Container className="relative flex flex-wrap items-center justify-between gap-[30px] py-14">
        <div>
          <h2 className="max-w-[20ch] text-[clamp(28px,3.6vw,44px)]">Your gift keeps it free.</h2>
          <p className="mt-2.5 max-w-[40ch] opacity-90">
            Every donation is tax-deductible and goes straight to free training, armor, and
            community programs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={links.paypal} variant="onRed">
            Donate with PayPal
          </Button>
          <Button href={links.venmo} variant="ink">
            Venmo
          </Button>
        </div>
      </Container>
    </section>
  );
}

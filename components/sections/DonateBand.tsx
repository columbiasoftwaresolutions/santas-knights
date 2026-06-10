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
          <h2 className="max-w-[20ch] text-h2-band">Your gift is what makes it free.</h2>
          <p className="mt-2.5 max-w-[42ch] opacity-90">
            Donations pay for the holiday gifts, the classes, and the events. All of it is
            tax-deductible, and all of it goes to the work.
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

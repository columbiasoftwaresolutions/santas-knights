import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { links } from "@/content/site";

export function GetInvolved() {
  return (
    <section id="involved" className="pt-2.5 pb-section">
      <Container className="grid gap-[22px] md:grid-cols-[1.15fr_0.85fr]">
        <Card className="flex flex-col p-[38px]">
          <SectionHeading
            className="flex-1"
            as="h3"
            size="h3"
            eyebrow="Get involved"
            title="Lend a hand"
            intro="Adopt a letter, sort the holiday mail, help run the gift event, or coach a class. Most of it takes no experience, just some time."
          />
          <div className="mt-[22px] flex flex-wrap gap-3">
            <Button href={links.getInvolved} variant="ink">
              Ways to help
            </Button>
            <Button href={links.adoptLetter} variant="ghost">
              Adopt a letter
            </Button>
          </div>
        </Card>

        <Card tone="goldSoft" className="flex flex-col justify-center p-[38px]">
          <SectionHeading
            as="h3"
            size="h3"
            eyebrow="Stay in the loop"
            eyebrowClassName="text-gold"
            title="Newsletter"
            intro="Class schedules, news, and ways to help, straight to your inbox."
          />
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </Card>
      </Container>
    </section>
  );
}

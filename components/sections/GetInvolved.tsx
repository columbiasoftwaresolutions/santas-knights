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
            title="Volunteer or join the crew"
            intro="Coach, help out on community days, or step onto the mat and train. There's a place for everyone, and no experience is needed to start."
          />
          <div className="mt-[22px] flex flex-wrap gap-3">
            <Button href={links.volunteer} variant="ink">
              Volunteer with us
            </Button>
            <Button href={links.findClass} variant="ghost">
              Find a class
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

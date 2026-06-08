import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { links } from "@/content/site";

export function GetInvolved() {
  return (
    <section id="involved" className="pt-2.5 pb-[74px]">
      <Container className="grid gap-[22px] md:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col rounded-card border border-line bg-card p-[38px]">
          <Eyebrow>Get involved</Eyebrow>
          <h3 className="mt-2 text-[26px]">Volunteer or join the crew</h3>
          <p className="mt-2 mb-[22px] flex-1 text-muted">
            Coach, help out on community days, or step onto the mat and train. There&apos;s a place
            for everyone, and no experience is needed to start.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={links.volunteer} variant="ink">
              Volunteer with us
            </Button>
            <Button href={links.findClass} variant="ghost">
              Find a class
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-card border border-line bg-gold-soft p-[38px]">
          <Eyebrow className="text-gold">Stay in the loop</Eyebrow>
          <h3 className="mt-2 text-2xl">Newsletter</h3>
          <p className="mt-2 mb-5 text-[#7a6b45]">
            Class schedules, news, and ways to help, straight to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </Container>
    </section>
  );
}

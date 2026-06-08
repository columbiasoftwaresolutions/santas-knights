import { Container } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { pressLogos } from "@/content/site";

export function Press() {
  return (
    <section className="border-t border-line py-[46px]">
      <Container>
        <p className="mb-6 text-center text-[13px] font-bold uppercase tracking-[0.12em] text-muted">
          As featured in
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 opacity-85">
          {pressLogos.map((logo) => (
            <Placeholder key={logo} label={logo} className="h-[42px] w-[128px] rounded-[7px]" />
          ))}
        </div>
      </Container>
    </section>
  );
}

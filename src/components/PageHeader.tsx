import type { ReactNode } from "react";
import { Container, Eyebrow } from "./ui";
import { Breadcrumb } from "./parts";

export function PageHeader({
  eyebrow,
  title,
  intro,
  trail,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  trail?: { label: string; to?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-obsidian text-ivory arch-grid">
      <span aria-hidden className="absolute right-[8%] top-20 h-56 w-56 rounded-full border border-gold/15 sm:h-80 sm:w-80" />
      <Container className="relative pb-16 pt-32 lg:pb-24 lg:pt-44">
        {trail && (
          <div className="mb-8 [&_a]:text-ivory/60 [&_a:hover]:text-ivory [&_[aria-current]]:text-ivory [&_span]:text-ivory/30">
            <Breadcrumb trail={trail} />
          </div>
        )}
        <div className="flex items-center gap-4"><Eyebrow tone="light">{eyebrow}</Eyebrow><span aria-hidden className="h-px w-12 bg-gold/70" /></div>
        <h1 className="display-hero mt-5 max-w-4xl text-ivory">{title}</h1>
        {intro && (
          <p className="mt-7 max-w-2xl text-[19px] leading-relaxed text-ivory/75">
            {intro}
          </p>
        )}
      </Container>
    </section>
  );
}

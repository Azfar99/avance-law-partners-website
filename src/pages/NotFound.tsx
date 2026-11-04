import { ButtonLink, Container } from "../components/ui";
import { useHeroTone } from "../lib/chrome";
import SEOHead from "../components/SEOHead";

export function NotFound() {
  useHeroTone("dark");
  return (
    <section className="bg-obsidian text-ivory">
      <SEOHead title="Page not found" description="Find your way back to Avance Law Partners." canonicalPath="/404" />
      <Container className="flex min-h-[70vh] flex-col items-start justify-center py-32">
        <p className="eyebrow text-gold">Error 404</p>
        <h1 className="display-hero mt-5 max-w-2xl text-ivory">
          This page could not be found.
        </h1>
        <p className="mt-6 max-w-md text-[18px] leading-relaxed text-ivory/70">
          The page may have moved, or the link may be incomplete. Let us help you
          find your way back.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/" variant="gold" size="lg">
            Return home
          </ButtonLink>
          <ButtonLink to="/contact" variant="outline-light" size="lg" withArrow>
            Contact the firm
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export default NotFound;

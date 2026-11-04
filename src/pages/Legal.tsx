import { useLegalPage } from "../lib/hooks";
import { Container } from "../components/ui";
import { PageHeader } from "../components/PageHeader";
import { useHeroTone } from "../lib/chrome";
import SEOHead from "../components/SEOHead";

const DEFAULT_CONTENT: Record<
  string,
  { title: string; body: string[] }
> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "This Privacy Policy explains how Avance Law Partners handles the information you share through this website, including enquiries submitted via the contact form.",
      "Please contact the firm for details of how enquiry information is handled, retained and shared. This draft does not confirm those practices.",
      "For questions regarding our privacy practices or data retention policies, please reach out to the chamber directly.",
    ],
  },
  disclaimer: {
    title: "Legal Disclaimer",
    body: [
      "The content of this website is provided for general informational purposes concerning Avance Law Partners and its practice areas. It does not constitute formal legal advice and does not create an advocate–client relationship.",
      "Receipt of an enquiry or transmission of information via this website does not constitute engagement of the firm.",
      "For advice on a specific corporate, regulatory, or litigation matter, please contact the firm directly to schedule a formal consultation.",
    ],
  },
  terms: {
    title: "Terms of Use",
    body: [
      "These Terms of Use govern your access to and use of the Avance Law Partners website (avancelawpartners.info).",
      "All text, marks, and design elements remain the property of Avance Law Partners. Unauthorized commercial reproduction is prohibited.",
    ],
  },
};

export default function Legal({ kind }: { kind: "privacy" | "disclaimer" | "terms" }) {
  useHeroTone("dark");
  const { legal } = useLegalPage(kind);
  const defaultDoc = DEFAULT_CONTENT[kind];

  const title = legal.title || defaultDoc.title;
  const isApproved = legal.published && Boolean(legal.body?.trim());
  const paragraphs = isApproved ? legal.body.split("\n\n").filter(Boolean) : defaultDoc.body;

  return (
    <>
      <SEOHead
        title={`${title} | Legal Compliance`}
        description={`${title} for Avance Law Partners.`}
        canonicalPath={`/${kind}`}
      />
      <PageHeader
        eyebrow="Legal & Compliance"
        title={title}
        trail={[{ label: "Home", to: "/" }, { label: title }]}
      />
      <section className="relative bg-ivory paper-grain">
        <Container className="py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[.24fr_.76fr] lg:gap-20">
            <aside className="border-t-2 border-obsidian pt-5">
              <p className="eyebrow text-gold-deep">Document status</p>
              <p className="mt-4 text-[14px] leading-relaxed text-ink-60">
                {isApproved ? "Published by Avance Law Partners." : "Draft content. Awaiting review by the firm."}
              </p>
            </aside>
            <div className="max-w-2xl border-t border-line-light pt-5">
              {paragraphs.map((p, i) => (
                <p key={i} className="mb-7 text-[19px] leading-relaxed text-charcoal/85 first:font-serif first:text-[25px] first:leading-snug first:text-obsidian">
                  {p}
                </p>
              ))}
              <p className="mt-12 border-t border-line-light pt-6 text-[13px] uppercase tracking-[0.14em] text-ink-60">
                {isApproved && legal.updated_at && Number.isFinite(Date.parse(legal.updated_at)) ? `Last updated: ${new Date(legal.updated_at).toLocaleDateString("en-GB")}` : "Contact the firm for the current policy."}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

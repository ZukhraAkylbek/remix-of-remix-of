import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Check, Info, Phone } from "lucide-react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BOOKING_URL } from "@/lib/site-config";
import { CLINIC, absoluteUrl, faqPageJsonLd } from "@/lib/clinic";
import { servicePageQueryOptions } from "@/lib/services.queries";
import { parseRows } from "@/lib/surgery.queries";
import { DoctorsGrid, FaqList } from "./hirurgiya.index";

export const Route = createFileRoute("/uslugi/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(servicePageQueryOptions(params.slug));
    if (!data) throw notFound();
    return { title: data.meta_title || data.title, description: data.meta_description || data.summary };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Услуга не найдена — Авиценна" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.title} — клиника «Авиценна» в Бишкеке`;
    const description =
      loaderData.description ?? `${loaderData.title} в клинике «Авиценна» в Бишкеке.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        {
          rel: "canonical",
          href: absoluteUrl(`/uslugi/${params.slug}`) || `/uslugi/${params.slug}`,
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Услуги" />
      <Breadcrumbs items={[{ label: "Услуги", href: "/uslugi" }, { label: "Не найдено" }]} />
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">Услуга не найдена</h1>
      </main>
      <SiteFooter />
    </div>
  ),
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(servicePageQueryOptions(slug));
  if (!data) return null;

  const block = (key: string) => data.blocks.find((b) => b.key === key);
  const known = new Set([
    "hero",
    "when",
    "available",
    "important",
    "why",
    "doctors",
    "contacts",
    "faq",
    "final",
  ]);

  const hero = block("hero");
  const when = block("when");
  const available = block("available");
  const important = block("important");
  const why = block("why");
  const doctors = block("doctors");
  const contacts = block("contacts");
  const faq = block("faq");
  const final = block("final");
  const custom = data.blocks.filter((b) => !known.has(b.key));

  const faqItems = parseRows(faq?.body);

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb={data.title} />
      <Breadcrumbs items={[{ label: "Услуги", href: "/uslugi" }, { label: data.title }]} />

      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              faqPageJsonLd(
                faqItems.map((item) => ({ question: item.title, answer: item.text ?? "" })),
              ),
            ),
          }}
        />
      )}

      <main>
        {/* Оффер */}
        {hero && (
          <section className="border-border border-b">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:py-16">
              <div>
                <p className="eyebrow">Услуги</p>
                <h1 className="text-foreground mt-4 text-4xl leading-[1.08] font-extrabold sm:text-5xl">
                  {hero.title}
                </h1>
                {hero.subtitle && (
                  <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed">
                    {hero.subtitle}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={hero.primary_url || BOOKING_URL}
                    className="bg-accent text-accent-foreground rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                  >
                    {hero.primary_label || "Записаться"}
                  </a>
                  <a
                    href={`tel:${CLINIC.phones[0]}`}
                    className="border-border text-foreground hover:border-foreground inline-flex items-center gap-2 rounded-md border px-7 py-4 text-base font-semibold transition-colors"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {hero.secondary_label || "Позвонить"}
                  </a>
                </div>
              </div>

              {hero.image_url ? (
                <img
                  src={hero.image_url}
                  alt={hero.title}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <ul className="border-border grid content-start gap-px self-start border">
                  {parseRows(hero.body).map((item) => (
                    <li key={item.title} className="border-border border p-5">
                      <p className="text-foreground text-lg font-bold">{item.title}</p>
                      {item.text && <p className="text-muted-foreground mt-1 text-sm">{item.text}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Когда обращаться */}
        {when && (
          <ListSection block={when} eyebrow="Показания" variant="check" />
        )}

        {/* Что доступно */}
        {available && <CardsSection block={available} eyebrow="Что доступно" />}

        {/* Важно знать */}
        {important && <ListSection block={important} eyebrow="Важно знать" variant="info" soft />}

        {/* Почему Авиценна */}
        {why && <CardsSection block={why} eyebrow="Преимущества" numbered />}

        {/* Врачи */}
        {doctors && data.doctors.length > 0 && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Врачи"
                title={doctors.title}
                {...(doctors.subtitle ? { description: doctors.subtitle } : {})}
              />
              <DoctorsGrid doctors={data.doctors} />
            </div>
          </section>
        )}

        {/* Адрес и режим работы */}
        {contacts && (
          <ListSection block={contacts} eyebrow="Контакты" variant="check" soft showCta />
        )}

        {/* Дополнительные блоки из админки */}
        {custom.map((item) => (
          <CardsSection key={item.id} block={item} eyebrow="Подробнее" />
        ))}

        {/* FAQ */}
        {faq && faqItems.length > 0 && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="FAQ"
                title={faq.title}
                {...(faq.subtitle ? { description: faq.subtitle } : {})}
              />
              <div className="mt-10">
                <FaqList items={faqItems} />
              </div>
            </div>
          </section>
        )}

        {/* Финальный оффер */}
        {final && (
          <section className="bg-surface-green py-14 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
              <h2 className="text-foreground text-3xl font-extrabold sm:text-4xl">{final.title}</h2>
              {final.subtitle && (
                <p className="text-muted-foreground mt-4 text-lg">{final.subtitle}</p>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={final.primary_url || BOOKING_URL}
                  className="bg-accent text-accent-foreground rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                >
                  {final.primary_label || "Записаться онлайн"}
                </a>
                <a
                  href={final.secondary_url || `tel:${CLINIC.phones[0]}`}
                  className="border-border text-foreground hover:border-foreground inline-flex items-center gap-2 rounded-md border px-7 py-4 text-base font-semibold transition-colors"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {final.secondary_label || "Позвонить"}
                </a>
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

type Block = {
  id: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  primary_label: string | null;
  primary_url: string | null;
};

function ListSection({
  block,
  eyebrow,
  variant,
  soft,
  showCta,
}: {
  block: Block;
  eyebrow: string;
  variant: "check" | "info";
  soft?: boolean;
  showCta?: boolean;
}) {
  const rows = parseRows(block.body);
  if (rows.length === 0 && !block.image_url) return null;
  const Icon = variant === "check" ? Check : Info;

  return (
    <section
      className={`border-border border-b py-14 sm:py-20 ${soft ? "bg-surface-soft" : ""}`}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={eyebrow}
            title={block.title}
            {...(block.subtitle ? { description: block.subtitle } : {})}
          />
          {showCta && (
            <a
              href={block.primary_url || BOOKING_URL}
              className="bg-accent text-accent-foreground mt-8 inline-flex rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
            >
              {block.primary_label || "Записаться"}
            </a>
          )}
        </div>
        <ul className="space-y-4 self-center">
          {rows.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span className="bg-surface-green text-brand-green mt-0.5 grid size-6 shrink-0 place-items-center rounded-full">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="text-foreground text-base sm:text-lg">
                <span className="font-semibold">{item.title}</span>
                {item.text && <span className="text-muted-foreground"> — {item.text}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CardsSection({
  block,
  eyebrow,
  numbered,
}: {
  block: Block;
  eyebrow: string;
  numbered?: boolean;
}) {
  const rows = parseRows(block.body);
  if (rows.length === 0) return null;

  return (
    <section className="border-border border-b py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={eyebrow}
          title={block.title}
          {...(block.subtitle ? { description: block.subtitle } : {})}
        />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((item, index) => (
            <Reveal key={item.title} delay={index * 60} className="border-border border-t pt-6">
              {numbered && (
                <p className="text-muted-foreground text-sm font-semibold">
                  {String(index + 1).padStart(2, "0")}
                </p>
              )}
              <h3 className="text-foreground mt-3 text-xl font-bold">{item.title}</h3>
              {item.text && (
                <p className="text-muted-foreground mt-3 text-base leading-relaxed">{item.text}</p>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

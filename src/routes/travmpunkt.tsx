import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Check, Clock, MapPin, Phone } from "lucide-react";

import { ConsultCta } from "@/components/ConsultCta";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC, absoluteUrl, faqPageJsonLd } from "@/lib/clinic";
import { parseRows } from "@/lib/surgery.queries";
import { traumaPageQueryOptions } from "@/lib/trauma.queries";
import { FaqList } from "./hirurgiya.index";

const TITLE = "Травмпункт 24/7 в Бишкеке — круглосуточно | Авиценна";
const DESCRIPTION =
  "Круглосуточный травмпункт «Авиценна» в Бишкеке: переломы, вывихи, раны, ожоги. Рентген, гипс, ПХО и операции на месте. Без записи, ул. Жукеева-Пудовкина, 124.";

export const Route = createFileRoute("/travmpunkt")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(traumaPageQueryOptions());
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/travmpunkt") || "/travmpunkt" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/travmpunkt") || "/travmpunkt" }],
  }),
  errorComponent: () => (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Травмпункт" />
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">Не удалось загрузить страницу травмпункта</h1>
        <a
          href={`tel:${CLINIC.phones[0]}`}
          className="bg-accent text-accent-foreground mt-8 inline-flex rounded-md px-7 py-4 font-semibold"
        >
          Позвонить в клинику
        </a>
      </main>
      <SiteFooter />
    </div>
  ),
  notFoundComponent: () => (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Травмпункт" />
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">Страница не найдена</h1>
      </main>
      <SiteFooter />
    </div>
  ),
  component: TraumaPage,
});

function TraumaPage() {
  const { data } = useSuspenseQuery(traumaPageQueryOptions());
  const section = (key: string) => data.sections.find((s) => s.key === key);

  const hero = section("hero");
  const urgent = section("urgent");
  const help = section("help");
  const procedures = section("procedures");
  const kids = section("kids");
  const equipment = section("equipment");
  const prices = section("prices");
  const steps = section("steps");
  const faq = section("faq");
  const final = section("final");

  const faqItems = parseRows(faq?.body);
  const priceRows = parseRows(prices?.body);

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Травмпункт 24/7" />

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
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:py-16">
              <div>
                <span className="bg-surface-green text-brand-green inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold">
                  <Clock className="size-4" aria-hidden="true" />
                  Работаем круглосуточно
                </span>
                <h1 className="text-foreground mt-5 text-4xl leading-[1.06] font-extrabold sm:text-5xl lg:text-6xl">
                  {hero.title}
                </h1>
                {hero.subtitle && (
                  <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl">
                    {hero.subtitle}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {hero.primary_label && (
                    <a
                      href={hero.primary_url || "#"}
                      className="bg-accent text-accent-foreground rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                    >
                      {hero.primary_label}
                    </a>
                  )}
                  <a
                    href={hero.secondary_url || `tel:${CLINIC.phones[0]}`}
                    className="border-border text-foreground hover:border-foreground inline-flex items-center gap-2 rounded-md border px-7 py-4 text-base font-semibold transition-colors"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    +996 779 909 009
                  </a>
                </div>
                <p className="text-muted-foreground mt-5 inline-flex items-center gap-2 text-sm">
                  <MapPin className="size-4" aria-hidden="true" />
                  ул. Жукеева-Пудовкина, 124 — приём без записи
                </p>
              </div>

              <ul className="border-border grid content-start gap-px self-start border sm:grid-cols-2 lg:grid-cols-1">
                {parseRows(hero.body).map((item) => (
                  <li key={item.title} className="border-border border p-5">
                    <p className="text-foreground text-base font-bold">{item.title}</p>
                    {item.text && (
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {item.text}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Когда ехать немедленно */}
        {urgent && (
          <section className="border-border bg-surface-soft border-b py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <SectionHeading
                  eyebrow="Срочно"
                  title={urgent.title}
                  {...(urgent.subtitle ? { description: urgent.subtitle } : {})}
                />
                {urgent.primary_label && (
                  <a
                    href={urgent.primary_url || "#"}
                    className="bg-accent text-accent-foreground mt-8 inline-flex rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                  >
                    {urgent.primary_label}
                  </a>
                )}
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {parseRows(urgent.body).map((item) => (
                  <li
                    key={item.title}
                    className="bg-background border-border card-lift hover:border-brand-green rounded-xl border p-5 transition-colors"
                  >
                    <AlertTriangle className="text-brand-green size-5" aria-hidden="true" />
                    <p className="text-foreground mt-3 text-base font-bold">{item.title}</p>
                    {item.text && (
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {item.text}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Помощь при */}
        {help && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Помощь"
                title={help.title}
                {...(help.subtitle ? { description: help.subtitle } : {})}
              />
              <div className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
                {parseRows(help.body).map((item) => (
                  <article
                    key={item.title}
                    className="border-border hover:bg-surface-soft border p-6 transition-colors"
                  >
                    <h3 className="text-foreground text-lg font-bold">{item.title}</h3>
                    {item.text && (
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {item.text}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Процедуры */}
        {procedures && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Манипуляции"
                title={procedures.title}
                {...(procedures.subtitle ? { description: procedures.subtitle } : {})}
              />
              <ul className="mt-10 grid gap-4 lg:grid-cols-2">
                {parseRows(procedures.body).map((item) => (
                  <li
                    key={item.title}
                    className="border-border flex items-start gap-4 rounded-lg border p-5"
                  >
                    <span className="bg-surface-green text-brand-green mt-0.5 grid size-7 shrink-0 place-items-center rounded-full">
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="text-foreground block text-base font-bold">
                        {item.title}
                      </span>
                      {item.text && (
                        <span className="text-muted-foreground mt-1 block text-sm">
                          {item.text}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Детский травматолог */}
        {kids && (
          <section className="border-border bg-surface-green border-b py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="eyebrow">Детям</p>
                <h2 className="text-foreground mt-3 text-3xl font-extrabold sm:text-4xl">
                  {kids.title}
                </h2>
                {kids.subtitle && (
                  <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                    {kids.subtitle}
                  </p>
                )}
                {kids.primary_label && (
                  <a
                    href={kids.primary_url || `tel:${CLINIC.phones[0]}`}
                    className="bg-accent text-accent-foreground mt-8 inline-flex rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                  >
                    {kids.primary_label}
                  </a>
                )}
              </div>
              <ul className="grid content-start gap-4 self-center">
                {parseRows(kids.body).map((item) => (
                  <li
                    key={item.title}
                    className="bg-background border-border rounded-xl border p-5"
                  >
                    <p className="text-foreground text-base font-bold">{item.title}</p>
                    {item.text && (
                      <p className="text-muted-foreground mt-1 text-sm">{item.text}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Оснащение */}
        {equipment && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Оснащение"
                title={equipment.title}
                {...(equipment.subtitle ? { description: equipment.subtitle } : {})}
              />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {parseRows(equipment.body).map((item, index) => (
                  <Reveal
                    key={item.title}
                    delay={index * 60}
                    className="border-border rounded-xl border p-6"
                  >
                    <h3 className="text-foreground text-lg font-bold">{item.title}</h3>
                    {item.text && (
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {item.text}
                      </p>
                    )}
                  </Reveal>
                ))}
              </div>
              {equipment.primary_label && (
                <Link
                  to="/diagnostika"
                  className="text-foreground hover:text-brand-green mt-8 inline-flex items-center gap-2 text-lg font-bold"
                >
                  {equipment.primary_label}
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Врачи */}
        {data.doctors.length > 0 && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading eyebrow="Специалисты" title="Врачи травмпункта" />
              <div className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
                {data.doctors.map((doctor) => (
                  <article key={doctor.slug} className="border-border border p-6">
                    {doctor.photo_url && (
                      <img
                        src={doctor.photo_url}
                        alt={doctor.full_name}
                        loading="lazy"
                        className="mb-4 h-48 w-full rounded-lg object-cover"
                      />
                    )}
                    <h3 className="text-foreground text-xl font-bold">{doctor.full_name}</h3>
                    {doctor.job_title && (
                      <p className="text-brand-green mt-1 text-sm font-semibold">
                        {doctor.job_title}
                      </p>
                    )}
                    {doctor.experience_years != null && (
                      <p className="text-muted-foreground mt-3 text-sm">
                        Стаж: {doctor.experience_years} лет
                      </p>
                    )}
                    {doctor.bio && (
                      <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                        {doctor.bio}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Цены */}
        {prices && priceRows.length > 0 && (
          <section className="border-border bg-surface-soft border-b py-14 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Прайс"
                title={prices.title}
                {...(prices.subtitle ? { description: prices.subtitle } : {})}
              />
              <dl className="bg-background border-border mt-10 divide-y divide-[color:var(--border)] rounded-xl border">
                {priceRows.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-6 px-5 py-4"
                  >
                    <dt className="text-foreground text-base">{item.title}</dt>
                    <dd className="text-foreground shrink-0 text-base font-bold">{item.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* Этапы */}
        {steps && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Процесс"
                title={steps.title}
                {...(steps.subtitle ? { description: steps.subtitle } : {})}
              />
              <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {parseRows(steps.body).map((item, index) => (
                  <li key={item.title} className="border-border rounded-lg border p-6">
                    <span className="bg-surface-green text-brand-green grid size-10 place-items-center rounded-full text-base font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-foreground mt-4 text-lg font-bold">{item.title}</h3>
                    {item.text && (
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {item.text}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faq && faqItems.length > 0 && (
          <section id="faq" className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
              <SectionHeading
                eyebrow="FAQ"
                title={faq.title}
                {...(faq.subtitle ? { description: faq.subtitle } : {})}
              />
              <FaqList items={faqItems} />
            </div>
          </section>
        )}

        {/* Финальный оффер */}
        {final && (
          <section className="border-border bg-surface-green border-b py-14 sm:py-16">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
              <div>
                <h2 className="text-foreground text-3xl font-extrabold sm:text-4xl">
                  {final.title}
                </h2>
                {final.subtitle && (
                  <p className="text-muted-foreground mt-3 max-w-2xl text-lg">{final.subtitle}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {final.primary_label && (
                  <a
                    href={final.primary_url || "#"}
                    className="bg-accent text-accent-foreground rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                  >
                    {final.primary_label}
                  </a>
                )}
                {final.secondary_label && (
                  <a
                    href={final.secondary_url || `tel:${CLINIC.phones[0]}`}
                    className="border-border text-foreground hover:border-foreground inline-flex items-center gap-2 rounded-md border px-7 py-4 text-base font-semibold transition-colors"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {final.secondary_label}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        <ConsultCta defaultSlug="travmpunkt" />
      </main>
      <SiteFooter />
    </div>
  );
}

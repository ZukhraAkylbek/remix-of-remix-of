import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Phone, Plus } from "lucide-react";
import { useState } from "react";

import { ConsultCta } from "@/components/ConsultCta";
import { DiagnosticsIcon } from "@/components/DiagnosticsIcon";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC, absoluteUrl, faqPageJsonLd } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";
import { parseRows, surgeryPageQueryOptions } from "@/lib/surgery.queries";
import { specialtyImage } from "@/lib/specialty-images";

const TITLE = "Хирургия в Бишкеке — операции и стационар | Авиценна";
const DESCRIPTION =
  "Хирургия в клинике «Авиценна»: лапароскопия, урология, гинекология, проктология, флебология, травматология. Диагностика перед операцией, стационар 24/7, запись онлайн.";

export const Route = createFileRoute("/hirurgiya/")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(surgeryPageQueryOptions());
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/hirurgiya") || "/hirurgiya" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/hirurgiya") || "/hirurgiya" }],
  }),
  errorComponent: () => (
    <Shell>
      <h1 className="text-3xl font-extrabold">Не удалось загрузить страницу хирургии</h1>
    </Shell>
  ),
  notFoundComponent: () => (
    <Shell>
      <h1 className="text-3xl font-extrabold">Страница не найдена</h1>
    </Shell>
  ),
  component: SurgeryPage,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Хирургия" />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function FaqList({ items }: { items: { title: string; text?: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <dl className="space-y-3">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.title} className="border-border rounded-lg border">
            <dt>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-foreground text-base font-semibold sm:text-lg">
                  {item.title}
                </span>
                <Plus
                  className={`text-muted-foreground size-5 shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </dt>
            {isOpen && item.text && (
              <dd className="text-muted-foreground border-border border-t px-5 py-4 text-base leading-relaxed">
                {item.text}
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}

export function DoctorsGrid({
  doctors,
}: {
  doctors: {
    slug: string;
    full_name: string;
    job_title: string | null;
    photo_url: string | null;
    bio: string | null;
    experience_years: number | null;
  }[];
}) {
  return (
    <div className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor) => (
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
            <p className="text-brand-green mt-1 text-sm font-semibold">{doctor.job_title}</p>
          )}
          {doctor.experience_years != null && (
            <p className="text-muted-foreground mt-3 text-sm">
              Стаж: {doctor.experience_years} лет
            </p>
          )}
          {doctor.bio && (
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">{doctor.bio}</p>
          )}
        </article>
      ))}
    </div>
  );
}

function SurgeryPage() {
  const { data } = useSuspenseQuery(surgeryPageQueryOptions());
  const section = (key: string) => data.sections.find((s) => s.key === key);

  const hero = section("hero");
  const advantages = section("advantages");
  const symptoms = section("symptoms");
  const diseases = section("diseases");
  const procedures = section("procedures");
  const diagnostics = section("diagnostics");
  const stationar = section("stationar");
  const steps = section("steps");
  const faq = section("faq");
  const final = section("final");

  const faqItems = parseRows(faq?.body);

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Хирургия" />

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
                <p className="eyebrow">Хирургия</p>
                <h1 className="text-foreground mt-4 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">
                  {hero.title}
                </h1>
                {hero.subtitle && (
                  <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl">
                    {hero.subtitle}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={hero.primary_url || BOOKING_URL}
                    className="bg-accent text-accent-foreground rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                  >
                    {hero.primary_label || "Записаться на консультацию"}
                  </a>
                  <a
                    href={`tel:${CLINIC.phones[0]}`}
                    className="border-border text-foreground hover:border-foreground inline-flex items-center gap-2 rounded-md border px-7 py-4 text-base font-semibold transition-colors"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    +996 779 909 009
                  </a>
                </div>
              </div>

              <ul className="border-border grid content-start gap-px self-start border">
                {parseRows(hero.body).map((item) => (
                  <li key={item.title} className="border-border border p-5">
                    <p className="text-foreground text-lg font-bold">{item.title}</p>
                    {item.text && (
                      <p className="text-muted-foreground mt-1 text-sm">{item.text}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Направления хирургии */}
        {data.directions.length > 0 && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Направления"
                title="Направления хирургии"
                description="Современные методы лечения и опытные хирурги для вашего здоровья и быстрого восстановления"
              />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {data.directions.map((direction, index) => (
                  <Reveal key={direction.slug} delay={index * 60}>
                    <Link
                      to="/hirurgiya/$slug"
                      params={{ slug: direction.slug }}
                      className="card-lift border-border hover:border-brand-green group block h-full overflow-hidden rounded-2xl border transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={direction.image_url || specialtyImage(direction.slug, index)}
                          alt={direction.title}
                          loading="lazy"
                          className="h-44 w-full object-cover"
                        />
                        <span className="absolute bottom-3 left-3">
                          <DiagnosticsIcon
                            icon={direction.icon}
                            title={direction.title}
                            className="bg-background shadow"
                          />
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 p-5">
                        <span className="text-foreground text-base font-bold">
                          {direction.title}
                        </span>
                        <ArrowRight
                          className="text-brand-green size-5 shrink-0 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Почему выбирают */}
        {advantages && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Преимущества"
                title={advantages.title}
                {...(advantages.subtitle ? { description: advantages.subtitle } : {})}
              />
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {parseRows(advantages.body).map((item, index) => (
                  <Reveal key={item.title} delay={index * 80} className="border-border border-t pt-6">
                    <p className="text-muted-foreground text-sm font-semibold">0{index + 1}</p>
                    <h3 className="text-foreground mt-3 text-xl font-bold">{item.title}</h3>
                    {item.text && (
                      <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                        {item.text}
                      </p>
                    )}
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Симптомы */}
        {symptoms && (
          <section className="border-border bg-surface-soft border-b py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionHeading
                  eyebrow="Симптомы"
                  title={symptoms.title}
                  {...(symptoms.subtitle ? { description: symptoms.subtitle } : {})}
                />
                <a
                  href={symptoms.primary_url || "#zapis"}
                  className="bg-accent text-accent-foreground mt-8 inline-flex rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                >
                  {symptoms.primary_label || "Записаться на консультацию"}
                </a>
              </div>
              <ul className="space-y-4 self-center">
                {parseRows(symptoms.body).map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="bg-surface-green text-brand-green mt-0.5 grid size-6 shrink-0 place-items-center rounded-full">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-foreground text-base sm:text-lg">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Заболевания */}
        {diseases && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Заболевания"
                title={diseases.title}
                {...(diseases.subtitle ? { description: diseases.subtitle } : {})}
              />
              <div className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                {parseRows(diseases.body).map((item) => (
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

        {/* Операции и процедуры */}
        {procedures && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Услуги"
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

        {/* Врачи-хирурги */}
        {data.doctors.length > 0 && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading eyebrow="Специалисты" title="Врачи-хирурги" />
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

        {/* Диагностика перед операцией */}
        {diagnostics && (
          <section className="border-border bg-surface-soft border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Подготовка"
                title={diagnostics.title}
                {...(diagnostics.subtitle ? { description: diagnostics.subtitle } : {})}
              />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {parseRows(diagnostics.body).map((item) => (
                  <article
                    key={item.title}
                    className="bg-background border-border rounded-lg border p-6"
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
              {diagnostics.primary_url && (
                <Link
                  to="/diagnostika"
                  className="text-foreground hover:text-brand-green mt-8 inline-flex items-center gap-2 text-lg font-bold"
                >
                  {diagnostics.primary_label || "Перейти к диагностике"}
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Стационар */}
        {stationar && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionHeading
                  eyebrow="Стационар"
                  title={stationar.title}
                  {...(stationar.subtitle ? { description: stationar.subtitle } : {})}
                />
                <ul className="mt-8 space-y-3">
                  {parseRows(stationar.body).map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="bg-surface-green text-brand-green mt-0.5 grid size-6 shrink-0 place-items-center rounded-full">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      <span className="text-foreground text-base">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {stationar.image_url && (
                <img
                  src={stationar.image_url}
                  alt={stationar.title}
                  loading="lazy"
                  className="h-full max-h-[420px] w-full rounded-2xl object-cover"
                />
              )}
            </div>
          </section>
        )}

        {/* Как проходит лечение */}
        {steps && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Процесс"
                title={steps.title}
                {...(steps.subtitle ? { description: steps.subtitle } : {})}
              />
              <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  <p className="text-muted-foreground mt-3 text-lg">{final.subtitle}</p>
                )}
              </div>
              <a
                href={final.primary_url || BOOKING_URL}
                className="bg-accent text-accent-foreground rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
              >
                {final.primary_label || "Записаться на приём"}
              </a>
            </div>
          </section>
        )}

        <ConsultCta defaultSlug="hirurgiya" />
      </main>
      <SiteFooter />
    </div>
  );
}

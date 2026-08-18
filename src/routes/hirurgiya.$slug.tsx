import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Phone } from "lucide-react";

import { ConsultCta } from "@/components/ConsultCta";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC, absoluteUrl, faqPageJsonLd } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";
import { specialtyImage } from "@/lib/specialty-images";
import { parseRows, surgeryDirectionQueryOptions } from "@/lib/surgery.queries";
import { DoctorsGrid, FaqList } from "./hirurgiya.index";

const truncate = (value: string, max = 158) =>
  value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;

export const Route = createFileRoute("/hirurgiya/$slug")({
  loader: async ({ params, context }) => {
    const direction = await context.queryClient.ensureQueryData(
      surgeryDirectionQueryOptions(params.slug),
    );
    if (!direction) throw notFound();
    return direction;
  },
  head: ({ params, loaderData }) => {
    const path = `/hirurgiya/${params.slug}`;
    if (!loaderData) {
      return {
        meta: [{ title: "Страница недоступна — Авиценна" }, { name: "robots", content: "noindex" }],
      };
    }

    const title = loaderData.meta_title?.trim() || `${loaderData.title} — клиника «Авиценна»`;
    const description =
      loaderData.meta_description?.trim() ||
      truncate(
        loaderData.subtitle?.trim() ||
          `${loaderData.title}: консультация хирурга, диагностика, операция и восстановление в клинике «Авиценна».`,
      );

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: absoluteUrl(path) || path },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(path) || path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: loaderData.title,
            description,
            url: absoluteUrl(path) || path,
            about: { "@type": "MedicalSpecialty", name: loaderData.title },
            provider: { "@type": "MedicalClinic", name: CLINIC.name },
          }),
        },
      ],
    };
  },
  component: DirectionPage,
  notFoundComponent: () => (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Хирургия" />
      <Breadcrumbs items={[{ label: "Хирургия" }]} />
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-foreground text-4xl font-extrabold">Направление не найдено</h1>
        <Link
          to="/hirurgiya"
          className="bg-accent text-accent-foreground mt-8 inline-flex rounded-md px-7 py-4 text-base font-semibold"
        >
          Все направления хирургии
        </Link>
      </main>
      <SiteFooter />
    </div>
  ),
});

function ListBlock({
  eyebrow,
  title,
  value,
}: {
  eyebrow: string;
  title: string;
  value: string | null;
}) {
  const rows = parseRows(value);
  if (rows.length === 0) return null;

  return (
    <section className="border-border border-b py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {rows.map((item) => (
            <li key={item.title} className="border-border flex items-start gap-4 rounded-lg border p-5">
              <span className="bg-surface-green text-brand-green mt-0.5 grid size-7 shrink-0 place-items-center rounded-full">
                <Check className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="text-foreground block text-base font-bold">{item.title}</span>
                {item.text && (
                  <span className="text-muted-foreground mt-1 block text-sm">{item.text}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DirectionPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(surgeryDirectionQueryOptions(slug));
  if (!data) return null;

  const steps = parseRows(data.steps);
  const advantages = parseRows(data.advantages);
  const symptoms = parseRows(data.symptoms);
  const faqItems = parseRows(data.faq);

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb={data.title} />
      <Breadcrumbs items={[{ label: "Хирургия", href: "/hirurgiya" }, { label: data.title }]} />

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
        <section className="border-border border-b">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-16">
            <div>
              <nav aria-label="Хлебные крошки" className="text-muted-foreground text-sm">
                <Link to="/" className="hover:text-foreground">
                  Главная
                </Link>
                <span className="mx-2">/</span>
                <Link to="/hirurgiya" className="hover:text-foreground">
                  Хирургия
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">{data.title}</span>
              </nav>
              <h1 className="text-foreground mt-5 text-4xl leading-[1.08] font-extrabold sm:text-5xl">
                {data.title}
              </h1>
              {data.subtitle && (
                <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl">
                  {data.subtitle}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent text-accent-foreground rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                >
                  Записаться на консультацию
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
            <img
              src={data.image_url || specialtyImage(data.slug)}
              alt={data.title}
              className="h-full max-h-[380px] w-full rounded-2xl object-cover"
            />
          </div>
        </section>

        {data.body && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <p className="eyebrow">Направление</p>
              <h2 className="text-foreground mt-3 text-3xl font-extrabold sm:text-4xl">
                {data.about_title?.trim() || "О направлении"}
              </h2>
              <p className="text-muted-foreground mt-5 text-lg leading-relaxed whitespace-pre-line">
                {data.body}
              </p>
            </div>
          </section>
        )}

        {advantages.length > 0 && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading eyebrow="Преимущества" title="Почему выбирают Авиценну" />
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {advantages.map((item, index) => (
                  <div key={item.title} className="border-border border-t pt-6">
                    <p className="text-muted-foreground text-sm font-semibold">0{index + 1}</p>
                    <h3 className="text-foreground mt-3 text-xl font-bold">{item.title}</h3>
                    {item.text && (
                      <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                        {item.text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {symptoms.length > 0 && (
          <section className="border-border bg-surface-soft border-b py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionHeading eyebrow="Симптомы" title="Когда обратиться" />
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent text-accent-foreground mt-8 inline-flex rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                >
                  Записаться на консультацию
                </a>
              </div>
              <ul className="space-y-4 self-center">
                {symptoms.map((item) => (
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

        <ListBlock eyebrow="Заболевания" title="Какие заболевания лечим" value={data.diseases} />
        <ListBlock eyebrow="Услуги" title="Операции и процедуры" value={data.procedures} />
        {data.doctors.length > 0 && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading eyebrow="Специалисты" title={`Наши врачи — ${data.title.toLowerCase()}`} />
              <DoctorsGrid doctors={data.doctors} />
            </div>
          </section>
        )}

        <ListBlock
          eyebrow="Подготовка"
          title="Диагностика перед операцией"
          value={data.diagnostics}
        />

        {steps.length > 0 && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading eyebrow="Процесс" title="Как проходит лечение" />
              <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((item, index) => (
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

        {faqItems.length > 0 && (
          <section className="border-border border-b py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
              <SectionHeading eyebrow="FAQ" title="Часто задаваемые вопросы" />
              <FaqList items={faqItems} />
            </div>
          </section>
        )}

        <ConsultCta defaultSlug={slug} />

        <section className="border-border border-t py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Link
              to="/hirurgiya"
              className="text-foreground hover:text-brand-green inline-flex items-center gap-2 text-lg font-bold"
            >
              Все направления хирургии
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

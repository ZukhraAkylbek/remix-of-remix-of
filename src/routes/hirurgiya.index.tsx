import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Phone, Plus } from "lucide-react";
import { useState } from "react";

import { ConsultCta } from "@/components/ConsultCta";
import { DiagnosticsIcon } from "@/components/DiagnosticsIcon";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC, absoluteUrl, faqPageJsonLd } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";
import { parseRows, surgeryPageQueryOptions } from "@/lib/surgery.queries";
import { specialtyImage } from "@/lib/specialty-images";

const TITLE = "Хирургия в Бишкеке — операции и стационар | Авиценна";
const DESCRIPTION =
  "Хирургия в клинике «Авиценна»: лапароскопия, урология, гинекология, проктология, флебология, травматология. Диагностика перед операцией, стационар 24/7, запись онлайн.";

type SurgeryContentSection = {
  title: string;
  subtitle?: string | null;
  body?: string | null;
  image_url?: string | null;
  primary_label?: string | null;
  primary_url?: string | null;
};

const FALLBACK_SECTIONS: Record<string, SurgeryContentSection> = {
  hero: {
    title: "Современная хирургия с заботой о пациенте",
    subtitle: "Диагностика, плановые и малоинвазивные операции, стационар и восстановление в одной клинике.",
    body: "Опытные хирурги\nСтационар 24/7\nСовременные операционные\nПолное сопровождение",
    image_url: "/assets/spec-hirurg.webp",
    primary_label: "Записаться на консультацию",
    primary_url: BOOKING_URL,
  },
  advantages: {
    title: "Почему выбирают нашу хирургию",
    subtitle: "Безопасность, точная диагностика и внимательное сопровождение на каждом этапе.",
    body: "Опытная команда — Врачи хирургических специальностей работают вместе.\nСовременное оснащение — Операционные и диагностика соответствуют актуальным стандартам.\nСтационар 24/7 — Наблюдение медицинской команды круглосуточно.\nБережное восстановление — Индивидуальный план после операции.",
  },
  symptoms: {
    title: "Когда нужна консультация хирурга",
    subtitle: "Не откладывайте обращение, если боль усиливается или заметно влияет на самочувствие.",
    body: "Острая или продолжительная боль\nНовообразование или уплотнение\nТравма, отёк или ограничение движения\nДискомфорт после ранее проведённой операции\nНеобходимость планового хирургического лечения\nРекомендация другого специалиста",
    primary_label: "Записаться на консультацию",
    primary_url: BOOKING_URL,
  },
  diseases: {
    title: "Какие заболевания лечим",
    subtitle: "Работаем с распространёнными и сложными хирургическими заболеваниями.",
    body: "Грыжи — Паховые, пупочные и послеоперационные.\nЖелчнокаменная болезнь — Диагностика и хирургическое лечение.\nЗаболевания вен — Современные методы лечения сосудистых патологий.\nУрологические заболевания — Плановые и малоинвазивные вмешательства.\nГинекологические заболевания — Органосохраняющие хирургические методы.\nПроктологические заболевания — Деликатная диагностика и лечение.",
  },
  procedures: {
    title: "Операции и процедуры",
    subtitle: "Подбираем метод лечения по показаниям и состоянию пациента.",
    body: "Лапароскопические операции — Через небольшие проколы с коротким восстановлением.\nОбщая хирургия — Плановые операции различной сложности.\nУрологические операции — Современное лечение заболеваний мочевыделительной системы.\nГинекологические операции — Малоинвазивные и традиционные методики.\nФлебологические процедуры — Лечение варикозной болезни.\nМалая хирургия — Амбулаторные вмешательства и перевязки.",
  },
  diagnostics: {
    title: "Диагностика перед операцией",
    subtitle: "Все необходимые исследования можно пройти в клинике.",
    body: "Консультация хирурга — Осмотр и выбор тактики лечения.\nЛабораторные анализы — Комплекс исследований перед вмешательством.\nУЗИ и лучевая диагностика — Уточнение диагноза и объёма операции.\nКонсультация анестезиолога — Оценка состояния и подготовка.\nЭКГ и обследование сердца — Контроль факторов риска.\nПлан госпитализации — Понятные рекомендации и сроки.",
    primary_url: "/diagnostika",
    primary_label: "Перейти к диагностике",
  },
  stationar: {
    title: "Комфортный стационар 24/7",
    subtitle: "Постоянное наблюдение и всё необходимое для спокойного восстановления.",
    body: "Круглосуточное наблюдение\nПалаты интенсивной терапии\nСовременные комфортные палаты\nКонтроль боли и состояния\nПитание и уход\nСвязь с лечащим врачом",
    image_url: "/assets/image-2.webp",
  },
  steps: {
    title: "Как проходит лечение",
    subtitle: "Понятный путь от первой консультации до возвращения к привычной жизни.",
    body: "Консультация — Хирург изучает жалобы и результаты обследований.\nДиагностика — Проходите необходимые анализы и исследования.\nОперация — Команда проводит вмешательство по согласованному плану.\nВосстановление — Наблюдение, рекомендации и контрольный приём.",
  },
  faq: {
    title: "Часто задаваемые вопросы",
    subtitle: "Коротко о подготовке, госпитализации и восстановлении.",
    body: "Как подготовиться к консультации хирурга? — Возьмите результаты предыдущих обследований и список принимаемых препаратов.\nКакие анализы нужны перед операцией? — Точный перечень зависит от операции и определяется врачом после консультации.\nСколько длится госпитализация? — Срок зависит от вида вмешательства и вашего состояния; врач заранее расскажет план.\nКогда можно вернуться к обычной жизни? — Рекомендации индивидуальны и зависят от операции и темпа восстановления.",
  },
  final: {
    title: "Обсудите лечение с хирургом",
    subtitle: "Врач оценит состояние, объяснит варианты и предложит понятный план действий.",
    primary_label: "Записаться на приём",
    primary_url: BOOKING_URL,
  },
} as const;

const FALLBACK_DIRECTIONS = [
  { slug: "obshchaya-hirurgiya", title: "Общая хирургия", subtitle: null, icon: "Scissors", image_url: "/assets/spec-hirurg.webp" },
  { slug: "urologiya", title: "Урология", subtitle: null, icon: "Stethoscope", image_url: "/assets/spec-urolog.webp" },
  { slug: "ginekologiya", title: "Гинекология", subtitle: null, icon: "HeartPulse", image_url: "/assets/spec-gineko.webp" },
  { slug: "travmatologiya", title: "Травматология", subtitle: null, icon: "Activity", image_url: "/assets/spec-travma.webp" },
  { slug: "proktologiya", title: "Проктология", subtitle: null, icon: "ShieldCheck", image_url: "/assets/doctor-patient-hero.webp" },
  { slug: "flebologiya", title: "Флебология", subtitle: null, icon: "Heart", image_url: "/assets/uslugi-hero.jpg" },
];

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
      <Breadcrumbs items={[{ label: "Хирургия" }]} />
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
  const section = (key: string): SurgeryContentSection | undefined =>
    data.sections.find((item) => item.key === key) ?? FALLBACK_SECTIONS[key];
  const directions = data.directions.length > 0 ? data.directions : FALLBACK_DIRECTIONS;

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
  const heroImage =
    hero?.image_url ||
    directions[0]?.image_url ||
    (directions[0] ? specialtyImage(directions[0].slug, 0) : specialtyImage("hirurgiya", 0));

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Хирургия" />
      <Breadcrumbs items={[{ label: "Хирургия" }]} />

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
        {hero && (
          <section className="bg-surface-mint relative isolate overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[48%] sm:h-[52%] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[55%]">
              <img
                src={heroImage}
                alt="Хирургическое отделение клиники «Авиценна»"
                className="size-full object-cover object-center"
              />
              <div className="from-surface-mint absolute inset-0 bg-gradient-to-b from-0% via-surface-mint/30 to-transparent lg:bg-gradient-to-r lg:via-surface-mint/35" />
            </div>
            <div className="relative mx-auto flex min-h-[640px] max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:min-h-[610px] lg:items-center lg:pt-0">
              <Reveal className="relative z-10 max-w-2xl pb-80 lg:pb-0">
                <p className="eyebrow">Хирургический центр</p>
                <h1 className="text-foreground mt-4 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">
                  {hero.title}
                </h1>
                {hero.subtitle && (
                  <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed sm:text-xl">
                    {hero.subtitle}
                  </p>
                )}
                <ul className="mt-7 grid max-w-xl gap-2 sm:grid-cols-2">
                  {parseRows(hero.body).slice(0, 4).map((item) => (
                    <li key={item.title} className="text-foreground flex items-start gap-2 text-sm font-semibold sm:text-base">
                      <span className="bg-surface-green text-brand-green mt-0.5 grid size-6 shrink-0 place-items-center rounded-full">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      {item.title}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={hero.primary_url || BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent text-accent-foreground rounded-md px-7 py-4 text-base font-semibold transition-opacity hover:opacity-90"
                  >
                    {hero.primary_label || "Записаться на консультацию"}
                  </a>
                  <a
                    href={`tel:${CLINIC.phones[0]}`}
                    className="border-brand-green text-brand-green bg-background/90 inline-flex items-center gap-2 rounded-md border px-6 py-4 text-base font-semibold"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    +996 779 909 009
                  </a>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {directions.length > 0 && (
          <section className="py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Направления"
                title="Направления хирургии"
                description="Современные методы лечения и опытные хирурги для вашего здоровья и быстрого восстановления"
              />
              <div className="no-scrollbar -mx-4 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                {directions.map((direction, index) => (
                  <Reveal key={direction.slug} delay={index * 40} className="min-w-[78vw] snap-start sm:min-w-0">
                    <Link
                      to="/hirurgiya/$slug"
                      params={{ slug: direction.slug }}
                      className="border-border hover:border-brand-green group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-colors"
                    >
                      <img
                        src={direction.image_url || specialtyImage(direction.slug, index)}
                        alt={direction.title}
                        loading="lazy"
                        className="h-40 w-full object-cover"
                      />
                      <div className="flex flex-1 items-center gap-3 p-4">
                        <DiagnosticsIcon
                          icon={direction.icon}
                          title={direction.title}
                          className="size-10 rounded-full"
                        />
                        <span className="text-foreground min-w-0 flex-1 text-base leading-snug font-bold">
                          {direction.title}
                        </span>
                        <ArrowRight className="text-brand-green size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {advantages && (
          <section className="bg-surface-mint py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Преимущества"
                title={advantages.title}
                {...(advantages.subtitle ? { description: advantages.subtitle } : {})}
              />
              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {parseRows(advantages.body).map((item, index) => (
                  <Reveal key={item.title} delay={index * 50}>
                    <article className="border-border flex h-full gap-4 rounded-2xl border bg-card p-5">
                      <span className="bg-surface-green text-brand-green grid size-11 shrink-0 place-items-center rounded-full font-bold">
                        0{index + 1}
                      </span>
                      <div>
                        <h3 className="text-foreground text-lg leading-snug font-bold">{item.title}</h3>
                        {item.text && <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.text}</p>}
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {symptoms && (
          <section className="py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <SectionHeading
                  eyebrow="Симптомы"
                  title={symptoms.title}
                  {...(symptoms.subtitle ? { description: symptoms.subtitle } : {})}
                />
                <a
                  href={symptoms.primary_url || BOOKING_URL}
                  className="bg-accent text-accent-foreground mt-7 inline-flex rounded-md px-7 py-4 text-base font-semibold"
                >
                  {symptoms.primary_label || "Записаться на консультацию"}
                </a>
              </div>
              <ul className="border-border grid gap-3 rounded-2xl border bg-card p-5 sm:grid-cols-2 sm:p-7">
                {parseRows(symptoms.body).map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="bg-surface-green text-brand-green mt-0.5 grid size-6 shrink-0 place-items-center rounded-full">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-foreground text-base">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {(diseases || procedures) && (
          <section className="bg-surface-soft py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
              {diseases && <RowsPanel eyebrow="Заболевания" section={diseases} />}
              {procedures && <RowsPanel eyebrow="Услуги" section={procedures} />}
            </div>
          </section>
        )}

        {data.doctors.length > 0 && (
          <section className="py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading eyebrow="Специалисты" title="Врачи-хирурги" />
              <DoctorsGrid doctors={data.doctors} />
            </div>
          </section>
        )}

        {diagnostics && (
          <section className="bg-surface-mint py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Подготовка"
                title={diagnostics.title}
                {...(diagnostics.subtitle ? { description: diagnostics.subtitle } : {})}
              />
              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {parseRows(diagnostics.body).map((item, index) => (
                  <article key={item.title} className="border-border rounded-2xl border bg-card p-5 sm:p-6">
                    <span className="bg-surface-green text-brand-green grid size-10 place-items-center rounded-full font-bold">{index + 1}</span>
                    <h3 className="text-foreground mt-4 text-lg font-bold">{item.title}</h3>
                    {item.text && <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.text}</p>}
                  </article>
                ))}
              </div>
              {diagnostics.primary_url && (
                <Link to="/diagnostika" className="text-brand-green mt-7 inline-flex items-center gap-2 text-lg font-bold">
                  {diagnostics.primary_label || "Перейти к диагностике"}
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </section>
        )}

        {stationar && (
          <section className="py-14 sm:py-20">
            <div className="border-border mx-auto grid max-w-7xl overflow-hidden rounded-2xl border bg-card lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <SectionHeading
                  eyebrow="Стационар"
                  title={stationar.title}
                  {...(stationar.subtitle ? { description: stationar.subtitle } : {})}
                />
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {parseRows(stationar.body).map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="bg-surface-green text-brand-green mt-0.5 grid size-6 shrink-0 place-items-center rounded-full">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      <span className="text-foreground text-sm sm:text-base">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {stationar.image_url && (
                <img src={stationar.image_url} alt={stationar.title} loading="lazy" className="h-80 w-full object-cover lg:h-full lg:min-h-[440px]" />
              )}
            </div>
          </section>
        )}

        {steps && (
          <section className="bg-surface-soft py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading
                eyebrow="Процесс"
                title={steps.title}
                {...(steps.subtitle ? { description: steps.subtitle } : {})}
              />
              <ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {parseRows(steps.body).map((item, index) => (
                  <li key={item.title} className="border-border rounded-2xl border bg-card p-5 sm:p-6">
                    <span className="bg-surface-green text-brand-green grid size-11 place-items-center rounded-full text-base font-bold">{index + 1}</span>
                    <h3 className="text-foreground mt-4 text-lg font-bold">{item.title}</h3>
                    {item.text && <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.text}</p>}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {faq && faqItems.length > 0 && (
          <section id="faq" className="py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-9 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <SectionHeading
                eyebrow="FAQ"
                title={faq.title}
                {...(faq.subtitle ? { description: faq.subtitle } : {})}
              />
              <FaqList items={faqItems} />
            </div>
          </section>
        )}

        {final && (
          <section className="bg-surface-green py-12 sm:py-16">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
              <div className="max-w-2xl">
                <h2 className="text-foreground text-3xl font-extrabold sm:text-4xl">{final.title}</h2>
                {final.subtitle && <p className="text-muted-foreground mt-3 text-lg">{final.subtitle}</p>}
              </div>
              <a href={final.primary_url || BOOKING_URL} className="bg-accent text-accent-foreground rounded-md px-7 py-4 text-base font-semibold">
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

function RowsPanel({
  eyebrow,
  section,
}: {
  eyebrow: string;
  section: SurgeryContentSection;
}) {
  return (
    <div>
      <SectionHeading
        eyebrow={eyebrow}
        title={section.title}
        {...(section.subtitle ? { description: section.subtitle } : {})}
      />
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {parseRows(section.body).map((item) => (
          <article key={item.title} className="border-border flex gap-3 rounded-2xl border bg-card p-4">
            <span className="bg-surface-green text-brand-green mt-0.5 grid size-7 shrink-0 place-items-center rounded-full">
              <Check className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-foreground text-base font-bold">{item.title}</h3>
              {item.text && <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.text}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

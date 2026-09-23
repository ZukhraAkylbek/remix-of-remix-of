import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Plus } from "lucide-react";
import { useState } from "react";

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
  { slug: "mammologiya", title: "Маммология", subtitle: null, icon: "HeartPulse", image_url: "/assets/spec-gineko.webp" },
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
  const stationar = section("stationar");
  const symptoms = section("symptoms");
  const faq = section("faq");
  const final = section("final");
  const faqItems = parseRows(faq?.body);
  const heroImage = hero?.image_url || directions[0]?.image_url || specialtyImage("hirurgiya", 0);
  const consultationItems = [
    ...parseRows(symptoms?.body),
    { title: "Боль в животе" },
    { title: "Грыжа" },
    { title: "Воспалительные заболевания" },
    { title: "Вросший ноготь" },
    { title: "Незаживающие раны" },
    { title: "Травмы" },
    { title: "Рекомендована операция" },
  ].filter((item, index, items) => items.findIndex((candidate) => candidate.title === item.title) === index).slice(0, 8);

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Хирургия" />
      <Breadcrumbs items={[{ label: "Хирургия" }]} />
      {faqItems.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqItems.map((item) => ({ question: item.title, answer: item.text ?? "" })))) }} />
      )}

      <main>
        {hero && (
          <section className="bg-surface-mint">
            <div className="mx-auto grid max-w-7xl overflow-hidden px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
              <Reveal className="flex flex-col justify-center py-3 lg:pr-12">
                <p className="text-muted-foreground text-sm font-semibold">Хирургия</p>
                <h1 className="text-foreground mt-3 max-w-2xl text-4xl leading-[1.08] font-extrabold sm:text-5xl">Комплексное хирургическое лечение</h1>
                <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">{hero.subtitle}</p>
                <div className="mt-7 grid max-w-2xl gap-4 sm:grid-cols-3">
                  {parseRows(hero.body).slice(0, 3).map((item) => (
                    <div key={item.title} className="flex items-center gap-3">
                      <span className="bg-surface-green text-brand-green grid size-10 shrink-0 place-items-center rounded-full"><Check className="size-5" aria-hidden="true" /></span>
                      <span className="text-foreground text-sm font-bold leading-snug">{item.title}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={hero.primary_url || BOOKING_URL} target="_blank" rel="noopener noreferrer" className="bg-brand-green text-brand-white hover:bg-brand-green-dark rounded-md px-6 py-3.5 text-sm font-bold transition-colors">{hero.primary_label || "Записаться на консультацию"}</a>
                  <a href="#directions" className="border-border bg-background text-foreground hover:border-brand-green rounded-md border px-6 py-3.5 text-sm font-bold transition-colors">Выбрать направление</a>
                </div>
              </Reveal>
              <div className="relative mt-8 min-h-[300px] overflow-hidden rounded-2xl lg:mt-0 lg:min-h-[430px]">
                <img src={heroImage} alt="Хирургическое отделение клиники «Авиценна»" className="absolute inset-0 size-full object-cover" />
                <div className="from-surface-mint/30 absolute inset-0 bg-gradient-to-r to-transparent" />
                <div className="bg-background/95 absolute right-0 bottom-0 grid grid-cols-2 gap-6 rounded-tl-2xl p-5 backdrop-blur-sm">
                  <div><strong className="text-foreground block text-3xl">{Math.max(data.doctors.length, 14)}</strong><span className="text-muted-foreground text-xs">специалистов</span></div>
                  <div><strong className="text-foreground block text-3xl">{directions.length}</strong><span className="text-muted-foreground text-xs">направлений</span></div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="directions" className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading title="Направления хирургии" description={`${Math.max(data.doctors.length, 14)} специалистов оперируют по следующим направлениям:`} />
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {directions.map((direction, index) => (
                <Reveal key={direction.slug} delay={index * 35}>
                  <Link to="/hirurgiya/$slug" params={{ slug: direction.slug }} className="border-border hover:border-brand-green group flex min-h-28 items-center gap-4 rounded-xl border bg-card p-5 transition-colors">
                    <DiagnosticsIcon icon={direction.icon} title={direction.title} className="size-12 rounded-full" />
                    <div className="min-w-0 flex-1"><h2 className="text-foreground text-base font-bold">{direction.title}</h2><p className="text-muted-foreground mt-1 text-sm leading-snug">{direction.subtitle || "Диагностика и современные методы лечения."}</p></div>
                    <ArrowRight className="text-brand-green size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {stationar && (
          <section className="pb-12 sm:pb-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading title={stationar.title} />
              <div className="mt-7 grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                {stationar.image_url && <img src={stationar.image_url} alt={stationar.title} loading="lazy" className="h-72 w-full rounded-xl object-cover sm:h-80" />}
                <ul className="grid gap-4 sm:grid-cols-2">
                  {parseRows(stationar.body).map((item) => <li key={item.title} className="text-foreground flex items-center gap-3 text-sm sm:text-base"><span className="bg-surface-green text-brand-green grid size-10 shrink-0 place-items-center rounded-full"><Check className="size-5" /></span>{item.title}</li>)}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="bg-surface-soft py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading title={symptoms?.title || "Когда нужна консультация хирурга"} />
            <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {consultationItems.map((item) => <div key={item.title} className="border-border flex min-h-24 items-center gap-3 rounded-xl border bg-card p-4"><span className="bg-surface-green text-brand-green grid size-10 shrink-0 place-items-center rounded-full"><Check className="size-5" /></span><span className="text-foreground text-sm font-semibold leading-snug">{item.title}</span></div>)}
            </div>
            <div className="border-border mt-7 flex flex-wrap items-center gap-5 rounded-xl border bg-card p-5 sm:p-6">
              <span className="border-brand-green text-brand-green grid size-12 shrink-0 place-items-center rounded-full border-2 text-2xl font-bold">?</span>
              <div className="min-w-0 flex-1"><h2 className="text-foreground text-lg font-bold">Хотите проконсультироваться?</h2><p className="text-muted-foreground mt-1 text-sm">Мы поможем подобрать специалиста, доступ 24/7.</p></div>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="bg-brand-green text-brand-white hover:bg-brand-green-dark rounded-md px-6 py-3 text-sm font-bold transition-colors">Записаться</a>
            </div>
          </div>
        </section>

        {data.doctors.length > 0 && <section className="py-12 sm:py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><SectionHeading title="Наши специалисты" /><DoctorsGrid doctors={data.doctors} /></div></section>}

        {faq && faqItems.length > 0 && (
          <section id="faq" className="py-12 sm:py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><SectionHeading title={faq.title} /><div className="mt-7"><FaqList items={faqItems} /></div></div></section>
        )}

        {final && (
          <section className="pb-12 sm:pb-16">
            <div className="bg-surface-mint mx-auto grid max-w-7xl overflow-hidden rounded-2xl lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col justify-center p-6 sm:p-10"><h2 className="text-foreground text-3xl font-extrabold sm:text-4xl">Забота о вашем здоровье</h2><p className="text-muted-foreground mt-3 max-w-xl text-base leading-relaxed">{final.subtitle}</p><a href={final.primary_url || BOOKING_URL} target="_blank" rel="noopener noreferrer" className="bg-brand-green text-brand-white hover:bg-brand-green-dark mt-6 w-fit rounded-md px-6 py-3.5 text-sm font-bold transition-colors">Записаться на консультацию</a></div>
              <img src={heroImage} alt="Консультация хирурга" loading="lazy" className="h-72 w-full object-cover lg:h-full lg:min-h-80" />
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Check,
  ClipboardCheck,
  HeartPulse,
  Microscope,
  Phone,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

import doctorPatientHeroAsset from "@/assets/doctor-patient-hero.jpg.asset.json";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC, absoluteUrl, faqPageJsonLd } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";
import { specialtyImage } from "@/lib/specialty-images";

const TITLE = "Поликлиника в Бишкеке — врачи и диагностика | Авиценна";
const DESCRIPTION =
  "Поликлиника «Авиценна» в Бишкеке: консультации врачей, диагностика, анализы и комплексное наблюдение для взрослых и детей.";

const BENEFITS = [
  {
    icon: Users,
    title: "Более 100 специалистов",
    text: "Врачи различных специальностей для взрослых и детей.",
  },
  {
    icon: Stethoscope,
    title: "Комплексный подход",
    text: "Консультации, обследования и лечение в одной клинике.",
  },
  {
    icon: Microscope,
    title: "Точная диагностика",
    text: "Лабораторные и инструментальные исследования на месте.",
  },
  {
    icon: ShieldCheck,
    title: "Забота о пациенте",
    text: "Понятные рекомендации и сопровождение на каждом этапе.",
  },
];

const CONSULTATION_REASONS = [
  "Повышенная температура и слабость",
  "Боль или длительный дискомфорт",
  "Изменение самочувствия без понятной причины",
  "Обострение хронического заболевания",
  "Необходимость профилактического осмотра",
  "Расшифровка анализов и обследований",
  "Наблюдение ребёнка у специалиста",
  "Подбор индивидуального плана лечения",
];

const SERVICES = [
  "Первичный и повторный приём врача",
  "Профилактические осмотры",
  "Лабораторные анализы",
  "Ультразвуковая диагностика",
  "Функциональная диагностика",
  "Оформление справок и заключений",
  "Медицинские чекапы",
  "Наблюдение при хронических заболеваниях",
];

const SPECIALISTS = [
  { title: "Терапевт", slug: "terapevt", image: "kardiolog" },
  { title: "Педиатр", slug: "pediatr", image: "pediatr" },
  { title: "Кардиолог", slug: "kardiolog", image: "kardiolog" },
  { title: "Невролог", slug: "nevrolog", image: "nevrolog" },
  { title: "Эндокринолог", slug: "endokrinolog", image: "endokrinolog" },
];

const FAQS = [
  {
    question: "Нужно ли направление для записи к врачу?",
    answer: "Нет, вы можете записаться к нужному специалисту напрямую по телефону или онлайн.",
  },
  {
    question: "Можно ли пройти обследования в день приёма?",
    answer: "Большинство анализов и диагностических исследований доступны в клинике. Точный план уточнит врач.",
  },
  {
    question: "Принимают ли врачи детей?",
    answer: "Да, в поликлинике ведут приём детские специалисты. При записи укажите возраст ребёнка.",
  },
];

export const Route = createFileRoute("/poliklinika")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/poliklinika") || "/poliklinika" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqPageJsonLd(FAQS)),
      },
    ],
  }),
  component: PolyclinicPage,
});

function PolyclinicPage() {
  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Поликлиника" />
      <Breadcrumbs items={[{ label: "Поликлиника" }]} />

      <main>
        <section className="bg-surface-mint border-border border-b">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
            <div className="flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:py-20 lg:pr-12">
              <p className="eyebrow">Многопрофильная помощь</p>
              <h1 className="text-foreground mt-4 max-w-2xl text-4xl leading-[1.06] font-extrabold sm:text-5xl lg:text-6xl">
                Поликлиника «Авиценна» в Бишкеке
              </h1>
              <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed sm:text-xl">
                Консультации врачей, диагностика и лечение для взрослых и детей — в одном месте и без лишнего ожидания.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent text-accent-foreground inline-flex min-h-12 items-center justify-center rounded-md px-7 py-3.5 text-base font-semibold transition-opacity hover:opacity-90"
                >
                  Записаться на приём
                </a>
                <a
                  href={`tel:${CLINIC.phones[0]}`}
                  className="border-brand-green bg-background text-brand-green inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-7 py-3.5 text-base font-semibold"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  +996 779 909 009
                </a>
              </div>
            </div>

            <div className="relative min-h-[340px] overflow-hidden lg:min-h-[520px]">
              <img
                src={doctorPatientHeroAsset.url}
                alt="Консультация врача в клинике Авиценна"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="from-surface-mint absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-mint/20 lg:bg-gradient-to-r lg:from-surface-mint/50 lg:via-transparent lg:to-transparent" />
            </div>
          </div>
        </section>

        <section className="border-border border-b py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Преимущества" title="Почему выбирают поликлинику «Авиценна»" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <article key={title} className="border-border rounded-2xl border p-6">
                  <span className="bg-surface-green text-brand-green grid size-12 place-items-center rounded-full">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h2 className="text-foreground mt-5 text-lg font-bold">{title}</h2>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-soft border-border border-b py-14 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Консультация"
                title="Когда стоит обратиться к врачу"
                description="Не откладывайте приём, если симптомы повторяются, усиливаются или мешают привычной жизни."
              />
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-accent-foreground mt-8 inline-flex rounded-md px-7 py-4 text-base font-semibold"
              >
                Выбрать врача
              </a>
            </div>
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {CONSULTATION_REASONS.map((item) => (
                <li key={item} className="border-border flex items-start gap-3 border-b pb-4">
                  <span className="bg-surface-green text-brand-green mt-0.5 grid size-6 shrink-0 place-items-center rounded-full">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-foreground text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-border border-b py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Услуги"
              title="Помощь в поликлинике"
              description="От первого обращения до контроля результатов лечения."
            />
            <div className="mt-10 grid gap-x-12 gap-y-0 md:grid-cols-2">
              {SERVICES.map((item, index) => (
                <div key={item} className="border-border grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b py-5">
                  <span className="text-brand-green text-sm font-bold">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-foreground min-w-0 text-base font-semibold sm:text-lg">{item}</p>
                  <ClipboardCheck className="text-muted-foreground size-5 shrink-0" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-border border-b py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Специалисты"
              title="Врачи поликлиники"
              action={
                <Link to="/napravleniya" className="text-brand-green inline-flex items-center gap-2 font-semibold">
                  Все направления <ArrowRight className="size-4" />
                </Link>
              }
            />
            <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto pb-2">
              {SPECIALISTS.map((item, index) => (
                <Link
                  key={item.title}
                  to="/napravleniya/$slug"
                  params={{ slug: item.slug }}
                  className="border-border group w-[78vw] max-w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl border sm:w-[240px]"
                >
                  <img
                    src={specialtyImage(item.image, index)}
                    alt={item.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5">
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-lg font-bold">{item.title}</p>
                      <p className="text-muted-foreground mt-1 text-sm">Запись на консультацию</p>
                    </div>
                    <ArrowRight className="text-brand-green size-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FaqAccordion faqs={FAQS} />

        <section className="bg-surface-mint border-border border-y">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-[1fr_0.85fr]">
            <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:py-16 lg:pr-14">
              <span className="bg-surface-green text-brand-green grid size-12 place-items-center rounded-full">
                <HeartPulse className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-foreground mt-5 text-3xl font-extrabold sm:text-4xl">Забота о вашем здоровье</h2>
              <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
                Запишитесь на консультацию — администратор поможет выбрать специалиста и удобное время.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-accent-foreground mt-8 inline-flex w-fit rounded-md px-7 py-4 text-base font-semibold"
              >
                Записаться на консультацию
              </a>
            </div>
            <img
              src={doctorPatientHeroAsset.url}
              alt="Врач консультирует пациента"
              className="h-[300px] w-full object-cover lg:h-full lg:min-h-[390px]"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, Phone, Sparkles, Star, Stethoscope, TrendingUp } from "lucide-react";

import aboutHeroAsset from "@/assets/about-hero.jpg.asset.json";
import aboutMissionAsset from "@/assets/about-mission.jpg.asset.json";
import asianFamilyHeroAsset from "@/assets/asian-family-hero.png.asset.json";
import doctorPatientHeroAsset from "@/assets/doctor-patient-hero.jpg.asset.json";
import image2Asset from "@/assets/image-2.png.asset.json";

import { BranchesWithMap } from "@/components/BranchesWithMap";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC, absoluteUrl } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";

const TITLE = "Авиценна — забота о здоровье всей семьи в одной клинике";
const DESCRIPTION =
  "Врачи, анализы, диагностика, хирургия и стационар в Бишкеке. Запишитесь онлайн за минуту — круглосуточные направления работают 24/7.";

export const Route = createFileRoute("/glavnaya-v3")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/glavnaya-v3") || "/glavnaya-v3" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/glavnaya-v3") || "/glavnaya-v3" }],
  }),
  component: HomeV3,
});

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-brand-red text-[11px] font-bold tracking-[0.18em] uppercase">
      {children}
    </p>
  );
}

function Section({
  id,
  eyebrow,
  title,
  tone = "plain",
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  tone?: "plain" | "soft" | "green";
  children: React.ReactNode;
}) {
  const bg =
    tone === "soft" ? "bg-surface-soft" : tone === "green" ? "bg-surface-green" : "bg-background";
  return (
    <section id={id} className={`${bg} border-border border-t`}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {title && (
          <h2 className="text-foreground mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {title}
          </h2>
        )}
        <div className={eyebrow || title ? "mt-5" : ""}>{children}</div>
      </div>
    </section>
  );
}

const ROUTE_CARDS = [
  { title: "Поликлиника", href: "/napravleniya", tone: "pastel-mint" },
  { title: "Травмпункт 24/7", href: "/travmpunkt", tone: "pastel-coral" },
  { title: "Диагностика", href: "/diagnostika", tone: "pastel-sky" },
  { title: "Стационар", href: "/uslugi/uslugi-stacionara", tone: "pastel-lavender" },
  { title: "Урология", href: "/hirurgiya/urologiya", tone: "pastel-sand" },
  { title: "Услуги на дому", href: "/uslugi/uslugi-na-domu", tone: "pastel-rose" },
  { title: "Хирургия", href: "/hirurgiya", tone: "pastel-lime" },
  { title: "Лаборатория", href: "/uslugi/analizy", tone: "pastel-azure" },
  { title: "Чекапы", href: "/checkups", tone: "pastel-peach" },
];


const SPECIALTY_PILLS = [
  "Неврология",
  "Урология",
  "Маммология",
  "Гинекология",
  "Кардиология",
  "Лор",
];

const REVIEWS = [
  { text: "Быстро приняли в травмпункте ночью, всё объяснили и сделали снимок за 15 минут.", src: "2GIS" },
  { text: "Чекап прошли всей семьёй за два дня — результаты пришли в приложение.", src: "Google" },
  { text: "Хирург подробно разобрал анализы и предложил план без лишних процедур.", src: "2GIS" },
];

const CLINIC_STATS = [
  { value: "6", label: "филиалов в Бишкеке", icon: MapPin },
  { value: "60+", label: "врачебных специальностей", icon: Stethoscope },
  { value: "410+", label: "медицинских услуг", icon: TrendingUp },
];


function HomeV3() {
  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <main>
        {/* Оффер */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
            {/* Большой баннер с фото на всю область */}
            <div className="border-border relative min-h-[340px] overflow-hidden rounded-3xl border sm:min-h-[420px]">
              <img
                src={asianFamilyHeroAsset.url}
                alt="Счастливая семья на фоне голубого неба"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
                width={1344}
                height={768}
              />
              <div className="from-brand-white/95 via-brand-white/70 absolute inset-0 bg-gradient-to-r to-transparent" />
              <div className="relative flex h-full max-w-[560px] flex-col justify-center p-6 sm:p-10">
                <Eyebrow>Здоровье без лишней сложности</Eyebrow>
                <h1 className="text-foreground mt-3 text-3xl leading-[1.08] font-extrabold tracking-tight sm:text-[42px]">
                  Проверьте здоровье сегодня — предотвратите{" "}
                  <span className="bg-brand-green text-brand-white rounded-lg px-2 py-0.5">
                    проблемы завтра
                  </span>
                </h1>
                <p className="text-muted-foreground mt-4 max-w-md text-[16px] leading-relaxed">
                  Врачи, анализы, диагностика, хирургия и стационар в Бишкеке. Поможем выбрать
                  специалиста и удобное время.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/checkups"
                    className="gradient-accent text-accent-foreground inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[16px] font-extrabold transition-all hover:-translate-y-0.5 hover:brightness-105"
                  >
                    Пройти чекап
                  </Link>
                  <Link
                    to="/uslugi"
                    className="border-border bg-background/80 text-foreground hover:border-brand-green inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 text-[16px] font-extrabold transition-colors"
                  >
                    Найти услугу
                  </Link>
                </div>
              </div>
            </div>

            {/* Быстрый маршрут — сетка 3×3 справа */}
            <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3">
              {ROUTE_CARDS.map((card) => (
                <Link
                  key={card.title}
                  to={card.href as "/"}
                  className={`${card.tone} card-lift border-border/40 hover:border-brand-green group flex min-h-[104px] flex-col justify-between rounded-2xl border p-4 transition-all`}
                >
                  <p className="text-foreground text-[14px] leading-snug font-extrabold">
                    {card.title}
                  </p>
                  <span className="bg-brand-green text-brand-white ml-auto flex size-7 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Зелёные блоки специальностей */}
        <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-nowrap items-center gap-3 overflow-x-auto pb-1">
            {SPECIALTY_PILLS.map((name) => (
              <Link
                key={name}
                to="/napravleniya"
                className="bg-brand-green text-brand-white hover:bg-brand-green/90 inline-flex shrink-0 items-center rounded-full px-5 py-2.5 text-sm font-extrabold transition-colors"
              >
                {name}
              </Link>
            ))}
          </div>
        </section>

        {/* О клинике */}
        <Section id="o-klinike" eyebrow="О клинике" title="Авиценна с 2000 года">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <Reveal className="order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-3xl border border-border shadow-lg">
                <img
                  src={aboutMissionAsset.url}
                  alt="Сеть клиник Авиценна в Бишкеке"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/20 to-transparent" />
              </div>
            </Reveal>
            <div className="order-1 flex flex-col gap-4 lg:order-2">
              <Reveal delay={80}>
                <p className="text-muted-foreground text-[15px] leading-relaxed sm:text-[16px]">
                  Сеть клиник «Авиценна» ведет свою историю с 2000 года, когда врач-дерматовенеролог,
                  кандидат медицинских наук Жыпар Абдыказиевна Керималиева открыла первый медицинский
                  центр в небольшом кабинете на улице Суеркулова.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-muted-foreground text-[15px] leading-relaxed sm:text-[16px]">
                  Сегодня «Авиценна» — это 6 филиалов в Бишкеке, более 60 врачебных специальностей и
                  более 410 медицинских услуг для взрослых и детей. Мы объединяем специалистов,
                  современную диагностику и собственную лабораторию, чтобы пациент мог получить
                  необходимую качественную медицинскую помощь в одном клинике.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {CLINIC_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-surface-soft border-border flex flex-col items-center gap-2 rounded-2xl border p-3 text-center sm:p-4"
                    >
                      <stat.icon className="text-brand-green size-5 sm:size-6" />
                      <div>
                        <p className="text-foreground text-xl font-extrabold sm:text-2xl">
                          {stat.value}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-[11px] leading-tight sm:text-xs">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={200}>
                <Link
                  to="/about"
                  className="text-brand-green hover:text-brand-green-dark inline-flex w-fit items-center gap-2 text-[15px] font-extrabold transition-colors"
                >
                  Подробнее о клинике
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
          </div>
        </Section>



        {/* Баннер перед картой */}
        <section className="relative overflow-hidden">
          <img
            src={aboutHeroAsset.url}
            alt="Врач проводит онлайн-консультацию"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="from-background/95 via-background/80 to-background/40 absolute inset-0 bg-gradient-to-r" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="max-w-2xl">
              <p className="text-brand-red text-[13px] font-bold uppercase tracking-wider">
                Онлайн-консультации
              </p>
              <h2 className="text-foreground mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Хотите проконсультироваться не приезжая в клинику?
              </h2>
              <p className="text-muted-foreground mt-4 text-[15px] leading-relaxed">
                Получите консультацию онлайн от специалистов «Авиценны». Удобно, без очередей и
                лишнего времени в дороге.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-green text-brand-white hover:bg-brand-green-dark mt-6 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-extrabold transition-colors shadow-lg"
              >
                Записаться
              </a>
            </div>
          </div>
        </section>

        {/* Филиалы на карте */}
        <BranchesWithMap />

        {/* Отзывы */}
        <Section tone="soft" eyebrow="Доверие" title="Отзывы пациентов">
          <div className="grid auto-rows-fr gap-4 lg:grid-cols-3">
            {REVIEWS.map((review) => (
              <figure
                key={review.text}
                className="bg-background border-border flex h-full flex-col rounded-2xl border p-6"
              >
                <div className="text-brand-green flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-foreground mt-4 text-[15px] leading-relaxed">
                  {review.text}
                </blockquote>
                <figcaption className="text-muted-foreground mt-auto pt-4 text-[13px]">
                  Источник: {review.src}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        {/* Часто задаваемые вопросы */}
        <FaqAccordion />


        {/* Запись */}
        <Section tone="green" eyebrow="Запись" title="Оставьте номер — поможем выбрать врача">
          <p className="text-muted-foreground -mt-4 text-[15px]">
            Перезвоним и подберём специалиста, филиал и время приёма.
          </p>
          <form
            className="mt-7 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="grid gap-2">
              <span className="text-muted-foreground text-[13px] font-bold">Ваше имя</span>
              <input
                placeholder="Имя"
                className="bg-background border-border text-foreground rounded-xl border px-4 py-3 text-[15px] outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-muted-foreground text-[13px] font-bold">Телефон</span>
              <input
                inputMode="tel"
                placeholder="+996 ___ ___ ___"
                className="bg-background border-border text-foreground rounded-xl border px-4 py-3 text-[15px] outline-none"
              />
            </label>
            <button
              type="submit"
              className="bg-brand-green text-brand-white hover:bg-brand-green-dark self-end rounded-xl px-7 py-3 text-[15px] font-extrabold transition-colors"
            >
              Жду звонка
            </button>
          </form>
          <p className="text-muted-foreground mt-5 flex flex-wrap items-center gap-4 text-[14px]">
            <span className="inline-flex items-center gap-2">
              <Phone className="size-4" /> {CLINIC.phones[0]}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4" /> Круглосуточные направления
            </span>
          </p>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

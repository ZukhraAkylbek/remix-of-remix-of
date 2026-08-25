import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, CalendarCheck, Clock, Home, MessageCircle, Phone, Star } from "lucide-react";

import aboutHeroAsset from "@/assets/about-hero.jpg.asset.json";
import doctorPatientHeroAsset from "@/assets/doctor-patient-hero.jpg.asset.json";
import image2Asset from "@/assets/image-2.png.asset.json";
import imageAsset from "@/assets/image.png.asset.json";
import imageWebpAsset from "@/assets/image.webp.asset.json";

import { GradientBanner } from "@/components/GradientBanner";
import { BranchesWithMap } from "@/components/BranchesWithMap";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC, absoluteUrl } from "@/lib/clinic";
import { specialtyImage } from "@/lib/specialty-images";
import { specialtiesQueryOptions } from "@/lib/specialties.queries";

const TITLE = "Авиценна — забота о здоровье всей семьи в одной клинике";
const DESCRIPTION =
  "Врачи, анализы, диагностика, хирургия и стационар в Бишкеке. Запишитесь онлайн за минуту — круглосуточные направления работают 24/7.";

export const Route = createFileRoute("/glavnaya-v3")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(specialtiesQueryOptions());
  },
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {title && (
          <h2 className="text-foreground mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {title}
          </h2>
        )}
        <div className={eyebrow || title ? "mt-8" : ""}>{children}</div>
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

const FEATURED_OFFER = {
  title: "Сомнография",
  text: "консультация + диагностика на сомнографе",
  price: "3700",
  oldPrice: "4900",
  href: "/diagnostika",
  image: aboutHeroAsset.url,
};

const RIGHT_OFFERS = [
  {
    title: "Процедурные 24/7",
    href: "/travmpunkt",
    image: imageWebpAsset.url,
  },
  {
    title: "Бесплатная консультация хирурга по операции",
    href: "/hirurgiya",
    image: imageAsset.url,
  },
  {
    title: "Проверь магний и фосфор с 50% скидкой",
    href: "/uslugi/analizy",
    image: image2Asset.url,
  },
  {
    title: "Счастливые часы",
    href: "/checkups",
    image: doctorPatientHeroAsset.url,
  },
];

const REVIEWS = [
  { text: "Быстро приняли в травмпункте ночью, всё объяснили и сделали снимок за 15 минут.", src: "2GIS" },
  { text: "Чекап прошли всей семьёй за два дня — результаты пришли в приложение.", src: "Google" },
  { text: "Хирург подробно разобрал анализы и предложил план без лишних процедур.", src: "2GIS" },
];

function HomeV3() {
  const { data: specialties } = useSuspenseQuery(specialtiesQueryOptions());
  const top = specialties.slice(0, 5);

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <main>
        {/* Оффер */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
            {/* Большой баннер с фото на всю область */}
            <div className="border-border relative min-h-[340px] overflow-hidden rounded-3xl border sm:min-h-[420px]">
              <img
                src={doctorPatientHeroAsset.url}
                alt="Семья на приёме в клинике Авиценна"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
              <div className="from-brand-white/95 via-brand-white/70 absolute inset-0 bg-gradient-to-r to-transparent" />
              <div className="relative flex h-full max-w-[560px] flex-col justify-center p-6 sm:p-10">
                <Eyebrow>Здоровье без лишней сложности</Eyebrow>
                <h1 className="text-foreground mt-3 text-3xl leading-[1.08] font-extrabold tracking-tight sm:text-[42px]">
                  Забота о здоровье всей семьи — в одной клинике
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


        {/* Мини-офферы */}
        <Section eyebrow="Актуально" title="Что вам нужно?">
          <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr] lg:grid-rows-2">
            {/* Левый большой баннер */}
            <Link
              to={FEATURED_OFFER.href as "/"}
              className="group relative row-span-2 flex min-h-[300px] flex-col overflow-hidden rounded-3xl sm:min-h-[360px] lg:min-h-0"
            >
              <img
                src={FEATURED_OFFER.image}
                alt={FEATURED_OFFER.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-green/80 via-brand-green/50 to-transparent" />
              <div className="relative flex flex-1 flex-col justify-between p-6 sm:p-8">
                <div className="space-y-3">
                  <span className="bg-brand-green text-brand-white inline-block rounded-xl px-4 py-2 text-lg font-extrabold shadow-lg sm:text-xl">
                    {FEATURED_OFFER.title}
                  </span>
                  <div className="bg-brand-green/95 text-brand-white max-w-[280px] rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm sm:max-w-[320px]">
                    <p className="text-sm font-bold leading-snug sm:text-base">
                      {FEATURED_OFFER.text}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold sm:text-3xl">
                        {FEATURED_OFFER.price}
                      </span>
                      <span className="text-brand-white/70 text-sm line-through">
                        {FEATURED_OFFER.oldPrice}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="bg-brand-white text-brand-green hover:bg-brand-white/90 inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors shadow-md">
                  Подробнее
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Правая 2×2 сетка */}
            {RIGHT_OFFERS.map((offer) => (
              <Link
                key={offer.title}
                to={offer.href as "/"}
                className="banner-brand group relative flex min-h-[140px] items-center justify-between overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  aria-hidden="true"
                  className="banner-glow pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-60 transition-all duration-500 group-hover:opacity-95 group-hover:scale-125"
                />
                <div className="relative z-10 flex flex-col gap-3">
                  <p className="text-brand-white max-w-[65%] text-[15px] font-extrabold leading-tight sm:text-[16px]">
                    {offer.title}
                  </p>
                  <span className="bg-brand-white text-brand-green inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors hover:bg-brand-white/90">
                    Подробнее
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
                <img
                  src={offer.image}
                  alt=""
                  className="absolute right-2 bottom-0 h-[90%] w-auto rounded-lg object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </Section>



        {/* Направления + чекапы */}
        <Section eyebrow="Основные направления" title="Выберите нужную помощь">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
            <div className="grid snap-x grid-flow-col grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 overflow-x-auto pb-2 auto-cols-[minmax(260px,1fr)] sm:snap-none sm:auto-rows-fr sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible">
              {top.map((item, index) => (
                <Link
                  key={item.slug}
                  to="/napravleniya/$slug"
                  params={{ slug: item.slug }}
                  className="group card-lift bg-surface-soft hover:bg-surface-green flex h-full snap-start flex-col gap-3 overflow-hidden rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-foreground group-hover:text-brand-green block max-w-[60%] text-xl leading-tight font-extrabold transition-colors sm:text-[22px]">
                      {item.name}
                    </span>
                    <img
                      src={specialtyImage(item.slug, index)}
                      alt={item.name}
                      width={768}
                      height={768}
                      loading="lazy"
                      className="size-14 shrink-0 rounded-xl object-contain transition-transform duration-500 group-hover:scale-105 sm:size-16"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground line-clamp-3 text-sm">
                      {item.intro || "\u00A0"}
                    </span>
                    <span className="text-brand-green mt-auto inline-flex items-center gap-1 text-sm font-bold">
                      Подробнее
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
              <Link
                to="/uslugi"
                className="group card-lift bg-surface-green hover:bg-surface-green/80 flex h-full snap-start flex-col gap-3 overflow-hidden rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground block max-w-[60%] text-xl leading-tight font-extrabold sm:text-[22px]">
                    Все услуги
                  </span>
                  <span className="bg-brand-green/10 text-brand-green flex size-14 shrink-0 items-center justify-center rounded-xl sm:size-16">
                    <ArrowRight className="size-6 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground line-clamp-3 text-sm">
                    Полный каталог услуг клиники: диагностика, консультации, анализы и стационар.
                  </span>
                  <span className="text-brand-green mt-auto inline-flex items-center gap-1 text-sm font-bold">
                    Перейти
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </div>

            <GradientBanner
              eyebrow="Чекапы"
              title="Проверьте здоровье вовремя"
              text="Готовые программы для женщин, мужчин, детей и сердца. Понятный состав, сроки и цена — от 1 дня."
              className="p-7 sm:p-8"
            >
              <Link
                to="/checkups"
                className="gradient-accent text-accent-foreground inline-flex rounded-2xl px-6 py-3 text-[15px] font-extrabold transition-all hover:-translate-y-0.5 hover:brightness-105"
              >
                Подобрать чекап
              </Link>
            </GradientBanner>
          </div>
        </Section>

        {/* Филиалы на карте */}
        <BranchesWithMap />

        {/* Врачи */}
        <Section id="vrachi" tone="soft" eyebrow="Команда" title="Врачи, которым доверяют">
          <div className="flex snap-x gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6">
            {[
              {
                name: "Айбек Токтосунов",
                profile: "Хирург общей практики, маммолог",
                image: imageAsset.url,
              },
              {
                name: "Гульнара Сатыбалдиева",
                profile: "Гинеколог, ведение беременности",
                image: imageWebpAsset.url,
              },
              {
                name: "Нурлан Жетигенов",
                profile: "Кардиолог, функциональная диагностика",
                image: image2Asset.url,
              },
            ].map((doctor) => (
              <div
                key={doctor.name}
                className="bg-background border-border flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border"
              >
                <img
                  src={doctor.image}
                  alt={`${doctor.name} — ${doctor.profile} в клинике Авиценна`}
                  loading="lazy"
                  className="h-44 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-foreground text-[17px] font-extrabold">{doctor.name}</p>
                  <p className="text-muted-foreground mt-2 text-[14px]">{doctor.profile}</p>
                  <p className="text-brand-green mt-auto pt-4 text-[14px] font-bold">
                    Ближайшее окно: сегодня
                  </p>
                </div>
              </div>
            ))}
            <Link
              to="/napravleniya"
              className="bg-surface-green hover:bg-surface-green/80 flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl transition-colors"
            >
              <img
                src={aboutHeroAsset.url}
                alt="Команда врачей клиники Авиценна"
                loading="lazy"
                className="h-44 w-full object-cover"
              />
              <div className="flex flex-1 flex-col justify-between p-6">
                <p className="text-foreground text-[17px] font-extrabold">Все врачи</p>
                <p className="text-brand-green-dark text-[14px] font-bold">
                  Фильтр по специальности →
                </p>
              </div>
            </Link>
          </div>
        </Section>

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

        {/* Запись */}
        <BranchesWithMap />

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

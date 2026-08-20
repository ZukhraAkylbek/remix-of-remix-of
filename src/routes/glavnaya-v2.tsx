import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, CalendarCheck, Clock, Home, MapPin, MessageCircle, Phone, Star } from "lucide-react";

import aboutHeroAsset from "@/assets/about-hero.jpg.asset.json";
import image2Asset from "@/assets/image-2.png.asset.json";
import imageAsset from "@/assets/image.png.asset.json";
import imageWebpAsset from "@/assets/image.webp.asset.json";

import { GradientBanner } from "@/components/GradientBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC, absoluteUrl } from "@/lib/clinic";
import { specialtyImage } from "@/lib/specialty-images";
import { specialtiesQueryOptions } from "@/lib/specialties.queries";

const TITLE = "Авиценна — забота о здоровье всей семьи в одной клинике";
const DESCRIPTION =
  "Врачи, анализы, диагностика, хирургия и стационар в Бишкеке. Запишитесь онлайн за минуту — круглосуточные направления работают 24/7.";

export const Route = createFileRoute("/glavnaya-v2")({
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
      { property: "og:url", content: absoluteUrl("/glavnaya-v2") || "/glavnaya-v2" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/glavnaya-v2") || "/glavnaya-v2" }],
  }),
  component: HomeV2,
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
  { title: "Записаться к врачу", text: "Выбрать специальность и время", href: "/napravleniya", tone: "pastel-mint" },
  { title: "Пройти чекап", text: "Обследование за 1–4 дня", href: "/checkups", tone: "pastel-coral" },
  { title: "Сдать анализы", text: "Лаборатория и результаты", href: "/uslugi/analizy", tone: "pastel-sky" },
  { title: "Сделать диагностику", text: "КТ, УЗИ, рентген, ЭКГ", href: "/diagnostika", tone: "pastel-lavender" },
  { title: "Вызвать врача на дом", text: "По предварительной записи", href: "/uslugi/vyzov-vracha-na-dom", tone: "pastel-sand" },
  { title: "Нужна срочная помощь", text: "Круглосуточные направления", href: "/travmpunkt", tone: "pastel-rose" },
];

const HERO_OFFERS = [
  {
    title: "Травмпункт 24/7",
    text: "Круглосуточная помощь",
    href: "/travmpunkt",
    tone: "banner-red",
    image: aboutHeroAsset.url,
  },
  {
    title: "Пройти чекап",
    text: "Обследование за 1–4 дня",
    href: "/checkups",
    tone: "banner-brand",
    image: imageWebpAsset.url,
  },
  {
    title: "Вызвать врача на дом",
    text: "По предварительной записи",
    href: "/uslugi/vyzov-vracha-na-dom",
    tone: "banner-sand",
    image: image2Asset.url,
  },
  {
    title: "Онлайн-консультация",
    text: "Запись удалённо",
    href: "/uslugi/online-konsultacii-vrachej",
    tone: "banner-sky",
    image: imageAsset.url,
  },
];


const DIAGNOSTICS = [
  { title: "КТ", text: "Режим / запись" },
  { title: "УЗИ", text: "Режим / запись" },
  { title: "Анализы", text: "Сроки результатов" },
  { title: "ЭКГ и ЭХОКГ", text: "Выбрать филиал" },
];

const REVIEWS = [
  { text: "Быстро приняли в травмпункте ночью, всё объяснили и сделали снимок за 15 минут.", src: "2GIS" },
  { text: "Чекап прошли всей семьёй за два дня — результаты пришли в приложение.", src: "Google" },
  { text: "Хирург подробно разобрал анализы и предложил план без лишних процедур.", src: "2GIS" },
];

function HomeV2() {
  const { data: specialties } = useSuspenseQuery(specialtiesQueryOptions());
  const top = specialties.slice(0, 5);


  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <main>
        {/* Оффер */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <Eyebrow>Здоровье без лишней сложности</Eyebrow>
          <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
            <div>
              <h1 className="text-foreground text-3xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl">
                Забота о здоровье всей семьи — в одной клинике
              </h1>
              <p className="text-muted-foreground mt-5 max-w-xl text-[17px] leading-relaxed">
                Врачи, анализы, диагностика, хирургия и стационар в Бишкеке. Поможем выбрать
                специалиста и удобное время.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/checkups"
                  className="gradient-accent text-accent-foreground hover:brightness-105 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[16px] font-extrabold transition-all hover:-translate-y-0.5"
                >
                  Пройти чекап
                </Link>
                <Link
                  to="/uslugi"
                  className="border-border text-foreground hover:border-brand-green inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 text-[16px] font-extrabold transition-colors"
                >
                  Найти услугу
                </Link>
              </div>

            </div>

            <div className="bg-surface-soft border-border text-muted-foreground grid min-h-[260px] place-items-center rounded-3xl border p-8 text-center text-[15px]">
              <div>
                <p className="text-foreground font-extrabold">Врач и пациент</p>
                <p className="mt-2">Тёплый доверительный кадр клиники «Авиценна»</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HERO_OFFERS.map((offer) => (
              <Link
                key={offer.title}
                to={offer.href as "/"}
                className={`${offer.tone} group relative flex items-center gap-4 overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <span
                  aria-hidden="true"
                  className="banner-glow pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-60 transition-all duration-500 group-hover:opacity-95 group-hover:scale-125"
                />
                <span className="bg-brand-white/15 relative size-11 shrink-0 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <img
                    src={offer.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </span>
                <div className="relative min-w-0">
                  <p className="text-brand-white text-[15px] font-extrabold leading-tight">
                    {offer.title}
                  </p>
                  <p className="text-brand-white/80 mt-0.5 text-[13px]">{offer.text}</p>
                </div>
                <ArrowRight className="text-brand-white/60 group-hover:text-brand-white relative ml-auto size-4 shrink-0 transition-all duration-300 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>



        {/* Быстрый маршрут */}
        <Section eyebrow="Быстрый маршрут" title="С чего начнём?">
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROUTE_CARDS.map((card) => (
              <Link
                key={card.title}
                to={card.href as "/"}
                className={`${card.tone} card-lift border-border/40 hover:border-brand-green group flex h-full flex-col items-start justify-center rounded-2xl border p-6 transition-all`}
              >
                <p className="text-foreground text-[17px] font-extrabold">{card.title}</p>
                <div className="text-muted-foreground mt-2 flex w-full items-center justify-between text-[15px]">
                  <span>{card.text}</span>
                  <ArrowRight className="text-brand-green size-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* Безотлагательно */}
        <Section tone="plain">
          <GradientBanner
            eyebrow="Забота 24/7"
            title="Срочно нужна помощь?"
            text="Травмпункт, дежурные врачи и ночная диагностика работают круглосуточно — приезжайте или позвоните."
          >
            <a
              href={`tel:${CLINIC.phones[0].replace(/[^+\d]/g, "")}`}
              className="gradient-accent text-accent-foreground inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-extrabold transition-all hover:-translate-y-0.5 hover:brightness-105"
            >
              <Phone className="size-4" /> Позвонить
            </a>
            <Link
              to="/travmpunkt"
              className="border-brand-white/50 text-brand-white hover:bg-brand-white/10 inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 text-[15px] font-extrabold transition-colors"
            >
              Травмпункт 24/7
            </Link>
          </GradientBanner>
          <p className="text-muted-foreground mt-6 text-[14px]">
            Скорую помощь клиника не оказывает. В экстренной ситуации — 103.
          </p>
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

        {/* Врачи */}
        <Section tone="soft" eyebrow="Команда" title="Врачи, которым доверяют">
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specialties.slice(0, 3).map((item) => (
              <div
                key={item.slug}
                className="bg-background border-border flex h-full flex-col rounded-2xl border p-6"
              >
                <p className="text-foreground text-[17px] font-extrabold">{item.name}</p>
                <p className="text-muted-foreground mt-2 text-[14px]">Приём взрослых и детей</p>
                <p className="text-brand-green mt-auto pt-4 text-[14px] font-bold">
                  Ближайшее окно: сегодня
                </p>
              </div>
            ))}
            <Link
              to="/napravleniya"
              className="bg-surface-green hover:bg-surface-green/80 flex h-full flex-col justify-between rounded-2xl p-6 transition-colors"
            >
              <p className="text-foreground text-[17px] font-extrabold">Все врачи</p>
              <p className="text-brand-green-dark text-[14px] font-bold">
                Фильтр по специальности →
              </p>
            </Link>
          </div>
        </Section>

        {/* Диагностика и филиалы */}
        <Section eyebrow="Диагностика и лаборатория" title="Пройти обследование в одном месте">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="grid auto-rows-fr gap-3 sm:grid-cols-2">
              {DIAGNOSTICS.map((item) => (
                <Link
                  key={item.title}
                  to="/diagnostika"
                  className="border-border hover:border-brand-green flex h-full flex-col rounded-2xl border p-5 transition-colors"
                >
                  <p className="text-foreground text-[16px] font-extrabold">{item.title}</p>
                  <p className="text-muted-foreground mt-1 text-[14px]">{item.text}</p>
                </Link>
              ))}
            </div>
            <div>
              <Eyebrow>Филиалы</Eyebrow>
              <p className="text-foreground mt-3 text-2xl font-extrabold">Найдите ближайший</p>
              <ul className="mt-6 grid gap-3">
                {CLINIC.branches.map((branch) => (
                  <li
                    key={branch.name}
                    className="border-border text-foreground flex items-start gap-3 rounded-2xl border p-4 text-[15px]"
                  >
                    <MapPin className="text-brand-green mt-0.5 size-4 shrink-0" />
                    <span>
                      {branch.street}
                      <span className="text-muted-foreground block text-[13px]">
                        {branch.city}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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

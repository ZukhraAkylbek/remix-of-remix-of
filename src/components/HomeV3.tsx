import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import { useRef, useState } from "react";

import aboutHeroAsset from "@/assets/about-hero.jpg.asset.json";
import aboutMissionAsset from "@/assets/about-mission.jpg.asset.json";
import asianFamilyHeroAsset from "@/assets/asian-family-hero.png.asset.json";
import clinicVideoAsset from "@/assets/clinic-video.mp4.asset.json";
import doctorPatientHeroAsset from "@/assets/doctor-patient-hero.jpg.asset.json";
import image2Asset from "@/assets/image-2.png.asset.json";

import { BranchesWithMap } from "@/components/BranchesWithMap";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";
import { Link } from "@tanstack/react-router";

export const HOME_HERO_IMAGE = asianFamilyHeroAsset.url;

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-brand-red text-[11px] font-bold tracking-[0.18em] uppercase">
      {children}
    </p>
  );
}

function SpecialtyMarquee() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [manual, setManual] = useState(false);

  const scrollBy = (dir: -1 | 1) => {
    setManual(true);
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <section className="py-5 sm:py-6">
      <div className="relative">
        <button
          type="button"
          aria-label="Прокрутить направления влево"
          onClick={() => scrollBy(-1)}
          className="bg-brand-white/90 border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-white absolute top-1/2 left-1 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Прокрутить направления вправо"
          onClick={() => scrollBy(1)}
          className="bg-brand-white/90 border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-white absolute top-1/2 right-1 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors"
        >
          <ChevronRight className="size-5" />
        </button>

        <div
          ref={scrollerRef}
          className="group marquee-mask no-scrollbar relative overflow-x-auto px-12 scroll-smooth"
        >
          <div className={`${manual ? "" : "marquee-track"} flex w-max gap-3 pr-3`}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-3 pr-3" aria-hidden={copy === 1}>
                {SPECIALTY_PILLS.map((name) => (
                  <Link
                    key={`${copy}-${name}`}
                    to="/napravleniya"
                    className="bg-brand-green text-brand-white hover:bg-brand-green-dark flex shrink-0 items-center justify-center rounded-full px-8 py-3.5 text-base font-extrabold whitespace-nowrap transition-colors"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function ReviewCard({
  review,
  className,
}: {
  review: { text: string; src: string };
  className?: string;
}) {
  return (
    <figure
      className={`bg-background border-border flex h-[200px] w-[320px] flex-col rounded-2xl border p-5 lg:w-[360px] ${className ?? ""}`}
    >
      <div className="text-brand-green flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="size-4 fill-current" />
        ))}
      </div>
      <blockquote className="text-foreground mt-3 line-clamp-4 text-[15px] leading-relaxed">
        {review.text}
      </blockquote>
      <figcaption className="text-muted-foreground mt-auto pt-3 text-[13px]">
        Источник: {review.src}
      </figcaption>
    </figure>
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

const OFFER_CARDS = [
  {
    tag: "Акция",
    tagTone: "bg-brand-red",
    title: "Сомнография",
    description: "Консультация + диагностика на сомнографе со скидкой",
    price: "3 700 с",
    oldPrice: "4 900 с",
    href: "/diagnostika",
    image: aboutHeroAsset.url,
    tone: "pastel-peach",
  },
  {
    tag: "Спецпредложение",
    tagTone: "bg-brand-green",
    title: "Счастливые часы",
    description: "Пройдите чекап утром и получите дополнительную скидку 10%",
    href: "/checkups",
    image: doctorPatientHeroAsset.url,
    tone: "pastel-mint",
  },
  {
    tag: "Новость",
    tagTone: "bg-foreground/60",
    title: "Услуги на дому",
    description: "Врач, анализы и процедуры без выезда в клинику",
    href: "/uslugi/analizy",
    image: image2Asset.url,
    tone: "pastel-sky",
  },
  {
    tag: "Спецпредложение",
    tagTone: "bg-brand-green",
    title: "Бесплатная консультация хирурга",
    description: "Разбор анализов и плана операции без оплаты приёма",
    href: "/hirurgiya",
    image: aboutMissionAsset.url,
    tone: "pastel-lavender",
  },
];

function OffersMarquee() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [manual, setManual] = useState(false);

  const scrollBy = (dir: -1 | 1) => {
    setManual(true);
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(300, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Прокрутить предложения влево"
        onClick={() => scrollBy(-1)}
        className="bg-brand-white/90 border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-white absolute top-1/2 left-1 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Прокрутить предложения вправо"
        onClick={() => scrollBy(1)}
        className="bg-brand-white/90 border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-white absolute top-1/2 right-1 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors"
      >
        <ChevronRight className="size-5" />
      </button>

      <div
        ref={scrollerRef}
        className="group marquee-mask no-scrollbar relative overflow-x-auto scroll-smooth px-12 py-1"
      >
        <div className={`${manual ? "" : "marquee-track"} flex w-max gap-4 pr-4`}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
              {OFFER_CARDS.map((item) => (
                <OfferCard key={`${copy}-${item.title}`} item={item} className="w-[300px]" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OfferCard({
  item,
  className,
}: {
  item: (typeof OFFER_CARDS)[number];
  className?: string;
}) {
  return (
    <Link
      to={item.href as "/"}
      className={`${item.tone} group border-border/40 flex shrink-0 flex-col overflow-hidden rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-lg ${className ?? ""}`}
    >
      <div className="relative h-[190px] w-full shrink-0 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className={`${item.tagTone} text-brand-white absolute top-4 left-4 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.12em] uppercase`}
        >
          {item.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-foreground text-lg font-extrabold">{item.title}</h3>
        <p className="text-muted-foreground mt-2 text-[14px] leading-snug">{item.description}</p>
        {item.price ? (
          <p className="mt-3 flex items-baseline gap-2">
            <span className="text-brand-green text-2xl font-extrabold">{item.price}</span>
            <span className="text-muted-foreground text-sm line-through">{item.oldPrice}</span>
          </p>
        ) : null}
        <span className="text-brand-green mt-auto inline-flex items-center gap-2 pt-4 text-[14px] font-extrabold transition-transform group-hover:translate-x-1">
          Подробнее
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}


export function HomeV3() {
  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <main>
        {/* Оффер */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
            {/* Большой баннер с фото на всю область */}
            <div className="border-border relative min-h-[460px] overflow-hidden rounded-3xl border sm:min-h-[420px]">
              <img
                src={asianFamilyHeroAsset.url}
                alt="Счастливая семья на фоне голубого неба"
                className="absolute inset-0 h-full w-full scale-110 object-cover object-[72%_bottom] sm:scale-100 sm:object-[right_center]"
                loading="eager"
                fetchPriority="high"
                width={1344}
                height={768}
              />
              <div className="from-brand-white/97 via-brand-white/80 absolute inset-0 bg-gradient-to-b to-transparent sm:bg-gradient-to-r sm:via-brand-white/70" />
              <div className="relative flex h-full max-w-[560px] flex-col justify-start p-6 sm:justify-center sm:p-10">
                <Eyebrow>Здоровье без лишней сложности</Eyebrow>
                <h1 className="text-foreground mt-4 text-3xl leading-[1.22] font-extrabold tracking-tight sm:text-[42px] sm:leading-[1.18]">
                  Проверьте здоровье сегодня — предотвратите{" "}
                  <span className="bg-brand-green text-brand-white rounded-lg px-2 py-1">
                    {"\n"}проблемы завтра
                  </span>
                </h1>
                <p className="text-muted-foreground mt-4 max-w-md text-[16px] leading-relaxed">
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

        {/* Зелёные блоки специальностей — бегущая строка */}
        <SpecialtyMarquee />



        {/* О клинике */}
        <Section id="o-klinike" eyebrow="" title="">
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
                  Подробнее о Авиценне{"\n"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
          </div>
        </Section>

        {/* Новости и специальные предложения */}
        <Section tone="soft" eyebrow="" title="Новости и специальные предложения">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Большая карточка — Сомнография */}
            <Reveal className="lg:row-span-2">
              <Link
                to={FEATURED_OFFER.href as "/"}
                className="group relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-7"
              >
                <img
                  src={FEATURED_OFFER.image}
                  alt={FEATURED_OFFER.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="from-brand-green/90 via-brand-green/70 absolute inset-0 bg-gradient-to-r to-transparent" />
                <div className="relative">
                  <span className="badge-gradient text-brand-white inline-block rounded-2xl px-5 py-2.5 text-2xl font-extrabold sm:text-3xl">
                    {FEATURED_OFFER.title}
                  </span>
                  <div className="badge-gradient-solid text-brand-white mt-5 w-full rounded-2xl p-5">
                    <p className="text-[17px] leading-snug font-bold">{FEATURED_OFFER.description}</p>
                    <p className="mt-3 flex items-baseline gap-3">
                      <span className="text-4xl font-extrabold">{FEATURED_OFFER.price}</span>
                      <span className="text-brand-white/70 text-lg line-through">
                        {FEATURED_OFFER.oldPrice}
                      </span>
                    </p>
                  </div>
                </div>
                <span className="bg-brand-white text-brand-green relative mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-[15px] font-extrabold transition-transform group-hover:translate-x-1">
                  Подробнее
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </Reveal>

            {/* Правые карточки */}
            {SIDE_OFFERS.map((item, index) => (
              <Reveal key={item.title} delay={index * 60} className="h-full">
                <Link
                  to={item.href as "/"}
                  className={`${item.tone} text-foreground group flex h-full min-h-[170px] items-stretch justify-between gap-4 overflow-hidden rounded-3xl border border-border/40 p-5 transition-all hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className="flex flex-1 flex-col">
                    <h3 className="w-full text-[17px] leading-snug font-extrabold sm:text-lg">
                      {item.title}
                    </h3>
                    <span className="bg-brand-white text-foreground mt-auto inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[14px] font-extrabold transition-transform group-hover:translate-x-1 shadow-sm">
                      Подробнее
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>

                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 shrink-0 rounded-2xl object-cover sm:w-28"
                    loading="lazy"
                  />
                </Link>
              </Reveal>
            ))}
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
          {/* Mobile: scrolling marquee */}
          <div className="group marquee-mask relative overflow-hidden md:hidden">
            <div className="marquee-track flex w-max gap-4">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 gap-4" aria-hidden={copy === 1}>
                  {REVIEWS.map((review) => (
                    <ReviewCard
                      review={review}
                      key={`mobile-${copy}-${review.text}`}
                      className="w-[280px]"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: scrolling marquee */}
          <div className="group marquee-mask relative hidden overflow-hidden md:block">
            <div className="marquee-track flex w-max gap-4">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 gap-4" aria-hidden={copy === 1}>
                  {REVIEWS.map((review) => (
                    <ReviewCard review={review} key={`${copy}-${review.text}`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Часто задаваемые вопросы */}
        <FaqAccordion />


      </main>
      <SiteFooter />
    </div>
  );
}

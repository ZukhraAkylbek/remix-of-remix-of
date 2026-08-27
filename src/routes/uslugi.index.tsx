import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, FlaskConical, MapPin, MessageCircle, Search } from "lucide-react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DiagnosticsIcon } from "@/components/DiagnosticsIcon";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";
import { servicePagesQueryOptions } from "@/lib/services.queries";

const TITLE = "Услуги клиники «Авиценна» в Бишкеке — полный список";
const DESCRIPTION =
  "Все услуги клиники «Авиценна»: диагностика, консультации специалистов, хирургия, анализы, стационар, услуги на дому, вакцинация, физиотерапия, рассрочка.";

export const Route = createFileRoute("/uslugi/")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(servicePagesQueryOptions());
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/uslugi") || "/uslugi" }],
  }),
  component: ServicesIndex,
});

const POPULAR = [
  {
    title: "МРТ диагностика",
    text: "Высокоточная диагностика на современном оборудовании",
    image: "/assets/svc-mrt.jpg",
  },
  {
    title: "УЗИ экспертного класса",
    text: "Опытные специалисты и точные результаты",
    image: "/assets/svc-uzi.jpg",
  },
  {
    title: "Анализы",
    text: "Более 1000 видов лабораторных исследований",
    image: "/assets/svc-analizy.jpg",
  },
  {
    title: "Приём врача",
    text: "Консультации специалистов по всем направлениям",
    image: "/assets/svc-priem.jpg",
  },
];

const PROMOS = [
  {
    tone: "pastel-mint",
    title: "410+",
    text: "медицинских услуг для вас и вашей семьи",
    image: "/assets/asian-family-hero.webp",
  },
  {
    tone: "pastel-rose",
    title: "Беременность",
    text: "Ведение беременности на всех этапах",
    image: "/assets/svc-pregnancy.jpg",
  },
  {
    tone: "pastel-sky",
    title: "Для всей семьи",
    text: "Забота о здоровье каждого члена семьи",
    image: "/assets/doctor-patient-hero.webp",
  },
];

const SHORTCUTS = [
  { icon: CalendarCheck, title: "Записаться на приём", text: "Онлайн запись 24/7", href: BOOKING_URL },
  { icon: MessageCircle, title: "Получить консультацию", text: "Ответим на ваши вопросы", href: BOOKING_URL },
  { icon: FlaskConical, title: "Результаты анализов", text: "Смотрите онлайн", href: BOOKING_URL },
  { icon: MapPin, title: "Адреса филиалов", text: "6 филиалов в Бишкеке", href: "/#filialy" },
];

function ServicesIndex() {
  const { data: services } = useSuspenseQuery(servicePagesQueryOptions());
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || (s.summary ?? "").toLowerCase().includes(q),
    );
  }, [services, query]);

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Услуги" />
      <Breadcrumbs items={[{ label: "Услуги" }]} />

      <main>
        {/* Хиро */}
        <section className="relative overflow-hidden">
          <div className="bg-surface-soft pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 rounded-bl-[120px] lg:block" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1fr] lg:py-14">
            <Reveal>
              <h1 className="text-foreground text-4xl leading-[1.1] font-extrabold sm:text-6xl">
                Услуги
              </h1>
              <p className="text-muted-foreground mt-4 max-w-md text-base leading-relaxed sm:text-lg">
                Более 410 медицинских услуг
                <br />
                для вас и вашей семьи
              </p>

              <div className="mt-7 flex max-w-xl items-center gap-2">
                <div className="border-border focus-within:border-brand-green relative flex-1 rounded-xl border bg-white transition-colors">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Найдите услугу, врача или исследование"
                    aria-label="Поиск по услугам"
                    className="text-foreground placeholder:text-muted-foreground w-full rounded-xl bg-transparent px-4 py-3.5 text-sm outline-none sm:text-base"
                  />
                </div>
                <span className="bg-brand-green grid size-12 shrink-0 place-items-center rounded-xl text-white transition-transform hover:scale-105">
                  <Search className="size-5" aria-hidden="true" />
                </span>
              </div>
            </Reveal>

            <Reveal delay={80} className="relative">
              <img
                src="/assets/doctor-patient-hero.webp"
                alt="Врач и пациент в клинике «Авиценна»"
                width={1024}
                height={768}
                className="h-56 w-full rounded-3xl object-cover sm:h-72 lg:h-[340px]"
              />
            </Reveal>
          </div>
        </section>

        {/* Весь спектр услуг */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-foreground text-xl font-extrabold sm:text-2xl">Весь спектр услуг</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((service, index) => (
                <Reveal key={service.slug} delay={index * 30}>
                  <Link
                    to="/uslugi/$slug"
                    params={{ slug: service.slug }}
                    className="border-border hover:border-brand-green group flex h-full items-start gap-3 rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <DiagnosticsIcon
                      icon={service.icon}
                      title={service.title}
                      className="size-11 transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="min-w-0">
                      <span className="text-foreground block text-[15px] leading-snug font-bold">
                        {service.title}
                      </span>
                      {service.summary && (
                        <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                          {service.summary}
                        </span>
                      )}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-muted-foreground mt-8">Ничего не найдено — уточните запрос.</p>
            )}
          </div>
        </section>

        {/* Популярные услуги */}
        <section className="py-6 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-foreground text-xl font-extrabold sm:text-2xl">Популярные услуги</h2>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {POPULAR.map((item, index) => (
                  <Reveal key={item.title} delay={index * 60}>
                    <article className="bg-surface-soft group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="p-4 pb-0">
                        <h3 className="text-foreground text-[15px] font-bold">{item.title}</h3>
                        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                          {item.text}
                        </p>
                        <span className="text-brand-green mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                          Подробнее
                          <ArrowRight
                            className="size-3.5 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <img
                        src={item.image}
                        alt={item.title}
                        width={1024}
                        height={768}
                        loading="lazy"
                        className="mt-4 h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </article>
                  </Reveal>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {PROMOS.map((promo, index) => (
                  <Reveal key={promo.title} delay={index * 70}>
                    <article
                      className={`${promo.tone} group flex h-full flex-col overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                    >
                      <h3 className="text-foreground text-lg leading-tight font-extrabold">
                        {promo.title}
                      </h3>
                      <p className="text-foreground/70 mt-1 text-xs leading-relaxed">{promo.text}</p>
                      <img
                        src={promo.image}
                        alt={promo.title}
                        width={900}
                        height={1024}
                        loading="lazy"
                        className="mt-4 h-32 w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Быстрые действия */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SHORTCUTS.map((item, index) => (
                <Reveal key={item.title} delay={index * 50}>
                  <a
                    href={item.href}
                    className="border-border hover:border-brand-green group flex h-full items-start gap-3 rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="bg-surface-soft text-brand-green grid size-11 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110">
                      <item.icon className="size-5" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="text-foreground block text-[15px] font-bold">
                        {item.title}
                      </span>
                      <span className="text-muted-foreground mt-1 block text-xs">{item.text}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <FaqAccordion />
      </main>

      <SiteFooter />
    </div>
  );
}

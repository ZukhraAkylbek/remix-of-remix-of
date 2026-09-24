import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Phone,
  Plus,
  Stethoscope,
  UserRound,
  Users,
  Microscope,
  ShieldCheck,
  Clock,
  Activity,
  Building2,
  CalendarDays,
  ClipboardCheck,
  MapPin,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { CLINIC, absoluteUrl, faqPageJsonLd } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";
import { CLINIC_DOCTORS, DOCTOR_CATEGORIES, experienceLabel, type ClinicDoctor } from "@/lib/clinic-doctors";
import teamPhotoAsset from "@/assets/vrachi-team.jpg.asset.json";

const teamPhoto = teamPhotoAsset.url;

const TITLE = "Врачи клиники «Авиценна» в Бишкеке — специалисты и запись | Авиценна";
const DESCRIPTION =
  "Более 100 врачей клиники «Авиценна» в Бишкеке: терапевты, хирурги, гинекологи, кардиологи, неврологи и другие специалисты. Запись онлайн 24/7.";

const BENEFITS: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Users, title: "Более 100 врачей", text: "Специалисты разных направлений для взрослых и детей." },
  { icon: Stethoscope, title: "Комплексный подход", text: "Консультация, обследование и лечение в одной клинике." },
  { icon: Microscope, title: "Точная диагностика", text: "Лабораторные и инструментальные исследования на месте." },
  { icon: Clock, title: "Онлайн-запись 24/7", text: "Запишитесь на приём в удобное время через сайт." },
  { icon: ClipboardCheck, title: "Процедурный кабинет", text: "Лечебные процедуры по назначению врача." },
  { icon: Activity, title: "Травматолог 24/7", text: "Экстренная помощь при травмах в любое время." },
  { icon: ShieldCheck, title: "Круглосуточный рентген", text: "Лучевая диагностика доступна круглосуточно." },
  { icon: MapPin, title: "Удобное расположение", text: "Клиника в центральной части Бишкека." },
];

const FAQ_ITEMS: Array<{ title: string; text?: string }> = [
  { title: "Как записаться на приём к врачу?", text: "Оставьте заявку через сайт или позвоните в регистратуру — администратор подберёт удобное время и специалиста." },
  { title: "Нужна ли предварительная запись?", text: "Запись рекомендуется, особенно к узким специалистам. На приём к терапевту возможна запись в день обращения при наличии свободных слотов." },
  { title: "Можно ли получить консультацию онлайн?", text: "Онлайн-консультации доступны для отдельных специалистов. Уточните возможность дистанционного приёма у администратора." },
  { title: "Как подготовиться к приёму?", text: "Возьмите паспорт, результаты предыдущих обследований и список принимаемых препаратов. Для некоторых специалистов нужна специальная подготовка — уточните при записи." },
  { title: "Есть ли травмпункт и рентген 24/7?", text: "Да, травмпункт и рентген-кабинет работают круглосуточно, без выходных." },
  { title: "Принимают ли врачи детей?", text: "Да, в клинике ведут приём педиатры и узкие детские специалисты." },
];

export const Route = createFileRoute("/vrachi/")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/vrachi") || "/vrachi" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/vrachi") || "/vrachi" }],
  }),
  errorComponent: () => (
    <Shell>
      <h1 className="text-3xl font-extrabold">Не удалось загрузить страницу</h1>
    </Shell>
  ),
  notFoundComponent: () => (
    <Shell>
      <h1 className="text-3xl font-extrabold">Страница не найдена</h1>
    </Shell>
  ),
  component: DoctorsPage,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-about-canvas min-h-screen">
      <SiteHeader breadcrumb="Врачи" />
      <Breadcrumbs items={[{ label: "Врачи" }]} />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}

function PageHeading({ title, description }: { title: React.ReactNode; description?: string }) {
  return (
    <div>
      <h2 className="text-about-ink text-3xl leading-tight font-extrabold sm:text-4xl">{title}</h2>
      {description && <p className="text-about-copy mt-3 max-w-2xl text-base">{description}</p>}
    </div>
  );
}

function FaqList({ items }: { items: { title: string; text?: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <dl className="grid items-start gap-3 lg:grid-cols-2">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.title} className="border-about-line bg-about-canvas rounded-2xl border">
            <dt>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <span className="text-about-ink text-base font-semibold">{item.title}</span>
                <Plus
                  className={`text-about-teal size-5 shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </dt>
            {isOpen && item.text && (
              <dd className="text-about-copy border-about-line border-t p-4 text-sm leading-relaxed">
                {item.text}
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}

const DOCTORS_PER_PAGE = 6;

function DoctorsDirectory({ doctors, initialCategory }: { doctors: ClinicDoctor[]; initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(() =>
    initialCategory && DOCTOR_CATEGORIES.some((item) => item.slug === initialCategory)
      ? initialCategory
      : "all",
  );
  const [page, setPage] = useState(0);
  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru");
    return doctors.filter((doctor) => {
      const matchesCategory = category === "all" || doctor.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${doctor.name} ${doctor.specialty}`.toLocaleLowerCase("ru").includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, doctors, query]);
  const pageCount = Math.max(1, Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE));
  const safePage = Math.min(page, pageCount - 1);
  const visibleDoctors = filteredDoctors.slice(
    safePage * DOCTORS_PER_PAGE,
    (safePage + 1) * DOCTORS_PER_PAGE,
  );

  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(0);
  };

  const changeCategory = (value: string) => {
    setCategory(value);
    setPage(0);
  };

  return (
    <div className="mt-6">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.62fr)_auto] md:items-center">
        <label className="border-about-line bg-about-canvas focus-within:border-about-teal flex h-11 items-center gap-3 rounded-xl border px-4">
          <Search className="text-about-teal size-5 shrink-0" aria-hidden="true" />
          <span className="sr-only">Поиск врача</span>
          <input
            type="search"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Поиск врача, специальности..."
            className="text-about-ink placeholder:text-about-copy min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
        <label className="border-about-line bg-about-canvas focus-within:border-about-teal flex h-11 items-center gap-3 rounded-xl border px-4">
          <Stethoscope className="text-about-teal size-5 shrink-0" aria-hidden="true" />
          <span className="sr-only">Выберите специальность</span>
          <select
            value={category}
            onChange={(event) => changeCategory(event.target.value)}
            className="text-about-ink min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
          >
            <option value="all">Все специальности</option>
            {DOCTOR_CATEGORIES.filter((item) => doctors.some((doctor) => doctor.category === item.slug)).map((item) => (
              <option key={item.slug} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </label>
        <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Предыдущая страница врачей"
          disabled={safePage === 0}
          onClick={() => setPage((current) => Math.max(0, current - 1))}
          className="border-about-line text-about-teal rounded-full bg-about-canvas shadow-none"
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Следующая страница врачей"
          disabled={safePage >= pageCount - 1}
          onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
          className="border-about-line text-about-teal rounded-full bg-about-canvas shadow-none"
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
      </div>
      {visibleDoctors.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleDoctors.map((doctor) => (
          <article
            key={doctor.slug}
            className="border-about-line bg-about-canvas flex min-w-0 flex-col rounded-2xl border p-4"
          >
            {doctor.photo ? (
              <img
                src={doctor.photo}
                alt={doctor.name}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl object-cover object-top"
              />
            ) : (
              <span className="bg-about-icon text-about-teal grid aspect-[4/3] w-full place-items-center rounded-xl">
                <UserRound className="size-16" aria-hidden="true" />
              </span>
            )}
            <h3 className="text-about-ink mt-4 text-lg leading-snug font-bold">{doctor.name}</h3>
            <p className="bg-about-icon text-about-teal mt-3 w-fit rounded-full px-3 py-1 text-[13px] font-semibold">
              {doctor.specialty}
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-about-copy flex items-center gap-2 text-[13px] sm:text-sm">
                <Building2 className="text-about-teal size-4 shrink-0" aria-hidden="true" />
                {doctor.branch}
              </p>
              {doctor.experience != null && (
                <p className="text-about-copy flex items-center gap-2 text-[13px] sm:text-sm">
                  <CalendarDays className="text-about-teal size-4 shrink-0" aria-hidden="true" />
                  Стаж: {experienceLabel(doctor.experience)}
                </p>
              )}
            </div>
            <Button
              asChild
              variant="outline"
              className="border-about-teal text-about-ink mt-4 w-full bg-transparent shadow-none"
            >
              <Link to="/vrachi/$slug" params={{ slug: doctor.slug }}>
                Подробнее <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </article>
        ))}
        </div>
      ) : (
        <div className="border-about-line text-about-copy mt-6 rounded-2xl border p-6 text-center text-sm">
          По вашему запросу врачи не найдены.
        </div>
      )}
      {filteredDoctors.length > 0 && (
        <p className="text-about-copy mt-4 text-center text-[13px]">
          {safePage + 1} из {pageCount}
        </p>
      )}
    </div>
  );
}

function DoctorsPage() {
  const { category } = Route.useSearch();
  const heroImage = teamPhoto;
  const faqItems = FAQ_ITEMS;

  return (
    <div className="bg-about-canvas min-h-screen">
      <SiteHeader breadcrumb="Врачи" />
      <Breadcrumbs items={[{ label: "Врачи" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqPageJsonLd(faqItems.map((item) => ({ question: item.title, answer: item.text ?? "" }))),
          ),
        }}
      />

      <main>
        {/* Hero */}
        <section className="bg-about-mint">
          <div className="mx-auto grid max-w-7xl overflow-hidden px-4 py-4 sm:px-6 sm:py-6 lg:h-[380px] lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:py-8">
            <Reveal className="flex flex-col justify-center lg:pr-10">
              <p className="text-about-teal text-sm font-semibold">Поликлиника</p>
              <h1 className="text-about-ink mt-2 max-w-2xl text-3xl leading-[1.08] font-extrabold sm:text-4xl lg:text-5xl">
                Наши врачи
              </h1>
              <p className="text-about-copy mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
                Опытные специалисты «Авиценны» — терапевты, хирурги, кардиологи, гинекологи,
                неврологи и другие врачи для взрослых и детей. Подберём врача и удобное время.
              </p>
              <div className="mt-4 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <span className="bg-about-icon text-about-teal grid size-8 shrink-0 place-items-center rounded-full sm:size-9">
                    <Users className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-about-ink text-[11px] font-bold leading-snug sm:text-sm">
                    100+ врачей
                  </span>
                </div>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <span className="bg-about-icon text-about-teal grid size-8 shrink-0 place-items-center rounded-full sm:size-9">
                    <Microscope className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-about-ink text-[11px] font-bold leading-snug sm:text-sm">
                    Полная диагностика
                  </span>
                </div>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <span className="bg-about-icon text-about-teal grid size-8 shrink-0 place-items-center rounded-full sm:size-9">
                    <Clock className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-about-ink text-[11px] font-bold leading-snug sm:text-sm">
                    Запись 24/7
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                <Button
                  asChild
                  className="bg-brand-green text-brand-white hover:bg-brand-green-dark px-3 text-xs shadow-none sm:px-4 sm:text-sm"
                >
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                    Записаться на приём
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-about-line text-about-ink bg-about-canvas px-3 text-xs shadow-none sm:px-4 sm:text-sm"
                >
                  <a href="#vrachi">Все специалисты</a>
                </Button>
              </div>
            </Reveal>
            <div className="relative mt-6 hidden h-60 overflow-hidden rounded-2xl lg:mt-0 lg:block lg:h-full">
              <img
                src={heroImage}
                alt="Врачи клиники «Авиценна»"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="from-about-mint/30 absolute inset-0 bg-gradient-to-r to-transparent" />
              <div className="bg-about-canvas/95 absolute right-0 bottom-0 grid grid-cols-2 gap-6 rounded-tl-2xl p-4 backdrop-blur-sm">
                <div>
                  <strong className="text-about-ink block text-2xl">100+</strong>
                  <span className="text-about-copy text-xs">врачей</span>
                </div>
                <div>
                  <strong className="text-about-ink block text-2xl">26</strong>
                  <span className="text-about-copy text-xs">специальностей</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors carousel */}
        <section id="vrachi" className="bg-about-canvas py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <PageHeading
              title="Наши врачи"
              description="Подберите специалиста по направлению и запишитесь на приём онлайн."
            />
            <DoctorsDirectory doctors={CLINIC_DOCTORS} initialCategory={category} />
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-about-mint py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <PageHeading title="Наши возможности" description="Всё для диагностики и лечения в одной клинике." />
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map((item, index) => (
                <Reveal key={item.title} delay={index * 35}>
                  <div className="border-about-line bg-about-canvas flex h-full flex-col items-center rounded-2xl border p-4 text-center">
                    <span className="bg-about-icon text-about-teal grid size-11 place-items-center rounded-full">
                      <item.icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-about-ink mt-3 text-base font-bold">{item.title}</h3>
                    <p className="text-about-copy mt-1 text-sm leading-snug">{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="bg-about-canvas py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="border-about-line bg-about-mint flex flex-wrap items-center gap-5 rounded-2xl border p-4">
              <span className="bg-about-icon text-about-teal grid size-11 shrink-0 place-items-center rounded-full text-xl font-bold">
                ?
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-about-ink text-lg font-bold">Не знаете, к какому врачу обратиться?</h2>
                <p className="text-about-copy mt-1 text-sm">
                  Позвоните нам — поможем подобрать специалиста. Запись доступна 24/7.
                </p>
              </div>
              <Button
                asChild
                className="bg-brand-green text-brand-white hover:bg-brand-green-dark shadow-none"
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Записаться
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-about-mint py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <PageHeading title="Часто задаваемые вопросы" />
            <div className="mt-7">
              <FaqList items={faqItems} />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-about-mint py-10 sm:py-12">
          <div className="mx-auto grid max-w-7xl overflow-hidden px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="flex flex-col justify-center py-6 lg:pr-10">
              <h2 className="text-about-ink text-3xl font-extrabold sm:text-4xl">Забота о вас и вашей семье</h2>
              <p className="text-about-copy mt-3 max-w-xl text-base leading-relaxed">
                Запишитесь на приём к специалисту «Авиценны» — врач оценит состояние, ответит на
                вопросы и предложит понятный план действий.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-brand-green text-brand-white hover:bg-brand-green-dark shadow-none"
                >
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                    Записаться на приём
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-about-line text-about-ink bg-about-canvas shadow-none"
                >
                  <a href={`tel:${CLINIC.phones[0]}`}>
                    <Phone className="size-4" aria-hidden="true" /> {CLINIC.phones[0]}
                  </a>
                </Button>
              </div>
            </div>
            <img
              src={heroImage}
              alt="Консультация врача в клинике «Авиценна»"
              loading="lazy"
              className="h-60 w-full rounded-2xl object-cover"
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

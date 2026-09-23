import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  Check,
  ClipboardPlus,
  FlaskConical,
  HeartPulse,
  MapPin,
  Microscope,
  MonitorCheck,
  Plus,
  ScanLine,
  Stethoscope,
  Syringe,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import doctorPatientHeroAsset from "@/assets/doctor-patient-hero.jpg.asset.json";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";
import { specialtiesQueryOptions } from "@/lib/specialties.queries";

const TITLE = "Поликлиника в Бишкеке — специалисты и диагностика | Авиценна";
const DESCRIPTION =
  "Поликлиника «Авиценна» в Бишкеке: консультации более 100 врачей, лабораторные исследования, УЗИ, КТ, рентген и онлайн-запись 24/7.";

const SPECIALTY_ICONS: LucideIcon[] = [
  Stethoscope,
  HeartPulse,
  Activity,
  UserRound,
  Microscope,
  ClipboardPlus,
];

const BENEFIT_ROWS = [
  [
    { icon: Users, title: "Более 100 врачей" },
    { icon: ScanLine, title: "Полная диагностика", text: "Лаборатория, КТ, МРТ, рентген" },
    { icon: CalendarCheck, title: "Онлайн-запись 24/7" },
    { icon: Syringe, title: "Процедурный кабинет" },
  ],
  [
    { icon: Activity, title: "Травматолог 24/7" },
    { icon: ScanLine, title: "Круглосуточный рентген" },
    { icon: ClipboardPlus, title: "Клинический подход" },
    { icon: MonitorCheck, title: "Современное оборудование" },
    { icon: MapPin, title: "Удобное расположение" },
  ],
] satisfies Array<Array<{ icon: LucideIcon; title: string; text?: string }>>;

const DIAGNOSTICS = [
  { icon: FlaskConical, title: "Лабораторные исследования" },
  { icon: ScanLine, title: "УЗИ, КТ, рентген" },
  { icon: Microscope, title: "Эндоскопические исследования", text: "ЭГДС, колоноскопия, в том числе под наркозом" },
  { icon: Activity, title: "Функциональная диагностика" },
] satisfies Array<{ icon: LucideIcon; title: string; text?: string }>;

export const Route = createFileRoute("/napravleniya/")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(specialtiesQueryOptions());
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/napravleniya") || "/napravleniya" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/napravleniya") || "/napravleniya" }],
  }),
  component: PolyclinicPage,
});

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-about-ink text-3xl leading-tight font-extrabold sm:text-4xl">{children}</h2>;
}

function PolyclinicPage() {
  const { data: specialtyData } = useSuspenseQuery(specialtiesQueryOptions());
  const specialties = Array.from(
    new Map(specialtyData.map((item) => [item.slug, item])).values(),
  );

  return (
    <div className="bg-about-canvas min-h-screen">
      <SiteHeader breadcrumb="Поликлиника" />
      <Breadcrumbs items={[{ label: "Поликлиника" }]} />
      <main>
        <section className="bg-about-mint">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:h-[380px] lg:grid-cols-[1.12fr_0.88fr]">
            <Reveal className="flex flex-col justify-center lg:pr-8">
              <p className="text-about-teal text-sm font-semibold">Поликлиника</p>
              <h1 className="text-about-ink mt-2 text-4xl leading-[1.08] font-extrabold sm:text-5xl">Поликлиника в Бишкеке</h1>
              <p className="text-about-copy mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
                Современный многопрофильный медицинский центр, где вы сможете получить консультации врача, пройти диагностику, сдать анализы и начать лечение в одном месте.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="bg-brand-green text-brand-white hover:bg-brand-green-dark shadow-none"><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Записаться на приём</a></Button>
                <Button asChild variant="outline" className="border-about-line text-about-ink bg-about-canvas shadow-none"><a href="#specialists">Узнать больше</a></Button>
              </div>
            </Reveal>
            <div className="relative hidden overflow-hidden rounded-2xl lg:block">
              <img src={doctorPatientHeroAsset.url} alt="Консультация врача в поликлинике «Авиценна»" className="absolute inset-0 size-full object-cover" />
              <div className="from-about-mint/30 absolute inset-0 bg-gradient-to-r to-transparent" />
              <div className="bg-about-canvas/95 text-about-ink absolute right-0 bottom-0 space-y-2 rounded-tl-2xl p-4 text-sm backdrop-blur-sm">
                {[
                  "Более 100 врачей",
                  "Полный диагностический и лечебный спектр",
                  "Онлайн-запись 24/7",
                ].map((item) => <p key={item} className="flex items-center gap-2 font-semibold"><Check className="text-about-teal size-4 shrink-0" />{item}</p>)}
              </div>
            </div>
          </div>
        </section>

        <section id="specialists" className="bg-about-canvas py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle>Какие специалисты ведут приём</SectionTitle>
              <Link to="/napravleniya" className="text-about-teal inline-flex items-center gap-2 text-sm font-bold">Все специалисты <ArrowRight className="size-4" /></Link>
            </div>
            <div className="mt-7 grid gap-5 lg:grid-cols-[0.68fr_1.32fr]">
              <img src="/assets/checkup-doctors.jpg" alt="Врачи поликлиники «Авиценна»" loading="lazy" className="hidden h-full max-h-[440px] w-full rounded-2xl object-cover lg:block" />
              <div className="grid gap-3 sm:grid-cols-2">
                {specialties.map((item, index) => {
                  const Icon = SPECIALTY_ICONS[index % SPECIALTY_ICONS.length] ?? Stethoscope;
                  return (
                    <Link key={item.slug} to="/napravleniya/$slug" params={{ slug: item.slug }} className="border-about-line hover:border-about-teal group flex items-center gap-3 rounded-2xl border p-4 transition-colors">
                      <span className="bg-about-icon text-about-teal grid size-10 shrink-0 place-items-center rounded-full"><Icon className="size-5" aria-hidden="true" /></span>
                      <span className="text-about-ink min-w-0 flex-1 font-bold">{item.name}</span>
                      <Plus className="text-about-teal size-5 shrink-0 transition-transform group-hover:rotate-90" aria-hidden="true" />
                    </Link>
                  );
                })}
                <Link to="/napravleniya" className="border-about-line hover:border-about-teal group flex items-center gap-3 rounded-2xl border p-4 transition-colors">
                  <span className="bg-about-icon text-about-teal grid size-10 shrink-0 place-items-center rounded-full"><Users className="size-5" /></span>
                  <span className="text-about-ink min-w-0 flex-1 font-bold">Другие специалисты</span>
                  <Plus className="text-about-teal size-5 shrink-0 transition-transform group-hover:rotate-90" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-about-mint py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle>Почему пациенты выбирают «Авиценну»</SectionTitle>
            <div className="mt-7 space-y-3">
              {BENEFIT_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className={`grid gap-3 sm:grid-cols-2 ${rowIndex === 0 ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
                  {row.map(({ icon: Icon, title, text }) => (
                    <article key={title} className="border-about-line bg-about-canvas rounded-2xl border p-4 text-center">
                      <span className="bg-about-icon text-about-teal mx-auto grid size-11 place-items-center rounded-full"><Icon className="size-5" aria-hidden="true" /></span>
                      <h3 className="text-about-ink mt-3 text-sm font-bold">{title}</h3>
                      {text && <p className="text-about-copy mt-1 text-xs leading-relaxed">{text}</p>}
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-about-canvas py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle>Современная диагностика</SectionTitle>
            <div className="mt-7 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <img src="/assets/uslugi-hero.jpg" alt="Современная диагностика в клинике «Авиценна»" loading="lazy" className="h-60 w-full rounded-2xl object-cover" />
              <div className="grid gap-3 sm:grid-cols-2">
                {DIAGNOSTICS.map(({ icon: Icon, title, text }) => (
                  <article key={title} className="border-about-line flex items-start gap-3 rounded-2xl border p-4">
                    <span className="bg-about-icon text-about-teal grid size-10 shrink-0 place-items-center rounded-full"><Icon className="size-5" /></span>
                    <div><h3 className="text-about-ink text-sm font-bold">{title}</h3>{text && <p className="text-about-copy mt-1 text-xs leading-relaxed">{text}</p>}</div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-about-mint py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="border-about-line flex flex-col items-start gap-5 rounded-2xl border p-4 sm:flex-row sm:items-center">
              <span className="bg-about-icon text-about-teal grid size-12 shrink-0 place-items-center rounded-full"><Stethoscope className="size-6" /></span>
              <div className="min-w-0 flex-1">
                <h2 className="text-about-ink text-2xl font-extrabold">Не знаете, к какому специалисту обратиться?</h2>
                <p className="text-about-copy mt-2 text-sm">Администратор уточнит ваши симптомы и поможет выбрать подходящего врача и удобное время.</p>
              </div>
              <Button asChild className="bg-brand-green text-brand-white hover:bg-brand-green-dark shrink-0 shadow-none"><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Записаться на приём</a></Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
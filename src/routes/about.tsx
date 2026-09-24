import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Award,
  Bed,
  Building2,
  CalendarDays,
  FlaskConical,
  HeartHandshake,
  Microscope,
  Scissors,
  ShieldCheck,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

import clinicExterior from "@/assets/about-clinic-exterior.jpg";
import founderPortrait from "@/assets/founder-zhypar.png.asset.json";
import receptionPhoto from "@/assets/about-reception.jpg";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl } from "@/lib/clinic";

const FOUNDER_PORTRAIT_URL = `https://id-preview--29c8f5d6-b06d-4850-bda0-ed59691d16a4.lovable.app${founderPortrait.url}`;

const STORY = [
  {
    icon: CalendarDays,
    title: "2000 год",
    text: "Открыт первый медицинский центр «Авиценна» в Бишкеке.",
  },
  {
    icon: Building2,
    title: "2005 год",
    text: "Основан «Кокомерен» — второй филиал сети медицинских центров.",
  },
  {
    icon: Users,
    title: "100+",
    text: "Высококвалифицированных специалистов.",
  },
  {
    icon: Bed,
    title: "Круглосуточный терапевтический стационар",
    text: "В том числе палаты интенсивной терапии.",
  },
  {
    icon: FlaskConical,
    title: "Собственная лаборатория «Экспресс Плюс»",
    text: "Современные методы диагностики.",
  },
  {
    icon: Scissors,
    title: "Хирургическое отделение",
    text: "Современные методики и опытные специалисты.",
  },
] satisfies Array<{ icon: LucideIcon; title: string; text: string }>;

const ADVANTAGES = [
  {
    icon: Stethoscope,
    title: "Более 100 специалистов",
    text: "Врачи различных специальностей.",
  },
  {
    icon: HeartHandshake,
    title: "Круглосуточный терапевтический стационар",
    text: "Комфортные условия для лечения и наблюдения.",
  },
  {
    icon: ShieldCheck,
    title: "Хирургическое отделение",
    text: "Современные методики и опытные специалисты.",
  },
  {
    icon: Microscope,
    title: "Собственная лаборатория Экспресс Плюс",
    text: "Быстрая и точная диагностика.",
  },
  {
    icon: Activity,
    title: "Медицинские чекапы",
    text: "Комплексные обследования для вашего здоровья.",
  },
] satisfies Array<{ icon: LucideIcon; title: string; text: string }>;

export const Route = createFileRoute("/about")({
  head: () => {
    const title = "О клинике «Авиценна» — заботимся о здоровье с 2000 года";
    const description =
      "История, миссия и преимущества сети клиник «Авиценна» в Бишкеке: более 100 специалистов, стационар, хирургия и собственная лаборатория.";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: absoluteUrl("/about") || "/about" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: absoluteUrl("/about") || "/about" }],
    };
  },
  component: AboutPage,
});

function LeafOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M17 87C55 65 86 39 119 10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M45 68C30 55 27 40 31 25c14 8 21 22 14 43Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M69 51C62 34 67 19 79 7c9 15 5 31-10 44Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M85 40c16-6 31-2 43 10-15 10-30 6-43-10Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M105 22c14-7 28-6 41 3-12 11-27 10-41-3Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-about-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-[2.75rem]">
      {children}
    </h2>
  );
}

function AboutPage() {
  return (
    <div className="bg-about-canvas min-h-screen">
      <SiteHeader breadcrumb="О нас" />
      <Breadcrumbs items={[{ label: "О нас" }]} />

      <main>
        <section className="bg-about-mint relative isolate min-h-[440px] overflow-hidden lg:min-h-[460px]">
          <div className="absolute inset-x-0 bottom-0 h-[55%] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[57%]">
            <img
              src={clinicExterior}
              alt="Современное здание медицинской клиники среди деревьев"
              width={1600}
              height={1200}
              fetchPriority="high"
              className="size-full object-cover object-center"
            />
            <div className="from-about-mint absolute inset-0 bg-gradient-to-b from-15% via-about-mint/30 to-transparent lg:bg-gradient-to-r lg:from-0% lg:via-about-mint/40 lg:to-transparent" />
          </div>

          <div className="relative mx-auto flex min-h-[440px] max-w-7xl items-start px-4 pt-10 sm:px-6 sm:pt-12 lg:min-h-[460px] lg:items-center lg:pt-0">
            <Reveal className="relative z-10 max-w-2xl pb-56 lg:pb-0">
              <p className="font-serif-editorial text-about-ink text-4xl leading-[1.13] italic sm:text-5xl lg:text-[3.2rem]">
                Мы заботимся о Вас
                <br />с 2000 года
              </p>
              <h1 className="font-serif-editorial text-about-ink mt-3 text-2xl leading-tight font-normal italic sm:text-3xl lg:text-[2.25rem]">
                Биринчи байлык – ден соолук
              </h1>
              <p className="text-about-copy mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
                Современная многопрофильная медицинская сеть, которая объединяет опыт,
                профессионализм и заботу о каждом пациенте.
              </p>
            </Reveal>
          </div>

          <LeafOrnament className="text-about-ornament absolute bottom-3 left-3 z-10 w-32 opacity-60 sm:left-8 sm:w-40 lg:bottom-8" />
        </section>

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle>Как создавалась «Авиценна»</SectionTitle>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
              {STORY.map(({ icon: Icon, title, text }, index) => (
                <Reveal key={title} delay={index * 35} className="h-full">
                  <article className="border-about-line bg-card flex h-full min-h-40 flex-col rounded-2xl border p-4">
                    <span className="bg-about-icon text-about-teal grid size-10 shrink-0 place-items-center rounded-full">
                      <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <h3 className="text-about-ink mt-4 text-base leading-snug font-bold break-words">
                      {title}
                    </h3>
                    <p className="text-about-copy mt-1.5 text-sm leading-relaxed break-words hyphens-auto">
                      {text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-10 sm:pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal>
              <article className="border-about-line bg-card overflow-hidden rounded-2xl border lg:grid lg:grid-cols-[0.85fr_1.35fr]">
                <div className="bg-about-mint min-h-64 overflow-hidden rounded-b-[48%] lg:min-h-[380px] lg:rounded-r-[48%] lg:rounded-b-none">
                  <img
                    src={FOUNDER_PORTRAIT_URL}
                    alt="Керималиева Жыпар Абдыказиевна — основательница сети клиник «Авиценна»"
                    width={973}
                    height={1298}
                    loading="lazy"
                    className="size-full object-cover object-top"
                  />
                </div>

                <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.9fr_auto_1.1fr] lg:items-center lg:p-12">
                  <div>
                    <Award className="text-about-teal size-8" strokeWidth={1.5} aria-hidden="true" />
                    <h2 className="font-serif-editorial text-about-ink mt-5 text-4xl leading-tight font-normal italic sm:text-5xl">
                      «Главное — ден соолук!»
                    </h2>
                    <p className="text-about-ink mt-8 text-lg font-bold">
                      Керималиева Жыпар Абдыказиевна
                    </p>
                    <p className="text-about-copy mt-2 text-sm leading-relaxed">
                      Основательница сети клиник «Авиценна»
                    </p>
                  </div>

                  <div className="bg-about-line h-px w-full lg:h-full lg:min-h-72 lg:w-px" />

                  <div>
                    <p className="text-about-ink text-lg leading-relaxed sm:text-xl">
                      С самого начала нашей работы мы руководствовались простой и важной целью —
                      сделать качественную медицинскую помощь доступной для каждого человека.
                    </p>
                    <div className="mt-9 flex items-end gap-4">
                      <span className="bg-about-icon text-about-teal grid size-12 shrink-0 place-items-center rounded-full">
                        <HeartHandshake className="size-6" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span className="border-about-line text-about-copy flex-1 border-b pb-2 text-sm italic">
                        С заботой о вашем здоровье
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="bg-about-mint py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle>Наши преимущества</SectionTitle>
            <div className="mt-9 grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ADVANTAGES.map(({ icon: Icon, title, text }, index) => (
                <Reveal key={title} delay={index * 35} className="h-full">
                  <article className="border-about-line bg-card flex h-full gap-4 rounded-2xl border p-5 sm:p-6">
                    <span className="bg-about-icon text-about-teal grid size-12 shrink-0 place-items-center rounded-full">
                      <Icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-about-ink text-lg leading-snug font-bold">{title}</h3>
                      <p className="text-about-copy mt-2 text-sm leading-relaxed sm:text-base">{text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal>
              <article className="border-about-line bg-card overflow-hidden rounded-2xl border lg:grid lg:grid-cols-[1fr_1.02fr]">
                <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
                  <SectionTitle>Наша миссия</SectionTitle>
                  <p className="text-about-ink mt-7 text-lg leading-relaxed sm:text-xl">
                    Мы создаем современную систему медицинской помощи, где пациент получает
                    качественное и доступное лечение, а забота о его здоровье становится
                    приоритетом.
                  </p>
                  <div className="my-7 flex items-center gap-4">
                    <span className="bg-about-line h-px flex-1" />
                    <LeafOrnament className="text-about-ornament w-24" />
                    <span className="bg-about-line h-px flex-1" />
                  </div>
                  <p className="text-about-copy text-base leading-relaxed sm:text-lg">
                    Мы стремимся к тому, чтобы каждый человек в нашей стране мог получить
                    квалифицированную медицинскую помощь, основанную на современных технологиях,
                    опыте наших специалистов и внимательном отношении.
                  </p>
                </div>

                <div className="min-h-80 overflow-hidden rounded-t-[42%] lg:min-h-[570px] lg:rounded-t-none lg:rounded-l-[42%]">
                  <img
                    src={receptionPhoto}
                    alt="Светлая современная зона регистрации клиники с растениями"
                    width={1600}
                    height={1200}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
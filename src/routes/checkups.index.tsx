import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronRight,
  ClipboardList,
  Clock,
  FlaskConical,
  Heart,
  Sparkles,
  Users,
} from "lucide-react";

import asianFamilyHeroAsset from "@/assets/asian-family-hero.png.asset.json";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl } from "@/lib/clinic";
import { checkupPageQueryOptions } from "@/lib/checkups.queries";
import { BOOKING_URL } from "@/lib/site-config";

const TITLE = "Чекапы для вашего здоровья | Авиценна";
const DESCRIPTION =
  "Чекапы в клинике «Авиценна» в Бишкеке: оптимальные, расширенные и базовые программы обследования для женщин, мужчин и детей, а также дополнительные лабораторные пакеты.";

export const Route = createFileRoute("/checkups/")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(checkupPageQueryOptions());
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/checkups") || "/checkups" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/checkups") || "/checkups" }],
  }),
  component: CheckupsPage,
});

const HERO_POINTS = [
  { icon: Heart, text: "Ранняя диагностика заболеваний" },
  { icon: Clock, text: "Экономия времени и средств" },
  { icon: Users, text: "Индивидуальные программы" },
];

const ABOUT_POINTS = [
  {
    icon: Users,
    title: "Кому подходят?",
    text: "Взрослым и детям: программы подбираются по возрасту и целям.",
  },
  {
    icon: CalendarCheck,
    title: "Как часто?",
    text: "Рекомендуется проходить 1 раз в год или по назначению врача.",
  },
  {
    icon: FlaskConical,
    title: "Что включает?",
    text: "Анализы, диагностику и консультации профильных специалистов.",
  },
  {
    icon: Heart,
    title: "Почему это важно?",
    text: "Помогает предотвратить развитие серьёзных заболеваний.",
  },
];

type ProgramDef = {
  key: string;
  match: RegExp;
  title: string;
  price: string;
  tone: string;
  image: string;
  alt: string;
};

const OPTIMAL: ProgramDef[] = [
  {
    key: "female",
    match: /женск/i,
    title: "Женское здоровье",
    price: "35 000 сом",
    tone: "pastel-rose",
    image: "/assets/checkup-female.jpg",
    alt: "Улыбающаяся женщина на розовом фоне",
  },
  {
    key: "male",
    match: /мужск/i,
    title: "Мужское здоровье",
    price: "31 000 сом",
    tone: "pastel-sky",
    image: "/assets/checkup-male.jpg",
    alt: "Улыбающийся мужчина на голубом фоне",
  },
  {
    key: "child",
    match: /детск|реб[её]н/i,
    title: "Здоровый ребёнок",
    price: "от 15 000 сом",
    tone: "pastel-sand",
    image: "/assets/checkup-child.jpg",
    alt: "Девочка обнимает плюшевого мишку",
  },
];

const EXTENDED: ProgramDef[] = [
  {
    key: "female-ext",
    match: /женск.*расшир|расшир.*женск/i,
    title: "Женское здоровье (расширенный)",
    price: "62 000 сом",
    tone: "pastel-rose",
    image: "/assets/checkup-female.jpg",
    alt: "Женщина на розовом фоне",
  },
  {
    key: "male-ext",
    match: /мужск.*расшир|расшир.*мужск/i,
    title: "Мужское здоровье (расширенный)",
    price: "62 000 сом",
    tone: "pastel-sky",
    image: "/assets/checkup-male.jpg",
    alt: "Мужчина на голубом фоне",
  },
];

const LAB_PACKAGES = [
  { title: "Диабетический", price: "+2 900 сом" },
  { title: "Гельминты", price: "+1 850 сом" },
  { title: "Энергия (витамины)", price: "+4 600 сом" },
  { title: "Онкомаркеры для женщин", price: "+5 400 сом" },
  { title: "Онкомаркеры для мужчин", price: "+4 700 сом" },
];

const BASIC = [
  { title: "Здоровые лёгкие", price: "+1 300 сом" },
  { title: "Здоровый желудок", price: "+8 400 сом" },
  { title: "Здоровое сердце", price: "+5 800 сом" },
  { title: "Лишний вес", price: "+5 000 сом" },
  { title: "Эндокринологический", price: "+5 300 сом" },
  { title: "Проктологический", price: "+5 000 сом" },
  { title: "Спортивный", price: "+4 800 сом" },
];

const FAQ = [
  {
    q: "Сколько времени занимает чекап?",
    a: "В среднем 1,5–3 часа: всё зависит от выбранной программы. Большинство исследований проводится в один визит.",
  },
  {
    q: "Можно ли пройти чекап без направления врача?",
    a: "Да, направление не требуется. Вы просто выбираете программу и записываетесь на удобное время.",
  },
  {
    q: "Нужна ли подготовка к сдаче анализов?",
    a: "Кровь сдаётся натощак, за 8–12 часов до визита нельзя есть. Подробные рекомендации вы получите при записи.",
  },
  {
    q: "Можно ли пройти обследование ребёнку?",
    a: "Да, у нас есть программа «Здоровый ребёнок» и детские специалисты для сопровождения.",
  },
  {
    q: "Что входит в стоимость чекапа?",
    a: "Все анализы, исследования и консультации, указанные в программе, а также итоговое заключение врача.",
  },
  {
    q: "Выдаются ли результаты на руки?",
    a: "Да, все результаты и заключение выдаются лично, а также могут быть отправлены вам в электронном виде.",
  },
];

function CheckupsPage() {
  const { data } = useSuspenseQuery(checkupPageQueryOptions());
  const cards = data.cards ?? [];

  /** Ссылка «Подробнее»: на страницу чекапа из базы, если нашли по названию, иначе на запись. */
  const detailHref = (def: ProgramDef) =>
    cards.find((c) => def.match.test(c.title))?.slug;

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Чекапы" }]} />
      <main>
        {/* Баннер — как на главной */}
        <section className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:pt-6 sm:pb-14">
          <div className="border-border relative min-h-[440px] overflow-hidden rounded-3xl border sm:min-h-[480px]">
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
            <div className="relative flex h-full max-w-[600px] flex-col justify-start p-6 sm:justify-center sm:p-10">
              <p className="text-brand-red text-[11px] font-bold tracking-[0.18em] uppercase">
                Диагностика
              </p>
              <h1 className="text-foreground mt-4 text-3xl leading-[1.15] font-extrabold tracking-tight sm:text-[42px] sm:leading-[1.12]">
                Чекапы для{" "}
                <span className="bg-brand-green text-brand-white rounded-md px-2 py-0.5 align-middle text-[0.92em] leading-none">
                  вашего здоровья
                </span>
              </h1>
              <p className="text-muted-foreground mt-4 max-w-md text-[16px] leading-relaxed">
                Комплексные обследования, чтобы быть уверенным в главном — в себе и своих близких.
              </p>

              <ul className="mt-6 space-y-2.5">
                {HERO_POINTS.map((point) => (
                  <li key={point.text} className="flex items-center gap-2.5">
                    <span className="bg-surface-green text-brand-green-dark grid size-7 shrink-0 place-items-center rounded-full">
                      <point.icon className="size-3.5" strokeWidth={2.4} />
                    </span>
                    <span className="text-foreground text-[14px] font-semibold">{point.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#optimal"
                  className="bg-brand-green text-brand-white hover:bg-brand-green-dark inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[16px] font-extrabold transition-colors"
                >
                  Выбрать чекап
                </a>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border bg-background/80 text-foreground hover:border-brand-green inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 text-[16px] font-extrabold transition-colors"
                >
                  Бесплатная консультация
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Что такое чекапы */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:pb-16">
          <div className="bg-surface-soft grid gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-[30px]">
                Что такое чекапы и почему это важно?
              </h2>
              <p className="text-muted-foreground mt-4 text-[15px] leading-relaxed">
                Чекап — это комплексное обследование организма, которое помогает оценить состояние
                здоровья и выявить риски до появления симптомов. В клинике «Авиценна» программы
                составлены врачами и проходят в комфортном формате: без очередей, в одном месте и в
                удобное для вас время.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {ABOUT_POINTS.map((point) => (
                  <div key={point.title} className="flex gap-3">
                    <span className="bg-card text-brand-green-dark grid size-10 shrink-0 place-items-center rounded-full">
                      <point.icon className="size-5" strokeWidth={2.2} />
                    </span>
                    <div>
                      <p className="text-foreground text-[14px] font-extrabold">{point.title}</p>
                      <p className="text-muted-foreground mt-1 text-[13px] leading-snug">
                        {point.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Reveal>
              <img
                src="/assets/checkup-doctors.jpg"
                alt="Команда врачей клиники «Авиценна»"
                className="h-full max-h-[420px] w-full rounded-2xl object-cover"
                loading="lazy"
                width={1024}
                height={768}
              />
            </Reveal>
          </div>
        </section>

        {/* Оптимальные чекапы */}
        <section id="optimal" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-12 sm:px-6 lg:pb-16">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-[30px]">
              Оптимальные чекапы
            </h2>
            <span className="bg-brand-green text-brand-white inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-extrabold">
              <Sparkles className="size-3.5" />
              Популярные
            </span>
          </div>
          <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
            Сбалансированные программы для регулярного контроля здоровья.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {OPTIMAL.map((program, index) => (
              <Reveal key={program.key} delay={index * 70} className="h-full">
                <OptimalCard program={program} slug={detailHref(program)} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Расширенные чекапы + лабораторные пакеты */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:pb-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-[30px]">
                Расширенные чекапы
              </h2>
              <div className="mt-6 space-y-5">
                {EXTENDED.map((program) => (
                  <ExtendedCard key={program.key} program={program} slug={detailHref(program)} />
                ))}
              </div>
            </div>

            <aside className="bg-surface-green/40 border-brand-green/20 h-fit rounded-3xl border p-6 lg:sticky lg:top-24">
              <h3 className="text-foreground text-[17px] leading-snug font-extrabold">
                Дополнительные пакеты лабораторных анализов
              </h3>
              <ul className="mt-5 space-y-4">
                {LAB_PACKAGES.map((item) => (
                  <li key={item.title} className="flex items-center justify-between gap-3">
                    <span className="text-foreground text-[14px] font-semibold">{item.title}</span>
                    <span className="bg-brand-green text-brand-white shrink-0 rounded-full px-3 py-1 text-[12px] font-extrabold">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-5 text-[12px] leading-snug">
                Пакеты добавляются к любой программе по желанию или рекомендации врача.
              </p>
            </aside>
          </div>
        </section>

        {/* Базовые чекапы */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:pb-16">
          <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-[30px]">
            Базовые чекапы
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
            Точечные программы для проверки конкретных систем организма.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BASIC.map((item) => (
              <div
                key={item.title}
                className="border-border bg-card card-lift flex items-center gap-3 rounded-2xl border p-4"
              >
                <span className="bg-surface-green text-brand-green-dark grid size-11 shrink-0 place-items-center rounded-full">
                  <FlaskConical className="size-5" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <p className="text-foreground text-[14px] leading-snug font-bold">{item.title}</p>
                  <p className="text-muted-foreground mt-1 text-[13px] font-semibold">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-surface-soft">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
            <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-[30px]">
              Часто задаваемые вопросы
            </h2>
            <div className="mt-8 grid gap-x-10 gap-y-2 lg:grid-cols-2">
              {FAQ.map((item) => (
                <details key={item.q} className="group border-border border-b py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-foreground text-[15px] font-bold">{item.q}</span>
                    <ChevronRight className="text-muted-foreground size-5 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="text-muted-foreground mt-2 text-[14px] leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-green text-brand-white hover:bg-brand-green-dark mt-9 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-extrabold transition-colors"
            >
              <CalendarCheck className="size-5" strokeWidth={2.2} />
              Записаться на чекап
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function OptimalCard({ program, slug }: { program: ProgramDef; slug: string | undefined }) {
  return (
    <article
      className={`${program.tone} badge-gradient relative flex h-full flex-col overflow-hidden rounded-3xl p-6`}
    >
      <h3 className="text-foreground max-w-[55%] text-[19px] leading-tight font-extrabold">
        {program.title}
      </h3>
      <p className="text-brand-green-dark mt-2 text-[20px] font-extrabold">{program.price}</p>
      <DetailLink slug={slug} />
      <p className="text-muted-foreground mt-4 max-w-[55%] text-[12px] leading-snug font-semibold">
        Анализы, диагностика и консультации специалистов — всё включено.
      </p>
      <img
        src={program.image}
        alt={program.alt}
        loading="lazy"
        width={768}
        height={768}
        className="absolute right-0 bottom-0 h-[78%] w-[52%] rounded-tl-[48px] object-cover object-top"
      />
    </article>
  );
}

function ExtendedCard({ program, slug }: { program: ProgramDef; slug: string | undefined }) {
  return (
    <article
      className={`${program.tone} badge-gradient relative flex flex-col overflow-hidden rounded-3xl p-6 sm:flex-row sm:items-center sm:gap-6`}
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-foreground text-[19px] leading-tight font-extrabold">
          {program.title}
        </h3>
        <p className="text-brand-green-dark mt-2 text-[20px] font-extrabold">{program.price}</p>
        <p className="text-muted-foreground mt-3 max-w-md text-[13px] leading-snug font-semibold">
          Максимально полное обследование: расширенная лабораторная диагностика, УЗИ и консультации
          профильных врачей.
        </p>
        <DetailLink slug={slug} />
      </div>
      <img
        src={program.image}
        alt={program.alt}
        loading="lazy"
        width={768}
        height={768}
        className="mt-5 h-40 w-full rounded-2xl object-cover object-top sm:mt-0 sm:h-44 sm:w-40 sm:shrink-0"
      />
    </article>
  );
}

function DetailLink({ slug }: { slug?: string }) {
  const className =
    "bg-brand-green-dark text-brand-white hover:bg-brand-green-dark/90 mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-extrabold transition-colors";

  if (slug) {
    return (
      <Link to="/checkups/$slug" params={{ slug }} className={className}>
        Подробнее
        <ArrowRight className="size-4" strokeWidth={2.4} />
      </Link>
    );
  }
  return (
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className={className}>
      Подробнее
      <ArrowRight className="size-4" strokeWidth={2.4} />
    </a>
  );
}

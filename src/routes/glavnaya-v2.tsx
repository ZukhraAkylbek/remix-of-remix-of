import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import aboutHeroAsset from "@/assets/about-hero.jpg.asset.json";
import image2Asset from "@/assets/image-2.png.asset.json";
import imageAsset from "@/assets/image.png.asset.json";
import imageWebpAsset from "@/assets/image.webp.asset.json";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl } from "@/lib/clinic";
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
    <p className="text-muted-foreground text-[11px] font-bold tracking-[0.18em] uppercase">
      {children}
    </p>
  );
}

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

function HomeV2() {
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
      </main>
      <SiteFooter />
    </div>
  );
}

import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Check, ChevronRight, Minus, Plus } from "lucide-react";

import { CheckupIcon } from "@/components/checkups/CheckupIcon";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl } from "@/lib/clinic";
import { checkupPageQueryOptions } from "@/lib/checkups.queries";
import { BOOKING_URL } from "@/lib/site-config";

const TITLE = "Медицинские чекап-программы | Авиценна";
const DESCRIPTION =
  "Чекапы в клинике «Авиценна» в Бишкеке: готовые программы для мужчин, женщин и детей, конструктор своего чекапа и лабораторные пакеты.";

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

const lines = (value?: string | null) =>
  (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const priceValue = (value?: string | null) => {
  const digits = (value ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

const formatSom = (value: number) => `${value.toLocaleString("ru-RU").replace(/\u00a0/g, " ")} сом`;

const KNOWN = ["hero", "flagship", "constructor", "female", "male", "lab", "benefits"];

function CheckupsPage() {
  const { data } = useSuspenseQuery(checkupPageQueryOptions());
  const { sections, cards } = data;
  const extras = data.extras ?? [];

  const section = (key: string) => sections.find((s) => s.key === key);
  const hero = section("hero");
  const flagship = section("flagship");
  const constructor = section("constructor");
  const femaleSection = section("female");
  const maleSection = section("male");
  const labSection = section("lab");
  const rest = sections.filter((s) => !KNOWN.includes(s.key));

  const group = (key: string) => extras.filter((e) => e.group_key === key);
  const base = group("base")[0];
  const addons = group("addon");
  const female = group("female");
  const male = group("male");
  const lab = group("lab");
  const benefits = group("benefit");

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="border-border border-b">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
            <nav className="text-muted-foreground flex items-center gap-1.5 text-[13px] font-semibold">
              <Link to="/" className="hover:text-foreground">
                Главная
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="text-foreground">Чекапы</span>
            </nav>
            <p className="text-brand-green-dark mt-6 text-[12px] font-extrabold tracking-[0.16em] uppercase">
              Диагностика
            </p>
            <h1 className="text-foreground mt-3 max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-[54px]">
              {hero?.title && hero.title !== "Hero" ? hero.title : "Медицинские чекап-программы"}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl text-[16px] leading-relaxed">
              {hero?.subtitle ??
                "Комплексные программы обследования для оценки здоровья и раннего выявления рисков"}
            </p>

            {lines(hero?.body).length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-3">
                {lines(hero?.body).map((item) => (
                  <li
                    key={item}
                    className="border-border text-foreground flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-[13px] leading-snug font-semibold"
                  >
                    <Check className="text-brand-green-dark size-4 shrink-0" strokeWidth={2.6} />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-green-dark text-brand-white hover:bg-brand-green-dark/90 mt-7 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-extrabold transition-colors"
            >
              <CalendarCheck className="size-5" strokeWidth={2.2} />
              Подобрать чекап
            </a>
          </div>
        </section>

        {/* Готовые программы */}
        <section id="flagship">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
            <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-[32px]">
              {flagship?.title ?? "Готовые программы"}
            </h2>
            {flagship?.subtitle && (
              <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
                {flagship.subtitle}
              </p>
            )}

            <div className="mt-8 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <Reveal key={card.id} className="h-full">
                  <ProgramCard card={card} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Конструктор чекапа */}
        {(base || addons.length > 0) && (
          <section id="constructor" className="bg-surface-green/40">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
              <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-[32px]">
                {constructor?.title ?? "Соберите свой чекап"}
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
                {constructor?.subtitle ??
                  "Выберите дополнительные пакеты к базовому чекапу и получите программу, которая подходит именно вам"}
              </p>
              <CheckupBuilder base={base} addons={addons} />
            </div>
          </section>
        )}

        {/* Женское / Мужское здоровье */}
        {(female.length > 0 || male.length > 0) && (
          <section>
            <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
              {female.length > 0 && (
                <PriceList title={femaleSection?.title ?? "Женское здоровье"} items={female} />
              )}
              {male.length > 0 && (
                <PriceList title={maleSection?.title ?? "Мужское здоровье"} items={male} />
              )}
            </div>
          </section>
        )}

        {/* Лабораторные пакеты */}
        {lab.length > 0 && (
          <section className="border-border border-t">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
              <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-[32px]">
                {labSection?.title ?? "Лабораторные пакеты"}
              </h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {lab.map((item) => (
                  <div
                    key={item.id}
                    className="border-border flex items-center gap-3 rounded-2xl border p-4"
                  >
                    <span className="bg-surface-green text-brand-green-dark grid size-11 shrink-0 place-items-center rounded-full">
                      <CheckupIcon name={item.icon} className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-foreground text-[13px] leading-snug font-bold">
                        {item.title}
                      </p>
                      {item.price && (
                        <p className="text-muted-foreground mt-1 text-[13px] font-semibold">
                          {item.price}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Преимущества */}
        {benefits.length > 0 && (
          <section className="bg-surface-soft">
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
              {benefits.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-brand-green-dark grid size-11 shrink-0 place-items-center rounded-full bg-white">
                    <CheckupIcon name={item.icon} className="size-5" />
                  </span>
                  <p className="text-foreground text-[14px] leading-snug font-semibold">
                    {item.title}
                    {item.note && (
                      <span className="text-muted-foreground block font-medium">{item.note}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Остальные разделы — аккордеон */}
        {rest.length > 0 && (
          <section>
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
              <div className="divide-border border-border divide-y border-y">
                {rest.map((item) => (
                  <details key={item.id} id={item.key} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <h2 className="text-foreground text-[20px] font-extrabold sm:text-[22px]">
                        {item.title}
                      </h2>
                      <ChevronRight className="text-muted-foreground size-5 shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    {item.subtitle && (
                      <p className="text-muted-foreground mt-3 text-[16px] leading-relaxed">
                        {item.subtitle}
                      </p>
                    )}
                    {item.body && (
                      <p className="text-muted-foreground mt-3 text-[16px] leading-relaxed whitespace-pre-line">
                        {item.body}
                      </p>
                    )}
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function ProgramCard({
  card,
}: {
  card: {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    price: string | null;
    price_note: string | null;
    icon: string | null;
    includes: string | null;
    badge: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const items = lines(card.includes);

  return (
    <article className="border-border bg-card relative flex h-full flex-col overflow-hidden rounded-3xl border p-6">
      <span className="bg-surface-green text-brand-green-dark grid size-12 place-items-center rounded-full">
        <CheckupIcon name={card.icon} className="size-6" />
      </span>
      <h3 className="text-foreground mt-5 text-[19px] leading-tight font-extrabold">
        {card.title}
      </h3>
      {card.subtitle && (
        <p className="text-muted-foreground mt-3 text-[13px] leading-relaxed">{card.subtitle}</p>
      )}

      <div className="mt-auto pt-6">
        {card.price && (
          <p className="text-foreground text-[20px] font-extrabold">{card.price}</p>
        )}
        {card.price_note && (
          <p className="text-muted-foreground mt-1 text-[12px] font-semibold">{card.price_note}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            to="/checkups/$slug"
            params={{ slug: card.slug }}
            className="bg-brand-green-dark text-brand-white hover:bg-brand-green-dark/90 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-extrabold transition-colors"
          >
            Подробнее
            <ArrowRight className="size-4" strokeWidth={2.4} />
          </Link>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="text-muted-foreground hover:text-foreground text-[13px] font-semibold"
            >
              {open ? "Скрыть" : "Что входит?"}
            </button>
          )}
          {card.badge && (
            <span className="text-muted-foreground text-[13px] font-semibold">{card.badge}</span>
          )}
        </div>
        {open && items.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {items.map((item) => (
              <li
                key={item}
                className="text-muted-foreground flex gap-2 text-[13px] leading-snug font-medium"
              >
                <Check className="text-brand-green-dark mt-0.5 size-3.5 shrink-0" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

type Extra = {
  id: string;
  title: string;
  price: string | null;
  note: string | null;
  icon: string | null;
};

function CheckupBuilder({ base, addons }: { base: Extra | undefined; addons: Extra[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const basePrice = priceValue(base?.price);
  const addonsPrice = useMemo(
    () =>
      addons
        .filter((item) => selected.includes(item.id))
        .reduce((sum, item) => sum + priceValue(item.price), 0),
    [addons, selected],
  );

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)_300px]">
      {base && (
        <div className="bg-card rounded-3xl p-6">
          <h3 className="text-foreground text-[18px] font-extrabold">{base.title}</h3>
          {base.price && (
            <p className="text-foreground mt-2 text-[20px] font-extrabold">{base.price}</p>
          )}
          <ul className="mt-5 space-y-2">
            {lines(base.note).map((item) => (
              <li
                key={item}
                className="text-muted-foreground flex gap-2 text-[13px] leading-snug font-medium"
              >
                <Check className="text-brand-green-dark mt-0.5 size-3.5 shrink-0" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-card rounded-3xl p-6">
        <p className="text-foreground text-center text-[14px] font-extrabold">
          Дополнительные пакеты
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {addons.map((item) => {
            const active = selected.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={active}
                className={`flex flex-col rounded-2xl border p-4 text-left transition-colors ${
                  active ? "border-brand-green-dark bg-surface-green/60" : "border-border bg-card"
                }`}
              >
                <span className="text-brand-green-dark">
                  <CheckupIcon name={item.icon} className="size-5" />
                </span>
                <span className="text-foreground mt-3 text-[13px] leading-snug font-bold">
                  {item.title}
                </span>
                {item.price && (
                  <span className="text-muted-foreground mt-1 text-[12px] font-semibold">
                    {item.price}
                  </span>
                )}
                <span
                  className={`mt-3 grid size-7 place-items-center self-end rounded-full ${
                    active
                      ? "bg-brand-green-dark text-brand-white"
                      : "bg-surface-green text-brand-green-dark"
                  }`}
                >
                  {active ? <Minus className="size-4" /> : <Plus className="size-4" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-card flex flex-col rounded-3xl p-6">
        <h3 className="text-foreground text-[18px] font-extrabold">Ваш чекап</h3>
        <dl className="mt-5 space-y-2 text-[13px] font-semibold">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{base?.title ?? "Базовый чекап"}</dt>
            <dd className="text-foreground">{formatSom(basePrice)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Доп. пакеты</dt>
            <dd className="text-foreground">{formatSom(addonsPrice)}</dd>
          </div>
        </dl>
        <div className="border-border mt-5 flex items-center justify-between gap-3 border-t pt-4">
          <span className="text-foreground text-[14px] font-extrabold">Итого</span>
          <span className="text-foreground text-[18px] font-extrabold">
            {formatSom(basePrice + addonsPrice)}
          </span>
        </div>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-green-dark text-brand-white hover:bg-brand-green-dark/90 mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[14px] font-extrabold transition-colors"
        >
          Записаться
          <ArrowRight className="size-4" strokeWidth={2.4} />
        </a>
      </div>
    </div>
  );
}

function PriceList({ title, items }: { title: string; items: Extra[] }) {
  return (
    <div className="border-border rounded-3xl border p-6">
      <h2 className="text-foreground text-[20px] font-extrabold sm:text-[24px]">{title}</h2>
      <ul className="divide-border mt-4 divide-y">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-3">
            <span className="text-foreground text-[14px] font-semibold">{item.title}</span>
            {item.price && (
              <span className="text-brand-green-dark shrink-0 text-[14px] font-extrabold">
                {item.price}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

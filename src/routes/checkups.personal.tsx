import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Check, ShoppingBasket } from "lucide-react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckupIcon } from "@/components/checkups/CheckupIcon";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/clinic";
import {
  formatSom,
  PERSONAL_BASE_PACKAGE,
  PERSONAL_CHECKUP_OPTIONS,
} from "@/lib/checkup-programs";
import { BOOKING_URL } from "@/lib/site-config";

const TITLE = "Персональный чекап — Авиценна";
const DESCRIPTION =
  "Соберите персональную программу обследования: основной пакет и дополнительные направления с автоматическим расчётом стоимости.";

export const Route = createFileRoute("/checkups/personal")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/checkups/personal") || "/checkups/personal" }],
  }),
  component: PersonalCheckupPage,
});

const TONE = {
  female: "border-surface-red bg-surface-red/70",
  male: "border-surface-sky bg-surface-sky/80",
  common: "border-about-line bg-about-canvas",
} as const;

function PersonalCheckupPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const total = useMemo(
    () =>
      PERSONAL_BASE_PACKAGE.price +
      PERSONAL_CHECKUP_OPTIONS.filter((item) => selected.includes(item.id)).reduce(
        (sum, item) => sum + item.price,
        0,
      ),
    [selected],
  );

  const toggle = (id: string, checked: boolean) => {
    setSelected((current) =>
      checked ? [...current, id] : current.filter((selectedId) => selectedId !== id),
    );
  };

  return (
    <div className="min-h-screen bg-about-canvas">
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Чекапы", href: "/checkups" }, { label: "Персональный чекап" }]} />
      <main className="pb-32 sm:pb-36">
        <section className="bg-about-mint border-about-line border-y">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
            <p className="text-about-teal text-xs font-bold uppercase">Конструктор программы</p>
            <h1 className="text-about-ink mt-3 text-3xl font-extrabold sm:text-4xl">
              Соберите персональный чекап
            </h1>
            <p className="text-about-copy mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
              Основной пакет уже включён. Отметьте дополнительные направления — итоговая стоимость
              пересчитается автоматически.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="border-brand-green bg-about-mint flex items-center justify-between gap-4 rounded-2xl border-2 p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="bg-brand-green text-brand-white grid size-11 shrink-0 place-items-center rounded-full">
                <Check className="size-5" />
              </span>
              <div>
                <h2 className="text-about-ink text-base font-extrabold sm:text-lg">
                  {PERSONAL_BASE_PACKAGE.title}
                </h2>
                <p className="text-about-copy mt-1 text-xs sm:text-sm">
                  {PERSONAL_BASE_PACKAGE.description}
                </p>
              </div>
            </div>
            <strong className="text-about-ink shrink-0 text-sm sm:text-base">
              {formatSom(PERSONAL_BASE_PACKAGE.price)}
            </strong>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-about-ink text-2xl font-extrabold">Дополните программу</h2>
              <p className="text-about-copy mt-2 text-sm">Можно выбрать несколько пакетов.</p>
            </div>
            {selected.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                className="text-about-teal hover:bg-about-icon hover:text-about-ink"
                onClick={() => setSelected([])}
              >
                Сбросить
              </Button>
            )}
          </div>

          <div className="mt-6 space-y-3">
            {PERSONAL_CHECKUP_OPTIONS.map((item) => {
              const checked = selected.includes(item.id);
              return (
                <label
                  key={item.id}
                  className={`${TONE[item.audience]} flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors`}
                >
                  <span className="bg-background text-about-teal grid size-10 shrink-0 place-items-center rounded-full">
                    <CheckupIcon name={item.icon} className="size-5" />
                  </span>
                  <span className="text-about-ink min-w-0 flex-1 text-sm font-bold sm:text-base">
                    {item.title}
                  </span>
                  <span className="text-about-copy shrink-0 text-xs font-semibold sm:text-sm">
                    +{formatSom(item.price)}
                  </span>
                  <Button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={`Добавить ${item.title}`}
                    variant="outline"
                    size="icon"
                    onClick={(event) => {
                      event.preventDefault();
                      toggle(item.id, !checked);
                    }}
                    className={`size-6 shrink-0 rounded-md p-0 shadow-none ${
                      checked
                        ? "border-brand-green bg-brand-green text-brand-white hover:bg-brand-green-dark hover:text-brand-white"
                        : "border-about-teal bg-background text-transparent hover:bg-about-icon"
                    }`}
                  >
                    <Check className="size-4" />
                  </Button>
                </label>
              );
            })}
          </div>
        </section>
      </main>

      <div className="border-about-line bg-background/95 fixed inset-x-0 bottom-[64px] z-[60] border-t shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur lg:bottom-0">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <span className="bg-about-icon text-about-teal grid size-10 place-items-center rounded-full">
              <ShoppingBasket className="size-5" />
            </span>
            <div>
              <p className="text-about-copy text-xs">Итого · {selected.length + 1} пак.</p>
              <p className="text-about-ink text-xl font-extrabold">{formatSom(total)}</p>
            </div>
          </div>
          <Button asChild className="h-11 rounded-xl bg-brand-green px-5 font-bold text-brand-white hover:bg-brand-green-dark">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              <CalendarCheck className="size-4" />
              Записаться
            </a>
          </Button>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo-avicenna.png.asset.json";
import { BOOKING_URL } from "@/lib/site-config";

import { Editable } from "@/components/live-edit/LiveEdit";
import { SiteSearch } from "@/components/SiteSearch";
import { useSiteContent } from "@/lib/site-content";

export const HEADER_NAV_SLOTS = [
  { label: "Главная", href: "/" },
  { label: "Травмпункт 24/7", href: "/napravleniya/travmpunkt" },
  { label: "О нас", href: "/about" },
  { label: "Услуги", href: "/#uslugi" },
  { label: "Хирургия", href: "/napravleniya/hirurgiya" },
  { label: "Поликлиника", href: "/#vrachi" },
  { label: "Чекапы", href: "/checkups" },
  { label: "Стационар", href: "/napravleniya/statsionar" },
  { label: "Диагностика", href: "/diagnostika" },
];

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/i.test(href);

export function SiteHeader({ breadcrumb }: { breadcrumb?: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useSiteContent();
  const ctaLabel = t("header.cta");
  const navItems = HEADER_NAV_SLOTS.map((slot, i) => ({
    label: t(`header.nav.${i + 1}.label`, slot.label),
    href: t(`header.nav.${i + 1}.href`, slot.href),
  })).filter((item) => item.label.trim() && item.href.trim());

  return (
    <header className="bg-background/95 border-border sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3.5 sm:px-6 lg:flex-nowrap lg:gap-8">
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Авиценна — на главную">
            <img
              src={logo.url}
              alt="Клинико-диагностический центр «Авиценна»"
              width={840}
              height={393}
              className="h-14 w-auto sm:h-16 lg:h-20"
            />
          </Link>

          {breadcrumb && (
            <span className="text-muted-foreground hidden truncate text-sm sm:block lg:hidden">
              / {breadcrumb}
            </span>
          )}
        </div>

        <nav
          aria-label="Главное меню"
          className="hidden items-center gap-5 lg:flex lg:flex-wrap xl:gap-7"
        >
          {navItems.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              {...(isExternal(item.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-foreground hover:text-brand-green shrink-0 whitespace-nowrap text-[15px] font-semibold transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <SiteSearch className="order-last w-full min-w-0 lg:order-none lg:w-auto lg:min-w-[180px] lg:flex-1" />

        <div className="ml-auto flex shrink-0 items-center gap-3 lg:gap-4">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-accent text-accent-foreground hidden whitespace-nowrap rounded-xl px-5 py-2.5 text-[15px] font-bold transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-105 sm:inline-flex"
          >
            <Editable ekey="header.cta" label="Кнопка записи в хедере" fallback={ctaLabel} />
          </a>

          <button
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
            className="border-border text-foreground grid size-10 shrink-0 place-items-center rounded-md border lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-border bg-background border-t lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {navItems.map((item) => (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setOpen(false)}
                {...(isExternal(item.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="border-border text-foreground border-b py-3.5 text-lg font-semibold"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-wrap items-center gap-3 py-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-accent text-accent-foreground rounded-xl px-5 py-3 text-base font-bold"
              >
                {ctaLabel}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

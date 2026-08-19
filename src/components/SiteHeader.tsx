import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo-avicenna.png.asset.json";
import { BOOKING_URL } from "@/lib/site-config";

import { Editable } from "@/components/live-edit/LiveEdit";
import { SiteSearch } from "@/components/SiteSearch";
import { useSiteContent } from "@/lib/site-content";

export const HEADER_NAV_SLOTS = [
  { label: "Главная", href: "/" },
  { label: "Травмпункт 24/7", href: "/travmpunkt" },
  { label: "О нас", href: "/about" },
  { label: "Услуги", href: "/uslugi" },
  { label: "Хирургия", href: "/hirurgiya" },
  { label: "Поликлиника", href: "/#vrachi" },
  { label: "Чекапы", href: "/checkups" },
  { label: "Стационар", href: "/napravleniya/statsionar" },
  { label: "Диагностика", href: "/diagnostika" },
];

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/i.test(href);

export function SiteHeader({ breadcrumb }: { breadcrumb?: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useSiteContent();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const ctaLabel = t("header.cta");
  const phone = t("header.phone");
  const phoneNote = t("header.phone_note", "Круглосуточная запись по телефону:");
  const homeVisitLabel = t("header.action_home", "Вызвать врача на дом");
  const homeVisitHref = t("header.action_home_href", "/uslugi/vyzov-vracha-na-dom");
  const emergencyLabel = t("header.action_emergency", "Скорая помощь");
  const emergencyHref = t("header.action_emergency_href", "/travmpunkt");

  const navItems = HEADER_NAV_SLOTS.map((slot, i) => ({
    label: t(`header.nav.${i + 1}.label`, slot.label),
    href: t(`header.nav.${i + 1}.href`, slot.href),
  })).filter((item) => item.label.trim() && item.href.trim());

  const linkProps = (href: string) =>
    isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <header className="bg-background/95 border-border sticky top-0 z-50 border-b backdrop-blur">
      {/* Верхняя строка: логотип, поиск, телефон, действия */}
      <div className="border-border/70 border-b">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Авиценна — на главную">
            <img
              src={logo.url}
              alt="Клинико-диагностический центр «Авиценна»"
              width={840}
              height={393}
              className="h-12 w-auto sm:h-14 lg:h-16"
            />
          </Link>

          <SiteSearch className="hidden w-[260px] shrink-0 lg:flex xl:w-[300px]" />

          <a
            href={`tel:${phone.replace(/[^+\d]/g, "")}`}
            className="hidden shrink-0 items-center gap-2.5 md:flex"
          >
            <Phone className="text-muted-foreground size-6" strokeWidth={1.6} />
            <span className="flex flex-col leading-tight">
              <span className="text-muted-foreground text-[13px]">{phoneNote}</span>
              <span className="text-foreground text-xl font-extrabold tracking-tight">{phone}</span>
            </span>
          </a>

          <div className="ml-auto hidden shrink-0 items-center gap-3 lg:flex">
            <a
              href={homeVisitHref}
              {...linkProps(homeVisitHref)}
              className="bg-brand-green hover:bg-brand-green-dark whitespace-nowrap rounded-full px-5 py-3 text-[15px] font-bold text-white transition-colors"
            >
              {homeVisitLabel}
            </a>
            <a
              href={emergencyHref}
              {...linkProps(emergencyHref)}
              className="bg-brand-green hover:bg-brand-green-dark whitespace-nowrap rounded-full px-5 py-3 text-[15px] font-bold text-white transition-colors"
            >
              {emergencyLabel}
            </a>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-accent text-accent-foreground whitespace-nowrap rounded-full px-5 py-3 text-[15px] font-bold transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              <Editable ekey="header.cta" label="Кнопка записи в хедере" fallback={ctaLabel} />
            </a>
          </div>

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

      {/* Мобильный поиск на главной — не в меню */}
      {isHome && (
        <div className="border-border/70 border-b lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6">
            <SiteSearch className="w-full" />
          </div>
        </div>
      )}

      {/* Нижняя строка: меню */}
      <div className="mx-auto hidden max-w-7xl items-center px-4 py-2.5 sm:px-6 lg:flex">
        <nav
          aria-label="Главное меню"
          className="flex flex-1 flex-wrap items-center justify-between gap-x-5 gap-y-2 xl:gap-x-7"
        >
          {navItems.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              {...linkProps(item.href)}
              className="text-foreground hover:text-brand-green shrink-0 whitespace-nowrap text-[15px] font-semibold transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {breadcrumb && (
        <div className="text-muted-foreground mx-auto max-w-7xl px-4 pb-2 text-sm sm:px-6 lg:hidden">
          / {breadcrumb}
        </div>
      )}

      {open && (
        <div className="border-border bg-background border-t lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {navItems.map((item) => (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setOpen(false)}
                {...linkProps(item.href)}
                className="border-border text-foreground border-b py-3.5 text-lg font-semibold"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-wrap items-center gap-3 py-4">
              <a
                href={homeVisitHref}
                {...linkProps(homeVisitHref)}
                className="bg-brand-green rounded-full px-5 py-3 text-base font-bold text-white"
              >
                {homeVisitLabel}
              </a>
              <a
                href={emergencyHref}
                {...linkProps(emergencyHref)}
                className="bg-brand-green rounded-full px-5 py-3 text-base font-bold text-white"
              >
                {emergencyLabel}
              </a>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-accent text-accent-foreground rounded-full px-5 py-3 text-base font-bold"
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

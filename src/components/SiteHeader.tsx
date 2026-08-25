import { Link, useRouterState } from "@tanstack/react-router";
import { Calendar, Menu, MessageCircle, Phone, User, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo-avicenna-kg.jpg.asset.json";
import { CLINIC } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";
import { useSiteContent } from "@/lib/site-content";

import { SiteSearch } from "@/components/SiteSearch";

export const HEADER_NAV_SLOTS = [
  { label: "Главная", href: "/" },
  { label: "Травмпункт 24/7", href: "/travmpunkt" },
  { label: "О нас", href: "/about" },
  { label: "Услуги", href: "/uslugi" },
  { label: "Хирургия", href: "/hirurgiya" },
  { label: "Врачи", href: "/glavnaya-v3" },
  { label: "Чекапы", href: "/checkups" },
  { label: "Стационар", href: "/napravleniya/statsionar" },
  { label: "Диагностика", href: "/diagnostika" },
];

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/i.test(href);

export function SiteHeader({ breadcrumb }: { breadcrumb?: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useSiteContent();
  const navItems = HEADER_NAV_SLOTS.map((slot, i) => ({
    label: t(`header.nav.${i + 1}.label`, slot.label),
    href: t(`header.nav.${i + 1}.href`, slot.href),
  })).filter((item) => item.label.trim() && item.href.trim());

  const phone = CLINIC.phones[0] ?? "";
  const whatsappHref = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";

  return (
    <div className="sticky top-0 z-50">
      {/* Верхняя панель: логотип, поиск, контакты */}
      <header className="bg-background/95 border-border border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:gap-6">
          <div className="flex min-w-0 shrink-0 items-center gap-3">
            <Link to="/" className="flex shrink-0 items-center" aria-label="Авиценна — на главную">
              <img
                src={logo.url}
                alt="Клинико-диагностический центр «Авиценна»"
                width={440}
                height={95}
                className="h-10 w-auto sm:h-12 lg:h-16"
              />
            </Link>

            {breadcrumb && (
              <span className="text-muted-foreground hidden truncate text-sm sm:block lg:hidden">
                / {breadcrumb}
              </span>
            )}
          </div>

          <SiteSearch className="hidden min-w-0 flex-1 md:block lg:max-w-md" />

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в WhatsApp"
              className="inline-flex size-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-brand-green bg-brand-white/80 text-sm font-bold text-brand-green backdrop-blur-sm transition-colors hover:bg-brand-green hover:text-brand-white sm:size-auto sm:px-4 sm:py-2.5"
            >
              <MessageCircle className="size-4 shrink-0" />
              <span className="hidden lg:inline">Написать на WhatsApp</span>
            </a>

            <a
              href={`tel:${phone}`}
              aria-label="Позвонить"
              className="bg-brand-terracotta text-brand-white hover:brightness-105 inline-flex size-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all sm:size-auto sm:px-4 sm:py-2.5"
            >
              <Phone className="size-4 shrink-0" />
              <span className="hidden lg:inline">Позвонить</span>
            </a>

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Записаться онлайн"
              className="gradient-accent text-accent-foreground hover:brightness-105 inline-flex size-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all sm:size-auto sm:px-4 sm:py-2.5"
            >
              <Calendar className="size-4 shrink-0" />
              <span className="hidden lg:inline">Записаться онлайн</span>
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

        {/* Поиск на мобильных — под основной строкой */}
        <div className="border-border border-t px-4 py-2 md:hidden">
          <SiteSearch className="w-full" />
        </div>
      </header>


      {/* Зелёная навигационная панель */}
      <nav
        aria-label="Главное меню"
        className="bg-brand-green text-brand-white hidden shadow-sm md:block"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:justify-center lg:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none]">

          {navItems.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              {...(isExternal(item.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="hover:bg-brand-white/10 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-[15px] font-semibold transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Мобильное меню */}
      {open && (
        <div className="bg-brand-green text-brand-white border-t border-brand-white/20 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {navItems.map((item) => (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setOpen(false)}
                {...(isExternal(item.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="border-b border-brand-white/20 py-3.5 text-lg font-semibold"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

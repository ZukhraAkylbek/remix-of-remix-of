import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo-avicenna.png.asset.json";
import { CLINIC } from "@/lib/clinic";
import { useSiteContent } from "@/lib/site-content";

import { SiteSearch } from "@/components/SiteSearch";

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
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:gap-6">
          <div className="flex min-w-0 shrink-0 items-center gap-3">
            <Link to="/" className="flex shrink-0 items-center" aria-label="Авиценна — на главную">
              <img
                src={logo.url}
                alt="Клинико-диагностический центр «Авиценна»"
                width={840}
                height={393}
                className="h-12 w-auto sm:h-14 lg:h-16"
              />
            </Link>

            {breadcrumb && (
              <span className="text-muted-foreground hidden truncate text-sm sm:block lg:hidden">
                / {breadcrumb}
              </span>
            )}
          </div>

          <SiteSearch className="hidden min-w-0 flex-1 sm:block lg:max-w-md" />

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-green text-brand-white hover:bg-brand-green-dark inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold transition-colors sm:px-4"
            >
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">Написать WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            <a
              href={`tel:${phone}`}
              className="bg-brand-terracotta text-brand-white hover:brightness-105 inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold transition-all sm:px-4"
            >
              <Phone className="size-4" />
              <span className="hidden sm:inline">Позвонить</span>
              <span className="sm:hidden">Звонок</span>
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
        <div className="border-border border-t px-4 py-2 sm:hidden">
          <SiteSearch className="w-full" />
        </div>
      </header>

      {/* Зелёная навигационная панель */}
      <nav
        aria-label="Главное меню"
        className="bg-brand-green text-brand-white hidden shadow-sm lg:block"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-4 py-2 sm:px-6">
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

import { Link, useRouterState } from "@tanstack/react-router";
import { Calendar, Menu, MessageCircle, Phone, User, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo-avicenna-kg.jpg.asset.json";
import { CLINIC } from "@/lib/clinic";
import { useLanguage } from "@/lib/i18n";
import { BOOKING_URL } from "@/lib/site-config";
import { useSiteContent } from "@/lib/site-content";

import { SiteSearch } from "@/components/SiteSearch";

export const HEADER_NAV_SLOTS = [
  { label: "Главная", href: "/" },
  { label: "О нас", href: "/about" },
  { label: "Услуги", href: "/uslugi" },
  { label: "Врачи", href: "/glavnaya-v3" },
  { label: "Травмпункт 24/7", href: "/travmpunkt" },
  { label: "Хирургия", href: "/hirurgiya" },
  { label: "Чекапы", href: "/checkups" },
  { label: "Стационар", href: "/napravleniya/statsionar" },
  { label: "Диагностика", href: "/diagnostika" },
];

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/i.test(href);

export function SiteHeader({ breadcrumb }: { breadcrumb?: string }) {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useSiteContent();
  const navItems = HEADER_NAV_SLOTS.map((slot, i) => ({
    label: t(`header.nav.${i + 1}.label`, slot.label),
    href: t(`header.nav.${i + 1}.href`, slot.href),
  })).filter((item) => item.label.trim() && item.href.trim());

  const isActive = (href: string) =>
    !isExternal(href) && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const phone = CLINIC.phones[0] ?? "";
  const whatsappHref = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";

  return (
    <div className="sticky top-0 z-50">
      {/* Верхняя панель */}
      <header className="bg-background/95 border-border border-b backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 lg:gap-6 lg:px-6 lg:py-3">
          {/* Логотип */}
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <Link to="/" className="flex shrink-0 items-center" aria-label="Авиценна — на главную">
              <img
                src={logo.url}
                alt="Клинико-диагностический центр «Авиценна»"
                width={440}
                height={95}
                className="h-9 w-auto sm:h-11 lg:h-16"
              />
            </Link>

            {breadcrumb && (
              <span className="text-muted-foreground hidden truncate text-sm sm:block lg:hidden">
                / {breadcrumb}
              </span>
            )}
          </div>

          {/* Поиск — десктоп / планшет */}
          <SiteSearch className="hidden min-w-0 w-full md:block lg:max-w-lg" />

          {/* Действия справа */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
            {/* WhatsApp */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("Написать на WhatsApp", "Написать на WhatsApp")}
              className="inline-flex size-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-brand-green bg-brand-white/80 text-brand-green backdrop-blur-sm transition-colors hover:bg-brand-green hover:text-brand-white sm:size-11 xl:size-auto xl:px-4 xl:py-2.5"
            >
              <MessageCircle className="size-[18px] shrink-0 xl:size-4" strokeWidth={2} />
              <span className="hidden xl:inline">{t("Написать на WhatsApp", "Написать на WhatsApp")}</span>
            </a>

            {/* Телефон */}
            <a
              href={`tel:${phone}`}
              aria-label={t("Позвонить", "Позвонить")}
              className="bg-brand-terracotta text-brand-white hover:brightness-105 inline-flex size-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all sm:size-11 lg:size-auto lg:px-4 lg:py-2.5"
            >
              <Phone className="size-[18px] shrink-0 lg:size-4" strokeWidth={2} />
              <span className="hidden lg:inline">{t("Позвонить", "Позвонить")}</span>
            </a>

            {/* Запись */}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("Записаться онлайн", "Записаться онлайн")}
              className="gradient-accent text-accent-foreground hover:brightness-105 inline-flex size-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all sm:size-11 lg:size-auto lg:px-4 lg:py-2.5"
            >
              <Calendar className="size-[18px] shrink-0 lg:size-4" strokeWidth={2} />
              <span className="hidden lg:inline">{t("Записаться онлайн", "Записаться онлайн")}</span>
            </a>

            {/* Переключатель языка — десктоп / планшет (не на мобильном) */}
            <div
              role="group"
              aria-label={t("Выбор языка", "Выбор языка")}
              className="border-border bg-background hidden shrink-0 items-center rounded-xl border p-0.5 lg:flex"
            >
              {(["ru", "ky"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`rounded-lg px-2.5 py-1.5 text-sm font-bold uppercase transition-colors ${
                    lang === code
                      ? "bg-brand-green text-brand-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {code === "ru" ? "Рус" : "Кыр"}
                </button>
              ))}
            </div>

            {/* Бургер — крупный touch target */}
            <button
              type="button"
              aria-label={open ? t("Закрыть меню", "Закрыть меню") : t("Открыть меню", "Открыть меню")}
              onClick={() => setOpen((v) => !v)}
              className="border-border bg-background text-brand-green hover:bg-brand-green hover:text-brand-white grid size-11 shrink-0 place-items-center rounded-xl border shadow-sm transition-colors lg:hidden"
            >
              {open ? <X className="size-6" strokeWidth={2.5} /> : <Menu className="size-6" strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* Поиск на мобильных */}
        <div className="border-border border-t px-3 py-2 md:hidden">
          <SiteSearch className="w-full" />
        </div>
      </header>

      {/* Зелёная навигационная панель — десктоп */}
      <nav
        aria-label={t("Главное меню", "Главное меню")}
        className="bg-brand-green text-brand-white hidden shadow-sm md:block"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5 sm:px-6 lg:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              title={item.label}
              aria-current={isActive(item.href) ? "page" : undefined}
              {...(isExternal(item.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2.5 text-[17px] font-bold transition-colors ${
                isActive(item.href)
                  ? "bg-brand-white/20 underline decoration-2 underline-offset-8"
                  : "hover:bg-brand-white/15 hover:underline hover:decoration-2 hover:underline-offset-8"
              }`}
            >
              {item.label}
            </a>
          ))}

          <a
            href="/auth"
            className="border-brand-white/60 text-brand-white hover:bg-brand-white hover:text-brand-green ml-auto inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-3.5 py-2 text-[16px] font-bold transition-colors"
          >
            <User className="size-4" />
            {t("Личный кабинет", "Личный кабинет")}
          </a>
        </div>
      </nav>

      {/* Мобильное меню — выдвижная панель */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Панель */}
          <div className="bg-brand-green text-brand-white fixed inset-y-0 right-0 z-[70] flex w-[85vw] max-w-sm flex-col shadow-2xl lg:hidden">
            {/* Шапка панели */}
            <div className="border-b border-brand-white/20 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">{t("Меню", "Меню")}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("Закрыть меню", "Закрыть меню")}
                  className="grid size-11 place-items-center rounded-xl bg-brand-white/10 text-brand-white transition-colors hover:bg-brand-white/20"
                >
                  <X className="size-6" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Язык */}
            <div className="border-b border-brand-white/20 px-4 py-3">
              <div
                role="group"
                aria-label={t("Выбор языка", "Выбор языка")}
                className="inline-flex items-center rounded-xl border border-brand-white/40 bg-brand-white/10 p-0.5"
              >
                {(["ru", "ky"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    className={`rounded-lg px-4 py-2 text-sm font-bold uppercase transition-colors ${
                      lang === code
                        ? "bg-brand-white text-brand-green"
                        : "text-brand-white hover:bg-brand-white/10"
                    }`}
                  >
                    {code === "ru" ? "Рус" : "Кыр"}
                  </button>
                ))}
              </div>
            </div>

            {/* Навигация */}
            <nav className="flex-1 overflow-y-auto px-4 py-2" aria-label={t("Главное меню", "Главное меню")}>
              {navItems.map((item) => (
                <a
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  {...(isExternal(item.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`block border-b border-brand-white/20 py-4 text-lg font-semibold transition-colors ${
                    isActive(item.href) ? "bg-brand-white/10" : ""
                  }`}
                >
                  {item.label}
                </a>
              ))}

              <a
                href="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center gap-2 rounded-xl border border-brand-white/40 px-4 py-3 text-base font-bold"
              >
                <User className="size-5" />
                {t("Личный кабинет", "Личный кабинет")}
              </a>
            </nav>

            {/* Кнопки связи */}
            <div className="border-t border-brand-white/20 p-4">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-white/40 bg-brand-white/10 px-3 py-3 text-sm font-bold"
                >
                  <MessageCircle className="size-4 shrink-0" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-white px-3 py-3 text-sm font-bold text-brand-green"
                >
                  <Phone className="size-4 shrink-0" />
                  {t("Позвонить", "Позвонить")}
                </a>
              </div>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-accent text-accent-foreground mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold"
              >
                <Calendar className="size-4 shrink-0" />
                {t("Записаться онлайн", "Записаться онлайн")}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

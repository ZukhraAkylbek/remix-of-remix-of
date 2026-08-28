import logo from "@/assets/logo-avicenna-kg.jpg.asset.json";
import { Editable } from "@/components/live-edit/LiveEdit";
import { CLINIC } from "@/lib/clinic";
import { doubleGisSearchUrl } from "@/lib/clinic";
import { BOOKING_URL } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer id="contacts" className="border-border border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <img
              src={logo.url}
              alt="Клинико-диагностический центр «Авиценна»"
              width={440}
              height={95}
              loading="lazy"
              className="h-11 w-auto"
            />
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-accent-foreground inline-flex rounded-md px-6 py-3.5 text-base font-semibold transition-opacity hover:opacity-90"
            >
              <Editable ekey="footer.cta" label="Кнопка в подвале" fallback="Записаться онлайн" />
            </a>
          </div>

          <Editable
            ekey="footer.tagline"
            label="Текст в подвале"
            fallback=""
            multiline
            as="p"
            className="text-muted-foreground mt-4 max-w-sm text-base"
          />
        </div>

        <div>
          <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
            Контакты
          </p>
          <ul className="mt-4 space-y-2 text-base">
            <li>
              <a href={`tel:${CLINIC.phones[0]}`} className="text-foreground font-semibold">
                +996 779 909 009
              </a>
            </li>
            <li className="text-muted-foreground">{CLINIC.email}</li>
            <li className="text-muted-foreground"></li>
          </ul>

          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://api.whatsapp.com/send/?phone=996707909001&text=&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-muted-foreground hover:text-foreground grid size-10 place-items-center rounded-full border border-current/20 transition-colors hover:border-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.045zm5.825-7.583c-.063-.097-.232-.155-.485-.273-.252-.118-1.49-.735-1.722-.819-.232-.083-.4-.125-.568.125-.168.249-.65.817-.797.986-.147.166-.294.187-.547.063-.252-.125-1.065-.393-2.03-1.254-.75-.669-1.256-1.497-1.403-1.746-.147-.249-.015-.384.11-.508.113-.113.252-.294.378-.442.125-.147.166-.252.25-.419.083-.168.042-.314-.021-.442-.083-.125-.568-1.371-.779-1.876-.205-.492-.414-.426-.568-.433l-.485-.008c-.168 0-.44.063-.67.314-.231.25-.881.861-.881 2.099 0 1.238.901 2.432 1.027 2.6.125.166 1.78 2.719 4.304 3.813.601.26 1.07.415 1.435.531.603.192 1.151.165 1.584.1.483-.072 1.49-.609 1.7-1.197.21-.588.21-1.092.147-1.197z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/avicennakg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-foreground grid size-10 place-items-center rounded-full border border-current/20 transition-colors hover:border-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-10.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44 0-.795-.644-1.439-1.439-1.439z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/channel/UCdlzRkcZuqWSdxlF02ezbXw"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-muted-foreground hover:text-foreground grid size-10 place-items-center rounded-full border border-current/20 transition-colors hover:border-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
            Филиалы
          </p>
          <ul className="mt-4 space-y-2 text-base">
            {CLINIC.branches.map((branch) => (
              <li key={branch.name}>
                <a
                  href={doubleGisSearchUrl(branch.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                >
                  {branch.city}, {branch.street}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-brand-green text-brand-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-sm font-semibold tracking-wide uppercase">НАШИ ПАРТНЕРЫ</p>
          <ul className="mt-4 space-y-3 text-lg">
            <li>
              <a
                href="https://expresslab.kg/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-green-light inline-flex items-center gap-1.5 transition-colors"
              >
                Экспресс плюс
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://kokomeren.kg/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-green-light inline-flex items-center gap-1.5 transition-colors"
              >
                Кокомерен
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="http://corpus.kg/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-green-light inline-flex items-center gap-1.5 transition-colors"
              >
                Corpus.kg
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm sm:px-6">
          <span>© {new Date().getFullYear()} Медицинская клиника «Авиценна», Бишкек</span>
          <a href="#faq" className="hover:text-foreground">
            Политика конфиденциальности
          </a>
        </div>
      </div>
    </footer>
  );
}

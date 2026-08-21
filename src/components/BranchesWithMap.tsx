import { useState } from "react";
import { MapPin, Navigation, Phone } from "lucide-react";

import { CLINIC, doubleGisSearchUrl, googleMapsDirectionsUrl } from "@/lib/clinic";

const MAPS_KEY = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as
  | string
  | undefined;

function mapSrc(latitude: number, longitude: number) {
  if (MAPS_KEY) {
    return `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${latitude},${longitude}&zoom=16&language=ru`;
  }
  const d = 0.006;
  const bbox = `${longitude - d}%2C${latitude - d}%2C${longitude + d}%2C${latitude + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

/** Карта филиалов: список адресов слева, интерактивная карта справа. */
export function BranchesWithMap() {
  const [active, setActive] = useState(0);
  const branch = CLINIC.branches[active] ?? CLINIC.branches[0]!;
  const phone = CLINIC.phones[0] ?? "";

  return (
    <section id="filialy" className="border-border border-t py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <span className="eyebrow">Наши филиалы</span>
        <h2 className="text-foreground mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
          {CLINIC.branches.length} филиалов в Бишкеке
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl text-base sm:text-lg">
          Выберите адрес в списке — карта покажет ближайший филиал и построит маршрут.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <ul className="grid gap-3">
            {CLINIC.branches.map((b, i) => {
              const isActive = i === active;
              return (
                <li key={b.name}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      isActive
                        ? "border-brand-green bg-surface-green"
                        : "border-border bg-card hover:border-brand-green/40"
                    }`}
                  >
                    <p className="text-foreground flex items-start gap-2 font-bold leading-tight">
                      <MapPin className="text-brand-green mt-0.5 size-4 shrink-0" />
                      {b.street}
                    </p>
                    <p className="text-muted-foreground mt-1 pl-6 text-sm">
                      {b.city}, Кыргызстан
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-border overflow-hidden rounded-2xl border">
            <iframe
              key={branch.name}
              title={`Карта: ${branch.name}`}
              src={mapSrc(branch.latitude, branch.longitude)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full border-0 sm:h-[420px] lg:h-[520px]"
            />
            <div className="bg-card flex flex-wrap items-center gap-2 p-4">
              <a
                href={googleMapsDirectionsUrl(branch.latitude, branch.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-green text-brand-white hover:bg-brand-green-dark inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
              >
                <Navigation className="size-4" /> Маршрут
              </a>
              <a
                href={doubleGisSearchUrl(branch.street)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground ring-border hover:bg-surface-green inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-bold ring-1 ring-inset transition-colors"
              >
                2ГИС
              </a>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="text-foreground ring-border hover:bg-surface-green inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ring-1 ring-inset transition-colors"
                >
                  <Phone className="size-4" /> Позвонить
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

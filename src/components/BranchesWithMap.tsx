import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Phone } from "lucide-react";

import { CLINIC, doubleGisSearchUrl, googleMapsDirectionsUrl } from "@/lib/clinic";

const MAPS_KEY = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as
  | string
  | undefined;
const TRACKING_ID = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] as
  | string
  | undefined;

const GREEN_PIN =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
      <path d="M20 1C10.6 1 3 8.6 3 18c0 12 17 33 17 33s17-21 17-33C37 8.6 29.4 1 20 1z" fill="#16a34a" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="20" cy="18" r="6.5" fill="#ffffff"/>
    </svg>`,
  );

const ACTIVE_PIN =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="62" viewBox="0 0 40 52">
      <path d="M20 1C10.6 1 3 8.6 3 18c0 12 17 33 17 33s17-21 17-33C37 8.6 29.4 1 20 1z" fill="#0f7a37" stroke="#ffffff" stroke-width="3"/>
      <circle cx="20" cy="18" r="6.5" fill="#bbf7d0"/>
    </svg>`,
  );

let mapsLoader: Promise<void> | null = null;

function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).google?.maps) return Promise.resolve();
  if (mapsLoader) return mapsLoader;

  mapsLoader = new Promise<void>((resolve, reject) => {
    if (!MAPS_KEY) {
      reject(new Error("no-key"));
      return;
    }
    const cbName = "__initAvicennaMap";
    (window as any)[cbName] = () => resolve();
    const script = document.createElement("script");
    const channel = TRACKING_ID ? `&channel=${TRACKING_ID}` : "";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&loading=async&callback=${cbName}&language=ru${channel}`;
    script.async = true;
    script.onerror = () => reject(new Error("maps-load-failed"));
    document.head.appendChild(script);
  });
  return mapsLoader;
}

/** Карта филиалов с зелёными интерактивными метками. */
export function BranchesWithMap() {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoRef = useRef<any>(null);

  const branches = CLINIC.branches;
  const branch = branches[active] ?? branches[0]!;
  const phone = CLINIC.phones[0] ?? "";

  useEffect(() => {
    let cancelled = false;
    loadMaps()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        const g = (window as any).google;
        const map = new g.maps.Map(containerRef.current, {
          center: { lat: branches[0]!.latitude, lng: branches[0]!.longitude },
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        mapRef.current = map;
        infoRef.current = new g.maps.InfoWindow();

        const bounds = new g.maps.LatLngBounds();
        markersRef.current = branches.map((b, i) => {
          const position = { lat: b.latitude, lng: b.longitude };
          bounds.extend(position);
          const marker = new g.maps.Marker({
            position,
            map,
            title: b.street,
            icon: { url: GREEN_PIN, scaledSize: new g.maps.Size(32, 42) },
          });
          marker.addListener("click", () => setActive(i));
          return marker;
        });
        map.fitBounds(bounds, 48);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [branches]);

  // Подсветка активной метки, центрирование и всплывающая подсказка с адресом
  useEffect(() => {
    const g = (window as any).google;
    if (!g?.maps || !mapRef.current || markersRef.current.length === 0) return;
    markersRef.current.forEach((marker, i) => {
      const isActive = i === active;
      marker.setIcon({
        url: isActive ? ACTIVE_PIN : GREEN_PIN,
        scaledSize: new g.maps.Size(isActive ? 38 : 32, isActive ? 49 : 42),
      });
      marker.setZIndex(isActive ? 10 : 1);
    });
    const b = branches[active];
    const marker = markersRef.current[active];
    if (b && marker && infoRef.current) {
      const escape = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
      infoRef.current.setContent(
        `<div style="font-family:inherit;max-width:220px">
           <div style="font-weight:700;font-size:14px;color:#111">${escape(b.street)}</div>
           <div style="font-size:12px;color:#555;margin-top:2px">${escape(b.city)}, Кыргызстан</div>
           <a href="${googleMapsDirectionsUrl(b.latitude, b.longitude, `${b.street}, ${b.city}`)}" target="_blank" rel="noopener noreferrer"
              style="display:inline-block;margin-top:6px;font-size:12px;font-weight:700;color:#16a34a">Маршрут →</a>
         </div>`,
      );
      infoRef.current.open({ map: mapRef.current, anchor: marker });
      mapRef.current.panTo({ lat: b.latitude, lng: b.longitude });
    }
  }, [active, branches]);


  return (
    <section id="filialy" className="border-border border-t py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <span className="eyebrow">Наши филиалы</span>
        <h2 className="text-foreground mt-2 text-xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl">
          {branches.length} филиалов в Бишкеке
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-[15px] sm:text-base">
          Нажмите на адрес или зелёную метку — карта покажет нужный филиал.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          {/* Список адресов: горизонтальный скролл на мобильном */}
          <ul className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:gap-2 lg:overflow-visible lg:px-0">
            {branches.map((b, i) => {
              const isActive = i === active;
              return (
                <li key={b.name} className="w-[220px] shrink-0 snap-start lg:w-auto">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`h-full w-full rounded-xl border p-3 text-left transition-colors ${
                      isActive
                        ? "border-brand-green bg-surface-green"
                        : "border-border bg-card hover:border-brand-green/40"
                    }`}
                  >
                    <p className="text-foreground flex items-start gap-2 text-[14px] font-bold leading-snug">
                      <MapPin className="text-brand-green mt-0.5 size-4 shrink-0" />
                      <span className="min-w-0">{b.street}</span>
                    </p>
                    <p className="text-muted-foreground mt-1 pl-6 text-[12px]">
                      {b.city}, Кыргызстан
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-border overflow-hidden rounded-2xl border">
            {failed ? (
              <iframe
                title={`Карта: ${branch.name}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${branch.longitude - 0.02}%2C${branch.latitude - 0.02}%2C${branch.longitude + 0.02}%2C${branch.latitude + 0.02}&layer=mapnik&marker=${branch.latitude}%2C${branch.longitude}`}
                loading="lazy"
                className="h-[240px] w-full border-0 sm:h-[300px] lg:h-[360px]"
              />
            ) : (
              <div
                ref={containerRef}
                role="application"
                aria-label="Карта филиалов клиники «Авиценна»"
                className="bg-surface-soft h-[240px] w-full sm:h-[300px] lg:h-[360px]"
              />
            )}
            <div className="bg-card flex flex-wrap items-center gap-2 p-3">
              <a
                href={googleMapsDirectionsUrl(branch.latitude, branch.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-green text-brand-white hover:bg-brand-green-dark inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition-colors"
              >
                <Navigation className="size-4" /> Маршрут
              </a>
              <a
                href={doubleGisSearchUrl(branch.street)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground ring-border hover:bg-surface-green inline-flex items-center rounded-xl px-4 py-2 text-[13px] font-bold ring-1 ring-inset transition-colors"
              >
                2ГИС
              </a>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="text-foreground ring-border hover:bg-surface-green inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold ring-1 ring-inset transition-colors"
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

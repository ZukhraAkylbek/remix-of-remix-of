import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { absoluteUrl } from "@/lib/clinic";

export type Crumb = { label: string; href?: string };

/** Хлебные крошки с переходами и микроразметкой BreadcrumbList. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: "Главная", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) || item.href } : {}),
    })),
  };

  return (
    <nav aria-label="Хлебные крошки" className="border-border bg-surface-soft border-b">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="text-muted-foreground mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 py-3 text-sm sm:px-6">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-brand-green font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground font-semibold" : "font-medium"}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

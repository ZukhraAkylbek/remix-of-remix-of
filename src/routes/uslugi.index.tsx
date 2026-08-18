import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DiagnosticsIcon } from "@/components/DiagnosticsIcon";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl } from "@/lib/clinic";
import { servicePagesQueryOptions } from "@/lib/services.queries";

const TITLE = "Услуги клиники «Авиценна» в Бишкеке — полный список";
const DESCRIPTION =
  "Все услуги клиники «Авиценна»: диагностика, консультации специалистов, хирургия, анализы, стационар, услуги на дому, вакцинация, физиотерапия, рассрочка.";

export const Route = createFileRoute("/uslugi/")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(servicePagesQueryOptions());
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/uslugi") || "/uslugi" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const { data: services } = useSuspenseQuery(servicePagesQueryOptions());

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="Услуги" />
      <Breadcrumbs items={[{ label: "Услуги" }]} />

      <main>
        <section className="border-border border-b py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="eyebrow">Что вас интересует</p>
            <h1 className="text-foreground mt-4 text-4xl leading-[1.08] font-extrabold sm:text-5xl">
              Услуги клиники «Авиценна»
            </h1>
            <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-relaxed">
              Выберите нужное направление — откроется страница с описанием, показаниями, врачами,
              адресом и ответами на частые вопросы.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Каталог"
              title="Все услуги"
              description="Нажмите на плитку, чтобы посмотреть подробности"
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Reveal key={service.slug} delay={index * 40}>
                  <Link
                    to="/uslugi/$slug"
                    params={{ slug: service.slug }}
                    className="card-lift border-border hover:border-brand-green group flex h-full flex-col gap-3 rounded-2xl border p-6 transition-colors"
                  >
                    <DiagnosticsIcon icon={service.icon} title={service.title} />
                    <span className="text-foreground text-lg font-bold">{service.title}</span>
                    {service.summary && (
                      <span className="text-muted-foreground text-sm leading-relaxed">
                        {service.summary}
                      </span>
                    )}
                    <span className="text-brand-green mt-auto inline-flex items-center gap-2 pt-3 text-sm font-semibold">
                      Подробнее
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
            {services.length === 0 && (
              <p className="text-muted-foreground mt-10">Услуги пока не добавлены.</p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

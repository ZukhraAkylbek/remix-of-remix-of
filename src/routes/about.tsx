import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageBlocks } from "@/components/page-blocks/PageBlocks";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl } from "@/lib/clinic";
import { pageQueryOptions } from "@/lib/pages.queries";

export const Route = createFileRoute("/about")({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(pageQueryOptions("/about"));
    if (!data) throw notFound();
    return {
      title: data.meta_title || data.h1_title || data.title,
      description: data.meta_description || "",
    };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ? `${loaderData.title} — клиника «Авиценна»` : "О нас — клиника «Авиценна»";
    return {
      meta: [
        { title },
        { name: "description", content: loaderData?.description || "" },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData?.description || "" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: absoluteUrl("/about") || "/about" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: absoluteUrl("/about") || "/about" }],
    };
  },
  notFoundComponent: () => (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="О нас" />
      <Breadcrumbs items={[{ label: "О нас" }]} />
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">Страница не найдена</h1>
      </main>
      <SiteFooter />
    </div>
  ),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useSuspenseQuery(pageQueryOptions("/about"));
  if (!data) return null;

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader breadcrumb="О нас" />
      <Breadcrumbs items={[{ label: "О нас" }]} />
      <main>
        <PageBlocks blocks={data.blocks} />
      </main>
      <SiteFooter />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { HOME_HERO_IMAGE, HomeV3 } from "@/components/HomeV3";
import { absoluteUrl } from "@/lib/clinic";

const TITLE = "Авиценна — забота о здоровье всей семьи в одной клинике";
const DESCRIPTION =
  "Врачи, анализы, диагностика, хирургия и стационар в Бишкеке. Запишитесь онлайн за минуту — круглосуточные направления работают 24/7.";

export const Route = createFileRoute("/glavnaya-v3")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") || "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [
      // Каноничная версия этой страницы теперь главная.
      { rel: "canonical", href: absoluteUrl("/") || "/" },
      { rel: "preload", as: "image", href: HOME_HERO_IMAGE, fetchpriority: "high" },
    ],
  }),
  component: HomeV3,
});

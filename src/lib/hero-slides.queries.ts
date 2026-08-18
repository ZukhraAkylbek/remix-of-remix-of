import { queryOptions } from "@tanstack/react-query";

import { fetchActiveHeroSlides } from "./hero-slides";

export const activeHeroSlidesQueryOptions = () =>
  queryOptions({
    queryKey: ["hero-slides", "active"],
    queryFn: fetchActiveHeroSlides,
    staleTime: 5 * 60_000,
  });

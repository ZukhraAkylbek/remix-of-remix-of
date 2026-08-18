import { queryOptions } from "@tanstack/react-query";

import { fetchServicePage, fetchServicePages } from "./services.functions";

export const servicePagesQueryOptions = () =>
  queryOptions({
    queryKey: ["services"],
    queryFn: () => fetchServicePages(),
  });

export const servicePageQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["services", slug],
    queryFn: () => fetchServicePage({ data: { slug } }),
  });

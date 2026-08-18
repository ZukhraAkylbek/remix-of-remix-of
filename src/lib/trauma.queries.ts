import { queryOptions } from "@tanstack/react-query";

import { fetchTraumaPage } from "./trauma.functions";

export const traumaPageQueryOptions = () =>
  queryOptions({
    queryKey: ["trauma"],
    queryFn: () => fetchTraumaPage(),
  });

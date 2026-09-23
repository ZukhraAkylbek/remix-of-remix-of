import { queryOptions } from "@tanstack/react-query";

import { fetchAllDoctors } from "./doctors.functions";

export const doctorsQueryOptions = () =>
  queryOptions({
    queryKey: ["doctors"],
    queryFn: () => fetchAllDoctors(),
  });

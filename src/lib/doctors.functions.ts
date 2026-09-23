import { createServerFn } from "@tanstack/react-start";

import { listAllDoctors } from "./doctors.server";

export const fetchAllDoctors = createServerFn({ method: "GET" }).handler(
  async () => listAllDoctors(),
);

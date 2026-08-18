import { createServerFn } from "@tanstack/react-start";

export const fetchTraumaPage = createServerFn({ method: "GET" }).handler(async () => {
  const { listTraumaSections, listTraumaDoctors } = await import("./trauma.server");
  const [sections, doctors] = await Promise.all([listTraumaSections(), listTraumaDoctors()]);
  return { sections, doctors };
});

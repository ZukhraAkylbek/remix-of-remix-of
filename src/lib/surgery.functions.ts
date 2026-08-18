import { createServerFn } from "@tanstack/react-start";

export const fetchSurgeryPage = createServerFn({ method: "GET" }).handler(async () => {
  const { listSurgerySections, listSurgeryDirections, listSurgeons } = await import(
    "./surgery.server"
  );

  const [sections, directions, doctors] = await Promise.all([
    listSurgerySections(),
    listSurgeryDirections(),
    listSurgeons(),
  ]);

  return { sections, directions, doctors };
});

export const fetchSurgeryDirection = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }) => {
    const { getSurgeryDirection, listDirectionDoctors } = await import("./surgery.server");
    const direction = await getSurgeryDirection(data.slug);
    if (!direction) return null;
    const doctors = await listDirectionDoctors(direction.slug, direction.doctor_slugs);
    return { ...direction, doctors };
  });

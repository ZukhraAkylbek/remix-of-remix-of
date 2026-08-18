import { createServerFn } from "@tanstack/react-start";

export const fetchServicePages = createServerFn({ method: "GET" }).handler(async () => {
  const { listServicePages } = await import("./services.server");
  return listServicePages();
});

export const fetchServicePage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }) => {
    const { getServicePage } = await import("./services.server");
    return getServicePage(data.slug);
  });

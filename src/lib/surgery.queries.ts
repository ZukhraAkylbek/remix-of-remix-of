import { queryOptions } from "@tanstack/react-query";

import { fetchSurgeryDirection, fetchSurgeryPage } from "./surgery.functions";

export const surgeryPageQueryOptions = () =>
  queryOptions({
    queryKey: ["surgery"],
    queryFn: () => fetchSurgeryPage(),
  });

export const surgeryDirectionQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["surgery", "direction", slug],
    queryFn: () => fetchSurgeryDirection({ data: { slug } }),
  });

/** Разбор многострочных полей: «Заголовок — описание» на строку. */
export type ParsedRow = { title: string; text?: string };

export function parseRows(value: string | null | undefined): ParsedRow[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s+—\s+/);
      const title = parts.shift() ?? line;
      const text = parts.join(" — ").trim();
      return text ? { title, text } : { title };
    });
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { PageHeader, Panel } from "@/components/admin/PageHeader";
import { HEADER_NAV_SLOTS } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { fetchSiteContent } from "@/lib/site-content";
import { useSiteRefresh } from "@/lib/admin-refresh";

export const Route = createFileRoute("/_authenticated/admin/header")({
  head: () => ({
    meta: [
      { title: "Меню хедера — админка Avicenna" },
      {
        name: "description",
        content: "Настройка пунктов верхнего меню сайта клиники «Авиценна».",
      },
      { property: "og:title", content: "Меню хедера — админка Avicenna" },
      { property: "og:description", content: "Названия и адреса пунктов верхнего меню." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminHeaderNav,
});

function AdminHeaderNav() {
  const refreshSite = useSiteRefresh();
  const { data } = useQuery({ queryKey: ["site-content"], queryFn: fetchSiteContent });
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data) return;
    const next: Record<string, string> = {};
    HEADER_NAV_SLOTS.forEach((slot, i) => {
      const n = i + 1;
      next[`header.nav.${n}.label`] = data[`header.nav.${n}.label`]?.value ?? slot.label;
      next[`header.nav.${n}.href`] = data[`header.nav.${n}.href`]?.value ?? slot.href;
    });
    setValues(next);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Меню хедера сохранено");
      void refreshSite();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const set = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <PageHeader
        eyebrow="Хедер"
        title="Верхнее меню"
        description="Пункты меню в шапке сайта, слева направо. Адрес: внутренний (/about, /checkups, /#uslugi) или внешняя ссылка (https://…). Оставьте название пустым, чтобы скрыть пункт."
      />

      <Panel title="Пункты меню" description="Порядок такой же, как на сайте">
        <div className="space-y-5">
          {HEADER_NAV_SLOTS.map((slot, i) => {
            const n = i + 1;
            return (
              <div key={n} className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <p className="text-admin-muted text-[12px] font-bold uppercase tracking-wide">
                    Пункт {n}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`h-label-${n}`}>Название</Label>
                  <Input
                    id={`h-label-${n}`}
                    value={values[`header.nav.${n}.label`] ?? ""}
                    placeholder={slot.label}
                    onChange={(e) => set(`header.nav.${n}.label`, e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`h-href-${n}`}>Адрес страницы</Label>
                  <Input
                    id={`h-href-${n}`}
                    value={values[`header.nav.${n}.href`] ?? ""}
                    placeholder={slot.href}
                    onChange={(e) => set(`header.nav.${n}.href`, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Сохраняем…" : "Сохранить"}
          </Button>
        </div>
      </Panel>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PageHeader, Panel } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllPopups, fetchLeads, type Popup } from "@/lib/popups";

export const Route = createFileRoute("/_authenticated/admin/popups")({
  head: () => ({
    meta: [
      { title: "Попапы и заявки — админка Avicenna" },
      {
        name: "description",
        content: "Настройка всплывающего окна с заявкой и просмотр заявок с сайта.",
      },
      { property: "og:title", content: "Попапы и заявки — админка Avicenna" },
      { property: "og:description", content: "Оффер, задержка показа и список заявок." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPopups,
});

const EMPTY: Partial<Popup> = {
  title: "Оставьте заявку",
  body: "",
  offer_note: "",
  button_text: "Отправить заявку",
  success_text: "Спасибо! Мы перезвоним вам в ближайшее время.",
  image_url: "",
  delay_seconds: 30,
  is_active: true,
  show_form: true,
  sort_order: 1,
};

function AdminPopups() {
  const qc = useQueryClient();
  const { data: popups } = useQuery({ queryKey: ["popups", "all"], queryFn: fetchAllPopups });
  const { data: leads } = useQuery({ queryKey: ["leads"], queryFn: fetchLeads });

  const [form, setForm] = useState<Partial<Popup>>(EMPTY);

  useEffect(() => {
    if (popups && popups.length > 0) setForm(popups[0]!);
  }, [popups]);

  const set = <K extends keyof Popup>(key: K, value: Popup[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: (form.title ?? "").trim() || "Оставьте заявку",
        body: form.body ?? null,
        offer_note: form.offer_note ?? null,
        image_url: form.image_url || null,
        button_text: form.button_text ?? null,
        button_url: form.button_url || null,
        success_text: form.success_text ?? null,
        show_form: form.show_form ?? true,
        delay_seconds: Number(form.delay_seconds ?? 30) || 30,
        is_active: form.is_active ?? true,
        sort_order: form.sort_order ?? 1,
      };
      const { error } = form.id
        ? await supabase.from("popups").update(payload).eq("id", form.id)
        : await supabase.from("popups").insert(payload);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Попап сохранён");
      void qc.invalidateQueries({ queryKey: ["popups"] });
      void qc.invalidateQueries({ queryKey: ["popup", "active"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleProcessed = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("leads").update({ is_processed: value }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["leads"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        eyebrow="Маркетинг"
        title="Попап с заявкой"
        description="Всплывающее окно показывается посетителю через заданное количество секунд (по умолчанию 30) один раз за визит. Здесь же — все заявки с сайта."
      />

      <Panel title="Содержимое попапа" description="Оффер, тексты и задержка показа">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p-title">Заголовок</Label>
            <Input
              id="p-title"
              value={form.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p-body">Описание</Label>
            <Textarea
              id="p-body"
              rows={3}
              value={form.body ?? ""}
              onChange={(e) => set("body", e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p-offer">Оффер (выделенная плашка)</Label>
            <Input
              id="p-offer"
              value={form.offer_note ?? ""}
              onChange={(e) => set("offer_note", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-btn">Текст кнопки</Label>
            <Input
              id="p-btn"
              value={form.button_text ?? ""}
              onChange={(e) => set("button_text", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-delay">Задержка показа, сек</Label>
            <Input
              id="p-delay"
              type="number"
              min={0}
              value={form.delay_seconds ?? 30}
              onChange={(e) => set("delay_seconds", Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p-success">Текст после отправки</Label>
            <Input
              id="p-success"
              value={form.success_text ?? ""}
              onChange={(e) => set("success_text", e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p-image">Картинка (ссылка, необязательно)</Label>
            <Input
              id="p-image"
              value={form.image_url ?? ""}
              onChange={(e) => set("image_url", e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-[14px] font-medium">
            <input
              type="checkbox"
              checked={form.is_active ?? true}
              onChange={(e) => set("is_active", e.target.checked)}
            />
            Показывать на сайте
          </label>
          <label className="flex items-center gap-2 text-[14px] font-medium">
            <input
              type="checkbox"
              checked={form.show_form ?? true}
              onChange={(e) => set("show_form", e.target.checked)}
            />
            Показывать поля для заявки
          </label>
          {!form.show_form && (
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-url">Ссылка кнопки (если без формы)</Label>
              <Input
                id="p-url"
                value={form.button_url ?? ""}
                onChange={(e) => set("button_url", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Сохраняем…" : "Сохранить"}
          </Button>
        </div>
      </Panel>

      <Panel className="mt-6" title="Заявки с сайта" description="Последние 200 заявок">
        {!leads || leads.length === 0 ? (
          <p className="text-admin-muted text-[14px]">Заявок пока нет.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="text-admin-muted text-[12px] uppercase">
                <tr>
                  <th className="py-2 pr-4">Дата</th>
                  <th className="py-2 pr-4">Имя</th>
                  <th className="py-2 pr-4">Телефон</th>
                  <th className="py-2 pr-4">Комментарий</th>
                  <th className="py-2 pr-4">Страница</th>
                  <th className="py-2">Обработана</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-admin-line border-t align-top">
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleString("ru-RU")}
                    </td>
                    <td className="py-2 pr-4">{lead.name}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{lead.phone}</td>
                    <td className="py-2 pr-4">{lead.comment}</td>
                    <td className="py-2 pr-4">{lead.source}</td>
                    <td className="py-2">
                      <input
                        type="checkbox"
                        checked={lead.is_processed}
                        onChange={(e) =>
                          toggleProcessed.mutate({ id: lead.id, value: e.target.checked })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}

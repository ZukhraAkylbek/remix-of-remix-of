import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

import { PageHeader, Panel } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { SITE_IMAGES_BUCKET } from "@/lib/site-content";
import { useSiteRefresh } from "@/lib/admin-refresh";

export const Route = createFileRoute("/_authenticated/admin/trauma")({
  head: () => ({
    meta: [
      { title: "Травмпункт — админка Avicenna" },
      {
        name: "description",
        content: "Редактирование блоков страницы «Травмпункт 24/7»: тексты, списки, цены и FAQ.",
      },
      { property: "og:title", content: "Травмпункт — админка Avicenna" },
      { property: "og:description", content: "Блоки страницы травмпункта." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminTrauma,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё-]+/gi, "-")
    .replace(/^-+|-+$/g, "");

type SectionRow = {
  id: string;
  key: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  primary_label: string | null;
  primary_url: string | null;
  secondary_label: string | null;
  secondary_url: string | null;
  sort_order: number;
  is_active: boolean;
};

const SELECT =
  "id, key, title, subtitle, body, image_url, primary_label, primary_url, secondary_label, secondary_url, sort_order, is_active";

const LIST_HINT =
  "По строке на пункт. Формат: «Заголовок — описание». Для цен: «Услуга — 500 с», для FAQ: «Вопрос — ответ».";

function AdminTrauma() {
  const queryClient = useQueryClient();
  const refreshSite = useSiteRefresh();
  const [draft, setDraft] = useState<Partial<SectionRow> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-trauma"] });
    void refreshSite();
  };

  const { data: sections } = useQuery({
    queryKey: ["admin-trauma", "sections"],
    queryFn: async (): Promise<SectionRow[]> => {
      const { data, error } = await supabase
        .from("trauma_sections")
        .select(SELECT)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Partial<SectionRow>) => {
      const payload = {
        key: values.key?.trim() || slugify(values.title ?? "") || `block-${Date.now()}`,
        title: (values.title ?? "").trim(),
        subtitle: values.subtitle ?? null,
        body: values.body ?? null,
        image_url: values.image_url ?? null,
        primary_label: values.primary_label ?? null,
        primary_url: values.primary_url ?? null,
        secondary_label: values.secondary_label ?? null,
        secondary_url: values.secondary_url ?? null,
        is_active: values.is_active ?? true,
        sort_order: values.sort_order ?? (sections?.length ?? 0) + 1,
      };
      if (!payload.title) throw new Error("Укажите название блока");
      if (values.id) {
        const { error } = await supabase.from("trauma_sections").update(payload).eq("id", values.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("trauma_sections").insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Блок сохранён");
      setDraft(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trauma_sections").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Блок удалён");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("trauma_sections").update({ is_active }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `trauma/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from(SITE_IMAGES_BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw new Error(error.message);
      const { data, error: signError } = await supabase.storage
        .from(SITE_IMAGES_BUCKET)
        .createSignedUrl(path, 60 * 60 * 24 * 3650);
      if (signError) throw new Error(signError.message);
      setDraft((prev) => (prev ? { ...prev, image_url: data?.signedUrl ?? null } : prev));
      toast.success("Изображение загружено");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Раздел сайта"
        title="Травмпункт 24/7"
        description="Все блоки страницы /travmpunkt: оффер, срочные состояния, помощь, процедуры, дети, оснащение, цены, этапы, FAQ и финальный блок."
        actions={
          <Button
            className="bg-admin-blue hover:bg-admin-blue/90 h-11 rounded-xl font-semibold text-white"
            onClick={() => setDraft({ is_active: true })}
          >
            <Plus className="mr-1.5 size-4" /> Блок
          </Button>
        }
      />

      <Panel title="Блоки страницы">
        <ul className="grid gap-3">
          {(sections ?? []).map((section) => (
            <li
              key={section.id}
              className="border-admin-line grid gap-3 rounded-xl border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="text-[15px] font-bold">{section.title}</p>
                <p className="text-admin-muted truncate text-[13px]">
                  {section.key}
                  {section.subtitle ? ` · ${section.subtitle}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={section.is_active}
                  onCheckedChange={(is_active) => toggle.mutate({ id: section.id, is_active })}
                />
                <Button
                  variant="outline"
                  className="border-admin-line h-9 rounded-lg"
                  onClick={() => setDraft(section)}
                >
                  Изменить
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive h-9 rounded-lg"
                  onClick={() => remove.mutate(section.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
          {(sections ?? []).length === 0 && (
            <li className="text-admin-muted text-[14px]">Блоков пока нет.</li>
          )}
        </ul>
      </Panel>

      <Sheet open={!!draft} onOpenChange={(open) => !open && setDraft(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{draft?.id ? "Блок страницы" : "Новый блок"}</SheetTitle>
            <SheetDescription>Тексты, списки, картинка и кнопки блока.</SheetDescription>
          </SheetHeader>
          {draft && (
            <div className="grid gap-4 p-4">
              <Field label="Ключ блока" hint="hero, urgent, help, procedures, prices, faq…">
                <Input
                  value={draft.key ?? ""}
                  onChange={(e) => setDraft({ ...draft, key: e.target.value })}
                />
              </Field>
              <Field label="Заголовок">
                <Input
                  value={draft.title ?? ""}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </Field>
              <Field label="Подзаголовок">
                <Textarea
                  rows={2}
                  value={draft.subtitle ?? ""}
                  onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                />
              </Field>
              <Field label="Список пунктов" hint={LIST_HINT}>
                <Textarea
                  rows={10}
                  value={draft.body ?? ""}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                />
              </Field>
              <Field label="Кнопка — текст">
                <Input
                  value={draft.primary_label ?? ""}
                  onChange={(e) => setDraft({ ...draft, primary_label: e.target.value })}
                />
              </Field>
              <Field label="Кнопка — ссылка">
                <Input
                  value={draft.primary_url ?? ""}
                  onChange={(e) => setDraft({ ...draft, primary_url: e.target.value })}
                />
              </Field>
              <Field label="Вторая кнопка — текст">
                <Input
                  value={draft.secondary_label ?? ""}
                  onChange={(e) => setDraft({ ...draft, secondary_label: e.target.value })}
                />
              </Field>
              <Field label="Вторая кнопка — ссылка">
                <Input
                  value={draft.secondary_url ?? ""}
                  onChange={(e) => setDraft({ ...draft, secondary_url: e.target.value })}
                />
              </Field>
              <Field label="Изображение">
                <div className="flex items-center gap-3">
                  <Input
                    value={draft.image_url ?? ""}
                    onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImage(file);
                    }}
                  />
                  <Button
                    variant="outline"
                    className="border-admin-line shrink-0"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="mr-1.5 size-4" /> Загрузить
                  </Button>
                </div>
              </Field>
              <Field label="Порядок">
                <Input
                  type="number"
                  value={draft.sort_order ?? 0}
                  onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                />
              </Field>
              <div className="flex items-center gap-3">
                <Switch
                  checked={draft.is_active ?? true}
                  onCheckedChange={(is_active) => setDraft({ ...draft, is_active })}
                />
                <span className="text-[14px]">Показывать на сайте</span>
              </div>
              <Button
                className="bg-admin-blue hover:bg-admin-blue/90 h-11 rounded-xl font-semibold text-white"
                disabled={save.isPending}
                onClick={() => save.mutate(draft)}
              >
                Сохранить блок
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-[13px] font-semibold">{label}</Label>
      {children}
      {hint && <p className="text-admin-muted text-[12px]">{hint}</p>}
    </div>
  );
}

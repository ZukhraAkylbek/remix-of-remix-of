import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";

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

export const Route = createFileRoute("/_authenticated/admin/services")({
  head: () => ({
    meta: [
      { title: "Услуги — админка Avicenna" },
      {
        name: "description",
        content: "Конструктор страниц услуг: блоки, порядок, видимость, тексты и изображения.",
      },
      { property: "og:title", content: "Услуги — админка Avicenna" },
      { property: "og:description", content: "Редактирование раздела /uslugi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminServices,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-+|-+$/g, "");

type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  icon: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  is_active: boolean;
};

type BlockRow = {
  id: string;
  service_id: string;
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

const SERVICE_SELECT =
  "id, slug, title, summary, icon, image_url, meta_title, meta_description, sort_order, is_active";
const BLOCK_SELECT =
  "id, service_id, key, title, subtitle, body, image_url, primary_label, primary_url, secondary_label, secondary_url, sort_order, is_active";

const TEMPLATE: { key: string; title: string; subtitle?: string }[] = [
  { key: "hero", title: "Оффер" },
  { key: "when", title: "Когда обращаться", subtitle: "Симптомы и показания" },
  { key: "available", title: "Что доступно", subtitle: "Услуги и процедуры" },
  { key: "important", title: "Важно знать", subtitle: "Ограничения и подготовка" },
  { key: "why", title: "Почему «Авиценна»" },
  { key: "doctors", title: "Врачи направления", subtitle: "Специалисты, которые ведут приём" },
  { key: "contacts", title: "Адрес и режим работы" },
  { key: "faq", title: "Частые вопросы" },
  { key: "final", title: "Запишитесь на приём" },
];

const LIST_HINT =
  "По строке на пункт, формат «Заголовок — описание». Для FAQ: «Вопрос — ответ». Для блока «Врачи» указывайте slug врача в строке.";

function AdminServices() {
  const queryClient = useQueryClient();
  const refreshSite = useSiteRefresh();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [serviceDraft, setServiceDraft] = useState<Partial<ServiceRow> | null>(null);
  const [blockDraft, setBlockDraft] = useState<Partial<BlockRow> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    void refreshSite();
  };

  const { data: services } = useQuery({
    queryKey: ["admin-services", "list"],
    queryFn: async (): Promise<ServiceRow[]> => {
      const { data, error } = await supabase
        .from("service_pages")
        .select(SERVICE_SELECT)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const current = services?.find((s) => s.id === activeId) ?? services?.[0] ?? null;

  const { data: blocks } = useQuery({
    queryKey: ["admin-services", "blocks", current?.id],
    enabled: !!current?.id,
    queryFn: async (): Promise<BlockRow[]> => {
      const { data, error } = await supabase
        .from("service_blocks")
        .select(BLOCK_SELECT)
        .eq("service_id", current!.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const saveService = useMutation({
    mutationFn: async (values: Partial<ServiceRow>) => {
      const payload = {
        slug: values.slug?.trim() || slugify(values.title ?? "") || `usluga-${Date.now()}`,
        title: (values.title ?? "").trim(),
        summary: values.summary ?? null,
        icon: values.icon ?? null,
        image_url: values.image_url ?? null,
        meta_title: values.meta_title ?? null,
        meta_description: values.meta_description ?? null,
        sort_order: values.sort_order ?? ((services?.length ?? 0) + 1) * 10,
        is_active: values.is_active ?? true,
      };
      if (!payload.title) throw new Error("Укажите название услуги");

      if (values.id) {
        const { error } = await supabase.from("service_pages").update(payload).eq("id", values.id);
        if (error) throw new Error(error.message);
        return values.id;
      }
      const { data, error } = await supabase
        .from("service_pages")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw new Error(error.message);

      const { error: blocksError } = await supabase.from("service_blocks").insert(
        TEMPLATE.map((block, index) => ({
          service_id: data.id,
          key: block.key,
          title: block.title,
          subtitle: block.subtitle ?? null,
          sort_order: (index + 1) * 10,
        })),
      );
      if (blocksError) throw new Error(blocksError.message);
      return data.id as string;
    },
    onSuccess: (id) => {
      toast.success("Услуга сохранена");
      setServiceDraft(null);
      setActiveId(id);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("service_pages").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Услуга удалена");
      setActiveId(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleService = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("service_pages").update({ is_active }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const saveBlock = useMutation({
    mutationFn: async (values: Partial<BlockRow>) => {
      const serviceId = values.service_id ?? current?.id;
      if (!serviceId) throw new Error("Сначала выберите услугу");
      const payload = {
        service_id: serviceId,
        key: values.key?.trim() || slugify(values.title ?? "") || `block-${Date.now()}`,
        title: (values.title ?? "").trim(),
        subtitle: values.subtitle ?? null,
        body: values.body ?? null,
        image_url: values.image_url ?? null,
        primary_label: values.primary_label ?? null,
        primary_url: values.primary_url ?? null,
        secondary_label: values.secondary_label ?? null,
        secondary_url: values.secondary_url ?? null,
        sort_order: values.sort_order ?? ((blocks?.length ?? 0) + 1) * 10,
        is_active: values.is_active ?? true,
      };
      if (!payload.title) throw new Error("Укажите заголовок блока");


      if (values.id) {
        const { error } = await supabase.from("service_blocks").update(payload).eq("id", values.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("service_blocks").insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Блок сохранён");
      setBlockDraft(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateBlock = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<BlockRow> }) => {
      const { error } = await supabase.from("service_blocks").update(values).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const removeBlock = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("service_blocks").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Блок удалён");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function move(index: number, direction: -1 | 1) {
    const list = blocks ?? [];
    const target = list[index + direction];
    const item = list[index];
    if (!target || !item) return;
    updateBlock.mutate({ id: item.id, values: { sort_order: target.sort_order } });
    updateBlock.mutate({ id: target.id, values: { sort_order: item.sort_order } });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `services/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from(SITE_IMAGES_BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw new Error(error.message);
      const { data, error: signError } = await supabase.storage
        .from(SITE_IMAGES_BUCKET)
        .createSignedUrl(path, 60 * 60 * 24 * 3650);
      if (signError) throw new Error(signError.message);
      setBlockDraft((prev) => (prev ? { ...prev, image_url: data?.signedUrl ?? null } : prev));
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
        title="Услуги"
        description="Страницы раздела /uslugi. У каждой услуги единый шаблон блоков: оффер, когда обращаться, что доступно, важно знать, почему Авиценна, врачи, адрес и режим, FAQ, финальный оффер."
        actions={
          <Button
            className="bg-admin-blue hover:bg-admin-blue/90 h-11 rounded-xl font-semibold text-white"
            onClick={() => setServiceDraft({ is_active: true })}
          >
            <Plus className="mr-1.5 size-4" /> Услуга
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Panel title="Услуги">
          <ul className="grid gap-2">
            {(services ?? []).map((service) => (
              <li key={service.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(service.id)}
                  className={`w-full rounded-xl border px-3 py-2.5 text-left ${
                    current?.id === service.id
                      ? "border-admin-blue bg-admin-blue/5"
                      : "border-admin-line"
                  }`}
                >
                  <span className="block text-[14px] font-bold">{service.title}</span>
                  <span className="text-admin-muted block text-[12px]">
                    /uslugi/{service.slug}
                    {service.is_active ? "" : " · скрыта"}
                  </span>
                </button>
              </li>
            ))}
            {(services ?? []).length === 0 && (
              <li className="text-admin-muted text-[14px]">Услуг пока нет.</li>
            )}
          </ul>
        </Panel>

        <div className="grid gap-5">
          {current && (
            <Panel title={current.title}>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Switch
                  checked={current.is_active}
                  onCheckedChange={(is_active) =>
                    toggleService.mutate({ id: current.id, is_active })
                  }
                />
                <Button
                  variant="outline"
                  className="border-admin-line h-9 rounded-lg"
                  onClick={() => setServiceDraft(current)}
                >
                  Настройки услуги
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive h-9 rounded-lg"
                  onClick={() => removeService.mutate(current.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button
                  className="bg-admin-blue hover:bg-admin-blue/90 h-9 rounded-lg font-semibold text-white"
                  onClick={() => setBlockDraft({ service_id: current.id, is_active: true })}
                >
                  <Plus className="mr-1.5 size-4" /> Блок
                </Button>
              </div>
              <ul className="grid gap-3">

                {(blocks ?? []).map((item, index) => (
                  <li
                    key={item.id}
                    className="border-admin-line grid gap-3 rounded-xl border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold">{item.title}</p>
                      <p className="text-admin-muted truncate text-[13px]">
                        {item.key}
                        {item.subtitle ? ` · ${item.subtitle}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        className="h-9 w-9 rounded-lg p-0"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-9 w-9 rounded-lg p-0"
                        disabled={index === (blocks?.length ?? 0) - 1}
                        onClick={() => move(index, 1)}
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={(is_active) =>
                          updateBlock.mutate({ id: item.id, values: { is_active } })
                        }
                      />
                      <Button
                        variant="outline"
                        className="border-admin-line h-9 rounded-lg"
                        onClick={() => setBlockDraft(item)}
                      >
                        Изменить
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-destructive h-9 rounded-lg"
                        onClick={() => removeBlock.mutate(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
                {(blocks ?? []).length === 0 && (
                  <li className="text-admin-muted text-[14px]">Блоков пока нет.</li>
                )}
              </ul>
            </Panel>
          )}
        </div>
      </div>

      {/* Услуга */}
      <Sheet open={!!serviceDraft} onOpenChange={(open) => !open && setServiceDraft(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{serviceDraft?.id ? "Настройки услуги" : "Новая услуга"}</SheetTitle>
            <SheetDescription>
              Новая услуга сразу получает 9 блоков шаблона — останется заполнить тексты.
            </SheetDescription>
          </SheetHeader>
          {serviceDraft && (
            <div className="grid gap-4 p-4">
              <Field label="Название">
                <Input
                  value={serviceDraft.title ?? ""}
                  onChange={(e) => setServiceDraft({ ...serviceDraft, title: e.target.value })}
                />
              </Field>
              <Field label="Адрес (slug)" hint="Страница будет доступна по /uslugi/slug">
                <Input
                  value={serviceDraft.slug ?? ""}
                  onChange={(e) => setServiceDraft({ ...serviceDraft, slug: e.target.value })}
                />
              </Field>
              <Field label="Краткое описание" hint="Показывается на плитке в каталоге услуг">
                <Textarea
                  rows={3}
                  value={serviceDraft.summary ?? ""}
                  onChange={(e) => setServiceDraft({ ...serviceDraft, summary: e.target.value })}
                />
              </Field>
              <Field label="Иконка" hint="Название иконки, например Stethoscope, Microscope, Home">
                <Input
                  value={serviceDraft.icon ?? ""}
                  onChange={(e) => setServiceDraft({ ...serviceDraft, icon: e.target.value })}
                />
              </Field>
              <Field label="SEO title">
                <Input
                  value={serviceDraft.meta_title ?? ""}
                  onChange={(e) => setServiceDraft({ ...serviceDraft, meta_title: e.target.value })}
                />
              </Field>
              <Field label="SEO description">
                <Textarea
                  rows={3}
                  value={serviceDraft.meta_description ?? ""}
                  onChange={(e) =>
                    setServiceDraft({ ...serviceDraft, meta_description: e.target.value })
                  }
                />
              </Field>
              <Field label="Порядок">
                <Input
                  type="number"
                  value={serviceDraft.sort_order ?? 100}
                  onChange={(e) =>
                    setServiceDraft({ ...serviceDraft, sort_order: Number(e.target.value) })
                  }
                />
              </Field>
              <div className="flex items-center gap-3">
                <Switch
                  checked={serviceDraft.is_active ?? true}
                  onCheckedChange={(is_active) => setServiceDraft({ ...serviceDraft, is_active })}
                />
                <span className="text-[14px]">Показывать на сайте</span>
              </div>
              <Button
                className="bg-admin-blue hover:bg-admin-blue/90 h-11 rounded-xl font-semibold text-white"
                disabled={saveService.isPending}
                onClick={() => saveService.mutate(serviceDraft)}
              >
                Сохранить услугу
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Блок */}
      <Sheet open={!!blockDraft} onOpenChange={(open) => !open && setBlockDraft(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{blockDraft?.id ? "Блок страницы" : "Новый блок"}</SheetTitle>
            <SheetDescription>Тексты, списки, картинка и кнопки блока услуги.</SheetDescription>
          </SheetHeader>
          {blockDraft && (
            <div className="grid gap-4 p-4">
              <Field
                label="Ключ блока"
                hint="hero, when, available, important, why, doctors, contacts, faq, final или свой"
              >
                <Input
                  value={blockDraft.key ?? ""}
                  onChange={(e) => setBlockDraft({ ...blockDraft, key: e.target.value })}
                />
              </Field>
              <Field label="Заголовок">
                <Input
                  value={blockDraft.title ?? ""}
                  onChange={(e) => setBlockDraft({ ...blockDraft, title: e.target.value })}
                />
              </Field>
              <Field label="Подзаголовок">
                <Textarea
                  rows={2}
                  value={blockDraft.subtitle ?? ""}
                  onChange={(e) => setBlockDraft({ ...blockDraft, subtitle: e.target.value })}
                />
              </Field>
              <Field label="Список пунктов" hint={LIST_HINT}>
                <Textarea
                  rows={10}
                  value={blockDraft.body ?? ""}
                  onChange={(e) => setBlockDraft({ ...blockDraft, body: e.target.value })}
                />
              </Field>
              <Field label="Кнопка — текст">
                <Input
                  value={blockDraft.primary_label ?? ""}
                  onChange={(e) => setBlockDraft({ ...blockDraft, primary_label: e.target.value })}
                />
              </Field>
              <Field label="Кнопка — ссылка">
                <Input
                  value={blockDraft.primary_url ?? ""}
                  onChange={(e) => setBlockDraft({ ...blockDraft, primary_url: e.target.value })}
                />
              </Field>
              <Field label="Вторая кнопка — текст">
                <Input
                  value={blockDraft.secondary_label ?? ""}
                  onChange={(e) => setBlockDraft({ ...blockDraft, secondary_label: e.target.value })}
                />
              </Field>
              <Field label="Вторая кнопка — ссылка">
                <Input
                  value={blockDraft.secondary_url ?? ""}
                  onChange={(e) => setBlockDraft({ ...blockDraft, secondary_url: e.target.value })}
                />
              </Field>
              <Field label="Изображение">
                <div className="flex items-center gap-3">
                  <Input
                    value={blockDraft.image_url ?? ""}
                    onChange={(e) => setBlockDraft({ ...blockDraft, image_url: e.target.value })}
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
                  value={blockDraft.sort_order ?? 100}
                  onChange={(e) =>
                    setBlockDraft({ ...blockDraft, sort_order: Number(e.target.value) })
                  }
                />
              </Field>
              <div className="flex items-center gap-3">
                <Switch
                  checked={blockDraft.is_active ?? true}
                  onCheckedChange={(is_active) => setBlockDraft({ ...blockDraft, is_active })}
                />
                <span className="text-[14px]">Показывать на сайте</span>
              </div>
              <Button
                className="bg-admin-blue hover:bg-admin-blue/90 h-11 rounded-xl font-semibold text-white"
                disabled={saveBlock.isPending}
                onClick={() => saveBlock.mutate(blockDraft)}
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

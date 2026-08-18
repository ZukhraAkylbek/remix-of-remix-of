import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

import { PageHeader, Panel } from "@/components/admin/PageHeader";
import { DiagnosticsIcon } from "@/components/DiagnosticsIcon";
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

export const Route = createFileRoute("/_authenticated/admin/surgery")({
  head: () => ({
    meta: [
      { title: "Хирургия — админка Avicenna" },
      {
        name: "description",
        content:
          "Управление разделом «Хирургия»: блоки страницы, направления хирургии и их подстраницы.",
      },
      { property: "og:title", content: "Хирургия — админка Avicenna" },
      {
        property: "og:description",
        content: "Блоки страницы хирургии и подстраницы направлений.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminSurgery,
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

type DirectionRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  icon: string | null;
  image_url: string | null;
  body: string | null;
  diseases: string | null;
  procedures: string | null;
  diagnostics: string | null;
  steps: string | null;
  faq: string | null;
  advantages: string | null;
  symptoms: string | null;
  about_title: string | null;
  doctor_slugs: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  is_active: boolean;
};

const SECTION_SELECT =
  "id, key, title, subtitle, body, image_url, primary_label, primary_url, secondary_label, secondary_url, sort_order, is_active";
const DIRECTION_SELECT =
  "id, slug, title, subtitle, icon, image_url, body, diseases, procedures, diagnostics, steps, faq, advantages, symptoms, about_title, doctor_slugs, meta_title, meta_description, sort_order, is_active";

const LIST_HINT = "По строке на пункт. Формат: «Заголовок — описание» (описание необязательно).";

function AdminSurgery() {
  const queryClient = useQueryClient();
  const refreshSite = useSiteRefresh();
  const [sectionDraft, setSectionDraft] = useState<Partial<SectionRow> | null>(null);
  const [directionDraft, setDirectionDraft] = useState<Partial<DirectionRow> | null>(null);
  const [uploading, setUploading] = useState(false);
  const sectionFileRef = useRef<HTMLInputElement>(null);
  const directionFileRef = useRef<HTMLInputElement>(null);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-surgery"] });
    void refreshSite();
  };

  const { data: sections } = useQuery({
    queryKey: ["admin-surgery", "sections"],
    queryFn: async (): Promise<SectionRow[]> => {
      const { data, error } = await supabase
        .from("surgery_sections")
        .select(SECTION_SELECT)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: directions } = useQuery({
    queryKey: ["admin-surgery", "directions"],
    queryFn: async (): Promise<DirectionRow[]> => {
      const { data, error } = await supabase
        .from("surgery_directions")
        .select(DIRECTION_SELECT)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const saveSection = useMutation({
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
        const { error } = await supabase
          .from("surgery_sections")
          .update(payload)
          .eq("id", values.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("surgery_sections").insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Блок сохранён");
      setSectionDraft(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeSection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("surgery_sections").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Блок удалён");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleSection = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("surgery_sections").update({ is_active }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const saveDirection = useMutation({
    mutationFn: async (values: Partial<DirectionRow>) => {
      const payload = {
        slug: values.slug?.trim() || slugify(values.title ?? "") || `napravlenie-${Date.now()}`,
        title: (values.title ?? "").trim(),
        subtitle: values.subtitle ?? null,
        icon: values.icon ?? null,
        image_url: values.image_url ?? null,
        body: values.body ?? null,
        diseases: values.diseases ?? null,
        procedures: values.procedures ?? null,
        diagnostics: values.diagnostics ?? null,
        steps: values.steps ?? null,
        faq: values.faq ?? null,
        advantages: values.advantages ?? null,
        symptoms: values.symptoms ?? null,
        about_title: values.about_title ?? null,
        doctor_slugs: values.doctor_slugs ?? null,
        meta_title: values.meta_title ?? null,
        meta_description: values.meta_description ?? null,
        is_active: values.is_active ?? true,
        sort_order: values.sort_order ?? (directions?.length ?? 0) + 1,
      };
      if (!payload.title) throw new Error("Укажите название направления");
      if (values.id) {
        const { error } = await supabase
          .from("surgery_directions")
          .update(payload)
          .eq("id", values.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("surgery_directions").insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Направление сохранено");
      setDirectionDraft(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeDirection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("surgery_directions").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Направление удалено");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function uploadImage(file: File, target: "section" | "direction") {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `surgery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from(SITE_IMAGES_BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw new Error(error.message);
      const { data, error: signError } = await supabase.storage
        .from(SITE_IMAGES_BUCKET)
        .createSignedUrl(path, 60 * 60 * 24 * 3650);
      if (signError) throw new Error(signError.message);
      const url = data?.signedUrl ?? null;
      if (target === "section") setSectionDraft((prev) => (prev ? { ...prev, image_url: url } : prev));
      else setDirectionDraft((prev) => (prev ? { ...prev, image_url: url } : prev));
      toast.success("Изображение загружено");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
      if (sectionFileRef.current) sectionFileRef.current.value = "";
      if (directionFileRef.current) directionFileRef.current.value = "";
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Раздел сайта"
        title="Хирургия"
        description="Блоки страницы /hirurgiya и подстраницы направлений хирургии — всё редактируется здесь."
        actions={
          <>
            <Button
              variant="outline"
              className="border-admin-line h-11 rounded-xl"
              onClick={() => setSectionDraft({ is_active: true })}
            >
              <Plus className="mr-1.5 size-4" /> Блок
            </Button>
            <Button
              className="bg-admin-blue hover:bg-admin-blue/90 h-11 rounded-xl font-semibold text-white"
              onClick={() => setDirectionDraft({ is_active: true })}
            >
              <Plus className="mr-1.5 size-4" /> Направление
            </Button>
          </>
        }
      />

      <div className="grid gap-6">
        <Panel
          title="Блоки страницы"
          description="Оффер, преимущества, симптомы, заболевания, операции, диагностика, стационар, этапы, FAQ и финальный оффер."
        >
          <ul className="grid gap-3">
            {(sections ?? []).map((section) => (
              <li
                key={section.id}
                className="border-admin-line grid gap-3 rounded-xl border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-bold">{section.title}</p>
                  <p className="text-admin-muted text-[13px]">
                    {section.key}
                    {section.subtitle ? ` · ${section.subtitle}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={section.is_active}
                    onCheckedChange={(is_active) =>
                      toggleSection.mutate({ id: section.id, is_active })
                    }
                  />
                  <Button
                    variant="outline"
                    className="border-admin-line h-9 rounded-lg"
                    onClick={() => setSectionDraft(section)}
                  >
                    Изменить
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive h-9 rounded-lg"
                    onClick={() => removeSection.mutate(section.id)}
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

        <Panel
          title="Направления хирургии"
          description="Каждое направление — карточка на странице «Хирургия» и отдельная подстраница /hirurgiya/slug."
        >
          <ul className="grid gap-3">
            {(directions ?? []).map((direction) => (
              <li
                key={direction.id}
                className="border-admin-line grid gap-3 rounded-xl border p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
              >
                <DiagnosticsIcon
                  icon={direction.icon}
                  imageUrl={direction.image_url}
                  title={direction.title}
                />
                <div className="min-w-0">
                  <p className="text-[15px] font-bold">{direction.title}</p>
                  <p className="text-admin-muted truncate text-[13px]">
                    /hirurgiya/{direction.slug}
                    {direction.subtitle ? ` · ${direction.subtitle}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-admin-line h-9 rounded-lg"
                    onClick={() => setDirectionDraft(direction)}
                  >
                    Изменить
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive h-9 rounded-lg"
                    onClick={() => removeDirection.mutate(direction.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
            {(directions ?? []).length === 0 && (
              <li className="text-admin-muted text-[14px]">Направлений пока нет.</li>
            )}
          </ul>
        </Panel>
      </div>

      {/* Блок */}
      <Sheet open={!!sectionDraft} onOpenChange={(open) => !open && setSectionDraft(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{sectionDraft?.id ? "Блок страницы" : "Новый блок"}</SheetTitle>
            <SheetDescription>Тексты, списки, картинка и кнопки блока.</SheetDescription>
          </SheetHeader>
          {sectionDraft && (
            <div className="grid gap-4 p-4">
              <Field label="Ключ блока" hint="hero, advantages, symptoms, faq…">
                <Input
                  value={sectionDraft.key ?? ""}
                  onChange={(e) => setSectionDraft({ ...sectionDraft, key: e.target.value })}
                />
              </Field>
              <Field label="Заголовок">
                <Input
                  value={sectionDraft.title ?? ""}
                  onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                />
              </Field>
              <Field label="Подзаголовок">
                <Textarea
                  rows={2}
                  value={sectionDraft.subtitle ?? ""}
                  onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                />
              </Field>
              <Field label="Список пунктов" hint={LIST_HINT}>
                <Textarea
                  rows={8}
                  value={sectionDraft.body ?? ""}
                  onChange={(e) => setSectionDraft({ ...sectionDraft, body: e.target.value })}
                />
              </Field>
              <Field label="Кнопка — текст">
                <Input
                  value={sectionDraft.primary_label ?? ""}
                  onChange={(e) =>
                    setSectionDraft({ ...sectionDraft, primary_label: e.target.value })
                  }
                />
              </Field>
              <Field label="Кнопка — ссылка">
                <Input
                  value={sectionDraft.primary_url ?? ""}
                  onChange={(e) =>
                    setSectionDraft({ ...sectionDraft, primary_url: e.target.value })
                  }
                />
              </Field>
              <Field label="Изображение">
                <div className="flex items-center gap-3">
                  <Input
                    value={sectionDraft.image_url ?? ""}
                    onChange={(e) =>
                      setSectionDraft({ ...sectionDraft, image_url: e.target.value })
                    }
                  />
                  <input
                    ref={sectionFileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImage(file, "section");
                    }}
                  />
                  <Button
                    variant="outline"
                    className="border-admin-line shrink-0"
                    disabled={uploading}
                    onClick={() => sectionFileRef.current?.click()}
                  >
                    <Upload className="mr-1.5 size-4" /> Загрузить
                  </Button>
                </div>
              </Field>
              <div className="flex items-center gap-3">
                <Switch
                  checked={sectionDraft.is_active ?? true}
                  onCheckedChange={(is_active) => setSectionDraft({ ...sectionDraft, is_active })}
                />
                <span className="text-[14px]">Показывать на сайте</span>
              </div>
              <Button
                className="bg-admin-blue hover:bg-admin-blue/90 h-11 rounded-xl font-semibold text-white"
                disabled={saveSection.isPending}
                onClick={() => saveSection.mutate(sectionDraft)}
              >
                Сохранить блок
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Направление */}
      <Sheet open={!!directionDraft} onOpenChange={(open) => !open && setDirectionDraft(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {directionDraft?.id ? "Направление хирургии" : "Новое направление"}
            </SheetTitle>
            <SheetDescription>Карточка на странице и её подстраница.</SheetDescription>
          </SheetHeader>
          {directionDraft && (
            <div className="grid gap-4 p-4">
              <Field label="Название">
                <Input
                  value={directionDraft.title ?? ""}
                  onChange={(e) => setDirectionDraft({ ...directionDraft, title: e.target.value })}
                />
              </Field>
              <Field label="Адрес (slug)" hint="Например: obshchaya-hirurgiya">
                <Input
                  value={directionDraft.slug ?? ""}
                  onChange={(e) => setDirectionDraft({ ...directionDraft, slug: e.target.value })}
                />
              </Field>
              <Field label="Краткое описание">
                <Textarea
                  rows={2}
                  value={directionDraft.subtitle ?? ""}
                  onChange={(e) =>
                    setDirectionDraft({ ...directionDraft, subtitle: e.target.value })
                  }
                />
              </Field>
              <Field label="Иконка" hint="Имя иконки lucide: Stethoscope, Scissors, HeartPulse…">
                <Input
                  value={directionDraft.icon ?? ""}
                  onChange={(e) => setDirectionDraft({ ...directionDraft, icon: e.target.value })}
                />
              </Field>
              <Field label="Фото карточки">
                <div className="flex items-center gap-3">
                  <Input
                    value={directionDraft.image_url ?? ""}
                    onChange={(e) =>
                      setDirectionDraft({ ...directionDraft, image_url: e.target.value })
                    }
                  />
                  <input
                    ref={directionFileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImage(file, "direction");
                    }}
                  />
                  <Button
                    variant="outline"
                    className="border-admin-line shrink-0"
                    disabled={uploading}
                    onClick={() => directionFileRef.current?.click()}
                  >
                    <Upload className="mr-1.5 size-4" /> Загрузить
                  </Button>
                </div>
              </Field>
              <Field label="Заголовок блока «О направлении»">
                <Input
                  value={directionDraft.about_title ?? ""}
                  onChange={(e) =>
                    setDirectionDraft({ ...directionDraft, about_title: e.target.value })
                  }
                />
              </Field>
              <Field label="Текст «О направлении»">
                <Textarea
                  rows={5}
                  value={directionDraft.body ?? ""}
                  onChange={(e) => setDirectionDraft({ ...directionDraft, body: e.target.value })}
                />
              </Field>
              <Field label="Преимущества" hint={LIST_HINT}>
                <Textarea
                  rows={4}
                  value={directionDraft.advantages ?? ""}
                  onChange={(e) =>
                    setDirectionDraft({ ...directionDraft, advantages: e.target.value })
                  }
                />
              </Field>
              <Field label="Когда обратиться (симптомы)" hint={LIST_HINT}>
                <Textarea
                  rows={5}
                  value={directionDraft.symptoms ?? ""}
                  onChange={(e) =>
                    setDirectionDraft({ ...directionDraft, symptoms: e.target.value })
                  }
                />
              </Field>
              <Field label="Заболевания" hint={LIST_HINT}>
                <Textarea
                  rows={5}
                  value={directionDraft.diseases ?? ""}
                  onChange={(e) =>
                    setDirectionDraft({ ...directionDraft, diseases: e.target.value })
                  }
                />
              </Field>
              <Field label="Операции и процедуры" hint={LIST_HINT}>
                <Textarea
                  rows={5}
                  value={directionDraft.procedures ?? ""}
                  onChange={(e) =>
                    setDirectionDraft({ ...directionDraft, procedures: e.target.value })
                  }
                />
              </Field>
              <Field label="Диагностика перед операцией" hint={LIST_HINT}>
                <Textarea
                  rows={4}
                  value={directionDraft.diagnostics ?? ""}
                  onChange={(e) =>
                    setDirectionDraft({ ...directionDraft, diagnostics: e.target.value })
                  }
                />
              </Field>
              <Field label="Этапы лечения" hint={LIST_HINT}>
                <Textarea
                  rows={4}
                  value={directionDraft.steps ?? ""}
                  onChange={(e) => setDirectionDraft({ ...directionDraft, steps: e.target.value })}
                />
              </Field>
              <Field label="FAQ" hint="По строке: «Вопрос — ответ»">
                <Textarea
                  rows={5}
                  value={directionDraft.faq ?? ""}
                  onChange={(e) => setDirectionDraft({ ...directionDraft, faq: e.target.value })}
                />
              </Field>
              <Field
                label="Врачи направления"
                hint="Слаги врачей через запятую. Пусто — врачи подберутся автоматически."
              >
                <Textarea
                  rows={2}
                  value={directionDraft.doctor_slugs ?? ""}
                  onChange={(e) =>
                    setDirectionDraft({ ...directionDraft, doctor_slugs: e.target.value })
                  }
                />
              </Field>
              <Field label="SEO title">
                <Input
                  value={directionDraft.meta_title ?? ""}
                  onChange={(e) =>
                    setDirectionDraft({ ...directionDraft, meta_title: e.target.value })
                  }
                />
              </Field>
              <Field label="SEO description">
                <Textarea
                  rows={2}
                  value={directionDraft.meta_description ?? ""}
                  onChange={(e) =>
                    setDirectionDraft({ ...directionDraft, meta_description: e.target.value })
                  }
                />
              </Field>
              <div className="flex items-center gap-3">
                <Switch
                  checked={directionDraft.is_active ?? true}
                  onCheckedChange={(is_active) =>
                    setDirectionDraft({ ...directionDraft, is_active })
                  }
                />
                <span className="text-[14px]">Показывать на сайте</span>
              </div>
              <Button
                className="bg-admin-blue hover:bg-admin-blue/90 h-11 rounded-xl font-semibold text-white"
                disabled={saveDirection.isPending}
                onClick={() => saveDirection.mutate(directionDraft)}
              >
                Сохранить направление
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

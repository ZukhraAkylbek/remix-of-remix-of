import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchActivePopup, submitLead } from "@/lib/popups";

const schema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(100, "Слишком длинное имя"),
  phone: z
    .string()
    .trim()
    .min(6, "Укажите телефон")
    .max(40, "Слишком длинный номер")
    .regex(/^[0-9+()\-\s]+$/, "Телефон может содержать только цифры и символы + ( ) -"),
  comment: z.string().trim().max(1000, "Слишком длинный комментарий").optional(),
});

const SESSION_KEY = "avicenna.lead-popup.shown";

export function LeadPopup() {
  const { data: popup } = useQuery({
    queryKey: ["popup", "active"],
    queryFn: fetchActivePopup,
    staleTime: 5 * 60_000,
  });

  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!popup) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/admin")) return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;

    const delay = Math.max(0, popup.delay_seconds ?? 30) * 1000;
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [popup]);

  if (!popup || !open) return null;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = schema.safeParse({
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      comment: String(form.get("comment") ?? ""),
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        next[String(issue.path[0])] = issue.message;
      });
      setErrors(next);
      return;
    }

    setErrors({});
    setPending(true);
    try {
      await submitLead({
        ...parsed.data,
        source: window.location.pathname,
        popup_id: popup.id,
      });
      setSent(true);
    } catch {
      setErrors({ form: "Не удалось отправить заявку. Попробуйте ещё раз." });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={popup.title}
        className="bg-background relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
      >
        <button
          type="button"
          aria-label="Закрыть"
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground absolute top-3 right-3 z-10 rounded-full p-2"
        >
          <X className="size-5" />
        </button>

        {popup.image_url && (
          <img
            src={popup.image_url}
            alt=""
            loading="lazy"
            className="h-36 w-full object-cover sm:h-44"
          />
        )}

        <div className="p-6 sm:p-7">
          {sent ? (
            <div className="py-6 text-center">
              <h2 className="text-xl font-extrabold">
                {popup.success_text || "Спасибо! Мы свяжемся с вами."}
              </h2>
              <Button className="mt-5" onClick={() => setOpen(false)}>
                Закрыть
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-[22px] leading-tight font-extrabold">{popup.title}</h2>
              {popup.body && (
                <p className="text-muted-foreground mt-2 text-[14px] leading-relaxed">
                  {popup.body}
                </p>
              )}
              {popup.offer_note && (
                <p className="bg-brand-green/10 text-brand-green mt-4 rounded-xl px-4 py-3 text-[14px] font-semibold">
                  {popup.offer_note}
                </p>
              )}

              {popup.show_form ? (
                <form className="mt-5 space-y-3" onSubmit={onSubmit} noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="lead-name">Имя</Label>
                    <Input id="lead-name" name="name" maxLength={100} placeholder="Ваше имя" />
                    {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lead-phone">Телефон</Label>
                    <Input
                      id="lead-phone"
                      name="phone"
                      inputMode="tel"
                      maxLength={40}
                      placeholder="+996 700 000 000"
                    />
                    {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lead-comment">Комментарий</Label>
                    <Textarea
                      id="lead-comment"
                      name="comment"
                      rows={3}
                      maxLength={1000}
                      placeholder="К какому специалисту хотите записаться?"
                    />
                    {errors.comment && <p className="text-destructive text-xs">{errors.comment}</p>}
                  </div>
                  {errors.form && <p className="text-destructive text-sm">{errors.form}</p>}
                  <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? "Отправляем…" : popup.button_text || "Оставить заявку"}
                  </Button>
                </form>
              ) : (
                popup.button_url && (
                  <Button asChild className="mt-5 w-full">
                    <a href={popup.button_url}>{popup.button_text || "Подробнее"}</a>
                  </Button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

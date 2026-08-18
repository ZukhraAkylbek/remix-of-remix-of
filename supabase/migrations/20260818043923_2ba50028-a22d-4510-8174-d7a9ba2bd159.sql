ALTER TABLE public.popups
  ADD COLUMN IF NOT EXISTS delay_seconds integer NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS offer_note text,
  ADD COLUMN IF NOT EXISTS success_text text,
  ADD COLUMN IF NOT EXISTS show_form boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  comment text,
  source text,
  popup_id uuid REFERENCES public.popups(id) ON DELETE SET NULL,
  is_processed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (
  length(name) between 1 and 100 and length(phone) between 3 and 40 and (comment is null or length(comment) <= 1000)
);
DROP POLICY IF EXISTS "Admins can read leads" ON public.leads;
CREATE POLICY "Admins can read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.popups (title, body, offer_note, button_text, button_url, success_text, is_active, sort_order, delay_seconds)
SELECT 'Оставьте заявку — врач перезвонит',
       'Бесплатная консультация администратора: подберём специалиста и удобное время приёма.',
       'Скидка 15% на первичный приём при записи через сайт',
       'Отправить заявку', NULL,
       'Спасибо! Мы перезвоним вам в ближайшее время.',
       true, 1, 30
WHERE NOT EXISTS (SELECT 1 FROM public.popups);
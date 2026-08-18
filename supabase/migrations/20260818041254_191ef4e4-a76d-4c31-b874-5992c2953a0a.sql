
ALTER TABLE public.checkup_cards
  ADD COLUMN IF NOT EXISTS icon text,
  ADD COLUMN IF NOT EXISTS includes text,
  ADD COLUMN IF NOT EXISTS price_note text;

CREATE TABLE IF NOT EXISTS public.checkup_extras (
  id uuid primary key default gen_random_uuid(),
  group_key text not null,
  title text not null,
  price text,
  note text,
  icon text,
  sort_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT ON public.checkup_extras TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkup_extras TO authenticated;
GRANT ALL ON public.checkup_extras TO service_role;

ALTER TABLE public.checkup_extras ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active checkup extras" ON public.checkup_extras;
CREATE POLICY "Anyone can view active checkup extras" ON public.checkup_extras FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "Admins can view all checkup extras" ON public.checkup_extras;
CREATE POLICY "Admins can view all checkup extras" ON public.checkup_extras FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
DROP POLICY IF EXISTS "Admins can insert checkup extras" ON public.checkup_extras;
CREATE POLICY "Admins can insert checkup extras" ON public.checkup_extras FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update checkup extras" ON public.checkup_extras;
CREATE POLICY "Admins can update checkup extras" ON public.checkup_extras FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete checkup extras" ON public.checkup_extras;
CREATE POLICY "Admins can delete checkup extras" ON public.checkup_extras FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'::app_role));

DROP TRIGGER IF EXISTS checkup_extras_set_updated_at ON public.checkup_extras;
CREATE TRIGGER checkup_extras_set_updated_at BEFORE UPDATE ON public.checkup_extras FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DELETE FROM public.checkup_extras;
INSERT INTO public.checkup_extras (group_key, title, price, note, icon, sort_order) VALUES
('base','Базовый чекап','17 000 сом','Общий анализ крови
Общий анализ мочи
Биохимический анализ крови
Консультация терапевта','clipboard',1),
('addon','Здоровые лёгкие','+1 300 сом',null,'lungs',1),
('addon','Здоровый желудок','+8 400 сом',null,'stomach',2),
('addon','Здоровое сердце','+5 800 сом',null,'heart',3),
('addon','Лишний вес','+5 000 сом',null,'weight',4),
('addon','Спортивный','+4 800 сом',null,'activity',5),
('addon','Щитовидная железа','+5 300 сом',null,'thyroid',6),
('female','Женское здоровье +50','25 500 сом',null,null,1),
('female','Восстановление после родов','8 400 сом',null,null,2),
('female','Хочу стать мамой!','20 300 сом',null,null,3),
('female','Выхожу замуж','4 200 сом',null,null,4),
('female','Замужем','7 200 сом',null,null,5),
('male','Мужское здоровье до 50','4 600 сом',null,null,1),
('male','Мужское здоровье +50','22 200 сом',null,null,2),
('male','Хочу стать папой!','10 500 сом',null,null,3),
('male','Женюсь','13 800 сом',null,null,4),
('lab','Энергия — витамины и микроэлементы','4 600 сом',null,'energy',1),
('lab','Гельминты','1 850 сом',null,'worm',2),
('lab','Диабетический','2 900 сом',null,'diabetes',3),
('lab','Онкомаркеры для женщин','5 400 сом',null,'female',4),
('lab','Онкомаркеры для мужчин','4 700 сом',null,'male',5),
('benefit','Качественная диагностика',null,'на современном оборудовании','shield',1),
('benefit','Опытные врачи',null,'и индивидуальный подход','users',2),
('benefit','Результаты быстро',null,'и удобно','clock',3);

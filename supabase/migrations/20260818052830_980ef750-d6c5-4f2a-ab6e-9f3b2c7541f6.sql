CREATE TABLE public.service_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  icon text,
  image_url text,
  meta_title text,
  meta_description text,
  sort_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.service_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.service_pages(id) ON DELETE CASCADE,
  key text NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text,
  body text,
  image_url text,
  primary_label text,
  primary_url text,
  secondary_label text,
  secondary_url text,
  sort_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX service_blocks_service_idx ON public.service_blocks(service_id, sort_order);

GRANT SELECT ON public.service_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_pages TO authenticated;
GRANT ALL ON public.service_pages TO service_role;
GRANT SELECT ON public.service_blocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_blocks TO authenticated;
GRANT ALL ON public.service_blocks TO service_role;

ALTER TABLE public.service_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_pages public read" ON public.service_pages FOR SELECT USING (true);
CREATE POLICY "service_pages admin write" ON public.service_pages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "service_blocks public read" ON public.service_blocks FOR SELECT USING (true);
CREATE POLICY "service_blocks admin write" ON public.service_blocks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER service_pages_updated_at BEFORE UPDATE ON public.service_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_blocks_updated_at BEFORE UPDATE ON public.service_blocks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.service_pages (slug, title, summary, icon, sort_order) VALUES
  ('diagnostika', 'Диагностика', 'УЗИ, КТ, МРТ, рентген, эндоскопия и функциональная диагностика в одном центре.', 'Microscope', 10),
  ('konsultacii-specialistov', 'Консультации специалистов', 'Приём врачей 20+ направлений: терапия, кардиология, неврология, гинекология и другие.', 'Stethoscope', 20),
  ('hirurgicheskoe-lechenie', 'Хирургическое лечение', 'Плановые и экстренные операции, малоинвазивные методики, собственный стационар.', 'Scissors', 30),
  ('analizy', 'Анализы', 'Собственная лаборатория: кровь, гормоны, инфекции, гистология. Результаты онлайн.', 'FlaskConical', 40),
  ('uslugi-stacionara', 'Услуги стационара', 'Комфортные палаты, круглосуточное наблюдение, реанимация и послеоперационный уход.', 'BedDouble', 50),
  ('uslugi-na-domu', 'Услуги на дому', 'Забор анализов, капельницы, инъекции, перевязки и уход у вас дома.', 'Home', 60),
  ('vyzov-vracha-na-dom', 'Вызов врача на дом', 'Терапевт и педиатр приедут к вам в день обращения, включая выходные.', 'Ambulance', 70),
  ('dnevnoy-stacionar', 'Дневные стационары', 'Курс лечения и капельницы днём — без отрыва от работы и семьи.', 'Clock', 80),
  ('onlayn-konsultacii', 'Онлайн-консультации врачей', 'Видеоприём специалиста, расшифровка анализов и второе мнение дистанционно.', 'Video', 90),
  ('travmpunkt-24-7', 'Травмпункт 24/7', 'Круглосуточная травматологическая помощь: раны, переломы, вывихи, ожоги.', 'Ambulance', 100),
  ('vedenie-beremennosti', 'Ведение беременности', 'Программы ведения беременности с УЗИ, скринингами и наблюдением акушера-гинеколога.', 'Baby', 110),
  ('vakcinaciya', 'Вакцинация', 'Прививки детям и взрослым сертифицированными вакцинами по календарю и по показаниям.', 'Syringe', 120),
  ('dlt', 'ДЛТ (дистанционная литотрипсия)', 'Дробление камней почек и мочеточника без разрезов и длительной госпитализации.', 'Waves', 130),
  ('fizioterapiya', 'Физиотерапия', 'Восстановление после травм и операций: электролечение, магнит, лазер, массаж, ЛФК.', 'HeartPulse', 140),
  ('somnografiya', 'Сомнография', 'Исследование сна: диагностика апноэ, храпа и нарушений ночного дыхания.', 'Moon', 150),
  ('korporativnym-klientam', 'Для корпоративных клиентов', 'Медосмотры, чекапы и обслуживание сотрудников по договору с компанией.', 'Building2', 160),
  ('inogorodnim-pacientam', 'Для иногородних пациентов', 'Помощь с размещением, диагностика и лечение за один приезд, сопровождение координатора.', 'MapPin', 170),
  ('rassrochka', 'Рассрочка', 'Лечение и операции в рассрочку — удобные платежи без переплат.', 'CreditCard', 180);

INSERT INTO public.service_blocks (service_id, key, title, subtitle, body, primary_label, primary_url, secondary_label, secondary_url, sort_order)
SELECT s.id, b.key,
  replace(b.title, '{{title}}', s.title),
  CASE WHEN b.key = 'hero' THEN s.summary ELSE b.subtitle END,
  b.body, b.primary_label, b.primary_url, b.secondary_label, b.secondary_url, b.sort_order
FROM public.service_pages s
CROSS JOIN (VALUES
  ('hero', '{{title}} в клинике «Авиценна»', NULL::text,
   'Опытные врачи — приём в день обращения
Современное оборудование экспертного класса
Единый центр: диагностика, лечение и наблюдение
Прозрачные цены и рассрочка', 'Записаться', '/#zapis', 'Позвонить', 'tel:+996312123456', 10),
  ('when', 'Когда обращаться',
   'Показания и симптомы, при которых стоит записаться',
   'Есть жалобы или боль — не откладывайте визит
Нужен контроль после лечения или операции
Требуется заключение для работы, спорта или учёбы
Врач направил на дообследование', NULL, NULL, NULL, NULL, 20),
  ('available', 'Что доступно',
   'Услуги и процедуры направления',
   'Консультация профильного специалиста
Лабораторные и инструментальные исследования
Лечебные процедуры и манипуляции
Оформление документов и заключений', NULL, NULL, NULL, NULL, 30),
  ('important', 'Важно знать',
   'Ограничения и подготовка',
   'Часть исследований выполняется натощак
Возьмите с собой предыдущие результаты и выписки
Есть противопоказания — уточните у врача
Детям до 16 лет нужен сопровождающий взрослый', NULL, NULL, NULL, NULL, 40),
  ('why', 'Почему «Авиценна»', NULL,
   'Врачи высшей категории — стаж от 10 лет
Оборудование экспертного класса
Полный цикл: от анализов до операции и реабилитации
Два филиала в Бишкеке и круглосуточная помощь', NULL, NULL, NULL, NULL, 50),
  ('doctors', 'Врачи направления',
   'Специалисты, которые ведут приём',
   NULL, NULL, NULL, NULL, NULL, 60),
  ('contacts', 'Адрес и режим работы', NULL,
   'Бишкек, ул. Жукеева-Пудовкина, 124 — ежедневно 08:00–20:00
Травмпункт и стационар — круглосуточно, 24/7
Запись по телефону +996 (312) 123-456', 'Построить маршрут', '/#kontakty', NULL, NULL, 70),
  ('faq', 'Частые вопросы', NULL,
   'Нужна ли предварительная запись? — Да, так вы попадёте к врачу без ожидания. Экстренная помощь оказывается без записи.
Можно ли прийти с результатами других клиник? — Да, возьмите их с собой — врач учтёт данные.
Есть ли рассрочка? — Да, доступна рассрочка на лечение и операции.
Работаете ли вы в выходные? — Да, клиника принимает ежедневно, травмпункт — круглосуточно.', NULL, NULL, NULL, NULL, 80),
  ('final', 'Запишитесь на приём',
   'Подберём удобное время и подскажем, как подготовиться',
   NULL, 'Записаться онлайн', '/#zapis', 'Позвонить', 'tel:+996312123456', 90)
) AS b(key, title, subtitle, body, primary_label, primary_url, secondary_label, secondary_url, sort_order);
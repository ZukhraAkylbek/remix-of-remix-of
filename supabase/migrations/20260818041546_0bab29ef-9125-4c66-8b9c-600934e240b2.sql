
UPDATE public.checkup_sections SET title='Медицинские чекап-программы',
  subtitle='Комплексные программы обследования для оценки здоровья и раннего выявления рисков',
  body='1–2 визита в клинику
Точная диагностика и рекомендации
Экономия времени и выгодные цены'
WHERE key='hero';

UPDATE public.checkup_sections SET title='Готовые программы' WHERE key='flagship';

INSERT INTO public.checkup_sections (key, title, subtitle, sort_order, is_active)
SELECT v.key, v.title, v.subtitle, v.sort_order, true
FROM (VALUES
  ('constructor','Соберите свой чекап','Выберите дополнительные пакеты к базовому чекапу и получите программу, которая подходит именно вам',3),
  ('female','Женское здоровье',null,4),
  ('male','Мужское здоровье',null,5),
  ('lab','Лабораторные пакеты',null,6)
) AS v(key,title,subtitle,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.checkup_sections s WHERE s.key = v.key);

UPDATE public.checkup_cards SET icon='male', includes='Общий и биохимический анализ крови
УЗИ органов брюшной полости
ЭКГ и консультация кардиолога
Консультация уролога' WHERE slug='muzhskoy-chekap';
UPDATE public.checkup_cards SET icon='female', includes='Общий и биохимический анализ крови
УЗИ малого таза и молочных желёз
Гормональный профиль
Консультация гинеколога' WHERE slug='zhenskiy-chekap';
UPDATE public.checkup_cards SET icon='kids', includes='Общий анализ крови и мочи
УЗИ органов брюшной полости
Консультация педиатра' WHERE slug='detskiy-chekap';
UPDATE public.checkup_cards SET icon='diabetes', includes='Глюкоза и гликированный гемоглобин
Липидный профиль
Консультация эндокринолога' WHERE slug='chekap-diabet';
UPDATE public.checkup_cards SET icon='heart', includes='ЭКГ и ЭхоКГ
Липидный профиль
Консультация кардиолога' WHERE slug='chekap-serdce';
UPDATE public.checkup_cards SET icon='clipboard', includes='Общий анализ крови
Общий анализ мочи
Биохимический анализ крови
Консультация терапевта' WHERE slug='chekap-bazovyy';

update public.pages
set blocks = (
  select jsonb_agg(x order by ord)
  from (
    select b as x, o::numeric as ord
      from jsonb_array_elements(blocks::jsonb) with ordinality t(b, o)
     where b->>'id' <> 'about-timeline'
    union all
    select '{
      "id": "about-timeline",
      "type": "timeline",
      "title": "История клиники",
      "items": [
        {"id": "tl-1", "title": "2015", "text": "Открыт первый филиал «Авиценна» в Бишкеке — приём терапевта и базовая диагностика."},
        {"id": "tl-2", "title": "2018", "text": "Запущено собственное отделение лабораторной и ультразвуковой диагностики."},
        {"id": "tl-3", "title": "2021", "text": "Открыт хирургический стационар и круглосуточный травмпункт."},
        {"id": "tl-4", "title": "2024", "text": "Сеть выросла до нескольких филиалов, добавлены программы чекапов для всей семьи."}
      ]
    }'::jsonb, 2.5::numeric
  ) s
)
where slug = 'about';
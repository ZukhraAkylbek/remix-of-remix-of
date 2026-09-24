// Данные врачей с avicenna.kg/doctors
export type ClinicDoctor = { slug: string; name: string; specialty: string; experience: number | null; price: string | null; photo: string | null; branch: string; category: string };

export const DOCTOR_CATEGORIES: { slug: string; name: string }[] = [
  {
    "slug": "uzi",
    "name": "УЗИ и функциональная диагностика"
  },
  {
    "slug": "onkologiya",
    "name": "Онкология и маммология"
  },
  {
    "slug": "rentgen",
    "name": "Рентген и радиология"
  },
  {
    "slug": "endoskopiya",
    "name": "Эндоскопия"
  },
  {
    "slug": "ginekologiya",
    "name": "Гинекология"
  },
  {
    "slug": "urologiya",
    "name": "Урология"
  },
  {
    "slug": "travmatologiya",
    "name": "Травматология и ортопедия"
  },
  {
    "slug": "hirurgiya",
    "name": "Хирургия"
  },
  {
    "slug": "nevrologiya",
    "name": "Неврология"
  },
  {
    "slug": "pediatriya",
    "name": "Педиатрия"
  },
  {
    "slug": "terapiya",
    "name": "Терапия и семейная медицина"
  },
  {
    "slug": "uzkie",
    "name": "Узкие специалисты"
  }
];

export const CLINIC_DOCTORS: ClinicDoctor[] = [
  {
    "slug": "alaychiev-nursultan-abdyzhaparovich",
    "name": "Алайчиев Нурсултан Абдыжапарович",
    "specialty": "хирург-маммолог",
    "experience": 7,
    "price": "1800 сом",
    "photo": null,
    "branch": "Бакаева 106",
    "category": "onkologiya"
  },
  {
    "slug": "gorodovskiy-evgeniy-vladimirovich",
    "name": "Городовский Евгений Владимирович",
    "specialty": "Невропатолог, Терапевт",
    "experience": 16,
    "price": "1800 сом",
    "photo": null,
    "branch": "Бакаева 106",
    "category": "nevrologiya"
  },
  {
    "slug": "abdullaeva-nargiza-mukaevna",
    "name": "Абдуллаева Наргиза Мукаевна",
    "specialty": "ЭХО специалист",
    "experience": 2,
    "price": "1800 сом",
    "photo": "/doctors/abdullaeva-nargiza-mukaevna.jpg",
    "branch": "Бакаева 106",
    "category": "uzi"
  },
  {
    "slug": "vindiza-farhad-ruslanovich",
    "name": "Виндиза Фархад Русланович",
    "specialty": "Онколог",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/vindiza-farhad-ruslanovich.jpg",
    "branch": "Бакаева 106",
    "category": "onkologiya"
  },
  {
    "slug": "matkalykov-muhamedali-mederbekovich",
    "name": "Маткалыков Мухамедали Медербекович",
    "specialty": "Онколог-хирург, гинеколог",
    "experience": 7,
    "price": "1800 сом",
    "photo": "/doctors/matkalykov-muhamedali-mederbekovich.jpg",
    "branch": "Бакаева 106",
    "category": "onkologiya"
  },
  {
    "slug": "kubatbekov-rustam-kubatbekovich",
    "name": "Кубатбеков Рустам Кубатбекович",
    "specialty": "Онколог-хирург",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/kubatbekov-rustam-kubatbekovich.jpg",
    "branch": "Бакаева 106",
    "category": "onkologiya"
  },
  {
    "slug": "musakeev-shayloobek-mametosmonovich",
    "name": "Мусакеев Шайлообек Маметосмонович",
    "specialty": "Уролог-хирург",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/musakeev-shayloobek-mametosmonovich.jpg",
    "branch": "Бакаева 106",
    "category": "urologiya"
  },
  {
    "slug": "zhumakadyrova-ayzhamal-zhumakadyrovna",
    "name": "Жумакадырова Айжамал Жумакадыровна",
    "specialty": "УЗИ",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/zhumakadyrova-ayzhamal-zhumakadyrovna.jpg",
    "branch": "Бакаева 106",
    "category": "uzi"
  },
  {
    "slug": "nazhimidinov-miradil-daniyarovich",
    "name": "Нажимидинов Мирадил Даниярович",
    "specialty": "Врач УЗИ",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/nazhimidinov-miradil-daniyarovich.jpg",
    "branch": "Бакаева 106",
    "category": "uzi"
  },
  {
    "slug": "abdyrauf-kyzy-bubuaysha",
    "name": "Абдырауф кызы Бубуайша",
    "specialty": "Проктолог",
    "experience": 3,
    "price": "1800 сом",
    "photo": "/doctors/abdyrauf-kyzy-bubuaysha.jpg",
    "branch": "Бакаева 106",
    "category": "hirurgiya"
  },
  {
    "slug": "safarbaev-dilmurat-bahtiyarovich",
    "name": "Сафарбаев Дилмурат Бахтиярович",
    "specialty": "ЛОР",
    "experience": 6,
    "price": "1800 сом",
    "photo": "/doctors/safarbaev-dilmurat-bahtiyarovich.jpg",
    "branch": "Бакаева 106",
    "category": "uzkie"
  },
  {
    "slug": "busurmankulov-muslim-bakytovich",
    "name": "Бусурманкулов Муслим Бакытович",
    "specialty": "Эндоскопист",
    "experience": 8,
    "price": "1800 сом",
    "photo": "/doctors/busurmankulov-muslim-bakytovich.jpg",
    "branch": "Бакаева 106",
    "category": "endoskopiya"
  },
  {
    "slug": "ernazarov-ermek-esenbaevich",
    "name": "Эрназаров Эрмек Эсенбаевич",
    "specialty": "Врач-хирург, КМН",
    "experience": 13,
    "price": "1800 сом",
    "photo": "/doctors/ernazarov-ermek-esenbaevich.jpg",
    "branch": "Бакаева 106",
    "category": "hirurgiya"
  },
  {
    "slug": "toktonaliev-amantur-bolotbekovich",
    "name": "Токтоналиев Амантур Болотбекович",
    "specialty": "Уролог-хирург",
    "experience": 9,
    "price": "1800 сом",
    "photo": "/doctors/toktonaliev-amantur-bolotbekovich.jpg",
    "branch": "Бакаева 106",
    "category": "urologiya"
  },
  {
    "slug": "baygaraeva-zazhira-asylbekovna",
    "name": "Байгараева Зажира Асылбековна",
    "specialty": "Физиотерапевт",
    "experience": 43,
    "price": "1800 сом",
    "photo": "/doctors/baygaraeva-zazhira-asylbekovna.jpg",
    "branch": "Джунусалиева 83",
    "category": "uzkie"
  },
  {
    "slug": "zhunusov-daniyar",
    "name": "Жунусов Данияр",
    "specialty": "Семейный врач",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/zhunusov-daniyar.jpg",
    "branch": "Джунусалиева 83",
    "category": "terapiya"
  },
  {
    "slug": "argynova-aynura-osmonalievna",
    "name": "Аргынова Айнура Осмоналиевна",
    "specialty": "Врач УЗИ",
    "experience": 24,
    "price": "1800 сом",
    "photo": "/doctors/argynova-aynura-osmonalievna.jpg",
    "branch": "Джунусалиева 83",
    "category": "uzi"
  },
  {
    "slug": "abdyshev-askar-sharshenbekovich",
    "name": "Абдышев Аскар Шаршенбекович",
    "specialty": "Онколог",
    "experience": 30,
    "price": "1800 сом",
    "photo": "/doctors/abdyshev-askar-sharshenbekovich.jpg",
    "branch": "Джунусалиева 83",
    "category": "onkologiya"
  },
  {
    "slug": "tashtemirova-elnura-salizhanovna",
    "name": "Таштемирова Эльнура Салижановна",
    "specialty": "Врач гинеколог",
    "experience": 12,
    "price": "1800 сом",
    "photo": "/doctors/tashtemirova-elnura-salizhanovna.jpg",
    "branch": "Джунусалиева 83",
    "category": "ginekologiya"
  },
  {
    "slug": "kadyrakunov-nurlan-erkinbekovich",
    "name": "Кадыракунов Нурлан Эркинбекович",
    "specialty": "Врач УЗИ",
    "experience": 9,
    "price": "1800 сом",
    "photo": "/doctors/kadyrakunov-nurlan-erkinbekovich.jpg",
    "branch": "Джунусалиева 83",
    "category": "uzi"
  },
  {
    "slug": "abdykerimov-chyngyz-dzhanybekovich",
    "name": "Абдыкеримов Чынгыз Джаныбекович",
    "specialty": "Рентгенолог, врач 2-й категории",
    "experience": 7,
    "price": "1800 сом",
    "photo": "/doctors/abdykerimov-chyngyz-dzhanybekovich.jpg",
    "branch": "Джунусалиева 83",
    "category": "rentgen"
  },
  {
    "slug": "kurmanalieva-bakyt-nurkerimovna",
    "name": "Курманалиева Бакыт Нуркеримовна",
    "specialty": "Дерматовенеролог",
    "experience": 30,
    "price": "1800 сом",
    "photo": "/doctors/kurmanalieva-bakyt-nurkerimovna.jpg",
    "branch": "Джунусалиева 83",
    "category": "uzkie"
  },
  {
    "slug": "arstanbekova-aida-arstanbekovna",
    "name": "Арстанбекова Аида Арстанбековна",
    "specialty": "Гинеколог — эндокринолог",
    "experience": 11,
    "price": "1800 сом",
    "photo": "/doctors/arstanbekova-aida-arstanbekovna.jpg",
    "branch": "Джунусалиева 83",
    "category": "ginekologiya"
  },
  {
    "slug": "mametazim-uulu-mametnazar",
    "name": "Маметазим уулу Маметназар",
    "specialty": "Главный врач, терапевт",
    "experience": 10,
    "price": "1800 сом",
    "photo": "/doctors/mametazim-uulu-mametnazar.jpg",
    "branch": "Джунусалиева 83",
    "category": "terapiya"
  },
  {
    "slug": "urmatova-shirin-urmatovna",
    "name": "Урматова Ширин Урматовна",
    "specialty": "Врач педиатр",
    "experience": 2,
    "price": "1800 сом",
    "photo": null,
    "branch": "Жукеева-Пудовкина 124",
    "category": "pediatriya"
  },
  {
    "slug": "temirbaeva-kanyshay-boronbaevna",
    "name": "Темирбаева Канышай Боронбаевна",
    "specialty": "Гематолог",
    "experience": 24,
    "price": "1800 сом",
    "photo": "/doctors/temirbaeva-kanyshay-boronbaevna.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "uzkie"
  },
  {
    "slug": "kerimkulova-ayzada",
    "name": "Керимкулова Айзада",
    "specialty": "Узист, онко-маммолог",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/kerimkulova-ayzada.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "uzi"
  },
  {
    "slug": "suyumbaev-erbol-suyumbaevich",
    "name": "Суюмбаев Эрбол Суюмбаевич",
    "specialty": "УЗД (ЭХО КГ)",
    "experience": 2,
    "price": "1800 сом",
    "photo": "/doctors/suyumbaev-erbol-suyumbaevich.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "uzi"
  },
  {
    "slug": "bakashev-sanzhar-temirbekovich",
    "name": "Бакашев Санжар Темирбекович",
    "specialty": "Ортопед-травматолог",
    "experience": 4,
    "price": "1800 сом",
    "photo": "/doctors/bakashev-sanzhar-temirbekovich.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "travmatologiya"
  },
  {
    "slug": "ismanaliev-elaman-ismanalievich",
    "name": "Исманалиев Эламан Исманалиевич",
    "specialty": "Ортопед-травматолог",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/ismanaliev-elaman-ismanalievich.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "travmatologiya"
  },
  {
    "slug": "madyshov-adilet-taalaybekovich",
    "name": "Мадышов Адилет Таалайбекович",
    "specialty": "Ортопед-травматолог",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/madyshov-adilet-taalaybekovich.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "travmatologiya"
  },
  {
    "slug": "tursunbaeva-mira-sabirbekovna",
    "name": "Турсунбаева Мира Сабирбековна",
    "specialty": "Врач",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/tursunbaeva-mira-sabirbekovna.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "uzkie"
  },
  {
    "slug": "nusubalieva-anara-turarovna",
    "name": "Нусубалиева Анара Тураровна",
    "specialty": "Терапевт",
    "experience": 40,
    "price": "1800 сом",
    "photo": "/doctors/nusubalieva-anara-turarovna.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "terapiya"
  },
  {
    "slug": "kulikova-anna-aleksandrovna",
    "name": "Куликова Анна Александровна",
    "specialty": "Расшифровка рентгеновских снимков",
    "experience": 3,
    "price": "1800 сом",
    "photo": "/doctors/kulikova-anna-aleksandrovna.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "rentgen"
  },
  {
    "slug": "oskonbaev-beki-musaevich",
    "name": "Осконбаев Беки Мусаевич",
    "specialty": "Врач-радиолог",
    "experience": 3,
    "price": "1800",
    "photo": "/doctors/oskonbaev-beki-musaevich.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "rentgen"
  },
  {
    "slug": "doolotova-tattybubu-zholomanovna",
    "name": "Доолотова Таттыбубу Жоломановна",
    "specialty": "Пульмонолог, КМН",
    "experience": 41,
    "price": "1800 сом",
    "photo": "/doctors/doolotova-tattybubu-zholomanovna.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "uzkie"
  },
  {
    "slug": "dzhunusheva-chinara-ilebakunovna",
    "name": "Джунушева Чинара Илебакуновна",
    "specialty": "Врач УЗИ, высшей категории, КМН",
    "experience": 40,
    "price": "1800 сом",
    "photo": "/doctors/dzhunusheva-chinara-ilebakunovna.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "uzi"
  },
  {
    "slug": "tyutin-daniil-aleksandrovich",
    "name": "Тютин Даниил Александрович",
    "specialty": "Рентген — оператор",
    "experience": 2,
    "price": "1800 сом",
    "photo": "/doctors/tyutin-daniil-aleksandrovich.jpg",
    "branch": "Жукеева-Пудовкина 124",
    "category": "rentgen"
  },
  {
    "slug": "azhikeev-muratbek-ibraimovich",
    "name": "Ажикеев Муратбек Ибраимович",
    "specialty": "Врач УЗИ",
    "experience": null,
    "price": "1800 сом",
    "photo": "/doctors/azhikeev-muratbek-ibraimovich.jpg",
    "branch": "Московская 136",
    "category": "uzi"
  }
];

export function findDoctor(slug: string) {
  return CLINIC_DOCTORS.find((d) => d.slug === slug);
}

export function categoryName(slug: string) {
  return DOCTOR_CATEGORIES.find((c) => c.slug === slug)?.name ?? "Врачи";
}

export function experienceLabel(years: number) {
  const m10 = years % 10, m100 = years % 100;
  const w = m10 === 1 && m100 !== 11 ? "год" : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? "года" : "лет";
  return `${years} ${w}`;
}

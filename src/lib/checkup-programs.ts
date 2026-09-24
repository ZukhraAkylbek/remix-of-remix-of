export type PersonalCheckupOption = {
  id: string;
  title: string;
  price: number;
  audience: "female" | "male" | "common";
  icon: string;
};

export const PERSONAL_BASE_PACKAGE = {
  title: "Основной пакет",
  description: "Базовая программа комплексной проверки здоровья",
  price: 15_000,
};

export const PERSONAL_CHECKUP_OPTIONS: PersonalCheckupOption[] = [
  { id: "diabetes", title: "Диабетический", price: 2_900, audience: "common", icon: "diabetes" },
  { id: "helminths", title: "Гельминты", price: 1_850, audience: "common", icon: "worm" },
  { id: "energy", title: "Энергия (витамины)", price: 4_600, audience: "common", icon: "energy" },
  { id: "female-onco", title: "Онкомаркеры для женщин", price: 5_400, audience: "female", icon: "female" },
  { id: "male-onco", title: "Онкомаркеры для мужчин", price: 4_700, audience: "male", icon: "male" },
  { id: "lungs", title: "Здоровые лёгкие", price: 1_300, audience: "common", icon: "lungs" },
  { id: "stomach", title: "Здоровый желудок", price: 8_400, audience: "common", icon: "stomach" },
  { id: "heart", title: "Здоровое сердце", price: 5_800, audience: "common", icon: "heart" },
  { id: "weight", title: "Лишний вес", price: 5_000, audience: "common", icon: "weight" },
  { id: "endocrine", title: "Эндокринологический", price: 5_300, audience: "common", icon: "thyroid" },
  { id: "proctology", title: "Проктологический", price: 5_000, audience: "common", icon: "clipboard" },
  { id: "sport", title: "Спортивный", price: 4_800, audience: "common", icon: "activity" },
];

export function formatSom(value: number) {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} сом`;
}
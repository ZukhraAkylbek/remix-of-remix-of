import urolog from "@/assets/chat/spec-urolog.webp";
import gastro from "@/assets/chat/spec-gastro.webp";
import kardio from "@/assets/chat/spec-kardio.webp";
import nevro from "@/assets/chat/spec-nevro.webp";
import gineko from "@/assets/chat/spec-gineko.webp";
import travma from "@/assets/chat/spec-travma.webp";
import hirurg from "@/assets/chat/spec-hirurg.webp";
import endokrin from "@/assets/chat/spec-endokrin.webp";
import pediatr from "@/assets/chat/spec-pediatr.webp";

/** Иллюстрации направлений клиники по slug. */
const IMAGES: Record<string, string> = {
  urolog: urolog,
  gastroenterolog: gastro,
  kardiolog: kardio,
  nevrolog: nevro,
  ginekolog: gineko,
  travmatolog: travma,
  hirurg: hirurg,
  endokrinolog: endokrin,
  pediatr: pediatr,
};

const FALLBACKS = [kardio, nevro, gastro, travma];

export function specialtyImage(slug: string, index = 0): string {
  return IMAGES[slug] ?? FALLBACKS[index % FALLBACKS.length] ?? kardio;
}

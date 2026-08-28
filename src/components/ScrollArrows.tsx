import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Единые круглые переключатели прокрутки: белый круг,
 * зелёная обводка и зелёный шеврон (как в шапке/направлениях).
 */
const BTN =
  "flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-green bg-brand-white text-brand-green shadow-md transition-all duration-200 hover:bg-brand-green hover:text-brand-white active:scale-95";

export function ScrollArrow({
  dir,
  label,
  onClick,
  className,
}: {
  dir: -1 | 1;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  const Icon = dir === -1 ? ChevronLeft : ChevronRight;
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cn(BTN, className)}>
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}

/** Пара стрелок, повисающая по краям прокручиваемой области. */
export function ScrollArrowPair({
  onScroll,
  label,
  className,
}: {
  onScroll: (dir: -1 | 1) => void;
  label: string;
  className?: string;
}) {
  return (
    <>
      <ScrollArrow
        dir={-1}
        label={`${label} влево`}
        onClick={() => onScroll(-1)}
        className={cn("absolute top-1/2 left-1 z-10 -translate-y-1/2", className)}
      />
      <ScrollArrow
        dir={1}
        label={`${label} вправо`}
        onClick={() => onScroll(1)}
        className={cn("absolute top-1/2 right-1 z-10 -translate-y-1/2", className)}
      />
    </>
  );
}

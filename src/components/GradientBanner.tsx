import { cn } from "@/lib/utils";

type GradientBannerProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Фирменный баннер/оффер: зелёный градиент, мягкое свечение и белая типографика.
 */
export function GradientBanner({
  eyebrow,
  title,
  text,
  className,
  children,
}: GradientBannerProps) {
  return (
    <div className={cn("banner-brand relative overflow-hidden rounded-3xl p-8 sm:p-12", className)}>
      <span
        aria-hidden="true"
        className="banner-glow pointer-events-none absolute -top-16 -right-16 size-72 rounded-full sm:size-96"
      />
      <div className="relative max-w-2xl">
        {eyebrow && (
          <p className="text-brand-white/90 text-[12px] font-bold tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="text-brand-white mt-4 text-3xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h2>
        {text && (
          <p className="text-brand-white/85 mt-5 text-[16px] leading-relaxed sm:text-[18px]">
            {text}
          </p>
        )}
        {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
      </div>
    </div>
  );
}
